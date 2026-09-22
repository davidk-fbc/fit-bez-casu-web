import { digest, getRequestIp, jsonResponse as json, readJsonBody } from "../http/subscribe-request";
import { IntegrationError } from "./integration-error";
import { MemoryRateLimiter } from "./rate-limit";
import { parseLeadMagnetSubmission, type LeadMagnetSubmission } from "./validation";

export type SubscribeHandlerDependencies = {
  fulfill: (submission: LeadMagnetSubmission) => Promise<unknown>;
  limiter: MemoryRateLimiter;
};

export async function handleLeadMagnetSubscribe(request: Request, dependencies: SubscribeHandlerDependencies) {
  const body = await readJsonBody(request);
  if (!body.ok) return body.response;

  const parsed = parseLeadMagnetSubmission(body.value);
  if (!parsed.ok) return json({ ok: false, error: "invalid_input", fields: parsed.fields }, 400);

  if (parsed.value.website) return json({ ok: true }, 200);

  const ipHash = digest(getRequestIp(request));
  const emailHash = digest(parsed.value.email);
  const limit = dependencies.limiter.check([
    { prefix: "ip", identifier: ipHash, limit: 8, windowMs: 15 * 60 * 1000 },
    { prefix: "email", identifier: emailHash, limit: 5, windowMs: 60 * 60 * 1000 },
    {
      prefix: "email-magnet",
      identifier: `${emailHash}:${parsed.value.magnetId}`,
      limit: 3,
      windowMs: 60 * 60 * 1000,
    },
  ]);
  if (!limit.allowed) {
    return json(
      { ok: false, error: "rate_limited" },
      429,
      { "retry-after": String(limit.retryAfterSeconds) },
    );
  }

  try {
    await dependencies.fulfill(parsed.value);
    return json({ ok: true }, 200);
  } catch (error) {
    const code = error instanceof IntegrationError ? error.code : "unknown";
    console.error("lead_magnet_delivery_failed", { code, magnetId: parsed.value.magnetId });
    return json({ ok: false, error: "delivery_failed" }, 502);
  }
}
