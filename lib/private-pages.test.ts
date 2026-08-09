import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = (path: string) => readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");
const data = root("lib/private-pages.ts");
const supportCopy = root("lib/support-offer-copy.ts");
const renderer = root("components/private-pages/PrivatePageRenderer.tsx");
const icons = root("components/icons.tsx");
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

test("runtime parser accepts expanded titled copy while preserving legacy string items", () => {
  assert.match(data, /PrivatePageDetailItem = string \| \{ title: string; text: string \}/);
  assert.match(data, /detailItemList/);
  for (const field of ["closingTitle", "closingText", "audienceTitle", "benefitsTitle", "processTitle", "inclusionsTitle", "objectionTitle", "objectionText", "continuityTitle", "priceTitle", "ctaSupportText"]) assert.match(data, new RegExp(field));
});

test("runtime parser isolates safe structured contact links from generic sales URLs", () => {
  assert.match(data, /PrivatePageContact/); assert.match(data, /safeContactEmailUrl/); assert.match(data, /structuredContact/);
  assert.match(data, /instagramUrl\.startsWith\("https:\/\/"\)/); assert.match(data, /\^mailto:/);
  assert.doesNotMatch(data, /safeUrl\s*=.*mailto/);
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
  assert.match(renderer, /grid-cols-1 items-stretch/); assert.match(renderer, /md:grid-cols-2/); assert.match(renderer, /lg:grid-cols-3/); assert.match(renderer, /flex h-full min-w-0 flex-col/); assert.match(renderer, /mt-auto pt-6/);
  assert.match(renderer, /linear-gradient\(135deg,#2f6bff,#9b3ddb\)/); assert.match(renderer, /linear-gradient\(135deg,#10163a,#2a1b57\)/); assert.match(renderer, /bg-white/);
});

test("support offer applies the requested intro only to the root support overview", () => {
  assert.match(supportCopy, /SUPPORT_OFFER_SLUG = "nabidka-podpory"/);
  assert.match(supportCopy, /Potřebuješ poradit s tím, co řešíš právě teď\?/);
  assert.match(supportCopy, /Nemusíš na všechno přicházet sama/);
  assert.match(renderer, /jednorázově zjistit, co můžeš ve svém jídelníčku zlepšit/);
  assert.match(renderer, /průběžnou podporu během několika týdnů/);
  assert.match(renderer, /<strong className="font-semibold text-white">/);
  assert.match(route, /applySupportOfferCopy/);
  assert.match(preview, /applySupportOfferCopy/);
});

test("personal diet review copy contains all six requested benefits and preserves its existing detail target", () => {
  for (const text of [
    "Jasné zhodnocení tvého běžného jídelníčku",
    "3 věci, které už děláš dobře",
    "3 hlavní důvody, které mohou brzdit tvůj posun",
    "3 konkrétní změny, na které se zaměřit",
    "Jednoduchý plán pro další dny",
    "Přehledný osobní výstup, ke kterému se můžeš vracet",
  ]) assert.ok(supportCopy.includes(text), `missing diet review benefit: ${text}`);
  assert.match(supportCopy, /Zjistit více o osobním rozboru/);
  assert.match(supportCopy, /\.\.\.card/);
  assert.doesNotMatch(supportCopy, /targetSlug:\s*"nabidka-podpory\/osobni-rozbor/);
});

test("four-week support copy contains all six requested benefits including WhatsApp", () => {
  for (const text of [
    "Pravidelnou týdenní zpětnou vazbu",
    "Odpovědi na otázky, které se objeví v praxi",
    "Pomoc s konkrétními situacemi z tvého týdne",
    "Doporučení upravená podle toho, co právě řešíš",
    "Jasnou prioritu, na kterou se zaměřit dál",
    "Možnost průběžně se ptát i ve WhatsApp skupině",
  ]) assert.ok(supportCopy.includes(text), `missing four-week support benefit: ${text}`);
  assert.match(supportCopy, /title: "4týdenní podpora"/);
  assert.match(supportCopy, /Zjistit více o 4týdenní podpoře/);
});

test("personal guidance stays the dark third-card variant and is clearly marked as upcoming", () => {
  assert.match(supportCopy, /case "dark"/);
  assert.match(supportCopy, /PŘIPRAVUJEME OD ZÁŘÍ 2026/);
  assert.match(supportCopy, /Připravujeme 3měsíční program osobního vedení/);
  assert.match(supportCopy, /Start připravujeme od září 2026\./);
  for (const text of [
    "Pravidelnou individuální podporu",
    "Řešit svou konkrétní situaci více do hloubky",
    "Mít prostor průběžně konzultovat další kroky",
    "Dlouhodobější spolupráci během 3 měsíců",
    "Podporu přizpůsobenou tomu, co právě řeší",
  ]) assert.ok(supportCopy.includes(text), `missing personal guidance benefit: ${text}`);
  assert.match(supportCopy, /content\.cards\.map/);
  assert.doesNotMatch(renderer, /lg:grid-cols-2/);
});

test("personal guidance contact actions use the existing public channels safely", () => {
  assert.match(supportCopy, /info@fitbezcasu\.cz/);
  assert.match(supportCopy, /@fitbezcasu/);
  assert.match(supportCopy, /href: "mailto:info@fitbezcasu\.cz"/);
  assert.match(supportCopy, /href: "https:\/\/www\.instagram\.com\/fitbezcasu\/"/);
  assert.match(footer, /href: "https:\/\/www\.instagram\.com\/fitbezcasu\/"/);
  assert.match(renderer, /target=\{action\.external \? "_blank" : undefined\}/);
  assert.match(renderer, /rel=\{action\.external \? "noopener noreferrer" : undefined\}/);
  assert.match(renderer, /aria-label=\{action\.ariaLabel\}/);
  assert.match(renderer, /flex min-w-0 flex-wrap gap-3/);
  assert.match(renderer, /withArrow=\{false\}/);
});

test("new support offer copy contains no long dash", () => assert.equal(supportCopy.includes("\u2014"), false));

test("overview CTAs use contrast-specific private-page tones at one shared size", () => {
  assert.match(renderer, /light: .*ctaTone: "brand"/);
  assert.match(renderer, /gradient: .*ctaTone: "on-gradient"/);
  assert.match(renderer, /dark: .*ctaTone: "on-dark"/);
  assert.match(renderer, /<PrivatePageCta href=\{`\/\$\{card\.targetSlug\}`\} tone=\{style\.ctaTone\} className="w-full justify-center">/);
  assert.match(renderer, /min-h-14/);
  assert.match(renderer, /sm:min-h-16/);
});

test("private-page primary CTAs have premium interactive and reduced-motion states", () => {
  for (const token of [
    "shadow-[0_18px_42px",
    "0_0_28px",
    "motion-safe:hover:-translate-y-0.5",
    "motion-safe:active:translate-y-px",
    "focus-visible:outline-4",
    "focus-visible:outline-offset-4",
    "motion-reduce:transform-none",
    "motion-reduce:transition-none",
    "motion-safe:hover:[&>svg]:translate-x-1",
  ]) assert.ok(renderer.includes(token), `missing CTA state ${token}`);
  assert.match(icons, /ArrowRightIcon[\s\S]*aria-hidden="true"/);
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

test("expanded service copy uses CMS headings and renders titled result and process items", () => {
  for (const field of ["audienceTitle", "benefitsTitle", "processTitle", "inclusionsTitle", "objectionTitle", "closingTitle"]) assert.match(renderer, new RegExp(`content\\.${field}`));
  assert.match(renderer, /<DetailList items=\{content\.benefits\}/);
  assert.match(renderer, /<DetailList items=\{content\.process\} numbered/);
  assert.doesNotMatch(renderer, /dangerouslySetInnerHTML/);
});

test("renewal renderer contains price, continuity and safe CTA behavior", () => {
  assert.match(renderer, /Cena pokračování/); assert.match(renderer, /Jak období naváže/); assert.match(renderer, /ctaUrl \?/);
  assert.match(renderer, /content\.benefitsTitle/); assert.match(renderer, /content\.continuityTitle/); assert.match(renderer, /content\.priceTitle/); assert.match(renderer, /content\.ctaSupportText/);
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
  assert.match(renderer, /<PrivatePageCta href=\{ctaUrl\}[\s\S]*sm:min-w-80/);
  assert.match(renderer, /w-full justify-center sm:w-auto/);
  assert.match(renderer, /whitespace-normal break-words/);
});

test("renewal final note is omitted completely when the CMS value is empty", () => {
  assert.match(renderer, /content\.contactNote \? <p className="rounded-2xl/);
  assert.match(renderer, /\{content\.contactNote\}<\/p> : null/);
});

test("removed sidebar-only contact copy is not rendered as a replacement panel", () => {
  assert.doesNotMatch(renderer, /content\.contactText/); assert.doesNotMatch(renderer, /lg:sticky/);
});

test("individual contact renders as accessible text links without hard-coded destinations", () => {
  assert.match(renderer, /<ContactBlock contact=\{content\.contact\}/); assert.match(renderer, /href=\{contact\.instagramUrl\}/); assert.match(renderer, /href=\{contact\.emailUrl\}/);
  assert.match(renderer, /target="_blank" rel="noopener noreferrer"/); assert.match(renderer, /focus-visible:outline/);
  assert.doesNotMatch(renderer.match(/function ContactBlock[\s\S]*?function Renewal/)?.[0] ?? "", /PrivatePageCta|<Button/);
  assert.doesNotMatch(renderer, /form\.simpleshop\.cz/); assert.doesNotMatch(renderer, /instagram\.com\/fitbezcasu/); assert.doesNotMatch(renderer, /mailto:info@fitbezcasu\.cz/);
  assert.doesNotMatch(renderer, /dangerouslySetInnerHTML/);
});

test("responsive classes keep cards stacked on mobile and avoid narrow fixed widths", () => {
  assert.match(renderer, /grid-cols-1/); assert.match(renderer, /md:grid-cols-2/); assert.match(renderer, /lg:grid-cols-3/); assert.doesNotMatch(renderer, /w-\[(?:[4-9]\d{2}|\d{4,})px\]/);
});
