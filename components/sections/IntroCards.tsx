import { Container } from "../Container";
import { FeatureCard } from "../FeatureCard";
import { ForkKnifeIcon, GiftIcon, PencilIcon, PhoneIcon } from "../icons";

const CARDS = [
  {
    icon: <ForkKnifeIcon className="h-full w-full" />,
    title: "Jídelníček",
    description: (
      <>
        Vyvážené a jednoduché jídelníčky, které šetří <strong>čas a chutnají</strong>.
      </>
    ),
    href: "#jidelnicek",
  },
  {
    icon: <PhoneIcon className="h-full w-full" />,
    title: "Aplikace",
    description: "Měj přehled o jídle, pokroku a motivaci. Vše v jedné aplikaci.",
    href: "#aplikace",
  },
  {
    icon: <GiftIcon className="h-full w-full" />,
    title: "Zdarma",
    description: (
      <>
        E-booky, tipy a návody zdarma <strong>pro tvůj zdravější</strong> každodenní život.
      </>
    ),
    href: "#zdarma",
  },
  {
    icon: <PencilIcon className="h-full w-full" />,
    title: "Blog",
    description: (
      <>
        Praktické články, recepty a inspirace <strong>pro reálný život</strong>.
      </>
    ),
    href: "#blog",
  },
];

export function IntroCards() {
  return (
    <section className="relative flow-root bg-[var(--color-surface-muted)] pb-[var(--space-section)]">
      <Container className="-mt-28 sm:-mt-24 lg:-mt-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
        </div>
      </Container>
    </section>
  );
}
