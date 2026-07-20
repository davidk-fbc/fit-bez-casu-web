import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllArticles, getAllCategorySlugs, getArticlesByCategory } from "@/lib/blog/articles";

// Generated from the current project data (BLOG_ARTICLES/BLOG_CATEGORIES),
// never hardcoded by hand - 3 static pages + one entry per category + one
// entry per article. lastModified is only set where a real date exists
// (article publishedAt, or the newest article in a category); the 3 static
// pages have no reliable "last changed" date, so they intentionally have no
// lastModified rather than a fake new Date() on every build.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/blog` },
    { url: `${SITE_URL}/o-nas` },
  ];

  const categoryPages: MetadataRoute.Sitemap = getAllCategorySlugs().map((slug) => {
    const newestInCategory = getArticlesByCategory(slug)[0];

    return {
      url: `${SITE_URL}/blog/${slug}`,
      ...(newestInCategory ? { lastModified: new Date(newestInCategory.publishedAt) } : {}),
    };
  });

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
