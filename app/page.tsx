import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommunityCta } from "@/components/CommunityCta";
import { Hero } from "@/components/sections/Hero";
import { IntroCards } from "@/components/sections/IntroCards";
import { HowWeHelp } from "@/components/sections/HowWeHelp";
import { AppShowcase } from "@/components/sections/AppShowcase";
import { AboutUs } from "@/components/sections/AboutUs";
import { LatestArticles } from "@/components/sections/LatestArticles";

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
          <CommunityCta />
        </section>
      </main>
      <Footer />
    </>
  );
}
