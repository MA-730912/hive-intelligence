"use client";
import {useMemo,useState} from "react";
import MonitorScreen from "./MonitorScreen";
import VentilatorPanel,{type VentSettings} from "./VentilatorPanel";
import InstructorPhysiology from "./InstructorPhysiology";
import VirtualTeamPanel from "./VirtualTeamPanel";
import DebriefPanel from "./DebriefPanel";
import {septicShockSimulation as scenario} from "@/lib/simulation/scenarios/septic-shock";
import {generateVariableLabSet} from "@/lib/simulation/lab-engine";
import {applyMedicationEffect} from "@/lib/simulation/medication-engine";
import type {LabSet,SimulationVitals} from "@/lib/simulation/types";

export default function SimulationSession(){
  const [stateIndex,setStateIndex]=useState(0);
  const [mode,setMode]=useState<"learner"|"instructor">("learner");
  const [messages,setMessages]=useState<string[]>([]);
  const [score,setScore]=useState(0);
  const [releasedLabs,setReleasedLabs]=useState<LabSet[]>([]);
  const [releasedImaging,setReleasedImaging]=useState<string[]>([]);
  const [drawNumber,setDrawNumber]=useState(0);
  const [currentVitals,setCurrentVitals]=useState<SimulationVitals>(scenario.states[0].vitals);
  const [ventSettings,setVentSettings]=useState<VentSettings>({fio2:0.60,vt:450,rate:18,peep:8,ppeak:24});
  const state=scenario.states[stateIndex];
  const intubated=state.id==="intubated"||state.id==="recovery";

  const eventLog=useMemo(()=>messages.slice().reverse(),[messages]);
  function log(value:string){setMessages(v=>[...v,`${new Date().toLocaleTimeString()} — ${value}`]);}
  function award(delta:number){setScore(v=>Math.max(0,Math.min(100,v+delta)));}

  function changeState(index:number){
    const next=scenario.states[index];
    setStateIndex(index);
    setCurrentVitals(next.vitals);
    setReleasedLabs([]);
    log(`Instructor changed state to ${next.label}`);
  }

  function giveMedication(name:string,dose:string,route:string){
    const result=applyMedicationEffect(name,currentVitals,state.id);
    setCurrentVitals(result.vitals);
    award(result.scoreDelta);
    log(`Medication: ${name} — ${dose} ${route}. ${result.feedback}`);
  }

  function requestLab(){
    const base=state.labs[0];
    if(!base) return;
    const nextDraw=drawNumber+1;
    setDrawNumber(nextDraw);
    const generated=generateVariableLabSet(base,`${scenario.id}:90kg`,nextDraw);
    setReleasedLabs(v=>[...v,generated]);
    award(2);
    log(`Lab requested: ${generated.name}`);
  }

  function teamAction(role:string,action:string){
    log(`${role}: ${action}`);
    if(action==="Check allergy") award(8);
    else if(action==="Accept for theatre") award(15);
    else if(action==="Accept ICU admission") award(8);
    else if(action==="Review antimicrobial plan") award(6);
    else if(action==="Prepare adrenaline") award(5);
    else award(1);
  }

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
        <MonitorScreen vitals={currentVitals}/>
        {intubated&&<div style={{marginTop:18}}><VentilatorPanel settings={ventSettings} etco2={currentVitals.etco2??36}/></div>}

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Resuscitation actions</div>
          <div className="chips" style={{marginTop:12}}>
            {scenario.medications.map(m=><button key={m.name} className="btn" onClick={()=>giveMedication(m.name,m.dose,m.route)}>{m.name}</button>)}
            <button className="btn" onClick={()=>{log("Airway assessment performed");award(4)}}>Assess airway</button>
            <button className="btn" onClick={()=>{log("Surgical team called for urgent source control");award(12)}}>Call surgery</button>
            <button className="btn" onClick={()=>{log("ICU referral placed");award(6)}}>Call ICU</button>
          </div>
        </div>

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Investigations</div>
          <div className="chips" style={{marginTop:12}}>
            <button className="btn" onClick={requestLab}>Request current blood panel</button>
            {scenario.imaging.map(i=><button className="btn" key={i.name} onClick={()=>{setReleasedImaging(v=>v.includes(i.name)?v:[...v,i.name]);log(`Imaging requested: ${i.name}`);award(1)}}>{i.name}</button>)}
          </div>

          {releasedLabs.map(l=><div className="message ai" key={l.name} style={{marginTop:14}}>
            <strong>{l.name}</strong>
            <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(3,1fr)"}}>
              {l.values.map(v=><div key={v.label}><span className="muted">{v.label}</span><div><strong>{v.value}</strong>{v.flag&&<span className="chip" style={{marginLeft:6}}>{v.flag}</span>}</div></div>)}
            </div>
            <p className="muted" style={{fontSize:11}}>Synthetic values include controlled patient-to-patient / draw-to-draw variation around the scenario state.</p>
          </div>)}

          {scenario.imaging.filter(i=>releasedImaging.includes(i.name)).map(i=><div className="message ai" key={i.name} style={{marginTop:14}}><strong>{i.name}</strong><p>{i.report}</p></div>)}
        </div>
      </section>

      <aside>
        <VirtualTeamPanel onAction={teamAction}/>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Current bedside cue</div>
          <div className="message ai"><strong>Virtual Nurse:</strong><p>{state.nurseCue}</p></div>
        </div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Event log</div>
          <h3>Live actions</h3>
          {eventLog.length===0?<p className="muted">No actions yet.</p>:eventLog.slice(0,10).map((e,i)=><p className="muted" key={i}>{e}</p>)}
        </div>
      </aside>
    </div>:<div className="chat">
      <section>
        <div className="card">
          <div className="eyebrow">Instructor controls</div>
          <h3>Scenario state machine</h3>
          {scenario.states.map((s,i)=><button key={s.id} className={`btn ${i===stateIndex?"primary":""}`} style={{display:"flex",width:"100%",justifyContent:"space-between",marginBottom:10}} onClick={()=>changeState(i)}><span>{i+1}. {s.label}</span><span>{s.vitals.sbp}/{s.vitals.dbp} · HR {s.vitals.hr} · SpO₂ {s.vitals.spo2}%</span></button>)}
          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <div className="eyebrow">Manual event triggers</div>
          <div className="chips" style={{marginTop:12}}>
            {["Anaphylaxis declared","Adrenaline effective","Shock worsens","Patient intubated","Surgery accepts","Source control achieved","Begin recovery"].map(v=><button className="btn" key={v} onClick={()=>{log(`Instructor trigger: ${v}`);if(v==="Source control achieved")award(15)}}>{v}</button>)}
          </div>
        </div>
        <InstructorPhysiology vitals={currentVitals} onChange={setCurrentVitals}/>
        {intubated&&<div style={{marginTop:18}}><VentilatorPanel settings={ventSettings} onChange={setVentSettings} editable etco2={currentVitals.etco2??36}/></div>}
      </section>

      <aside>
        <MonitorScreen vitals={currentVitals}/>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Instructor notes</div>
          <p className="muted">{state.summary}</p>
          <p className="muted">Nurse cue: {state.nurseCue}</p>
          <p className="muted">Manual vital overrides affect the monitor immediately and do not alter the scenario template.</p>
        </div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Recent actions</div>
          {eventLog.slice(0,8).map((e,i)=><p className="muted" key={i}>{e}</p>)}
        </div>
      </aside>
    </div>}

    <DebriefPanel score={score} events={messages}/>
  </main>
}
