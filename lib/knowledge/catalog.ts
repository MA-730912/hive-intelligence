export type KnowledgeSource = {
  id: string;
  title: string;
  version: string;
  owner: string;
  updated: string;
  content: string;
};

export const knowledgeSources: KnowledgeSource[] = [
  {
    id: "demo-stemi-001",
    title: "HIVE Demo Acute STEMI Escalation Pathway",
    version: "Demo 1.0",
    owner: "HIVE Intelligence Demonstration Library",
    updated: "2026-10-05",
    content:
      "Synthetic demonstration policy. Patients with a suspected STEMI and haemodynamic instability require immediate senior clinical escalation, continuous monitoring, activation of the local reperfusion pathway, and urgent cardiology involvement. Diagnostic or administrative steps should not delay time-critical reperfusion decisions. Bedside assessment may be used to clarify shock physiology where locally available and clinically appropriate. This document is not a real hospital policy.",
  },
  {
    id: "demo-shock-001",
    title: "HIVE Demo Undifferentiated Shock Escalation Standard",
    version: "Demo 1.0",
    owner: "HIVE Intelligence Demonstration Library",
    updated: "2026-10-05",
    content:
      "Synthetic demonstration policy. Shock with hypotension and clinical hypoperfusion should trigger immediate resuscitation, senior escalation and repeated reassessment. The treating team should actively consider cardiogenic, obstructive, distributive and hypovolaemic mechanisms using history, examination, monitoring and targeted investigations. Local critical care escalation processes remain authoritative. This document is not a real hospital policy.",
  },
  {
    id: "demo-ai-governance-001",
    title: "HIVE Demo Clinical AI Governance Standard",
    version: "Demo 1.0",
    owner: "HIVE Intelligence Demonstration Library",
    updated: "2026-10-05",
    content:
      "Synthetic demonstration policy. AI-generated clinical content is decision support only. A qualified clinician must review outputs before they influence care or documentation. Patient-identifiable information must not be entered into demonstration environments. The system should record the model provider, model identifier, source documents retrieved and relevant audit events. Local policy and clinician judgement take precedence over AI output.",
  },
];

function terms(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 2);
}

export function retrieveKnowledge(query: string, limit = 3) {
  const queryTerms = new Set(terms(query));
  return knowledgeSources
    .map((source) => {
      const haystack = new Set(terms(`${source.title} ${source.content}`));
      let score = 0;
      for (const term of queryTerms) if (haystack.has(term)) score += 1;
      return { source, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.source);
}
