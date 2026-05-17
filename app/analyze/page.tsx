import { UploadPanel } from "@/components/upload/UploadPanel";

export const metadata = {
  title: "Analyze a document",
  description:
    "Upload a contract, terms of service, lease, or policy and get an instant plain-English risk breakdown."
};

const HOW_IT_WORKS = [
  { step: "1", label: "Upload your document", detail: "PDF, DOCX, image, or paste text" },
  { step: "2", label: "AI reads the fine print", detail: "Gemini scans every clause" },
  { step: "3", label: "Get a plain-English report", detail: "Risks, severity, and next steps" },
];

export default function AnalyzePage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 pb-20 pt-10 sm:pt-14">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Understand before you sign.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-slate-500">
          Drop in a contract, terms of service, lease, or policy. LexGuard highlights
          the risky parts and explains them in plain English — powered by Gemini AI.
        </p>

        {/* Trust signals */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
          {["No account required", "Document never stored", "Free to use"].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span aria-hidden className="h-1 w-1 rounded-full bg-brand-400" />
              {s}
            </span>
          ))}
        </div>
      </div>

      <UploadPanel />

      {/* Supported formats */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Supports PDF, Word (.docx), PNG, JPG, and plain text · Max 10MB
      </p>

      {/* How it works */}
      <div className="mt-12">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          How it works
        </p>
        <ol className="grid gap-3 sm:grid-cols-3" role="list">
          {HOW_IT_WORKS.map(({ step, label, detail }) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-col sm:items-center sm:text-center"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600"
              >
                {step}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="mt-0.5 text-xs text-slate-400">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
