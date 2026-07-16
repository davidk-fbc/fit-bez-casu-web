import { ArrowRightIcon } from "../icons";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";

export function AboutUs() {
  return (
    <section id="o-nas" className="bg-[var(--color-surface)] py-[var(--space-section)]">
      <Container className="flex flex-col items-center gap-8 sm:flex-row sm:items-center">
        <PlaceholderImage
          label="Foto: Klára a David"
          className="h-40 w-40 shrink-0 rounded-full sm:h-48 sm:w-48"
        />
        <div className="flex flex-col items-start gap-3 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            O nás
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
            Jsme Klára a David
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-[var(--color-text-muted)]">
            Pomáháme ženám najít rovnováhu mezi zdravím, energií a každodenním životem. Věříme v jednoduchost, podporu a malé kroky, které přináší velké změny.
          </p>
          <a
            href="#o-nas"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-blue)] hover:brightness-110"
          >
            Přečíst náš příběh
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </Container>
    </section>
  );
}
