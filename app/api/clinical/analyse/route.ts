import { analyseClinicalCase } from "@/lib/ai/clinical";
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
  const ctx=createRequestContext(request,"/api/clinical/analyse");
  try {
    const rate=enforceRateLimit(request,"clinical-analyse",30);
    if(rate) return rate;

    const contentType=enforceJsonRequest(request,32_000);
    if(contentType) return contentType;

    const body = await request.json();
    const caseText = typeof body?.caseText === "string" ? body.caseText.trim() : "";

    if (caseText.length < 20) {
      return jsonResponse(
        { error: "Enter a meaningful synthetic clinical case before analysis." },
        ctx.requestId,
        400
      );
    }

    if (caseText.length > 12000) {
      return jsonResponse(
        { error: "Case text exceeds the MVP limit of 12,000 characters." },
        ctx.requestId,
        413
      );
    }

    auditEvent("clinical_analysis_requested",{
      requestId:ctx.requestId,
      route:ctx.route,
      characters:caseText.length,
    });

    const analysis = await analyseClinicalCase(caseText);

    auditEvent("clinical_analysis_completed",{
      requestId:ctx.requestId,
      route:ctx.route,
      durationMs:Date.now()-ctx.startedAt,
    });

    return jsonResponse({ analysis },ctx.requestId);
  } catch (error) {
    return safeErrorResponse(error,"Unable to analyse the clinical case.",ctx.requestId);
  }
}
