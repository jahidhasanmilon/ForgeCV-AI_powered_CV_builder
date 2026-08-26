"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";

export default function SiteHeader() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="topbar">
        <Link href="/" className="brand-row" style={{ textDecoration: "none" }}>
          <div className="brand">
            ForgeCV<span>.</span>
          </div>
          <span className="brand-badge">BETA</span>
        </Link>

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
            <button className="signin-btn" onClick={signInWithGoogle}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.6l-6.5-5.5C29.6 34.7 26.9 36 24 36c-5.3 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.5C39.4 37.6 44 31.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Sign in
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
  );
}
