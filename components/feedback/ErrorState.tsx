import type { ReactNode } from "react";
import type { AnalysisError } from "@/types/analysis";

export function ErrorState({ error, action }: { error: AnalysisError; action?: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-risk-high/20 bg-risk-high/5 p-6 text-center"
    >
      <h2 className="font-display text-base font-semibold text-risk-high">
        We hit a problem
      </h2>
      <p className="mt-2 text-sm text-ink-muted">{error.message}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
