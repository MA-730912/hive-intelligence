# HIVE Intelligence

Standalone clinical AI infrastructure and intelligence platform.

## MVP v0.1
- Landing page
- Intelligence dashboard
- Clinical Workspace using synthetic patient data
- Dedicated `/demo/firmus` partner demonstration
- Provider-abstraction concept for future Firmus / sovereign compute integration
- Governance-oriented UI scaffold

## Product boundary
HIVE Intelligence is separate from HIVE Clinical. HIVE Clinical can become an API consumer of HIVE Intelligence, but the intelligence platform can serve hospitals, simulation centres and other health software independently.

## Run locally
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Safety
The MVP is a capability demonstration and is not a production clinical decision-support system. It uses synthetic data and requires clinical human review.
