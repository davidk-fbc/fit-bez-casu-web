import "server-only";

export type OverviewCard = { id: string; variant: "light" | "gradient" | "dark"; eyebrow: string; title: string; description: string; benefitsHeading: string; benefits: string[]; supportingText: string; price: string; priceNote: string; ctaLabel: string; targetSlug: string; active: boolean; sortOrder: number };
export type OverviewContent = { eyebrow: string; afterCards: string; closingTitle: string; closingText: string; finalCta: { active: boolean; label: string; url: string }; cards: OverviewCard[] };
export type PrivatePageDetailItem = string | { title: string; text: string };
export type PrivatePageContact = { text: string; instagramLabel: string; instagramUrl: string; emailLabel: string; emailUrl: string };
export type ServiceDetailContent = { eyebrow: string; preparing: boolean; sections: { audience: boolean; benefits: boolean; process: boolean; inclusions: boolean; price: boolean; cta: boolean }; audienceTitle: string; audience: string[]; benefitsTitle: string; benefits: PrivatePageDetailItem[]; processTitle: string; process: PrivatePageDetailItem[]; inclusionsTitle: string; inclusions: string[]; closingTitle: string; closingText: string; objectionTitle: string; objectionText: string; price: string; priceNote: string; cta: { active: boolean; label: string; salesLinkKey: string }; buttonNote: string; additionalInfo: string; contactText: string; contact: PrivatePageContact | null };
export type RenewalContent = { eyebrow: string; benefitsTitle: string; benefits: string[]; continuityTitle: string; price: string; priceTitle: string; priceNote: string; continuityText: string; cta: { active: boolean; label: string; salesLinkKey: string }; ctaSupportText: string; contactNote: string };
export type PrivatePage = { id: string; slug: string; pageType: "support_overview" | "service_detail" | "service_renewal"; title: string; subtitle: string; featuredImageUrl: string | null; featuredImageAlt: string | null; updatedAt: string; content: OverviewContent | ServiceDetailContent | RenewalContent; salesLinks: Record<string, string> };

type RawPage = { id: unknown; slug: unknown; page_type: unknown; title: unknown; subtitle: unknown; featured_image_path: unknown; featured_image_alt: unknown; updated_at: unknown; content: unknown };
type RawPayload = { page?: RawPage; salesLinks?: unknown };

function env() {
  const url = process.env.BLOG_SUPABASE_URL;
  const key = process.env.BLOG_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Private page data source is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(payload: Record<string, string>): Promise<RawPayload | null> {
  const { url, key } = env();
  const response = await fetch(`${url}/rest/v1/rpc/${"p_token" in payload ? "get_private_page_preview" : "get_public_private_page"}`, { method: "POST", cache: "no-store", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!response.ok) throw new Error("Private page content could not be loaded.");
  return response.json() as Promise<RawPayload | null>;
}

const text = (value: unknown, maximum = 3000) => typeof value === "string" && value.length <= maximum ? value : null;
const bool = (value: unknown) => typeof value === "boolean" ? value : null;
const stringList = (value: unknown, maximum = 12) => Array.isArray(value) && value.length <= maximum && value.every((item) => typeof item === "string" && item.length > 0 && item.length <= 1000) ? value as string[] : null;
const record = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const detailItemList = (value: unknown, maximum = 12): PrivatePageDetailItem[] | null => {
  if (!Array.isArray(value) || value.length > maximum) return null;
  const result: PrivatePageDetailItem[] = [];
  for (const raw of value) {
    if (typeof raw === "string" && raw.length > 0 && raw.length <= 1500) result.push(raw);
    else {
      const item = record(raw); const title = text(item?.title, 300); const itemText = text(item?.text, 1500);
      if (!item || !title || !itemText) return null;
      result.push({ title, text: itemText });
    }
  }
  return result;
};
const safeUrl = (value: string) => value.startsWith("/") && !value.startsWith("//") || (() => { try { return new URL(value).protocol === "https:"; } catch { return false; } })();
const safeContactEmailUrl = (value: string) => /^mailto:[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/iu.test(value);
const safeSlug = (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value);

function contact(value: unknown): PrivatePageContact | null | undefined {
  if (value === undefined) return null;
  const source = record(value); if (!source) return undefined;
  const contactText = text(source.text, 1000), instagramLabel = text(source.instagramLabel, 160), instagramUrl = text(source.instagramUrl, 2000), emailLabel = text(source.emailLabel, 160), emailUrl = text(source.emailUrl, 320);
  if ([contactText, instagramLabel, instagramUrl, emailLabel, emailUrl].some((field) => field === null)) return undefined;
  if (![contactText, instagramLabel, instagramUrl, emailLabel, emailUrl].some(Boolean)) return null;
  if (!contactText || !instagramLabel || !instagramUrl || !emailLabel || !emailUrl || !instagramUrl.startsWith("https://") || !safeUrl(instagramUrl) || !safeContactEmailUrl(emailUrl)) return undefined;
  const instagramAt = contactText.indexOf(instagramLabel), emailAt = contactText.indexOf(emailLabel);
  if (instagramAt < 0 || emailAt < instagramAt + instagramLabel.length) return undefined;
  return { text: contactText, instagramLabel, instagramUrl, emailLabel, emailUrl };
}

function overview(value: unknown): OverviewContent | null {
  const source = record(value); const finalCta = record(source?.finalCta);
  if (!source || !finalCta || !text(source.eyebrow, 120) || bool(finalCta.active) === null || text(finalCta.label, 160) === null || text(finalCta.url, 2000) === null || !Array.isArray(source.cards) || source.cards.length < 1 || source.cards.length > 4) return null;
  const cards: OverviewCard[] = [];
  for (const raw of source.cards) { const card = record(raw); if (!card) return null; const benefits = stringList(card.benefits, 8); const variant = card.variant; const targetSlug = text(card.targetSlug, 240); if (!text(card.id, 120) || !["light", "gradient", "dark"].includes(String(variant)) || !text(card.eyebrow, 120) || !text(card.title, 200) || !text(card.description, 1000) || !text(card.benefitsHeading, 120) || !benefits || benefits.length < 3 || text(card.supportingText, 1500) === null || text(card.price, 100) === null || text(card.priceNote, 300) === null || !text(card.ctaLabel, 160) || !targetSlug || !safeSlug(targetSlug) || bool(card.active) === null || typeof card.sortOrder !== "number") return null; cards.push({ id: card.id as string, variant: variant as OverviewCard["variant"], eyebrow: card.eyebrow as string, title: card.title as string, description: card.description as string, benefitsHeading: card.benefitsHeading as string, benefits, supportingText: card.supportingText as string, price: card.price as string, priceNote: card.priceNote as string, ctaLabel: card.ctaLabel as string, targetSlug, active: card.active as boolean, sortOrder: card.sortOrder }); }
  const finalUrl = finalCta.url as string; if (finalCta.active && (!finalUrl || !safeUrl(finalUrl))) return null;
  return { eyebrow: source.eyebrow as string, afterCards: text(source.afterCards, 2000) ?? "", closingTitle: text(source.closingTitle, 300) ?? "", closingText: text(source.closingText, 3000) ?? "", finalCta: { active: finalCta.active as boolean, label: finalCta.label as string, url: finalUrl }, cards };
}

function detail(value: unknown): ServiceDetailContent | null {
  const source = record(value); const sections = record(source?.sections); const cta = record(source?.cta);
  if (!source || !sections || !cta || !text(source.eyebrow, 120) || bool(source.preparing) === null) return null;
  const audience = stringList(source.audience), benefits = detailItemList(source.benefits), process = detailItemList(source.process, 10), inclusions = stringList(source.inclusions);
  const flags = ["audience", "benefits", "process", "inclusions", "price", "cta"] as const;
  const structuredContact = contact(source.contact);
  if (!audience || !benefits || !benefits.length || !process || !inclusions || structuredContact === undefined || flags.some((key) => bool(sections[key]) === null) || text(source.price, 100) === null || text(source.priceNote, 300) === null || bool(cta.active) === null || text(cta.label, 160) === null || !text(cta.salesLinkKey, 120) || text(source.buttonNote, 700) === null || text(source.additionalInfo, 3000) === null || text(source.contactText, 1000) === null) return null;
  return { eyebrow: source.eyebrow as string, preparing: source.preparing as boolean, sections: Object.fromEntries(flags.map((key) => [key, sections[key]])) as ServiceDetailContent["sections"], audienceTitle: text(source.audienceTitle, 300) ?? "", audience, benefitsTitle: text(source.benefitsTitle, 300) ?? "", benefits, processTitle: text(source.processTitle, 300) ?? "", process, inclusionsTitle: text(source.inclusionsTitle, 300) ?? "", inclusions, closingTitle: text(source.closingTitle, 300) ?? "", closingText: text(source.closingText, 3000) ?? "", objectionTitle: text(source.objectionTitle, 300) ?? "", objectionText: text(source.objectionText, 3000) ?? "", price: source.price as string, priceNote: source.priceNote as string, cta: { active: cta.active as boolean, label: cta.label as string, salesLinkKey: cta.salesLinkKey as string }, buttonNote: source.buttonNote as string, additionalInfo: source.additionalInfo as string, contactText: source.contactText as string, contact: structuredContact };
}

function renewal(value: unknown): RenewalContent | null {
  const source = record(value); const cta = record(source?.cta); const benefits = stringList(source?.benefits);
  if (!source || !cta || !text(source.eyebrow, 120) || !benefits?.length || !text(source.price, 100) || !text(source.priceNote, 300) || !text(source.continuityText, 3000) || bool(cta.active) === null || !text(cta.label, 160) || !text(cta.salesLinkKey, 120) || text(source.contactNote, 1000) === null) return null;
  return { eyebrow: source.eyebrow as string, benefitsTitle: text(source.benefitsTitle, 300) ?? "", benefits, continuityTitle: text(source.continuityTitle, 300) ?? "", price: source.price as string, priceTitle: text(source.priceTitle, 300) ?? "", priceNote: source.priceNote as string, continuityText: source.continuityText as string, cta: { active: cta.active as boolean, label: cta.label as string, salesLinkKey: cta.salesLinkKey as string }, ctaSupportText: text(source.ctaSupportText, 1000) ?? "", contactNote: source.contactNote as string };
}

function mapPayload(payload: RawPayload | null): PrivatePage | null {
  const page = payload?.page; if (!page) return null;
  const id = text(page.id, 100), slug = text(page.slug, 240), title = text(page.title, 300), subtitle = text(page.subtitle, 1500), updatedAt = text(page.updated_at, 100);
  const pageType = page.page_type; if (!id || !slug || !safeSlug(slug) || !title || !subtitle || !updatedAt || !["support_overview", "service_detail", "service_renewal"].includes(String(pageType))) return null;
  const content = pageType === "support_overview" ? overview(page.content) : pageType === "service_detail" ? detail(page.content) : renewal(page.content); if (!content) return null;
  const linksSource = record(payload.salesLinks) ?? {}; const salesLinks: Record<string, string> = {};
  for (const [key, value] of Object.entries(linksSource)) if (typeof value === "string" && safeUrl(value)) salesLinks[key] = value;
  const featuredPath = page.featured_image_path === null ? null : text(page.featured_image_path, 500); const featuredAlt = page.featured_image_alt === null ? null : text(page.featured_image_alt, 500); if (featuredPath === null && page.featured_image_path !== null || featuredAlt === null && page.featured_image_alt !== null) return null;
  const { url } = env();
  return { id, slug, pageType: pageType as PrivatePage["pageType"], title, subtitle, featuredImageUrl: featuredPath ? `${url}/storage/v1/object/public/private-page-images/${encodeURI(featuredPath)}` : null, featuredImageAlt: featuredAlt, updatedAt, content, salesLinks };
}

export async function getPublicPrivatePage(slug: string) { if (!safeSlug(slug)) return null; return mapPayload(await request({ p_slug: slug })); }
export async function getPrivatePagePreview(token: string) { if (!/^[a-f0-9]{64}$/.test(token)) return null; return mapPayload(await request({ p_token: token })); }
