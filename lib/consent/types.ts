export type ConsentState = "granted" | "denied";

export type ConsentPreference = {
  version: 1;
  analytics: ConsentState;
  marketing: ConsentState;
  updatedAt: string;
};

// Its own key, unrelated to any other app's storage - consent is per
// browser/device for this site only.
export const CONSENT_STORAGE_KEY = "fit-bez-casu-web-consent";

// Bump this whenever the stored shape changes (a new category, a renamed
// field). Any preference stored under an older/unknown version fails
// isValidConsentPreference's check in lib/consent/storage.ts and is
// treated as if it never existed - the banner reappears automatically
// instead of silently assuming the old decision still applies.
export const CONSENT_SCHEMA_VERSION = 1;

// A stored preference older than this is treated as if it never existed -
// the banner reappears rather than silently keeping a year-old decision.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
