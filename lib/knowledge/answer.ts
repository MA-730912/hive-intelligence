import { retrieveKnowledge } from "./catalog";
import {
  isVectorKnowledgeConfigured,
  retrieveVectorKnowledge,
} from "./vector-retrieval";

export type KnowledgeCitation = {
  id: string;
  title: string;
  sourceFilename?: string | null;
  similarity?: number | null;
  version?: string;
  owner?: string;
  updated?: string;
};

export type KnowledgeAnswer = {
  answer: string;
  citations: KnowledgeCitation[];
  meta: {
    provider: string;
    model: string;
    mode: "live" | "retrieval-only";
    knowledgeSource: "supabase-pgvector" | "demo-catalogue";
  };
};

type PromptSource = {
  id: string;
  title: string;
  content: string;
  citation: KnowledgeCitation;
};

function retrievalOnlyAnswer(sources: PromptSource[], production: boolean) {
  if (!sources.length) {
    return production
      ? "No sufficiently relevant approved source was retrieved from the organisation knowledge base. HIVE Intelligence will not fabricate a local-policy answer."
      : "No relevant source was found in the current demonstration library. HIVE Intelligence will not fabricate a local-policy answer when the approved knowledge base does not contain supporting material.";
  }

  const excerpts = sources
    .slice(0, 4)
    .map((source, index) => `[${index + 1}] ${source.content}`)
    .join("\n\n");

  return `Relevant source material was retrieved, but live AI synthesis is not configured. Review these source excerpts directly:\n\n${excerpts}\n\nClinical interpretation and authoritative local policy remain the responsibility of the treating clinician.`;
}

async function selectSources(query: string) {
  if (isVectorKnowledgeConfigured()) {
    const rows = await retrieveVectorKnowledge(query);
    return {
      production: true,
      sourceType: "supabase-pgvector" as const,
      sources: rows.map(
        (row): PromptSource => ({
          id: String(row.chunkId),
          title: row.title,
          content: row.content,
          citation: {
            id: `${row.documentId}:${row.chunkId}`,
            title: row.title,
            sourceFilename: row.sourceFilename,
            similarity: row.similarity,
          },
        })
      ),
    };
  }

  const rows = retrieveKnowledge(query);
  return {
    production: false,
    sourceType: "demo-catalogue" as const,
    sources: rows.map(
      (source): PromptSource => ({
        id: source.id,
        title: source.title,
        content: source.content,
        citation: {
          id: source.id,
          title: source.title,
          version: source.version,
          owner: source.owner,
          updated: source.updated,
        },
      })
    ),
  };
}

export async function answerKnowledgeQuestion(query: string): Promise<KnowledgeAnswer> {
  let selection;
  try {
    selection = await selectSources(query);
  } catch {
    const demo = retrieveKnowledge(query);
    selection = {
      production: false,
      sourceType: "demo-catalogue" as const,
      sources: demo.map(
        (source): PromptSource => ({
          id: source.id,
          title: source.title,
          content: source.content,
          citation: {
            id: source.id,
            title: source.title,
            version: source.version,
            owner: source.owner,
            updated: source.updated,
          },
        })
      ),
    };
  }

  const sources = selection.sources;
  const citations = sources.map((source) => source.citation);
  const provider = process.env.HIVE_AI_PROVIDER || "openai-compatible";
  const model = process.env.HIVE_AI_MODEL || "";
  const baseUrl = process.env.HIVE_AI_BASE_URL || "";
  const apiKey = process.env.HIVE_AI_API_KEY || "";

  if (!sources.length || !baseUrl || !apiKey || !model) {
    return {
      answer: retrievalOnlyAnswer(sources, selection.production),
      citations,
      meta: {
        provider: "HIVE retrieval layer",
        model: "none",
        mode: "retrieval-only",
        knowledgeSource: selection.sourceType,
      },
    };
  }

  const context = sources
    .map(
      (source, index) =>
        `SOURCE [${index + 1}]\nTitle: ${source.title}\nText: ${source.content}`
    )
    .join("\n\n");

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              "You are HIVE Clinical Knowledge. Answer only from the supplied approved sources. Cite factual claims using [1], [2], etc. If the sources are insufficient, say so explicitly. Never invent a local policy, dose, threshold or workflow. Keep the answer concise and clinician-facing. Qualified clinician review is mandatory.",
          },
          {
            role: "user",
            content: `Question: ${query}\n\nApproved retrieved sources:\n\n${context}`,
          },
        ],
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return {
      answer: retrievalOnlyAnswer(sources, selection.production),
      citations,
      meta: {
        provider: "HIVE retrieval layer",
        model: "provider unavailable",
        mode: "retrieval-only",
        knowledgeSource: selection.sourceType,
      },
    };
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return {
      answer: retrievalOnlyAnswer(sources, selection.production),
      citations,
      meta: {
        provider: "HIVE retrieval layer",
        model: "invalid provider response",
        mode: "retrieval-only",
        knowledgeSource: selection.sourceType,
      },
    };
  }

  return {
    answer: content,
    citations,
    meta: {
      provider,
      model,
      mode: "live",
      knowledgeSource: selection.sourceType,
    },
  };
}
