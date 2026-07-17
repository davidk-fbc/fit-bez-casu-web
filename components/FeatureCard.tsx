import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  href: string;
  linkLabel?: string;
};

export function FeatureCard({ icon, title, description, href, linkLabel = "Zjistit více" }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ background: "var(--gradient-brand-diagonal)" }}
      >
        <div className="h-6 w-6">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{description}</p>
      <a
        href={href}
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
      >
        {linkLabel}
        <ArrowRightIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
