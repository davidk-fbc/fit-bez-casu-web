import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ArrowRightIcon } from "../icons";
import { ArticleImage } from "../blog/ArticleImage";
import { getArticleBySlug, type BlogArticle } from "@/lib/blog/articles";

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

// getArticleBySlug ultimately reaches lib/blog/articles.ts's request(), whose
// fetch() uses cache: "no-store" - that's deliberate there (it also backs
// /blog, categories and articles, which already force fully dynamic
// rendering of their own). Left untouched, that no-store would make this
// homepage section - and therefore the whole homepage, since it has no other
// dynamic API of its own - dynamically render on every request too.
// Wrapping just this homepage-only lookup in unstable_cache caches its
// result independently of the inner fetch's own cache mode, so the homepage
// can be statically generated with its own 3600s revalidation window
// (matches app/page.tsx's `export const revalidate = 3600`) while
// /blog/[identifier] keeps calling getArticleBySlug directly, unaffected.
const getHomepageArticles = unstable_cache(
  async (): Promise<BlogArticle[]> => {
    const articles = await Promise.all(HOMEPAGE_ARTICLE_SLUGS.map((slug) => getArticleBySlug(slug)));
    return articles
      .filter((article): article is BlogArticle => Boolean(article))
      // unstable_cache serializes its return value to persist it. BlogArticle's
      // relatedArticles can hold mutual back-references between articles (A's
      // related list includes B, whose own related list includes A back),
      // which JSON.stringify cannot represent. This section never reads
      // relatedArticles, so it's dropped here only - the shared data layer
      // and every other caller keep the full, unmodified shape.
      .map((article) => ({ ...article, relatedArticles: [] }));
  },
  ["homepage-latest-articles"],
  { revalidate: 3600 }
);

export async function LatestArticles() {
  const articles = await getHomepageArticles();

  return (
    <section id="blog" className="relative overflow-hidden bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -right-32 -top-16 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.07] blur-3xl" />
      <Container className="relative flex flex-col gap-12">
        <SectionHeading
          eyebrow="Z blogu"
          title="Vybrali jsme pro tebe"
          description="Praktické tipy pro pohyb, jídlo a zdravější návyky v běžném životě."
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
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition hover:shadow-[var(--shadow-card-hover)]">
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden">
        <ArticleImage article={article} className="h-full w-full" iconClassName="h-9 w-9" sizes="(max-width: 640px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          {article.categoryName}
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
