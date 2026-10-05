import { createHash, randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { embedTexts, isEmbeddingConfigured } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/knowledge/chunk";
import {
  getHiveOrganisationId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

export const runtime = "nodejs";

const TEXT_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
]);

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "document";
}

async function embedInBatches(contents: string[], batchSize = 32) {
  const vectors: number[][] = [];
  for (let index = 0; index < contents.length; index += batchSize) {
    vectors.push(...(await embedTexts(contents.slice(index, index + batchSize))));
  }
  return vectors;
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ configured: false, documents: [] });
    }

    const supabase = getSupabaseAdmin();
    const organisationId = getHiveOrganisationId();
    const { data, error } = await supabase
      .from("knowledge_documents")
      .select("id,title,source_filename,mime_type,status,metadata,created_at,updated_at")
      .eq("organization_id", organisationId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);
    return NextResponse.json({ configured: true, documents: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load documents.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase RAG is not configured for this deployment." },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const fileValue = form.get("file");
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;
    const pastedText = String(form.get("text") || "").trim();
    const requestedTitle = String(form.get("title") || "").trim();

    if (!file && !pastedText) {
      return NextResponse.json(
        { error: "Upload a document or paste document text." },
        { status: 400 }
      );
    }

    if (file && file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds the 25 MB limit." }, { status: 413 });
    }

    const organisationId = getHiveOrganisationId();
    const supabase = getSupabaseAdmin();
    const documentId = randomUUID();
    const filename = file ? safeFilename(file.name) : "pasted-policy.txt";
    const mimeType = file?.type || "text/plain";
    const title =
      requestedTitle ||
      (file ? file.name.replace(/\.[^.]+$/, "") : "Untitled clinical policy");
    const storagePath = file
      ? `${organisationId}/${documentId}/${filename}`
      : null;

    let extractedText = pastedText;

    let checksum: string | null = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      checksum = createHash("sha256").update(buffer).digest("hex");

      const { error: uploadError } = await supabase.storage
        .from("hive-knowledge")
        .upload(storagePath!, buffer, {
          contentType: mimeType || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      if (!extractedText && TEXT_MIME_TYPES.has(mimeType)) {
        extractedText = buffer.toString("utf8").trim();
      }
    }

    if (extractedText.length > 2_000_000) {
      return NextResponse.json(
        { error: "Extracted text exceeds the current 2,000,000 character ingestion limit." },
        { status: 413 }
      );
    }

    const canIndex = Boolean(extractedText) && isEmbeddingConfigured();
    const initialStatus = !extractedText
      ? "needs_extraction"
      : canIndex
        ? "processing"
        : "uploaded";

    const { error: insertError } = await supabase.from("knowledge_documents").insert({
      id: documentId,
      organization_id: organisationId,
      title,
      source_filename: file?.name || null,
      storage_path: storagePath,
      mime_type: mimeType,
      status: initialStatus,
      checksum,
      metadata: {
        ingestion: "hive-rag-v1",
        text_available: Boolean(extractedText),
        embedding_configured: isEmbeddingConfigured(),
      },
    });

    if (insertError) throw new Error(`Document insert failed: ${insertError.message}`);

    if (!extractedText) {
      return NextResponse.json(
        {
          id: documentId,
          status: "needs_extraction",
          message:
            "File stored successfully. PDF/DOCX text extraction is the remaining parser step before embedding.",
        },
        { status: 202 }
      );
    }

    if (!isEmbeddingConfigured()) {
      return NextResponse.json(
        {
          id: documentId,
          status: "uploaded",
          message:
            "Document text is stored, but an embedding provider must be configured before indexing.",
        },
        { status: 202 }
      );
    }

    try {
      const chunks = chunkText(extractedText);
      if (!chunks.length) throw new Error("No indexable text was found.");

      const vectors = await embedInBatches(chunks.map((chunk) => chunk.content));

      const rows = chunks.map((chunk, index) => ({
        document_id: documentId,
        organization_id: organisationId,
        chunk_index: chunk.index,
        content: chunk.content,
        char_count: chunk.charCount,
        metadata: { source_filename: file?.name || null, title },
        embedding: vectors[index],
      }));

      for (let index = 0; index < rows.length; index += 100) {
        const { error: chunkError } = await supabase
          .from("knowledge_chunks")
          .insert(rows.slice(index, index + 100));
        if (chunkError) throw new Error(chunkError.message);
      }

      const { error: readyError } = await supabase
        .from("knowledge_documents")
        .update({
          status: "ready",
          updated_at: new Date().toISOString(),
          metadata: {
            ingestion: "hive-rag-v1",
            text_available: true,
            embedding_configured: true,
            chunks: chunks.length,
          },
        })
        .eq("id", documentId)
        .eq("organization_id", organisationId);

      if (readyError) throw new Error(readyError.message);

      return NextResponse.json({
        id: documentId,
        status: "ready",
        chunks: chunks.length,
      });
    } catch (indexError) {
      const detail =
        indexError instanceof Error ? indexError.message : "Unknown indexing error";
      await supabase
        .from("knowledge_documents")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
          metadata: {
            ingestion: "hive-rag-v1",
            text_available: true,
            indexing_error: detail.slice(0, 500),
          },
        })
        .eq("id", documentId)
        .eq("organization_id", organisationId);
      throw indexError;
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Document ingestion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
