import { retrieveKnowledge } from "./catalog";

export type KnowledgeAnswer = {
  answer: string;
  citations: Array<{
    id: string;
    title: string;
    version: string;
    owner: string;
    updated: string;
  }>;
  meta: {
    provider: string;
    model: string;
    mode: "live" | "retrieval-only";
  };
};

function fallbackAnswer(query: string, sources: ReturnType<typeof retrieveKnowledge>) {
  if (!sources.length) {
    return "No relevant source was found in the current demonstration library. HIVE Intelligence will not fabricate a local-policy answer when the approved knowledge base does not contain supporting material.";
  }

  const evidence = sources.map((source, i) => `[${i + 1}] ${source.content}`).join("\n\n");
  return `Based only on the retrieved demonstration policies, the relevant guidance is:\n\n${evidence}\n\nClinical interpretation and local authoritative policy remain the responsibility of the treating clinician.`;
}

export async function answerKnowledgeQuestion(query: string): Promise<KnowledgeAnswer> {
  const sources = retrieveKnowledge(query);
  const provider = process.env.HIVE_AI_PROVIDER || "openai-compatible";
  const model = process.env.HIVE_AI_MODEL || "";
  const baseUrl = process.env.HIVE_AI_BASE_URL || "";
  const apiKey = process.env.HIVE_AI_API_KEY || "";

  const citations = sources.map(({ id, title, version, owner, updated }) => ({
    id,
    title,
    version,
    owner,
    updated,
  }));

  if (!sources.length || !baseUrl || !apiKey || !model) {
    return {
      answer: fallbackAnswer(query, sources),
      citations,
      meta: { provider: "HIVE retrieval layer", model: "none", mode: "retrieval-only" },
    };
  }

  const context = sources
    .map(
      (source, index) =>
        `SOURCE [${index + 1}]\nTitle: ${source.title}\nVersion: ${source.version}\nText: ${source.content}`
    )
    .join("\n\n");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
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
            "You are HIVE Clinical Knowledge. Answer only from the supplied sources. Cite factual claims using [1], [2], etc. If the sources are insufficient, say so. Do not invent local policy. Keep the answer concise and clinician-facing.",
        },
        {
          role: "user",
          content: `Question: ${query}\n\nApproved demonstration sources:\n\n${context}`,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      answer: fallbackAnswer(query, sources),
      citations,
      meta: { provider: "HIVE retrieval layer", model: "provider unavailable", mode: "retrieval-only" },
    };
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    return {
      answer: fallbackAnswer(query, sources),
      citations,
      meta: { provider: "HIVE retrieval layer", model: "invalid provider response", mode: "retrieval-only" },
    };
  }

  return {
    answer: content,
    citations,
    meta: { provider, model, mode: "live" },
  };
}
