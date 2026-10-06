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
  return <main className="section" id="top"><Header title="CME, CPD & Education" subtitle="Your professional learning file: exam preparation, simulation evidence, certificates and development records."/>

    <div className="learning-file-grid">
      <Link className="learning-folder exam" href="/clinician/cpd/exam-prep">
        <div className="folder-tab">EXAM PREPARATION</div>
        <div className="folder-body">
          <div className="eyebrow">Fellowship exams</div>
          <h3>Primary & Fellowship Exam Preparation</h3>
          <p className="muted">Select your Fellowship, choose Primary or Fellowship level, then launch MCQ, SAQ/EMQ or viva practice.</p>
          <span className="folder-action">Open exam file →</span>
        </div>
      </Link>

      <a className="learning-folder" href="#simulation-evidence">
        <div className="folder-tab">SIMULATION</div>
        <div className="folder-body">
          <div className="eyebrow">Simulation-linked learning</div>
          <h3>Simulation Evidence</h3>
          <p className="muted">Review simulation completions, competency evidence and debrief-linked learning.</p>
          <span className="folder-action">Open simulation file ↓</span>
        </div>
      </a>

      <a className="learning-folder" href="#professional-record">
        <div className="folder-tab">CME / CPD RECORD</div>
        <div className="folder-body">
          <div className="eyebrow">Professional learning</div>
          <h3>Learning Record</h3>
          <p className="muted">CME/CPD activity, certificates, attestations, exam activity and annual reporting.</p>
          <span className="folder-action">Open learning file ↓</span>
        </div>
      </a>
    </div>

    <section className="card" id="simulation-evidence" style={{marginTop:18}}>
      <div className="toolbar">
        <div><div className="eyebrow">Simulation-linked learning</div><h3>Evidence from HIVE Simulation Studio</h3></div>
        <Link className="btn" href="/architecture#adverse-events">Governance + Simulation</Link>
      </div>
      {simulated.length===0?<p className="muted">No simulation evidence is currently attached to this synthetic profile.</p>:simulated.map(c=><div className="message" key={c.id}><strong>{c.title}</strong><p className="muted">{c.status.replaceAll("_"," ")}{c.lastAssessed?" · "+c.lastAssessed:""}</p></div>)}
      <div className="actions"><a className="btn" href="#top">Back to learning files ↑</a></div>
    </section>

    <section className="card" id="professional-record" style={{marginTop:18}}>
      <div className="eyebrow">Professional learning record</div>
      <h3>Your CME / CPD file</h3>
      <div className="message ai"><strong>Exam preparation</strong><p className="muted">Practice activity and future performance trends can feed your private learning plan.</p></div>
      <div className="message"><strong>Certificates & attestations</strong><p className="muted">Uploaded certificates, supervisor attestations and simulation evidence will sit in the same professional record.</p></div>
      <div className="message"><strong>Annual reporting</strong><p className="muted">Exportable summaries can support annual CME/CPD review without changing the underlying evidence.</p></div>
      <div className="actions">
        <Link className="btn primary" href="/clinician/cpd/exam-prep">Open Exam Preparation</Link>
        <Link className="btn" href="/clinician/competencies">View Competency Passport</Link>
      </div>
    </section>
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
        {e.invoiceReference&&<span className="chip">Invoice on file</span>}
        {e.receiptReference&&<span className="chip">Receipt on file</span>}
        <span className="chip">Payment integration planned</span>
      </div>
    </div>)}
    <div className="demo-banner"><strong>Payment design:</strong> first integrate official renewal/payment links and receipt reconciliation. Direct payments should only use approved provider/payment integrations.</div>
  </main>;
}
