import Image from "next/image";

import type { BlogArticle } from "@/lib/blog/articles";
import { ArticleVisual } from "./ArticleVisual";

export function ArticleImage({ article, className, sizes, priority = false, iconClassName }: { article: BlogArticle; className: string; sizes: string; priority?: boolean; iconClassName?: string }) {
  if (!article.featuredImageUrl) return <ArticleVisual categorySlug={article.categorySlug} categoryName={article.categoryName} className={className} iconClassName={iconClassName} />;
  return <div className={`relative overflow-hidden ${className}`}><Image src={article.featuredImageUrl} alt={article.featuredImageAlt} fill className="object-cover" sizes={sizes} priority={priority} /></div>;
}
