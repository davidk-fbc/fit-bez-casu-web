import type { OverviewCard, OverviewContent, PrivatePage } from "@/lib/private-pages";

export const SUPPORT_OFFER_SLUG = "nabidka-podpory";
export const SUPPORT_OFFER_TITLE = "Potřebuješ poradit s tím, co řešíš právě teď?";
export const SUPPORT_OFFER_SUBTITLE =
  "Nemusíš na všechno přicházet sama. Vyber si podle toho, jestli chceš jednorázově zjistit, co můžeš ve svém jídelníčku zlepšit, nebo chceš průběžnou podporu během několika týdnů.";

export type SupportOfferAction = {
  label: string;
  href: string;
  ariaLabel: string;
  external: boolean;
  icon: "mail" | "instagram";
};

export type SupportOfferCard = OverviewCard & {
  preBenefitsText: string;
  emphasisText: string;
  contactText: string;
  contactActions: SupportOfferAction[];
};

export type SupportOfferOverviewContent = Omit<OverviewContent, "cards"> & {
  cards: SupportOfferCard[];
};

export type SupportOfferPage = Omit<PrivatePage, "content" | "pageType"> & {
  pageType: "support_overview";
  content: SupportOfferOverviewContent;
};

const CARD_COPY: Record<OverviewCard["variant"], Omit<SupportOfferCard, keyof OverviewCard>> = {
  light: {
    preBenefitsText: "",
    emphasisText: "",
    contactText: "",
    contactActions: [],
  },
  gradient: {
    preBenefitsText: "",
    emphasisText: "",
    contactText: "",
    contactActions: [],
  },
  dark: {
    preBenefitsText:
      "Nechceme zatím slibovat konkrétní podobu programu, dokud nebude celý systém spolupráce připravený. Už teď ale víme, že půjde o intenzivnější formu podpory než u našich ostatních služeb.",
    emphasisText: "Start připravujeme od září 2026.",
    contactText:
      "Pokud máš o osobní vedení zájem, napiš nám už teď na info@fitbezcasu.cz nebo do zprávy na Instagramu @fitbezcasu. Jakmile budeme otevírat první místa, ozveme se ti mezi prvními.",
    contactActions: [
      {
        label: "Napsat e-mail",
        href: "mailto:info@fitbezcasu.cz",
        ariaLabel: "Napsat e-mail na info@fitbezcasu.cz",
        external: false,
        icon: "mail",
      },
      {
        label: "Napsat na Instagram",
        href: "https://www.instagram.com/fitbezcasu/",
        ariaLabel: "Napsat na Instagram profilu @fitbezcasu",
        external: true,
        icon: "instagram",
      },
    ],
  },
};

export function applySupportOfferCopy(page: PrivatePage): PrivatePage {
  if (page.pageType !== "support_overview" || page.slug !== SUPPORT_OFFER_SLUG) return page;

  const content = page.content as OverviewContent;
  const cards = content.cards.map((card): SupportOfferCard => ({
    ...card,
    ...copyForCard(card),
    ...CARD_COPY[card.variant],
  }));

  return {
    ...page,
    pageType: "support_overview",
    title: SUPPORT_OFFER_TITLE,
    subtitle: SUPPORT_OFFER_SUBTITLE,
    content: {
      ...content,
      afterCards: renameEmailConsultation(content.afterCards),
      closingText: renameEmailConsultation(content.closingText),
      cards,
    },
  } satisfies SupportOfferPage;
}

export function isSupportOfferPage(page: PrivatePage): page is SupportOfferPage {
  return page.pageType === "support_overview" && page.slug === SUPPORT_OFFER_SLUG;
}

function copyForCard(card: OverviewCard): Partial<OverviewCard> {
  switch (card.variant) {
    case "light":
      return {
        eyebrow: "KDYŽ CHCEŠ KONEČNĚ VĚDĚT, KDE JE PROBLÉM",
        title: "Osobní rozbor jídelníčku",
        description:
          "Máš pocit, že se stravuješ docela dobře, ale výsledky tomu neodpovídají? Podíváme se na 5 skutečných dní tvého jídelníčku a ukážeme ti, co už děláš správně, co tě může brzdit a co má smysl změnit jako první.",
        benefitsHeading: "Z ROZBORU SI ODNESEŠ",
        benefits: [
          "Jasné zhodnocení tvého běžného jídelníčku",
          "3 věci, které už děláš dobře",
          "3 hlavní důvody, které mohou brzdit tvůj posun",
          "3 konkrétní změny, na které se zaměřit",
          "Jednoduchý plán pro další dny",
          "Přehledný osobní výstup, ke kterému se můžeš vracet",
        ],
        supportingText:
          "Nebudeme ti zakazovat jídla, která máš ráda, ani hledat chybu v každém soustu. Zaměříme se na změny, které pro tebe mohou mít největší přínos.",
        ctaLabel: "Zjistit více o osobním rozboru",
      };
    case "gradient":
      return {
        eyebrow: "KDYŽ NECHCEŠ VŠECHNO ŘEŠIT SAMA",
        title: "4týdenní podpora",
        description:
          "Potřebuješ se pravidelně poradit, zkontrolovat svůj postup nebo vyřešit situace, které přijdou během běžného týdne? Po dobu 4 týdnů budeš mít prostor ptát se, získávat zpětnou vazbu a podle potřeby upravovat další kroky.",
        benefitsHeading: "BĚHEM 4 TÝDNŮ ZÍSKÁŠ",
        benefits: [
          "Pravidelnou týdenní zpětnou vazbu",
          "Odpovědi na otázky, které se objeví v praxi",
          "Pomoc s konkrétními situacemi z tvého týdne",
          "Doporučení upravená podle toho, co právě řešíš",
          "Jasnou prioritu, na kterou se zaměřit dál",
          "Možnost průběžně se ptát i ve WhatsApp skupině",
        ],
        supportingText:
          "Nebudeš tápat, jestli postupuješ správně. Každý týden budeš vědět, co si ponechat, co upravit a čemu teď věnovat největší pozornost.",
        ctaLabel: "Zjistit více o 4týdenní podpoře",
      };
    case "dark":
      return {
        eyebrow: "PŘIPRAVUJEME OD ZÁŘÍ 2026",
        title: "Osobní vedení 1:1",
        description:
          "Připravujeme 3měsíční program osobního vedení pro ženy, které chtějí svou situaci řešit osobněji, dlouhodoběji a s pravidelnou individuální podporou.",
        benefitsHeading: "OSOBNÍ VEDENÍ BUDE URČENÉ PRO ŽENY, KTERÉ CHTĚJÍ",
        benefits: [
          "Pravidelnou individuální podporu",
          "Řešit svou konkrétní situaci více do hloubky",
          "Mít prostor průběžně konzultovat další kroky",
          "Dlouhodobější spolupráci během 3 měsíců",
          "Podporu přizpůsobenou tomu, co právě řeší",
        ],
        supportingText: "",
        ctaLabel: "",
      };
  }
}

function renameEmailConsultation(value: string): string {
  return value.replaceAll("e-mailová konzultace", "4týdenní podpora").replaceAll("E-mailová konzultace", "4týdenní podpora");
}
