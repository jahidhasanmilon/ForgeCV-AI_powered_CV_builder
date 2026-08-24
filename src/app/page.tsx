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
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const { data } = useCv();

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div>
            <div className="brand">
              ForgeCV<span>.</span>
            </div>
            <div className="tagline">AI CV builder for going abroad</div>
          </div>
        </div>
      </header>

      <div className="app">
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
            <div className="preview-panel-header">
              <span className="preview-panel-label">Live preview</span>
              <button className="preview-expand-btn" onClick={() => setPreviewExpanded(true)}>
                ⤢ Expand
              </button>
            </div>
            <div id="livePreviewDoc">
              <CvPreviewDoc data={data} />
            </div>
            <div className="mrz">
              {`CV<<${(data.personal.name || "YOUR NAME").toUpperCase().replace(/\s+/g, "<")}<<ATS-READY<<TARGET-${data.targetCountry.toUpperCase()}<<FORGECV.APP`}
            </div>
          </div>
        </div>

        {previewExpanded && (
          <div className="preview-modal-backdrop" onClick={() => setPreviewExpanded(false)}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
              <button className="preview-modal-close" onClick={() => setPreviewExpanded(false)} aria-label="Collapse preview">
                ×
              </button>
              <CvPreviewDoc data={data} />
            </div>
          </div>
        )}

        {assistantOpen && (
          <div className="assistant-popup">
            <button className="assistant-popup-close" onClick={() => setAssistantOpen(false)} aria-label="Close assistant">
              ×
            </button>
            <AssistantChat />
          </div>
        )}

        <button
          className="assistant-fab"
          onClick={() => setAssistantOpen((o) => !o)}
          aria-label="Toggle CV assistant"
        >
          💬
        </button>

        <div id="printArea" style={{ display: "none" }} />
      </div>
    </>
  );
}

export default function Page() {
  return (
    <CvProvider initial={DEMO_CV}>
      <Builder />
    </CvProvider>
  );
}
