import type { ReactNode } from "react";
import { ForkKnifeIcon, HeartPulseIcon, LayersIcon, SparkIcon } from "../icons";
import type { BlogCategory } from "@/lib/blog/articles";

const CATEGORY_ICONS: Record<BlogCategory, ReactNode> = {
  "Cvičení a pohyb": <HeartPulseIcon className="h-full w-full" />,
  "Strava a recepty": <ForkKnifeIcon className="h-full w-full" />,
  "Motivace a podpora": <SparkIcon className="h-full w-full" />,
  "Osobní rozvoj": <LayersIcon className="h-full w-full" />,
};

const CATEGORY_GRADIENTS: Record<BlogCategory, string> = {
  "Cvičení a pohyb": "linear-gradient(135deg, #7c3aed, #4c1d95)",
  "Strava a recepty": "linear-gradient(135deg, #2f6ff2, #0d2f9e)",
  "Motivace a podpora": "linear-gradient(135deg, #8b3cf9, #4c1d95)",
  "Osobní rozvoj": "linear-gradient(135deg, #1f6ef9, #4c1d95)",
};

type ArticleVisualProps = {
  category: BlogCategory;
  className?: string;
  iconClassName?: string;
};

// Čistý abstraktní gradientový vizuál — dočasná náhrada za reálnou
// fotografii k článku. Žádné šrafování, žádný text "placeholder" v UI.
export function ArticleVisual({ category, className = "", iconClassName = "h-12 w-12" }: ArticleVisualProps) {
  return (
    <div
      role="img"
      aria-label={`Vizuál ke kategorii ${category}`}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: CATEGORY_GRADIENTS[category] }}
    >
      <div className="noise-layer opacity-[0.08]" />
      <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
      <div className={`relative text-white/25 ${iconClassName}`}>{CATEGORY_ICONS[category]}</div>
    </div>
  );
}
