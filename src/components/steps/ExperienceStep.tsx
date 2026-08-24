"use client";

import { useState } from "react";
import { useCv } from "@/lib/cvContext";

export default function ExperienceStep() {
  const { data, dispatch } = useCv();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  async function improveBullet(expIndex: number, bulletIndex: number) {
    const exp = data.experience[expIndex];
    const raw = exp.bullets[bulletIndex];
    if (!raw.trim()) return;
    const key = `${expIndex}:${bulletIndex}`;
    setLoadingKey(key);
    try {
      const res = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: raw, jobTitle: exp.title }),
      });
      const json = await res.json();
      if (json.improved) {
        dispatch({ type: "SET_BULLET", expIndex, bulletIndex, value: json.improved });
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingKey(null);
  }

  return (
    <div>
      <h2 className="step-title">Experience</h2>
      <p className="step-sub">Raw ভাষায় লিখুন কী করেছেন — AI (Claude) সেটা ATS bullet-এ রূপান্তর করে দেবে।</p>

      {data.experience.map((ex, i) => (
        <div className="block-card" key={i}>
          <div className="block-head">
            <strong>Role {i + 1}</strong>
            {data.experience.length > 1 && (
              <button className="icon-btn" onClick={() => dispatch({ type: "REMOVE_EXP", index: i })}>
                remove
              </button>
            )}
          </div>
          <div className="field">
            <label>Job title</label>
            <input
              value={ex.title}
              onChange={(e) => dispatch({ type: "SET_EXP", index: i, field: "title", value: e.target.value })}
              placeholder="Web Developer Intern"
            />
          </div>
          <div className="field">
            <label>Company</label>
            <input
              value={ex.company}
              onChange={(e) => dispatch({ type: "SET_EXP", index: i, field: "company", value: e.target.value })}
              placeholder="Company name"
            />
          </div>
          <div className="row2">
            <div className="field">
              <label>Location</label>
              <input
                value={ex.location}
                onChange={(e) =>
                  dispatch({ type: "SET_EXP", index: i, field: "location", value: e.target.value })
                }
                placeholder="Remote / City"
              />
            </div>
            <div className="row2">
              <div className="field">
                <label>Start</label>
                <input
                  value={ex.start}
                  onChange={(e) =>
                    dispatch({ type: "SET_EXP", index: i, field: "start", value: e.target.value })
                  }
                  placeholder="Jan 2023"
                />
              </div>
              <div className="field">
                <label>End</label>
                <input
                  value={ex.end}
                  onChange={(e) => dispatch({ type: "SET_EXP", index: i, field: "end", value: e.target.value })}
                  placeholder="Present"
                />
              </div>
            </div>
          </div>

          <label
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 10.5,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "var(--muted)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Responsibilities / achievements
          </label>
          {ex.bullets.map((b, bi) => {
            const key = `${i}:${bi}`;
            return (
              <div className="bullet-row" key={bi}>
                <textarea
                  value={b}
                  onChange={(e) =>
                    dispatch({ type: "SET_BULLET", expIndex: i, bulletIndex: bi, value: e.target.value })
                  }
                  placeholder="e.g. helped fix bugs and worked with the team on the website"
                />
                <button className="ai-btn" disabled={loadingKey === key} onClick={() => improveBullet(i, bi)}>
                  {loadingKey === key ? "…" : "✦ Improve"}
                </button>
                {ex.bullets.length > 1 && (
                  <button
                    className="icon-btn"
                    onClick={() => dispatch({ type: "REMOVE_BULLET", expIndex: i, bulletIndex: bi })}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          <button
            className="ghost-btn"
            style={{ marginBottom: 14 }}
            onClick={() => dispatch({ type: "ADD_BULLET", expIndex: i })}
          >
            + Add bullet
          </button>
        </div>
      ))}
      <button className="ghost-btn" onClick={() => dispatch({ type: "ADD_EXP" })}>
        + Add another role
      </button>
    </div>
  );
}
