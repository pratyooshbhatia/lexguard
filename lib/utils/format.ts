import type { RiskSeverity } from "@/types/analysis";

export function severityToBand(score: number): RiskSeverity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function severityLabel(s: RiskSeverity): string {
  return { low: "Low", medium: "Medium", high: "High", critical: "Critical" }[s];
}

export function severityToken(s: RiskSeverity): string {
  return {
    low: "text-risk-low border-risk-low/30 bg-risk-low/10",
    medium: "text-risk-medium border-risk-medium/30 bg-risk-medium/10",
    high: "text-risk-high border-risk-high/30 bg-risk-high/10",
    critical: "text-risk-critical border-risk-critical/40 bg-risk-critical/10"
  }[s];
}

export function categoryLabel(c: string): string {
  return c
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
