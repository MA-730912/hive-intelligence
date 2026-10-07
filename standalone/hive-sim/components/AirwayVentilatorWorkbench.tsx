"use client";

import {DragEvent,useMemo,useState} from "react";
import {
  airwayProps,
  connectCircuit,
  initialAirwayWorkflow,
  insertETT,
  secureETT,
  type AirwayPropId,
} from "@/lib/kernel/airway";
import {
  canStartVentilation,
  configurePatient,
  initialVentilatorState,
  setVentSetting,
  startVentilation,
  type VentMode,
} from "@/lib/kernel/ventilator";

type Props={
  onAirwaySecured:()=>void;
  onVentilationStarted:(settings:{mode:VentMode;vtMl:number;rate:number;peep:number;fio2:number})=>void;
  onEvent:(message:string)=>void;
};

export default function AirwayVentilatorWorkbench({onAirwaySecured,onVentilationStarted,onEvent}:Props){
  const [airway,setAirway]=useState(initialAirwayWorkflow);
  const [vent,setVent]=useState(initialVentilatorState);
  const [dragging,setDragging]=useState<AirwayPropId|null>(null);

  const ready=useMemo(()=>canStartVentilation(vent,airway.circuitConnected),[vent,airway.circuitConnected]);

  function startDrag(e:DragEvent<HTMLButtonElement>,id:AirwayPropId){
    e.dataTransfer.setData("text/hive-prop",id);
    e.dataTransfer.effectAllowed="move";
    setDragging(id);
  }

  function dropOnPatient(e:DragEvent<HTMLDivElement>){
    e.preventDefault();
    const id=(e.dataTransfer.getData("text/hive-prop")||dragging) as AirwayPropId|null;
    setDragging(null);
    if(id==="ett"){
      setAirway(s=>insertETT(s));
      onEvent("ETT inserted — secure tube before circuit connection");
      return;
    }
    if(id==="bvm"){onEvent("BVM positioned at airway");return;}
    if(id==="laryngoscope"){onEvent("Laryngoscope positioned for airway procedure");return;}
    if(id==="oxygen-mask"){onEvent("Oxygen mask applied");return;}
    if(id==="suction"){onEvent("Suction catheter positioned");return;}
    onEvent("Prop positioned at patient");
  }

  function secure(){
    setAirway(s=>{
      const next=secureETT(s);
      if(next!==s){onAirwaySecured();onEvent("ETT secured");}
      return next;
    });
  }

  function connect(){
    setAirway(s=>{
      const next=connectCircuit(s);
      if(next!==s)onEvent("Ventilator circuit connected to ETT");
      return next;
    });
  }

  function configure(){
    setVent(v=>configurePatient(v));
    onEvent("Ventilator patient profile configured");
  }

  function activate(){
    if(!ready){onEvent("Ventilator start blocked — complete patient setup and connect circuit");return;}
    setVent(v=>{
      const next=startVentilation(v,airway.circuitConnected);
      onVentilationStarted({mode:next.mode,vtMl:next.vtMl,rate:next.rate,peep:next.peep,fio2:next.fio2});
      onEvent(`Ventilation started · ${next.mode} · VT ${next.vtMl} mL · RR ${next.rate} · PEEP ${next.peep} · FiO₂ ${Math.round(next.fio2*100)}%`);
      return next;
    });
  }

  return <section className="airwayWorkbench">
    <div className="procedureTray">
      <div className="workbenchTitle"><b>PROCEDURE PROPS</b><span>Drag equipment to the patient</span></div>
      <div className="propShelf">
        {airwayProps.map(p=><button
          key={p.id}
          draggable
          className={`clinicalProp ${dragging===p.id?"dragging":""}`}
          onDragStart={e=>startDrag(e,p.id)}
          onDragEnd={()=>setDragging(null)}
          onClick={()=>{setDragging(p.id);onEvent(`${p.label} selected — drag to patient target`)}}
        >
          <span className="propGlyph">{p.id==="ett"?"ETT":p.id==="bvm"?"BVM":p.id==="bougie"?"│":p.id==="oxygen-mask"?"O₂":p.id==="suction"?"SUC":"LAR"}</span>
          <b>{p.label}</b>
        </button>)}
      </div>

      <div
        className={`patientDropZone ${dragging?"armed":""}`}
        onDragOver={e=>e.preventDefault()}
        onDrop={dropOnPatient}
      >
        <div className="airwayHead">PATIENT AIRWAY</div>
        <strong>{airway.step==="available"?"Drop airway prop here":airway.step.replaceAll("-"," ")}</strong>
        <span>{airway.step==="inserted"?"ETT is in place. Secure it next.":airway.step==="secured"?"Tube secured. Connect ventilator circuit.":airway.circuitConnected?"Circuit connected. Ventilator can be activated.":"Airway interaction zone"}</span>
        <div className="airwayButtons">
          <button disabled={airway.step!=="inserted"} onClick={secure}>Secure ETT</button>
          <button disabled={airway.step!=="secured"} onClick={connect}>Connect circuit</button>
        </div>
      </div>
    </div>

    <div className="hiveVent">
      <div className="ventHeader">
        <div><b>HIVE VENT</b><span>{vent.status.toUpperCase()}</span></div>
        <div className={`ventState ${vent.status}`}>{vent.status==="active"?"VENTILATING":"STANDBY"}</div>
      </div>

      <div className="ventSteps">
        <span className={vent.patientConfigured?"done":"active"}>1 Patient</span>
        <span className={vent.patientConfigured?"active":""}>2 Mode</span>
        <span>3 Parameters</span>
        <span className={ready?"active":""}>4 Activate</span>
      </div>

      <div className="patientSetupRow">
        <button className={vent.patientConfigured?"selected":""} onClick={configure}>{vent.patientConfigured?"Patient configured ✓":"Configure adult patient"}</button>
        <span>Adult · 168 cm · IBW 64 kg · Passive</span>
      </div>

      <div className="modeRow">
        {(["VCV","PCV","PSV","SIMV","ASV"] as VentMode[]).map(mode=><button
          key={mode}
          className={vent.mode===mode?"selected":""}
          onClick={()=>setVent(v=>setVentSetting(v,"mode",mode))}
        >{mode}</button>)}
      </div>

      <div className="ventControls">
        <label>VT<input type="number" min="200" max="900" step="10" value={vent.vtMl} onChange={e=>setVent(v=>setVentSetting(v,"vtMl",Number(e.target.value)))}/><small>mL</small></label>
        <label>RR<input type="number" min="4" max="40" value={vent.rate} onChange={e=>setVent(v=>setVentSetting(v,"rate",Number(e.target.value)))}/><small>/min</small></label>
        <label>PEEP<input type="number" min="0" max="20" value={vent.peep} onChange={e=>setVent(v=>setVentSetting(v,"peep",Number(e.target.value)))}/><small>cmH₂O</small></label>
        <label>FiO₂<input type="number" min="21" max="100" value={Math.round(vent.fio2*100)} onChange={e=>setVent(v=>setVentSetting(v,"fio2",Number(e.target.value)/100))}/><small>%</small></label>
      </div>

      <div className="ventChecklist">
        <span className={airway.step==="secured"||airway.circuitConnected?"ok":""}>Airway device in place</span>
        <span className={airway.circuitConnected?"ok":""}>Patient circuit connected</span>
        <span className={vent.patientConfigured?"ok":""}>Patient configured</span>
      </div>

      <button className="activateVent" disabled={!ready||vent.status==="active"} onClick={activate}>
        {vent.status==="active"?"Ventilator Active":"Activate Ventilator"}
      </button>
    </div>
  </section>
}
