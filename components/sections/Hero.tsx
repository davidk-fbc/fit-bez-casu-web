import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "../Button";
import { Container } from "../Container";
import { ForkKnifeIcon, RunningIcon, UsersIcon } from "../icons";
import { EXTERNAL_LINKS } from "@/lib/links";
import { COMMUNITY_URL } from "@/lib/navigation";

type HeroPoint = {
  icon: ReactNode;
  label: string;
};

const HERO_POINTS: HeroPoint[] = [
  { icon: <ForkKnifeIcon className="h-full w-full" />, label: "Jídlo" },
  { icon: <RunningIcon className="h-full w-full" />, label: "Krátká cvičení" },
  { icon: <UsersIcon className="h-full w-full" />, label: "Komunita" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-dark)]">
      {/* base ambient wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 82% 25%, rgba(155,80,255,0.7) 0%, rgba(31,110,249,0.4) 40%, transparent 75%)",
        }}
      />
      {/* nebula swirl */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "conic-gradient(from 200deg at 78% 35%, rgba(139,60,249,0.5), rgba(31,110,249,0.35), transparent 45%, transparent 65%, rgba(139,60,249,0.4))",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-90"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(155,80,255,0.35) 52%, rgba(31,110,249,0.28) 62%, transparent 78%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-32 h-[34rem] w-[34rem] rounded-full opacity-70 blur-3xl"
        style={{ background: "var(--gradient-brand-diagonal)" }}
      />
      <div className="pointer-events-none absolute -top-32 right-1/4 h-80 w-80 rounded-full bg-[var(--color-accent-blue)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute left-[-6rem] top-1/3 h-64 w-64 rounded-full bg-[var(--color-accent-purple)] opacity-20 blur-3xl" />

      <div className="stars-layer" />
      <div className="noise-layer" />

      <Container className="relative flex flex-col items-start gap-10 py-20 sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-28">
        <div className="flex max-w-2xl flex-col items-start gap-7 lg:pt-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple-soft)]">
            <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
            Fit bez času
          </span>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl [text-shadow:0_0_60px_rgba(139,60,249,0.45)]">
            Pomáháme ženám, které mají málo času, zhubnout a cítit se lépe bez diet, výčitek a začínání pořád od
            nuly.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-xl">
            Získáš jasný systém pro jídlo, krátká cvičení a podporu komunity, která ti pomůže vydržet i v běžném
            životě plném práce, rodiny a povinností.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              href={COMMUNITY_URL}
              variant="gradient"
              className="px-8 py-4 text-base shadow-[0_20px_50px_-12px_rgba(139,60,249,0.8)] transition hover:scale-[1.03] hover:shadow-[0_25px_60px_-10px_rgba(139,60,249,0.9)]"
            >
              Přidat se ke komunitě
            </Button>
            <Button
              href={EXTERNAL_LINKS.mealPlan}
              variant="outline-dark"
              className="border-white/25 bg-white/[0.04] px-8 py-4 text-base backdrop-blur-sm transition hover:scale-[1.03] hover:bg-white/10"
            >
              Mrknout na jídelníček
            </Button>
          </div>

          <ul className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
            {HERO_POINTS.map((point) => (
              <li key={point.label} className="flex items-center gap-2.5 text-sm text-[var(--color-text-on-dark-muted)]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85">
                  <span className="h-4 w-4">{point.icon}</span>
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-[21rem] lg:mx-0 lg:w-[25rem] xl:w-[28rem]">
          {/* neon ring glow behind Klára and David */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              boxShadow:
                "inset 0 0 0 2px rgba(155,110,255,0.55), 0 0 90px 12px rgba(139,60,249,0.35), 0 0 160px 45px rgba(31,110,249,0.28)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 scale-90 rounded-full opacity-80 blur-3xl"
            style={{ background: "var(--gradient-brand-diagonal)" }}
          />
          <Image
            src="/images/homepage/hero-klara-david.png"
            alt="Klára a David, zakladatelé Fit bez času"
            width={1844}
            height={3558}
            priority
            sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 25rem, (min-width: 640px) 21rem, 18rem"
            className="relative h-auto w-full drop-shadow-[0_35px_60px_rgba(0,0,0,0.5)]"
          />
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm sm:-right-8 sm:-top-8 sm:h-20 sm:w-20" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 h-10 w-10 rounded-2xl opacity-90 blur-[1px]" style={{ background: "var(--gradient-brand)" }} />
        </div>
      </Container>
    </section>
  );
}
