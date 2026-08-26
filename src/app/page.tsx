"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { createResume, deleteResume, listResumes, renameResume, ResumeMeta } from "@/lib/resumes";
import {
  createLocalResume,
  deleteLocalResume,
  listLocalResumes,
  renameLocalResume,
} from "@/lib/localResumes";
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = user ? listResumes(user.uid) : listLocalResumes();
    load.then((r) => {
      if (!cancelled) setResumes(r);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleNewResume() {
    if (creating) return;
    setCreating(true);
    try {
      const id = user
        ? await createResume(user.uid, "Untitled resume")
        : await createLocalResume("Untitled resume");
      router.push(`/editor/${id}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleRename(id: string) {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    if (user) await renameResume(user.uid, id, renameValue.trim());
    else await renameLocalResume(id, renameValue.trim());
    setResumes((r) => r && r.map((x) => (x.id === id ? { ...x, name: renameValue.trim() } : x)));
    setRenamingId(null);
  }

  async function handleDelete(id: string) {
    setMenuOpenId(null);
    if (!window.confirm("Delete this resume? This can't be undone.")) return;
    if (user) await deleteResume(user.uid, id);
    else await deleteLocalResume(id);
    setResumes((r) => r && r.filter((x) => x.id !== id));
  }

  const filteredResumes = resumes?.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <SiteHeader />
      <div className="dashboard-shell">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-nav-item active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 3h9l3 3v15H6z" />
                <path d="M9 9h6M9 13h6M9 17h4" />
              </svg>
              Resume
            </div>
          </nav>
          <div className="sidebar-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes…"
            />
          </div>
        </aside>

        <div className="dashboard-content">
          <div className="app">
            <h1 className="dash-title">My Resumes</h1>
            <p className="dash-sub">Build as many resumes as you need, saved to your account.</p>

            {authLoading && <div className="dash-empty">Loading…</div>}

            {!authLoading && resumes === null && <div className="dash-empty">Loading your resumes…</div>}

            {!authLoading && filteredResumes && (
              <div className="resume-grid">
                {!search && (
                  <button className="resume-card new-card" onClick={handleNewResume} disabled={creating}>
                    <span className="new-card-plus">+</span>
                    <span>{creating ? "Creating…" : "New resume"}</span>
                  </button>
                )}

                {filteredResumes.map((r) => (
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
        </div>
      </div>
    </>
  );
}
