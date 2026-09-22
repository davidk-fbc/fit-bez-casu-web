/**
 * Turns a page's `subtitle` into the paragraphs and emphasis a hero needs.
 *
 * WHY THIS EXISTS
 * ---------------
 * The four-week support hero used to be a hardcoded component, because a
 * subtitle is one plain string and the design needs two things a string
 * cannot carry: several paragraphs, and a few emphasised phrases inside
 * them. So the copy lived in two places - the data and the component - and
 * only the component reached the page. An edit to the data changed nothing,
 * silently, which is exactly what happened: a sentence about the WhatsApp
 * group was added, shipped, tested green, and never appeared.
 *
 * Rather than keep a second copy, the string itself carries the structure:
 *
 *   paragraphs  blank line between them (\n\n), as the data already used
 *   emphasis    **like this**, the one convention everybody already reads
 *
 * That keeps `subtitle` the only source, and keeps this module free of any
 * markdown dependency - two rules are not a markup language.
 */

export type HeroSegment = { text: string; emphasised: boolean };

/** One paragraph, already split into plain and emphasised runs. */
export type HeroParagraph = { segments: HeroSegment[] };

/**
 * Splits a paragraph on `**`. Odd-numbered pieces are the emphasised ones,
 * which is what makes an unclosed `**` harmless: it simply leaves the rest
 * of the paragraph unemphasised rather than swallowing it or throwing.
 */
function toSegments(paragraph: string): HeroSegment[] {
  return paragraph
    .split("**")
    .map((text, index) => ({ text, emphasised: index % 2 === 1 }))
    .filter((segment) => segment.text.length > 0);
}

/**
 * A subtitle as the hero renders it.
 *
 * Blank input yields an empty list rather than a paragraph containing
 * nothing, so a page with no subtitle renders no element at all.
 */
export function parseHeroCopy(subtitle: string | null | undefined): HeroParagraph[] {
  return (subtitle ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph) => ({ segments: toSegments(paragraph) }));
}

/** The paragraph text a reader actually sees, with the markers removed. */
export function heroPlainText(subtitle: string | null | undefined): string[] {
  return parseHeroCopy(subtitle).map((paragraph) => paragraph.segments.map((segment) => segment.text).join(""));
}
