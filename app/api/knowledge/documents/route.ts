import { createHash, randomUUID } from "crypto";
import { embedTexts, isEmbeddingConfigured } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/knowledge/chunk";
import {
  getHiveOrganisationId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";
import {
  auditEvent,
  createRequestContext,
  enforceRateLimit,
  jsonResponse,
  safeErrorResponse,
} from "@/lib/security/http";

export const runtime = "nodejs";

const TEXT_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
]);

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  ...TEXT_MIME_TYPES,
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

export async function GET(request:Request) {
  const ctx=createRequestContext(request,"/api/knowledge/documents");
  try {
    const rate=enforceRateLimit(request,"knowledge-documents-list",120);
    if(rate) return rate;

    if (!isSupabaseConfigured()) {
      return jsonResponse({ configured: false, documents: [] },ctx.requestId);
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
    return jsonResponse({ configured: true, documents: data || [] },ctx.requestId);
  } catch (error) {
    return safeErrorResponse(error,"Unable to load documents.",ctx.requestId);
  }
}

export async function POST(request: Request) {
  const ctx=createRequestContext(request,"/api/knowledge/documents");
  let documentId:string|null=null;
  let organisationId:string|null=null;

  try {
    const rate=enforceRateLimit(request,"knowledge-documents-upload",10);
    if(rate) return rate;

    if (!isSupabaseConfigured()) {
      return jsonResponse(
        { error: "Supabase RAG is not configured for this deployment." },
        ctx.requestId,
        503
      );
    }

    const contentType=request.headers.get("content-type") || "";
    if(!contentType.toLowerCase().includes("multipart/form-data")){
      return jsonResponse({error:"Content-Type must be multipart/form-data."},ctx.requestId,415);
    }

    const declaredLength=Number(request.headers.get("content-length") || "0");
    if(Number.isFinite(declaredLength) && declaredLength>27*1024*1024){
      return jsonResponse({error:"Upload request exceeds the 27 MB transport limit."},ctx.requestId,413);
    }

    const form = await request.formData();
    const fileValue = form.get("file");
    const file = fileValue instanceof File && fileValue.size > 0 ? fileValue : null;
    const pastedText = String(form.get("text") || "").trim();
    const requestedTitle = String(form.get("title") || "").trim().slice(0,300);

    if (!file && !pastedText) {
      return jsonResponse({ error: "Upload a document or paste document text." },ctx.requestId,400);
    }

    if (file && file.size > 25 * 1024 * 1024) {
      return jsonResponse({ error: "File exceeds the 25 MB limit." },ctx.requestId,413);
    }

    if(file && file.type && !ALLOWED_UPLOAD_MIME_TYPES.has(file.type)){
      return jsonResponse({error:"Unsupported file type for HIVE Knowledge."},ctx.requestId,415);
    }

    if(pastedText.length>2_000_000){
      return jsonResponse(
        { error: "Extracted text exceeds the current 2,000,000 character ingestion limit." },
        ctx.requestId,
        413
      );
    }

    organisationId = getHiveOrganisationId();
    const supabase = getSupabaseAdmin();
    documentId = randomUUID();
    const filename = file ? safeFilename(file.name).slice(0,180) : "pasted-policy.txt";
    const mimeType = file?.type || "text/plain";
    const title =
      requestedTitle ||
      (file ? file.name.replace(/\.[^.]+$/, "").slice(0,300) : "Untitled clinical policy");
    const storagePath = file ? `${organisationId}/${documentId}/${filename}` : null;

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

      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

      if (!extractedText && TEXT_MIME_TYPES.has(mimeType)) {
        extractedText = buffer.toString("utf8").trim();
      }
    }

    const canIndex = Boolean(extractedText) && isEmbeddingConfigured();
    const initialStatus = !extractedText ? "needs_extraction" : canIndex ? "processing" : "uploaded";

    const { error: insertError } = await supabase.from("knowledge_documents").insert({
      id: documentId,
      organization_id: organisationId,
      title,
      source_filename: file?.name?.slice(0,300) || null,
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

    auditEvent("knowledge_document_accepted",{
      requestId:ctx.requestId,
      documentId,
      organisationId,
      mimeType,
      bytes:file?.size || 0,
      textCharacters:extractedText.length,
    });

    if (!extractedText) {
      return jsonResponse({
        id: documentId,
        status: "needs_extraction",
        message: "File stored successfully. PDF/DOCX text extraction is required before embedding.",
      },ctx.requestId,202);
    }

    if (!isEmbeddingConfigured()) {
      return jsonResponse({
        id: documentId,
        status: "uploaded",
        message: "Document text is stored, but an embedding provider must be configured before indexing.",
      },ctx.requestId,202);
    }

    try {
      const chunks = chunkText(extractedText);
      if (!chunks.length) throw new Error("No indexable text was found.");

      const vectors = await embedInBatches(chunks.map((chunk) => chunk.content));
      if(vectors.length!==chunks.length){
        throw new Error("Embedding response count did not match chunk count.");
      }

      const rows = chunks.map((chunk, index) => ({
        document_id: documentId,
        organization_id: organisationId,
        chunk_index: chunk.index,
        content: chunk.content,
        char_count: chunk.charCount,
        metadata: { source_filename: file?.name?.slice(0,300) || null, title },
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

      auditEvent("knowledge_document_indexed",{
        requestId:ctx.requestId,
        documentId,
        organisationId,
        chunks:chunks.length,
        durationMs:Date.now()-ctx.startedAt,
      });

      return jsonResponse({ id: documentId, status: "ready", chunks: chunks.length },ctx.requestId);
    } catch (indexError) {
      const detail = indexError instanceof Error ? indexError.message : "Unknown indexing error";
      await supabase
        .from("knowledge_documents")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
          metadata: {
            ingestion: "hive-rag-v1",
            text_available: true,
            indexing_error: "Indexing failed; see server audit logs with request ID.",
          },
        })
        .eq("id", documentId)
        .eq("organization_id", organisationId);

      auditEvent("knowledge_document_index_failed",{
        requestId:ctx.requestId,
        documentId,
        organisationId,
        detail:detail.slice(0,500),
      });
      throw indexError;
    }
  } catch (error) {
    return safeErrorResponse(error,"Document ingestion failed.",ctx.requestId);
  }
}
