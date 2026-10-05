import type {SimulationScenario} from "../types";

export const septicShockSimulation: SimulationScenario = {
  id:"septic-shock-anaphylaxis-dka-nec-fasc",
  title:"Septic Shock + DKA + Anaphylaxis + Necrotising Fasciitis",
  subtitle:"HIVE Simulation Studio flagship resuscitation scenario",
  patient:{age:50,sex:"Male",weightKg:90},
  room:"Emergency Department Resuscitation Bay 1",
  states:[
    {
      id:"arrival",
      label:"Arrival",
      summary:"Shock, DKA physiology and rapidly progressive left-leg infection.",
      vitals:{hr:132,sbp:78,dbp:46,rr:32,spo2:95,etco2:null,temp:39.2,gcs:13,rhythm:"Sinus tachycardia"},
      nurseCue:"He is confused, clammy and says the left leg pain is unbearable.",
      labs:[{name:"Initial VBG",values:[
        {label:"pH",value:"7.08",flag:"critical"},
        {label:"HCO3",value:"9 mmol/L",flag:"low"},
        {label:"Glucose",value:"31 mmol/L",flag:"high"},
        {label:"Ketones",value:"6.1 mmol/L",flag:"high"},
        {label:"Lactate",value:"5.8 mmol/L",flag:"high"},
        {label:"K+",value:"4.8 mmol/L"}
      ]}]
    },
    {
      id:"anaphylaxis",
      label:"Acute anaphylaxis",
      summary:"Immediate hypersensitivity reaction superimposed on septic shock.",
      vitals:{hr:148,sbp:62,dbp:34,rr:36,spo2:88,etco2:null,temp:39.1,gcs:12,rhythm:"Sinus tachycardia"},
      nurseCue:"He has developed wheeze, flushing and facial swelling. Blood pressure is falling.",
      labs:[{name:"Repeat VBG",values:[
        {label:"pH",value:"7.04",flag:"critical"},
        {label:"HCO3",value:"8 mmol/L",flag:"low"},
        {label:"Glucose",value:"29 mmol/L",flag:"high"},
        {label:"Lactate",value:"7.1 mmol/L",flag:"high"}
      ]}]
    },
    {
      id:"post-adrenaline",
      label:"Post adrenaline / resuscitation",
      summary:"Anaphylaxis improves but septic shock and source-control problem persist.",
      vitals:{hr:128,sbp:92,dbp:54,rr:28,spo2:96,etco2:null,temp:39.0,gcs:14,rhythm:"Sinus tachycardia"},
      nurseCue:"Wheeze has improved. He is still hypotensive and the leg looks worse.",
      labs:[{name:"Repeat VBG",values:[
        {label:"pH",value:"7.12",flag:"low"},
        {label:"HCO3",value:"11 mmol/L",flag:"low"},
        {label:"Glucose",value:"24 mmol/L",flag:"high"},
        {label:"Lactate",value:"5.2 mmol/L",flag:"high"}
      ]}]
    },
    {
      id:"intubated",
      label:"Intubated / peri-operative",
      summary:"Airway secured; ongoing shock management while preparing for urgent source control.",
      vitals:{hr:118,sbp:98,dbp:58,rr:18,spo2:99,etco2:36,temp:38.7,gcs:3,rhythm:"Sinus tachycardia"},
      nurseCue:"Tube secured at the teeth. Ventilator connected. Theatre and ICU are ready.",
      labs:[{name:"ABG after intubation",values:[
        {label:"pH",value:"7.22",flag:"low"},
        {label:"PaCO2",value:"38 mmHg"},
        {label:"HCO3",value:"15 mmol/L",flag:"low"},
        {label:"Lactate",value:"3.9 mmol/L",flag:"high"}
      ]}]
    },
    {
      id:"recovery",
      label:"Post source-control recovery",
      summary:"After debridement and ongoing ICU care, physiology trends toward recovery.",
      vitals:{hr:96,sbp:112,dbp:68,rr:16,spo2:98,etco2:38,temp:37.6,gcs:11,rhythm:"Sinus rhythm"},
      nurseCue:"He is haemodynamically improved following source control. Vasopressor requirement is falling.",
      labs:[{name:"Recovery bloods",values:[
        {label:"pH",value:"7.34"},
        {label:"HCO3",value:"21 mmol/L",flag:"low"},
        {label:"Glucose",value:"12 mmol/L",flag:"high"},
        {label:"Ketones",value:"0.9 mmol/L"},
        {label:"Lactate",value:"1.9 mmol/L"}
      ]}]
    }
  ],
  medications:[
    {name:"Adrenaline",dose:"0.5 mg",route:"IM",note:"Adult anaphylaxis emergency dose; repeat according to local protocol if required."},
    {name:"Hartmann's / balanced crystalloid",dose:"500 mL bolus",route:"IV",note:"Titrate to clinical response and local shock/DKA guidance."},
    {name:"Insulin infusion",dose:"9 units/hour example",route:"IV",note:"0.1 units/kg/hour for 90 kg; verify potassium and local DKA protocol."},
    {name:"Vancomycin",dose:"Per local severe-infection protocol",route:"IV",note:"Dose and monitoring require local guideline / pharmacy support."},
    {name:"Meropenem",dose:"Per local severe-infection protocol",route:"IV",note:"Use only if appropriate to allergy assessment and local antimicrobial guidance."},
    {name:"Noradrenaline",dose:"Titrate",route:"IV infusion",note:"Critical-care vasopressor; titrate to haemodynamic target."}
  ],
  imaging:[
    {name:"Portable chest X-ray",report:"No focal consolidation. If intubated, endotracheal tube position is satisfactory in this synthetic scenario."},
    {name:"Left leg CT",report:"Extensive soft-tissue oedema with fascial thickening and gas locules concerning for necrotising soft-tissue infection. In an unstable patient, imaging must not delay surgical source control."},
    {name:"Bedside echo",report:"Hyperdynamic LV with low filling; no large pericardial effusion. Interpret in clinical context."}
  ]
};
