import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const source = readFileSync(fileURLToPath(new URL("./not-found.tsx", import.meta.url)), "utf8");

test("app/not-found.tsx exists and exports a default component", () => {
  assert.match(source, /export default function NotFound/);
});

test("branded 404 copy is present, in Czech, with no technical error jargon", () => {
  assert.match(source, /Tahle stránka tu není/);
  assert.doesNotMatch(source, /Oops/i);
  assert.doesNotMatch(source, /—/);
});

test("links to the homepage and the blog index", () => {
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/blog"/);
});

test("links to all 4 published blog categories with their exact existing slugs", () => {
  assert.match(source, /href=\{`\/blog\/\$\{category\.slug\}`\}/);
  for (const slug of ["cviceni-a-pohyb", "jidelnicek-a-recepty", "motivace-a-podpora", "osobni-rozvoj"]) {
    assert.match(source, new RegExp(`slug: "${slug}"`));
  }
});

test("is a real not-found boundary, not a soft 404 or a redirect", () => {
  assert.doesNotMatch(source, /redirect\(/);
  assert.doesNotMatch(source, /\/404/);
});

test("category links open in the same tab", () => {
  assert.doesNotMatch(source, /target="_blank"/);
});

test("uses the shared Header/Footer and the reusable dark-section glow, not a standalone template", () => {
  assert.match(source, /<Header \/>/);
  assert.match(source, /<Footer \/>/);
  assert.match(source, /DarkSectionGlow/);
});
