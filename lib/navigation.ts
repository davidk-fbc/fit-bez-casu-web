export type NavLink = {
  label: string;
  href: string;
};

// Single source of truth for header/footer nav. Update hrefs here once
// the real subpages (jídelníček, aplikace, zdarma, blog, o nás) exist.
export const NAV_LINKS: NavLink[] = [
  { label: "Jídelníček", href: "#jidelnicek" },
  { label: "Aplikace", href: "#aplikace" },
  { label: "Zdarma", href: "#zdarma" },
  { label: "Blog", href: "#blog" },
  { label: "O nás", href: "#o-nas" },
];

// External sales/community destination — replace with the real URL when available.
export const COMMUNITY_URL = "#komunita";

export const HERO_PRIMARY_CTA = { label: "Mrknout na jídelníček", href: "#jidelnicek" };
export const HERO_SECONDARY_CTA = { label: "Poznat aplikaci", href: "#aplikace" };
