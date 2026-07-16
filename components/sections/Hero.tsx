import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { HERO_PRIMARY_CTA, HERO_SECONDARY_CTA } from "@/lib/navigation";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-dark)]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 78% 35%, rgba(139,60,249,0.35) 0%, rgba(31,110,249,0.18) 40%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-brand-diagonal)" }}
      />

      <Container className="relative flex flex-col items-start gap-12 py-16 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:py-28">
        <div className="flex max-w-xl flex-col items-start gap-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Fit bez{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              času
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Pomáháme ženám cítit se lépe ve svém těle, i když maji plný diář.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={HERO_PRIMARY_CTA.href} variant="gradient">
              {HERO_PRIMARY_CTA.label}
            </Button>
            <Button href={HERO_SECONDARY_CTA.href} variant="outline-dark">
              {HERO_SECONDARY_CTA.label}
            </Button>
          </div>
        </div>

        <PlaceholderImage
          label="Foto: Klára a David"
          tone="muted"
          className="aspect-[4/5] w-full max-w-sm rounded-[var(--radius-card)] sm:max-w-md lg:w-[26rem]"
        />
      </Container>
    </section>
  );
}
