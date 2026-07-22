"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { readConsentPreference, writeConsentPreference } from "@/lib/consent/storage";
import type { ConsentState } from "@/lib/consent/types";

// Whether a stored decision exists yet at all - "loading" both during SSR
// and before the first client effect runs (see below), "unset" once the
// read has happened and found nothing valid, "decided" once a real
// analytics/marketing pair is known (fresh or from a previous visit).
export type ConsentDecisionState = "loading" | "unset" | "decided";

export type ConsentSelection = {
  analytics: ConsentState;
  marketing: ConsentState;
};

type ConsentContextValue = {
  status: ConsentDecisionState;
  analytics: ConsentState;
  marketing: ConsentState;
  acceptAll: () => void;
  rejectOptional: () => void;
  savePreferences: (selection: ConsentSelection) => void;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

// How long the "saved" confirmation stays visible after a real user
// action, in milliseconds - not exposed on the context, this is purely an
// internal presentation detail of the provider.
const SAVED_CONFIRMATION_VISIBLE_MS = 3000;

// Both categories default to "denied" until a real decision (fresh or
// stored) is known - never used to decide whether to render the banner
// (that's `status`), only as the in-memory value while status is still
// "loading"/"unset" so consent-mode.tsx always has a concrete pair to read.
const DEFAULT_SELECTION: ConsentSelection = { analytics: "denied", marketing: "denied" };

/**
 * Status starts as "loading" (both during SSR and before the first client
 * effect runs) so nothing that depends on it - the banner, Consent Mode's
 * update push - ever renders/decides based on a guessed value. It only
 * becomes "unset" or "decided" once the real localStorage read has
 * happened.
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentDecisionState>("loading");
  const [selection, setSelection] = useState<ConsentSelection>(DEFAULT_SELECTION);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedConfirmationVisible, setIsSavedConfirmationVisible] = useState(false);
  const savedConfirmationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = readConsentPreference();

    // Must read localStorage client-only (unavailable during SSR); initial
    // state stays "loading" so the server-rendered and first client render
    // match, avoiding a hydration mismatch. This effect performs the
    // one-time client-only read and is not a derived-state anti-pattern.
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setSelection({ analytics: stored.analytics, marketing: stored.marketing });
      setStatus("decided");
    } else {
      setStatus("unset");
    }
  }, []);

  // Cleans up the confirmation timer if the provider itself ever unmounts
  // (e.g. Fast Refresh) while it's pending - never a real cross-navigation
  // case since ConsentProvider wraps the whole app in app/layout.tsx.
  useEffect(() => {
    return () => {
      if (savedConfirmationTimeoutRef.current) {
        clearTimeout(savedConfirmationTimeoutRef.current);
      }
    };
  }, []);

  // Only ever called from a real user action (accept/decline/save), never
  // from the initial storage read - restarts the auto-hide timer on every
  // call so a rapid second click doesn't cut the first confirmation's timer
  // short or leave two overlapping timeouts running.
  const showSavedConfirmation = useCallback(() => {
    if (savedConfirmationTimeoutRef.current) {
      clearTimeout(savedConfirmationTimeoutRef.current);
    }

    setIsSavedConfirmationVisible(true);

    savedConfirmationTimeoutRef.current = setTimeout(() => {
      setIsSavedConfirmationVisible(false);
      savedConfirmationTimeoutRef.current = null;
    }, SAVED_CONFIRMATION_VISIBLE_MS);
  }, []);

  const persist = useCallback(
    (next: ConsentSelection) => {
      writeConsentPreference(next.analytics, next.marketing);
      setSelection(next);
      setStatus("decided");
      showSavedConfirmation();
    },
    [showSavedConfirmation]
  );

  const acceptAll = useCallback(() => {
    persist({ analytics: "granted", marketing: "granted" });
  }, [persist]);

  const rejectOptional = useCallback(() => {
    persist({ analytics: "denied", marketing: "denied" });
  }, [persist]);

  const savePreferences = useCallback(
    (next: ConsentSelection) => {
      persist(next);
    },
    [persist]
  );

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      status,
      analytics: selection.analytics,
      marketing: selection.marketing,
      acceptAll,
      rejectOptional,
      savePreferences,
      openSettings,
      closeSettings,
      isSettingsOpen
    }),
    [status, selection, acceptAll, rejectOptional, savePreferences, openSettings, closeSettings, isSettingsOpen]
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {isSavedConfirmationVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          style={{ bottom: 0 }}
        >
          <div className="rounded-full border border-[var(--color-border-dark)] bg-[var(--color-dark)] px-4 py-2 text-xs font-medium text-white shadow-lg">
            Nastavení soukromí bylo uloženo.
          </div>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }

  return context;
}
