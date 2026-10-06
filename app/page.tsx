import Link from "next/link";

const capabilities=[
  ["01","Clinical Workspace","Structured clinical reasoning, red flags, priorities, ISBAR and clinician-review controls.","/workspace"],
  ["02","Clinical Knowledge","Organisation-scoped RAG with retrieved-source citations and safe retrieval-only fallback.","/knowledge"],
  ["03","Document Intelligence","Secure document ingestion, chunking, embeddings and organisation knowledge management.","/knowledge/documents"],
  ["04","Clinician Hub","Credentials, organisations, competencies, CPD, professional administration and daily readiness.","/clinician"],
  ["05","Simulation Studio","High-fidelity clinical simulation architecture with monitoring, POCUS, imaging and debrief capability.","/architecture"],
  ["06","Control Centre","Provider routing, governance, safety, auditability, usage visibility and sovereign-compute readiness.","/dashboard"],
];

export default function Home(){
  return <>
    <section className="hero">
      <div>
        <div className="eyebrow">Australian clinical intelligence platform</div>
        <h1>Healthcare AI that understands <strong>the whole clinical system.</strong></h1>
        <p>HIVE Intelligence brings clinical reasoning, institutional knowledge, document intelligence, clinician readiness, simulation and governed AI orchestration into one healthcare intelligence layer.</p>
        <div className="actions">
          <Link className="btn primary" href="/workspace">Open Clinical Workspace</Link>
          <Link className="btn" href="/architecture">Explore AI Architecture</Link>
          <Link className="btn" href="/demo/firmus">Run Firmus Demo</Link>
        </div>
      </div>
      <div className="card">
        <div className="eyebrow" style={{color:"#b8f171"}}>HIVE AI Gateway</div>
        <div className="kpi">One governed intelligence layer</div>
        <p className="muted">Provider-neutral by design. Clinical workflows remain stable while approved inference can move between hosted, private or Australian sovereign compute.</p>
        <div className="chips" style={{marginTop:18}}>
          <span className="chip">Clinical AI</span><span className="chip">RAG</span><span className="chip">Embeddings</span><span className="chip">Audit</span><span className="chip">Simulation</span><span className="chip">Clinician readiness</span>
        </div>
      </div>
    </section>
    <section className="section" style={{paddingTop:10}}>
      <div className="eyebrow">One connected platform</div>
      <h2>Intelligence across care, knowledge and workforce.</h2>
    </section>
    <section className="grid">
      {capabilities.map(([n,title,desc,href])=><Link className="card" href={href} key={title}>
        <div className="eyebrow">{n}</div><h3>{title}</h3><p className="muted">{desc}</p><span style={{fontWeight:900,color:"var(--teal)"}}>Open capability →</span>
      </Link>)}
    </section>
  </>
}