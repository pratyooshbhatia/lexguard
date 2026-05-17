import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:pt-20">
      <header className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-600">
          {APP_NAME}
        </p>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {APP_TAGLINE}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-ink-muted sm:text-lg">
          Upload a contract, terms of service, lease, or policy. LexGuard
          highlights the risky clauses and explains them in plain English — so
          you know what you're agreeing to.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/analyze">Analyze a document</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/onboarding">How it works</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          LexGuard is an awareness tool, not a substitute for legal advice.
        </p>
      </header>

      <section
        aria-label="What LexGuard checks"
        className="mt-16 grid gap-4 sm:grid-cols-3"
      >
        {[
          { t: "Hidden fees", d: "Auto-renewal, surprise charges, price hikes." },
          { t: "Lost rights", d: "Arbitration, class-action waivers, jurisdiction." },
          { t: "Your data", d: "What's collected, who it's shared with, for how long." }
        ].map((it) => (
          <article
            key={it.t}
            className="rounded-2xl border border-ink/5 bg-surface p-5 shadow-card"
          >
            <h2 className="text-sm font-semibold">{it.t}</h2>
            <p className="mt-2 text-sm text-ink-muted">{it.d}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
