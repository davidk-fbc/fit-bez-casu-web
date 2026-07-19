import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import { ArticleVisual } from "./ArticleVisual";
import { formatArticleDate, getCategoryBySlug, type BlogArticle } from "@/lib/blog/articles";

type BlogArticleCardProps = {
  article: BlogArticle;
};

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  const categoryName = getCategoryBySlug(article.categorySlug)?.name ?? article.categorySlug;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative">
        <ArticleVisual categorySlug={article.categorySlug} className="aspect-[16/10] w-full" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime} min čtení</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[var(--color-text)]">{article.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{article.excerpt}</p>
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
