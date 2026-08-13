const SITE_URL = (process.env.BLOG_SEO_BASE_URL ?? "https://web.fitbezcasu.cz").replace(/\/$/u, "");
const SUPABASE_URL = process.env.BLOG_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.BLOG_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const requestedSlugs = new Set((process.env.BLOG_SEO_SLUGS ?? "").split(",").map((value) => value.trim()).filter(Boolean));

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing public blog Supabase environment variables.");
}

const failures = [];
const warnings = [];
const checkedUrls = new Map();

function check(condition, scope, message) {
  if (!condition) failures.push(`${scope}: ${message}`);
}

function decode(value = "") {
  return value
    .replace(/&quot;/gu, '"')
    .replace(/&#x27;|&#39;/gu, "'")
    .replace(/&amp;/gu, "&")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">");
}

function textContent(value = "") {
  return decode(value.replace(/<[^>]+>/gu, "").replace(/\s+/gu, " ").trim());
}

function visibleText(value = "") {
  return textContent(value.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/giu, " "));
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/gu)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? match[3] ?? "")]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "giu"))].map((match) => attributes(match[0]));
}

function meta(html, key) {
  const entry = tags(html, "meta").find((item) => item.name === key || item.property === key);
  return entry?.content ?? "";
}

async function fetchText(url) {
  const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20_000) });
  const body = await response.text();
  return { response, body };
}

async function supabase(path) {
  const response = await fetch(`${SUPABASE_URL.replace(/\/$/u, "")}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Public blog query failed with HTTP ${response.status}.`);
  return response.json();
}

async function allRows(query) {
  const rows = [];
  for (let offset = 0; ; offset += 1000) {
    const page = await supabase(`${query}&limit=1000&offset=${offset}`);
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

const articles = await allRows("blog_articles?select=id,title,slug,seo_title,seo_description,canonical_url,indexing_enabled,published_at,updated_at&status=eq.published&indexing_enabled=eq.true&order=slug.asc");
const selected = requestedSlugs.size ? articles.filter((article) => requestedSlugs.has(article.slug)) : articles;
check(selected.length > 0, "dataset", "no published indexable articles were returned");
for (const slug of requestedSlugs) check(selected.some((article) => article.slug === slug), "dataset", `requested slug not found: ${slug}`);

const duplicate = (key) => {
  const counts = new Map();
  for (const article of articles) {
    const value = article[key]?.trim().toLocaleLowerCase("cs");
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
};
check(duplicate("slug").length === 0, "dataset", "duplicate published slugs");
check(duplicate("seo_title").length === 0, "dataset", "duplicate SEO titles");
check(duplicate("seo_description").length === 0, "dataset", "duplicate SEO descriptions");

const sitemapResult = await fetchText(`${SITE_URL}/sitemap.xml`);
check(sitemapResult.response.ok, "sitemap", `HTTP ${sitemapResult.response.status}`);
const sitemapLocations = new Set([...sitemapResult.body.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => decode(match[1])));

const pages = await Promise.all(selected.map(async (article) => {
  const url = `${SITE_URL}/blog/${article.slug}`;
  const result = await fetchText(url);
  return { article, url, ...result };
}));

for (const { article, url, response, body } of pages) {
  const scope = article.slug;
  check(response.status === 200, scope, `expected HTTP 200, received ${response.status}`);
  check(sitemapLocations.has(url), scope, "missing from sitemap.xml");

  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/giu)].map((match) => textContent(match[1]));
  check(h1.length === 1, scope, `expected exactly one H1, found ${h1.length}`);
  check(h1[0] === article.title, scope, "H1 does not match the CMS title");

  const title = textContent(body.match(/<title>([\s\S]*?)<\/title>/iu)?.[1]);
  const description = meta(body, "description");
  const expectedTitle = `${article.seo_title} | Fit bez času`;
  check(title === expectedTitle, scope, "document title does not match CMS SEO title");
  check(description === article.seo_description, scope, "meta description does not match CMS SEO description");
  check(Boolean(article.seo_title?.trim()), scope, "empty SEO title");
  check(Boolean(article.seo_description?.trim()), scope, "empty SEO description");
  check(!article.seo_title.endsWith("| Fit bez času"), scope, "SEO title duplicates the global brand suffix");
  if (title.length > 65) warnings.push(`${scope}: browser title is ${title.length} characters`);
  if (description.length < 120 || description.length > 160) warnings.push(`${scope}: meta description is ${description.length} characters`);

  const canonical = tags(body, "link").find((item) => item.rel === "canonical")?.href ?? "";
  const expectedCanonical = article.canonical_url || url;
  check(canonical === expectedCanonical, scope, "canonical URL is not the expected URL");
  const robots = meta(body, "robots").toLowerCase();
  check(robots.includes("index") && robots.includes("follow") && !robots.includes("noindex"), scope, "robots metadata is not index, follow");

  check(meta(body, "og:title") === article.seo_title, scope, "Open Graph title mismatch");
  check(meta(body, "og:description") === article.seo_description, scope, "Open Graph description mismatch");
  check(meta(body, "og:url") === expectedCanonical, scope, "Open Graph URL mismatch");
  check(Boolean(meta(body, "og:image")), scope, "Open Graph image missing");
  check(meta(body, "twitter:card") === "summary_large_image", scope, "Twitter card mismatch");
  check(meta(body, "twitter:title") === article.seo_title, scope, "Twitter title mismatch");
  check(meta(body, "twitter:description") === article.seo_description, scope, "Twitter description mismatch");
  check(Boolean(meta(body, "twitter:image")), scope, "Twitter image missing");

  const schemas = [];
  for (const match of body.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)) {
    try {
      const parsed = JSON.parse(match[1]);
      schemas.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      failures.push(`${scope}: invalid JSON-LD`);
    }
  }
  const posting = schemas.find((schema) => schema?.["@type"] === "BlogPosting");
  check(Boolean(posting), scope, "BlogPosting structured data missing");
  if (posting) {
    check(posting.headline === article.title, scope, "BlogPosting headline mismatch");
    check(posting.description === article.seo_description, scope, "BlogPosting description mismatch");
    check(posting.url === expectedCanonical, scope, "BlogPosting URL mismatch");
    check(Boolean(posting.datePublished && posting.dateModified), scope, "BlogPosting dates missing");
    check(Boolean(posting.author && posting.publisher && posting.image), scope, "BlogPosting author, publisher or image missing");
  }

  const headings = [...body.matchAll(/<h([1-6])\b[^>]*>/giu)].map((match) => Number(match[1]));
  for (let index = 1; index < headings.length; index += 1) {
    check(headings[index] <= headings[index - 1] + 1, scope, `heading level jumps from H${headings[index - 1]} to H${headings[index]}`);
  }
  check(!/\b(?:TODO|PLACEHOLDER)\b|Lorem ipsum/iu.test(visibleText(body)), scope, "placeholder text found in rendered page");

  for (const anchor of tags(body, "a")) {
    if (!anchor.href || anchor.href.startsWith("#") || /^(mailto|tel):/u.test(anchor.href)) continue;
    let destination;
    try { destination = new URL(anchor.href, SITE_URL); } catch { continue; }
    if (destination.origin !== new URL(SITE_URL).origin) continue;
    destination.hash = "";
    checkedUrls.set(destination.href, null);
  }
}

async function validateInternal(url) {
  try {
    const { response } = await fetchText(url);
    checkedUrls.set(url, response.status);
    check(response.status >= 200 && response.status < 400, "internal links", `${url} returned HTTP ${response.status}`);
  } catch (error) {
    failures.push(`internal links: ${url} failed: ${error.message}`);
  }
}

const internalUrls = [...checkedUrls.keys()];
for (let index = 0; index < internalUrls.length; index += 6) {
  await Promise.all(internalUrls.slice(index, index + 6).map(validateInternal));
}

if (warnings.length) console.warn(`SEO warnings (${warnings.length}):\n${warnings.map((warning) => `- ${warning}`).join("\n")}`);
if (failures.length) {
  console.error(`SEO validation failed (${failures.length}):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ articles: selected.length, sitemapEntries: sitemapLocations.size, internalUrls: internalUrls.length, warnings: warnings.length, status: "passed" }));
}
