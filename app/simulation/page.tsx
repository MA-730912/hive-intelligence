import Link from "next/link";
export default function SimulationStudio(){
  return <main className="section">
    <div className="toolbar"><div><div className="eyebrow">HIVE Simulation Studio</div><h2>Clinical Simulation Centre</h2></div><span className="chip">MVP v0.1</span></div>
    <div className="demo-banner"><strong>Purpose:</strong> browser-based high-fidelity clinical simulation with instructor control, realistic monitoring, investigations, medications, virtual staff and debrief-ready event capture.</div>
    <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(3,minmax(0,1fr))"}}>
      <section className="card"><div className="eyebrow">Flagship scenario</div><h3>Septic Shock + DKA + Anaphylaxis</h3><p className="muted">Multisystem resuscitation with suspected necrotising fasciitis, dynamic physiology and source-control escalation.</p><Link className="btn primary" href="/simulation/scenarios/septic-shock-anaphylaxis-dka">Launch simulation</Link></section>
      <section className="card"><div className="eyebrow">Diagnostics library</div><h3>POCUS & Imaging Repository</h3><p className="muted">Positive FAST, tamponade, gallbladder inflammation, pneumothorax, B-lines, RV strain, AAA, hydronephrosis, chest X-rays, CT brain and more.</p><Link className="btn" href="/simulation/imaging">Open imaging repository</Link></section>
      <section className="card"><div className="eyebrow">Faculty tools</div><h3>Scenario Builder</h3><p className="muted">Create cases, define states, choose labs and imaging, configure triggers and debrief objectives.</p><Link className="btn" href="/simulation/builder">Open Scenario Builder</Link></section>
    </div>
  </main>
}
