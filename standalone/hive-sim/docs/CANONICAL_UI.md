# HIVE SIM — Canonical Learner UI Contract

Status: **AUTHORIZED**
Authorized by product owner: 7 October 2026

This document fixes the approved learner experience for HIVE SIM.

## Product identity

The approved interface is a **virtual clinical simulation centre**, not a conventional dashboard.

The room and patient remain visually dominant at all times.

## Canonical screen composition

### 1. Top simulation-centre navigation
Persistent top navigation includes:
- HIVE SIM / Virtual Simulation Centre identity
- Resus Room
- Imaging
- ICU
- Theatres
- Scenarios
- Debrief
- scenario timer
- End Scenario
- settings / faculty utilities as appropriate

### 2. Full clinical environment
The central viewport is the photorealistic simulation room.

It contains:
- patient on the bed
- bedside monitor
- ventilator
- defibrillator
- ultrasound
- imaging equipment
- drug trolley
- room equipment and environmental cues
- visible transitions/signage to other clinical areas

The environment must remain clinically plausible and visually coherent.

### 3. Contextual equipment hotspots
Equipment is accessed in its physical location.

Canonical hotspot categories:
- Patient / Examine / Procedures
- Monitor
- Ventilator
- Defibrillator
- Ultrasound
- Imaging
- Drug trolley

Hotspots should feel integrated into the room rather than floating application cards.

### 4. Scenario information
A compact scenario card sits over the room edge and includes:
- scenario title
- age / sex
- trigger / presenting context
- severity / key briefing information
- Scenario Brief control

### 5. Quick Actions
A compact right-side quick-action rail provides rapid access to common emergency actions.

Examples:
- oxygen
- IV access
- fluid
- adrenaline
- noradrenaline
- RSI
- defibrillation
- More…

Quick Actions are shortcuts into the same intervention engine used by the physical equipment.

### 6. Clinical workstations
The approved lower clinical workspace exposes real device functions without replacing the room.

Canonical panels:
- Monitor
- Ventilator
- Defibrillator
- Ultrasound
- Imaging

These panels may expand, collapse or focus, but the product should preserve the relationship between each panel and the physical equipment in the room.

### 7. Bottom workflow navigation
Canonical learner workflow tabs:
- Patient
- Examination
- Procedures
- Medications
- Investigations
- Notes
- Team

### 8. Instructor-provided scenario props
Faculty may attach and reveal scenario media.

Canonical supported MVP formats:
- JPEG
- PNG
- MP4

Examples:
- chest X-ray
- CT screenshot
- ECG photograph
- rash / wound image
- ultrasound loop
- endoscopy / laryngoscopy clip
- procedure cue
- patient appearance change
- environmental clue

Props are hidden from the learner until released by the instructor or scenario engine.

## Interaction principle

The learner should feel:

> “I am managing a patient in Resus.”

not:

> “I am navigating a medical dashboard.”

## Visual principle

The canonical visual direction is:
- photorealistic clinical room
- dark premium simulation-centre chrome
- restrained blue/cyan interaction accents
- realistic medical-device screens
- high information density without clutter
- clinical rather than game-like
- desktop-first, tablet-compatible

## Canonical priority

Where experimental UI conflicts with this contract, this document takes precedence unless the product owner explicitly authorizes a replacement canonical UI.
