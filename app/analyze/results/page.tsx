"use client";

import Link from "next/link";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { EmptyState } from "@/components/feedback/EmptyState";
import { RiskScoreDial } from "@/components/analysis/RiskScoreDial";
import { RiskCardStack } from "@/components/analysis/RiskCardStack";
import { Button } from "@/components/ui/Button";

export default function ResultsPage() {
  const { result, reset } = useAnalysisStore();

  if (!result) {
    return (
      <main id="main" className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Nothing to show yet"
          description="Upload a document first and we'll show your results here."
          action={
            <Button asChild>
              <Link href="/analyze">Analyze a document</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{result.documentTitle}</h1>
          <p className="mt-1 text-sm text-ink-muted">{result.summary}</p>
        </div>
        <RiskScoreDial score={result.overallRiskScore} band={result.overallRiskBand} />
      </header>

      <section aria-label="Why this score" className="mt-8 rounded-2xl bg-surface p-5 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Why this score
        </h2>
        <p className="mt-2 text-pretty text-sm leading-relaxed">{result.reasoning}</p>
      </section>

      <section aria-label="Risky clauses" className="mt-8">
        <h2 className="font-display text-xl font-semibold">Risky clauses</h2>
        <p className="text-sm text-ink-muted">Swipe or tap through. {result.clauses.length} found.</p>
        <div className="mt-4">
          <RiskCardStack clauses={result.clauses} />
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <Button variant="ghost" onClick={reset} asChild>
          <Link href="/analyze">Analyze another document</Link>
        </Button>
      </div>
    </main>
  );
}
