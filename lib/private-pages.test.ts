import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = (path: string) => readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
const data = root("lib/private-pages.ts");
const renderer = root("components/private-pages/PrivatePageRenderer.tsx");
const route = root("app/nabidka-podpory/[[...segments]]/page.tsx");
const preview = root("app/nabidka-podpory/nahled/[token]/page.tsx");
const layout = root("app/nabidka-podpory/layout.tsx");
const sitemap = root("app/sitemap.ts");
const navigation = root("lib/navigation.ts");
const footer = root("components/Footer.tsx");
const header = root("components/Header.tsx");
const homepage = root("app/page.tsx");
const blogIndex = root("app/blog/(index)/page.tsx");

test("public and preview data use read-only RPC requests with no-store cache", () => {
  assert.match(data, /rpc\/\$\{/); assert.match(data, /method: "POST"/); assert.match(data, /cache: "no-store"/);
  assert.doesNotMatch(data, /service.role|service_role|SUPABASE_SECRET/iu);
});

test("runtime parser recognizes exactly the three supported page types", () => {
  for (const type of ["support_overview", "service_detail", "service_renewal"]) assert.match(data, new RegExp(type));
  assert.doesNotMatch(data, /dangerouslySetInnerHTML/);
});

test("preview only accepts 64 lowercase hexadecimal characters", () => assert.match(data, /\^\[a-f0-9\]\{64\}\$/));

test("every private page is noindex, nofollow, nocache and noarchive", () => {
  for (const source of [route, preview]) { assert.match(source, /index: false/); assert.match(source, /follow: false/); assert.match(source, /nocache: true/); assert.match(source, /noarchive: true/); }
});

test("private page routes are dynamic and missing data triggers a real not-found", () => {
  assert.match(route, /dynamic = "force-dynamic"/); assert.match(route, /if \(!page\) notFound\(\)/);
  assert.match(preview, /if \(!page\) notFound\(\)/);
});

test("support pages remain outside sitemap, navigation and footer", () => {
  for (const source of [sitemap, navigation, footer]) assert.doesNotMatch(source, /nabidka-podpory/);
});

test("overview renders the three visual variants in equal-height cards with bottom CTA", () => {
  assert.match(renderer, /grid-cols-1 items-stretch/); assert.match(renderer, /flex h-full min-w-0 flex-col/); assert.match(renderer, /mt-auto pt-6/);
  assert.match(renderer, /linear-gradient\(135deg,#2f6bff,#9b3ddb\)/); assert.match(renderer, /linear-gradient\(135deg,#10163a,#2a1b57\)/); assert.match(renderer, /bg-white/);
});

test("overview benefits use semantic lists and visible circular markers", () => {
  assert.match(renderer, /<ul className="mt-3 space-y-3">/); assert.match(renderer, /rounded-full/); assert.match(renderer, /aria-hidden="true"/);
});

test("cards preserve source order, hide inactive cards and tolerate missing prices", () => {
  assert.match(renderer, /filter\(\(card\) => card\.active\)\.sort/); assert.match(renderer, /card\.price \?/);
});

test("service detail supports all fixed sections and only resolves active CTA URLs", () => {
  for (const label of ["Pro koho služba je", "Co získáš", "Jak služba probíhá", "Co služba obsahuje"]) assert.match(renderer, new RegExp(label));
  assert.match(renderer, /content\.cta\.active \? page\.salesLinks/);
});

test("renewal renderer contains price, continuity and safe CTA behavior", () => {
  assert.match(renderer, /Cena pokračování/); assert.match(renderer, /Jak období naváže/); assert.match(renderer, /ctaUrl \?/);
});

test("support route layout removes the site header and preserves the shared footer", () => {
  assert.doesNotMatch(layout, /Header/); assert.match(layout, /import \{ Footer \}/); assert.match(layout, /<Footer/);
});

test("the nested support layout covers both public and preview routes", () => {
  assert.match(route, /PrivatePageRenderer/); assert.match(preview, /PrivatePageRenderer/); assert.match(layout, /children/);
});

test("support hero remains the first route content with its existing safe top padding", () => {
  assert.match(layout, /<main className="flex-1">\{children\}<\/main>/); assert.match(renderer, /py-20/); assert.match(renderer, /sm:py-24/); assert.match(renderer, /lg:py-28/);
});

test("regular homepage and blog routes still render the unchanged global header", () => {
  assert.match(header, /export function Header/); assert.match(homepage, /<Header/); assert.match(blogIndex, /<Header/);
});

test("detail renderers contain no sidebar or return navigation", () => {
  assert.doesNotMatch(renderer, /<aside/); assert.doesNotMatch(renderer, /BackLink/); assert.doesNotMatch(renderer, /next\/link/);
  assert.doesNotMatch(renderer, /Vyber si další krok/); assert.doesNotMatch(renderer, /Zpět na přehled podpory/);
});

test("detail content is centered in a readable single-column container", () => {
  assert.match(renderer, /mx-auto max-w-4xl space-y-8/); assert.doesNotMatch(renderer, /lg:grid-cols-\[minmax\(0,1\./);
});

test("active service CTA and renewal CTA stay available in the main content flow", () => {
  assert.match(renderer, /content\.sections\.cta && ctaUrl \?/); assert.match(renderer, /Cena pokračování/); assert.match(renderer, /ctaUrl \?/);
});

test("removed sidebar-only contact copy is not rendered as a replacement panel", () => {
  assert.doesNotMatch(renderer, /content\.contactText/); assert.doesNotMatch(renderer, /lg:sticky/);
});

test("responsive classes keep cards stacked on mobile and avoid narrow fixed widths", () => {
  assert.match(renderer, /grid-cols-1/); assert.match(renderer, /md:grid-cols-2/); assert.match(renderer, /lg:grid-cols-3/); assert.doesNotMatch(renderer, /w-\[(?:[4-9]\d{2}|\d{4,})px\]/);
});
