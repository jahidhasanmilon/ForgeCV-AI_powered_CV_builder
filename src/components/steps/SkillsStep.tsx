"use client";

import { useState } from "react";
import { useCv } from "@/lib/cvContext";

export default function SkillsStep() {
  const { data, dispatch } = useCv();
  const [value, setValue] = useState("");

  function addSkill() {
    const v = value.trim();
    if (v) {
      dispatch({ type: "ADD_SKILL", value: v });
      setValue("");
    }
  }

  return (
    <div>
      <h2 className="step-title">Skills</h2>
      <p className="step-sub">Technical ও soft skills — Enter চাপুন যোগ করতে।</p>
      <div className="skill-chip-input">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. React, Project Management, German (B1)"
        />
        <button className="btn secondary" onClick={addSkill}>
          Add
        </button>
      </div>
      <div className="chips">
        {data.skills.map((s, i) => (
          <span className="chip" key={i}>
            {s}
            <button onClick={() => dispatch({ type: "REMOVE_SKILL", index: i })}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
}
