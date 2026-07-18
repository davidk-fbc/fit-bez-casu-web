import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CommunityCta } from "@/components/CommunityCta";
import { BlogArticleCard } from "@/components/blog/BlogArticleCard";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { DarkSectionGlow } from "@/components/DarkSectionGlow";
import { UsersIcon } from "@/components/icons";
import {
  formatArticleDate,
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/blog/articles";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Článek nenalezen | Fit bez času" };
  }

  return {
    title: `${article.title} | Fit bez času`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Fit bez času`,
      description: article.excerpt,
      locale: "cs_CZ",
      type: "article",
    },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--color-dark)]">
          <DarkSectionGlow />
          <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-24">
            <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              {article.category}
            </span>
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
      </main>
      <Footer />
    </>
  );
}
