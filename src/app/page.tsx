"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { createResume, deleteResume, listResumes, renameResume, ResumeMeta } from "@/lib/resumes";
import SiteHeader from "@/components/SiteHeader";

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeMeta[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    if (!user) {
      setResumes(null);
      return;
    }
    let cancelled = false;
    listResumes(user.uid).then((r) => {
      if (!cancelled) setResumes(r);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleNewResume() {
    if (!user || creating) return;
    setCreating(true);
    try {
      const id = await createResume(user.uid, "Untitled resume");
      router.push(`/editor/${id}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(id: string) {
    if (!user || !renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    await renameResume(user.uid, id, renameValue.trim());
    setResumes((r) => r && r.map((x) => (x.id === id ? { ...x, name: renameValue.trim() } : x)));
    setRenamingId(null);
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setMenuOpenId(null);
    if (!window.confirm("Delete this resume? This can't be undone.")) return;
    await deleteResume(user.uid, id);
    setResumes((r) => r && r.filter((x) => x.id !== id));
  }

  return (
    <>
      <SiteHeader />
      <div className="app">
        <h1 className="dash-title">My Resumes</h1>
        <p className="dash-sub">Build as many resumes as you need, saved to your account.</p>

        {authLoading && <div className="dash-empty">Loading…</div>}

        {user && resumes === null && <div className="dash-empty">Loading your resumes…</div>}

        {user && resumes && (
          <div className="resume-grid">
            <button className="resume-card new-card" onClick={handleNewResume} disabled={creating}>
              <span className="new-card-plus">+</span>
              <span>{creating ? "Creating…" : "New resume"}</span>
            </button>

            {resumes.map((r) => (
              <div
                key={r.id}
                className="resume-card"
                onClick={() => renamingId !== r.id && router.push(`/editor/${r.id}`)}
              >
                <div className="resume-thumb">
                  <div className="resume-thumb-line long" />
                  <div className="resume-thumb-line short" />
                  <div className="resume-thumb-gap" />
                  <div className="resume-thumb-line" />
                  <div className="resume-thumb-line" />
                  <div className="resume-thumb-line short" />
                </div>
                <div className="resume-card-footer">
                  {renamingId === r.id ? (
                    <input
                      autoFocus
                      className="resume-rename-input"
                      value={renameValue}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(r.id)}
                      onBlur={() => handleRename(r.id)}
                    />
                  ) : (
                    <div>
                      <div className="resume-card-name">{r.name}</div>
                      <div className="resume-card-meta">edited {timeAgo(r.updatedAt)}</div>
                    </div>
                  )}

                  <div className="resume-card-menu" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="header-icon-btn"
                      onClick={() => setMenuOpenId(menuOpenId === r.id ? null : r.id)}
                      aria-label="Resume options"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>
                    {menuOpenId === r.id && (
                      <div className="resume-card-dropdown">
                        <button
                          onClick={() => {
                            setRenamingId(r.id);
                            setRenameValue(r.name);
                            setMenuOpenId(null);
                          }}
                        >
                          Rename
                        </button>
                        <button onClick={() => handleDelete(r.id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
