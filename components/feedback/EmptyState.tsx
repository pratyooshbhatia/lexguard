import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/10 bg-surface p-10 text-center">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
