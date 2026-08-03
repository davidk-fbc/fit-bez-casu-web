import assert from "node:assert/strict";
import test from "node:test";

// Node's built-in TypeScript test runner needs the explicit extension.
// @ts-expect-error TS5097 is intentionally limited to this Node-only test entry.
import { absoluteUrl, getBlogPostingSchema, getBreadcrumbListSchema, getOrganizationSchema, getPageSchema, getWebSiteSchema, ORGANIZATION_ID, WEBSITE_ID } from "./structured-data.ts";
// Type-only imports with a .ts extension don't trigger TS5097 under
// "bundler" moduleResolution - no suppression needed here.
import type { BlogArticle } from "./blog/articles.ts";

function assertNoUndefinedInJson(value: unknown) {
  assert.doesNotMatch(JSON.stringify(value), /undefined/);
}

function makeArticle(overrides: Partial<BlogArticle> = {}): BlogArticle {
  return {
    id: "article-id",
    title: "Jak začít cvičit, když nemáš čas",
    slug: "jak-zacit-cvicit-kdyz-nemas-cas",
    excerpt: "Krátký úvod do článku.",
    categorySlug: "cviceni-a-pohyb",
    categoryName: "Cvičení a pohyb",
    author: { id: "author-id", displayName: "Klárka a David", bio: "Tým Fit bez času.", avatarPath: null },
    publishedAt: "2026-05-09T10:00:00+00:00",
    updatedAt: "2026-07-29T10:46:16.085Z",
    readingTime: 4,
    featuredImageUrl: null,
    featuredImageAlt: "",
    featuredImageCaption: null,
    seoTitle: "Jak začít cvičit, když nemáš čas | Fit bez času",
    seoDescription: "Praktický návod, jak začít cvičit i s plným diářem.",
    canonicalUrl: null,
    socialImageUrl: null,
    indexingEnabled: true,
    recommended: false,
    content: [],
    relatedArticles: [],
    ...overrides,
  };
}

test("absoluteUrl resolves relative paths against SITE_URL and leaves absolute URLs untouched", () => {
  assert.equal(absoluteUrl("/og-fit-bez-casu.png"), "https://web.fitbezcasu.cz/og-fit-bez-casu.png");
  assert.equal(absoluteUrl("og-fit-bez-casu.png"), "https://web.fitbezcasu.cz/og-fit-bez-casu.png");
  assert.equal(absoluteUrl("https://example.com/image.png"), "https://example.com/image.png");
});

test("Organization schema has the required fields, a stable @id and no undefined values", () => {
  const schema = getOrganizationSchema();
  assert.equal(schema["@type"], "Organization");
  assert.equal(schema["@id"], "https://web.fitbezcasu.cz/#organization");
  assert.equal(schema.name, "Fit bez času");
  assert.equal(schema.url, "https://web.fitbezcasu.cz");
  assert.match(schema.logo, /^https:\/\/web\.fitbezcasu\.cz\//);
  assert.match(schema.image, /^https:\/\/web\.fitbezcasu\.cz\//);
  assert.ok(Array.isArray(schema.sameAs) && schema.sameAs.length > 0);
  for (const profile of schema.sameAs) assert.match(profile, /^https:\/\//);
  assertNoUndefinedInJson(schema);
});

test("WebSite schema references the Organization by @id and declares Czech language", () => {
  const schema = getWebSiteSchema();
  assert.equal(schema["@type"], "WebSite");
  assert.equal(schema["@id"], WEBSITE_ID);
  assert.deepEqual(schema.publisher, { "@id": ORGANIZATION_ID });
  assert.equal(schema.inLanguage, "cs-CZ");
  assertNoUndefinedInJson(schema);
});

test("BreadcrumbList produces sequential 1-indexed positions with absolute URLs and no empty names", () => {
  const schema = getBreadcrumbListSchema("/blog/cviceni-a-pohyb", [
    { name: "Domů", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Cvičení a pohyb", path: "/blog/cviceni-a-pohyb" },
  ]);
  assert.equal(schema["@type"], "BreadcrumbList");
  assert.equal(schema.itemListElement.length, 3);
  const positions = schema.itemListElement.map((item) => item.position);
  assert.deepEqual(positions, [1, 2, 3]);
  assert.equal(new Set(positions).size, positions.length);
  for (const item of schema.itemListElement) {
    assert.equal(item["@type"], "ListItem");
    assert.ok(item.name.length > 0);
    assert.match(item.item, /^https:\/\/web\.fitbezcasu\.cz/);
  }
  assertNoUndefinedInJson(schema);
});

test("getPageSchema omits breadcrumb and primaryImageOfPage when not requested", () => {
  const schema = getPageSchema({ type: "WebPage", path: "/", name: "Fit bez času", description: "Popis." });
  assert.equal(schema["@type"], "WebPage");
  assert.ok(!("breadcrumb" in schema));
  assert.ok(!("primaryImageOfPage" in schema));
  assertNoUndefinedInJson(schema);
});

test("getPageSchema includes a breadcrumb reference and primary image only when requested", () => {
  const schema = getPageSchema({
    type: "AboutPage",
    path: "/o-nas",
    name: "O nás | Fit bez času",
    description: "Popis.",
    breadcrumbPath: "/o-nas",
    primaryImage: true,
  });
  assert.equal(schema["@type"], "AboutPage");
  assert.deepEqual(schema.breadcrumb, { "@id": "https://web.fitbezcasu.cz/o-nas#breadcrumb" });
  assert.equal(schema.primaryImageOfPage?.["@type"], "ImageObject");
  assertNoUndefinedInJson(schema);
});

test("BlogPosting uses the article's own social image when present", () => {
  const article = makeArticle({ socialImageUrl: "https://usuhuricohbyqpnwtmkq.supabase.co/storage/v1/object/public/blog-images/foo.jpg" });
  const schema = getBlogPostingSchema(article, "https://web.fitbezcasu.cz/blog/jak-zacit-cvicit-kdyz-nemas-cas", "/blog/jak-zacit-cvicit-kdyz-nemas-cas");
  assert.deepEqual(schema.image, [article.socialImageUrl]);
  assertNoUndefinedInJson(schema);
});

test("BlogPosting falls back to the default OG image when the article has none of its own", () => {
  const article = makeArticle({ socialImageUrl: null });
  const schema = getBlogPostingSchema(article, "https://web.fitbezcasu.cz/blog/jak-zacit-cvicit-kdyz-nemas-cas", "/blog/jak-zacit-cvicit-kdyz-nemas-cas");
  assert.deepEqual(schema.image, ["https://web.fitbezcasu.cz/og-fit-bez-casu.png"]);
});

test("BlogPosting maps a named author to Person and the brand's own name to the global Organization", () => {
  const namedAuthor = getBlogPostingSchema(makeArticle({ author: { id: "a", displayName: "Klárka a David", bio: "", avatarPath: null } }), "https://web.fitbezcasu.cz/blog/x", "/blog/x");
  assert.deepEqual(namedAuthor.author, { "@type": "Person", name: "Klárka a David" });

  const brandAuthor = getBlogPostingSchema(makeArticle({ author: { id: "b", displayName: "Fit bez času", bio: "", avatarPath: null } }), "https://web.fitbezcasu.cz/blog/x", "/blog/x");
  assert.deepEqual(brandAuthor.author, { "@type": "Organization", "@id": ORGANIZATION_ID });
});

test("BlogPosting safely omits author entirely when the article has none - never invents one", () => {
  const schema = getBlogPostingSchema(makeArticle({ author: null }), "https://web.fitbezcasu.cz/blog/x", "/blog/x");
  assert.ok(!("author" in schema));
  assertNoUndefinedInJson(schema);
});

test("BlogPosting omits dateModified/datePublished when the underlying value is not a valid date, instead of emitting garbage", () => {
  const schema = getBlogPostingSchema(makeArticle({ updatedAt: "" }), "https://web.fitbezcasu.cz/blog/x", "/blog/x");
  assert.ok(!("dateModified" in schema));
  assert.ok("datePublished" in schema);
  assertNoUndefinedInJson(schema);
});

test("BlogPosting always references the global Organization/WebSite and includes a breadcrumb reference", () => {
  const schema = getBlogPostingSchema(makeArticle(), "https://web.fitbezcasu.cz/blog/jak-zacit-cvicit-kdyz-nemas-cas", "/blog/jak-zacit-cvicit-kdyz-nemas-cas");
  assert.deepEqual(schema.publisher, { "@id": ORGANIZATION_ID });
  assert.deepEqual(schema.isPartOf, { "@id": WEBSITE_ID });
  assert.deepEqual(schema.breadcrumb, { "@id": "https://web.fitbezcasu.cz/blog/jak-zacit-cvicit-kdyz-nemas-cas#breadcrumb" });
  assert.equal(schema.inLanguage, "cs-CZ");
  assert.equal(schema.mainEntityOfPage, "https://web.fitbezcasu.cz/blog/jak-zacit-cvicit-kdyz-nemas-cas");
  assertNoUndefinedInJson(schema);
});
