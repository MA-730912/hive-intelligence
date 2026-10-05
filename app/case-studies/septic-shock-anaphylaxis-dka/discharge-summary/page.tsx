import Link from "next/link";
import { septicShockAnaphylaxisCase as c } from "@/lib/case-studies/septic-shock-anaphylaxis";

export default function DischargeSummaryDemo(){
  const d=c.dischargeSummaryDemo;
  const s=d.summary;

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">Clinical document intelligence demo</div>
        <h2 style={{maxWidth:1000}}>Generated Discharge Summary</h2>
      </div>
      <Link className="btn" href="/case-studies/septic-shock-anaphylaxis-dka">Back to case</Link>
    </div>

    <div className="demo-banner">
      <strong>Synthetic demonstration:</strong> HIVE transforms structured inpatient facts into a draft discharge summary for clinician review. It does not invent missing microbiology, doses, durations or discharge medications.
    </div>

    <div className="chat" style={{alignItems:"start",marginBottom:18}}>
      <section className="card">
        <div className="eyebrow">1. Source information available to HIVE</div>
        <h3>Structured hospital facts</h3>

        <div className="message">
          <strong>Patient</strong>
          <p className="muted">{c.patient.age}-year-old {c.patient.sex.toLowerCase()}, {c.patient.weightKg} kg</p>
        </div>

        <div className="message">
          <strong>Admission problems</strong>
          <ul>{c.inpatientCourse.admissionDiagnosis.map(v=><li key={v}>{v}</li>)}</ul>
        </div>

        <div className="message">
          <strong>ICU course</strong>
          <p className="muted">{c.inpatientCourse.icuStay}</p>
        </div>

        <div className="message">
          <strong>Procedures / source control</strong>
          <ul>{c.inpatientCourse.procedures.map(v=><li key={v}>{v}</li>)}</ul>
        </div>

        <div className="message">
          <strong>Current treatment</strong>
          <ul>{c.inpatientCourse.currentTherapy.map(v=><li key={v}>{v}</li>)}</ul>
        </div>

        <div className="message">
          <strong>Discharge destination</strong>
          <p className="muted">{c.inpatientCourse.dischargeDestination}</p>
        </div>
      </section>

      <aside className="card">
        <div className="eyebrow">Generation pipeline</div>
        <h3>How HIVE builds the document</h3>
        {[
          "Collect structured source facts",
          "Separate diagnoses, procedures, treatment and follow-up",
          "Preserve critical allergy information",
          "Generate clinician-facing prose",
          "Add explicit follow-up and safety-net sections",
          "Flag absent information instead of inventing it",
          "Require clinician review before release",
        ].map((v,i)=><div className="message ai" key={v}>
          <strong>{i+1}. {v}</strong>
        </div>)}
        <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
        <div className="eyebrow">Provenance</div>
        <p className="muted">{s.provenanceNote}</p>
      </aside>
    </div>

    <section className="card" style={{marginBottom:18}}>
      <div className="toolbar">
        <div>
          <div className="eyebrow">2. HIVE-generated draft</div>
          <h3 style={{margin:"6px 0"}}>Discharge Summary — Clinician Review Required</h3>
        </div>
        <span className="chip">Draft • Synthetic</span>
      </div>

      <div className="message ai">
        <strong>Patient</strong>
        <p>{s.patient}</p>
      </div>

      <div className="message">
        <strong>Principal diagnosis</strong>
        <p>{s.principalDiagnosis}</p>
      </div>

      <div className="message">
        <strong>Additional diagnoses</strong>
        <ul>{s.additionalDiagnoses.map(v=><li key={v}>{v}</li>)}</ul>
      </div>

      <div className="message">
        <strong>Hospital course</strong>
        <p style={{lineHeight:1.65}}>{s.hospitalCourse}</p>
      </div>

      <div className="message">
        <strong>Procedures</strong>
        <ul>{s.procedures.map(v=><li key={v}>{v}</li>)}</ul>
      </div>

      <div className="message">
        <strong>Discharge treatment / active management</strong>
        <ul>{s.dischargeTreatment.map(v=><li key={v}>{v}</li>)}</ul>
      </div>

      <div className="message ai">
        <strong>Drug allergy / adverse drug reaction</strong>
        <p>{s.allergy}</p>
      </div>

      <div className="message">
        <strong>Follow-up</strong>
        <ul>{s.followUp.map(v=><li key={v}>{v}</li>)}</ul>
      </div>

      <div className="message">
        <strong>Safety-net advice</strong>
        <ul>{s.safetyNet.map(v=><li key={v}>{v}</li>)}</ul>
      </div>
    </section>

    <section className="card" style={{marginBottom:18}}>
      <div className="eyebrow">3. Information integrity</div>
      <h3>What HIVE deliberately does not fabricate</h3>
      <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(4,minmax(0,1fr))"}}>
        {[
          "Culture / organism results",
          "Vancomycin or meropenem doses",
          "Total antibiotic duration",
          "Full discharge medication list",
          "Laboratory values at discharge",
          "Exact surgical dates",
          "PICC insertion date",
          "Follow-up appointment dates",
        ].map(v=><div className="message" key={v}><strong>{v}</strong><p className="muted">Not present in source data — requires reconciliation.</p></div>)}
      </div>
    </section>

    <div className="actions">
      <Link className="btn primary" href="/workspace">Open Clinical Workspace</Link>
      <Link className="btn" href="/knowledge">Check Local Policy</Link>
      <Link className="btn" href="/knowledge/documents">View Knowledge Documents</Link>
    </div>
  </main>
}
