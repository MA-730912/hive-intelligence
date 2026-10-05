"use client";
export type ReplayEvent={id:number;at:string;label:string;kind?:string};

export default function ReplayTimeline({events}:{events:ReplayEvent[]}){
  return <section className="card" style={{marginTop:18}}>
    <div className="eyebrow">Replay & debrief timeline</div>
    <h3>Session chronology</h3>
    {events.length===0?<p className="muted">Events will appear here as the scenario runs.</p>:<div style={{position:"relative",paddingLeft:22}}>
      <div style={{position:"absolute",left:6,top:4,bottom:4,width:2,background:"var(--line)"}}/>
      {events.slice().reverse().map(e=><div key={e.id} style={{position:"relative",padding:"0 0 14px 12px"}}>
        <div style={{position:"absolute",left:-20,top:4,width:10,height:10,borderRadius:"50%",background:"var(--lime)",boxShadow:"0 0 0 4px #0a1713"}}/>
        <div style={{fontSize:11,color:"var(--muted)"}}>{e.at}</div>
        <strong>{e.label}</strong>
      </div>)}
    </div>}
  </section>
}
