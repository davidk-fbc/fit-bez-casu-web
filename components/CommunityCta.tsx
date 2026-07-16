import { Button } from "./Button";
import { Container } from "./Container";
import { UsersIcon } from "./icons";
import { COMMUNITY_URL } from "@/lib/navigation";

export function CommunityCta() {
  return (
    <Container>
      <div
        className="relative overflow-hidden rounded-[1.75rem] px-6 py-10 sm:px-10"
        style={{ background: "radial-gradient(120% 160% at 100% 0%, #2a1670 0%, #0e0536 55%, #0a0322 100%)" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[var(--color-accent-purple)] opacity-30 blur-3xl" />
        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-dark)]">
              <UsersIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Přidej se ke komunitě fit žen
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
                Získej podporu, motivaci, tipy a přístup k exkluzivnímu obsahu. Společně to zvládneme.
              </p>
            </div>
          </div>
          <Button href={COMMUNITY_URL} variant="gradient" className="shrink-0">
            Vstoupit do komunity
          </Button>
        </div>
      </div>
    </Container>
  );
}
