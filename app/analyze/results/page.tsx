"use client";

import Link from "next/link";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { RiskScoreDial } from "@/components/analysis/RiskScoreDial";
import { RiskCardStack } from "@/components/analysis/RiskCardStack";
import { Button } from "@/components/ui/Button";
import { categoryLabel } from "@/lib/utils/format";

export default function ResultsPage() {
  const { result, reset } = useAnalysisStore();

  if (!result) {
    return (
      <main id="main" className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-4xl" aria-hidden>📄</p>
        <h1 className="mt-4 font-display text-xl font-semibold text-slate-800">No analysis yet</h1>
        <p className="mt-2 text-slate-500">Upload a document to see results here.</p>
        <Button asChild className="mt-6">
          <Link href="/analyze">Analyze a document</Link>
        </Button>
      </main>
    );
  }

  const noRisks = result.clauses.length === 0;

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-20 pt-8 sm:pt-12">

      {/* Header row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">
            {categoryLabel(result.documentCategory)}
          </p>
          <h1 className="font-display text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl">
            {result.documentTitle}
          </h1>
          <p className="mt-2 text-base text-slate-500">{result.summary}</p>
        </div>
        <div className="flex-shrink-0">
          <RiskScoreDial score={result.overallRiskScore} band={result.overallRiskBand} />
        </div>
      </div>

      {/* Reasoning */}
      <section
        aria-label="AI reasoning"
        className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
      >
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Why this score
        </h2>
        <p className="text-sm leading-relaxed text-slate-700">{result.reasoning}</p>
      </section>

      {/* Clauses */}
      <section aria-label="Risky clauses found" className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {noRisks ? "No risky clauses found" : `${result.clauses.length} clause${result.clauses.length !== 1 ? "s" : ""} flagged`}
          </h2>
          {!noRisks && (
            <p className="text-sm text-slate-400">Swipe or use arrow keys</p>
          )}
        </div>

        {noRisks ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
            <p className="text-3xl" aria-hidden>✅</p>
            <p className="mt-3 font-medium text-green-800">Looks relatively clean</p>
            <p className="mt-1 text-sm text-green-600">
              No high-risk clauses detected. Always read the full document before signing.
            </p>
          </div>
        ) : (
          <RiskCardStack clauses={result.clauses} />
        )}
      </section>

      {/* Metadata + CTA */}
      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <Button asChild variant="ghost" onClick={reset}>
          <Link href="/analyze">← Analyze another document</Link>
        </Button>
        <p className="text-xs text-slate-400">
          Analyzed {result.metadata.wordCount.toLocaleString()} words in {(result.metadata.durationMs / 1000).toFixed(1)}s ·{" "}
          LexGuard is an awareness tool, not legal advice.
        </p>
      </div>
    </main>
  );
}
