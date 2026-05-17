import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-shimmer rounded-lg bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 bg-[length:800px_100%]",
        className
      )}
      {...rest}
    />
  );
}
