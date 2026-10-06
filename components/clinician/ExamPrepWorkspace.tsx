"use client";

import Link from "next/link";
import {useMemo,useState} from "react";

const fellowships=[
  ["ACEM","Emergency Medicine"],
  ["RACP","Physicians"],
  ["ANZCA","Anaesthesia"],
  ["RACS","Surgery"],
  ["RACGP","General Practice"],
  ["OTHER","Other Fellowship"],
] as const;

type ExamLevel="primary"|"fellowship";
type PracticeMode="mcq"|"written"|"viva";

const samples={
  primary:{
    mcq:["Primary MCQ set","Core sciences and foundational knowledge"],
    written:["Primary written set","Short-answer foundational concepts"],
    viva:["Primary oral practice","Structured foundational oral questions"],
  },
  fellowship:{
    mcq:["Fellowship MCQ set","Advanced clinical knowledge and decision making"],
    written:["Fellowship SAQ / EMQ set","Advanced written exam practice"],
    viva:["Fellowship viva practice","High-level oral reasoning and management"],
  },
};

export default function ExamPrepWorkspace(){
  const [fellowship,setFellowship]=useState("ACEM");
  const [level,setLevel]=useState<ExamLevel>("fellowship");
  const [mode,setMode]=useState<PracticeMode>("written");
  const [started,setStarted]=useState(false);
  const [completed,setCompleted]=useState(false);

  const selection=useMemo(()=>samples[level][mode],[level,mode]);
  const college=fellowships.find(item=>item[0]===fellowship);

  function start(){
    setStarted(true);
    setCompleted(false);
  }
  function finish(){
    setCompleted(true);
    setStarted(false);
  }
  function reset(){
    setStarted(false);
    setCompleted(false);
  }

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">CME · Exam Preparation</div>
        <h2>Fellowship Exam Preparation</h2>
        <p className="muted">Choose your Fellowship, examination level and practice format, then launch a focused preparation session.</p>
      </div>
      <Link className="btn" href="/clinician/cpd">Back to CME / CPD</Link>
    </div>

    <div className="exam-folder-shell">
      <div className="exam-folder-tab">EXAM PREPARATION FILE</div>
      <section className="exam-folder card">
        <div className="exam-file-header">
          <div>
            <div className="eyebrow">Step 1</div>
            <h3>Select Fellowship / College</h3>
          </div>
          <span className="chip">{fellowship}</span>
        </div>

        <div className="exam-choice-grid">
          {fellowships.map(([code,name])=><button
            key={code}
            type="button"
            className={"exam-choice "+(fellowship===code?"selected":"")}
            onClick={()=>{setFellowship(code);reset();}}
          >
            <strong>{code}</strong>
            <span>{name}</span>
          </button>)}
        </div>

        <div className="exam-divider"/>

        <div className="exam-file-header">
          <div>
            <div className="eyebrow">Step 2</div>
            <h3>Select examination level</h3>
          </div>
          <span className="chip">{level==="primary"?"PRIMARY":"FELLOWSHIP"}</span>
        </div>

        <div className="exam-segment">
          <button type="button" className={level==="primary"?"selected":""} onClick={()=>{setLevel("primary");reset();}}>Primary Exam</button>
          <button type="button" className={level==="fellowship"?"selected":""} onClick={()=>{setLevel("fellowship");reset();}}>Fellowship Exam</button>
        </div>

        <div className="exam-divider"/>

        <div className="exam-file-header">
          <div>
            <div className="eyebrow">Step 3</div>
            <h3>Choose practice format</h3>
          </div>
        </div>

        <div className="exam-choice-grid three">
          <button type="button" className={"exam-choice "+(mode==="mcq"?"selected":"")} onClick={()=>{setMode("mcq");reset();}}><strong>MCQ</strong><span>Single-best-answer practice</span></button>
          <button type="button" className={"exam-choice "+(mode==="written"?"selected":"")} onClick={()=>{setMode("written");reset();}}><strong>SAQ / EMQ</strong><span>Written exam practice</span></button>
          <button type="button" className={"exam-choice "+(mode==="viva"?"selected":"")} onClick={()=>{setMode("viva");reset();}}><strong>Viva / Oral</strong><span>Structured oral reasoning</span></button>
        </div>

        <section className="exam-selection-summary">
          <div>
            <span>Selected pathway</span>
            <strong>{college?.[0]} · {level==="primary"?"Primary":"Fellowship"} · {mode.toUpperCase()}</strong>
            <small>{selection[1]}</small>
          </div>
          {!started&&!completed&&<button className="btn primary" type="button" onClick={start}>Start practice session</button>}
        </section>

        {started&&<section className="exam-session">
          <div className="eyebrow">Practice session</div>
          <h3>{selection[0]}</h3>
          <div className="message ai">
            <strong>Demo workflow</strong>
            <p className="muted">A production question bank will open here with exam-matched questions, timed or untimed mode, explanations, saved progress and targeted revision. This interaction demonstrates the closed-loop workflow without presenting unvalidated exam content.</p>
          </div>
          <div className="actions">
            <button className="btn primary" type="button" onClick={finish}>Complete demo session</button>
            <button className="btn" type="button" onClick={reset}>Change selection</button>
          </div>
        </section>}

        {completed&&<section className="exam-session complete">
          <div className="eyebrow">Session complete</div>
          <h3>Practice recorded in your learning pathway</h3>
          <p className="muted">The production version will save question performance, weak domains, revision targets and eligible CME/CPD learning activity to the clinician's private record.</p>
          <div className="actions">
            <button className="btn primary" type="button" onClick={start}>Practice another set</button>
            <Link className="btn" href="/clinician/cpd">Return to CME / CPD file</Link>
          </div>
        </section>}
      </section>
    </div>
  </main>;
}
