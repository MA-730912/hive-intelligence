"use client";

const roles=[
  {role:"Virtual Nurse",actions:["Repeat observations","Prepare adrenaline","Insert second IV","Check glucose","Prepare airway trolley"]},
  {role:"Surgery Registrar",actions:["Request bedside review","Accept for theatre","Ask for CT first","Escalate consultant"]},
  {role:"ICU Consultant",actions:["Review shock","Accept ICU admission","Recommend invasive monitoring","Attend airway"]},
  {role:"Radiology",actions:["Request portable CXR","Request CT left leg","Discuss urgency","Return report"]},
  {role:"Pharmacist",actions:["Check allergy","Review antimicrobial plan","Check weight-based dose","Review compatibility"]}
];

export default function VirtualTeamPanel({onAction}:{onAction:(role:string,action:string)=>void}){
  return <div className="card">
    <div className="eyebrow">Virtual clinical team</div>
    <h3>Call, delegate and request</h3>
    {roles.map(r=><details key={r.role} style={{borderBottom:"1px solid var(--line)",padding:"10px 0"}}>
      <summary style={{cursor:"pointer",fontWeight:700}}>{r.role}</summary>
      <div className="chips" style={{marginTop:10}}>
        {r.actions.map(a=><button className="btn" key={a} onClick={()=>onAction(r.role,a)}>{a}</button>)}
      </div>
    </details>)}
  </div>
}
