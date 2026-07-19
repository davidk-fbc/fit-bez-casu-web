import { Container } from "./Container";
import { MailIcon } from "./icons";

// Vizuálně hotový blok pro budoucí napojení e-mailového sběru (Brevo /
// MailerLite). V této fázi záměrně bez formuláře, inputu nebo tlačítka —
// jen textová/vizuální příprava. Navržen jako sdílená komponenta, aby šel
// později použít i na homepage nebo v detailu článku.
export function EmailSignupPlaceholder() {
  return (
    <Container>
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface)] px-8 py-12 shadow-[var(--shadow-card)] sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[var(--color-accent-purple)] opacity-[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-[var(--color-accent-blue)] opacity-[0.06] blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: "var(--gradient-brand-diagonal)" }}
          >
            <MailIcon className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
            Zdarma do e-mailu
          </span>
          <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-[var(--color-text)] sm:text-3xl">
            Praktické tipy rovnou do e-mailu
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
            Připravujeme jednoduchý dárek zdarma a pravidelné tipy k jídlu, pohybu a zdravějším návykům.
          </p>
        </div>
      </div>
    </Container>
  );
}
