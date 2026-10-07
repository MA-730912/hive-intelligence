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
- Browser-generated monitor pulse tones and low-vital alarm tones\n- Live Instructor Console at `/instructor` using a same-browser control channel\n- Instructor triggers: deterioration, improve, VF, VT, desaturation, hypotension, pause/resume and reset\n- Two dynamic scenarios: Septic Shock and Anaphylaxis\n- No AI dependency required for the MVP

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

## Instructor mode\n\nOpen the learner room at `http://localhost:3000` and the instructor console at `http://localhost:3000/instructor` in a second tab/window. The two views communicate live using `BroadcastChannel`, which is ideal for the MVP and requires no backend. Multi-device simulation will later replace this with Supabase Realtime/WebSockets.\n\nEnable audio from the learner-room header after the first user interaction; browser autoplay rules prevent sound from starting automatically.\n\n## Safety
This is a simulation/training prototype. Drug doses, physiological responses and scenario logic must be clinically reviewed and validated before any educational deployment.

## Next build targets
- Declarative JSON scenario schema
- Anaphylaxis scenario
- Instructor control room
- Ultrasound interaction
- Audio/alarm layer
- Multiplayer state sync
