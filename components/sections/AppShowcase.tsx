import Image from "next/image";
import { Button } from "../Button";
import { Container } from "../Container";
import { CalculatorIcon, LayersIcon, RepeatIcon, TrendingUpIcon } from "../icons";
import { EXTERNAL_LINKS } from "@/lib/links";

// Popis skutečných 5 hlavních funkcí aplikace - žádná motivace/připomínky/
// obecná podpora, jen to, co aplikace opravdu dělá.
const APP_FUNCTIONS = [
  {
    title: "Kalkulačka doporučeného příjmu",
    description: "Zjistíš, kolik energie a makroživin odpovídá tvému cíli a běžnému režimu.",
  },
  {
    title: "Jednoduché zapisování jídel",
    description: "Zapíšeš si snídani, oběd, večeři i svačiny a hned vidíš, jak si během dne vedeš.",
  },
  {
    title: "Přehled energie a makroživin",
    description: "Na jednom místě vidíš kalorie, bílkoviny, sacharidy a tuky, které už máš splněné.",
  },
  {
    title: "Recepty a inspirace",
    description: "Vybereš si z receptů a jednoduše je přidáš do svého denního příjmu.",
  },
  {
    title: "Sledování váhy a tělesných mír",
    description: "Ukládáš si své výsledky a vidíš, jak se postupně posouváš.",
  },
];

// 4 výhody - stejná struktura jako dřív, jen obsahově vázané na skutečné
// funkce aplikace (kalkulačka, denní přehled, šablony/kopírování, váha+míry).
const BENEFITS = [
  {
    icon: <CalculatorIcon className="h-full w-full" />,
    title: "Víš, kolik máš jíst",
    description: "Kalkulačka ti podle tvého cíle a aktivity doporučí vhodný denní příjem.",
  },
  {
    icon: <LayersIcon className="h-full w-full" />,
    title: "Vidíš celý svůj den",
    description: "Po každém zapsaném jídle hned zjistíš, kolik ti ještě zbývá do denního cíle.",
  },
  {
    icon: <RepeatIcon className="h-full w-full" />,
    title: "Nemusíš zapisovat vše znovu",
    description: "Oblíbená jídla, šablony dnů a kopírování ti ušetří čas u jídel, která se opakují.",
  },
  {
    icon: <TrendingUpIcon className="h-full w-full" />,
    title: "Sleduješ svůj posun",
    description: "Měj odděleně přehled o příjmu jídla i o změnách váhy a tělesných mír.",
  },
];

export function AppShowcase() {
  return (
    <section id="aplikace" className="relative overflow-hidden bg-[var(--color-surface)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.06] blur-3xl" />
      <Container className="relative grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            Fit Talíř
          </span>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-5xl">
            Měj jasno v tom, kolik jíst a co už máš za dnešek splněno
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            Spočítej si svůj doporučený příjem, jednoduše zapisuj jídla a sleduj, kolik energie a makroživin ti
            během dne ještě zbývá. Bez počítání v hlavě, poznámek a složitých tabulek.
          </p>
          <ul className="flex flex-col gap-4">
            {APP_FUNCTIONS.map((item) => (
              <li key={item.title} className="text-sm text-[var(--color-text)] sm:text-base">
                <p className="font-semibold">{item.title}</p>
                <p className="text-[var(--color-text-muted)]">{item.description}</p>
              </li>
            ))}
          </ul>
          {/* Where the higher tier belongs: one sentence, in the column
              that already explains the app, after a reader knows what it
              does and before the CTA she acts on. Not a second product
              block and not a price table - it is the same app with more
              in it. */}
          <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            Tohle všechno máš v základním Fit Talíři. Pokud k tomu chceš i hotový jídelníček na celý týden a porce
            podle svého příjmu, je tu vyšší varianta{" "}
            <strong className="font-semibold text-[var(--color-text)]">Fit Talíř Plus</strong>.
          </p>
          <Button href={EXTERNAL_LINKS.app} variant="solid-blue" withArrow={false} className="w-fit px-7 py-3.5">
            Poznat Fit Talíř
          </Button>
        </div>

        {/* Skutečný screenshot kalkulačky nahradil dřívější ručně kreslený
            device mockup, který tu stál jen proto, že v public/images/app
            žádný screenshot nebyl. Obrázek si nese vlastní rámečky telefonů,
            takže kolem něj nesmí přijít další rámeček. Zůstává v prostředním
            sloupci se stejným mx-auto/max-w-[320px] jako mockup, aby se
            proporce sekce nezměnily; object-contain, protože se z něj nesmí
            nic oříznout. */}
        <Image
          src="/images/app/fit-talir-kalkulacka.webp"
          alt="Kalkulačka Fit Talíř na třech telefonech: zadané údaje, výsledky s bazálním metabolismem a BMI, a doporučený denní příjem s bílkovinami"
          width={941}
          height={1672}
          sizes="320px"
          className="mx-auto h-auto w-full max-w-[320px] object-contain"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-4">
              <div className="h-7 w-7 shrink-0 text-[var(--color-accent-purple)]">{benefit.icon}</div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-[var(--color-text)]">{benefit.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
