import { EXTERNAL_LINKS } from "./links";
import type { CtaMark } from "./analytics/cta";

export type NavLink = {
  label: string;
  href: string;
  /**
   * Set only on the destinations that are an offer we measure. Zdarma, Blog
   * and O nás are pages, not offers, so they carry no mark and fire nothing.
   * The id names the link; the surface rendering it supplies the location,
   * so the same entry reports as desktop_nav or mobile_nav.
   */
  cta?: Omit<CtaMark, "location">;
};

// Single source of truth for header/footer nav. Jídelníček a Aplikace vedou
// na externí produktové URL (viz lib/links.ts), ostatní položky na veřejné
// stránky tohoto webu.
export const SUPPORT_OFFER_PATH = "/nabidka-podpory";
export const HEADER_CTA = {
  label: "Chci jídelníček",
  href: EXTERNAL_LINKS.mealPlan,
  cta: { id: "header_meal_plan", target: "meal_plan" } satisfies Omit<CtaMark, "location">,
};

export const NAV_LINKS: NavLink[] = [
  { label: "Jídelníček", href: EXTERNAL_LINKS.mealPlan, cta: { id: "nav_meal_plan", target: "meal_plan" } },
  { label: "Fit Talíř", href: EXTERNAL_LINKS.app, cta: { id: "nav_fit_talir", target: "fit_talir" } },
  // The support offer page existed with no way in from anywhere on the site.
  // One entry, not one per service - the page itself is the chooser.
  { label: "Osobní podpora", href: SUPPORT_OFFER_PATH, cta: { id: "nav_support", target: "personal_support" } },
  { label: "Zdarma", href: "/zdarma" },
  { label: "Blog", href: "/blog" },
  { label: "O nás", href: "/o-nas" },
];

// Odvozeno z jediného centrálního zdroje (lib/links.ts), žádná URL se
// nezadává ručně na dvou místech.
export const COMMUNITY_URL = EXTERNAL_LINKS.community;

export const HERO_PRIMARY_CTA = { label: "Mrknout na jídelníček", href: EXTERNAL_LINKS.mealPlan };
export const HERO_SECONDARY_CTA = { label: "Poznat Fit Talíř", href: EXTERNAL_LINKS.app };
