"use client";

export type VentSettings={
  fio2:number;
  vt:number;
  rate:number;
  peep:number;
  ppeak:number;
};

export default function VentilatorPanel({settings,onChange,editable=false,etco2=36}:{settings:VentSettings;onChange?:(s:VentSettings)=>void;editable?:boolean;etco2?:number}){
  const mv=(settings.vt*settings.rate/1000).toFixed(1);
  const controls:Array<[keyof VentSettings,string,number,number,number,string]>=[
    ["fio2","FiO₂",0.21,1,0.05,""],
    ["vt","VT",250,800,10,"mL"],
    ["rate","Rate",6,35,1,"/min"],
    ["peep","PEEP",0,20,1,"cmH₂O"],
    ["ppeak","Ppeak",10,50,1,"cmH₂O"],
  ];

  return <div className="card" style={{background:"#071210"}}>
    <div className="toolbar">
      <div><div className="eyebrow">Ventilator</div><h3 style={{margin:"4px 0"}}>Volume Control</h3></div>
      <span className="chip">{editable?"INSTRUCTOR CONTROL":"INTUBATED"}</span>
    </div>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[
        ["FiO₂",settings.fio2.toFixed(2)],
        ["VT",`${settings.vt} mL`],
        ["Rate",`${settings.rate}/min`],
        ["PEEP",`${settings.peep} cmH₂O`],
        ["Ppeak",`${settings.ppeak} cmH₂O`],
        ["MV",`${mv} L/min`],
        ["I:E","1:2"],
        ["ETCO₂",String(etco2)]
      ].map(([a,b])=><div className="message" key={a}><div className="muted">{a}</div><strong>{b}</strong></div>)}
    </div>

    <div style={{color:"#5eead4",marginTop:8}}>
      <svg viewBox="0 0 500 90" preserveAspectRatio="none" style={{width:"100%",height:90}}>
        <path d="M0 70 C25 70 25 18 50 18 L115 18 C135 18 140 70 165 70 C190 70 190 22 215 22 L280 22 C300 22 305 70 330 70 C355 70 355 18 380 18 L445 18 C465 18 470 70 500 70" fill="none" stroke="currentColor" strokeWidth="3"/>
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
    </div>}
  </div>
}
