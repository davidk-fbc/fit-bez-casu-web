import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { CheckIcon, ForkKnifeIcon, HeartPulseIcon, LayersIcon, SparkIcon, TrophyIcon } from "../icons";

const CHECKLIST = [
  "Zapisování jídel a pitného režimu",
  "Přehled energie a makroživin",
  "Sledování statistik příjmu",
  "Recepty",
  "Sledování měr",
];

const FEATURES = [
  {
    icon: <LayersIcon className="h-full w-full" />,
    title: "Přehledně a jednoduše",
    description: "Vše máš po ruce – přehledy, cíle i denní doporučení.",
  },
  {
    icon: <SparkIcon className="h-full w-full" />,
    title: "Motivace každý den",
    description: "Připomínky a podpora, která tě posouvá dál.",
  },
  {
    icon: <TrophyIcon className="h-full w-full" />,
    title: "Reálné výsledky",
    description: "Sleduj pokroky, měř se a oslavuj každý malý krok.",
  },
  {
    icon: <HeartPulseIcon className="h-full w-full" />,
    title: "Pro tvůj real life",
    description: "Žádné extrémy. Jen systém, který funguje v reálném životě.",
  },
];

const MEALS = ["Snídaně", "Oběd", "Večeře"];

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[2.75rem] border-[10px] border-[var(--color-text)] bg-white p-3 shadow-[var(--shadow-card-hover)]">
      <div className="flex flex-col gap-5 rounded-[1.9rem] bg-[var(--color-surface-muted)] p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--color-accent-blue)] text-sm font-bold text-[var(--color-text)]">
            1 556
          </div>
          <div className="flex gap-2">
            {["B", "S", "T"].map((letter) => (
              <span
                key={letter}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-accent-purple-soft)] text-xs font-semibold text-[var(--color-text-muted)]"
              >
                {letter}
              </span>
            ))}
          </div>
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
            Aplikace
          </span>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-[var(--color-text)] sm:text-5xl">
            Vše, co potřebuješ, máš v jedné aplikaci
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            Jednoduché sledování, které ti dává smysl. Měj přehled, zůstaň motivovaná a posouvej se. Dostupné přímo v prohlížeči.
          </p>
          <ul className="flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--color-text)] sm:text-base">
                <CheckIcon className="h-5 w-5 shrink-0 text-[var(--color-accent-blue)]" />
                {item}
              </li>
            ))}
          </ul>
          <Button href="#aplikace" variant="solid-blue" withArrow={false} className="w-fit px-7 py-3.5">
            Poznat aplikaci
          </Button>
        </div>

        <PhoneMockup />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="h-7 w-7 shrink-0 text-[var(--color-accent-purple)]">{feature.icon}</div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-[var(--color-text)]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
