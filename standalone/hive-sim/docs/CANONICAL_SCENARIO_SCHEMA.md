# HIVE SIM — Canonical Scenario Schema

Scenarios are data-driven and must not require bespoke UI code.

## Required scenario structure

```ts
type Scenario = {
  id: string
  title: string
  version: string

  patient: {
    age: number
    sex?: string
    weightKg: number
    name?: string
  }

  brief: {
    presentingComplaint: string
    context: string
    openingLine?: string
  }

  initialState: PatientState

  examination: {
    airway?: FindingSet
    breathing?: FindingSet
    circulation?: FindingSet
    disability?: FindingSet
    exposure?: FindingSet
  }

  investigations: InvestigationDefinition[]

  timeline: ScenarioTrigger[]

  expectedActions: ScoredAction[]

  harmfulActions: ScoredAction[]

  endStates: ScenarioEndState[]

  debrief: {
    objectives: string[]
    keyPoints: string[]
  }
}
```

## Trigger types

- elapsed time
- vital threshold
- drug administered
- procedure completed
- investigation ordered
- device setting changed
- instructor command
- compound condition

## Example

```
IF:
  scenario = anaphylaxis
  AND adrenaline doses = 0
  AND elapsed > 5 minutes

THEN:
  airway oedema increases
  SpO2 falls
  BP falls
  distress increases
```

## Principle

The room and devices remain reusable.

New clinical cases should normally be created by adding scenario data, not by rewriting the simulation application.
