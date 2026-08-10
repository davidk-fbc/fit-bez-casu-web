import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

// Node's built-in TypeScript test runner needs the explicit extension.
// @ts-expect-error TS5097 is intentionally limited to this Node-only test entry.
import { getSupportOfferSeo, SUPPORT_OFFER_INDEXABLE_SLUGS } from "./support-offer-seo.ts";

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

test("only the three approved public support pages are indexable", () => {
  assert.deepEqual([...SUPPORT_OFFER_INDEXABLE_SLUGS], [
    "nabidka-podpory",
    "nabidka-podpory/osobni-rozbor-jidelnicku",
    "nabidka-podpory/emailova-konzultace",
  ]);
  assert.match(route, /seo \? \{ index: true, follow: true \}/);
  assert.match(route, /\{ index: false, follow: false, nocache: true, noarchive: true \}/);
  assert.equal(getSupportOfferSeo("nabidka-podpory/pokracovani-podpory"), null);
  assert.equal(getSupportOfferSeo("nabidka-podpory/nahled/token"), null);
});

test("private page routes are dynamic and missing data triggers a real not-found", () => {
  assert.match(route, /dynamic = "force-dynamic"/); assert.match(route, /if \(!page\) notFound\(\)/);
  assert.match(preview, /if \(!page\) notFound\(\)/);
});

test("approved support pages are in the sitemap while preview and internal variants stay out", () => {
  assert.match(sitemap, /SUPPORT_OFFER_INDEXABLE_SLUGS/);
  assert.match(sitemap, /supportOfferPages/);
  assert.doesNotMatch(sitemap, /nahled|token|pokracovani-podpory/);
  for (const source of [navigation, footer]) assert.doesNotMatch(source, /nabidka-podpory/);
});

test("approved support pages have unique SEO titles, descriptions and self-referencing canonicals", () => {
  const entries = SUPPORT_OFFER_INDEXABLE_SLUGS.map((slug) => ({ slug, seo: getSupportOfferSeo(slug) }));
  assert.equal(new Set(entries.map(({ seo }) => seo?.title)).size, 3);
  assert.equal(new Set(entries.map(({ seo }) => seo?.description)).size, 3);
  assert.deepEqual(entries.map(({ seo }) => seo?.title), [
    "Podpora při hubnutí | Fit bez času",
    "Osobní rozbor jídelníčku | Fit bez času",
    "4týdenní podpora při hubnutí | Fit bez času",
  ]);
  for (const { slug, seo } of entries) {
    assert.ok(seo);
    assert.ok(seo.title.endsWith("| Fit bez času"));
    assert.ok(seo.description.length > 80);
    assert.ok(slug.startsWith("nabidka-podpory"));
  }
  assert.match(route, /const canonical = `\$\{SITE_URL\}\/\$\{displayPage\.slug\}`/);
});

test("preview pages remain noindex, nofollow, nocache and noarchive", () => {
  assert.match(preview, /index: false/);
  assert.match(preview, /follow: false/);
  assert.match(preview, /nocache: true/);
  assert.match(preview, /noarchive: true/);
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

test("support offer uses the final selection copy with restrained service-name emphasis", () => {
  assert.match(supportCopy, /Každá služba řeší jinou situaci\. Vyber si podle toho, co potřebuješ právě teď\./);
  assert.match(supportCopy, /Pokud si nejsi jistá, kde začít, pomůže ti jednoduché rozdělení\./);
  assert.match(supportCopy, /Osobní rozbor jídelníčku je pro chvíli, kdy chceš zjistit, co konkrétně ve svém jídelníčku změnit\./);
  assert.match(supportCopy, /4týdenní podpora se hodí, když chceš mít během několika týdnů pravidelnou zpětnou vazbu/);
  assert.match(supportCopy, /Osobní vedení 1:1 připravujeme pro ženy, které chtějí dlouhodobější individuální spolupráci/);
  assert.match(supportCopy, /skutečně posouvaly k výsledkům, kterých chtějí dosáhnout\./);
  assert.match(renderer, /emphasizeServiceNames=\{isSupportOfferPage\(page\)\}/);
  assert.match(renderer, /SUPPORT_SERVICE_NAMES/);
  assert.match(renderer, /font-semibold text-\[var\(--color-text\)\]/);
  assert.match(renderer, /text\.split\("\\n\\n"\)/);
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

test("personal diet review detail has the approved hero, audience and price", () => {
  for (const text of [
    "PŘESTAŇ HÁDAT, CO DĚLÁŠ ŠPATNĚ",
    "Zjisti, co ve tvém jídelníčku opravdu brzdí výsledky",
    "Možná se snažíš jíst lépe, hlídáš si porce a vybíráš zdravější jídla.",
    "Z pěti běžných dní zjistíme, kde může být skutečný problém, co už děláš dobře",
    "Je osobní rozbor vhodný právě pro tebe?",
    "490 Kč",
  ]) assert.ok(supportCopy.includes(text), `missing personal diet review copy: ${text}`);
  for (const text of [
    "Snažíš se jíst zdravě, ale nejsi si jistá, jestli máš jídelníček sestavený správně.",
    "Nevíš, proč máš během dne hlad, chutě nebo potřebu večer něco dojíst.",
    "Máš za sebou několik pokusů, ale nechceš znovu začínat další přísnou dietou.",
    "Potřebuješ odlišit důležité chyby od drobností, které teď nemusíš řešit.",
    "Chceš konkrétní doporučení podle svého skutečného jídelníčku, ne další obecný návod.",
  ]) assert.ok(supportCopy.includes(text), `missing audience point: ${text}`);
  assert.match(renderer, /<PersonalDietReviewHeroCopy \/>/);
  assert.match(renderer, /<h1 className=/);
  assert.equal((renderer.match(/<h1 /g) ?? []).length, 1);
});

test("personal diet review detail contains all six outcomes and all five process steps", () => {
  for (const title of [
    "Zhodnocení pěti běžných dní",
    "3 věci, které už děláš dobře",
    "3 hlavní brzdy",
    "3 konkrétní první kroky",
    "Akční plán na 7 dní",
    "Osobní výstup",
  ]) assert.ok(supportCopy.includes(`title: "${title}"`), `missing outcome: ${title}`);
  for (const title of [
    "Vyplníš vstupní dotazník",
    "Zapíšeš pět běžných dní",
    "Podklady důkladně projdeme",
    "Dostaneš osobní rozbor",
    "Začneš třemi jasnými kroky",
  ]) assert.ok(supportCopy.includes(`title: "${title}"`), `missing process step: ${title}`);
  assert.match(supportCopy, /Na konci nebudeš mít jen seznam toho, co děláš špatně/);
  assert.match(renderer, /<DetailList items=\{content\.process\} numbered \/>/);
});

test("personal diet review has the approved purchase, FAQ and final CTA blocks", () => {
  assert.match(supportCopy, /purchaseTitle: "Osobní rozbor jídelníčku za 490 Kč"/);
  for (const item of [
    "Zhodnocení 5 běžných dní",
    "3 věci, které už děláš dobře",
    "3 hlavní brzdy",
    "3 konkrétní první kroky",
    "Akční plán na 7 dní",
    "Přehledný osobní výstup",
  ]) assert.ok(supportCopy.includes(`"${item}"`), `missing purchase item: ${item}`);
  for (const question of [
    "Co vám budu posílat?",
    "Musím si kvůli rozboru všechno připravit „ukázkově“?",
    "Mám zaznamenat i víkend?",
    "Dostanu jen seznam chyb?",
    "Je rozbor vhodný, i když už si hlídám kalorie?",
    "Je osobní rozbor vhodný při zdravotních problémech?",
  ]) assert.ok(supportCopy.includes(`question: "${question}"`), `missing FAQ question: ${question}`);
  assert.match(renderer, /<dl className=/);
  assert.match(renderer, /<dt className=/);
  assert.match(renderer, /<dd className=/);
  assert.match(supportCopy, /Nemusíš jíst dokonale\. Potřebuješ vědět, co má smysl řešit jako první\./);
  assert.match(supportCopy, /Chceš konečně vědět, co ve svém jídelníčku změnit\?/);
  assert.doesNotMatch(supportCopy, /doba dodání|dobu dodání/iu);
});

test("all personal diet review purchase CTAs reuse the existing resolved sales link", () => {
  assert.match(renderer, /personalDietReviewCtaUrl = personalDietReview\?\.cta\.active \? page\.salesLinks\[personalDietReview\.cta\.salesLinkKey\]/);
  assert.match(renderer, /const ctaUrl = content\.cta\.active \? page\.salesLinks\[content\.cta\.salesLinkKey\]/);
  assert.match(renderer, /<PersonalDietReviewCta href=\{personalDietReviewCtaUrl\}/);
  assert.equal((renderer.match(/<PersonalDietReviewCta href=\{ctaUrl\}/g) ?? []).length, 2);
  assert.match(renderer, /Chci svůj osobní rozbor/);
  assert.doesNotMatch(renderer, /form\.simpleshop\.cz/);
});

test("personal diet review preserves its disclaimer and responsive safeguards", () => {
  assert.match(renderer, /content\.additionalInfo \? <p className="rounded-2xl/);
  assert.match(renderer, /overflow-hidden bg-white/);
  assert.match(renderer, /min-w-0 break-words/);
  assert.match(renderer, /w-full justify-center sm:w-auto sm:min-w-80/);
  assert.match(renderer, /min-h-14/);
});

test("four-week support detail has the approved hero, audience and price", () => {
  for (const text of [
    "KDYŽ NECHCEŠ VŠECHNO ŘEŠIT SAMA",
    "4 týdny podpory, během kterých můžeš průběžně řešit, co se ti daří i kde tápeš",
    "Možná víš, co bys chtěla změnit, ale v běžném životě přicházejí situace",
    "Po dobu 4 týdnů s námi můžeš pravidelně řešit, co se právě děje",
    "Je 4týdenní podpora vhodná právě pro tebe?",
    "990 Kč",
  ]) assert.ok(supportCopy.includes(text), `missing four-week support copy: ${text}`);
  for (const text of [
    "Chceš mít během hubnutí někoho, s kým můžeš pravidelně probrat svůj postup.",
    "Často si nejsi jistá, jestli děláš správné změny nebo jestli máš něco upravit.",
    "Potřebuješ řešit konkrétní situace, které přicházejí během běžného týdne.",
    "Nechceš čekat několik týdnů s otázkou, která tě právě teď brzdí.",
    "Pomohlo by ti mít každý týden jasnou prioritu, na kterou se zaměřit dál.",
    "Chceš podporu, která reaguje na to, co se u tebe skutečně děje, ne další obecný plán.",
  ]) assert.ok(supportCopy.includes(text), `missing four-week audience point: ${text}`);
  assert.match(renderer, /<FourWeekSupportHeroCopy \/>/);
  assert.match(renderer, /<FourWeekSupportCta href=\{fourWeekSupportCtaUrl\}/);
  assert.equal((renderer.match(/<h1 /g) ?? []).length, 1);
});

test("four-week support detail contains all six outcomes, five steps and WhatsApp", () => {
  for (const title of [
    "Pravidelná týdenní zpětná vazba",
    "Jasná priorita pro další týden",
    "Odpovědi na konkrétní otázky",
    "Průběžná podpora přes WhatsApp",
    "Doporučení podle toho, co se skutečně děje",
    "Čtyři týdny, během kterých na to nejsi sama",
  ]) assert.ok(supportCopy.includes(`title: "${title}"`), `missing four-week outcome: ${title}`);
  for (const title of [
    "Po objednávce dostaneš informace k zahájení",
    "Každý týden nám pošleš krátké shrnutí",
    "Dostaneš osobní zpětnou vazbu",
    "Během týdne můžeš využít WhatsApp skupinu",
    "Postupně upravujeme další kroky",
  ]) assert.ok(supportCopy.includes(`title: "${title}"`), `missing four-week process step: ${title}`);
  assert.match(supportCopy, /WhatsApp skupiny/);
  assert.match(supportCopy, /Průběžné otázky ve WhatsApp skupině/);
});

test("four-week support has the purchase, everyday-life and seven-question FAQ blocks", () => {
  assert.match(supportCopy, /purchaseTitle: "4týdenní podpora za 990 Kč"/);
  for (const item of [
    "4 týdny podpory",
    "Pravidelná týdenní zpětná vazba",
    "Konkrétní doporučení podle tvé situace",
    "Jasná priorita pro další týden",
    "Odpovědi na otázky z běžného života",
    "Průběžné otázky ve WhatsApp skupině",
  ]) assert.ok(supportCopy.includes(`"${item}"`), `missing four-week purchase item: ${item}`);
  assert.match(supportCopy, /Vědět, co dělat, je jedna věc\. Zvládnout to v běžném životě je druhá\./);
  assert.match(supportCopy, /Hubnutí většinou nekomplikuje jeden špatný den\./);
  for (const question of [
    "Jak dlouho podpora trvá?",
    "Jak probíhá týdenní zpětná vazba?",
    "Můžu se ptát i během týdne?",
    "Musím každý týden všechno dodržet dokonale?",
    "Je 4týdenní podpora vhodná i tehdy, když už mám jídelníček?",
    "Co když budu chtít pokračovat i po 4 týdnech?",
    "Je podpora vhodná při zdravotních problémech?",
  ]) assert.ok(supportCopy.includes(`question: "${question}"`), `missing four-week FAQ question: ${question}`);
  assert.match(renderer, /function FourWeekSupportFaq/);
  assert.match(renderer, /<dl className=/);
});

test("four-week support includes continuation, final CTA and health disclaimer copy", () => {
  assert.match(supportCopy, /objednat další 4 týdny a plynule pokračovat/);
  assert.match(supportCopy, /Nemusíš mít každý týden perfektní\. Důležité je vědět, jak pokračovat dál\./);
  assert.match(supportCopy, /Chceš mít během dalších 4 týdnů pravidelnou podporu\?/);
  assert.match(supportCopy, /Nenahrazuje lékařskou péči ani individuální doporučení nutričního terapeuta/);
  assert.doesNotMatch(supportCopy, /odpovíme do|odpověď do \d+|do \d+ hodin/iu);
});

test("all four-week purchase CTAs reuse the existing resolved sales link and slug", () => {
  assert.match(supportCopy, /FOUR_WEEK_SUPPORT_SLUG = "nabidka-podpory\/emailova-konzultace"/);
  assert.match(renderer, /fourWeekSupportCtaUrl = fourWeekSupport\?\.cta\.active \? page\.salesLinks\[fourWeekSupport\.cta\.salesLinkKey\]/);
  assert.match(renderer, /<FourWeekSupportCta href=\{fourWeekSupportCtaUrl\}/);
  assert.equal((renderer.match(/<FourWeekSupportCta href=\{ctaUrl\}/g) ?? []).length, 2);
  assert.match(renderer, /Chci 4týdenní podporu/);
  assert.doesNotMatch(renderer, /form\.simpleshop\.cz/);
  assert.match(renderer, /overflow-hidden bg-white/);
  assert.match(renderer, /w-full justify-center sm:w-auto sm:min-w-80/);
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
