"use client";
import type {SimulationInvestigationRequest} from "@/lib/simulation/realtime-channel";

export default function InvestigationQueue({
  requests,onRelease,onDismiss
}:{
  requests:SimulationInvestigationRequest[];
  onRelease:(request:SimulationInvestigationRequest)=>void;
  onDismiss:(id:string)=>void;
}){
  return <section className="card" style={{marginTop:18}}>
    <div className="eyebrow">Faculty investigation queue</div>
    <h3>Pending labs & radiology</h3>
    {requests.length===0?<p className="muted">No pending investigation requests.</p>:requests.map(r=><div className="message" key={r.id}>
      <div className="toolbar" style={{marginBottom:8}}>
        <div><strong>{r.name}</strong><div className="muted">{r.kind.toUpperCase()} · requested {r.requestedAt}</div></div>
        <span className="chip">PENDING</span>
      </div>
      <div className="chips">
        <button className="btn primary" onClick={()=>onRelease(r)}>Release result</button>
        <button className="btn" onClick={()=>onDismiss(r.id)}>Dismiss</button>
      </div>
    </div>)}
  </section>
}
