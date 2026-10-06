"use client";

import Link from "next/link";
import {useMemo,useState} from "react";

type CheckIn = {
  energy:number;
  sleep:number;
  stress:number;
  recovery:number;
};

type Shift = {
  id:string;
  date:string;
  label:string;
  start:string;
  end:string;
  type:"day"|"evening"|"night";
};

const demoRoster:Shift[]=[
  {id:"s1",date:"Tue 6 Oct",label:"ED shift",start:"14:00",end:"24:00",type:"evening"},
  {id:"s2",date:"Wed 7 Oct",label:"ED shift",start:"14:00",end:"24:00",type:"evening"},
  {id:"s3",date:"Fri 9 Oct",label:"Night shift",start:"22:30",end:"08:30",type:"night"},
  {id:"s4",date:"Sat 10 Oct",label:"Night shift",start:"22:30",end:"08:30",type:"night"},
  {id:"s5",date:"Mon 12 Oct",label:"ED shift",start:"08:00",end:"18:00",type:"day"},
];

function scoreLabel(value:number){
  if(value>=4) return "Good";
  if(value===3) return "Mixed";
  return "Needs attention";
}

function suggestions({energy,sleep,stress,recovery}:CheckIn){
  const items:string[]=[];
  if(sleep<=2) items.push("Prioritise a protected recovery window after work and reduce avoidable late-evening commitments where possible.");
  if(energy<=2) items.push("Keep the next non-urgent workload block lighter and consider a short movement, hydration or meal break before cognitively demanding work.");
  if(stress>=4) items.push("Use a brief decompression routine after the shift and identify one task that can be delegated, deferred or discussed with a colleague.");
  if(recovery<=2) items.push("Schedule one non-work recovery activity in the next 24 hours rather than relying on unscheduled downtime.");
  if(items.length===0) items.push("Your current check-in looks reasonably balanced. Preserve the routines that are supporting sleep, recovery and workload boundaries.");
  return items;
}

export default function WellbeingPage(){
  const [checkIn,setCheckIn]=useState<CheckIn>({energy:3,sleep:3,stress:3,recovery:3});
  const [saved,setSaved]=useState(false);
  const [showPlan,setShowPlan]=useState(false);
  const [showRoster,setShowRoster]=useState(true);
  const advice=useMemo(()=>suggestions(checkIn),[checkIn]);

  function update(key:keyof CheckIn,value:number){
    setCheckIn(prev=>({...prev,[key]:value}));
    setSaved(false);
    setShowPlan(false);
  }

  function save(){
    setSaved(true);
  }

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE Health & Wellbeing</div>
        <h2>Your private wellbeing workspace</h2>
        <p className="muted">A clinician-controlled space for check-ins, workload reflection, fatigue awareness and supportive planning.</p>
      </div>
      <Link className="btn" href="/dashboard">Back to dashboard</Link>
    </div>

    <div className="demo-banner">
      <strong>Private by design:</strong> wellbeing check-ins should belong to the clinician. Organisational dashboards should receive only appropriately aggregated or explicitly shared information, not private individual responses by default.
    </div>

    <section className="card roster-card" style={{marginBottom:18}}>
      <div className="toolbar">
        <div>
          <div className="eyebrow">Integrated roster</div>
          <h3>Shift pattern & recovery planning</h3>
          <p className="muted">HIVE can use roster patterns to make wellbeing suggestions more relevant for shift workers.</p>
        </div>
        <button className="btn" type="button" onClick={()=>setShowRoster(v=>!v)}>{showRoster?"Hide roster":"Show roster"}</button>
      </div>

      {showRoster&&<>
        <div className="roster-strip">
          {demoRoster.map(shift=><div className={"roster-shift "+shift.type} key={shift.id}>
            <span>{shift.date}</span>
            <strong>{shift.label}</strong>
            <small>{shift.start}–{shift.end}</small>
          </div>)}
        </div>
        <div className="message ai" style={{marginTop:14}}>
          <strong>Roster-aware AI observation</strong>
          <p className="muted">Two evening shifts are followed by a two-night block, then a day shift after limited recovery time. HIVE should flag compressed recovery windows and suggest protecting sleep, reducing optional commitments and moving non-urgent CME where practical.</p>
        </div>
      </>}
    </section>

    <div className="wellbeing-grid">
      <section className="card wellbeing-checkin">
        <div className="eyebrow">Daily check-in</div>
        <h3>How are you travelling today?</h3>
        <p className="muted">This is supportive reflection, not diagnosis or clinical monitoring.</p>

        {([
          ["energy","Energy"],
          ["sleep","Sleep quality"],
          ["stress","Stress load"],
          ["recovery","Recovery"],
        ] as Array<[keyof CheckIn,string]>).map(([key,label])=><div className="wellbeing-row" key={key}>
          <div><strong>{label}</strong><span>{scoreLabel(checkIn[key])}</span></div>
          <div className="wellbeing-scale">
            {[1,2,3,4,5].map(value=><button
              key={value}
              type="button"
              aria-label={label+" "+value+" of 5"}
              className={checkIn[key]===value?"selected":""}
              onClick={()=>update(key,value)}
            >{value}</button>)}
          </div>
        </div>)}

        <div className="actions">
          <button className="btn primary" type="button" onClick={save}>Save private check-in</button>
          <button className="btn" type="button" onClick={()=>setShowPlan(true)}>Generate supportive plan</button>
        </div>

        {saved&&<div className="message ai" style={{marginTop:16}}>
          <strong>Check-in saved for this demo session</strong>
          <p className="muted">Production HIVE should persist this only to the clinician's private wellbeing record unless they explicitly choose to share something.</p>
        </div>}
      </section>

      <aside className="card wellbeing-ai">
        <div className="eyebrow">AI-guided wellbeing</div>
        <h3>Supportive suggestions</h3>
        <p className="muted">HIVE can use your own check-in, calendar load and professional commitments to suggest practical, low-risk actions while avoiding diagnosis.</p>
        {advice.map(item=><div className="message ai" key={item}>{item}</div>)}
        <div className="chips">
          <span className="chip">Private</span>
          <span className="chip">Clinician controlled</span>
          <span className="chip">Non-diagnostic</span>
        </div>
      </aside>
    </div>

    {showPlan&&<section className="card wellbeing-plan" style={{marginTop:18}}>
      <div className="toolbar">
        <div><div className="eyebrow">Suggested plan</div><h3>A small plan for the next 24 hours</h3></div>
        <span className="chip">AI ASSISTED</span>
      </div>
      <div className="wellbeing-plan-grid">
        <div className="message"><strong>Before / during work</strong><p className="muted">Protect one short break, hydrate, and avoid stacking non-urgent administrative work into already high-load periods.</p></div>
        <div className="message"><strong>After work</strong><p className="muted">Use a deliberate transition out of work: food, hydration, movement, shower, quiet time or another routine that helps separate work from home.</p></div>
        <div className="message"><strong>Recovery</strong><p className="muted">Choose one realistic recovery action rather than a long idealised list. HIVE can adapt this around your roster and calendar.</p></div>
      </div>
      <div className="actions">
        <button className="btn primary" type="button" onClick={save}>Save this plan</button>
        <Link className="btn" href="/clinician/today">Review today's commitments</Link>
      </div>
    </section>}

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Future AI integrations</div>
      <h3>Useful intelligence without becoming intrusive</h3>
      <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
        <div className="message"><strong>Roster & calendar load</strong><p className="muted">Combine shift patterns, nights, quick turnarounds, meetings, exams and professional obligations to identify compressed recovery windows and suggest safer scheduling choices.</p></div>
        <div className="message"><strong>Learning load</strong><p className="muted">Balance CME, exam preparation and simulation commitments against the roster so revision and training do not automatically land after nights or during heavy shift clusters.</p></div>
        <div className="message"><strong>Reflection prompts</strong><p className="muted">Offer optional prompts after difficult shifts, simulation or adverse clinical events, with clear privacy boundaries.</p></div>
      </div>
    </section>

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Safety boundary</div>
      <h3>Wellbeing support is not emergency care</h3>
      <p className="muted">HIVE should not diagnose mental-health conditions or infer impairment from private check-ins. If a user indicates immediate danger or urgent health concerns, the product should direct them to appropriate human or emergency support rather than attempting to manage the situation with AI.</p>
    </section>
  </main>;
}
