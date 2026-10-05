import type {SimulationVitals} from "./types";

export type MedicationEffect = {
  vitals: SimulationVitals;
  scoreDelta: number;
  feedback: string;
};

function clamp(v:number,min:number,max:number){return Math.max(min,Math.min(max,v));}

export function applyMedicationEffect(name:string,v:SimulationVitals,stateId:string):MedicationEffect{
  const next={...v};

  if(name==="Adrenaline"){
    if(stateId==="anaphylaxis"){
      next.sbp=clamp(v.sbp+24,40,220);
      next.dbp=clamp(v.dbp+14,20,140);
      next.spo2=clamp(v.spo2+6,50,100);
      next.hr=clamp(v.hr-10,30,220);
      return {vitals:next,scoreDelta:20,feedback:"Appropriate anaphylaxis treatment: haemodynamics and oxygenation improve in this synthetic model."};
    }
    next.hr=clamp(v.hr+12,30,220);
    next.sbp=clamp(v.sbp+8,40,220);
    return {vitals:next,scoreDelta:0,feedback:"Adrenaline given outside the scripted anaphylaxis state; instructor review required."};
  }

  if(name==="Hartmann's / balanced crystalloid"){
    next.sbp=clamp(v.sbp+8,40,220);
    next.dbp=clamp(v.dbp+4,20,140);
    next.hr=clamp(v.hr-4,30,220);
    return {vitals:next,scoreDelta:6,feedback:"Synthetic fluid response applied. Reassess perfusion and avoid assuming a fixed real-patient response."};
  }

  if(name==="Insulin infusion"){
    return {vitals:next,scoreDelta:stateId==="arrival"||stateId==="post-adrenaline"?8:3,feedback:"DKA treatment logged. Biochemical response appears on subsequent generated labs rather than immediately on the monitor."};
  }

  if(name==="Vancomycin"||name==="Meropenem"){
    return {vitals:next,scoreDelta:5,feedback:"Antimicrobial action logged. This simulator does not infer dose appropriateness without the local protocol."};
  }

  if(name==="Noradrenaline"){
    next.sbp=clamp(v.sbp+14,40,220);
    next.dbp=clamp(v.dbp+9,20,140);
    return {vitals:next,scoreDelta:6,feedback:"Synthetic vasopressor response applied for simulation purposes."};
  }

  return {vitals:next,scoreDelta:0,feedback:"Action recorded."};
}
