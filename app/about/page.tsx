import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LexGuard",
  description:
    "LexGuard is an AI-powered legal risk analysis platform built with Next.js, Gemini, and a focus on accessibility, privacy, and plain-English explainability."
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <h2
        id={`${id}-heading`}
        className="mb-4 font-display text-xl font-semibold text-slate-900"
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
      {children}
    </span>
  );
}

function FeatureGrid({ items }: { items: { icon: string; label: string; detail: string }[] }) {
  return (
    <ul className="mt-2 grid gap-3 sm:grid-cols-2" role="list">
      {items.map((it) => (
        <li
          key={it.label}
          className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4"
        >
          <span aria-hidden className="mt-0.5 text-xl">{it.icon}</span>
          <div>
            <p className="font-medium text-slate-800">{it.label}</p>
            <p className="mt-0.5 text-xs text-slate-500">{it.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:pt-14">

      {/* Page header */}
      <header className="mb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
          LexGuard
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Understand contracts before you sign.
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-500">
          LexGuard is an AI-powered legal-awareness platform that reads contracts,
          policies, and agreements — and explains the risky parts in plain English.
          It is not a law firm. It is a transparency tool built for ordinary people.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Next.js 14", "Gemini 2.5 Flash", "TypeScript", "PWA", "WCAG AA"].map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </header>

      <div className="space-y-12">

        {/* Problem statement */}
        <Section id="problem" title="Problem statement">
          <p>
            Legal documents — from rental agreements to app Terms of Service — are
            intentionally dense. Most people click "I agree" without understanding what
            they are consenting to. Buried clauses can waive jury rights, enable automatic
            price increases, or grant companies unlimited data-sharing rights.
          </p>
          <p>
            Access to a lawyer costs hundreds of dollars per hour. LexGuard closes this
            gap by giving everyone the same plain-English clarity that legal professionals
            take for granted.
          </p>
        </Section>

        {/* AI architecture */}
        <Section id="ai" title="AI integration (Google Gemini)">
          <p>
            LexGuard uses <strong>Google Gemini 2.5 Flash</strong> via the official
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-700">
              @google/generative-ai
            </code>
            SDK. All model calls happen <strong>exclusively server-side</strong> in
            Next.js Route Handlers — the API key is never sent to the browser.
          </p>
          <p>
            The analysis pipeline uses a structured system prompt that instructs the
            model to return machine-readable JSON covering: document category, overall
            risk score (0–100), a plain-English summary, and up to 20 individual
            risk clauses. Each clause includes a verbatim quoted excerpt, plain-English
            explanation, real-world consequences, and suggested next steps.
          </p>
          <p>
            Gemini's output is independently re-validated with <strong>Zod schemas</strong>
            at runtime — if the model returns an unexpected shape, the request fails
            gracefully with a user-safe message rather than leaking internal errors.
          </p>
          <FeatureGrid items={[
            { icon: "🧠", label: "Explainable reasoning",  detail: "Every risk score includes a plain-English explanation of how it was calculated." },
            { icon: "📋", label: "Structured extraction",  detail: "Clauses are tagged by type: arbitration, auto-renewal, data sharing, IP assignment, and 9 others." },
            { icon: "🌡️", label: "Severity scoring",       detail: "Each clause is rated Low / Medium / High / Critical with WCAG-contrast-safe visual indicators." },
            { icon: "🔁", label: "Multimodal input",       detail: "PDFs and images are sent directly to Gemini Vision — no separate OCR dependency required." }
          ]} />
        </Section>

        {/* Document processing */}
        <Section id="uploads" title="Upload support and file processing">
          <p>
            Users can analyze documents via four paths: drag-and-drop file upload,
            file-picker selection, text paste, or Android Share Target (share a document
            from another app directly into LexGuard).
          </p>
          <p>
            Supported formats: <strong>PDF</strong>, <strong>DOCX</strong>,{" "}
            <strong>PNG / JPG / WebP</strong> images (useful for screenshots of
            terms-of-service pages), and plain text. Maximum file size: 10MB.
          </p>
          <p>
            All files are validated with both a MIME-type allowlist and
            <strong> server-side magic-byte checks</strong> — a client can't
            spoof a JavaScript file as a PDF. Documents are processed in-request
            and never written to disk or stored in a database.
          </p>
        </Section>

        {/* Security */}
        <Section id="security" title="Security and privacy">
          <FeatureGrid items={[
            { icon: "🔑", label: "API key never exposed",    detail: "GEMINI_API_KEY lives only in server environment variables. No NEXT_PUBLIC_ prefix." },
            { icon: "🚫", label: "No document storage",      detail: "Files are processed in-memory per request. Nothing is written to disk or a database." },
            { icon: "🛡️", label: "Magic-byte validation",    detail: "Server verifies file signatures (PDF, DOCX, PNG, JPEG, WebP) regardless of claimed MIME type." },
            { icon: "🔇", label: "No stack trace leaks",     detail: "All error paths return safe user-facing messages. Raw SDK errors are never forwarded." },
            { icon: "📦", label: "Minimal dependencies",     detail: "No analytics, no tracking, no third-party scripts injected client-side." },
            { icon: "🔒", label: "Secure headers",           detail: "X-Content-Type-Options, Referrer-Policy, and Permissions-Policy set in next.config.mjs." }
          ]} />
        </Section>

        {/* Accessibility */}
        <Section id="accessibility" title="Accessibility (WCAG AA)">
          <p>
            Accessibility is a first-class concern, not an afterthought:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>Semantic HTML throughout — <code className="rounded bg-slate-100 px-1 text-xs font-mono">main</code>, <code className="rounded bg-slate-100 px-1 text-xs font-mono">section</code>, <code className="rounded bg-slate-100 px-1 text-xs font-mono">nav</code>, <code className="rounded bg-slate-100 px-1 text-xs font-mono">article</code>, <code className="rounded bg-slate-100 px-1 text-xs font-mono">blockquote</code>.</li>
            <li>Skip-to-main-content link visible on keyboard focus.</li>
            <li>All form inputs have visible or <code className="rounded bg-slate-100 px-1 text-xs font-mono">sr-only</code> labels.</li>
            <li>Risk severity colors use WCAG AA-compliant text/background pairs (e.g. <code className="rounded bg-slate-100 px-1 text-xs font-mono">text-red-800</code> on <code className="rounded bg-slate-100 px-1 text-xs font-mono">bg-red-50</code>).</li>
            <li>The risk score dial has a sentence-level <code className="rounded bg-slate-100 px-1 text-xs font-mono">aria-label</code> rather than just a number.</li>
            <li>The risk card carousel supports ← / → keyboard navigation and announces position via <code className="rounded bg-slate-100 px-1 text-xs font-mono">aria-live</code>.</li>
            <li><code className="rounded bg-slate-100 px-1 text-xs font-mono">prefers-reduced-motion</code> respected globally in CSS and via a React hook.</li>
            <li>Strong focus-visible rings on all interactive elements.</li>
          </ul>
        </Section>

        {/* PWA */}
        <Section id="pwa" title="Progressive Web App (PWA)">
          <p>
            LexGuard is installable as a standalone app on Android, iOS, and
            desktop via a standards-compliant Web App Manifest:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li><strong>display: standalone</strong> — no browser chrome after install.</li>
            <li><strong>start_url: /analyze</strong> — opens directly to the primary experience.</li>
            <li><strong>Android Share Target</strong> — users can share a PDF or web page from any app directly into LexGuard via the system share sheet.</li>
            <li><strong>File handler</strong> — manifest declares file-type associations for PDF, DOCX, images, and plain text.</li>
            <li>Service worker pre-caches the app shell for offline resilience.</li>
          </ul>
        </Section>

        {/* Performance */}
        <Section id="performance" title="Performance">
          <ul className="ml-5 list-disc space-y-1.5">
            <li>React Server Components by default — client JS sent only when interactivity requires it.</li>
            <li><code className="rounded bg-slate-100 px-1 text-xs font-mono">next/font</code> self-hosts Inter — no Google Fonts network round-trip.</li>
            <li>Tailwind CSS is purged at build time to the exact classes used.</li>
            <li>No client-side analytics or tracking scripts.</li>
            <li>Gemini calls are bounded to 60k characters input and 4096 tokens output — predictable latency.</li>
          </ul>
        </Section>

        {/* Tech stack */}
        <Section id="stack" title="Technology stack">
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700">Layer</th>
                  <th className="px-4 py-2.5 text-left font-semibold text-slate-700">Technology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  ["Framework",        "Next.js 14 (App Router)"],
                  ["Language",         "TypeScript (strict mode)"],
                  ["Styling",          "Tailwind CSS"],
                  ["AI model",         "Google Gemini 2.5 Flash"],
                  ["AI SDK",           "@google/generative-ai"],
                  ["Schema validation","Zod"],
                  ["State",            "Zustand with localStorage persistence"],
                  ["DOCX extraction",  "mammoth"],
                  ["PDF / image OCR",  "Gemini multimodal (no extra deps)"],
                  ["Deployment",       "Vercel (zero-config)"]
                ].map(([layer, tech]) => (
                  <tr key={layer}>
                    <td className="px-4 py-2.5 font-medium text-slate-700">{layer}</td>
                    <td className="px-4 py-2.5 text-slate-500">{tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Disclaimer */}
        <Section id="disclaimer" title="Legal disclaimer">
          <p>
            LexGuard is an educational awareness tool. It does not constitute legal
            advice and does not establish an attorney-client relationship. For any
            binding legal decision, consult a qualified attorney.
          </p>
        </Section>

      </div>
    </main>
  );
}
