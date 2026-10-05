import "server-only";

const DIMENSIONS = 384;

type EmbeddingMode = "supabase-edge" | "openai-compatible";

function config() {
  const supabaseFunctionUrl = process.env.HIVE_SUPABASE_EMBEDDING_URL || "";
  const supabaseFunctionToken =
    process.env.HIVE_SUPABASE_EMBEDDING_TOKEN ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (supabaseFunctionUrl && supabaseFunctionToken) {
    return {
      mode: "supabase-edge" as EmbeddingMode,
      url: supabaseFunctionUrl,
      apiKey: supabaseFunctionToken,
      model: "gte-small",
    };
  }

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
      "Embedding provider is not configured. Configure HIVE_SUPABASE_EMBEDDING_URL + token, or an OpenAI-compatible embedding endpoint."
    );
  }

  return {
    mode: "openai-compatible" as EmbeddingMode,
    url: `${baseUrl.replace(/\/$/, "")}/embeddings`,
    apiKey,
    model,
  };
}

export function isEmbeddingConfigured() {
  return Boolean(
    (process.env.HIVE_SUPABASE_EMBEDDING_URL &&
      (process.env.HIVE_SUPABASE_EMBEDDING_TOKEN ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
      ((process.env.HIVE_EMBEDDING_BASE_URL || process.env.HIVE_AI_BASE_URL) &&
        (process.env.HIVE_EMBEDDING_API_KEY || process.env.HIVE_AI_API_KEY) &&
        process.env.HIVE_EMBEDDING_MODEL)
  );
}

export async function embedTexts(inputs: string[]) {
  if (!inputs.length) return [] as number[][];

  const { mode, url, apiKey, model } = config();
  const body =
    mode === "supabase-edge"
      ? { input: inputs }
      : { model, input: inputs };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

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
