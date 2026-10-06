"use client";

import Link from "next/link";
import {ChangeEvent,useMemo,useState} from "react";

type ShiftType="day"|"evening"|"night"|"public-holiday";
type ShiftStatus="rostered"|"worked"|"requested"|"available";
type ViewMode="my-roster"|"roster-control";

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

type StaffMember={
  id:string;
  name:string;
  role:string;
  initials:string;
  requiredFortnightHours:number;
  scheduledFortnightHours:number;
  workedFortnightHours:number;
  annualLeaveHours:number;
  sickLeaveHours:number;
  marker?:"holiday"|"annual-leave"|"sick-leave"|"none";
};

const shifts:Shift[]=[
  {id:"m",day:"Mon",date:"5 Oct",label:"Public holiday ED",location:"Main ED",start:8,end:18,type:"public-holiday",status:"worked",multiplier:2.5,allowance:0,notes:"Public-holiday penalty"},
  {id:"t",day:"Tue",date:"6 Oct",label:"Evening ED",location:"Main ED",start:14,end:24,type:"evening",status:"worked",multiplier:1.15,allowance:35},
  {id:"w",day:"Wed",date:"7 Oct",label:"Evening ED",location:"Main ED",start:14,end:24,type:"evening",status:"rostered",multiplier:1.15,allowance:35},
  {id:"f",day:"Fri",date:"9 Oct",label:"Night ED",location:"Main ED",start:22.5,end:32.5,type:"night",status:"rostered",multiplier:1.25,allowance:65},
  {id:"s",day:"Sat",date:"10 Oct",label:"Night ED",location:"Main ED",start:22.5,end:32.5,type:"night",status:"rostered",multiplier:1.5,allowance:65},
  {id:"su",day:"Sun",date:"11 Oct",label:"Open extra shift",location:"Short Stay",start:10,end:18,type:"day",status:"available",multiplier:1.75,allowance:0},
];

const initialStaff:StaffMember[]=[
  {id:"h1",name:"Dr Amina Bello",role:"Emergency Physician",initials:"AB",requiredFortnightHours:80,scheduledFortnightHours:86,workedFortnightHours:42,annualLeaveHours:124,sickLeaveHours:76,marker:"none"},
  {id:"h2",name:"Dr Maya Chen",role:"Emergency Physician",initials:"MC",requiredFortnightHours:76,scheduledFortnightHours:76,workedFortnightHours:38,annualLeaveHours:92,sickLeaveHours:64,marker:"annual-leave"},
  {id:"h3",name:"Dr James Miller",role:"Registrar",initials:"JM",requiredFortnightHours:80,scheduledFortnightHours:92,workedFortnightHours:46,annualLeaveHours:58,sickLeaveHours:41,marker:"holiday"},
  {id:"h4",name:"Nurse Sophie Lee",role:"Clinical Nurse",initials:"SL",requiredFortnightHours:76,scheduledFortnightHours:70,workedFortnightHours:35,annualLeaveHours:110,sickLeaveHours:88,marker:"sick-leave"},
];

const awardProfiles=[
  {id:"demo-medical",name:"Demo Clinical Award Profile",base:118},
  {id:"demo-senior",name:"Demo Senior Medical Profile",base:145},
  {id:"custom",name:"Organisation Custom Agreement",base:132},
];

function hours(shift:Shift){return Math.max(0,shift.end-shift.start)}
function money(n:number){return new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0}).format(n)}
function markerLabel(marker:StaffMember["marker"]){
  if(marker==="holiday") return ["✦","PUBLIC HOLIDAY"];
  if(marker==="annual-leave") return ["◒","ANNUAL LEAVE"];
  if(marker==="sick-leave") return ["✚","SICK LEAVE"];
  return null;
}

export default function RosterSchedulePage(){
  const [view,setView]=useState<ViewMode>("my-roster");
  const [profileId,setProfileId]=useState("demo-medical");
  const [claimed,setClaimed]=useState(false);
  const [request,setRequest]=useState<"none"|"leave"|"swap"|"extra">("none");
  const [notice,setNotice]=useState("");
  const [staff,setStaff]=useState<StaffMember[]>(initialStaff);
  const [photos,setPhotos]=useState<Record<string,string>>({});
  const [alertTarget,setAlertTarget]=useState("all");
  const [alertMessage,setAlertMessage]=useState("Roster published for the next fortnight. Please review your shifts and acknowledge.");
  const [alertNotice,setAlertNotice]=useState("");
  const profile=awardProfiles.find(p=>p.id===profileId) ?? awardProfiles[0];

  const activeShifts=useMemo(()=>shifts.filter(s=>s.status!=="available" || claimed),[claimed]);
  const rosteredHours=useMemo(()=>activeShifts.reduce((sum,s)=>sum+hours(s),0),[activeShifts]);
  const workedHours=useMemo(()=>activeShifts.filter(s=>s.status==="worked").reduce((sum,s)=>sum+hours(s),0),[activeShifts]);
  const estimate=useMemo(()=>activeShifts.reduce((sum,s)=>sum+(hours(s)*profile.base*s.multiplier+s.allowance),0),[activeShifts,profile]);
  const penalties=useMemo(()=>activeShifts.reduce((sum,s)=>sum+(hours(s)*profile.base*(s.multiplier-1))+s.allowance,0),[activeShifts,profile]);

  const staffTotals=useMemo(()=>{
    const required=staff.reduce((sum,s)=>sum+s.requiredFortnightHours,0);
    const scheduled=staff.reduce((sum,s)=>sum+s.scheduledFortnightHours,0);
    const overtime=staff.reduce((sum,s)=>sum+Math.max(0,s.scheduledFortnightHours-s.requiredFortnightHours),0);
    const shortfall=staff.reduce((sum,s)=>sum+Math.max(0,s.requiredFortnightHours-s.scheduledFortnightHours),0);
    return {required,scheduled,overtime,shortfall};
  },[staff]);

  function submitRequest(){
    if(request==="none"){setNotice("Choose leave, swap or an extra-shift request first.");return}
    const label=request==="leave"?"Leave request":request==="swap"?"Shift swap request":"Extra shift request";
    setNotice(label+" submitted for manager review in this demo.");
  }

  function claimExtra(){
    setClaimed(v=>!v);
    setNotice(!claimed?"Extra Sunday shift added to your draft roster. Estimated hours and pay have been recalculated.":"Extra Sunday shift removed from your draft roster.");
  }

  function updateRequiredHours(id:string,value:number){
    setStaff(items=>items.map(member=>member.id===id?{...member,requiredFortnightHours:Math.max(0,value)}:member));
  }

  function updatePhoto(id:string,event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];
    if(!file) return;
    const url=URL.createObjectURL(file);
    setPhotos(prev=>({...prev,[id]:url}));
  }

  function sendAlert(){
    const target=alertTarget==="all"?"all rostered staff":staff.find(s=>s.id===alertTarget)?.name||"selected staff";
    setAlertNotice("Roster alert sent to "+target+" in this demo.");
  }

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE – Roster Schedule</div>
        <h2>Intelligent clinical rostering</h2>
        <p className="muted">A clinician-first roster with a dedicated authorised manager control layer.</p>
      </div>
      <div className="actions" style={{marginTop:0}}>
        <Link className="btn" href="/wellbeing">Wellbeing view</Link>
        <Link className="btn" href="/dashboard">Dashboard</Link>
      </div>
    </div>

    <div className="roster-mode-switch">
      <button type="button" className={view==="my-roster"?"active":""} onClick={()=>setView("my-roster")}>My Roster</button>
      <button type="button" className={view==="roster-control"?"active":""} onClick={()=>setView("roster-control")}>Roster Control · Admin</button>
    </div>

    {view==="my-roster"?<>
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
              {shift.type==="public-holiday"&&<div className="roster-sign holiday"><b>✦</b> PUBLIC HOLIDAY</div>}
              <div className="roster-time">{shift.start%1?String(Math.floor(shift.start)%24).padStart(2,"0")+":30":String(Math.floor(shift.start)%24).padStart(2,"0")+":00"}–{shift.end%1?String(Math.floor(shift.end)%24).padStart(2,"0")+":30":String(Math.floor(shift.end)%24).padStart(2,"0")+":00"}</div>
              <div className="roster-pay-row"><span>{hours(shift)}h</span><b>{included?money(shiftPay):"Available"}</b></div>
              <div className="chips"><span className="chip">×{shift.multiplier}</span>{shift.allowance>0&&<span className="chip">+{money(shift.allowance)}</span>}</div>
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
          <div className="actions"><button className="btn primary" type="button" onClick={submitRequest}>Submit request</button></div>
          {notice&&<div className="message ai" style={{marginTop:14}}><strong>Roster update</strong><p className="muted">{notice}</p></div>}
        </section>

        <aside className="card roster-ai-card">
          <div className="eyebrow">HIVE roster intelligence</div>
          <h3>AI-assisted observations</h3>
          <div className="message ai"><strong>Recovery risk</strong><p className="muted">The Friday/Saturday night block is followed by limited recovery before the next day-shift cycle. Avoid adding optional morning commitments immediately afterward.</p></div>
          <div className="message"><strong>Cost visibility</strong><p className="muted">The public-holiday shift contributes the largest pay uplift this week.</p></div>
          <div className="message"><strong>Coverage opportunity</strong><p className="muted">The open Sunday shift can be offered first to credentialled staff below fatigue/overtime thresholds.</p></div>
        </aside>
      </div>
    </>:<>
      <div className="demo-banner">
        <strong>Authorised manager view:</strong> fortnight targets, leave balances and roster alerts are workforce administration data. Accumulated sick leave should be restricted to authorised HR/manager roles and never shown on peer-facing team rosters.
      </div>

      <section className="card roster-control-hero">
        <div>
          <div className="eyebrow">Roster Control · Fortnight 5–18 October</div>
          <h3>Staffing hours, overtime, leave & alerts</h3>
          <p className="muted">Set each staff member's required fortnightly hours and let HIVE continuously show scheduled variance, overtime and gaps.</p>
        </div>
        <span className="pill">ADMIN / MANAGER</span>
      </section>

      <div className="roster-kpis">
        <div className="card"><div className="muted">Required hours</div><div className="kpi">{staffTotals.required}h</div><p className="muted">Fortnight requirement across displayed staff.</p></div>
        <div className="card"><div className="muted">Scheduled hours</div><div className="kpi">{staffTotals.scheduled}h</div><p className="muted">Current draft roster allocation.</p></div>
        <div className="card"><div className="muted">Overtime earmarked</div><div className="kpi">{staffTotals.overtime}h</div><p className="muted">Hours scheduled above individual targets.</p></div>
        <div className="card"><div className="muted">Coverage shortfall</div><div className="kpi">{staffTotals.shortfall}h</div><p className="muted">Hours still below individual requirements.</p></div>
      </div>

      <section className="card staff-roster-table" style={{marginTop:18}}>
        <div className="toolbar">
          <div><div className="eyebrow">Staff roster control</div><h3>Fortnightly hour requirements</h3></div>
          <div className="roster-legend">
            <span><b>✦</b> Public holiday</span><span><b>◒</b> Annual leave</span><span><b>✚</b> Sick leave</span><span><b>⏱</b> Overtime</span>
          </div>
        </div>

        <div className="staff-roster-head">
          <span>Staff member</span><span>Required</span><span>Scheduled</span><span>Variance</span><span>Worked</span><span>Leave balances</span>
        </div>

        {staff.map(member=>{
          const variance=member.scheduledFortnightHours-member.requiredFortnightHours;
          const marker=markerLabel(member.marker);
          return <div className="staff-roster-row" key={member.id}>
            <div className="staff-identity">
              <label className="staff-photo-wrap" title="Upload staff photo">
                {photos[member.id]?<img className="staff-photo" src={photos[member.id]} alt={member.name}/>:<span className="staff-photo fallback">{member.initials}</span>}
                <input type="file" accept="image/*" onChange={e=>updatePhoto(member.id,e)} />
              </label>
              <div><strong>{member.name}</strong><small>{member.role}</small>{marker&&<span className={"roster-sign "+member.marker}><b>{marker[0]}</b> {marker[1]}</span>}</div>
            </div>
            <label className="hours-input"><input type="number" min="0" step="1" value={member.requiredFortnightHours} onChange={e=>updateRequiredHours(member.id,Number(e.target.value))}/><span>hrs</span></label>
            <strong>{member.scheduledFortnightHours}h</strong>
            <span className={"variance "+(variance>0?"overtime":variance<0?"shortfall":"balanced")}>{variance>0?"⏱ +"+variance+"h OT":variance<0?Math.abs(variance)+"h short":"On target"}</span>
            <span>{member.workedFortnightHours}h</span>
            <div className="leave-balance">
              <span title="Annual leave balance">◒ AL <b>{member.annualLeaveHours}h</b></span>
              <span className="sick-private" title="Restricted sick leave balance">✚ SL <b>{member.sickLeaveHours}h</b></span>
            </div>
          </div>
        })}
      </section>

      <div className="roster-two-col">
        <section className="card">
          <div className="eyebrow">Roster alerts</div>
          <h3>Send a roster notification</h3>
          <label className="muted">Recipients</label>
          <select className="workspace-select" value={alertTarget} onChange={e=>setAlertTarget(e.target.value)} style={{margin:"8px 0 14px"}}>
            <option value="all">All rostered staff</option>
            {staff.map(member=><option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
          <label className="muted">Alert message</label>
          <textarea className="textarea" value={alertMessage} onChange={e=>setAlertMessage(e.target.value)} style={{marginTop:8,minHeight:100}}/>
          <div className="actions"><button className="btn primary" type="button" onClick={sendAlert}>Send roster alert</button></div>
          {alertNotice&&<div className="message ai" style={{marginTop:14}}><strong>🔔 Alert sent</strong><p className="muted">{alertNotice}</p><p>{alertMessage}</p></div>}
        </section>

        <aside className="card roster-ai-card">
          <div className="eyebrow">HIVE roster intelligence</div>
          <h3>Manager attention</h3>
          <div className="message ai"><strong>⏱ Overtime</strong><p className="muted">Two staff members are currently scheduled above their fortnight targets. HIVE should estimate cost before publication.</p></div>
          <div className="message"><strong>Coverage gap</strong><p className="muted">One staff member remains below target. HIVE can suggest an appropriate unfilled shift based on credential, availability and fatigue constraints.</p></div>
          <div className="message"><strong>Leave visibility</strong><p className="muted">Annual leave and public holidays remain visible on the operational roster; sick-leave balances stay restricted to authorised workforce roles.</p></div>
        </aside>
      </div>
    </>}

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Closed-loop workflow</div>
      <h3>Request → approval → roster → hours → overtime → pay → alert → wellbeing</h3>
      <p className="muted">Every accepted change should update the published roster, individual hour target, overtime exposure, leave state, clinician dashboard, estimated pay, fatigue picture and downstream payroll export in one auditable workflow.</p>
    </section>
  </main>;
}
