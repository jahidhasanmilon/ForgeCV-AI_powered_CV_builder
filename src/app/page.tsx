"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import {
  createResume,
  deleteResume,
  duplicateResume,
  listResumes,
  renameResume,
  ResumeMeta,
} from "@/lib/resumes";
import {
  createLocalResume,
  deleteLocalResume,
  duplicateLocalResume,
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
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
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

  async function handleDuplicate(id: string) {
    setMenuOpenId(null);
    if (user) await duplicateResume(user.uid, id);
    else await duplicateLocalResume(id);
    setResumes(user ? await listResumes(user.uid) : await listLocalResumes());
  }

  function handleDownload(id: string) {
    setMenuOpenId(null);
    router.push(`/editor/${id}?download=1`);
  }

  const filteredResumes = resumes?.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <>
      <SiteHeader />
      <div className="app">
        <div className="dash-header-row">
          <div>
            <h1 className="dash-title">My Resumes</h1>
            <p className="dash-sub">Build as many resumes as you need, saved to your account.</p>
          </div>
          <div className="dash-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes…"
            />
          </div>
        </div>

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
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                              Edit title
                            </button>
                            <button onClick={() => handleDuplicate(r.id)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="12" height="12" rx="2" />
                                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                              </svg>
                              Duplicate
                            </button>
                            <button onClick={() => handleDownload(r.id)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3v12" />
                                <path d="M7 10l5 5 5-5" />
                                <path d="M4 19h16" />
                              </svg>
                              Download
                            </button>
                            <button className="danger" onClick={() => handleDelete(r.id)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              </svg>
                              Delete
                            </button>
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
