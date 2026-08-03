// Server-only renderer for a single schema.org JSON-LD <script> tag.
// Generalises the inline pattern that used to live only in
// app/blog/[identifier]/page.tsx's article branch.
//
// Safe because <script> is an HTML "raw text" element: passing its content
// as a plain string JSX child (never dangerouslySetInnerHTML) means React's
// server renderer does not HTML-entity-escape it, so valid JSON survives
// untouched - this is the same pattern Next.js's own docs use for JSON-LD.
// The one remaining risk is a literal "</script>" sequence inside a string
// VALUE (e.g. CMS-authored article text) closing the tag early;
// `.replace(/</g, "\\u003c")` neutralises that without invalidating the
// JSON, since a JSON string may represent the same character either way.
//
// Accepts one schema object, or an array to render multiple top-level nodes
// in a single script (used for the global Organization + WebSite pair) -
// never render the same node twice across separate calls.
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json">{JSON.stringify(data).replace(/</g, "\\u003c")}</script>;
}
