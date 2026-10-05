"use client";
import {useState} from "react";
import {pocusLibrary} from "@/lib/simulation/pocus-library";
import {imagingTeachingLibrary} from "@/lib/simulation/imaging-library";
import {PocusGraphic,ImagingGraphic} from "./TeachingImageGraphic";

export default function TeachingImagingLibrary(){
  const [tab,setTab]=useState<"pocus"|"imaging">("pocus");
  const [selected,setSelected]=useState(pocusLibrary[0].id);
  const [showReport,setShowReport]=useState(false);

  const pocus=pocusLibrary.find(c=>c.id===selected)??pocusLibrary[0];
  const imaging=imagingTeachingLibrary.find(c=>c.id===selected)??imagingTeachingLibrary[0];

  function switchTab(next:"pocus"|"imaging"){
    setTab(next);
    setSelected(next==="pocus"?pocusLibrary[0].id:imagingTeachingLibrary[0].id);
    setShowReport(false);
  }

  return <main className="section">
    <div className="toolbar">
      <div><div className="eyebrow">HIVE Simulation Studio</div><h2>POCUS & Imaging Repository</h2></div>
      <div className="chips">
        <button className={`btn ${tab==="pocus"?"primary":""}`} onClick={()=>switchTab("pocus")}>POCUS Library</button>
        <button className={`btn ${tab==="imaging"?"primary":""}`} onClick={()=>switchTab("imaging")}>X-ray / CT Library</button>
      </div>
    </div>

    <div className="demo-banner"><strong>Teaching repository:</strong> graphics are synthetic schematics for simulation development, not diagnostic medical images. The architecture is designed so licensed/de-identified teaching images can later replace them without changing scenario logic.</div>

    <div className="chat">
      <aside className="card">
        <div className="eyebrow">{tab==="pocus"?"POCUS cases":"Imaging cases"}</div>
        <h3>Case selector</h3>
        {(tab==="pocus"?pocusLibrary:imagingTeachingLibrary).map((item:any)=><button key={item.id} className={`btn ${selected===item.id?"primary":""}`} style={{width:"100%",textAlign:"left",marginBottom:8}} onClick={()=>{setSelected(item.id);setShowReport(false)}}>{item.title}</button>)}
      </aside>

      <section className="card">
        {tab==="pocus"?<>
          <div className="toolbar"><div><div className="eyebrow">{pocus.category} · {pocus.view}</div><h3>{pocus.title}</h3></div><span className="chip">POCUS</span></div>
          <PocusGraphic caseItem={pocus}/>
          <div className="message" style={{marginTop:14}}><strong>Key findings</strong><ul>{pocus.findings.map(v=><li key={v}>{v}</li>)}</ul></div>
          <button className="btn primary" onClick={()=>setShowReport(v=>!v)}>{showReport?"Hide interpretation":"Reveal interpretation"}</button>
          {showReport&&<div className="message ai" style={{marginTop:14}}><strong>Impression</strong><p>{pocus.impression}</p><strong>Teaching point</strong><p>{pocus.teachingPoint}</p></div>}
        </>:<>
          <div className="toolbar"><div><div className="eyebrow">{imaging.modality} · {imaging.bodyRegion}</div><h3>{imaging.title}</h3></div><span className="chip">IMAGING</span></div>
          <ImagingGraphic caseItem={imaging}/>
          <div className="message" style={{marginTop:14}}><strong>Key findings</strong><ul>{imaging.keyFindings.map(v=><li key={v}>{v}</li>)}</ul></div>
          <button className="btn primary" onClick={()=>setShowReport(v=>!v)}>{showReport?"Hide report":"Reveal report"}</button>
          {showReport&&<div className="message ai" style={{marginTop:14}}><strong>Report</strong><p>{imaging.report}</p><strong>Teaching point</strong><p>{imaging.teachingPoint}</p></div>}
        </>}
      </section>
    </div>
  </main>
}
