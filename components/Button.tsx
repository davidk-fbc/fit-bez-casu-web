import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type Variant = "gradient" | "solid-blue" | "outline-dark" | "outline-light";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  gradient:
    "text-white shadow-[0_10px_30px_-12px_rgba(139,60,249,0.6)] hover:brightness-110",
  "solid-blue":
    "bg-[var(--color-accent-blue)] text-white hover:brightness-110",
  "outline-dark":
    "border border-[var(--color-border-dark)] text-white hover:bg-white/5",
  "outline-light":
    "border border-[var(--color-border-light)] text-[var(--color-text)] hover:bg-black/[0.03]",
};

export function Button({
  children,
  variant = "gradient",
  withArrow = true,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <a
      {...props}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${variantClasses[variant]} ${className}`}
      style={variant === "gradient" ? { background: "var(--gradient-brand)", ...style } : style}
    >
      {children}
      {withArrow && <ArrowRightIcon className="h-4 w-4" />}
    </a>
  );
}
