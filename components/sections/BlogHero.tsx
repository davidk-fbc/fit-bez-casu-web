import { Container } from "../Container";
import { DarkSectionGlow } from "../DarkSectionGlow";
import { ForkKnifeIcon, HeartPulseIcon, SparkIcon } from "../icons";

const STACK_CARDS = [
  { icon: <ForkKnifeIcon className="h-full w-full" />, rotate: "-rotate-6", offset: "translate-y-4" },
  { icon: <HeartPulseIcon className="h-full w-full" />, rotate: "rotate-2", offset: "-translate-y-2" },
  { icon: <SparkIcon className="h-full w-full" />, rotate: "rotate-8", offset: "translate-y-8" },
];

export function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-dark)]">
      <DarkSectionGlow />

      <Container className="relative flex flex-col items-center gap-12 py-20 text-center sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-28 lg:text-left">
        <div className="flex max-w-xl flex-col items-center gap-6 lg:items-start">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            Blog Fit bez času
          </span>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Praktické tipy, které využiješ i v běžném dni
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Články o jídle, pohybu, motivaci a zdravějších návycích bez extrémů a zbytečné složitosti.
          </p>
        </div>

        {/* Abstraktní vrstvení článkových karet — dekorativní, žádná fotografie */}
        <div aria-hidden="true" className="relative hidden h-64 w-72 shrink-0 sm:block">
          {STACK_CARDS.map((card, index) => (
            <div
              key={index}
              className={`absolute inset-x-4 top-1/2 h-40 -translate-y-1/2 rounded-[var(--radius-card)] border border-white/15 bg-white/[0.06] shadow-[var(--shadow-card)] backdrop-blur-sm ${card.rotate} ${card.offset}`}
              style={{ zIndex: index }}
            >
              <div className="flex h-full flex-col gap-3 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full text-white/80" style={{ background: "var(--gradient-brand-diagonal)" }}>
                  <div className="h-4 w-4">{card.icon}</div>
                </div>
                <div className="h-2 w-4/5 rounded-full bg-white/20" />
                <div className="h-2 w-3/5 rounded-full bg-white/15" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
