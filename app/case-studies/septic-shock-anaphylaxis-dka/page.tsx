import Link from "next/link";
import { septicShockAnaphylaxisCase as c } from "@/lib/case-studies/septic-shock-anaphylaxis";

export default function SepticShockCaseStudy(){
  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">{c.subtitle}</div>
        <h2 style={{maxWidth:1000}}>{c.title}</h2>
      </div>
      <Link className="btn" href="/case-studies">All case studies</Link>
    </div>

    <div className="demo-banner">
      <strong>Synthetic educational case:</strong> {c.safety}
    </div>

    <section className="card" style={{marginBottom:18}}>
      <div className="eyebrow">Patient</div>
      <h3>{c.patient.age}-year-old {c.patient.sex.toLowerCase()} · {c.patient.weightKg} kg</h3>
      <p style={{fontSize:18,lineHeight:1.6}}>{c.presentation}</p>
      <div className="chips">
        <span className="chip">Critical illness</span>
        <span className="chip">Mixed shock</span>
        <span className="chip">Human review required</span>
        <span className="chip">Synthetic data</span>
      </div>
    </section>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,minmax(0,1fr))",marginBottom:18}}>
      <section className="card">
        <div className="eyebrow">Physiology</div>
        {c.observations.map(v=><p key={v} className="muted">{v}</p>)}
      </section>
      <section className="card">
        <div className="eyebrow">DKA</div>
        {c.investigations.map(v=><p key={v} className="muted">{v}</p>)}
      </section>
      <section className="card">
        <div className="eyebrow">Source concern</div>
        {c.sourceConcern.map(v=><p key={v} className="muted">{v}</p>)}
      </section>
      <section className="card">
        <div className="eyebrow">Anaphylaxis</div>
        {c.anaphylaxisFeatures.map(v=><p key={v} className="muted">{v}</p>)}
      </section>
    </div>

    <section className="card" style={{marginBottom:18}}>
      <div className="eyebrow">HIVE reasoning challenge</div>
      <h3>Four simultaneous time-critical threats</h3>
      <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
        {c.simultaneousThreats.map((item,index)=><div className="message ai" key={item.title}>
          <strong>{index+1}. {item.title}</strong>
          <p className="muted">{item.description}</p>
        </div>)}
      </div>
    </section>

    <div className="chat" style={{marginBottom:18}}>
      <section className="card">
        <div className="eyebrow">Expected HIVE output</div>
        <h3>Immediate priorities</h3>
        <ol>{c.hiveExpectedPriorities.map(v=><li key={v} style={{marginBottom:12,lineHeight:1.5}}>{v}</li>)}</ol>
      </section>

      <aside className="card">
        <div className="eyebrow">Weight-based / emergency calculations</div>
        {c.calculations.map(item=><div className="message" key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.formula}</p>
          <div className="kpi" style={{fontSize:24}}>{item.result}</div>
          <p className="muted" style={{fontSize:12}}>{item.note}</p>
        </div>)}
      </aside>
    </div>

    <section className="card" style={{marginBottom:18}}>
      <div className="eyebrow">Dynamic deterioration timeline</div>
      <h3>Simulation progression</h3>
      <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(5,minmax(0,1fr))"}}>
        {c.timeline.map(step=><div className="message" key={step.time}>
          <div className="eyebrow">{step.time}</div>
          <strong>{step.event}</strong>
          <p className="muted">{step.detail}</p>
        </div>)}
      </div>
    </section>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
      <section className="card">
        <div className="eyebrow">Simulation Studio</div>
        <h3>Learning objectives</h3>
        <ul>{c.learningObjectives.map(v=><li key={v} style={{marginBottom:10}}>{v}</li>)}</ul>
      </section>
      <section className="card">
        <div className="eyebrow">Debrief</div>
        <h3>High-value discussion points</h3>
        <ul>{c.debriefPoints.map(v=><li key={v} style={{marginBottom:10}}>{v}</li>)}</ul>
      </section>
    </div>

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Inpatient continuation</div>
      <h3>From resuscitation to discharge documentation</h3>
      <p className="muted">Follow the same synthetic patient through ICU, surgical debridement, VAC therapy, PICC-based IV antibiotics and HITH discharge, then see how HIVE turns the structured admission data into a clinician-reviewable discharge summary.</p>
      <div className="actions">
        <Link className="btn primary" href="/case-studies/septic-shock-anaphylaxis-dka/discharge-summary">Generate Discharge Summary Demo</Link>
      </div>
    </section>

    <div className="actions" style={{marginTop:22}}>
      <Link className="btn primary" href="/workspace">Open Clinical Workspace</Link>
      <Link className="btn" href="/knowledge">Interrogate Clinical Knowledge</Link>
      <Link className="btn" href="/knowledge/documents">Load Local Guidelines</Link>
    </div>
  </main>
}
