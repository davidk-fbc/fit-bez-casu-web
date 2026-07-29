import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Node's built-in TypeScript test runner needs the explicit extension.
// @ts-expect-error TS5097 is intentionally limited to this Node-only test entry.
import { formatArticleDate } from "./articles.ts";

test("formats article dates consistently in Czech", () => {
  assert.equal(formatArticleDate("2026-07-29T12:00:00Z"), "29. července 2026");
});

test("server data layer uses request-time fetching and no privileged key", async () => {
  const source = await readFile(new URL("./articles.ts", import.meta.url), "utf8");
  assert.match(source, /cache:\s*"no-store"/);
  assert.doesNotMatch(source, /service.?role/i);
  assert.match(source, /\^\[a-f0-9\]\{64\}\$/);
});

test("public renderer handles every supported CMS block without raw HTML", async () => {
  const source = await readFile(new URL("../../components/blog/ArticleContent.tsx", import.meta.url), "utf8");
  for (const type of ["paragraph", "heading", "highlight", "bullet_list", "numbered_list", "image", "tip_cards", "info_box", "cta", "divider"]) assert.ok(source.includes(`\"${type}\"`), `missing renderer for ${type}`);
  assert.doesNotMatch(source, /dangerouslySetInnerHTML/);
});
