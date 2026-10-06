import Link from "next/link";
import {demoClinicianProfile as p} from "@/lib/clinician/demo-profile";

function Header({title,subtitle}:{title:string;subtitle:string}){
  return <>
    <div className="toolbar">
      <div><div className="eyebrow">HIVE Clinician Hub</div><h2>{title}</h2><p className="muted">{subtitle}</p></div>
      <Link className="btn" href="/clinician">Back to Clinician Hub</Link>
    </div>
    <div className="demo-banner"><strong>Synthetic demo:</strong> no real clinician identifiers or financial information are used in this module.</div>
  </>;
}

export function CredentialsView(){
  return <main className="section"><Header title="Credentials & Verification" subtitle="Built from the existing HIVE Clinical clinician onboarding and credential lifecycle."/>
    {p.credentials.map(c=><div className="card" key={c.id}>
      <div className="toolbar">
        <div><div className="eyebrow">{c.type}</div><h3>{c.title}</h3></div>
        <span className="chip">{c.status.toUpperCase()}</span>
      </div>
      <p className="muted">{c.issuer}{c.reference?" · "+c.reference:""}{c.expiry?" · expires "+c.expiry:""}</p>
      {c.evidence&&<p>Evidence: {c.evidence}</p>}
    </div>)}
  </main>;
}

export function OrganisationsView(){
  return <main className="section"><Header title="My Organisations" subtitle="One professional identity with organisation-specific onboarding and readiness."/>
    {p.organisations.map(o=><div className="card" key={o.id}>
      <div className="toolbar">
        <div><div className="eyebrow">{o.status}</div><h3>{o.name}</h3><p className="muted">{o.role}{o.facility?" · "+o.facility:""}</p></div>
        <div className="kpi">{o.readiness}%</div>
      </div>
      {o.outstanding.length>0?<ul>{o.outstanding.map(x=><li key={x}>{x}</li>)}</ul>:<p className="muted">No outstanding onboarding items.</p>}
    </div>)}
  </main>;
}

export function CompetenciesView(){
  return <main className="section"><Header title="Competency Passport" subtitle="Credential, course, supervisor and Simulation Studio evidence in one record."/>
    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
      {p.competencies.map(c=><div className="card" key={c.id}>
        <div className="toolbar">
          <div><div className="eyebrow">{c.category}</div><h3>{c.title}</h3></div>
          <span className="chip">{c.status.replaceAll("_"," ").toUpperCase()}</span>
        </div>
        <p className="muted">Evidence source: {c.source}{c.lastAssessed?" · assessed "+c.lastAssessed:""}{c.nextReview?" · review "+c.nextReview:""}</p>
        {c.evidence&&<p>{c.evidence}</p>}
      </div>)}
    </div>
  </main>;
}

export function CpdView(){
  const simulated=p.competencies.filter(c=>c.source==="simulation");
  return <main className="section"><Header title="CME, CPD & Education" subtitle="Professional development, exam preparation, simulation evidence and learning records."/>
    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(2,minmax(0,1fr))",marginBottom:18}}>
      <section className="card">
        <div className="eyebrow">Exam preparation</div>
        <h3>Select Fellowship</h3>
        <p className="muted">Choose your College or Fellowship pathway, then prepare for the relevant examination stream.</p>
        <label className="muted" htmlFor="fellowship-select">Fellowship / College</label>
        <select id="fellowship-select" className="workspace-select" defaultValue="ACEM" style={{marginTop:8}}>
          <option value="ACEM">ACEM — Emergency Medicine</option>
          <option value="RACP">RACP — Physicians</option>
          <option value="ANZCA">ANZCA — Anaesthesia</option>
          <option value="RACS">RACS — Surgery</option>
          <option value="RACGP">RACGP — General Practice</option>
          <option value="other">Other Fellowship</option>
        </select>
        <div className="actions">
          <button className="btn">Primary Exam</button>
          <button className="btn primary">Fellowship Exam</button>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Exam practice questions</div>
        <h3>Practice by exam level</h3>
        <p className="muted">Question banks should support exam-style MCQs, SAQs/EMQs, viva/oral practice, explanations, progress tracking and targeted revision.</p>
        <div className="message ai"><strong>Primary pathway</strong><p className="muted">Foundation sciences, core knowledge and exam-style practice.</p></div>
        <div className="message"><strong>Fellowship pathway</strong><p className="muted">Advanced clinical reasoning, written questions, viva preparation and high-level decision making.</p></div>
        <button className="btn primary">Start practice questions</button>
      </section>
    </div>

    <div className="card">
      <div className="eyebrow">Simulation-linked learning</div>
      <h3>Evidence from HIVE Simulation Studio</h3>
      {simulated.map(c=><div className="message" key={c.id}><strong>{c.title}</strong><p className="muted">{c.status.replaceAll("_"," ")}{c.lastAssessed?" · "+c.lastAssessed:""}</p></div>)}
    </div>
    <div className="card"><div className="eyebrow">Professional learning record</div><p className="muted">CME/CPD hours, activity categories, uploaded certificates, supervisor attestations, exam preparation activity and exportable annual reports will plug into this record.</p></div>
  </main>;
}

export function WalletView(){
  const total=p.expenses.filter(e=>e.status!=="paid").reduce((sum,e)=>sum+e.amount,0);
  return <main className="section"><Header title="Professional Wallet" subtitle="Professional fees, invoices, receipts and renewals in one administrative view."/>
    <div className="card"><div className="eyebrow">Outstanding / upcoming</div><div className="kpi">AUD {total.toLocaleString()}</div><p className="muted">Synthetic demo total. No direct payment integration is active.</p></div>
    {p.expenses.map(e=><div className="card" key={e.id}>
      <div className="toolbar">
        <div><div className="eyebrow">{e.category}</div><h3>{e.provider}</h3><p className="muted">{e.description}{e.dueDate?" · due "+e.dueDate:""}</p></div>
        <div style={{textAlign:"right"}}><div className="kpi" style={{fontSize:24}}>AUD {e.amount.toLocaleString()}</div><span className="chip">{e.status.replaceAll("_"," ").toUpperCase()}</span></div>
      </div>
      <div className="chips">
        {e.invoiceReference&&<button className="btn">View invoice</button>}
        {e.receiptReference&&<button className="btn">View receipt</button>}
        <button className="btn" disabled>Payment integration planned</button>
      </div>
    </div>)}
    <div className="demo-banner"><strong>Payment design:</strong> first integrate official renewal/payment links and receipt reconciliation. Direct payments should only use approved provider/payment integrations.</div>
  </main>;
}
