"use client";

import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { MAX_UPLOAD_BYTES, SUPPORTED_MIME_TYPES } from "@/lib/constants";

const ACCEPT = SUPPORTED_MIME_TYPES.join(",");
const MAX_MB = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);

export function Dropzone({
  file,
  onFile,
  disabled
}: {
  file: File | null;
  onFile: (f: File | null) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  function pick(f: File | undefined) {
    if (!f) return;
    if (f.size > MAX_UPLOAD_BYTES) {
      setHint(`That file is ${(f.size / 1024 / 1024).toFixed(1)}MB — please keep it under ${MAX_MB}MB.`);
      return;
    }
    if (!(SUPPORTED_MIME_TYPES as readonly string[]).includes(f.type)) {
      setHint("We support PDF, DOCX, PNG, JPG, and plain text files.");
      return;
    }
    setHint(null);
    onFile(f);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setHover(false);
    pick(e.dataTransfer.files?.[0]);
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
        <span
          aria-hidden
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-lg"
        >
          📄
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-green-800">{file.name}</p>
          <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB · ready to analyze</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="file-input"
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed bg-white px-6 py-12 text-center transition-colors",
          "hover:border-brand-400 hover:bg-brand-50",
          "focus-within:border-brand-500 focus-within:bg-brand-50",
          hover ? "border-brand-400 bg-brand-50" : "border-slate-200",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <span aria-hidden className="text-4xl">📂</span>
        <div>
          <p className="font-medium text-slate-700">
            Drop a document here, or{" "}
            <span className="text-brand-600 underline underline-offset-2">browse</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">PDF, DOCX, PNG, JPG · Max {MAX_MB}MB</p>
        </div>
        <input
          ref={inputRef}
          id="file-input"
          type="file"
          accept={ACCEPT}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => pick(e.target.files?.[0])}
        />
      </label>
      {hint ? (
        <p role="alert" className="mt-2 text-sm text-orange-700">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
