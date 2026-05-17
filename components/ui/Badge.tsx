import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { severityLabel, severityToken } from "@/lib/utils/format";
import type { RiskSeverity } from "@/types/analysis";

export function Badge({
  severity,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { severity?: RiskSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        severity
          ? severityToken(severity)
          : "border-ink/10 bg-ink/5 text-ink-muted",
        className
      )}
      {...rest}
    >
      {severity ? <span aria-hidden>●</span> : null}
      {children ?? (severity ? severityLabel(severity) : null)}
    </span>
  );
}
