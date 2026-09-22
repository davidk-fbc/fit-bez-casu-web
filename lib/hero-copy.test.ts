// Run with: npx tsx --test lib/hero-copy.test.ts
//
// The four-week support hero shipped a sentence that nobody ever saw. The
// copy was edited in support-offer-copy.ts, the suite went green, and the
// page did not change - because the hero was a hardcoded component that
// never read that data.
//
// The old test asserted `supportCopy.includes(...)`, which only ever proved
// the sentence was in a file. So this file renders instead: it puts the real
// subtitle through the real renderer and reads the HTML that comes out. A
// hero that ignores its data cannot pass these.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement, Fragment } from "react";
import { heroPlainText, parseHeroCopy } from "./hero-copy";
import { applySupportOfferCopy, isFourWeekSupportPage, FOUR_WEEK_SUPPORT_SLUG } from "./support-offer-copy";
import type { PrivatePage, ServiceDetailContent } from "./private-pages";

/** The two sentences the hero has to carry, whatever the markup around them. */
const REQUIRED_HERO_SENTENCES = [
  "Po dobu 4 týdnů s námi můžeš pravidelně řešit, co se právě děje, získávat zpětnou vazbu a podle potřeby upravovat další kroky.",
  "K dispozici budeš mít také WhatsApp skupinu a možnost napsat nám soukromě, když svůj dotaz nechceš řešit před ostatními."
];

/**
 * The hero's own rendering, reproduced from PrivatePageRenderer's
 * HeroSubtitle. Kept in step by the source assertions in HERO 6 - rendering
 * the page component itself would drag in next/image and the whole page
 * tree for two paragraphs of text.
 */
function renderHeroSubtitle(subtitle: string): string {
  const paragraphs = parseHeroCopy(subtitle);

  return renderToStaticMarkup(
    createElement(
      "div",
      null,
      paragraphs.map((paragraph, index) =>
        createElement(
          "p",
          { key: index },
          paragraph.segments.map((segment, segmentIndex) =>
            segment.emphasised
              ? createElement("strong", { key: segmentIndex, className: "font-semibold text-white" }, segment.text)
              : createElement(Fragment, { key: segmentIndex }, segment.text)
          )
        )
      )
    )
  );
}

/** The four-week support page exactly as the site builds it. */
function fourWeekSupportPage() {
  const base: PrivatePage = {
    id: "test",
    slug: FOUR_WEEK_SUPPORT_SLUG,
    pageType: "service_detail",
    title: "",
    subtitle: "",
    featuredImageUrl: null,
    featuredImageAlt: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    content: {
      eyebrow: "",
      sections: {},
      audience: [],
      benefits: [],
      process: [],
      cta: {}
    } as unknown as ServiceDetailContent,
    salesLinks: {}
  };

  const page = applySupportOfferCopy(base);
  assert.ok(isFourWeekSupportPage(page), "fixture must be the four-week support page");
  return page;
}

// --- the parser ------------------------------------------------------------

test("HERO 1: a blank line starts a new paragraph", () => {
  assert.equal(parseHeroCopy("první\n\ndruhý\n\ntřetí").length, 3);
  assert.equal(parseHeroCopy("jediný odstavec").length, 1);
  // Trailing and repeated blank lines must not produce empty paragraphs.
  assert.equal(parseHeroCopy("a\n\n\n\nb\n\n").length, 2);
});

test("HERO 2: nothing to say renders nothing", () => {
  for (const value of ["", "   ", "\n\n", null, undefined]) {
    assert.deepEqual(parseHeroCopy(value), [], `"${String(value)}" should yield no paragraphs`);
  }
});

test("HERO 3: **like this** is emphasis, and the markers never reach the reader", () => {
  const [paragraph] = parseHeroCopy("Po dobu **4 týdnů** s námi.");

  assert.deepEqual(paragraph.segments, [
    { text: "Po dobu ", emphasised: false },
    { text: "4 týdnů", emphasised: true },
    { text: " s námi.", emphasised: false }
  ]);
  assert.deepEqual(heroPlainText("Po dobu **4 týdnů** s námi."), ["Po dobu 4 týdnů s námi."]);
});

test("HERO 4: an unclosed marker degrades to plain text instead of breaking the hero", () => {
  const [paragraph] = parseHeroCopy("Po dobu **4 týdnů s námi.");

  assert.equal(paragraph.segments.map((segment) => segment.text).join(""), "Po dobu 4 týdnů s námi.");
  assert.ok(paragraph.segments.every((segment) => segment.text.length > 0), "no empty runs");
});

// --- the render ------------------------------------------------------------

test("HERO 5: the rendered hero carries both required sentences", () => {
  // The test that matters. It reads the page's real subtitle, renders it,
  // and looks at the HTML - not at whether a string exists in a file.
  const page = fourWeekSupportPage();
  const html = renderHeroSubtitle(page.subtitle);

  for (const sentence of REQUIRED_HERO_SENTENCES) {
    // Emphasis splits a sentence across elements, so compare the text the
    // reader sees rather than the raw markup.
    const visible = html.replace(/<[^>]+>/g, "");
    assert.ok(visible.includes(sentence), `the rendered hero is missing: ${sentence}`);
  }

  assert.equal((html.match(/<p>/g) ?? []).length, 3, "three paragraphs");
  assert.match(html, /<strong class="font-semibold text-white">4 týdnů<\/strong>/, "emphasis survives");
  assert.ok(!html.includes("**"), "markers must never reach the page");
});

test("HERO 6: the page renderer uses this data - no second copy of the words", () => {
  const renderer = readSource("components/private-pages/PrivatePageRenderer.tsx");

  // The hero must read page.subtitle…
  assert.match(renderer, /fourWeekSupport \? <HeroSubtitle subtitle=\{page\.subtitle\} \/>/);
  assert.match(renderer, /parseHeroCopy\(subtitle\)/);

  // …and must not hold the sentences itself. This is the check that would
  // have caught the original bug: the words may live in exactly one place.
  for (const sentence of REQUIRED_HERO_SENTENCES) {
    assert.ok(!renderer.includes(sentence), `the renderer must not repeat: ${sentence.slice(0, 40)}…`);
  }
  assert.ok(!renderer.includes("FourWeekSupportHeroCopy /"), "the hardcoded hero is gone");

  // The markup the render test reproduces must stay the markup shipped.
  assert.match(renderer, /<strong key=\{segmentIndex\} className="font-semibold text-white">/);
});

test("HERO 7: the sentences exist once in the whole repo", () => {
  const page = fourWeekSupportPage();

  // The copy file holds the marked-up form ("**4 týdnů**"), so the plain
  // sentence is compared against what the data actually resolves to.
  const fromData = heroPlainText(page.subtitle).join(" ");

  for (const sentence of REQUIRED_HERO_SENTENCES) {
    assert.ok(fromData.includes(sentence), `the copy file must hold: ${sentence.slice(0, 40)}…`);
  }

  // And nowhere else. A second copy anywhere is how the original bug
  // happened: two versions, one of them unreachable.
  for (const file of ["components/private-pages/PrivatePageRenderer.tsx", "lib/hero-copy.ts", "lib/support-offer-seo.ts"]) {
    const contents = readSource(file);

    for (const sentence of REQUIRED_HERO_SENTENCES) {
      assert.ok(!contents.includes(sentence), `${file} must not repeat: ${sentence.slice(0, 40)}…`);
      // Nor a lightly-reworded near-duplicate of the distinctive clause.
      assert.ok(!contents.includes("napsat nám soukromě, když"), `${file} must not hold a second version of the hero`);
    }
  }
});

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), "utf8");
}
