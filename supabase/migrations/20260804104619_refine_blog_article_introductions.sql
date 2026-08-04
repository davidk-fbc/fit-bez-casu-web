-- Small, targeted edits to the introductory paragraphs (before the first
-- significant H2) of exactly 3 published articles, identified in the
-- full 21-article content audit as having slower-than-ideal intros.
-- No other article, no other block, no heading, no link and no scalar
-- blog_articles column is touched.
--
-- 1. stres-a-prejidani: intro blocks 2-3 (of 4) cut redundant micro-
--    sentences and shorten the craving list and the guilt description to
--    one clear sentence with a single quote, moving the "not weak
--    willpower, it's a stress mechanism" payoff in block 4 measurably
--    closer. Block 1, block 4 and the H2 at position 5 are untouched.
--    Intro word count: 93 -> 78 words (-15).
--
-- 2. perfekcionismus-jak-se-ho-zbavit: block 1 absorbs the one
--    illustrative example worth keeping from block 2 ("jako vysoký
--    standard, na kterém ti záleží"); block 2, now fully redundant, is
--    physically deleted (verified: block_type = 'paragraph', content has
--    only the 'text' key, no internal link, no other table references
--    blog_article_blocks.id, and the app's block renderer/sort is
--    gap-tolerant on position - see comment below the delete statement).
--    Blocks 3, 4 and 6 are each lightly tightened (removed filler words
--    and a redundant lead-in clause) without dropping the motor/brzda
--    pivot, the burn-out-or-postpone mechanism, or the article's promise.
--    Block 5 (which carries the existing internal link to
--    /blog/proc-nevydrzis and the "všechno nebo nic" explanation) and the
--    H2 at position 7 are untouched - verified unchanged at the end.
--    Intro: 6 blocks/138 words -> 5 blocks/109 words (-29 words).
--
-- 3. jak-zvladat-stres-a-byt-mene-unavena: intro block 2 (of 2) gets the
--    same one added bridging sentence as before (why small, usable-
--    during-the-day changes make more sense than one big regime
--    overhaul), now split into two shorter sentences to match the
--    article's short-sentence rhythm - no new content added beyond what
--    was already planned. Block 1 (which carries the existing internal
--    link to /blog/jsem-porad-unavena) is untouched.
--
-- Every update is scoped to one exact blog_article_blocks.id, verifies
-- article_id, block_type = 'paragraph' and the exact current
-- content->>'text' before writing, and changes only that key via
-- jsonb_set - position and every other content key are untouched. The
-- one delete is scoped to one exact id + article_id + block_type + exact
-- current content->>'text' as well.
--
-- Idempotent: every UPDATE's WHERE clause requires the OLD value, so
-- re-running this migration after it already succeeded matches zero
-- rows and changes nothing further; the DELETE's WHERE clause requires
-- the row (and its old text) to still exist, so re-running after it has
-- already been deleted also matches zero rows. Atomic: single do $$
-- block, so any exception rolls back every statement above it. A final
-- per-row verification confirms every target ends up with exactly its
-- planned new value (or, for the deleted row, that it no longer exists),
-- that block 5's untouched text is still exactly what it was, and that
-- no two blocks in the article share a position - or the whole migration
-- raises and rolls back.
do $$
declare
  mismatched_count integer;
  duplicate_position_count integer;
begin

  -- 1a. stres-a-prejidani - merge repeating "Přes den jedeš..." fragments
  -- and lightly shorten the craving list
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Přes den jedeš a držíš se. A pak přijde večer, konečně klid, a najednou máš chuť na sladké nebo na pečivo „jen na chvilku“.'::text
  ))
  where id = '6740c672-2ded-4e85-af4c-1d19d317639a'
    and article_id = '446da827-6929-44aa-9bf1-9cec1c992d61'
    and block_type = 'paragraph'
    and content->>'text' = 'Přes den jedeš. Držíš se. Funguješ. Všechno zvládáš. A pak přijde večer. Konečně klid. A najednou máš chuť na sladké, na pečivo, na něco „jen na chvilku“. A než se naděješ, jíš víc, než jsi chtěla.';

  -- 1b. stres-a-prejidani - collapse the guilt description to one clear
  -- sentence with a single quote (was two near-identical quotes)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'A než se naděješ, jíš víc, než jsi chtěla, a přijde výčitka a restrikce: „Zítra to vykompenzuju.“ A tlak se točí v kruhu.'::text
  ))
  where id = 'e4e25701-7503-4aad-9f84-26d98b0a9f08'
    and article_id = '446da827-6929-44aa-9bf1-9cec1c992d61'
    and block_type = 'paragraph'
    and content->>'text' = 'A pak přijde druhá část: výčitky. A s nimi často i další restrikce. „Zítra budu hodná.“ „Zítra to vykompenzuju.“ A tlak se začne točit v kruhu.';

  -- 2a. perfekcionismus - block 1 absorbs the one illustrative example
  -- worth keeping from block 2
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Perfekcionismus se často tváří jako dobrá vlastnost, jako vysoký standard, na kterém ti záleží.'::text
  ))
  where id = 'e30c07ef-22b6-415a-b49c-0b7cd2c6ece8'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Perfekcionismus se často tváří jako dobrá vlastnost.';

  -- 2b. perfekcionismus - delete block 2, now fully redundant with the
  -- merged block 1. Pre-conditions verified before writing this
  -- migration: block_type = 'paragraph', content has only the 'text' key
  -- (no other JSON key, confirmed via a fresh read of the row), the text
  -- contains no internal link, no table in this codebase has a foreign
  -- key to blog_article_blocks.id, and lib/blog/articles.ts sorts blocks
  -- by position with a plain numeric comparator with no assumption of
  -- contiguous values - a gap at position 2 (leaving 1, 3, 4, 5, 6, 7...)
  -- renders identically to a contiguous sequence. Position values of the
  -- remaining rows are intentionally left untouched (no renumbering) to
  -- keep the migration's write scope minimal - the data model does not
  -- require contiguous positions.
  delete from public.blog_article_blocks
  where id = 'c66aedf9-a212-4457-9681-ad8ba9a3c718'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and position = 2
    and content->>'text' = 'Jako něco, co tě tlačí k výsledkům. Jako „vysoký standard“. Jako to, že ti záleží na kvalitě.';

  -- 2c. perfekcionismus - block 3 keeps the motor/brzda pivot, filler
  -- words removed
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Jenže v reálném životě zaneprázdněné ženy se perfekcionismus chová jinak. Ne jako motor. Spíš jako brzda.'::text
  ))
  where id = '32dfa06b-b83f-400c-b056-bf116bb48643'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Jenže v reálném životě zaneprázdněné ženy se perfekcionismus často chová úplně jinak. Ne jako motor. Spíš jako brzda.';

  -- 2d. perfekcionismus - block 4 keeps the burn-out-or-postpone
  -- mechanism, drops the redundant "stane se jedna z těchto věcí" lead-in
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Protože když máš pocit, že to musí být dokonalé, buď do toho jdeš naplno a rychle se přepálíš, nebo to odložíš, protože nemáš „ideální podmínky“.'::text
  ))
  where id = 'c7c8d9e0-1d93-4e3d-b59d-47dbee8ffc7e'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Protože když máš pocit, že to musí být dokonalé, stane se jedna z těchto věcí: Buď do toho jdeš naplno a rychle se přepálíš, nebo to odložíš, protože „teď na to nemám ideální podmínky“.';

  -- 2e. perfekcionismus - block 6 keeps the article's promise/bridge to
  -- the H2, reworded slightly shorter
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Tenhle článek ti ukáže, jak se z toho dostat: ne silou, ale novým způsobem uvažování, který ti dovolí držet rytmus i v obyčejném týdnu.'::text
  ))
  where id = 'd79aa69a-5a5f-4e49-b9bb-6471079e7d3e'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Tenhle článek ti ukáže, jak se z toho dostat. Ne tím, že se budeš nutit, ale tím, že si nastavíš nový způsob uvažování, který ti dovolí držet rytmus i v obyčejném týdnu.';

  -- 3. jak-zvladat-stres-a-byt-mene-unavena - append the bridging
  -- sentence (split into two shorter sentences for rhythm) explaining why
  -- small, usable-during-the-day changes make more sense than one big
  -- regime overhaul, so the transition into "5 malých změn" is less
  -- abrupt
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb(
    'Tenhle článek je pro tebe, pokud chceš z toho stresového kolotoče vystoupit reálně – bez drastických změn, ale tak, aby ses během dne vracela zpátky k sobě a nepadala večer na hubu. Když jsi vyčerpaná, velký plán na změnu celého režimu je jen další úkol navíc. Proto tu najdeš rovnou pár drobných kroků, které zvládneš i v běžném nabitém dni.'::text
  ))
  where id = '7a704894-b2e3-4420-ba28-e3dc21bedcc1'
    and article_id = 'f76f0c30-ef7d-4d30-9b80-d7a0a2d7e59d'
    and block_type = 'paragraph'
    and content->>'text' = 'Tenhle článek je pro tebe, pokud chceš z toho stresového kolotoče vystoupit reálně – bez drastických změn, ale tak, aby ses během dne vracela zpátky k sobě a nepadala večer na hubu.';

  -- Final per-row verification: every one of the 5 remaining targeted
  -- blocks must now contain exactly its planned new value - whether this
  -- run just wrote it or a prior run already did.
  select count(*) into mismatched_count
  from (values
    ('6740c672-2ded-4e85-af4c-1d19d317639a'::uuid,
     'Přes den jedeš a držíš se. A pak přijde večer, konečně klid, a najednou máš chuť na sladké nebo na pečivo „jen na chvilku“.'::text),
    ('e4e25701-7503-4aad-9f84-26d98b0a9f08'::uuid,
     'A než se naděješ, jíš víc, než jsi chtěla, a přijde výčitka a restrikce: „Zítra to vykompenzuju.“ A tlak se točí v kruhu.'::text),
    ('e30c07ef-22b6-415a-b49c-0b7cd2c6ece8'::uuid,
     'Perfekcionismus se často tváří jako dobrá vlastnost, jako vysoký standard, na kterém ti záleží.'::text),
    ('32dfa06b-b83f-400c-b056-bf116bb48643'::uuid,
     'Jenže v reálném životě zaneprázdněné ženy se perfekcionismus chová jinak. Ne jako motor. Spíš jako brzda.'::text),
    ('c7c8d9e0-1d93-4e3d-b59d-47dbee8ffc7e'::uuid,
     'Protože když máš pocit, že to musí být dokonalé, buď do toho jdeš naplno a rychle se přepálíš, nebo to odložíš, protože nemáš „ideální podmínky“.'::text),
    ('d79aa69a-5a5f-4e49-b9bb-6471079e7d3e'::uuid,
     'Tenhle článek ti ukáže, jak se z toho dostat: ne silou, ale novým způsobem uvažování, který ti dovolí držet rytmus i v obyčejném týdnu.'::text),
    ('7a704894-b2e3-4420-ba28-e3dc21bedcc1'::uuid,
     'Tenhle článek je pro tebe, pokud chceš z toho stresového kolotoče vystoupit reálně – bez drastických změn, ale tak, aby ses během dne vracela zpátky k sobě a nepadala večer na hubu. Když jsi vyčerpaná, velký plán na změnu celého režimu je jen další úkol navíc. Proto tu najdeš rovnou pár drobných kroků, které zvládneš i v běžném nabitém dni.'::text)
  ) as expected(id, text)
  left join public.blog_article_blocks b on b.id = expected.id
  where b.id is null or b.content->>'text' is distinct from expected.text;

  if mismatched_count > 0 then
    raise exception 'blog_article_blocks: % block(s) do not contain their planned new text after migration', mismatched_count;
  end if;

  -- Verify the deleted row is actually gone.
  if exists (select 1 from public.blog_article_blocks where id = 'c66aedf9-a212-4457-9681-ad8ba9a3c718') then
    raise exception 'blog_article_blocks: block c66aedf9-a212-4457-9681-ad8ba9a3c718 still exists after migration, expected it deleted';
  end if;

  -- Verify block 5 (internal link to /blog/proc-nevydrzis, "všechno nebo
  -- nic" explanation) was never touched by this migration.
  if not exists (
    select 1 from public.blog_article_blocks
    where id = '3b534d3e-d92e-46a6-8e74-ba9b956bb13f'
      and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
      and content->>'text' = 'A pak se divíš, že nejsi konzistentní, podobně jako u [dalších důvodů, které nejsou o disciplíně](/blog/proc-nevydrzis). Ne proto, že bys neměla disciplínu, ale protože jedeš v režimu „všechno nebo nic“.'
  ) then
    raise exception 'blog_article_blocks: block 3b534d3e-d92e-46a6-8e74-ba9b956bb13f (internal link block) is missing or was unexpectedly modified';
  end if;

  -- Verify no two blocks of perfekcionismus-jak-se-ho-zbavit share a
  -- position after the delete (no duplicate position was introduced).
  select count(*) into duplicate_position_count
  from (
    select position, count(*) as c
    from public.blog_article_blocks
    where article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    group by position
    having count(*) > 1
  ) dup;

  if duplicate_position_count > 0 then
    raise exception 'blog_article_blocks: % duplicate position value(s) found for perfekcionismus-jak-se-ho-zbavit after migration', duplicate_position_count;
  end if;

end $$;
