"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { CvProvider, useCv } from "@/lib/cvContext";
import { deleteResume, getResume, renameResume, saveResume } from "@/lib/resumes";
import {
  deleteLocalResume,
  getLocalResume,
  renameLocalResume,
  saveLocalResume,
} from "@/lib/localResumes";
import { CvData, EMPTY_CV } from "@/lib/types";
import SiteHeader from "@/components/SiteHeader";
import EditorToolbar from "@/components/EditorToolbar";
import Accordion from "@/components/Accordion";
import PersonalStep from "@/components/steps/PersonalStep";
import SummaryStep from "@/components/steps/SummaryStep";
import EducationStep from "@/components/steps/EducationStep";
import ExperienceStep from "@/components/steps/ExperienceStep";
import ProjectsStep from "@/components/steps/ProjectsStep";
import SkillsStep from "@/components/steps/SkillsStep";
import PreviewStep from "@/components/steps/PreviewStep";
import CvPreviewDoc from "@/components/CvPreviewDoc";
import AssistantChat from "@/components/AssistantChat";

type Tab = "overview" | "content" | "customize" | "ai";

const ACCENTS = [
  { label: "Teal", value: "#0b7a70" },
  { label: "Blue", value: "#1d4ed8" },
  { label: "Rose", value: "#be123c" },
  { label: "Amber", value: "#b45309" },
  { label: "Violet", value: "#6d28d9" },
];

function EditorBody({ id, name, onRename, onDelete }: { id: string; name: string; onRename: (n: string) => void; onDelete: () => void }) {
  const { data } = useCv();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("content");
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [accent, setAccent] = useState(ACCENTS[0].value);

  function exportPdf() {
    const printArea = document.getElementById("printArea");
    if (printArea) {
      printArea.innerHTML = document.getElementById("livePreviewDoc")?.innerHTML ?? "";
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }

  const accentStyle = { "--doc-teal-dark": accent } as CSSProperties;

  useEffect(() => {
    const t = setTimeout(() => {
      const save = user ? saveResume(user.uid, id, data) : saveLocalResume(id, data);
      save.catch((e) => console.error("Failed to save resume:", e));
    }, 900);
    return () => clearTimeout(t);
  }, [data, user, id]);

  return (
    <div className="app">
      <EditorToolbar
        name={name}
        tab={tab}
        onTabChange={setTab}
        onRename={onRename}
        onDelete={onDelete}
        onDownload={exportPdf}
      />

      {tab === "content" && (
        <div className="spread" style={{ gridTemplateColumns: detailsCollapsed ? "56px 1fr" : undefined }}>
          {detailsCollapsed ? (
            <div className="panel-form panel-form-collapsed" onClick={() => setDetailsCollapsed(false)}>
              <button className="panel-toggle-btn" aria-label="Expand details" title="Expand details">
                ⤡
              </button>
              <span className="panel-form-collapsed-label">Details</span>
            </div>
          ) : (
            <div className="panel-form">
              <div className="panel-form-header">
                <span className="preview-panel-label">Details</span>
                <button className="panel-toggle-btn" onClick={() => setDetailsCollapsed(true)} title="Collapse details">
                  ⤢ Collapse
                </button>
              </div>

              <div className="accordion-card personal-card">
                <PersonalStep />
              </div>
              <Accordion title="Career Objective" defaultOpen={!!data.summary}>
                <SummaryStep />
              </Accordion>
              <Accordion title="Education" defaultOpen>
                <EducationStep />
              </Accordion>
              <Accordion title="Experience" defaultOpen>
                <ExperienceStep />
              </Accordion>
              <Accordion title="Projects" defaultOpen={data.projects.length > 0}>
                <ProjectsStep />
              </Accordion>
              <Accordion title="Skills" defaultOpen>
                <SkillsStep />
              </Accordion>
              <Accordion title="Job Match">
                <PreviewStep />
              </Accordion>
            </div>
          )}

          <div className="panel-preview" style={accentStyle}>
            <div className="preview-panel-header">
              <span className="preview-panel-label">Live preview</span>
              <button className="preview-expand-btn" onClick={() => setPreviewExpanded(true)}>
                ⤢ Expand
              </button>
            </div>
            <div id="livePreviewDoc">
              <CvPreviewDoc data={data} />
            </div>
          </div>
        </div>
      )}

      {tab === "overview" && (
        <div className="overview-tab" style={accentStyle}>
          <CvPreviewDoc data={data} />
        </div>
      )}

      {tab === "customize" && (
        <div className="customize-tab">
          <h2 className="step-title">Customize</h2>
          <p className="step-sub">Pick an accent color for your CV's section headings.</p>
          <div className="accent-swatches">
            {ACCENTS.map((a) => (
              <button
                key={a.value}
                className={`accent-swatch ${accent === a.value ? "sel" : ""}`}
                style={{ background: a.value }}
                onClick={() => setAccent(a.value)}
                title={a.label}
                aria-label={a.label}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div className="ai-tab">
          <AssistantChat />
        </div>
      )}

      {previewExpanded && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewExpanded(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()} style={accentStyle}>
            <button className="preview-modal-close" onClick={() => setPreviewExpanded(false)} aria-label="Close">
              ×
            </button>
            <CvPreviewDoc data={data} />
          </div>
        </div>
      )}

      <div id="printArea" style={{ display: "none" }} />
    </div>
  );
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [cv, setCv] = useState<CvData | null>(null);
  const [name, setName] = useState("Untitled resume");
  const [notFound, setNotFound] = useState(false);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (loadedFor.current === id) return;
    loadedFor.current = id;

    let cancelled = false;
    const load = user ? getResume(user.uid, id) : getLocalResume(id);
    load.then((resume) => {
      if (cancelled) return;
      if (!resume) {
        setNotFound(true);
        return;
      }
      setCv(resume.cv);
      setName(resume.name);
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, id]);

  async function handleRename(newName: string) {
    setName(newName);
    if (user) await renameResume(user.uid, id, newName);
    else await renameLocalResume(id, newName);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this resume? This can't be undone.")) return;
    if (user) await deleteResume(user.uid, id);
    else await deleteLocalResume(id);
    router.push("/");
  }

  if (notFound) {
    return (
      <>
        <SiteHeader />
        <div className="app">
          <div className="dash-empty">Resume not found.</div>
        </div>
      </>
    );
  }

  if (authLoading || !cv) {
    return (
      <>
        <SiteHeader />
        <div className="app">
          <div className="dash-empty">Loading…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <CvProvider initial={cv ?? EMPTY_CV}>
        <EditorBody id={id} name={name} onRename={handleRename} onDelete={handleDelete} />
      </CvProvider>
    </>
  );
}
