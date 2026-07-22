"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/components/consent/consent-provider";
import type { GtagConsentParams, GtagFunction } from "@/lib/analytics/gtag-types";

// Google Consent Mode v2 bridge for the Google Tag Manager container loaded
// in app/layout.tsx. GA4, Meta Pixel and Microsoft Clarity are configured
// entirely inside that GTM container, not in app code - this component only
// ever pushes consent signals into window.dataLayer, never loads any of
// those tags directly.
//
// Two responsibilities, kept together because they share the same "is the
// user's decision known yet" state:
//
// 1. A `beforeInteractive` inline script that pushes the *default* consent
//    state into window.dataLayer as early as possible - strictly before any
//    `afterInteractive` script (including GTM's own loader in
//    <GoogleTagManager>) can run, so every tag configured inside the GTM
//    container always sees a default before it evaluates whether it's
//    allowed to fire. Runs unconditionally on every page load, regardless of
//    any stored decision.
//
// 2. A client-side effect that reacts to the cookie-consent system
//    (useConsent()) and pushes a `consent update` once the user's decision
//    is actually known (status === "decided") - both for a fresh decision
//    from the banner/dialog and for a decision already stored from a
//    previous visit (ConsentProvider resolves "loading" straight to
//    "decided" on mount in that case). Fires again immediately, with no
//    reload, whenever analytics/marketing change (accept/reject/save,
//    including revoking a previously granted category).
//
// Two independent categories drive this: `analytics` (GA4, Microsoft
// Clarity) maps to analytics_storage; `marketing` (Meta Pixel, Meta
// Conversions API) maps to ad_storage/ad_user_data/ad_personalization/
// personalization_storage together, since Google treats those four as one
// group.
const DEFAULT_CONSENT_SCRIPT = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
`;

function ensureGtagStub(): GtagFunction {
  window.dataLayer = window.dataLayer || [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    } as GtagFunction;
  }

  return window.gtag;
}

export function ConsentMode() {
  const { status, analytics, marketing } = useConsent();

  useEffect(() => {
    if (status !== "decided") {
      return;
    }

    const gtag = ensureGtagStub();

    const marketingState = marketing === "granted" ? "granted" : "denied";

    const params: GtagConsentParams = {
      analytics_storage: analytics === "granted" ? "granted" : "denied",
      ad_storage: marketingState,
      ad_user_data: marketingState,
      ad_personalization: marketingState,
      personalization_storage: marketingState,
      functionality_storage: "granted",
      security_storage: "granted"
    };

    gtag("consent", "update", params);
  }, [status, analytics, marketing]);

  return (
    <Script
      id="consent-mode-default"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: DEFAULT_CONSENT_SCRIPT }}
    />
  );
}
