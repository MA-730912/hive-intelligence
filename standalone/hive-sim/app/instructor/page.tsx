"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {scenarios,type ScenarioId} from "@/lib/scenarios";
import type {InstructorAction} from "@/lib/sim";

export default function Instructor(){
  const [scenarioId,setScenarioId]=useState<ScenarioId>("septic-shock");
  const [connected,setConnected]=useState(false);
  const [channel,setChannel]=useState<BroadcastChannel|null>(null);
  const [log,setLog]=useState<string[]>(["Instructor console ready"]);

  useEffect(()=>{
    const ch=new BroadcastChannel("hive-sim-control");
    setChannel(ch); setConnected(true);
    return()=>ch.close();
  },[]);

  function send(action:InstructorAction,label:string){
    channel?.postMessage({type:"action",action});
    setLog(v=>[`${new Date().toLocaleTimeString()} — ${label}`,...v].slice(0,12));
  }

  function setScenario(id:ScenarioId){
    setScenarioId(id);
    channel?.postMessage({type:"scenario",scenarioId:id});
    setLog(v=>[`${new Date().toLocaleTimeString()} — Loaded ${scenarios[id].title}`,...v].slice(0,12));
  }

  return <main className="instructorShell">
    <header className="instructorTop">
      <div><div className="eyebrow">HIVE SIM CONTROL ROOM</div><h1>Instructor Console</h1></div>
      <div className={`connection ${connected?"ok":""}`}><i/>{connected?"Learner channel active":"Connecting"}</div>
      <Link href="/" target="_blank">Open Learner Room ↗</Link>
    </header>

    <section className="instructorGrid">
      <div className="controlCard wide">
        <div className="label">SCENARIO</div>
        <div className="scenarioControl">
          <select value={scenarioId} onChange={e=>setScenario(e.target.value as ScenarioId)}>
            {Object.values(scenarios).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <div><h2>{scenarios[scenarioId].title}</h2><p>{scenarios[scenarioId].subtitle}</p></div>
        </div>
      </div>

      <div className="controlCard">
        <div className="label">HAEMODYNAMICS</div>
        <button className="control dangerControl" onClick={()=>send("hypotension","Acute hypotension")}>Drop BP</button>
        <button className="control" onClick={()=>send("deteriorate","Global deterioration")}>Deteriorate</button>
        <button className="control goodControl" onClick={()=>send("improve","Patient improved")}>Improve patient</button>
      </div>

      <div className="controlCard">
        <div className="label">RHYTHM</div>
        <button className="control dangerControl" onClick={()=>send("vf","Ventricular fibrillation")}>Trigger VF</button>
        <button className="control warningControl" onClick={()=>send("vt","Ventricular tachycardia")}>Trigger VT</button>
      </div>

      <div className="controlCard">
        <div className="label">AIRWAY / BREATHING</div>
        <button className="control warningControl" onClick={()=>send("desaturate","Acute desaturation")}>Desaturate</button>
      </div>

      <div className="controlCard">
        <div className="label">SESSION</div>
        <button className="control" onClick={()=>channel?.postMessage({type:"pause"})}>Pause scenario</button>
        <button className="control goodControl" onClick={()=>channel?.postMessage({type:"resume"})}>Resume</button>
        <button className="control dangerControl" onClick={()=>send("reset","Scenario reset")}>Reset patient</button>
      </div>

      <div className="controlCard wide">
        <div className="label">INSTRUCTOR EVENT LOG</div>
        <div className="instructorLog">{log.map((x,i)=><p key={i}>{x}</p>)}</div>
      </div>
    </section>
  </main>
}
