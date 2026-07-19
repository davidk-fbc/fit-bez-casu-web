import Link from "next/link";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { CommunityCta } from "../CommunityCta";
import { PlaceholderImage } from "../PlaceholderImage";
import { DarkSectionGlow } from "../DarkSectionGlow";
import { UsersIcon } from "../icons";
import { BlogArticleCard } from "./BlogArticleCard";
import {
  formatArticleDate,
  getCategoryBySlug,
  getRelatedArticles,
  type BlogArticle,
} from "@/lib/blog/articles";

type ArticleContentProps = {
  article: BlogArticle;
};

// Obsah detailu článku — beze změny oproti předchozí verzi kromě odkazu na
// kategorii (nyní vede na /blog/[categorySlug]).
export function ArticleContent({ article }: ArticleContentProps) {
  const category = getCategoryBySlug(article.categorySlug);
  const relatedArticles = getRelatedArticles(article, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-dark)]">
        <DarkSectionGlow />
        <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-24">
          <Link
            href={`/blog/${article.categorySlug}`}
            className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {category?.name ?? article.categorySlug}
          </Link>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-on-dark-muted)]">
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime} min čtení</span>
          </div>
        </Container>
      </section>

      <section className="bg-[var(--color-surface)] py-16 sm:py-20">
        <Container className="mx-auto flex max-w-3xl flex-col gap-10">
          <PlaceholderImage
            label="Hlavní foto k článku"
            className="aspect-[16/9] w-full rounded-[var(--radius-card)] shadow-[var(--shadow-card)]"
          />

          <article className="flex flex-col gap-6">
            {article.content.map((block, index) =>
              block.type === "heading" ? (
                <h2
                  key={index}
                  className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-text)]"
                >
                  {block.text}
                </h2>
              ) : (
                <p key={index} className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                  {block.text}
                </p>
              ),
            )}
          </article>

          <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-6">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "var(--gradient-brand-diagonal)" }}
            >
              <UsersIcon className="h-5 w-5" />
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
              Sdílej článek, pokud může pomoct někomu dalšímu.
            </p>
          </div>
        </Container>
      </section>

      {relatedArticles.length > 0 && (
        <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
          <Container className="flex flex-col gap-12">
            <SectionHeading eyebrow="Čti dál" title="Související články" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <BlogArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-[var(--color-surface)] pb-[var(--space-section)]">
        <CommunityCta />
      </section>
    </>
  );
}
