import type { ReactNode } from "react";
import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ChatBubblesIcon, ForkKnifeIcon, PhoneIcon, TrophyIcon } from "../icons";
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
            title="Vyber si cestu, která ti dává největší smysl"
            description="Každá začíná jinde: u jídelníčku, u přehledu o vlastním dni, u prvního malého kroku nebo u někoho, kdo se na to podívá s tebou. Nemusíš změnit všechno najednou."
          />
          {/* Four situations, not seven products. Somebody landing here is
              asking "co potřebuji právě já", so each card is named after her
              situation and the product sits inside it. Komunita is
              deliberately absent - it already has CommunityCta at the foot of
              the page, and a second entry here would only split the same
              click between two places. */}
          <div className="grid gap-6 sm:grid-cols-2">
            <PathCard
              number="01"
              icon={<ForkKnifeIcon className="h-full w-full" />}
              title="Chci vědět, co jíst"
              description="Jídelníček na míru, konkrétní porce a recepty. Budeš vědět, co si dát, i ve dnech, kdy na vymýšlení není čas."
              ctaLabel="Chci jídelníček"
              ctaHref={EXTERNAL_LINKS.mealPlan}
              gradient="linear-gradient(135deg, #8b3cf9, #4c1d95)"
              glowPosition="-right-16 -top-16"
            />
            <PathCard
              number="02"
              icon={<PhoneIcon className="h-full w-full" />}
              title="Chci mít jídlo pod kontrolou"
              description="Aplikace Fit Talíř, ve které si zapíšeš jídlo a hned vidíš, jak si vedeš. Ve vyšší variantě Fit Talíř Plus k tomu máš i hotový jídelníček a porce."
              ctaLabel="Vyzkoušet 5 dní zdarma"
              ctaHref={EXTERNAL_LINKS.app}
              gradient="linear-gradient(135deg, #1f6ef9, #4c1d95)"
              glowPosition="-right-10 top-0"
            />
            <PathCard
              number="03"
              icon={<TrophyIcon className="h-full w-full" />}
              title="Chci začít jednoduchým krokem"
              description="21 dní krátkých cvičení a podpory za 297 Kč. Součástí je i 30 dní Fit Talíře, ať si rovnou vyzkoušíš, jak ti sedí."
              ctaLabel="Chci 21denní výzvu"
              ctaHref={EXTERNAL_LINKS.challenge}
              gradient="linear-gradient(135deg, #f0812f, #9a3412)"
              glowPosition="-right-14 -top-10"
            />
            <PathCard
              number="04"
              icon={<ChatBubblesIcon className="h-full w-full" />}
              title="Chci osobní pomoc"
              description="Když chceš, aby se na tvoji situaci někdo podíval osobně nebo tě provázel delší dobu, vybereš si mezi jednorázovým rozborem a průběžnou podporou."
              ctaLabel="Vybrat si podporu"
              ctaHref="/nabidka-podpory"
              gradient="linear-gradient(135deg, #0d9488, #134e4a)"
              glowPosition="-right-12 -top-12"
            />
          </div>
      </Container>
    </section>
  );
}
