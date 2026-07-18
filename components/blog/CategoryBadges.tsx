import { ForkKnifeIcon, HeartPulseIcon, LayersIcon, SparkIcon } from "../icons";
import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/blog/articles";

const CATEGORY_ICONS: Record<BlogCategory, React.ReactNode> = {
  "Cvičení a pohyb": <HeartPulseIcon className="h-full w-full" />,
  "Strava a recepty": <ForkKnifeIcon className="h-full w-full" />,
  "Motivace a podpora": <SparkIcon className="h-full w-full" />,
  "Osobní rozvoj": <LayersIcon className="h-full w-full" />,
};

// V1: čistě vizuální přehled kategorií, bez klientského filtrování —
// viz report. Až bude víc obsahu, doplní se funkční filtr/URL struktura.
export function CategoryBadges() {
  return (
    <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
      <li>
        <span
          aria-current="true"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-card)]"
          style={{ background: "var(--gradient-brand)" }}
        >
          Všechny články
        </span>
      </li>
      {BLOG_CATEGORIES.map((category) => (
        <li key={category}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border-light)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-card)]">
            <span className="h-4 w-4 text-[var(--color-accent-purple)]">{CATEGORY_ICONS[category]}</span>
            {category}
          </span>
        </li>
      ))}
    </ul>
  );
}
