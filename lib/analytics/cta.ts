// Marking for the main calls to action, read by components/analytics/
// cta-tracking.tsx and forwarded to GTM as a `cta_click` custom event.
//
// Elements are marked with data attributes rather than onClick handlers so
// that server components (Header, Hero, the homepage sections) stay server
// components - a single delegated listener in one client component does the
// work for all of them. It also means one listener per page instead of one
// per button, and a click on an icon *inside* a button still resolves to the
// button, because the listener walks up with closest().

export const CTA_EVENT = "cta_click";

/** The surface the element sits on. */
export type CtaLocation =
  | "desktop_nav"
  | "mobile_nav"
  | "header_cta"
  | "hero"
  | "home_cards"
  | "home_paths"
  | "home_app"
  | "home_final_cta";

/** Which offer the click is heading for - not the URL, which may change. */
export type CtaTarget =
  | "meal_plan"
  | "personal_support"
  | "fit_talir"
  | "challenge_21_day";

export type CtaMark = {
  /** Stable id for this element, e.g. "header_meal_plan". Never generated. */
  id: string;
  location: CtaLocation;
  target: CtaTarget;
};

export type CtaDataAttributes = {
  "data-cta-id": string;
  "data-cta-location": CtaLocation;
  "data-cta-target": CtaTarget;
};

/**
 * Spread onto the anchor that is the call to action:
 *   <Button href={...} {...ctaAttrs({ id, location, target })}>
 *
 * Passing `undefined` yields no attributes, so a shared component can take an
 * optional mark and stay untracked wherever it is not passed one.
 */
export function ctaAttrs(mark: CtaMark): CtaDataAttributes;
export function ctaAttrs(mark: CtaMark | undefined): Partial<CtaDataAttributes>;
export function ctaAttrs(mark: CtaMark | undefined): Partial<CtaDataAttributes> {
  if (!mark) {
    return {};
  }

  return {
    "data-cta-id": mark.id,
    "data-cta-location": mark.location,
    "data-cta-target": mark.target,
  };
}
