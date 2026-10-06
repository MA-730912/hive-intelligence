# HIVE Clinical → HIVE Intelligence Clinician Hub reuse map

The Clinician Hub is an extension of HIVE Intelligence, not a replacement for HIVE Clinical.

## Existing HIVE Clinical assets reused conceptually

### app/register/doctor/page.tsx
- professional profile
- AHPRA registration
- fellowship / college
- provider number
- prescriber number
- credential upload
- staged clinician onboarding

### lib/server-clinician-store.ts
- verification-status lifecycle
- clinician professional profile fields
- medical indemnity credential
- evidence references
- expiry and verification model

### app/doctor/dashboard/page.tsx
- clinician-account summary
- credential status
- onboarding / verification messaging
- professional account as a dashboard destination

### lib/organisation-rbac.ts
- explicit role / permission model
- server remains the authorisation boundary

## HIVE Intelligence extensions

- multi-organisation professional passport
- organisation-specific readiness
- competency passport
- Simulation Studio evidence
- CPD record
- professional wallet
- invoice and receipt tracking
- future official renewal/payment links
- future approved payment-provider integrations

## Architectural boundary

HIVE Clinical remains the care-delivery system.

HIVE Intelligence remains the intelligence, professional-workspace, workforce-readiness and governance layer.

The clinician-domain contracts should eventually be extracted into a shared package rather than copied between applications.
