"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type DocumentRow = {
  id: string;
  title: string;
  source_filename: string | null;
  mime_type: string | null;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export default function DocumentManager(){
  const [documents,setDocuments]=useState<DocumentRow[]>([]);
  const [configured,setConfigured]=useState<boolean|null>(null);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  async function refresh(){
    try{
      const response=await fetch("/api/knowledge/documents",{cache:"no-store"});
      const data=await response.json();
      if(!response.ok) throw new Error(data?.error||"Unable to load documents.");
      setConfigured(Boolean(data.configured));
      setDocuments(data.documents||[]);
    }catch(err){
      setError(err instanceof Error?err.message:"Unable to load documents.");
    }
  }

  useEffect(()=>{void refresh();},[]);

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try{
      const form=new FormData(event.currentTarget);
      const response=await fetch("/api/knowledge/documents",{method:"POST",body:form});
      const data=await response.json();
      if(!response.ok && response.status!==202) throw new Error(data?.error||"Upload failed.");
      setMessage(
        data.status==="ready"
          ? `Indexed successfully into ${data.chunks} chunks.`
          : data.message||`Document status: ${data.status}`
      );
      event.currentTarget.reset();
      await refresh();
    }catch(err){
      setError(err instanceof Error?err.message:"Upload failed.");
    }finally{setLoading(false);}
  }

  return <div className="workspace">
    <aside className="side">
      <Link href="/workspace">Clinical Workspace</Link>
      <Link href="/knowledge">Clinical Knowledge</Link>
      <Link className="active" href="/knowledge/documents">Knowledge Documents</Link>
      <a>Document Intelligence</a>
      <a>Simulation Studio</a>
      <Link href="/dashboard">Control Centre</Link>
    </aside>

    <main className="main">
      <div className="toolbar">
        <div>
          <div className="eyebrow">RAG administration</div>
          <h2 style={{margin:"6px 0"}}>Knowledge Documents</h2>
        </div>
        <span className="status"><span className="dot"/> Private organisation library</span>
      </div>

      {configured===false&&<div className="demo-banner"><strong>Supabase not connected:</strong> configure the dedicated HIVE Intelligence Supabase project and organisation ID before uploading real documents.</div>}

      <div className="chat">
        <section className="card">
          <div className="eyebrow">Ingest policy</div>
          <h3>Upload and index</h3>
          <form onSubmit={submit}>
            <label className="muted">Document title</label>
            <input className="textarea" name="title" style={{minHeight:48,margin:"8px 0 16px"}} placeholder="e.g. Acute Coronary Syndrome Guideline" />

            <label className="muted">Policy file</label>
            <input name="file" type="file" accept=".txt,.md,.csv,.json,.pdf,.docx" style={{display:"block",margin:"10px 0 18px"}} />

            <label className="muted">Optional extracted / pasted text</label>
            <textarea className="textarea" name="text" placeholder="For TXT/MD/CSV/JSON this is extracted automatically. For PDF/DOCX in the current build, paste extracted text here if you want immediate indexing." />

            <div className="actions">
              <button className="btn primary" disabled={loading||configured===false}>{loading?"Uploading & indexing…":"Upload to HIVE Knowledge"}</button>
            </div>
          </form>

          {message&&<div className="message ai" style={{marginTop:18}}>{message}</div>}
          {error&&<div className="message" style={{marginTop:18}}><strong>Upload error</strong><p className="muted">{error}</p></div>}
        </section>

        <aside className="card">
          <div className="eyebrow">Pipeline</div>
          <h3>What happens</h3>
          <p className="muted">1. Raw source stored privately.</p>
          <p className="muted">2. Text normalised and split into overlapping chunks.</p>
          <p className="muted">3. Chunks embedded through the configured HIVE embedding gateway.</p>
          <p className="muted">4. Vectors stored in pgvector with document and organisation metadata.</p>
          <p className="muted">5. Clinical Knowledge retrieves only relevant organisation-scoped chunks.</p>
          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <p className="muted"><strong>Native indexing now:</strong> TXT, Markdown, CSV and JSON.</p>
          <p className="muted"><strong>PDF/DOCX:</strong> raw upload is supported; automated text extraction is the next parser layer.</p>
        </aside>
      </div>

      <section className="card" style={{marginTop:18}}>
        <div className="toolbar">
          <div>
            <div className="eyebrow">Organisation library</div>
            <h3 style={{margin:"6px 0"}}>{documents.length} document{documents.length===1?"":"s"}</h3>
          </div>
          <button className="btn" onClick={()=>void refresh()}>Refresh</button>
        </div>
        {documents.length===0?<p className="muted">No Supabase-backed documents have been uploaded yet.</p>:documents.map(doc=><div className="message" key={doc.id}>
          <div className="toolbar" style={{marginBottom:0}}>
            <div><strong>{doc.title}</strong><div className="muted">{doc.source_filename||"Pasted text"} · {new Date(doc.created_at).toLocaleString()}</div></div>
            <span className="chip">{doc.status}</span>
          </div>
        </div>)}
      </section>
    </main>
  </div>
}
