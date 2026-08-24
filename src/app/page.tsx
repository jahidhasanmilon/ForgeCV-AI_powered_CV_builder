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

  function exportPdf() {
    const printArea = document.getElementById("printArea");
    if (printArea) {
      printArea.innerHTML = document.getElementById("livePreviewDoc")?.innerHTML ?? "";
    }
    window.print();
  }

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div>
            <div className="brand-row">
              <div className="brand">
                ForgeCV<span>.</span>
              </div>
              <span className="brand-badge">BETA</span>
            </div>
            <div className="tagline">AI CV builder for going abroad</div>
          </div>

          <div className="header-icons">
            <a
              className="header-icon-btn"
              href="https://github.com/jahidhasanmilon/ForgeCV-AI_powered_CV_builder"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              title="GitHub repo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
            </a>

            <button className="header-icon-btn" onClick={exportPdf} aria-label="Download PDF" title="Download PDF">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M4 19h16" />
              </svg>
            </button>

            <button className="header-icon-btn" aria-label="More options" title="More options">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            <div className="header-avatar" title="Your account">FC</div>
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

        {!assistantOpen && (
          <div className="assistant-teaser" onClick={() => setAssistantOpen(true)}>
            👋 Need help? Ask AI
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
