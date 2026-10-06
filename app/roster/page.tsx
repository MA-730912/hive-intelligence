"use client";

import Link from "next/link";
import {useMemo,useState} from "react";

type ShiftType="day"|"evening"|"night"|"public-holiday";
type ShiftStatus="rostered"|"worked"|"requested"|"available";

type Shift={
  id:string;
  day:string;
  date:string;
  label:string;
  location:string;
  start:number;
  end:number;
  type:ShiftType;
  status:ShiftStatus;
  multiplier:number;
  allowance:number;
  notes?:string;
};

const shifts:Shift[]=[
  {id:"m",day:"Mon",date:"5 Oct",label:"Public holiday ED",location:"Main ED",start:8,end:18,type:"public-holiday",status:"worked",multiplier:2.5,allowance:0,notes:"Public-holiday penalty"},
  {id:"t",day:"Tue",date:"6 Oct",label:"Evening ED",location:"Main ED",start:14,end:24,type:"evening",status:"worked",multiplier:1.15,allowance:35},
  {id:"w",day:"Wed",date:"7 Oct",label:"Evening ED",location:"Main ED",start:14,end:24,type:"evening",status:"rostered",multiplier:1.15,allowance:35},
  {id:"f",day:"Fri",date:"9 Oct",label:"Night ED",location:"Main ED",start:22.5,end:32.5,type:"night",status:"rostered",multiplier:1.25,allowance:65},
  {id:"s",day:"Sat",date:"10 Oct",label:"Night ED",location:"Main ED",start:22.5,end:32.5,type:"night",status:"rostered",multiplier:1.5,allowance:65},
  {id:"su",day:"Sun",date:"11 Oct",label:"Open extra shift",location:"Short Stay",start:10,end:18,type:"day",status:"available",multiplier:1.75,allowance:0},
];

const awardProfiles=[
  {id:"demo-medical",name:"Demo Clinical Award Profile",base:118},
  {id:"demo-senior",name:"Demo Senior Medical Profile",base:145},
  {id:"custom",name:"Organisation Custom Agreement",base:132},
];

function hours(shift:Shift){return Math.max(0,shift.end-shift.start)}
function money(n:number){return new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0}).format(n)}

export default function RosterSchedulePage(){
  const [profileId,setProfileId]=useState("demo-medical");
  const [claimed,setClaimed]=useState(false);
  const [request,setRequest]=useState<"none"|"leave"|"swap"|"extra">("none");
  const [notice,setNotice]=useState("");
  const profile=awardProfiles.find(p=>p.id===profileId) ?? awardProfiles[0];

  const activeShifts=useMemo(()=>shifts.filter(s=>s.status!=="available" || claimed),[claimed]);
  const rosteredHours=useMemo(()=>activeShifts.reduce((sum,s)=>sum+hours(s),0),[activeShifts]);
  const workedHours=useMemo(()=>activeShifts.filter(s=>s.status==="worked").reduce((sum,s)=>sum+hours(s),0),[activeShifts]);
  const estimate=useMemo(()=>activeShifts.reduce((sum,s)=>{
    const h=hours(s);
    const pay=h*profile.base*s.multiplier+s.allowance;
    return sum+pay;
  },0),[activeShifts,profile]);
  const penalties=useMemo(()=>activeShifts.reduce((sum,s)=>sum+(hours(s)*profile.base*(s.multiplier-1))+s.allowance,0),[activeShifts,profile]);

  function submitRequest(){
    if(request==="none"){setNotice("Choose leave, swap or an extra-shift request first.");return}
    const label=request==="leave"?"Leave request":request==="swap"?"Shift swap request":"Extra shift request";
    setNotice(label+" submitted for manager review in this demo.");
  }

  function claimExtra(){
    setClaimed(v=>!v);
    setNotice(!claimed?"Extra Sunday shift added to your draft roster. Estimated hours and pay have been recalculated.":"Extra Sunday shift removed from your draft roster.");
  }

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE – Roster Schedule</div>
        <h2>Intelligent clinical rostering</h2>
        <p className="muted">A clinician-first roster combining schedule, requests, fatigue intelligence, hours and transparent pay estimation.</p>
      </div>
      <div className="actions" style={{marginTop:0}}>
        <Link className="btn" href="/wellbeing">Wellbeing view</Link>
        <Link className="btn" href="/dashboard">Dashboard</Link>
      </div>
    </div>

    <div className="demo-banner">
      <strong>Pay estimate only:</strong> this MVP uses synthetic award profiles. Production organisations should load the applicable award, enterprise agreement, classification, allowances and overtime rules before HIVE is used for payroll decisions.
    </div>

    <section className="card roster-hero">
      <div>
        <div className="eyebrow">My roster · Week 5–11 October</div>
        <h3>Your week at a glance</h3>
        <p className="muted">Shift requests, pay impacts and recovery risks update together rather than living in separate systems.</p>
      </div>
      <label className="roster-award-select">
        <span>Pay / award profile</span>
        <select className="workspace-select" value={profileId} onChange={e=>setProfileId(e.target.value)}>
          {awardProfiles.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}
        </select>
      </label>
    </section>

    <div className="roster-kpis">
      <div className="card"><div className="muted">Rostered hours</div><div className="kpi">{rosteredHours.toFixed(1)}h</div><p className="muted">Includes accepted extra shifts.</p></div>
      <div className="card"><div className="muted">Hours worked</div><div className="kpi">{workedHours.toFixed(1)}h</div><p className="muted">Confirmed completed shifts.</p></div>
      <div className="card"><div className="muted">Estimated gross pay</div><div className="kpi">{money(estimate)}</div><p className="muted">Based on selected demo profile.</p></div>
      <div className="card"><div className="muted">Penalty / allowance uplift</div><div className="kpi">{money(penalties)}</div><p className="muted">Weekend, night, public-holiday and shift allowances.</p></div>
    </div>

    <section className="card" style={{marginTop:18}}>
      <div className="toolbar">
        <div><div className="eyebrow">Weekly schedule</div><h3>Roster + pay intelligence</h3></div>
        <span className="chip">LIVE-CALC DEMO</span>
      </div>

      <div className="roster-week">
        {shifts.map(shift=>{
          const included=shift.status!=="available"||claimed;
          const shiftPay=hours(shift)*profile.base*shift.multiplier+shift.allowance;
          return <article className={"roster-day "+shift.type+(shift.status==="available"&&!claimed?" open":"")} key={shift.id}>
            <div className="roster-day-top"><span>{shift.day}</span><small>{shift.date}</small></div>
            <strong>{shift.label}</strong>
            <small>{shift.location}</small>
            <div className="roster-time">{shift.start%1?String(Math.floor(shift.start)).padStart(2,"0")+":30":String(Math.floor(shift.start)%24).padStart(2,"0")+":00"}–{shift.end%1?String(Math.floor(shift.end%24)).padStart(2,"0")+":30":String(Math.floor(shift.end%24).padStart(2,"0"))+":00"}</div>
            <div className="roster-pay-row"><span>{hours(shift)}h</span><b>{included?money(shiftPay):"Available"}</b></div>
            <div className="chips">
              <span className="chip">×{shift.multiplier}</span>
              {shift.allowance>0&&<span className="chip">+{money(shift.allowance)}</span>}
            </div>
            {shift.status==="available"&&<button className="btn primary" type="button" onClick={claimExtra}>{claimed?"Remove extra shift":"Claim extra shift"}</button>}
          </article>
        })}
      </div>
    </section>

    <div className="roster-two-col">
      <section className="card">
        <div className="eyebrow">Shift requests</div>
        <h3>Request without email chains</h3>
        <div className="roster-request-grid">
          {[
            ["leave","Request leave","Annual / personal / study leave"],
            ["swap","Swap a shift","Offer or request an approved swap"],
            ["extra","Extra shift","Volunteer for additional coverage"],
          ].map(([id,title,desc])=><button type="button" key={id} className={"roster-request "+(request===id?"selected":"")} onClick={()=>{setRequest(id as typeof request);setNotice("")}}>
            <strong>{title}</strong><span>{desc}</span>
          </button>)}
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={submitRequest}>Submit request</button>
        </div>
        {notice&&<div className="message ai" style={{marginTop:14}}><strong>Roster update</strong><p className="muted">{notice}</p></div>}
      </section>

      <aside className="card roster-ai-card">
        <div className="eyebrow">HIVE roster intelligence</div>
        <h3>AI-assisted observations</h3>
        <div className="message ai"><strong>Recovery risk</strong><p className="muted">The Friday/Saturday night block is followed by limited recovery before the next day-shift cycle. Avoid adding optional morning commitments immediately afterward.</p></div>
        <div className="message"><strong>Cost visibility</strong><p className="muted">The public-holiday shift contributes the largest pay uplift this week. HIVE can show managers the cost impact before publishing a roster.</p></div>
        <div className="message"><strong>Coverage opportunity</strong><p className="muted">The open Sunday shift can be offered first to staff who are credentialled, available and below fatigue/overtime thresholds.</p></div>
      </aside>
    </div>

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Manager / organisation view</div>
      <h3>What makes HIVE – Roster Schedule different</h3>
      <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
        <div className="message"><strong>Credential-aware scheduling</strong><p className="muted">Only suggest staff with the required role, credential, competency and organisation readiness.</p></div>
        <div className="message"><strong>Demand-aware coverage</strong><p className="muted">Future demand signals can influence skill mix and staffing recommendations before gaps appear.</p></div>
        <div className="message"><strong>Award-aware cost</strong><p className="muted">Estimate penalties, allowances and overtime before publishing or accepting a shift change.</p></div>
        <div className="message"><strong>Wellbeing-aware rostering</strong><p className="muted">Use fatigue rules and clinician-controlled wellbeing boundaries without exposing private wellbeing responses to managers.</p></div>
      </div>
    </section>

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Closed-loop workflow</div>
      <h3>Request → approval → roster → hours → pay → wellbeing</h3>
      <p className="muted">Every accepted change should update the published roster, clinician dashboard, estimated pay, hours worked, fatigue picture and downstream payroll export in one auditable workflow.</p>
    </section>
  </main>;
}
