import { isLeadMagnetId, type LeadMagnetId } from "../free-lead-magnets";

export type LeadMagnetSubmission = {
  name: string;
  email: string;
  magnetId: LeadMagnetId;
  marketingConsent: boolean;
  website: string;
};

export type ValidationResult =
  | { ok: true; value: LeadMagnetSubmission }
  | { ok: false; fields: readonly ("name" | "email" | "magnetId" | "marketingConsent" | "website")[] };

const ALLOWED_KEYS = new Set(["name", "email", "magnetId", "marketingConsent", "website"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLeadMagnetSubmission(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, fields: ["name", "email", "magnetId"] };
  }

  const record = input as Record<string, unknown>;
  const fields: ("name" | "email" | "magnetId" | "marketingConsent" | "website")[] = [];
  if (Object.keys(record).some((key) => !ALLOWED_KEYS.has(key))) fields.push("magnetId");

  const name = typeof record.name === "string" ? record.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name)) fields.push("name");

  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) fields.push("email");

  if (!isLeadMagnetId(record.magnetId)) fields.push("magnetId");
  if (record.marketingConsent !== undefined && typeof record.marketingConsent !== "boolean") {
    fields.push("marketingConsent");
  }

  const website = record.website === undefined ? "" : typeof record.website === "string" ? record.website.trim() : "invalid";
  if (website.length > 200) fields.push("website");

  if (fields.length > 0 || !isLeadMagnetId(record.magnetId)) {
    return { ok: false, fields: [...new Set(fields)] };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      magnetId: record.magnetId,
      marketingConsent: record.marketingConsent === true,
      website,
    },
  };
}
