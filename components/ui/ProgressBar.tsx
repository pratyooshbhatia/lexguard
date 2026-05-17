import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  label,
  className
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <div className="mb-1 flex justify-between text-xs text-ink-muted">
          <span>{label}</span>
          <span aria-hidden>{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2 w-full overflow-hidden rounded-full bg-ink/5"
      >
        <div
          className="h-full bg-brand-500 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
