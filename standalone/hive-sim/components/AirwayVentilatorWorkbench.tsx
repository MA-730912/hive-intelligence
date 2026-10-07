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
  ventilatorOutputs,
  type VentMode,
} from "@/lib/kernel/ventilator";
import {mechanicsForScenario} from "@/lib/kernel/respiratory";

type Props={
  scenarioId:string;
  onAirwaySecured:()=>void;
  onVentilationStarted:(settings:{mode:VentMode;vtMl:number;rate:number;peep:number;fio2:number;estimatedEtco2:number;estimatedSpo2:number})=>void;
  onEvent:(message:string)=>void;
};

function VentWave({kind,peak,peep,vt}:{kind:"pressure"|"flow"|"volume";peak:number;peep:number;vt:number}){
  const pressureTop=Math.max(14,Math.min(46,84-peak*1.7));
  const peepY=Math.max(65,84-peep*1.7);
  const volumeTop=Math.max(14,78-Math.min(700,vt)/12);
  const d=kind==="pressure"
    ?`M0 ${peepY} L18 ${peepY} Q25 ${pressureTop} 35 ${pressureTop} L92 ${pressureTop} Q104 ${pressureTop} 110 ${peepY} L145 ${peepY} Q152 ${pressureTop} 162 ${pressureTop} L219 ${pressureTop} Q231 ${pressureTop} 237 ${peepY} L280 ${peepY}`
    :kind==="flow"
    ?"M0 50 L18 50 L25 16 L70 28 L105 44 L110 50 L118 76 Q142 84 145 50 L162 50 L169 16 L214 28 L249 44 L254 50 L262 76 Q276 80 280 50"
    :`M0 78 L18 78 Q42 ${volumeTop} 72 ${volumeTop} L95 ${volumeTop} Q108 ${volumeTop} 112 78 L145 78 Q169 ${volumeTop} 199 ${volumeTop} L222 ${volumeTop} Q235 ${volumeTop} 239 78 L280 78`;
  return <div className={`ventWave ${kind}`}><span>{kind.toUpperCase()}</span><svg viewBox="0 0 280 100" preserveAspectRatio="none"><path d={d}/></svg></div>
}

export default function AirwayVentilatorWorkbench({scenarioId,onAirwaySecured,onVentilationStarted,onEvent}:Props){
  const [airway,setAirway]=useState(initialAirwayWorkflow);
  const [vent,setVent]=useState(initialVentilatorState);
  const [dragging,setDragging]=useState<AirwayPropId|null>(null);

  const mechanics=useMemo(()=>mechanicsForScenario(scenarioId),[scenarioId]);
  const outputs=useMemo(()=>ventilatorOutputs(vent,mechanics),[vent,mechanics]);
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
    if(id==="bougie"){onEvent("Bougie positioned for airway procedure");return;}
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
      const computed=ventilatorOutputs(next,mechanics);
      onVentilationStarted({
        mode:next.mode,vtMl:next.vtMl,rate:next.rate,peep:next.peep,fio2:next.fio2,
        estimatedEtco2:computed.estimatedEtco2,estimatedSpo2:computed.estimatedSpo2
      });
      onEvent(`Ventilation started · ${next.mode} · Ppeak ${computed.peakPressure} · MV ${computed.minuteVentilationL} L/min`);
      return computed.alarms.length?{...next,status:"alarm"}:next;
    });
  }

  const statusLabel=vent.status==="active"?"VENTILATING":vent.status==="alarm"?"ALARM":"STANDBY";

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

      <div className="mechanicsCard">
        <div><small>RESPIRATORY MODEL</small><b>{scenarioId==="anaphylaxis"?"Bronchospasm / airway resistance":"Sepsis / impaired gas exchange"}</b></div>
        <span>Crs <b>{mechanics.complianceMlPerCmH2O}</b> mL/cmH₂O</span>
        <span>Raw <b>{mechanics.resistanceCmH2OPerLps}</b> cmH₂O/L/s</span>
        <span>Dead space <b>{mechanics.deadSpaceMl}</b> mL</span>
      </div>
    </div>

    <div className="hiveVent">
      <div className="ventHeader">
        <div><b>HIVE VENT</b><span>{vent.status.toUpperCase()}</span></div>
        <div className={`ventState ${vent.status}`}>{statusLabel}</div>
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

      <div className="ventControls five">
        <label>VT<input type="number" min="200" max="900" step="10" value={vent.vtMl} onChange={e=>setVent(v=>setVentSetting(v,"vtMl",Number(e.target.value)))}/><small>mL</small></label>
        <label>RR<input type="number" min="4" max="40" value={vent.rate} onChange={e=>setVent(v=>setVentSetting(v,"rate",Number(e.target.value)))}/><small>/min</small></label>
        <label>PEEP<input type="number" min="0" max="20" value={vent.peep} onChange={e=>setVent(v=>setVentSetting(v,"peep",Number(e.target.value)))}/><small>cmH₂O</small></label>
        <label>FiO₂<input type="number" min="21" max="100" value={Math.round(vent.fio2*100)} onChange={e=>setVent(v=>setVentSetting(v,"fio2",Number(e.target.value)/100))}/><small>%</small></label>
        <label>Ti<input type="number" min="0.3" max="3" step="0.1" value={vent.inspiratoryTimeSec} onChange={e=>setVent(v=>setVentSetting(v,"inspiratoryTimeSec",Number(e.target.value)))}/><small>s</small></label>
      </div>

      <div className="ventWaveStack">
        <VentWave kind="pressure" peak={outputs.peakPressure} peep={vent.peep} vt={vent.vtMl}/>
        <VentWave kind="flow" peak={outputs.peakPressure} peep={vent.peep} vt={vent.vtMl}/>
        <VentWave kind="volume" peak={outputs.peakPressure} peep={vent.peep} vt={vent.vtMl}/>
      </div>

      <div className="ventMetrics">
        <span>Ppeak <b>{outputs.peakPressure}</b><small>cmH₂O</small></span>
        <span>Pplat <b>{outputs.plateauPressure}</b><small>cmH₂O</small></span>
        <span>ΔP <b>{outputs.drivingPressure}</b><small>cmH₂O</small></span>
        <span>MV <b>{outputs.minuteVentilationL}</b><small>L/min</small></span>
        <span>EtCO₂ <b>{outputs.estimatedEtco2}</b><small>mmHg</small></span>
        <span>SpO₂ <b>{outputs.estimatedSpo2}</b><small>%</small></span>
      </div>

      {outputs.alarms.length>0&&<div className="ventAlarms">{outputs.alarms.map(a=><span key={a}>{a}</span>)}</div>}

      <div className="ventChecklist">
        <span className={airway.step==="secured"||airway.circuitConnected?"ok":""}>Airway device in place</span>
        <span className={airway.circuitConnected?"ok":""}>Patient circuit connected</span>
        <span className={vent.patientConfigured?"ok":""}>Patient configured</span>
      </div>

      <button className="activateVent" disabled={!ready||vent.status==="active"||vent.status==="alarm"} onClick={activate}>
        {vent.status==="active"?"Ventilator Active":vent.status==="alarm"?"Ventilator Active · Alarm":"Activate Ventilator"}
      </button>
    </div>
  </section>
}
