"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import type { ConsentState } from "@/lib/consent/types";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// A local (not-yet-saved) toggle a user can flip while the dialog is open,
// independent of the two-value ConsentState the rest of the app persists -
// only turned into "granted"/"denied" once "Uložit nastavení" is actually
// pressed (handleSave below).
function ConsentToggle({
  checked,
  onChange,
  labelledBy
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)] focus-visible:ring-offset-2"
      style={{ background: checked ? "var(--gradient-brand)" : "var(--color-border-light)" }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function ConsentSettingsDialog() {
  const { isSettingsOpen, closeSettings, analytics, marketing, acceptAll, savePreferences } = useConsent();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);

  // Re-syncs the local toggles to the currently persisted decision every
  // time the dialog opens (fresh visit -> both false; reopened later via
  // the footer link -> reflects what's actually active) - never while it's
  // already open, so mid-edit toggling isn't clobbered by an unrelated
  // re-render.
  // Resets the dialog's own local (not-yet-saved) toggle state to match the
  // persisted decision at the moment the dialog opens - not state derived
  // from props during normal rendering, so it can't be computed inline
  // during render.
  useEffect(() => {
    if (isSettingsOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setAnalyticsChecked(analytics === "granted");
      setMarketingChecked(marketing === "granted");
    }
  }, [isSettingsOpen, analytics, marketing]);

  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const panel = panelRef.current;
    const focusableElements = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    focusableElements[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSettings();
        return;
      }

      if (event.key !== "Tab" || !panel) {
        return;
      }

      const elements = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

      if (elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) {
    return null;
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeSettings();
    }
  }

  function handleSave() {
    const selection: { analytics: ConsentState; marketing: ConsentState } = {
      analytics: analyticsChecked ? "granted" : "denied",
      marketing: marketingChecked ? "granted" : "denied"
    };

    savePreferences(selection);
    closeSettings();
  }

  function handleAcceptAll() {
    acceptAll();
    closeSettings();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-dark)]/40 px-4 py-[max(1.5rem,env(safe-area-inset-top))]"
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-settings-title"
        className="flex max-h-[min(90dvh,640px)] w-full max-w-md flex-col overflow-y-auto rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
      >
        <h2 id="consent-settings-title" className="text-lg font-semibold text-[var(--color-text)]">
          Nastavení cookies
        </h2>

        <div className="mt-5 rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 id="consent-necessary-title" className="text-sm font-semibold text-[var(--color-text)]">
              Nezbytné
            </h3>
            <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-1 text-xs font-medium text-[var(--color-text)]">
              Vždy aktivní
            </span>
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--color-text-muted)]">
            Umožňují základní fungování webu.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 id="consent-analytics-title" className="text-sm font-semibold text-[var(--color-text)]">
              Analytické
            </h3>
            <ConsentToggle checked={analyticsChecked} onChange={setAnalyticsChecked} labelledBy="consent-analytics-title" />
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--color-text-muted)]">
            Google Analytics a Microsoft Clarity.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--color-border-light)] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 id="consent-marketing-title" className="text-sm font-semibold text-[var(--color-text)]">
              Marketingové
            </h3>
            <ConsentToggle checked={marketingChecked} onChange={setMarketingChecked} labelledBy="consent-marketing-title" />
          </div>
          <p className="mt-2 break-words text-sm leading-6 text-[var(--color-text-muted)]">
            Meta Pixel a Meta Conversions API.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(139,60,249,0.6)] transition hover:brightness-110"
            style={{ background: "var(--gradient-brand)" }}
          >
            Uložit nastavení
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[var(--color-border-light)] px-4 text-sm font-semibold text-[var(--color-text)] transition hover:bg-black/[0.03]"
          >
            Přijmout vše
          </button>
          <button
            type="button"
            onClick={closeSettings}
            className="inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-black/[0.03]"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  );
}
