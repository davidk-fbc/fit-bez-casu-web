import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivatePageRenderer } from "@/components/private-pages/PrivatePageRenderer";
import { getPublicPrivatePage } from "@/lib/private-pages";
import { SITE_URL } from "@/lib/seo";
import { applySupportOfferCopy } from "@/lib/support-offer-copy";
import { getSupportOfferSeo } from "@/lib/support-offer-seo";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamic = "force-dynamic";

function slug(segments: string[] | undefined) { return ["nabidka-podpory", ...(segments ?? [])].join("/"); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound(); const displayPage = applySupportOfferCopy(page);
  const canonical = `${SITE_URL}/${displayPage.slug}`;
  const seo = getSupportOfferSeo(displayPage.slug);
  const title = seo?.title ?? `${displayPage.title} | Fit bez času`;
  const description = seo?.description ?? displayPage.subtitle;
  const robots = seo ? { index: true, follow: true } : { index: false, follow: false, nocache: true, noarchive: true };
  return { title, description, alternates: { canonical }, robots, openGraph: { title, description, url: canonical, locale: "cs_CZ", type: "website", ...(displayPage.featuredImageUrl ? { images: [{ url: displayPage.featuredImageUrl, alt: displayPage.featuredImageAlt ?? displayPage.title }] } : {}) }, twitter: { card: displayPage.featuredImageUrl ? "summary_large_image" : "summary", title, description, ...(displayPage.featuredImageUrl ? { images: [displayPage.featuredImageUrl] } : {}) } };
}

export default async function SupportOfferPage({ params }: Props) { const { segments } = await params; const page = await getPublicPrivatePage(slug(segments)); if (!page) notFound(); return <PrivatePageRenderer page={applySupportOfferCopy(page)} />; }
