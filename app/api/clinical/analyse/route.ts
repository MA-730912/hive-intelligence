import { NextResponse } from "next/server";
import { analyseClinicalCase } from "@/lib/ai/clinical";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const caseText = typeof body?.caseText === "string" ? body.caseText.trim() : "";

    if (caseText.length < 20) {
      return NextResponse.json(
        { error: "Enter a meaningful synthetic clinical case before analysis." },
        { status: 400 }
      );
    }

    if (caseText.length > 12000) {
      return NextResponse.json(
        { error: "Case text exceeds the MVP limit of 12,000 characters." },
        { status: 413 }
      );
    }

    const analysis = await analyseClinicalCase(caseText);
    return NextResponse.json({ analysis });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to analyse the clinical case.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
