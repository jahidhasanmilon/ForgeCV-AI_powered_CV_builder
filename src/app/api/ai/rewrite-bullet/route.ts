import { NextRequest, NextResponse } from "next/server";
import { anthropic, CLAUDE_MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { rawText, jobTitle } = await req.json();

    if (!rawText || typeof rawText !== "string") {
      return NextResponse.json({ error: "rawText is required" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Rewrite this raw job responsibility into ONE ATS-optimized resume bullet point.
Rules: start with a strong action verb, be concise (under 22 words), quantify impact ONLY if a
number is already implied in the text (never invent numbers), no first person, no quotation
marks, output ONLY the bullet text and nothing else.

Job title: ${jobTitle || "N/A"}
Raw text: "${rawText}"`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const improved = textBlock && "text" in textBlock ? textBlock.text.trim() : "";

    return NextResponse.json({ improved });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to rewrite bullet" }, { status: 500 });
  }
}
