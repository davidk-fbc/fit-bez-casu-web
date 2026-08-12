import { createHash } from "node:crypto";
import { IntegrationError } from "./integration-error";
import { MemoryRateLimiter } from "./rate-limit";
import { parseLeadMagnetSubmission, type LeadMagnetSubmission } from "./validation";

const MAX_BODY_BYTES = 4096;

export type SubscribeHandlerDependencies = {
  fulfill: (submission: LeadMagnetSubmission) => Promise<unknown>;
  limiter: MemoryRateLimiter;
};

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  return value.slice(0, 80);
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function readLimitedBody(request: Request): Promise<string | null> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return null;
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    output += decoder.decode(value, { stream: true });
  }
  return output + decoder.decode();
}

export async function handleLeadMagnetSubscribe(request: Request, dependencies: SubscribeHandlerDependencies) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "unsupported_media_type" }, 415);
  }

  const body = await readLimitedBody(request);
  if (body === null) return json({ ok: false, error: "payload_too_large" }, 413);

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(body);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = parseLeadMagnetSubmission(parsedBody);
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
