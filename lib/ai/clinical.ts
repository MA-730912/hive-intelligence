export type ClinicalAnalysis = {
  summary: string;
  acuity: "critical" | "high" | "moderate" | "low" | "unclear";
  redFlags: string[];
  differentials: Array<{ diagnosis: string; rationale: string }>;
  immediatePriorities: string[];
  isbar: {
    identification: string;
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
  safetyNotes: string[];
  meta: {
    provider: string;
    model: string;
    mode: "live" | "mock";
  };
};

const SYSTEM_PROMPT = `You are HIVE Intelligence, a clinical reasoning assistant for a clinician-facing demonstration.

Return ONLY valid JSON with exactly this shape:
{
  "summary": "short clinical synthesis",
  "acuity": "critical|high|moderate|low|unclear",
  "redFlags": ["..."],
  "differentials": [{"diagnosis":"...","rationale":"..."}],
  "immediatePriorities": ["..."],
  "isbar": {
    "identification":"...",
    "situation":"...",
    "background":"...",
    "assessment":"...",
    "recommendation":"..."
  },
  "safetyNotes": ["..."]
}

Rules:
- Treat all input as a synthetic educational/demo case.
- Do not claim certainty when data are incomplete.
- Prioritise immediately life-threatening problems first.
- Do not invent tests, observations, history, medications, allergies, or results not provided.
- Use concise clinician-facing language.
- The output is decision support only and must explicitly preserve clinician review.
- Do not include markdown or text outside the JSON object.`;

function stripCodeFence(value: string) {
  return value.trim().replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/, "");
}

function mockAnalysis(): Omit<ClinicalAnalysis, "meta"> {
  return {
    summary:
      "Synthetic case demonstrates haemodynamic instability with an anterior STEMI pattern and clinical shock. Immediate resuscitation and an emergency reperfusion pathway are priorities while alternative or mechanical causes of shock are actively assessed.",
    acuity: "critical",
    redFlags: [
      "Hypotension with signs of poor peripheral perfusion",
      "Anterior ST-segment elevation",
      "Tachycardia and dyspnoea",
    ],
    differentials: [
      {
        diagnosis: "Acute anterior STEMI with cardiogenic shock",
        rationale:
          "Chest pain, anterior ST elevation, hypotension and cool peripheries strongly support acute myocardial infarction complicated by shock.",
      },
      {
        diagnosis: "Mechanical complication of acute myocardial infarction",
        rationale:
          "Severe haemodynamic compromise should prompt rapid assessment for acute mitral regurgitation, ventricular septal defect or free-wall complication where clinically appropriate.",
      },
      {
        diagnosis: "Alternative obstructive or vascular shock process",
        rationale:
          "If the clinical picture is discordant, consider other immediately dangerous causes such as pulmonary embolism, aortic catastrophe or tamponade.",
      },
    ],
    immediatePriorities: [
      "Activate local emergency STEMI/reperfusion pathway and senior cardiology support.",
      "Continuous cardiac, blood pressure and oxygen saturation monitoring with immediate resuscitation capability.",
      "Obtain IV access and targeted investigations without delaying reperfusion.",
      "Use bedside assessment, including focused echocardiography where available and appropriate, to clarify shock physiology.",
      "Escalate haemodynamic support according to local protocols and specialist advice.",
    ],
    isbar: {
      identification: "64-year-old synthetic ED patient with acute chest pain and shock.",
      situation: "Anterior STEMI pattern with BP 82/54, HR 126 and clinical hypoperfusion.",
      background: "No additional history, medications, allergies or previous cardiac history supplied.",
      assessment: "Critical presentation most consistent with acute anterior myocardial infarction complicated by shock; mechanical and alternative catastrophic causes require consideration.",
      recommendation: "Immediate resuscitation, STEMI pathway activation, senior cardiology involvement and urgent reperfusion planning with concurrent assessment of shock mechanism.",
    },
    safetyNotes: [
      "Synthetic demonstration only; not a patient-specific treatment recommendation.",
      "Clinician review and local emergency/cardiology protocols remain authoritative.",
      "Do not delay time-critical escalation or reperfusion while using an AI system.",
    ],
  };
}

export async function analyseClinicalCase(caseText: string): Promise<ClinicalAnalysis> {
  const provider = process.env.HIVE_AI_PROVIDER || "openai-compatible";
  const model = process.env.HIVE_AI_MODEL || "";
  const baseUrl = process.env.HIVE_AI_BASE_URL || "";
  const apiKey = process.env.HIVE_AI_API_KEY || "";
  const allowMock = process.env.HIVE_AI_ALLOW_MOCK === "true";

  if (!baseUrl || !apiKey || !model) {
    if (!allowMock) {
      throw new Error(
        "HIVE AI is not configured. Set HIVE_AI_BASE_URL, HIVE_AI_API_KEY and HIVE_AI_MODEL."
      );
    }
    return {
      ...mockAnalysis(),
      meta: { provider: "HIVE mock provider", model: "synthetic-demo", mode: "mock" },
    };
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyse this synthetic clinical case:\n\n${caseText}`,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider error ${response.status}: ${detail.slice(0, 300)}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("AI provider returned no message content.");
  }

  const parsed = JSON.parse(stripCodeFence(content));
  return {
    ...parsed,
    meta: { provider, model, mode: "live" },
  } as ClinicalAnalysis;
}
