import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { CategoryContent } from "@/components/blog/CategoryContent";
import { JsonLd } from "@/components/JsonLd";
import { getAllCategories, getArticleBySlug, getArticlesByCategory, getCategoryBySlug } from "@/lib/blog/articles";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { getBlogPostingSchema, getBreadcrumbListSchema, getPageSchema } from "@/lib/structured-data";

type PageProps = { params: Promise<{ identifier: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { identifier } = await params;
  const category = await getCategoryBySlug(identifier);
  if (category) {
    const canonicalPath = `/blog/${category.slug}`;
    return { title: `${category.name} | Blog Fit bez času`, description: category.description, alternates: { canonical: canonicalPath }, openGraph: { title: `${category.name} | Blog Fit bez času`, description: category.description, url: canonicalPath, locale: "cs_CZ", type: "website", images: [DEFAULT_OG_IMAGE] } };
  }
  const article = await getArticleBySlug(identifier);
  if (!article) notFound();
  const canonical = article.canonicalUrl ?? `${SITE_URL}/blog/${article.slug}`;
  const images = article.socialImageUrl ? [{ url: article.socialImageUrl, alt: article.featuredImageAlt }] : [DEFAULT_OG_IMAGE];
  return {
    title: `${article.seoTitle} | Fit bez času`, description: article.seoDescription,
    alternates: { canonical }, robots: article.indexingEnabled ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title: article.seoTitle, description: article.seoDescription, url: canonical, locale: "cs_CZ", type: "article", publishedTime: article.publishedAt, modifiedTime: article.updatedAt, authors: article.author ? [article.author.displayName] : undefined, images },
    twitter: { card: "summary_large_image", title: article.seoTitle, description: article.seoDescription, images },
  };
}

export default async function BlogIdentifierPage({ params }: PageProps) {
  const { identifier } = await params;
  const category = await getCategoryBySlug(identifier);
  if (category) {
    const [articles, categories] = await Promise.all([getArticlesByCategory(category.slug), getAllCategories()]);
    const categoryPath = `/blog/${category.slug}`;
    const categorySchema = getPageSchema({ type: "CollectionPage", path: categoryPath, name: category.name, description: category.description, breadcrumbPath: categoryPath });
    const categoryBreadcrumb = getBreadcrumbListSchema(categoryPath, [
      { name: "Domů", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: category.name, path: categoryPath },
    ]);
    return <><JsonLd data={categorySchema} /><JsonLd data={categoryBreadcrumb} /><Header /><main className="flex-1"><CategoryContent category={category} articles={articles} categories={categories} /></main><Footer /></>;
  }
  const article = await getArticleBySlug(identifier);
  if (!article) notFound();
  const canonical = article.canonicalUrl ?? `${SITE_URL}/blog/${article.slug}`;
  const articlePath = `/blog/${article.slug}`;
  const hasReliableCategory = article.categorySlug !== "" && article.categoryName !== "Blog";
  const articleBreadcrumbItems = hasReliableCategory
    ? [
        { name: "Domů", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: article.categoryName, path: `/blog/${article.categorySlug}` },
        { name: article.title, path: articlePath },
      ]
    : [
        { name: "Domů", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: article.title, path: articlePath },
      ];
  const articleSchema = getBlogPostingSchema(article, canonical, articlePath);
  const articleBreadcrumb = getBreadcrumbListSchema(articlePath, articleBreadcrumbItems);
  return <><JsonLd data={articleSchema} /><JsonLd data={articleBreadcrumb} /><Header /><main className="flex-1"><ArticleContent article={article} /></main><Footer /></>;
}
