// Fit Talíř marketing-site migration (Phase 1): regression coverage proving
// the public site's application links/naming moved from the old app
// (Platforma, platforma.fitbezcasu.cz) to the new one (Fit Talíř,
// fittalir.fitbezcasu.cz), while the parent brand "Fit bez času" is kept
// where it correctly refers to the parent/company, not the application.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), "utf8");
}

// Every source file that renders a customer-facing application link/name -
// not test files, not supabase/migrations (an already-applied migration is
// deliberately left untouched, see the Phase 1 report for the two live rows
// that still need a manual DB fix).
const CUSTOMER_FACING_SOURCE_FILES = [
  "lib/links.ts",
  "lib/navigation.ts",
  "components/Footer.tsx",
  "components/Header.tsx",
  "components/MobileNavigation.tsx",
  "components/free-resources/LeadMagnetSignupProvider.tsx",
  "components/sections/AppShowcase.tsx",
  "components/sections/IntroCards.tsx",
  "app/page.tsx",
  "app/zdarma/page.tsx",
];

test("no customer-facing source file links to the old application host, platforma.fitbezcasu.cz", () => {
  for (const relativePath of CUSTOMER_FACING_SOURCE_FILES) {
    const contents = readSource(relativePath);
    assert.ok(!contents.includes("platforma.fitbezcasu.cz"), `${relativePath} still references the old application host`);
  }
});

test("the single source of truth for the application link points at fittalir.fitbezcasu.cz", () => {
  const linksSource = readSource("lib/links.ts");
  assert.match(linksSource, /app: "https:\/\/fittalir\.fitbezcasu\.cz\/"/);
});

test("navigation identifies the application as Fit Talíř, not Aplikace or Aplikace Fit bez času", () => {
  const navigationSource = readSource("lib/navigation.ts");
  assert.match(navigationSource, /label: "Fit Talíř", href: EXTERNAL_LINKS\.app/);
  assert.ok(!navigationSource.includes('label: "Aplikace"'));
});

test("homepage product surfaces (IntroCards card and AppShowcase section) identify the application as Fit Talíř", () => {
  const introCardsSource = readSource("components/sections/IntroCards.tsx");
  assert.match(introCardsSource, /title: "Fit Talíř",[\s\S]*?href: EXTERNAL_LINKS\.app/);

  const appShowcaseSource = readSource("components/sections/AppShowcase.tsx");
  assert.ok(appShowcaseSource.includes("Fit Talíř"));
  assert.ok(!appShowcaseSource.includes("Aplikace Fit bez času"));
  assert.ok(appShowcaseSource.includes("Poznat Fit Talíř"));
  assert.ok(!appShowcaseSource.includes("Poznat aplikaci"));
});

test("the rejected typo brand 'Můj Talíř' appears nowhere in customer-facing source", () => {
  for (const relativePath of CUSTOMER_FACING_SOURCE_FILES) {
    const contents = readSource(relativePath);
    assert.ok(!contents.includes("Můj Talíř"), `${relativePath} must never contain the rejected 'Můj Talíř' name`);
  }
});

test("parent brand 'Fit bez času' is retained where it refers to the company/community/copyright, not the application", () => {
  const footerSource = readSource("components/Footer.tsx");
  assert.match(footerSource, /© \{year\} Fit bez času/);
  assert.ok(footerSource.includes("Přidej se do komunity Fit bez času"));
  assert.ok(footerSource.includes("Fit bez času") && !footerSource.includes("platforma.fitbezcasu.cz"));
});

test("legal-page links (Footer, lead-magnet privacy link) use the new application host with their route paths preserved", () => {
  const footerSource = readSource("components/Footer.tsx");
  assert.ok(footerSource.includes('href="https://fittalir.fitbezcasu.cz/obchodni-podminky"'));
  assert.ok(footerSource.includes('href="https://fittalir.fitbezcasu.cz/ochrana-osobnich-udaju"'));
  assert.ok(footerSource.includes('href="https://fittalir.fitbezcasu.cz/zasady-cookies"'));

  const providerSource = readSource("components/free-resources/LeadMagnetSignupProvider.tsx");
  assert.match(providerSource, /PRIVACY_URL = "https:\/\/fittalir\.fitbezcasu\.cz\/ochrana-osobnich-udaju"/);
});

// The already-applied migration supabase/migrations/20260813190000_add_
// twelve_seo_blog_articles.sql is deliberately NOT edited (rewriting an
// applied migration doesn't change the live database anyway - see the
// Phase 1 report's "LIVE BLOG CTA DATA" section for the two rows that need
// a manual fix through the admin blog editor instead). This test only
// proves that fact stays true and the seeded slugs are never silently
// renamed by a future edit to this file.
test("the already-applied blog-articles migration keeps its original article slugs untouched", () => {
  const migrationSource = readSource(
    "supabase/migrations/20260813190000_add_twelve_seo_blog_articles.sql",
  );
  assert.ok(migrationSource.includes("'aplikace-fit-bez-casu-nebo-plus'"));
  assert.ok(migrationSource.includes("'aplikace-na-pocitani-kalorii'"));
});
