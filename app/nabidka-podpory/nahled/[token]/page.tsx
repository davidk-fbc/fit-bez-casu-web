import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PrivatePageRenderer } from "@/components/private-pages/PrivatePageRenderer";
import { getPrivatePagePreview } from "@/lib/private-pages";
import { applySupportOfferCopy } from "@/lib/support-offer-copy";

type Props = { params: Promise<{ token: string }> };
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Náhled neveřejné stránky | Fit bez času", robots: { index: false, follow: false, nocache: true, noarchive: true } };

export default async function PrivatePagePreview({ params }: Props) { const { token } = await params; const page = await getPrivatePagePreview(token); if (!page) notFound(); return <PrivatePageRenderer page={applySupportOfferCopy(page)} preview />; }
