"use client";

import { useState } from "react";
import { CvProvider, useCv } from "@/lib/cvContext";
import { DEMO_CV } from "@/lib/demoData";
import StepTracker, { STEPS } from "@/components/StepTracker";
import PersonalStep from "@/components/steps/PersonalStep";
import EducationStep from "@/components/steps/EducationStep";
import ExperienceStep from "@/components/steps/ExperienceStep";
import SkillsStep from "@/components/steps/SkillsStep";
import PreviewStep from "@/components/steps/PreviewStep";
import CvPreviewDoc from "@/components/CvPreviewDoc";
import AssistantChat from "@/components/AssistantChat";

function Builder() {
  const [step, setStep] = useState(0);
  const { data } = useCv();

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <div className="brand">
            CVForge<span>.</span>
          </div>
          <div className="tagline">AI CV builder for going abroad</div>
        </div>
        <div className="stack-badges">
          <span className="badge">Next.js</span>
          <span className="badge">TypeScript</span>
          <span className="badge">AI LLM</span>
          <span className="badge">Tool use</span>
          <span className="badge">RAG</span>
          <span className="badge">3rd-party API</span>
        </div>
      </div>

      <StepTracker step={step} onSelect={setStep} />

      <div className="spread">
        <div className="panel-form">
          {step === 0 && <PersonalStep />}
          {step === 1 && <EducationStep />}
          {step === 2 && <ExperienceStep />}
          {step === 3 && <SkillsStep />}
          {step === 4 && <PreviewStep onBack={() => setStep(0)} />}

          <div className="nav-buttons">
            <button className="btn secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
            <button
              className="btn"
              disabled={step === STEPS.length - 1}
              onClick={() => setStep((s) => s + 1)}
            >
              {step === STEPS.length - 2 ? "Preview →" : "Next →"}
            </button>
          </div>
        </div>

        <div className="panel-preview">
          <div id="livePreviewDoc">
            <CvPreviewDoc data={data} />
          </div>
          <div className="mrz">
            {`CV<<${(data.personal.name || "YOUR NAME").toUpperCase().replace(/\s+/g, "<")}<<ATS-READY<<TARGET-${data.targetCountry.toUpperCase()}<<DEPARTURE.APP`}
          </div>
        </div>

        <div className="panel-assistant">
          <AssistantChat />
        </div>
      </div>

      <div id="printArea" style={{ display: "none" }} />
    </div>
  );
}

export default function Page() {
  return (
    <CvProvider initial={DEMO_CV}>
      <Builder />
    </CvProvider>
  );
}
