import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllArticles, getAllCategories, getArticlesByCategory } from "@/lib/blog/articles";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getAllArticles(), getAllCategories()]);
  const categoryPages: MetadataRoute.Sitemap = await Promise.all(categories.map(async (category) => {
    const newest = (await getArticlesByCategory(category.slug))[0];
    return { url: `${SITE_URL}/blog/${category.slug}`, ...(newest ? { lastModified: new Date(newest.updatedAt) } : {}), changeFrequency: "weekly" as const, priority: 0.7 };
  }));
  const articlePages: MetadataRoute.Sitemap = articles.filter((article) => article.indexingEnabled).map((article) => ({ url: article.canonicalUrl ?? `${SITE_URL}/blog/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly", priority: 0.8 }));
  return [{ url: `${SITE_URL}/` }, { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 }, { url: `${SITE_URL}/o-nas` }, ...categoryPages, ...articlePages];
}
