"use client";
import {useMemo,useState} from "react";
import MonitorScreen from "./MonitorScreen";
import VentilatorPanel from "./VentilatorPanel";
import {septicShockSimulation as scenario} from "@/lib/simulation/scenarios/septic-shock";

export default function SimulationSession(){
  const [stateIndex,setStateIndex]=useState(0);
  const [mode,setMode]=useState<"learner"|"instructor">("learner");
  const [messages,setMessages]=useState<string[]>([]);
  const [releasedLabs,setReleasedLabs]=useState<string[]>([]);
  const [releasedImaging,setReleasedImaging]=useState<string[]>([]);
  const state=scenario.states[stateIndex];
  const intubated=state.id==="intubated"||state.id==="recovery";

  const eventLog=useMemo(()=>messages.slice().reverse(),[messages]);
  function log(value:string){setMessages(v=>[...v,`${new Date().toLocaleTimeString()} — ${value}`]);}

  return <main className="section">
    <div className="toolbar">
      <div><div className="eyebrow">HIVE Simulation Studio • {scenario.room}</div><h2 style={{margin:"6px 0"}}>{scenario.title}</h2></div>
      <div className="actions" style={{marginTop:0}}>
        <button className={`btn ${mode==="learner"?"primary":""}`} onClick={()=>setMode("learner")}>Learner View</button>
        <button className={`btn ${mode==="instructor"?"primary":""}`} onClick={()=>setMode("instructor")}>Instructor Console</button>
      </div>
    </div>

    <div className="demo-banner"><strong>Synthetic high-fidelity demo:</strong> {scenario.patient.age}-year-old {scenario.patient.sex.toLowerCase()}, {scenario.patient.weightKg} kg. Current state: <strong>{state.label}</strong> — {state.summary}</div>

    {mode==="learner"?<div className="chat">
      <section>
        <MonitorScreen vitals={state.vitals}/>
        {intubated&&<div style={{marginTop:18}}><VentilatorPanel/></div>}

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Resuscitation actions</div>
          <div className="chips" style={{marginTop:12}}>
            {scenario.medications.map(m=><button key={m.name} className="btn" onClick={()=>log(`Medication selected: ${m.name} — ${m.dose} ${m.route}`)}>{m.name}</button>)}
            <button className="btn" onClick={()=>log("Airway assessment performed")}>Assess airway</button>
            <button className="btn" onClick={()=>log("Surgical team called for urgent source control")}>Call surgery</button>
            <button className="btn" onClick={()=>log("ICU referral placed")}>Call ICU</button>
          </div>
        </div>

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Investigations</div>
          <div className="chips" style={{marginTop:12}}>
            {state.labs.map(l=><button className="btn" key={l.name} onClick={()=>{setReleasedLabs(v=>v.includes(l.name)?v:[...v,l.name]);log(`Lab requested: ${l.name}`)}}>{l.name}</button>)}
            {scenario.imaging.map(i=><button className="btn" key={i.name} onClick={()=>{setReleasedImaging(v=>v.includes(i.name)?v:[...v,i.name]);log(`Imaging requested: ${i.name}`)}}>{i.name}</button>)}
          </div>
          {state.labs.filter(l=>releasedLabs.includes(l.name)).map(l=><div className="message ai" key={l.name} style={{marginTop:14}}><strong>{l.name}</strong><div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(3,1fr)"}}>{l.values.map(v=><div key={v.label}><span className="muted">{v.label}</span><div><strong>{v.value}</strong>{v.flag&&<span className="chip" style={{marginLeft:6}}>{v.flag}</span>}</div></div>)}</div></div>)}
          {scenario.imaging.filter(i=>releasedImaging.includes(i.name)).map(i=><div className="message ai" key={i.name} style={{marginTop:14}}><strong>{i.name}</strong><p>{i.report}</p></div>)}
        </div>
      </section>

      <aside>
        <div className="card">
          <div className="eyebrow">Virtual Nurse</div>
          <h3>Bedside assistant</h3>
          <div className="message ai"><strong>Nurse:</strong><p>{state.nurseCue}</p></div>
          {["Repeat observations","Prepare adrenaline","Insert second IV","Check glucose","Call theatre"].map(a=><button key={a} className="btn" style={{width:"100%",marginBottom:8}} onClick={()=>log(`Virtual nurse action: ${a}`)}>{a}</button>)}
        </div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Event log</div>
          <h3>Live actions</h3>
          {eventLog.length===0?<p className="muted">No actions yet.</p>:eventLog.slice(0,8).map((e,i)=><p className="muted" key={i}>{e}</p>)}
        </div>
      </aside>
    </div>:<div className="chat">
      <section className="card">
        <div className="eyebrow">Instructor controls</div>
        <h3>Scenario state machine</h3>
        {scenario.states.map((s,i)=><button key={s.id} className={`btn ${i===stateIndex?"primary":""}`} style={{display:"flex",width:"100%",justifyContent:"space-between",marginBottom:10}} onClick={()=>{setStateIndex(i);log(`Instructor changed state to ${s.label}`)}}><span>{i+1}. {s.label}</span><span>{s.vitals.sbp}/{s.vitals.dbp} · HR {s.vitals.hr} · SpO₂ {s.vitals.spo2}%</span></button>)}
        <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
        <div className="eyebrow">Manual event triggers</div>
        <div className="chips" style={{marginTop:12}}>
          {["Anaphylaxis declared","Adrenaline effective","Shock worsens","Patient intubated","Surgery accepts","Source control achieved","Begin recovery"].map(v=><button className="btn" key={v} onClick={()=>log(`Instructor trigger: ${v}`)}>{v}</button>)}
        </div>
      </section>
      <aside>
        <MonitorScreen vitals={state.vitals}/>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Instructor notes</div>
          <p className="muted">{state.summary}</p>
          <p className="muted">Nurse cue: {state.nurseCue}</p>
        </div>
      </aside>
    </div>}
  </main>
}
