# LexGuard

> Understand contracts before you sign.

LexGuard is a plain-English legal-awareness assistant. Drop in a contract,
terms of service, lease, employment offer, or screenshot of a policy, and
LexGuard highlights the risky clauses, scores overall risk, and tells you
what could happen — and what to do about it.

**LexGuard is not a substitute for legal advice.** It's a literacy tool.

---

## 1. Architecture overview

```
┌───────────────────────────────────────────────────────────┐
│  Browser (Next.js client)                                 │
│  ─ App Router pages (RSC where possible)                  │
│  ─ Zustand store (UI state + 5-item local history)        │
│  ─ Service Worker (offline shell, share-target landing)   │
└───────────────────────────────────────────────────────────┘
                   │ fetch / FormData / JSON
                   ▼
┌───────────────────────────────────────────────────────────┐
│  Next.js Route Handlers (Node runtime)                    │
│  ─ POST /api/analyze   text or multipart                  │
│  ─ POST /api/extract   text-only extraction               │
│  ─ GET  /api/health    edge runtime                       │
└───────────────────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────────┐  ┌──────────────────────────────────┐
│ Extractors       │  │ Gemini analysis                  │
│ ─ pdf  (Gemini)  │  │ ─ system prompt sets voice +     │
│ ─ docx (mammoth) │  │   guardrails                     │
│ ─ image(Gemini)  │  │ ─ JSON schema enforces shape     │
│ ─ text (passthru)│  │ ─ Zod re-validates the output    │
└──────────────────┘  └──────────────────────────────────┘
```

**Key decisions, and why:**

| Decision | Rationale |
|---|---|
| Next.js 14 App Router | Server components default → smaller JS payload, better Lighthouse. |
| Gemini structured output (`responseSchema`) + Zod re-parse | Two-layer safety: model is constrained at generation time, app refuses invalid responses at runtime. |
| Gemini multimodal for PDFs and images | Skips heavy server-side OCR/PDF deps. One dependency does three formats. |
| Mammoth for `.docx` only | DOCX is a zip-of-XML — passing it to a multimodal model wastes tokens. Mammoth is small, fast, deterministic. |
| Zustand with `persist({ partialize })` | Tiny state lib, persists only onboarding flag + last 5 results — never the in-flight error or progress. |
| Hand-rolled service worker | Avoids `next-pwa`'s build-time complexity for a hackathon. ~40 LOC, network-first nav, never caches `/api/*`. |
| Tailwind + Radix primitives only when needed | No design-system dependency to fight. Radix only for accessible Dialog/Tabs when we add them. |

---

## 2. Folder structure

```
lexguard/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout, fonts, SW register, skip-link
│   ├── page.tsx                # Landing
│   ├── globals.css             # Tailwind + tokens + reduced-motion
│   ├── error.tsx               # Root error boundary
│   ├── loading.tsx             # Root suspense fallback
│   ├── not-found.tsx
│   ├── onboarding/page.tsx
│   ├── analyze/
│   │   ├── page.tsx            # Upload + paste
│   │   └── results/page.tsx    # Reads from Zustand store
│   ├── share/page.tsx          # Android share-target landing
│   ├── offline/page.tsx        # SW fallback
│   └── api/
│       ├── analyze/route.ts
│       ├── extract/route.ts
│       └── health/route.ts
├── components/
│   ├── ui/                     # Button, Card, Badge, Skeleton, ProgressBar
│   ├── layout/                 # (Header/Footer to add as needed)
│   ├── upload/                 # UploadPanel, Dropzone, PasteArea, ShareTargetHandoff
│   ├── analysis/               # RiskScoreDial, RiskCard, RiskCardStack
│   ├── onboarding/             # OnboardingFlow
│   ├── feedback/               # EmptyState, ErrorState
│   └── pwa/                    # ServiceWorkerRegister
├── hooks/                      # useAnalysis, useSwipe, useReducedMotion
├── lib/
│   ├── constants.ts            # App-wide limits + names
│   ├── gemini/                 # client, prompts, schemas, analyze
│   ├── extractors/             # pdf, docx, image, text router
│   ├── store/                  # Zustand
│   └── utils/                  # cn, errors, format
├── types/                      # analysis, document, api
└── public/
    ├── manifest.webmanifest    # PWA + share_target
    ├── sw.js                   # Service worker
    └── icons/                  # PNG icons (192, 512, maskable)
```

---

## 3. Component hierarchy

```
RootLayout
├─ ServiceWorkerRegister
├─ Home (/)              → Hero + 3-card feature grid
├─ Onboarding (/onboarding)
│   └─ OnboardingFlow    → 4 slides, dots, persists hasOnboarded
├─ Analyze (/analyze)
│   └─ UploadPanel       ← owns tab state, busy state, error display
│       ├─ Dropzone      ← drag/drop, accept whitelist, size cap
│       ├─ PasteArea     ← textarea + live char counter
│       ├─ ProgressBar
│       └─ ErrorState
├─ Results (/analyze/results)
│   ├─ RiskScoreDial     ← SVG ring with aria-label sentence
│   ├─ Reasoning card    ← contextual AI reasoning
│   └─ RiskCardStack
│       ├─ RiskCard      ← clause + plain-English + consequences + actions
│       └─ Carousel controls (Prev/Next + aria-live count)
└─ Share (/share)
    └─ ShareTargetHandoff → UploadPanel{ initialText }
```

---

## 4. State management

**Three layers, kept boring on purpose:**

1. **Server state** lives in route handlers. No client cache library — analysis is a single one-shot POST.
2. **UI / cross-route state** in Zustand (`lib/store/analysis-store.ts`). Stores `result`, `progress`, `error`, `history`, `hasOnboarded`. Only `hasOnboarded` and `history` are persisted to `localStorage`.
3. **Component state** with `useState`. Forms, tab toggles, swipe index.

The `useAnalysis` hook is the only thing that calls `/api/analyze` — components never `fetch` directly.

---

## 5. API route structure

| Route | Runtime | Purpose |
|---|---|---|
| `POST /api/analyze` | Node | Accepts `multipart/form-data` (file) **or** `application/json` (`{ text }`). Routes through extractor → Gemini analyzer → typed `AnalyzeResponse`. |
| `POST /api/extract` | Node | Text-only extraction. Optional preview step before analysis. |
| `GET  /api/health` | Edge | Liveness probe. |

All routes return `ApiResult<T> = { ok: true; data: T } | { ok: false; error: AnalysisError }`. Error codes map to status codes in `app/api/analyze/route.ts`.

---

## 6. Gemini integration

**Three files, separated by concern:**

- `lib/gemini/client.ts` — lazy singleton, model selection, generation defaults.
- `lib/gemini/prompts.ts` — system prompt (voice + guardrails) and user-prompt builder.
- `lib/gemini/schemas.ts` — Zod schema + the matching OpenAPI-style schema passed as `responseSchema`.
- `lib/gemini/analyze.ts` — orchestrator. Truncates long input, calls the model, validates output, augments with IDs + metadata.

**Why structured output AND Zod:** Gemini's `responseSchema` constrains generation but isn't a hard guarantee — fields can still come back missing or out of bounds. Re-parsing with Zod gives us a typed contract at the API boundary and a clean `INVALID_OUTPUT` error path.

**Multimodal usage:** PDFs and images go straight to Gemini as `inlineData` — see `lib/extractors/pdf.ts` and `image.ts`. Trades one extra model call for zero additional native deps.

---

## 7. PWA architecture

- **Manifest** at `public/manifest.webmanifest`. Declares `display: standalone`, three icon sizes (with one maskable), one shortcut, and a `share_target`.
- **Share target** uses `method: "GET"` with text/url/title query params. Android dispatches to `/share?text=…`, which mounts `ShareTargetHandoff` and pre-fills the paste pane. (For binary share-target — e.g. share a PDF *into* LexGuard — switch to `method: "POST"` and add an `/api/share` handler.)
- **Service worker** at `public/sw.js`. Hand-rolled, ~40 LOC. Registered only in production by `ServiceWorkerRegister`. Strategy: network-first navigations with `/offline` fallback, stale-while-revalidate for same-origin GETs, **never** caches `/api/*`.
- **Offline page** at `/offline`.

---

## 8. Upload processing pipeline

```
File / Text
   │
   ├─ Client validation (mime whitelist + 10MB cap)
   │
   ▼
POST /api/analyze
   │
   ├─ multipart? → extractText(buffer, mime)
   │     ├─ application/pdf  → Gemini multimodal
   │     ├─ image/*          → Gemini multimodal
   │     ├─ .docx            → mammoth.extractRawText
   │     └─ text/plain       → TextDecoder
   │
   ├─ json? → use req.body.text directly
   │
   ▼
analyzeDocument(text)
   │
   ├─ Truncate at MAX_ANALYSIS_CHARS (60k) + flag in prompt
   ├─ Gemini call with responseSchema + responseMimeType=application/json
   ├─ JSON.parse + Zod safeParse
   └─ Augment with UUIDs + metadata
   │
   ▼
AnalyzeResponse → client → Zustand → /analyze/results
```

---

## 9. Accessibility strategy

- Semantic HTML first: `<main>`, `<header>`, `<section aria-label>`, `<nav aria-label>`, `<blockquote>`, lists for enumerations.
- Skip-link in the root layout, visible on focus.
- Focus-visible ring stronger than Tailwind default (see `app/globals.css`).
- Color contrast: brand-600 on white passes AA; risk tokens checked at both bg/10 and full-strength uses.
- Risk dial has a sentence-level `aria-label` — "Risk score 72 of 100 — High risk." — so screen readers get the meaning, not just a number.
- Carousel exposes role/roledescription, supports `←/→` keys, and announces position via `aria-live="polite"`.
- `prefers-reduced-motion` honored globally in `globals.css` and via the `useReducedMotion` hook for animation-heavy pieces.
- All form inputs are labelled (visible or `sr-only`). Drop-zone is a `<label>` so it inherits free keyboard semantics.

---

## 10. Performance optimization strategy

- Default to React Server Components. Only mark `"use client"` when interactivity is required (upload form, store consumers, swipe stack).
- `next/font` self-hosts Inter — no FOUT, no Google fetch on first paint.
- Tailwind purges aggressively (only `app/`, `components/`, `hooks/`, `lib/` content paths).
- Extractor deps loaded lazily inside their modules (`mammoth` is a dynamic import) so the API route doesn't pay the cost when it's not used.
- Gemini `temperature: 0.2` and `maxOutputTokens: 4096` cap latency and cost per call.
- Document truncated at 60k chars with a model-side flag — bounded latency for huge ToS files.
- Service worker pre-caches the shell and serves stale-while-revalidate for static assets — second-visit TTI drops sharply.
- No client-side analytics dependency by default. Add later (Vercel Analytics is one line).

Target Lighthouse: **95+ Performance / 100 Accessibility / 100 Best Practices / 95+ SEO**.

---

## 11. Suggested npm packages

| Package | Why |
|---|---|
| `next` `react` `react-dom` | Framework. |
| `@google/generative-ai` | Official Gemini SDK. |
| `zod` | Runtime validation of model output + API inputs. |
| `zustand` | Tiny state, with persistence middleware. |
| `mammoth` | DOCX → plain text. Server-side only. |
| `clsx` + `tailwind-merge` | `cn` helper. |
| `framer-motion` | Slide / card transitions (optional — guard with reduced-motion). |
| `@radix-ui/react-dialog`, `react-tabs`, `react-tooltip` | Accessible primitives when needed. Tree-shaken. |
| `tailwindcss` `autoprefixer` `postcss` | Styling. |
| `typescript` + `@types/*` | TS. |
| `eslint` `eslint-config-next` | Linting. |
| `prettier` `prettier-plugin-tailwindcss` | Formatting + class sorting. |

*Deliberately omitted:* `pdf-parse`, `tesseract.js`, `react-query`, `next-pwa`, a UI library. Add only if a concrete need appears.

---

## 12. Data schemas / interfaces

The canonical TypeScript shapes live in [`types/`](types). The runtime
validators live in [`lib/gemini/schemas.ts`](lib/gemini/schemas.ts) and
**must stay in sync** with the types.

Key shapes:

- `DocumentCategory` — 10-value union covering the common consumer-doc surfaces.
- `RiskSeverity` — `low | medium | high | critical`. Drives color tokens.
- `ClauseType` — 13-value union of common predatory-clause patterns.
- `RiskClause` — title, severity, quoted excerpt, plain English, why-it-matters, consequences[], actions[], confidence.
- `AnalysisResult` — category + title + score (0–100) + band + summary + reasoning + clauses[] + metadata.
- `ApiResult<T>` — discriminated union used by every route.

---

## 13. Recommended development order

A pragmatic build sequence for the hackathon:

1. `pnpm install` (or `npm install`), set `GEMINI_API_KEY` in `.env.local`.
2. `pnpm dev` — confirm landing and `/analyze` render.
3. Make `POST /api/analyze` work end-to-end with **pasted text only**. Iterate on prompt + schema here.
4. Wire `/analyze/results` to the store. Tune `RiskCard` voice and copy with a real ToS.
5. Add `.docx` extractor — easiest server format.
6. Add image extractor (Gemini OCR). Test with a phone screenshot of a real ToS.
7. Add PDF extractor.
8. Polish onboarding + landing copy.
9. Drop in real icons, verify manifest + service worker register in production build.
10. Run Lighthouse + axe DevTools; fix anything below 95.
11. Deploy to Vercel; confirm `/share?text=…` works from an Android device.

---

## 14. Deployment strategy

- **Vercel.** Project root maps 1:1 to a Next.js app. Set `GEMINI_API_KEY` (Production + Preview). Optionally set `GEMINI_MODEL`, `LEXGUARD_MAX_UPLOAD_BYTES`, `NEXT_PUBLIC_SITE_URL`.
- Edge runtime is reserved for `/api/health`. Analysis routes need Node runtime (Gemini SDK + buffer handling).
- `maxDuration = 60` on `/api/analyze` to accommodate multimodal PDF calls.
- Headers (security + SW cache control) are configured in `next.config.mjs`.
- Preview deployments per PR — the service worker version constant should be bumped on any shell change.

---

## 15. Future extensibility

The boundaries that should hold up as the product grows:

- **More document types** → add a new extractor in `lib/extractors/`, register it in `extractText()`. No other code changes.
- **More clause categories** → extend the `clauseType` enum in both `types/analysis.ts` and `lib/gemini/schemas.ts`, then update the system prompt's examples.
- **User accounts + persistent history** → add a `userId` column-equivalent, swap the `history` slice in Zustand for a server-fetched list. The current shape already has a stable `id` per analysis.
- **Streaming analysis** → swap `generateContent` for `generateContentStream` in `analyze.ts`, switch the route to `ReadableStream`, and consume with `fetch().body.getReader()` in `useAnalysis`. The store already models a `progress` stage machine.
- **Localization** → all user-facing copy is in components; pull into a `messages/` directory and adopt `next-intl`.
- **Multi-doc comparison** → add a `compare` route handler that takes two analyses and asks Gemini for a diff; render side-by-side `RiskCard`s.
- **Audit trail / sharing** → add a Vercel KV-backed `/api/analyses/[id]` that stores results behind an unguessable slug.
- **A11y testing in CI** → add `@axe-core/playwright` once a Playwright suite exists.

---

## Running locally

```bash
cp .env.example .env.local         # add GEMINI_API_KEY
pnpm install                       # or npm/yarn
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
