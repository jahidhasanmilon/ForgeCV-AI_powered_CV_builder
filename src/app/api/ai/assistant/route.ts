import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CLAUDE_MODEL } from "@/lib/claude";
import { retrieve } from "@/lib/rag/retrieve";
import { lookupCountry } from "@/lib/countryApi";

/**
 * This route is a small tool-calling AGENT. Instead of a single LLM call, it
 * lets Claude decide whether it needs to (a) search our local RAG knowledge
 * base and/or (b) call the third-party REST Countries API, execute those
 * tool calls locally, feed the results back to the model, and loop until
 * Claude produces a final answer. This is the same "agent loop" pattern used
 * by production tool-using assistants, kept intentionally small here.
 */

const tools: Anthropic.Tool[] = [
  {
    name: "search_cv_knowledge",
    description:
      "Search an internal knowledge base of CV/resume writing rules (ATS formatting, keyword matching, Germany/USA/Europe conventions, the Opportunity Card). Use this before answering questions about resume best practices.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What to search for" },
      },
      required: ["query"],
    },
  },
  {
    name: "lookup_country_info",
    description:
      "Look up basic facts about a country (capital, region, languages, currency) using its ISO 3166-1 alpha-2 code, e.g. DE for Germany, US for United States, GB for United Kingdom.",
    input_schema: {
      type: "object",
      properties: {
        countryCode: { type: "string", description: "Two-letter ISO country code" },
      },
      required: ["countryCode"],
    },
  },
];

async function runTool(name: string, input: any): Promise<string> {
  if (name === "search_cv_knowledge") {
    const results = retrieve(input.query, 3);
    return JSON.stringify(results.map((r) => ({ title: r.title, text: r.text })));
  }
  if (name === "lookup_country_info") {
    const info = await lookupCountry(input.countryCode);
    return JSON.stringify(info ?? { error: "not found" });
  }
  return JSON.stringify({ error: `Unknown tool: ${name}` });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const conversation: Anthropic.MessageParam[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const toolsUsed: string[] = [];
    let finalText = "";

    // Agent loop: keep calling Claude, executing any requested tools, and
    // feeding results back, until Claude stops requesting tools.
    for (let turn = 0; turn < 4; turn++) {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 700,
        system:
          "You are a helpful assistant embedded in a CV-builder app for Bangladeshis applying abroad. Use your tools when they would give a more grounded answer. Keep answers concise.",
        tools,
        messages: conversation,
      });

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      const textBlocks = response.content.filter(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );
      finalText = textBlocks.map((b) => b.text).join("\n").trim();

      if (response.stop_reason !== "tool_use" || toolUseBlocks.length === 0) {
        break;
      }

      // Record assistant turn (including tool_use blocks) then run tools.
      conversation.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of toolUseBlocks) {
        toolsUsed.push(block.name);
        const result = await runTool(block.name, block.input);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
      conversation.push({ role: "user", content: toolResults });
    }

    return NextResponse.json({ reply: finalText, toolsUsed });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Assistant failed to respond" }, { status: 500 });
  }
}
