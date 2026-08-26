"use client";

import { useCv } from "@/lib/cvContext";

export default function SummaryStep() {
  const { data, dispatch } = useCv();

  return (
    <div>
      <h2 className="step-title">Career objective</h2>
      <p className="step-sub">A 2–3 sentence summary of who you are and what you're looking for.</p>

      <div className="field">
        <label>Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => dispatch({ type: "SET_SUMMARY", value: e.target.value })}
          placeholder="e.g. Engineer and entrepreneur building [project], skilled in leadership, management, and technology..."
          style={{ minHeight: 110 }}
        />
      </div>
    </div>
  );
}
