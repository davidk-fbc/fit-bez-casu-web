import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommunityCta } from "@/components/CommunityCta";
import { Hero } from "@/components/sections/Hero";
import { IntroCards } from "@/components/sections/IntroCards";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { AboutUs } from "@/components/sections/AboutUs";
import { LatestArticles } from "@/components/sections/LatestArticles";

// Title/description intentionally omitted - inherited as-is from the root
// layout's metadata (same text, not duplicated here). Only the fields this
// SEO phase actually needs (canonical + matching Open Graph url/type) are
// added; openGraph.title/description mirror the layout's existing values
// verbatim since Next.js does not deep-merge a page-level openGraph object
// with the parent's.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fit bez času",
    description: "Pomáháme ženám cítit se lépe ve svém těle, i když mají plný diář.",
    url: "/",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <IntroCards />
        <HowWeHelp />
        <AppShowcase />
        <AboutUs />
        <LatestArticles />
        <section className="bg-[var(--color-surface-muted)] pb-[var(--space-section)]">
          <CommunityCta
            title="Na změnu nemusíš být sama"
            description="Přidej se do komunity Fit bez času a získej pravidelnou podporu, krátká cvičení, praktické tipy k jídlu a motivaci, která ti pomůže začít a hlavně vydržet."
            buttonLabel="Přidat se ke komunitě"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
