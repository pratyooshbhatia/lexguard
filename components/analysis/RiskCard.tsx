import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { categoryLabel } from "@/lib/utils/format";
import type { RiskClause } from "@/types/analysis";

export function RiskCard({ clause }: { clause: RiskClause }) {
  return (
    <Card className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            {categoryLabel(clause.clauseType)}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold">{clause.title}</h3>
        </div>
        <Badge severity={clause.severity} />
      </header>

      <blockquote className="rounded-xl border-l-4 border-ink/10 bg-surface-subtle p-3 text-sm italic text-ink-muted">
        “{clause.quotedExcerpt}”
      </blockquote>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          In plain English
        </h4>
        <p className="mt-1 text-sm leading-relaxed">{clause.plainEnglish}</p>
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Why this matters
        </h4>
        <p className="mt-1 text-sm leading-relaxed">{clause.whyItMatters}</p>
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          What could happen
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {clause.realWorldConsequences.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Suggested next steps
        </h4>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {clause.suggestedActions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </Card>
  );
}
