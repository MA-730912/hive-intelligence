import Link from "next/link";

export default function CaseStudiesPage(){
  return <main className="section">
    <div className="eyebrow">HIVE Intelligence demonstrations</div>
    <h2>Clinical Case Studies</h2>
    <p className="muted" style={{maxWidth:820,fontSize:18,lineHeight:1.6}}>
      Complex synthetic cases designed to demonstrate clinical reasoning, RAG-grounded policy retrieval,
      governance, structured outputs and simulation workflows.
    </p>

    <div className="grid" style={{padding:"24px 0 0",gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
      <Link href="/case-studies/septic-shock-anaphylaxis-dka" className="card" style={{display:"block"}}>
        <div className="eyebrow">Flagship multisystem emergency</div>
        <h3 style={{fontSize:24,marginBottom:10}}>Septic Shock + DKA + Anaphylaxis + Suspected Necrotising Fasciitis</h3>
        <p className="muted">
          50-year-old man, 90 kg. Mixed shock, severe infection, DKA, urgent source control and acute
          penicillin anaphylaxis in one governed HIVE workflow.
        </p>
        <div className="chips" style={{marginTop:18}}>
          <span className="chip">Mixed shock</span>
          <span className="chip">90 kg</span>
          <span className="chip">DKA</span>
          <span className="chip">Penicillin anaphylaxis</span>
          <span className="chip">Source control</span>
        </div>
      </Link>

      <Link href="/demo/firmus" className="card" style={{display:"block"}}>
        <div className="eyebrow">Partner capability demo</div>
        <h3 style={{fontSize:24,marginBottom:10}}>Anterior STEMI with Shock</h3>
        <p className="muted">
          Existing Firmus demonstration showing structured clinical analysis, provider abstraction,
          human review and governance.
        </p>
      </Link>
    </div>
  </main>
}
