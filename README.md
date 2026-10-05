# HIVE Intelligence

Standalone clinical AI infrastructure and intelligence platform.

## MVP v0.4
- Landing page and Intelligence dashboard
- Clinical Workspace with structured clinical AI output
- Dedicated `/demo/firmus` capability demonstration
- Provider-neutral model gateway
- Clinical Knowledge with explicit source citations
- Dedicated Supabase RAG foundation
- Private document storage model
- Organisation-scoped document metadata
- Text chunking with overlap
- OpenAI-compatible embedding gateway
- 1536-dimensional pgvector storage
- HNSW vector index
- Organisation-filtered similarity-search RPC
- Knowledge Documents upload/indexing workspace
- RLS policies for organisations, memberships, documents, chunks and Storage
- Synthetic knowledge catalogue retained only as a safe fallback

## Product boundary
HIVE Intelligence remains separate from HIVE Clinical. HIVE Clinical can later become an API consumer while HIVE Intelligence can independently serve hospitals, simulation centres and health software vendors.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Clinical model gateway
```bash
HIVE_AI_PROVIDER=your-provider-name
HIVE_AI_BASE_URL=https://your-openai-compatible-endpoint/v1
HIVE_AI_API_KEY=...
HIVE_AI_MODEL=...
HIVE_AI_ALLOW_MOCK=false
```

## Supabase RAG
A complete database/storage definition is in:

`supabase/schema.sql`

It creates:
- organisations and organisation memberships
- knowledge document metadata
- chunk storage
- `extensions.vector(1536)` embeddings
- HNSW cosine index
- `match_knowledge_chunks` retrieval function
- private `hive-knowledge` Storage bucket
- RLS policies for tenant isolation

Server-side configuration:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=...
HIVE_ORGANISATION_ID=<uuid>
```

A legacy `SUPABASE_SERVICE_ROLE_KEY` is also accepted server-side. Never expose either server secret through a `NEXT_PUBLIC_` variable.

## Embeddings
The RAG schema currently expects 1536-dimensional embeddings.

```bash
HIVE_EMBEDDING_BASE_URL=https://your-openai-compatible-endpoint/v1
HIVE_EMBEDDING_API_KEY=...
HIVE_EMBEDDING_MODEL=...
```

If the embedding endpoint and key are omitted, HIVE falls back to the main AI endpoint/key. The embedding model must return exactly 1536 dimensions.

## Document ingestion
Open:

`/knowledge/documents`

Native extraction/indexing currently supports TXT, Markdown, CSV and JSON. PDF and DOCX files are already accepted into private Storage and marked `needs_extraction` when no extracted text is supplied. The screen also allows extracted text to be pasted alongside the original PDF/DOCX so the file can be indexed immediately.

The automated PDF/DOCX parser is deliberately kept as the next isolated layer rather than introducing an unreviewed parsing dependency into the clinical document pipeline.

## Retrieval flow
1. User asks a knowledge question.
2. HIVE embeds the query.
3. Supabase pgvector performs organisation-scoped semantic retrieval.
4. Retrieved chunks and source metadata are passed to the AI gateway.
5. The model is instructed to answer only from supplied material and cite `[1]`, `[2]`, etc.
6. If no source supports the answer, HIVE should explicitly refuse to invent local policy.

## Firmus path
The AI and embedding gateways are provider-neutral. A future Firmus-hosted OpenAI-compatible inference/embedding endpoint can replace the current provider configuration without changing the clinician-facing workflows.

## Safety
This is still an MVP and not a production clinical decision-support system. Real clinical deployment requires authentication, organisation provisioning, approved clinical content governance, formal validation, monitoring, audit logging and qualified clinician review of outputs.
