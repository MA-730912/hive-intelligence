"use client";
export type SessionRole="instructor"|"learner"|"observer";
export type SessionStatus="lobby"|"running"|"paused"|"completed";

export default function SessionControls({
  sessionCode,role,status,elapsedSeconds,onCodeChange,onRoleChange,onStart,onPause,onReset,onComplete
}:{
  sessionCode:string;
  role:SessionRole;
  status:SessionStatus;
  elapsedSeconds:number;
  onCodeChange:(v:string)=>void;
  onRoleChange:(v:SessionRole)=>void;
  onStart:()=>void;
  onPause:()=>void;
  onReset:()=>void;
  onComplete:()=>void;
}){
  const mm=String(Math.floor(elapsedSeconds/60)).padStart(2,"0");
  const ss=String(elapsedSeconds%60).padStart(2,"0");

  return <section className="card" style={{marginBottom:18}}>
    <div className="toolbar">
      <div><div className="eyebrow">Live simulation session</div><h3 style={{margin:"4px 0"}}>{sessionCode||"No session code"}</h3></div>
      <div className="kpi" style={{fontSize:28}}>{mm}:{ss}</div>
    </div>
    <div className="grid" style={{padding:0,gridTemplateColumns:"1fr 1fr",gap:10}}>
      <label className="message"><div className="muted">Session code</div><input value={sessionCode} maxLength={10} onChange={e=>onCodeChange(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,""))} style={{width:"100%",marginTop:8,padding:10,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8}}/></label>
      <label className="message"><div className="muted">Role</div><select value={role} onChange={e=>onRoleChange(e.target.value as SessionRole)} style={{width:"100%",marginTop:8,padding:10,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8}}><option value="instructor">Instructor</option><option value="learner">Learner</option><option value="observer">Observer</option></select></label>
    </div>
    <div className="toolbar" style={{marginTop:12}}>
      <span className="chip">{status.toUpperCase()}</span>
      {role==="instructor"&&<div className="chips">
        <button className="btn primary" onClick={onStart}>Start / Resume</button>
        <button className="btn" onClick={onPause}>Pause</button>
        <button className="btn" onClick={onReset}>Reset</button>
        <button className="btn" onClick={onComplete}>Complete</button>
      </div>}
    </div>
    <p className="muted" style={{fontSize:11}}>MVP live mode synchronises same-browser tabs using BroadcastChannel. The persistence schema is ready for Supabase Realtime transport in the next infrastructure phase.</p>
  </section>
}
