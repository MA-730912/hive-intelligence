export type PatientState = {
  hr:number; sbp:number; dbp:number; spo2:number; rr:number; temp:number; etco2:number;
  rhythm:"Sinus tachycardia"|"Sinus rhythm"|"VT"|"VF";
  airway:"Patent"|"Threatened"|"Intubated";
  perfusion:"Poor"|"Improving"|"Stable";
  elapsed:number;
};

export type Intervention =
  | "oxygen"
  | "fluid"
  | "adrenaline"
  | "noradrenaline"
  | "intubate"
  | "shock"
  | "reset";

export const initialPatient: PatientState = {
  hr:132, sbp:82, dbp:48, spo2:88, rr:30, temp:39.1, etco2:27,
  rhythm:"Sinus tachycardia", airway:"Patent", perfusion:"Poor", elapsed:0
};

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export function tickPatient(p:PatientState):PatientState {
  if (p.rhythm==="VF") return {...p, hr:0, sbp:0, dbp:0, spo2:clamp(p.spo2-1,40,100), etco2:clamp(p.etco2-1,4,60), elapsed:p.elapsed+1};
  const drift = p.perfusion==="Poor" ? -1 : 0;
  return {
    ...p,
    sbp:clamp(p.sbp + (p.elapsed%8===0 ? drift : 0),55,220),
    spo2:clamp(p.spo2 + (p.airway==="Intubated" ? 1 : 0),70,100),
    elapsed:p.elapsed+1
  };
}

export function applyIntervention(p:PatientState, action:Intervention):{state:PatientState; note:string}{
  switch(action){
    case "oxygen": return {state:{...p,spo2:clamp(p.spo2+5,0,100)},note:"High-flow oxygen applied"};
    case "fluid": return {state:{...p,sbp:clamp(p.sbp+9,0,220),dbp:clamp(p.dbp+5,0,140),perfusion:"Improving"},note:"500 mL balanced crystalloid given"};
    case "adrenaline": return {state:{...p,hr:clamp(p.hr+10,0,220),sbp:clamp(p.sbp+18,0,240),spo2:clamp(p.spo2+3,0,100),perfusion:"Improving"},note:"Adrenaline administered"};
    case "noradrenaline": return {state:{...p,sbp:clamp(p.sbp+20,0,240),dbp:clamp(p.dbp+10,0,160),perfusion:"Stable"},note:"Noradrenaline infusion started"};
    case "intubate": return {state:{...p,airway:"Intubated",spo2:clamp(p.spo2+7,0,100),rr:16,etco2:35},note:"RSI completed — airway secured"};
    case "shock":
      if(p.rhythm==="VF" || p.rhythm==="VT") return {state:{...p,rhythm:"Sinus rhythm",hr:96,sbp:104,dbp:64,spo2:94,perfusion:"Improving"},note:"200 J shock delivered — ROSC"};
      return {state:p,note:"Shock delivered — no indication"};
    case "reset": return {state:{...initialPatient},note:"Scenario reset"};
  }
}
