# ForgeCV — AI CV Builder

A full-stack app for building ATS-friendly CVs, showcasing a modern AI
product stack end-to-end while staying small enough to read in one sitting.

## Stack / features covered

- **Next.js 14 (App Router) + TypeScript + React** — `src/app`, `src/components`
- **LLM integration (Anthropic API)** — `src/lib/claude.ts`
- **AI feature**: rewrites raw job responsibilities into ATS-optimized resume
  bullets — `src/app/api/ai/rewrite-bullet/route.ts`
- **Tool use / agent loop**: a chat assistant where the LLM decides when to
  call tools, the server executes them, and results are fed back —
  `src/app/api/ai/assistant/route.ts`
- **RAG (Retrieval-Augmented Generation)**: a small local knowledge base of CV
  writing rules, retrieved with TF‑IDF + cosine similarity and injected into
  prompts — `src/lib/rag/`
- **3rd-party API integration**: live country facts from restcountries.com —
  `src/lib/countryApi.ts`, used both as a UI panel and as an agent tool
- **Google sign-in + multi-resume dashboard**: Firebase Authentication (Google
  provider) and Firestore let a signed-in user create, save, rename, and
  delete multiple resumes — `src/lib/firebase.ts`, `src/lib/authContext.tsx`,
  `src/lib/resumes.ts`

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env file:
   ```bash
   cp .env.local.example .env.local
   ```
   - Add your Anthropic API key (get one at https://console.anthropic.com/).
   - Add your Firebase project config (see **Firebase setup** below).
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 — sign in with Google to create and save
   resumes. Signed-out visitors just see the sign-in prompt.

## Firebase setup (Google sign-in + saved resumes)

1. Create a project at https://console.firebase.google.com/.
2. **Authentication** → Sign-in method → enable **Google**.
3. **Build → Firestore Database** → create a database (start in production mode).
4. Set these Firestore security rules so a user can only read/write their own
   resumes, stored at `users/{uid}/resumes/{resumeId}` (Firestore → Rules):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/resumes/{resumeId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
5. **Project settings → General → Your apps** → add a Web app → copy the
   config values into `.env.local` (`NEXT_PUBLIC_FIREBASE_*` keys).
6. In **Authentication → Settings → Authorized domains**, add your deployed
   domain (e.g. `your-app.vercel.app`) alongside `localhost`.
7. Add the same `NEXT_PUBLIC_FIREBASE_*` env vars in your Vercel project
   settings before deploying.

## Project structure

```
src/
  app/
    page.tsx                 # dashboard: "My Resumes" grid, create/rename/delete
    editor/[id]/page.tsx      # editor for one resume: accordion sections + live preview
    layout.tsx, globals.css
    api/
      ai/rewrite-bullet/     # LLM: bullet rewriting
      ai/job-match/          # LLM + RAG: job description match scoring
      ai/assistant/          # LLM + tool-calling agent loop
      country/                # 3rd-party API proxy (restcountries.com)
  components/
    SiteHeader.tsx, EditorToolbar.tsx, Accordion.tsx
    steps/                  # Personal, Summary, Education, Experience, Projects, Skills, job-match (Preview)
    CvPreviewDoc.tsx         # renders the live CV document
    CountryPanel.tsx         # live 3rd-party API panel
    AssistantChat.tsx        # tool-calling chat widget (embedded in the editor's AI Tools tab)
  lib/
    types.ts, cvContext.tsx, claude.ts, countryApi.ts
    firebase.ts, authContext.tsx           # Google sign-in
    resumes.ts                              # Firestore CRUD for per-user resumes
    localResumes.ts                         # localStorage fallback used when signed out
    rag/knowledge.ts          # local knowledge base
    rag/retrieve.ts           # TF-IDF + cosine similarity retrieval
```

## Notes

- Each signed-in user can create multiple resumes from the dashboard
  (`src/app/page.tsx`); each one lives at `users/{uid}/resumes/{resumeId}` in
  Firestore and autosaves ~1s after you stop typing (`src/app/editor/[id]/page.tsx`).
  Without signing in (or before Firebase is configured), the same dashboard and
  editor work against `localStorage` instead (`src/lib/localResumes.ts`), so the
  full app is usable with zero setup — those resumes just stay on that one
  browser instead of following you across devices.
- PDF export uses the browser's native print-to-PDF via a hidden `#printArea`
  and `@media print` styles in `globals.css`.
- The RAG knowledge base is intentionally tiny and in-memory so the whole
  pipeline (tokenize → TF-IDF vectorize → cosine similarity → top-k) is easy
  to read in `src/lib/rag/retrieve.ts`. Swap in a vector DB for production.
