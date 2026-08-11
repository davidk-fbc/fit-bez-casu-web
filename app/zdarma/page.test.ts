import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const pageSource = readFileSync(fileURLToPath(new URL("./page.tsx", import.meta.url)), "utf8");
const configSource = readFileSync(fileURLToPath(new URL("../../lib/free-lead-magnets.ts", import.meta.url)), "utf8");
const ctaSource = readFileSync(fileURLToPath(new URL("../../components/free-resources/FreeLeadMagnetCta.tsx", import.meta.url)), "utf8");
const navigationSource = readFileSync(fileURLToPath(new URL("../../lib/navigation.ts", import.meta.url)), "utf8");
const sitemapSource = readFileSync(fileURLToPath(new URL("../sitemap.ts", import.meta.url)), "utf8");

const TITLES = [
  "15 rychlých jídel, když nestíháš",
  "Co dělat, když tě večer honí chuť na sladké",
  "Tahák zdravého nákupu",
  "7 chyb v jídelníčku, které mohou brzdit hubnutí",
];

const CTA_LABELS = [
  "Chci 15 rychlých jídel zdarma",
  "Chci e-book o večerních chutích zdarma",
  "Chci Tahák zdravého nákupu zdarma",
  "Chci zjistit, co může brzdit moje hubnutí",
];

const PREVIEWS = [
  "quick-cover.webp",
  "quick-inside.webp",
  "cravings-cover.webp",
  "cravings-inside.webp",
  "shopping-cover.webp",
  "shopping-inside.webp",
  "mistakes-cover.webp",
  "mistakes-inside.webp",
];

test("free resources page has one exact H1 and no explicit material count in the hero", () => {
  assert.equal(pageSource.match(/<h1\b/g)?.length, 1);
  assert.match(pageSource, /Vyber si praktický materiál podle toho, co právě řešíš/);
  assert.doesNotMatch(pageSource, /4\s+(?:praktické\s+)?materiály|čtyři\s+materiály/i);
});

test("all lead magnets and exact CTA labels are configured", () => {
  for (const title of TITLES) assert.ok(configSource.includes(title), `missing title: ${title}`);
  for (const label of CTA_LABELS) assert.ok(configSource.includes(label), `missing CTA: ${label}`);
  assert.equal(configSource.match(/ctaUrl:\s*null/g)?.length, 4);
});

test("all optimized preview assets exist", () => {
  for (const filename of PREVIEWS) {
    const path = fileURLToPath(new URL(`../../public/images/free-resources/${filename}`, import.meta.url));
    assert.ok(existsSync(path), `missing preview: ${filename}`);
  }
});

test("CTA fallback is a disabled button and never a fake or PDF link", () => {
  assert.match(ctaSource, /<button[\s\S]*?disabled/);
  assert.doesNotMatch(`${pageSource}\n${configSource}\n${ctaSource}`, /href=["']#["']/);
  assert.doesNotMatch(`${pageSource}\n${configSource}\n${ctaSource}`, /\.pdf(?:["'?#]|$)/i);
});

test("metadata is indexable and canonical points to the production /zdarma route", () => {
  assert.match(pageSource, /Materiály zdarma pro zdravé hubnutí \| Fit bez času/);
  assert.match(pageSource, /Stáhni si praktické materiály zdarma pro zdravé hubnutí: rychlá jídla, večerní chutě, zdravý nákup a self-check jídelníčku\./);
  assert.match(pageSource, /const PAGE_PATH = "\/zdarma"/);
  assert.match(pageSource, /canonical:\s*PAGE_URL/);
  assert.match(pageSource, /robots:\s*\{\s*index:\s*true,\s*follow:\s*true/);
});

test("navigation and sitemap expose /zdarma", () => {
  assert.match(navigationSource, /\{ label: "Zdarma", href: "\/zdarma" \}/);
  assert.match(sitemapSource, /url: `\$\{SITE_URL\}\/zdarma`/);
});
