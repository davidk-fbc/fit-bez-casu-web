import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = (path: string) => readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
const data = root("lib/private-pages.ts");
const renderer = root("components/private-pages/PrivatePageRenderer.tsx");
const route = root("app/nabidka-podpory/[[...segments]]/page.tsx");
const preview = root("app/nabidka-podpory/nahled/[token]/page.tsx");
const sitemap = root("app/sitemap.ts");
const navigation = root("lib/navigation.ts");
const footer = root("components/Footer.tsx");

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

test("renderer uses the unchanged site header and footer through a route layout", () => {
  const layout = root("app/nabidka-podpory/layout.tsx"); assert.match(layout, /<Header/); assert.match(layout, /<Footer/);
});

test("responsive classes keep cards stacked on mobile and avoid narrow fixed widths", () => {
  assert.match(renderer, /grid-cols-1/); assert.match(renderer, /md:grid-cols-2/); assert.match(renderer, /lg:grid-cols-3/); assert.doesNotMatch(renderer, /w-\[(?:[4-9]\d{2}|\d{4,})px\]/);
});
