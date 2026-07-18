import { EXTERNAL_LINKS } from "./links";

export type NavLink = {
  label: string;
  href: string;
};

// Single source of truth for header/footer nav. Jídelníček a Aplikace vedou
// na externí produktové URL (viz lib/links.ts). Zdarma zatím nemá vlastní
// podstránku, proto míří na homepage kotvu (funguje i z /blog a /o-nas).
export const NAV_LINKS: NavLink[] = [
  { label: "Jídelníček", href: EXTERNAL_LINKS.mealPlan },
  { label: "Aplikace", href: EXTERNAL_LINKS.app },
  { label: "Zdarma", href: "/#zdarma" },
  { label: "Blog", href: "/blog" },
  { label: "O nás", href: "/o-nas" },
];

// External sales/community destination — replace with the real URL when available.
export const COMMUNITY_URL = "#komunita";

export const HERO_PRIMARY_CTA = { label: "Mrknout na jídelníček", href: EXTERNAL_LINKS.mealPlan };
export const HERO_SECONDARY_CTA = { label: "Poznat aplikaci", href: EXTERNAL_LINKS.app };
