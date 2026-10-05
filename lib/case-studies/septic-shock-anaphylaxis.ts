export const septicShockAnaphylaxisCase = {
  id: "septic-shock-anaphylaxis-dka-nec-fasc",
  title: "Septic Shock + DKA + Suspected Necrotising Fasciitis + Penicillin Anaphylaxis",
  subtitle: "Flagship multisystem emergency case study",
  patient: {
    age: 50,
    sex: "Male",
    weightKg: 90,
  },
  presentation:
    "A 50-year-old man weighing 90 kg presents critically unwell with severe left lower-leg pain, rapidly progressive swelling, fever, hypotension, tachycardia and confusion. Initial investigations are consistent with diabetic ketoacidosis. The limb examination raises concern for necrotising fasciitis. During early treatment he develops immediate anaphylaxis after exposure to a penicillin-class antibiotic.",
  observations: [
    "BP 78/46 mmHg",
    "HR 132/min",
    "RR 32/min",
    "SpO₂ 95% on room air",
    "Temperature 39.2 °C",
    "GCS 13",
  ],
  investigations: [
    "Glucose 31 mmol/L",
    "pH 7.08",
    "Bicarbonate 9 mmol/L",
    "Blood ketones 6.1 mmol/L",
    "Potassium 4.8 mmol/L",
  ],
  sourceConcern: [
    "Severe limb pain",
    "Pain out of proportion to examination",
    "Rapidly progressive swelling",
    "Mottled / concerning skin change",
    "Possible crepitus",
  ],
  anaphylaxisFeatures: [
    "Acute wheeze",
    "Flushing / urticaria",
    "Facial or airway swelling",
    "Abrupt worsening hypotension",
    "Temporal relationship to penicillin exposure",
  ],
  simultaneousThreats: [
    {
      title: "Anaphylactic shock",
      description:
        "Immediate recognition and treatment take priority when airway, breathing or circulation compromise develops after drug exposure.",
    },
    {
      title: "Septic shock",
      description:
        "Concurrent shock from severe infection requires resuscitation, haemodynamic support, appropriate non-penicillin antimicrobial therapy and rapid reassessment.",
    },
    {
      title: "Diabetic ketoacidosis",
      description:
        "DKA requires protocolised fluid, electrolyte and insulin management while accounting for the patient's shock state and potassium.",
    },
    {
      title: "Suspected necrotising fasciitis",
      description:
        "This is a source-control emergency requiring immediate surgical escalation; imaging should not delay theatre when clinical suspicion is high in an unstable patient.",
    },
  ],
  calculations: [
    {
      label: "DKA fixed-rate insulin example",
      formula: "0.1 units/kg/hour × 90 kg",
      result: "9 units/hour",
      note:
        "Educational calculation only. Start/withhold/adjust insulin and potassium replacement according to the approved local DKA protocol and current biochemistry.",
    },
    {
      label: "Adult IM adrenaline for anaphylaxis",
      formula: "Standard adult emergency dose",
      result: "0.5 mg IM using 1 mg/mL (1:1000) adrenaline",
      note:
        "May be repeated at approximately 5-minute intervals if life-threatening features persist, according to local anaphylaxis guidance. IV adrenaline infusions require experienced critical-care oversight and continuous monitoring.",
    },
  ],
  hiveExpectedPriorities: [
    "Recognise multiple simultaneous causes of shock rather than anchoring on sepsis or DKA alone.",
    "Treat life-threatening anaphylaxis immediately when it emerges.",
    "Continue septic-shock resuscitation and haemodynamic support in parallel.",
    "Escalate suspected necrotising fasciitis immediately for definitive surgical source control.",
    "Use a severe beta-lactam-allergy antimicrobial pathway and local microbiology / infectious-diseases guidance rather than inventing a regimen.",
    "Manage DKA using the organisation's approved protocol with frequent potassium, glucose, ketone, acid-base and fluid reassessment.",
    "Prepare for airway deterioration, invasive monitoring, vasopressor support, theatre and ICU.",
  ],
  timeline: [
    {
      time: "T0",
      event: "Arrival",
      detail: "Shock, severe limb pain, fever, DKA physiology and suspected deep soft-tissue infection.",
    },
    {
      time: "T+5 min",
      event: "Antimicrobial exposure",
      detail: "Penicillin-class antibiotic administered before allergy is recognised / reaction occurs.",
    },
    {
      time: "T+7 min",
      event: "Acute deterioration",
      detail: "Wheeze, flushing, facial swelling and worsening hypotension — anaphylaxis superimposed on septic shock.",
    },
    {
      time: "T+15 min",
      event: "Persistent critical illness",
      detail: "Requires parallel anaphylaxis treatment, sepsis resuscitation, vasopressor consideration, DKA management and source-control escalation.",
    },
    {
      time: "Next",
      event: "Definitive care",
      detail: "Emergency theatre / source control with ICU-level postoperative care as clinically indicated.",
    },
  ],
  learningObjectives: [
    "Recognise mixed shock and avoid diagnostic anchoring.",
    "Prioritise immediate anaphylaxis treatment without abandoning sepsis resuscitation.",
    "Integrate DKA management into a haemodynamically unstable patient.",
    "Recognise necrotising fasciitis as a time-critical surgical disease.",
    "Use allergy-aware antimicrobial decision support grounded in local policy.",
    "Demonstrate escalation, team leadership, closed-loop communication and structured handover.",
  ],
  debriefPoints: [
    "What clues suggested more than one shock process?",
    "When should anaphylaxis have been declared?",
    "How should the team balance DKA fluids with septic-shock resuscitation?",
    "What findings make necrotising fasciitis a clinical rather than imaging diagnosis?",
    "How should HIVE behave when the local antimicrobial guideline is unavailable or ambiguous?",
    "Which actions should be auditable in the HIVE Control Centre?",
  ],
  inpatientCourse: {
    admissionDiagnosis: [
      "Septic shock from severe left lower-limb soft-tissue infection / suspected necrotising fasciitis",
      "Diabetic ketoacidosis",
      "Anaphylaxis to a penicillin-class antibiotic during early treatment",
    ],
    icuStay: "Approximately 7 days in ICU for management of shock, DKA and postoperative critical care.",
    procedures: [
      "Urgent surgical debridement of the left lower leg for source control",
      "Ongoing negative-pressure wound therapy (VAC dressing)",
      "PICC line insertion for prolonged intravenous antimicrobial therapy",
    ],
    currentTherapy: [
      "IV vancomycin via PICC under HITH",
      "IV meropenem via PICC under HITH",
      "VAC dressing / wound management",
    ],
    resolvedOrImproved: [
      "Shock resolved sufficiently for discharge from ICU and hospital",
      "DKA resolved",
      "No ongoing anaphylaxis after the acute reaction",
    ],
    dischargeDestination: "Home under Hospital in the Home (HITH) with GP follow-up.",
    followUp: [
      "HITH for IV antibiotic administration, PICC care and clinical monitoring",
      "Wound / surgical team follow-up for VAC dressing and left-leg wound review",
      "GP follow-up for overall recovery, diabetes review and medication reconciliation",
      "Infectious Diseases / treating team oversight of antimicrobial duration and de-escalation as clinically indicated",
    ],
  },
  dischargeSummaryDemo: {
    generatedFrom: [
      "Initial emergency presentation",
      "ICU course",
      "Operative source-control history",
      "Current wound status",
      "Current IV antimicrobial therapy",
      "PICC / HITH plan",
      "Known severe drug allergy",
      "Follow-up requirements",
    ],
    summary: {
      patient: "50-year-old man, 90 kg",
      principalDiagnosis: "Septic shock secondary to severe left lower-limb soft-tissue infection / necrotising fasciitis requiring operative debridement.",
      additionalDiagnoses: [
        "Diabetic ketoacidosis — resolved during admission",
        "Immediate anaphylaxis to a penicillin-class antibiotic",
      ],
      hospitalCourse:
        "The patient presented critically unwell with septic shock, DKA and a rapidly progressive left lower-limb soft-tissue infection concerning for necrotising fasciitis. During early antimicrobial treatment he developed immediate anaphylaxis following exposure to a penicillin-class antibiotic. He required ICU admission for approximately one week for management of shock, DKA and postoperative critical care. Urgent surgical source control was undertaken with debridement of the left lower leg. He subsequently improved clinically and was transitioned to ongoing wound care with a VAC dressing.",
      procedures: [
        "Surgical debridement of left lower leg",
        "VAC / negative-pressure wound dressing",
        "PICC line placement",
      ],
      dischargeTreatment: [
        "IV vancomycin via PICC under HITH",
        "IV meropenem via PICC under HITH",
        "VAC dressing care under the treating wound / surgical plan",
      ],
      allergy:
        "Penicillin-class antibiotic — immediate anaphylaxis during this admission. This must remain prominently documented and reconciled across all care settings.",
      followUp: [
        "HITH: IV antibiotics, PICC monitoring and clinical review",
        "Surgical / wound service: VAC dressing and wound review",
        "General Practitioner: post-discharge review, diabetes follow-up and medication reconciliation",
        "Treating Infectious Diseases / hospital team: antimicrobial duration and modification according to microbiology, clinical response and local guidance",
      ],
      safetyNet: [
        "Urgent reassessment for fever, rigors, worsening leg pain/swelling, spreading erythema, wound deterioration or systemic illness",
        "Urgent review for PICC complications including pain, redness, swelling, leakage or line dysfunction",
        "Emergency care for any recurrent features of anaphylaxis",
        "Seek urgent care for recurrent hyperglycaemia, ketones, vomiting or symptoms concerning for DKA",
      ],
      provenanceNote:
        "This demonstration summary is generated only from the structured synthetic case facts supplied to HIVE. Culture results, antimicrobial doses, duration, discharge medications and laboratory values are intentionally not invented when absent from the source data.",
    },
  },
  safety:
    "Synthetic educational case only. It is designed to demonstrate HIVE Intelligence workflows and simulation capability. Real clinical care must follow current local protocols, senior clinician judgement and specialist advice.",
} as const;
