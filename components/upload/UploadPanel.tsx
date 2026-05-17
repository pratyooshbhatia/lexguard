"use client";

import { useState } from "react";
import { Dropzone } from "./Dropzone";
import { PasteArea } from "./PasteArea";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { cn } from "@/lib/utils/cn";

type Tab = "upload" | "paste";

const STAGE_MESSAGES: Record<string, string> = {
  extracting: "Reading your document…",
  analyzing:  "Finding risky clauses…",
  finalizing: "Almost done…"
};

function AnalyzingOverlay({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50 px-6 py-10 text-center"
    >
      {/* Spinner */}
      <div
        aria-hidden
        className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600"
      />
      <div>
        <p className="font-medium text-brand-700">{message}</p>
        <p className="mt-1 text-sm text-brand-400">This usually takes 10–20 seconds</p>
      </div>
    </div>
  );
}

export function UploadPanel({ initialText }: { initialText?: string }) {
  const [tab, setTab] = useState<Tab>(initialText ? "paste" : "upload");
  const [text, setText] = useState(initialText ?? "");
  const [file, setFile] = useState<File | null>(null);
  const { submit } = useAnalysis();
  const { progress, error } = useAnalysisStore();

  const busy = !["idle", "error", "done"].includes(progress.stage);
  const canSubmit = tab === "upload" ? !!file : text.trim().length >= 20;

  if (busy) {
    const msg = STAGE_MESSAGES[progress.stage] ?? "Working…";
    return <AnalyzingOverlay message={msg} />;
  }

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div
        role="tablist"
        aria-label="Choose how to provide your document"
        className="inline-flex gap-1 rounded-xl bg-slate-100 p-1"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setTab("paste");
          if (e.key === "ArrowLeft") setTab("upload");
        }}
      >
        {(["upload", "paste"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="tab-panel"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              tab === t
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t === "upload" ? "Upload file" : "Paste text"}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div role="tabpanel" id="tab-panel" aria-labelledby={`tab-${tab}`}>
        {tab === "upload" ? (
          <Dropzone file={file} onFile={setFile} disabled={busy} />
        ) : (
          <PasteArea value={text} onChange={setText} disabled={busy} />
        )}
      </div>

      {/* Error */}
      {error ? <ErrorState error={error} /> : null}

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {tab === "upload" && file ? (
          <button
            onClick={() => setFile(null)}
            className="self-start text-sm text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline"
          >
            Remove file
          </button>
        ) : <span className="hidden sm:block" />}

        <Button
          size="lg"
          disabled={!canSubmit}
          className="w-full sm:w-auto"
          onClick={() => submit(tab === "upload" ? { file: file! } : { text })}
        >
          Analyze document
        </Button>
      </div>
    </div>
  );
}
