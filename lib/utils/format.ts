import type { RiskSeverity } from "@/types/analysis";

export function severityToBand(score: number): RiskSeverity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function severityLabel(s: RiskSeverity): string {
  return { low: "Low risk", medium: "Medium risk", high: "High risk", critical: "Critical risk" }[s];
}

/**
 * Badge token — used on inline <Badge severity> chips.
 * Standard Tailwind color names so purge picks them up reliably.
 */
export function severityToken(s: RiskSeverity): string {
  return {
    low:      "bg-green-50  text-green-800  border-green-200",
    medium:   "bg-amber-50  text-amber-800  border-amber-200",
    high:     "bg-orange-50 text-orange-800 border-orange-200",
    critical: "bg-red-50    text-red-800    border-red-200"
  }[s];
}

/**
 * Card-level severity styling — accent border + very light bg for the top band.
 */
export function severityCardAccent(s: RiskSeverity): {
  border: string;
  banner: string;
  bannerText: string;
  dot: string;
} {
  return {
    low:      { border: "border-green-200",  banner: "bg-green-50",  bannerText: "text-green-800",  dot: "bg-green-500"  },
    medium:   { border: "border-amber-200",  banner: "bg-amber-50",  bannerText: "text-amber-800",  dot: "bg-amber-500"  },
    high:     { border: "border-orange-200", banner: "bg-orange-50", bannerText: "text-orange-800", dot: "bg-orange-500" },
    critical: { border: "border-red-200",    banner: "bg-red-50",    bannerText: "text-red-800",    dot: "bg-red-500"    }
  }[s];
}

export function categoryLabel(c: string): string {
  return c
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
