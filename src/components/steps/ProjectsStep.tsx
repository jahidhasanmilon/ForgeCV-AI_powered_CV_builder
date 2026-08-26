"use client";

import { useCv } from "@/lib/cvContext";

export default function ProjectsStep() {
  const { data, dispatch } = useCv();

  return (
    <div>
      <h2 className="step-title">Projects</h2>
      <p className="step-sub">Things you've built — apps, sites, tools, or side projects.</p>

      {data.projects.map((pr, i) => (
        <div className="block-card" key={i}>
          <div className="block-head">
            <strong>Project {i + 1}</strong>
            <button className="icon-btn" onClick={() => dispatch({ type: "REMOVE_PROJECT", index: i })}>
              remove
            </button>
          </div>
          <div className="field">
            <label>Project name</label>
            <input
              value={pr.title}
              onChange={(e) => dispatch({ type: "SET_PROJECT", index: i, field: "title", value: e.target.value })}
              placeholder="e.g. Rubalif App"
            />
          </div>
          <div className="row2">
            <div className="field">
              <label>Link (optional)</label>
              <input
                value={pr.link}
                onChange={(e) => dispatch({ type: "SET_PROJECT", index: i, field: "link", value: e.target.value })}
                placeholder="github.com/... or live URL"
              />
            </div>
            <div className="field">
              <label>Tech / tools used</label>
              <input
                value={pr.tech}
                onChange={(e) => dispatch({ type: "SET_PROJECT", index: i, field: "tech", value: e.target.value })}
                placeholder="React, Firebase, ..."
              />
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
            What you did
          </label>
          {pr.bullets.map((b, bi) => (
            <div className="bullet-row" key={bi}>
              <textarea
                value={b}
                onChange={(e) =>
                  dispatch({ type: "SET_PROJECT_BULLET", projIndex: i, bulletIndex: bi, value: e.target.value })
                }
                placeholder="e.g. Built and launched the product end-to-end"
              />
              {pr.bullets.length > 1 && (
                <button
                  className="icon-btn"
                  onClick={() => dispatch({ type: "REMOVE_PROJECT_BULLET", projIndex: i, bulletIndex: bi })}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            className="ghost-btn"
            style={{ marginBottom: 14 }}
            onClick={() => dispatch({ type: "ADD_PROJECT_BULLET", projIndex: i })}
          >
            + Add bullet
          </button>
        </div>
      ))}
      <button className="ghost-btn" onClick={() => dispatch({ type: "ADD_PROJECT" })}>
        + Add another project
      </button>
    </div>
  );
}
