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

export type ArticleContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "callout"; text: string }
  | { type: "quote"; text: string };

export type ArticleCtaType = "challenge" | "meal-plan" | "community";

export type ArticleClosingSections = {
  smallStep: string[];
  reflection: string[];
  eveningTask: string[];
  finalQuote: string;
};

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: CategorySlug;
  publishedAt: string;
  readingTime: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
  recommended: boolean;
  ctaType: ArticleCtaType;
  content: ArticleContentBlock[];
  closingSections: ArticleClosingSections;
  image?: string;
  imageAlt?: string;
};

// Pracovní obsah převzatý z dodaných Word podkladů (viz report importu).
// Veřejně se nikde nezobrazuje jako "placeholder" text.
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "jak-zacit-cvicit-kdyz-nemas-cas",
    title: "Jak začít cvičit, když nemáš čas (a vydržet u toho i v náročných týdnech)",
    excerpt:
      "Konečně si to nastavíš tak, aby se pohyb vešel do běžného dne. Ukážu ti jednoduchý postup, který funguje i když máš plnou hlavu.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-06-10",
    readingTime: 5,
    seoTitle: "Jak začít cvičit, když nemáš čas: jednoduchý systém, co vydrží",
    seoDescription:
      "Nemáš čas ani energii? Nauč se začít cvičit tak, aby se to vešlo do běžného dne. Praktický postup, jak vydržet i v náročných týdnech.",
    seoKeywords: [
      "jak začít cvičit když nemám čas",
      "jak začít cvičit doma",
      "jak si vytvořit návyk cvičení",
      "jak vydržet cvičit",
      "jak se dokopat ke cvičení",
      "cvičení když nestíhám",
    ],
    recommended: false,
    ctaType: "challenge",
    content: [
      {
        type: "paragraph",
        text: "Možná to znáš až moc dobře: ráno rozjezd, práce, povinnosti, doma další kolo… a večer? Večer už nemáš kapacitu. A v hlavě ti jede: „Zase jsem to nedala.“",
      },
      {
        type: "paragraph",
        text: "Jenže problém většinou není v tom, že bys byla líná. Problém je, že se snažíš narvat cvičení do života, který je už teď plnej. A pak se divíš, že to po pár dnech spadne.",
      },
      { type: "paragraph", text: "Tady máš jednoduchý postup, jak začít tak, aby to šlo udržet i ve dnech, kdy nestíháš." },
      { type: "heading", text: "1) Nezačínej tím, co máš cvičit. Začni tím, kdy to uděláš" },
      {
        type: "paragraph",
        text: "Většina lidí začne otázkou: „Co mám cvičit?“ Ty začni otázkou: „Kdy se ti to reálně vejde?“",
      },
      {
        type: "paragraph",
        text: "Protože největší problém není špatný typ cvičení. Největší problém je plán, který počítá s ideálním týdnem.",
      },
      {
        type: "paragraph",
        text: "Základní pravidlo: Nehledej motivaci. Najdi si pevný moment v dni, kdy to uděláš.",
      },
      {
        type: "paragraph",
        text: "Pevný moment = konkrétní chvíle, která už v tvém dni stejně existuje a ty se na ni „přilepíš“.",
      },
      { type: "heading", text: "2) Vyber si „nejpravděpodobnější chvíli“, ne „nejlepší chvíli“" },
      {
        type: "paragraph",
        text: "Nejlepší chvíle zní skvěle na papíře. Nejpravděpodobnější chvíle je ta, která nastane i v pondělí, kdy máš hlavu plnou a všechno hoří.",
      },
      { type: "paragraph", text: "Tři nejčastější momenty, které fungují:" },
      {
        type: "list",
        ordered: false,
        items: [
          "po ranní hygieně (dřív než se den rozjede)",
          "po příchodu domů (ještě než si sedneš)",
          "po obědě / krátké pauze (když se dá ukrást pár minut)",
        ],
      },
      { type: "paragraph", text: "Vyber si jeden. Ne tři. Jeden." },
      { type: "heading", text: "3) Nastav si „nejmenší verzi“, která se počítá" },
      { type: "paragraph", text: "Tady se to láme." },
      { type: "paragraph", text: "V hlavě máme, že cvičení = 30–60 minut. A když to nejde, tak to nejde vůbec." },
      { type: "paragraph", text: "Jenže dlouhodobě vyhrává něco jiného: pravidelnost, ne dokonalost." },
      {
        type: "paragraph",
        text: "Zkus tohle: Nastav si tak malý krok, že ho zvládneš udělat i ve dnech, kdy máš sotva energii. Klidně jen:",
      },
      {
        type: "list",
        ordered: false,
        items: ["„Dám si pár minut pohybu.“", "„Udělám jednu malou věc pro tělo.“", "„Jen se rozhýbu a hotovo.“"],
      },
      {
        type: "paragraph",
        text: "Smysl toho není v tom, že tím „vysekáš formu“. Smysl je v tom, že si buduješ návyk: já jsem člověk, který se o sebe stará.",
      },
      { type: "heading", text: "4) Měj dvě verze: „normální den“ a „den, kdy se to sype“" },
      { type: "paragraph", text: "Chceš vydržet dlouhodobě? Přestaň plánovat jen dny, kdy jde všechno podle plánu." },
      {
        type: "paragraph",
        text: "Verze A: Normální den — když máš trochu energie a prostor. Verze B: Den, kdy se to sype — když jsi unavená, nestíháš a jedeš jen „co je nutný“.",
      },
      {
        type: "paragraph",
        text: "A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz.",
      },
      { type: "heading", text: "5) Odstraň překážky dopředu (protože nejde o čas, ale o „otravnost“)" },
      {
        type: "paragraph",
        text: "Když nemáš čas, často to není o minutách. Je to o tom, kolik kroků navíc musíš udělat, abys vůbec začala. Tři nejčastější brzdy:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Brzda 1: „Musím se převlíct / připravit“ — řešení: připrav si věci dopředu, nebo si dovol mini pohyb i bez velké přípravy.",
          "Brzda 2: „Doma je ruch a nemám klid“ — řešení: vyber si jedno stálé místo (klidně kousek podlahy), kde víš, že to uděláš.",
          "Brzda 3: „Nemám energii“ — řešení: nečekej na energii. Stačí začít. U spousty lidí přijde energie až po startu.",
        ],
      },
      { type: "heading", text: "6) Nastav si „pravidlo návratu“, aby tě výpadek neodstřelil" },
      { type: "paragraph", text: "Jedna z největších pastí: „Když už jsem to vynechala, začnu od pondělí.“" },
      { type: "paragraph", text: "Ne. Začni dnes. V té nejmenší verzi." },
      {
        type: "paragraph",
        text: "Pravidlo, které zachrání tvůj návyk: Po výpadku se nevracej na 100 %. Vrať se na 30–50 %. Když se vrátíš na 100 %, často to přepálíš. Když se vrátíš na 30–50 %, udržíš to.",
      },
      { type: "heading", text: "7) Udělej z pohybu signál, ne další povinnost" },
      { type: "paragraph", text: "Čím víc to bude znít jako úkol, tím víc to budeš odkládat. Zkus jiný rámec:" },
      {
        type: "list",
        ordered: false,
        items: [
          "Ne „musím cvičit“ ale „jdu si rozhýbat tělo a vyčistit hlavu“",
          "Ne „musím to vydržet“ ale „dnes udělám aspoň tu nejmenší verzi“",
        ],
      },
      { type: "paragraph", text: "Tohle není cukrování. Tohle je způsob, jak to udělat udržitelný." },
      { type: "heading", text: "8) Jak poznáš, že to máš nastavený správně?" },
      { type: "paragraph", text: "Správné nastavení vypadá takhle:" },
      {
        type: "list",
        ordered: false,
        items: [
          "vejde se to do běžného dne",
          "když přijde náročný týden, nezmizíš na měsíc",
          "po výpadku se umíš vrátit bez restartu",
          "a máš pocit: „Tohle konečně zvládám.“",
        ],
      },
      { type: "heading", text: "Jemná zmínka komunity (bez tlačení)" },
      {
        type: "paragraph",
        text: "Někdy nejvíc pomůže, když na to nejsi sama. Když chceš, můžeš si svoje malé kroky sdílet i s dalšíma holkama — často právě tohle drží člověka v rytmu.",
      },
    ],
    closingSections: {
      smallStep: [
        "Vyber si jednu konkrétní chvíli, kdy se pohyb nejvíc pravděpodobně vejde (ráno / po příchodu domů / po obědě). A napiš si jednu větu: „Dnes po ____ udělám pár minut pohybu.“",
      ],
      reflection: [
        "Kdy si plánuješ pohyb podle ideálu místo podle reality?",
        "Co je u tebe nejčastější důvod, proč to odpadne?",
      ],
      eveningTask: [
        "Normální den: co je pro tebe reálně v pohodě.",
        "Den, kdy se to sype: co uděláš i tehdy (nejmenší verze).",
      ],
      finalQuote: "Nejde o dokonalý plán. Jde o ten, který se vejde do tvého života.",
    },
  },
  {
    slug: "nemam-energii-na-cviceni",
    title: "Nemám energii na cvičení: co s tím, když jsi pořád unavená",
    excerpt:
      "Naučíš se poznat, kdy potřebuješ spíš ulevit tělu a kdy ti pomůže se rozhýbat. A hlavně co udělat hned, aby ses necítila zaseknutá.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-05-01",
    readingTime: 5,
    seoTitle: "Nemám energii na cvičení: co dělat, když jsi pořád unavená",
    seoDescription:
      "Jsi pořád unavená a cvičení se ti nechce? Nauč se rozlišit přetažení vs. zatuhlost a vybrat správný další krok, který ti vrátí energii.",
    seoKeywords: [
      "nemám energii na cvičení",
      "jsem pořád unavená",
      "nemám energii na nic",
      "únava a stres",
      "jak mít víc energie",
      "nechce se mi cvičit",
    ],
    recommended: false,
    ctaType: "challenge",
    content: [
      { type: "quote", text: "Já bych i cvičila… ale nemám energii." },
      { type: "paragraph", text: "Tohle není výmluva. Tohle je realita spousty žen. A často to vypadá takhle:" },
      {
        type: "list",
        ordered: false,
        items: [
          "ráno vstaneš a už jsi unavená,",
          "přes den jedeš na autopilota,",
          "večer tě dožene únava a poslední, co chceš, je „ještě něco dělat“.",
        ],
      },
      {
        type: "paragraph",
        text: "Jenže pak přijde druhá věc: výčitky. Že to zase nevyšlo. Že ostatní to dávají a ty ne.",
      },
      {
        type: "paragraph",
        text: "Tak si to řekněme na rovinu: největší problém není, že necvičíš. Největší problém je, že nevíš, jak s únavou pracovat, aby sis nepřidávala další tlak.",
      },
      {
        type: "paragraph",
        text: "Tenhle článek ti dá jednoduchý rámec, jak poznat, co se děje, a co udělat, aby ses z toho dostala chytře – ne silou.",
      },
      { type: "heading", text: "Únava není jedna věc. Jsou minimálně dvě" },
      { type: "paragraph", text: "Když řekneš „jsem unavená“, může to znamenat dva úplně odlišné stavy:" },
      { type: "heading", text: "1) Jsi přetažená (tělo i hlava jedou přes limit)" },
      { type: "paragraph", text: "To je ta únava, kdy:" },
      {
        type: "list",
        ordered: false,
        items: [
          "jsi podrážděná nebo otupělá,",
          "všechno tě stojí víc úsilí než obvykle,",
          "spánek ti nepřinese úlevu,",
          "máš pocit, že tě „vypíná“ i maličkost.",
        ],
      },
      { type: "paragraph", text: "V tomhle stavu je problém často v tom, že dlouho jedeš bez pauzy." },
      { type: "heading", text: "2) Jsi zatuhlá / „bez jiskry“ (tělo stojí, hlava je zamlžená)" },
      { type: "paragraph", text: "To je ta únava, kdy:" },
      {
        type: "list",
        ordered: false,
        items: [
          "jsi celá ztuhlá, těžká,",
          "hlava je mlhavá, ale když se rozhýbeš, trochu se to zlepší,",
          "máš pocit, že „by ti něco udělalo dobře“, jen se ti nechce začít.",
        ],
      },
      { type: "paragraph", text: "V tomhle stavu ti naopak často pomůže jemný pohyb, protože tělo je „zaseklý“." },
      {
        type: "paragraph",
        text: "A teď to důležité: Když nerozlišíš tyhle dvě věci, budeš dělat špatné kroky. A pak se to bude opakovat.",
      },
      { type: "heading", text: "Rychlý test: Jsi přetažená, nebo potřebuješ rozhýbat?" },
      { type: "paragraph", text: "Zkus si odpovědět na 5 otázek. Stačí rychle, pocitově." },
      {
        type: "list",
        ordered: false,
        items: [
          "Kdybych si teď lehla na 20 minut, pomohlo by mi to?",
          "Mám napjatá ramena, čelist, nebo se mi špatně dýchá?",
          "Jsem poslední dny pod tlakem a pořád „musím“?",
          "Když se trochu projdu, začne mi být líp?",
          "Jsem spíš zamlžená a zatuhlá, než úplně vyčerpaná?",
        ],
      },
      {
        type: "callout",
        text: "Výsledek: pokud převažují otázky 1–3, spíš jsi přetažená. Pokud převažují 4–5, spíš potřebuješ rozhýbat. A klidně to může být mix. I to je normální.",
      },
      { type: "heading", text: "Co dělat, když jsi přetažená (a cvičení by tě dorazilo)" },
      {
        type: "paragraph",
        text: "Tady je největší past: snažíš se „nakopnout“, ale tělo ti říká, že už nemůže. V tomhle stavu je cílem: získat energii zpátky, ne ji utratit.",
      },
      { type: "paragraph", text: "Co pomáhá (prakticky, bez kouzel):" },
      {
        type: "list",
        ordered: false,
        items: [
          "zkrátit očekávání (dneska není den na výkon)",
          "udělat jednu malou věc, která uleví tělu (dech, krátká pauza, voda, krátké vypnutí)",
          "přestat se trestat – protože trest bere další energii",
        ],
      },
      { type: "paragraph", text: "Důležité: když jsi přetažená, „dát si do těla“ bývá často jen další stres." },
      { type: "heading", text: "Co dělat, když jsi zatuhlá a bez jiskry (a pohyb by ti pomohl)" },
      {
        type: "paragraph",
        text: "Tady je zase past opačná: mysl říká „nemám energii“, ale tělo ji často získá právě tím, že se rozhýbe. V tomhle stavu je cílem: překlopit tělo z režimu „stojím“ do režimu „žiju“.",
      },
      { type: "paragraph", text: "Co pomáhá:" },
      {
        type: "list",
        ordered: false,
        items: [
          "začít co nejmenším začátkem (klidně jen 2–3 minuty)",
          "nečekat, až se ti bude chtít",
          "udělat pohyb, který tě nezničí, ale probudí",
        ],
      },
      { type: "paragraph", text: "A teď důležité: Nejde o to, kolik toho uděláš. Jde o to, že se rozjedeš." },
      { type: "heading", text: "Proč se ti nechce začít (i když víš, že by ti to pomohlo)" },
      { type: "paragraph", text: "Tohle je normální. Mozek má jednu funkci: šetřit energii. Když jsi unavená:" },
      {
        type: "list",
        ordered: false,
        items: [
          "mozek chce rychlou odměnu (mobil, sladké, gauč)",
          "a vyhýbá se čemukoli, co vypadá jako úkol",
        ],
      },
      {
        type: "paragraph",
        text: "Proto je klíčová jedna věc: Udělej z pohybu „lehkou volbu“, ne „velký projekt“.",
      },
      { type: "heading", text: "Pravidlo: „Začnu a pak se rozhodnu“" },
      { type: "paragraph", text: "Nedávej si závazek „odcvičím“. Dej si závazek: „Začnu.“ Po 2–3 minutách se rozhodneš, jestli pokračuješ." },
      { type: "paragraph", text: "Většinou se stane to, že:" },
      { type: "list", ordered: false, items: ["tělo se trochu probere", "hlava se pročistí", "a najednou to jde"] },
      { type: "paragraph", text: "A když to nejde? V pohodě. Udělala jsi minimum a i to se počítá." },
      { type: "heading", text: "Nejčastější důvod, proč nemáš energii (a není to lenost)" },
      { type: "paragraph", text: "U zaneprázdněných žen je to často kombinace:" },
      {
        type: "list",
        ordered: false,
        items: [
          "málo spánku / nekvalitní spánek",
          "nepravidelné jídlo (přes den málo, večer hodně)",
          "dlouhé sezení + málo pohybu",
          "hlava pořád online",
          "tlak, že „bych měla“",
        ],
      },
      {
        type: "paragraph",
        text: "Tohle všechno bere energii. A když si pak řekneš „musím cvičit“, tělo se jen ještě víc stáhne. Proto tenhle článek není o tom, jak se donutíš. Je o tom, jak si vybereš správný krok podle toho, v jakým stavu jsi.",
      },
      { type: "heading", text: "Jednoduchý rozhodovací plán na každý den (2 minuty)" },
      { type: "paragraph", text: "Dneska udělej jen jednu věc: zjisti, do který skupiny patříš." },
      {
        type: "paragraph",
        text: "Když jsi přetažená: zvol „úlevu“ (zklidnění, pauza, vypnutí, lehká péče o tělo). Když jsi zatuhlá: zvol „rozjezd“ (krátký, lehký pohyb, který tě probere).",
      },
      {
        type: "paragraph",
        text: "Tohle je plán, který ti vydrží dlouhodobě, protože není postavený na výkonu. Je postavený na realitě.",
      },
    ],
    closingSections: {
      smallStep: [
        "Dej si minutu a odpověz si: Jsem dnes přetažená, nebo zatuhlá? A podle toho si vyber jeden krok: úleva nebo rozjezd.",
      ],
      reflection: [
        "Když řekneš „nemám energii“, co tím většinou opravdu myslíš?",
        "Co se u tebe děje v týdnech, kdy energie mizí nejrychleji?",
      ],
      eveningTask: [
        "Když jsem přetažená, pomůže mi… (1–2 věci, které umíš udělat hned)",
        "Když jsem zatuhlá, pomůže mi… (1–2 věci, které mě šetrně rozhýbou)",
      ],
      finalQuote: "Nemusíš se nutit. Stačí pochopit, co ti tvoje únava říká.",
    },
  },
  {
    slug: "jak-si-vytvorit-navyk-cviceni",
    title: "Jak si vytvořit návyk cvičení (bez motivace a bez perfekcionismu)",
    excerpt:
      "Jak si to nastavit tak, aby ses nemusela pokaždé přemlouvat. Spouštěč, nejmenší verze a návrat po výpadku v jednom jednoduchém systému.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-06-26",
    readingTime: 5,
    seoTitle: "Jak si vytvořit návyk cvičení: bez motivace a bez perfekcionismu",
    seoDescription:
      "Chceš cvičit pravidelně, ale motivace kolísá? Nauč se nastavit spouštěče, nejmenší verzi a návrat po výpadku tak, aby návyk vydržel dlouhodobě.",
    seoKeywords: [
      "jak si vytvořit návyk cvičení",
      "jak vydržet cvičit",
      "jak cvičit pravidelně",
      "jak se dokopat ke cvičení",
      "nechce se mi cvičit",
      "perfekcionismus a cvičení",
    ],
    recommended: true,
    ctaType: "challenge",
    content: [
      {
        type: "paragraph",
        text: "Možná to znáš: pár dnů jedeš skvěle. Máš energii, chuť, dokonce i dobrý pocit ze sebe. A pak přijde týden, kdy se toho sejde víc. Únava, práce, domácnost, děti, stres… a cvičení jde stranou.",
      },
      { type: "paragraph", text: "A přesně tady si spousta lidí řekne: „Já na to prostě nemám disciplínu.“" },
      {
        type: "paragraph",
        text: "Jenže to není o disciplíně. Je to o tom, že jsi měla plán, který stál na motivaci. A motivace je vrtkavá. Přijde a odejde.",
      },
      { type: "paragraph", text: "Návyk funguje jinak. Návyk je systém, který tě podrží i ve dnech, kdy se ti nechce." },
      { type: "heading", text: "Největší mýtus: „Musím být motivovaná“" },
      {
        type: "paragraph",
        text: "Motivace je fajn bonus, ale špatný základ. Když budeš čekat, až se ti bude chtít, budeš začínat pořád dokola.",
      },
      { type: "paragraph", text: "Lepší otázka zní: „Co udělám, aby to bylo tak jednoduché, že se to stane skoro samo?“ Ne „jak se donutím“, ale „jak si to usnadním“." },
      { type: "heading", text: "Návyk se skládá ze tří věcí: spouštěč → nejmenší verze → odměna" },
      { type: "paragraph", text: "Nemusíš číst knihy o návycích. Stačí pochopit tuhle jednoduchou logiku." },
      { type: "heading", text: "1) Spouštěč: kdy si na to vzpomeneš" },
      {
        type: "paragraph",
        text: "Spouštěč je moment, který už v tvém dni existuje. Ne nový úkol navíc. Něco, co se děje pravidelně.",
      },
      {
        type: "paragraph",
        text: "Třeba po ranní hygieně, po příchodu domů, po obědě nebo před sprchou. Nejde o to vybrat „nejlepší“ čas. Jde o to vybrat takový, který je realistický.",
      },
      {
        type: "paragraph",
        text: "Hodně lidí si řekne: „Budu cvičit večer.“ A pak přijde večer… a nejsou síly. Proto je lepší vybrat čas, který tě nebude stát poslední zbytky energie.",
      },
      { type: "heading", text: "2) Nejmenší verze: co zvládneš i ve dnech, kdy nemáš chuť" },
      {
        type: "paragraph",
        text: "Tady spousta lidí udělá chybu. Nastaví si laťku tak vysoko, že ji nedokáže překročit, když není ideální den. A pak se jim návyk rozpadne.",
      },
      {
        type: "paragraph",
        text: "Nejmenší verze je taková, kterou uděláš i tehdy, když jsi unavená, přetížená a nechceš. Může to být pár minut. Klidně. Nejde o výkon. Jde o to, že návyk zůstane živý.",
      },
      {
        type: "paragraph",
        text: "A teď důležitá věta, která ti může změnit přístup: Když uděláš nejmenší verzi, neodflákla jsi to. Naopak jsi vyhrála. Protože jsi udržela řetěz.",
      },
      { type: "heading", text: "3) Odměna: co tvému mozku řekne „tohle se vyplatí“" },
      { type: "paragraph", text: "Odměna nemusí být čokoláda. Odměna může být pocit. Ale musí být vědomý." },
      {
        type: "paragraph",
        text: "Po pohybu se na chvilku zastav a řekni si: „Udělala jsem to.“ Nebo si to odškrtni. Nebo si napiš jednu větu do poznámek. Mozek potřebuje signál, že to má smysl.",
      },
      { type: "paragraph", text: "Bez toho se z toho stane „další povinnost“, kterou budeš časem nenávidět." },
      { type: "heading", text: "Perfekcionismus je tichý zabiják návyku" },
      { type: "paragraph", text: "Perfekcionismus se často tváří jako snaha o kvalitu. Ve skutečnosti je to past." },
      {
        type: "paragraph",
        text: "Vypadá to třeba takhle: „Když už, tak pořádně.“ „Když to nemám na 30 minut, nemá to cenu.“ „Když jsem vynechala jeden den, je to pryč.“",
      },
      { type: "paragraph", text: "Tohle je přesně důvod, proč spousta žen začíná pořád od nuly." },
      {
        type: "paragraph",
        text: "Jestli chceš vyhrát, potřebuješ změnit hru: Nejlepší plán není ten, co je dokonalý. Nejlepší plán je ten, co se dá držet.",
      },
      { type: "heading", text: "Co dělat, když se ti nechce (a mozek vyjednává)" },
      {
        type: "paragraph",
        text: "Ve chvíli, kdy se ti nechce, mozek začne vytahovat argumenty. A často jsou logické. Jsi unavená, máš toho hodně, zítra to doženeš…",
      },
      {
        type: "paragraph",
        text: "Tady pomáhá jednoduchý trik: Nerozhoduj se, jestli budeš cvičit. Rozhodni se, že začneš. Dáš si jen nejmenší verzi. A až potom se rozhodneš, jestli budeš pokračovat.",
      },
      {
        type: "paragraph",
        text: "Tahle malá změna obejde vnitřní odpor, protože se nezavazuješ k „velké věci“. Zavazuješ se jen k začátku. A často se stane, že jakmile začneš, tělo se probere a hlava se pročistí.",
      },
      { type: "paragraph", text: "A když ne? Nevadí. Udělala jsi nejmenší verzi. A návyk žije dál." },
      { type: "heading", text: "Tři časté chyby, kvůli kterým návyk nevznikne" },
      {
        type: "paragraph",
        text: "První je, že chceš změnit všechno najednou. Pohyb, jídlo, spánek, režim. To není plán. To je tlak.",
      },
      { type: "paragraph", text: "Druhá je, že si nastavíš moc velkou laťku hned od začátku. A pak máš pocit, že selháváš." },
      { type: "paragraph", text: "Třetí je, že nemáš jasný moment v dni, kdy se to má stát. Když je to „někdy“, tak je to nikdy." },
      { type: "paragraph", text: "Návyk nevzniká silou. Návyk vzniká opakováním." },
      { type: "heading", text: "Jak poznáš, že máš návyk dobře nastavený" },
      {
        type: "paragraph",
        text: "Poznáš to jednoduše. Ne podle toho, že jedeš každý den skvěle. Ale podle toho, že když přijde náročnější týden, úplně nezmizíš.",
      },
      {
        type: "paragraph",
        text: "A ještě jedna věc: začneš mít pocit, že pohyb není projekt. Je to součást dne. Něco jako sprcha nebo čištění zubů. Ne pokaždé se ti chce, ale uděláš to.",
      },
      {
        type: "paragraph",
        text: "Na závěr ti chci říct jednu důležitou věc: Když se ti nedaří držet návyk, neznamená to, že jsi slabá. Znamená to, že je potřeba zjednodušit nastavení. A to jde vždycky.",
      },
      {
        type: "paragraph",
        text: "Jestli chceš, přidej se do naší komunity — najdeš tam podporu, tipy a další ženy, které řeší úplně to samé a drží se navzájem na cestě.",
      },
    ],
    closingSections: {
      smallStep: [
        "Vyber si jednu konkrétní chvíli v dni, kdy to budeš dělat (třeba po ranní hygieně nebo po příchodu domů). A napiš si jednu větu: „Dnes po ___ udělám nejmenší verzi.“",
      ],
      reflection: ["Kdy u tebe nejčastěji návyk padá?", "Je to únava, tlak na výkon, nebo to, že to nemáš jasně ukotvené v dni?"],
      eveningTask: [
        "Jaký je tvůj spouštěč (po čem to uděláš)",
        "Jak vypadá tvoje nejmenší verze",
        "Jak si dáš na konci signál „hotovo“ (odměna)",
      ],
      finalQuote: "Návyk nevzniká ve dnech, kdy se ti chce. Vzniká ve dnech, kdy uděláš aspoň to nejmenší.",
    },
  },
  {
    slug: "proc-se-mi-nechce-cvicit",
    title: "Proč se ti nechce cvičit: 10 nejčastějších důvodů (a co s nimi)",
    excerpt:
      "Nechutenství není lenost. Rozklíčujeme, co za tím bývá nejčastěji a jak si to udělat tak, aby se ti začínalo mnohem snáz.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-05-21",
    readingTime: 5,
    seoTitle: "Proč se mi nechce cvičit: 10 důvodů a co s nimi",
    seoDescription:
      "Nechce se ti cvičit a máš z toho výčitky? Zjisti 10 nejčastějších důvodů, proč se to děje, a co s tím udělat bez tlaku a perfekcionismu.",
    seoKeywords: [
      "proč se mi nechce cvičit",
      "nechce se mi cvičit",
      "jak se dokopat ke cvičení",
      "jak vydržet cvičit",
      "motivace ke cvičení",
      "únava a cvičení",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "quote", text: "Vím, že bych měla… ale nechce se mi." },
      {
        type: "paragraph",
        text: "Tuhle větu neříkají líný lidi. Říkají ji hlavně lidi, kteří jedou dlouhodobě na výkon, mají plnou hlavu a už nemají kapacitu přidávat další povinnost. A pokud to máš podobně, tak ti rovnou říkám: nejsi rozbitá. Jen se snažíš tlačit na sebe způsobem, který tě ve výsledku ještě víc vysává.",
      },
      {
        type: "paragraph",
        text: "Nechutenství ke cvičení není jedna věc. Je to signál. A když ho pochopíš, přestaneš se s tím prát a začneš to řešit chytře.",
      },
      { type: "paragraph", text: "Níže máš 10 nejčastějších důvodů, proč se ti nechce – a co s tím udělat tak, aby to bylo udržitelné." },
      { type: "heading", text: "1) Jsi přetažená a tělo už nechce další „musím“" },
      {
        type: "paragraph",
        text: "Když jsi dlouho ve stresu, mozek vyhodnotí cvičení jako další nárok. Ne jako pomoc. V tu chvíli není problém disciplína, ale přetížení.",
      },
      {
        type: "paragraph",
        text: "Co s tím: V takových dnech si dej cíl „ulevit tělu“, ne „odcvičit“. Stačí krátký začátek a pak se rozhodneš, jestli pokračuješ. Hlavní je nepostavit to jako další zkoušku.",
      },
      { type: "heading", text: "2) Máš v hlavě, že cvičení musí být dlouhé a pořádné" },
      {
        type: "paragraph",
        text: "Tohle je obrovský sabotér. Jakmile cvičení rovnáš 30–60 minutám, mozek to automaticky odsune: „Na to není prostor.“",
      },
      {
        type: "paragraph",
        text: "Co s tím: Změň definici. Cvičení nemusí být „trénink“. Může to být pár minut pohybu. Ne jako náhrada, ale jako strategie: buduješ pravidelnost.",
      },
      { type: "heading", text: "3) Čekáš na správnou náladu (a ona nepřichází)" },
      {
        type: "paragraph",
        text: "Nálada je fajn, ale nálada se často objeví až po startu. Pokud čekáš, až se ti bude chtít, budeš to donekonečna odkládat.",
      },
      { type: "paragraph", text: "Co s tím: Nastav si jen „start“. Ne závazek na výkon. Řekni si: „Začnu a uvidím.“ Tohle obejde odpor." },
      { type: "heading", text: "4) Tlačíš na sebe tak moc, že se ti to zhnusilo" },
      {
        type: "paragraph",
        text: "Když se cvičení spojí s tlakem, výčitkami a srovnáváním, mozek se začne bránit. Je to logický. Kdo by se těšil na něco, co v něm vyvolává pocit, že je pořád málo?",
      },
      {
        type: "paragraph",
        text: "Co s tím: Přestaň cvičení používat jako trest. Otoč to: „Dělám to, abych se cítila líp.“ Jakmile se změní důvod, změní se i chuť.",
      },
      { type: "heading", text: "5) Máš strach, že to uděláš špatně" },
      {
        type: "paragraph",
        text: "Spousta žen necvičí ne proto, že by nechtěla, ale protože se bojí, že si ublíží nebo že to nebude „správně“.",
      },
      {
        type: "paragraph",
        text: "Co s tím: Začni s něčím, co ti dává pocit bezpečí. Klidně pomaleji. Cílem není perfektní provedení. Cílem je vytvořit si vztah k pohybu, který tě nebude stresovat.",
      },
      { type: "heading", text: "6) Nevidíš výsledky dost rychle, a tak ztrácíš chuť" },
      { type: "paragraph", text: "Když čekáš, že tělo se změní rychle, snadno přijde zklamání. A zklamání bere chuť." },
      {
        type: "paragraph",
        text: "Co s tím: Zaměř se na první výsledky, které přichází dřív než změna postavy: víc energie, lepší nálada, lepší spánek, menší ztuhlost. Když začneš tyhle věci sledovat, motivace přestane být tak křehká.",
      },
      { type: "heading", text: "7) Jsi vyčerpaná z rozhodování během dne" },
      { type: "paragraph", text: "Celý den děláš stovky rozhodnutí. A večer už mozek nechce nic řešit – ani cvičení." },
      {
        type: "paragraph",
        text: "Co s tím: Zruš rozhodování. Připrav si jednoduchý plán dopředu: kdy to zkusíš a jak dlouho. Čím méně přemýšlení, tím víc šance, že to uděláš.",
      },
      { type: "heading", text: "8) Máš pocit, že když necvičíš „dost“, nemá to cenu" },
      { type: "paragraph", text: "To je perfekcionismus v praxi: buď všechno, nebo nic. A to „nic“ pak přichází často." },
      {
        type: "paragraph",
        text: "Co s tím: Nastav si měřítko úspěchu jinak. Úspěch není dokonalý výkon. Úspěch je, že se objevíš. I nejmenší verze je vítězství, protože udržuješ návyk živý.",
      },
      { type: "heading", text: "9) Máš špatnou zkušenost z minulosti" },
      {
        type: "paragraph",
        text: "Možná ses kdysi přepálila. Možná sis nesedla s nějakým stylem cvičení. Nebo ti někdo dal pocit, že nejsi dost dobrá.",
      },
      {
        type: "paragraph",
        text: "Co s tím: Neber to jako důkaz, že to nejde. Ber to jako informaci, co nefunguje. Teď hledáš jiný přístup – takový, který je pro tebe v pohodě a v reálném životě.",
      },
      { type: "heading", text: "10) Ve skutečnosti ti nechybí motivace. Chybí ti podpora" },
      {
        type: "paragraph",
        text: "Když jsi na všechno sama, je mnohem těžší udržet rytmus. Ne proto, že bys byla slabá, ale protože člověk je sociální tvor. Podpora dělá víc, než si připouštíme.",
      },
      {
        type: "paragraph",
        text: "Co s tím: Najdi si prostředí, které tě táhne správným směrem. Někdy stačí vědět, že v tom nejsi sama – a že ostatní řeší stejné věci.",
      },
      { type: "heading", text: "Jak poznáš, co je tvůj hlavní důvod?" },
      {
        type: "paragraph",
        text: "Zkus si to zjednodušit: když se ti nechce, zeptej se sama sebe: „Je to únava, tlak, nebo strach?“ Tohle jsou tři nejčastější kořeny. Jakmile víš, co z toho to je, umíš zvolit správný další krok.",
      },
      {
        type: "paragraph",
        text: "A ještě jedna důležitá věc: Neřeš deset věcí najednou. Najdi jeden důvod, který u tebe hraje prim, a uprav jen ten. I malá změna často otočí celý pocit.",
      },
    ],
    closingSections: {
      smallStep: [
        "Až se ti dnes nebude chtít, neřeš „jestli budeš cvičit“. Řekni si jen: „Začnu na dvě minuty a pak se rozhodnu.“ Tohle je nejjednodušší způsob, jak obejít odpor.",
      ],
      reflection: [
        "Když se ti nechce cvičit, co je to nejčastěji? Únava, tlak na výkon, nebo strach, že to nedáš dobře?",
        "Co by se změnilo, kdybys přestala cvičení brát jako povinnost a začala ho brát jako pomoc?",
      ],
      eveningTask: [
        "Napiš si jednu větu a nech ji někde na očích: „Můj cíl není dokonalost. Můj cíl je pravidelnost.“",
        "Pod to si napiš svůj nejčastější důvod, proč se ti nechce (jen jeden). Zítra s ním budeš pracovat vědomě, ne automaticky.",
      ],
      finalQuote: "Když se ti nechce, neznamená to konec. Znamená to, že potřebuješ jiný přístup.",
    },
  },
  {
    slug: "jak-vydrzet-cvicit-dlouhodobe",
    title: "Jak vydržet cvičit dlouhodobě: co dělat, když pořád začínáš od pondělí",
    excerpt:
      "Vynecháš a máš pocit, že je to zase pryč? Ukážu ti návratový systém, díky kterému se rozjedeš i uprostřed týdne.",
    categorySlug: "cviceni-a-pohyb",
    publishedAt: "2026-07-06",
    readingTime: 4,
    seoTitle: "Jak vydržet cvičit dlouhodobě: když pořád začínáš od pondělí",
    seoDescription:
      "Pořád začínáš od pondělí? Nauč se vracet ke cvičení bez výčitek a bez velkého restartu. Jednoduchý systém, který udržíš i v náročných týdnech.",
    seoKeywords: [
      "jak vydržet cvičit",
      "jak cvičit pravidelně",
      "jak si vytvořit návyk cvičení",
      "jak se vrátit ke cvičení",
      "jak začít znovu cvičit",
      "jak nepřestat cvičit",
    ],
    recommended: false,
    ctaType: "challenge",
    content: [
      { type: "paragraph", text: "Pokud máš pocit, že pořád jedeš ten stejný scénář, nejsi sama." },
      {
        type: "paragraph",
        text: "Chvíli se držíš. Pak přijde náročnější týden. Něco se pokazí, jsi unavená, nestíháš, jeden den vynecháš… a najednou je z toho týden. A v hlavě se spustí známá věta:",
      },
      { type: "quote", text: "Tak od pondělí jedu znovu." },
      {
        type: "paragraph",
        text: "Jenže pondělí je často jen elegantní způsob, jak to odložit. Ne proto, že bys byla slabá. Ale protože tě mozek chrání před pocitem selhání. Když začneš „od pondělí“, máš pocit, že začínáš čistě. Bez toho nepříjemného „vypadla jsem“.",
      },
      {
        type: "paragraph",
        text: "Tenhle článek tě naučí něco úplně jiného. Ne restart. Ale návrat, který je jednoduchý a udržitelný. Takový, který se dá udělat i ve středu večer.",
      },
      { type: "heading", text: "Proč je „pondělí“ past" },
      { type: "paragraph", text: "Pondělí má v hlavě kouzlo nového začátku. Ale má jednu nevýhodu: posouvá akci do budoucna." },
      { type: "paragraph", text: "A co se stane mezitím? Přijde další den, kdy nestíháš. Další důvod. Další výčitka. A motivace se zmenšuje." },
      {
        type: "paragraph",
        text: "Když chceš vydržet dlouhodobě, potřebuješ si osvojit jednu dovednost, která je důležitější než disciplína: Umět se vrátit rychle. Ne po měsíci. Ne „až bude klid“. Rychle. V malém.",
      },
      { type: "heading", text: "Přestaň cvičení hodnotit jako „buď jedu, nebo nejede“" },
      { type: "paragraph", text: "Udržitelnost nevypadá jako rovná čára. Vypadá jako pohyb nahoru a dolů." },
      { type: "paragraph", text: "Dlouhodobě vyhrávají lidi, kteří nejedou pořád stejně. Vyhrávají ti, kteří umí udělat dvě věci:" },
      { type: "list", ordered: false, items: ["v náročném období si laťku sníží", "po výpadku se vrátí bez dramatu"] },
      { type: "paragraph", text: "Protože výpadek není problém. Problém je, když výpadek změníš na „konec“." },
      { type: "heading", text: "Největší pravidlo pro dlouhodobost: návrat nesmí bolet" },
      {
        type: "paragraph",
        text: "Tady je to nejčastější, co lidi zničí: Vynechají pár dní a pak se snaží „dohnat to“. Dají si velký plán, velký výkon, velký tlak.",
      },
      { type: "paragraph", text: "A tělo i hlava to vyhodnotí jako trest. Výsledek? Za dva dny jsou zpátky na nule." },
      {
        type: "paragraph",
        text: "Proto platí jednoduché pravidlo: Návrat má být lehký. Ne snadný ve smyslu „nic nedělám“. Ale lehký ve smyslu „tohle zvládnu i když se mi nechce“.",
      },
      { type: "heading", text: "„Restart bez restartu“: jak se vrátit, aniž bys začínala od nuly" },
      {
        type: "paragraph",
        text: "Základní chyba je, že máš pocit, že když vypadneš, musíš začít zase „na plno“. Nemusíš. Stačí ti tři kroky:",
      },
      { type: "heading", text: "1) Vrať se na menší verzi" },
      {
        type: "paragraph",
        text: "Když jsi měla běžně delší cvičení, vrať se na kratší. Když jsi měla 4 dny týdně, vrať se na 2. Když jsi jela naplno, vrať se na něco, co tě nezničí.",
      },
      { type: "paragraph", text: "Cíl návratu není výkon. Cíl návratu je znovu se rozjet." },
      { type: "heading", text: "2) Udělej z návratu jednu konkrétní věc v kalendáři" },
      {
        type: "paragraph",
        text: "Ne „někdy zítra“. Ne „od pondělí“. Konkrétní den a konkrétní moment. Jinak se ti do toho mozek bude pořád plést.",
      },
      { type: "heading", text: "3) Po návratu si neber hned víc, než zvládneš" },
      {
        type: "paragraph",
        text: "První týden po návratu je nejkřehčí. Tam nepotřebuješ hrdinství. Tam potřebuješ stabilitu. Lepší je udělat méně a udržet to, než udělat moc a zase spadnout.",
      },
      { type: "heading", text: "Jak přestat padat do výčitek (protože ty tě ničí víc než výpadek)" },
      { type: "paragraph", text: "Výčitky jsou často horší než samotné vynechání. Berou energii, motivaci i chuť začít." },
      { type: "paragraph", text: "Zkus jiný přístup: Když vynecháš, řekni si: „Tohle je normální. Teď udělám další malý krok.“" },
      { type: "paragraph", text: "Tím se vrátíš do role člověka, který situaci řídí. Ne člověka, kterého to semlelo." },
      { type: "heading", text: "Co dělat, když máš pocit, že pořád začínáš, protože jsi unavená" },
      {
        type: "paragraph",
        text: "Možná je problém ještě jinde. Spousta žen nepadá proto, že by neměla disciplínu. Padá proto, že má přepálené očekávání a nulovou rezervu.",
      },
      {
        type: "paragraph",
        text: "Když jedeš dlouhodobě přes limit, návyk se bude rozpadat pravidelně. Ne proto, že jsi slabá, ale protože nemáš z čeho brát.",
      },
      {
        type: "paragraph",
        text: "V tomhle případě pomáhá: snížit laťku tak, aby byla realistická i v týdnech, kdy se ti toho sejde víc. A hlavně se přestat trestat za dny, které jsou prostě náročné.",
      },
      { type: "heading", text: "Jedna věc, která ti dlouhodobost výrazně zjednoduší" },
      { type: "paragraph", text: "Nejsilnější trik není „víc motivace“. Je to mít kolem sebe prostředí, které tě drží." },
      {
        type: "paragraph",
        text: "Protože když jsi sama, musíš všechno táhnout vůlí. A vůle má limity. Když máš podporu, stačí někdy jen malý impuls a jedeš dál.",
      },
    ],
    closingSections: {
      smallStep: [
        "Jestli teď zrovna „nejedeš“, udělej dnes jen jednu věc: napiš si do kalendáře jeden konkrétní moment, kdy se vrátíš. Ne od pondělí. Jeden konkrétní den a čas.",
      ],
      reflection: [
        "Kdy u tebe nejčastěji přichází výpadek? Je to únava, přetížení, nebo moc vysoká laťka?",
        "Co by se změnilo, kdybys návrat brala jako lehký rozjezd, ne jako trest?",
      ],
      eveningTask: [
        "Kdy se vracím (konkrétní den a čas)",
        "Jak vypadá moje menší verze (aby to bylo reálné)",
        "Co mi pomůže, když se mi nebude chtít začít",
      ],
      finalQuote: "Dlouhodobost není o tom nikdy nevypadnout. Je o tom umět se vrátit rychle a bez výčitek.",
    },
  },
  {
    slug: "co-jist-kdyz-nestiham",
    title: "Co jíst, když nestíháš: jednoduchý systém zdravého dne bez vaření",
    excerpt:
      "Nemusíš lovit recepty. Naučíš se skládat jídla z pár „jistot“, aby tě držela energie a večer to nepřišlo.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-05-09",
    readingTime: 4,
    seoTitle: "Co jíst, když nestíháš: jednoduchý systém zdravého dne bez vaření",
    seoDescription:
      "Nestíháš vařit a večer tě dohání hlad? Nauč se jednoduchý systém skládání jídel z bílkovin, vlákniny a energie. Bez receptů, bez stresu.",
    seoKeywords: [
      "co jíst když nestíhám",
      "zdravé jídlo bez vaření",
      "co jíst když nemám čas",
      "rychlé zdravé jídlo",
      "zdravé jídlo do práce",
      "jak si poskládat jídlo",
    ],
    recommended: true,
    ctaType: "meal-plan",
    content: [
      {
        type: "paragraph",
        text: "Když nestíháš, zdravé jídlo většinou prohraje. Ne proto, že bys neměla vůli. Ale protože v náročným dni mozek jede na úsporný režim. Chce rychlé řešení, minimum rozhodování a rychlou energii.",
      },
      {
        type: "paragraph",
        text: "A přesně tady vzniká ten klasický scénář: přes den „něco“ (nebo nic), večer velkej hlad, chutě na sladký a pocit, že se ti to zase rozpadlo.",
      },
      {
        type: "paragraph",
        text: "Dobrá zpráva je, že nemusíš vařit, aby ses najedla dobře. Potřebuješ jen jednoduchý systém, který ti usnadní rozhodování a dá tělu to, co potřebuje.",
      },
      { type: "heading", text: "Proč je „nestíhám“ takový problém pro jídlo" },
      { type: "paragraph", text: "Když jsi ve spěchu, dějí se typicky tři věci:" },
      {
        type: "paragraph",
        text: "Za prvé, jíš málo bílkovin. A to je problém, protože bílkoviny drží sytost. Když chybí, přijde hlad rychleji a chutě jsou hlasitější.",
      },
      { type: "paragraph", text: "Za druhé, jíš málo vlákniny. Ta zpomaluje trávení a pomáhá stabilizovat energii během dne." },
      { type: "paragraph", text: "Za třetí, jíš nepravidelně. A tělo to pak dožene večer. Ne kvůli slabé vůli, ale protože biologii neukecáš." },
      {
        type: "paragraph",
        text: "Proto tenhle článek není o dietách. Je o tom, jak si poskládat den tak, aby sis udržela energii a neměla pocit, že jídlo řešíš pořád dokola.",
      },
      { type: "heading", text: "Systém „bez vaření“ stojí na 3 stavebních blocích" },
      { type: "paragraph", text: "Když nestíháš, nechceš recepty. Chceš pravidlo, které použiješ na cokoliv. Každé jídlo si poskládej z těchhle tří částí:" },
      {
        type: "list",
        ordered: true,
        items: [
          "Bílkovina — základ, který tě zasytí. Bez něj budeš pořád něco dohánět.",
          "Vláknina — zelenina, ovoce, luštěniny, celozrnné věci. Pomáhá sytosti a energii.",
          "Energie a chuť — tuky nebo sacharidy podle toho, co ti vyhovuje. Jde o to, aby to bylo chutný a udržitelné, ne „dokonalé“.",
        ],
      },
      { type: "paragraph", text: "Nemusíš to vážit. Stačí si to v hlavě poskládat jako skládačku." },
      { type: "heading", text: "Nejrychlejší „bezvařící“ bílkoviny, které zachrání den" },
      {
        type: "paragraph",
        text: "Nechci ti dávat jídelníček. Chci, abys měla v hlavě pár jistot, které kdykoliv vytáhneš. V praxi ti nejvíc pomůže mít doma nebo v práci bílkoviny, které jsou hotové hned:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "řecký jogurt nebo skyr",
          "tvaroh",
          "cottage",
          "vejce natvrdo (klidně kupovaný, nebo uvařený dopředu)",
          "konzerva tuňáka nebo sardinek",
          "šunka s dobrým složením",
          "tofu",
          "hotová vařená luštěnina v balení",
          "proteinový nápoj, když je nejhůř",
        ],
      },
      { type: "paragraph", text: "Tohle je ten rozdíl mezi „něco ulovím“ a „mám systém“." },
      { type: "heading", text: "Vláknina bez vaření, která ti zvedne sytost a sníží chutě" },
      { type: "paragraph", text: "Vláknina je často ten chybějící díl. Bez ní máš pocit, že pořád jíš a pořád nemáš dost. Co je nejjednodušší:" },
      {
        type: "list",
        ordered: false,
        items: [
          "sáčky salátu nebo mix zeleniny",
          "okurka, rajčata, paprika, mrkev",
          "kysané zelí, kimchi",
          "mražená zelenina do mikrovlnky",
          "ovoce, které se dá vzít do ruky",
          "luštěniny (cizrna, čočka, fazole)",
          "celozrnné pečivo nebo knäckebrot",
        ],
      },
      { type: "paragraph", text: "Cíl není být „dokonalá“. Cíl je mít v jídle něco, co tě podrží." },
      { type: "heading", text: "Jak to vypadá v reálném dni, když nestíháš" },
      { type: "paragraph", text: "Teď ti ukážu princip, ne recept. Vždycky jen poskládáš 3 části." },
      {
        type: "paragraph",
        text: "Ráno: Když ráno nestíháš, největší chyba je dát si jen kávu a „něco sladkýho“. To ti vystřelí energii nahoru a pak dolů. Lepší je něco, kde je bílkovina hned od startu. Klidně to může být studené a rychlé.",
      },
      {
        type: "paragraph",
        text: "Přes den: Nečekej, až budeš „mít čas se najíst“. Čím déle to odkládáš, tím víc večer doháníš. Stačí malá jistota, která tě přidrží. Nemusí to být velké jídlo. Ale musí tam být bílkovina.",
      },
      {
        type: "paragraph",
        text: "Večer: Večer se často nejí „z hladu“. Večer se jí z kombinace hladu, únavy a stresu. Proto když víš, že nestíháš, je chytrý mít připravenou „záchrannou variantu“, která je rychlá a zároveň tě zasytí.",
      },
      { type: "heading", text: "Nejčastější chyby, kvůli kterým se to rozpadá" },
      { type: "paragraph", text: "První je, že se snažíš to zachránit dokonalostí. Když nemáš ideální jídlo, tak si dáš „něco“. A pak se cítíš blbě." },
      { type: "paragraph", text: "Druhá je, že přes den jedeš na prázdno. A večer tělo udělá přesně to, co umí nejlíp. Dožene to." },
      { type: "paragraph", text: "Třetí je, že nemáš v dosahu ty „základní bloky“. Když je nemáš, vyhraje to, co je nejrychlejší a nejdostupnější." },
      { type: "heading", text: "Mini plán, který ti ulehčí život: 1 nákupní pravidlo" },
      { type: "paragraph", text: "Když chceš z tohohle udělat rutinu, nepotřebuješ seznam na 40 položek. Stačí jednoduché pravidlo:" },
      { type: "callout", text: "Když jdeš nakupovat, přines domů 2 bílkoviny, 2 vlákniny a 1 věc pro chuť." },
      { type: "paragraph", text: "Tím si zajistíš, že i když nestíháš, vždycky poskládáš jídlo, které tě podrží." },
    ],
    closingSections: {
      smallStep: [
        "Vyber si dnes jednu bílkovinu, kterou budeš mít po ruce (doma nebo v práci). Jen jednu. Tím si výrazně snížíš šanci, že večer všechno doženeš.",
      ],
      reflection: [
        "Které jídlo ti nejčastěji ujede, když nestíháš? Ráno, oběd, nebo večer?",
        "Co ti v tu chvíli nejvíc chybí — bílkovina, pravidelnost, nebo připravená záchrana?",
      ],
      eveningTask: [
        "Napiš si tři „záchranné kombinace“ z těch 3 stavebních bloků. Takové, které zvládneš bez vaření do 3 minut.",
        "Zítra si jednu připrav dopředu.",
      ],
      finalQuote: "Když nestíháš, nepotřebuješ dokonalý jídelníček. Potřebuješ jednoduchý systém.",
    },
  },
  {
    slug: "jak-prestat-vecer-vyjidat-lednicku",
    title: "Jak přestat večer vyjídat ledničku: spouštěče a rychlá řešení",
    excerpt:
      "Zjistíš, jestli je to hlad, stres, únava nebo jen zlozvyk. A dostaneš rychlý postup, co udělat v momentě, kdy tě to táhne do kuchyně.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-07-10",
    readingTime: 5,
    seoTitle: "Jak přestat večer vyjídat ledničku: spouštěče a rychlá řešení",
    seoDescription:
      "Večer vyjíš ledničku a pak máš výčitky? Zjisti hlavní spouštěče jako hlad, stres nebo únava a vyzkoušej rychlá řešení, která fungují hned.",
    seoKeywords: [
      "jak přestat večer vyjídat",
      "večerní vyjídání",
      "vyjídání ledničky",
      "jak přestat jíst večer",
      "chutě večer",
      "večerní přejídání",
    ],
    recommended: false,
    ctaType: "meal-plan",
    content: [
      {
        type: "paragraph",
        text: "Znáš ten moment: celý den jedeš. Přes den to nějak držíš, jedeš na výkon, nestíháš. A pak přijde večer. Konečně klid. Konečně gauč. A najednou máš pocit, že tě to táhne do kuchyně.",
      },
      { type: "paragraph", text: "Nejdeš si pro jednu věc. Jdeš „jen mrknout“. A za chvíli zjistíš, že už v ruce držíš něco dalšího. A pak dalšího." },
      { type: "paragraph", text: "A pak přijde ta druhá část, kterou nechce nikdo: výčitky." },
      {
        type: "paragraph",
        text: "Tady je důležité, co ti řeknu hned na začátku: Večerní vyjídání ledničky není o slabé vůli. Ve většině případů je to kombinace hladu, únavy, stresu a špatně nastaveného dne. A když pochopíš, který spouštěč je u tebe největší, můžeš to začít řešit chytře.",
      },
      { type: "heading", text: "První otázka, kterou si polož: Je to hlad, nebo potřeba uklidnit hlavu?" },
      {
        type: "paragraph",
        text: "Večerní „vlčí hlad“ může být úplně normální. Když jsi přes den jedla málo, tělo si řekne. Jenže často to není klasický hlad. Je to spíš potřeba vypnout. Odměna. Úleva.",
      },
      {
        type: "paragraph",
        text: "Poznáš rozdíl docela rychle: Když bys teď snědla normální jídlo a bylo by ti líp, je to spíš hlad. Když bys snědla jídlo a stejně bys chtěla ještě něco „na chuť“, je to spíš hlava.",
      },
      { type: "paragraph", text: "A teď jdeme na ty nejčastější spouštěče. U každého máš jednoduché řešení, které můžeš udělat hned." },
      { type: "heading", text: "Spouštěč 1: Přes den jíš málo, nebo nepravidelně" },
      {
        type: "paragraph",
        text: "Tohle je nejčastější důvod, který skoro nikdo nechce slyšet, protože si myslí, že „přes den to přece zvládá“. Jenže tělo si svůj účet vezme večer.",
      },
      {
        type: "paragraph",
        text: "Když přes den jedeš na kávě, rychlých svačinách nebo velkých pauzách mezi jídly, večer přijde: velký hlad + chutě + nulová trpělivost.",
      },
      { type: "paragraph", text: "Co s tím: Nepotřebuješ dokonalý jídelníček. Potřebuješ jednu pojistku. Něco, co tě přes den zasytí, aby večer nebyl „útok“." },
      { type: "paragraph", text: "Prakticky to znamená jediné: dej do dne aspoň jednu věc, která tě opravdu zasytí. Ne „něco malého“, co zmizí za 20 minut." },
      { type: "heading", text: "Spouštěč 2: Večer konečně vypneš a mozek si chce vzít odměnu" },
      { type: "paragraph", text: "Celý den se držíš. Řešíš věci. Dáváš energii ven. Večer mozek řekne: „Tak teď něco pro mě.“" },
      { type: "paragraph", text: "A nejrychlejší odměna je jídlo. Ne protože bys byla slabá, ale protože to funguje okamžitě. Uvolní se dopamin, na chvíli se ti uleví." },
      { type: "paragraph", text: "Co s tím: Nepotřebuješ se zakazovat. Potřebuješ odměnu vyměnit nebo doplnit. Ne všechno, jen trochu." },
      { type: "paragraph", text: "Zeptej se sama sebe: „Co mi dneska nejvíc chybělo?“ Byl to klid, kontakt, pauza, chvíle pro sebe?" },
      { type: "paragraph", text: "Když tenhle důvod pojmenuješ, večerní tah na ledničku se často zmenší už jen tím, že víš, o co jde." },
      { type: "heading", text: "Spouštěč 3: Únava a nedostatek spánku" },
      { type: "paragraph", text: "Když jsi nevyspaná, tělo chce rychlou energii. A hádej, co je nejrychlejší. Sladké, pečivo, něco křupavého, něco „na chuť“." },
      { type: "paragraph", text: "Tohle není charakter. To je biologie." },
      {
        type: "paragraph",
        text: "Co s tím: Když jsi opravdu unavená, nečekej, že večer vyhraješ silou. Ulehči si to tím, že si dáš jasný plán. Buď si dopřeješ jednu věc vědomě, nebo si připravíš variantu, po které nebudeš mít pocit, že se ti den rozpadl.",
      },
      { type: "paragraph", text: "A hlavně, když vidíš, že jedeš několik dní po sobě málo spánku, počítej s tím, že chutě budou silnější. Nevyčítej si to. Plánuj s tím." },
      { type: "heading", text: "Spouštěč 4: Stres a napětí v těle" },
      { type: "paragraph", text: "Někdy nejde o hlad. Jde o to, že máš v těle napětí a jídlo je rychlá úleva." },
      { type: "paragraph", text: "Proto lidé často vyjí „večer“. Když je konečně klid a tělo pustí napětí, mozek hledá způsob, jak se zklidnit." },
      { type: "paragraph", text: "Co s tím: Tady funguje jedna jednoduchá věc: než vlezeš do ledničky, zastav se a zeptej se: „Jsem teď hladová, nebo napjatá?“" },
      {
        type: "paragraph",
        text: "Pokud jsi napjatá, je fér si nejdřív dát krátkou úlevu pro tělo. Tím nechci říct, že pak nesmíš jíst. Jen ti říkám, že když nejdřív stáhneš napětí, chuť bývá menší.",
      },
      { type: "heading", text: "Spouštěč 5: Máš doma „spouštěcí potraviny“ v první linii" },
      { type: "paragraph", text: "Tohle není o pevné vůli. To je o prostředí." },
      { type: "paragraph", text: "Když máš to, co tě nejvíc láká, v první linii, mozek bude vyhrávat. Když to musíš hledat, často tě to přejde." },
      { type: "paragraph", text: "Co s tím: Neříkám „vyhoď všechno“. To není realistické. Stačí jednoduchý trik: dej tyhle věci mimo oči. Ne na linku, ne do první přihrádky, ne na stůl." },
      { type: "paragraph", text: "Tvoje prostředí rozhoduje víc, než tvoje disciplína." },
      { type: "heading", text: "Rychlá záchrana, když už se to děje (a ty stojíš u ledničky)" },
      { type: "paragraph", text: "Tahle část je nejpraktičtější. A funguje, protože je jednoduchá. Když stojíš u ledničky, udělej dvě věci:" },
      {
        type: "paragraph",
        text: "Nejdřív se zeptej: „Na kolik jsem teď hladová od 1 do 10?“ Pokud jsi na 7 a víc, jsi reálně hladová. Dej si normální jídlo. Ne „něco na chuť“. Pokud jsi na 6 a míň, je to často hlava, únava nebo stres. V tu chvíli ti pomůže udělat nejdřív krátkou pauzu, a pak se rozhodnout.",
      },
      {
        type: "paragraph",
        text: "A ještě jedna věc: když už si něco dáš, dej si to vědomě. Sedni si k tomu. Nejez to ve stoje u linky. To je nejrychlejší cesta k tomu, že toho sníš víc, než chceš.",
      },
      { type: "heading", text: "Když si z toho chceš odnést jednu věc" },
      { type: "paragraph", text: "Nejde o to být dokonalá. Jde o to být o kousek chytřejší než včera." },
      { type: "paragraph", text: "Večerní vyjídání je většinou signál, že přes den chyběla jedna z těchto věcí: jídlo, odpočinek, klid nebo jednoduchý systém." },
      { type: "paragraph", text: "Jakmile najdeš svůj hlavní spouštěč, začne to být řešitelné." },
    ],
    closingSections: {
      smallStep: [
        "Dnes si všimni jediné věci. Ve chvíli, kdy půjdeš večer do kuchyně, zeptej se: „Je to hlad, nebo potřeba vypnout?“ Jen to pojmenuj.",
      ],
      reflection: [
        "Kdy se to u tebe děje nejčastěji? Po náročném dni, po hádce, po dni, kdy jsi přes den málo jedla, nebo když jdeš pozdě spát?",
      ],
      eveningTask: [
        "Napiš si jednu větu: „Když budu mít večer chuť vyjídat ledničku, nejdřív udělám ____ a pak se rozhodnu.“",
        "Doplň tam jednu malou věc, která ti uleví. Klidně minutu klidu, sprchu, čaj, tři nádechy. Cokoliv, co ti sedí.",
      ],
      finalQuote: "Nejde o silnou vůli. Jde o to pochopit, co ti ten večer doopravdy chybí.",
    },
  },
  {
    slug: "sladke-chute",
    title: "Sladké chutě: proč přichází a jak je zvládat (bez zákazu a bez výčitek)",
    excerpt:
      "Konečně pochopíš, proč se chuť na sladké pořád vrací. A jak si to nastavit tak, aby sladké nebylo boj, ale normální situace, kterou máš v ruce.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-06-18",
    readingTime: 4,
    seoTitle: "Sladké chutě: co dělat, když přichází (bez zákazu a bez výčitek)",
    seoDescription:
      "Honí tě sladké chutě? Zjisti, jestli za tím je hlad, stres, únava nebo zvyky, a nauč se sladké zvládat bez zákazu a bez výčitek.",
    seoKeywords: [
      "sladké chutě co dělat",
      "sladké chutě",
      "chuť na sladké",
      "jak zvládat chutě na sladké",
      "večerní chutě na sladké",
      "proč mám chuť na sladké",
    ],
    recommended: false,
    ctaType: "meal-plan",
    content: [
      {
        type: "paragraph",
        text: "Sladké chutě umí být pěkně otravný. Ne proto, že bys byla „slabá“. Ale protože to vypadá, jako kdyby ti tělo posílalo jeden a ten samý vzkaz pořád dokola:",
      },
      { type: "quote", text: "Dej mi něco sladkýho. Hned." },
      { type: "paragraph", text: "A ty se pak točíš ve dvou extrémech. Buď si to zakážeš a vydržíš chvíli, nebo si to dáš a pak přijde výčitka. A z toho se stane boj." },
      {
        type: "paragraph",
        text: "Jenže sladké chutě nejsou nepřítel. Jsou informace. A když pochopíš, odkud přichází, můžeš s tím pracovat tak, aby to nebyla bitva, ale normální součást života.",
      },
      { type: "heading", text: "Nejčastější důvod č. 1: jíš málo nebo nepravidelně" },
      { type: "paragraph", text: "Tohle je úplně klasika." },
      { type: "paragraph", text: "Přes den jedeš. Možná nestíháš oběd. Možná si dáš jen něco rychlýho. Možná se snažíš „jíst lehce“, protože chceš zhubnout." },
      { type: "paragraph", text: "A večer? Tělo si řekne o energii. A sladké je nejrychlejší." },
      { type: "paragraph", text: "Když máš během dne málo jídla, nebo málo kvalitního jídla, sladká chuť není tvoje selhání. Je to logická reakce těla." },
      {
        type: "paragraph",
        text: "Co s tím: Nepotřebuješ jíst víc. Potřebuješ jíst chytřeji. Hlavně tak, aby tě jídlo přes den drželo. Když tělo dostane stabilní energii, chutě výrazně ztichnou.",
      },
      { type: "heading", text: "Důvod č. 2: málo bílkovin a vlákniny" },
      { type: "paragraph", text: "Tady se často stane, že jíš „docela zdravě“, ale po hodině jsi hladová." },
      { type: "paragraph", text: "Proč? Protože v tom jídle chybí to, co dělá sytost a stabilní energii." },
      { type: "paragraph", text: "Bílkoviny a vláknina jsou taková pojistka. Když tam nejsou, mozek se po chvíli ozve: „Chci něco rychlýho.“" },
      {
        type: "paragraph",
        text: "Co s tím: Nemusíš počítat gramy. Jen si u jídla polož jednoduchou otázku: „Mám tady něco, co mě zasytí?“ Když odpověď zní ne, sladké chutě budou častější.",
      },
      { type: "heading", text: "Důvod č. 3: spánek a únava" },
      { type: "paragraph", text: "Největší realita." },
      { type: "paragraph", text: "Když jsi nevyspaná, tělo chce rychlou energii. A mozek chce odměnu. A sladké je obojí." },
      { type: "paragraph", text: "Když jsi unavená, nebudeš vyhrávat tím, že si to zakážeš. Vyhraješ tím, že s tím budeš počítat." },
      {
        type: "paragraph",
        text: "Co s tím: Když víš, že jdeš do dní s málo spánkem, nastav si večer dopředu plán, jak se sladkým naložíš. Ne „nebudu“. Ale „jak to udělám, aby mi bylo dobře a neměla jsem výčitky“.",
      },
      { type: "heading", text: "Důvod č. 4: stres a emoce" },
      { type: "paragraph", text: "Někdy sladké není o hladu. Je o úlevě." },
      { type: "paragraph", text: "Stres v těle vytváří napětí. A sladké je rychlá forma uklidnění. Na chvíli se ti uleví. A proto to mozek chce znovu." },
      {
        type: "paragraph",
        text: "Co s tím: První krok je neodsuzovat se. Druhý krok je dát si otázku: „Potřebuju teď energii, nebo úlevu?“ Když potřebuješ úlevu, pomáhá nejdřív stáhnout napětí. A pak teprve řešit jídlo. Ne opačně.",
      },
      { type: "heading", text: "Důvod č. 5: zvyky a prostředí" },
      { type: "paragraph", text: "Někdy se sladké chutě spustí automaticky. Ne protože máš hlad, ale protože to máš spojený s určitým momentem." },
      { type: "paragraph", text: "Večer seriál. Kafe. Návštěva. Odměna po náročném dni. Tělo si na to zvykne." },
      { type: "paragraph", text: "Co s tím: Tady pomáhá změnit „spouštěč“ nebo jeho podobu. Nemusíš to celé zrušit. Často stačí změnit rutinu, aby to nebylo automatické." },
      { type: "heading", text: "Teď to nejdůležitější: sladké buď zakážeš, nebo ho „zkrotíš“" },
      { type: "paragraph", text: "Zakazování vypadá jako silná vůle, ale často to skončí tak, že:" },
      { type: "list", ordered: false, items: ["vydržíš pár dní,", "sladké se ti začne honit hlavou,", "a pak přijde moment „tak už je to jedno“."] },
      { type: "paragraph", text: "A to nechceš. Místo toho funguje řízená situace. Tedy sladké tak, aby:" },
      { type: "list", ordered: false, items: ["nebylo každý den náhodný záchvat,", "nebylo spojený s výčitkou,", "a aby ti nerozhodilo celý režim."] },
      { type: "heading", text: "3 jednoduché strategie, jak zvládat sladké chutě bez boje" },
      { type: "heading", text: "1) Nejprve zjisti, jestli je to hlad" },
      { type: "paragraph", text: "Zeptej se: „Dal/a bych si normální jídlo?“ Pokud ano, pravděpodobně je to hlad a sladké je jen nejrychlejší varianta." },
      { type: "heading", text: "2) Když chceš sladké, dej si ho vědomě" },
      {
        type: "paragraph",
        text: "Ne ve stoje. Ne u ledničky. Ne u linky. Sedni si, dej si to a udělej z toho rozhodnutí, ne automatiku. Tohle samo o sobě sníží množství. A sníží výčitky.",
      },
      { type: "heading", text: "3) Měj svůj „plán B“" },
      { type: "paragraph", text: "Ne ve smyslu „náhražky sladkého“. Ve smyslu, že když přijde chuť, víš, co uděláš jako první krok." },
      { type: "paragraph", text: "Například: napiju se, dám si 3 nádechy, dám si krátkou pauzu a pak se rozhodnu. Když tenhle mezikrok uděláš, chuť často ztratí sílu." },
      { type: "heading", text: "Když to shrnu jednou větou" },
      { type: "paragraph", text: "Sladké chutě nejsou problém. Problém je, když se tváříš, že by neměly existovat." },
      { type: "paragraph", text: "Jakmile si dovolíš s nimi pracovat chytře, přestanou mít nad tebou takovou moc." },
    ],
    closingSections: {
      smallStep: ["Až dnes přijde chuť na sladké, polož si jednu otázku: „Je to hlad, nebo úleva?“ Jen to pojmenuj."],
      reflection: [
        "Kdy na tebe sladké chutě útočí nejčastěji? Odpoledne, večer, po stresu, nebo když jsi unavená?",
        "Co se v tu chvíli děje v tvém dni?",
      ],
      eveningTask: [
        "Napiš si svůj „plán B“ do jedné věty: „Když přijde chuť na sladké, nejdřív udělám ____ a pak se rozhodnu.“",
        "A zítra to jednou vědomě použij.",
      ],
      finalQuote: "Sladké chutě nejsou slabost. Jsou signál. A signál se dá číst.",
    },
  },
  {
    slug: "jak-jist-zdrave-kdyz-nemas-cas",
    title: "Jak jíst zdravě, když nemáš čas: 7 pravidel, která fakt udržíš",
    excerpt:
      "Pravidla pro normální den, ne pro ideální režim. Pomůžou ti jíst líp i v práci, s dětmi a ve dnech, kdy nestíháš.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-05-25",
    readingTime: 4,
    seoTitle: "Jak jíst zdravě, když nemáš čas: 7 pravidel, která udržíš",
    seoDescription:
      "Nemáš čas vařit ani řešit jídelníček? Těchto 7 pravidel ti pomůže jíst zdravě i v práci, s dětmi a ve stresu. Jednoduše a dlouhodobě.",
    seoKeywords: [
      "jak jíst zdravě když nemám čas",
      "jak jíst zdravě když nestíhám",
      "zdravé stravování bez času",
      "zdravé jídlo do práce",
      "jak jíst zdravě při stresu",
      "co jíst když nemám čas",
    ],
    recommended: false,
    ctaType: "meal-plan",
    content: [
      { type: "paragraph", text: "Jíst zdravě je snadný… když máš klid, čas, energii a ideální den." },
      {
        type: "paragraph",
        text: "Jenže ty řešíš práci, domácnost, děti, dojíždění, stres, nákupy, někdy i špatný spánek. A v takovém režimu se „zdravé stravování“ často rozpadne na dvě varianty: buď se snažíš držet přísně, nebo to vzdáš úplně.",
      },
      { type: "paragraph", text: "A to je přesně ten problém. Zdravé jídlo není projekt pro ideální život. Zdravé jídlo je systém pro normální den." },
      { type: "paragraph", text: "Tady máš 7 pravidel, které jsou postavené tak, aby je šlo držet i ve dnech, kdy nestíháš." },
      { type: "heading", text: "1) Nezačínej tím, co vyřadíš. Začni tím, co přidáš" },
      { type: "paragraph", text: "Když lidé chtějí jíst zdravě, první krok bývá „zakážu si sladké“, „vyřadím pečivo“, „už nikdy nebudu…“." },
      { type: "paragraph", text: "Jenže zákazy fungují krátkodobě. Potom přijde únava, stres a hlad a je po všem." },
      {
        type: "paragraph",
        text: "Mnohem lepší je začít opačně: přidej jednu věc, která tě podrží. Nejčastěji je to bílkovina nebo vláknina. Když tohle v jídle máš, automaticky sníš méně „náhodných věcí“, protože nejsi tak vyhladovělá.",
      },
      { type: "heading", text: "2) V každém dni potřebuješ jednu pojistku proti večernímu přejídání" },
      { type: "paragraph", text: "Večerní přejídání často nevznikne večer. Vznikne už ráno a přes den." },
      { type: "paragraph", text: "Když se přes den odbýváš, dožene tě to večer. Ne kvůli slabé vůli, ale protože tělo potřebuje energii." },
      { type: "paragraph", text: "Pojistka může být klidně jen jedno jídlo nebo jedna svačina, která tě opravdu zasytí. Nemusí být dokonalá. Musí být dostupná." },
      { type: "heading", text: "3) Jedno „záchranné jídlo“ je víc než deset skvělých receptů" },
      { type: "paragraph", text: "V běžném životě nepotřebuješ stále vymýšlet. Potřebuješ mít pár jistot, které tě zachrání, když nestíháš." },
      {
        type: "paragraph",
        text: "Záchranné jídlo je takové, které zvládneš dát dohromady rychle, chutná ti a víš, že po něm nebudeš za hodinu lovit něco dalšího.",
      },
      { type: "paragraph", text: "Když máš svoje záchranné jídlo, přestaneš řešit „co teď“. A to je obrovská úleva." },
      { type: "heading", text: "4) Nečekej na hlad 9 z 10. To je pozdě" },
      { type: "paragraph", text: "Když se dostaneš do extrémního hladu, mozek chce rychlou energii. A pak se rozhoduješ úplně jinak, než když jsi v klidu." },
      { type: "paragraph", text: "Pokud chceš jíst zdravě i v hektickém dni, potřebuješ jíst dřív, než tě hlad převálcuje. Není to o disciplíně. Je to o prevenci." },
      { type: "paragraph", text: "Hlad je signál. Když ho ignoruješ dlouho, přijde obvykle jako „vlk“. A tam už se špatně volí." },
      { type: "heading", text: "5) Když máš stres, nepomůže přísnost. Pomůže jednoduchost" },
      { type: "paragraph", text: "Ve stresu tělo jede na vysoké obrátky. Spánek může být horší, chutě silnější a energie rozhozená." },
      { type: "paragraph", text: "A přesně tehdy si lidé dávají nejpřísnější pravidla, protože mají pocit, že potřebují „víc kontroly“." },
      { type: "paragraph", text: "Jenže přísnost ve stresu končí výbuchem. Zdravé jídlo v náročném období má být spíš jednoduché a stabilní než dokonalé." },
      { type: "paragraph", text: "Pokud máš náročný týden, sniž laťku. Ne kvalitu, ale složitost. Méně rozhodování, méně vymýšlení, méně tlaku." },
      { type: "heading", text: "6) Řeš prostředí, ne jen vůli" },
      {
        type: "paragraph",
        text: "Když máš doma „spouštěcí“ jídla hned po ruce, budeš s tím bojovat pořád. Ne proto, že bys byla slabá, ale proto, že mozek je nastavený na nejrychlejší odměnu.",
      },
      { type: "paragraph", text: "Zdravé stravování je z velké části práce s prostředím. Co máš doma, co máš v práci, co máš v kabelce. To rozhoduje." },
      { type: "paragraph", text: "Neříkám „neměj nic“. Říkám: udělej to tak, aby zdravější volba byla jednodušší než náhodná." },
      { type: "heading", text: "7) Nesnaž se mít perfektní den. Snaž se mít dobrý týden" },
      {
        type: "paragraph",
        text: "Jedno horší jídlo není problém. Jeden náročný den není problém. Problém je, když to v hlavě vyhodnotíš jako „všechno je pryč“ a pak se to veze.",
      },
      { type: "paragraph", text: "Zdravé stravování se nevyhrává v pondělí. Vyhrává se v tom, že se umíš vrátit do normálu hned dalším jídlem. Ne dalším pondělím." },
      { type: "paragraph", text: "A ještě jedna věta, kterou si klidně napiš: Není potřeba to mít dokonalé. Potřebuješ to mít opakovatelné." },
      { type: "heading", text: "Pokud si z toho máš vzít jednu věc" },
      {
        type: "paragraph",
        text: "Zdravé jídlo v reálném životě není o tom, že budeš pořád jíst „učebnicově“. Je to o tom, že si nastavíš pár jednoduchých pravidel, díky kterým ti to bude fungovat i v práci, s dětmi, ve stresu a v týdnu, kdy nestíháš.",
      },
    ],
    closingSections: {
      smallStep: ["Vyber si jedno z těch 7 pravidel a zkus ho dnes vědomě dodržet. Jen jedno. Tím si buduješ systém, který se dá držet dlouhodobě."],
      reflection: [
        "Kdy se ti zdravé jídlo rozpadá nejčastěji? Když máš málo času, když jsi unavená, nebo když máš stres?",
        "Které z těch 7 pravidel by ti v tu chvíli pomohlo nejvíc?",
      ],
      eveningTask: [
        "tvoje nejčastější „kritická chvíle“ (kdy se to rozpadá)",
        "tvoje jedna pojistka, kterou můžeš udělat i v běžném dni",
        "tvoje záchranné jídlo, které se dá udělat rychle",
      ],
      finalQuote: "Zdravé jídlo není o vůli. Je o systému, který funguje i v obyčejném dni.",
    },
  },
  {
    slug: "zdrave-svaciny-do-prace",
    title: "Zdravé svačiny do práce: jak si je plánovat, aby ses večer nepřejídala",
    excerpt: "Večer tě často dožene celý den. Ukážu ti, jak na svačiny jako pojistku, díky které bude večer klidnější.",
    categorySlug: "jidelnicek-a-recepty",
    publishedAt: "2026-06-14",
    readingTime: 4,
    seoTitle: "Zdravé svačiny do práce: jak si je plánovat, aby ses večer nepřejídala",
    seoDescription:
      "Večer tě dohání hlad a chutě? Nauč se plánovat zdravé svačiny do práce jako pojistku. Jednoduchý systém, méně přejídání a víc klidu v jídle.",
    seoKeywords: [
      "zdravé svačiny do práce",
      "zdravá svačina do práce",
      "svačiny do práce",
      "co jíst v práci",
      "svačina do práce bez vaření",
      "večerní přejídání",
    ],
    recommended: false,
    ctaType: "meal-plan",
    content: [
      { type: "paragraph", text: "Spousta žen si myslí, že problém je večer. Že večer nemají vůli. Že večer „vyjí ledničku“ a pak se zlobí samy na sebe." },
      { type: "paragraph", text: "Jenže ve spoustě případů večer není začátek. Večer je důsledek." },
      {
        type: "paragraph",
        text: "Důsledek toho, že přes den jedeš na výkon, odbýváš se, nestíháš jíst, nebo jíš věci, které tě neudrží. A pak přijde domů hlad, únava, stres a mozek chce rychlou odměnu.",
      },
      {
        type: "paragraph",
        text: "Svačina do práce není „něco navíc“. Svačina do práce je pojistka. Je to jednoduchý způsob, jak si udržet energii, klid a hlavně to, aby se ti večer nerozpadl celý den.",
      },
      { type: "heading", text: "Proč tě večer dožene hlad, i když máš pocit, že přes den „nejíš moc“" },
      { type: "paragraph", text: "Tělo funguje docela férově. Když mu přes den nedáš dost energie, vezme si ji později." },
      {
        type: "paragraph",
        text: "A když mu ji nedáš v podobě normálního jídla, vezme si ji v podobě chutí. Sladké, pečivo, něco křupavého, „jen trochu“. Protože mozek ve vyčerpání chce rychlé řešení.",
      },
      {
        type: "paragraph",
        text: "A teď to podstatné: když máš přes den správně poskládané jídlo a jednu dvě chytré svačiny, večer se často uklidní sám. Ne proto, že bys byla disciplinovanější. Ale protože tělo nebude v deficitu.",
      },
      { type: "heading", text: "Co má umět dobrá svačina do práce" },
      { type: "paragraph", text: "Dobrý svačina není ta, která je „fit“. Dobrý svačina je ta, která tě podrží. A to znamená tři věci:" },
      { type: "paragraph", text: "Za prvé, musí zasytit. Ne na dvacet minut. Aspoň na pár hodin." },
      { type: "paragraph", text: "Za druhé, musí být snadná. Pokud je složitá na přípravu, nebudeš ji dělat dlouhodobě." },
      { type: "paragraph", text: "Za třetí, musí být dostupná. Když ji nemáš po ruce, vyhraje automaticky to, co je nejrychlejší." },
      { type: "heading", text: "Nejčastější chyba: „Dám si něco malého“ a za hodinu hledáš sladké" },
      { type: "paragraph", text: "Tady se často děje to, že si dáš svačinu typu „něco na zub“, ale chybí v ní to, co dělá sytost." },
      {
        type: "paragraph",
        text: "A pak si myslíš, že máš slabou vůli, protože máš hlad znovu. Ve skutečnosti ti jen chybí stavební kámen, který drží chuť i energii.",
      },
      {
        type: "paragraph",
        text: "Pokud chceš, aby svačina fungovala jako pojistka, měla by obsahovat něco, co tě zasytí, a něco, co drží stabilitu. Nemusíš to počítat. Jen se nauč to poznat.",
      },
      { type: "heading", text: "Logika „pojistky“: kdy svačinu opravdu potřebuješ" },
      {
        type: "paragraph",
        text: "Svačina není povinná. Někdo ji nepotřebuje každý den. Ale pokud se ti večer rozjíždí přejídání, většinou je to signál, že se přes den odbýváš.",
      },
      {
        type: "paragraph",
        text: "Svačina je chytrá hlavně tehdy, když: víš, že tě čeká dlouhá pauza mezi jídly, víš, že bude náročný den a nebudeš mít klid na normální oběd, víš, že večer doma často „dojíš“ celý den.",
      },
      { type: "paragraph", text: "V takových dnech svačina není slabost. Je to prevence." },
      { type: "heading", text: "Jak si svačiny plánovat tak, aby to bylo jednoduché" },
      { type: "paragraph", text: "Tady nechci dávat recepty. Chci ti dát systém, který si můžeš přizpůsobit." },
      { type: "paragraph", text: "Nejjednodušší je mít „svačinové jistoty“. Něco, co se dá vzít do kabelky, hodit do šuplíku v práci a kdykoliv použít." },
      {
        type: "paragraph",
        text: "A hlavně to neřešit každý den znovu. Když musíš každý den vymýšlet, co si vezmeš, časem to vzdáš. Proto je lepší mít pár variant, které střídáš.",
      },
      { type: "heading", text: "Co dělat, když přijde chuť odpoledne (a ty víš, že to večer špatně dopadne)" },
      { type: "paragraph", text: "Odpolední chuť je často první varování. Ne potíž. Signál." },
      { type: "paragraph", text: "Signál, že jsi buď: jedla málo, nebo jsi měla dlouhou pauzu, nebo jsi unavená a mozek chce rychlou odměnu." },
      {
        type: "paragraph",
        text: "Když se tohle naučíš vnímat, můžeš s tím pracovat dřív, než to večer vybuchne. A tady je jednoduchý princip: radši si dej v práci pojistku, než to dohánět doma.",
      },
      { type: "heading", text: "„Svačina není trest“. Svačina je chytrý krok" },
      { type: "paragraph", text: "Je úplně normální, že v práci někdy jedeš v tempu a nemáš ideální režim." },
      { type: "paragraph", text: "Svačina ti má pomoct, aby ses udržela v klidu a měla energii. Ne aby ses cítila „na dietě“." },
      {
        type: "paragraph",
        text: "A když si to takhle nastavíš, najednou ti dává smysl, proč má svačina do práce v životě zaneprázdněné ženy velký místo.",
      },
    ],
    closingSections: {
      smallStep: [
        "Dnes si připrav jednu „pojistku“ do práce. Jen jednu. Něco, co víš, že ti pomůže, až přijde dlouhá pauza nebo odpolední chuť.",
      ],
      reflection: [
        "Kdy se ti nejčastěji rozpadne den? Je to odpoledne v práci, nebo až večer doma?",
        "Co by se změnilo, kdybys měla v práci připravenou pojistku dřív, než přijde chuť?",
      ],
      eveningTask: ["Napiš si 3 svoje „svačinové jistoty“. Takové, které jsou: rychlé, dostupné a zasytí tě.", "Zítra si jednu z nich připrav dopředu."],
      finalQuote: "Večerní přejídání často nezačíná večer. Začíná tím, že se přes den odbýváš.",
    },
  },
  {
    slug: "jak-se-dokopat-ke-cviceni",
    title: "Jak se dokopat ke cvičení, když se ti nechce (bez motivačních keců)",
    excerpt:
      "Konkrétní postup, jak se z odporu dostat do akce přes malý začátek. Funguje i ve dnech, kdy máš energii na nule.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-05-13",
    readingTime: 4,
    seoTitle: "Jak se dokopat ke cvičení, když se ti nechce (bez motivačních keců)",
    seoDescription:
      "Nechce se ti cvičit a pořád to odkládáš? Nauč se jednoduchý postup, jak překlopit odpor do akce přes malé rozhodnutí. Bez tlaku a bez výčitek.",
    seoKeywords: [
      "jak se dokopat ke cvičení",
      "nechce se mi cvičit",
      "jak začít cvičit když se mi nechce",
      "motivace ke cvičení",
      "jak vydržet cvičit",
      "jak si vytvořit návyk cvičení",
    ],
    recommended: false,
    ctaType: "challenge",
    content: [
      {
        type: "paragraph",
        text: "Jsou dny, kdy se ti nechce úplně upřímně. Ne „trochu“. Ne „kdybych se hecla“. Prostě nechce. A když máš plný den, únava v těle a hlavu přetíženou, je cvičení první věc, která jde pryč.",
      },
      { type: "paragraph", text: "A pak přijde ta druhá věc, která bolí víc než to vynechání: pocit, že „se zase nedá věřit sama sobě“." },
      {
        type: "paragraph",
        text: "Tak pojďme to vzít jinak. Ne přes vůli. Ne přes hecování. Ale přes postup, který funguje i ve dnech, kdy se ti nechce, protože je postavený na malých rozhodnutích, ne na výkonu.",
      },
      { type: "heading", text: "Proč se ti nechce cvičit (a není to lenost)" },
      {
        type: "paragraph",
        text: "Ve chvíli, kdy jsi unavená nebo ve stresu, mozek chce šetřit energii. Cvičení vypadá jako výdej. A mozek tě bude přesvědčovat, že je „rozumnější“ to odložit.",
      },
      {
        type: "paragraph",
        text: "Navíc, pokud máš cvičení spojené s tlakem („musím to dát“, „musím to stihnout“, „musím vydržet“), odpor je ještě silnější. Protože mozek se přirozeně brání věcem, které zní jako další povinnost.",
      },
      { type: "paragraph", text: "Důležitý je si uvědomit jednu věc: Nechuť není konec. Nechuť je signál, že potřebuješ změnit přístup." },
      { type: "heading", text: "Pravidlo, které tohle celé otočí: neřeš cvičení, řeš začátek" },
      { type: "paragraph", text: "Většina lidí se snaží rozhodnout: „Budu cvičit, nebo ne?“" },
      { type: "paragraph", text: "A to je přesně špatná otázka, protože v ní je schované „odcvičím pořádně“. A proti tomu se mozek postaví." },
      { type: "paragraph", text: "Místo toho si polož otázku: „Dokážu udělat jen začátek?“ Začátek je malý. A malý věci mozek tolik neodmítá." },
      { type: "paragraph", text: "Tvoje jediné rozhodnutí je: Začnu a pak se rozhodnu, jestli budu pokračovat. Tohle není trik. Tohle je způsob, jak obejít odpor." },
      { type: "heading", text: "Konkrétní postup: 5 kroků, jak překlopit odpor do akce" },
      { type: "heading", text: "1) Pojmenuj, co se děje" },
      { type: "paragraph", text: "Ne „jsem hrozná“. Ale „jsem unavená“ nebo „jsem přetížená“. Pojmenování je první krok, protože se tím přestaneš sama proti sobě tlačit." },
      { type: "heading", text: "2) Zmenši cíl na minimum" },
      { type: "paragraph", text: "Ne „odcvičím“. Ale „udělám pár minut pohybu“. Ten rozdíl je obrovský. Jedno zní jako projekt, druhé jako malá věc." },
      { type: "heading", text: "3) Připrav si nejkratší start" },
      { type: "paragraph", text: "Tady je důležitý, aby to nebylo složitý. Žádná příprava na půl hodiny." },
      { type: "paragraph", text: "Tvůj start může být klidně jen to, že si dáš oblečení, postavíš se a uděláš první minutu. To je všechno." },
      { type: "heading", text: "4) Dej si pravidlo rozhodnutí po dvou minutách" },
      { type: "paragraph", text: "Po dvou minutách se zeptej: „Chci pokračovat, nebo dneska končím?“" },
      { type: "paragraph", text: "Ať už je odpověď jakákoliv, vyhrála jsi. Protože jsi udělala to, co se počítá nejvíc: začala jsi." },
      { type: "heading", text: "5) Uznej to jako hotovo" },
      {
        type: "paragraph",
        text: "Nečekej na velký výkon, aby to mělo hodnotu. Řekni si: „Udělala jsem to.“ Tím učíš mozek, že tohle je win. A to je to, co buduje návyk.",
      },
      { type: "heading", text: "Co když se ti nechce pořád, několik dní po sobě?" },
      { type: "paragraph", text: "Pak je dobrý přestat se ptát „proč jsem taková“ a začít se ptát: „Je to odpor, nebo vyčerpání?“" },
      { type: "paragraph", text: "Odpor často zmizí, když začneš. Vyčerpání nezmizí cvičením. Vyčerpání chce úlevu a lepší režim." },
      {
        type: "paragraph",
        text: "Pokud jsi dlouhodobě vyčerpaná, neřeš nejdřív výkon. Řeš spánek, stres a to, aby ses přes den neodbývala. Cvičení v takové chvíli může být malé a jemné. Hlavní je, že se o sebe staráš.",
      },
      { type: "heading", text: "Nejčastější věc, která lidi zničí: čekání na „správný den“" },
      { type: "paragraph", text: "Správný den nepřijde. Přijde život. A v něm budou týdny, kdy to půjde lehce, a týdny, kdy to půjde těžce." },
      { type: "paragraph", text: "Proto je důležitý mít plán i pro ty dny, kdy se ti nechce. Ne jako trest. Jako pojistku. A to je přesně tenhle postup." },
    ],
    closingSections: {
      smallStep: ["Dnes si dej jediné pravidlo: Začnu na 2 minuty a pak se rozhodnu. Ne víc. Jen tohle."],
      reflection: [
        "Když se ti nechce cvičit, co to u tebe nejčastěji znamená? Únava, stres, nebo tlak na výkon?",
        "Jak by se změnil tvůj vztah k pohybu, kdybys přestala chtít „odcvičit“ a místo toho jen „začít“?",
      ],
      eveningTask: [
        "Napiš si na papír jednu větu a dej ji někam na oči: „Dneska mi stačí začít. O výkon nejde.“",
        "Pod to si napiš, kdy zítra uděláš svoje 2 minuty (konkrétní moment v dni).",
      ],
      finalQuote: "Nejsilnější nejsou ti, co mají motivaci. Nejsilnější jsou ti, co umí začít, i když se jim nechce.",
    },
  },
  {
    slug: "proc-nevydrzis",
    title: "Proč nevydržíš: 7 důvodů, které nejsou o disciplíně",
    excerpt:
      "Nejde o to, že bys „neměla vůli“. Najdeš svůj největší kámen úrazu a zjistíš, co změnit, aby se to tentokrát nerozsypalo.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-07-03",
    readingTime: 4,
    seoTitle: "Proč nevydržím cvičit: 7 důvodů, které nejsou o disciplíně",
    seoDescription:
      "Začneš a pak to spadne? Zjisti 7 nejčastějších důvodů, proč nevydržíš cvičit dlouhodobě a co změnit, aby to tentokrát fungovalo bez tlaku a výčitek.",
    seoKeywords: [
      "proč nevydržím cvičit",
      "jak vydržet cvičit",
      "jak si vytvořit návyk cvičení",
      "jak cvičit pravidelně",
      "motivace ke cvičení",
      "nechce se mi cvičit",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      {
        type: "paragraph",
        text: "Možná to znáš. Začneš. Chvíli jedeš. Dokonce máš dobrý pocit, že se to konečně láme. A pak se to začne drolit. Jedno vynechání. Pak druhé. Pak týden, kdy to nejde vůbec. A v hlavě naskočí: „Já prostě nemám disciplínu.“",
      },
      { type: "paragraph", text: "Jenže většinou to není pravda." },
      {
        type: "paragraph",
        text: "Lidi, kteří vydrží dlouhodobě, nejsou nutně „tvrdší“. Mají hlavně nastavený systém tak, aby je podržel i v týdnech, kdy jsou unavení, přetížení nebo se jim prostě nechce. A přesně o tom je tenhle článek.",
      },
      {
        type: "paragraph",
        text: "Níže máš 7 důvodů, proč to často nevydržíš. Ne proto, abys měla další výčitku. Ale proto, abys přesně věděla, co změnit, aby to tentokrát fungovalo.",
      },
      { type: "heading", text: "1) Začínáš moc velkým plánem" },
      {
        type: "paragraph",
        text: "Když se chceš do něčeho opřít, je přirozený začít „pořádně“. Jenže velký plán má jeden problém. Potřebuje hodně času, energie a klidu. A tyhle věci v běžném životě často nemáš.",
      },
      { type: "paragraph", text: "Výsledek je, že první náročnější týden ti to shodí celé." },
      { type: "paragraph", text: "Co s tím: Nastav si takovou verzi, kterou zvládneš i v týdnu, kdy nestíháš. To je paradoxně to, co tě dostane dál." },
      { type: "heading", text: "2) Spoléháš na motivaci, místo aby ses opřela o rutinu" },
      { type: "paragraph", text: "Motivace je krásná. Ale je proměnlivá. Když přijde stres, málo spánku nebo blbej den, motivace je první, co zmizí." },
      {
        type: "paragraph",
        text: "Co s tím: Potřebuješ jasnou rutinu. Ne velký závazek, ale konkrétní moment v dni, kdy se to obvykle stane. Když je to „někdy“, tak je to nikdy.",
      },
      { type: "heading", text: "3) Nemáš plán pro horší dny" },
      {
        type: "paragraph",
        text: "Většina lidí plánuje jen dobré dny. Dny, kdy mají energii, čas a náladu. Jenže dlouhodobost se láme v těch dnech, kdy to nejde snadno.",
      },
      {
        type: "paragraph",
        text: "Co s tím: Měj připravenou malou verzi, kterou uděláš i tehdy, když máš den na nic. Ne jako náhradu. Jako pojistku, aby se návyk nepřerušil.",
      },
      { type: "heading", text: "4) Bereš výpadek jako konec" },
      { type: "paragraph", text: "Jedno vynechání se může stát komukoliv. Problém je, když ho začneš v hlavě překlápět do příběhu: „Zase jsem to nedala.“" },
      { type: "paragraph", text: "A tenhle příběh je nebezpečný, protože bere chuť začít znovu." },
      {
        type: "paragraph",
        text: "Co s tím: Výpadek není důkaz, že na to nemáš. Je to normální součást procesu. Důležité je umět udělat návrat rychle. Ne až od pondělí.",
      },
      { type: "heading", text: "5) Tlačíš na sebe příliš a cvičení začne znít jako povinnost" },
      { type: "paragraph", text: "Jakmile se z pohybu stane další „musím“, odpor poroste. A čím víc se budeš nutit, tím víc ti to bude znechucovat." },
      {
        type: "paragraph",
        text: "Co s tím: Vrať tomu smysl. Ne „musím cvičit“, ale „chci se cítit líp v těle a v hlavě“. Ten důvod musí být lidský. Ne trest, ale pomoc.",
      },
      { type: "heading", text: "6) Chceš být dokonalá, a tak radši nejsi vůbec" },
      { type: "paragraph", text: "Perfekcionismus je tichý zabiják. Když to nejde na sto procent, máš pocit, že to nemá cenu. A pak přijde nula." },
      {
        type: "paragraph",
        text: "Co s tím: Přestaň měřit úspěch podle dokonalosti. Začni ho měřit podle návratu. Dlouhodobě vyhrává ten, kdo se umí vrátit bez dramatu.",
      },
      { type: "heading", text: "7) Jsi na to sama a všechno držíš jen vůlí" },
      { type: "paragraph", text: "Když jedeš sama, musíš se každý den znovu přesvědčovat. A vůle není bezedná." },
      {
        type: "paragraph",
        text: "Co s tím: Pomáhá mít podporu. Prostředí, které tě připomene, že i malý krok se počítá. A že výpadek je normální, ne konec.",
      },
      { type: "heading", text: "Jak poznáš, který důvod je u tebe největší" },
      {
        type: "paragraph",
        text: "Zkus si to zjednodušit. Když to zase spadne, bývá to nejčastěji jedna z těchto věcí: přepálila jsi start, neměla jsi pojistku pro horší dny, nebo ses po výpadku trestala místo návratu.",
      },
      { type: "paragraph", text: "Stačí najít ten jeden největší kámen úrazu. A upravit jen ten. Protože často nejde o to dělat víc. Jde o to dělat to chytřeji." },
    ],
    closingSections: {
      smallStep: ["Vyber si jeden bod z článku, který u tebe sedí nejvíc. A napiš si jednoduchou změnu, kterou uděláš hned zítra. Stačí jedna."],
      reflection: [
        "Kdy ti to nejčastěji spadne? Když se ti sejde víc věcí, když jsi unavená, nebo když vynecháš a začneš se trestat?",
        "Co je u tebe ten jeden důvod, který všechno shazuje nejčastěji?",
      ],
      eveningTask: ["Napiš si dvě věty. Jednu pro normální den a jednu pro horší den.", "V normální den udělám _____. V horší den udělám _____."],
      finalQuote: "Nejde o disciplínu. Jde o nastavení, které tě podrží i ve dnech, kdy nejsi ve formě.",
    },
  },
  {
    slug: "jak-se-vratit-ke-cviceni-po-vypadku",
    title: "Jak se vrátit po výpadku: co dělat, když jsi týden (nebo měsíc) nic nedělala",
    excerpt: "Největší rozdíl dělá návrat, který je jednoduchý. Ukážu ti, jak se vrátit chytře, aby výpadek nebyl konec.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-06-22",
    readingTime: 4,
    seoTitle: "Jak se vrátit ke cvičení po výpadku: když jsi týden nebo měsíc necvičila",
    seoDescription:
      "Vypadla jsi z režimu a nevíš, jak začít znovu? Praktický návod, jak se vrátit ke cvičení po týdnu i měsíci bez tlaku, výčitek a přepalování.",
    seoKeywords: [
      "jak se vrátit ke cvičení po výpadku",
      "jak začít znovu cvičit",
      "co dělat když vynechám cvičení",
      "jak vydržet cvičit dlouhodobě",
      "jak si vytvořit návyk cvičení",
      "jak začít cvičit po pauze",
    ],
    recommended: false,
    ctaType: "challenge",
    content: [
      { type: "paragraph", text: "Nejhorší na výpadku často není ten výpadek." },
      {
        type: "paragraph",
        text: "Nejhorší je to, co se spustí v hlavě: „Zase jsem to pokazila.“ „Nemá cenu začínat, když u toho stejně nevydržím.“ „Teď už je to jedno, začnu zase někdy…“",
      },
      { type: "paragraph", text: "A tak se z jednoho týdne stane měsíc. Ne proto, že bys byla slabá. Ale protože se snažíš vrátit způsobem, který je moc tvrdý a moc rychlý." },
      {
        type: "paragraph",
        text: "Tenhle článek ti dá jednoduchý návratový systém, díky kterému se zase rozjedeš bez dramatu. A hlavně bez toho, aby ses hned první týden přepálila.",
      },
      { type: "heading", text: "Proč je návrat po výpadku tak těžký" },
      { type: "paragraph", text: "Když vypadneš, zvedne se ti vnitřní tlak. Máš pocit, že to musíš „napravit“. Že musíš začít pořádně. Že to musíš dohnat." },
      { type: "paragraph", text: "Jenže tím si sama nastavíš laťku tak vysoko, že mozek začne panikařit. A tělo se tomu brání." },
      { type: "paragraph", text: "Proto nejdůležitější pravidlo zní: Návrat nesmí bolet. Návrat má být snadný na začátku." },
      { type: "paragraph", text: "Ne proto, že bys měla málo ambicí. Ale proto, že návrat není výkon. Návrat je rozjezd." },
      { type: "heading", text: "Zapomeň na „od pondělí“. Vrať se dnes, ale chytře" },
      { type: "paragraph", text: "„Od pondělí“ je často jen elegantní odklad." },
      {
        type: "paragraph",
        text: "Mnohem lepší je vrátit se dnes jedním malým krokem. Ne proto, aby ses „zase rozjela na 100 %“. Ale proto, aby sis v hlavě přepnula: „Jsem zpátky.“",
      },
      { type: "paragraph", text: "Tenhle pocit je pro dlouhodobost důležitější než jakýkoliv dokonalý plán." },
      { type: "heading", text: "3 kroky, které fungují skoro vždy" },
      { type: "heading", text: "1) Přestaň se vracet na 100 %" },
      { type: "paragraph", text: "Tohle je nejčastější chyba. Po výpadku chceš jet stejně jako v době, kdy jsi byla v rytmu. Jenže rytmus teď nemáš." },
      { type: "paragraph", text: "Vrať se na menší úroveň. Takovou, kterou zvládneš i v týdnu, kdy je to náročné. Neztrácíš tím čas. Naopak. Tím si kupuješ stabilitu." },
      { type: "heading", text: "2) Vrať se k jediné věci, ne ke všemu najednou" },
      { type: "paragraph", text: "Po výpadku lidé často zkusí najednou zlepšit pohyb, jídlo, spánek, pitný režim a celkově „život“." },
      { type: "paragraph", text: "To je příliš. A přetížení je přesně to, co tě dostalo do výpadku." },
      { type: "paragraph", text: "Vrať se nejdřív k jedné věci. Ideálně k té, která ti dělá největší rozdíl v energii a náladě." },
      { type: "heading", text: "3) Nastav si návrat jako dva jednoduché dny, ne jako nový režim" },
      { type: "paragraph", text: "Neplánuj hned celý měsíc. Naplánuj si dva konkrétní dny, kdy uděláš malou verzi." },
      { type: "paragraph", text: "Protože jakmile uděláš první dva kroky, vrací se důvěra. A s důvěrou přichází chuť pokračovat." },
      { type: "heading", text: "Jak si vybrat správnou „malou verzi“ po výpadku" },
      {
        type: "paragraph",
        text: "Správná malá verze má dvě vlastnosti: je tak jednoduchá, že ji uděláš i ve dnech, kdy se ti nechce. A zároveň je dost konkrétní, abys věděla, kdy je hotovo.",
      },
      { type: "paragraph", text: "Když to zůstane vágní („nějak se vrátím“), mozek bude pořád vyjednávat. Když je to konkrétní, je to mnohem lehčí." },
      { type: "heading", text: "Co dělat s výčitkami, aby ti návrat nezničily" },
      { type: "paragraph", text: "Výčitky zní jako motivace, ale ve skutečnosti berou energii. A energie je přesně to, co po výpadku potřebuješ nejvíc." },
      { type: "paragraph", text: "Zkus jednu jednoduchou větu, která funguje překvapivě dobře: „Nezačínám znovu. Jen navazuju.“" },
      { type: "paragraph", text: "Tohle ti dá pocit, že pokračuješ v příběhu, místo abys znovu stála na startu." },
      { type: "heading", text: "Když máš pocit, že už je to „moc daleko“" },
      { type: "paragraph", text: "Tohle je běžné hlavně po delší pauze. Člověk má pocit, že ztratil kondici, že je „na začátku“." },
      {
        type: "paragraph",
        text: "Jenže tvoje tělo není tabule, která se smaže. Pamatuje si víc, než si myslíš. A hlavně, nejde o to být hned tam, kde jsi byla. Jde o to udělat první krok.",
      },
      { type: "paragraph", text: "A ten první krok má být tak malý, aby byl snadný. Opravdu." },
    ],
    closingSections: {
      smallStep: ["Napiš si jednu větu: „Dnes udělám malou verzi.“ A doplň konkrétně kdy. Ne „někdy“. Konkrétní moment."],
      reflection: [
        "Kdy u tebe obvykle začíná výpadek? Je to únava, stres, nebo moc vysoká laťka?",
        "Co by se změnilo, kdybys návrat brala jako rozjezd, ne jako zkoušku?",
      ],
      eveningTask: [
        "Zítra se vracím v ____ (čas nebo moment v dni).",
        "Moje malá verze je ____ (krátká a konkrétní).",
        "Když se mi nebude chtít, připomenu si: ____ (jedna věta, která tě podrží).",
      ],
      finalQuote: "Nezáleží na tom, že jsi vypadla. Záleží na tom, že se umíš vrátit bez trestu a bez tlaku.",
    },
  },
  {
    slug: "vycitky-z-jidla",
    title: "Výčitky z jídla a cvičení: jak je zastavit a neházet flintu do žita",
    excerpt:
      "Praktický „STOP postup“, který zastaví spirálu viny a vrátí tě do režimu už dalším krokem. Bez trestání a bez restartu.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-05-29",
    readingTime: 4,
    seoTitle: "Výčitky z jídla a cvičení: jak je zastavit a vrátit se do režimu",
    seoDescription:
      "Máš výčitky z jídla nebo z toho, že jsi necvičila? Zjisti, proč výčitky nefungují a použij praktický STOP postup, který tě vrátí do režimu bez sebetrestání.",
    seoKeywords: [
      "výčitky z jídla",
      "výčitky po jídle",
      "výčitky ze sladkého",
      "výčitky z přejídání",
      "jak se zbavit výčitek",
      "jak se vrátit do režimu",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Výčitky jsou zvláštní věc. Nejsou vidět, ale umí ti sebrat víc energie než celý náročný den." },
      {
        type: "paragraph",
        text: "Dáš si něco „navíc“. Vynecháš cvičení. Přijde večer a v hlavě se rozjede film: „Zase jsem to pokazila.“ „Nemám žádnou vůli.“ „Když už jsem to porušila, tak je to jedno.“",
      },
      { type: "paragraph", text: "A přesně tady se to láme. Ne v tom jídle. Ne v tom vynechání. Ale v tom, co si pak začneš říkat." },
      {
        type: "paragraph",
        text: "Výčitky totiž často nevedou k lepším rozhodnutím. Vedou k tomu, že se na sebe naštveš, přitvrdíš, nebo to vzdáš. A pak jedeš z extrému do extrému.",
      },
      { type: "paragraph", text: "Tenhle článek ti dá jednoduchý „stop postup“, jak to zastavit a vrátit se do režimu normálně. Bez trestání. Bez dramat. Bez restartu od pondělí." },
      { type: "heading", text: "Proč výčitky nefungují, i když se tváří jako motivace" },
      { type: "paragraph", text: "Výčitky vypadají jako kontrola. Jako „musím se hlídat“. Jenže ve skutečnosti je to stres." },
      { type: "paragraph", text: "A stres dělá tři věci: zvyšuje chutě, snižuje kapacitu rozhodovat se v klidu a tlačí tě do rychlých řešení." },
      { type: "paragraph", text: "Proto když si vynadáš, často nepřijde „lepší režim“. Přijde další jídlo, další odklad, další pocit viny." },
      { type: "paragraph", text: "Výčitky nejsou motor. Výčitky jsou brzda." },
      { type: "heading", text: "První krok: odděl chybu od hodnoty" },
      { type: "paragraph", text: "Jedna z největších pastí je tohle: spojíš jedno rozhodnutí s tím, jaká jsi." },
      { type: "paragraph", text: "Ne „dala jsem si víc sladkého“, ale „jsem neschopná“. Ne „dnes jsem necvičila“, ale „nikdy to nevydržím“." },
      { type: "paragraph", text: "A pak se nediv, že se ti nechce pokračovat. Kdo by pokračoval v něčem, kde má pocit, že je pořád špatně?" },
      { type: "paragraph", text: "Proto první věta, kterou se potřebuješ naučit, je: „Tohle byla chyba v rozhodnutí, ne důkaz o mně.“" },
      { type: "paragraph", text: "Zní to jednoduše. Ale je to zásadní." },
      { type: "heading", text: "STOP postup: co dělat hned, když se spustí výčitky" },
      { type: "paragraph", text: "Tady je praktický postup, který můžeš použít okamžitě. Není to teorie. Je to věc, která tě vytáhne zpátky do klidu." },
      { type: "heading", text: "S jako Stop" },
      { type: "paragraph", text: "Zastav se. Doslova na pár vteřin. Neřeš teď, co budeš dělat zítra. Jen zastav spirálu." },
      { type: "heading", text: "T jako Tělo" },
      { type: "paragraph", text: "Zeptej se: „Co se děje v mém těle?“ Jsem teď hladová, nebo jen napjatá? Jsem unavená? Jsem ve stresu?" },
      { type: "paragraph", text: "Výčitky jsou často hlava. Tělo ti dá pravdivější odpověď." },
      { type: "heading", text: "O jako Odpusť si jednu věc" },
      { type: "paragraph", text: "Tohle není „pustím si všechno“. Tohle je reset." },
      { type: "paragraph", text: "Řekni si jednu větu: „Dneska to nebylo ideální. Ale nekončí to tím.“" },
      { type: "paragraph", text: "Tím si uvolníš tlak, který tě jinak tlačí do extrému." },
      { type: "heading", text: "P jako Příští malý krok" },
      { type: "paragraph", text: "Teď udělej jednu konkrétní malou věc, která tě vrátí do režimu. Ne pět věcí. Jednu." },
      {
        type: "paragraph",
        text: "Může to být další jídlo, které bude normální. Může to být voda. Může to být krátký pohyb. Může to být spánek. Cokoliv, co ti řekne: „Jsem zpátky.“",
      },
      { type: "paragraph", text: "Tohle je pointa: výčitky se nerozpustí přemýšlením. Rozpustí se návratem do akce, ale jemně." },
      { type: "heading", text: "Nejčastější chyba po „přešlapu“: trest" },
      { type: "paragraph", text: "Trest vypadá logicky. „Zítra to vykompenzuju.“ „Zítra budu jíst míň.“ „Zítra si dám dvojnásobný cvičení.“" },
      { type: "paragraph", text: "Jenže trest je přesně to, co drží ten kolotoč." },
      { type: "paragraph", text: "Trest vytváří tlak. Tlak vytváří odpor. Odpor vytváří výpadek. A výpadek vytváří další výčitky." },
      { type: "paragraph", text: "Jestli chceš z toho ven, potřebuješ přestat kompenzovat a začít navazovat." },
      { type: "paragraph", text: "Jedno jídlo tě nezničí. Jeden den bez cvičení tě nezničí. Zničí tě až ten příběh, že „už je to jedno“." },
      { type: "heading", text: "Jak to udělat prakticky: „další jídlo je reset“" },
      { type: "paragraph", text: "Tohle je pro spoustu žen objev." },
      { type: "paragraph", text: "Nemusíš čekat na pondělí. Nemusíš čekat na zítřek. Můžeš se vrátit už dalším jídlem. To je celý." },
      { type: "paragraph", text: "Dala sis sušenky odpoledne? Dobře. Večeře může být normální. Bez trestu. Bez extrému." },
      { type: "paragraph", text: "Vynechala jsi cvičení? Dobře. Zítra uděláš malou verzi. Ne trest. Malý krok." },
      { type: "paragraph", text: "Tímhle přístupem si postupně buduješ to nejcennější: důvěru v sebe. Že když se něco pokazí, umíš se vrátit." },
      { type: "heading", text: "Co dělat, když se výčitky opakují pořád dokola" },
      { type: "paragraph", text: "Pak je dobrý podívat se, jestli nemáš nastavenou moc přísnou laťku. Protože výčitky často nevznikají z reality. Vznikají z očekávání." },
      { type: "paragraph", text: "Jestli máš pocit, že musíš být pořád „perfektní“, výčitky budou vždycky čekat za rohem. A to je vyčerpávající." },
      { type: "paragraph", text: "Zkus si položit otázku: „Co je v mém životě realistický režim, který zvládnu držet dlouhodobě?“ Tohle je otázka, která tě vytáhne z extrémů." },
    ],
    closingSections: {
      smallStep: [
        "Až dnes přijde výčitka, zastav se a řekni si: „Tohle je jen jeden moment. Nekončí to tím.“ A udělej jeden malý krok, který tě vrátí zpátky.",
      ],
      reflection: [
        "Kdy se u tebe výčitky objevují nejčastěji? Po sladkém, po vynechání cvičení, nebo když máš pocit, že nejsi „dost dobrá“?",
        "Co by se změnilo, kdybys na sebe mluvila jako na kamarádku?",
      ],
      eveningTask: [
        "Napiš si svůj osobní „STOP postup“ do 4 vět: Stop. Co se děje v mém těle? Jedna věta, kterou si odpustím. Můj příští malý krok.",
        "A nech si to někde po ruce. Až to přijde, nebudeš přemýšlet. Prostě to použiješ.",
      ],
      finalQuote: "Výčitky tě nevrátí do režimu. Vrátí tě do něj jeden malý krok.",
    },
  },
  {
    slug: "jak-ziskat-podporu-doma",
    title: "Jak získat podporu doma: když chceš změnu, ale okolí tě brzdí",
    excerpt:
      "Konkrétní věty a dohody, díky kterým budeš mít víc prostoru pro sebe. Bez hádek, bez obhajování, s větším klidem doma.",
    categorySlug: "motivace-a-podpora",
    publishedAt: "2026-07-14",
    readingTime: 5,
    seoTitle: "Jak získat podporu doma při hubnutí a cvičení (bez konfliktů a výčitek)",
    seoDescription:
      "Chceš změnu, ale doma tě brzdí partner nebo rodina? Praktický návod, jak komunikovat svoje potřeby, nastavit hranice a získat prostor pro sebe bez hádek.",
    seoKeywords: [
      "podpora od partnera při hubnutí",
      "podpora od partnera při cvičení",
      "jak získat podporu doma",
      "jak říct partnerovi že chci cvičit",
      "jak si říct o čas pro sebe",
      "jak nastavit hranice v rodině",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Možná to znáš." },
      {
        type: "paragraph",
        text: "Ty se konečně rozhodneš, že se o sebe začneš starat. Ne „až bude klid“. Teď. Chceš víc energie, lepší pocit v těle, víc klidu v hlavě.",
      },
      { type: "paragraph", text: "A doma to zní třeba takhle:" },
      { type: "quote", text: "„Zase chceš cvičit?“ „To jako držíš dietu?“ „Tak si dej, vždyť o nic nejde.“ „Proč to tak hrotíš?“" },
      {
        type: "paragraph",
        text: "A najednou máš chuť to zabalit. Ne proto, že bys o to nestála. Ale protože je těžký jít proti nejbližším lidem. A ještě těžší je obhájit si čas pro sebe bez pocitu viny.",
      },
      {
        type: "paragraph",
        text: "Tenhle článek ti pomůže pochopit, proč to doma často drhne, a hlavně ti dá konkrétní způsob komunikace, díky kterému získáš víc podpory a prostoru. Bez hádek, bez výčitek, bez toho, že budeš muset vysvětlovat každou sušenku.",
      },
      { type: "heading", text: "Proč tě okolí brzdí, i když tě má rádo" },
      { type: "paragraph", text: "Tohle je důležité pochopit, protože jinak budeš mít pocit, že ti to schválně kazí." },
      { type: "paragraph", text: "Ve většině případů je to kombinace tří věcí." },
      { type: "paragraph", text: "První je zvyk. Doma máte nějaký režim. Když ho začneš měnit, narušuje to pohodu, na kterou jsou všichni zvyklí." },
      {
        type: "paragraph",
        text: "Druhá je nejistota. Když ty něco měníš, druhý člověk si někdy začne připadat ohroženě. Že najednou nebude stačit. Že ho „přerosteš“. Nebo že mu tím nastavuješ zrcadlo.",
      },
      { type: "paragraph", text: "Třetí je nepochopení. Ty víš, že chceš víc energie a klidu. Ale pro druhé to může vypadat jako „další výmysl“, nebo „zase něco“." },
      { type: "paragraph", text: "Neznamená to, že to máš vzdát. Znamená to, že potřebuješ mluvit tak, aby to nebyl konflikt." },
      { type: "heading", text: "Největší chyba: snažit se partnera přesvědčit, aby to dělal s tebou" },
      { type: "paragraph", text: "Možná sis řekla: „Kdyby se přidal, bylo by to snazší.“" },
      { type: "paragraph", text: "Jenže tlak často vyvolá odpor. A pak jsi naštvaná ty i on. A doma vznikne napětí." },
      { type: "paragraph", text: "Podpora neznamená, že druhý člověk musí dělat to samé. Podpora znamená, že ti dá prostor. A že tě nebude shazovat nebo sabotovat." },
      { type: "paragraph", text: "Cíl není „přetvořit partnera“. Cíl je získat podmínky, ve kterých to půjde." },
      { type: "heading", text: "Co chceš doopravdy? Ne podporu. Často chceš prostor" },
      { type: "paragraph", text: "Spousta žen říká „chci podporu“, ale myslí tím jednu z těchto věcí:" },
      {
        type: "list",
        ordered: false,
        items: [
          "Chci, aby mi někdo nekomentoval jídlo.",
          "Chci, aby mi doma nezlehčovali moje rozhodnutí.",
          "Chci, aby mi někdo pohlídal děti 20 minut.",
          "Chci, aby mi nikdo neházel klacky pod nohy.",
        ],
      },
      { type: "paragraph", text: "Tohle je důležité pojmenovat. Protože když řekneš „podporuj mě“, je to vágní. A druhý člověk neví, co má dělat." },
      { type: "paragraph", text: "Když řekneš konkrétní věc, je to mnohem jednodušší." },
      { type: "heading", text: "Jak to říct tak, aby to nevyvolalo obranu" },
      { type: "paragraph", text: "Tady je jednoduchá struktura, která funguje skoro vždy, protože není útočná a je konkrétní." },
      { type: "heading", text: "1) Začni tím, že řekneš proč" },
      { type: "paragraph", text: "Ne „protože chci zhubnout“ (to u někoho spustí komentáře). Spíš „protože chci mít víc energie a cítit se líp“." },
      { type: "heading", text: "2) Řekni jednu konkrétní věc, kterou potřebuješ" },
      { type: "paragraph", text: "Ne deset věcí. Jednu." },
      { type: "heading", text: "3) Ujisti, že to není proti němu" },
      { type: "paragraph", text: "Spousta lidí se brání, protože mají pocit, že je to kritika jejich stylu života." },
      { type: "paragraph", text: "A teď konkrétní věta, kterou můžeš použít:" },
      {
        type: "quote",
        text: "Chci se o sebe víc starat, protože chci mít víc energie a být víc v pohodě. Potřebuju k tomu prosím jednou denně 20 minut klidu. Pomůže mi, když v tu dobu pohlídáš děti nebo když mě necháš na chvíli být.",
      },
      { type: "paragraph", text: "Je to jasný. Bez výčitek. Bez dramatu." },
      { type: "heading", text: "Co dělat, když partner rýpe nebo to shazuje" },
      { type: "paragraph", text: "Tady je důležité udělat jednu věc: nastavit hranici." },
      { type: "paragraph", text: "Ne hádat se. Ne vysvětlovat hodinu. Jen říct hranici. Například:" },
      { type: "quote", text: "Vím, že to myslíš jako legraci, ale mně to nepomáhá. Potřebuju, abys to nekomentoval." },
      { type: "paragraph", text: "Tahle věta je jednoduchá, dospělá a neútočná. A opakování je klíč. Ne jednou. Opakovaně. Klidně." },
      { type: "heading", text: "Co dělat, když tě doma lákají na sladké nebo „jen si dej“" },
      { type: "paragraph", text: "Tohle je častý. Někdo ti něco nabídne a ty se cítíš blbě, když odmítneš." },
      {
        type: "paragraph",
        text: "Tady pomáhá mít připravenou větu, která je krátká a bez vysvětlování: „Díky, dneska nechci.“ „Dám si později.“ „Dneska mi to nedělá dobře.“",
      },
      { type: "paragraph", text: "Čím víc vysvětluješ, tím víc to druhý člověk rozebírá. Krátká věta je nejlepší." },
      { type: "paragraph", text: "A ještě jedna věc: když se rozhodneš si něco dát, dej si to vědomě. Ne proto, že tě někdo ukecal. Tím si udržíš pocit, že situaci řídíš ty." },
      { type: "heading", text: "Když máš děti: jak si vytvořit prostor bez pocitu, že jsi sobec" },
      { type: "paragraph", text: "Tohle je citlivé téma. Spousta žen má pocit, že když si vezme 20 minut pro sebe, někomu ubírá." },
      { type: "paragraph", text: "Jenže pravda je, že když se o sebe dlouhodobě nestaráš, nemáš z čeho dávat." },
      { type: "paragraph", text: "Zkus si to přerámovat: těch 20 minut není luxus. Je to údržba. Je to prevence. Aby ses nezlomila." },
      { type: "paragraph", text: "A děti se tím učí důležitou věc. Že máma taky něco potřebuje. Že péče o sebe je normální." },
      { type: "heading", text: "Jedna věc, která dělá největší rozdíl: dohoda, ne prosba" },
      { type: "paragraph", text: "Prosba zní jako „když budeš hodný“. Dohoda zní jako „tak tohle je nový režim“." },
      { type: "paragraph", text: "Zkus to říct takhle:" },
      {
        type: "quote",
        text: "Každý den potřebuju 20 minut jen pro sebe. Bude to vždycky po večeři. Ty budeš s dětmi a já si udělám svoje. Pak budu zase naplno s vámi.",
      },
      { type: "paragraph", text: "Tohle je dospělá dohoda. A většina lidí na to reaguje lépe než na „prosím, jestli by to šlo“." },
    ],
    closingSections: {
      smallStep: [
        "Napiš si jednu konkrétní věc, kterou doma potřebuješ, aby se ti žilo líp. Ne „podporu“. Konkrétně. Čas, klid, nekomentovat jídlo, pomoc s dětmi.",
      ],
      reflection: [
        "Co tě doma brzdí nejvíc. Je to komentování, nedostatek času, nebo pocit viny?",
        "Co by se změnilo, kdybys o tom mluvila jako o dohodě, ne jako o prosbě?",
      ],
      eveningTask: [
        "Napiš si jednu krátkou větu, kterou zítra řekneš partnerovi nebo rodině. Podle struktury: Proč to dělám. Co konkrétně potřebuji. Kdy to bude.",
        "A řekni to klidně a stručně. Bez obhajování.",
      ],
      finalQuote: "Podpora doma nezačíná tím, že tě někdo pochopí. Začíná tím, že ty jasně řekneš, co potřebuješ.",
    },
  },
  {
    slug: "jsem-porad-unavena",
    title: "Jsem pořád unavená: 10 nejčastějších důvodů a co s tím v běžném životě",
    excerpt: "Únava má často jasný spouštěč. Pomůžu ti najít ten tvůj a vybrat jednu změnu, která udělá největší rozdíl.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-06-02",
    readingTime: 4,
    seoTitle: "Jsem pořád unavená: co dělat? 10 důvodů a jednoduchá řešení",
    seoDescription:
      "Jsi pořád unavená a nevíš proč? Zjisti 10 nejčastějších příčin únavy v běžném životě a vyber jednu změnu, která ti vrátí energii nejrychleji.",
    seoKeywords: [
      "jsem pořád unavená co dělat",
      "jsem pořád unavená",
      "únava přes den",
      "proč jsem pořád unavená",
      "nemám energii na nic",
      "jak mít víc energie",
    ],
    recommended: true,
    ctaType: "community",
    content: [
      { type: "quote", text: "Já nevím, co se se mnou děje. Já jsem prostě pořád unavená." },
      {
        type: "paragraph",
        text: "Pokud tuhle větu říkáš často, nejsi sama. A hlavně, nemusí to znamenat, že jsi „slabá“ nebo že s tebou něco je. U spousty žen je únava kombinace běžných, opakujících se věcí, které se v tichosti sčítají.",
      },
      {
        type: "paragraph",
        text: "A problém je, že únava je zrádná. Když jsi unavená, všechno je těžší. Jídlo se zhorší. Pohyb se odkládá. Spánek se rozsype. A tvoje hlava má pocit, že už „nemá z čeho brát“.",
      },
      {
        type: "paragraph",
        text: "Tenhle článek ti pomůže udělat dvě věci: Najít, co je u tebe největší žrout energie. A vybrat jednu změnu, která ti udělá největší rozdíl. Ne deset věcí. Jednu.",
      },
      { type: "heading", text: "Nejdřív si ujasněme jednu věc: únava není jen o spánku" },
      {
        type: "paragraph",
        text: "Spánek je často základ, ale není to jediná příčina. Klidně můžeš spát dost, a přesto se budit bez energie. Proto je dobré dívat se na únavu jako na součet.",
      },
      { type: "paragraph", text: "Začni jednoduchou otázkou: Je to spíš únava těla, nebo únava hlavy?" },
      {
        type: "paragraph",
        text: "Když je to tělo, bývá v tom režim, pohyb, jídlo, spánek. Když je to hlava, bývá v tom stres, zahlcení, neustálý tlak a pocit, že pořád něco musíš.",
      },
      { type: "paragraph", text: "Často je to mix obojího." },
      { type: "heading", text: "10 nejčastějších důvodů, proč jsi pořád unavená" },
      { type: "heading", text: "1) Spíš málo nebo nekvalitně" },
      { type: "paragraph", text: "Nejde jen o počet hodin. Jde o to, jestli se opravdu vypneš. U spousty žen je problém, že sice leží, ale hlava jede." },
      { type: "paragraph", text: "Co s tím v běžném životě: zkus si udělat večerní „vypínací moment“. Ne velký rituál. Jen něco, co tvému tělu dá signál, že den končí." },
      { type: "heading", text: "2) Jsi dlouhodobě ve stresu" },
      { type: "paragraph", text: "Stres tě může držet „na výkon“ přes den, ale večer ti vezme všechnu energii. A někdy se to projeví až za pár týdnů." },
      { type: "paragraph", text: "Co s tím: pokud je stres dlouhodobý, potřebuješ aspoň jednu krátkou věc, která ti během dne stáhne napětí. Ne dovolenou. Krátký reset." },
      { type: "heading", text: "3) Přes den jíš málo nebo nepravidelně" },
      { type: "paragraph", text: "Únava často není „chybí mi motivace“. Únava je „došlo mi palivo“. A když tělo přes den nedostane pravidelnou energii, večer tě to dožene." },
      { type: "paragraph", text: "Co s tím: najdi si jednu „pojistku“ přes den, aby večer nepřišel vlčí hlad a totální pád." },
      { type: "heading", text: "4) Máš málo bílkovin a vlákniny" },
      { type: "paragraph", text: "Když jíš jídla, která tě neudrží, energie ti lítá. A když lítá energie, lítá i nálada." },
      { type: "paragraph", text: "Co s tím: u jednoho jídla denně si dej cíl, aby tě opravdu zasytí. Jen u jednoho. A sleduj rozdíl." },
      { type: "heading", text: "5) Piješ málo vody" },
      { type: "paragraph", text: "Zní to banálně, ale i mírná dehydratace dělá únavu, bolest hlavy a horší soustředění." },
      { type: "paragraph", text: "Co s tím: neřeš litry. Řeš první krok. Sklenice vody ráno a jedna odpoledne je pro spoustu lidí překvapivý zlom." },
      { type: "heading", text: "6) Celý den sedíš a tělo je zatuhlé" },
      { type: "paragraph", text: "Sedavá práce unavuje. Ne tím, že bys něco dělala, ale tím, že tělo je celý den ve stejné poloze. To bere energii i náladu." },
      { type: "paragraph", text: "Co s tím: nepotřebuješ trénink. Potřebuješ během dne pár krátkých rozhýbání. Tělo se probere a hlava s ním." },
      { type: "heading", text: "7) Máš hlavu pořád online" },
      { type: "paragraph", text: "Notifikace, zprávy, sociální sítě, přepínání mezi úkoly. To je energeticky drahé. Mozek se nedostane do klidu." },
      { type: "paragraph", text: "Co s tím: zkus si jeden „offline blok“ během dne. Třeba jen 20 minut, kdy nic neřešíš a nikdo na tebe nemůže." },
      { type: "heading", text: "8) Přetěžuješ se a neumíš říct „dost“" },
      { type: "paragraph", text: "Když pořád jedeš pro ostatní, energie mizí. A pak máš pocit, že „už nemáš sílu ani na sebe“." },
      { type: "paragraph", text: "Co s tím: únava často není o tom, že bys potřebovala víc času. Je o tom, že potřebuješ víc hranic." },
      { type: "heading", text: "9) Jsi v režimu „všechno nebo nic“" },
      { type: "paragraph", text: "Buď jedeš naplno, nebo nejedeš vůbec. A tenhle přístup je vyčerpávající." },
      { type: "paragraph", text: "Co s tím: sniž laťku. Ne abys se odbývala, ale abys vydržela dlouhodobě. Udržitelný režim je méně vyčerpávající než permanentní restart." },
      { type: "heading", text: "10) Je to signál, že je dobré to řešit i zdravotně" },
      {
        type: "paragraph",
        text: "Tady budu férový. Pokud je únava dlouhodobá, výrazná, nebo se k ní přidává třeba dušnost, bušení srdce, velké výkyvy nálad, nebo se to náhle zhoršilo, je na místě probrat to i s lékařem. Může v tom být třeba nedostatek železa, štítná žláza, nebo něco dalšího.",
      },
      { type: "paragraph", text: "Neříkám to proto, abys měla strach. Říkám to proto, aby ses netočila půl roku v kruhu, když existuje jednoduché vysvětlení." },
      { type: "heading", text: "Jak si z toho vybrat jednu věc, která ti udělá největší rozdíl" },
      { type: "paragraph", text: "Teď to nejdůležitější. Nezkoušej změnit všechno." },
      { type: "paragraph", text: "Zkus si vybrat „hlavního žrouta energie“. Ten jeden bod, který u tebe sedí nejvíc a který se opakuje." },
      { type: "paragraph", text: "Pomůže ti otázka: Kdy je moje únava nejhorší a co tomu předchází?" },
      {
        type: "paragraph",
        text: "Pokud je to odpoledne, často je to jídlo, pití, sedavost, přepínání. Pokud je to večer, často je to stres, přetížení a absence vypnutí. Pokud je to hned ráno, často je to spánek nebo dlouhodobý stres.",
      },
      { type: "paragraph", text: "Vyber jednu věc. A tu zkus změnit jako první." },
    ],
    closingSections: {
      smallStep: ["Dnes si všimni, kdy únava přichází nejvíc. Ráno, odpoledne, nebo večer. A napiš si jednu větu: „Moje únava je nejhorší ____.“"],
      reflection: [
        "Když se zamyslíš nad posledními 7 dny, co ti bralo energii nejvíc? Spánek, stres, jídlo, nebo zahlcení hlavou?",
        "Kdyby sis měla vybrat jednu věc, kterou zlepšíš jako první, co to bude?",
      ],
      eveningTask: [
        "Vyber si jeden bod z článku, který u tebe sedí nejvíc, a napiš si konkrétní změnu na zítřek. Jen jednu.",
        "Například: „Zítra si dám v práci pojistku na jídlo.“ Nebo „Zítra si dám 20 minut bez mobilu.“",
      ],
      finalQuote: "Únava není tvoje osobní selhání. Je to signál, že potřebuješ změnit jednu konkrétní věc.",
    },
  },
  {
    slug: "stres-a-prejidani",
    title: "Stres a přejídání: proč se to děje a jak z toho ven bez extrémů",
    excerpt: "Když se jí ve stresu, není to o slabosti. Vysvětlím, co se děje v těle a jak to oslabit jednoduchými kroky během dne.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-05-05",
    readingTime: 4,
    seoTitle: "Stres a přejídání: proč se to děje a jak z toho ven (bez extrémů)",
    seoDescription:
      "Přejídáš se ve stresu a pak máš výčitky? Zjisti, proč to tělo dělá, jak funguje „mechanika stresu“ a co změnit, aby chutě zeslábly bez diet.",
    seoKeywords: [
      "stres a přejídání",
      "stresové přejídání",
      "přejídání ze stresu",
      "emoční jedení",
      "jak přestat jíst ve stresu",
      "výčitky z jídla",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Možná to znáš až moc dobře." },
      {
        type: "paragraph",
        text: "Přes den jedeš. Držíš se. Funguješ. Všechno zvládáš. A pak přijde večer. Konečně klid. A najednou máš chuť na sladké, na pečivo, na něco „jen na chvilku“. A než se naděješ, jíš víc, než jsi chtěla.",
      },
      {
        type: "paragraph",
        text: "A pak přijde druhá část: výčitky. A s nimi často i další restrikce. „Zítra budu hodná.“ „Zítra to vykompenzuju.“ A tlak se začne točit v kruhu.",
      },
      { type: "paragraph", text: "Tohle není o slabé vůli. Tohle je typický stresový mechanismus. A jakmile ho pochopíš, přestaneš se s tím prát silou a začneš to řešit chytře." },
      { type: "heading", text: "Proč stres tak často končí jídlem" },
      { type: "paragraph", text: "Stres není jen „pocit v hlavě“. Stres je stav těla." },
      {
        type: "paragraph",
        text: "Když jsi ve stresu, tělo je v pohotovosti. Mozek vyhodnocuje, že je potřeba energii. A hledá nejrychlejší způsob, jak ji získat a zároveň se uklidnit.",
      },
      { type: "paragraph", text: "Jídlo je pro mozek ideální kombinace: rychlá energie plus okamžitá úleva." },
      {
        type: "paragraph",
        text: "A ještě jedna věc: ve stresu se zhoršuje sebekontrola. Ne proto, že bys byla slabá, ale protože mozek má omezenou kapacitu. Když ji vyčerpáš řešením práce, lidí, dětí, problémů a rozhodování, večer už prostě nemáš rezervu.",
      },
      { type: "paragraph", text: "Proto se to často děje večer. Ne protože večer „nemáš vůli“. Ale protože večer už nemáš z čeho brát." },
      { type: "heading", text: "Mechanika stresu v praxi: proč chceš sladké a „něco navíc“" },
      { type: "paragraph", text: "Ve stresu se často kombinuje několik věcí najednou:" },
      { type: "paragraph", text: "Za prvé, přes den často jíš nepravidelně. Nestíháš. Odbýváš se. A tělo má večer deficit." },
      { type: "paragraph", text: "Za druhé, stres zvyšuje chuť na rychlou energii. Sladké a pečivo jsou pro mozek nejrychlejší řešení." },
      { type: "paragraph", text: "Za třetí, jídlo ti dá pocit, že máš aspoň něco pod kontrolou. Je to malá odměna v dni, kde se pořád někomu přizpůsobuješ." },
      { type: "paragraph", text: "A tohle všechno dohromady vytvoří situaci, která je úplně „normální“. Jen ji nikdo moc nevysvětluje." },
      { type: "heading", text: "Nejde o to přestat jíst ve stresu. Jde o to přestat to řešit extrémem" },
      { type: "paragraph", text: "Hodně žen se snaží stresové přejídání vyřešit přísností. Více kontroly. Více zákazů. Více pravidel." },
      { type: "paragraph", text: "Jenže stres a přísnost nejdou dohromady. Přísnost zvyšuje tlak. A tlak zvyšuje potřebu úlevy. A úleva se často najde v jídle." },
      { type: "paragraph", text: "Proto extrémy nefungují." },
      { type: "paragraph", text: "Nejsilnější změna je, když si místo extrémů nastavíš jednoduché kroky, které stres „oslabí“ dřív, než dojde k přejídání." },
      { type: "heading", text: "4 situace, kdy stresové přejídání nejčastěji vzniká" },
      { type: "paragraph", text: "Ať se v tom poznáš rychle, tady jsou nejčastější momenty:" },
      {
        type: "paragraph",
        text: "Když přijde náročný den a tělo má pocit, že si zaslouží odměnu. Když jsi přes den jedla málo a večer máš vlčí hlad. Když jdeš pozdě spát a hlava potřebuje uklidnit. Když se cítíš přetížená a jídlo je jediná „pauza“, kterou si dovolíš.",
      },
      { type: "paragraph", text: "Když víš, který z těchto momentů je u tebe nejčastější, víš zároveň, kde to můžeš nejsnáze změnit." },
      { type: "heading", text: "Jak z toho ven: konkrétní kroky bez extrémů" },
      {
        type: "paragraph",
        text: "Tady je důležité říct jednu věc. Neexistuje univerzální řešení. Ale existuje jednoduchý systém, který funguje u většiny lidí: pracuješ na třech bodech. Ne na deseti. Na třech.",
      },
      { type: "heading", text: "1) Oslab stres dřív, než přijde večer" },
      { type: "paragraph", text: "Nečekej, až bude nejhůř. Stačí jedna krátká věc během dne, která stáhne napětí. Když jdeš celý den v napětí, večer se to musí někde uvolnit." },
      { type: "paragraph", text: "Nemusí to být nic velkého. Jen krátký reset. Tím se večerní chuť často zmírní." },
      { type: "heading", text: "2) Přestaň jít do večera vyhladovělá" },
      { type: "paragraph", text: "Tohle je praktická věc, která často udělá největší rozdíl." },
      { type: "paragraph", text: "Když do večera jdeš s deficitem, přejídání je skoro nevyhnutelné. Tělo si vezme, co potřebuje. A ve stresu si vezme rychlou energii." },
      { type: "paragraph", text: "Proto je lepší mít v dni jednu pojistku, která tě udrží. Ne dokonalý jídelníček. Pojistku." },
      { type: "heading", text: "3) Vytvoř si večerní „mezistupeň“" },
      { type: "paragraph", text: "Stresové přejídání je často automatika. Vlezeš do kuchyně, otevřeš ledničku a jedeš." },
      { type: "paragraph", text: "Mezistupeň je malá pauza mezi impulsem a jídlem. Ne jako zákaz. Jako prostor na rozhodnutí." },
      { type: "paragraph", text: "Když ten mezistupeň uděláš, často zjistíš, že nepotřebuješ tolik. Nebo že potřebuješ něco jiného než jídlo." },
      { type: "heading", text: "Co dělat, když už se to rozjede" },
      { type: "paragraph", text: "Nejhorší je, když se ti rozjede přejídání a ty si řekneš „tak už je to jedno“. To je moment, kdy se to zlomí." },
      { type: "paragraph", text: "Mnohem lepší je udělat jednu věc: zastavit se a vrátit se do normálu dalším krokem." },
      { type: "paragraph", text: "Ne zítra. Ne od pondělí. Dalším krokem." },
      { type: "paragraph", text: "Tohle je obrovský rozdíl mezi „jsem v kruhu“ a „umím se vrátit“." },
      { type: "heading", text: "Jak poznáš, že se to zlepšuje" },
      { type: "paragraph", text: "Ne podle toho, že už nikdy nebudeš mít chuť na sladké. To by byl nesmysl." },
      { type: "paragraph", text: "Poznáš to podle toho, že: večerní chutě nejsou tak silné, dokážeš se zastavit dřív, a hlavně se po přešlapu netrestáš." },
      { type: "paragraph", text: "To je cesta ven." },
    ],
    closingSections: {
      smallStep: ["Dnes si všimni jedné věci: kdy přichází první chuť „na úlevu“. Není to večer, často to začíná už odpoledne. Jen si to všimni."],
      reflection: [
        "Když se přejídáš ve stresu, co ti to jídlo dává? Je to energie, odměna, nebo uklidnění?",
        "Co z toho by šlo dát tělu i jinak, aspoň malou část?",
      ],
      eveningTask: [
        "Napiš si jednu větu jako mezistupeň: „Když budu mít dnes chuť jíst ze stresu, nejdřív udělám ____ a pak se rozhodnu.“",
        "Vyber něco jednoduchého. Minutu klidu, sprchu, čaj, tři nádechy. Cokoliv, co ti dá prostor.",
      ],
      finalQuote: "Stresové přejídání není tvoje selhání. Je to signál, že potřebuješ víc úlevy a míň tlaku.",
    },
  },
  {
    slug: "jak-si-nastavit-hranice",
    title: "Jak si nastavit hranice, když máš plný diář (a pořád se obětuješ)",
    excerpt:
      "Konečně si chráníš čas a energii tak, aby ti něco zbylo i na sebe. Prakticky, bez dlouhých řečí, s konkrétními větami do života.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-05-17",
    readingTime: 4,
    seoTitle: "Jak si nastavit hranice: když máš plný diář a pořád se obětuješ",
    seoDescription:
      "Máš plný diář a jdeš pořád na úkor sebe? Praktický návod, jak si nastavit hranice, říkat ne bez konfliktů a chránit čas i energii v běžném životě.",
    seoKeywords: ["jak si nastavit hranice", "jak říct ne", "jak si říct o čas pro sebe", "hranice v rodině", "hranice v práci", "jak se přestat obětovat"],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Jestli máš pocit, že tvůj den je jedna dlouhá služba pro ostatní, nejsi v tom sama." },
      { type: "paragraph", text: "Někdo něco potřebuje. Někdo něco chce. Někde je potřeba „rychle pomoct“. A ty to umíš. Jsi spolehlivá. Zodpovědná. Všechno zařídíš." },
      {
        type: "paragraph",
        text: "Jenže pak přijde večer a ty zjistíš, že jsi zase celý den neměla prostor ani na základní věci pro sebe. Jídlo odbité. Pohyb odložený. Hlava přetížená. A když si konečně sedneš, nemáš energii na nic.",
      },
      {
        type: "paragraph",
        text: "Hranice nejsou sobeckost. Hranice jsou způsob, jak si udržet energii, zdraví a dlouhodobě fungovat. A hlavně: hranice nejsou o tom, že budeš tvrdá. Hranice jsou o tom, že budeš jasná.",
      },
      { type: "heading", text: "Proč se pořád obětuješ, i když víš, že ti to škodí" },
      { type: "paragraph", text: "Často to není proto, že bys byla slabá. Je to kombinace tří věcí." },
      { type: "paragraph", text: "Zvykla sis být ta, na kterou je spoleh. A máš pocit, že když řekneš ne, zklameš." },
      { type: "paragraph", text: "Zároveň nechceš konflikty. Radši to uděláš sama, než aby byla doma nepříjemná atmosféra." },
      { type: "paragraph", text: "A pak je tu strach z toho, co si o tobě druzí pomyslí. Že budeš „sobec“. Že „to přeháníš“. Že „to dřív šlo“." },
      { type: "paragraph", text: "Jenže to, že to dřív šlo, často znamená, že jsi to dlouho držela na úkor sebe." },
      { type: "heading", text: "Hranice nejsou o tom, co řekneš. Jsou o tom, co uděláš" },
      { type: "paragraph", text: "Tady je krutá pravda, která ale osvobodí: Můžeš říct „já už nemůžu“ stokrát. Když pak stejně všechno uděláš, nic se nezmění." },
      { type: "paragraph", text: "Hranice fungují až ve chvíli, kdy se za nimi skutečně postavíš. Ne agresivně. Jen konzistentně." },
      { type: "paragraph", text: "Nejde o to být nepříjemná. Jde o to být předvídatelná. Aby ostatní věděli, co od tebe čekat." },
      { type: "heading", text: "Začni jednou věcí: najdi svůj největší „únik energie“" },
      { type: "paragraph", text: "Hranice se nenastavují na všechno najednou. Jinak se přetížíš a vzdáš to." },
      { type: "paragraph", text: "Zeptej se sama sebe: Co mi bere nejvíc času a energie a přitom to často není nutné?" },
      { type: "paragraph", text: "U někoho je to práce. U někoho domácnost. U někoho rodina, která si zvykla, že „ty to vždycky zařídíš“. U někoho telefon a zprávy." },
      { type: "paragraph", text: "Najdi jeden hlavní únik. Ten je tvůj první cíl." },
      { type: "heading", text: "Nejjednodušší způsob hranic: pravidlo „později“" },
      { type: "paragraph", text: "Hodně žen říká ano automaticky, protože nechtějí být za „tu špatnou“. A pak litují." },
      { type: "paragraph", text: "Tady je jednoduchý trik, který často stačí, aby se ten vzorec přerušil:" },
      { type: "paragraph", text: "Neříkej hned ano. Neříkej hned ne. Řekni „ozvu se“." },
      { type: "quote", text: "„Teď to nemůžu řešit, ozvu se večer.“ „Mrknu na to a dám vědět.“ „Nechám si to projít hlavou a napíšu.“" },
      { type: "paragraph", text: "Tím si kupuješ čas. A čas je přesně to, co potřebuješ, abys nefungovala jen automaticky." },
      { type: "heading", text: "Jak říct ne tak, aby to nevyvolalo hádku" },
      { type: "paragraph", text: "Spousta lidí se bojí slova „ne“, protože si představí konflikt." },
      { type: "paragraph", text: "Jenže konflikt často vzniká z dlouhého vysvětlování. Čím víc se obhajuješ, tím víc se to dá napadnout." },
      { type: "paragraph", text: "Funguje jednoduchá struktura: Řekni krátké ne. Řekni důvod jednou větou. A nabídni alternativu, pokud chceš." },
      { type: "quote", text: "„Dnes to nezvládnu, mám toho moc. Můžu to udělat zítra dopoledne.“ „Ne, dneska ne. Pokud je to urgentní, zkus prosím někoho jiného.“ „Teď ne. Ozvu se, až budu mít prostor.“" },
      { type: "paragraph", text: "Krátké, klidné, jasné." },
      { type: "heading", text: "Hranice doma: největší změna je domluvit se na čase pro sebe" },
      {
        type: "paragraph",
        text: "V domácnosti často nevzniká problém z toho, že by tě někdo chtěl ničit. Vzniká z toho, že není domluvený systém. Všechno je „nějak“ a ty pak automaticky převezmeš víc.",
      },
      { type: "paragraph", text: "Proto je mnohem lepší udělat dohodu než prosbu." },
      { type: "paragraph", text: "Místo: „Prosím, mohl bys…“ Spíš: „Potřebuju každý den 20 minut pro sebe. Bude to po večeři. Ty budeš s dětmi a já si udělám svoje.“" },
      { type: "paragraph", text: "To není drzost. To je dospělá dohoda." },
      { type: "heading", text: "Co dělat s pocitem viny, když si chceš vzít čas pro sebe" },
      { type: "paragraph", text: "Pocit viny nezmizí tím, že ho budeš ignorovat. Zmizí tím, že si přerámuješ význam." },
      { type: "paragraph", text: "Tvoje energie není nekonečná. A pokud ji budeš dlouhodobě rozdávat všem, jednou dojde. Pak nebudeš mít ani na sebe, ani na ostatní." },
      { type: "paragraph", text: "Čas pro sebe není odměna. Je to údržba." },
      { type: "paragraph", text: "A když si tohle začneš opakovat, vnitřní hlas „jsem sobec“ postupně zeslábne." },
      { type: "heading", text: "Hranice nejsou jednorázová akce. Jsou to malé opakované kroky" },
      { type: "paragraph", text: "Nemusíš zítra změnit celý život. Stačí začít jednou hranicí, kterou budeš držet." },
      { type: "paragraph", text: "Hodně lidí to zkouší tak, že udělají velkou změnu, pak povolí a vrátí se zpátky. Lepší je malé a konzistentní." },
      { type: "paragraph", text: "Jeden pevný moment v týdnu, jeden blok bez telefonu, jedna domluva doma, jeden způsob odpovídání na zprávy." },
      { type: "paragraph", text: "Hranice nejsou tvrdost. Hranice je rutina." },
    ],
    closingSections: {
      smallStep: ["Vyber si jednu věc, která ti nejčastěji bere čas a energii, a dnes u ní udělej jednu mini hranici. Třeba „ozvu se později“, nebo „teď ne“."],
      reflection: [
        "Kde nejčastěji říkáš ano, i když uvnitř chceš říct ne?",
        "Čeho se bojíš. Konfliktu, zklamání, nebo toho, že nebudeš „ta hodná“?",
      ],
      eveningTask: ["Napiš si tři věty, které můžeš používat pro hranice. Krátké. Klidné. Bez obhajování.", "Zítra jednu z nich použij v praxi."],
      finalQuote: "Hranice nejsou o tom být tvrdá. Hranice jsou o tom chránit svůj čas, aby ti zbyla energie i na sebe.",
    },
  },
  {
    slug: "perfekcionismus-jak-se-ho-zbavit",
    title: "Perfekcionismus: proč tě drží na místě (a jak začít dělat věci dostatečně dobře)",
    excerpt:
      "„Všechno nebo nic“ je nejrychlejší cesta k restartům. Ukážu ti, jak přepnout na opakovatelnost a držet rytmus i v obyčejném týdnu.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-06-06",
    readingTime: 4,
    seoTitle: "Perfekcionismus: jak se ho zbavit a přestat jet všechno nebo nic",
    seoDescription:
      "Perfekcionismus tě brzdí a pořád začínáš znovu? Zjisti, proč vzniká a jak přepnout z „všechno nebo nic“ na konzistenci přes dostatečně dobré kroky bez tlaku.",
    seoKeywords: [
      "perfekcionismus jak se ho zbavit",
      "perfekcionismus",
      "jak se zbavit perfekcionismu",
      "všechno nebo nic",
      "jak být konzistentní",
      "jak vydržet u návyků",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Perfekcionismus se často tváří jako dobrá vlastnost." },
      { type: "paragraph", text: "Jako něco, co tě tlačí k výsledkům. Jako „vysoký standard“. Jako to, že ti záleží na kvalitě." },
      { type: "paragraph", text: "Jenže v reálném životě zaneprázdněné ženy se perfekcionismus často chová úplně jinak. Ne jako motor. Spíš jako brzda." },
      {
        type: "paragraph",
        text: "Protože když máš pocit, že to musí být dokonalé, stane se jedna z těchto věcí: Buď do toho jdeš naplno a rychle se přepálíš, nebo to odložíš, protože „teď na to nemám ideální podmínky“.",
      },
      { type: "paragraph", text: "A pak se divíš, že nejsi konzistentní. Ne proto, že bys neměla disciplínu, ale protože jedeš v režimu „všechno nebo nic“." },
      {
        type: "paragraph",
        text: "Tenhle článek ti ukáže, jak se z toho dostat. Ne tím, že se budeš nutit, ale tím, že si nastavíš nový způsob uvažování, který ti dovolí držet rytmus i v obyčejném týdnu.",
      },
      { type: "heading", text: "Jak poznáš perfekcionismus v praxi" },
      { type: "paragraph", text: "Perfekcionismus není jen „chci, aby to bylo hezké“." },
      {
        type: "paragraph",
        text: "Perfekcionismus je často: „Když to nemám na 100 %, radši to neudělám.“ „Když už jsem jednou vynechala, všechno je pryč.“ „Když nejím perfektně, nemá cenu se snažit.“ „Když necvičím pořádně, tak to nepočítám.“",
      },
      { type: "paragraph", text: "A výsledek je pořád stejný: nula. Neustálé restartování. Neustálý pocit, že selháváš." },
      { type: "heading", text: "Proč perfekcionismus vzniká (a proč to není tvoje chyba)" },
      { type: "paragraph", text: "Perfekcionismus často není rozmar. Je to strategie." },
      { type: "paragraph", text: "Strategie, jak se vyhnout kritice. Jak se vyhnout selhání. Jak mít pocit kontroly." },
      {
        type: "paragraph",
        text: "Jenže problém je, že tahle strategie má vedlejší efekt: bere ti odvahu dělat věci „nedokonale“. A bez toho se konzistence nedá postavit.",
      },
      { type: "paragraph", text: "Jinými slovy: Perfekcionismus tě chrání před pocitem selhání, ale zároveň ti bere šanci uspět dlouhodobě." },
      { type: "heading", text: "Největší past: perfekcionismus se tváří jako disciplína" },
      { type: "paragraph", text: "Tohle je klíčové pochopit." },
      { type: "paragraph", text: "Perfekcionismus není disciplína. Perfekcionismus je tlak." },
      {
        type: "paragraph",
        text: "Disciplína vypadá tak, že uděláš něco i v obyčejném dni. Perfekcionismus vypadá tak, že potřebuješ ideální den, ideální náladu a ideální podmínky.",
      },
      { type: "paragraph", text: "A protože ideální den není často, skončíš v tom, že se ti to rozpadá." },
      { type: "heading", text: "„Dostatečně dobře“ je jediná cesta ke konzistenci" },
      { type: "paragraph", text: "Pokud chceš být konzistentní, musíš začít měřit úspěch jinak." },
      { type: "paragraph", text: "Ne podle toho, jak dokonalé to bylo. Ale podle toho, jestli jsi se objevila." },
      { type: "paragraph", text: "Protože největší rozdíl nedělají občasné perfektní týdny. Největší rozdíl dělají obyčejné týdny, kdy uděláš něco malého a jedeš dál." },
      { type: "paragraph", text: "To je reálná změna." },
      { type: "heading", text: "Jak se zbavit režimu „všechno nebo nic“: 3 jednoduché posuny v hlavě" },
      { type: "heading", text: "1) Změň pravidlo úspěchu" },
      { type: "paragraph", text: "Místo „musí to být perfektní“ si nastav „musí to být opakovatelné“. Když je to opakovatelné, je to dobré. I kdyby to bylo malé." },
      { type: "heading", text: "2) Nauč se „návrat bez trestu“" },
      { type: "paragraph", text: "Perfekcionismus často vytvoří spirálu: jedno vynechání → výčitka → trest → odpor → výpadek." },
      { type: "paragraph", text: "Návrat bez trestu znamená: udělám další malý krok a jedu dál. Bez kompenzování. Bez dramat. Tohle je pro konzistenci zásadní." },
      { type: "heading", text: "3) Udělej z „nejmenší verze“ standard pro horší dny" },
      { type: "paragraph", text: "Perfekcionismus tě nutí buď jet naplno, nebo vůbec." },
      { type: "paragraph", text: "Proto potřebuješ mít malou verzi, která se počítá. Ne jako náhradu. Jako plán pro dny, kdy je toho moc." },
      { type: "paragraph", text: "A když ji uděláš, tak to není „málo“. Je to přesně to, co drží dlouhodobost." },
      { type: "heading", text: "Praktický test: Je to perfekcionismus, nebo zdravý standard?" },
      { type: "paragraph", text: "Zeptej se sama sebe: Když to dnes udělám jen v malé verzi, cítím úlevu, nebo vinu?" },
      { type: "paragraph", text: "Když cítíš vinu, často to není zdravý standard. Je to tlak. Zdravý standard tě podporuje. Tlak tě ničí." },
      { type: "heading", text: "Jak to použít hned v běžném týdnu" },
      { type: "paragraph", text: "Nečekej, až bude ideální den. Udělej z toho hru na konzistenci." },
      { type: "paragraph", text: "V týdnu, kdy je toho hodně, si dej cíl „udržet rytmus“. Ne „jet naplno“." },
      { type: "paragraph", text: "A až přijde den, kdy to nejde, udělej malou verzi a jdi dál." },
      { type: "paragraph", text: "Tohle je přesně to, co z tebe udělá člověka, který „to drží“. Ne člověka, který pořád začíná." },
    ],
    closingSections: {
      smallStep: [
        "Vyber si jednu oblast, kde jedeš „všechno nebo nic“. Pohyb, jídlo, práce, cokoliv. A dnes si dovol udělat jen „dostatečně dobře“. Bez pocitu, že to musí být perfektní.",
      ],
      reflection: ["Kde ti perfekcionismus bere nejvíc energie?", "Co by se změnilo, kdybys místo dokonalosti začala sbírat malé, opakovatelné kroky?"],
      eveningTask: [
        "Napiš si jednu větu, kterou si zítra připomeneš: „Můj cíl není dokonalost. Můj cíl je opakovatelnost.“",
        "A pod to si napiš, jak vypadá tvoje „dostatečně dobrá“ verze pro horší den. Konkrétně.",
      ],
      finalQuote: "Perfekcionismus ti slibuje kontrolu. Konzistence ti dá výsledky.",
    },
  },
  {
    slug: "jak-prestat-odkladat-sebe",
    title: "Jak přestat odkládat sebe: jednoduchý systém „10 minut pro mě“ každý den",
    excerpt: "Nečekej na volno, které nepřijde. Tenhle mini systém ti vrátí prostor pro sebe i v dnech, kdy máš pocit, že jedeš nonstop.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-06-30",
    readingTime: 4,
    seoTitle: "Jak přestat odkládat sebe: 10 minut pro mě každý den (bez výčitek)",
    seoDescription:
      "Odkládáš sebe na potom a jsi pořád vyčerpaná? Zkus jednoduchý systém „10 minut pro mě“, který vrátí péči o sebe do života i v běžném, hektickém dni.",
    seoKeywords: [
      "jak přestat odkládat sebe",
      "jak si udělat čas na sebe",
      "jak myslet na sebe bez výčitek",
      "péče o sebe",
      "10 minut pro sebe",
      "jak se přestat obětovat",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "quote", text: "„Až dodělám tohle, tak si konečně odpočinu.“ „Až bude klid, začnu se o sebe starat.“ „Až budou děti větší…“" },
      { type: "paragraph", text: "Jenže pak přijde další den. A další. A další. A ty pořád funguješ, zařizuješ, držíš to… a sama sebe dáváš až na konec." },
      {
        type: "paragraph",
        text: "Ne proto, že by ti na sobě nezáleželo. Ale protože máš pocit, že všechno ostatní je důležitější. A protože „čas pro sebe“ zní jako luxus, který si v běžném dni nemůžeš dovolit.",
      },
      {
        type: "paragraph",
        text: "Tenhle článek ti ukáže, jak to otočit bez dramat. Ne tím, že si do života přidáš další povinnost. Ale tím, že si do něj vrátíš jednoduchý, malý systém. Deset minut denně, které ti neudělají větší to-do list, ale větší kapacitu.",
      },
      { type: "heading", text: "Proč pořád odkládáš sebe (a proč to dává smysl)" },
      { type: "paragraph", text: "Odkládání sebe často není lenost. Je to strategie přežití." },
      { type: "paragraph", text: "Když máš plnou hlavu a hodně povinností, mozek automaticky jede to, co je urgentní. A péče o sebe většinou urgentní není. Je „důležitá“, ale nehoří." },
      { type: "paragraph", text: "A tak ji odkládáš. A čím víc ji odkládáš, tím víc se vyčerpáš. A čím víc se vyčerpáš, tím míň máš kapacitu začít. Je to kruh." },
      { type: "paragraph", text: "A přesně proto nebude fungovat rada typu „prostě si udělej čas“. Potřebuješ systém, který nepůjde proti realitě." },
      { type: "heading", text: "Co když ti řeknu, že nepotřebuješ hodinu. Potřebuješ deset minut" },
      { type: "paragraph", text: "Ten největší problém s péčí o sebe je, že ji máš v hlavě jako velký projekt." },
      { type: "paragraph", text: "Cvičení. Vaření. Hygge večer. Meditace. Wellness. Všechno je to hezké. Ale když máš náročný den, je to první věc, která padne." },
      { type: "paragraph", text: "Proto funguje „10 minut pro mě“. Protože: je to krátké, dá se to udělat i v běžném dni a hlavně se to dá opakovat." },
      { type: "paragraph", text: "A co je opakovatelné, to mění život." },
      { type: "heading", text: "Systém „10 minut pro mě“ stojí na třech pravidlech" },
      { type: "heading", text: "1) Jeden pevný moment v dni" },
      { type: "paragraph", text: "Ne „až bude čas“. To nebude. Musí to být navázané na něco, co už děláš." },
      { type: "paragraph", text: "Nejčastěji to funguje: ráno po hygieně, během dne po obědě, nebo večer po večeři." },
      { type: "paragraph", text: "Vyber si jen jeden moment. Aby to nebylo složité." },
      { type: "heading", text: "2) Jedna věc, ne deset" },
      { type: "paragraph", text: "Ne „dneska všechno“. Jen jedna věc, která ti udělá dobře." },
      { type: "paragraph", text: "Deset minut není čas na revoluci. Je to čas na návrat k sobě." },
      { type: "heading", text: "3) Bez vyjednávání" },
      { type: "paragraph", text: "Tady je kouzlo systému. Neřešíš, jestli se ti chce. Neřešíš, jestli je to dokonalé. Prostě to uděláš. Deset minut. Hotovo." },
      { type: "heading", text: "Co dělat během těch 10 minut, aby to mělo reálný efekt" },
      { type: "paragraph", text: "Nechci ti sem dát seznam 50 tipů. Nechci, aby sis z toho udělala další plán, který nikdy neuděláš." },
      { type: "paragraph", text: "Chci ti dát jednoduchou strukturu, která funguje pro většinu lidí:" },
      { type: "paragraph", text: "Během těch 10 minut si vyber jednu z těchto tří věcí: něco pro tělo, něco pro hlavu, nebo něco pro klid." },
      {
        type: "paragraph",
        text: "Pro tělo to může být jakýkoliv jemný pohyb, který tě vrátí do těla. Pro hlavu to může být krátký zápis nebo vyčištění myšlenek. Pro klid to může být minuta ticha, dech, nebo jen být chvíli bez podnětů.",
      },
      { type: "paragraph", text: "Nejde o to, co přesně. Jde o to, že to uděláš." },
      { type: "heading", text: "Nejčastější překážka: pocit viny" },
      { type: "quote", text: "„Měla bych radši uklidit.“ „Měla bych radši dodělat práci.“ „Měla bych být s dětmi.“" },
      { type: "paragraph", text: "Tohle je největší brzda. Ne čas. Vina." },
      {
        type: "paragraph",
        text: "A tady pomáhá jedno přerámování: Těch 10 minut není sobeckost. Je to údržba. Je to způsob, jak být míň vyčerpaná. A když jsi míň vyčerpaná, jsi lepší máma, partnerka, člověk.",
      },
      { type: "paragraph", text: "Není to o tom, že si bereš pro sebe luxus. Je to o tom, že si bereš minimum, které potřebuješ, aby ses neztratila." },
      { type: "heading", text: "Když nestíháš, deset minut je přesně to, co má smysl" },
      { type: "paragraph", text: "Je to paradox, ale čím víc nestíháš, tím víc potřebuješ malý reset. Ne hodinu volna. Malý reset." },
      { type: "paragraph", text: "Protože když jedeš na autopilota celý den, tělo i hlava se postupně odpojí. A pak se divíš, že večer nemáš náladu, energii ani chuť na nic." },
      { type: "paragraph", text: "Deset minut ti dá pocit, že nejseš jen „výkon“. Že jsi pořád ty." },
      { type: "heading", text: "Jak z toho udělat zvyk, který vydrží" },
      { type: "paragraph", text: "Začni na 7 dní. Ne na celý život. Jen na týden." },
      { type: "paragraph", text: "Vezmi si do hlavy, že tvým cílem není dokonalost. Tvým cílem je udělat to sedmkrát. Klidně nudně. Klidně jednoduše." },
      { type: "paragraph", text: "A po týdnu uvidíš, že to není o čase. Je to o rozhodnutí a o systému." },
    ],
    closingSections: {
      smallStep: ["Vyber si jeden pevný moment v dni, kdy si těch 10 minut vezmeš. A napiš si jednu větu: „Dnes po ____ mám 10 minut pro sebe.“"],
      reflection: ["Kdy naposledy ses o sebe postarala tak, že ti to opravdu dobilo baterky?", "Co je u tebe největší brzda, čas, nebo pocit viny?"],
      eveningTask: [
        "Připrav si svůj „10minutový plán“ na zítřek do jedné věty: „Zítra si dám 10 minut pro sebe a udělám ____.“",
        "Jen jednu věc. A udělej to.",
      ],
      finalQuote: "Když si nevezmeš 10 minut pro sebe ty, nikdo ti je nedá.",
    },
  },
  {
    slug: "jak-zvladat-stres-a-byt-mene-unavena",
    title: "Jak zvládat stres a být méně unavená: 5 malých změn, které fungují",
    excerpt: "Krátké změny, které můžeš udělat hned během dne. Pomůžou ti stáhnout napětí, dobít energii a večer nepadat vyčerpaná.",
    categorySlug: "osobni-rozvoj",
    publishedAt: "2026-07-18",
    readingTime: 4,
    seoTitle: "Jak zvládat stres a být méně unavená: 5 malých změn",
    seoDescription:
      "Jedeš na výpary? Nauč se zvládat stres v běžném dni. 5 jednoduchých návyků pro víc energie + malý krok na dnes a mini úkol na večer.",
    seoKeywords: [
      "jak zvládat stres",
      "stres a únava",
      "jak mít víc energie",
      "jak snížit stres v běžném dni",
      "jak se rychle zklidnit během dne",
      "dechová cvičení na stres",
    ],
    recommended: false,
    ctaType: "community",
    content: [
      { type: "paragraph", text: "Dny, kdy nestíháš, střídají večery, kdy už nemáš sílu vůbec na nic. A když máš pocit, že jedeš „na výpary“, nejsi v tom sama." },
      {
        type: "paragraph",
        text: "Tenhle článek je pro tebe, pokud chceš z toho stresového kolotoče vystoupit reálně – bez drastických změn, ale tak, aby ses během dne vracela zpátky k sobě a nepadala večer na hubu.",
      },
      { type: "heading", text: "Proč stres tolik vysává energii" },
      {
        type: "paragraph",
        text: "Když jsi ve stresu, tělo jede v režimu „bojuj nebo uteč“. Mozek jede na plné obrátky, svaly jsou stažené, dech je rychlý a povrchový. A i když se navenek „nic neděje“, uvnitř jedeš na vysoký výkon.",
      },
      { type: "paragraph", text: "Dlouhodobě pak stres:" },
      { type: "list", ordered: false, items: ["narušuje spánek,", "zhoršuje soustředění,", "zvyšuje vnitřní neklid,", "a bere energii fyzicky i psychicky."] },
      { type: "paragraph", text: "Dobrá zpráva? Nemusíš kvůli změně odjet na týden do hor. Často udělají největší rozdíl malé, pravidelné kroky, které zvládneš i v běžném dni." },
      { type: "heading", text: "Jak poznáš, že jsi ve stresu i když „to zvládáš“" },
      { type: "paragraph", text: "Možná to znáš:" },
      {
        type: "list",
        ordered: false,
        items: [
          "jedeš celý den, ale večer jsi podrážděná nebo prázdná,",
          "máš pocit napětí v šíji, ramenou nebo v čelisti,",
          "zrychleně dýcháš, ani o tom nevíš,",
          "přes den moc nejíš/ nepiješ, večer tě to dožene,",
          "hlava je pořád „zapnutá“ a neumí vypnout.",
        ],
      },
      { type: "paragraph", text: "A přesně v těchhle chvílích pomáhá mít v ruce pár jednoduchých záchytných bodů." },
      { type: "heading", text: "Jak se zklidnit rychle během dne (když fakt nemáš čas)" },
      {
        type: "paragraph",
        text: "Nečekej na víkend nebo dovolenou. Stres se totiž nedá „vydržet“ a pak z něj zázračně vystoupit. Dá se spíš pravidelně snižovat v malých dávkách.",
      },
      { type: "paragraph", text: "Tady je 5 jednoduchých návyků, které fungují právě proto, že jsou malé." },
      { type: "heading", text: "5 malých změn, které snižují stres a vrací energii" },
      { type: "heading", text: "1) Zastav se na 3 vědomé nádechy" },
      { type: "paragraph", text: "Před schůzkou, otevřením e-mailu, v autě na semaforu. Zavři na pár vteřin oči a zhluboka se nadechni." },
      {
        type: "paragraph",
        text: "Zkus hlavně prodloužit výdech – právě ten pomáhá aktivovat parasympatikus (část nervového systému, která tě přirozeně zklidní).",
      },
      { type: "paragraph", text: "Cíl není meditace. Cíl je „reset“ během 10 vteřin." },
      { type: "heading", text: "2) Napij se vody – vědomě" },
      { type: "paragraph", text: "Pitný režim zní banálně. Jenže i mírná dehydratace umí zhoršit soustředění a zvýšit vnitřní napětí." },
      { type: "paragraph", text: "Zkus se párkrát denně zastavit, napít se pomalu a vnímat ten okamžik. Je to malý návrat do těla." },
      { type: "heading", text: "3) Mikropauza bez obrazovek (klidně jen 5 minut)" },
      { type: "paragraph", text: "Aspoň jednou za den odpoj oči i hlavu od telefonu a počítače. Vstaň, protáhni se, projdi se po místnosti nebo ven na vzduch." },
      { type: "paragraph", text: "Tahle pauza není „ztráta času“. Je to způsob, jak si koupit energii zpátky." },
      { type: "heading", text: "4) Vděčnost na papír (2–3 věci)" },
      { type: "paragraph", text: "Večer si napiš 2–3 věci, za které jsi ten den vděčná. Nemusí to být nic velkého: úsměv, tichý moment, dobrá káva, klidná chvilka." },
      { type: "paragraph", text: "Mozek se tím učí víc všímat toho, co funguje – a před spaním se snáz zklidní." },
      { type: "heading", text: "5) Box breathing (1 minuta, když máš hlavu plnou)" },
      { type: "paragraph", text: "Jednoduchá dechová technika, která umí rychle srovnat nervový systém. Rytmus 4–4–4–4:" },
      {
        type: "list",
        ordered: true,
        items: ["Nadechni se na 4 sekundy", "Zadrž dech na 4 sekundy", "Vydechuj 4 sekundy", "Zadrž dech na 4 sekundy", "Opakuj 3–5×"],
      },
      { type: "heading", text: "Co dělat, když tě stres vyčerpává večer nejvíc" },
      { type: "paragraph", text: "Večer často nepřichází „lenost“. Přichází účet za celý den." },
      { type: "paragraph", text: "Proto se nesnaž večer zachránit všechno. Radši si dej otázku: „Co je jedna malá věc, která mi dnes uleví aspoň o 10 %?“" },
      { type: "paragraph", text: "To je přesně ten typ kroku, který buduje dlouhodobou změnu." },
      { type: "heading", text: "Klid nemusí trvat hodinu. Někdy stačí minuta." },
      { type: "paragraph", text: "Péče o psychiku nemusí být velký projekt ani další položka na tvém to-do listu. Často stačí malý záchytný bod během dne, který ti připomene, že nejsi stroj." },
      { type: "paragraph", text: "Začni dnes. Jedním nádechem. Jedním douškem vody. Jedním momentem ticha. Tvoje tělo i hlava si to zaslouží." },
    ],
    closingSections: {
      smallStep: ["Vyber si jednu drobnou věc z článku, kterou dnes opravdu uděláš. Ne tři, ne pět. Jednu. Tím buduješ nový návyk bez tlaku a se soucitem k sobě."],
      reflection: ["Kdy naposledy jsi opravdu vědomě dýchala?", "Co by se stalo, kdybys si dnes na 5 minut dovolila jen „být“?"],
      eveningTask: ["Zkus 3 kola box-breathingu (nádech 4 – zadrž 4 – výdech 4 – zadrž 4).", "Zapiš si jednu věc, která ti dnes přinesla klid."],
      finalQuote: "Někdy největší sílu najdeš v tom, že zpomalíš. Tvůj klid není slabost. Je to tvoje superschopnost.",
    },
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
