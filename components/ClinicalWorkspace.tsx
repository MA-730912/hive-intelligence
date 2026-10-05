"use client";
import {useState} from "react";
import type {ClinicalAnalysis} from "@/lib/ai/clinical";

const sample=`64-year-old with sudden central chest pain, diaphoresis and dyspnoea. BP 82/54, HR 126, RR 28, SpO₂ 93% on room air. Cool peripheries. ECG has anterior ST-segment elevation.`;

export default function ClinicalWorkspace({firmus=false}:{firmus?:boolean}){
  const [input,setInput]=useState(sample);
  const [analysis,setAnalysis]=useState<ClinicalAnalysis|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function runAnalysis(){
    setLoading(true);
    setError("");
    setAnalysis(null);
    try{
      const response=await fetch("/api/clinical/analyse",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({caseText:input}),
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data?.error||"Clinical analysis failed.");
      setAnalysis(data.analysis);
    }catch(err){
      setError(err instanceof Error?err.message:"Clinical analysis failed.");
    }finally{
      setLoading(false);
    }
  }

  function reset(){
    setInput(sample);
    setAnalysis(null);
    setError("");
  }

  return <div className="workspace">
    <aside className="side">
      <a className="active">Clinical Workspace</a>
      <a>Clinical Knowledge</a>
      <a>Document Intelligence</a>
      <a>Simulation Studio</a>
      <a>Control Centre</a>
    </aside>

    <main className="main">
      <div className="toolbar">
        <div>
          <div className="eyebrow">{firmus?"Partner capability demonstration":"Clinical Intelligence"}</div>
          <h2 style={{margin:"6px 0"}}>{firmus?"Firmus Demonstration":"Clinical Workspace"}</h2>
        </div>
        <span className="status"><span className="dot"/> Synthetic data only</span>
      </div>

      {firmus&&<div className="demo-banner"><strong>Demo objective:</strong> show a governed clinical AI layer that can route inference to approved Australian sovereign compute without changing the clinician workflow.</div>}

      <div className="chat">
        <section className="card case">
          <div className="muted">Synthetic ED case</div>
          <textarea className="textarea" value={input} onChange={e=>setInput(e.target.value)} />
          <div className="actions">
            <button className="btn primary" onClick={runAnalysis} disabled={loading}>{loading?"Analysing…":"Analyse case"}</button>
            <button className="btn" onClick={reset} disabled={loading}>Reset</button>
          </div>

          {error&&<div className="message" style={{marginTop:18}}><strong>Configuration / provider error</strong><p className="muted">{error}</p></div>}

          {analysis&&<>
            <div className="message ai" style={{marginTop:18}}>
              <div className="toolbar" style={{marginBottom:8}}>
                <strong>HIVE Intelligence</strong>
                <span className="chip">{analysis.acuity.toUpperCase()}</span>
              </div>
              <p>{analysis.summary}</p>
              <div className="chips">
                <span className="chip">{analysis.meta.mode==="live"?"Live model":"Mock demo"}</span>
                <span className="chip">Human review required</span>
                <span className="chip">Synthetic case</span>
              </div>
            </div>

            <div className="message">
              <strong>Red flags</strong>
              <ul>{analysis.redFlags.map((item,i)=><li key={i}>{item}</li>)}</ul>
            </div>

            <div className="message">
              <strong>Differential diagnosis</strong>
              {analysis.differentials.map((item,i)=><div key={i} style={{marginTop:12}}><b>{item.diagnosis}</b><div className="muted">{item.rationale}</div></div>)}
            </div>

            <div className="message">
              <strong>Immediate priorities</strong>
              <ol>{analysis.immediatePriorities.map((item,i)=><li key={i}>{item}</li>)}</ol>
            </div>

            <div className="message">
              <strong>ISBAR handover</strong>
              <p><b>I:</b> {analysis.isbar.identification}</p>
              <p><b>S:</b> {analysis.isbar.situation}</p>
              <p><b>B:</b> {analysis.isbar.background}</p>
              <p><b>A:</b> {analysis.isbar.assessment}</p>
              <p><b>R:</b> {analysis.isbar.recommendation}</p>
            </div>

            <div className="message">
              <strong>Safety notes</strong>
              <ul>{analysis.safetyNotes.map((item,i)=><li key={i}>{item}</li>)}</ul>
              <p className="muted" style={{marginTop:14}}>Provider: {analysis.meta.provider} · Model: {analysis.meta.model}</p>
            </div>
          </>}
        </section>

        <aside className="card">
          <div className="eyebrow">Governance</div>
          <h3>Session controls</h3>
          <p className="muted">Provider: HIVE AI Gateway</p>
          <p className="muted">Data class: Synthetic</p>
          <p className="muted">Human review: Required</p>
          <p className="muted">External tools: Disabled</p>
          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <div className="eyebrow">Provider abstraction</div>
          <p className="muted">The server route can target any approved OpenAI-compatible endpoint. The clinician UI does not need to change when compute moves to a sovereign provider.</p>
          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <div className="eyebrow">Next build</div>
          <p className="muted">Clinical Knowledge RAG with source citations from approved hospital policies.</p>
        </aside>
      </div>
    </main>
  </div>
}
