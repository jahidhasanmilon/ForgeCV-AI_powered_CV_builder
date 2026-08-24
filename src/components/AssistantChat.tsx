"use client";

import { useState } from "react";
import { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Should I include a photo on my CV for Germany?",
  "What's the capital and main language of Germany?",
  "How should I mention the Opportunity Card in my profile?",
];

export default function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const json = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: json.reply || "Sorry, I couldn't respond.", toolsUsed: json.toolsUsed },
      ]);
    } catch (e) {
      console.error(e);
      setMessages([...next, { role: "assistant", content: "Something went wrong." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="assistant-title">CV Assistant</div>
      <div className="assistant-sub">Tool-calling agent — searches internal CV rules (RAG) and looks up live country data.</div>

      <div className="chat-log">
        {messages.length === 0 && (
          <div className="chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chat-suggestion" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.content}
            {m.toolsUsed && m.toolsUsed.length > 0 && (
              <div className="tool-tags">
                {m.toolsUsed.map((t, ti) => (
                  <span className="tool-tag" key={ti}>
                    🔧 {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-bubble assistant">Thinking…</div>}
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about CV rules, target country..."
        />
        <button className="btn secondary" onClick={() => send(input)} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
