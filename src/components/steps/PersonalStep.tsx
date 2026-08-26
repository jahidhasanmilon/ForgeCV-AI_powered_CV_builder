"use client";

import { useCv } from "@/lib/cvContext";
import CountryPanel from "../CountryPanel";

const COUNTRIES: { code: "general" | "DE" | "US" | "GB"; label: string }[] = [
  { code: "general", label: "General" },
  { code: "US", label: "USA" },
  { code: "DE", label: "Germany" },
  { code: "GB", label: "UK / Europe" },
];

export default function PersonalStep() {
  const { data, dispatch } = useCv();
  const p = data.personal;

  return (
    <div>
      <h2 className="step-title">Personal details</h2>
      <p className="step-sub">Name and contact details — the foundation of every CV.</p>

      <div className="field">
        <label>Full name</label>
        <input
          value={p.name}
          onChange={(e) => dispatch({ type: "SET_PERSONAL", field: "name", value: e.target.value })}
          placeholder="e.g. Jahid Hasan Milon"
        />
      </div>
      <div className="row2">
        <div className="field">
          <label>Email</label>
          <input
            value={p.email}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", field: "email", value: e.target.value })}
            placeholder="you@email.com"
          />
        </div>
        <div className="field">
          <label>Phone</label>
          <input
            value={p.phone}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", field: "phone", value: e.target.value })}
            placeholder="+880 ..."
          />
        </div>
      </div>
      <div className="row2">
        <div className="field">
          <label>Location</label>
          <input
            value={p.location}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", field: "location", value: e.target.value })}
            placeholder="Dhaka, Bangladesh"
          />
        </div>
        <div className="field">
          <label>LinkedIn / portfolio</label>
          <input
            value={p.linkedin}
            onChange={(e) => dispatch({ type: "SET_PERSONAL", field: "linkedin", value: e.target.value })}
            placeholder="linkedin.com/in/..."
          />
        </div>
      </div>

      <div className="field" style={{ marginTop: 22 }}>
        <label>Target region</label>
        <div className="country-grid">
          {COUNTRIES.map((c) => (
            <div
              key={c.code}
              className={`country-opt ${data.targetCountry === c.code ? "sel" : ""}`}
              onClick={() => dispatch({ type: "SET_COUNTRY", value: c.code })}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>

      <CountryPanel countryCode={data.targetCountry} />
    </div>
  );
}
