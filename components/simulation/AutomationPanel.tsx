"use client";
export default function AutomationPanel({enabled,fired,onToggle}:{enabled:boolean;fired:string[];onToggle:()=>void}){
  const rules=[
    ["2 min","Untreated anaphylaxis","Worsen BP / SpO₂; penalty"],
    ["5 min","No surgical source-control escalation","Worsen septic shock; penalty"],
    ["7 min","No ICU escalation","Escalation reminder; penalty"],
    ["10 min","No source control","Progressive shock / reduced GCS"],
  ];

  return <section className="card" style={{marginTop:18}}>
    <div className="toolbar">
      <div><div className="eyebrow">Scenario automation</div><h3 style={{margin:"4px 0"}}>Timed deterioration engine</h3></div>
      <button className={`btn ${enabled?"primary":""}`} onClick={onToggle}>{enabled?"Automation ON":"Automation OFF"}</button>
    </div>
    {rules.map(([time,trigger,effect],i)=>{
      const ids=["delayed-adrenaline","delayed-source-control","delayed-icu","progressive-shock"];
      const done=fired.includes(ids[i]);
      return <div className="message" key={trigger} style={{display:"grid",gridTemplateColumns:"70px 1fr 1fr",gap:12,alignItems:"center"}}>
        <strong>{time}</strong><span>{trigger}</span><span className="muted">{done?"FIRED · ":""}{effect}</span>
      </div>
    })}
    <p className="muted" style={{fontSize:11}}>These rules are educational scenario logic, not a physiological prediction model. Faculty can disable automation and run the case entirely manually.</p>
  </section>
}
