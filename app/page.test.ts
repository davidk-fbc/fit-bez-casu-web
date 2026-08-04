import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const source = readFileSync(fileURLToPath(new URL("./page.tsx", import.meta.url)), "utf8");

const PAGE_TITLE = "Fit bez času | Hubnutí, jídelníček a cvičení pro ženy";
const PAGE_DESCRIPTION =
  "Pomáháme ženám, které mají málo času, zhubnout bez diet a extrémů. Najdeš tu jídelníček, krátká cvičení, praktické tipy a podporu komunity Fit bez času.";

test("homepage has a specific, non-generic title with no duplicated brand suffix", () => {
  assert.match(source, /const PAGE_TITLE = "Fit bez času \| Hubnutí, jídelníček a cvičení pro ženy";/);
  // Exactly one brand mention - guards against a template accidentally
  // appending "| Fit bez času" a second time.
  const brandMentions = PAGE_TITLE.match(/Fit bez času/g) ?? [];
  assert.equal(brandMentions.length, 1);
  assert.doesNotMatch(source, /title:\s*SITE_NAME/);
});

test("homepage has its own specific meta description of a reasonable length", () => {
  assert.match(source, /const PAGE_DESCRIPTION =\s*\n?\s*"Pomáháme ženám, které mají málo času, zhubnout bez diet a extrémů\. Najdeš tu jídelníček, krátká cvičení, praktické tipy a podporu komunity Fit bez času\.";/);
  assert.ok(PAGE_DESCRIPTION.length >= 140 && PAGE_DESCRIPTION.length <= 160, `expected 140-160 chars, got ${PAGE_DESCRIPTION.length}`);
  assert.doesNotMatch(source, /description:\s*SITE_DESCRIPTION/);
});

test("canonical and openGraph.url both resolve the homepage's own absolute URL, not a bare relative path", () => {
  assert.match(source, /const PAGE_URL = absoluteUrl\("\/"\);/);
  assert.match(source, /canonical:\s*PAGE_URL/);
  assert.match(source, /url:\s*PAGE_URL/);
  assert.doesNotMatch(source, /canonical:\s*"\/"/);
});

test("openGraph explicitly repeats title, description and siteName instead of relying on merge with the root layout", () => {
  assert.match(source, /openGraph:\s*\{[^}]*title:\s*PAGE_TITLE/);
  assert.match(source, /openGraph:\s*\{[^}]*description:\s*PAGE_DESCRIPTION/);
  assert.match(source, /openGraph:\s*\{[^}]*siteName:\s*SITE_NAME/);
  assert.match(source, /openGraph:\s*\{[^}]*type:\s*"website"/);
  assert.match(source, /images:\s*\[DEFAULT_OG_IMAGE\]/);
});

test("does not set any robots override - homepage stays indexable via the framework default", () => {
  assert.doesNotMatch(source, /robots:/);
  assert.doesNotMatch(source, /noindex/i);
});

test("WebPage structured data uses the same title and description as the rendered metadata", () => {
  assert.match(source, /getPageSchema\(\{\s*type:\s*"WebPage",\s*path:\s*"\/",\s*name:\s*PAGE_TITLE,\s*description:\s*PAGE_DESCRIPTION,\s*primaryImage:\s*true,?\s*\}\)/);
});
