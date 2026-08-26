"use client";

import Link from "next/link";
import { useState } from "react";

type Tab = "overview" | "content" | "customize" | "ai";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "customize", label: "Customize" },
  { id: "ai", label: "AI Tools" },
];

export default function EditorToolbar({
  name,
  tab,
  onTabChange,
  onRename,
  onDelete,
  onDownload,
}: {
  name: string;
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  onDownload: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [value, setValue] = useState(name);
  const [menuOpen, setMenuOpen] = useState(false);

  function commitRename() {
    setRenaming(false);
    if (value.trim() && value.trim() !== name) onRename(value.trim());
    else setValue(name);
  }

  return (
    <div className="editor-toolbar">
      <Link href="/" className="editor-back" aria-label="Back to My Resumes" title="Back to My Resumes">
        ←
      </Link>

      <div className="editor-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`editor-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="editor-toolbar-right">
        {renaming ? (
          <input
            autoFocus
            className="editor-name-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitRename()}
            onBlur={commitRename}
          />
        ) : (
          <button className="editor-name" onClick={() => setRenaming(true)} title="Rename">
            {name}
          </button>
        )}

        <button className="btn" onClick={onDownload}>
          Download
        </button>

        <div className="resume-card-menu">
          <button className="header-icon-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="More options">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {menuOpen && (
            <div className="resume-card-dropdown">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
