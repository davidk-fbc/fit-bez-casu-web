export type NavLink = {
  label: string;
  href: string;
};

// Single source of truth for header/footer nav. Jídelníček, Aplikace a
// Zdarma zatím nemají vlastní podstránku, proto míří na homepage kotvy
// (funguje i z /blog a /o-nas). Update once those subpages exist.
export const NAV_LINKS: NavLink[] = [
  { label: "Jídelníček", href: "/#jidelnicek" },
  { label: "Aplikace", href: "/#aplikace" },
  { label: "Zdarma", href: "/#zdarma" },
  { label: "Blog", href: "/blog" },
  { label: "O nás", href: "/o-nas" },
];

// External sales/community destination — replace with the real URL when available.
export const COMMUNITY_URL = "#komunita";

export const HERO_PRIMARY_CTA = { label: "Mrknout na jídelníček", href: "#jidelnicek" };
export const HERO_SECONDARY_CTA = { label: "Poznat aplikaci", href: "#aplikace" };
