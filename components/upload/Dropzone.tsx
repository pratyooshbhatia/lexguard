"use client";

import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils/cn";
import { MAX_UPLOAD_BYTES, SUPPORTED_MIME_TYPES } from "@/lib/constants";

const ACCEPT = SUPPORTED_MIME_TYPES.join(",");

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
    if (!f) return onFile(null);
    if (f.size > MAX_UPLOAD_BYTES) {
      setHint("That file is larger than 10MB. Try a smaller one.");
      return;
    }
    if (!(SUPPORTED_MIME_TYPES as readonly string[]).includes(f.type)) {
      setHint(`We support PDF, DOCX, PNG, JPG, WebP, and plain text. Got ${f.type || "unknown"}.`);
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

  return (
    <div>
      <label
        htmlFor="file-input"
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface p-10 text-center transition-colors",
          "focus-within:border-brand-500",
          hover ? "border-brand-500 bg-brand-50" : "border-ink/15",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <p className="font-display text-lg font-semibold">
          {file ? file.name : "Drop a document or tap to choose"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          PDF, DOCX, screenshots, or plain text. Max 10MB.
        </p>
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
        <p role="alert" className="mt-2 text-sm text-risk-high">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
