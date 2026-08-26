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
- **Google sign-in + saved CVs**: Firebase Authentication (Google provider) and
  Firestore persist each signed-in user's CV — `src/lib/firebase.ts`,
  `src/lib/authContext.tsx`, `src/lib/useCvSync.ts`

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
4. Open http://localhost:3000 — the app loads pre-filled with a sample CV so
   you can see every feature immediately.

## Firebase setup (Google sign-in + saved CVs)

1. Create a project at https://console.firebase.google.com/.
2. **Authentication** → Sign-in method → enable **Google**.
3. **Build → Firestore Database** → create a database (start in production mode).
4. Set these Firestore security rules so users can only read/write their own
   CV document (Firestore → Rules):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
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
    page.tsx                 # main builder UI (steps + live preview + assistant)
    layout.tsx, globals.css
    api/
      ai/rewrite-bullet/     # LLM: bullet rewriting
      ai/job-match/          # LLM + RAG: job description match scoring
      ai/assistant/          # LLM + tool-calling agent loop
      country/                # 3rd-party API proxy (restcountries.com)
  components/
    steps/                  # Personal, Education, Experience, Skills, Preview
    CvPreviewDoc.tsx         # renders the live CV document
    CountryPanel.tsx         # live 3rd-party API panel
    AssistantChat.tsx        # tool-calling chat widget
  lib/
    types.ts, cvContext.tsx, demoData.ts, claude.ts, countryApi.ts
    firebase.ts, authContext.tsx, useCvSync.ts   # Google sign-in + Firestore sync
    rag/knowledge.ts          # local knowledge base
    rag/retrieve.ts           # TF-IDF + cosine similarity retrieval
```

## Notes

- CV state lives in React state (`src/lib/cvContext.tsx`) for the current
  session; if signed in with Google, it's also persisted to Firestore
  (`src/lib/useCvSync.ts`) so it's there next time you log in. Signed-out
  visitors just get the in-session demo state.
- PDF export uses the browser's native print-to-PDF via a hidden `#printArea`
  and `@media print` styles in `globals.css`.
- The RAG knowledge base is intentionally tiny and in-memory so the whole
  pipeline (tokenize → TF-IDF vectorize → cosine similarity → top-k) is easy
  to read in `src/lib/rag/retrieve.ts`. Swap in a vector DB for production.
