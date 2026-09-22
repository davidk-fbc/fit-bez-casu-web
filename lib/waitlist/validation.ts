/**
 * What the coaching waitlist form submits.
 *
 * Deliberately not the lead-magnet validator with `magnetId` made optional:
 * the two forms accept different things, and a shared validator with an
 * optional field would let a waitlist payload carry a magnetId that nothing
 * downstream reads.
 */

export type WaitlistSubmission = {
  name: string;
  email: string;
  consent: true;
  /** Honeypot. A real person leaves it empty; a bot fills every field it finds. */
  website: string;
};

export type WaitlistValidation =
  | { ok: true; value: WaitlistSubmission }
  | { ok: false; fields: readonly ("name" | "email" | "consent" | "website")[] };

const ALLOWED_KEYS = new Set(["name", "email", "consent", "website"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export function parseWaitlistSubmission(input: unknown): WaitlistValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, fields: ["name", "email"] };
  }

  const record = input as Record<string, unknown>;
  // An unexpected key means the payload was not built by our form.
  if (Object.keys(record).some((key) => !ALLOWED_KEYS.has(key))) {
    return { ok: false, fields: ["name", "email"] };
  }

  const fields: ("name" | "email" | "consent" | "website")[] = [];

  const name = typeof record.name === "string" ? record.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 80 || CONTROL_CHARACTERS.test(name)) fields.push("name");

  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) fields.push("email");

  // Consent is the legal basis for writing to her later. Without it there is
  // nothing to store, so this is a hard failure rather than a default.
  if (record.consent !== true) fields.push("consent");

  const website = typeof record.website === "string" ? record.website.trim() : "";
  if (website.length > 200) fields.push("website");

  if (fields.length > 0) return { ok: false, fields };

  return { ok: true, value: { name, email, consent: true, website } };
}
