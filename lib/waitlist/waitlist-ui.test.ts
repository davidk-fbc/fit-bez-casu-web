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

test("WAITLIST UI 1: the 1:1 card carries the new date and nothing of the old one", () => {
  assert.match(COPY, /eyebrow: "ZAČÍNÁME 1\. LEDNA 2027"/);
  assert.match(COPY, /emphasisText: "Osobní vedení 1:1 spouštíme 1\. ledna 2027\."/);

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
    /Souhlasím, aby mě Fit bez času kontaktovalo e-mailem ohledně spuštění Osobního vedení 1:1\. Souhlas můžu kdykoliv odvolat\./
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
