"use client";
import type {SimulationVitals} from "@/lib/simulation/types";

function ecgPath(rhythm:string){
  const r=rhythm.toLowerCase();
  if(r.includes("atrial fibrillation")){
    return "M0 28 L8 26 L14 30 L21 25 L27 29 L34 27 L40 31 L47 26 L55 5 L62 46 L68 28 L75 30 L83 26 L92 31 L99 27 L106 29 L114 25 L122 28 L130 4 L138 45 L145 28 L152 31 L160 25 L168 30 L176 27 L184 29 L191 25 L199 28 L207 4 L214 45 L221 28 L240 28";
  }
  if(r.includes("svt")){
    return "M0 28 L14 28 L18 8 L24 44 L30 28 L45 28 L49 8 L55 44 L61 28 L76 28 L80 8 L86 44 L92 28 L107 28 L111 8 L117 44 L123 28 L138 28 L142 8 L148 44 L154 28 L169 28 L173 8 L179 44 L185 28 L200 28 L204 8 L210 44 L216 28 L240 28";
  }
  if(r.includes("broad complex")||r.includes("tachycardia")){
    return "M0 28 L20 28 L25 11 L36 7 L48 43 L60 35 L72 28 L92 28 L97 11 L108 7 L120 43 L132 35 L144 28 L164 28 L169 11 L180 7 L192 43 L204 35 L216 28 L240 28";
  }
  if(r.includes("pea")){
    return "M0 30 L32 30 L38 24 L43 30 L50 30 L56 10 L64 44 L72 30 L91 30 L98 25 L104 30 L129 30 L135 24 L140 30 L147 30 L153 10 L161 44 L169 30 L188 30 L195 25 L201 30 L240 30";
  }
  return "M0 28 L28 28 L34 23 L39 28 L45 28 L50 5 L56 46 L62 28 L76 28 L83 22 L90 28 L130 28 L136 23 L141 28 L147 28 L152 5 L158 46 L164 28 L178 28 L185 22 L192 28 L240 28";
}

function Wave({kind,rhythm}:{kind:"ecg"|"pleth"|"capno";rhythm?:string}){
  const paths={
    ecg:ecgPath(rhythm??"sinus rhythm"),
    pleth:"M0 40 C12 40 12 13 24 13 C36 13 35 40 48 40 C61 40 61 17 73 17 C85 17 84 40 97 40 C110 40 110 14 122 14 C134 14 133 40 146 40 C159 40 159 18 171 18 C183 18 182 40 195 40 C208 40 208 15 220 15 C232 15 231 40 240 40",
    capno:"M0 42 L15 42 L22 12 L68 12 L75 42 L96 42 L103 14 L149 14 L156 42 L177 42 L184 13 L230 13 L237 42"
  };
  return <svg viewBox="0 0 240 52" preserveAspectRatio="none" style={{width:"100%",height:58,display:"block"}}>
    <path d={paths[kind]} fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
}

export default function MonitorScreen({vitals}:{vitals:SimulationVitals}){
  const alarm=vitals.sbp<80||vitals.spo2<90||vitals.hr>150||vitals.hr<40;
  return <div style={{background:"#020706",border:`2px solid ${alarm?"#9b3b3b":"#223c34"}`,borderRadius:18,padding:16,boxShadow:"0 18px 50px rgba(0,0,0,.35)"}}>
    <div className="toolbar" style={{marginBottom:8}}>
      <strong style={{letterSpacing:".08em"}}>HIVE PATIENT MONITOR</strong>
      <span className="status" style={alarm?{borderColor:"#9b3b3b",color:"#ffd1d1"}:undefined}><span className="dot"/> {alarm?"HIGH PRIORITY ALARM":"LIVE SIM"}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:12,color:"#9cf2c0"}}>
      <div><div style={{fontSize:11}}>ECG · {vitals.rhythm}</div><Wave kind="ecg" rhythm={vitals.rhythm}/></div>
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
