import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link
          href="/analyze"
          className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          aria-label={`${APP_NAME} — go to home`}
        >
          <span
            aria-hidden
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white"
          >
            LG
          </span>
          {APP_NAME}
        </Link>
        <nav aria-label="Site navigation">
          <Link
            href="/about"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
