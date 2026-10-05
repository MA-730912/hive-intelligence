# HIVE Intelligence Security Baseline v1

This document records the minimum hardening applied to the HIVE Intelligence MVP and the remaining gates before real patient or production clinical use.

## Implemented baseline

- Server-only Supabase administrative client using `server-only`.
- Organisation-scoped knowledge queries and document indexing.
- Private knowledge storage architecture.
- File-size, MIME-type, title and text-length validation on document ingestion.
- API payload size and content-type validation.
- Per-process request throttling as an MVP abuse-control layer.
- Correlation/request IDs on API responses.
- Structured server-side audit/error logging without returning infrastructure errors to the browser.
- `Cache-Control: no-store` on clinical/knowledge API responses.
- Browser security headers:
  - X-Content-Type-Options
  - X-Frame-Options
  - Referrer-Policy
  - Permissions-Policy
  - Strict-Transport-Security
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy
- Framework identification header disabled.
- Non-sensitive `/api/health` readiness endpoint.
- Synthetic/demo clinical content remains the default demonstration boundary.

## Required before real-patient production use

The current MVP must not be treated as production-ready for identifiable patient data until these controls are completed and validated:

1. Authentication and enterprise identity integration.
2. Role-based access control enforced server-side on every protected route.
3. User-to-organisation membership validation instead of a single environment-scoped demo organisation.
4. Durable distributed rate limiting / WAF controls.
5. Persistent immutable audit logging with defined retention.
6. Formal secrets lifecycle, rotation and environment separation.
7. Privacy impact assessment and clinical safety governance.
8. Threat modelling and independent penetration/security testing.
9. Backup, recovery, business-continuity and incident-response procedures.
10. Approved model/provider allow-listing and data-processing agreements.
11. Production monitoring, alerting and SLA/SLO definitions.
12. Formal clinical validation and change-control process.

## Design rule

HIVE Intelligence should fail closed when identity, organisation scope, approved knowledge, model routing or clinical governance cannot be established. Clinical AI output is decision support and requires human review.
