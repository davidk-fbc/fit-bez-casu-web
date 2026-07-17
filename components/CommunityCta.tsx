import { Button } from "./Button";
import { Container } from "./Container";
import { UsersIcon } from "./icons";
import { COMMUNITY_URL } from "@/lib/navigation";

export function CommunityCta() {
  return (
    <Container>
      <div
        className="relative overflow-hidden rounded-[2rem] px-8 py-12 sm:px-12 sm:py-14"
        style={{ background: "radial-gradient(120% 160% at 100% 0%, #34179a 0%, #150746 55%, #0a0322 100%)" }}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full bg-[var(--color-accent-purple)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-[var(--color-accent-blue)] opacity-20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-dark)]">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Přidej se ke komunitě fit žen
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-base">
                Získej podporu, motivaci, tipy a přístup k exkluzivnímu obsahu. Společně to zvládneme.
              </p>
            </div>
          </div>
          <Button href={COMMUNITY_URL} variant="gradient" className="shrink-0 px-7 py-3.5">
            Vstoupit do komunity
          </Button>
        </div>
      </div>
    </Container>
  );
}
