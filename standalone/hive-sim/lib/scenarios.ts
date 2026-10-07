export type ScenarioId = "septic-shock" | "anaphylaxis";

export const scenarios = {
  "septic-shock": {
    id: "septic-shock" as const,
    title: "Septic Shock",
    subtitle: "67-year-old · 82 kg · pneumonia",
    difficulty: "Advanced",
    patient: "Mr David Mercer",
    opening: "“I feel terrible… I can’t catch my breath.”",
    exam: "Hot, clammy, tachypnoeic. Peripheral perfusion reduced.",
    goals: ["Recognise shock", "Oxygenation", "Early antibiotics", "Appropriate fluids", "Vasopressor support"]
  },
  "anaphylaxis": {
    id: "anaphylaxis" as const,
    title: "Anaphylaxis",
    subtitle: "34-year-old · 68 kg · sudden airway/breathing compromise",
    difficulty: "Advanced",
    patient: "Ms Sarah Collins",
    opening: "“My throat feels tight… I can’t breathe properly.”",
    exam: "Urticaria, wheeze, stridor, tachycardia and hypotension.",
    goals: ["Recognise anaphylaxis", "IM adrenaline", "Airway planning", "Oxygen", "IV fluids"]
  }
} satisfies Record<ScenarioId, {
  id: ScenarioId;
  title: string;
  subtitle: string;
  difficulty: string;
  patient: string;
  opening: string;
  exam: string;
  goals: string[];
}>;

export function scenarioList() {
  return Object.values(scenarios);
}
