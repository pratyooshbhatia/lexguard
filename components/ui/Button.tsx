import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render as the child element (e.g. wrap a Next.js <Link>). */
  asChild?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 shadow-card",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5 focus-visible:ring-ink/20",
  danger:
    "bg-risk-high text-white hover:bg-risk-critical focus-visible:ring-risk-high"
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", asChild, children, ...rest },
  ref
) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  if (asChild && children && typeof children === "object" && "props" in children) {
    const child = children as ReactElement<{ className?: string }>;
    return (
      <child.type
        {...child.props}
        className={cn(classes, child.props.className)}
        ref={ref as never}
      />
    );
  }

  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});
