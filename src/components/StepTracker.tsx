const STEPS = ["Personal", "Education", "Experience", "Skills", "Preview & Match"];

export default function StepTracker({
  step,
  onSelect,
}: {
  step: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="steps">
      {STEPS.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            className={`stamp ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
            onClick={() => onSelect(i)}
          >
            <span className="num">{i + 1}</span>
            <span className="label">{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

export { STEPS };
