import type { ReactNode } from "react";
import type { AnalysisError } from "@/types/analysis";

export function ErrorState({ error, action }: { error: AnalysisError; action?: ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
    >
      <div className="flex items-start gap-3">
        <span aria-hidden className="mt-0.5 text-lg">⚠️</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">Something went wrong</p>
          <p className="mt-0.5 text-sm text-red-600">{error.message}</p>
        </div>
      </div>
      {action ? <div className="mt-3 flex justify-end">{action}</div> : null}
    </div>
  );
}
