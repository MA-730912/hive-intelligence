"use client";

import {useEffect,useMemo,useState} from "react";
import {applyIntervention,initialPatient,tickPatient,type Intervention} from "@/lib/sim";

type Panel="monitor"|"ventilator"|"defib"|"drugs"|"imaging"|"patient"|null;

const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

export default function Home(){
  const [patient,setPatient]=useState(initialPatient);
  const [panel,setPanel]=useState<Panel>(null);
  const [events,setEvents]=useState<string[]>(["00:00  Scenario loaded — septic shock"]);
  const [paused,setPaused]=useState(false);

  useEffect(()=>{
    if(paused) return;
    const id=setInterval(()=>setPatient(p=>tickPatient(p)),1000);
    return()=>clearInterval(id);
  },[paused]);

  const map=useMemo(()=>Math.round((patient.sbp+2*patient.dbp)/3),[patient.sbp,patient.dbp]);

  function act(action:Intervention){
    setPatient(p=>{
      const result=applyIntervention(p,action);
      setEvents(e=>[`${fmt(p.elapsed)}  ${result.note}`,...e].slice(0,8));
      return result.state;
    });
  }

  return <main className="shell">
    <header className="topbar">
      <div>
        <div className="eyebrow">HIVE INTELLIGENCE</div>
        <h1>HIVE SIM <span>Resus 01</span></h1>
      </div>
      <div className="status"><i/> LIVE SIMULATION <b>{fmt(patient.elapsed)}</b></div>
      <button className="ghost" onClick={()=>setPaused(v=>!v)}>{paused?"Resume":"Pause"}</button>
    </header>

    <section className="workspace">
      <div className="room">
        <img src="/resus-room.svg" alt="HIVE SIM Resuscitation Room" className="roomImage"/>
        <div className="ambient"/>
        <button className="hot monitor" onClick={()=>setPanel("monitor")}><span>Patient Monitor</span></button>
        <button className="hot vent" onClick={()=>setPanel("ventilator")}><span>Ventilator</span></button>
        <button className="hot defib" onClick={()=>setPanel("defib")}><span>Defibrillator</span></button>
        <button className="hot drugs" onClick={()=>setPanel("drugs")}><span>Drug Trolley</span></button>
        <button className="hot patient" onClick={()=>setPanel("patient")}><span>Patient</span></button>
        <button className="hot imaging" onClick={()=>setPanel("imaging")}><span>Imaging</span></button>

        <div className="hudVitals">
          <div><small>HR</small><strong>{patient.hr}</strong></div>
          <div><small>BP</small><strong>{patient.sbp}/{patient.dbp}</strong><em>MAP {map}</em></div>
          <div><small>SpO₂</small><strong>{patient.spo2}%</strong></div>
          <div><small>EtCO₂</small><strong>{patient.etco2}</strong></div>
        </div>

        <div className="quickActions">
          <button onClick={()=>act("oxygen")}>O₂</button>
          <button onClick={()=>act("fluid")}>500 mL Fluid</button>
          <button onClick={()=>act("adrenaline")}>Adrenaline</button>
          <button onClick={()=>act("noradrenaline")}>Norad</button>
          <button onClick={()=>act("intubate")}>RSI</button>
        </div>
      </div>

      <aside className="side">
        <div className="card scenario">
          <div className="label">ACTIVE SCENARIO</div>
          <h2>Septic Shock</h2>
          <p>67-year-old · 82 kg</p>
          <div className="badges"><span>Resus</span><span>Advanced</span></div>
        </div>
        <div className="card">
          <div className="label">PATIENT STATE</div>
          <dl>
            <div><dt>Rhythm</dt><dd>{patient.rhythm}</dd></div>
            <div><dt>Airway</dt><dd>{patient.airway}</dd></div>
            <div><dt>Perfusion</dt><dd>{patient.perfusion}</dd></div>
            <div><dt>Temp</dt><dd>{patient.temp.toFixed(1)} °C</dd></div>
            <div><dt>RR</dt><dd>{patient.rr}/min</dd></div>
          </dl>
        </div>
        <div className="card log">
          <div className="label">EVENT LOG</div>
          {events.map((e,i)=><p key={i}>{e}</p>)}
        </div>
      </aside>
    </section>

    {panel && <div className="overlay" onMouseDown={()=>setPanel(null)}>
      <section className="device" onMouseDown={e=>e.stopPropagation()}>
        <button className="close" onClick={()=>setPanel(null)}>×</button>
        {panel==="monitor" && <>
          <div className="deviceTitle">MULTIPARAMETER MONITOR</div>
          <div className="wave ecg"><svg viewBox="0 0 1000 100" preserveAspectRatio="none"><polyline points="0,55 80,55 110,53 130,55 145,12 160,88 176,55 245,55 290,55 320,53 340,55 355,12 370,88 386,55 470,55 520,55 550,53 570,55 585,12 600,88 616,55 700,55 760,55 790,53 810,55 825,12 840,88 856,55 1000,55"/></svg></div>
          <div className="monitorGrid">
            <div className="green"><small>HR</small><b>{patient.hr}</b></div>
            <div className="red"><small>NIBP</small><b>{patient.sbp}/{patient.dbp}</b><em>({map})</em></div>
            <div className="cyan"><small>SpO₂</small><b>{patient.spo2}</b></div>
            <div className="yellow"><small>EtCO₂</small><b>{patient.etco2}</b></div>
          </div>
        </>}
        {panel==="ventilator" && <>
          <div className="deviceTitle">VENTILATOR</div>
          <div className="ventScreen"><h3>{patient.airway==="Intubated"?"Volume Control":"STANDBY"}</h3><div className="settings"><span>VT <b>450</b> mL</span><span>RR <b>{patient.airway==="Intubated"?16:0}</b></span><span>PEEP <b>5</b></span><span>FiO₂ <b>0.60</b></span></div></div>
          <button className="primary" onClick={()=>act("intubate")}>Intubate + commence ventilation</button>
        </>}
        {panel==="defib" && <>
          <div className="deviceTitle">DEFIBRILLATOR</div>
          <div className="defibDisplay"><small>RHYTHM</small><b>{patient.rhythm}</b><strong>200 J</strong></div>
          <div className="actions"><button>SYNC</button><button>CHARGE</button><button className="danger" onClick={()=>act("shock")}>SHOCK</button></div>
        </>}
        {panel==="drugs" && <>
          <div className="deviceTitle">EMERGENCY MEDICATIONS</div>
          <div className="drugList">
            <button onClick={()=>act("adrenaline")}><b>Adrenaline</b><span>Administer</span></button>
            <button onClick={()=>act("noradrenaline")}><b>Noradrenaline</b><span>Start infusion</span></button>
            <button onClick={()=>act("fluid")}><b>Balanced crystalloid</b><span>500 mL</span></button>
          </div>
        </>}
        {panel==="imaging" && <>
          <div className="deviceTitle">IMAGING CONSOLE</div>
          <div className="xray"><div className="lungs">☁︎　☁︎</div><span>Portable AP Chest</span></div>
          <div className="actions"><button>Portable CXR</button><button>CT Scan</button><button>MRI</button></div>
        </>}
        {panel==="patient" && <>
          <div className="deviceTitle">PATIENT ASSESSMENT</div>
          <div className="patientPanel"><div className="avatar">67</div><div><h3>Mr David Mercer</h3><p>“I feel terrible… I can’t catch my breath.”</p><p>Hot, clammy, tachypnoeic. Peripheral perfusion reduced.</p></div></div>
          <div className="actions"><button>Airway</button><button>Breathing</button><button>Circulation</button><button>POCUS</button></div>
        </>}
      </section>
    </div>}

    <footer><span>HIVE SIM · Simulation use only · Prototype physiology model</span><button onClick={()=>act("reset")}>Reset case</button></footer>
  </main>
}
