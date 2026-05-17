import { Badge } from "@/components/ui/Badge";
import { severityLabel } from "@/lib/utils/format";
import type { RiskSeverity } from "@/types/analysis";

const SEVERITY_STROKE: Record<RiskSeverity, string> = {
  low: "stroke-risk-low",
  medium: "stroke-risk-medium",
  high: "stroke-risk-high",
  critical: "stroke-risk-critical"
};

/**
 * SVG ring dial. Pure presentational — accessible label is composed from
 * score + band so screen readers announce the meaning, not just a number.
 */
export function RiskScoreDial({ score, band }: { score: number; band: RiskSeverity }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div
      role="img"
      aria-label={`Risk score ${score} of 100 — ${severityLabel(band)} risk.`}
      className="flex items-center gap-3"
    >
      <svg width={88} height={88} viewBox="0 0 88 88" aria-hidden>
        <circle
          cx="44"
          cy="44"
          r={radius}
          className="stroke-ink/10"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          className={SEVERITY_STROKE[band]}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          transform="rotate(-90 44 44)"
        />
        <text
          x="44"
          y="50"
          textAnchor="middle"
          className="fill-ink font-display text-xl font-semibold"
        >
          {score}
        </text>
      </svg>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">Risk score</p>
        <Badge severity={band} className="mt-1" />
      </div>
    </div>
  );
}
