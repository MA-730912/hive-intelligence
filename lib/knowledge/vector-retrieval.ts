import "server-only";
import { embedText, isEmbeddingConfigured } from "@/lib/ai/embeddings";
import {
  getHiveOrganisationId,
  getSupabaseAdmin,
  isSupabaseConfigured,
} from "@/lib/supabase/admin";

export type RetrievedKnowledgeChunk = {
  chunkId: number;
  documentId: string;
  title: string;
  sourceFilename: string | null;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
};

export function isVectorKnowledgeConfigured() {
  return isSupabaseConfigured() && isEmbeddingConfigured();
}

export async function retrieveVectorKnowledge(
  query: string,
  matchCount = 8,
  matchThreshold = 0.72
): Promise<RetrievedKnowledgeChunk[]> {
  if (!isVectorKnowledgeConfigured()) return [];

  const supabase = getSupabaseAdmin();
  const organisationId = getHiveOrganisationId();
  const queryEmbedding = await embedText(query);

  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: queryEmbedding,
    p_organization_id: organisationId,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) throw new Error(`Vector retrieval failed: ${error.message}`);

  return (data || []).map((row: any) => ({
    chunkId: Number(row.chunk_id),
    documentId: row.document_id,
    title: row.title,
    sourceFilename: row.source_filename ?? null,
    content: row.content,
    metadata: row.metadata || {},
    similarity: Number(row.similarity || 0),
  }));
}
