"use client";

import Link from "next/link";
import {useEffect,useMemo,useRef,useState} from "react";
import {applyInstructorAction,applyIntervention,createPatient,tickPatient,type InstructorAction,type Intervention} from "@/lib/sim";
import {scenarios,type ScenarioId} from "@/lib/scenarios";

type Panel="monitor"|"ventilator"|"defib"|"drugs"|"imaging"|"patient"|null;
type TraceKind="ecg"|"pleth"|"capno";
type ScenarioProp={id:string;label:string;kind:"image"|"video";mime:string;url:string;fileName:string};

const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function Waveform({kind}:{kind:TraceKind}){
  const d=kind==="ecg"
    ?"M0 50 L40 50 L50 47 L58 50 L63 18 L70 82 L78 50 L125 50 L135 47 L143 50 L148 18 L155 82 L163 50 L210 50 L220 47 L228 50 L233 18 L240 82 L248 50 L295 50"
    :kind==="pleth"
    ?"M0 62 C20 60 24 18 40 18 C55 18 58 55 76 62 C92 68 98 66 112 62 C130 60 134 18 150 18 C166 18 169 56 186 62 C203 68 208 66 222 62 C240 60 244 18 260 18 C276 18 279 56 296 62"
    :"M0 72 L25 72 L25 34 Q30 18 38 18 L68 18 Q78 20 80 34 L80 72 L112 72 L112 34 Q117 18 125 18 L155 18 Q165 20 167 34 L167 72 L200 72 L200 34 Q205 18 213 18 L243 18 Q253 20 255 34 L255 72 L295 72";
  return <div className={`trace ${kind}`}><svg viewBox="0 0 300 100" preserveAspectRatio="none"><g className="traceScroll"><path d={d}/><path d={d} transform="translate(300 0)"/></g></svg></div>
}

function makeTone(freq:number,duration=0.055,volume=0.025){
  const Ctx=window.AudioContext || (window as typeof window & {webkitAudioContext:typeof AudioContext}).webkitAudioContext;
  const ctx=new Ctx();
  const osc=ctx.createOscillator();
  const gain=ctx.createGain();
  osc.type="sine"; osc.frequency.value=freq; gain.gain.value=volume;
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+duration);
  osc.stop(ctx.currentTime+duration);
  osc.onended=()=>ctx.close();
}

export default function Home(){
  const [scenarioId,setScenarioId]=useState<ScenarioId>("septic-shock");
  const [patient,setPatient]=useState(()=>createPatient("septic-shock"));
  const [panel,setPanel]=useState<Panel>(null);
  const [events,setEvents]=useState<string[]>(["00:00  Scenario loaded — septic shock"]);
  const [paused,setPaused]=useState(false);
  const [audioOn,setAudioOn]=useState(false);
  const [roomSrc,setRoomSrc]=useState("/resus-room.jpg");
  const [showBrief,setShowBrief]=useState(true);
  const [activeProp,setActiveProp]=useState<ScenarioProp|null>(null);
  const channelRef=useRef<BroadcastChannel|null>(null);
  const active=scenarios[scenarioId];
  const map=useMemo(()=>Math.round((patient.sbp+2*patient.dbp)/3),[patient.sbp,patient.dbp]);

  useEffect(()=>{ if(paused)return; const id=setInterval(()=>setPatient(p=>tickPatient(p)),1000); return()=>clearInterval(id); },[paused]);

  useEffect(()=>{
    const ch=new BroadcastChannel("hive-sim-control");
    channelRef.current=ch;
    ch.onmessage=(event)=>{
      const data=event.data as {type:string;action?:InstructorAction;scenarioId?:ScenarioId;prop?:ScenarioProp};
      if(data.type==="action"&&data.action){
        setPatient(p=>{
          const r=applyInstructorAction(p,data.action!);
          setEvents(e=>[`${fmt(p.elapsed)}  ${r.note}`,...e].slice(0,10));
          return r.state;
        });
      }
      if(data.type==="show-prop"&&data.prop){ setActiveProp(data.prop); setEvents(e=>[`PROP REVEALED  ${data.prop!.label}`,...e].slice(0,10)); }
      if(data.type==="hide-prop")setActiveProp(null);
      if(data.type==="pause")setPaused(true);
      if(data.type==="resume")setPaused(false);
      if(data.type==="scenario"&&data.scenarioId){
        setScenarioId(data.scenarioId);
        setPatient(createPatient(data.scenarioId));
        setEvents([`00:00  Instructor loaded — ${scenarios[data.scenarioId].title}`]);
        setShowBrief(true);
      }
    };
    return()=>ch.close();
  },[]);

  useEffect(()=>{
    if(!audioOn||paused)return;
    const beatMs=Math.max(320,60000/Math.max(40,patient.hr||60));
    const id=setInterval(()=>makeTone(patient.spo2>=95?880:patient.spo2>=90?740:560,0.045,0.018),beatMs);
    return()=>clearInterval(id);
  },[audioOn,paused,patient.hr,patient.spo2]);

  useEffect(()=>{
    if(!audioOn||paused||(patient.sbp>=90&&patient.spo2>=90))return;
    const id=setInterval(()=>makeTone(320,0.18,0.035),3000);
    return()=>clearInterval(id);
  },[audioOn,paused,patient.sbp,patient.spo2]);

  function act(action:Intervention){
    setPatient(p=>{
      const r=applyIntervention(p,action);
      setEvents(e=>[`${fmt(p.elapsed)}  ${r.note}`,...e].slice(0,10));
      return r.state;
    });
  }

  function selectScenario(id:ScenarioId){
    setScenarioId(id);
    setPatient(createPatient(id));
    setEvents([`00:00  Scenario loaded — ${scenarios[id].title}`]);
    setShowBrief(true);
    channelRef.current?.postMessage({type:"scenario",scenarioId:id});
  }

  return <main className="simRoomApp">
    <header className="simHeader">
      <div><div className="eyebrow">HIVE INTELLIGENCE</div><h1>HIVE SIM <span>RESUS 01</span></h1></div>
      <div className="simHeaderActions">
        <div className="status"><i/> LIVE <b>{fmt(patient.elapsed)}</b></div>
        <button onClick={()=>{setAudioOn(v=>!v);if(!audioOn)makeTone(880)}}>{audioOn?"Audio on":"Enable audio"}</button>
        <Link href="/instructor" target="_blank">Instructor ↗</Link>
        <button onClick={()=>setPaused(v=>!v)}>{paused?"Resume":"Pause"}</button>
      </div>
    </header>

    <section className="simScene">
      <img src={roomSrc} onError={()=>setRoomSrc("/resus-room.svg")} className="sceneImage" alt="HIVE SIM resuscitation room"/>
      <div className="sceneShade"/>

      <div className="doorSign" aria-hidden="true">
        <span>CT Scan →</span><span>MRI →</span><span>ICU →</span>
      </div>

      <button className="roomObject roomMonitor" aria-label="Open patient monitor" onClick={()=>setPanel("monitor")}>
        <span className="objectPulse"/>
        <span className="monitorMini"><b>{patient.hr}</b><em>{patient.spo2}%</em><small>{patient.sbp}/{patient.dbp}</small></span>
        <span className="objectLabel">MONITOR</span>
      </button>

      <button className="roomObject roomVent" onClick={()=>setPanel("ventilator")}><span className="objectPulse"/><span className="objectLabel">VENTILATOR</span></button>
      <button className="roomObject roomDefib" onClick={()=>setPanel("defib")}><span className="objectPulse"/><span className="objectLabel">DEFIB</span></button>
      <button className="roomObject roomDrugs" onClick={()=>setPanel("drugs")}><span className="objectPulse"/><span className="objectLabel">DRUGS</span></button>
      <button className="roomObject roomPatient" onClick={()=>setPanel("patient")}><span className="patientTarget"/><span className="objectLabel">PATIENT</span></button>
      <button className="roomObject roomImaging" onClick={()=>setPanel("imaging")}><span className="objectPulse"/><span className="objectLabel">X-RAY</span></button>

      <div className="sceneVitals">
        <span className="green">HR <b>{patient.hr}</b></span>
        <span className="red">BP <b>{patient.sbp}/{patient.dbp}</b></span>
        <span className="cyan">SpO₂ <b>{patient.spo2}%</b></span>
        <span className="yellow">EtCO₂ <b>{patient.etco2}</b></span>
      </div>

      <div className="scenarioDock">
        <div><small>ACTIVE CASE</small><strong>{active.title}</strong><span>{active.subtitle}</span></div>
        <select value={scenarioId} onChange={e=>selectScenario(e.target.value as ScenarioId)}>
          {Object.values(scenarios).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <button onClick={()=>setShowBrief(true)}>Case brief</button>
      </div>

      <div className="actionDock">
        <button onClick={()=>act("oxygen")}>O₂</button>
        <button onClick={()=>act("fluid")}>500 mL</button>
        <button onClick={()=>act("adrenaline")}>Adrenaline</button>
        <button onClick={()=>act("noradrenaline")}>Norad</button>
        <button onClick={()=>act("intubate")}>RSI</button>
      </div>

      <div className="lastEvent">{events[0]}</div>

      {paused&&<div className="pausedBanner">SIMULATION PAUSED</div>}
    </section>

    {activeProp&&<div className="propReveal">
      <div className="propRevealHeader"><div><span>INSTRUCTOR PROP</span><b>{activeProp.label}</b></div><button onClick={()=>setActiveProp(null)}>×</button></div>
      <div className="propRevealMedia">{activeProp.kind==="video"?<video src={activeProp.url} controls autoPlay playsInline/>:<img src={activeProp.url} alt={activeProp.label}/>}</div>
      <div className="propRevealFooter">{activeProp.fileName}</div>
    </div>}

    {showBrief&&<div className="briefCard">
      <button className="briefClose" onClick={()=>setShowBrief(false)}>×</button>
      <div className="eyebrow">CASE BRIEF</div>
      <h2>{active.title}</h2>
      <p>{active.subtitle}</p>
      <div className="briefPatient"><b>{active.patient}</b><span>{active.opening}</span></div>
      <div className="briefGoals">{active.goals.map(g=><span key={g}>{g}</span>)}</div>
      <button className="startCase" onClick={()=>setShowBrief(false)}>Enter Resus Room</button>
    </div>}

    {panel&&<div className="equipmentLayer" onMouseDown={()=>setPanel(null)}>
      <section className={`equipmentCloseup ${panel}`} onMouseDown={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setPanel(null)}>×</button>

        {panel==="monitor"&&<>
          <div className="deviceTitle">BEDSIDE MONITOR</div>
          <div className="fullMonitor"><div><small>ECG II</small><Waveform kind="ecg"/></div><div><small>PLETH</small><Waveform kind="pleth"/></div><div><small>CAPNOGRAPHY</small><Waveform kind="capno"/></div></div>
          <div className="monitorGrid"><div className="green"><small>HR</small><b>{patient.hr}</b></div><div className="red"><small>NIBP</small><b>{patient.sbp}/{patient.dbp}</b><em>MAP {map}</em></div><div className="cyan"><small>SpO₂</small><b>{patient.spo2}</b></div><div className="yellow"><small>EtCO₂</small><b>{patient.etco2}</b></div></div>
        </>}

        {panel==="ventilator"&&<>
          <div className="deviceTitle">VENTILATOR</div>
          <div className="ventScreen"><h3>{patient.airway==="Intubated"?"Volume Control":"STANDBY — PATIENT NOT INTUBATED"}</h3><Waveform kind="capno"/><div className="settings"><span>VT <b>450</b> mL</span><span>RR <b>{patient.airway==="Intubated"?16:0}</b></span><span>PEEP <b>5</b> cmH₂O</span><span>FiO₂ <b>0.60</b></span></div></div>
          <button className="primary" onClick={()=>act("intubate")}>RSI + commence ventilation</button>
        </>}

        {panel==="defib"&&<>
          <div className="deviceTitle">DEFIBRILLATOR</div>
          <div className="defibDisplay"><div><small>RHYTHM</small><b>{patient.rhythm}</b></div><Waveform kind="ecg"/><strong>200 J</strong></div>
          <div className="actions"><button>SYNC</button><button>CHARGE</button><button className="danger" onClick={()=>act("shock")}>SHOCK</button></div>
        </>}

        {panel==="drugs"&&<>
          <div className="deviceTitle">DRUG TROLLEY</div>
          <div className="drugList"><button onClick={()=>act("adrenaline")}><b>Adrenaline</b><span>Administer</span></button><button onClick={()=>act("noradrenaline")}><b>Noradrenaline</b><span>Start infusion</span></button><button onClick={()=>act("fluid")}><b>Balanced crystalloid</b><span>500 mL</span></button></div>
        </>}

        {panel==="imaging"&&<>
          <div className="deviceTitle">IMAGING</div>
          <div className="xray"><div className="lungs">☁︎　☁︎</div><span>Portable AP Chest</span></div>
          <div className="actions"><button>Portable CXR</button><button>CT Scan</button><button>MRI</button></div>
        </>}

        {panel==="patient"&&<>
          <div className="deviceTitle">PATIENT EXAMINATION</div>
          <div className="patientPanel"><div className="avatar">{scenarioId==="anaphylaxis"?"34":"67"}</div><div><h3>{active.patient}</h3><p>{active.opening}</p><p>{active.exam}</p></div></div>
          <div className="examGrid"><button>Airway</button><button>Breathing</button><button>Circulation</button><button>Disability</button><button>Exposure</button><button>POCUS</button><button>IV / IO</button><button>Procedures</button></div>
        </>}
      </section>
    </div>}

    <footer className="simFooter"><span>HIVE SIM · simulation use only</span><button onClick={()=>act("reset")}>Reset case</button></footer>
  </main>
}
