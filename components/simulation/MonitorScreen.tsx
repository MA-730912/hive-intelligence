"use client";
import type {SimulationVitals} from "@/lib/simulation/types";

function Wave({kind}:{kind:"ecg"|"pleth"|"capno"}){
  const paths={
    ecg:"M0 28 L28 28 L34 23 L39 28 L45 28 L50 5 L56 46 L62 28 L76 28 L83 22 L90 28 L130 28 L136 23 L141 28 L147 28 L152 5 L158 46 L164 28 L178 28 L185 22 L192 28 L240 28",
    pleth:"M0 40 C12 40 12 13 24 13 C36 13 35 40 48 40 C61 40 61 17 73 17 C85 17 84 40 97 40 C110 40 110 14 122 14 C134 14 133 40 146 40 C159 40 159 18 171 18 C183 18 182 40 195 40 C208 40 208 15 220 15 C232 15 231 40 240 40",
    capno:"M0 42 L15 42 L22 12 L68 12 L75 42 L96 42 L103 14 L149 14 L156 42 L177 42 L184 13 L230 13 L237 42"
  };
  return <svg viewBox="0 0 240 52" preserveAspectRatio="none" style={{width:"100%",height:58,display:"block"}}>
    <path d={paths[kind]} fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
}

export default function MonitorScreen({vitals}:{vitals:SimulationVitals}){
  return <div style={{background:"#020706",border:"2px solid #223c34",borderRadius:18,padding:16,boxShadow:"0 18px 50px rgba(0,0,0,.35)"}}>
    <div className="toolbar" style={{marginBottom:8}}>
      <strong style={{letterSpacing:".08em"}}>HIVE PATIENT MONITOR</strong>
      <span className="status"><span className="dot"/> LIVE SIM</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:12,color:"#9cf2c0"}}>
      <div><div style={{fontSize:11}}>ECG · {vitals.rhythm}</div><Wave kind="ecg"/></div>
      <div style={{fontSize:42,fontWeight:800,textAlign:"right"}}>{vitals.hr}<div style={{fontSize:10}}>HR /min</div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:12,color:"#5eead4"}}>
      <div><div style={{fontSize:11}}>PLETH</div><Wave kind="pleth"/></div>
      <div style={{fontSize:42,fontWeight:800,textAlign:"right"}}>{vitals.spo2}<div style={{fontSize:10}}>SpO₂ %</div></div>
    </div>
    {vitals.etco2!==null&&<div style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:12,color:"#f0c987"}}>
      <div><div style={{fontSize:11}}>CAPNOGRAPHY</div><Wave kind="capno"/></div>
      <div style={{fontSize:42,fontWeight:800,textAlign:"right"}}>{vitals.etco2}<div style={{fontSize:10}}>ETCO₂ mmHg</div></div>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:8}}>
      {[
        ["NIBP",`${vitals.sbp}/${vitals.dbp}`],
        ["RR",String(vitals.rr)],
        ["TEMP",`${vitals.temp.toFixed(1)}°C`],
        ["GCS",String(vitals.gcs)]
      ].map(([k,v])=><div key={k} style={{border:"1px solid #18352d",borderRadius:12,padding:10}}>
        <div style={{fontSize:10,color:"#809c92"}}>{k}</div><div style={{fontSize:22,fontWeight:800,color:"#eefaf5"}}>{v}</div>
      </div>)}
    </div>
  </div>
}
