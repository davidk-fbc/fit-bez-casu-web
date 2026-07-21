import { Container } from "../Container";
import { FeatureCard } from "../FeatureCard";
import { ForkKnifeIcon, GiftIcon, PencilIcon, PhoneIcon } from "../icons";
import { EXTERNAL_LINKS } from "@/lib/links";

const CARDS = [
  {
    icon: <ForkKnifeIcon className="h-full w-full" />,
    title: "Jídelníček",
    description:
      "Získej jídelníček na míru, konkrétní porce a ukázkové recepty, díky kterým budeš vědět, co jíst i v běžném nabitém dni.",
    href: EXTERNAL_LINKS.mealPlan,
  },
  {
    icon: <PhoneIcon className="h-full w-full" />,
    title: "Aplikace",
    description:
      "Měj jídlo, pohyb i svůj progres na jednom místě. Jednoduše, přehledně a tak, aby ses v tom vyznala i ve dnech, kdy nestíháš.",
    href: EXTERNAL_LINKS.app,
  },
  {
    icon: <GiftIcon className="h-full w-full" />,
    title: "Zdarma",
    description:
      "Stáhni si e-booky, tipy a návody zdarma, které ti pomůžou začít lépe jíst, více se hýbat a udělat první krok.",
    // Zatím vede zpět na sekci, ve které karta samotná leží (self-reference,
    // ne skutečný obsah zdarma) - viz report. Cíl neměníme, dokud nebude
    // potvrzená skutečná cílová stránka.
    href: "#zdarma",
  },
  {
    icon: <PencilIcon className="h-full w-full" />,
    title: "Blog",
    description:
      "Najdeš tu praktické články o jídle, pohybu, motivaci a běžném životě, které využiješ i ve svém každodenním režimu.",
    href: "/blog",
  },
];

export function IntroCards() {
  return (
    <section id="zdarma" className="relative flow-root bg-[var(--color-surface-muted)] pb-[var(--space-section)]">
      <Container className="-mt-11 sm:-mt-12 lg:-mt-14 xl:-mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
