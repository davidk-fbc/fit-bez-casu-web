// Central, reusable schema.org JSON-LD builders for this site. Every
// function here returns a plain object ready to pass to
// components/JsonLd.tsx - none of them render anything themselves, so they
// stay trivially unit-testable (see lib/structured-data.test.ts).
//
// Design: Organization and WebSite are meant to be rendered exactly once,
// globally, in app/layout.tsx. Every per-page schema below references them
// by @id (isPartOf/about/publisher) rather than re-declaring the full
// object - this is the standard JSON-LD/schema.org "node reference" pattern
// (the same one Google's own examples use for publisher/isPartOf across
// multiple <script> blocks on one page) and is what keeps Organization/
// WebSite from ever being duplicated across pages.
// Extensioned relative imports below are required so this file resolves
// under Node's native ESM loader too (lib/structured-data.test.ts runs it
// directly via `node --experimental-strip-types`, which - unlike Next.js's
// bundler - needs an explicit extension on every relative import in the
// graph). TS5097 is the same, already-accepted exception this project uses
// for its other Node-runtime test entry points (see lib/blog/articles.test.ts).
// @ts-expect-error TS5097
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "./seo.ts";
// Type-only imports with a .ts extension don't trigger TS5097 under
// "bundler" moduleResolution - no suppression needed here.
import type { BlogArticle } from "./blog/articles.ts";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// The only social profiles for the brand that are actually verified
// elsewhere in this repo (components/Footer.tsx's SOCIAL_LINKS, rendered
// site-wide). Kept as a separate literal list rather than importing from a
// component file, but must stay in sync with it - never add a profile here
// that isn't also linked from the real, visible footer.
const VERIFIED_SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=61569640431106",
  "https://www.instagram.com/fitbezcasu/",
  "https://www.youtube.com/@fitbezcasu",
  "https://www.tiktok.com/@fitbezcasu",
];

// The site's real, in-use brand mark (components/Logo.tsx renders this same
// file in the header and footer of every page) - 1024x1024 PNG, safe to use
// as Organization.logo. If this file is ever removed/renamed without a
// replacement, callers must stop passing a logo rather than guess another
// image's purpose.
const ORGANIZATION_LOGO_PATH = "/images/brand/logo-fbc.png";

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function isValidIsoDate(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(ORGANIZATION_LOGO_PATH),
    image: absoluteUrl(DEFAULT_OG_IMAGE.url),
    sameAs: VERIFIED_SOCIAL_PROFILES,
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "cs-CZ",
  };
}

export type BreadcrumbItem = { name: string; path: string };

function breadcrumbId(pagePath: string): string {
  return `${absoluteUrl(pagePath)}#breadcrumb`;
}

// Reusable across /o-nas, /blog, every category and every article - the
// only thing that ever changes between callers is the item list itself.
// `pagePath` is the page the breadcrumb belongs to (used only to derive a
// stable, page-scoped @id) - it does not have to be the last item's path,
// though in practice it always is.
export function getBreadcrumbListSchema(pagePath: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(pagePath),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// A reference to a breadcrumb rendered as its own separate script (via
// getBreadcrumbListSchema above) - used as the `breadcrumb` property value
// on WebPage/AboutPage/CollectionPage/BlogPosting so the full list is never
// duplicated on the same page.
function breadcrumbRef(pagePath: string) {
  return { "@id": breadcrumbId(pagePath) };
}

type PageSchemaType = "WebPage" | "AboutPage" | "CollectionPage";

type PageSchemaInput = {
  type: PageSchemaType;
  path: string;
  name: string;
  description: string;
  breadcrumbPath?: string;
  primaryImage?: boolean;
};

// Shared builder for the three "type of page" schemas requested for this
// site (WebPage for the homepage, AboutPage for /o-nas, CollectionPage for
// the blog index and each category) - they only ever differ in @type and
// two optional fields, so one function avoids three near-identical copies.
export function getPageSchema({ type, path, name, description, breadcrumbPath, primaryImage }: PageSchemaInput) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#${type.toLowerCase()}`,
    url,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "cs-CZ",
    ...(primaryImage
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: absoluteUrl(DEFAULT_OG_IMAGE.url),
            width: DEFAULT_OG_IMAGE.width,
            height: DEFAULT_OG_IMAGE.height,
          },
        }
      : {}),
    ...(breadcrumbPath ? { breadcrumb: breadcrumbRef(breadcrumbPath) } : {}),
  };
}

// Extends the site's existing BlogPosting (previously hand-written inline
// in app/blog/[identifier]/page.tsx) - same core fields, plus @id, url,
// isPartOf, inLanguage and a breadcrumb reference, and a real image on
// every article instead of omitting the field when there is no CMS-supplied
// one (see fallback below).
export function getBlogPostingSchema(article: BlogArticle, canonicalUrl: string, breadcrumbPath: string) {
  const image = article.socialImageUrl ?? absoluteUrl(DEFAULT_OG_IMAGE.url);

  // "Fit bez času" is the brand's own name, not a person - the one CMS
  // author record that uses it represents the brand publishing under its
  // own name, so it maps to the same global Organization. Any other author
  // name (e.g. a real named byline) is treated as a Person, with only the
  // display name it actually has - no invented bio, title or credentials.
  const author = article.author
    ? article.author.displayName === SITE_NAME
      ? { "@type": "Organization", "@id": ORGANIZATION_ID }
      : { "@type": "Person", name: article.author.displayName }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#blogposting`,
    mainEntityOfPage: canonicalUrl,
    headline: article.title,
    description: article.seoDescription,
    url: canonicalUrl,
    ...(isValidIsoDate(article.publishedAt) ? { datePublished: article.publishedAt } : {}),
    ...(isValidIsoDate(article.updatedAt) ? { dateModified: article.updatedAt } : {}),
    image: [image],
    ...(author ? { author } : {}),
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "cs-CZ",
    breadcrumb: breadcrumbRef(breadcrumbPath),
  };
}
