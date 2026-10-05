"use client";
import type {SimulationVitals} from "@/lib/simulation/types";

export default function InstructorPhysiology({vitals,onChange}:{vitals:SimulationVitals;onChange:(v:SimulationVitals)=>void}){
  const fields:Array<[keyof SimulationVitals,string,number,number,number]>=[
    ["hr","HR",20,220,1],["sbp","SBP",40,240,1],["dbp","DBP",20,160,1],["rr","RR",4,60,1],
    ["spo2","SpO₂",50,100,1],["temp","Temp",30,43,0.1],["gcs","GCS",3,15,1]
  ];

  return <div className="card" style={{marginTop:18}}>
    <div className="eyebrow">Manual physiology override</div>
    <h3>Instructor live controls</h3>
    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
      {fields.map(([key,label,min,max,step])=><label className="message" key={String(key)}>
        <div className="toolbar" style={{marginBottom:6}}><span className="muted">{label}</span><strong>{String(vitals[key])}</strong></div>
        <input type="range" min={min} max={max} step={step} value={Number(vitals[key])}
          onChange={e=>onChange({...vitals,[key]:Number(e.target.value)})}
          style={{width:"100%"}}/>
      </label>)}
      <label className="message">
        <div className="muted" style={{marginBottom:8}}>ETCO₂</div>
        <input type="number" value={vitals.etco2??""} placeholder="Not connected"
          onChange={e=>onChange({...vitals,etco2:e.target.value===""?null:Number(e.target.value)})}
          style={{width:"100%",background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8,padding:9}}/>
      </label>
      <label className="message">
        <div className="muted" style={{marginBottom:8}}>Rhythm</div>
        <select value={vitals.rhythm} onChange={e=>onChange({...vitals,rhythm:e.target.value})}
          style={{width:"100%",background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8,padding:9}}>
          {["Sinus rhythm","Sinus tachycardia","Atrial fibrillation","SVT","Broad complex tachycardia","PEA"].map(r=><option key={r}>{r}</option>)}
        </select>
      </label>
    </div>
  </div>
}
