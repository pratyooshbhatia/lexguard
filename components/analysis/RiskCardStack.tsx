"use client";

import { useState } from "react";
import { RiskCard } from "./RiskCard";
import { Button } from "@/components/ui/Button";
import { useSwipe } from "@/hooks/useSwipe";
import { cn } from "@/lib/utils/cn";
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

      {/* Dot indicators (up to 10) */}
      {total <= 10 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
          {clauses.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-200 focus:outline-none",
                i === index ? "w-5 bg-brand-600" : "w-2 bg-slate-200 hover:bg-slate-300"
              )}
            />
          ))}
        </div>
      )}

      <nav
        aria-label="Carousel controls"
        className="mt-4 flex items-center justify-between"
      >
        <Button variant="ghost" size="sm" onClick={prev} disabled={index === 0}
          className="min-w-[5rem] touch-manipulation"
        >
          ← Prev
        </Button>
        <p className="text-xs text-ink-muted" aria-live="polite">
          {index + 1} of {total}
        </p>
        <Button variant="ghost" size="sm" onClick={next} disabled={index === total - 1}
          className="min-w-[5rem] touch-manipulation"
        >
          Next →
        </Button>
      </nav>
    </div>
  );
}
