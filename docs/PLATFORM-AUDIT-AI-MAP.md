# HIVE Intelligence platform audit and AI integration map

## Scope reviewed
Current core on main plus the Clinician Hub integration branch. The Simulation Studio remains a parallel feature branch and should be merged through the same visual and governance system rather than maintained as a separate product experience.

## Functional surfaces
- Clinical Workspace: structured synthetic case analysis, acuity, red flags, differentials, immediate priorities, ISBAR and safety notes.
- Clinical Knowledge: approved-source retrieval, citation display and retrieval-only safe fallback.
- Knowledge Documents: ingestion, chunking, embeddings, metadata and organisation-scoped pgvector retrieval.
- Clinician Hub: credentials, organisations, competencies, CPD, professional wallet, calendar/demo meetings and reminders.
- Control Centre: current provider/governance status and future operational oversight.
- Case studies / Firmus demo: end-to-end capability demonstrations.
- Simulation Studio: parallel branch containing scenario engine, monitors, ventilator, POCUS, imaging, instructor controls and debrief foundations.

## AI integration points
1. Clinical reasoning — live-capable OpenAI-compatible chat completion.
2. Clinical Knowledge synthesis — live-capable grounded generation over retrieved sources.
3. Embeddings — Supabase Edge or OpenAI-compatible 384-dimensional embedding provider.
4. Clinician daily brief/reminders — currently deterministic; should remain rules-authoritative with optional LLM summarisation.
5. Calendar intelligence — provider-neutral contract exists; Microsoft Graph / Google connectors are not live yet.
6. Document intelligence — ingestion/retrieval is current; extraction, classification and summarisation are logical next AI services.
7. Simulation — authoritative scenario engine should remain deterministic; AI can assist authoring, virtual team dialogue and debrief.
8. HIVE ECG / HIVE Imaging — future specialist model adapters through the same gateway and audit model.

## Architectural judgement
The strongest existing design choice is provider abstraction: the clinician UI does not need to change when inference moves from a hosted model to private or Australian sovereign compute. This should become a formal AI Gateway interface with model policy, organisation policy, timeout/fallback, observability and audit metadata.

## Immediate gaps
- Authentication and server-authoritative RBAC for HIVE Intelligence.
- Immutable audit logging and organisation membership enforcement.
- Distributed rate limiting / WAF.
- Formal model output validation rather than TypeScript casting alone.
- Provider timeouts, retries and circuit-breaker behaviour.
- Prompt/model/version audit metadata.
- Real calendar OAuth and token lifecycle.
- Persistent clinician data and professional-wallet storage.
- Formal clinical validation and change control before real patient data.

## Experience direction
HIVE Intelligence should visually inherit the trust and polish of HIVE Clinical while retaining a more sophisticated intelligence-platform identity: light clinical canvas, deep teal, restrained lime/gold accents, strong hierarchy, consistent cards, fewer dense dark panels and one coherent navigation system.
