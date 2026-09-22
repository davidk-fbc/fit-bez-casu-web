// Run with: npx tsx --test lib/waitlist/waitlist-ui.test.ts
//
// What the reader sees: the card that offers the waitlist, and the dialog
// behind its button. Separated from waitlist.test.ts, which covers the API.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${relativePath}`, import.meta.url)), "utf8");
}

const COPY = readSource("lib/support-offer-copy.ts");
const MODAL = readSource("components/waitlist/CoachingWaitlistCta.tsx");
const RENDERER = readSource("components/private-pages/PrivatePageRenderer.tsx");

test("WAITLIST UI 1: the coaching card carries the new date and nothing of the old one", () => {
  assert.match(COPY, /eyebrow: "ZAČÍNÁME 1\. LEDNA 2027"/);
  assert.match(COPY, /emphasisText: "Osobní vedení spouštíme 1\. ledna 2027\."/);

  // The card promised September 2026 well into September 2026.
  assert.ok(!COPY.includes("září 2026"), "the stale date is gone from the copy");
  assert.ok(!COPY.includes("PŘIPRAVUJEME OD ZÁŘÍ"), "and so is the label that carried it");
});

test("WAITLIST UI 2: 'září 2026' appears nowhere in the shipped source", () => {
  for (const file of [
    "lib/support-offer-copy.ts",
    "components/waitlist/CoachingWaitlistCta.tsx",
    "components/private-pages/PrivatePageRenderer.tsx"
  ]) {
    assert.ok(!readSource(file).includes("září 2026"), `${file} still mentions září 2026`);
  }
});

test("WAITLIST UI 3: the card invites people onto the list and says it costs nothing", () => {
  assert.match(COPY, /ctaLabel: "CHCI VĚDĚT, AŽ OTEVŘETE MÍSTA"/);
  assert.match(COPY, /Chceš vědět, až otevřeme první místa\? Nech nám svůj e-mail a ozveme se ti mezi prvními\./);
  assert.match(COPY, /supportingText: "Nezávazně\. Jen ti dáme vědět, až bude možné se přihlásit\."/);
});

test("WAITLIST UI 4: the dark card's button opens the dialog instead of navigating", () => {
  // It has no detail page to link to - the whole product is the waitlist.
  assert.match(RENDERER, /card\.variant === "dark" \? <CoachingWaitlistCta label=\{card\.ctaLabel\}/);
  assert.match(RENDERER, /import \{ CoachingWaitlistCta \}/);
});

test("WAITLIST UI 5: the dialog asks for a name, an e-mail and consent, and nothing else", () => {
  assert.match(MODAL, /id="waitlist-name"/);
  assert.match(MODAL, /id="waitlist-email"/);
  assert.match(MODAL, /name="consent"/);
  assert.match(MODAL, /name="website"/);

  // No phone, no questionnaire - it is a waiting list, not an application.
  for (const field of ["phone", "telefon", "message", "zprava", "goal"]) {
    assert.ok(!MODAL.includes(`name="${field}"`), `the dialog must not ask for ${field}`);
  }
});

test("WAITLIST UI 6: consent is explicit, worded for this purpose, and links to the policy", () => {
  assert.match(
    MODAL,
    /Souhlasím, aby mě Fit bez času kontaktovalo e-mailem ohledně spuštění Osobního vedení\. Souhlas můžu kdykoliv odvolat\./
  );
  assert.match(MODAL, /Zásady ochrany osobních údajů/);
  assert.match(MODAL, /https:\/\/fittalir\.fitbezcasu\.cz\/ochrana-osobnich-udaju/);

  // Unticked by default: a pre-ticked box is not consent.
  assert.ok(!/name="consent"[^>]*defaultChecked/.test(MODAL));
  assert.ok(!/name="consent"[^>]*checked/.test(MODAL));
});

test("WAITLIST UI 7: the dialog is a dialog, reachable by keyboard", () => {
  assert.match(MODAL, /role="dialog"/);
  assert.match(MODAL, /aria-modal="true"/);
  assert.match(MODAL, /aria-labelledby=\{titleId\}/);
  assert.match(MODAL, /event\.key === "Escape"/);
  assert.match(MODAL, /nameRef\.current\?\.focus\(\)/);
});

test("WAITLIST UI 8: success and failure are different states, and failure is honest", () => {
  assert.match(MODAL, /Díky, máme tě na seznamu\. Ozveme se ti, až otevřeme první místa\./);
  assert.match(MODAL, /Zápis se nepodařil\. Zkus to prosím ještě jednou\./);

  // The confirmation may only follow a response the server called ok.
  assert.match(MODAL, /if \(response\.ok\) \{\s*setStatus\("done"\);/);
  assert.match(MODAL, /setStatus\("error"\)/);
  // No optimistic success: a 502 must not read as a thank-you.
  assert.ok(!/catch[^}]*setStatus\("done"\)/.test(MODAL));
});

test("WAITLIST UI 9: the form posts to the waitlist endpoint, not the lead-magnet one", () => {
  assert.match(MODAL, /"\/api\/waitlist\/subscribe"/);
  assert.ok(!MODAL.includes("/api/lead-magnets/"), "the two forms must not share an endpoint");
  assert.ok(!MODAL.includes("magnetId"), "and the waitlist has no magnet");
});

test("WAITLIST UI 10: the product is 'Osobní vedení' - never '1:1' anywhere a reader can see", () => {
  // It is a three-month programme for a small group, not one-to-one
  // coaching. "1:1" promised the wrong thing, and "individuální podporu"
  // promised it a second way.
  const USER_FACING = [
    "lib/support-offer-copy.ts",
    "components/waitlist/CoachingWaitlistCta.tsx",
    "components/private-pages/PrivatePageRenderer.tsx"
  ];

  for (const file of USER_FACING) {
    const source = readSource(file);

    assert.ok(!source.includes("Osobní vedení 1:1"), `${file} still says "Osobní vedení 1:1"`);
    assert.ok(!source.includes("Osobního vedení 1:1"), `${file} still says "Osobního vedení 1:1"`);
    assert.ok(!source.includes("1:1"), `${file} still contains a bare "1:1"`);
  }

  // "individuální" survives only in the other two services' medical
  // disclaimers, which are about a nutritionist's advice, not this product.
  const coachingCard = COPY.slice(COPY.indexOf('case "dark"'), COPY.indexOf('ctaLabel: "CHCI VĚDĚT'));
  assert.ok(!/individuáln/i.test(coachingCard), "the card must not promise individual coaching");
});

test("WAITLIST UI 11: the card and the dialog both name the product, and the date is unchanged", () => {
  assert.match(COPY, /title: "Osobní vedení",/);
  assert.match(COPY, /3měsíční program v malé skupině žen/);
  assert.match(MODAL, /Osobní vedení\s*<\/h2>/);
  assert.match(MODAL, /spuštění Osobního vedení\. Souhlas můžu kdykoliv odvolat\./);

  // The launch date survives the rename.
  assert.match(COPY, /eyebrow: "ZAČÍNÁME 1\. LEDNA 2027"/);
  assert.match(COPY, /Osobní vedení spouštíme 1\. ledna 2027\./);
});

test("WAITLIST UI 12: the rename did not touch the working integration", () => {
  // The tag is internal, already created in Systeme.io and verified
  // end-to-end in production. Renaming it to match the new product name
  // would break a live flow for a cosmetic reason.
  assert.match(readSource("lib/waitlist/orchestrator.ts"), /COACHING_WAITLIST_TAG = "zajem-osobni-vedeni-1-1"/);
  assert.ok(readSource("app/api/waitlist/subscribe/route.ts").includes("handleWaitlistSubscribe"));
  assert.match(MODAL, /"\/api\/waitlist\/subscribe"/);
});
