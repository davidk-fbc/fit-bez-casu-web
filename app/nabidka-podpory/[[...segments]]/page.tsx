import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivatePageRenderer } from "@/components/private-pages/PrivatePageRenderer";
import { getPublicPrivatePage } from "@/lib/private-pages";
import { SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamic = "force-dynamic";

function slug(segments: string[] | undefined) { return ["nabidka-podpory", ...(segments ?? [])].join("/"); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound();
  const canonical = `${SITE_URL}/${page.slug}`;
  return { title: `${page.title} | Fit bez času`, description: page.subtitle, alternates: { canonical }, robots: { index: false, follow: false, nocache: true, noarchive: true }, openGraph: { title: page.title, description: page.subtitle, url: canonical, locale: "cs_CZ", type: "website", ...(page.featuredImageUrl ? { images: [{ url: page.featuredImageUrl, alt: page.featuredImageAlt ?? page.title }] } : {}) }, twitter: { card: page.featuredImageUrl ? "summary_large_image" : "summary", title: page.title, description: page.subtitle, ...(page.featuredImageUrl ? { images: [page.featuredImageUrl] } : {}) } };
}

export default async function SupportOfferPage({ params }: Props) { const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound(); return <PrivatePageRenderer page={page} />; }
