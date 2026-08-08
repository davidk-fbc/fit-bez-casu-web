import Image from "next/image";
import Link from "next/link";

import { Button } from "../Button";
import { Container } from "../Container";
import { SectionHeading } from "../SectionHeading";
import { CommunityCta } from "../CommunityCta";
import { DarkSectionGlow } from "../DarkSectionGlow";
import { ShareIcon } from "../icons";
import { ArticleImage } from "./ArticleImage";
import { BlogArticleCard } from "./BlogArticleCard";
import { ShareArticleButton } from "./ShareArticleButton";
import { formatArticleDate, getAuthorProfileUrl, getRelatedArticles, parseInternalArticleLinks, type BlogArticle, type BlogBlock } from "@/lib/blog/articles";
import { EXTERNAL_LINKS } from "@/lib/links";
import { SITE_NAME } from "@/lib/seo";

// "cta" blocks store their own href as free text in the CMS (blog_article_blocks.content.url),
// authored per article - it does not read from lib/links.ts. These three exact legacy product
// URLs are known to still be stored on existing published articles (retired "/p/..." paths that
// now 404); rewriting them here at render time fixes every existing article immediately without
// requiring a content edit in the CMS for each one. Anything else stored in `url` (a URL that
// isn't one of these three) passes through unchanged.
const LEGACY_CTA_URL_MAP: Record<string, string> = {
  "https://www.fitbezcasu.cz/p/komunita-fit-bez-casu": EXTERNAL_LINKS.community,
  "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti": EXTERNAL_LINKS.mealPlan,
  "https://www.fitbezcasu.cz/p/vyzva-na-cviceni": EXTERNAL_LINKS.challenge,
};

export function ArticleContent({ article, preview = false }: { article: BlogArticle; preview?: boolean }) {
  const relatedArticles = getRelatedArticles(article, 3);
  const ctas = article.content.filter((block) => block.type === "cta");
  const content = article.content.filter((block) => block.type !== "cta");
  const authorProfileUrl = article.author ? getAuthorProfileUrl(article.author) : null;
  return (
    <>
      {preview && <div className="bg-amber-300 px-4 py-2 text-center text-sm font-bold text-amber-950">Neveřejný náhled · platnost odkazu je omezená</div>}
      <section className="relative overflow-hidden bg-[var(--color-dark)]"><DarkSectionGlow /><Container className="relative flex flex-col items-center gap-6 py-20 text-center sm:py-24"><Link href={`/blog/${article.categorySlug}`} className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{article.categoryName}</Link><h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">{article.title}</h1><p className="max-w-2xl text-lg leading-relaxed text-[var(--color-text-on-dark-muted)]">{article.excerpt}</p><div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--color-text-on-dark-muted)]"><time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>{article.author && <><span aria-hidden="true">·</span>{authorProfileUrl ? <Link href={authorProfileUrl} className="rounded-sm hover:underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{article.author.displayName}</Link> : <span>{article.author.displayName}</span>}</>}<span aria-hidden="true">·</span><span>{article.readingTime} min čtení</span></div></Container></section>
      <section className="bg-[var(--color-surface)] py-16 sm:py-20"><Container className="mx-auto flex max-w-3xl flex-col gap-10"><figure><ArticleImage article={article} className="aspect-[16/9] w-full rounded-[var(--radius-card)] shadow-[var(--shadow-card)]" sizes="(max-width: 768px) 100vw, 768px" priority />{article.featuredImageCaption && <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)]">{article.featuredImageCaption}</figcaption>}</figure><article className="flex flex-col gap-6"><BlogBlockRenderer blocks={content} /></article>{article.author && <AuthorCard article={article} />}<div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "var(--gradient-brand-diagonal)" }}><ShareIcon className="h-5 w-5" /></div><p className="text-sm leading-relaxed text-[var(--color-text-muted)]">Pošli článek někomu, komu může pomoct</p></div><ShareArticleButton articleTitle={article.title} /></div></Container></section>
      {ctas.map((block) => <section key={block.id} className="bg-[var(--color-surface)] pb-[var(--space-section)]"><CtaBlock block={block} /></section>)}
      {ctas.length === 0 && <section className="bg-[var(--color-surface)] pb-[var(--space-section)]"><CommunityCta /></section>}
      {relatedArticles.length > 0 && <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]"><Container className="flex flex-col gap-12"><SectionHeading eyebrow="Čti dál" title="Související články" /><div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{relatedArticles.map((related) => <BlogArticleCard key={related.slug} article={related} />)}</div></Container></section>}
    </>
  );
}

export function BlogBlockRenderer({ blocks }: { blocks: BlogBlock[] }) {
  return blocks.map((block) => {
    const c = block.content;
    if (block.type === "paragraph") return text(c.text).split(/\n\s*\n/u).filter(Boolean).map((paragraph, index) => <p key={`${block.id}-${index}`} className="whitespace-pre-line text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">{parseInternalArticleLinks(paragraph).map((segment, segIndex) => segment.type === "link" ? <Link key={segIndex} href={segment.href} className="font-semibold text-[var(--color-accent-purple)] underline decoration-2 underline-offset-4 transition hover:text-[var(--color-accent-purple-soft)] focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-purple)]">{segment.label}</Link> : segment.value)}</p>);
    if (block.type === "heading") { const Tag = c.level === "h3" ? "h3" : "h2"; const anchor = safeAnchor(c.anchor); return <Tag key={block.id} id={anchor || undefined} className={Tag === "h2" ? "mt-4 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--color-text)]" : "mt-3 scroll-mt-24 text-xl font-bold tracking-tight text-[var(--color-text)]"}>{text(c.text)}</Tag>; }
    if (block.type === "highlight") return <blockquote key={block.id} className="border-l-4 border-[var(--color-accent-purple)] pl-6 text-lg font-semibold italic leading-relaxed text-[var(--color-text)]">{text(c.text)}</blockquote>;
    if (block.type === "bullet_list") return <ul key={block.id} className="flex list-disc flex-col gap-2 pl-6 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">{strings(c.items).map((item, index) => <li key={index}>{item}</li>)}</ul>;
    if (block.type === "numbered_list") return <ol key={block.id} className="flex flex-col gap-4">{records(c.items).map((item, index) => <li key={index} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-purple)] text-sm font-bold text-white">{index + 1}</span><div>{text(item.title) && <strong className="block text-[var(--color-text)]">{text(item.title)}</strong>}<span>{text(item.text)}</span></div></li>)}</ol>;
    if (block.type === "image") {
      const path = text(c.path);
      const src = imageUrl(path);
      if (!src) return null;
      return (
        <figure key={block.id} className={c.width === "wide" ? "relative left-1/2 w-[min(100vw-2rem,64rem)] -translate-x-1/2" : ""}>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={src} alt={text(c.alt)} fill className="object-cover" sizes={c.width === "wide" ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 768px) 100vw, 768px"} />
          </div>
          {text(c.caption) ? <figcaption className="mt-3 text-center text-sm text-[var(--color-text-muted)]">{text(c.caption)}</figcaption> : null}
        </figure>
      );
    }
    if (block.type === "tip_cards") return <div key={block.id} className="grid gap-5 sm:grid-cols-3">{records(c.cards).map((card, index) => <div key={index} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-6"><h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-text)]"><span aria-hidden="true">{text(card.icon)}</span>{text(card.title)}</h3><p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{text(card.text)}</p></div>)}</div>;
    if (block.type === "info_box") { const variant = c.variant === "warning" ? "border-amber-300 bg-amber-50" : c.variant === "tip" ? "border-violet-200 bg-violet-50" : "border-[var(--color-border-light)] bg-[var(--color-surface-muted)]"; return <aside key={block.id} className={`rounded-[var(--radius-card)] border p-5 text-base leading-relaxed text-[var(--color-text)] sm:text-lg ${variant}`}>{text(c.title) && <h3 className="mb-2 font-bold">{text(c.title)}</h3>}<p className="whitespace-pre-line">{text(c.text)}</p></aside>; }
    if (block.type === "divider") return <hr key={block.id} className="my-2 border-[var(--color-border-light)]" />;
    return null;
  });
}

function CtaBlock({ block }: { block: BlogBlock }) { const c = block.content; const rawHref = safeUrl(c.url); const href = rawHref ? (LEGACY_CTA_URL_MAP[rawHref] ?? rawHref) : rawHref; if (!href) return null; const external = href.startsWith("https://"); return <Container><div className="relative overflow-hidden rounded-[2rem] px-8 py-12 sm:px-12 sm:py-14" style={{ background: "radial-gradient(120% 160% at 100% 0%, #34179a 0%, #150746 55%, #0a0322 100%)" }}><div className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full bg-[var(--color-accent-purple)] opacity-40 blur-3xl" /><div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-col gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent-purple-soft)]">{text(c.eyebrow)}</span><h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{text(c.title)}</h2><p className="max-w-xl text-sm leading-relaxed text-[var(--color-text-on-dark-muted)] sm:text-base">{text(c.text)}</p></div><Button href={href} target={c.new_window === true ? "_blank" : undefined} rel={external || c.new_window === true ? "noopener noreferrer" : undefined} variant="gradient" className="shrink-0 px-7 py-3.5">{text(c.button_label)}</Button></div></div></Container>; }

function AuthorCard({ article }: { article: BlogArticle }) { const author = article.author!; const profileUrl = getAuthorProfileUrl(author); const isBrandAuthor = author.displayName === SITE_NAME; return <aside className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-4"><div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white">{author.avatarPath ? <Image src={author.avatarPath} alt="" fill className="object-cover" sizes="48px" /> : isBrandAuthor ? <Image src="/images/brand/logo-fbc.png" alt="Fit bez času" fill className="object-contain" sizes="48px" /> : <span className="flex h-full items-center justify-center text-base font-bold text-[var(--color-accent-purple)]">{author.displayName.slice(0, 1)}</span>}</div><div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent-purple)]">Autor článku</p><h2 className="text-base font-bold leading-tight text-[var(--color-text)]">{profileUrl ? <Link href={profileUrl} className="rounded-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-purple)]">{author.displayName}</Link> : author.displayName}</h2><p className="text-sm leading-snug text-[var(--color-text-muted)]">{author.bio}</p></div></aside>; }
function text(value: unknown) { return typeof value === "string" ? value : ""; }
function strings(value: unknown) { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }
function records(value: unknown): Record<string, unknown>[] { return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : []; }
function safeAnchor(value: unknown) { const result = text(value); return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result) ? result : ""; }
function safeUrl(value: unknown) { const result = text(value); if (result.startsWith("/") && !result.startsWith("//")) return result; try { return new URL(result).protocol === "https:" ? result : ""; } catch { return ""; } }
function imageUrl(path: string) { if (/^https:\/\//.test(path) || path.startsWith("/")) return path; const base = process.env.BLOG_SUPABASE_URL?.replace(/\/$/, ""); return base && /^blog\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$/.test(path) ? `${base}/storage/v1/object/public/blog-images/${encodeURI(path)}` : ""; }
