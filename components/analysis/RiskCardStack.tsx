"use client";

import { useState } from "react";
import { RiskCard } from "./RiskCard";
import { Button } from "@/components/ui/Button";
import { useSwipe } from "@/hooks/useSwipe";
import type { RiskClause } from "@/types/analysis";

/**
 * Swipeable card stack with keyboard + button fallbacks. Cards are rendered
 * in DOM order so screen-reader users get the full list — swipe is an
 * affordance, not a gate.
 */
export function RiskCardStack({ clauses }: { clauses: RiskClause[] }) {
  const [index, setIndex] = useState(0);
  const total = clauses.length;

  const next = () => setIndex((i) => Math.min(i + 1, total - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const swipe = useSwipe({ onSwipeLeft: next, onSwipeRight: prev });

  if (total === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/10 p-6 text-center text-sm text-ink-muted">
        No high-risk clauses detected. Always read the document yourself before signing.
      </p>
    );
  }

  const current = clauses[index]!;

  return (
    <div
      {...swipe}
      role="region"
      aria-roledescription="carousel"
      aria-label="Risky clauses"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      className="focus:outline-none"
    >
      <div className="relative">
        <RiskCard clause={current} />
      </div>

      <nav
        aria-label="Carousel controls"
        className="mt-4 flex items-center justify-between"
      >
        <Button variant="ghost" size="sm" onClick={prev} disabled={index === 0}>
          ← Previous
        </Button>
        <p className="text-xs text-ink-muted" aria-live="polite">
          {index + 1} of {total}
        </p>
        <Button variant="ghost" size="sm" onClick={next} disabled={index === total - 1}>
          Next →
        </Button>
      </nav>
    </div>
  );
}
