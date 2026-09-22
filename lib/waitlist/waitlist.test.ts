// Run with: npx tsx --test lib/waitlist/waitlist.test.ts
//
// The coaching waitlist differs from the lead magnets in one way that matters:
// there is nothing to deliver. The only outcome is that somebody can be
// found later by a tag in Systeme.io, so a failed sync is a failed sign-up,
// not a degraded one. Most of these tests exist to pin that.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { MemoryRateLimiter } from "../lead-magnets/rate-limit";
import { IntegrationError } from "../lead-magnets/integration-error";
import { createSystemeClient, LEAD_MAGNET_TAG } from "../lead-magnets/systeme";
import { handleWaitlistSubscribe } from "./handler";
import { COACHING_WAITLIST_TAG, orchestrateWaitlistSignup } from "./orchestrator";
import { parseWaitlistSubmission } from "./validation";

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${relativePath}`, import.meta.url)), "utf8");
}

const VALID = { name: "Jana Nováková", email: "jana@example.test", consent: true, website: "" };

function post(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://web.fitbezcasu.cz/api/waitlist/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.10", ...headers },
    body: JSON.stringify(body)
  });
}

function stubBrevo(calls: string[] = []) {
  return {
    async upsertContact() {
      calls.push("brevo-upsert");
    },
    async sendLeadMagnet() {
      calls.push("brevo-send");
    }
  } as never;
}

// --- validation ------------------------------------------------------------

test("WAITLIST 1: a complete submission parses, trimmed and lower-cased", () => {
  const parsed = parseWaitlistSubmission({ ...VALID, name: "  Jana   Nováková ", email: "Jana@Example.TEST" });

  assert.ok(parsed.ok);
  assert.equal(parsed.value.name, "Jana Nováková");
  assert.equal(parsed.value.email, "jana@example.test");
});

test("WAITLIST 2: a missing or too-short name is rejected", () => {
  for (const name of ["", " ", "J", undefined, 42]) {
    const parsed = parseWaitlistSubmission({ ...VALID, name });
    assert.equal(parsed.ok, false, `"${String(name)}" should not pass`);
    assert.ok(parsed.ok === false && parsed.fields.includes("name"));
  }
});

test("WAITLIST 3: a malformed e-mail is rejected", () => {
  for (const email of ["", "jana", "jana@", "@example.test", "jana example@test.cz", undefined]) {
    const parsed = parseWaitlistSubmission({ ...VALID, email });
    assert.equal(parsed.ok, false, `"${String(email)}" should not pass`);
  }
});

test("WAITLIST 4: consent is required - it is the basis for writing to her later", () => {
  for (const consent of [false, undefined, "on", 1, null]) {
    const parsed = parseWaitlistSubmission({ ...VALID, consent });
    assert.ok(parsed.ok === false && parsed.fields.includes("consent"), `"${String(consent)}" must not count as consent`);
  }
});

test("WAITLIST 5: an unexpected key means the payload was not built by our form", () => {
  assert.equal(parseWaitlistSubmission({ ...VALID, magnetId: "quick-meals" }).ok, false);
});

// --- handler ---------------------------------------------------------------

test("WAITLIST 6: a filled honeypot answers like a success but stores nothing", async () => {
  let subscribed = false;
  const response = await handleWaitlistSubscribe(post({ ...VALID, website: "http://spam.example" }), {
    subscribe: async () => {
      subscribed = true;
    },
    limiter: new MemoryRateLimiter()
  });

  assert.equal(response.status, 200);
  assert.equal(subscribed, false, "a bot must learn nothing from the response, and store nothing");
});

test("WAITLIST 7: invalid input answers 400 and names the fields", async () => {
  const response = await handleWaitlistSubscribe(post({ ...VALID, email: "nope" }), {
    subscribe: async () => {},
    limiter: new MemoryRateLimiter()
  });

  assert.equal(response.status, 400);
  assert.deepEqual((await response.json()).fields, ["email"]);
});

test("WAITLIST 8: repeated sign-ups from one e-mail are rate limited", async () => {
  const limiter = new MemoryRateLimiter();
  const dependencies = { subscribe: async () => {}, limiter };
  const statuses: number[] = [];

  for (let attempt = 0; attempt < 5; attempt += 1) {
    statuses.push((await handleWaitlistSubscribe(post(VALID), dependencies)).status);
  }

  assert.ok(statuses.includes(429), `expected a 429 among ${statuses.join(", ")}`);
  const limited = statuses.indexOf(429);
  assert.ok(limited > 0, "the first attempt must go through");
});

test("WAITLIST 9: a failed sign-up answers with an error, never a false confirmation", async () => {
  // The whole point. She has no way of telling a lie here from the truth
  // until a launch e-mail never arrives.
  const response = await handleWaitlistSubscribe(post(VALID), {
    subscribe: async () => {
      throw new IntegrationError("systeme_tag_missing");
    },
    limiter: new MemoryRateLimiter()
  });

  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, "signup_failed");
  // The reason is for the log, not for her.
  assert.ok(!JSON.stringify(body).includes("systeme_tag_missing"));
});

// --- orchestration ---------------------------------------------------------

test("WAITLIST 10: a successful sign-up upserts Brevo and assigns the waitlist tag", async () => {
  const calls: string[] = [];
  const tags: string[] = [];

  const result = await orchestrateWaitlistSignup(
    { ...VALID, consent: true },
    stubBrevo(calls),
    {
      async upsertAndTag(_name: string, _email: string, tagName: string) {
        tags.push(tagName);
        return "assigned" as const;
      }
    } as never
  );

  assert.deepEqual(calls, ["brevo-upsert"]);
  assert.deepEqual(tags, [COACHING_WAITLIST_TAG]);
  assert.equal(result.listed, true);
});

test("WAITLIST 11: no lead magnet and no PDF is ever sent from this flow", async () => {
  const calls: string[] = [];

  await orchestrateWaitlistSignup({ ...VALID, consent: true }, stubBrevo(calls), {
    async upsertAndTag() {
      return "assigned" as const;
    }
  } as never);

  assert.ok(!calls.includes("brevo-send"), "the waitlist has nothing to deliver");
  const source = readSource("lib/waitlist/orchestrator.ts");
  assert.ok(!source.includes("sendLeadMagnet"), "and must not be able to");
  assert.ok(!source.includes("templateId"));
});

test("WAITLIST 12: a tag that cannot be assigned fails the whole sign-up", async () => {
  await assert.rejects(
    () =>
      orchestrateWaitlistSignup({ ...VALID, consent: true }, stubBrevo(), {
        async upsertAndTag() {
          throw new IntegrationError("systeme_tag_assign_failed");
        }
      } as never),
    /systeme_tag_assign_failed/
  );
});

test("WAITLIST 13: a Brevo failure does not lose somebody who can still be tagged", async () => {
  // The mirror of 12: Brevo is the nice-to-have, the tag is the product.
  const logged: string[] = [];

  const result = await orchestrateWaitlistSignup(
    { ...VALID, consent: true },
    {
      async upsertContact() {
        throw new Error("brevo_contact_failed");
      }
    } as never,
    {
      async upsertAndTag() {
        return "assigned" as const;
      }
    } as never,
    (event) => logged.push(event)
  );

  assert.equal(result.listed, true);
  assert.deepEqual(logged, ["waitlist_brevo_upsert_failed"]);
});

// --- the Systeme client, shared with the lead magnets -----------------------

test("WAITLIST 14: a missing tag in Systeme.io throws rather than being created", async () => {
  const systeme = createSystemeClient({ apiKey: "test-key-not-real" }, (async (url: string) => {
    if (String(url).includes("/contacts?email=")) {
      return Response.json({ items: [{ id: 1, email: VALID.email, tags: [] }] });
    }
    if (String(url).includes("/tags?query=")) return Response.json({ items: [] });
    return Response.json({});
  }) as never);

  await assert.rejects(
    () => systeme.upsertAndTag(VALID.name, VALID.email, COACHING_WAITLIST_TAG),
    /systeme_tag_missing/,
    "the app must never invent a tag"
  );
});

test("WAITLIST 15: the client assigns exactly the tag it was given", async () => {
  const requested: string[] = [];
  const assigned: unknown[] = [];

  const systeme = createSystemeClient({ apiKey: "test-key-not-real" }, (async (url: string, init: RequestInit) => {
    const href = String(url);
    if (href.includes("/contacts?email=")) {
      return Response.json({ items: [{ id: 7, email: VALID.email, tags: [] }] });
    }
    if (href.includes("/tags?query=")) {
      requested.push(decodeURIComponent(href.split("query=")[1].split("&")[0]));
      return Response.json({ items: [{ id: 99, name: COACHING_WAITLIST_TAG }] });
    }
    if (href.endsWith("/tags") && init?.method === "POST") {
      assigned.push(JSON.parse(String(init.body)));
      return new Response(null, { status: 204 });
    }
    return new Response(null, { status: 204 });
  }) as never);

  assert.equal(await systeme.upsertAndTag(VALID.name, VALID.email, COACHING_WAITLIST_TAG), "assigned");
  assert.deepEqual(requested, [COACHING_WAITLIST_TAG]);
  assert.deepEqual(assigned, [{ tagId: 99 }]);
});

test("WAITLIST 16: the two flows cannot reach each other's tag", () => {
  assert.equal(COACHING_WAITLIST_TAG, "zajem-osobni-vedeni-1-1");
  assert.equal(LEAD_MAGNET_TAG, "Lead-magnet");
  assert.notEqual(COACHING_WAITLIST_TAG, LEAD_MAGNET_TAG);

  // Lead magnets must keep passing their own tag explicitly.
  assert.match(
    readSource("lib/lead-magnets/orchestrator.ts"),
    /upsertAndTag\(submission\.name, submission\.email, LEAD_MAGNET_TAG\)/
  );
  assert.ok(!readSource("lib/waitlist/orchestrator.ts").includes("LEAD_MAGNET_TAG"));
});

test("WAITLIST 17: without a Systeme key the sign-up fails instead of storing nothing quietly", () => {
  const source = readSource("lib/waitlist/subscribe.ts");

  assert.match(source, /if \(!systemeApiKey\) throw new IntegrationError\("systeme_api_key_missing"\)/);
  // Unlike the lead magnets, which fall back to a null client and still
  // deliver the PDF, there is nothing here to fall back to.
  assert.ok(!source.includes("? createSystemeClient"), "no optional Systeme client");
});
