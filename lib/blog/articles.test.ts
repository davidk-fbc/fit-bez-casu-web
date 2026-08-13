import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Node's built-in TypeScript test runner needs the explicit extension.
// @ts-expect-error TS5097 is intentionally limited to this Node-only test entry.
import { formatArticleDate, getAuthorProfileUrl, isSafeInternalArticleUrl, normalizeLongDescription, parseInternalArticleLinks, requestAllPages, splitIntoParagraphs } from "./articles.ts";

// requestAllPages() goes through request(), which reads these two env vars
// and calls the real global fetch. These tests replace global fetch with a
// stub for their duration and restore it afterwards, so no real network call
// is ever made; the env vars just need to be present so env() doesn't throw.
function withMockedFetch<T>(handler: (input: string) => { ok: boolean; json?: () => Promise<unknown> }, run: () => Promise<T>): Promise<T> {
  const realFetch = globalThis.fetch;
  const realUrl = process.env.BLOG_SUPABASE_URL;
  const realKey = process.env.BLOG_SUPABASE_PUBLISHABLE_KEY;
  process.env.BLOG_SUPABASE_URL = "https://example.test";
  process.env.BLOG_SUPABASE_PUBLISHABLE_KEY = "test-key";
  // @ts-expect-error test stub deliberately narrower than the full fetch signature
  globalThis.fetch = async (input: string) => handler(String(input));
  return run().finally(() => {
    globalThis.fetch = realFetch;
    if (realUrl === undefined) delete process.env.BLOG_SUPABASE_URL; else process.env.BLOG_SUPABASE_URL = realUrl;
    if (realKey === undefined) delete process.env.BLOG_SUPABASE_PUBLISHABLE_KEY; else process.env.BLOG_SUPABASE_PUBLISHABLE_KEY = realKey;
  });
}

function parseOffsetLimit(url: string) {
  const query = new URL(url).searchParams;
  return { offset: Number(query.get("offset")), limit: Number(query.get("limit")) };
}

test("formats article dates consistently in Czech", () => {
  assert.equal(formatArticleDate("2026-07-29T12:00:00Z"), "29. července 2026");
});

test("server data layer uses request-time fetching and no privileged key", async () => {
  const source = await readFile(new URL("./articles.ts", import.meta.url), "utf8");
  assert.match(source, /cache:\s*"no-store"/);
  assert.doesNotMatch(source, /service.?role/i);
  assert.match(source, /\^\[a-f0-9\]\{64\}\$/);
});

test("public renderer handles every supported CMS block without raw HTML", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  for (const type of ["paragraph", "heading", "highlight", "bullet_list", "numbered_list", "image", "tip_cards", "info_box", "cta", "divider"]) assert.ok(source.includes(`\"${type}\"`), `missing renderer for ${type}`);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});

test("normalizeLongDescription collapses missing, null, empty and whitespace-only values to null", () => {
  assert.equal(normalizeLongDescription(undefined), null);
  assert.equal(normalizeLongDescription(null), null);
  assert.equal(normalizeLongDescription(""), null);
  assert.equal(normalizeLongDescription("   \n  "), null);
});

test("normalizeLongDescription trims real content but otherwise preserves it", () => {
  assert.equal(normalizeLongDescription("  Skutečný text kategorie.  "), "Skutečný text kategorie.");
  assert.equal(normalizeLongDescription("Beze změny."), "Beze změny.");
});

test("splitIntoParagraphs splits stored plain text into exactly the paragraphs separated by blank lines", () => {
  const stored = "První odstavec.\n\nDruhý odstavec.\n\nTřetí odstavec.";
  assert.deepEqual(splitIntoParagraphs(stored), ["První odstavec.", "Druhý odstavec.", "Třetí odstavec."]);
});

test("splitIntoParagraphs ignores extra blank lines instead of producing empty paragraphs", () => {
  const stored = "Odstavec jedna.\n\n\n\nOdstavec dva.\n\n   \n\nOdstavec tři.";
  assert.deepEqual(splitIntoParagraphs(stored), ["Odstavec jedna.", "Odstavec dva.", "Odstavec tři."]);
});

test("category metadata and structured data keep reading only the short description, never longDescription", async () => {
  const metadataSource = await readFile(new URL("../../app/blog/[identifier]/page.tsx", import.meta.url), "utf8");
  const structuredDataSource = await readFile(new URL("../structured-data.ts", import.meta.url), "utf8");
  assert.match(metadataSource, /description:\s*category\.description/);
  assert.doesNotMatch(metadataSource, /category\.longDescription/);
  assert.doesNotMatch(structuredDataSource, /longDescription/);
});

test("category page only renders the expanded section when there is real content, with no raw HTML", async () => {
  const source = await readFile(new URL("../../components/blog/CategoryContent.tsx", import.meta.url), "utf8");
  assert.match(source, /longDescriptionParagraphs\.length > 0/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});

test("getAuthorProfileUrl maps the Fit bez času brand author to /o-nas", () => {
  assert.equal(getAuthorProfileUrl({ id: "a", displayName: "Fit bez času", bio: "", avatarPath: null }), "/o-nas");
});

test("getAuthorProfileUrl never invents a profile page for any other author name", () => {
  assert.equal(getAuthorProfileUrl({ id: "b", displayName: "Klárka a David", bio: "", avatarPath: null }), null);
  assert.equal(getAuthorProfileUrl({ id: "c", displayName: "Někdo jiný", bio: "", avatarPath: null }), null);
});

test("article detail renders the author name as a Link only when a profile url exists, never a dedicated /blog/autor page", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  const heroLink = source.match(/authorProfileUrl \? <Link href={authorProfileUrl} className="[^"]*">/)?.[0];
  const cardLink = source.match(/profileUrl \? <Link href={profileUrl} className="[^"]*">/)?.[0];
  assert.ok(heroLink, "expected the hero meta row to conditionally render an author Link");
  assert.ok(cardLink, "expected the AuthorCard heading to conditionally render an author Link");
  assert.doesNotMatch(heroLink ?? "", /target=/);
  assert.doesNotMatch(cardLink ?? "", /target=/);
  assert.doesNotMatch(source, /\/blog\/autor/);
});

test("AuthorCard shows the real brand logo for the Fit bez času author instead of a letter avatar", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  const authorCard = source.match(/function AuthorCard.+/)?.[0] ?? "";
  assert.match(authorCard, /isBrandAuthor = author\.displayName === SITE_NAME/);
  assert.match(authorCard, /src="\/images\/brand\/logo-fbc\.png"/);
  assert.match(authorCard, /alt="Fit bez času"/);
  // The letter-fallback (first character of the display name) must still
  // exist for any other, real named author with no avatar of their own.
  assert.match(authorCard, /author\.displayName\.slice\(0, 1\)/);
});

test("AuthorCard uses the brand byline while keeping Fit bez času linked to /o-nas", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  const authorCard = source.match(/function AuthorCard.+/)?.[0] ?? "";
  assert.match(authorCard, /isBrandAuthor \? "Klárka a David" : author\.bio/);
  assert.match(authorCard, /profileUrl \? <Link href={profileUrl}/);
  assert.equal(getAuthorProfileUrl({ id: "brand", displayName: "Fit bez času", bio: "Tým Fit bez času.", avatarPath: null }), "/o-nas");
});

test("share box has the new, more specific copy and a real functional share button, not just informational text", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  assert.match(source, /Pošli článek někomu, komu může pomoct/);
  assert.doesNotMatch(source, /Sdílej článek, pokud může pomoct někomu dalšímu/);
  assert.match(source, /<ShareArticleButton articleTitle={article\.title} \/>/);
});

test("ShareArticleButton's main button is unchanged: still the Web Share API with a clipboard fallback, opens nothing in a new tab itself", async () => {
  const source = await readFile(new URL("../../components/blog/ShareArticleButton.tsx", import.meta.url), "utf8");
  assert.match(source, /^"use client";/);
  assert.match(source, /navigator\.share/);
  assert.match(source, /navigator\.clipboard\.writeText/);
  assert.match(source, /window\.location\.href/);
  assert.doesNotMatch(source, /https:\/\/web\.fitbezcasu\.cz/, "must never hardcode the domain - always use the page's own current URL");
  const mainButton = source.match(/<button[^>]*>/)?.[0] ?? "";
  assert.match(mainButton, /type="button"/);
  assert.doesNotMatch(mainButton, /target=/, "the main share button itself must not carry a target attribute");
  assert.match(mainButton, /aria-live="polite"/);
  assert.match(source, /"Sdílet článek"/);
  assert.match(source, /"Odkaz zkopírován"/);
  assert.match(source, /"Odkaz se nepodařilo zkopírovat"/);
  assert.doesNotMatch(source, /\balert\(/);
});

test("adds direct Facebook, LinkedIn and WhatsApp share links, each with an encoded current URL and a clear aria-label", async () => {
  const source = await readFile(new URL("../../components/blog/ShareArticleButton.tsx", import.meta.url), "utf8");
  assert.match(source, /https:\/\/www\.facebook\.com\/sharer\/sharer\.php\?u=\$\{encodeURIComponent\(pageUrl\)\}/);
  assert.match(source, /https:\/\/www\.linkedin\.com\/sharing\/share-offsite\/\?url=\$\{encodeURIComponent\(pageUrl\)\}/);
  assert.match(source, /https:\/\/wa\.me\/\?text=\$\{encodeURIComponent\(`\$\{articleTitle\} \$\{pageUrl\}`\)\}/);
  assert.match(source, /aria-label="Sdílet na Facebooku"/);
  assert.match(source, /aria-label="Sdílet na LinkedIn"/);
  assert.match(source, /aria-label="Sdílet přes WhatsApp"/);
  const socialLinksBlock = source.match(/<a href=\{facebookHref\}[\s\S]+<\/a>\s*<\/div>/)?.[0] ?? "";
  const targetCount = (socialLinksBlock.match(/target="_blank"/g) ?? []).length;
  const relCount = (socialLinksBlock.match(/rel="noopener noreferrer"/g) ?? []).length;
  assert.equal(targetCount, 3, "all 3 social links must open in a new tab");
  assert.equal(relCount, 3, "all 3 social links must use rel=\"noopener noreferrer\"");
  // Instagram has no standard share-URL for a plain link, so it must not be added.
  assert.doesNotMatch(source, /instagram/i);
});

test("the social row's current URL is read via useSyncExternalStore, never available or used during server render", async () => {
  const source = await readFile(new URL("../../components/blog/ShareArticleButton.tsx", import.meta.url), "utf8");
  assert.match(source, /useSyncExternalStore/);
  assert.match(source, /function getServerPageUrl\(\)\s*\{\s*return "";\s*\}/, "the SSR snapshot must be empty so server and first client render match - no hydration mismatch");
  assert.match(source, /function getPageUrl\(\)\s*\{\s*return window\.location\.href;\s*\}/);
});

test("isSafeInternalArticleUrl accepts a plain /blog/{slug} shape", () => {
  assert.equal(isSafeInternalArticleUrl("/blog/jak-zacit-cvicit-kdyz-nemas-cas"), true);
  assert.equal(isSafeInternalArticleUrl("/blog/a"), true);
});

test("isSafeInternalArticleUrl also accepts the three known, already-live support-offer routes", () => {
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory"), true);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/osobni-rozbor-jidelnicku"), true);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/emailova-konzultace"), true);
});

test("isSafeInternalArticleUrl rejects any support-offer path outside the exact allow-list, not just the pattern's general shape", () => {
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/neexistujici-nepovolena-cesta"), false);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/"), false);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/osobni-rozbor-jidelnicku/"), false);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory/osobni-rozbor-jidelnicku/../secret"), false);
  assert.equal(isSafeInternalArticleUrl("/nabidka-podpory-jina-stranka"), false);
});

test("isSafeInternalArticleUrl rejects protocol-relative, external, dangerous and malformed URLs", () => {
  assert.equal(isSafeInternalArticleUrl("//example.com"), false);
  assert.equal(isSafeInternalArticleUrl("//nabidka-podpory"), false);
  assert.equal(isSafeInternalArticleUrl("https://example.com"), false);
  assert.equal(isSafeInternalArticleUrl("http://web.fitbezcasu.cz/blog/x"), false);
  assert.equal(isSafeInternalArticleUrl("https://web.fitbezcasu.cz/nabidka-podpory"), false);
  assert.equal(isSafeInternalArticleUrl("javascript:alert(1)"), false);
  assert.equal(isSafeInternalArticleUrl("data:text/html,hi"), false);
  assert.equal(isSafeInternalArticleUrl("/blog/\\evil"), false);
  assert.equal(isSafeInternalArticleUrl("/blog/x\0"), false);
  assert.equal(isSafeInternalArticleUrl("/blog/"), false);
  assert.equal(isSafeInternalArticleUrl("/blog"), false);
  assert.equal(isSafeInternalArticleUrl("/o-nas"), false);
  assert.equal(isSafeInternalArticleUrl("blog/x"), false);
  assert.equal(isSafeInternalArticleUrl("/blog/Some-Slug"), false);
  assert.equal(isSafeInternalArticleUrl("/blog/x/y"), false);
  assert.equal(isSafeInternalArticleUrl(""), false);
});

test("parseInternalArticleLinks returns the whole input as one text segment when there is no link", () => {
  assert.deepEqual(parseInternalArticleLinks("Obyčejná věta bez odkazu."), [{ type: "text", value: "Obyčejná věta bez odkazu." }]);
});

test("parseInternalArticleLinks recognizes one valid internal link with text before and after", () => {
  const result = parseInternalArticleLinks("Nejdřív si přečti [jak začít cvičit](/blog/jak-zacit-cvicit-kdyz-nemas-cas) a pak pokračuj dál.");
  assert.deepEqual(result, [
    { type: "text", value: "Nejdřív si přečti " },
    { type: "link", label: "jak začít cvičit", href: "/blog/jak-zacit-cvicit-kdyz-nemas-cas" },
    { type: "text", value: " a pak pokračuj dál." },
  ]);
});

test("parseInternalArticleLinks also turns a support-offer route into a real link, same as a /blog/{slug} link", () => {
  const result = parseInternalArticleLinks("Přehled najdeš na stránce [Nabídka podpory Fit bez času](/nabidka-podpory).");
  assert.deepEqual(result, [
    { type: "text", value: "Přehled najdeš na stránce " },
    { type: "link", label: "Nabídka podpory Fit bez času", href: "/nabidka-podpory" },
    { type: "text", value: "." },
  ]);
});

test("parseInternalArticleLinks recognizes multiple valid internal links in one paragraph", () => {
  const result = parseInternalArticleLinks("Zkus [začít s pohybem](/blog/jak-zacit-cvicit-kdyz-nemas-cas), nebo [vytvořit si návyk](/blog/jak-si-vytvorit-navyk-cviceni).");
  assert.deepEqual(result, [
    { type: "text", value: "Zkus " },
    { type: "link", label: "začít s pohybem", href: "/blog/jak-zacit-cvicit-kdyz-nemas-cas" },
    { type: "text", value: ", nebo " },
    { type: "link", label: "vytvořit si návyk", href: "/blog/jak-si-vytvorit-navyk-cviceni" },
    { type: "text", value: "." },
  ]);
});

test("parseInternalArticleLinks preserves the original text unchanged when the url is unsafe", () => {
  const input = "Přečti si [tenhle článek](https://example.com/evil) pro víc informací.";
  const result = parseInternalArticleLinks(input);
  assert.ok(result.every((segment) => segment.type === "text"), "must not produce a link segment for an unsafe url");
  assert.equal(result.map((segment) => segment.value).join(""), input);
});

test("parseInternalArticleLinks preserves the original text unchanged for a malformed or empty-label tag", () => {
  const brokenTag = "Nedokončená [značka(/blog/x) v textu.";
  const brokenResult = parseInternalArticleLinks(brokenTag);
  assert.ok(brokenResult.every((segment) => segment.type === "text"));
  assert.equal(brokenResult.map((segment) => segment.value).join(""), brokenTag);

  const emptyLabel = "Prázdný label [   ](/blog/jak-zacit-cvicit-kdyz-nemas-cas) tady.";
  const emptyLabelResult = parseInternalArticleLinks(emptyLabel);
  assert.ok(emptyLabelResult.every((segment) => segment.type === "text"), "must not produce a link segment for a whitespace-only label");
  assert.equal(emptyLabelResult.map((segment) => segment.value).join(""), emptyLabel);
});

test("requestAllPages follows a dataset across the PostgREST 1000-row response cap instead of silently truncating it (regression for the 1247-block production bug)", async () => {
  const total = 1247;
  const allRows = Array.from({ length: total }, (_, index) => ({ id: index }));
  const calls: Array<{ offset: number; limit: number }> = [];

  const result = await withMockedFetch(
    (url) => {
      const { offset, limit } = parseOffsetLimit(url);
      calls.push({ offset, limit });
      return { ok: true, json: async () => allRows.slice(offset, offset + limit) };
    },
    () => requestAllPages<{ id: number }>("blog_article_blocks?select=*&order=article_id.asc,position.asc"),
  );

  assert.equal(calls.length, 2, "1247 rows at page size 1000 must take exactly two requests");
  assert.deepEqual(calls[0], { offset: 0, limit: 1000 });
  assert.deepEqual(calls[1], { offset: 1000, limit: 1000 });
  assert.equal(result.length, total, "every row must come back, none silently dropped past row 1000");
  assert.equal(new Set(result.map((row) => row.id)).size, total, "no row may be duplicated across pages");
  assert.deepEqual(result.map((row) => row.id), allRows.map((row) => row.id), "rows must stay in the exact order the server returned them, page after page");
});

test("requestAllPages stops after an exact-multiple-of-page-size dataset instead of looping forever", async () => {
  const total = 1000;
  const allRows = Array.from({ length: total }, (_, index) => ({ id: index }));
  const calls: Array<{ offset: number; limit: number }> = [];

  const result = await withMockedFetch(
    (url) => {
      const { offset, limit } = parseOffsetLimit(url);
      calls.push({ offset, limit });
      return { ok: true, json: async () => allRows.slice(offset, offset + limit) };
    },
    () => requestAllPages<{ id: number }>("blog_article_blocks?select=*&order=article_id.asc,position.asc"),
  );

  assert.equal(calls.length, 2, "a full first page must always be followed by one confirming (short) page before stopping");
  assert.equal(calls[1].offset, 1000);
  assert.equal(result.length, total);
  assert.deepEqual(result.map((row) => row.id), allRows.map((row) => row.id));
});

test("requestAllPages fails the whole call when any page fails, instead of returning a partial dataset", async () => {
  const firstPage = Array.from({ length: 1000 }, (_, index) => ({ id: index }));
  const calls: Array<{ offset: number; limit: number }> = [];

  await assert.rejects(
    () =>
      withMockedFetch(
        (url) => {
          const { offset, limit } = parseOffsetLimit(url);
          calls.push({ offset, limit });
          if (offset === 0) return { ok: true, json: async () => firstPage };
          return { ok: false };
        },
        () => requestAllPages<{ id: number }>("blog_article_blocks?select=*&order=article_id.asc,position.asc"),
      ),
    /Published blog content could not be loaded\./,
  );

  assert.equal(calls.length, 2, "the failing second page must actually have been attempted");
});

test("paragraph renderer turns a valid internal link into a real next/link, with no target or nofollow, and leaves other blocks untouched", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  const paragraphBranch = source.match(/if \(block\.type === "paragraph"\)[^;]+;/)?.[0] ?? "";
  assert.match(paragraphBranch, /parseInternalArticleLinks/);
  assert.match(paragraphBranch, /segment\.type === "link"/);
  assert.doesNotMatch(paragraphBranch, /target=/);
  assert.doesNotMatch(paragraphBranch, /nofollow/);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
  for (const otherType of ["heading", "highlight", "bullet_list", "numbered_list", "info_box", "tip_cards"]) {
    const branch = source.match(new RegExp(`if \\(block\\.type === "${otherType}"\\)[^;]+;`))?.[0] ?? "";
    assert.doesNotMatch(branch, /parseInternalArticleLinks/, `${otherType} branch must not use the paragraph link parser`);
  }
});
