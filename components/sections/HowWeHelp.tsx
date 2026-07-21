import type { ReactNode } from "react";
import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ForkKnifeIcon, UsersIcon } from "../icons";
import { EXTERNAL_LINKS } from "@/lib/links";

type PathCardProps = {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  gradient: string;
  glowPosition: string;
};

function PathCard({ number, icon, title, description, ctaLabel, ctaHref, gradient, glowPosition }: PathCardProps) {
  return (
    <div
      className="group relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-white/10 p-8 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 motion-safe:hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[var(--shadow-card-hover)] lg:min-h-[26rem]"
      style={{ background: gradient }}
    >
      {/* top-right glow, intensifies slightly on hover */}
      <div
        className={`pointer-events-none absolute h-64 w-64 rounded-full bg-white opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30 ${glowPosition}`}
      />
      {/* subtle inner light sweep */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_25%_0%,rgba(255,255,255,0.16),transparent_70%)]" />
      {/* large translucent decorative number */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 -top-8 select-none text-[10rem] font-black leading-none text-white/[0.12]"
      >
        {number}
      </span>

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm">
        <div className="h-5 w-5 text-white">{icon}</div>
      </div>

      <div className="relative flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="max-w-xs text-sm leading-relaxed text-white/85">{description}</p>
        <Button
          href={ctaHref}
          variant="outline-light"
          className="w-fit border-white/50 bg-white/15 text-white hover:bg-white/25"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

export function HowWeHelp() {
  return (
    <section id="jidelnicek" className="relative overflow-hidden bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[var(--color-accent-purple)] opacity-[0.07] blur-3xl" />
      <Container className="relative grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
        <SectionHeading
          eyebrow="Vyber si, s čím chceš začít"
          title="Dvě možnosti, jak začít. Jeden cíl: cítit se lépe."
          description="Ať teď nejvíc potřebuješ jasno v jídle, nebo podporu a krátká cvičení, vyber si cestu, která ti dává největší smysl. Nemusíš změnit všechno najednou."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <PathCard
            number="01"
            icon={<ForkKnifeIcon className="h-full w-full" />}
            title="Jídelníček"
            description="Získej jídelníček na míru, konkrétní porce, recepty a jasný plán, díky kterému budeš vědět, co jíst bez hladovění a každodenního vymýšlení."
            ctaLabel="Chci jídelníček na míru"
            ctaHref={EXTERNAL_LINKS.mealPlan}
            gradient="linear-gradient(135deg, #8b3cf9, #4c1d95)"
            glowPosition="-right-16 -top-16"
          />
          <PathCard
            number="02"
            icon={<UsersIcon className="h-full w-full" />}
            title="Komunita"
            description="Získej pravidelnou podporu, krátká domácí cvičení, praktické tipy k jídlu a motivaci, která ti pomůže pokračovat i ve dnech, kdy se ti nebude chtít."
            ctaLabel="Přidat se ke komunitě"
            ctaHref={EXTERNAL_LINKS.community}
            gradient="linear-gradient(135deg, #1f6ef9, #4c1d95)"
            glowPosition="-right-10 top-0"
          />
        </div>
      </Container>
    </section>
  );
}
