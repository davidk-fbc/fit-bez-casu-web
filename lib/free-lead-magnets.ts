export type FreeLeadMagnet = {
  key: "quickMeals" | "eveningCravings" | "shoppingGuide" | "dietMistakes";
  title: string;
  eyebrow: string;
  headline: string;
  description: readonly string[];
  benefits: readonly string[];
  closing: readonly string[];
  ctaLabel: string;
  ctaNote: string;
  ctaUrl: string | null;
  preview: {
    cover: string;
    inside: string;
    alt: string;
  };
};

// Jediné místo pro budoucí cílové URL. Dokud je hodnota null, stránka
// vykreslí bezpečné neaktivní tlačítko bez falešné navigace.
export const FREE_LEAD_MAGNETS = [
  {
    key: "quickMeals",
    title: "15 rychlých jídel, když nestíháš",
    eyebrow: "15 RYCHLÝCH JÍDEL Z BĚŽNÝCH POTRAVIN",
    headline: "Když nemáš čas vařit, nemusíš skončit u rohlíku nebo objednávky",
    description: [
      "Stáhni si 15 rychlých jídel pro dny, kdy máš práci, povinnosti a na dlouhé vaření prostě není čas.",
    ],
    benefits: [
      "3 snídaně",
      "3 svačiny",
      "3 obědy",
      "3 večeře",
      "3 dezerty",
      "suroviny, jednoduchý postup a čas přípravy",
      "záměny, když něco doma nemáš",
    ],
    closing: [
      "Všechna jídla jsou z běžných potravin a připravená tak, abys nemusela půl hodiny přemýšlet, co si zase dát.",
    ],
    ctaLabel: "Chci 15 rychlých jídel zdarma",
    ctaNote: "PDF zdarma",
    ctaUrl: null,
    preview: {
      cover: "/images/free-resources/quick-cover.webp",
      inside: "/images/free-resources/quick-inside.webp",
      alt: "Náhled e-booku 15 rychlých jídel, když nestíháš",
    },
  },
  {
    key: "eveningCravings",
    title: "Co dělat, když tě večer honí chuť na sladké",
    eyebrow: "KDYŽ TĚ VEČER HONÍ CHUŤ NA SLADKÉ",
    headline: "Než začneš sladké znovu zakazovat, zjisti, proč na něj máš chuť",
    description: [
      "Někdy je za večerní chutí obyčejný hlad. Jindy stres, únava nebo zvyk, který se opakuje každý večer.",
      "Tenhle e-book ti pomůže poznat, co se děje právě u tebe a co s tím můžeš prakticky udělat.",
    ],
    benefits: [
      "jak poznat, jestli jde o hlad, stres, únavu nebo zvyk",
      "co dělat v každé z těchto situací",
      "5 jednoduchých kroků, které můžeš vyzkoušet už dnes",
      "jak si všimnout svého nejčastějšího spouštěče",
      "krátký self-check, díky kterému si v tom uděláš jasno",
    ],
    closing: [
      "Místo dalšího zákazu tak budeš vědět, na co se u sebe skutečně zaměřit.",
    ],
    ctaLabel: "Chci e-book o večerních chutích zdarma",
    ctaNote: "PDF zdarma",
    ctaUrl: null,
    preview: {
      cover: "/images/free-resources/cravings-cover.webp",
      inside: "/images/free-resources/cravings-inside.webp",
      alt: "Náhled e-booku Co dělat, když tě večer honí chuť na sladké",
    },
  },
  {
    key: "shoppingGuide",
    title: "Tahák zdravého nákupu",
    eyebrow: "TAHÁK, KTERÝ SI MŮŽEŠ VZÍT ROVNOU DO OBCHODU",
    headline: "Nakup tak, aby doma bylo z čeho rychle poskládat jídlo",
    description: [
      "Nejde o to mít lednici plnou „fitness“ potravin.",
      "Stačí mít doma několik dobře zvolených základů, ze kterých zvládneš rychle připravit snídani, svačinu, oběd i večeři.",
    ],
    benefits: [
      "praktické zdroje bílkovin",
      "přílohy, zeleninu a ovoce",
      "rychlé snídaně a svačiny",
      "nouzová jídla pro dny, kdy opravdu nestíháš",
      "co se hodí mít v mrazáku",
      "ukázkový jednoduchý nákup",
      "vlastní nákupní checklist",
    ],
    closing: [
      "Až příště půjdeš do obchodu, nebudeš začínat od nuly. Budeš mít jednoduchý přehled, podle kterého si vybereš to, co opravdu využiješ.",
    ],
    ctaLabel: "Chci Tahák zdravého nákupu zdarma",
    ctaNote: "PDF zdarma",
    ctaUrl: null,
    preview: {
      cover: "/images/free-resources/shopping-cover.webp",
      inside: "/images/free-resources/shopping-inside.webp",
      alt: "Náhled PDF Tahák zdravého nákupu",
    },
  },
  {
    key: "dietMistakes",
    title: "7 chyb v jídelníčku, které mohou brzdit hubnutí",
    eyebrow: "KDYŽ SE SNAŽÍŠ, ALE NEVÍŠ, KDE JE PROBLÉM",
    headline: "Možná nepotřebuješ dělat víc. Potřebuješ zjistit, co má smysl změnit",
    description: [
      "Máš pocit, že jíš docela dobře, ale výsledky se nehýbou tak, jak bys čekala?",
      "Projdi si 7 běžných oblastí jídelníčku a zjisti, jestli se některá z nich netýká právě tebe.",
    ],
    benefits: [
      "příliš malé množství jídla přes den",
      "málo bílkovin",
      "dlouhé pauzy mezi jídly",
      "kalorické nápoje",
      "zeleninu a další zdroje vlákniny",
      "velikost porcí i u „zdravých“ potravin",
      "večery a víkendy, které vypadají úplně jinak než pracovní týden",
    ],
    closing: [
      "Na konci si projdeš jednoduchý self-check a vybereš si jednu nebo dvě oblasti, které mají největší smysl řešit jako první.",
      "Nemusíš překopat celý jídelníček. Nejdřív potřebuješ vědět, kde začít.",
    ],
    ctaLabel: "Chci zjistit, co může brzdit moje hubnutí",
    ctaNote: "Self-check zdarma v PDF",
    ctaUrl: null,
    preview: {
      cover: "/images/free-resources/mistakes-cover.webp",
      inside: "/images/free-resources/mistakes-inside.webp",
      alt: "Náhled self-checku 7 chyb v jídelníčku, které mohou brzdit hubnutí",
    },
  },
] as const satisfies readonly FreeLeadMagnet[];
