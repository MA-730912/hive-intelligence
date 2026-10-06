"use client";
import Link from "next/link";
import {useState} from "react";

type Result = {
  answer: string;
  citations: Array<{
    id:string;
    title:string;
    sourceFilename?:string|null;
    similarity?:number|null;
    version?:string;
    owner?:string;
    updated?:string;
  }>;
  meta: {
    provider:string;
    model:string;
    mode:"live"|"retrieval-only";
    knowledgeSource:"supabase-pgvector"|"demo-catalogue";
  };
};

const starter="What does our policy say about a haemodynamically unstable patient with suspected STEMI?";

export default function KnowledgeWorkspace(){
  const [question,setQuestion]=useState(starter);
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function ask(){
    setLoading(true); setError(""); setResult(null);
    try{
      const response=await fetch("/api/knowledge/ask",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({question}),
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data?.error||"Knowledge query failed.");
      setResult(data);
    }catch(err){
      setError(err instanceof Error?err.message:"Knowledge query failed.");
    }finally{setLoading(false);}
  }

  return <div className="workspace">
    <aside className="side">
      <Link href="/workspace">Clinical Workspace</Link>
      <Link className="active" href="/knowledge">Clinical Knowledge</Link>
      <Link href="/knowledge/documents">Knowledge Documents</Link>
      <Link href="/knowledge/documents">Document Intelligence</Link>
      <Link href="/architecture#adverse-events">Simulation & Learning</Link>
      <Link href="/dashboard">Control Centre</Link>
    </aside>
    <main className="main">
      <div className="toolbar">
        <div>
          <div className="eyebrow">Grounded clinical knowledge</div>
          <h2 style={{margin:"6px 0"}}>Clinical Knowledge</h2>
        </div>
        <Link href="/knowledge/documents" className="btn">Manage documents</Link>
      </div>

      <div className="demo-banner"><strong>Guardrail:</strong> HIVE answers only from retrieved approved material. If the knowledge base does not contain support for an answer, it should say so rather than invent local policy.</div>

      <div className="chat">
        <section className="card case">
          <div className="muted">Ask a policy or guideline question</div>
          <textarea className="textarea" value={question} onChange={e=>setQuestion(e.target.value)} />
          <div className="actions"><button className="btn primary" onClick={ask} disabled={loading}>{loading?"Searching…":"Ask HIVE Knowledge"}</button></div>

          {error&&<div className="message" style={{marginTop:18}}><strong>Knowledge error</strong><p className="muted">{error}</p></div>}

          {result&&<>
            <div className="message ai" style={{marginTop:18}}>
              <strong>Source-backed answer</strong>
              <p style={{whiteSpace:"pre-wrap"}}>{result.answer}</p>
              <div className="chips">
                <span className="chip">{result.meta.mode==="live"?"AI synthesis":"Retrieval only"}</span>
                <span className="chip">{result.meta.knowledgeSource==="supabase-pgvector"?"Supabase pgvector":"Demo catalogue"}</span>
                <span className="chip">Citations required</span>
              </div>
            </div>

            <div className="message">
              <strong>Retrieved sources</strong>
              {result.citations.length===0?<p className="muted">No supporting source retrieved.</p>:result.citations.map((source,index)=><div key={source.id} style={{marginTop:14}}>
                <b>[{index+1}] {source.title}</b>
                <div className="muted">
                  {source.sourceFilename||source.version||"Approved knowledge source"}
                  {typeof source.similarity==="number"?` · ${Math.round(source.similarity*100)}% semantic similarity`:""}
                  {source.owner?` · ${source.owner}`:""}
                  {source.updated?` · Updated ${source.updated}`:""}
                </div>
              </div>)}
            </div>
          </>}
        </section>

        <aside className="card">
          <div className="eyebrow">Knowledge boundary</div>
          <h3>Approved sources only</h3>
          <p className="muted">When Supabase RAG is configured, queries are embedded and matched against organisation-scoped document chunks in pgvector.</p>
          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <div className="eyebrow">Fallback</div>
          <p className="muted">Until the dedicated database and embedding provider are configured, the clearly-labelled synthetic demonstration catalogue remains available for the Firmus demo.</p>
        </aside>
      </div>
    </main>
  </div>
}
