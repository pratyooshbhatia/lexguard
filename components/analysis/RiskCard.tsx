import { categoryLabel, severityCardAccent, severityLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { RiskClause } from "@/types/analysis";

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {heading}
      </h4>
      {children}
    </section>
  );
}

export function RiskCard({ clause }: { clause: RiskClause }) {
  const accent = severityCardAccent(clause.severity);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-card",
        accent.border
      )}
    >
      {/* Severity banner */}
      <div className={cn("flex items-center gap-2.5 px-5 py-3", accent.banner)}>
        <span
          aria-hidden
          className={cn("h-2 w-2 flex-shrink-0 rounded-full", accent.dot)}
        />
        <span className={cn("text-sm font-semibold", accent.bannerText)}>
          {severityLabel(clause.severity)}
        </span>
        <span className="mx-1 text-slate-300" aria-hidden>·</span>
        <span className="text-sm text-slate-500">{categoryLabel(clause.clauseType)}</span>
      </div>

      {/* Card body */}
      <div className="space-y-5 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-slate-900">
          {clause.title}
        </h3>

        {/* Quoted excerpt */}
        <blockquote className="rounded-xl border-l-4 border-slate-200 bg-slate-50 px-4 py-3 text-sm italic leading-relaxed text-slate-600">
          "{clause.quotedExcerpt}"
        </blockquote>

        <Section heading="In plain English">
          <p className="text-sm leading-relaxed text-slate-700">{clause.plainEnglish}</p>
        </Section>

        <Section heading="Why this matters">
          <p className="text-sm leading-relaxed text-slate-700">{clause.whyItMatters}</p>
        </Section>

        <Section heading="What could happen">
          <ul className="space-y-1.5 text-sm text-slate-700" role="list">
            {clause.realWorldConsequences.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Section heading="Suggested next steps">
          <ul className="space-y-1.5 text-sm" role="list">
            {clause.suggestedActions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-600"
                >
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  );
}
