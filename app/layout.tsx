import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

// Read once at module scope - NEXT_PUBLIC_* vars are inlined at build time
// anyway, so this doesn't add a runtime env lookup per render. GTM only
// renders when the variable is actually set (e.g. missing in local/preview
// environments that don't define it), never with a hardcoded fallback ID.
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
    locale: "cs_CZ",
    type: "website",
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
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
