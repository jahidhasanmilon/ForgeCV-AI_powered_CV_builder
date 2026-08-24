"use client";

import { useState } from "react";
import { useCv } from "@/lib/cvContext";
import { JobMatchResult } from "@/lib/types";
import CvPreviewDoc from "../CvPreviewDoc";

export default function PreviewStep({ onBack }: { onBack: () => void }) {
  const { data } = useCv();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<(JobMatchResult & { sourcesUsed?: string[] }) | null>(null);

  function exportPdf() {
    const printArea = document.getElementById("printArea");
    if (printArea) {
      printArea.innerHTML = document.getElementById("livePreviewDoc")?.innerHTML ?? "";
    }
    window.print();
  }

  async function checkMatch() {
    if (!jd.trim()) return;
    setLoading(true);
    setResult(null);
    const cvSummary = `Skills: ${data.skills.join(", ")}. Experience bullets: ${data.experience
      .flatMap((e) => e.bullets)
      .join(" | ")}. Education: ${data.education.map((e) => e.degree).join(", ")}.`;
    try {
      const res = await fetch("/api/ai/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvSummary, jobDescription: jd, targetCountry: data.targetCountry }),
      });
      const json = await res.json();
      setResult(json);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div>
      <h2 className="step-title">Preview & job match</h2>
      <p className="step-sub">Final CV দেখুন, PDF export করুন, অথবা একটা job description-এর সাথে ম্যাচ চেক করুন।</p>

      <div className="export-bar">
        <button className="btn" onClick={exportPdf}>
          Download PDF
        </button>
        <button className="btn secondary" onClick={onBack}>
          ← Edit details
        </button>
      </div>

      <div className="match-box">
        <label
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 10.5,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            color: "var(--muted)",
            display: "block",
            marginBottom: 8,
          }}
        >
          Paste a job description to check match (RAG-grounded)
        </label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the job description here..."
          style={{
            width: "100%",
            minHeight: 110,
            padding: "9px 11px",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            background: "var(--paper)",
            color: "var(--ink)",
          }}
        />
        <button className="ai-btn" style={{ marginTop: 10 }} disabled={loading} onClick={checkMatch}>
          {loading ? "Analyzing…" : "✦ Check match with AI"}
        </button>

        {result && (
          <>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 18 }}>
              <div className="match-score">{result.score}%</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)", maxWidth: 320 }}>{result.tip}</div>
            </div>
            <div style={{ marginTop: 8 }}>
              {result.missing?.map((k, i) => (
                <span className="kw" key={i}>
                  {k}
                </span>
              ))}
            </div>
            {result.sourcesUsed && (
              <div style={{ marginTop: 8 }}>
                {result.sourcesUsed.map((s, i) => (
                  <span className="source-tag" key={i}>
                    RAG source: {s}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
