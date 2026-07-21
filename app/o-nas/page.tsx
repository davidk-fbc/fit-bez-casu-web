import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CommunityCta } from "@/components/CommunityCta";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutStoryBlock } from "@/components/AboutStoryBlock";

export const metadata: Metadata = {
  title: "O nás | Fit bez času",
  description:
    "Poznej Kláru a Davida a zjisti, proč vzniklo Fit bez času a jak pomáhá ženám začít s jídlem a pohybem bez extrémů.",
  alternates: {
    canonical: "/o-nas",
  },
  openGraph: {
    title: "O nás | Fit bez času",
    description:
      "Poznej Kláru a Davida a zjisti, proč vzniklo Fit bez času a jak pomáhá ženám začít s jídlem a pohybem bez extrémů.",
    url: "/o-nas",
    locale: "cs_CZ",
    type: "website",
  },
};

// Reálné oblasti z původní sekce "Naše mise" (fitbezcasu.cz/o-nas) — beze změny obsahu.
const MISSION_AREAS = [
  {
    title: "Krátké a efektivní tréninky pro zaneprázdněné ženy",
    text: "Nemusíš si vyhradit hodinu času ani jet podle složitých plánů. Tréninky ve Fit bez času jsou krátké, srozumitelné a navržené tak, aby se daly zvládnout doma, kdykoliv máš chvilku čas. Zaměřujeme se na pohyb, který má smysl i v malých dávkách. I 10–15 minut může udělat rozdíl, když to děláš pravidelně.",
  },
  {
    title: "Jednoduchá strava bez drastických diet a extrémů",
    text: "Nečekají tě žádné přísné diety, vážení každého sousta ani „zakázané\" potraviny. Ukazujeme, jak jíst normálně v běžném dni, i když máš práci, rodinu a minimum času řešit složité recepty. Cílem není dokonalý jídelníček, ale takový přístup ke stravě, který se dá dlouhodobě udržet bez stresu a výčitek.",
  },
  {
    title: "Systém, který ti pomůže u cvičení vydržet",
    text: "Začít je snadné. Vydržet dlouhodobě je ta těžší část. Proto u nás nejde jen o tréninky, ale o jednoduchý systém, který ti pomůže vracet se k pohybu i ve dnech, kdy se ti nechce nebo nestíháš. Malé kroky, realistické cíle a podpora, díky které se z cvičení nestane další povinnost, ale přirozená součást dne.",
  },
  {
    title: "Podpůrná komunita žen, které to mají podobně",
    text: "Ve Fit bez času nejsi sama. Komunita spojuje ženy, které řeší stejné věci: málo času, kolísající motivaci, návraty k pohybu po pauzách. Místo srovnávání a tlaku tu najdeš podporu, pochopení a prostředí, kde je v pořádku nebýt dokonalá. Právě pocit, že v tom nejsi sama, často rozhoduje o tom, jestli u sebe dokážeš dlouhodobě zůstat.",
  },
];

const COMMUNITY_PILLARS = [
  {
    title: "Jídelníček na míru",
    text: "Získáš jídelníček sestavený podle tvého cíle, denního režimu a toho, co ti vyhovuje. Součástí jsou konkrétní porce, ukázkové recepty a jasný plán, díky kterému budeš přesně vědět, co jíst bez každodenního vymýšlení receptů.",
  },
  {
    title: "Krátká cvičení",
    text: "Získáš krátká cvičení, která zvládneš doma i v nabitém dni. Bez složitého vybavení a dlouhých tréninků, abys mohla pravidelně cvičit, zpevnit tělo a mít více energie.",
  },
  {
    title: "Podpora, když ji potřebuješ",
    text: "Na změnu nebudeš sama. Získáš pravidelnou motivaci, podporu komunity a prostor zeptat se, když si nebudeš vědět rady s jídelníčkem, cvičením nebo návratem po výpadku.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AboutHero />

        {/* Ahoj, jsme Klára a David — společný úvod, text a fotka z původní stránky */}
        <section className="bg-[var(--color-surface)] py-[var(--space-section)]">
          <Container>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl">
                Ahoj!
                <br />
                Jsme Klára a David
              </h2>
            </div>
            <AboutStoryBlock
              imageSrc="/images/about/klara-david-original.jpg"
              imageAlt="Klára a David společně na výletě"
              paragraphs={[
                "Dva sportovci, kteří vědí, že být fit a zdravý nemusí znamenat trávit dlouhé hodiny v posilovně nebo v kuchyni.",
                <>
                  Není to tak dávno, co jsme řešili to, co možná znáš i ty. Ráno vstaneš s hlavou plnou věcí, které musíš zvládnout, a když dojde na pohyb nebo „něco pro sebe&quot;, tak se to odsune na jindy. Zkoušeli jsme plány, aplikace, přesné rozpisy tréninků… znělo to hezky, ale dlouhodobě to prostě nefungovalo v nabitém dni.
                </>,
                <>
                  Fit bez času nevzniklo jako další fitness projekt. Vzniklo pro zaneprázdněné ženy, protože{" "}
                  <strong className="font-semibold text-[var(--color-text)]">
                    víme, jaké to je chtít se hýbat a cítit se líp, ale nemít na to ideální podmínky.
                  </strong>{" "}
                  Tady nejde o dokonalost, ale o to začít tam, kde jsi teď. Tak, aby se to dalo zvládnout i v náročném dni.
                </>,
              ]}
            />
          </Container>
        </section>

        {/* Klára */}
        <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
          <Container>
            <AboutStoryBlock
              title="Klára"
              imageSrc="/images/about/klara.jpg"
              imageAlt="Klára na horské vyhlídce"
              paragraphs={[
                "Je magistra fyzioterapie a sport jí teče v žilách už od dětství. Závodila ve sportovním aerobiku, prošla silovými tréninky i různými skupinovými lekcemi, a díky tomu má široký pohled na to, co všechno může pohyb být. Nejen dřina, ale i radost, uvolnění a způsob, jak se cítit líp ve vlastním těle.",
                "Díky práci fyzioterapeutky ale ví, že tělo není stroj a že univerzální návody nemusí fungovat pro každého. Že to, co je „správně\" podle tabulek, nemusí být vždy správně pro konkrétního člověka v jeho reálném životě. Ve Fit bez času proto dává důraz na pohyb, který tělu dává smysl a dá se dlouhodobě zvládat i ve dnech, kdy toho máš nad hlavu.",
              ]}
            />
          </Container>
        </section>

        {/* David */}
        <section className="bg-[var(--color-surface)] py-[var(--space-section)]">
          <Container>
            <AboutStoryBlock
              title="David"
              imageSrc="/images/about/david.jpg"
              imageAlt="David na horské vyhlídce"
              reverse
              paragraphs={[
                "Fotbalista a velký fanoušek OCR závodů i horské turistiky. Jeho srdce bije pro výzvy, dobrodružství a pobyt v přírodě, kde si nejlépe vyčistí hlavu. Nepřestává hledat nové způsoby, jak si zpestřit trénink, posílit tělo i mysl a užít si každý volný okamžik aktivně.",
                "Zároveň ale dobře ví, jak snadno se pohyb odsouvá, když je člověk unavený, má plnou hlavu práce nebo prostě nemá náladu řešit „správný\" trénink. I proto ho baví hledat cesty, jak pohyb dostat do normálního dne tak, aby z něj nebyla další povinnost, ale spíš příjemná součást dne. Taková, která ti dodá energii, místo aby tě vyčerpala.",
              ]}
            />
          </Container>
        </section>

        {/* Náš příběh */}
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f4ff_0%,#ffffff_100%)] py-[var(--space-section)]">
          <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[var(--color-accent-purple)] opacity-[0.07] blur-3xl" />
          <Container className="relative mx-auto flex max-w-3xl flex-col gap-6">
            <SectionHeading
              eyebrow="Náš příběh"
              title="Jak jsme hledali cestu, jak se hýbat i ve dnech, kdy je diář plný"
              align="center"
              className="mx-auto items-center text-center"
            />
            <div className="flex flex-col gap-5 text-left sm:text-center">
              <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Než vzniklo Fit bez času, byli jsme přesně v tom kolečku, které možná znáš i ty. Snažili jsme se cvičit pravidelně, jíst „správně&quot; a dělat věci podle plánů, které vypadaly dobře na papíře. Jenže realita byla jiná. Práce, povinnosti, únava. A pocit, že když něco vynecháš, tak už to celé nemá cenu.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Čím víc jsme na sebe tlačili, tím častěji přicházelo zklamání. Začátky v pondělí, dobrý pocit pár dní… a pak návrat do běžného dne, kde se všechno sype. Ne proto, že bychom byli líní nebo neměli vůli, ale proto, že jsme si nastavili pravidla, která se dlouhodobě nedala žít.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Zlom přišel ve chvíli, kdy jsme si přiznali, že takhle to dál nejde. Že nepotřebujeme dokonalý plán, ale cestu, která se vejde do normálního dne. Kratší tréninky. Méně extrémů. Víc naslouchání vlastnímu tělu a tomu, co je v dané chvíli reálně možné.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Fit bez času jsme založili pro zaneprázdněné ženy, které chtějí být ve formě, ale nechtějí si kvůli tomu převrátit život naruby. Pro ženy, které nemají čas řešit složité recepty nebo nekonečné tréninky, ale přesto chtějí mít pocit, že pro sebe dělají aspoň něco. Protože i malé kroky se počítají, když jsou dlouhodobě udržitelné.
              </p>
            </div>
          </Container>
        </section>

        {/* Naše mise */}
        <section className="bg-[var(--color-surface)] py-[var(--space-section)]">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Naše mise"
              title="Pomáháme zaneprázdněným ženám začít cvičit a vydržet u toho"
              description={'Fit bez času je tu pro ženy, které mají plný kalendář, plnou hlavu a často už i plnou hlavu různých „měla bych".'}
              align="center"
              className="mx-auto items-center text-center"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {MISSION_AREAS.map((area) => (
                <div
                  key={area.title}
                  className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-surface-muted)] p-7 shadow-[var(--shadow-card)]"
                >
                  <h3 className="text-lg font-bold text-[var(--color-text)]">{area.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{area.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Komunita */}
        <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Komunita"
              title="Co od nás získáš v komunitě Fit bez času"
              align="center"
              className="mx-auto items-center text-center"
            />
            <div className="grid gap-6 sm:grid-cols-3">
              {COMMUNITY_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-card)]"
                >
                  <h3 className="text-lg font-bold text-[var(--color-text)]">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{pillar.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[var(--color-surface)] pb-[var(--space-section)]">
          <CommunityCta buttonLabel="Ano, chci také vstoupit do komunity!" />
        </section>
      </main>
      <Footer />
    </>
  );
}
