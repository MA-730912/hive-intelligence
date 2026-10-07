"use client";

import Link from "next/link";
import {ChangeEvent,useEffect,useMemo,useState} from "react";
import {scenarios,type ScenarioId} from "@/lib/scenarios";
import type {InstructorAction} from "@/lib/sim";

type PropItem={
  id:string;
  label:string;
  kind:"image"|"video";
  mime:string;
  url:string;
  fileName:string;
};

export default function Instructor(){
  const [scenarioId,setScenarioId]=useState<ScenarioId>("septic-shock");
  const [connected,setConnected]=useState(false);
  const [channel,setChannel]=useState<BroadcastChannel|null>(null);
  const [log,setLog]=useState<string[]>(["Instructor console ready"]);
  const [props,setProps]=useState<PropItem[]>([]);
  const [propLabel,setPropLabel]=useState("");
  const [selectedPropId,setSelectedPropId]=useState<string>("");
  const selectedProp=useMemo(()=>props.find(p=>p.id===selectedPropId)||null,[props,selectedPropId]);

  useEffect(()=>{
    const ch=new BroadcastChannel("hive-sim-control");
    setChannel(ch); setConnected(true);
    return()=>ch.close();
  },[]);

  useEffect(()=>()=>{props.forEach(p=>URL.revokeObjectURL(p.url));},[props]);

  function send(action:InstructorAction,label:string){
    channel?.postMessage({type:"action",action});
    setLog(v=>[`${new Date().toLocaleTimeString()} — ${label}`,...v].slice(0,16));
  }

  function setScenario(id:ScenarioId){
    setScenarioId(id);
    channel?.postMessage({type:"scenario",scenarioId:id});
    setLog(v=>[`${new Date().toLocaleTimeString()} — Loaded ${scenarios[id].title}`,...v].slice(0,16));
  }

  function addProp(event:ChangeEvent<HTMLInputElement>){
    const file=event.target.files?.[0];
    event.target.value="";
    if(!file)return;
    const allowed=["image/jpeg","image/png","video/mp4"];
    if(!allowed.includes(file.type)){
      setLog(v=>[`${new Date().toLocaleTimeString()} — Prop rejected: JPEG, PNG or MP4 only`,...v].slice(0,16));
      return;
    }
    const item:PropItem={
      id:crypto.randomUUID(),
      label:propLabel.trim()||file.name.replace(/\.[^.]+$/,""),
      kind:file.type==="video/mp4"?"video":"image",
      mime:file.type,
      url:URL.createObjectURL(file),
      fileName:file.name
    };
    setProps(v=>[item,...v]);
    setSelectedPropId(item.id);
    setPropLabel("");
    setLog(v=>[`${new Date().toLocaleTimeString()} — Added prop: ${item.label}`,...v].slice(0,16));
  }

  function pushProp(item:PropItem){
    channel?.postMessage({type:"show-prop",prop:item});
    setLog(v=>[`${new Date().toLocaleTimeString()} — Displayed prop to learner: ${item.label}`,...v].slice(0,16));
  }

  function hideProp(){
    channel?.postMessage({type:"hide-prop"});
    setLog(v=>[`${new Date().toLocaleTimeString()} — Learner prop hidden`,...v].slice(0,16));
  }

  function removeProp(id:string){
    setProps(v=>{
      const item=v.find(p=>p.id===id);
      if(item)URL.revokeObjectURL(item.url);
      return v.filter(p=>p.id!==id);
    });
    if(selectedPropId===id)setSelectedPropId("");
  }

  return <main className="instructorShell">
    <header className="instructorTop">
      <div><div className="eyebrow">HIVE SIM CONTROL ROOM</div><h1>Instructor Console</h1></div>
      <div className={`connection ${connected?"ok":""}`}><i/>{connected?"Learner channel active":"Connecting"}</div>
      <Link href="/" target="_blank">Open Learner Room ↗</Link>
    </header>

    <section className="instructorGrid">
      <div className="controlCard wide">
        <div className="label">SCENARIO</div>
        <div className="scenarioControl">
          <select value={scenarioId} onChange={e=>setScenario(e.target.value as ScenarioId)}>
            {Object.values(scenarios).map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <div><h2>{scenarios[scenarioId].title}</h2><p>{scenarios[scenarioId].subtitle}</p></div>
        </div>
      </div>

      <div className="controlCard">
        <div className="label">HAEMODYNAMICS</div>
        <button className="control dangerControl" onClick={()=>send("hypotension","Acute hypotension")}>Drop BP</button>
        <button className="control" onClick={()=>send("deteriorate","Global deterioration")}>Deteriorate</button>
        <button className="control goodControl" onClick={()=>send("improve","Patient improved")}>Improve patient</button>
      </div>

      <div className="controlCard">
        <div className="label">RHYTHM</div>
        <button className="control dangerControl" onClick={()=>send("vf","Ventricular fibrillation")}>Trigger VF</button>
        <button className="control warningControl" onClick={()=>send("vt","Ventricular tachycardia")}>Trigger VT</button>
      </div>

      <div className="controlCard">
        <div className="label">AIRWAY / BREATHING</div>
        <button className="control warningControl" onClick={()=>send("desaturate","Acute desaturation")}>Desaturate</button>
      </div>

      <div className="controlCard">
        <div className="label">SESSION</div>
        <button className="control" onClick={()=>channel?.postMessage({type:"pause"})}>Pause scenario</button>
        <button className="control goodControl" onClick={()=>channel?.postMessage({type:"resume"})}>Resume</button>
        <button className="control dangerControl" onClick={()=>send("reset","Scenario reset")}>Reset patient</button>
      </div>

      <div className="controlCard wide propLibrary">
        <div className="label">SCENARIO PROPS · JPEG / PNG / MP4</div>
        <p className="propHelp">Upload faculty media such as CXR, CT screenshots, rashes, wounds, ECG photographs, ultrasound loops, procedure videos or other scenario cues. Push a prop to the learner only when it becomes available clinically.</p>
        <div className="propUploader">
          <input value={propLabel} onChange={e=>setPropLabel(e.target.value)} placeholder="Faculty label, e.g. Initial CXR"/>
          <label className="uploadButton">+ Upload prop<input type="file" accept="image/jpeg,image/png,video/mp4" onChange={addProp}/></label>
          <button className="control compact" onClick={hideProp}>Hide learner prop</button>
        </div>

        {props.length===0?<div className="propEmpty">No props uploaded for this browser session.</div>:
          <div className="propLayout">
            <div className="propList">
              {props.map(p=><button key={p.id} className={`propRow ${selectedPropId===p.id?"selected":""}`} onClick={()=>setSelectedPropId(p.id)}>
                <span className="propType">{p.kind==="video"?"MP4":"IMG"}</span>
                <span><b>{p.label}</b><small>{p.fileName}</small></span>
              </button>)}
            </div>
            <div className="propPreview">
              {selectedProp&&<>
                <div className="propPreviewMedia">
                  {selectedProp.kind==="video"?<video src={selectedProp.url} controls playsInline/>:<img src={selectedProp.url} alt={selectedProp.label}/>}
                </div>
                <div className="propPreviewActions">
                  <button className="control goodControl" onClick={()=>pushProp(selectedProp)}>Push to learner</button>
                  <button className="control dangerControl" onClick={()=>removeProp(selectedProp.id)}>Remove</button>
                </div>
              </>}
            </div>
          </div>}
      </div>

      <div className="controlCard wide">
        <div className="label">INSTRUCTOR EVENT LOG</div>
        <div className="instructorLog">{log.map((x,i)=><p key={i}>{x}</p>)}</div>
      </div>
    </section>
  </main>
}
