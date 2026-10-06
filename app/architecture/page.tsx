import Link from "next/link";

const layers=[
  ["01","Clinical AI","Clinical reasoning, structured documentation and decision-support workflows.","Current"],
  ["02","Clinical Knowledge","Institutional RAG, approved guidelines, policies and citations.","Current"],
  ["03","Document Intelligence","Document ingestion, chunking, embeddings and future extraction/summarisation.","Current / expanding"],
  ["04","Clinician Intelligence","Credentials, organisations, competencies, CPD, reminders and professional readiness.","Current MVP"],
  ["05","Simulation Intelligence","Scenario engine, monitoring, POCUS, imaging, team agents, debrief and competency evidence.","Parallel feature branch"],
  ["06","Control Centre","Model routing, safety, audit, organisation governance and future usage/quality monitoring.","Expanding"],
  ["07","AI Gateway","Provider-neutral inference and embedding interfaces designed for sovereign compute.","Current"],
  ["08","Specialist Modules","HIVE ECG and HIVE Imaging can connect through the same governed intelligence layer.","Planned"],
];
const integrations=[
  ["Clinical case analysis","OpenAI-compatible chat completion","Live-capable"],
  ["Knowledge synthesis","RAG context + chat completion","Live-capable"],
  ["Semantic retrieval","384-dimension embedding endpoint","Live-capable"],
  ["Clinician reminders","Rules engine","Deterministic"],
  ["Calendar preparation","Provider-neutral calendar contract","Demo / planned live connector"],
  ["Document extraction & summarisation","AI gateway","Next integration"],
  ["Simulation authoring / debrief","AI gateway + authoritative simulation engine","Planned"],
  ["Imaging / ECG intelligence","Specialist model adapters","Planned"],
];

export default function ArchitecturePage(){
 return <main className="section">
   <div className="toolbar"><div><div className="eyebrow">HIVE Intelligence architecture</div><h2>One intelligence layer. Multiple healthcare systems.</h2><p className="muted">This map distinguishes what is implemented, what is deterministic, and where AI should integrate next.</p></div><Link className="btn primary" href="/workspace">Open clinical AI</Link></div>
   <div className="arch-grid">{layers.map(([n,title,desc,status])=><article className="card arch-card" key={title}><div className="num">{n}</div><h3>{title}</h3><p className="muted">{desc}</p><span className={status.includes("Planned")||status.includes("branch")?"pill planned":"pill"}>{status}</span></article>)}</div>
   <div className="chat" style={{marginTop:20}}>
     <section className="card"><div className="eyebrow">AI integration map</div><h3>Where intelligence enters the platform</h3>{integrations.map(([name,tech,status])=><div className="integration" key={name}><div><strong>{name}</strong><div className="muted">{tech}</div></div><span className={status==="Live-capable"?"pill":status==="Deterministic"?"pill demo":"pill planned"}>{status}</span></div>)}</section>
     <aside className="card"><div className="eyebrow">Design principle</div><h3>AI assists. HIVE governs.</h3><p className="muted">Models should never become the architecture. HIVE owns identity, workflow, source provenance, permissions, safety, audit and the clinician experience; models remain replaceable services behind the gateway.</p><hr style={{borderColor:"var(--line)",margin:"20px 0"}}/><strong>Current production gap</strong><p className="muted">Authentication/RBAC, immutable audit, distributed rate limiting, clinical validation and formal production security controls still need completion before real patient data.</p></aside>
   </div>
 </main>
}