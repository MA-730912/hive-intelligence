# HIVE SIM — Canonical Simulation Kernel v1

Status: **Active implementation contract**

The Simulation Kernel is the deterministic core beneath the learner interface.

## Kernel v1 modules

### Airway Object Engine
Initial supported object workflow:
- laryngoscope
- endotracheal tube
- bougie
- BVM
- oxygen mask
- suction catheter

The ETT uses explicit states:
- available
- inserted
- secured
- circuit-connected

Device activation may depend on these object states.

### Ventilator State Machine
Initial ventilator states:
- standby
- ready
- active
- alarm

Initial configuration:
- patient configured
- ventilation mode
- tidal volume
- respiratory rate
- PEEP
- FiO2

Ventilation may not start until:
1. an airway device is secured;
2. the circuit is connected; and
3. patient setup is complete.

### Respiratory Mechanics Engine
Kernel v1 now includes a simplified respiratory model using:
- respiratory-system compliance
- airway resistance
- dead space
- metabolic CO₂ load
- shunt burden
- spontaneous effort placeholder

From ventilator settings it derives:
- peak airway pressure
- plateau pressure
- driving pressure
- minute ventilation
- alveolar ventilation
- estimated EtCO₂
- estimated SpO₂
- alarm states

It also generates pressure, flow and volume traces for the HIVE Vent display.

Scenario-linked presets currently distinguish bronchospasm/anaphylaxis and sepsis/impaired gas exchange.

### Physiology integration
Starting ventilation updates the patient state through the simulation layer.

Kernel v1 now includes a simplified respiratory mechanics model. It is intended to prove architecture and interaction behavior, not to serve as a validated clinical ventilator model.

Future respiratory model inputs will include:
- airway resistance
- respiratory-system compliance
- spontaneous activity / effort
- dead space
- metabolism / CO2 production
- acid-base state
- recruitment / derecruitment
- inspiratory and expiratory timing

## Interaction rule

Clinical objects must have state.

Devices must have state.

Actions should affect physiology through those states rather than through decorative UI shortcuts.

## Reference implementation

- `lib/kernel/airway.ts`
- `lib/kernel/ventilator.ts`
- `components/AirwayVentilatorWorkbench.tsx`

## Safety

The current physiology response is a simulation prototype and is not a validated ventilator-training model. Device behaviour and clinical relationships require expert validation before use for formal education or competency assessment.
