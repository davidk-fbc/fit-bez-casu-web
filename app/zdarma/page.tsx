import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { FeatureCard } from "@/components/FeatureCard";
import { JsonLd } from "@/components/JsonLd";
import { CheckIcon, ForkKnifeIcon, PencilIcon, PhoneIcon } from "@/components/icons";
import { FreeLeadMagnetCta } from "@/components/free-resources/FreeLeadMagnetCta";
import { FreeLeadMagnetPreview } from "@/components/free-resources/FreeLeadMagnetPreview";
import { LeadMagnetSignupProvider } from "@/components/free-resources/LeadMagnetSignupProvider";
import { FREE_LEAD_MAGNETS } from "@/lib/free-lead-magnets";
import { EXTERNAL_LINKS } from "@/lib/links";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { absoluteUrl, getBreadcrumbListSchema, getPageSchema } from "@/lib/structured-data";

const PAGE_TITLE = "Materiály zdarma pro zdravé hubnutí | Fit bez času";
const PAGE_DESCRIPTION =
  "Stáhni si praktické materiály zdarma pro zdravé hubnutí: rychlá jídla, večerní chutě, zdravý nákup a self-check jídelníčku.";
const PAGE_PATH = "/zdarma";
const PAGE_URL = absoluteUrl(PAGE_PATH);

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  robots: {
    index: true,
    follow: true,
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

const FREE_PAGE_SCHEMA = getPageSchema({
  type: "CollectionPage",
  path: PAGE_PATH,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  breadcrumbPath: PAGE_PATH,
});

const FREE_PAGE_BREADCRUMB = getBreadcrumbListSchema(PAGE_PATH, [
  { name: "Domů", path: "/" },
  { name: "Zdarma", path: PAGE_PATH },
]);

const DECISION_ITEMS = [
  {
    question: "Nestíháš vařit?",
    answer: "Začni 15 rychlými jídly.",
  },
  {
    question: "Večer tě honí chuť na sladké?",
    answer: "Začni e-bookem o večerních chutích.",
  },
  {
    question: "Nevíš, co nakupovat?",
    answer: "Vezmi si Tahák zdravého nákupu.",
  },
  {
    question: "Snažíš se, ale nevíš, co ve svém jídelníčku změnit?",
    answer: "Projdi si 7 chyb, které mohou brzdit hubnutí.",
  },
] as const;

const PAID_NEXT_STEPS = [
  {
    icon: <ForkKnifeIcon className="h-full w-full" />,
    title: "Jídelníček pro zdravé hubnutí",
    description:
      "Když chceš vědět, co a kolik jíst během celého dne, a mít jasný plán z běžných potravin.",
    href: EXTERNAL_LINKS.mealPlan,
    linkLabel: "Zjistit více",
    linkAriaLabel: "Zjistit více o Jídelníčku pro zdravé hubnutí",
  },
  {
    icon: <PhoneIcon className="h-full w-full" />,
    title: "Aplikace Fit bez času",
    description:
      "Když chceš mít jídlo, pohyb a svůj progres přehledně na jednom místě a jednoduše se v tom vyznat i v nabitém dni.",
    href: EXTERNAL_LINKS.app,
    linkLabel: "Zjistit více",
    linkAriaLabel: "Zjistit více o Aplikaci Fit bez času",
  },
  {
    icon: <PencilIcon className="h-full w-full" />,
    title: "Osobní rozbor jídelníčku",
    description:
      "Když chceš zjistit, co už ve tvém jídelníčku funguje, co tě může brzdit a co má smysl změnit jako první.",
    href: "/nabidka-podpory/osobni-rozbor-jidelnicku",
    linkLabel: "Zjistit více",
    linkAriaLabel: "Zjistit více o osobním rozboru jídelníčku",
  },
] as const;

export default function FreeResourcesPage() {
  return (
    <>
      <JsonLd data={FREE_PAGE_SCHEMA} />
      <JsonLd data={FREE_PAGE_BREADCRUMB} />
      <Header />
      <LeadMagnetSignupProvider>
      <main className="min-w-0 flex-1 overflow-x-clip">
        <section className="relative overflow-hidden bg-[var(--color-dark)] py-20 sm:py-24 lg:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-36 h-[34rem] w-[34rem] rounded-full bg-[var(--color-accent-purple)] opacity-25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 left-0 h-[28rem] w-[28rem] rounded-full bg-[var(--color-accent-blue)] opacity-20 blur-3xl"
          />
          <div className="noise-layer" />
          <Container className="relative max-w-4xl text-center">
            <p className="mb-5 text-sm font-bold tracking-[0.22em] text-[#68b7ff]">ZDARMA PRO TEBE</p>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
              Vyber si praktický materiál podle toho, co právě řešíš
            </h1>
            <div className="mx-auto mt-7 flex max-w-3xl flex-col gap-3 text-base leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-lg">
              <p>Večerní chutě, rychlá jídla, nákup nebo pocit, že se snažíš a nevíš, kde je problém?</p>
              <p>Praktické materiály, které ti pomůžou udělat si v tom jasno a rovnou něco změnit.</p>
              <p className="font-semibold text-white">Vyber si ten, který se nejvíc hodí k tomu, co řešíš právě teď.</p>
            </div>
          </Container>
        </section>

        {FREE_LEAD_MAGNETS.map((magnet, index) => {
          const previewOnRight = index % 2 === 1;
          const noteId = `${magnet.key}-cta-note`;

          return (
            <section
              key={magnet.key}
              id={magnet.key}
              className={`overflow-hidden py-[var(--space-section)] ${
                index % 2 === 0
                  ? "bg-[var(--color-surface)]"
                  : "bg-[linear-gradient(180deg,#f7f7fb_0%,#f8f5ff_100%)]"
              }`}
            >
              <Container>
                <article className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
                  <div className={`min-w-0 ${previewOnRight ? "lg:order-2" : ""}`}>
                    <FreeLeadMagnetPreview
                      cover={magnet.preview.cover}
                      inside={magnet.preview.inside}
                      alt={magnet.preview.alt}
                      priority={index === 0}
                    />
                  </div>

                  <div className={`min-w-0 ${previewOnRight ? "lg:order-1" : ""}`}>
                    <p className="text-xs font-bold leading-relaxed tracking-[0.18em] text-[var(--color-accent-blue)] sm:text-sm">
                      {magnet.eyebrow}
                    </p>
                    <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-[var(--color-text)] sm:text-4xl lg:text-[2.65rem]">
                      {magnet.headline}
                    </h2>

                    <div className="mt-6 flex flex-col gap-3 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                      {magnet.description.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <p className="mt-7 text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-text)]">
                      {index === 0 ? "Uvnitř najdeš" : index === 1 ? "Zjistíš" : index === 2 ? "V taháku najdeš" : "Podíváš se na"}
                    </p>
                    <ul className="mt-4 grid gap-3" aria-label={`Co obsahuje ${magnet.title}`}>
                      {magnet.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:text-base">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--color-accent-blue)]">
                            <CheckIcon className="h-3.5 w-3.5" />
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-col gap-2 text-base font-medium leading-relaxed text-[var(--color-text)]">
                      {magnet.closing.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-col items-stretch sm:items-start">
                      <FreeLeadMagnetCta
                        magnetId={magnet.id}
                        label={magnet.ctaLabel}
                        describedBy={noteId}
                      />
                      <p id={noteId} className="mt-2 text-center text-xs font-medium text-[var(--color-text-muted)] sm:pl-5 sm:text-left">
                        {magnet.ctaNote}
                      </p>
                    </div>
                  </div>
                </article>
              </Container>
            </section>
          );
        })}

        <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
          <Container className="max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold tracking-[0.18em] text-[var(--color-accent-blue)]">KDE ZAČÍT</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl">
                Začni tím, co řešíš právě teď
              </h2>
            </div>
            <div className="mt-12 grid border-y border-[var(--color-border-light)] sm:grid-cols-2">
              {DECISION_ITEMS.map((item, index) => (
                <div
                  key={item.question}
                  className={`py-7 sm:p-8 ${index > 0 ? "border-t border-[var(--color-border-light)]" : ""} ${
                    index === 1 ? "sm:border-l sm:border-t-0" : ""
                  } ${index === 2 ? "sm:border-t" : ""} ${index === 3 ? "sm:border-l sm:border-t" : ""}`}
                >
                  <h3 className="text-lg font-bold text-[var(--color-text)]">{item.question}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--color-text-muted)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section
          aria-labelledby="paid-next-steps-heading"
          className="bg-[var(--color-surface)] py-[var(--space-section)]"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold tracking-[0.18em] text-[var(--color-accent-blue)]">
                CHCEŠ JÍT O KROK DÁL?
              </p>
              <h2
                id="paid-next-steps-heading"
                className="mt-4 text-balance text-3xl font-bold tracking-[-0.03em] text-[var(--color-text)] sm:text-5xl"
              >
                Vyber si podporu podle toho, co právě potřebuješ
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
                Materiály zdarma ti můžou pomoct udělat si jasno. Když ale chceš konkrétní plán, nástroj pro každý den nebo
                osobní zpětnou vazbu, můžeš pokračovat tady.
              </p>
            </div>

            <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
              {PAID_NEXT_STEPS.map((card) => (
                <FeatureCard
                  key={card.title}
                  {...card}
                  linkClassName="min-h-11 rounded-sm py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                />
              ))}
            </div>
          </Container>
        </section>
      </main>
      </LeadMagnetSignupProvider>
      <Footer />
    </>
  );
}
