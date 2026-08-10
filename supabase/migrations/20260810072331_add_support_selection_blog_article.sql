-- Import of 1 new SEO blog article from the Word source document
-- import/blog-articles-2026-08/SEO_clanek_podpora_pri_hubnuti_Fit_bez_casu.docx
-- ('Jakou podporu při hubnutí vybrat?' - a comparison guide for the site's own
-- three support offers: osobní rozbor jídelníčku, 4týdenní podpora, and the
-- upcoming osobní vedení 1:1 program).
--
-- Content notes:
-- - The Word doc's own eyebrow line ('FIT BEZ ČASU • SEO BLOGOVÝ ČLÁNEK') and its
--   internal 'SEO podklady'/'Poznámka pro publikaci' sections are excluded - never
--   part of the public article.
-- - The Word doc contains real embedded hyperlinks to
--   https://web.fitbezcasu.cz/nabidka-podpory[...] inside several body paragraphs.
--   The renderer's parseInternalArticleLinks only turns /blog/{slug} hrefs into real
--   links (see components/blog/ArticleContent.tsx / lib/blog/articles.ts
--   isSafeInternalArticleUrl), so these could not become clickable inline links -
--   they are flattened to plain text (anchor wording kept, hyperlink dropped)
--   instead of leaving broken markdown or a dead link. The single CTA block below
--   (linking to /nabidka-podpory, verified to return HTTP 200 on production) carries
--   that call-to-action instead.
-- - The 'Osobní rozbor, nebo 4týdenní podpora?' comparison table (1 header + 5 data
--   rows) has been converted to a numbered_list (title = need, text = 'Osobní rozbor:
--   .../4týdenní podpora: ...') because the renderer has no 'table' block type -
--   same approved pattern used for the emocni-prejidani table in the previous batch.
-- - 4 internal links were added inside existing paragraph blocks (never as new
--   paragraphs): jak-ziskat-podporu-doma, jidelnicek-na-hubnuti-pro-zeny,
--   proc-nevydrzis, emocni-prejidani - all verified existing published articles, no
--   self-link, no duplicate targets.
--
-- Status workflow (same production trigger rules discovered for the previous
-- 9-article batch): INSERT must create the row as status = 'draft'; the only
-- allowed UPDATE transitions are draft -> ready and ready -> published; moving into
-- ready requires a non-empty excerpt, active category_id, active author_id, at least
-- one non-divider content block, and - unless legacy_migrated = true - a featured
-- image. legacy_migrated = true is used here (approved), the same exception already
-- used by the existing 30 articles, because this article has no dedicated featured
-- image; the site's ArticleImage component already falls back to a category-based
-- generated visual whenever featured_image_path is null.
-- published_at is set explicitly to now() on the ready -> published UPDATE (the real
-- moment this migration is applied) - the trigger only auto-fills it when left null,
-- so setting it explicitly here is within the allowed workflow, not a bypass.
-- updated_at is never set explicitly - the existing blog_articles_set_updated_at
-- trigger manages it on every UPDATE.
--
-- Safety pattern: single atomic do $$ block covering pre-flight checks, the draft
-- INSERT, the block INSERT, both UPDATE transitions, and post-checks - any failure
-- anywhere rolls back the entire migration. No trigger is disabled, altered, or
-- bypassed; no schema or constraint is changed; session_replication_role is never
-- touched.
do $$
declare
  existing_count integer;
  mismatched_count integer;
  found_targets text[];
begin

  -- 1. Pre-flight: category and author rows must exist exactly as expected.
  if not exists (select 1 from public.blog_categories where id = '8e5162e3-28f0-4313-be2f-050bc53de3fa' and slug = 'motivace-a-podpora' and active = true) then
    raise exception 'Precondition failed: category motivace-a-podpora not found or inactive';
  end if;
  if not exists (select 1 from public.blog_authors where id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and author_key = 'fit-bez-casu' and active = true) then
    raise exception 'Precondition failed: author Fit bez casu not found or inactive';
  end if;

  -- 2. Pre-flight: the slug and article id must not already exist.
  select count(*) into existing_count from public.blog_articles where slug = 'podpora-pri-hubnuti-jakou-vybrat';
  if existing_count > 0 then
    raise exception 'Precondition failed: slug already exists - migration already applied or slug collision';
  end if;
  select count(*) into existing_count from public.blog_articles where id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47';
  if existing_count > 0 then
    raise exception 'Precondition failed: article id already exists';
  end if;

  -- 3. Pre-flight: none of the new block ids may already exist.
  select count(*) into existing_count from public.blog_article_blocks where id in ('5ae797bf-9102-50c9-9320-6a29d4c97aec', '1f664ff5-ba8f-53ae-ae0f-f42166730308', '045c6e1d-43c3-574a-b9ae-68613a230d65', '8eb5b41b-2f85-584c-8491-de0ab8ca0910', '6949795f-246d-5a95-a74e-f5a0b8e83c15', 'd8b1553b-39bc-54c8-9d91-46f2dec2348b', '320f5619-d470-58ff-b006-4ef71b6dd4b6', '6fc920b7-36c8-5c84-bcdb-1dce5995e5a8', '5be00afe-b99c-524f-891d-c63adfc2482b', '9a2790ff-6872-5ca9-a34b-7c8ffe0611d3', '93f5b09e-7d39-599e-9fdb-f92a71f08424', 'dc564b7b-f7c3-588b-8120-3951b200d24f', '584f6ad7-ade1-5cf6-919b-261dbe1e65b9', '5c72f02a-ee27-5ba5-b5a9-ac56a0e9fac7', '3337dccd-afa3-5f36-a42a-3cfe349e275e', 'b71ef55d-410c-5ffd-9900-8e3b6e137492', 'b7724bee-2f1f-5b85-b3cc-cd3738d18c9a', '017e123e-3ff0-5096-bd54-ca37bd543757', '77d5551a-eb74-5536-9bed-f5455b308373', '524bd700-6a4d-5d13-b124-c8d635c085b3', '9ec78117-1704-58ba-9131-3ac4a7c8aa69', 'fb6f1077-9d98-59d1-a0df-13d2ba7a9452', '01b19a00-1c6b-5ca5-b319-52fcb09cbbb7', 'f130effe-6c11-51b4-8097-2cb9e9053120', '4c650e0a-4ea0-560e-8663-e330f6553872', '80bae931-a61c-5be4-bfe3-5fc58fa6587e', 'fcff0929-7e3b-5ba0-b1fe-d86fdc43f17a', '646757ea-dfda-5041-868c-f959c00eec29', '936add01-597e-51ac-bf0e-1be6d2683c7a', '758fca7e-614a-5142-bb69-0e986199c824');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist', existing_count;
  end if;

  -- 4. Insert the article as a draft (the only status the INSERT trigger allows).
  insert into public.blog_articles
    (id, title, slug, excerpt, category_id, author_id, status, featured_image_path, featured_image_alt, featured_image_caption, seo_title, seo_description, social_image_path, canonical_url, indexing_enabled, recommended, legacy_migrated, published_at, scheduled_at, archived_at)
  values
    ('a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'Jakou podporu při hubnutí vybrat? Rozbor jídelníčku, 4týdenní konzultace nebo osobní vedení', 'podpora-pri-hubnuti-jakou-vybrat', 'Když se snažíš zhubnout, často není problém v tom, že bys nevěděla vůbec nic o jídle. Mnohem častěji potřebuješ zjistit, co je důležité právě u tebe, kde děláš zbytečně složité změny a kdy má smysl požádat o konkrétní zpětnou vazbu.', '8e5162e3-28f0-4313-be2f-050bc53de3fa', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Podpora při hubnutí: jakou formu vybrat', 'Zjisti rozdíl mezi osobním rozborem jídelníčku, 4týdenní podporou a 3měsíčním osobním vedením a vyber si pomoc, která ti dává smysl.', null, null, false, false, true, null, null, null);

  -- 5. Insert the 30 blog_article_blocks rows, in position order - must happen before
  -- the draft -> ready transition, since the trigger requires at least one
  -- non-divider content block to allow that transition.
  insert into public.blog_article_blocks
    (id, article_id, block_type, position, content, settings)
  values
    ('5ae797bf-9102-50c9-9320-6a29d4c97aec', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 1, '{"text": "Proto jsme ve Fit bez času připravili několik forem podpory, které se liší hlavně tím, v jaké situaci se právě nacházíš. Přehled všech možností najdeš na stránce [Nabídka podpory Fit bez času](/nabidka-podpory). Níže ti vysvětlíme rozdíly, aby sis nemusela vybírat podle názvu služby, ale podle toho, co skutečně potřebuješ."}'::jsonb, '{}'::jsonb),
    ('1f664ff5-ba8f-53ae-ae0f-f42166730308', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 2, '{"text": "Kdy má podpora při hubnutí největší smysl?", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('045c6e1d-43c3-574a-b9ae-68613a230d65', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 3, '{"text": "Podpora není jen pro chvíli, kdy se ti „nedaří“. Často je nejcennější právě tehdy, když se snažíš, ale nevíš, jestli řešíš správné věci. Můžeš mít pocit, že jíš docela dobře, ale přesto tě večer dohání hlad, často přicházejí chutě, energie během dne kolísá nebo se výsledky nehýbou tak, jak sis představovala."}'::jsonb, '{}'::jsonb),
    ('8eb5b41b-2f85-584c-8491-de0ab8ca0910', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 4, '{"text": "V takové situaci může být užitečnější jedna konkrétní zpětná vazba než další desítky obecných tipů z internetu. Důležité je ale vybrat správný typ podpory - ne vždy jde jen o jídelníček, pomoct může i to, [jak získat podporu doma](/blog/jak-ziskat-podporu-doma)."}'::jsonb, '{}'::jsonb),
    ('6949795f-246d-5a95-a74e-f5a0b8e83c15', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 5, '{"text": "1. Osobní rozbor jídelníčku: když chceš zjistit, co konkrétně upravit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d8b1553b-39bc-54c8-9d91-46f2dec2348b', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 6, '{"text": "Osobní rozbor jídelníčku je vhodný ve chvíli, kdy nechceš další obecný návod, ale potřebuješ se podívat na svůj skutečný jídelníček. Základem je 5 běžných dní, které ukážou, jak opravdu jíš v práci, doma, během náročnějších dnů i o víkendu. Pokud si zatím spíš potřebuješ ujasnit obecný směr, může ti nejdřív pomoct [jídelníček na hubnutí pro ženy](/blog/jidelnicek-na-hubnuti-pro-zeny), než přejdeš k osobnímu rozboru toho svého."}'::jsonb, '{}'::jsonb),
    ('320f5619-d470-58ff-b006-4ef71b6dd4b6', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 7, '{"text": "Cílem není hledat chybu v každém soustu ani ti zakazovat jídla, která máš ráda. Rozbor má odlišit důležité věci od drobností, které teď nemusíš řešit. Získáš tak jasnější pohled na to, co už funguje, co tě může brzdit a které změny mají největší smysl udělat jako první."}'::jsonb, '{}'::jsonb),
    ('6fc920b7-36c8-5c84-bcdb-1dce5995e5a8', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'bullet_list', 8, '{"items": ["zhodnocení pěti běžných dní jídelníčku,", "3 věci, které už děláš dobře,", "3 hlavní brzdy, které mohou ovlivňovat hlad, chutě, energii nebo hubnutí,", "3 konkrétní první kroky,", "jednoduchý akční plán na 7 dní,", "přehledný osobní výstup, ke kterému se můžeš vracet."]}'::jsonb, '{}'::jsonb),
    ('5be00afe-b99c-524f-891d-c63adfc2482b', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 9, '{"text": "Tahle varianta dává smysl hlavně tehdy, když si říkáš: „Mám pocit, že se snažím, ale nevím, kde je problém.“ Více informací najdeš na stránce [Osobní rozbor jídelníčku](/nabidka-podpory/osobni-rozbor-jidelnicku)."}'::jsonb, '{}'::jsonb),
    ('9a2790ff-6872-5ca9-a34b-7c8ffe0611d3', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 10, '{"text": "2. 4týdenní podpora: když nechceš všechno řešit sama", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('93f5b09e-7d39-599e-9fdb-f92a71f08424', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 11, '{"text": "Jednorázový rozbor ti může ukázat, co změnit. Jenže běžný život málokdy probíhá podle ideálního plánu. Právě proto je 4týdenní podpora určená pro chvíli, kdy chceš mít během několika týdnů někoho, s kým můžeš průběžně řešit, co se děje."}'::jsonb, '{}'::jsonb),
    ('dc564b7b-f7c3-588b-8120-3951b200d24f', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 12, '{"text": "Každý týden pošleš krátké shrnutí toho, co se dařilo, co bylo náročné a co potřebuješ vyřešit. Dostaneš osobní zpětnou vazbu, konkrétní doporučení a jednu hlavní prioritu pro další týden. Součástí je také možnost průběžně se ptát ve WhatsApp skupině, takže nemusíš s otázkou čekat až do dalšího týdenního shrnutí - to pomáhá i v momentech, kdy tápeš, [proč u plánu nevydržíš](/blog/proc-nevydrzis), a chceš to řešit hned, ne až za týden."}'::jsonb, '{}'::jsonb),
    ('584f6ad7-ade1-5cf6-919b-261dbe1e65b9', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'bullet_list', 13, '{"items": ["4 osobní týdenní zpětné vazby,", "odpovědi na konkrétní otázky z běžného života,", "doporučení upravená podle toho, co se u tebe skutečně děje,", "jednu jasnou prioritu pro další týden,", "možnost upravit směr včas, když něco nefunguje,", "průběžné otázky ve WhatsApp skupině."]}'::jsonb, '{}'::jsonb),
    ('5c72f02a-ee27-5ba5-b5a9-ac56a0e9fac7', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 14, '{"text": "Tahle forma podpory je vhodná, pokud už nechceš každý problém řešit metodou pokus-omyl a oceníš pravidelnou zpětnou vazbu. Podrobnosti najdeš na stránce [4týdenní podpora při hubnutí](/nabidka-podpory/emailova-konzultace)."}'::jsonb, '{}'::jsonb),
    ('3337dccd-afa3-5f36-a42a-3cfe349e275e', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 15, '{"text": "Osobní rozbor, nebo 4týdenní podpora?", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('b71ef55d-410c-5ffd-9900-8e3b6e137492', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 16, '{"text": "Rozdíl je hlavně v tom, co potřebuješ právě teď. Osobní rozbor je jednorázový a pomůže ti zjistit, co ve svém jídelníčku řešit jako první. 4týdenní podpora je průběžná a dává ti prostor reagovat na situace, které přijdou během dalších týdnů."}'::jsonb, '{}'::jsonb),
    ('b7724bee-2f1f-5b85-b3cc-cd3738d18c9a', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'numbered_list', 17, '{"items": [{"title": "Jednorázově zjistit hlavní problém", "text": "Osobní rozbor: Ano. 4týdenní podpora: Spíš ne."}, {"title": "Zhodnotit konkrétní jídelníček", "text": "Osobní rozbor: Ano. 4týdenní podpora: Podle průběžné situace."}, {"title": "Pravidelnou zpětnou vazbu", "text": "Osobní rozbor: Ne. 4týdenní podpora: Ano."}, {"title": "Průběžně pokládat otázky", "text": "Osobní rozbor: Ne. 4týdenní podpora: Ano."}, {"title": "Jasné první kroky", "text": "Osobní rozbor: Ano. 4týdenní podpora: Ano."}]}'::jsonb, '{}'::jsonb),
    ('017e123e-3ff0-5096-bd54-ca37bd543757', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 18, '{"text": "3. Osobní vedení 1:1: připravovaný 3měsíční program", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('77d5551a-eb74-5536-9bed-f5455b308373', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 19, '{"text": "Pro ženy, které budou chtít svou situaci řešit osobněji, dlouhodoběji a s pravidelnou individuální podporou, připravujeme také 3měsíční program osobního vedení 1:1."}'::jsonb, '{}'::jsonb),
    ('524bd700-6a4d-5d13-b124-c8d635c085b3', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 20, '{"text": "Start programu připravujeme od září 2026. Konkrétní podobu programu zatím nechceme slibovat dřív, než bude celý systém spolupráce hotový. Už teď ale víme, že půjde o intenzivnější formu podpory než u ostatních služeb a bude určená ženám, které chtějí svou situaci řešit více do hloubky."}'::jsonb, '{}'::jsonb),
    ('9ec78117-1704-58ba-9131-3ac4a7c8aa69', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'bullet_list', 21, '{"items": ["pravidelnou individuální podporu,", "řešení konkrétní situace více do hloubky,", "prostor průběžně konzultovat další kroky,", "dlouhodobější spolupráci během 3 měsíců,", "podporu přizpůsobenou tomu, co právě řeší."]}'::jsonb, '{}'::jsonb),
    ('fb6f1077-9d98-59d1-a0df-13d2ba7a9452', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 22, '{"text": "Aktuální informace o připravovaném osobním vedení najdeš na hlavní stránce [Nabídka podpory](/nabidka-podpory). Pokud máš o program zájem už teď, můžeš se ozvat na info@fitbezcasu.cz nebo do zprávy na Instagramu @fitbezcasu."}'::jsonb, '{}'::jsonb),
    ('01b19a00-1c6b-5ca5-b319-52fcb09cbbb7', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 23, '{"text": "Jak vybrat podporu, která ti bude dávat smysl?", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f130effe-6c11-51b4-8097-2cb9e9053120', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 24, '{"text": "Nemusíš vybírat podle toho, která služba působí „největší“. Vyber podle svého aktuálního problému, ať už je to konkrétní jídelníček, nebo [emoční přejídání](/blog/emocni-prejidani)."}'::jsonb, '{}'::jsonb),
    ('4c650e0a-4ea0-560e-8663-e330f6553872', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'bullet_list', 25, '{"items": ["Chci zjistit, co konkrétně ve svém jídelníčku změnit → osobní rozbor jídelníčku.", "Chci několik týdnů průběžně řešit svůj postup a otázky → 4týdenní podpora.", "Chci dlouhodobější a intenzivnější individuální spolupráci → připravované osobní vedení 1:1."]}'::jsonb, '{}'::jsonb),
    ('80bae931-a61c-5be4-bfe3-5fc58fa6587e', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 26, '{"text": "Pokud si stále nejsi jistá, začni přehledem na stránce [Nabídka podpory Fit bez času](/nabidka-podpory), kde uvidíš všechny možnosti vedle sebe."}'::jsonb, '{}'::jsonb),
    ('fcff0929-7e3b-5ba0-b1fe-d86fdc43f17a', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'heading', 27, '{"text": "Podpora při hubnutí nemusí znamenat další přísný režim", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('646757ea-dfda-5041-868c-f959c00eec29', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 28, '{"text": "Smyslem podpory není přidat ti další seznam pravidel. Naopak. Měla by ti pomoct poznat, co má smysl řešit, co už funguje a co teď můžeš s klidem nechat být. Když máš jasno v dalších krocích, je mnohem jednodušší přenést změny do běžného života, kde máš práci, rodinu a další povinnosti."}'::jsonb, '{}'::jsonb),
    ('936add01-597e-51ac-bf0e-1be6d2683c7a', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'paragraph', 29, '{"text": "Podívej se na [aktuální nabídku podpory Fit bez času](/nabidka-podpory) a vyber si variantu podle toho, co právě potřebuješ."}'::jsonb, '{}'::jsonb),
    ('758fca7e-614a-5142-bb69-0e986199c824', 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47', 'cta', 30, '{"url": "/nabidka-podpory", "text": "Porovnej osobní rozbor jídelníčku, 4týdenní podporu i připravované osobní vedení 1:1 a vyber formu, která sedí tomu, co právě řešíš.", "title": "Nejsi si jistá, která podpora je pro tebe ta pravá?", "eyebrow": "Nabídka podpory", "new_window": false, "button_label": "Zobrazit nabídku podpory"}'::jsonb, '{}'::jsonb);

  -- 6. Legitimate transition draft -> ready. The trigger now validates excerpt/
  -- category/author/legacy_migrated-image-exception/block presence.
  update public.blog_articles set status = 'ready' where id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47';
  if not exists (select 1 from public.blog_articles where id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and status = 'ready') then
    raise exception 'draft -> ready transition failed';
  end if;

  -- 7. Legitimate transition ready -> published. published_at = now() (this
  -- migration's real application moment); indexing_enabled flipped to true.
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() where id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47';

  -- 8. Post-check: exactly 1 new article, in the expected final state.
  if not exists (select 1 from public.blog_articles where id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and slug = 'podpora-pri-hubnuti-jakou-vybrat' and category_id = '8e5162e3-28f0-4313-be2f-050bc53de3fa' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article does not match expected final state';
  end if;

  -- 9. Post-check: exactly 30 blocks, no duplicate position, first/last block, CTA count.
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47';
  if mismatched_count <> 30 then
    raise exception 'Post-check failed: expected 30 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47';
  if mismatched_count <> 30 then
    raise exception 'Post-check failed: duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '5ae797bf-9102-50c9-9320-6a29d4c97aec' and article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '758fca7e-614a-5142-bb69-0e986199c824' and article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and position = 30 and block_type = 'cta') then
    raise exception 'Post-check failed: last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: expected 1 cta block(s), found %', mismatched_count;
  end if;

  -- 10. Post-check: /blog/{slug} internal links. Every [text](/blog/slug) markdown link
  -- inside a paragraph block's content->>'text' is extracted and checked against the
  -- exact approved target-slug set: no missing target, no unexpected extra link, no
  -- self-link, no duplicate target, no link to the excluded /blog/chut-na-sladke article.
  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and b.block_type = 'paragraph';
  if found_targets <> array['emocni-prejidani', 'jak-ziskat-podporu-doma', 'jidelnicek-na-hubnuti-pro-zeny', 'proc-nevydrzis'] then
    raise exception 'Post-check failed: blog internal links mismatch - expected %, found %', array['emocni-prejidani', 'jak-ziskat-podporu-doma', 'jidelnicek-na-hubnuti-pro-zeny', 'proc-nevydrzis'], found_targets;
  end if;
  if 'podpora-pri-hubnuti-jakou-vybrat' = any(found_targets) then
    raise exception 'Post-check failed: article contains a self-link';
  end if;
  if 'chut-na-sladke' = any(found_targets) then
    raise exception 'Post-check failed: found a link to the excluded /blog/chut-na-sladke article';
  end if;

  -- 11. Post-check: /nabidka-podpory support-offer links. Word intentionally links to
  -- the main overview page multiple times from different paragraphs, so - unlike the
  -- /blog/{slug} rule above - repeats are expected here; the exact per-path occurrence
  -- count is checked instead of a plain distinct-target set.
  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\((/nabidka-podpory[a-z0-9/-]*)\)', 'g') as m
    where b.article_id = 'a1f3c9d2-7e4b-4a6d-9c1e-2b5f8a3d6c47' and b.block_type = 'paragraph';
  if found_targets <> array['/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory/emailova-konzultace', '/nabidka-podpory/osobni-rozbor-jidelnicku'] then
    raise exception 'Post-check failed: support-offer links mismatch - expected %, found %', array['/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory', '/nabidka-podpory/emailova-konzultace', '/nabidka-podpory/osobni-rozbor-jidelnicku'], found_targets;
  end if;

end $$;
