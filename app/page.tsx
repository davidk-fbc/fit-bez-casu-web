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
import { JsonLd } from "@/components/JsonLd";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { absoluteUrl, getPageSchema } from "@/lib/structured-data";

// The root layout has no title template (each page sets its own full,
// literal title - see app/blog/(index)/page.tsx and app/o-nas/page.tsx for
// the same "X | Fit bez času" convention), so this is assigned as a plain
// string, never title.absolute - there is no template to override.
const PAGE_TITLE = "Fit bez času | Hubnutí, jídelníček a cvičení pro ženy";
// Kept in sync with what the homepage actually offers (Hero's own promise
// below is "jasný systém pro jídlo, krátká cvičení a podporu komunity" -
// this is the same offer in SEO-friendly phrasing, not invented copy).
const PAGE_DESCRIPTION =
  "Pomáháme ženám, které mají málo času, zhubnout bez diet a extrémů. Najdeš tu jídelníček, krátká cvičení, praktické tipy a podporu komunity Fit bez času.";
// Same absolute URL reused for canonical, openGraph.url and the WebPage
// JSON-LD below, so all three always agree. Note: Next.js's own metadata
// resolver (resolveAbsoluteUrlWithPathname in next/dist/lib/metadata/
// resolvers/resolve-url.js) always renders the *root* path's resolved
// canonical/og:url without a trailing slash (using `origin`, not `href`)
// unless next.config's `trailingSlash` is enabled project-wide - passing an
// absolute vs. relative "/" here makes no difference to that. The WebPage
// JSON-LD is unaffected (it doesn't go through that resolver) and keeps its
// trailing slash.
const PAGE_URL = absoluteUrl("/");

// title/description are set directly here (the root layout's own title/
// description are the shared fallback for every other page, not homepage-
// only) - openGraph is its own full object because Next.js does not merge
// nested metadata objects key-by-key, it replaces them, so every field the
// root layout's openGraph sets (siteName included) must be repeated here.
export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: "cs_CZ",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const HOMEPAGE_SCHEMA = getPageSchema({
  type: "WebPage",
  path: "/",
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  primaryImage: true,
});

// Route-level ceiling matching the 3600s revalidate already set on
// components/sections/LatestArticles.tsx's cached article lookup - this
// page has no other dynamic data source of its own, so the two together
// keep the whole route static/ISR instead of dynamic on every request.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <JsonLd data={HOMEPAGE_SCHEMA} />
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
