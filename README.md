# LexGuard

**Understand contracts before you sign.**

LexGuard is an AI-powered legal-awareness platform that reads contracts, terms of service, privacy policies, leases, and employment agreements — and surfaces the risky parts in plain English. Built for ordinary people, not lawyers.

> ⚠️ LexGuard is an awareness tool. It does not provide legal advice.

---

## Features

| | |
|---|---|
| 📄 **Multi-format upload** | PDF, DOCX, PNG/JPG screenshots, plain text, or paste |
| 🧠 **Gemini AI analysis** | Powered by Google Gemini 2.5 Flash with structured JSON output |
| 🃏 **Swipeable risk cards** | Each flagged clause explained with severity, plain English, consequences, and next steps |
| 🌡️ **Risk score** | Overall 0–100 score with Low / Medium / High / Critical band |
| 📲 **Installable PWA** | Standalone install + Android Share Target support |
| ♿ **WCAG AA accessible** | Semantic HTML, keyboard navigation, screen reader support, high-contrast colors |
| 🔒 **Privacy-first** | Documents never stored. API key server-side only. No tracking. |

---

## Tech stack

- **Framework** — Next.js 14 App Router
- **Language** — TypeScript (strict)
- **Styling** — Tailwind CSS
- **AI** — Google Gemini 2.5 Flash via `@google/generative-ai`
- **Validation** — Zod (runtime schema validation of AI output)
- **State** — Zustand
- **DOCX** — mammoth
- **Deployment** — Vercel

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/pratyooshbhatia/lexguard.git
cd lexguard

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Add your Gemini API key → https://aistudio.google.com/apikey
# GEMINI_API_KEY=your_key_here

# 4. Run
npm run dev
# → http://localhost:3000
```

---

## Deployment (Vercel)

```bash
# One-time setup
npm i -g vercel
vercel

# Set environment variable in Vercel dashboard:
# GEMINI_API_KEY = your_key_here
# GEMINI_MODEL   = gemini-2.5-flash   (optional override)
```

No other configuration needed. The project is Vercel-ready out of the box.

---

## Security

- `GEMINI_API_KEY` is a server-only env var — never sent to the browser
- All Gemini API calls happen in Next.js Route Handlers (Node runtime)
- Uploaded files validated with MIME allowlist **and** magic-byte checks server-side
- Documents processed in-memory per request — never stored
- Error responses never leak stack traces, file paths, or SDK internals
- Security headers set in `next.config.mjs`

---

## Architecture overview

```
Browser                          Server (Next.js Route Handlers)
──────                           ──────────────────────────────
File / pasted text
  │
  ▼ POST /api/analyze
  │                              extractText(buffer, mime)
  │                                ├─ PDF/image → Gemini multimodal
  │                                ├─ DOCX      → mammoth
  │                                └─ text      → TextDecoder
  │
  │                              analyzeDocument(text)
  │                                ├─ Gemini 2.5 Flash (JSON mode)
  │                                ├─ Zod re-validation
  │                                └─ AnalysisResult
  │
  ◄─ { ok: true, data: AnalysisResult }
  │
Zustand store → /analyze/results
```

---

## Project structure

```
app/              Next.js pages (App Router)
  analyze/        Upload page (primary experience)
  analyze/results Results + risk cards
  about/          AI-readable project overview
  api/            Route handlers (analyze, extract, health)
components/
  analysis/       RiskCard, RiskCardStack, RiskScoreDial
  upload/         Dropzone, PasteArea, UploadPanel
  ui/             Button, Badge, Card, Skeleton, ProgressBar
  feedback/       EmptyState, ErrorState
lib/
  gemini/         Client, prompts, schemas, analyze
  extractors/     PDF, DOCX, image, text
  store/          Zustand analysis store
  utils/          cn, errors, format, fileSecurity
types/            TypeScript interfaces
public/           manifest.webmanifest, sw.js, icons/
```

---

## Google technologies used

- **Google Gemini 2.5 Flash** — core AI model for legal risk analysis
- **Gemini multimodal** — PDF and image text extraction (no OCR dependency)
- **`@google/generative-ai` SDK** — official Node.js client
- **Gemini JSON mode** (`responseMimeType: "application/json"`) — structured output

---

## Accessibility highlights

- All pages use semantic HTML (`main`, `section`, `article`, `nav`, `blockquote`)
- Skip-to-main-content link on keyboard focus
- Severity colors pass WCAG AA contrast (`text-red-800` on `bg-red-50`, etc.)
- Risk dial has a sentence-level `aria-label` ("Risk score 72 of 100 — High risk")
- Carousel supports keyboard arrow keys + `aria-live` position announcements
- `prefers-reduced-motion` respected globally
