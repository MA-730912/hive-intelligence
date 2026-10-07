import type { ScenarioId } from "./scenarios";

export type Rhythm = "Sinus tachycardia" | "Sinus rhythm" | "VT" | "VF";
export type PatientState = {
  scenarioId: ScenarioId;
  hr:number; sbp:number; dbp:number; spo2:number; rr:number; temp:number; etco2:number;
  rhythm:Rhythm;
  airway:"Patent"|"Threatened"|"Intubated";
  perfusion:"Poor"|"Improving"|"Stable";
  elapsed:number;
  adrenalineDoses:number;
  fluidMl:number;
  oxygen:boolean;
};

export type Intervention =
  | "oxygen"
  | "fluid"
  | "adrenaline"
  | "noradrenaline"
  | "intubate"
  | "shock"
  | "reset";

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));

export function createPatient(scenarioId:ScenarioId):PatientState {
  if(scenarioId==="anaphylaxis") {
    return {
      scenarioId, hr:126, sbp:78, dbp:42, spo2:86, rr:32, temp:36.8, etco2:28,
      rhythm:"Sinus tachycardia", airway:"Threatened", perfusion:"Poor", elapsed:0,
      adrenalineDoses:0, fluidMl:0, oxygen:false
    };
  }
  return {
    scenarioId, hr:132, sbp:82, dbp:48, spo2:88, rr:30, temp:39.1, etco2:27,
    rhythm:"Sinus tachycardia", airway:"Patent", perfusion:"Poor", elapsed:0,
    adrenalineDoses:0, fluidMl:0, oxygen:false
  };
}

export const initialPatient = createPatient("septic-shock");

export function tickPatient(p:PatientState):PatientState {
  if (p.rhythm==="VF") return {
    ...p, hr:0, sbp:0, dbp:0,
    spo2:clamp(p.spo2-(p.elapsed%2===0?1:0),35,100),
    etco2:clamp(p.etco2-(p.elapsed%3===0?1:0),4,60),
    elapsed:p.elapsed+1
  };

  if(p.scenarioId==="anaphylaxis") {
    const untreated = p.adrenalineDoses===0;
    const airwayPenalty = untreated && p.elapsed>45 && p.elapsed%6===0;
    const pressurePenalty = untreated && p.elapsed>30 && p.elapsed%5===0;
    return {
      ...p,
      hr: clamp(p.hr + (untreated && p.elapsed%15===0 ? 1 : 0), 45, 190),
      sbp: clamp(p.sbp - (pressurePenalty ? 2 : 0), 45, 220),
      dbp: clamp(p.dbp - (pressurePenalty ? 1 : 0), 25, 140),
      spo2: clamp(p.spo2 - (airwayPenalty ? 1 : 0) + (p.oxygen && p.elapsed%4===0 ? 1 : 0), 55, 100),
      etco2: clamp(p.etco2 + (p.airway==="Intubated" && p.etco2<36 ? 1 : 0), 8, 60),
      elapsed:p.elapsed+1
    };
  }

  const poor = p.perfusion==="Poor";
  return {
    ...p,
    sbp:clamp(p.sbp-(poor && p.elapsed>30 && p.elapsed%8===0 ? 1 : 0),55,220),
    spo2:clamp(p.spo2+(p.oxygen && p.elapsed%5===0 ? 1 : 0)+(p.airway==="Intubated" && p.elapsed%4===0 ? 1 : 0),70,100),
    elapsed:p.elapsed+1
  };
}

export function applyIntervention(p:PatientState, action:Intervention):{state:PatientState; note:string}{
  switch(action){
    case "oxygen":
      return {state:{...p,oxygen:true,spo2:clamp(p.spo2+4,0,100)},note:"High-flow oxygen applied"};

    case "fluid":
      return {
        state:{
          ...p,
          fluidMl:p.fluidMl+500,
          sbp:clamp(p.sbp+(p.scenarioId==="anaphylaxis"?12:9),0,220),
          dbp:clamp(p.dbp+(p.scenarioId==="anaphylaxis"?6:5),0,140),
          perfusion:"Improving"
        },
        note:"500 mL balanced crystalloid given"
      };

    case "adrenaline":
      if(p.scenarioId==="anaphylaxis") {
        return {
          state:{
            ...p,
            adrenalineDoses:p.adrenalineDoses+1,
            hr:clamp(p.hr-10,0,220),
            sbp:clamp(p.sbp+24,0,240),
            dbp:clamp(p.dbp+12,0,160),
            spo2:clamp(p.spo2+6,0,100),
            airway:p.airway==="Threatened"?"Patent":p.airway,
            perfusion:"Improving"
          },
          note:"IM adrenaline administered — airway and circulation improving"
        };
      }
      return {state:{...p,hr:clamp(p.hr+10,0,220),sbp:clamp(p.sbp+18,0,240),perfusion:"Improving"},note:"Adrenaline administered"};

    case "noradrenaline":
      return {state:{...p,sbp:clamp(p.sbp+20,0,240),dbp:clamp(p.dbp+10,0,160),perfusion:"Stable"},note:"Noradrenaline infusion started"};

    case "intubate":
      return {state:{...p,airway:"Intubated",spo2:clamp(p.spo2+7,0,100),rr:16,etco2:35},note:"RSI completed — airway secured"};

    case "shock":
      if(p.rhythm==="VF" || p.rhythm==="VT") return {state:{...p,rhythm:"Sinus rhythm",hr:96,sbp:104,dbp:64,spo2:94,perfusion:"Improving"},note:"200 J shock delivered — ROSC"};
      return {state:p,note:"Shock delivered — no shockable rhythm"};

    case "reset":
      return {state:createPatient(p.scenarioId),note:"Scenario reset"};
  }
}

export type InstructorAction = "deteriorate"|"improve"|"vf"|"vt"|"desaturate"|"hypotension"|"reset";

export function applyInstructorAction(p:PatientState, action:InstructorAction):{state:PatientState;note:string}{
  switch(action){
    case "deteriorate":
      return {state:{...p,hr:clamp(p.hr+18,0,220),sbp:clamp(p.sbp-20,0,240),dbp:clamp(p.dbp-10,0,160),spo2:clamp(p.spo2-8,0,100),perfusion:"Poor"},note:"INSTRUCTOR: global deterioration"};
    case "improve":
      return {state:{...p,hr:Math.max(88,p.hr-12),sbp:Math.max(105,p.sbp+18),dbp:Math.max(62,p.dbp+10),spo2:Math.max(95,p.spo2),perfusion:"Stable"},note:"INSTRUCTOR: patient improved"};
    case "vf":
      return {state:{...p,rhythm:"VF",hr:0,sbp:0,dbp:0,perfusion:"Poor"},note:"INSTRUCTOR: ventricular fibrillation"};
    case "vt":
      return {state:{...p,rhythm:"VT",hr:188,sbp:62,dbp:36,perfusion:"Poor"},note:"INSTRUCTOR: ventricular tachycardia"};
    case "desaturate":
      return {state:{...p,spo2:clamp(p.spo2-12,0,100),airway:p.airway==="Intubated"?"Intubated":"Threatened"},note:"INSTRUCTOR: acute desaturation"};
    case "hypotension":
      return {state:{...p,sbp:clamp(p.sbp-25,0,240),dbp:clamp(p.dbp-12,0,160),perfusion:"Poor"},note:"INSTRUCTOR: acute hypotension"};
    case "reset":
      return {state:createPatient(p.scenarioId),note:"INSTRUCTOR: scenario reset"};
  }
}
