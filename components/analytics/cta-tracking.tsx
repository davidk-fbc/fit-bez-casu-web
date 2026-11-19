"use client";

import { useEffect } from "react";
import { CTA_EVENT } from "@/lib/analytics/cta";
import type { CtaLocation, CtaTarget } from "@/lib/analytics/cta";

// One delegated click listener for every element marked with ctaAttrs().
//
// Why delegation rather than an onClick on each button:
//
// 1. The marked elements live in server components (Header, Hero, the
//    homepage sections). Giving them handlers would turn each into a client
//    component; a data attribute costs nothing and keeps them on the server.
// 2. "Once per activation" falls out of it. A click on the arrow icon inside
//    a button bubbles to that one anchor, and closest() resolves it to the
//    same element the listener would have seen for a click on its text, so
//    one activation is one event. Keyboard activation needs no extra case:
//    Enter on a link (and Enter/Space on a button) dispatches a click, which
//    bubbles here like any other.
// 3. Nothing calls preventDefault, so the link navigates exactly as before.
//    The push is synchronous, so it is in dataLayer before the navigation
//    starts.
//
// Consent: this pushes to dataLayer unconditionally and deliberately. The
// push itself sends nothing anywhere - whether a tag acts on the event is
// decided inside the GTM container, by the Consent Mode v2 state that
// components/analytics/consent-mode.tsx maintains. Gating the push here
// would move that decision out of GTM and quietly break it.
//
// Privacy: only the three marked attributes and the element's own visible
// label are sent. No URL, no query parameters, no form values, nothing the
// visitor typed.
export function CtaTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const element = target.closest<HTMLElement>("[data-cta-id]");

      if (!element) {
        return;
      }

      const id = element.dataset.ctaId;
      const location = element.dataset.ctaLocation as CtaLocation | undefined;
      const ctaTarget = element.dataset.ctaTarget as CtaTarget | undefined;

      // A half-marked element is a mistake at the call site, not something to
      // paper over with partial data in the report.
      if (!id || !location || !ctaTarget) {
        return;
      }

      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: CTA_EVENT,
        cta_id: id,
        cta_location: location,
        cta_target: ctaTarget,
        // The label as rendered. textContent also picks up the arrow icon,
        // which is an <svg> and contributes no text, so this is exactly what
        // the reader sees on the button.
        cta_text: (element.textContent ?? "").replace(/\s+/g, " ").trim(),
      });
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
