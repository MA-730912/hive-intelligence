import { NextResponse } from "next/server";
import { answerKnowledgeQuestion } from "@/lib/knowledge/answer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = typeof body?.question === "string" ? body.question.trim() : "";

    if (question.length < 5) {
      return NextResponse.json({ error: "Enter a clinical knowledge question." }, { status: 400 });
    }

    const result = await answerKnowledgeQuestion(question);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Knowledge query failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
