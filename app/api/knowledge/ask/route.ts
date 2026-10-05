import { answerKnowledgeQuestion } from "@/lib/knowledge/answer";
import {
  auditEvent,
  createRequestContext,
  enforceJsonRequest,
  enforceRateLimit,
  jsonResponse,
  safeErrorResponse,
} from "@/lib/security/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ctx=createRequestContext(request,"/api/knowledge/ask");
  try {
    const rate=enforceRateLimit(request,"knowledge-ask",60);
    if(rate) return rate;

    const contentType=enforceJsonRequest(request,16_000);
    if(contentType) return contentType;

    const body = await request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";

    if (question.length < 5) {
      return jsonResponse({ error: "Enter a clinical knowledge question." },ctx.requestId,400);
    }
    if(question.length>4000){
      return jsonResponse({error:"Knowledge question exceeds the 4,000 character limit."},ctx.requestId,413);
    }

    auditEvent("knowledge_query_requested",{
      requestId:ctx.requestId,
      route:ctx.route,
      characters:question.length,
    });

    const result = await answerKnowledgeQuestion(question);

    auditEvent("knowledge_query_completed",{
      requestId:ctx.requestId,
      route:ctx.route,
      durationMs:Date.now()-ctx.startedAt,
    });

    return jsonResponse(result,ctx.requestId);
  } catch (error) {
    return safeErrorResponse(error,"Knowledge query failed.",ctx.requestId);
  }
}
