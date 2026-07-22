"use client";

import { useConsent } from "@/components/consent/consent-provider";

/**
 * A non-modal, non-blocking bottom panel - not a dialog. It never traps
 * focus or blocks page scroll, and only renders while status is exactly
 * "unset" (never during "loading", so it can't flash before the stored
 * preference has actually been read).
 */
export function ConsentBanner() {
  const { status, acceptAll, rejectOptional, openSettings } = useConsent();

  if (status !== "unset") {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border-light)] bg-[var(--color-surface)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_24px_rgba(20,10,60,0.12)] sm:px-6"
      role="region"
      aria-labelledby="consent-banner-title"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 id="consent-banner-title" className="text-sm font-semibold text-[var(--color-text)]">
            Nastavení soukromí
          </h2>
          <p className="mt-1 break-words text-sm leading-6 text-[var(--color-text-muted)]">
            Pro fungování webu používáme nezbytné technologie. S tvým souhlasem můžeme zapnout analytické a
            marketingové nástroje, které nám pomáhají zjistit, co funguje a co můžeme zlepšit.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(139,60,249,0.6)] transition hover:brightness-110"
            style={{ background: "var(--gradient-brand)" }}
          >
            Přijmout vše
          </button>
          <button
            type="button"
            onClick={rejectOptional}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-border-light)] px-5 text-sm font-semibold text-[var(--color-text)] transition hover:bg-black/[0.03]"
          >
            Odmítnout volitelné
          </button>
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-black/[0.03]"
          >
            Upravit nastavení
          </button>
        </div>
      </div>
    </div>
  );
}
