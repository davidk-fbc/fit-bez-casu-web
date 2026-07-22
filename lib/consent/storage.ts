import {
  CONSENT_MAX_AGE_MS,
  CONSENT_SCHEMA_VERSION,
  CONSENT_STORAGE_KEY,
  type ConsentState,
  type ConsentPreference
} from "@/lib/consent/types";

function isValidConsentState(value: unknown): value is ConsentState {
  return value === "granted" || value === "denied";
}

function isValidUpdatedAt(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isExpired(updatedAt: string): boolean {
  return Date.now() - Date.parse(updatedAt) > CONSENT_MAX_AGE_MS;
}

function isValidConsentPreference(value: unknown): value is ConsentPreference {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    record.version === CONSENT_SCHEMA_VERSION &&
    isValidConsentState(record.analytics) &&
    isValidConsentState(record.marketing) &&
    isValidUpdatedAt(record.updatedAt)
  );
}

/**
 * Returns null for every "no valid, current preference exists" case -
 * missing key, corrupted JSON, wrong schema version, invalid analytics/
 * marketing value, invalid/unparseable updatedAt, an expired (>12 months)
 * value, or localStorage being unavailable. Callers must treat null as
 * "unset", not as an error to surface.
 */
export function readConsentPreference(): ConsentPreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isValidConsentPreference(parsedValue)) {
      return null;
    }

    if (isExpired(parsedValue.updatedAt)) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

/**
 * Always returns the preference object (even if localStorage itself is
 * unavailable) so the caller can still hold the decision in memory for the
 * current page load - a write failure must never block the in-session
 * consent state from taking effect.
 */
export function writeConsentPreference(analytics: ConsentState, marketing: ConsentState): ConsentPreference {
  const preference: ConsentPreference = {
    version: CONSENT_SCHEMA_VERSION,
    analytics,
    marketing,
    updatedAt: new Date().toISOString()
  };

  if (typeof window === "undefined") {
    return preference;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // localStorage can be unavailable (private browsing, quota, disabled
    // storage). The caller still applies the in-memory decision for this
    // page load; it just won't survive a reload.
  }

  return preference;
}
