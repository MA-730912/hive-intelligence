import type {SimulationVitals} from "./types";

export type AutoTriggerContext={
  elapsedSeconds:number;
  stateId:string;
  events:string[];
  fired:string[];
  vitals:SimulationVitals;
};

export type AutoTriggerResult={
  id:string;
  label:string;
  scoreDelta:number;
  vitals:SimulationVitals;
  suggestedStateIndex?:number;
};

const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));

function has(events:string[],needle:string){
  return events.some(e=>e.toLowerCase().includes(needle.toLowerCase()));
}

export function evaluateAutoTriggers(ctx:AutoTriggerContext):AutoTriggerResult[]{
  const out:AutoTriggerResult[]=[];
  const already=(id:string)=>ctx.fired.includes(id);

  if(ctx.stateId==="anaphylaxis" && ctx.elapsedSeconds>=120 && !already("delayed-adrenaline") && !has(ctx.events,"Medication: Adrenaline")){
    out.push({
      id:"delayed-adrenaline",
      label:"Auto-deterioration: anaphylaxis untreated for 2 minutes — worsening hypotension and hypoxaemia.",
      scoreDelta:-15,
      vitals:{
        ...ctx.vitals,
        sbp:clamp(ctx.vitals.sbp-14,35,240),
        dbp:clamp(ctx.vitals.dbp-8,20,160),
        spo2:clamp(ctx.vitals.spo2-5,50,100),
        hr:clamp(ctx.vitals.hr+8,20,220),
      }
    });
  }

  if(ctx.elapsedSeconds>=300 && !already("delayed-source-control") && !has(ctx.events,"Surgical team called for urgent source control") && !has(ctx.events,"Accept for theatre")){
    out.push({
      id:"delayed-source-control",
      label:"Auto-deterioration: source-control escalation delayed beyond 5 minutes — septic shock worsens.",
      scoreDelta:-12,
      vitals:{
        ...ctx.vitals,
        sbp:clamp(ctx.vitals.sbp-12,35,240),
        dbp:clamp(ctx.vitals.dbp-7,20,160),
        hr:clamp(ctx.vitals.hr+7,20,220),
        temp:clamp(ctx.vitals.temp+0.2,30,43),
      }
    });
  }

  if(ctx.elapsedSeconds>=420 && !already("delayed-icu") && !has(ctx.events,"ICU referral placed") && !has(ctx.events,"Accept ICU admission")){
    out.push({
      id:"delayed-icu",
      label:"Auto-trigger: critical-care escalation remains outstanding at 7 minutes.",
      scoreDelta:-6,
      vitals:{...ctx.vitals}
    });
  }

  if(ctx.elapsedSeconds>=600 && !already("progressive-shock") && ctx.stateId!=="recovery" && !has(ctx.events,"Source control achieved")){
    out.push({
      id:"progressive-shock",
      label:"Auto-deterioration: ongoing untreated source problem — progressive shock.",
      scoreDelta:-10,
      vitals:{
        ...ctx.vitals,
        sbp:clamp(ctx.vitals.sbp-10,35,240),
        dbp:clamp(ctx.vitals.dbp-5,20,160),
        hr:clamp(ctx.vitals.hr+6,20,220),
        gcs:clamp(ctx.vitals.gcs-1,3,15),
      }
    });
  }

  return out;
}
