import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";
import { PlaceholderImage } from "./PlaceholderImage";

type ArticleCardProps = {
  tag: string;
  title: string;
  excerpt: string;
  href: string;
  imageIcon?: ReactNode;
};

export function ArticleCard({ tag, title, excerpt, href, imageIcon }: ArticleCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative">
        <PlaceholderImage
          label="Foto k článku"
          icon={imageIcon}
          className="aspect-[4/3] w-full rounded-none"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-semibold leading-snug text-[var(--color-text)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{excerpt}</p>
        <a
          href={href}
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
        >
          Přečíst článek
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
