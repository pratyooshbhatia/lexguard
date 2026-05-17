"use client";

export function PasteArea({
  value,
  onChange,
  disabled
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const charCount = value.length;
  return (
    <div>
      <label htmlFor="paste-area" className="sr-only">
        Paste document text
      </label>
      <textarea
        id="paste-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste the contract or terms text here…"
        rows={12}
        className="w-full resize-y rounded-2xl border border-ink/10 bg-surface p-4 text-sm leading-relaxed shadow-card focus:border-brand-500 focus:outline-none"
      />
      <p className="mt-1 text-right text-xs text-ink-soft" aria-live="polite">
        {charCount.toLocaleString()} characters
      </p>
    </div>
  );
}
