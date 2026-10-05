# HIVE Intelligence

Standalone clinical AI infrastructure and intelligence platform.

## MVP v0.3
- Landing page
- Intelligence dashboard
- Clinical Workspace using synthetic patient data
- Dedicated `/demo/firmus` partner demonstration
- Working server-side clinical analysis API
- Structured clinical output: acuity, red flags, differential, immediate priorities and ISBAR
- Provider abstraction for hosted or sovereign OpenAI-compatible inference endpoints
- Governance-oriented UI and mandatory human-review framing
- Clinical Knowledge workspace
- Controlled retrieval from a synthetic policy library
- Source-backed answers with explicit citations
- Refusal to fabricate local-policy answers when no supporting source is retrieved

## Product boundary
HIVE Intelligence is separate from HIVE Clinical. HIVE Clinical can become an API consumer of HIVE Intelligence, but the intelligence platform can serve hospitals, simulation centres and other health software independently.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Configure a live AI provider
Set these server-side variables in `.env.local` or your deployment environment:

```bash
HIVE_AI_PROVIDER=your-provider-name
HIVE_AI_BASE_URL=https://your-openai-compatible-endpoint/v1
HIVE_AI_API_KEY=...
HIVE_AI_MODEL=...
HIVE_AI_ALLOW_MOCK=false
```

The app sends requests from the server route `/api/clinical/analyse`, so the API key is never exposed to the browser.

For the current demo, `HIVE_AI_ALLOW_MOCK=true` provides a deterministic synthetic fallback when no live provider is configured.

## Firmus path
When a Firmus-hosted OpenAI-compatible inference endpoint is available, change the HIVE AI environment variables to point at that endpoint. The Clinical Workspace and Firmus demonstration UI do not need to be rewritten.

## Safety
This MVP is a capability demonstration and is not a production clinical decision-support system. It uses synthetic data, does not replace local clinical protocols, and requires qualified clinician review of every AI output.

## Current Clinical Knowledge MVP
The current knowledge layer intentionally uses a small synthetic demonstration catalogue and lightweight retrieval. This makes the citation behaviour testable without implying that demonstration text is a real hospital protocol.

With a live AI provider configured, HIVE synthesises an answer from retrieved sources only. Without one, the app still shows retrieval-only evidence and citations.

## Next milestone
Replace the synthetic catalogue with organisation-approved document ingestion, chunking, embeddings and Supabase pgvector retrieval, while keeping the same source-backed answer interface.
