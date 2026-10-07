# HIVE SIM — Canonical Build Order

## Phase 1 — Simulation foundation
- canonical Resus Room
- patient state engine
- scenario engine
- event log
- room interactions
- instructor console
- audio alarms
- monitor waveforms

## Phase 2 — Patient interaction
- anatomical examination zones
- airway assessment
- chest examination
- circulation examination
- pupils / GCS
- pulse findings
- skin / rash / perfusion

## Simulation Kernel v1 — underway
- clinical object state model
- draggable airway props
- ETT insertion / secure / circuit workflow
- ventilator standby / configuration / activation state machine
- simplified ventilation-to-physiology bridge

## Phase 3 — Procedures
- IV
- IO
- BVM
- supraglottic airway
- intubation
- surgical airway
- needle decompression
- finger thoracostomy
- chest drain
- CPR

## Phase 4 — Equipment
- full monitor
- functional ventilator
- functional defibrillator / pacing
- infusion pumps
- drug trolley

## Phase 5 — Investigations
- ECG
- blood gas
- laboratory tests
- portable X-ray
- CT
- MRI
- POCUS

## Phase 6 — Assessment
- critical action scoring
- delay penalties
- harmful action tracking
- CRM / leadership metrics
- scenario completion logic

## Phase 7 — Debrief
- event timeline
- faculty notes
- performance report
- replay
- optional AI debrief

## Phase 8 — Multiplayer
- team roles
- shared patient state
- multi-device instructor session
- remote simulation

## Phase 9 — AI layer
- natural patient conversation
- scenario generation
- adaptive scenario variants
- AI ECG / imaging support
- AI debrief assistance

## Build rule

Do not move on because a feature is visually attractive.

A phase is considered complete only when its clinical behaviour can be tested reliably.
