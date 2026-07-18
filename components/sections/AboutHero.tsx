import { Container } from "../Container";
import { DarkSectionGlow } from "../DarkSectionGlow";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-dark)]">
      <DarkSectionGlow />

      <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-24 lg:py-28">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
          <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
          O nás
        </span>
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Fit bez času
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
          Komunita pro lidi, kteří se chtějí hýbat, zlepšit svůj život a ocení jednoduchý pohyb, který se dá zvládnout i v náročném dni.
        </p>
      </Container>
    </section>
  );
}
