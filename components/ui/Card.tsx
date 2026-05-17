import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink/5 bg-surface p-5 shadow-card",
        className
      )}
      {...rest}
    />
  );
}
