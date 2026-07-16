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
    <div className="mx-auto w-full max-w-[280px] rounded-[2.5rem] border-8 border-[var(--color-text)] bg-white p-3 shadow-[var(--shadow-card-hover)]">
      <div className="flex flex-col gap-4 rounded-[1.75rem] bg-[var(--color-surface-muted)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[var(--color-accent-blue)] text-xs font-bold text-[var(--color-text)]">
            1 556
          </div>
          <div className="flex gap-1.5">
            {["B", "S", "T"].map((letter) => (
              <span
                key={letter}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--color-accent-purple-soft)] text-[10px] font-semibold text-[var(--color-text-muted)]"
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">Dnešní jídla</span>
          {MEALS.map((meal) => (
            <div key={meal} className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm">
              <PlaceholderImage
                label=""
                icon={<ForkKnifeIcon className="h-full w-full" />}
                className="h-9 w-9 shrink-0 rounded-lg"
              />
              <span className="text-xs font-medium text-[var(--color-text)]">{meal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppShowcase() {
  return (
    <section id="aplikace" className="bg-[var(--color-surface)] py-[var(--space-section)]">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.75fr)_minmax(0,0.9fr)] lg:items-center lg:gap-8">
        <div className="flex flex-col gap-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            Aplikace
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
            Vše, co potřebuješ, máš v jedné aplikaci
          </h2>
          <p className="text-base leading-relaxed text-[var(--color-text-muted)]">
            Jednoduché sledování, které ti dává smysl. Měj přehled, zůstaň motivovaná a posouvej se. Dostupné přímo v prohlížeči.
          </p>
          <ul className="flex flex-col gap-2.5">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--color-text)]">
                <CheckIcon className="h-4 w-4 shrink-0 text-[var(--color-accent-blue)]" />
                {item}
              </li>
            ))}
          </ul>
          <Button href="#aplikace" variant="solid-blue" withArrow={false} className="w-fit">
            Poznat aplikaci
          </Button>
        </div>

        <PhoneMockup />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="h-6 w-6 shrink-0 text-[var(--color-accent-purple)]">{feature.icon}</div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
