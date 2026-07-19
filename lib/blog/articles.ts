// Centrální zdroj pravdy pro kategorie blogu — název i slug se odvozují
// odsud, nikde jinde se nesmí opisovat ručně.
export const BLOG_CATEGORIES = [
  {
    name: "Cvičení a pohyb",
    slug: "cviceni-a-pohyb",
    description:
      "Články o pohybu, cvičení a jednoduchých způsobech, jak dostat aktivitu do běžného dne.",
  },
  {
    name: "Jídelníček a recepty",
    slug: "jidelnicek-a-recepty",
    description:
      "Praktické tipy k jídelníčku, receptům a jídlu bez extrémů a zbytečné složitosti.",
  },
  {
    name: "Motivace a podpora",
    slug: "motivace-a-podpora",
    description:
      "Podpora pro chvíle, kdy motivace nestačí a potřebuješ najít jednodušší cestu dál.",
  },
  {
    name: "Osobní rozvoj",
    slug: "osobni-rozvoj",
    description:
      "Články o návycích, energii, odpočinku a změnách, které dávají smysl v běžném životě.",
  },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type CategorySlug = BlogCategory["slug"];

export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string };

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: CategorySlug;
  publishedAt: string;
  readingTime: number;
  // Ručně řízený příznak pro sekci "Doporučené články" na /blog — nezávisí
  // na datu publikace, viz getRecommendedArticles.
  recommended: boolean;
  content: BlogContentBlock[];
};

// Pracovní obsah — u článků bez plného textu bude doplněn v datech níže,
// veřejně se nikde nezobrazuje jako "placeholder" text.
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "jak-si-vytvorit-navyk-cviceni",
    title: "Jak si vytvořit návyk cvičení",
    excerpt:
      "Jak si to nastavit tak, aby ses nemusela pokaždé přemlouvat a dokázala se k pohybu pravidelně vracet.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-06-26",
    readingTime: 3,
    recommended: false,
    content: [
      { type: "paragraph", text: "Cvičení nezůstane návykem, dokud nenajdeš způsob, jak ho spustit bez dlouhého rozhodování." },
      {
        type: "paragraph",
        text: "Nejjednodušší cesta je navázat pohyb na něco, co už normálně děláš — hned po ranní kávě, cestou z práce nebo večer před sprchou. Když návyk naváže na existující rutinu, odpadá otázka, jestli se ti dnes chce.",
      },
      {
        type: "paragraph",
        text: "Druhá věc, která rozhoduje, je velikost prvního kroku. Deset minut doma je lepší start než hodinový trénink, který se ti povede jednou za dva týdny.",
      },
    ],
  },
  {
    slug: "proc-nevydrzis",
    title: "Proč nevydržíš: 7 důvodů, které nejsou o disciplíně",
    excerpt:
      "Najdi skutečnou příčinu, proč se ti nedaří u změny vydržet, a zjisti, co můžeš tentokrát udělat jinak.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-07-03",
    readingTime: 3,
    recommended: false,
    content: [
      { type: "paragraph", text: "Když něco nevydržíš, není to nutně o slabé vůli — často jde o špatně nastavený start." },
      {
        type: "paragraph",
        text: "Mezi časté důvody patří příliš velký krok hned na začátku, chybějící podpora okolí nebo cíl, který není spojený s ničím, na čem ti skutečně záleží.",
      },
      {
        type: "paragraph",
        text: "Pomáhá vrátit se o krok zpět a nastavit si menší, jasnější krok, který se dá zvládnout i v běžném týdnu — a najít někoho nebo něco, co tě u toho podrží.",
      },
    ],
  },
  {
    slug: "sladke-chute",
    title: "Sladké chutě: proč přicházejí a jak je zvládat",
    excerpt:
      "Zjisti, proč chuť na sladké není jen otázka pevné vůle a jak si s ní poradit v běžném dni.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-06-18",
    readingTime: 2,
    recommended: true,
    content: [
      { type: "paragraph", text: "Chuť na sladké většinou nepřijde jen tak — má svůj spouštěč, i když ho hned nevidíš." },
      {
        type: "paragraph",
        text: "Nejčastěji souvisí s únavou, málem jídla přes den nebo dlouhou dobou od posledního jídla. Tělo hledá rychlou energii, a sladké je nejrychlejší cesta.",
      },
      {
        type: "paragraph",
        text: "Pomáhá mít po ruce alternativu, která chuť uspokojí jinak — kousek ovoce, hořká čokoláda nebo jogurt s medem. Nejde o zákaz, ale o to dát si na výběr dřív, než rozhoduje jen hlad.",
      },
    ],
  },
  {
    slug: "jak-zacit-cvicit-kdyz-nemas-cas",
    title: "Jak začít cvičit, když nemáš čas",
    excerpt:
      "Jednoduchý postup, jak dostat pohyb do běžného týdne i vedle práce, rodiny a povinností.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-06-10",
    readingTime: 2,
    recommended: true,
    content: [
      { type: "paragraph", text: "Čas na cvičení většinou nechybí — chybí mu pevné místo v týdnu." },
      {
        type: "paragraph",
        text: "Funguje si předem určit dny a přesný čas, i kdyby šlo jen o 15 minut. Když je pohyb naplánovaný jako schůzka, je menší šance, že ho vytlačí něco jiného.",
      },
      {
        type: "paragraph",
        text: "Zkus začít dvěma krátkými tréninky týdně a teprve po pár týdnech přidávat další. Je lepší udržet menší návyk dlouhodobě než začít velkoryse a za měsíc skončit.",
      },
    ],
  },
  {
    slug: "jak-prestat-vecer-vyjidat-lednicku",
    title: "Jak přestat večer vyjídat ledničku",
    excerpt:
      "Nejdřív zjisti, co večerní chutě spouští, a potom změň jednu konkrétní věc, která ti uleví.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-07-10",
    readingTime: 5,
    recommended: false,
    content: [
      {
        type: "paragraph",
        text: "Večer u otevřené lednice? Nejsi sama, kdo tenhle scénář zná. Přes den se ti povede jíst v pohodě a najednou večer sáhneš po všem, co je po ruce — a druhý den se ptáš, co se to vlastně stalo.",
      },
      { type: "heading", text: "Proč je večerní přejídání problém" },
      {
        type: "paragraph",
        text: "Není to o tom, že bys neměla dost vůle. Večerní přejídání většinou přichází jako reakce na to, co se dělo celý den — málo jídla přes den, dlouhé přestávky mezi jídly nebo prostě únava, po které tělo chce rychlou odměnu. Výsledek je stejný: sníš toho víc, než jsi plánovala, a k tomu často věci, po kterých se necítíš dobře.",
      },
      { type: "heading", text: "Systém bez vaření: tři stavební bloky" },
      {
        type: "paragraph",
        text: "Nejde o to mít doma hotovou večeři na každý den. Stačí mít po ruce tři typy potravin, ze kterých si rychle poskládáš cokoliv — bílkovinu, vlákninu a něco, co dodá energii a zažene chuť na sladké.",
      },
      { type: "heading", text: "Bílkoviny" },
      {
        type: "paragraph",
        text: "Bílkovina zasytí nejdéle a pomůže ti necítit se za hodinu znovu hladová. Stačí mít v lednici tvaroh, řecký jogurt, vejce natvrdo nebo plátky kuřecího masa — něco, co jde sníst bez přípravy.",
      },
      { type: "heading", text: "Vláknina" },
      {
        type: "paragraph",
        text: "Vláknina přidá objem a pocit plnosti. Zelenina na syrovo, kysané zelí nebo hrst ovoce udělá víc, než by se zdálo — a zabere pár vteřin.",
      },
      { type: "heading", text: "Energie a chuť" },
      {
        type: "paragraph",
        text: "Trocha sacharidů nebo tuku není nepřítel, naopak pomáhá dojíst se do klidu. Kousek celozrnného pečiva, ořechy nebo lžíce ořechového másla dovedou uspokojit chuť, aniž by z toho byla celá vybraná krabice sušenek.",
      },
      { type: "heading", text: "Nejrychlejší potraviny" },
      {
        type: "paragraph",
        text: "Když je lednice připravená, večer nepřemýšlíš — jen skládáš. Tvaroh s ovocem, vejce se zeleninou, jogurt s ořechy nebo zbytky oběda s hrstí listového salátu. Nic z toho nevyžaduje vaření ani plánování dopředu.",
      },
      { type: "heading", text: "Jak to vypadá v reálném dni" },
      {
        type: "paragraph",
        text: "Přijdeš domů unavená, hlad je jasně cítit už z chodby. Místo bezcílného otevírání lednice sáhneš po tom, co už tam čeká — tvaroh, pár rajčat, kousek pečiva. Za pár minut sedíš u jídla, které tě zasytí, a večer pokračuje dál, aniž bys nad tím musela dumat.",
      },
      { type: "heading", text: "Nejčastější chyby" },
      {
        type: "paragraph",
        text: "Nejčastěji chybí právě příprava dopředu — lednice je prázdná, a tak vyhraje první věc, na kterou padne oko. Druhá častá chyba je čekat, až bude hlad opravdu velký. Čím déle čekáš, tím těžší je vybrat si klidně a s rozmyslem.",
      },
      { type: "heading", text: "Mini plán: jedno nákupní pravidlo" },
      {
        type: "paragraph",
        text: "Zkus na příští nákup jedno pravidlo: do košíku přidej aspoň jednu bílkovinu, jednu zeleninu nebo ovoce a jednu drobnost na chuť, které jdou sníst bez vaření. Nic víc se učit nemusíš.",
      },
      { type: "heading", text: "Malý krok na dnešní den" },
      {
        type: "paragraph",
        text: "Dnes večer si jen zkontroluj, co máš doma na tyhle tři kategorie. Když něco chybí, dopiš si to na nákupní seznam — a hotovo.",
      },
      { type: "heading", text: "Otázka k zamyšlení" },
      {
        type: "paragraph",
        text: "Co bylo naposledy důvodem, proč jsi večer sáhla po jídle — opravdový hlad, únava, nebo prostě zvyk?",
      },
      {
        type: "paragraph",
        text: "Večerní chutě nezmizí přes noc, ale s trochou přípravy přestanou být problém, který tě honí po kuchyni.",
      },
    ],
  },
  {
    slug: "jsem-porad-unavena",
    title: "Jsem pořád unavená: nejčastější důvody a co s tím",
    excerpt:
      "Únava může mít více příčin. Začni jednoduchou kontrolou běžného režimu, spánku, jídla a odpočinku.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-06-02",
    readingTime: 2,
    recommended: true,
    content: [
      { type: "paragraph", text: "Únava má často víc příčin najednou, a proto pomáhá projít je jednu po druhé." },
      {
        type: "paragraph",
        text: "Nejdřív stojí za kontrolu spánek — nejen počet hodin, ale i to, jestli chodíš spát ve stejnou dobu. Pak jídlo přes den: dlouhé přestávky bez jídla dokážou energii podlomit stejně jako nekvalitní spánek.",
      },
      {
        type: "paragraph",
        text: "Pomáhá i krátká pauza a pohyb během dne, i kdyby šlo jen o pár minut venku. Malá změna v jedné z těchto oblastí často ukáže víc, než by se čekalo.",
      },
    ],
  },
];

export function getAllArticles(): BlogArticle[] {
  return BLOG_ARTICLES;
}

function sortByDateDesc(articles: BlogArticle[]): BlogArticle[] {
  return articles
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function getAllCategorySlugs(): CategorySlug[] {
  return BLOG_CATEGORIES.map((category) => category.slug);
}

export function getArticlesByCategory(categorySlug: CategorySlug): BlogArticle[] {
  return sortByDateDesc(getAllArticles().filter((article) => article.categorySlug === categorySlug));
}

// 3 nejnovější články (ze všech) pro sekci "Nejnovější články" na /blog.
export function getLatestArticles(limit = 3): BlogArticle[] {
  return sortByDateDesc(getAllArticles()).slice(0, limit);
}

// Ručně vybrané (recommended: true) články pro sekci "Doporučené články" na
// /blog, bez překryvu s aktuální sekcí "Nejnovější články".
export function getRecommendedArticles(limit = 3): BlogArticle[] {
  const latestSlugs = new Set(getLatestArticles(limit).map((article) => article.slug));
  return sortByDateDesc(getAllArticles())
    .filter((article) => article.recommended && !latestSlugs.has(article.slug))
    .slice(0, limit);
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: BlogArticle, limit = 3): BlogArticle[] {
  return BLOG_ARTICLES.filter((candidate) => candidate.slug !== article.slug)
    .sort((a, b) => (a.categorySlug === article.categorySlug ? -1 : 0) - (b.categorySlug === article.categorySlug ? -1 : 0))
    .slice(0, limit);
}

export function formatArticleDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
