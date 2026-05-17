"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import type { AnalyzeResponse } from "@/types/api";

/**
 * Thin client hook that owns the analyze-request lifecycle. Components stay
 * presentational; this hook owns store updates + navigation on success.
 */
export function useAnalysis() {
  const router = useRouter();
  const { setProgress, setResult, setError, reset } = useAnalysisStore();

  const submit = useCallback(
    async (input: { file?: File; text?: string }) => {
      reset();
      try {
        setProgress({ stage: "extracting", percent: 15, message: "Reading document…" });

        let res: Response;
        if (input.file) {
          const fd = new FormData();
          fd.append("file", input.file);
          res = await fetch("/api/analyze", { method: "POST", body: fd });
        } else {
          res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ text: input.text ?? "" })
          });
        }

        setProgress({ stage: "analyzing", percent: 70, message: "Checking for risky clauses…" });

        const json = (await res.json()) as AnalyzeResponse;
        if (!json.ok) {
          setError(json.error);
          return { ok: false as const, error: json.error };
        }

        setProgress({ stage: "finalizing", percent: 95, message: "Almost done…" });
        setResult(json.data);
        router.push("/analyze/results");
        return { ok: true as const, data: json.data };
      } catch (err) {
        const error = {
          code: "UNKNOWN" as const,
          message: err instanceof Error ? err.message : "Network error."
        };
        setError(error);
        return { ok: false as const, error };
      }
    },
    [reset, router, setError, setProgress, setResult]
  );

  return { submit };
}
