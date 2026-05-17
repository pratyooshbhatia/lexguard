import { UploadPanel } from "@/components/upload/UploadPanel";

export const metadata = {
  title: "Analyze a document",
  description:
    "Upload a contract, terms of service, lease, or policy and get an instant plain-English risk breakdown."
};

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
          the risky parts and explains them in plain English — for free.
        </p>

        {/* Trust signals */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
          {["No account required", "Document never stored", "AI-powered analysis"].map((s) => (
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
    </main>
  );
}
