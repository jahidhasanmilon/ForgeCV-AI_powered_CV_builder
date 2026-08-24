# Departure — AI CV Builder

A demo full-stack app for building ATS-friendly CVs, built to showcase a modern
AI product stack end-to-end while staying small enough to read in one sitting.

## Stack / features covered

- **Next.js 14 (App Router) + TypeScript + React** — `src/app`, `src/components`
- **LLM integration (Claude, Anthropic API)** — `src/lib/claude.ts`
- **AI feature**: rewrites raw job responsibilities into ATS-optimized resume
  bullets — `src/app/api/ai/rewrite-bullet/route.ts`
- **Tool use / agent loop**: a chat assistant where Claude decides when to call
  tools, the server executes them, and results are fed back — `src/app/api/ai/assistant/route.ts`
- **RAG (Retrieval-Augmented Generation)**: a small local knowledge base of CV
  writing rules, retrieved with TF‑IDF + cosine similarity and injected into
  prompts — `src/lib/rag/`
- **3rd-party API integration**: live country facts from restcountries.com —
  `src/lib/countryApi.ts`, used both as a UI panel and as an agent tool

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the env file and add your Anthropic API key (get one at
   https://console.anthropic.com/):
   ```bash
   cp .env.local.example .env.local
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 — the app loads pre-filled with a sample CV so
   you can see every feature immediately.

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
    rag/knowledge.ts          # local knowledge base
    rag/retrieve.ts           # TF-IDF + cosine similarity retrieval
```

## Notes

- No database — CV state lives in React state for this demo (see
  `src/lib/cvContext.tsx`). Swap in a real DB + auth to persist CVs per user.
- PDF export uses the browser's native print-to-PDF via a hidden `#printArea`
  and `@media print` styles in `globals.css`.
- The RAG knowledge base is intentionally tiny and in-memory so the whole
  pipeline (tokenize → TF-IDF vectorize → cosine similarity → top-k) is easy
  to read in `src/lib/rag/retrieve.ts`. Swap in a vector DB for production.
