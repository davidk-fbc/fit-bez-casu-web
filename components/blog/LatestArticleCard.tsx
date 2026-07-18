import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import { ArticleVisual } from "./ArticleVisual";
import { formatArticleDate, type BlogArticle } from "@/lib/blog/articles";

type LatestArticleCardProps = {
  article: BlogArticle;
};

// Dominantní karta pro sekci "Nejnovější články" — velký vizuál, čistý
// moderní vzhled, jemný border a stín, jednotná výška v mřížce.
export function LatestArticleCard({ article }: LatestArticleCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <ArticleVisual category={article.category} className="h-full w-full" iconClassName="h-12 w-12" />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <span className="w-fit text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {article.category}
        </span>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[var(--color-text)]">{article.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{article.excerpt}</p>
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime} min čtení</span>
        </div>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
        >
          Přečíst článek
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
