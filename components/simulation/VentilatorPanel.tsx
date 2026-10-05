"use client";

export type VentSettings={
  fio2:number;
  vt:number;
  rate:number;
  peep:number;
  ppeak:number;
};

export type VentPathology="normal"|"bronchospasm"|"low-compliance"|"pneumothorax"|"circuit-disconnect";

function pathologyMeta(pathology:VentPathology,basePeak:number,baseEtco2:number){
  switch(pathology){
    case "bronchospasm":
      return {
        label:"Bronchospasm",
        ppeak:Math.max(basePeak,36),
        etco2:Math.max(baseEtco2,42),
        alarm:"High airway resistance",
        wave:"M0 70 C20 70 22 22 45 18 C78 13 110 18 128 34 C145 49 158 61 175 67 C185 70 196 70 205 70 C225 70 227 25 250 21 C282 16 314 20 332 36 C350 52 361 63 378 68 C391 71 405 70 500 70"
      };
    case "low-compliance":
      return {
        label:"Low compliance",
        ppeak:Math.max(basePeak,34),
        etco2:baseEtco2,
        alarm:"High pressure / stiff respiratory system",
        wave:"M0 70 L18 70 L26 18 L92 18 L101 70 L118 70 L126 20 L192 20 L201 70 L218 70 L226 17 L292 17 L301 70 L318 70 L326 19 L392 19 L401 70 L500 70"
      };
    case "pneumothorax":
      return {
        label:"Possible pneumothorax",
        ppeak:Math.max(basePeak,40),
        etco2:Math.max(22,baseEtco2-6),
        alarm:"Sudden high pressure / reduced ventilation",
        wave:"M0 70 L18 70 L27 10 L78 10 L87 70 L103 70 L112 8 L163 8 L172 70 L188 70 L197 9 L248 9 L257 70 L273 70 L282 8 L333 8 L342 70 L500 70"
      };
    case "circuit-disconnect":
      return {
        label:"Circuit disconnect",
        ppeak:5,
        etco2:0,
        alarm:"LOW PRESSURE / DISCONNECT",
        wave:"M0 70 L40 70 L48 60 L60 70 L100 70 L108 61 L120 70 L160 70 L168 60 L180 70 L220 70 L228 61 L240 70 L500 70"
      };
    default:
      return {
        label:"Normal mechanics",
        ppeak:basePeak,
        etco2:baseEtco2,
        alarm:null,
        wave:"M0 70 C25 70 25 18 50 18 L115 18 C135 18 140 70 165 70 C190 70 190 22 215 22 L280 22 C300 22 305 70 330 70 C355 70 355 18 380 18 L445 18 C465 18 470 70 500 70"
      };
  }
}

export default function VentilatorPanel({
  settings,onChange,editable=false,etco2=36,pathology="normal",onPathologyChange
}:{
  settings:VentSettings;
  onChange?:(s:VentSettings)=>void;
  editable?:boolean;
  etco2?:number;
  pathology?:VentPathology;
  onPathologyChange?:(p:VentPathology)=>void;
}){
  const meta=pathologyMeta(pathology,settings.ppeak,etco2);
  const mv=(settings.vt*settings.rate/1000).toFixed(1);
  const controls:Array<[keyof VentSettings,string,number,number,number,string]>=[
    ["fio2","FiO₂",0.21,1,0.05,""],
    ["vt","VT",250,800,10,"mL"],
    ["rate","Rate",6,35,1,"/min"],
    ["peep","PEEP",0,20,1,"cmH₂O"],
    ["ppeak","Base Ppeak",10,50,1,"cmH₂O"],
  ];

  return <div className="card" style={{background:"#071210",borderColor:meta.alarm?"#8b4141":undefined}}>
    <div className="toolbar">
      <div><div className="eyebrow">Ventilator</div><h3 style={{margin:"4px 0"}}>Volume Control · {meta.label}</h3></div>
      <span className="chip">{meta.alarm??(editable?"INSTRUCTOR CONTROL":"INTUBATED")}</span>
    </div>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[
        ["FiO₂",settings.fio2.toFixed(2)],
        ["VT",`${settings.vt} mL`],
        ["Rate",`${settings.rate}/min`],
        ["PEEP",`${settings.peep} cmH₂O`],
        ["Ppeak",`${meta.ppeak} cmH₂O`],
        ["MV",`${mv} L/min`],
        ["I:E","1:2"],
        ["ETCO₂",String(meta.etco2)]
      ].map(([a,b])=><div className="message" key={a}><div className="muted">{a}</div><strong>{b}</strong></div>)}
    </div>

    <div style={{color:"#5eead4",marginTop:8}}>
      <svg viewBox="0 0 500 90" preserveAspectRatio="none" style={{width:"100%",height:90}}>
        <path d={meta.wave} fill="none" stroke="currentColor" strokeWidth="3"/>
      </svg>
    </div>

    {editable&&onChange&&<div style={{marginTop:12}}>
      <div className="eyebrow">Adjust settings</div>
      <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
        {controls.map(([key,label,min,max,step,unit])=><label className="message" key={key}>
          <div className="toolbar" style={{marginBottom:6}}><span className="muted">{label}</span><strong>{settings[key]} {unit}</strong></div>
          <input type="range" min={min} max={max} step={step} value={settings[key]} onChange={e=>onChange({...settings,[key]:Number(e.target.value)})} style={{width:"100%"}}/>
        </label>)}
      </div>

      {onPathologyChange&&<label className="message" style={{display:"block",marginTop:10}}>
        <div className="muted" style={{marginBottom:8}}>Ventilator pathology state</div>
        <select value={pathology} onChange={e=>onPathologyChange(e.target.value as VentPathology)} style={{width:"100%",background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8,padding:10}}>
          <option value="normal">Normal mechanics</option>
          <option value="bronchospasm">Bronchospasm</option>
          <option value="low-compliance">Low compliance</option>
          <option value="pneumothorax">Pneumothorax pattern</option>
          <option value="circuit-disconnect">Circuit disconnect</option>
        </select>
      </label>}
    </div>}
  </div>
}
