import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { DarkSectionGlow } from "@/components/DarkSectionGlow";
import { CATEGORY_ICONS } from "@/components/blog/categoryIcons";

// Next.js's App Router already injects its own `noindex` robots meta tag
// for the built-in not-found boundary, so `robots` is intentionally left
// unset here - adding one of our own would render two separate <meta
// name="robots"> tags instead of replacing the framework's default.
export const metadata: Metadata = {
  title: "Stránka nenalezena | Fit bez času",
};

// Same 4 published categories as CategoryBadges/BlogCategory, kept as a
// static list here (name + slug only) so this error boundary never depends
// on a Supabase round-trip to render.
const CATEGORIES = [
  { slug: "cviceni-a-pohyb", name: "Cvičení a pohyb" },
  { slug: "jidelnicek-a-recepty", name: "Jídelníček a recepty" },
  { slug: "motivace-a-podpora", name: "Motivace a podpora" },
  { slug: "osobni-rozvoj", name: "Osobní rozvoj" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[var(--color-dark)]">
          <DarkSectionGlow />

          <Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-24 lg:py-28">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">
              <span className="h-1.5 w-6 rounded-full" style={{ background: "var(--gradient-brand)" }} />
              404
            </span>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Tahle stránka tu není
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">
              Možná byl odkaz změněný, nebo stránka už neexistuje. Vrať se na hlavní stránku, nebo pokračuj na blog.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-12px_rgba(139,60,249,0.6)] transition hover:brightness-110 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: "var(--gradient-brand)" }}
              >
                Zpět na hlavní stránku
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-dark)] bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Přejít na blog
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-text-on-dark-muted)]">
                Nebo pokračuj tématem, které tě zajímá
              </p>
              <ul className="flex flex-wrap justify-center gap-3">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/blog/${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span className="h-4 w-4 text-[var(--color-accent-purple-soft)]">{CATEGORY_ICONS[category.slug]}</span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
