import type {LabSet} from "./types";

function hash(input:string){
  let h=2166136261;
  for(let i=0;i<input.length;i++){
    h^=input.charCodeAt(i);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}

function jitter(seed:string,index:number){
  const x=Math.sin((hash(seed)+index*1013)*0.0001)*10000;
  return (x-Math.floor(x))*2-1;
}

function formatNumeric(raw:string,delta:number){
  const match=raw.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  if(!match) return raw;
  const value=Number(match[1]);
  const suffix=match[2];
  const scale=Math.max(Math.abs(value)*0.045, value<10?0.12:0.5);
  const next=Math.max(0,value+delta*scale);
  const decimals=match[1].includes(".")?Math.min(2,match[1].split(".")[1].length):0;
  return `${next.toFixed(decimals)}${suffix}`;
}

export function generateVariableLabSet(base:LabSet,patientSeed:string,drawNumber:number):LabSet{
  return {
    ...base,
    name:`${base.name} · Draw ${drawNumber}`,
    values:base.values.map((item,index)=>({
      ...item,
      value:formatNumeric(item.value,jitter(`${patientSeed}:${base.name}:${drawNumber}`,index))
    }))
  };
}
