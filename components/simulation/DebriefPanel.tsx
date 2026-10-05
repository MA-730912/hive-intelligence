"use client";

export default function DebriefPanel({score,events}:{score:number;events:string[]}){
  const max=100;
  const pct=Math.max(0,Math.min(100,score));
  return <section className="card" style={{marginTop:18}}>
    <div className="toolbar">
      <div><div className="eyebrow">Debrief analytics</div><h3 style={{margin:"4px 0"}}>Live performance snapshot</h3></div>
      <div className="kpi" style={{fontSize:28}}>{pct}/{max}</div>
    </div>
    <div style={{height:10,background:"#081410",borderRadius:999,overflow:"hidden",border:"1px solid var(--line)"}}>
      <div style={{width:`${pct}%`,height:"100%",background:"var(--lime)"}}/>
    </div>
    <div className="grid" style={{padding:"14px 0 0",gridTemplateColumns:"repeat(3,1fr)"}}>
      <div className="message"><strong>{events.length}</strong><p className="muted">Recorded actions</p></div>
      <div className="message"><strong>{events.filter(e=>e.includes("Medication")).length}</strong><p className="muted">Medication events</p></div>
      <div className="message"><strong>{events.filter(e=>e.includes("called")||e.includes("Call")||e.includes("Virtual")).length}</strong><p className="muted">Team/escalation events</p></div>
    </div>
    <p className="muted">MVP score is scenario-rule based and intended for faculty debrief, not credentialing or summative assessment.</p>
  </section>
}
