"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function SiteHeader() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div className="topbar-left">
            <button
              className="header-icon-btn hamburger-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              title="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </svg>
            </button>

            <Link href="/" className="brand-row" style={{ textDecoration: "none" }}>
              <div className="brand">
                ForgeCV<span>.</span>
              </div>
              <span className="brand-badge">BETA</span>
            </Link>
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

            {!authLoading && !user && (
              <button className="header-avatar profile-icon-btn" onClick={signInWithGoogle} aria-label="Sign in" title="Sign in">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </button>
            )}

            {user && (
              <div
                className="header-avatar"
                title={`${user.displayName ?? "Signed in"} — click to sign out`}
                onClick={signOut}
                style={user.photoURL ? { backgroundImage: `url(${user.photoURL})`, backgroundSize: "cover" } : undefined}
              >
                {!user.photoURL && (user.displayName?.[0] ?? "U")}
              </div>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="nav-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div className="nav-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="nav-drawer-header">
              <div className="brand-row">
                <div className="brand">
                  ForgeCV<span>.</span>
                </div>
                <span className="brand-badge">BETA</span>
              </div>
              <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                ×
              </button>
            </div>

            <nav className="nav-drawer-nav">
              <Link href="/" className="nav-drawer-item active" onClick={() => setDrawerOpen(false)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 3h9l3 3v15H6z" />
                  <path d="M9 9h6M9 13h6M9 17h4" />
                </svg>
                My Resumes
              </Link>
            </nav>

            <div
              className="nav-drawer-account"
              onClick={() => {
                setDrawerOpen(false);
                if (user) signOut();
                else signInWithGoogle();
              }}
            >
              <div
                className="sidebar-account-avatar"
                style={
                  user?.photoURL
                    ? { backgroundImage: `url(${user.photoURL})`, backgroundSize: "cover" }
                    : undefined
                }
              >
                {!user?.photoURL && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                )}
              </div>
              <span>{authLoading ? "…" : user ? user.displayName ?? "Signed in" : "Sign in"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
