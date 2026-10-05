import "server-only";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

type LimitEntry={count:number;resetAt:number};
const buckets=new Map<string,LimitEntry>();

function clientKey(request:Request){
  const forwarded=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function createRequestContext(request:Request,route:string){
  return {
    requestId:request.headers.get("x-request-id") || randomUUID(),
    route,
    client:clientKey(request),
    startedAt:Date.now(),
  };
}

export function enforceJsonRequest(request:Request,maxBytes=64_000){
  const type=request.headers.get("content-type") || "";
  if(!type.toLowerCase().includes("application/json")){
    return NextResponse.json({error:"Content-Type must be application/json."},{status:415});
  }
  const length=Number(request.headers.get("content-length") || "0");
  if(Number.isFinite(length) && length>maxBytes){
    return NextResponse.json({error:"Request payload is too large."},{status:413});
  }
  return null;
}

export function enforceRateLimit(request:Request,scope:string,limit:number,windowMs=60_000){
  const now=Date.now();
  const key=`${scope}:${clientKey(request)}`;
  const current=buckets.get(key);
  if(!current || current.resetAt<=now){
    buckets.set(key,{count:1,resetAt:now+windowMs});
    return null;
  }
  current.count+=1;
  if(current.count<=limit) return null;
  const retryAfter=Math.max(1,Math.ceil((current.resetAt-now)/1000));
  return NextResponse.json(
    {error:"Too many requests. Please retry shortly."},
    {status:429,headers:{"Retry-After":String(retryAfter)}}
  );
}

export function safeErrorResponse(error:unknown,fallback:string,requestId:string,status=500){
  const detail=error instanceof Error?error.message:String(error);
  console.error(JSON.stringify({
    level:"error",
    event:"api_error",
    requestId,
    detail:detail.slice(0,1000),
    at:new Date().toISOString(),
  }));
  return NextResponse.json(
    {error:fallback,requestId},
    {status,headers:{"Cache-Control":"no-store","X-Request-ID":requestId}}
  );
}

export function jsonResponse(data:unknown,requestId:string,status=200){
  return NextResponse.json(data,{
    status,
    headers:{
      "Cache-Control":"no-store",
      "X-Request-ID":requestId,
    },
  });
}

export function auditEvent(event:string,context:Record<string,unknown>){
  console.info(JSON.stringify({
    level:"info",
    event,
    at:new Date().toISOString(),
    ...context,
  }));
}
