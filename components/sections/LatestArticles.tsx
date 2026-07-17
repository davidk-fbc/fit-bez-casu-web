import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { ForkKnifeIcon, HeartPulseIcon, SparkIcon } from "../icons";
import { ArticleCard } from "../ArticleCard";

const ARTICLES = [
  {
    tag: "Strava & recepty",
    title: "7 jednoduchých večeří, které zasytí a nezatíží",
    excerpt: "Rychlé, chutné a vyvážené recepty pro dny, kdy není čas a dietě do víček.",
    href: "#blog",
    imageIcon: <ForkKnifeIcon className="h-full w-full" />,
  },
  {
    tag: "Motivace & mindset",
    title: "Jak zůstat motivovaná, i když se nedaří",
    excerpt: "Praktické tipy, jak překonat horší dny a udržet se na cestě.",
    href: "#blog",
    imageIcon: <SparkIcon className="h-full w-full" />,
  },
  {
    tag: "Cvičení & pohyb",
    title: "10 minut denně pro pevnější tělo a víc energie",
    excerpt: "Krátký trénink, který zvládneš doma bez vybavení.",
    href: "#blog",
    imageIcon: <HeartPulseIcon className="h-full w-full" />,
  },
];

export function LatestArticles() {
  return (
    <section id="blog" className="relative overflow-hidden bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -right-32 -top-16 h-96 w-96 rounded-full bg-[var(--color-accent-blue)] opacity-[0.07] blur-3xl" />
      <Container className="relative flex flex-col gap-12">
        <SectionHeading eyebrow="Z blogu" title="Nové články" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
        <Button href="#blog" variant="outline-light" withArrow={false} className="mx-auto px-7 py-3.5">
          Zobrazit další články
        </Button>
      </Container>
    </section>
  );
}
