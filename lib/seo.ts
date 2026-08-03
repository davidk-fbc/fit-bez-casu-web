// Central source of truth for the public content site's final URL - used
// for metadataBase, canonical/Open Graph URLs, sitemap.xml and robots.txt.
// No trailing slash. Not to be confused with lib/links.ts (external
// product/app URLs, e.g. platforma.fitbezcasu.cz) - this is the SEO domain
// for this content site only.
export const SITE_URL = "https://web.fitbezcasu.cz";

// The brand/site name and root description, as they actually appear in
// app/layout.tsx's <title>/<meta name="description">. Extracted here so
// lib/structured-data.ts's homepage WebPage schema can reuse the exact same
// strings instead of re-typing them (they must always match what's
// literally rendered - never invent separate marketing copy for schema.org).
export const SITE_NAME = "Fit bez času";
export const SITE_DESCRIPTION = "Pomáháme ženám cítit se lépe ve svém těle, i když mají plný diář.";

// Default Open Graph / Twitter image for any page that has no image of its
// own (e.g. a blog article without a featured/social image). Dimensions
// match the actual file at public/og-fit-bez-casu.png - keep in sync if that
// file is ever replaced. Relative `url` resolves against `metadataBase`
// (set to SITE_URL in app/layout.tsx) to the absolute production URL.
export const DEFAULT_OG_IMAGE = {
  url: "/og-fit-bez-casu.png",
  width: 1200,
  height: 630,
  alt: "Fit bez času – jídelníček, cvičení a komunita pro zaneprázdněné ženy",
};
