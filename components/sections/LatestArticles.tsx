import Link from "next/link";
import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ArrowRightIcon } from "../icons";
import { ArticleVisual } from "../blog/ArticleVisual";
import { getArticleBySlug, getCategoryBySlug, type BlogArticle } from "@/lib/blog/articles";

// Pevný, ručně kontrolovaný výběr pro homepage - NENÍ automatický podle data
// ani náhodný (Math.random). Jeden článek z každé ze tří kategorií (pohyb /
// jídlo / energie a osobní rozvoj), v tomto přesném pořadí zleva doprava na
// desktopu i shora dolů na mobilu. Data (title, excerpt, kategorie, slug…)
// se vždy čtou z BLOG_ARTICLES přes getArticleBySlug - nic se zde neopisuje
// ručně.
const HOMEPAGE_ARTICLE_SLUGS = [
  "jak-zacit-cvicit-kdyz-nemas-cas",
  "co-jist-kdyz-nestiham",
  "jsem-porad-unavena",
] as const;

function getHomepageArticles(): BlogArticle[] {
  return HOMEPAGE_ARTICLE_SLUGS.map((slug) => {
    const article = getArticleBySlug(slug);

    if (!article) {
      throw new Error(`LatestArticles: článek se slugem "${slug}" nebyl nalezen v BLOG_ARTICLES.`);
    }

    return article;
  });
}

export function LatestArticles() {
  const articles = getHomepageArticles();

  return (
    <section id="blog" className="relative overflow-hidden bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -right-32 -top-16 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.07] blur-3xl" />
      <Container className="relative flex flex-col gap-12">
        <SectionHeading
          eyebrow="Z blogu"
          title="Vybrali jsme pro tebe"
          description="Praktické tipy k pohybu, jídlu a energii pro běžný den."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <CompactArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <Button href="/blog" variant="outline-light" withArrow={false} className="mx-auto px-7 py-3.5">
          Zobrazit další články
        </Button>
      </Container>
    </section>
  );
}

// Kompaktní karta jen pro homepage sekci "Vybrali jsme pro tebe" - nižší
// vizuál (16:9 místo dřívějšího 4:3) a menší padding než sdílené
// LatestArticleCard/SimpleArticleCard z /blog listingu, které zůstávají
// beze změny. Kategorie je jako štítek přes vizuál (stejná konvence jako
// dřívější maketa), takže textová část zůstává jen title + excerpt + odkaz.
function CompactArticleCard({ article }: { article: BlogArticle }) {
  const categoryName = getCategoryBySlug(article.categorySlug)?.name ?? article.categorySlug;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <ArticleVisual categorySlug={article.categorySlug} className="h-full w-full" iconClassName="h-9 w-9" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {categoryName}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[var(--color-text)]">{article.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">{article.excerpt}</p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 rounded-sm pt-2 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2"
        >
          Přečíst článek
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
