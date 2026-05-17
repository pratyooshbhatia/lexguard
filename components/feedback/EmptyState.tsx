import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-12 text-center",
        className
      )}
    >
      {icon ? <p className="mb-4 text-4xl" aria-hidden>{icon}</p> : null}
      <h2 className="font-display text-base font-semibold text-slate-800">{title}</h2>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
