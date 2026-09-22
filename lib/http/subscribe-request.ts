import { createHash } from "node:crypto";

/**
 * The plumbing every public sign-up endpoint needs before it can look at
 * what was submitted: bounded reading, a JSON response with no caching, and
 * a hashed identifier for rate limiting.
 *
 * Extracted from the lead-magnet handler when the 1:1 waitlist needed the
 * same guards. The alternative was either copying sixty lines or turning one
 * endpoint into a switch over two unrelated flows - the guards are shared,
 * the flows are not.
 */

/** Enough for a name, an e-mail and a consent flag; anything larger is not a form submission. */
const MAX_BODY_BYTES = 4096;

export function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

/** Never the raw address: it is only ever needed as a rate-limit key. */
export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
  return value.slice(0, 80);
}

export function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * Reads at most MAX_BODY_BYTES and returns null past it, checking the
 * declared length first and then the bytes actually arriving - a
 * content-length header is a claim, not a limit.
 */
export async function readLimitedBody(request: Request): Promise<string | null> {
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

export type ParsedBody = { ok: true; value: unknown } | { ok: false; response: Response };

/** Content type, size and JSON validity - the checks that come before any field is read. */
export async function readJsonBody(request: Request): Promise<ParsedBody> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return { ok: false, response: jsonResponse({ ok: false, error: "unsupported_media_type" }, 415) };
  }

  const body = await readLimitedBody(request);
  if (body === null) return { ok: false, response: jsonResponse({ ok: false, error: "payload_too_large" }, 413) };

  try {
    return { ok: true, value: JSON.parse(body) };
  } catch {
    return { ok: false, response: jsonResponse({ ok: false, error: "invalid_json" }, 400) };
  }
}
