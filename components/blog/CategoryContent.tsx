import Link from "next/link";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { CommunityCta } from "../CommunityCta";
import { DarkSectionGlow } from "../DarkSectionGlow";
import { EmailSignupPlaceholder } from "../EmailSignupPlaceholder";
import { LatestArticleCard } from "./LatestArticleCard";
import type { BlogArticle, BlogCategory } from "@/lib/blog/articles";

type CategoryContentProps = {
  category: BlogCategory;
  articles: BlogArticle[];
};

// Obsah stránky kategorie blogu: menší tmavý hero s breadcrumbem, přehled
// všech článků dané kategorie, blok pro budoucí e-mail a CTA do komunity.
export function CategoryContent({ category, articles }: CategoryContentProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-dark)]">
        <DarkSectionGlow />
        <Container className="relative flex flex-col items-center gap-5 py-16 text-center sm:py-20">
          <nav aria-label="Drobečková navigace" className="text-sm font-medium text-[var(--color-text-on-dark-muted)]">
            <Link href="/blog" className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Blog
            </Link>
            <span className="mx-2" aria-hidden="true">→</span>
            <span aria-current="page" className="text-white">
              {category.name}
            </span>
          </nav>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            Kategorie
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
            {category.description}
          </p>
        </Container>
      </section>

      <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Články"
            title={`Všechny články: ${category.name}`}
            description="Řazeno od nejnovějšího."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <LatestArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--color-surface)] py-[var(--space-section)]">
        <EmailSignupPlaceholder />
      </section>

      <section className="bg-[var(--color-surface)] pb-[var(--space-section)] pt-4 sm:pt-6">
        <CommunityCta
          title="Nechceš na změnu zůstávat sama?"
          description="Přidej se ke komunitě Fit bez času a získej podporu, motivaci a praktické tipy pro běžný život."
        />
      </section>
    </>
  );
}
