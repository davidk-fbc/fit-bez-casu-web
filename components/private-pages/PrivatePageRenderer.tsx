import Image from "next/image";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { InstagramIcon, MailIcon } from "@/components/icons";
import type { OverviewCard, OverviewContent, PrivatePage, PrivatePageContact, PrivatePageDetailItem, RenewalContent, ServiceDetailContent } from "@/lib/private-pages";
import { isSupportOfferPage, type SupportOfferCard } from "@/lib/support-offer-copy";

export function PrivatePageRenderer({ page, preview = false }: { page: PrivatePage; preview?: boolean }) {
  return <><Hero page={page} preview={preview} />{page.pageType === "support_overview" ? <Overview content={page.content as OverviewContent} emphasizeServiceNames={isSupportOfferPage(page)} /> : page.pageType === "service_detail" ? <ServiceDetail page={page} content={page.content as ServiceDetailContent} /> : <Renewal page={page} content={page.content as RenewalContent} />}</>;
}

function Hero({ page, preview }: { page: PrivatePage; preview: boolean }) {
  const eyebrow = page.pageType === "support_overview" ? (page.content as OverviewContent).eyebrow : page.pageType === "service_detail" ? (page.content as ServiceDetailContent).eyebrow : (page.content as RenewalContent).eyebrow;
  const preparing = page.pageType === "service_detail" && (page.content as ServiceDetailContent).preparing;
  return <section className="relative overflow-hidden bg-[var(--color-dark)] py-20 text-white sm:py-24 lg:py-28"><div className="stars-layer" /><div className="noise-layer" /><div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-80 max-w-5xl opacity-35 blur-3xl" style={{ background: "var(--gradient-brand-diagonal)" }} /><Container className="relative"><div className="mx-auto max-w-4xl text-center">{preview ? <p className="mx-auto mb-5 w-fit rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-xs font-bold tracking-[0.16em] text-amber-100">NÁHLED KONCEPTU</p> : null}<p className="text-sm font-bold tracking-[0.18em] text-[#bba4ff]">{eyebrow}</p>{preparing ? <p className="mx-auto mt-5 w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">Připravujeme</p> : null}<h1 className="mt-5 text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1><p className="mx-auto mt-6 max-w-3xl text-balance text-lg leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-xl">{isSupportOfferPage(page) ? <SupportOfferSubtitle /> : page.subtitle}</p></div>{page.featuredImageUrl && page.featuredImageAlt ? <div className="relative mx-auto mt-12 aspect-[16/7] max-w-5xl overflow-hidden rounded-[var(--radius-card)] border border-white/10 shadow-[var(--shadow-card)]"><Image src={page.featuredImageUrl} alt={page.featuredImageAlt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 1024px" /></div> : null}</Container></section>;
}

function SupportOfferSubtitle() {
  return <>Nemusíš na všechno přicházet sama. Vyber si podle toho, jestli chceš <strong className="font-semibold text-white">jednorázově zjistit, co můžeš ve svém jídelníčku zlepšit</strong>, nebo chceš <strong className="font-semibold text-white">průběžnou podporu během několika týdnů</strong>.</>;
}

function Overview({ content, emphasizeServiceNames }: { content: OverviewContent; emphasizeServiceNames: boolean }) {
  const cards = content.cards.filter((card) => card.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const closingText = content.closingText || content.afterCards;
  return <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]"><Container><div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">{cards.map((card) => <SupportCard key={card.id} card={card} />)}</div>{content.closingTitle || closingText ? <div className="mx-auto mt-12 max-w-3xl text-center">{content.closingTitle ? <h2 className="text-balance text-2xl font-black sm:text-3xl">{content.closingTitle}</h2> : null}{closingText ? emphasizeServiceNames ? <SupportSelectionCopy text={closingText} hasTitle={Boolean(content.closingTitle)} /> : <p className={`${content.closingTitle ? "mt-4" : ""} text-lg leading-relaxed text-[var(--color-text-muted)]`}>{closingText}</p> : null}</div> : null}{content.finalCta.active ? <div className="mt-9 flex justify-center"><Button href={content.finalCta.url} className="px-8 py-4">{content.finalCta.label}</Button></div> : null}</Container></section>;
}

const SUPPORT_SERVICE_NAMES = new Set(["Osobní rozbor jídelníčku", "4týdenní podpora", "Osobní vedení 1:1"]);
const SUPPORT_SERVICE_PATTERN = /(Osobní rozbor jídelníčku|4týdenní podpora|Osobní vedení 1:1)/g;

function SupportSelectionCopy({ text, hasTitle }: { text: string; hasTitle: boolean }) {
  return <div className={`${hasTitle ? "mt-4" : ""} space-y-4 text-lg leading-relaxed text-[var(--color-text-muted)]`}>{text.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph.split(SUPPORT_SERVICE_PATTERN).map((part, index) => SUPPORT_SERVICE_NAMES.has(part) ? <strong key={`${part}-${index}`} className="font-semibold text-[var(--color-text)]">{part}</strong> : part)}</p>)}</div>;
}

type PrivateCtaTone = "brand" | "on-gradient" | "on-dark";

const privateCtaToneClasses: Record<PrivateCtaTone, { variant: "gradient" | "outline-light"; className: string }> = {
  brand: {
    variant: "gradient",
    className: "text-white shadow-[0_18px_42px_-14px_rgba(70,76,235,0.92),0_0_28px_-12px_rgba(139,60,249,0.82)] hover:brightness-110 hover:shadow-[0_22px_48px_-14px_rgba(70,76,235,0.98),0_0_34px_-10px_rgba(139,60,249,0.9)] focus-visible:outline-[#6d28d9]",
  },
  "on-gradient": {
    variant: "outline-light",
    className: "border-2 border-white bg-white text-[#24124f] shadow-[0_18px_38px_-14px_rgba(17,8,50,0.82),0_0_24px_-12px_rgba(255,255,255,0.95)] hover:bg-white hover:text-[#12082d] hover:shadow-[0_22px_44px_-14px_rgba(17,8,50,0.9),0_0_30px_-10px_rgba(255,255,255,1)] focus-visible:outline-white",
  },
  "on-dark": {
    variant: "gradient",
    className: "border border-white/30 text-white shadow-[0_18px_42px_-14px_rgba(46,110,249,0.95),0_0_30px_-10px_rgba(139,60,249,0.9)] hover:brightness-110 hover:shadow-[0_22px_48px_-14px_rgba(46,110,249,1),0_0_36px_-8px_rgba(139,60,249,0.95)] focus-visible:outline-white",
  },
};

function PrivatePageCta({ href, children, tone = "brand", className = "", target, rel }: { href: string; children: React.ReactNode; tone?: PrivateCtaTone; className?: string; target?: "_blank"; rel?: string }) {
  const style = privateCtaToneClasses[tone];
  return <Button href={href} target={target} rel={rel} variant={style.variant} className={`group min-h-14 min-w-0 max-w-full whitespace-normal break-words px-7 py-4 text-center text-base font-bold leading-snug transition-[transform,filter,box-shadow,background-color] duration-200 ease-out focus-visible:outline-4 focus-visible:outline-offset-4 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-px motion-reduce:transform-none motion-reduce:transition-none [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0 [&>svg]:transition-transform motion-safe:hover:[&>svg]:translate-x-1 motion-reduce:[&>svg]:transition-none sm:min-h-16 sm:px-9 sm:text-lg ${style.className} ${className}`}>{children}</Button>;
}

const cardStyles: Record<OverviewCard["variant"], { shell: string; muted: string; bullet: string; ctaTone: PrivateCtaTone }> = {
  light: { shell: "border border-[var(--color-border-light)] bg-white text-[var(--color-text)] shadow-[var(--shadow-card)]", muted: "text-[var(--color-text-muted)]", bullet: "bg-[#eee8ff] text-[var(--color-accent-purple)]", ctaTone: "brand" },
  gradient: { shell: "border border-white/20 bg-[linear-gradient(135deg,#2f6bff,#9b3ddb)] text-white shadow-[0_28px_70px_-25px_rgba(70,70,235,0.75)]", muted: "text-white/82", bullet: "bg-white/18 text-white", ctaTone: "on-gradient" },
  dark: { shell: "border border-white/10 bg-[linear-gradient(135deg,#10163a,#2a1b57)] text-white shadow-[var(--shadow-card)]", muted: "text-white/72", bullet: "bg-white/12 text-[#c4aeff]", ctaTone: "on-dark" },
};

function SupportCard({ card }: { card: OverviewCard }) {
  const style = cardStyles[card.variant];
  const supportCard = "contactActions" in card ? card as SupportOfferCard : null;
  return <article className={`flex h-full min-w-0 flex-col rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] sm:p-7 ${style.shell}`}><p className="text-xs font-extrabold tracking-[0.16em] opacity-85">{card.eyebrow}</p><h2 className="mt-4 break-words text-2xl font-black leading-tight sm:text-3xl">{card.title}</h2><p className={`mt-4 leading-relaxed ${style.muted}`}>{card.description}</p>{supportCard?.preBenefitsText ? <p className={`mt-4 text-sm leading-relaxed ${style.muted}`}>{supportCard.preBenefitsText}</p> : null}<h3 className="mt-7 text-base font-extrabold">{card.benefitsHeading}</h3><ul className="mt-3 space-y-3">{card.benefits.map((benefit) => <li key={benefit} className="flex min-w-0 gap-2.5"><span aria-hidden="true" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${style.bullet}`}>✓</span><span className="min-w-0 break-words text-sm leading-relaxed">{benefit}</span></li>)}</ul>{card.supportingText ? <p className={`mt-6 text-sm leading-relaxed ${style.muted}`}>{card.supportingText}</p> : null}{supportCard?.emphasisText ? <p className="mt-6 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white">{supportCard.emphasisText}</p> : null}{supportCard?.contactText ? <p className={`mt-5 text-sm leading-relaxed ${style.muted}`}>{supportCard.contactText}</p> : null}<div className="mt-auto pt-6">{card.price ? <div className="mb-5"><p className="text-3xl font-black">{card.price}</p>{card.priceNote ? <p className={`mt-1 text-sm ${style.muted}`}>{card.priceNote}</p> : null}</div> : null}{supportCard?.contactActions.length ? <div className="flex min-w-0 flex-wrap gap-3">{supportCard.contactActions.map((action) => { const Icon = action.icon === "mail" ? MailIcon : InstagramIcon; return <Button key={action.href} href={action.href} target={action.external ? "_blank" : undefined} rel={action.external ? "noopener noreferrer" : undefined} aria-label={action.ariaLabel} variant="outline-dark" withArrow={false} className="min-h-11 min-w-36 flex-1 justify-center whitespace-normal px-4 py-2.5 text-center text-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><Icon className="h-4 w-4 shrink-0" />{action.label}</Button>; })}</div> : <PrivatePageCta href={`/${card.targetSlug}`} tone={style.ctaTone} className="w-full justify-center">{card.ctaLabel}</PrivatePageCta>}</div></article>;
}

function ServiceDetail({ page, content }: { page: PrivatePage; content: ServiceDetailContent }) {
  const ctaUrl = content.cta.active ? page.salesLinks[content.cta.salesLinkKey] : undefined;
  const showPrice = content.sections.price && Boolean(content.price);
  const showAction = showPrice || (content.sections.cta && Boolean(ctaUrl));
  return <div className="bg-white"><Container className="py-[var(--space-section)]"><div className="mx-auto max-w-4xl space-y-8">{content.sections.audience ? <ContentSection title={content.audienceTitle || "Pro koho služba je"}><BulletList items={content.audience} /></ContentSection> : null}{content.sections.benefits ? <ContentSection title={content.benefitsTitle || "Co získáš"}><DetailList items={content.benefits} /></ContentSection> : null}{content.sections.process ? <ContentSection title={content.processTitle || "Jak služba probíhá"}><DetailList items={content.process} numbered /></ContentSection> : null}{content.sections.inclusions ? <ContentSection title={content.inclusionsTitle || "Co služba obsahuje"}><BulletList items={content.inclusions} /></ContentSection> : null}{content.objectionTitle && content.objectionText ? <ContentSection title={content.objectionTitle}><p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{content.objectionText}</p></ContentSection> : null}{content.closingTitle || content.closingText ? <ContentSection title={content.closingTitle || "Shrnutí"}><p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{content.closingText}</p></ContentSection> : null}{content.additionalInfo ? <p className="rounded-2xl bg-[var(--color-surface-muted)] p-6 leading-relaxed text-[var(--color-text-muted)]">{content.additionalInfo}</p> : null}{content.contact ? <ContactBlock contact={content.contact} /> : null}{showAction ? <section className="mx-auto max-w-xl text-center">{showPrice ? <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-accent-purple)]">Cena</p><p className="mt-2 text-4xl font-black">{content.price}</p>{content.priceNote ? <p className="mt-2 text-[var(--color-text-muted)]">{content.priceNote}</p> : null}</div> : null}{content.sections.cta && ctaUrl ? <div className={showPrice ? "mt-8" : undefined}><PrivatePageCta href={ctaUrl} target={ctaUrl.startsWith("https://") ? "_blank" : undefined} rel={ctaUrl.startsWith("https://") ? "noopener noreferrer" : undefined} className="w-full justify-center sm:w-auto sm:min-w-80">{content.cta.label}</PrivatePageCta>{content.buttonNote ? <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{content.buttonNote}</p> : null}</div> : null}</section> : null}</div></Container></div>;
}

function ContactBlock({ contact }: { contact: PrivatePageContact }) {
  const instagramAt = contact.text.indexOf(contact.instagramLabel), emailAt = contact.text.indexOf(contact.emailLabel);
  const beforeInstagram = contact.text.slice(0, instagramAt), betweenLinks = contact.text.slice(instagramAt + contact.instagramLabel.length, emailAt), afterEmail = contact.text.slice(emailAt + contact.emailLabel.length);
  const linkClass = "break-words font-semibold text-[var(--color-accent-purple)] underline decoration-2 underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-purple)]";
  return <p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{beforeInstagram}<a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>{contact.instagramLabel}</a>{betweenLinks}<a href={contact.emailUrl} className={linkClass}>{contact.emailLabel}</a>{afterEmail}</p>;
}

function Renewal({ page, content }: { page: PrivatePage; content: RenewalContent }) {
  const ctaUrl = content.cta.active ? page.salesLinks[content.cta.salesLinkKey] : undefined;
  return <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]"><Container><div className="mx-auto max-w-4xl space-y-8"><ContentSection title={content.benefitsTitle || "Co pokračování obsahuje"}><BulletList items={content.benefits} /></ContentSection><ContentSection title={content.continuityTitle || "Jak období naváže"}><p className="text-lg leading-relaxed text-[var(--color-text-muted)]">{content.continuityText}</p></ContentSection><section className="mx-auto max-w-xl text-center"><h2 className="text-2xl font-black sm:text-3xl">{content.priceTitle || "Cena pokračování"}</h2><p className="mt-5 text-4xl font-black">{content.price}</p><p className="mt-2 text-[var(--color-text-muted)]">{content.priceNote}</p>{ctaUrl ? <><PrivatePageCta href={ctaUrl} target={ctaUrl.startsWith("https://") ? "_blank" : undefined} rel={ctaUrl.startsWith("https://") ? "noopener noreferrer" : undefined} className="mt-8 w-full justify-center sm:w-auto sm:min-w-80">{content.cta.label}</PrivatePageCta>{content.ctaSupportText ? <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{content.ctaSupportText}</p> : null}</> : null}</section>{content.contactNote ? <p className="rounded-2xl border border-[var(--color-border-light)] bg-white p-6 leading-relaxed text-[var(--color-text-muted)]">{content.contactNote}</p> : null}</div></Container></section>;
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[var(--color-border-light)] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(20,10,60,0.45)] sm:p-8"><h2 className="text-2xl font-black sm:text-3xl">{title}</h2><div className="mt-5">{children}</div></section>; }
function BulletList({ items }: { items: string[] }) { return <ul className="grid gap-4 sm:grid-cols-2">{items.map((item) => <li key={item} className="flex min-w-0 gap-3"><span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eee8ff] text-xs font-black text-[var(--color-accent-purple)]">✓</span><span className="min-w-0 break-words leading-relaxed text-[var(--color-text-muted)]">{item}</span></li>)}</ul>; }
function DetailList({ items, numbered = false }: { items: PrivatePageDetailItem[]; numbered?: boolean }) { return <ol className="space-y-5">{items.map((item, index) => { const title = typeof item === "string" ? "" : item.title; const text = typeof item === "string" ? item : item.text; return <li key={`${title || text}-${index}`} className="flex gap-4"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eee8ff] font-black text-[var(--color-accent-purple)]">{numbered ? index + 1 : "✓"}</span><div className="min-w-0 pt-1">{title ? <h3 className="font-extrabold text-[var(--color-text)]">{title}</h3> : null}<p className={`${title ? "mt-1" : ""} leading-relaxed text-[var(--color-text-muted)]`}>{text}</p></div></li>; })}</ol>; }
