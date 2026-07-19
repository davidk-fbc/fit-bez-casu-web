import type { ReactNode } from "react";
import { ForkKnifeIcon, HeartPulseIcon, LayersIcon, SparkIcon } from "../icons";
import { getCategoryBySlug, type CategorySlug } from "@/lib/blog/articles";

const CATEGORY_ICONS: Record<CategorySlug, ReactNode> = {
  "cviceni-a-pohyb": <HeartPulseIcon className="h-full w-full" />,
  "jidelnicek-a-recepty": <ForkKnifeIcon className="h-full w-full" />,
  "motivace-a-podpora": <SparkIcon className="h-full w-full" />,
  "osobni-rozvoj": <LayersIcon className="h-full w-full" />,
};

const CATEGORY_GRADIENTS: Record<CategorySlug, string> = {
  "cviceni-a-pohyb": "linear-gradient(135deg, #7c3aed, #4c1d95)",
  "jidelnicek-a-recepty": "linear-gradient(135deg, #2f6ff2, #0d2f9e)",
  "motivace-a-podpora": "linear-gradient(135deg, #8b3cf9, #4c1d95)",
  "osobni-rozvoj": "linear-gradient(135deg, #1f6ef9, #4c1d95)",
};

type ArticleVisualProps = {
  categorySlug: CategorySlug;
  className?: string;
  iconClassName?: string;
};

// Čistý abstraktní gradientový vizuál — dočasná náhrada za reálnou
// fotografii k článku. Žádné šrafování, žádný text "placeholder" v UI.
export function ArticleVisual({ categorySlug, className = "", iconClassName = "h-12 w-12" }: ArticleVisualProps) {
  const categoryName = getCategoryBySlug(categorySlug)?.name ?? categorySlug;

  return (
    <div
      role="img"
      aria-label={`Vizuál ke kategorii ${categoryName}`}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: CATEGORY_GRADIENTS[categorySlug] }}
    >
      <div className="noise-layer opacity-[0.08]" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
      <div className={`relative text-white/25 ${iconClassName}`}>{CATEGORY_ICONS[categorySlug]}</div>
    </div>
  );
}
