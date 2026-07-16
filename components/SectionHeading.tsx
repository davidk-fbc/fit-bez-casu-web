type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const titleColor = tone === "light" ? "text-[var(--color-text)]" : "text-white";
  const descColor = tone === "light" ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-on-dark-muted)]";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`max-w-xl text-base leading-relaxed ${descColor}`}>{description}</p>
      )}
    </div>
  );
}
