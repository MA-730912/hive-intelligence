"use client";
import {useMemo,useState} from "react";

export default function ScenarioBuilder(){
  const [title,setTitle]=useState("New Emergency Simulation");
  const [age,setAge]=useState(55);
  const [weight,setWeight]=useState(80);
  const [objectives,setObjectives]=useState("Recognise shock\nEscalate appropriately\nUse closed-loop communication");
  const [states,setStates]=useState(["Initial presentation","Deterioration","Intervention response","Recovery"]);

  const definition=useMemo(()=>({
    title,
    patient:{age,weightKg:weight},
    learningObjectives:objectives.split("\n").filter(Boolean),
    states:states.map((label,index)=>({id:`state-${index+1}`,label}))
  }),[title,age,weight,objectives,states]);

  function addState(){setStates(v=>[...v,`State ${v.length+1}`]);}

  return <main className="section">
    <div className="toolbar">
      <div><div className="eyebrow">Faculty authoring</div><h2>Scenario Builder</h2></div>
      <span className="chip">Draft builder</span>
    </div>

    <div className="demo-banner"><strong>Design principle:</strong> faculty define the educational intent and clinical states; HIVE supplies reusable monitor, lab, medication, staff, ventilator and debrief engines.</div>

    <div className="chat">
      <section className="card">
        <div className="eyebrow">Scenario identity</div>
        <label className="muted">Title</label>
        <input className="textarea" style={{minHeight:48,margin:"8px 0 16px"}} value={title} onChange={e=>setTitle(e.target.value)}/>

        <div className="grid" style={{padding:0,gridTemplateColumns:"repeat(2,1fr)"}}>
          <label className="message"><div className="muted">Patient age</div><input type="number" value={age} onChange={e=>setAge(Number(e.target.value))} style={{width:"100%",marginTop:8,padding:10,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8}}/></label>
          <label className="message"><div className="muted">Weight (kg)</div><input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} style={{width:"100%",marginTop:8,padding:10,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8}}/></label>
        </div>

        <label className="muted">Learning objectives · one per line</label>
        <textarea className="textarea" value={objectives} onChange={e=>setObjectives(e.target.value)}/>

        <div className="toolbar" style={{marginTop:18}}>
          <div><div className="eyebrow">Scenario states</div><h3 style={{margin:"4px 0"}}>Progression</h3></div>
          <button className="btn" onClick={addState}>Add state</button>
        </div>
        {states.map((value,index)=><div className="message" key={index}>
          <div className="toolbar" style={{marginBottom:0}}>
            <strong>{index+1}</strong>
            <input value={value} onChange={e=>setStates(v=>v.map((item,i)=>i===index?e.target.value:item))} style={{flex:1,marginLeft:12,padding:9,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:8}}/>
            {states.length>1&&<button className="btn" onClick={()=>setStates(v=>v.filter((_,i)=>i!==index))}>Remove</button>}
          </div>
        </div>)}
      </section>

      <aside className="card">
        <div className="eyebrow">Scenario definition preview</div>
        <h3>Portable JSON model</h3>
        <pre style={{whiteSpace:"pre-wrap",fontSize:11,lineHeight:1.5,color:"var(--muted)",background:"#081410",padding:14,borderRadius:12,border:"1px solid var(--line)",maxHeight:520,overflow:"auto"}}>{JSON.stringify(definition,null,2)}</pre>
        <p className="muted">Next step: persist this definition to Supabase, add state-level vitals/labs/triggers, then launch it using the same SimulationSession engine.</p>
      </aside>
    </div>
  </main>
}
