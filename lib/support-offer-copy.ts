import type { OverviewCard, OverviewContent, PrivatePage, ServiceDetailContent } from "@/lib/private-pages";

export const SUPPORT_OFFER_SLUG = "nabidka-podpory";
export const PERSONAL_DIET_REVIEW_SLUG = "nabidka-podpory/osobni-rozbor-jidelnicku";
export const FOUR_WEEK_SUPPORT_SLUG = "nabidka-podpory/emailova-konzultace";
export const SUPPORT_OFFER_TITLE = "Potřebuješ poradit s tím, co řešíš právě teď?";
export const SUPPORT_OFFER_SUBTITLE =
  "Nemusíš na všechno přicházet sama. Vyber si podle toho, jestli chceš jednorázově zjistit, co můžeš ve svém jídelníčku zlepšit, nebo chceš průběžnou podporu během několika týdnů.";
export const SUPPORT_OFFER_CLOSING_TITLE =
  "Každá služba řeší jinou situaci. Vyber si podle toho, co potřebuješ právě teď.";
export const SUPPORT_OFFER_CLOSING_TEXT =
  "Pokud si nejsi jistá, kde začít, pomůže ti jednoduché rozdělení. Osobní rozbor jídelníčku je pro chvíli, kdy chceš zjistit, co konkrétně ve svém jídelníčku změnit. 4týdenní podpora se hodí, když chceš mít během několika týdnů pravidelnou zpětnou vazbu a prostor řešit otázky, které přicházejí v běžném životě.\n\nOsobní vedení 1:1 připravujeme pro ženy, které chtějí dlouhodobější individuální spolupráci a osobní vedení zaměřené na to, aby se skutečně posouvaly k výsledkům, kterých chtějí dosáhnout.";

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

export type PersonalDietReviewContent = ServiceDetailContent & {
  benefitsIntro: string;
  purchaseTitle: string;
  purchaseText: string;
  purchaseItems: string[];
  purchaseSupportText: string;
  faq: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
  finalCtaTitle: string;
  finalPriceText: string;
  heroCtaSupportText: string;
};

export type PersonalDietReviewPage = Omit<PrivatePage, "content" | "pageType"> & {
  pageType: "service_detail";
  content: PersonalDietReviewContent;
};

export type FourWeekSupportContent = ServiceDetailContent & {
  benefitsIntro: string;
  purchaseTitle: string;
  purchaseText: string;
  purchaseItems: string[];
  purchaseSupportText: string;
  everydayLifeTitle: string;
  everydayLifeText: string[];
  faq: Array<{ question: string; answer: string }>;
  finalTitle: string;
  finalText: string;
  finalCtaTitle: string;
  finalPriceText: string;
  heroCtaSupportText: string;
};

export type FourWeekSupportPage = Omit<PrivatePage, "content" | "pageType"> & {
  pageType: "service_detail";
  content: FourWeekSupportContent;
};

const PERSONAL_DIET_REVIEW_CTA_LABEL = "Chci svůj osobní rozbor";
const PERSONAL_DIET_REVIEW_PRICE = "490 Kč";
const PERSONAL_DIET_REVIEW_SUPPORT_TEXT =
  "Po objednávce ti pošleme vstupní dotazník a přesný postup pro zapsání pěti dní.";
const FOUR_WEEK_SUPPORT_CTA_LABEL = "Chci 4týdenní podporu";
const FOUR_WEEK_SUPPORT_PRICE = "990 Kč";
const FOUR_WEEK_SUPPORT_SUPPORT_TEXT =
  "Po objednávce ti pošleme informace k zahájení 4týdenní spolupráce.";

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
  if (page.pageType === "service_detail" && page.slug === PERSONAL_DIET_REVIEW_SLUG) {
    return applyPersonalDietReviewCopy(page);
  }

  if (page.pageType === "service_detail" && page.slug === FOUR_WEEK_SUPPORT_SLUG) {
    return applyFourWeekSupportCopy(page);
  }

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
      closingTitle: SUPPORT_OFFER_CLOSING_TITLE,
      closingText: SUPPORT_OFFER_CLOSING_TEXT,
      cards,
    },
  } satisfies SupportOfferPage;
}

export function isPersonalDietReviewPage(page: PrivatePage): page is PersonalDietReviewPage {
  return page.pageType === "service_detail" && page.slug === PERSONAL_DIET_REVIEW_SLUG;
}

export function isFourWeekSupportPage(page: PrivatePage): page is FourWeekSupportPage {
  return page.pageType === "service_detail" && page.slug === FOUR_WEEK_SUPPORT_SLUG;
}

function applyPersonalDietReviewCopy(page: PrivatePage): PersonalDietReviewPage {
  const content = page.content as ServiceDetailContent;

  return {
    ...page,
    pageType: "service_detail",
    title: "Zjisti, co ve tvém jídelníčku opravdu brzdí výsledky",
    subtitle:
      "Možná se snažíš jíst lépe, hlídáš si porce a vybíráš zdravější jídla. Přesto máš večer hlad, honí tě chutě nebo se váha nehýbe tak, jak sis představovala.\n\nZ pěti běžných dní zjistíme, kde může být skutečný problém, co už děláš dobře a které změny pro tebe mají největší smysl.",
    content: {
      ...content,
      eyebrow: "PŘESTAŇ HÁDAT, CO DĚLÁŠ ŠPATNĚ",
      sections: {
        ...content.sections,
        audience: true,
        benefits: true,
        process: true,
        inclusions: false,
        price: true,
        cta: true,
      },
      audienceTitle: "Je osobní rozbor vhodný právě pro tebe?",
      audience: [
        "Snažíš se jíst zdravě, ale nejsi si jistá, jestli máš jídelníček sestavený správně.",
        "Nevíš, proč máš během dne hlad, chutě nebo potřebu večer něco dojíst.",
        "Máš za sebou několik pokusů, ale nechceš znovu začínat další přísnou dietou.",
        "Potřebuješ odlišit důležité chyby od drobností, které teď nemusíš řešit.",
        "Chceš konkrétní doporučení podle svého skutečného jídelníčku, ne další obecný návod.",
      ],
      benefitsTitle: "Co přesně z rozboru získáš",
      benefitsIntro:
        "Na konci nebudeš mít jen seznam toho, co děláš špatně. Budeš vědět, co ponechat, co změnit a na co se zaměřit jako první.",
      benefits: [
        {
          title: "Zhodnocení pěti běžných dní",
          text: "Nebudeme hodnotit jeden ukázkový „dokonalý“ den. Podíváme se na to, jak jíš v práci, doma, během náročnějších dní i o víkendu.",
        },
        {
          title: "3 věci, které už děláš dobře",
          text: "Nezačneš s pocitem, že musíš všechno překopat. Ukážeme ti, na čem už můžeš stavět.",
        },
        {
          title: "3 hlavní brzdy",
          text: "Pojmenujeme problémy, které mohou mít největší vliv na hlad, chutě, energii nebo hubnutí.",
        },
        {
          title: "3 konkrétní první kroky",
          text: "Dostaneš změny, které můžeš začít používat hned. Žádný seznam dvaceti pravidel, který tě jen zahltí.",
        },
        {
          title: "Akční plán na 7 dní",
          text: "Budeš přesně vědět, na co se během následujícího týdne zaměřit a co si v praxi vyzkoušet.",
        },
        {
          title: "Osobní výstup",
          text: "Všechno dostaneš přehledně sepsané, aby ses k doporučením mohla kdykoliv vrátit.",
        },
      ],
      processTitle: "Jak osobní rozbor probíhá",
      process: [
        {
          title: "Vyplníš vstupní dotazník",
          text: "Napíšeš nám svůj cíl, běžný režim, zkušenosti, omezení a to, s čím si teď nejvíc nevíš rady.",
        },
        {
          title: "Zapíšeš pět běžných dní",
          text: "Nechceme pět dokonale připravených dní. Potřebujeme vidět realitu, ze které můžeme vycházet.",
        },
        {
          title: "Podklady důkladně projdeme",
          text: "Budeme hledat opakující se souvislosti, slabá místa i věci, které už máš nastavené dobře.",
        },
        {
          title: "Dostaneš osobní rozbor",
          text: "Ne obecné rady pro každého, ale zpětnou vazbu postavenou na tvém jídelníčku a běžném životě.",
        },
        {
          title: "Začneš třemi jasnými kroky",
          text: "Nebudeš muset měnit všechno najednou. Začneš tím, co pro tebe může mít největší přínos.",
        },
      ],
      closingTitle: "",
      closingText: "",
      objectionTitle: "",
      objectionText: "",
      price: PERSONAL_DIET_REVIEW_PRICE,
      cta: {
        ...content.cta,
        active: true,
        label: PERSONAL_DIET_REVIEW_CTA_LABEL,
      },
      buttonNote: PERSONAL_DIET_REVIEW_SUPPORT_TEXT,
      heroCtaSupportText:
        "Osobní rozbor jídelníčku za 490 Kč. Po objednávce ti pošleme vstupní dotazník a přesný postup.",
      purchaseTitle: "Osobní rozbor jídelníčku za 490 Kč",
      purchaseText:
        "Za jednu cenu získáš kompletní zhodnocení pěti běžných dní a konkrétní doporučení, se kterými můžeš začít pracovat hned.",
      purchaseItems: [
        "Zhodnocení 5 běžných dní",
        "3 věci, které už děláš dobře",
        "3 hlavní brzdy",
        "3 konkrétní první kroky",
        "Akční plán na 7 dní",
        "Přehledný osobní výstup",
      ],
      purchaseSupportText: PERSONAL_DIET_REVIEW_SUPPORT_TEXT,
      faq: [
        {
          question: "Co vám budu posílat?",
          answer:
            "Po objednávce dostaneš vstupní dotazník a přesné instrukce k zapisování. Následně nám pošleš záznam pěti běžných dní, abychom viděli, jak vypadá tvoje stravování v reálném životě.",
        },
        {
          question: "Musím si kvůli rozboru všechno připravit „ukázkově“?",
          answer:
            "Ne. Právě naopak. Potřebujeme vidět běžné dny tak, jak skutečně vypadají. Jen tak dokážeme najít věci, které mají smysl řešit právě u tebe.",
        },
        {
          question: "Mám zaznamenat i víkend?",
          answer:
            "Ano, ideální je, aby mezi pěti dny byl alespoň jeden víkendový den. Víkend často vypadá jinak než pracovní týden a pro celkový obrázek je důležitý.",
        },
        {
          question: "Dostanu jen seznam chyb?",
          answer:
            "Ne. Součástí rozboru jsou také věci, které už děláš dobře. Cílem není překopat celý jídelníček, ale najít několik změn, které pro tebe mohou mít největší přínos.",
        },
        {
          question: "Je rozbor vhodný, i když už si hlídám kalorie?",
          answer:
            "Ano. Samotný energetický příjem je jen jedna část celého obrazu. Podíváme se také na rozložení jídel během dne, skladbu jídelníčku a další souvislosti, které mohou ovlivňovat hlad, chutě, energii nebo to, jak se ti plán dlouhodobě dodržuje.",
        },
        {
          question: "Je osobní rozbor vhodný při zdravotních problémech?",
          answer:
            "Osobní rozbor je praktickým zhodnocením běžného jídelníčku. Nenahrazuje lékařskou péči ani individuální doporučení nutričního terapeuta při zdravotních obtížích.",
        },
      ],
      finalTitle: "Nemusíš jíst dokonale. Potřebuješ vědět, co má smysl řešit jako první.",
      finalText:
        "Rozbor ti nedá další přísný režim ani seznam zákazů. Dá ti jasno v tom, co už funguje, co upravit a kde začít, aby ses nemusela snažit měnit všechno najednou.",
      finalCtaTitle: "Chceš konečně vědět, co ve svém jídelníčku změnit?",
      finalPriceText: "Osobní rozbor jídelníčku za 490 Kč",
    },
  };
}

function applyFourWeekSupportCopy(page: PrivatePage): FourWeekSupportPage {
  const content = page.content as ServiceDetailContent;

  return {
    ...page,
    pageType: "service_detail",
    title: "4 týdny podpory, během kterých můžeš průběžně řešit, co se ti daří i kde tápeš",
    subtitle:
      "Možná víš, co bys chtěla změnit, ale v běžném životě přicházejí situace, se kterými si nejsi jistá. Jeden týden se daří, další přijde hlad, chutě, náročný víkend nebo pocit, že se nikam neposouváš.\n\nPo dobu 4 týdnů s námi můžeš pravidelně řešit, co se právě děje, získávat zpětnou vazbu a podle potřeby upravovat další kroky.",
    content: {
      ...content,
      eyebrow: "KDYŽ NECHCEŠ VŠECHNO ŘEŠIT SAMA",
      sections: {
        ...content.sections,
        audience: true,
        benefits: true,
        process: true,
        inclusions: false,
        price: true,
        cta: true,
      },
      audienceTitle: "Je 4týdenní podpora vhodná právě pro tebe?",
      audience: [
        "Chceš mít během hubnutí někoho, s kým můžeš pravidelně probrat svůj postup.",
        "Často si nejsi jistá, jestli děláš správné změny nebo jestli máš něco upravit.",
        "Potřebuješ řešit konkrétní situace, které přicházejí během běžného týdne.",
        "Nechceš čekat několik týdnů s otázkou, která tě právě teď brzdí.",
        "Pomohlo by ti mít každý týden jasnou prioritu, na kterou se zaměřit dál.",
        "Chceš podporu, která reaguje na to, co se u tebe skutečně děje, ne další obecný plán.",
      ],
      benefitsTitle: "Co během 4 týdnů získáš",
      benefitsIntro:
        "Nebudeš dostávat další obecné rady, které si musíš sama převést do praxe. Budeme společně řešit to, co se děje právě u tebe, a každý týden budeš vědět, na co se zaměřit dál.",
      benefits: [
        {
          title: "Pravidelná týdenní zpětná vazba",
          text: "Každý týden nám pošleš shrnutí toho, co se dařilo, co bylo náročné a co potřebuješ vyřešit. Dostaneš konkrétní zpětnou vazbu podle své aktuální situace.",
        },
        {
          title: "Jasná priorita pro další týden",
          text: "Nebudeš se snažit měnit deset věcí najednou. Pomůžeme ti vybrat to, na co má největší smysl zaměřit se právě teď.",
        },
        {
          title: "Odpovědi na konkrétní otázky",
          text: "Můžeš řešit situace, které přicházejí v běžném životě, a nemusíš všechno hledat sama nebo postupovat metodou pokus-omyl.",
        },
        {
          title: "Průběžná podpora přes WhatsApp",
          text: "Když se během týdne objeví otázka, můžeš nám napsat do WhatsApp skupiny a nemusíš čekat až na další týdenní shrnutí.",
        },
        {
          title: "Doporučení podle toho, co se skutečně děje",
          text: "Když něco nefunguje podle plánu, můžeme další kroky upravit podle reality místo toho, abys měla pocit, že jsi „selhala“.",
        },
        {
          title: "Čtyři týdny, během kterých na to nejsi sama",
          text: "Budeš mít prostor pravidelně svůj postup vyhodnocovat, řešit problémy včas a udržet směr i ve chvílích, kdy běžný život nejde podle plánu.",
        },
      ],
      processTitle: "Jak 4týdenní podpora probíhá",
      process: [
        {
          title: "Po objednávce dostaneš informace k zahájení",
          text: "Vysvětlíme ti, jak bude spolupráce během následujících 4 týdnů fungovat a co od tebe budeme potřebovat.",
        },
        {
          title: "Každý týden nám pošleš krátké shrnutí",
          text: "Napíšeš, co se ti dařilo, co bylo náročné, co se změnilo a s čím potřebuješ poradit.",
        },
        {
          title: "Dostaneš osobní zpětnou vazbu",
          text: "Odpovíme na to, co právě řešíš, a doporučíme konkrétní další kroky podle tvé situace.",
        },
        {
          title: "Během týdne můžeš využít WhatsApp skupinu",
          text: "Pokud se objeví otázka nebo situace, se kterou si nejsi jistá, můžeš ji průběžně řešit i mezi týdenními shrnutími.",
        },
        {
          title: "Postupně upravujeme další kroky",
          text: "Každý týden navazujeme na to, co se podařilo, co nefungovalo a co má teď největší smysl řešit dál.",
        },
      ],
      closingTitle: "",
      closingText: "",
      objectionTitle: "",
      objectionText: "",
      price: FOUR_WEEK_SUPPORT_PRICE,
      cta: {
        ...content.cta,
        active: true,
        label: FOUR_WEEK_SUPPORT_CTA_LABEL,
      },
      buttonNote: FOUR_WEEK_SUPPORT_SUPPORT_TEXT,
      heroCtaSupportText:
        "4 týdny osobní podpory za 990 Kč. Po objednávce ti pošleme informace k zahájení spolupráce.",
      purchaseTitle: "4týdenní podpora za 990 Kč",
      purchaseText:
        "Po dobu 4 týdnů budeš mít pravidelnou zpětnou vazbu, prostor řešit konkrétní otázky a podporu při situacích, které přicházejí v běžném životě.",
      purchaseItems: [
        "4 týdny podpory",
        "Pravidelná týdenní zpětná vazba",
        "Konkrétní doporučení podle tvé situace",
        "Jasná priorita pro další týden",
        "Odpovědi na otázky z běžného života",
        "Průběžné otázky ve WhatsApp skupině",
      ],
      purchaseSupportText: FOUR_WEEK_SUPPORT_SUPPORT_TEXT,
      everydayLifeTitle: "Vědět, co dělat, je jedna věc. Zvládnout to v běžném životě je druhá.",
      everydayLifeText: [
        "Hubnutí většinou nekomplikuje jeden špatný den. Náročnější bývají chvíle, kdy se změní režim, přijde stres, víkend, návštěva, větší hlad nebo období, kdy motivace není tak silná.",
        "Právě v těchto chvílích může být užitečné mít možnost situaci probrat, zjistit, co má smysl upravit, a pokračovat dál bez pocitu, že musíš začínat znovu od začátku.",
      ],
      faq: [
        {
          question: "Jak dlouho podpora trvá?",
          answer:
            "Podpora trvá 4 týdny. Během této doby získáš pravidelnou týdenní zpětnou vazbu a můžeš průběžně řešit otázky také ve WhatsApp skupině.",
        },
        {
          question: "Jak probíhá týdenní zpětná vazba?",
          answer:
            "Každý týden nám pošleš krátké shrnutí toho, co se dařilo, co bylo náročné a co potřebuješ řešit. Na základě toho dostaneš osobní zpětnou vazbu a doporučení, na co se zaměřit v dalším týdnu.",
        },
        {
          question: "Můžu se ptát i během týdne?",
          answer:
            "Ano. Součástí podpory je WhatsApp skupina, kde můžeš průběžně psát otázky, které se během týdne objeví.",
        },
        {
          question: "Musím každý týden všechno dodržet dokonale?",
          answer:
            "Ne. Smyslem podpory není kontrolovat, jestli jsi byla „dokonalá“. Naopak chceme pracovat s tím, jak vypadá tvůj skutečný život, a podle toho hledat další kroky, které jsou pro tebe reálně použitelné.",
        },
        {
          question: "Je 4týdenní podpora vhodná i tehdy, když už mám jídelníček?",
          answer:
            "Ano. Jídelníček ti může ukázat, co a kolik jíst, zatímco 4týdenní podpora ti pomáhá řešit situace, které přicházejí při jeho používání v běžném životě.",
        },
        {
          question: "Co když budu chtít pokračovat i po 4 týdnech?",
          answer:
            "Pokud ti spolupráce bude dávat smysl, můžeš si po skončení podpory objednat další 4 týdny a plynule pokračovat.",
        },
        {
          question: "Je podpora vhodná při zdravotních problémech?",
          answer:
            "4týdenní podpora je zaměřená na praktickou podporu při změně stravovacích a režimových návyků. Nenahrazuje lékařskou péči ani individuální doporučení nutričního terapeuta při zdravotních obtížích.",
        },
      ],
      finalTitle: "Nemusíš mít každý týden perfektní. Důležité je vědět, jak pokračovat dál.",
      finalText:
        "Během 4 týdnů nebudeš na každou otázku a problém sama. Když se něco nepovede podle plánu, společně se podíváme na to, co upravit a na co se zaměřit dál.",
      finalCtaTitle: "Chceš mít během dalších 4 týdnů pravidelnou podporu?",
      finalPriceText: "4týdenní podpora za 990 Kč",
    },
  };
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
