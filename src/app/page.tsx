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
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
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

        {!authLoading && !user && (
          <div className="signin-prompt">
            <div className="signin-prompt-title">Sign in to create and save resumes</div>
            <p className="step-sub" style={{ margin: "6px 0 16px" }}>
              Your resumes are saved to your Google account so you can come back and edit them anytime.
            </p>
            <button className="signin-btn" onClick={signInWithGoogle}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.7 26.9 36 24 36c-5.3 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.5C39.4 37.6 44 31.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

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
