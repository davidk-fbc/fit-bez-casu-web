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

// Title intentionally omitted - inherited as-is from the root layout's
// metadata. openGraph.description is homepage-specific (not inherited) and
// is kept in sync with the actual visible Hero message below - the root
// layout's own description is left untouched since it is shared by every
// page, not homepage-only.
export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fit bez času",
    description:
      "Pomáháme ženám, které mají málo času, zhubnout a cítit se lépe bez diet, výčitek a začínání pořád od nuly.",
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
            description="Přidej se do komunity Fit bez času a získej pravidelnou podporu, krátká domácí cvičení, praktické tipy k jídlu a motivaci, která ti pomůže pokračovat i ve dnech, kdy se ti nebude chtít."
            buttonLabel="Přidat se ke komunitě"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
