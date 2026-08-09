export const SUPPORT_OFFER_INDEXABLE_SLUGS = [
  "nabidka-podpory",
  "nabidka-podpory/osobni-rozbor-jidelnicku",
  "nabidka-podpory/emailova-konzultace",
] as const;

export type SupportOfferIndexableSlug = (typeof SUPPORT_OFFER_INDEXABLE_SLUGS)[number];

type SupportOfferSeo = {
  title: string;
  description: string;
};

const SUPPORT_OFFER_SEO: Record<SupportOfferIndexableSlug, SupportOfferSeo> = {
  "nabidka-podpory": {
    title: "Podpora při hubnutí | Fit bez času",
    description:
      "Vyber si podporu při hubnutí podle toho, co právě potřebuješ: osobní rozbor jídelníčku, 4týdenní podporu nebo připravované osobní vedení.",
  },
  "nabidka-podpory/osobni-rozbor-jidelnicku": {
    title: "Osobní rozbor jídelníčku | Fit bez času",
    description:
      "Z 5 běžných dní získáš osobní rozbor jídelníčku, konkrétní zhodnocení, hlavní brzdy výsledků a doporučení, na co se zaměřit jako první.",
  },
  "nabidka-podpory/emailova-konzultace": {
    title: "4týdenní podpora při hubnutí | Fit bez času",
    description:
      "Získej během 4 týdnů pravidelnou zpětnou vazbu, odpovědi na otázky a podporu při hubnutí přizpůsobenou situacím z běžného života.",
  },
};

export function getSupportOfferSeo(slug: string): SupportOfferSeo | null {
  return SUPPORT_OFFER_INDEXABLE_SLUGS.includes(slug as SupportOfferIndexableSlug)
    ? SUPPORT_OFFER_SEO[slug as SupportOfferIndexableSlug]
    : null;
}
