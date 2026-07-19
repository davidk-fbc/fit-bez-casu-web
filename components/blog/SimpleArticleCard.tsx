import Link from "next/link";
import { ArrowRightIcon } from "../icons";
import { ArticleVisual } from "./ArticleVisual";
import { formatArticleDate, getCategoryBySlug, type BlogArticle } from "@/lib/blog/articles";

type SimpleArticleCardProps = {
  article: BlogArticle;
};

// Lehčí karta pro sekci "Doporučené články" — jen malý barevný akcent
// místo velkého vizuálu, jemný border, bez výrazného stínu.
export function SimpleArticleCard({ article }: SimpleArticleCardProps) {
  const categoryName = getCategoryBySlug(article.categorySlug)?.name ?? article.categorySlug;

  return (
    <article className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6">
      <ArticleVisual categorySlug={article.categorySlug} className="h-10 w-10 rounded-full" iconClassName="h-4 w-4" />
      <span className="w-fit text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
        {categoryName}
      </span>
      <h3 className="text-base font-bold leading-snug text-[var(--color-text)]">
        <Link href={`/blog/${article.slug}`} className="hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span>{article.readingTime} min čtení</span>
      </div>
      <Link
        href={`/blog/${article.slug}`}
        className="mt-auto inline-flex w-fit items-center gap-1.5 pt-1 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
      >
        Přečíst článek
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </article>
  );
}
