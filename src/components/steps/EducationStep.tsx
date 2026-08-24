"use client";

import { useCv } from "@/lib/cvContext";

export default function EducationStep() {
  const { data, dispatch } = useCv();

  return (
    <div>
      <h2 className="step-title">Education</h2>
      <p className="step-sub">সবচেয়ে সাম্প্রতিক ডিগ্রি আগে দিন।</p>

      {data.education.map((ed, i) => (
        <div className="block-card" key={i}>
          <div className="block-head">
            <strong>Degree {i + 1}</strong>
            {data.education.length > 1 && (
              <button className="icon-btn" onClick={() => dispatch({ type: "REMOVE_EDU", index: i })}>
                remove
              </button>
            )}
          </div>
          <div className="field">
            <label>Degree & field</label>
            <input
              value={ed.degree}
              onChange={(e) => dispatch({ type: "SET_EDU", index: i, field: "degree", value: e.target.value })}
              placeholder="B.Sc. in Computer Science"
            />
          </div>
          <div className="field">
            <label>Institution</label>
            <input
              value={ed.institution}
              onChange={(e) =>
                dispatch({ type: "SET_EDU", index: i, field: "institution", value: e.target.value })
              }
              placeholder="University of Dhaka"
            />
          </div>
          <div className="row2">
            <div className="field">
              <label>Location</label>
              <input
                value={ed.location}
                onChange={(e) =>
                  dispatch({ type: "SET_EDU", index: i, field: "location", value: e.target.value })
                }
                placeholder="Dhaka, Bangladesh"
              />
            </div>
            <div className="row2">
              <div className="field">
                <label>Start</label>
                <input
                  value={ed.start}
                  onChange={(e) =>
                    dispatch({ type: "SET_EDU", index: i, field: "start", value: e.target.value })
                  }
                  placeholder="2019"
                />
              </div>
              <div className="field">
                <label>End</label>
                <input
                  value={ed.end}
                  onChange={(e) => dispatch({ type: "SET_EDU", index: i, field: "end", value: e.target.value })}
                  placeholder="2023"
                />
              </div>
            </div>
          </div>
          <div className="field">
            <label>Details (optional)</label>
            <textarea
              value={ed.details}
              onChange={(e) =>
                dispatch({ type: "SET_EDU", index: i, field: "details", value: e.target.value })
              }
              placeholder="CGPA, thesis, relevant coursework..."
            />
          </div>
        </div>
      ))}
      <button className="ghost-btn" onClick={() => dispatch({ type: "ADD_EDU" })}>
        + Add another degree
      </button>
    </div>
  );
}
