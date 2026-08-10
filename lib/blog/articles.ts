import { cache } from "react";
// Extensioned relative import required so this file still resolves when
// lib/blog/articles.test.ts runs it directly via Node's native test runner
// (see the same pattern/rationale in lib/structured-data.ts).
// @ts-expect-error TS5097
import { SITE_NAME } from "../seo.ts";
// @ts-expect-error TS5097
import { FOUR_WEEK_SUPPORT_SLUG, PERSONAL_DIET_REVIEW_SLUG, SUPPORT_OFFER_SLUG } from "../support-offer-copy.ts";

export type CategorySlug = string;
export type ArticleCtaType = "challenge" | "meal-plan" | "community";
export type BlogCategory = { id: string; slug: string; name: string; description: string; longDescription: string | null; active: boolean; sortOrder: number };
export type BlogAuthor = { id: string; displayName: string; bio: string; avatarPath: string | null };
export type BlogBlock = { id: string; type: string; position: number; content: Record<string, unknown> };
export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
  categoryName: string;
  author: BlogAuthor | null;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featuredImageUrl: string | null;
  featuredImageAlt: string;
  featuredImageCaption: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string | null;
  socialImageUrl: string | null;
  indexingEnabled: boolean;
  recommended: boolean;
  content: BlogBlock[];
  relatedArticles: BlogArticle[];
};

export type ArticleClosingSections = { smallStep: string[]; reflection: string[]; eveningTask: string[]; finalQuote: string };

// long_description is optional in this type (not just nullable) because the
// column may not exist yet in a given environment - see the migration
// comment in supabase/migrations for why the categories query's `select=*`
// tolerates that safely instead of erroring.
type RawCategory = { id: string; slug: string; name: string; description: string; long_description?: string | null; active: boolean; sort_order: number };
type RawAuthor = { id: string; display_name: string; bio: string; avatar_path: string | null };
type RawArticle = { id: string; title: string; slug: string; excerpt: string | null; category_id: string | null; author_id: string | null; status: string; featured_image_path: string | null; featured_image_alt: string | null; featured_image_caption: string | null; seo_title: string | null; seo_description: string | null; social_image_path: string | null; canonical_url: string | null; indexing_enabled: boolean; recommended: boolean; published_at: string | null; scheduled_at: string | null; updated_at: string };
type RawBlock = { id: string; article_id: string; block_type: string; position: number; content: Record<string, unknown> };
type RawRelation = { article_id: string; related_article_id: string; position: number };
type Dataset = { categories: BlogCategory[]; articles: BlogArticle[] };

function env() {
  const url = process.env.BLOG_SUPABASE_URL;
  const key = process.env.BLOG_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Blog data source is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { url, key } = env();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) throw new Error("Published blog content could not be loaded.");
  return response.json() as Promise<T>;
}

// PostgREST caps any single response at a server-side row limit (1000 for
// this project) no matter how large the underlying table has grown, so a
// plain `request<T[]>(...)` silently truncates once a resource passes that
// many rows. Every array-shaped resource loadDataset() reads is fetched
// through this instead: it keeps requesting limit/offset pages, in the same
// order the caller asked for, until a page comes back shorter than
// PAGE_SIZE - which is what actually ends the loop, not a hardcoded total.
// A failing page rejects the whole call (the same as the old single
// request's failure mode) so a caller never silently receives a partial
// dataset for one page having failed after others already succeeded.
const PAGE_SIZE = 1000;

export async function requestAllPages<T>(path: string): Promise<T[]> {
  const separator = path.includes("?") ? "&" : "?";
  const rows: T[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const page = await request<T[]>(`${path}${separator}limit=${PAGE_SIZE}&offset=${offset}`);
    rows.push(...page);
    if (page.length < PAGE_SIZE) return rows;
  }
}

// Normalizes blog_categories.long_description into a single "has real
// content or not" shape: missing (pre-migration), null, empty string and
// whitespace-only all collapse to null so callers only ever need one check
// (`category.longDescription != null`) to decide whether to render the
// expanded section at all.
export function normalizeLongDescription(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// Splits plain-text category copy into paragraphs on blank lines. Not
// HTML/Markdown - never rendered with dangerouslySetInnerHTML. Blank lines
// from repeated newlines are dropped rather than producing empty
// paragraphs.
export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

// "Fit bez času" publishes under the brand's own name rather than a named
// person, so it is the one author with a real public profile: the /o-nas
// page. There is no dedicated per-author URL column in blog_authors (and
// none is added here for a single internal link) - the mapping is done
// purely by display name, which also means any other author name safely
// gets no profile link instead of an invented one.
export function getAuthorProfileUrl(author: BlogAuthor): string | null {
  return author.displayName === SITE_NAME ? "/o-nas" : null;
}

// The three support-offer routes are served by this same app but, unlike
// /blog/{slug}, don't follow one predictable shape - so rather than widen the
// regex below (which would also start accepting any as-yet-unverified path
// under /nabidka-podpory/...), only these specific, already-live routes are
// allow-listed by exact string match. Sourced from lib/support-offer-copy.ts
// so this list can never drift from the routes that actually exist.
const SAFE_INTERNAL_ARTICLE_URLS = new Set<string>([`/${SUPPORT_OFFER_SLUG}`, `/${PERSONAL_DIET_REVIEW_SLUG}`, `/${FOUR_WEEK_SUPPORT_SLUG}`]);

// `/blog/{slug}` article/category paths, plus the exact allow-listed
// support-offer routes above, are the only URLs ever considered safe here -
// no protocol, no protocol-relative `//`, no backslash, no control
// characters, nothing outside these exact allow-listed shapes. Anything else
// (an external URL, `javascript:`, `data:`, a malformed or unverified path)
// fails this check and the caller falls back to plain text instead of a link.
export function isSafeInternalArticleUrl(url: string): boolean {
  return /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url) || SAFE_INTERNAL_ARTICLE_URLS.has(url);
}

export type ParsedTextSegment = { type: "text"; value: string } | { type: "link"; label: string; href: string };

// Parses the one supported inline-link syntax allowed inside a paragraph
// block's plain-text `content.text`: `[anchor text](/blog/target-slug)`.
// This is intentionally not a general Markdown parser - it only recognizes
// this single bracket-paren shape, and only turns it into a `link` segment
// when both the label is non-empty and the href passes
// isSafeInternalArticleUrl. Anything else (no match, empty label, unsafe
// href, a malformed/unclosed tag) is preserved byte-for-byte as a `text`
// segment, so a broken or rejected link never disappears or gets mangled -
// it just renders as the original plain text.
export function parseInternalArticleLinks(value: string): ParsedTextSegment[] {
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const segments: ParsedTextSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    const [full, rawLabel, href] = match;
    if (match.index > lastIndex) segments.push({ type: "text", value: value.slice(lastIndex, match.index) });
    const label = rawLabel.trim();
    segments.push(label.length > 0 && isSafeInternalArticleUrl(href) ? { type: "link", label, href } : { type: "text", value: full });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < value.length) segments.push({ type: "text", value: value.slice(lastIndex) });
  return segments;
}

function publicImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  const { url } = env();
  return `${url}/storage/v1/object/public/blog-images/${encodeURI(path)}`;
}

function readingTime(blocks: RawBlock[]) {
  const ignored = new Set(["alt", "path", "url", "button_label", "new_window"]);
  function text(value: unknown, key = ""): string[] {
    if (ignored.has(key)) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value.flatMap((item) => text(item));
    if (value && typeof value === "object") return Object.entries(value).flatMap(([nestedKey, nested]) => text(nested, nestedKey));
    return [];
  }
  const words = blocks.flatMap((block) => text(block.content)).join(" ").trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapArticle(raw: RawArticle, categories: Map<string, BlogCategory>, authors: Map<string, BlogAuthor>, blocks: RawBlock[]): BlogArticle {
  const category = raw.category_id ? categories.get(raw.category_id) : undefined;
  const author = raw.author_id ? authors.get(raw.author_id) ?? null : null;
  const articleBlocks = blocks.filter((block) => block.article_id === raw.id).sort((a, b) => a.position - b.position);
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    categorySlug: category?.slug ?? "",
    categoryName: category?.name ?? "Blog",
    author,
    publishedAt: raw.published_at ?? raw.scheduled_at ?? raw.updated_at,
    updatedAt: raw.updated_at,
    readingTime: readingTime(articleBlocks),
    featuredImageUrl: publicImageUrl(raw.featured_image_path),
    featuredImageAlt: raw.featured_image_alt ?? "",
    featuredImageCaption: raw.featured_image_caption,
    seoTitle: raw.seo_title ?? raw.title,
    seoDescription: raw.seo_description ?? raw.excerpt ?? "",
    canonicalUrl: raw.canonical_url,
    socialImageUrl: publicImageUrl(raw.social_image_path ?? raw.featured_image_path),
    indexingEnabled: raw.indexing_enabled,
    recommended: raw.recommended,
    content: articleBlocks.map((block) => ({ id: block.id, type: block.block_type, position: block.position, content: block.content })),
    relatedArticles: [],
  };
}

const loadDataset = cache(async (): Promise<Dataset> => {
  const [rawCategories, rawAuthors, rawArticles, rawBlocks, rawRelations] = await Promise.all([
    requestAllPages<RawCategory>("blog_categories?select=*&order=sort_order.asc"),
    requestAllPages<RawAuthor>("blog_authors?select=*&order=display_name.asc"),
    requestAllPages<RawArticle>("blog_articles?select=*&order=published_at.desc.nullslast,scheduled_at.desc.nullslast,updated_at.desc"),
    requestAllPages<RawBlock>("blog_article_blocks?select=*&order=article_id.asc,position.asc"),
    requestAllPages<RawRelation>("blog_article_relations?select=*&order=article_id.asc,position.asc"),
  ]);
  const categories = rawCategories.map((item) => ({ id: item.id, slug: item.slug, name: item.name, description: item.description, longDescription: normalizeLongDescription(item.long_description), active: item.active, sortOrder: item.sort_order }));
  const categoryMap = new Map(categories.map((item) => [item.id, item]));
  const authorMap = new Map(rawAuthors.map((item) => [item.id, { id: item.id, displayName: item.display_name, bio: item.bio, avatarPath: item.avatar_path }]));
  const articles = rawArticles.map((item) => mapArticle(item, categoryMap, authorMap, rawBlocks));
  const articleMap = new Map(articles.map((item) => [item.id, item]));
  for (const article of articles) {
    const explicit = rawRelations.filter((relation) => relation.article_id === article.id).sort((a, b) => a.position - b.position).map((relation) => articleMap.get(relation.related_article_id)).filter((item): item is BlogArticle => Boolean(item));
    const fallback = articles.filter((item) => item.id !== article.id && item.categorySlug === article.categorySlug && !explicit.some((related) => related.id === item.id));
    const newest = articles.filter((item) => item.id !== article.id && !explicit.some((related) => related.id === item.id) && !fallback.some((related) => related.id === item.id));
    article.relatedArticles = [...explicit, ...fallback, ...newest].slice(0, 3);
  }
  return { categories, articles };
});

export async function getAllArticles() { return (await loadDataset()).articles; }
export async function getLatestArticles(limit: number) { return (await getAllArticles()).slice(0, limit); }
export async function getRecommendedArticles(limit: number) { return (await getAllArticles()).filter((item) => item.recommended).slice(0, limit); }
export async function getArticleBySlug(slug: string) { return (await getAllArticles()).find((item) => item.slug === slug); }
export async function getArticlesByCategory(slug: string) { return (await getAllArticles()).filter((item) => item.categorySlug === slug); }
export async function getAllCategories() { return (await loadDataset()).categories; }
export async function getAllCategorySlugs() { return (await getAllCategories()).map((item) => item.slug); }
export async function getCategoryBySlug(slug: string) { return (await getAllCategories()).find((item) => item.slug === slug); }
export function getRelatedArticles(article: BlogArticle, limit = 3) { return article.relatedArticles.slice(0, limit); }

export const getPreviewArticle = cache(async (token: string) => {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const payload = await request<{ article: RawArticle; category: RawCategory | null; author: RawAuthor | null; blocks: RawBlock[]; relations: Array<{ article: RawArticle; category: RawCategory | null; author: RawAuthor | null }> } | null>("rpc/get_blog_preview", { method: "POST", body: JSON.stringify({ p_token: token }) });
  if (!payload?.article) return null;
  const categories = new Map<string, BlogCategory>();
  if (payload.category) categories.set(payload.category.id, { id: payload.category.id, slug: payload.category.slug, name: payload.category.name, description: payload.category.description, longDescription: normalizeLongDescription(payload.category.long_description), active: payload.category.active, sortOrder: payload.category.sort_order });
  const authors = new Map<string, BlogAuthor>();
  if (payload.author) authors.set(payload.author.id, { id: payload.author.id, displayName: payload.author.display_name, bio: payload.author.bio, avatarPath: payload.author.avatar_path });
  const article = mapArticle(payload.article, categories, authors, payload.blocks ?? []);
  article.relatedArticles = (payload.relations ?? []).map((relation) => {
    const relatedCategories = new Map<string, BlogCategory>();
    if (relation.category) relatedCategories.set(relation.category.id, { id: relation.category.id, slug: relation.category.slug, name: relation.category.name, description: relation.category.description, longDescription: normalizeLongDescription(relation.category.long_description), active: relation.category.active, sortOrder: relation.category.sort_order });
    const relatedAuthors = new Map<string, BlogAuthor>();
    if (relation.author) relatedAuthors.set(relation.author.id, { id: relation.author.id, displayName: relation.author.display_name, bio: relation.author.bio, avatarPath: relation.author.avatar_path });
    return mapArticle(relation.article, relatedCategories, relatedAuthors, []);
  });
  return article;
});

export function formatArticleDate(value: string) { return new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Prague" }).format(new Date(value)); }
