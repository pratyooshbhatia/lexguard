"use client";

import { useState } from "react";
import { Dropzone } from "./Dropzone";
import { PasteArea } from "./PasteArea";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState } from "@/components/feedback/ErrorState";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useAnalysisStore } from "@/lib/store/analysis-store";
import { cn } from "@/lib/utils/cn";

type Tab = "upload" | "paste";

export function UploadPanel({ initialText }: { initialText?: string }) {
  const [tab, setTab] = useState<Tab>(initialText ? "paste" : "upload");
  const [text, setText] = useState(initialText ?? "");
  const [file, setFile] = useState<File | null>(null);
  const { submit } = useAnalysis();
  const { progress, error } = useAnalysisStore();
  const busy = progress.stage !== "idle" && progress.stage !== "error" && progress.stage !== "done";

  const canSubmit = tab === "upload" ? !!file : text.trim().length >= 20;

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Choose how to provide your document"
        className="inline-flex rounded-full bg-ink/5 p-1"
      >
        {(["upload", "paste"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t ? "bg-surface text-ink shadow-card" : "text-ink-muted"
            )}
          >
            {t === "upload" ? "Upload file" : "Paste text"}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "upload" ? (
          <Dropzone file={file} onFile={setFile} disabled={busy} />
        ) : (
          <PasteArea value={text} onChange={setText} disabled={busy} />
        )}
      </div>

      {busy ? (
        <ProgressBar value={progress.percent} label={progress.message ?? "Working…"} />
      ) : null}

      {error && !busy ? <ErrorState error={error} /> : null}

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!canSubmit || busy}
          onClick={() => submit(tab === "upload" ? { file: file! } : { text })}
        >
          {busy ? "Analyzing…" : "Analyze document"}
        </Button>
      </div>
    </div>
  );
}
