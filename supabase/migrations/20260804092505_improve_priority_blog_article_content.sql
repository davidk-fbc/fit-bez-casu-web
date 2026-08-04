-- Small, content-audit-driven improvements to exactly 4 published articles,
-- identified as the highest quick-win priority in the full 21-article content
-- audit. No other article is touched.
--
-- 1. zdrave-svaciny-do-prace: adds a short, concrete list of example snacks
--    to the one paragraph that already introduces "svačinové jistoty" but
--    never named a single one.
-- 2. jak-jist-zdrave-kdyz-nemas-cas: adds 3 concrete "záchranné jídlo"
--    examples to rule #3, and lightly rewords the existing intro sentence
--    (same paragraph, same pre-existing internal link, no new link) so the
--    difference from co-jist-kdyz-nestiham (rules/decision-making here vs.
--    concrete daily food composition there) is explicit instead of implied.
-- 3. proc-nevydrzis: retitles the article (H1 source) from the scope-vague
--    "Proč nevydržíš" to "Proč nevydržíš u cvičení", aligning it with the
--    seo_title (already "Proč nevydržím cvičit...") and with what the body
--    actually talks about. seo_title/seo_description/canonical are
--    untouched - only blog_articles.title changes.
-- 4. proc-se-mi-nechce-cvicit: adds one concrete follow-up sentence each to
--    reasons #6 and #9, which were noticeably thinner than the other 8
--    reasons in the same listicle.
--
-- Every block update is scoped to one exact blog_article_blocks.id, verifies
-- article_id, block_type and the exact current content->>'text' before
-- writing, and changes only that key via jsonb_set - position and every
-- other content key are untouched. The title update is scoped to one exact
-- blog_articles.id and verifies the exact current title before writing.
-- Idempotent: every WHERE clause requires the OLD value, so re-running this
-- migration after it already succeeded matches zero rows and changes
-- nothing. A final per-row verification confirms every target ends up with
-- exactly its planned new value, or the whole migration raises and rolls
-- back.
do $$
declare
  mismatched_count integer;
begin

  -- 1. zdrave-svaciny-do-prace - concrete snack examples
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Nejjednodušší je mít „svačinové jistoty“. Něco, co se dá vzít do kabelky, hodit do šuplíku v práci a kdykoliv použít. Třeba řecký jogurt nebo skyr s ovocem, tvaroh s ovocem, vejce natvrdo se zeleninou, celozrnné pečivo se sýrem nebo šunkou, hrst ořechů s ovocem, nebo cottage s pečivem a zeleninou.'::text
  ))
  where id = 'bed8e891-1e61-4622-8df0-d157e1ec1642'
    and article_id = '69d6b1b0-5fd0-41c9-a1ce-d774f02b1994'
    and block_type = 'paragraph'
    and content->>'text' = 'Nejjednodušší je mít „svačinové jistoty“. Něco, co se dá vzít do kabelky, hodit do šuplíku v práci a kdykoliv použít.';

  -- 2a. jak-jist-zdrave-kdyz-nemas-cas - concrete "záchranné jídlo" examples
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Záchranné jídlo je takové, které zvládneš dát dohromady rychle, chutná ti a víš, že po něm nebudeš za hodinu lovit něco dalšího. Může to být třeba vejce s pečivem a zeleninou, skyr nebo tvaroh s ovocem, nebo hotová polévka doplněná pečivem a kouskem sýra či šunky.'::text
  ))
  where id = '3411048b-570b-4646-be7b-f3b6149ddde9'
    and article_id = '850dc896-eb75-44e6-9a9b-0941f964459d'
    and block_type = 'paragraph'
    and content->>'text' = 'Záchranné jídlo je takové, které zvládneš dát dohromady rychle, chutná ti a víš, že po něm nebudeš za hodinu lovit něco dalšího.';

  -- 2b. jak-jist-zdrave-kdyz-nemas-cas - clarify the difference from
  -- co-jist-kdyz-nestiham using the same, already-existing internal link
  -- (no new link added, no duplicate)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Tady máš 7 pravidel a způsob rozhodování, který jde držet i ve dnech, kdy nestíháš. Konkrétní skladbu dne a jednotlivé potraviny pak najdeš v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham).'::text
  ))
  where id = 'a8c433dc-858f-41b3-9dab-b272e9f05178'
    and article_id = '850dc896-eb75-44e6-9a9b-0941f964459d'
    and block_type = 'paragraph'
    and content->>'text' = 'Tady máš 7 pravidel, které jsou postavené tak, aby je šlo držet i ve dnech, kdy nestíháš, podobně jako v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham).';

  -- 3. proc-nevydrzis - retitle (H1 source) to match the actual, cvičení-
  -- specific scope of the content and the already-existing seo_title.
  -- seo_title, seo_description and canonical_url are untouched.
  update public.blog_articles
  set title = 'Proč nevydržíš u cvičení: 7 důvodů, které nejsou o disciplíně'
  where id = 'fc5c403b-fd46-46b9-8437-cf5c0190045b'
    and slug = 'proc-nevydrzis'
    and title = 'Proč nevydržíš: 7 důvodů, které nejsou o disciplíně';

  -- 4a. proc-se-mi-nechce-cvicit - reason #6, add a concrete tracking method
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Co s tím: Zaměř se na první výsledky, které přichází dřív než změna postavy: víc energie, lepší nálada, lepší spánek, menší ztuhlost. Klidně si značkuj jen dny, kdy ses hýbala, ne jak vypadáš nebo kolik ukazuje váha. Když začneš tyhle věci sledovat, motivace přestane být tak křehká.'::text
  ))
  where id = '0f43c44b-0ea0-450e-96a4-97602d29e9a7'
    and article_id = 'cf5ef4b4-f805-4a39-adc1-ae851a8c3cd9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Zaměř se na první výsledky, které přichází dřív než změna postavy: víc energie, lepší nálada, lepší spánek, menší ztuhlost. Když začneš tyhle věci sledovat, motivace přestane být tak křehká.';

  -- 4b. proc-se-mi-nechce-cvicit - reason #9, add a concrete safe restart
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Co s tím: Neber to jako důkaz, že to nejde. Ber to jako informaci, co nefunguje. Teď hledáš jiný přístup – takový, který je pro tebe v pohodě a v reálném životě. Klidně zkus jiný typ pohybu než tehdy a začni v mnohem kratší verzi, ať je jasné, že jde o nový pokus, ne o opakování staré zkušenosti.'::text
  ))
  where id = '1af6276e-521c-44ab-8afa-02b89b98e42d'
    and article_id = 'cf5ef4b4-f805-4a39-adc1-ae851a8c3cd9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Neber to jako důkaz, že to nejde. Ber to jako informaci, co nefunguje. Teď hledáš jiný přístup – takový, který je pro tebe v pohodě a v reálném životě.';

  -- Final per-row verification: every one of the 5 targeted rows (4 blocks
  -- + 1 article title) must now contain exactly its planned new value -
  -- whether this run just wrote it or a prior run already did.
  select count(*) into mismatched_count
  from (values
    ('block'::text, 'bed8e891-1e61-4622-8df0-d157e1ec1642'::uuid,
     'Nejjednodušší je mít „svačinové jistoty“. Něco, co se dá vzít do kabelky, hodit do šuplíku v práci a kdykoliv použít. Třeba řecký jogurt nebo skyr s ovocem, tvaroh s ovocem, vejce natvrdo se zeleninou, celozrnné pečivo se sýrem nebo šunkou, hrst ořechů s ovocem, nebo cottage s pečivem a zeleninou.'::text),
    ('block'::text, '3411048b-570b-4646-be7b-f3b6149ddde9'::uuid,
     'Záchranné jídlo je takové, které zvládneš dát dohromady rychle, chutná ti a víš, že po něm nebudeš za hodinu lovit něco dalšího. Může to být třeba vejce s pečivem a zeleninou, skyr nebo tvaroh s ovocem, nebo hotová polévka doplněná pečivem a kouskem sýra či šunky.'::text),
    ('block'::text, 'a8c433dc-858f-41b3-9dab-b272e9f05178'::uuid,
     'Tady máš 7 pravidel a způsob rozhodování, který jde držet i ve dnech, kdy nestíháš. Konkrétní skladbu dne a jednotlivé potraviny pak najdeš v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham).'::text),
    ('block'::text, '0f43c44b-0ea0-450e-96a4-97602d29e9a7'::uuid,
     'Co s tím: Zaměř se na první výsledky, které přichází dřív než změna postavy: víc energie, lepší nálada, lepší spánek, menší ztuhlost. Klidně si značkuj jen dny, kdy ses hýbala, ne jak vypadáš nebo kolik ukazuje váha. Když začneš tyhle věci sledovat, motivace přestane být tak křehká.'::text),
    ('block'::text, '1af6276e-521c-44ab-8afa-02b89b98e42d'::uuid,
     'Co s tím: Neber to jako důkaz, že to nejde. Ber to jako informaci, co nefunguje. Teď hledáš jiný přístup – takový, který je pro tebe v pohodě a v reálném životě. Klidně zkus jiný typ pohybu než tehdy a začni v mnohem kratší verzi, ať je jasné, že jde o nový pokus, ne o opakování staré zkušenosti.'::text)
  ) as expected(kind, id, text)
  left join public.blog_article_blocks b on b.id = expected.id and expected.kind = 'block'
  where b.id is null or b.content->>'text' is distinct from expected.text;

  if mismatched_count > 0 then
    raise exception 'blog_article_blocks: % block(s) do not contain their planned new text after migration', mismatched_count;
  end if;

  if not exists (
    select 1 from public.blog_articles
    where id = 'fc5c403b-fd46-46b9-8437-cf5c0190045b'
      and title = 'Proč nevydržíš u cvičení: 7 důvodů, které nejsou o disciplíně'
  ) then
    raise exception 'blog_articles: proc-nevydrzis does not have the planned new title after migration';
  end if;

end $$;
