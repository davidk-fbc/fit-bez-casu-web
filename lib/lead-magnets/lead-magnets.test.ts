import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Node's TypeScript test runner requires explicit extensions.
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { createBrevoClient } from "./brevo.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { handleLeadMagnetSubscribe } from "./handler.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { IntegrationError } from "./integration-error.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { orchestrateLeadMagnet } from "./orchestrator.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { MemoryRateLimiter } from "./rate-limit.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { createSystemeClient } from "./systeme.ts";
// @ts-expect-error TS5097 is intentionally limited to this test entry.
import { parseLeadMagnetSubmission } from "./validation.ts";
import type { LeadMagnetSubmission } from "./validation.ts";

type FetchCall = { url: string; init?: RequestInit };

const VALID_SUBMISSION: LeadMagnetSubmission = {
  name: "Klára",
  email: "klara@example.test",
  magnetId: "quick-meals",
  consent: true,
  website: "",
};

function submissionWithoutConsent() {
  const submission: Record<string, unknown> = { ...VALID_SUBMISSION };
  delete submission.consent;
  return submission;
}

function response(body: unknown, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: body === null ? undefined : { "content-type": "application/json" },
  });
}

function bodyOf(call: FetchCall) {
  return JSON.parse(String(call.init?.body)) as Record<string, unknown>;
}

function makeRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://example.test/api/lead-magnets/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.10", ...headers },
    body: JSON.stringify(body),
  });
}

test("validation normalizes the name and email when explicit consent is true", () => {
  const result = parseLeadMagnetSubmission({
    name: "  Klára   Nová  ",
    email: "  KLARA@EXAMPLE.CZ ",
    magnetId: "shopping-guide",
    consent: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.name, "Klára Nová");
    assert.equal(result.value.email, "klara@example.cz");
    assert.equal(result.value.consent, true);
  }
});

test("validation rejects unknown magnet ids, invalid emails and extra payload keys", () => {
  for (const input of [
    { name: "Klára", email: "klara@example.cz", magnetId: "../../secret" },
    { name: "Klára", email: "not-an-email", magnetId: "quick-meals" },
    { name: "Klára", email: "klara@example.cz", magnetId: "quick-meals", templateId: 42 },
  ]) {
    assert.equal(parseLeadMagnetSubmission(input).ok, false);
  }
});

test("validation requires consent to be exactly true and caps field sizes", () => {
  assert.equal(parseLeadMagnetSubmission({ ...VALID_SUBMISSION, consent: false }).ok, false);
  assert.equal(parseLeadMagnetSubmission({ ...VALID_SUBMISSION, consent: "yes" }).ok, false);
  assert.equal(parseLeadMagnetSubmission(submissionWithoutConsent()).ok, false);
  assert.equal(parseLeadMagnetSubmission({ ...VALID_SUBMISSION, name: "x".repeat(81) }).ok, false);
  assert.equal(parseLeadMagnetSubmission({ ...VALID_SUBMISSION, website: "x".repeat(201) }).ok, false);
});

test("memory rate limiter blocks at the configured boundary and resets after the window", () => {
  const limiter = new MemoryRateLimiter();
  const rules = [{ prefix: "email", identifier: "hash", limit: 2, windowMs: 1000 }];
  assert.deepEqual(limiter.check(rules, 100), { allowed: true });
  assert.deepEqual(limiter.check(rules, 200), { allowed: true });
  assert.deepEqual(limiter.check(rules, 300), { allowed: false, retryAfterSeconds: 1 });
  assert.deepEqual(limiter.check(rules, 1100), { allowed: true });
});

test("Brevo upserts FIRSTNAME and sends the selected transactional template without an attachment", async () => {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return response({ messageId: "mock" }, 201);
  }) as typeof fetch;
  const brevo = createBrevoClient({ apiKey: "mock-key" }, fetcher);

  await brevo.upsertContact("Klára", "klara@example.test");
  await brevo.sendLeadMagnet({
    name: "Klára",
    email: "klara@example.test",
    templateId: 17,
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://api.brevo.com/v3/contacts");
  assert.deepEqual(bodyOf(calls[0]), {
    email: "klara@example.test",
    attributes: { FIRSTNAME: "Klára" },
    updateEnabled: true,
  });
  assert.equal(calls[1].url, "https://api.brevo.com/v3/smtp/email");
  assert.deepEqual(bodyOf(calls[1]), {
    to: [{ email: "klara@example.test", name: "Klára" }],
    templateId: 17,
    params: { name: "Klára" },
  });
  assert.equal("attachment" in bodyOf(calls[1]), false);
  assert.equal(new Headers(calls[0].init?.headers).get("api-key"), "mock-key");
});

test("Brevo converts upstream errors into sanitized integration errors", async () => {
  const fetcher = (async () => response({ message: "secret upstream body" }, 401)) as typeof fetch;
  const brevo = createBrevoClient({ apiKey: "mock-key" }, fetcher);
  await assert.rejects(
    () => brevo.upsertContact("Klára", "klara@example.test"),
    (error: unknown) => error instanceof IntegrationError && error.code === "brevo_contact_failed" && !error.message.includes("secret"),
  );
});

test("Systeme updates an existing name and does not re-add an existing Lead-magnet tag", async () => {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("/contacts?")) return response({ items: [{ id: 9, email: VALID_SUBMISSION.email, tags: [{ id: 4, name: "Lead-magnet" }] }] });
    if (url.includes("/tags?")) return response({ items: [{ id: 4, name: "Lead-magnet" }] });
    return response(null, 204);
  }) as typeof fetch;
  const systeme = createSystemeClient({ apiKey: "mock-key" }, fetcher);

  assert.equal(await systeme.upsertAndTag(VALID_SUBMISSION.name, VALID_SUBMISSION.email), "already-present");
  const patch = calls.find((call) => call.init?.method === "PATCH");
  assert.ok(patch);
  assert.deepEqual(bodyOf(patch), { fields: [{ slug: "first_name", value: "Klára" }] });
  assert.equal(new Headers(patch.init?.headers).get("content-type"), "application/merge-patch+json");
  assert.equal(calls.filter((call) => call.url.endsWith("/contacts/9/tags")).length, 0);
});

test("Systeme assigns exactly the existing Lead-magnet tag to an untagged contact", async () => {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("/contacts?")) return response({ items: [{ id: 9, email: VALID_SUBMISSION.email, tags: [] }] });
    if (url.includes("/tags?")) return response({ items: [{ id: 4, name: "Lead-magnet" }] });
    return response(null, 204);
  }) as typeof fetch;
  const systeme = createSystemeClient({ apiKey: "mock-key" }, fetcher);

  assert.equal(await systeme.upsertAndTag(VALID_SUBMISSION.name, VALID_SUBMISSION.email), "assigned");
  const assign = calls.find((call) => call.url.endsWith("/contacts/9/tags"));
  assert.ok(assign);
  assert.equal(assign.init?.method, "POST");
  assert.deepEqual(bodyOf(assign), { tagId: 4 });
  assert.equal(calls.some((call) => call.url.includes("campaign")), false);
});

test("Systeme creates a missing contact with first_name and Czech locale before tagging", async () => {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("/contacts?")) return response({ items: [] });
    if (url.endsWith("/contacts")) return response({ id: 11, email: VALID_SUBMISSION.email, tags: [] }, 201);
    if (url.includes("/tags?")) return response({ items: [{ id: 4, name: "Lead-magnet" }] });
    return response(null, 204);
  }) as typeof fetch;
  const systeme = createSystemeClient({ apiKey: "mock-key" }, fetcher);

  await systeme.upsertAndTag(VALID_SUBMISSION.name, VALID_SUBMISSION.email);
  const create = calls.find((call) => call.url.endsWith("/contacts") && call.init?.method === "POST");
  assert.ok(create);
  assert.deepEqual(bodyOf(create), {
    email: VALID_SUBMISSION.email,
    locale: "cs",
    fields: [{ slug: "first_name", value: VALID_SUBMISSION.name }],
  });
});

test("Systeme refuses a partial tag-name match and never creates a replacement tag", async () => {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    if (url.includes("/contacts?")) return response({ items: [{ id: 9, email: VALID_SUBMISSION.email, tags: [] }] });
    if (url.includes("/tags?")) return response({ items: [{ id: 4, name: "Lead-magnet-old" }] });
    return response(null, 204);
  }) as typeof fetch;
  const systeme = createSystemeClient({ apiKey: "mock-key" }, fetcher);

  await assert.rejects(() => systeme.upsertAndTag(VALID_SUBMISSION.name, VALID_SUBMISSION.email), /systeme_tag_missing/);
  assert.equal(calls.some((call) => call.url.endsWith("/tags") && call.init?.method === "POST"), false);
  assert.equal(calls.some((call) => call.url.includes("campaign")), false);
});

test("orchestrator sends every valid submission through Brevo and Systeme", async () => {
  const calls: string[] = [];
  const brevo = {
    async upsertContact() { calls.push("brevo-contact"); },
    async sendLeadMagnet() { calls.push("brevo-send"); },
  };
  const systeme = { async upsertAndTag() { calls.push("systeme"); return "assigned" as const; } };
  const result = await orchestrateLeadMagnet(
    VALID_SUBMISSION,
    1,
    brevo,
    systeme,
  );
  assert.deepEqual(calls, ["brevo-contact", "brevo-send", "systeme"]);
  assert.deepEqual(result, { delivered: true, marketingSynced: true });
});

test("orchestrator still reports delivery success if Systeme fails after Brevo sent", async () => {
  const calls: string[] = [];
  const logs: unknown[] = [];
  const brevo = {
    async upsertContact() { calls.push("brevo-contact"); },
    async sendLeadMagnet() { calls.push("brevo-send"); },
  };
  const systeme = { async upsertAndTag() { calls.push("systeme"); throw new Error("systeme_mock_failure"); } };
  const result = await orchestrateLeadMagnet(
    VALID_SUBMISSION,
    1,
    brevo,
    systeme,
    (event, context) => logs.push({ event, context }),
  );
  assert.deepEqual(calls, ["brevo-contact", "brevo-send", "systeme"]);
  assert.deepEqual(result, { delivered: true, marketingSynced: false });
  assert.deepEqual(logs, [{ event: "lead_magnet_systeme_sync_failed", context: { code: "systeme_mock_failure", magnetId: "quick-meals" } }]);
  assert.equal(JSON.stringify(logs).includes(VALID_SUBMISSION.email), false);
});

test("orchestrator fails before Systeme when Brevo delivery fails", async () => {
  let systemeCalled = false;
  const brevo = {
    async upsertContact() {},
    async sendLeadMagnet() { throw new IntegrationError("brevo_delivery_failed", 500); },
  };
  const systeme = { async upsertAndTag() { systemeCalled = true; return "assigned" as const; } };
  await assert.rejects(
    () => orchestrateLeadMagnet(VALID_SUBMISSION, 1, brevo, systeme),
    /brevo_delivery_failed/,
  );
  assert.equal(systemeCalled, false);
});

test("subscribe handler accepts a valid request and passes only normalized data to fulfillment", async () => {
  const submissions: LeadMagnetSubmission[] = [];
  const result = await handleLeadMagnetSubscribe(
    makeRequest({ ...VALID_SUBMISSION, name: "  Klára  ", email: "KLARA@EXAMPLE.TEST" }),
    { limiter: new MemoryRateLimiter(), fulfill: async (submission) => { submissions.push(submission); } },
  );
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true });
  assert.deepEqual(submissions, [VALID_SUBMISSION]);
  assert.equal(result.headers.get("cache-control"), "no-store");
});

test("subscribe handler rejects false or missing consent before any fulfillment call", async () => {
  let fulfillmentCalls = 0;
  const dependencies = {
    limiter: new MemoryRateLimiter(),
    fulfill: async () => { fulfillmentCalls += 1; },
  };
  const falseConsent = await handleLeadMagnetSubscribe(
    makeRequest({ ...VALID_SUBMISSION, consent: false }),
    dependencies,
  );
  const missingConsent = await handleLeadMagnetSubscribe(makeRequest(submissionWithoutConsent()), dependencies);

  assert.equal(falseConsent.status, 400);
  assert.equal(missingConsent.status, 400);
  assert.deepEqual(await falseConsent.json(), { ok: false, error: "invalid_input", fields: ["consent"] });
  assert.deepEqual(await missingConsent.json(), { ok: false, error: "invalid_input", fields: ["consent"] });
  assert.equal(fulfillmentCalls, 0);
});

test("subscribe handler rejects wrong content types, malformed JSON and oversized bodies", async () => {
  const dependencies = { limiter: new MemoryRateLimiter(), fulfill: async () => {} };
  const wrongType = new Request("https://example.test", { method: "POST", body: "{}" });
  assert.equal((await handleLeadMagnetSubscribe(wrongType, dependencies)).status, 415);
  const malformed = new Request("https://example.test", { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
  assert.equal((await handleLeadMagnetSubscribe(malformed, dependencies)).status, 400);
  const oversized = new Request("https://example.test", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(5000) });
  assert.equal((await handleLeadMagnetSubscribe(oversized, dependencies)).status, 413);
});

test("honeypot returns generic success without calling fulfillment", async () => {
  let called = false;
  const result = await handleLeadMagnetSubscribe(
    makeRequest({ ...VALID_SUBMISSION, website: "https://spam.example" }),
    { limiter: new MemoryRateLimiter(), fulfill: async () => { called = true; } },
  );
  assert.equal(result.status, 200);
  assert.equal(called, false);
});

test("subscribe handler rate-limits repeated email and magnet submissions", async () => {
  const limiter = new MemoryRateLimiter();
  const dependencies = { limiter, fulfill: async () => {} };
  for (let index = 0; index < 3; index += 1) {
    assert.equal((await handleLeadMagnetSubscribe(makeRequest(VALID_SUBMISSION), dependencies)).status, 200);
  }
  const blocked = await handleLeadMagnetSubscribe(makeRequest(VALID_SUBMISSION), dependencies);
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) > 0);
});

test("subscribe handler never exposes an upstream error or submitted PII", async () => {
  const originalError = console.error;
  console.error = () => {};
  try {
    const result = await handleLeadMagnetSubscribe(
      makeRequest(VALID_SUBMISSION),
      { limiter: new MemoryRateLimiter(), fulfill: async () => { throw new IntegrationError("private_upstream_detail", 500); } },
    );
    assert.equal(result.status, 502);
    const body = JSON.stringify(await result.json());
    assert.equal(body.includes("private_upstream_detail"), false);
    assert.equal(body.includes(VALID_SUBMISSION.email), false);
  } finally {
    console.error = originalError;
  }
});

test("frontend has one reusable native modal with all required states and consent-aware analytics", () => {
  const provider = readFileSync(new URL("../../components/free-resources/LeadMagnetSignupProvider.tsx", import.meta.url), "utf8");
  const cta = readFileSync(new URL("../../components/free-resources/FreeLeadMagnetCta.tsx", import.meta.url), "utf8");
  assert.equal(provider.match(/<dialog\b/g)?.length, 1);
  assert.match(provider, /showModal\(\)/);
  assert.match(provider, /onCancel=/);
  assert.match(provider, /event\.key === "Escape"/);
  assert.match(provider, /trigger\?\.focus\(\)/);
  assert.match(provider, /submissionState === "loading"/);
  assert.match(provider, /submissionState === "success"/);
  assert.match(provider, /submissionState === "error"/);
  assert.match(provider, /magnet\.preview\.cover/);
  assert.match(provider, /Kam ti máme materiál poslat\?/);
  assert.match(provider, /Vyplň jméno a e-mail\. Pošleme ti vybraný materiál a budeš od nás dostávat také praktické tipy k hubnutí, inspiraci a nabídky Fit bez času\. Z odběru se můžeš kdykoliv jednoduše odhlásit\./);
  assert.match(provider, /Materiál je na cestě do tvé e-mailové schránky/);
  assert.match(provider, /Právě jsme ti poslali vybraný materiál na e-mail\. Pokud ho během pár minut neuvidíš, zkontroluj také složku Hromadné, Promo nebo Spam\./);
  assert.match(provider, /Materiál jsme ti právě poslali na e-mail\./);
  assert.match(provider, /submissionState === "success"[\s\S]{0,160}Materiál je na cestě do tvé e-mailové schránky/);
  assert.match(provider, /Získat materiál zdarma/);
  assert.match(provider, /name="consent"[\s\S]{0,120}\brequired\b/);
  assert.match(provider, /Souhlasím se zasíláním e-mailových tipů, inspirace a nabídek Fit bez času a se zpracováním svých údajů za tímto účelem\. Souhlas můžu kdykoliv odvolat\./);
  assert.match(provider, /Pro získání materiálu je potřeba potvrdit souhlas s e-mailovou komunikací\./);
  assert.match(provider, /https:\/\/platforma\.fitbezcasu\.cz\/ochrana-osobnich-udaju/);
  assert.match(provider, /Zásadách ochrany osobních údajů/);
  assert.match(provider, /data\.get\("consent"\) !== "on"/);
  assert.match(provider, /consent: true/);
  assert.doesNotMatch(provider, /Materiál ti pošleme i bez souhlasu/);
  for (const event of ["lead_magnet_open", "lead_magnet_submit", "lead_magnet_success"]) assert.ok(provider.includes(event));
  assert.match(provider, /consentStatus === "decided" && analytics === "granted"/);
  assert.match(provider, /\{ magnet_id: selectedId \}/);
  assert.match(cta, /onClick=\{\(event\) => open\(magnetId, event\.currentTarget\)\}/);
});

test("the old no-consent delivery branch is absent and valid orchestration always reaches Systeme", () => {
  const source = readFileSync(new URL("./orchestrator.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /if\s*\(!submission\.(?:marketingConsent|consent)\)/);
  assert.match(source, /await systeme\.upsertAndTag\(submission\.name, submission\.email\)/);
});

test("server maps all four magnet ids to their own template env without reading or attaching a PDF", () => {
  const source = readFileSync(new URL("./server-config.ts", import.meta.url), "utf8");
  const mappings = [
    ["quick-meals", "BREVO_LEAD_MAGNET_QUICK_MEALS_TEMPLATE_ID"],
    ["evening-cravings", "BREVO_LEAD_MAGNET_EVENING_CRAVINGS_TEMPLATE_ID"],
    ["shopping-guide", "BREVO_LEAD_MAGNET_SHOPPING_GUIDE_TEMPLATE_ID"],
    ["diet-mistakes", "BREVO_LEAD_MAGNET_DIET_MISTAKES_TEMPLATE_ID"],
  ];
  for (const [id, environmentName] of mappings) {
    assert.ok(source.includes(`"${id}":`));
    assert.ok(source.includes(`templateEnv: "${environmentName}"`));
  }
  assert.doesNotMatch(source, /readFile|\.pdf|attachment|public\//);
});
