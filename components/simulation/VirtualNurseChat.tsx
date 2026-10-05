"use client";
import {useState} from "react";
import {respondAsVirtualNurse} from "@/lib/simulation/virtual-nurse";

type ChatMessage={from:"learner"|"nurse";text:string};

export default function VirtualNurseChat({disabled=false,onAction}:{disabled?:boolean;onAction:(action:string,scoreDelta:number)=>void}){
  const [input,setInput]=useState("");
  const [chat,setChat]=useState<ChatMessage[]>([
    {from:"nurse",text:"I'm your resus nurse. Give me a task or ask me to check something."}
  ]);

  function submit(){
    const text=input.trim();
    if(!text||disabled) return;
    const response=respondAsVirtualNurse(text);
    setChat(v=>[...v,{from:"learner",text},{from:"nurse",text:response.reply}]);
    setInput("");
    if(response.action) onAction(response.action,response.scoreDelta??0);
  }

  return <section className="card">
    <div className="eyebrow">Virtual Nurse Assistant</div>
    <h3>Natural-language bedside delegation</h3>
    <div style={{maxHeight:310,overflow:"auto",marginBottom:12}}>
      {chat.map((m,i)=><div key={i} className={`message ${m.from==="nurse"?"ai":""}`}>
        <strong>{m.from==="nurse"?"Nurse":"You"}</strong>
        <p style={{marginBottom:0}}>{m.text}</p>
      </div>)}
    </div>
    <div style={{display:"flex",gap:8}}>
      <input
        value={input}
        disabled={disabled}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter")submit()}}
        placeholder="e.g. Prepare adrenaline and call surgery"
        style={{flex:1,padding:11,background:"#081410",color:"white",border:"1px solid var(--line)",borderRadius:9}}
      />
      <button className="btn primary" disabled={disabled} onClick={submit}>Send</button>
    </div>
    <p className="muted" style={{fontSize:11}}>Current assistant is deterministic scenario logic. The interface is designed to accept a governed AI assistant later without changing the learner workflow.</p>
  </section>
}
