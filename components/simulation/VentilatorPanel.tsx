"use client";
export default function VentilatorPanel(){
  return <div className="card" style={{background:"#071210"}}>
    <div className="toolbar"><div><div className="eyebrow">Ventilator</div><h3 style={{margin:"4px 0"}}>Volume Control</h3></div><span className="chip">INTUBATED</span></div>
    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[["FiO₂","0.60"],["VT","450 mL"],["Rate","18/min"],["PEEP","8 cmH₂O"],["Ppeak","24"],["MV","8.1 L/min"],["I:E","1:2"],["ETCO₂","36"]].map(([a,b])=><div className="message" key={a}><div className="muted">{a}</div><strong>{b}</strong></div>)}
    </div>
    <div style={{color:"#5eead4",marginTop:8}}>
      <svg viewBox="0 0 500 90" preserveAspectRatio="none" style={{width:"100%",height:90}}>
        <path d="M0 70 C25 70 25 18 50 18 L115 18 C135 18 140 70 165 70 C190 70 190 22 215 22 L280 22 C300 22 305 70 330 70 C355 70 355 18 380 18 L445 18 C465 18 470 70 500 70" fill="none" stroke="currentColor" strokeWidth="3"/>
      </svg>
    </div>
  </div>
}
