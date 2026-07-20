import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { CategoryContent } from "@/components/blog/CategoryContent";
import {
  getAllArticles,
  getAllCategorySlugs,
  getArticleBySlug,
  getArticlesByCategory,
  getCategoryBySlug,
} from "@/lib/blog/articles";

type PageProps = {
  params: Promise<{ identifier: string }>;
};

// Jedna dynamická route pro dvě věci: kategorii (/blog/cviceni-a-pohyb) i
// detail článku (/blog/jak-si-vytvorit-navyk-cviceni). Next.js nepovolí dva
// sourozenecké dynamické segmenty s různým názvem parametru na stejné
// úrovni (app/blog/[slug] vs. app/blog/[categorySlug]), proto rozlišujeme
// podle obsahu identifier — nejdřív kategorie, pak článek. URL článků se
// tím nemění, jde jen o interní název složky/parametru.
export function generateStaticParams() {
  const categoryParams = getAllCategorySlugs().map((slug) => ({ identifier: slug }));
  const articleParams = getAllArticles().map((article) => ({ identifier: article.slug }));
  return [...categoryParams, ...articleParams];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;

  const category = getCategoryBySlug(identifier);
  if (category) {
    const canonicalPath = `/blog/${category.slug}`;
    return {
      title: `${category.name} | Blog Fit bez času`,
      description: category.description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title: `${category.name} | Blog Fit bez času`,
        description: category.description,
        url: canonicalPath,
        locale: "cs_CZ",
        type: "website",
      },
    };
  }

  const article = getArticleBySlug(identifier);
  if (article) {
    const title = `${article.seoTitle} | Fit bez času`;
    const canonicalPath = `/blog/${article.slug}`;
    return {
      title,
      description: article.seoDescription,
      keywords: article.seoKeywords,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description: article.seoDescription,
        url: canonicalPath,
        locale: "cs_CZ",
        type: "article",
      },
    };
  }

  return { title: "Stránka nenalezena | Fit bez času" };
}

export default async function BlogIdentifierPage({ params }: PageProps) {
  const { identifier } = await params;

  const category = getCategoryBySlug(identifier);
  if (category) {
    const articles = getArticlesByCategory(category.slug);
    return (
      <>
        <Header />
        <main className="flex-1">
          <CategoryContent category={category} articles={articles} />
        </main>
        <Footer />
      </>
    );
  }

  const article = getArticleBySlug(identifier);
  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <ArticleContent article={article} />
      </main>
      <Footer />
    </>
  );
}
