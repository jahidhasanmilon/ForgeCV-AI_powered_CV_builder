import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/claude";
import { retrieve } from "@/lib/rag/retrieve";

export async function POST(req: NextRequest) {
  try {
    const { cvSummary, jobDescription, targetCountry } = await req.json();

    if (!cvSummary || !jobDescription) {
      return NextResponse.json(
        { error: "cvSummary and jobDescription are required" },
        { status: 400 }
      );
    }

    // --- RAG step: pull the most relevant writing-rule chunks from our local
    // knowledge base and hand them to the model as grounding context, instead
    // of relying purely on the model's parametric knowledge. ---
    const query = `${jobDescription} target country ${targetCountry} keyword matching ATS`;
    const context = retrieve(query, 3);
    const contextBlock = context
      .map((c) => `[${c.title}] ${c.text}`)
      .join("\n\n");

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      system:
        "You are a resume-matching assistant. Use the reference notes provided to ground your advice. Respond ONLY with valid JSON, no markdown code fences.",
      messages: [
        {
          role: "user",
          content: `Reference notes (from internal knowledge base):
${contextBlock}

---
CV summary: ${cvSummary}

Job description: ${jobDescription}

Compare the CV summary against the job description and respond with JSON in
exactly this shape: {"score": <integer 0-100>, "missing": [<3-8 short keyword
strings present in the job description but not clearly present in the CV>],
"tip": "<one short actionable sentence, informed by the reference notes>"}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      ...parsed,
      sourcesUsed: context.map((c) => c.title),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to analyze match" }, { status: 500 });
  }
}
