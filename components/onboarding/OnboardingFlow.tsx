"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAnalysisStore } from "@/lib/store/analysis-store";

const SLIDES = [
  {
    title: "Contracts shouldn't surprise you.",
    body: "LexGuard reads the fine print so you can sign with confidence — or push back before you do."
  },
  {
    title: "Upload anything.",
    body: "PDF, Word docs, screenshots, or pasted text. We extract, summarize, and score the risk."
  },
  {
    title: "Plain-English risk cards.",
    body: "Every risky clause comes with a real-world consequence and a suggested next step. No legalese."
  },
  {
    title: "We're not your lawyer.",
    body: "LexGuard is a literacy tool. For binding decisions, talk to a real attorney."
  }
];

export function OnboardingFlow() {
  const [i, setI] = useState(0);
  const { completeOnboarding } = useAnalysisStore();
  const last = i === SLIDES.length - 1;
  const slide = SLIDES[i]!;

  return (
    <div>
      <div
        role="group"
        aria-roledescription="onboarding step"
        aria-label={`Step ${i + 1} of ${SLIDES.length}`}
        className="rounded-3xl bg-surface p-8 shadow-card"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-brand-600">
          Step {i + 1} / {SLIDES.length}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold">{slide.title}</h2>
        <p className="mt-3 text-pretty text-ink-muted">{slide.body}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setI((x) => Math.max(0, x - 1))}
          disabled={i === 0}
        >
          Back
        </Button>
        <div className="flex items-center gap-1.5" aria-hidden>
          {SLIDES.map((_, idx) => (
            <span
              key={idx}
              className={
                idx === i ? "h-2 w-6 rounded-full bg-brand-600" : "h-2 w-2 rounded-full bg-ink/15"
              }
            />
          ))}
        </div>
        {last ? (
          <Button asChild onClick={completeOnboarding}>
            <Link href="/analyze">Get started</Link>
          </Button>
        ) : (
          <Button onClick={() => setI((x) => x + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
}
