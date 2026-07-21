import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CommunityCta } from "@/components/CommunityCta";
import { EmailSignupPlaceholder } from "@/components/EmailSignupPlaceholder";
import { BlogHero } from "@/components/sections/BlogHero";
import { CategoryBadges } from "@/components/blog/CategoryBadges";
import { LatestArticleCard } from "@/components/blog/LatestArticleCard";
import { SimpleArticleCard } from "@/components/blog/SimpleArticleCard";
import { getLatestArticles, getRecommendedArticles } from "@/lib/blog/articles";

export const metadata: Metadata = {
  title: "Blog | Fit bez času",
  description:
    "Praktické články o jídle, cvičení, motivaci a zdravějších návycích pro ženy, které mají plný diář.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Fit bez času",
    description:
      "Praktické články o jídle, cvičení, motivaci a zdravějších návycích pro ženy, které mají plný diář.",
    url: "/blog",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function BlogPage() {
  const latestArticles = getLatestArticles(3);
  const recommendedArticles = getRecommendedArticles(3);

  return (
    <>
      <Header />
      <main className="flex-1">
        <BlogHero />

        {/* Kategorie — skutečné odkazy na /blog/[categorySlug], viz report */}
        <section className="bg-[var(--color-surface)] py-16 sm:py-20">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              eyebrow="Kategorie"
              title="Vyber si téma, které tě právě zajímá"
              description="Pohyb, jídlo, motivace nebo zdravější návyky. Začni tam, kde teď potřebuješ nejvíc podpory."
              align="center"
              className="mx-auto items-center text-center"
            />
            <CategoryBadges />
          </Container>
        </section>

        {/* Nejnovější články — jednotná mřížka, dominantnější karty */}
        {latestArticles.length > 0 && (
          <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
            <Container className="flex flex-col gap-10">
              <SectionHeading
                eyebrow="Nově na blogu"
                title="Nejnovější články"
                description="Praktické tipy, které můžeš použít hned v běžném dni."
              />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article) => (
                  <LatestArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Připravený blok pro budoucí e-mailový formulář — zatím bez Brevo/MailerLite */}
        <section className="bg-[var(--color-surface)] py-[var(--space-section)]">
          <EmailSignupPlaceholder />
        </section>

        {/* Doporučené články — jednodušší, lehčí karty */}
        {recommendedArticles.length > 0 && (
          <section className="bg-[var(--color-surface)] pt-4 pb-12 sm:pb-16">
            <Container className="flex flex-col gap-10">
              <SectionHeading
                eyebrow="Tip na čtení"
                title="Doporučené články"
                description="Témata, která stojí za přečtení a mohou ti pomoct udělat další malý krok."
              />
              <div className="grid gap-6 lg:grid-cols-3">
                {recommendedArticles.map((article) => (
                  <SimpleArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </Container>
          </section>
        )}

        <section className="bg-[var(--color-surface)] pb-[var(--space-section)] pt-4 sm:pt-6">
          <CommunityCta
            title="Nechceš na změnu zůstávat sama?"
            description="Přidej se ke komunitě Fit bez času a získej podporu, motivaci a praktické tipy pro běžný život."
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
