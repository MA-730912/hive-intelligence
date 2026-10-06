import Link from "next/link";

export default function Dashboard(){
  return <main className="section">
    <div className="toolbar">
      <div><div className="eyebrow">HIVE Control Centre</div><h2>Intelligence Dashboard</h2><p className="muted">A single operational view of clinical AI, knowledge, governance and clinician intelligence.</p></div>
      <Link href="/workspace" className="btn primary">New clinical session</Link>
    </div>
    <div className="grid" style={{padding:0,marginBottom:18}}>
      <div className="card"><div className="muted">Clinical inference</div><div className="kpi">Gateway ready</div><p className="muted">OpenAI-compatible provider abstraction with mock-safe demonstration fallback.</p></div>
      <div className="card"><div className="muted">Knowledge layer</div><div className="kpi">RAG enabled</div><p className="muted">Organisation-scoped pgvector retrieval with source-backed answers.</p></div>
      <div className="card"><div className="muted">Clinical data</div><div className="kpi">Synthetic MVP</div><p className="muted">Current demonstration is not approved for real patient information.</p></div>
    </div>
    <div className="chat">
      <section className="card">
        <div className="eyebrow">Platform intelligence</div><h3>Current AI integration points</h3>
        <div className="integration"><div><strong>Clinical reasoning</strong><div className="muted">Structured analysis, acuity, red flags, differentials, priorities and ISBAR.</div></div><span className="pill">LIVE-CAPABLE</span></div>
        <div className="integration"><div><strong>Clinical Knowledge</strong><div className="muted">RAG retrieval plus grounded synthesis with citations.</div></div><span className="pill">LIVE-CAPABLE</span></div>
        <div className="integration"><div><strong>Embedding pipeline</strong><div className="muted">Supabase Edge or OpenAI-compatible 384-dimensional embeddings.</div></div><span className="pill">LIVE-CAPABLE</span></div>
        <div className="integration"><div><strong>Clinician daily brief</strong><div className="muted">Currently deterministic reminder logic; suitable for a governed LLM summary layer later.</div></div><span className="pill demo">DETERMINISTIC</span></div>
        <div className="integration"><div><strong>Simulation intelligence</strong><div className="muted">Scenario authoring, virtual team and debrief AI are architectural integration points.</div></div><span className="pill planned">PLANNED</span></div>
      </section>
      <aside className="card">
        <div className="eyebrow">Governance</div><h3>Non-negotiable controls</h3>
        <p className="muted">Human review, source provenance, organisation boundaries, audit events, minimal data exposure, provider abstraction and safe fallback are part of the platform architecture rather than optional UI labels.</p>
        <Link href="/architecture" className="btn" style={{marginTop:12}}>View architecture</Link>
      </aside>
    </div>
  </main>
}