"use client";

import type { ReactNode } from "react";
import { useConsent } from "@/components/consent/consent-provider";

/**
 * A real <button type="button"> that opens the shared consent settings
 * dialog - used from Footer so every page opens the exact same global
 * dialog instead of each owning its own copy.
 */
export function ConsentSettingsButton({ className, children }: { className?: string; children: ReactNode }) {
  const { openSettings } = useConsent();

  return (
    <button type="button" onClick={openSettings} className={className}>
      {children}
    </button>
  );
}
