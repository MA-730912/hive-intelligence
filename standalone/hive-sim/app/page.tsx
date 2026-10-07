"use client";

import { useEffect, useMemo, useState } from "react";
import { applyIntervention, initialPatient, tickPatient, type Intervention } from "@/lib/sim";

type Panel = "monitor" | "ventilator" | "defib" | "drugs" | "imaging" | "patient" | null;
type TraceKind = "ecg" | "pleth" | "capno";

const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function Waveform({kind}:{kind:TraceKind}) {
  const d = kind==="ecg"
    ? "M0 50 L40 50 L50 47 L58 50 L63 18 L70 82 L78 50 L125 50 L135 47 L143 50 L148 18 L155 82 L163 50 L210 50 L220 47 L228 50 L233 18 L240 82 L248 50 L295 50"
    : kind==="pleth"
    ? "M0 62 C20 60 24 18 40 18 C55 18 58 55 76 62 C92 68 98 66 112 62 C130 60 134 18 150 18 C166 18 169 56 186 62 C203 68 208 66 222 62 C240 60 244 18 260 18 C276 18 279 56 296 62"
    : "M0 72 L25 72 L25 34 Q30 18 38 18 L68 18 Q78 20 80 34 L80 72 L112 72 L112 34 Q117 18 125 18 L155 18 Q165 20 167 34 L167 72 L200 72 L200 34 Q205 18 213 18 L243 18 Q253 20 255 34 L255 72 L295 72";
  return <div className={`trace ${kind}`}>
    <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
      <g className="traceScroll">
        <path d={d}/>
        <path d={d} transform="translate(300 0)"/>
      </g>
    </svg>
  </div>
}

export default function Home(){
  const [patient,setPatient]=useState(initialPatient);
  const [panel,setPanel]=useState<Panel>(null);
  const [events,setEvents]=useState<string[]>(["00:00  Scenario loaded — septic shock"]);
  const [paused,setPaused]=useState(false);
  const [roomSrc,setRoomSrc]=useState("/resus-room.jpg");
  const map=useMemo(()=>Math.round((patient.sbp+2*patient.dbp)/3),[patient.sbp,patient.dbp]);

  useEffect(()=>{
    if(paused) return;
    const id=setInterval(()=>setPatient(p=>tickPatient(p)),1000);
    return()=>clearInterval(id);
  },[paused]);

  function act(action:Intervention){
    setPatient(p=>{
      const result=applyIntervention(p,action);
      setEvents(e=>[`${fmt(p.elapsed)}  ${result.note}`,...e].slice(0,9));
      return result.state;
    });
  }

  return <main className="shell">
    <header className="topbar">
      <div>
        <div className="eyebrow">HIVE INTELLIGENCE</div>
        <h1>HIVE SIM <span>Resus 01 · High-Fidelity Simulation</span></h1>
      </div>
      <div className="status"><i/> LIVE SIMULATION <b>{fmt(patient.elapsed)}</b></div>
      <button className="ghost" onClick={()=>setPaused(v=>!v)}>{paused?"Resume":"Pause"}</button>
    </header>

    <section className="workspace">
      <div className="room">
        <img
          src={roomSrc}
          onError={()=>setRoomSrc("/resus-room.svg")}
          alt="HIVE SIM photorealistic resuscitation room"
          className="roomImage"
        />
        <div className="ambient"/>
        <div className="roomTitle"><b>RESUS 01</b><span>SIMULATION CENTRE</span></div>

        <button className="hot monitor" onClick={()=>setPanel("monitor")}><span>Patient Monitor</span></button>
        <button className="hot vent" onClick={()=>setPanel("ventilator")}><span>Ventilator</span></button>
        <button className="hot defib" onClick={()=>setPanel("defib")}><span>Defibrillator</span></button>
        <button className="hot drugs" onClick={()=>setPanel("drugs")}><span>Drug Trolley</span></button>
        <button className="hot patient" onClick={()=>setPanel("patient")}><span>Patient / Procedures</span></button>
        <button className="hot imaging" onClick={()=>setPanel("imaging")}><span>X-ray / Imaging</span></button>

        <div className="monitorStrip">
          <div className="miniTrace"><small>II</small><Waveform kind="ecg"/></div>
          <div className="miniTrace"><small>SpO₂</small><Waveform kind="pleth"/></div>
          <div className="miniTrace"><small>CO₂</small><Waveform kind="capno"/></div>
          <div className="vital green"><small>HR</small><strong>{patient.hr}</strong></div>
          <div className="vital red"><small>NIBP</small><strong>{patient.sbp}/{patient.dbp}</strong><em>MAP {map}</em></div>
          <div className="vital cyan"><small>SpO₂</small><strong>{patient.spo2}%</strong></div>
          <div className="vital yellow"><small>EtCO₂</small><strong>{patient.etco2}</strong></div>
        </div>

        <div className="quickActions">
          <span className="qaLabel">QUICK ACTIONS</span>
          <button onClick={()=>act("oxygen")}>High-flow O₂</button>
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
          <p>67-year-old · 82 kg · hypotension · hypoxaemia</p>
          <div className="badges"><span>Resus</span><span>Advanced</span><span>Dynamic</span></div>
        </div>
        <div className="card">
          <div className="label">PATIENT STATE</div>
          <dl>
            <div><dt>Rhythm</dt><dd>{patient.rhythm}</dd></div>
            <div><dt>Airway</dt><dd>{patient.airway}</dd></div>
            <div><dt>Perfusion</dt><dd>{patient.perfusion}</dd></div>
            <div><dt>Temperature</dt><dd>{patient.temp.toFixed(1)} °C</dd></div>
            <div><dt>Respiratory rate</dt><dd>{patient.rr}/min</dd></div>
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
          <div className="deviceTitle">MULTIPARAMETER MONITOR · BED 01</div>
          <div className="fullMonitor">
            <div><small>ECG II</small><Waveform kind="ecg"/></div>
            <div><small>PLETH</small><Waveform kind="pleth"/></div>
            <div><small>CAPNOGRAPHY</small><Waveform kind="capno"/></div>
          </div>
          <div className="monitorGrid">
            <div className="green"><small>HR</small><b>{patient.hr}</b></div>
            <div className="red"><small>NIBP</small><b>{patient.sbp}/{patient.dbp}</b><em>({map})</em></div>
            <div className="cyan"><small>SpO₂</small><b>{patient.spo2}</b></div>
            <div className="yellow"><small>EtCO₂</small><b>{patient.etco2}</b></div>
          </div>
        </>}

        {panel==="ventilator" && <>
          <div className="deviceTitle">VENTILATOR</div>
          <div className="ventScreen">
            <h3>{patient.airway==="Intubated"?"Volume Control":"STANDBY — PATIENT NOT INTUBATED"}</h3>
            <Waveform kind="capno"/>
            <div className="settings">
              <span>VT <b>450</b> mL</span><span>RR <b>{patient.airway==="Intubated"?16:0}</b></span><span>PEEP <b>5</b> cmH₂O</span><span>FiO₂ <b>0.60</b></span>
            </div>
          </div>
          <button className="primary" onClick={()=>act("intubate")}>RSI + commence ventilation</button>
        </>}

        {panel==="defib" && <>
          <div className="deviceTitle">DEFIBRILLATOR / PACER</div>
          <div className="defibDisplay">
            <div><small>RHYTHM</small><b>{patient.rhythm}</b></div>
            <Waveform kind="ecg"/>
            <strong>200 J</strong>
          </div>
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
          <div className="deviceTitle">PATIENT ASSESSMENT / PROCEDURES</div>
          <div className="patientPanel"><div className="avatar">67</div><div><h3>Mr David Mercer</h3><p>“I feel terrible… I can’t catch my breath.”</p><p>Hot, clammy, tachypnoeic. Peripheral perfusion reduced.</p></div></div>
          <div className="actions"><button>Airway</button><button>Breathing</button><button>Circulation</button><button>POCUS</button><button>IV / IO</button></div>
        </>}
      </section>
    </div>}

    <footer><span>HIVE SIM · Simulation use only · Prototype physiology model</span><button onClick={()=>act("reset")}>Reset case</button></footer>
  </main>
}
