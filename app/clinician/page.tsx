import Link from "next/link";
import {demoClinicianProfile as p} from "@/lib/clinician/demo-profile";

export default function ClinicianHubPage(){
  const verified=p.credentials.filter(c=>c.status==="verified").length;
  const current=p.competencies.filter(c=>c.status==="current").length;
  const activeOrgs=p.organisations.filter(o=>o.status==="active").length;
  const upcoming=p.expenses.filter(e=>e.status==="upcoming"||e.status==="overdue").length;

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE Clinician Hub</div>
        <h2>Your professional workspace</h2>
        <p className="muted">{p.specialty} · {p.fellowship} · Professional identity, organisations, competencies and administration in one place.</p>
      </div>
      <span className="chip">SYNTHETIC DEMO</span>
    </div>

    <div className="demo-banner"><strong>Architecture:</strong> Clinician Hub extends HIVE Intelligence. It reuses HIVE Clinical credentialling and onboarding concepts while remaining independent enough for hospitals that do not run HIVE Clinical.</div>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,minmax(0,1fr))",marginBottom:18}}>
      <div className="card"><div className="eyebrow">Credentials</div><div className="kpi">{verified}/{p.credentials.length}</div><p className="muted">Verified or current</p></div>
      <div className="card"><div className="eyebrow">Organisations</div><div className="kpi">{activeOrgs}</div><p className="muted">Active memberships</p></div>
      <div className="card"><div className="eyebrow">Competencies</div><div className="kpi">{current}</div><p className="muted">Current competencies</p></div>
      <div className="card"><div className="eyebrow">Professional admin</div><div className="kpi">{upcoming}</div><p className="muted">Upcoming obligations</p></div>
    </div>

    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
      {[
        ["Today","Meetings, AI reminders, credential alerts and professional obligations.","/clinician/today"],
        ["Credentials","AHPRA, fellowship/college, provider/prescriber numbers, indemnity and evidence.","/clinician/credentials"],
        ["My Organisations","Hospital memberships, onboarding, role and readiness by organisation.","/clinician/organisations"],
        ["Competency Passport","Clinical skills, simulation evidence, supervisor sign-off and revalidation.","/clinician/competencies"],
        ["CME, CPD & Exam Preparation","Learning record, fellowship exam preparation, practice questions, simulation completions and certificates.","/clinician/cpd"],
        ["Health & Wellbeing","Private check-ins, fatigue awareness, recovery planning and AI-guided supportive suggestions.","/wellbeing"],
        ["Professional Wallet","College fees, AHPRA renewal, indemnity, invoices, receipts and expense tracking.","/clinician/wallet"],
        ["Clinical Workspace","Return to HIVE clinical intelligence and documentation tools.","/workspace"],
      ].map(([title,desc,href])=><section className="card" key={title}>
        <div className="eyebrow">Clinician Hub</div>
        <h3>{title}</h3>
        <p className="muted">{desc}</p>
        <Link className="btn" href={href}>{title}</Link>
      </section>)}
    </div>

    <section className="card" style={{marginTop:18}}>
      <div className="eyebrow">Professional readiness</div>
      <h3>Organisation readiness snapshot</h3>
      {p.organisations.map(o=><div className="message" key={o.id}>
        <div className="toolbar" style={{marginBottom:8}}>
          <div><strong>{o.name}</strong><div className="muted">{o.role}{o.facility?" · "+o.facility:""}</div></div>
          <span className="chip">{o.readiness}% READY</span>
        </div>
        <div style={{height:8,borderRadius:999,background:"#081410",overflow:"hidden"}}><div style={{height:"100%",width:String(o.readiness)+"%",background:"var(--lime)"}}/></div>
        {o.outstanding.length>0&&<p className="muted" style={{marginBottom:0}}>Outstanding: {o.outstanding.join(" · ")}</p>}
      </div>)}
    </section>
  </main>
}
