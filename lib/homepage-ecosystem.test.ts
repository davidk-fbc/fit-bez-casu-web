// Run with: npx tsx --test lib/homepage-ecosystem.test.ts
//
// Every product Fit bez času currently sells has to be reachable from the
// homepage. Four of them were not: Fit Talíř Plus was mentioned nowhere on
// the site at all, the 21denní výzva had a link constant nobody used, and
// /nabidka-podpory - a finished page with two services on it - had no way in
// from the homepage, the navigation or the footer.
//
// Nothing failed, because nothing checked. These tests check.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { EXTERNAL_LINKS } from "./links";
import { NAV_LINKS } from "./navigation";

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), "utf8");
}

const PAGE = readSource("app/page.tsx");
const PATHS = readSource("components/sections/HowWeHelp.tsx");
const APP_SHOWCASE = readSource("components/sections/AppShowcase.tsx");
const COMMUNITY_CTA = readSource("components/CommunityCta.tsx");

/** The sections the homepage actually mounts - a link in an unmounted file reaches nobody. */
const HOMEPAGE_SECTIONS = ["<Hero />", "<IntroCards />", "<HowWeHelp />", "<AppShowcase />", "<CommunityCta"];

test("ECOSYSTEM 1: the homepage still mounts every section these tests rely on", () => {
  // Asserted first: everything below reads a component's source, which only
  // proves anything while the homepage renders that component.
  for (const section of HOMEPAGE_SECTIONS) {
    assert.ok(PAGE.includes(section), `app/page.tsx must render ${section}`);
  }
});

test("ECOSYSTEM 2: every product currently sold has a path from the homepage", () => {
  const reachable: Record<string, boolean> = {
    // The meal plan and the app each appear in more than one place; one is enough.
    "Jídelníček": PATHS.includes("EXTERNAL_LINKS.mealPlan"),
    "Fit Talíř": PATHS.includes("EXTERNAL_LINKS.app"),
    "21denní výzva": PATHS.includes("EXTERNAL_LINKS.challenge"),
    "Osobní rozbor + 4týdenní podpora": PATHS.includes('"/nabidka-podpory"'),
    "Komunita": COMMUNITY_CTA.includes("COMMUNITY_URL") || COMMUNITY_CTA.includes("EXTERNAL_LINKS.community")
  };

  const missing = Object.entries(reachable)
    .filter(([, ok]) => !ok)
    .map(([name]) => name);

  assert.deepEqual(missing, [], "these products have no path from the homepage");
});

test("ECOSYSTEM 3: the paths section offers four routes, named after a situation", () => {
  assert.equal((PATHS.match(/<PathCard/g) ?? []).length, 4);

  for (const title of [
    "Chci vědět, co jíst",
    "Chci mít jídlo pod kontrolou",
    "Chci začít jednoduchým krokem",
    "Chci osobní pomoc"
  ]) {
    assert.ok(PATHS.includes(`title="${title}"`), `missing path: ${title}`);
  }

  // The heading counted the cards, so it could not survive a fifth one.
  assert.ok(!PATHS.includes("Dvě možnosti"), "the heading must not count the cards");
  assert.ok(PATHS.includes("Vyber si cestu, která ti dává největší smysl"));
});

test("ECOSYSTEM 4: each route has exactly one call to action", () => {
  const labels = [...PATHS.matchAll(/ctaLabel="([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(labels, ["Chci jídelníček", "Vyzkoušet 5 dní zdarma", "Chci 21denní výzvu", "Vybrat si podporu"]);
  assert.equal((PATHS.match(/ctaHref=/g) ?? []).length, 4, "one destination per card");
});

test("ECOSYSTEM 5: destinations come from the canonical constants, not retyped URLs", () => {
  // A second copy of a URL is how one of them goes stale unnoticed.
  assert.ok(!/ctaHref="https?:/.test(PATHS), "no hardcoded external URL in a card");

  assert.equal(EXTERNAL_LINKS.mealPlan, "https://www.fitbezcasu.cz/jidelnicek-pro-zdrave-hubnuti");
  assert.equal(EXTERNAL_LINKS.app, "https://fittalir.fitbezcasu.cz/");
  assert.equal(EXTERNAL_LINKS.challenge, "https://www.fitbezcasu.cz/21dennivyzva");
});

test("ECOSYSTEM 6: Komunita stays in its own CTA and is not repeated as a fifth route", () => {
  // It already closes the page. A second entry would split the same click.
  assert.ok(!PATHS.includes("EXTERNAL_LINKS.community"), "Komunita belongs to CommunityCta, not the routes");
  assert.ok(PAGE.includes("<CommunityCta"), "and CommunityCta must still be on the page");
});

test("ECOSYSTEM 7: Fit Talíř Plus is named on the homepage, as the higher tier of Fit Talíř", () => {
  // It was absent from the entire site: a reader could not learn the tier
  // existed until she was already inside the app.
  assert.ok(PATHS.includes("Fit Talíř Plus"), "the route card must name the tier");
  assert.ok(APP_SHOWCASE.includes("Fit Talíř Plus"), "the section explaining the app must name it too");

  // Named as a variant, never as a separate product with its own block.
  assert.ok(!APP_SHOWCASE.includes("<PathCard"), "no second product block for the tier");
  assert.ok(/vyšší variant/i.test(APP_SHOWCASE), "AppShowcase must frame it as the higher variant");
  assert.ok(/vyšší variant/i.test(PATHS), "so must the route card");
});

test("ECOSYSTEM 8: 'Můj Talíř' is not a product name, in any form", () => {
  for (const [name, source] of [
    ["app/page.tsx", PAGE],
    ["HowWeHelp.tsx", PATHS],
    ["AppShowcase.tsx", APP_SHOWCASE],
    ["CommunityCta.tsx", COMMUNITY_CTA],
    ["lib/navigation.ts", readSource("lib/navigation.ts")],
    ["lib/links.ts", readSource("lib/links.ts")]
  ] as const) {
    assert.ok(!source.includes("Můj Talíř"), `${name} must never say "Můj Talíř"`);
  }
});

test("ECOSYSTEM 9: navigation gains support, and stays six items", () => {
  assert.deepEqual(
    NAV_LINKS.map((link) => link.label),
    ["Jídelníček", "Fit Talíř", "Podpora", "Zdarma", "Blog", "O nás"]
  );
  assert.equal(NAV_LINKS.find((link) => link.label === "Podpora")?.href, "/nabidka-podpory");

  // One entry per destination a reader needs, not one per product - the
  // routes section and /nabidka-podpory are the choosers.
  for (const absent of ["21denní výzva", "Komunita", "Fit Talíř Plus", "Osobní rozbor", "4týdenní podpora"]) {
    assert.ok(!NAV_LINKS.some((link) => link.label === absent), `${absent} does not belong in the menu`);
  }
});
