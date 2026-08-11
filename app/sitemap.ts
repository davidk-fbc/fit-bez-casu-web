import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllArticles, getAllCategories, getArticlesByCategory } from "@/lib/blog/articles";
import { getPublicPrivatePage } from "@/lib/private-pages";
import { SUPPORT_OFFER_INDEXABLE_SLUGS } from "@/lib/support-offer-seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, supportOffers] = await Promise.all([
    getAllArticles(),
    getAllCategories(),
    Promise.all(SUPPORT_OFFER_INDEXABLE_SLUGS.map((slug) => getPublicPrivatePage(slug))),
  ]);
  const categoryPages: MetadataRoute.Sitemap = await Promise.all(categories.map(async (category) => {
    const newest = (await getArticlesByCategory(category.slug))[0];
    return { url: `${SITE_URL}/blog/${category.slug}`, ...(newest ? { lastModified: new Date(newest.updatedAt) } : {}), changeFrequency: "weekly" as const, priority: 0.7 };
  }));
  const articlePages: MetadataRoute.Sitemap = articles.filter((article) => article.indexingEnabled).map((article) => ({ url: article.canonicalUrl ?? `${SITE_URL}/blog/${article.slug}`, lastModified: new Date(article.updatedAt), changeFrequency: "monthly", priority: 0.8 }));
  const supportOfferPages: MetadataRoute.Sitemap = supportOffers.flatMap((page, index) => page ? [{ url: `${SITE_URL}/${SUPPORT_OFFER_INDEXABLE_SLUGS[index]}`, lastModified: new Date(page.updatedAt) }] : []);
  return [{ url: `${SITE_URL}/` }, { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.8 }, { url: `${SITE_URL}/o-nas` }, { url: `${SITE_URL}/zdarma`, changeFrequency: "monthly", priority: 0.8 }, ...supportOfferPages, ...categoryPages, ...articlePages];
}
