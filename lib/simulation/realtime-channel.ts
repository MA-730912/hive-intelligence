"use client";
import {useEffect,useRef} from "react";

export type SimulationInvestigationRequest={
  id:string;
  kind:"lab"|"imaging";
  name:string;
  requestedAt:string;
};

export type SimulationInvestigationResult={
  id:string;
  kind:"lab"|"imaging";
  name:string;
  releasedAt:string;
  data:unknown;
};

export type SimulationBroadcast =
  | {type:"state";payload:unknown}
  | {type:"event";payload:{label:string;at:string}}
  | {type:"control";payload:{status:"lobby"|"running"|"paused"|"completed"|"reset"}}
  | {type:"investigation-request";payload:SimulationInvestigationRequest}
  | {type:"investigation-result";payload:SimulationInvestigationResult};

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
