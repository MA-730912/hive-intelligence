# HIVE SIM — Canonical Architecture

Status: **Canonical source of truth**
Product: **HIVE SIM — High-Fidelity Clinical Simulation Engine**
Scope: Standalone browser-based clinical simulation platform with optional HIVE Intelligence integrations.

## Product principle

HIVE SIM simulates **working inside a real clinical simulation centre**, not operating a dashboard.

The primary user experience is the clinical environment itself. The Resus Room is the first canonical environment. All monitors, equipment, patient interactions, investigations, procedures and instructor actions exist inside or around that environment.

## Canonical learner flow

1. Enter HIVE SIM
2. Select scenario
3. Review case brief
4. Enter Resus Room
5. Assess patient
6. Examine / communicate / investigate
7. Use room equipment
8. Perform interventions and procedures
9. Patient physiology changes continuously
10. Scenario reaches resolution, deterioration, arrest or instructor-defined end
11. Session closes
12. Structured performance review and debrief

## Canonical system layers

```
HIVE SIM
│
├── 1. IMMERSIVE ENVIRONMENT
│   ├── Resus Room
│   ├── Patient
│   ├── Bed / stretcher
│   ├── Bedside monitor
│   ├── Ventilator
│   ├── Defibrillator / pacer
│   ├── Infusion pumps
│   ├── Drug trolley
│   ├── Ultrasound
│   ├── Portable X-ray
│   ├── CT / MRI / ICU transitions
│   └── Audio / alarms / ambient cues
│
├── 2. PATIENT PHYSIOLOGY ENGINE
│   ├── Airway
│   ├── Respiratory
│   ├── Cardiovascular
│   ├── Neurological
│   ├── Temperature
│   ├── Metabolic
│   └── Organ perfusion
│
├── 3. SCENARIO ENGINE
│   ├── Initial state
│   ├── Time-based progression
│   ├── Trigger rules
│   ├── Branches
│   ├── Expected actions
│   ├── Harmful actions
│   └── End states
│
├── 4. INTERVENTION ENGINE
│   ├── Drugs
│   ├── Fluids
│   ├── Oxygen
│   ├── Airway interventions
│   ├── Ventilation
│   ├── Electrical therapy
│   ├── Procedures
│   └── Imaging / investigations
│
├── 5. DEVICE ENGINE
│   ├── Patient monitor
│   ├── Ventilator
│   ├── Defibrillator
│   ├── Pumps
│   ├── Ultrasound
│   └── Imaging console
│
├── 6. SCENARIO PROP ENGINE
│   ├── Faculty media upload
│   ├── JPEG / PNG / MP4
│   ├── Scenario attachment
│   ├── Hidden / revealed state
│   ├── Instructor release
│   └── Future trigger-based release
│
├── 7. INSTRUCTOR ENGINE
│   ├── Live control
│   ├── Pause / resume
│   ├── Change physiology
│   ├── Trigger events
│   ├── Speak as patient
│   ├── Reveal information
│   └── End scenario
│
├── 8. ASSESSMENT ENGINE
│   ├── Timestamp every action
│   ├── Critical action scoring
│   ├── Delay penalties
│   ├── Harmful action detection
│   ├── Leadership / CRM metrics
│   └── Scenario completion criteria
│
└── 9. DEBRIEF ENGINE
    ├── Timeline
    ├── Clinical performance
    ├── Missed opportunities
    ├── Key learning points
    ├── Faculty notes
    └── Optional AI-assisted debrief
```

## Canonical implementation approach

HIVE SIM is **not dependent on Unreal Engine**.

Primary implementation:
- Next.js / React
- TypeScript
- Canvas / SVG / WebGL where useful
- Browser audio APIs
- Supabase / PostgreSQL
- Realtime synchronization via Supabase Realtime or WebSockets
- Curated medical image, ultrasound, sound and patient-state assets

The product should remain usable on ordinary hospital desktop computers and tablets. VR is optional future expansion, not an MVP requirement.

## Canonical immersion model

The environment is **room-first and 2.5D**.

The user does not need free-roaming 3D navigation.

Instead:
- the room remains visually dominant;
- equipment is located where it physically belongs;
- clicking an object opens a contextual close-up;
- completing the interaction returns the learner to the room;
- patient examination uses anatomical regions;
- investigations and procedures use focused views;
- transitions to CT / MRI / ICU are scene changes rather than game-world navigation.

## Canonical rule

**Behavioural realism is more important than graphical complexity.**

A clinically believable response to treatment is higher priority than photorealistic 3D geometry.

## Canonical MVP scenarios

1. Anaphylaxis
2. STEMI with cardiogenic shock
3. Septic shock
4. Status asthmaticus
5. Major trauma with haemorrhagic shock
6. Cardiac arrest / ventricular fibrillation

These six cases are the reference set for validating the engine.

## Expansion environments

After Resus Room is stable:
- ICU
- Operating theatre
- General ward
- Paediatric resus
- Maternity
- Ambulance / prehospital
- CT
- MRI

## AI boundary

AI is optional and layered on top of a deterministic simulation core.

AI must not be required for:
- physiology
- core scenario progression
- device function
- instructor control
- event logging
- assessment logic

AI may later provide:
- natural patient conversation
- scenario authoring
- adaptive variation
- image / ECG assistance
- automated debrief generation

## Safety

HIVE SIM is a simulation and education platform. Clinical content, medication logic, physiology models, scenario responses and scoring rubrics require formal clinical validation before deployment in training or assessment.
