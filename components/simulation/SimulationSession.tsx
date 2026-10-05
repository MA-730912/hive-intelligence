"use client";
import {useCallback,useEffect,useMemo,useState} from "react";
import MonitorScreen from "./MonitorScreen";
import VentilatorPanel,{type VentSettings,type VentPathology} from "./VentilatorPanel";
import InstructorPhysiology from "./InstructorPhysiology";
import VirtualTeamPanel from "./VirtualTeamPanel";
import DebriefPanel from "./DebriefPanel";
import EmergencyRoomScene from "./EmergencyRoomScene";
import SessionControls,{type SessionRole,type SessionStatus} from "./SessionControls";
import ReplayTimeline,{type ReplayEvent} from "./ReplayTimeline";
import ObserverPanel from "./ObserverPanel";
import AutomationPanel from "./AutomationPanel";
import VirtualNurseChat from "./VirtualNurseChat";
import InvestigationQueue from "./InvestigationQueue";
import {septicShockSimulation as scenario} from "@/lib/simulation/scenarios/septic-shock";
import {generateVariableLabSet} from "@/lib/simulation/lab-engine";
import {applyMedicationEffect} from "@/lib/simulation/medication-engine";
import {useSimulationChannel,type SimulationBroadcast,type SimulationInvestigationRequest,type SimulationInvestigationResult} from "@/lib/simulation/realtime-channel";
import {evaluateAutoTriggers} from "@/lib/simulation/auto-trigger";
import type {LabSet,SimulationVitals} from "@/lib/simulation/types";

type SharedState={
  stateIndex:number;
  vitals:SimulationVitals;
  score:number;
  ventSettings:VentSettings;
  ventPathology:VentPathology;
  status:SessionStatus;
};

export default function SimulationSession(){
  const [stateIndex,setStateIndex]=useState(0);
  const [role,setRole]=useState<SessionRole>("instructor");
  const [sessionCode,setSessionCode]=useState("HIVE-001");
  const [status,setStatus]=useState<SessionStatus>("lobby");
  const [elapsedSeconds,setElapsedSeconds]=useState(0);
  const [messages,setMessages]=useState<string[]>([]);
  const [replayEvents,setReplayEvents]=useState<ReplayEvent[]>([]);
  const [score,setScore]=useState(0);
  const [releasedLabs,setReleasedLabs]=useState<LabSet[]>([]);
  const [releasedImaging,setReleasedImaging]=useState<string[]>([]);
  const [drawNumber,setDrawNumber]=useState(0);
  const [pendingRequests,setPendingRequests]=useState<SimulationInvestigationRequest[]>([]);
  const [currentVitals,setCurrentVitals]=useState<SimulationVitals>(scenario.states[0].vitals);
  const [ventSettings,setVentSettings]=useState<VentSettings>({fio2:0.60,vt:450,rate:18,peep:8,ppeak:24});
  const [ventPathology,setVentPathology]=useState<VentPathology>("normal");
  const [automationEnabled,setAutomationEnabled]=useState(true);
  const [firedTriggers,setFiredTriggers]=useState<string[]>([]);

  const state=scenario.states[stateIndex];
  const intubated=state.id==="intubated"||state.id==="recovery";
  const eventLog=useMemo(()=>messages.slice().reverse(),[messages]);

  const onRemoteMessage=useCallback((message:SimulationBroadcast)=>{
    if(message.type==="state" && role!=="instructor"){
      const shared=message.payload as SharedState;
      setStateIndex(shared.stateIndex);
      setCurrentVitals(shared.vitals);
      setScore(shared.score);
      setVentSettings(shared.ventSettings);
      setVentPathology(shared.ventPathology);
      setStatus(shared.status);
    }
    if(message.type==="event"){
      const event={id:Date.now()+Math.floor(Math.random()*1000),at:message.payload.at,label:message.payload.label};
      setReplayEvents(v=>[...v,event]);
      setMessages(v=>[...v,`${message.payload.at} — ${message.payload.label}`]);
    }
    if(message.type==="investigation-request" && role==="instructor"){
      setPendingRequests(v=>v.some(r=>r.id===message.payload.id)?v:[...v,message.payload]);
    }
    if(message.type==="investigation-result" && role!=="instructor"){
      const result=message.payload as SimulationInvestigationResult;
      if(result.kind==="lab"){
        setReleasedLabs(v=>[...v,result.data as LabSet]);
      } else {
        setReleasedImaging(v=>v.includes(result.name)?v:[...v,result.name]);
      }
      const event={id:Date.now()+Math.floor(Math.random()*1000),at:result.releasedAt,label:`Result released: ${result.name}`};
      setReplayEvents(v=>[...v,event]);
      setMessages(v=>[...v,`${result.releasedAt} — Result released: ${result.name}`]);
    }
    if(message.type==="control"){
      if(message.payload.status==="reset"){
        setStatus("lobby");
        setElapsedSeconds(0);
        setStateIndex(0);
        setCurrentVitals(scenario.states[0].vitals);
        setScore(0);
        setMessages([]);
        setReplayEvents([]);
        setReleasedLabs([]);
        setReleasedImaging([]);
        setFiredTriggers([]);
        setPendingRequests([]);
      } else {
        setStatus(message.payload.status);
      }
    }
  },[role]);

  const {publish,supported}=useSimulationChannel(sessionCode,onRemoteMessage);

  useEffect(()=>{
    if(status!=="running") return;
    const timer=window.setInterval(()=>setElapsedSeconds(v=>v+1),1000);
    return ()=>window.clearInterval(timer);
  },[status]);

  useEffect(()=>{
    if(role!=="instructor") return;
    publish({type:"state",payload:{stateIndex,vitals:currentVitals,score,ventSettings,ventPathology,status} satisfies SharedState});
  },[role,stateIndex,currentVitals,score,ventSettings,ventPathology,status,publish]);

  function addEvent(label:string,broadcast=true){
    const at=new Date().toLocaleTimeString();
    setMessages(v=>[...v,`${at} — ${label}`]);
    setReplayEvents(v=>[...v,{id:Date.now()+v.length,at,label}]);
    if(broadcast) publish({type:"event",payload:{label,at}});
  }

  function award(delta:number){setScore(v=>Math.max(0,Math.min(100,v+delta)));}

  function control(next:SessionStatus|"reset"){
    if(role!=="instructor") return;
    publish({type:"control",payload:{status:next}});
    if(next==="reset"){
      setStatus("lobby");
      setElapsedSeconds(0);
      setStateIndex(0);
      setCurrentVitals(scenario.states[0].vitals);
      setScore(0);
      setMessages([]);
      setReplayEvents([]);
      setReleasedLabs([]);
      setReleasedImaging([]);
      setFiredTriggers([]);
      setPendingRequests([]);
      return;
    }
    setStatus(next);
    addEvent(`Instructor changed session status to ${next}`);
  }

  function changeState(index:number){
    const next=scenario.states[index];
    setStateIndex(index);
    setCurrentVitals(next.vitals);
    setReleasedLabs([]);
    addEvent(`Instructor changed patient state to ${next.label}`);
  }

  function giveMedication(name:string,dose:string,route:string){
    if(status!=="running") return;
    const result=applyMedicationEffect(name,currentVitals,state.id);
    setCurrentVitals(result.vitals);
    award(result.scoreDelta);
    addEvent(`Medication: ${name} — ${dose} ${route}. ${result.feedback}`);
  }

  function requestInvestigation(kind:"lab"|"imaging",name:string){
    if(status!=="running") return;
    const requestedAt=new Date().toLocaleTimeString();
    const request:SimulationInvestigationRequest={
      id:`${kind}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      kind,
      name,
      requestedAt,
    };
    publish({type:"investigation-request",payload:request});
    addEvent(`Investigation requested: ${name}`);
    award(1);
  }

  function releaseInvestigation(request:SimulationInvestigationRequest){
    const releasedAt=new Date().toLocaleTimeString();
    if(request.kind==="lab"){
      const base=state.labs[0];
      if(!base) return;
      const nextDraw=drawNumber+1;
      setDrawNumber(nextDraw);
      const generated=generateVariableLabSet(base,`${scenario.id}:90kg`,nextDraw);
      publish({type:"investigation-result",payload:{id:request.id,kind:"lab",name:generated.name,releasedAt,data:generated}});
      addEvent(`Faculty released lab result: ${generated.name}`);
    } else {
      const imaging=scenario.imaging.find(i=>i.name===request.name);
      if(!imaging) return;
      publish({type:"investigation-result",payload:{id:request.id,kind:"imaging",name:imaging.name,releasedAt,data:imaging.report}});
      addEvent(`Faculty released imaging report: ${imaging.name}`);
    }
    setPendingRequests(v=>v.filter(r=>r.id!==request.id));
  }

  useEffect(()=>{
    if(role!=="instructor"||status!=="running"||!automationEnabled) return;
    const results=evaluateAutoTriggers({
      elapsedSeconds,
      stateId:state.id,
      events:messages,
      fired:firedTriggers,
      vitals:currentVitals,
    });
    if(results.length===0) return;
    for(const result of results){
      setFiredTriggers(v=>v.includes(result.id)?v:[...v,result.id]);
      setCurrentVitals(result.vitals);
      award(result.scoreDelta);
      addEvent(result.label);
    }
  },[elapsedSeconds,role,status,automationEnabled,state.id,messages,firedTriggers,currentVitals]);

  function teamAction(teamRole:string,action:string){
    if(status!=="running") return;
    addEvent(`${teamRole}: ${action}`);
    if(action==="Check allergy") award(8);
    else if(action==="Accept for theatre") award(15);
    else if(action==="Accept ICU admission") award(8);
    else if(action==="Review antimicrobial plan") award(6);
    else if(action==="Prepare adrenaline") award(5);
    else award(1);
  }

  return <main className="section">
    <div className="toolbar">
      <div>
        <div className="eyebrow">HIVE Simulation Studio • {scenario.room}</div>
        <h2 style={{margin:"6px 0"}}>{scenario.title}</h2>
      </div>
      <span className="chip">{supported?"LIVE CHANNEL READY":"SINGLE SCREEN MODE"}</span>
    </div>

    <SessionControls
      sessionCode={sessionCode}
      role={role}
      status={status}
      elapsedSeconds={elapsedSeconds}
      onCodeChange={setSessionCode}
      onRoleChange={setRole}
      onStart={()=>control("running")}
      onPause={()=>control("paused")}
      onReset={()=>control("reset")}
      onComplete={()=>control("completed")}
    />

    <div className="demo-banner">
      <strong>Synthetic high-fidelity demo:</strong> {scenario.patient.age}-year-old {scenario.patient.sex.toLowerCase()}, {scenario.patient.weightKg} kg.
      Current state: <strong>{state.label}</strong> — {state.summary}
    </div>

    {role==="observer"?<ObserverPanel vitals={currentVitals} stateLabel={state.label} score={score} events={replayEvents} status={status}/>:role==="learner"?<div className="chat">
      <section>
        <EmergencyRoomScene vitals={currentVitals} intubated={intubated} onAction={action=>{if(status==="running"){addEvent(`Environment interaction: ${action}`);award(1)}}}/>
        <div style={{marginTop:18}}><MonitorScreen vitals={currentVitals}/></div>
        {intubated&&<div style={{marginTop:18}}><VentilatorPanel settings={ventSettings} pathology={ventPathology} etco2={currentVitals.etco2??36}/></div>}

        {status!=="running"&&<div className="demo-banner" style={{marginTop:18}}><strong>Session {status}.</strong> Learner actions are enabled when the instructor starts/resumes the scenario.</div>}

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Resuscitation actions</div>
          <div className="chips" style={{marginTop:12}}>
            {scenario.medications.map(m=><button disabled={status!=="running"} key={m.name} className="btn" onClick={()=>giveMedication(m.name,m.dose,m.route)}>{m.name}</button>)}
            <button disabled={status!=="running"} className="btn" onClick={()=>{addEvent("Airway assessment performed");award(4)}}>Assess airway</button>
            <button disabled={status!=="running"} className="btn" onClick={()=>{addEvent("Surgical team called for urgent source control");award(12)}}>Call surgery</button>
            <button disabled={status!=="running"} className="btn" onClick={()=>{addEvent("ICU referral placed");award(6)}}>Call ICU</button>
          </div>
        </div>

        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Investigations</div>
          <div className="chips" style={{marginTop:12}}>
            <button disabled={status!=="running"} className="btn" onClick={()=>requestInvestigation("lab","Current blood panel")}>Request current blood panel</button>
            {scenario.imaging.map(i=><button disabled={status!=="running"} className="btn" key={i.name} onClick={()=>requestInvestigation("imaging",i.name)}>{i.name}</button>)}
          </div>

          {releasedLabs.map(l=><div className="message ai" key={l.name} style={{marginTop:14}}>
            <strong>{l.name}</strong>
            <div className="grid" style={{padding:"10px 0 0",gridTemplateColumns:"repeat(3,1fr)"}}>
              {l.values.map(v=><div key={v.label}><span className="muted">{v.label}</span><div><strong>{v.value}</strong>{v.flag&&<span className="chip" style={{marginLeft:6}}>{v.flag}</span>}</div></div>)}
            </div>
            <p className="muted" style={{fontSize:11}}>Synthetic values include controlled draw-to-draw variation around the active scenario state.</p>
          </div>)}

          {scenario.imaging.filter(i=>releasedImaging.includes(i.name)).map(i=><div className="message ai" key={i.name} style={{marginTop:14}}><strong>{i.name}</strong><p>{i.report}</p></div>)}
        </div>
      </section>

      <aside>
        <VirtualNurseChat disabled={status!=="running"} onAction={(action,delta)=>{addEvent(action);award(delta)}}/>
        <div style={{marginTop:18}}><VirtualTeamPanel onAction={teamAction}/></div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Current bedside cue</div>
          <div className="message ai"><strong>Virtual Nurse:</strong><p>{state.nurseCue}</p></div>
        </div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Event log</div>
          <h3>Live actions</h3>
          {eventLog.length===0?<p className="muted">No actions yet.</p>:eventLog.slice(0,10).map((e,i)=><p className="muted" key={i}>{e}</p>)}
        </div>
      </aside>
    </div>:<div className="chat">
      <section>
        <div className="card">
          <div className="eyebrow">Instructor controls</div>
          <h3>Scenario state machine</h3>
          {scenario.states.map((s,i)=><button key={s.id} className={`btn ${i===stateIndex?"primary":""}`} style={{display:"flex",width:"100%",justifyContent:"space-between",marginBottom:10}} onClick={()=>changeState(i)}><span>{i+1}. {s.label}</span><span>{s.vitals.sbp}/{s.vitals.dbp} · HR {s.vitals.hr} · SpO₂ {s.vitals.spo2}%</span></button>)}

          <hr style={{borderColor:"var(--line)",margin:"20px 0"}}/>
          <div className="eyebrow">Manual event triggers</div>
          <div className="chips" style={{marginTop:12}}>
            {["Anaphylaxis declared","Adrenaline effective","Shock worsens","Patient intubated","Surgery accepts","Source control achieved","Begin recovery"].map(v=><button className="btn" key={v} onClick={()=>{addEvent(`Instructor trigger: ${v}`);if(v==="Source control achieved")award(15)}}>{v}</button>)}
          </div>
        </div>

        <InstructorPhysiology vitals={currentVitals} onChange={setCurrentVitals}/>
        <AutomationPanel enabled={automationEnabled} fired={firedTriggers} onToggle={()=>setAutomationEnabled(v=>!v)}/>
        <InvestigationQueue requests={pendingRequests} onRelease={releaseInvestigation} onDismiss={id=>setPendingRequests(v=>v.filter(r=>r.id!==id))}/>
        {intubated&&<div style={{marginTop:18}}><VentilatorPanel settings={ventSettings} onChange={setVentSettings} pathology={ventPathology} onPathologyChange={p=>{setVentPathology(p);addEvent(`Instructor changed ventilator pathology to ${p}`)}} editable etco2={currentVitals.etco2??36}/></div>}
      </section>

      <aside>
        <MonitorScreen vitals={currentVitals}/>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Instructor notes</div>
          <p className="muted">{state.summary}</p>
          <p className="muted">Nurse cue: {state.nurseCue}</p>
          <p className="muted">Manual overrides broadcast to learner and observer tabs using the active session code.</p>
        </div>
        <div className="card" style={{marginTop:18}}>
          <div className="eyebrow">Recent actions</div>
          {eventLog.slice(0,8).map((e,i)=><p className="muted" key={i}>{e}</p>)}
        </div>
      </aside>
    </div>}

    <DebriefPanel score={score} events={messages}/>
    <ReplayTimeline events={replayEvents}/>
  </main>
}
