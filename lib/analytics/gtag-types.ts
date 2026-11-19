// Minimal typed surface for the handful of gtag.js commands this app
// actually sends - not a general-purpose gtag.js type definition. Adding a
// command here that isn't used would just hide real mistakes behind a
// wider-than-necessary type.

export type ConsentState = "granted" | "denied";

export type GtagConsentParams = {
  analytics_storage: ConsentState;
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  personalization_storage: ConsentState;
  functionality_storage: ConsentState;
  security_storage: ConsentState;
};

export type GtagFunction = {
  (command: "consent", action: "default" | "update", params: GtagConsentParams): void;
  (
    command: "event",
    action: "lead_magnet_open" | "lead_magnet_submit" | "lead_magnet_success",
    params: { magnet_id: string },
  ): void;
};

// Two shapes end up in dataLayer here, and they are not interchangeable:
//
// - gtag.js commands, queued as `arguments` objects. gtag.js's real
//   (post-load) implementation reads those itself, so this type only has to
//   say "something array-like got pushed", never what was in it.
// - GTM custom events: a plain object carrying an `event` name plus its
//   parameters. This is what a GTM Custom Event trigger listens for, and
//   what lib/analytics/cta.ts pushes for `cta_click`.
export type DataLayerEventObject = {
  event: string;
  [parameter: string]: unknown;
};

export type DataLayerEntry = IArguments | unknown[] | DataLayerEventObject;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: GtagFunction;
  }
}

export {};
