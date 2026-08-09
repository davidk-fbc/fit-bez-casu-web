import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivatePageRenderer } from "@/components/private-pages/PrivatePageRenderer";
import { getPublicPrivatePage } from "@/lib/private-pages";
import { SITE_URL } from "@/lib/seo";
import { applySupportOfferCopy } from "@/lib/support-offer-copy";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamic = "force-dynamic";

function slug(segments: string[] | undefined) { return ["nabidka-podpory", ...(segments ?? [])].join("/"); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound(); const displayPage = applySupportOfferCopy(page);
  const canonical = `${SITE_URL}/${displayPage.slug}`;
  return { title: `${displayPage.title} | Fit bez času`, description: displayPage.subtitle, alternates: { canonical }, robots: { index: false, follow: false, nocache: true, noarchive: true }, openGraph: { title: displayPage.title, description: displayPage.subtitle, url: canonical, locale: "cs_CZ", type: "website", ...(displayPage.featuredImageUrl ? { images: [{ url: displayPage.featuredImageUrl, alt: displayPage.featuredImageAlt ?? displayPage.title }] } : {}) }, twitter: { card: displayPage.featuredImageUrl ? "summary_large_image" : "summary", title: displayPage.title, description: displayPage.subtitle, ...(displayPage.featuredImageUrl ? { images: [displayPage.featuredImageUrl] } : {}) } };
}

export default async function SupportOfferPage({ params }: Props) { const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound(); return <PrivatePageRenderer page={applySupportOfferCopy(page)} />; }
