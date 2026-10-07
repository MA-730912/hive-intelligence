# HIVE SIM — Browser-based High-Fidelity Clinical Simulation

Standalone prototype housed in the HIVE Intelligence repository for safe development. It does **not** depend on the parent application and can be moved to its own GitHub repository later.

## Current MVP
- Cinematic interactive Resus Room
- Photorealistic room asset path wired at `public/resus-room.jpg`, with automatic fallback to the schematic room
- Animated ECG, SpO₂ pleth and capnography traces
- Clickable patient monitor, ventilator, defibrillator, drugs, patient and imaging
- Live physiology timer and vital signs
- Intervention effects through a TypeScript patient-state engine
- Event log and scenario state
- Defibrillation / ROSC logic
- Responsive browser UI
- No AI dependency required for the MVP

## Add the canonical room image

Place the HIVE SIM resuscitation room JPEG at:

```
standalone/hive-sim/public/resus-room.jpg
```

The app automatically uses it. If the JPEG is absent it falls back to `resus-room.svg`.

## Run locally

```bash
cd standalone/hive-sim
npm install
npm run dev
```

Open http://localhost:3000

## Architecture direction

1. **Immersive Room UI** — fixed cinematic/2.5D room with hotspots and device close-ups.
2. **Physiology engine** — deterministic patient state updated every simulation tick.
3. **Scenario engine** — declarative triggers, deterioration pathways and success criteria.
4. **Device engine** — monitor, ventilator, defibrillator, pumps, ultrasound and imaging.
5. **Instructor console** — remote triggers, pause/reset and controlled deterioration.
6. **Assessment/debrief** — timestamped actions, critical-action scoring and replay.
7. **Optional HIVE Intelligence layer** — free-text patient dialogue, scenario authoring and debrief assistance.

## Safety
This is a simulation/training prototype. Drug doses, physiological responses and scenario logic must be clinically reviewed and validated before any educational deployment.

## Next build targets
- Declarative JSON scenario schema
- Anaphylaxis scenario
- Instructor control room
- Ultrasound interaction
- Audio/alarm layer
- Multiplayer state sync
