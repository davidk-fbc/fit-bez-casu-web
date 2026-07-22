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
};

// gtag.js's real (post-load) implementation reads whatever was queued into
// dataLayer via `arguments` objects - this type only needs to describe
// "something array-like that got pushed", never the values themselves.
export type DataLayerEntry = IArguments | unknown[];

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: GtagFunction;
  }
}

export {};
