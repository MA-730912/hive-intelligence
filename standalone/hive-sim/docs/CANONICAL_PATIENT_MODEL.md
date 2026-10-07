# HIVE SIM — Canonical Patient Model

The simulated patient is a hidden clinical state, not a collection of screen values.

## Core domains

### Airway
- patency
- airway oedema
- obstruction
- secretions
- aspiration risk
- airway device present

### Respiratory
- respiratory rate
- spontaneous ventilation
- tidal volume
- FiO2
- SpO2
- PaO2
- PaCO2
- EtCO2
- compliance
- airway resistance
- dead space

### Cardiovascular
- heart rate
- rhythm
- preload
- stroke volume
- contractility
- SVR
- cardiac output
- systolic / diastolic / MAP
- perfusion

### Neurological
- GCS
- pupils
- agitation
- seizure state
- pain response

### Metabolic / systemic
- temperature
- glucose
- pH
- lactate
- electrolytes
- renal function

## Observable vs hidden data

The learner only sees information available through:
- examination
- monitor
- bedside tests
- laboratory tests
- imaging
- ultrasound
- patient history

Hidden physiology is never displayed directly to the learner.

## Simulation tick

The patient state updates continuously.

Each tick may consider:
- disease process
- elapsed time
- interventions
- drug effects
- ventilation settings
- instructor overrides
- complications

## Core principle

An intervention changes the underlying physiology first.

The visible monitor, examination and investigation outputs are then derived from the updated physiology.
