"use client";
import {useEffect,useRef} from "react";

export type SimulationBroadcast =
  | {type:"state";payload:unknown}
  | {type:"event";payload:{label:string;at:string}}
  | {type:"control";payload:{status:"lobby"|"running"|"paused"|"completed"|"reset"}};

export function useSimulationChannel(sessionCode:string,onMessage:(message:SimulationBroadcast)=>void){
  const channelRef=useRef<BroadcastChannel|null>(null);

  useEffect(()=>{
    if(typeof window==="undefined"||!("BroadcastChannel" in window)||!sessionCode) return;
    const channel=new BroadcastChannel(`hive-sim:${sessionCode.toUpperCase()}`);
    channelRef.current=channel;
    channel.onmessage=(event:MessageEvent<SimulationBroadcast>)=>onMessage(event.data);
    return ()=>{
      channel.close();
      channelRef.current=null;
    };
  },[sessionCode,onMessage]);

  function publish(message:SimulationBroadcast){
    channelRef.current?.postMessage(message);
  }

  return {publish,supported:typeof window!=="undefined"&&"BroadcastChannel" in window};
}
