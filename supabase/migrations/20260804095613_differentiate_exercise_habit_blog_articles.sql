-- Differentiates the roles of 4 individually-good but thematically
-- overlapping articles, identified in the 21-article content audit as the
-- "cvičení / návyk / dlouhodobé vydržení / návrat po výpadku" cluster:
--
--   - jak-zacit-cvicit-kdyz-nemas-cas       (first day / first week)
--   - jak-si-vytvorit-navyk-cviceni         (habit mechanism reference)
--   - jak-vydrzet-cvicit-dlouhodobe         (long-term recurring system)
--   - jak-se-vratit-ke-cviceni-po-vypadku   (acute plan after one lapse)
--
-- Touches blog_article_blocks.content for 10 blocks across the 4 articles,
-- plus blog_articles.title for exactly one of them
-- (jak-zacit-cvicit-kdyz-nemas-cas). Every block change is a content-only
-- edit (never a block deletion, never a position change, never a new
-- block): where two ideas needed to become one shorter idea, the existing
-- paragraph slots were kept and simply rewritten to be shorter/lighter, so
-- no block ever ends up empty or duplicated.
--
-- 1. jak-zacit-cvicit-kdyz-nemas-cas:
--    a. title changes from "Jak začít cvičit, když nemáš čas (a vydržet u
--       toho i v náročných týdnech)" to "Jak začít cvičit, když nemáš čas:
--       první kroky pro nabitý týden" - the "a vydržet u toho i v
--       náročných týdnech" clause reached into jak-vydrzet-cvicit-
--       dlouhodobe's own territory (long-term endurance) instead of this
--       article's actual first-day/first-week scope. seo_title (and
--       therefore <title>/OG/Twitter/canonical) is unchanged - it already
--       reads "jednoduchý systém, co vydrží", which is compatible with
--       (not contradicted by) the narrower H1.
--    b. the "pravidlo návratu" section (H2 + 3 paragraphs) taught the
--       exact 30-50% return-after-lapse mechanic that is jak-vydrzet-
--       cvicit-dlouhodobe's own centerpiece - premature for a reader who
--       hasn't started yet. Reworded to "start today, in the smallest
--       version", closing with a real (not plain-text) internal link to
--       jak-se-vratit-ke-cviceni-po-vypadku, which covers an actual lapse
--       precisely and concretely.
--    c. to keep the article at its 2-3 link ceiling after adding that
--       link, the least central of the 3 pre-existing links (to nemam-
--       energii-na-cviceni, attached to an unrelated "low energy day"
--       aside not otherwise touched by this migration) is dropped by
--       reverting that one sentence to its exact pre-internal-linking-
--       migration wording. The other 2 pre-existing links (to
--       jak-si-vytvorit-navyk-cviceni and to proc-se-mi-nechce-cvicit) are
--       untouched.
--    d. the H2 checklist bullet list also had 2 of its 4 items duplicate
--       "long week"/"lapse recovery" themes now homed elsewhere - trimmed
--       to the 2 items that are actually first-week-relevant.
-- 2. jak-si-vytvorit-navyk-cviceni: the perfectionism aside quoted 3
--    near-identical lines to perfekcionismus-jak-se-ho-zbavit's own
--    examples - trimmed to 1, since the existing link already sends
--    readers there for the full treatment.
-- 3. jak-vydrzet-cvicit-dlouhodobe: one sentence reframed to introduce its
--    3 sub-steps as recurring principles ("pokaždé, když k tomu dojde")
--    rather than a one-time checklist, so it reads distinctly from
--    jak-se-vratit-ke-cviceni-po-vypadku's own one-time 3-step plan. No
--    content removed.
-- 4. jak-se-vratit-ke-cviceni-po-vypadku: adds the two things the article
--    was missing for its "acute plan" role - choosing one form of movement,
--    and a short worked example of a first comeback week. Nothing removed.
--
-- Every block update is scoped to one exact blog_article_blocks.id,
-- verifies article_id, block_type and the exact current content (text or
-- items) before writing, and changes only that one JSON key via
-- jsonb_set - position and every other key are untouched. The title
-- update is scoped to one exact blog_articles.id and verifies the exact
-- current title before writing. Idempotent: every WHERE clause requires
-- the OLD value, so re-running after success matches zero rows and changes
-- nothing. A final per-row verification confirms every target ends up with
-- exactly its planned new value, or the whole migration raises and rolls
-- back.
do $$
declare
  mismatched_count integer;
begin

  -- 1a. jak-zacit-cvicit-kdyz-nemas-cas - reword H2 #6 heading
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    '6) Nečekej na pondělí. Začni hned, v nejmenší verzi'::text
  ))
  where id = '0476ee0d-4b3a-4a27-99a7-d4099719b3e2'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'heading'
    and content->>'text' = '6) Nastav si „pravidlo návratu“, aby tě výpadek neodstřelil';

  -- 1b. jak-zacit-cvicit-kdyz-nemas-cas - reword paragraph 1 of 3 under H2 #6
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Jedna z největších pastí je čekat na „ideální moment, kdy začnu pořádně“.'::text
  ))
  where id = 'd3c59048-e7bf-4577-984d-33e3b1e480a0'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'Jedna z největších pastí: „Když už jsem to vynechala, začnu od pondělí.“';

  -- 1c. jak-zacit-cvicit-kdyz-nemas-cas - reword paragraph 2 of 3 under H2 #6
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Ten moment nepřijde. Začni dnes, v té nejmenší verzi, kterou sis právě nastavila.'::text
  ))
  where id = '8b0fe1d5-da78-4601-9ca4-e43ef2592d62'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'Ne. Začni dnes. V té nejmenší verzi.';

  -- 1d. jak-zacit-cvicit-kdyz-nemas-cas - reword paragraph 3 of 3 under H2 #6
  -- (removes the 30-50% mechanic; adds a real internal link to
  -- jak-se-vratit-ke-cviceni-po-vypadku instead of a non-clickable mention)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Když ti jeden den nevyjde, nečekej na další ideální začátek. Vrať se k nejmenší verzi hned při nejbližší příležitosti. A pokud jde o delší výpadek, konkrétní postup najdeš v článku [jak se vrátit ke cvičení po výpadku](/blog/jak-se-vratit-ke-cviceni-po-vypadku).'::text
  ))
  where id = '18dbe6a0-46fd-46b3-b41b-ff3c32a31bdc'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'Pravidlo, které zachrání tvůj návyk: Po výpadku se nevracej na 100 %. Vrať se na 30–50 %. Když se vrátíš na 100 %, často to přepálíš. Když se vrátíš na 30–50 %, udržíš to.';

  -- 1e. jak-zacit-cvicit-kdyz-nemas-cas - drop the link to nemam-energii-
  -- na-cviceni (the least central of the 3 pre-existing links to the
  -- article's newly-clarified first-day role) so the article stays at 3
  -- links total after 1d adds the new one. Reverts this one sentence to
  -- its exact wording from before the internal-linking migration; the rest
  -- of the paragraph, and the other 2 pre-existing links elsewhere in the
  -- article, are untouched.
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz.'::text
  ))
  where id = 'ff05a6a3-7f94-4342-89b2-e7899ea9c359'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz, podobně jako když si nejsi jistá, [jestli je lepší ulevit tělu, nebo se rozhýbat](/blog/nemam-energii-na-cviceni).';

  -- 1f. jak-zacit-cvicit-kdyz-nemas-cas - trim the H2 #8 checklist from 4 to
  -- 2 items (drops the 2 that duplicated "long week" / "lapse recovery",
  -- which now live in jak-vydrzet-cvicit-dlouhodobe / jak-se-vratit-...)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{items}', '["vejde se to do běžného dne", "a máš pocit: „Tohle konečně zvládám.“"]'::jsonb)
  where id = '7c2c2e37-edfc-44c9-bd96-03e5372984b6'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'bullet_list'
    and content->'items' = '["vejde se to do běžného dne", "když přijde náročný týden, nezmizíš na měsíc", "po výpadku se umíš vrátit bez restartu", "a máš pocit: „Tohle konečně zvládám.“"]'::jsonb;

  -- 1g. jak-zacit-cvicit-kdyz-nemas-cas - retitle (H1 source) to drop the
  -- "a vydržet u toho i v náročných týdnech" clause that reached into
  -- jak-vydrzet-cvicit-dlouhodobe's territory. seo_title, seo_description
  -- and canonical_url are untouched.
  update public.blog_articles
  set title = 'Jak začít cvičit, když nemáš čas: první kroky pro nabitý týden'
  where id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and slug = 'jak-zacit-cvicit-kdyz-nemas-cas'
    and title = 'Jak začít cvičit, když nemáš čas (a vydržet u toho i v náročných týdnech)';

  -- 2. jak-si-vytvorit-navyk-cviceni - trim the perfectionism quotes from
  -- 3 to 1 (they near-duplicated perfekcionismus-jak-se-ho-zbavit's own
  -- examples; the existing link one sentence earlier already sends readers
  -- there for the full treatment)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Vypadá to třeba takhle: „Když to nemám na 30 minut, nemá to cenu.“'::text
  ))
  where id = '278ab538-33ff-40c8-afef-afb7b054039d'
    and article_id = '1bf1840f-bab2-4d0d-8a9f-f35b413b03c3'
    and block_type = 'paragraph'
    and content->>'text' = 'Vypadá to třeba takhle: „Když už, tak pořádně.“ „Když to nemám na 30 minut, nemá to cenu.“ „Když jsem vynechala jeden den, je to pryč.“';

  -- 3. jak-vydrzet-cvicit-dlouhodobe - reframe the 3 sub-steps as recurring
  -- principles rather than a one-time checklist, to read distinctly from
  -- jak-se-vratit-ke-cviceni-po-vypadku's own one-time 3-step plan
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Základní chyba je, že máš pocit, že když vypadneš, musíš začít zase „na plno“. Nemusíš. Stačí ti tyhle tři principy, na které se můžeš spolehnout pokaždé, když k tomu dojde:'::text
  ))
  where id = 'db7f0ee4-e84a-4efb-abd1-868808ab3042'
    and article_id = 'dc8f5374-6677-4c59-ac21-2413d1e5116b'
    and block_type = 'paragraph'
    and content->>'text' = 'Základní chyba je, že máš pocit, že když vypadneš, musíš začít zase „na plno“. Nemusíš. Stačí ti tři kroky:';

  -- 4a. jak-se-vratit-ke-cviceni-po-vypadku - add a short worked example of
  -- a first comeback week
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Neplánuj hned celý měsíc. Naplánuj si dva konkrétní dny, kdy uděláš malou verzi. Třeba: pokud jsi dřív cvičila třikrát týdně 30 minut, na první týden ti klidně stačí naplánovat dvě kratší jednotky po 10 až 15 minutách.'::text
  ))
  where id = 'c03e56f6-6584-4f52-9bfe-b2da5ab5af1c'
    and article_id = 'af6ddf51-d62d-4cbc-ad91-ea9987241c9b'
    and block_type = 'paragraph'
    and content->>'text' = 'Neplánuj hned celý měsíc. Naplánuj si dva konkrétní dny, kdy uděláš malou verzi.';

  -- 4b. jak-se-vratit-ke-cviceni-po-vypadku - add "choose one form of
  -- movement" to the "how to pick the right small version" section
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Správná malá verze má dvě vlastnosti: je tak jednoduchá, že ji uděláš i ve dnech, kdy se ti nechce. A zároveň je dost konkrétní, abys věděla, kdy je hotovo. Pomáhá, když si na první týden vybereš jen jednu formu pohybu, třeba chůzi nebo krátké protažení, a nezkoušíš hned kombinovat víc věcí najednou.'::text
  ))
  where id = '54c1b1e6-778f-4bb0-bc28-fe2097c1d4ad'
    and article_id = 'af6ddf51-d62d-4cbc-ad91-ea9987241c9b'
    and block_type = 'paragraph'
    and content->>'text' = 'Správná malá verze má dvě vlastnosti: je tak jednoduchá, že ji uděláš i ve dnech, kdy se ti nechce. A zároveň je dost konkrétní, abys věděla, kdy je hotovo.';

  -- Final per-block verification: every one of the 9 targeted text blocks
  -- must now contain exactly its planned new value - whether this run
  -- just wrote it or a prior run already did.
  select count(*) into mismatched_count
  from (values
    ('0476ee0d-4b3a-4a27-99a7-d4099719b3e2'::uuid,
     '6) Nečekej na pondělí. Začni hned, v nejmenší verzi'::text),
    ('d3c59048-e7bf-4577-984d-33e3b1e480a0'::uuid,
     'Jedna z největších pastí je čekat na „ideální moment, kdy začnu pořádně“.'::text),
    ('8b0fe1d5-da78-4601-9ca4-e43ef2592d62'::uuid,
     'Ten moment nepřijde. Začni dnes, v té nejmenší verzi, kterou sis právě nastavila.'::text),
    ('18dbe6a0-46fd-46b3-b41b-ff3c32a31bdc'::uuid,
     'Když ti jeden den nevyjde, nečekej na další ideální začátek. Vrať se k nejmenší verzi hned při nejbližší příležitosti. A pokud jde o delší výpadek, konkrétní postup najdeš v článku [jak se vrátit ke cvičení po výpadku](/blog/jak-se-vratit-ke-cviceni-po-vypadku).'::text),
    ('ff05a6a3-7f94-4342-89b2-e7899ea9c359'::uuid,
     'A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz.'::text),
    ('278ab538-33ff-40c8-afef-afb7b054039d'::uuid,
     'Vypadá to třeba takhle: „Když to nemám na 30 minut, nemá to cenu.“'::text),
    ('db7f0ee4-e84a-4efb-abd1-868808ab3042'::uuid,
     'Základní chyba je, že máš pocit, že když vypadneš, musíš začít zase „na plno“. Nemusíš. Stačí ti tyhle tři principy, na které se můžeš spolehnout pokaždé, když k tomu dojde:'::text),
    ('c03e56f6-6584-4f52-9bfe-b2da5ab5af1c'::uuid,
     'Neplánuj hned celý měsíc. Naplánuj si dva konkrétní dny, kdy uděláš malou verzi. Třeba: pokud jsi dřív cvičila třikrát týdně 30 minut, na první týden ti klidně stačí naplánovat dvě kratší jednotky po 10 až 15 minutách.'::text),
    ('54c1b1e6-778f-4bb0-bc28-fe2097c1d4ad'::uuid,
     'Správná malá verze má dvě vlastnosti: je tak jednoduchá, že ji uděláš i ve dnech, kdy se ti nechce. A zároveň je dost konkrétní, abys věděla, kdy je hotovo. Pomáhá, když si na první týden vybereš jen jednu formu pohybu, třeba chůzi nebo krátké protažení, a nezkoušíš hned kombinovat víc věcí najednou.'::text)
  ) as expected(id, text)
  left join public.blog_article_blocks b on b.id = expected.id
  where b.id is null or b.content->>'text' is distinct from expected.text;

  if mismatched_count > 0 then
    raise exception 'blog_article_blocks: % text block(s) do not contain their planned new value after migration', mismatched_count;
  end if;

  if not exists (
    select 1 from public.blog_article_blocks
    where id = '7c2c2e37-edfc-44c9-bd96-03e5372984b6'
      and content->'items' = '["vejde se to do běžného dne", "a máš pocit: „Tohle konečně zvládám.“"]'::jsonb
  ) then
    raise exception 'blog_article_blocks: bullet_list 7c2c2e37... does not have the planned new items after migration';
  end if;

  if not exists (
    select 1 from public.blog_articles
    where id = '53feef80-04f3-4d91-a323-4c24a06c22de'
      and title = 'Jak začít cvičit, když nemáš čas: první kroky pro nabitý týden'
  ) then
    raise exception 'blog_articles: jak-zacit-cvicit-kdyz-nemas-cas does not have the planned new title after migration';
  end if;

end $$;
