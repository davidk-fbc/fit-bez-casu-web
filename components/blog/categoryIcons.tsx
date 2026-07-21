import type { ReactNode } from "react";
import { ChatBubblesIcon, ForkKnifeIcon, RunningIcon, TrendingUpIcon } from "../icons";
import type { CategorySlug } from "@/lib/blog/articles";

// Single central mapping of blog category -> icon. Used by every category
// visual on the site (CategoryBadges pills, ArticleVisual - and therefore
// LatestArticleCard, SimpleArticleCard, BlogArticleCard, and the homepage
// "Vybrali jsme pro tebe" section) so one category never shows two
// different icons in two places.
export const CATEGORY_ICONS: Record<CategorySlug, ReactNode> = {
  "cviceni-a-pohyb": <RunningIcon className="h-full w-full" />,
  "jidelnicek-a-recepty": <ForkKnifeIcon className="h-full w-full" />,
  "motivace-a-podpora": <ChatBubblesIcon className="h-full w-full" />,
  "osobni-rozvoj": <TrendingUpIcon className="h-full w-full" />,
};
