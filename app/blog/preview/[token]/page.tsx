import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { getPreviewArticle } from "@/lib/blog/articles";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  if (!await getPreviewArticle(token)) notFound();
  return { title: "Náhled článku | Fit bez času", robots: { index: false, follow: false, noarchive: true } };
}

export default async function PreviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const article = await getPreviewArticle(token);
  if (!article) notFound();
  return <><Header /><main className="flex-1"><ArticleContent article={article} preview /></main><Footer /></>;
}
