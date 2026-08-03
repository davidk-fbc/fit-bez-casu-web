import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Node's built-in TypeScript test runner needs the explicit extension.
// @ts-expect-error TS5097 is intentionally limited to this Node-only test entry.
import { formatArticleDate, getAuthorProfileUrl, normalizeLongDescription, splitIntoParagraphs } from "./articles.ts";

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
