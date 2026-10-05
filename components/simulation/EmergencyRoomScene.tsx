"use client";
import type {SimulationVitals} from "@/lib/simulation/types";

export default function EmergencyRoomScene({vitals,intubated,onAction}:{vitals:SimulationVitals;intubated:boolean;onAction:(action:string)=>void}){
  const critical=vitals.sbp<80||vitals.spo2<90;
  return <div className="card" style={{padding:0,overflow:"hidden",background:"#07110f"}}>
    <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--line)"}}>
      <div><div className="eyebrow">Virtual environment</div><strong>Emergency Department · Resus Bay 1</strong></div>
      <span className="chip">{critical?"CRITICAL":"ACTIVE"}</span>
    </div>

    <div style={{
      minHeight:330,
      position:"relative",
      background:"linear-gradient(180deg,#d8e2de 0 58%,#7f8c87 58% 61%,#34403c 61% 100%)",
      color:"#07110f"
    }}>
      <div style={{position:"absolute",left:"5%",top:"8%",width:"20%",height:"22%",background:"#f5f8f7",border:"4px solid #8b9c95",borderRadius:6,boxShadow:"inset 0 0 0 2px #fff"}}>
        <div style={{padding:8,fontSize:11,fontWeight:800}}>RESUS 1</div>
        <div style={{height:2,background:"#9aaca5",margin:"0 8px"}}/>
      </div>

      <button onClick={()=>onAction("Bedside monitor opened")} style={{position:"absolute",right:"7%",top:"8%",width:"21%",height:"24%",background:"#050909",border:"5px solid #303b37",borderRadius:8,color:"#9cf2c0",cursor:"pointer"}}>
        <div style={{fontSize:10,textAlign:"left"}}>MONITOR</div>
        <div style={{fontSize:25,fontWeight:900}}>{vitals.hr} <span style={{fontSize:12}}>HR</span></div>
        <div style={{color:"#5eead4",fontSize:19}}>{vitals.spo2}% SpO₂</div>
      </button>

      <button onClick={()=>onAction("Airway trolley opened")} style={{position:"absolute",left:"8%",bottom:"14%",width:"18%",height:"31%",background:"#bdc8c3",border:"3px solid #66756f",borderRadius:8,cursor:"pointer"}}>
        <div style={{height:"25%",background:"#e8efec",padding:6,fontWeight:800,fontSize:11}}>AIRWAY</div>
        {[1,2,3].map(n=><div key={n} style={{height:"20%",borderTop:"2px solid #74837d"}}/>)}
      </button>

      <div style={{position:"absolute",left:"30%",bottom:"16%",width:"40%",height:"27%",background:"#ccd7d2",border:"4px solid #677770",borderRadius:"12px 12px 5px 5px"}}>
        <div style={{position:"absolute",left:"8%",top:"15%",width:"84%",height:"45%",background:"#e9efec",borderRadius:30,border:"2px solid #b6c3bd"}}>
          <div style={{position:"absolute",left:"10%",top:"18%",width:"18%",height:"48%",background:"#b9947a",borderRadius:"50%"}}/>
          <div style={{position:"absolute",left:"25%",top:"22%",width:"55%",height:"42%",background:"#7fa1b4",borderRadius:14}}/>
          {intubated&&<div style={{position:"absolute",left:"5%",top:"4%",fontSize:10,fontWeight:800,color:"#a12b2b"}}>ETT + VENT</div>}
        </div>
        <div style={{position:"absolute",left:"8%",bottom:-18,width:6,height:25,background:"#4b5752"}}/>
        <div style={{position:"absolute",right:"8%",bottom:-18,width:6,height:25,background:"#4b5752"}}/>
      </div>

      <button onClick={()=>onAction("IV infusion pumps reviewed")} style={{position:"absolute",right:"18%",bottom:"12%",width:"10%",height:"38%",background:"transparent",border:"none",cursor:"pointer"}}>
        <div style={{width:4,height:"100%",background:"#39443f",margin:"auto"}}/>
        {[0,1,2].map(i=><div key={i} style={{position:"absolute",right:0,top:20+i*58,width:54,height:45,background:"#e6ece9",border:"2px solid #65736d",borderRadius:6,padding:3,fontSize:8}}>PUMP {i+1}<div style={{background:"#63a97f",height:7,marginTop:3}}/></div>)}
      </button>

      <button onClick={()=>onAction("Point-of-care ultrasound brought to bedside")} style={{position:"absolute",right:"3%",bottom:"10%",width:"12%",height:"30%",background:"#b8c3be",border:"3px solid #5d6a65",borderRadius:8,cursor:"pointer"}}>
        <div style={{margin:5,height:"38%",background:"#111b18",color:"#5eead4",fontSize:8,padding:4}}>POCUS</div>
        <div style={{width:"45%",height:"35%",margin:"auto",borderLeft:"3px solid #56625d",borderRight:"3px solid #56625d"}}/>
      </button>

      <button onClick={()=>onAction("Virtual nurse called to bedside")} style={{position:"absolute",left:"28%",top:"9%",width:58,height:120,background:"transparent",border:"none",cursor:"pointer"}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:"#8c654f",margin:"auto"}}/>
        <div style={{width:48,height:62,borderRadius:"14px 14px 4px 4px",background:"#4f91a8",margin:"2px auto"}}/>
        <div style={{fontSize:9,fontWeight:800,background:"#fff",padding:"2px 4px",borderRadius:4}}>NURSE</div>
      </button>

      <div style={{position:"absolute",left:"30%",bottom:"3%",fontSize:10,color:"#eefaf5",background:"rgba(4,10,8,.78)",padding:"5px 8px",borderRadius:6}}>Click equipment or staff to interact</div>
    </div>
  </div>
}
