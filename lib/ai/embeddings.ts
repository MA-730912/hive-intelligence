import "server-only";

const DIMENSIONS = 1536;

function config() {
  const baseUrl =
    process.env.HIVE_EMBEDDING_BASE_URL ||
    process.env.HIVE_AI_BASE_URL ||
    "";
  const apiKey =
    process.env.HIVE_EMBEDDING_API_KEY ||
    process.env.HIVE_AI_API_KEY ||
    "";
  const model = process.env.HIVE_EMBEDDING_MODEL || "";

  if (!baseUrl || !apiKey || !model) {
    throw new Error(
      "Embedding provider is not configured. Set HIVE_EMBEDDING_BASE_URL, HIVE_EMBEDDING_API_KEY and HIVE_EMBEDDING_MODEL."
    );
  }

  return { baseUrl, apiKey, model };
}

export function isEmbeddingConfigured() {
  return Boolean(
    (process.env.HIVE_EMBEDDING_BASE_URL || process.env.HIVE_AI_BASE_URL) &&
      (process.env.HIVE_EMBEDDING_API_KEY || process.env.HIVE_AI_API_KEY) &&
      process.env.HIVE_EMBEDDING_MODEL
  );
}

export async function embedTexts(inputs: string[]) {
  if (!inputs.length) return [] as number[][];

  const { baseUrl, apiKey, model } = config();
  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/embeddings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: inputs,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Embedding provider error ${response.status}: ${detail.slice(0, 300)}`
    );
  }

  const payload = await response.json();
  const vectors = Array.isArray(payload?.data)
    ? payload.data
        .sort((a: { index: number }, b: { index: number }) => a.index - b.index)
        .map((item: { embedding: number[] }) => item.embedding)
    : [];

  if (vectors.length !== inputs.length) {
    throw new Error("Embedding provider returned an unexpected number of vectors.");
  }

  for (const vector of vectors) {
    if (!Array.isArray(vector) || vector.length !== DIMENSIONS) {
      throw new Error(
        `Embedding dimension mismatch. HIVE RAG expects ${DIMENSIONS} dimensions.`
      );
    }
  }

  return vectors;
}

export async function embedText(input: string) {
  const [vector] = await embedTexts([input]);
  return vector;
}
