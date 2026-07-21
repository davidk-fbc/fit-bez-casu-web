import Image from "next/image";
import { ArrowRightIcon } from "../icons";
import { Container } from "../Container";

// Číselné body o zkušenostech Kláry a Davida - čísla musí zůstat vizuálně
// dominantní (viz JSX níže), text pod nimi jen upřesňuje, čeho se číslo týká.
const STATS = [
  {
    value: "10+",
    title: "certifikací a odborných kurzů",
    description: "z oblasti výživy, pohybu a psychologie",
  },
  {
    value: "1000+",
    title: "hodin studia a dalšího vzdělávání",
    description: "v oblasti výživy, cvičení, těla a návyků",
  },
  {
    value: "1000+",
    title: "hodin zkušeností z praxe",
    description: "s pohybem, stravou a budováním návyků v reálném životě",
  },
];

export function AboutUs() {
  return (
    <section id="o-nas" className="relative overflow-hidden bg-[var(--color-surface)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--color-accent-purple)] opacity-[0.06] blur-3xl" />
      <Container className="relative flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left lg:max-w-lg lg:shrink-0">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full shadow-[var(--shadow-card)] sm:h-48 sm:w-48">
            <Image
              src="/images/about/klara-david.png"
              alt="Klára a David, zakladatelé Fit bez času"
              fill
              sizes="(min-width: 640px) 12rem, 10rem"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
              <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
              O nás
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl">
              Jsme Klára a David
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-[var(--color-text-muted)]">
              Pomáháme ženám, které mají málo času, nastavit jídlo, pohyb a každodenní návyky tak, aby fungovaly i
              vedle práce, rodiny a běžných povinností.
            </p>
            <p className="max-w-lg text-base leading-relaxed text-[var(--color-text-muted)]">
              Chceme ti ukázat jednoduchý a udržitelný systém, který zvládneš používat i v reálném životě.
            </p>
            <a
              href="/o-nas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
            >
              Přečíst náš příběh
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 border-t border-[var(--color-border-light)] pt-8 lg:gap-8 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
          {STATS.map((stat) => (
            <div key={stat.title} className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
              <span className="text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl">{stat.value}</span>
              <span className="text-sm font-semibold text-[var(--color-text)]">{stat.title}</span>
              <span className="text-xs leading-snug text-[var(--color-text-muted)]">{stat.description}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
