import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { ConsentMode } from "@/components/analytics/consent-mode";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { ConsentSettingsDialog } from "@/components/consent/consent-settings-dialog";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import "./globals.css";

// Read once at module scope - NEXT_PUBLIC_* vars are inlined at build time
// anyway, so this doesn't add a runtime env lookup per render. GTM only
// renders when the variable is actually set (e.g. missing in local/preview
// environments that don't define it), never with a hardcoded fallback ID.
// GA4/Meta Pixel/Clarity are meant to be configured entirely inside this
// GTM container going forward, not loaded directly by app code - see
// components/analytics/consent-mode.tsx for the Consent Mode v2 default/
// update bridge that runs ahead of it.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Fit bez času",
  description: "Pomáháme ženám cítit se lépe ve svém těle, i když mají plný diář.",
  openGraph: {
    title: "Fit bez času",
    description: "Pomáháme ženám cítit se lépe ve svém těle, i když mají plný diář.",
    siteName: "Fit bez času",
    locale: "cs_CZ",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  // Every route segment below inherits this as-is unless it defines its own
  // `twitter` object (none currently do except blog articles) - see
  // lib/seo.ts's DEFAULT_OG_IMAGE comment and the audit notes in this repo's
  // SEO report for why this only needs to be declared once here.
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <body className="flex min-h-full flex-col font-sans">
        <ConsentProvider>
          {children}
          <ConsentMode />
          <ConsentBanner />
          <ConsentSettingsDialog />
        </ConsentProvider>
      </body>
    </html>
  );
}
