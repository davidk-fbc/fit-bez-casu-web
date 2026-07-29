import Link from "next/link";

import { Container } from "@/components/Container";

export default function SupportOfferNotFound() { return <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]"><Container><div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-[var(--shadow-card)] sm:p-12"><p className="text-sm font-bold tracking-[0.16em] text-[var(--color-accent-purple)]">404</p><h1 className="mt-4 text-3xl font-black sm:text-4xl">Tato stránka není dostupná</h1><p className="mt-4 leading-relaxed text-[var(--color-text-muted)]">Odkaz už nemusí být platný nebo stránka zatím nebyla zveřejněna.</p><Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>Přejít na hlavní stránku</Link></div></Container></section>; }
