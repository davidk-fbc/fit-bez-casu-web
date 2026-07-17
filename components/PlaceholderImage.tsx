import type { ReactNode } from "react";

type PlaceholderImageProps = {
  label: string;
  icon?: ReactNode;
  className?: string;
  tone?: "muted" | "brand-purple" | "brand-blue";
  fill?: boolean;
  showContent?: boolean;
};

const toneClasses: Record<NonNullable<PlaceholderImageProps["tone"]>, string> = {
  muted: "bg-[linear-gradient(135deg,#eceafb,#f7f7fb_45%,#e7e2fb)] text-[var(--color-text-muted)]",
  "brand-purple": "bg-[linear-gradient(135deg,#7c3aed,#4c1d95)] text-white/80",
  "brand-blue": "bg-[linear-gradient(135deg,#2f6ff2,#0d2f9e)] text-white/80",
};

/**
 * Dočasný lokální placeholder za reálnou fotografii.
 * Nahradit skutečným obrázkem (next/image) v okamžiku, kdy bude k dispozici.
 */
export function PlaceholderImage({
  label,
  icon,
  className = "",
  tone = "muted",
  fill = false,
  showContent = true,
}: PlaceholderImageProps) {
  return (
    <div
      role="img"
      aria-label={label}
      data-placeholder="true"
      className={`${fill ? "absolute inset-0" : "relative"} flex flex-col items-center justify-center gap-2 overflow-hidden ${toneClasses[tone]} ${className}`}
    >
      <div className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(135deg,currentColor_0,currentColor_1px,transparent_1px,transparent_12px)]" />
      {showContent && (
        <>
          {icon && <div className="relative h-8 w-8">{icon}</div>}
          <span className="relative px-4 text-center text-xs font-medium">{label}</span>
        </>
      )}
    </div>
  );
}
