import Anthropic from "@anthropic-ai/sdk";

// A single shared Anthropic client for all server-side API routes.
// Reads ANTHROPIC_API_KEY from the environment (see .env.local.example).
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = "claude-sonnet-4-6";
