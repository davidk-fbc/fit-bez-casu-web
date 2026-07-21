import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/blog/articles";
import { CATEGORY_ICONS } from "./categoryIcons";

// Kategorie jsou skutečné odkazy na vlastní podstránky /blog/[categorySlug],
// ne klientský filtr na téže stránce.
export function CategoryBadges() {
  return (
    <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {BLOG_CATEGORIES.map((category) => (
        <li key={category.slug}>
          <Link
            href={`/blog/${category.slug}`}
            className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border-light)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent-blue)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
          >
            <span className="h-4 w-4 text-[var(--color-accent-purple)]">{CATEGORY_ICONS[category.slug]}</span>
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
