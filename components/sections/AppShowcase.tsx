import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { CalculatorIcon, ForkKnifeIcon, LayersIcon, RepeatIcon, TrendingUpIcon } from "../icons";
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

const MEALS = ["Snídaně", "Oběd", "Večeře"];

// Technický vizuál aplikace - skutečný screenshot v projektu není k
// dispozici (public/images/app obsahuje jen .gitkeep), proto zůstává tento
// device mockup, jen s obsahem odpovídajícím reálným datům aplikace
// (dnešní příjem, splněná energie, kalorie/bílkoviny/sacharidy/tuky,
// zapsaná jídla, tlačítko pro přidání jídla).
function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[2.75rem] border-[10px] border-[var(--color-text)] bg-white p-3 shadow-[var(--shadow-card-hover)]">
      <div className="flex flex-col gap-5 rounded-[1.9rem] bg-[var(--color-surface-muted)] p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Dnešní příjem</p>
          <div className="mt-1.5 flex items-end gap-1.5">
            <span className="text-2xl font-bold text-[var(--color-text)]">1 480</span>
            <span className="pb-0.5 text-xs text-[var(--color-text-muted)]">/ 2 100 kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Bílkoviny", value: "82 g" },
            { label: "Sacharidy", value: "140 g" },
            { label: "Tuky", value: "48 g" },
          ].map((macro) => (
            <div key={macro.label} className="flex flex-col items-center gap-0.5 rounded-xl bg-white p-2 text-center shadow-sm">
              <span className="text-sm font-bold text-[var(--color-text)]">{macro.value}</span>
              <span className="text-[10px] leading-tight text-[var(--color-text-muted)]">{macro.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-semibold text-[var(--color-text-muted)]">Dnešní jídla</span>
          {MEALS.map((meal) => (
            <div key={meal} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm">
              <PlaceholderImage
                label=""
                icon={<ForkKnifeIcon className="h-full w-full" />}
                className="h-10 w-10 shrink-0 rounded-lg"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">{meal}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="mt-1 flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold text-white"
          style={{ background: "var(--gradient-brand)" }}
        >
          + Přidat jídlo
        </button>
      </div>
    </div>
  );
}

export function AppShowcase() {
  return (
    <section id="aplikace" className="relative overflow-hidden bg-[var(--color-surface)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.06] blur-3xl" />
      <Container className="relative grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,0.8fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
        <div className="flex flex-col gap-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            Aplikace Fit bez času
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
          <Button href={EXTERNAL_LINKS.app} variant="solid-blue" withArrow={false} className="w-fit px-7 py-3.5">
            Poznat aplikaci
          </Button>
        </div>

        <PhoneMockup />

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
