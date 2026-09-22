import { digest, getRequestIp, jsonResponse as json, readJsonBody } from "../http/subscribe-request";
import { IntegrationError } from "../lead-magnets/integration-error";
import type { MemoryRateLimiter } from "../lead-magnets/rate-limit";
import { parseWaitlistSubmission, type WaitlistSubmission } from "./validation";

/**
 * The 1:1 waitlist endpoint.
 *
 * Kept next to the lead-magnet handler rather than inside it: the two share
 * their guards (lib/http/subscribe-request.ts) and their rate limiter, but
 * differ in what they accept, what they do and - most of all - what they do
 * when the marketing sync fails. One endpoint with a branch for each would
 * be harder to read than two that are each five lines of their own logic.
 */
export type WaitlistHandlerDependencies = {
  subscribe: (submission: WaitlistSubmission) => Promise<unknown>;
  limiter: MemoryRateLimiter;
};

export async function handleWaitlistSubscribe(request: Request, dependencies: WaitlistHandlerDependencies) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = parseWaitlistSubmission(body.value);
  if (!parsed.ok) return json({ ok: false, error: "invalid_input", fields: parsed.fields }, 400);

  // A filled honeypot gets the same answer a person gets, so a bot learns
  // nothing from the response - but nothing is stored.
  if (parsed.value.website) return json({ ok: true }, 200);

  const ipHash = digest(getRequestIp(request));
  const emailHash = digest(parsed.value.email);
  const limit = dependencies.limiter.check([
    { prefix: "waitlist-ip", identifier: ipHash, limit: 8, windowMs: 15 * 60 * 1000 },
    // Signing up twice is a mistake, not a use case: the tag is idempotent.
    { prefix: "waitlist-email", identifier: emailHash, limit: 3, windowMs: 60 * 60 * 1000 },
  ]);
  if (!limit.allowed) {
    return json({ ok: false, error: "rate_limited" }, 429, { "retry-after": String(limit.retryAfterSeconds) });
  }

  try {
    await dependencies.subscribe(parsed.value);
    return json({ ok: true }, 200);
  } catch (error) {
    // The code names the step that failed - a missing tag and an unreachable
    // API look identical to her, but not to us. Nothing identifying is
    // logged; the e-mail is already hashed above for the limiter only.
    const code = error instanceof IntegrationError ? error.code : "unknown";
    console.error("waitlist_signup_failed", { code });

    // Deliberately not `{ ok: true }`. Being on this list is the only thing
    // the form does, so a failure she cannot see would be a promise we
    // silently break at launch.
    return json({ ok: false, error: "signup_failed" }, 502);
  }
}
