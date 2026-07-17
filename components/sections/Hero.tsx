import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { HERO_PRIMARY_CTA, HERO_SECONDARY_CTA } from "@/lib/navigation";

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

      {/* bottom fade into next section for a deliberate, non-flat edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-surface-muted)]" />

      <Container className="relative flex flex-col items-start gap-10 py-20 sm:py-24 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:py-28">
        <div className="flex max-w-2xl flex-col items-start gap-7 lg:pt-6">
          <h1
            className="text-6xl font-bold leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl [text-shadow:0_0_60px_rgba(139,60,249,0.45)]"
          >
            Fit bez{" "}
            <span
              className="bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(139,60,249,0.65)]"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              času
            </span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-xl">
            Pomáháme ženám cítit se lépe ve svém těle, i když maji plný diář.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              href={HERO_PRIMARY_CTA.href}
              variant="gradient"
              className="px-8 py-4 text-base shadow-[0_20px_50px_-12px_rgba(139,60,249,0.8)] transition hover:scale-[1.03] hover:shadow-[0_25px_60px_-10px_rgba(139,60,249,0.9)]"
            >
              {HERO_PRIMARY_CTA.label}
            </Button>
            <Button
              href={HERO_SECONDARY_CTA.href}
              variant="outline-dark"
              className="border-white/25 bg-white/[0.04] px-8 py-4 text-base backdrop-blur-sm transition hover:scale-[1.03] hover:bg-white/10"
            >
              {HERO_SECONDARY_CTA.label}
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-sm sm:max-w-md lg:w-[28rem] xl:w-[30rem]">
          <div
            className="pointer-events-none absolute -inset-3 rounded-[calc(var(--radius-card)+0.75rem)] opacity-70 blur-2xl"
            style={{ background: "var(--gradient-brand-diagonal)" }}
          />
          <div className="relative rounded-[var(--radius-card)] p-[3px]" style={{ background: "var(--gradient-brand-diagonal)" }}>
            <PlaceholderImage
              label="Foto: Klára a David"
              tone="muted"
              className="aspect-[4/5] w-full rounded-[calc(var(--radius-card)-3px)] shadow-[var(--shadow-card-hover)]"
            />
          </div>
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-sm sm:-right-8 sm:-top-8 sm:h-20 sm:w-20" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 h-10 w-10 rounded-2xl opacity-90 blur-[1px]" style={{ background: "var(--gradient-brand)" }} />
        </div>
      </Container>
    </section>
  );
}
