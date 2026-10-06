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
  ["09","Adverse Event Learning","Governance-led learning, teaching, simulation reconstruction and debrief from adverse clinical events.","Planned / expanding"],
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
   <section className="card" id="adverse-events" style={{marginTop:20}}>
     <div className="eyebrow">Governance + Simulation</div>
     <h3>Learning & Teaching from Adverse Clinical Events</h3>
     <p className="muted">Convert de-identified adverse clinical events into structured organisational learning without turning the platform into a blame or performance-surveillance tool. HIVE should support governance review, contributing-factor analysis, simulation reconstruction, facilitated debrief, teaching cases, competency learning and closed-loop improvement actions.</p>
     <div className="grid" style={{padding:"12px 0 0",gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
       {[
         ["1","Governance review","Capture the event, contributing factors, systems issues and agreed learning objectives."],
         ["2","Simulation reconstruction","Recreate a safe, de-identified version of the event for team learning and systems testing."],
         ["3","Teaching & debrief","Use structured facilitation, reflection and multidisciplinary discussion to translate the event into learning."],
         ["4","Close the loop","Track education, competency, policy or workflow changes arising from the event."]
       ].map(([n,title,desc])=><div className="message ai" key={title}><div className="eyebrow">{n}</div><strong>{title}</strong><p className="muted">{desc}</p></div>)}
     </div>
   </section>
   <div className="chat" style={{marginTop:20}}>
     <section className="card"><div className="eyebrow">AI integration map</div><h3>Where intelligence enters the platform</h3>{integrations.map(([name,tech,status])=><div className="integration" key={name}><div><strong>{name}</strong><div className="muted">{tech}</div></div><span className={status==="Live-capable"?"pill":status==="Deterministic"?"pill demo":"pill planned"}>{status}</span></div>)}</section>
     <aside className="card"><div className="eyebrow">Design principle</div><h3>AI assists. HIVE governs.</h3><p className="muted">Models should never become the architecture. HIVE owns identity, workflow, source provenance, permissions, safety, audit and the clinician experience; models remain replaceable services behind the gateway.</p><hr style={{borderColor:"var(--line)",margin:"20px 0"}}/><strong>Current production gap</strong><p className="muted">Authentication/RBAC, immutable audit, distributed rate limiting, clinical validation and formal production security controls still need completion before real patient data.</p></aside>
   </div>
 </main>
}