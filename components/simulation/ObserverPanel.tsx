"use client";
import MonitorScreen from "./MonitorScreen";
import type {SimulationVitals} from "@/lib/simulation/types";
import type {ReplayEvent} from "./ReplayTimeline";

export default function ObserverPanel({vitals,stateLabel,score,events,status}:{vitals:SimulationVitals;stateLabel:string;score:number;events:ReplayEvent[];status:string}){
  return <div className="chat">
    <section>
      <MonitorScreen vitals={vitals}/>
      <div className="card" style={{marginTop:18}}>
        <div className="eyebrow">Observer dashboard</div>
        <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(3,1fr)"}}>
          <div className="message"><div className="muted">Scenario state</div><strong>{stateLabel}</strong></div>
          <div className="message"><div className="muted">Session</div><strong>{status.toUpperCase()}</strong></div>
          <div className="message"><div className="muted">Live score</div><strong>{score}/100</strong></div>
        </div>
      </div>
    </section>
    <aside className="card">
      <div className="eyebrow">Recent activity</div>
      <h3>Faculty observation</h3>
      {events.length===0?<p className="muted">No learner actions recorded yet.</p>:events.slice(-12).reverse().map(e=><div className="message" key={e.id}><div className="muted">{e.at}</div><strong>{e.label}</strong></div>)}
    </aside>
  </div>
}
