-- Adds 2-3 naturally-worded internal article-to-article links inside
-- existing paragraph blocks of blog_article_blocks.content.text, using the
-- one supported inline syntax: [anchor text](/blog/target-slug). Rendering
-- support for this exact syntax was added to
-- components/blog/ArticleContent.tsx's paragraph branch (via
-- lib/blog/articles.ts's parseInternalArticleLinks/isSafeInternalArticleUrl)
-- in the same change set as this migration - see that commit for the
-- renderer and its tests.
--
-- Every update below is scoped to one exact block.id, verifies the block's
-- current article_id, block_type and content->>'text' match exactly what was
-- audited before writing this migration, and aborts the whole migration (via
-- an exception, which rolls back the implicit transaction) if any of those
-- do not match - so it never silently overwrites content that has changed
-- since the audit. Only content.text is touched via jsonb_set; every other
-- key in the block's content JSON (and the block's position) is left exactly
-- as-is. No CTA, heading, highlight, list, info_box or tip_cards block is
-- touched - only 'paragraph' blocks.
--
-- Idempotent: each update's WHERE clause requires the OLD (pre-link) text, so
-- re-running this migration after it already succeeded matches zero rows and
-- changes nothing - it will not double-insert the link or corrupt the text.
-- If run when only some updates already applied (e.g. a previous partial
-- run), each still-pending block is applied normally and each already-applied
-- block is safely skipped. The final verification below checks, per block id,
-- that its content->>'text' is exactly the planned new text - not just an
-- aggregate count - so it catches any block ending up with the wrong text,
-- not only a wrong total.
do $$
declare
  mismatched_count integer;
begin

  -- 01. nemam-energii-na-cviceni -> jsem-porad-unavena  (block bdca8177-3422-4415-a595-f1d64e7cc696)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tohle všechno bere energii a je to stejná kombinace, která rozhoduje o tom, [co všechno může stát za dlouhodobou únavou](/blog/jsem-porad-unavena). A když si pak řekneš „musím cvičit“, tělo se jen ještě víc stáhne. Proto tenhle článek není o tom, jak se donutíš. Je o tom, jak si vybereš správný krok podle toho, v jakým stavu jsi.'::text))
  where id = 'bdca8177-3422-4415-a595-f1d64e7cc696'
    and article_id = '1a849d85-1bb1-447f-9ebe-552db3fba9c7'
    and block_type = 'paragraph'
    and content->>'text' = 'Tohle všechno bere energii. A když si pak řekneš „musím cvičit“, tělo se jen ještě víc stáhne. Proto tenhle článek není o tom, jak se donutíš. Je o tom, jak si vybereš správný krok podle toho, v jakým stavu jsi.';

  -- 02. nemam-energii-na-cviceni -> jak-zvladat-stres-a-byt-mene-unavena  (block 99c65e88-62de-4b30-a0ba-19f40c15bf5c)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('V tomhle stavu je problém často v tom, že dlouho jedeš bez pauzy, a někdy pomůže i to, [jak si stres v průběhu dne rychleji stáhnout](/blog/jak-zvladat-stres-a-byt-mene-unavena).'::text))
  where id = '99c65e88-62de-4b30-a0ba-19f40c15bf5c'
    and article_id = '1a849d85-1bb1-447f-9ebe-552db3fba9c7'
    and block_type = 'paragraph'
    and content->>'text' = 'V tomhle stavu je problém často v tom, že dlouho jedeš bez pauzy.';

  -- 03. nemam-energii-na-cviceni -> jak-si-vytvorit-navyk-cviceni  (block 21de7257-a8e2-4965-9889-d8cb0aea828b)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tohle je plán, který ti vydrží dlouhodobě, protože není postavený na výkonu. Je postavený na realitě. Až tenhle krok zvládneš, můžeš se podívat na to, [jak z pravidelného pohybu udělat trvalý návyk](/blog/jak-si-vytvorit-navyk-cviceni).'::text))
  where id = '21de7257-a8e2-4965-9889-d8cb0aea828b'
    and article_id = '1a849d85-1bb1-447f-9ebe-552db3fba9c7'
    and block_type = 'paragraph'
    and content->>'text' = 'Tohle je plán, který ti vydrží dlouhodobě, protože není postavený na výkonu. Je postavený na realitě.';

  -- 04. stres-a-prejidani -> jak-zvladat-stres-a-byt-mene-unavena  (block e26c205f-6047-48d0-b743-f5d2bec95d3a)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Nejsilnější změna je, když si místo extrémů nastavíš jednoduché kroky, které stres „oslabí“ dřív, než dojde k přejídání, a částečně pomůže i to, [jak na stres v běžném dni zapracovat i jinak](/blog/jak-zvladat-stres-a-byt-mene-unavena).'::text))
  where id = 'e26c205f-6047-48d0-b743-f5d2bec95d3a'
    and article_id = '446da827-6929-44aa-9bf1-9cec1c992d61'
    and block_type = 'paragraph'
    and content->>'text' = 'Nejsilnější změna je, když si místo extrémů nastavíš jednoduché kroky, které stres „oslabí“ dřív, než dojde k přejídání.';

  -- 05. stres-a-prejidani -> sladke-chute  (block 59cd8f6d-cb84-4ee9-be4d-7efdd669b1e1)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Za druhé, stres zvyšuje chuť na rychlou energii, a to je i jeden z důvodů, [proč se sladké chutě tak vytrvale vrací](/blog/sladke-chute). Sladké a pečivo jsou pro mozek nejrychlejší řešení.'::text))
  where id = '59cd8f6d-cb84-4ee9-be4d-7efdd669b1e1'
    and article_id = '446da827-6929-44aa-9bf1-9cec1c992d61'
    and block_type = 'paragraph'
    and content->>'text' = 'Za druhé, stres zvyšuje chuť na rychlou energii. Sladké a pečivo jsou pro mozek nejrychlejší řešení.';

  -- 06. stres-a-prejidani -> jak-prestat-vecer-vyjidat-lednicku  (block 9fc2100e-87aa-4b20-a471-f0aec9d06779)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Stresové přejídání je často automatika. Vlezeš do kuchyně, otevřeš ledničku a jedeš, podobně jako popisujeme u [večerního vyjídání ledničky](/blog/jak-prestat-vecer-vyjidat-lednicku).'::text))
  where id = '9fc2100e-87aa-4b20-a471-f0aec9d06779'
    and article_id = '446da827-6929-44aa-9bf1-9cec1c992d61'
    and block_type = 'paragraph'
    and content->>'text' = 'Stresové přejídání je často automatika. Vlezeš do kuchyně, otevřeš ledničku a jedeš.';

  -- 07. co-jist-kdyz-nestiham -> jak-jist-zdrave-kdyz-nemas-cas  (block c10fb67d-7e5e-432a-b54a-580d3b58249f)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Proto tenhle článek není o dietách. Je o tom, jak si poskládat den tak, aby sis udržela energii a neměla pocit, že jídlo řešíš pořád dokola, podobně jako v [dalších jednoduchých pravidlech pro jídlo v nabitém dni](/blog/jak-jist-zdrave-kdyz-nemas-cas).'::text))
  where id = 'c10fb67d-7e5e-432a-b54a-580d3b58249f'
    and article_id = '5dcd3255-ca8b-4307-810e-4800f4ed6b05'
    and block_type = 'paragraph'
    and content->>'text' = 'Proto tenhle článek není o dietách. Je o tom, jak si poskládat den tak, aby sis udržela energii a neměla pocit, že jídlo řešíš pořád dokola.';

  -- 08. co-jist-kdyz-nestiham -> zdrave-svaciny-do-prace  (block 84f1eb10-cbd8-4da6-a63e-46fafd68cb6f)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Večer: Večer se často nejí „z hladu“. Večer se jí z kombinace hladu, únavy a stresu. Proto když víš, že nestíháš, je chytrý mít připravenou „záchrannou variantu“, která je rychlá a zároveň tě zasytí, podobně jako když si dopředu naplánuješ [svačiny do práce jako pojistku](/blog/zdrave-svaciny-do-prace).'::text))
  where id = '84f1eb10-cbd8-4da6-a63e-46fafd68cb6f'
    and article_id = '5dcd3255-ca8b-4307-810e-4800f4ed6b05'
    and block_type = 'paragraph'
    and content->>'text' = 'Večer: Večer se často nejí „z hladu“. Večer se jí z kombinace hladu, únavy a stresu. Proto když víš, že nestíháš, je chytrý mít připravenou „záchrannou variantu“, která je rychlá a zároveň tě zasytí.';

  -- 09. jak-se-dokopat-ke-cviceni -> jak-zacit-cvicit-kdyz-nemas-cas  (block c48f7013-b660-4e84-a82b-230148c128c0)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tvůj start může být klidně jen to, že si dáš oblečení, postavíš se a uděláš první minutu. To je všechno. Stejný princip najdeš i v tom, [jak si pohyb reálně nastavit do nabitého týdne](/blog/jak-zacit-cvicit-kdyz-nemas-cas).'::text))
  where id = 'c48f7013-b660-4e84-a82b-230148c128c0'
    and article_id = '6ab33455-10b3-4025-bb74-f7306b57810e'
    and block_type = 'paragraph'
    and content->>'text' = 'Tvůj start může být klidně jen to, že si dáš oblečení, postavíš se a uděláš první minutu. To je všechno.';

  -- 10. jak-se-dokopat-ke-cviceni -> jak-si-vytvorit-navyk-cviceni  (block d2bb43de-6cff-4985-9cfb-9faf73ea2431)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Nečekej na velký výkon, aby to mělo hodnotu. Řekni si: „Udělala jsem to.“ Tím učíš mozek, že tohle je win, a přesně tak se buduje i [dlouhodobý návyk cvičení](/blog/jak-si-vytvorit-navyk-cviceni).'::text))
  where id = 'd2bb43de-6cff-4985-9cfb-9faf73ea2431'
    and article_id = '6ab33455-10b3-4025-bb74-f7306b57810e'
    and block_type = 'paragraph'
    and content->>'text' = 'Nečekej na velký výkon, aby to mělo hodnotu. Řekni si: „Udělala jsem to.“ Tím učíš mozek, že tohle je win. A to je to, co buduje návyk.';

  -- 11. jak-se-dokopat-ke-cviceni -> proc-nevydrzis  (block bdf8cbdd-19c9-4d78-a815-3ead3955b7c8)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Proto je důležitý mít plán i pro ty dny, kdy se ti nechce. Ne jako trest. Jako pojistku. A to je přesně tenhle postup. Pokud se ti tohle opakuje pořád dokola, může pomoct podívat se i na to, [co bývá skutečným důvodem, proč to nevydrží](/blog/proc-nevydrzis).'::text))
  where id = 'bdf8cbdd-19c9-4d78-a815-3ead3955b7c8'
    and article_id = '6ab33455-10b3-4025-bb74-f7306b57810e'
    and block_type = 'paragraph'
    and content->>'text' = 'Proto je důležitý mít plán i pro ty dny, kdy se ti nechce. Ne jako trest. Jako pojistku. A to je přesně tenhle postup.';

  -- 12. jak-si-nastavit-hranice -> jak-prestat-odkladat-sebe  (block d26dc99a-dad0-42d2-9e8a-23d77dd68db6)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Čas pro sebe není odměna. Je to údržba, podobně jako v jednoduchém systému [10 minut jen pro sebe](/blog/jak-prestat-odkladat-sebe) každý den.'::text))
  where id = 'd26dc99a-dad0-42d2-9e8a-23d77dd68db6'
    and article_id = '582b433a-e7f3-4d57-8c6c-c9daff1c3962'
    and block_type = 'paragraph'
    and content->>'text' = 'Čas pro sebe není odměna. Je to údržba.';

  -- 13. jak-si-nastavit-hranice -> jak-ziskat-podporu-doma  (block feada1ef-22fd-4549-80b7-52f6838cc34e)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('To není drzost. To je dospělá dohoda, podobná té, kterou popisujeme u [získávání podpory doma](/blog/jak-ziskat-podporu-doma), když ti okolí úplně nerozumí.'::text))
  where id = 'feada1ef-22fd-4549-80b7-52f6838cc34e'
    and article_id = '582b433a-e7f3-4d57-8c6c-c9daff1c3962'
    and block_type = 'paragraph'
    and content->>'text' = 'To není drzost. To je dospělá dohoda.';

  -- 14. jak-si-nastavit-hranice -> jsem-porad-unavena  (block 5d107dfb-9466-4031-b5c3-81bc64283ceb)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tvoje energie není nekonečná, a pokud ji budeš dlouhodobě rozdávat všem, jednou dojde, podobně jako popisujeme u toho, [co všechno může stát za dlouhodobou únavou](/blog/jsem-porad-unavena). Pak nebudeš mít ani na sebe, ani na ostatní.'::text))
  where id = '5d107dfb-9466-4031-b5c3-81bc64283ceb'
    and article_id = '582b433a-e7f3-4d57-8c6c-c9daff1c3962'
    and block_type = 'paragraph'
    and content->>'text' = 'Tvoje energie není nekonečná. A pokud ji budeš dlouhodobě rozdávat všem, jednou dojde. Pak nebudeš mít ani na sebe, ani na ostatní.';

  -- 15. proc-se-mi-nechce-cvicit -> nemam-energii-na-cviceni  (block 02461032-84c1-40ab-b6f6-b890e61aa7d2)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: V takových dnech si dej cíl „ulevit tělu“, ne „odcvičit“. Stačí krátký začátek a pak se rozhodneš, jestli pokračuješ. Hlavní je nepostavit to jako další zkoušku, a pokud si nejsi jistá, [jestli jsi spíš přetažená, nebo ti chybí rozjezd](/blog/nemam-energii-na-cviceni), pomůže se u toho zastavit podrobněji.'::text))
  where id = '02461032-84c1-40ab-b6f6-b890e61aa7d2'
    and article_id = 'cf5ef4b4-f805-4a39-adc1-ae851a8c3cd9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: V takových dnech si dej cíl „ulevit tělu“, ne „odcvičit“. Stačí krátký začátek a pak se rozhodneš, jestli pokračuješ. Hlavní je nepostavit to jako další zkoušku.';

  -- 16. proc-se-mi-nechce-cvicit -> jak-ziskat-podporu-doma  (block 4c58cb94-f630-4458-a205-657fce0feb96)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: Najdi si prostředí, které tě táhne správným směrem. Někdy stačí vědět, že v tom nejsi sama – a že ostatní řeší stejné věci, podobně jako když si [o podporu řekneš přímo doma](/blog/jak-ziskat-podporu-doma).'::text))
  where id = '4c58cb94-f630-4458-a205-657fce0feb96'
    and article_id = 'cf5ef4b4-f805-4a39-adc1-ae851a8c3cd9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Najdi si prostředí, které tě táhne správným směrem. Někdy stačí vědět, že v tom nejsi sama – a že ostatní řeší stejné věci.';

  -- 17. proc-se-mi-nechce-cvicit -> jak-se-dokopat-ke-cviceni  (block eca5ba04-0a36-4bae-903c-68fab45b82da)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A ještě jedna důležitá věc: Neřeš deset věcí najednou. Najdi jeden důvod, který u tebe hraje prim, a uprav jen ten. I malá změna často otočí celý pocit, stejně jako [konkrétní postup, jak se z odporu dostat do akce](/blog/jak-se-dokopat-ke-cviceni).'::text))
  where id = 'eca5ba04-0a36-4bae-903c-68fab45b82da'
    and article_id = 'cf5ef4b4-f805-4a39-adc1-ae851a8c3cd9'
    and block_type = 'paragraph'
    and content->>'text' = 'A ještě jedna důležitá věc: Neřeš deset věcí najednou. Najdi jeden důvod, který u tebe hraje prim, a uprav jen ten. I malá změna často otočí celý pocit.';

  -- 18. jak-jist-zdrave-kdyz-nemas-cas -> co-jist-kdyz-nestiham  (block a8c433dc-858f-41b3-9dab-b272e9f05178)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tady máš 7 pravidel, které jsou postavené tak, aby je šlo držet i ve dnech, kdy nestíháš, podobně jako v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham).'::text))
  where id = 'a8c433dc-858f-41b3-9dab-b272e9f05178'
    and article_id = '850dc896-eb75-44e6-9a9b-0941f964459d'
    and block_type = 'paragraph'
    and content->>'text' = 'Tady máš 7 pravidel, které jsou postavené tak, aby je šlo držet i ve dnech, kdy nestíháš.';

  -- 19. jak-jist-zdrave-kdyz-nemas-cas -> zdrave-svaciny-do-prace  (block 3eed343c-d761-49bd-958d-1ec6c6554972)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Pojistka může být klidně jen jedno jídlo nebo jedna svačina, která tě opravdu zasytí, podobně jako když si dopředu naplánuješ [svačiny do práce](/blog/zdrave-svaciny-do-prace). Nemusí být dokonalá. Musí být dostupná.'::text))
  where id = '3eed343c-d761-49bd-958d-1ec6c6554972'
    and article_id = '850dc896-eb75-44e6-9a9b-0941f964459d'
    and block_type = 'paragraph'
    and content->>'text' = 'Pojistka může být klidně jen jedno jídlo nebo jedna svačina, která tě opravdu zasytí. Nemusí být dokonalá. Musí být dostupná.';

  -- 20. jak-jist-zdrave-kdyz-nemas-cas -> stres-a-prejidani  (block 71dfd1e4-67b4-420a-b9f9-c5672c947606)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Jenže přísnost ve stresu končí výbuchem, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani). Zdravé jídlo v náročném období má být spíš jednoduché a stabilní než dokonalé.'::text))
  where id = '71dfd1e4-67b4-420a-b9f9-c5672c947606'
    and article_id = '850dc896-eb75-44e6-9a9b-0941f964459d'
    and block_type = 'paragraph'
    and content->>'text' = 'Jenže přísnost ve stresu končí výbuchem. Zdravé jídlo v náročném období má být spíš jednoduché a stabilní než dokonalé.';

  -- 21. vycitky-z-jidla -> perfekcionismus-jak-se-ho-zbavit  (block 218e775d-d15e-493b-b925-895adca759ae)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Jestli máš pocit, že musíš být pořád „perfektní“, výčitky budou vždycky čekat za rohem, podobně jako popisujeme u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit). A to je vyčerpávající.'::text))
  where id = '218e775d-d15e-493b-b925-895adca759ae'
    and article_id = '3427f51f-a2e4-4f95-a5fe-6eaf1b94e374'
    and block_type = 'paragraph'
    and content->>'text' = 'Jestli máš pocit, že musíš být pořád „perfektní“, výčitky budou vždycky čekat za rohem. A to je vyčerpávající.';

  -- 22. vycitky-z-jidla -> jak-vydrzet-cvicit-dlouhodobe  (block 7217b659-0230-4660-ace3-148ff77fd037)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Vynechala jsi cvičení? Dobře. Zítra uděláš malou verzi, stejně jako v [restartu bez restartu u dlouhodobého cvičení](/blog/jak-vydrzet-cvicit-dlouhodobe). Ne trest. Malý krok.'::text))
  where id = '7217b659-0230-4660-ace3-148ff77fd037'
    and article_id = '3427f51f-a2e4-4f95-a5fe-6eaf1b94e374'
    and block_type = 'paragraph'
    and content->>'text' = 'Vynechala jsi cvičení? Dobře. Zítra uděláš malou verzi. Ne trest. Malý krok.';

  -- 23. vycitky-z-jidla -> stres-a-prejidani  (block ed42625a-3651-4c5b-bb54-3f66fa473fd0)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A stres dělá tři věci: zvyšuje chutě, snižuje kapacitu rozhodovat se v klidu a tlačí tě do rychlých řešení, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text))
  where id = 'ed42625a-3651-4c5b-bb54-3f66fa473fd0'
    and article_id = '3427f51f-a2e4-4f95-a5fe-6eaf1b94e374'
    and block_type = 'paragraph'
    and content->>'text' = 'A stres dělá tři věci: zvyšuje chutě, snižuje kapacitu rozhodovat se v klidu a tlačí tě do rychlých řešení.';

  -- 24. jsem-porad-unavena -> nemam-energii-na-cviceni  (block 801a7c95-bce0-44c0-830c-2a97fd65c381)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: nepotřebuješ trénink. Potřebuješ během dne pár krátkých rozhýbání, podobně jako v tom, [kdy pomůže spíš ulevit tělu a kdy se rozhýbat](/blog/nemam-energii-na-cviceni). Tělo se probere a hlava s ním.'::text))
  where id = '801a7c95-bce0-44c0-830c-2a97fd65c381'
    and article_id = 'c4f0c295-3a20-49b5-bfe2-5dc365ef40e9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: nepotřebuješ trénink. Potřebuješ během dne pár krátkých rozhýbání. Tělo se probere a hlava s ním.';

  -- 25. jsem-porad-unavena -> jak-zvladat-stres-a-byt-mene-unavena  (block fd52ddda-2456-4e58-bb40-ce8596ee1b4c)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: pokud je stres dlouhodobý, potřebuješ aspoň jednu krátkou věc, která ti během dne stáhne napětí, podobně jako v [malých změnách proti stresu a únavě](/blog/jak-zvladat-stres-a-byt-mene-unavena). Ne dovolenou. Krátký reset.'::text))
  where id = 'fd52ddda-2456-4e58-bb40-ce8596ee1b4c'
    and article_id = 'c4f0c295-3a20-49b5-bfe2-5dc365ef40e9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: pokud je stres dlouhodobý, potřebuješ aspoň jednu krátkou věc, která ti během dne stáhne napětí. Ne dovolenou. Krátký reset.';

  -- 26. jsem-porad-unavena -> co-jist-kdyz-nestiham  (block dec825fc-0ed6-494e-9595-c05b668da687)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: u jednoho jídla denně si dej cíl, aby tě opravdu zasytí, podobně jako v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham). Jen u jednoho. A sleduj rozdíl.'::text))
  where id = 'dec825fc-0ed6-494e-9595-c05b668da687'
    and article_id = 'c4f0c295-3a20-49b5-bfe2-5dc365ef40e9'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: u jednoho jídla denně si dej cíl, aby tě opravdu zasytí. Jen u jednoho. A sleduj rozdíl.';

  -- 27. perfekcionismus-jak-se-ho-zbavit -> jak-vydrzet-cvicit-dlouhodobe  (block 3b2ae148-87d5-4d06-bd2a-8c892bc7ca99)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tohle je přesně to, co z tebe udělá člověka, který „to drží“, podobně jako popisujeme u [dlouhodobého cvičení bez věčného restartu od pondělí](/blog/jak-vydrzet-cvicit-dlouhodobe). Ne člověka, který pořád začíná.'::text))
  where id = '3b2ae148-87d5-4d06-bd2a-8c892bc7ca99'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Tohle je přesně to, co z tebe udělá člověka, který „to drží“. Ne člověka, který pořád začíná.';

  -- 28. perfekcionismus-jak-se-ho-zbavit -> vycitky-z-jidla  (block e1f0138d-c593-451c-80e8-d8afa2c5c9eb)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Perfekcionismus často vytvoří spirálu: jedno vynechání → výčitka → trest → odpor → výpadek, podobně jako když se řeší [výčitkami z jídla](/blog/vycitky-z-jidla).'::text))
  where id = 'e1f0138d-c593-451c-80e8-d8afa2c5c9eb'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'Perfekcionismus často vytvoří spirálu: jedno vynechání → výčitka → trest → odpor → výpadek.';

  -- 29. perfekcionismus-jak-se-ho-zbavit -> proc-nevydrzis  (block 3b534d3e-d92e-46a6-8e74-ba9b956bb13f)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A pak se divíš, že nejsi konzistentní, podobně jako u [dalších důvodů, které nejsou o disciplíně](/blog/proc-nevydrzis). Ne proto, že bys neměla disciplínu, ale protože jedeš v režimu „všechno nebo nic“.'::text))
  where id = '3b534d3e-d92e-46a6-8e74-ba9b956bb13f'
    and article_id = 'ceb8ed06-99a9-47d3-8e7b-f28ce5004211'
    and block_type = 'paragraph'
    and content->>'text' = 'A pak se divíš, že nejsi konzistentní. Ne proto, že bys neměla disciplínu, ale protože jedeš v režimu „všechno nebo nic“.';

  -- 30. jak-zacit-cvicit-kdyz-nemas-cas -> jak-si-vytvorit-navyk-cviceni  (block 08f1257b-df5d-43ca-950d-04a80e29f0f8)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Smysl toho není v tom, že tím „vysekáš formu“. Smysl je v tom, že si buduješ návyk: já jsem člověk, který se o sebe stará, a přesně to je základ toho, [jak si návyk cvičení postavit natrvalo](/blog/jak-si-vytvorit-navyk-cviceni).'::text))
  where id = '08f1257b-df5d-43ca-950d-04a80e29f0f8'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'Smysl toho není v tom, že tím „vysekáš formu“. Smysl je v tom, že si buduješ návyk: já jsem člověk, který se o sebe stará.';

  -- 31. jak-zacit-cvicit-kdyz-nemas-cas -> proc-se-mi-nechce-cvicit  (block 18a1b92a-1d52-4bc7-9f05-381926b05f6c)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Někdy nejvíc pomůže, když na to nejsi sama. Když chceš, můžeš si svoje malé kroky sdílet i s dalšíma holkama — často právě tohle drží člověka v rytmu, podobně jako popisujeme u toho, [když ti nechybí motivace, ale podpora](/blog/proc-se-mi-nechce-cvicit).'::text))
  where id = '18a1b92a-1d52-4bc7-9f05-381926b05f6c'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'Někdy nejvíc pomůže, když na to nejsi sama. Když chceš, můžeš si svoje malé kroky sdílet i s dalšíma holkama — často právě tohle drží člověka v rytmu.';

  -- 32. jak-zacit-cvicit-kdyz-nemas-cas -> nemam-energii-na-cviceni  (block ff05a6a3-7f94-4342-89b2-e7899ea9c359)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz, podobně jako když si nejsi jistá, [jestli je lepší ulevit tělu, nebo se rozhýbat](/blog/nemam-energii-na-cviceni).'::text))
  where id = 'ff05a6a3-7f94-4342-89b2-e7899ea9c359'
    and article_id = '53feef80-04f3-4d91-a323-4c24a06c22de'
    and block_type = 'paragraph'
    and content->>'text' = 'A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz.';

  -- 33. zdrave-svaciny-do-prace -> jak-jist-zdrave-kdyz-nemas-cas  (block 87c8c5dc-4527-4da5-a688-8c942892dc6d)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Svačina do práce není „něco navíc“. Svačina do práce je pojistka. Je to jednoduchý způsob, jak si udržet energii, klid a hlavně to, aby se ti večer nerozpadl celý den, podobně jako v [dalších pravidlech pro jídlo v nabitém dni](/blog/jak-jist-zdrave-kdyz-nemas-cas).'::text))
  where id = '87c8c5dc-4527-4da5-a688-8c942892dc6d'
    and article_id = '69d6b1b0-5fd0-41c9-a1ce-d774f02b1994'
    and block_type = 'paragraph'
    and content->>'text' = 'Svačina do práce není „něco navíc“. Svačina do práce je pojistka. Je to jednoduchý způsob, jak si udržet energii, klid a hlavně to, aby se ti večer nerozpadl celý den.';

  -- 34. zdrave-svaciny-do-prace -> sladke-chute  (block 85908e60-6e1d-4314-ad63-5bd074705b1b)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A když mu ji nedáš v podobě normálního jídla, vezme si ji v podobě chutí. Sladké, pečivo, něco křupavého, „jen trochu“, podobně jako popisujeme u [sladkých chutí](/blog/sladke-chute). Protože mozek ve vyčerpání chce rychlé řešení.'::text))
  where id = '85908e60-6e1d-4314-ad63-5bd074705b1b'
    and article_id = '69d6b1b0-5fd0-41c9-a1ce-d774f02b1994'
    and block_type = 'paragraph'
    and content->>'text' = 'A když mu ji nedáš v podobě normálního jídla, vezme si ji v podobě chutí. Sladké, pečivo, něco křupavého, „jen trochu“. Protože mozek ve vyčerpání chce rychlé řešení.';

  -- 35. zdrave-svaciny-do-prace -> jak-prestat-vecer-vyjidat-lednicku  (block 2abbc6b0-3819-4f88-9292-ebc04de4ed1e)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Spousta žen si myslí, že problém je večer. Že večer nemají vůli. Že večer [vyjídají ledničku](/blog/jak-prestat-vecer-vyjidat-lednicku) a pak se zlobí samy na sebe.'::text))
  where id = '2abbc6b0-3819-4f88-9292-ebc04de4ed1e'
    and article_id = '69d6b1b0-5fd0-41c9-a1ce-d774f02b1994'
    and block_type = 'paragraph'
    and content->>'text' = 'Spousta žen si myslí, že problém je večer. Že večer nemají vůli. Že večer „vyjí ledničku“ a pak se zlobí samy na sebe.';

  -- 36. sladke-chute -> jak-prestat-vecer-vyjidat-lednicku  (block cd430f25-bb65-4ba5-9b04-252282769ec3)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A večer? Tělo si řekne o energii. A sladké je nejrychlejší, stejně jako když [večer vyjídáš ledničku](/blog/jak-prestat-vecer-vyjidat-lednicku).'::text))
  where id = 'cd430f25-bb65-4ba5-9b04-252282769ec3'
    and article_id = '5e0046ac-2593-4efb-a1c9-d4b53f041bb3'
    and block_type = 'paragraph'
    and content->>'text' = 'A večer? Tělo si řekne o energii. A sladké je nejrychlejší.';

  -- 37. sladke-chute -> stres-a-prejidani  (block e8afd51d-cbab-4985-8f8d-fc5b809e9f22)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Stres v těle vytváří napětí. A sladké je rychlá forma uklidnění, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani). Na chvíli se ti uleví. A proto to mozek chce znovu.'::text))
  where id = 'e8afd51d-cbab-4985-8f8d-fc5b809e9f22'
    and article_id = '5e0046ac-2593-4efb-a1c9-d4b53f041bb3'
    and block_type = 'paragraph'
    and content->>'text' = 'Stres v těle vytváří napětí. A sladké je rychlá forma uklidnění. Na chvíli se ti uleví. A proto to mozek chce znovu.';

  -- 38. sladke-chute -> zdrave-svaciny-do-prace  (block 7373261f-f609-406b-a764-4ec24b8068c8)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: Nemusíš počítat gramy. Jen si u jídla polož jednoduchou otázku: „Mám tady něco, co mě zasytí?“ Když odpověď zní ne, sladké chutě budou častější, podobně jako když nemáš po ruce [dobře vybranou svačinu do práce](/blog/zdrave-svaciny-do-prace).'::text))
  where id = '7373261f-f609-406b-a764-4ec24b8068c8'
    and article_id = '5e0046ac-2593-4efb-a1c9-d4b53f041bb3'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Nemusíš počítat gramy. Jen si u jídla polož jednoduchou otázku: „Mám tady něco, co mě zasytí?“ Když odpověď zní ne, sladké chutě budou častější.';

  -- 39. jak-se-vratit-ke-cviceni-po-vypadku -> jak-vydrzet-cvicit-dlouhodobe  (block 5dc8be00-7e16-4875-9d8d-c5a802647991)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Proto nejdůležitější pravidlo zní: Návrat nesmí bolet. Návrat má být snadný na začátku, stejně jako v [dlouhodobém cvičení bez věčného pondělního restartu](/blog/jak-vydrzet-cvicit-dlouhodobe).'::text))
  where id = '5dc8be00-7e16-4875-9d8d-c5a802647991'
    and article_id = 'af6ddf51-d62d-4cbc-ad91-ea9987241c9b'
    and block_type = 'paragraph'
    and content->>'text' = 'Proto nejdůležitější pravidlo zní: Návrat nesmí bolet. Návrat má být snadný na začátku.';

  -- 40. jak-se-vratit-ke-cviceni-po-vypadku -> proc-nevydrzis  (block d6f13cf1-9f64-4f11-9d5b-babcab17d6cd)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('To je příliš, podobně jako u [dalších důvodů, proč to nevydrží](/blog/proc-nevydrzis). A přetížení je přesně to, co tě dostalo do výpadku.'::text))
  where id = 'd6f13cf1-9f64-4f11-9d5b-babcab17d6cd'
    and article_id = 'af6ddf51-d62d-4cbc-ad91-ea9987241c9b'
    and block_type = 'paragraph'
    and content->>'text' = 'To je příliš. A přetížení je přesně to, co tě dostalo do výpadku.';

  -- 41. jak-se-vratit-ke-cviceni-po-vypadku -> jak-si-vytvorit-navyk-cviceni  (block 9e4ef2ac-8835-4e46-872a-c6f385ac803b)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Protože jakmile uděláš první dva kroky, vrací se důvěra, stejně jako když si postupně buduješ [dlouhodobý návyk cvičení](/blog/jak-si-vytvorit-navyk-cviceni). A s důvěrou přichází chuť pokračovat.'::text))
  where id = '9e4ef2ac-8835-4e46-872a-c6f385ac803b'
    and article_id = 'af6ddf51-d62d-4cbc-ad91-ea9987241c9b'
    and block_type = 'paragraph'
    and content->>'text' = 'Protože jakmile uděláš první dva kroky, vrací se důvěra. A s důvěrou přichází chuť pokračovat.';

  -- 42. jak-si-vytvorit-navyk-cviceni -> jak-zacit-cvicit-kdyz-nemas-cas  (block 062ef45e-785f-4a39-aa05-c66ece572df2)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Hodně lidí si řekne: „Budu cvičit večer.“ A pak přijde večer… a nejsou síly. Proto je lepší vybrat čas, který tě nebude stát poslední zbytky energie, podobně jako popisujeme u [prvního zařazení pohybu do nabitého týdne](/blog/jak-zacit-cvicit-kdyz-nemas-cas).'::text))
  where id = '062ef45e-785f-4a39-aa05-c66ece572df2'
    and article_id = '1bf1840f-bab2-4d0d-8a9f-f35b413b03c3'
    and block_type = 'paragraph'
    and content->>'text' = 'Hodně lidí si řekne: „Budu cvičit večer.“ A pak přijde večer… a nejsou síly. Proto je lepší vybrat čas, který tě nebude stát poslední zbytky energie.';

  -- 43. jak-si-vytvorit-navyk-cviceni -> perfekcionismus-jak-se-ho-zbavit  (block 6298b473-e7c5-4243-9156-e1d561b99631)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Perfekcionismus se často tváří jako snaha o kvalitu. Ve skutečnosti je to past, jak rozebíráme podrobněji u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit).'::text))
  where id = '6298b473-e7c5-4243-9156-e1d561b99631'
    and article_id = '1bf1840f-bab2-4d0d-8a9f-f35b413b03c3'
    and block_type = 'paragraph'
    and content->>'text' = 'Perfekcionismus se často tváří jako snaha o kvalitu. Ve skutečnosti je to past.';

  -- 44. jak-si-vytvorit-navyk-cviceni -> jak-vydrzet-cvicit-dlouhodobe  (block 98719d67-85c5-4d97-97ab-9d105a9426ac)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Poznáš to jednoduše. Ne podle toho, že jedeš každý den skvěle. Ale podle toho, že když přijde náročnější týden, úplně nezmizíš, podobně jako u [dlouhodobého cvičení bez pořád nového pondělí](/blog/jak-vydrzet-cvicit-dlouhodobe).'::text))
  where id = '98719d67-85c5-4d97-97ab-9d105a9426ac'
    and article_id = '1bf1840f-bab2-4d0d-8a9f-f35b413b03c3'
    and block_type = 'paragraph'
    and content->>'text' = 'Poznáš to jednoduše. Ne podle toho, že jedeš každý den skvěle. Ale podle toho, že když přijde náročnější týden, úplně nezmizíš.';

  -- 45. jak-prestat-odkladat-sebe -> jak-si-nastavit-hranice  (block 1522f131-e5fc-404d-9180-ef14578d4bf0)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A přesně proto nebude fungovat rada typu „prostě si udělej čas“. Potřebuješ systém, který nepůjde proti realitě, podobně jako když si [nastavuješ hranice v plném diáři](/blog/jak-si-nastavit-hranice).'::text))
  where id = '1522f131-e5fc-404d-9180-ef14578d4bf0'
    and article_id = '365ffe7b-4912-431c-b008-9b18efd2fff0'
    and block_type = 'paragraph'
    and content->>'text' = 'A přesně proto nebude fungovat rada typu „prostě si udělej čas“. Potřebuješ systém, který nepůjde proti realitě.';

  -- 46. jak-prestat-odkladat-sebe -> jak-ziskat-podporu-doma  (block 0fd9d31a-47b7-436d-854c-74f7c3932335)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A tady pomáhá jedno přerámování: Těch 10 minut není sobeckost. Je to údržba. Je to způsob, jak být míň vyčerpaná. A když jsi míň vyčerpaná, jsi lepší máma, partnerka, člověk, a snáz si pro tenhle čas [získáš podporu i doma](/blog/jak-ziskat-podporu-doma).'::text))
  where id = '0fd9d31a-47b7-436d-854c-74f7c3932335'
    and article_id = '365ffe7b-4912-431c-b008-9b18efd2fff0'
    and block_type = 'paragraph'
    and content->>'text' = 'A tady pomáhá jedno přerámování: Těch 10 minut není sobeckost. Je to údržba. Je to způsob, jak být míň vyčerpaná. A když jsi míň vyčerpaná, jsi lepší máma, partnerka, člověk.';

  -- 47. jak-prestat-odkladat-sebe -> jak-zvladat-stres-a-byt-mene-unavena  (block 4f91be0f-7b6c-44e8-99ea-f2e2acc00bc1)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('A tak ji odkládáš. A čím víc ji odkládáš, tím víc se vyčerpáš, podobně jako popisujeme u [únavy a stresu v běžném dni](/blog/jak-zvladat-stres-a-byt-mene-unavena). A čím víc se vyčerpáš, tím míň máš kapacitu začít. Je to kruh.'::text))
  where id = '4f91be0f-7b6c-44e8-99ea-f2e2acc00bc1'
    and article_id = '365ffe7b-4912-431c-b008-9b18efd2fff0'
    and block_type = 'paragraph'
    and content->>'text' = 'A tak ji odkládáš. A čím víc ji odkládáš, tím víc se vyčerpáš. A čím víc se vyčerpáš, tím míň máš kapacitu začít. Je to kruh.';

  -- 48. proc-nevydrzis -> jak-vydrzet-cvicit-dlouhodobe  (block d7d68c50-12ce-4733-918b-73d15e53eeb6)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Lidi, kteří vydrží dlouhodobě, nejsou nutně „tvrdší“. Mají hlavně nastavený systém tak, aby je podržel i v týdnech, kdy jsou unavení, přetížení nebo se jim prostě nechce, podobně jako popisujeme u [dlouhodobého cvičení bez věčného restartu](/blog/jak-vydrzet-cvicit-dlouhodobe). A přesně o tom je tenhle článek.'::text))
  where id = 'd7d68c50-12ce-4733-918b-73d15e53eeb6'
    and article_id = 'fc5c403b-fd46-46b9-8437-cf5c0190045b'
    and block_type = 'paragraph'
    and content->>'text' = 'Lidi, kteří vydrží dlouhodobě, nejsou nutně „tvrdší“. Mají hlavně nastavený systém tak, aby je podržel i v týdnech, kdy jsou unavení, přetížení nebo se jim prostě nechce. A přesně o tom je tenhle článek.';

  -- 49. proc-nevydrzis -> perfekcionismus-jak-se-ho-zbavit  (block 531d712e-16bf-48c8-9952-3a0979e7d7c6)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Perfekcionismus je tichý zabiják, jak rozebíráme u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit). Když to nejde na sto procent, máš pocit, že to nemá cenu. A pak přijde nula.'::text))
  where id = '531d712e-16bf-48c8-9952-3a0979e7d7c6'
    and article_id = 'fc5c403b-fd46-46b9-8437-cf5c0190045b'
    and block_type = 'paragraph'
    and content->>'text' = 'Perfekcionismus je tichý zabiják. Když to nejde na sto procent, máš pocit, že to nemá cenu. A pak přijde nula.';

  -- 50. proc-nevydrzis -> jak-ziskat-podporu-doma  (block 179f52f4-93b0-470d-8905-d7d90a2d461a)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: Pomáhá mít podporu, podobně jako popisujeme u [podpory doma](/blog/jak-ziskat-podporu-doma). Prostředí, které tě připomene, že i malý krok se počítá. A že výpadek je normální, ne konec.'::text))
  where id = '179f52f4-93b0-470d-8905-d7d90a2d461a'
    and article_id = 'fc5c403b-fd46-46b9-8437-cf5c0190045b'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Pomáhá mít podporu. Prostředí, které tě připomene, že i malý krok se počítá. A že výpadek je normální, ne konec.';

  -- 51. jak-vydrzet-cvicit-dlouhodobe -> jak-se-vratit-ke-cviceni-po-vypadku  (block 5a0200fc-bda4-49c3-92dd-a33952fdfbcd)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Cíl návratu není výkon. Cíl návratu je znovu se rozjet, podobně jako rozebíráme u [návratu ke cvičení po výpadku](/blog/jak-se-vratit-ke-cviceni-po-vypadku).'::text))
  where id = '5a0200fc-bda4-49c3-92dd-a33952fdfbcd'
    and article_id = 'dc8f5374-6677-4c59-ac21-2413d1e5116b'
    and block_type = 'paragraph'
    and content->>'text' = 'Cíl návratu není výkon. Cíl návratu je znovu se rozjet.';

  -- 52. jak-vydrzet-cvicit-dlouhodobe -> perfekcionismus-jak-se-ho-zbavit  (block 86d5a6a6-4089-4e83-8252-b5b0aa5197aa)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tady je to nejčastější, co lidi zničí: Vynechají pár dní a pak se snaží „dohnat to“. Dají si velký plán, velký výkon, velký tlak, podobně jako u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit).'::text))
  where id = '86d5a6a6-4089-4e83-8252-b5b0aa5197aa'
    and article_id = 'dc8f5374-6677-4c59-ac21-2413d1e5116b'
    and block_type = 'paragraph'
    and content->>'text' = 'Tady je to nejčastější, co lidi zničí: Vynechají pár dní a pak se snaží „dohnat to“. Dají si velký plán, velký výkon, velký tlak.';

  -- 53. jak-vydrzet-cvicit-dlouhodobe -> vycitky-z-jidla  (block 810bb5be-3136-4c9e-ba44-68676be1cde0)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Výčitky jsou často horší než samotné vynechání, podobně jako popisujeme u [výčitek z jídla](/blog/vycitky-z-jidla). Berou energii, motivaci i chuť začít.'::text))
  where id = '810bb5be-3136-4c9e-ba44-68676be1cde0'
    and article_id = 'dc8f5374-6677-4c59-ac21-2413d1e5116b'
    and block_type = 'paragraph'
    and content->>'text' = 'Výčitky jsou často horší než samotné vynechání. Berou energii, motivaci i chuť začít.';

  -- 54. jak-prestat-vecer-vyjidat-lednicku -> stres-a-prejidani  (block 4f7be4b9-877d-4590-84fc-abd97ae65565)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Proto lidé často vyjí „večer“. Když je konečně klid a tělo pustí napětí, mozek hledá způsob, jak se zklidnit, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text))
  where id = '4f7be4b9-877d-4590-84fc-abd97ae65565'
    and article_id = '6654c0d7-508f-4e30-81c9-137983166bde'
    and block_type = 'paragraph'
    and content->>'text' = 'Proto lidé často vyjí „večer“. Když je konečně klid a tělo pustí napětí, mozek hledá způsob, jak se zklidnit.';

  -- 55. jak-prestat-vecer-vyjidat-lednicku -> zdrave-svaciny-do-prace  (block 24282fe8-d486-480f-afeb-f9b963693380)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Co s tím: Nepotřebuješ dokonalý jídelníček. Potřebuješ jednu pojistku, třeba i v podobě [svačiny do práce](/blog/zdrave-svaciny-do-prace). Něco, co tě přes den zasytí, aby večer nebyl „útok“.'::text))
  where id = '24282fe8-d486-480f-afeb-f9b963693380'
    and article_id = '6654c0d7-508f-4e30-81c9-137983166bde'
    and block_type = 'paragraph'
    and content->>'text' = 'Co s tím: Nepotřebuješ dokonalý jídelníček. Potřebuješ jednu pojistku. Něco, co tě přes den zasytí, aby večer nebyl „útok“.';

  -- 56. jak-prestat-vecer-vyjidat-lednicku -> sladke-chute  (block 5da20ff6-f5ee-420d-bd89-28d8c26e0c5d)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Když jsi nevyspaná, tělo chce rychlou energii. A hádej, co je nejrychlejší. Sladké, pečivo, něco křupavého, něco „na chuť“, podobně jako rozebíráme u [sladkých chutí](/blog/sladke-chute).'::text))
  where id = '5da20ff6-f5ee-420d-bd89-28d8c26e0c5d'
    and article_id = '6654c0d7-508f-4e30-81c9-137983166bde'
    and block_type = 'paragraph'
    and content->>'text' = 'Když jsi nevyspaná, tělo chce rychlou energii. A hádej, co je nejrychlejší. Sladké, pečivo, něco křupavého, něco „na chuť“.';

  -- 57. jak-ziskat-podporu-doma -> jak-si-nastavit-hranice  (block 96cf5235-fb7f-4af8-8ee4-43d81dc2043b)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tady je důležité udělat jednu věc: [nastavit hranici](/blog/jak-si-nastavit-hranice).'::text))
  where id = '96cf5235-fb7f-4af8-8ee4-43d81dc2043b'
    and article_id = 'e427f7a8-e40d-4fdc-8110-7fd34fc6b127'
    and block_type = 'paragraph'
    and content->>'text' = 'Tady je důležité udělat jednu věc: nastavit hranici.';

  -- 58. jak-ziskat-podporu-doma -> proc-se-mi-nechce-cvicit  (block 93f111dd-2dbc-4263-a020-6a9d29f722e6)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Ty se konečně rozhodneš, že se o sebe začneš starat. Ne „až bude klid“. Teď. Chceš víc energie, lepší pocit v těle, víc klidu v hlavě, třeba i chuť [znovu se pohnout, i když se ti nechce](/blog/proc-se-mi-nechce-cvicit).'::text))
  where id = '93f111dd-2dbc-4263-a020-6a9d29f722e6'
    and article_id = 'e427f7a8-e40d-4fdc-8110-7fd34fc6b127'
    and block_type = 'paragraph'
    and content->>'text' = 'Ty se konečně rozhodneš, že se o sebe začneš starat. Ne „až bude klid“. Teď. Chceš víc energie, lepší pocit v těle, víc klidu v hlavě.';

  -- 59. jak-ziskat-podporu-doma -> jak-prestat-odkladat-sebe  (block 2f6d1380-2288-4d5b-bd91-34c93bb053fb)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Zkus si to přerámovat: těch 20 minut není luxus. Je to údržba, podobně jako v [systému 10 minut jen pro sebe](/blog/jak-prestat-odkladat-sebe). Je to prevence. Aby ses nezlomila.'::text))
  where id = '2f6d1380-2288-4d5b-bd91-34c93bb053fb'
    and article_id = 'e427f7a8-e40d-4fdc-8110-7fd34fc6b127'
    and block_type = 'paragraph'
    and content->>'text' = 'Zkus si to přerámovat: těch 20 minut není luxus. Je to údržba. Je to prevence. Aby ses nezlomila.';

  -- 60. jak-zvladat-stres-a-byt-mene-unavena -> stres-a-prejidani  (block 4446f45f-47bd-4a86-88f0-7453bbb2fbf9)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Večer často nepřichází „lenost“. Přichází účet za celý den, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text))
  where id = '4446f45f-47bd-4a86-88f0-7453bbb2fbf9'
    and article_id = 'f76f0c30-ef7d-4d30-9b80-d7a0a2d7e59d'
    and block_type = 'paragraph'
    and content->>'text' = 'Večer často nepřichází „lenost“. Přichází účet za celý den.';

  -- 61. jak-zvladat-stres-a-byt-mene-unavena -> jsem-porad-unavena  (block 7ebd2929-af2f-48fb-8fa1-e932c99ba611)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Dny, kdy nestíháš, střídají večery, kdy už nemáš sílu vůbec na nic. A když máš pocit, že jedeš „na výpary“ a [jsi pořád unavená](/blog/jsem-porad-unavena), nejsi v tom sama.'::text))
  where id = '7ebd2929-af2f-48fb-8fa1-e932c99ba611'
    and article_id = 'f76f0c30-ef7d-4d30-9b80-d7a0a2d7e59d'
    and block_type = 'paragraph'
    and content->>'text' = 'Dny, kdy nestíháš, střídají večery, kdy už nemáš sílu vůbec na nic. A když máš pocit, že jedeš „na výpary“, nejsi v tom sama.';

  -- 62. jak-zvladat-stres-a-byt-mene-unavena -> nemam-energii-na-cviceni  (block 3c2c6869-3d36-4508-ad74-d9fc96daeb71)
  update public.blog_article_blocks
  set content = jsonb_set(content, '{text}', to_jsonb('Tahle pauza není „ztráta času“. Je to způsob, jak si koupit energii zpátky, podobně jako když si nejsi jistá, [jestli ti pomůže spíš ulevit tělu, nebo se rozhýbat](/blog/nemam-energii-na-cviceni).'::text))
  where id = '3c2c6869-3d36-4508-ad74-d9fc96daeb71'
    and article_id = 'f76f0c30-ef7d-4d30-9b80-d7a0a2d7e59d'
    and block_type = 'paragraph'
    and content->>'text' = 'Tahle pauza není „ztráta času“. Je to způsob, jak si koupit energii zpátky.';

  -- Final per-block verification: every one of the 62 target blocks must
  -- now contain exactly its own planned new text - whether this run just
  -- wrote it or a prior run already did. Using a VALUES list joined by id
  -- (rather than an aggregate count/IN check) means a block ending up with
  -- a different block's text would still be caught, not just a wrong total.
  select count(*) into mismatched_count
  from (values
    ('bdca8177-3422-4415-a595-f1d64e7cc696'::uuid, 'Tohle všechno bere energii a je to stejná kombinace, která rozhoduje o tom, [co všechno může stát za dlouhodobou únavou](/blog/jsem-porad-unavena). A když si pak řekneš „musím cvičit“, tělo se jen ještě víc stáhne. Proto tenhle článek není o tom, jak se donutíš. Je o tom, jak si vybereš správný krok podle toho, v jakým stavu jsi.'::text),
    ('99c65e88-62de-4b30-a0ba-19f40c15bf5c'::uuid, 'V tomhle stavu je problém často v tom, že dlouho jedeš bez pauzy, a někdy pomůže i to, [jak si stres v průběhu dne rychleji stáhnout](/blog/jak-zvladat-stres-a-byt-mene-unavena).'::text),
    ('21de7257-a8e2-4965-9889-d8cb0aea828b'::uuid, 'Tohle je plán, který ti vydrží dlouhodobě, protože není postavený na výkonu. Je postavený na realitě. Až tenhle krok zvládneš, můžeš se podívat na to, [jak z pravidelného pohybu udělat trvalý návyk](/blog/jak-si-vytvorit-navyk-cviceni).'::text),
    ('e26c205f-6047-48d0-b743-f5d2bec95d3a'::uuid, 'Nejsilnější změna je, když si místo extrémů nastavíš jednoduché kroky, které stres „oslabí“ dřív, než dojde k přejídání, a částečně pomůže i to, [jak na stres v běžném dni zapracovat i jinak](/blog/jak-zvladat-stres-a-byt-mene-unavena).'::text),
    ('59cd8f6d-cb84-4ee9-be4d-7efdd669b1e1'::uuid, 'Za druhé, stres zvyšuje chuť na rychlou energii, a to je i jeden z důvodů, [proč se sladké chutě tak vytrvale vrací](/blog/sladke-chute). Sladké a pečivo jsou pro mozek nejrychlejší řešení.'::text),
    ('9fc2100e-87aa-4b20-a471-f0aec9d06779'::uuid, 'Stresové přejídání je často automatika. Vlezeš do kuchyně, otevřeš ledničku a jedeš, podobně jako popisujeme u [večerního vyjídání ledničky](/blog/jak-prestat-vecer-vyjidat-lednicku).'::text),
    ('c10fb67d-7e5e-432a-b54a-580d3b58249f'::uuid, 'Proto tenhle článek není o dietách. Je o tom, jak si poskládat den tak, aby sis udržela energii a neměla pocit, že jídlo řešíš pořád dokola, podobně jako v [dalších jednoduchých pravidlech pro jídlo v nabitém dni](/blog/jak-jist-zdrave-kdyz-nemas-cas).'::text),
    ('84f1eb10-cbd8-4da6-a63e-46fafd68cb6f'::uuid, 'Večer: Večer se často nejí „z hladu“. Večer se jí z kombinace hladu, únavy a stresu. Proto když víš, že nestíháš, je chytrý mít připravenou „záchrannou variantu“, která je rychlá a zároveň tě zasytí, podobně jako když si dopředu naplánuješ [svačiny do práce jako pojistku](/blog/zdrave-svaciny-do-prace).'::text),
    ('c48f7013-b660-4e84-a82b-230148c128c0'::uuid, 'Tvůj start může být klidně jen to, že si dáš oblečení, postavíš se a uděláš první minutu. To je všechno. Stejný princip najdeš i v tom, [jak si pohyb reálně nastavit do nabitého týdne](/blog/jak-zacit-cvicit-kdyz-nemas-cas).'::text),
    ('d2bb43de-6cff-4985-9cfb-9faf73ea2431'::uuid, 'Nečekej na velký výkon, aby to mělo hodnotu. Řekni si: „Udělala jsem to.“ Tím učíš mozek, že tohle je win, a přesně tak se buduje i [dlouhodobý návyk cvičení](/blog/jak-si-vytvorit-navyk-cviceni).'::text),
    ('bdf8cbdd-19c9-4d78-a815-3ead3955b7c8'::uuid, 'Proto je důležitý mít plán i pro ty dny, kdy se ti nechce. Ne jako trest. Jako pojistku. A to je přesně tenhle postup. Pokud se ti tohle opakuje pořád dokola, může pomoct podívat se i na to, [co bývá skutečným důvodem, proč to nevydrží](/blog/proc-nevydrzis).'::text),
    ('d26dc99a-dad0-42d2-9e8a-23d77dd68db6'::uuid, 'Čas pro sebe není odměna. Je to údržba, podobně jako v jednoduchém systému [10 minut jen pro sebe](/blog/jak-prestat-odkladat-sebe) každý den.'::text),
    ('feada1ef-22fd-4549-80b7-52f6838cc34e'::uuid, 'To není drzost. To je dospělá dohoda, podobná té, kterou popisujeme u [získávání podpory doma](/blog/jak-ziskat-podporu-doma), když ti okolí úplně nerozumí.'::text),
    ('5d107dfb-9466-4031-b5c3-81bc64283ceb'::uuid, 'Tvoje energie není nekonečná, a pokud ji budeš dlouhodobě rozdávat všem, jednou dojde, podobně jako popisujeme u toho, [co všechno může stát za dlouhodobou únavou](/blog/jsem-porad-unavena). Pak nebudeš mít ani na sebe, ani na ostatní.'::text),
    ('02461032-84c1-40ab-b6f6-b890e61aa7d2'::uuid, 'Co s tím: V takových dnech si dej cíl „ulevit tělu“, ne „odcvičit“. Stačí krátký začátek a pak se rozhodneš, jestli pokračuješ. Hlavní je nepostavit to jako další zkoušku, a pokud si nejsi jistá, [jestli jsi spíš přetažená, nebo ti chybí rozjezd](/blog/nemam-energii-na-cviceni), pomůže se u toho zastavit podrobněji.'::text),
    ('4c58cb94-f630-4458-a205-657fce0feb96'::uuid, 'Co s tím: Najdi si prostředí, které tě táhne správným směrem. Někdy stačí vědět, že v tom nejsi sama – a že ostatní řeší stejné věci, podobně jako když si [o podporu řekneš přímo doma](/blog/jak-ziskat-podporu-doma).'::text),
    ('eca5ba04-0a36-4bae-903c-68fab45b82da'::uuid, 'A ještě jedna důležitá věc: Neřeš deset věcí najednou. Najdi jeden důvod, který u tebe hraje prim, a uprav jen ten. I malá změna často otočí celý pocit, stejně jako [konkrétní postup, jak se z odporu dostat do akce](/blog/jak-se-dokopat-ke-cviceni).'::text),
    ('a8c433dc-858f-41b3-9dab-b272e9f05178'::uuid, 'Tady máš 7 pravidel, které jsou postavené tak, aby je šlo držet i ve dnech, kdy nestíháš, podobně jako v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham).'::text),
    ('3eed343c-d761-49bd-958d-1ec6c6554972'::uuid, 'Pojistka může být klidně jen jedno jídlo nebo jedna svačina, která tě opravdu zasytí, podobně jako když si dopředu naplánuješ [svačiny do práce](/blog/zdrave-svaciny-do-prace). Nemusí být dokonalá. Musí být dostupná.'::text),
    ('71dfd1e4-67b4-420a-b9f9-c5672c947606'::uuid, 'Jenže přísnost ve stresu končí výbuchem, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani). Zdravé jídlo v náročném období má být spíš jednoduché a stabilní než dokonalé.'::text),
    ('218e775d-d15e-493b-b925-895adca759ae'::uuid, 'Jestli máš pocit, že musíš být pořád „perfektní“, výčitky budou vždycky čekat za rohem, podobně jako popisujeme u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit). A to je vyčerpávající.'::text),
    ('7217b659-0230-4660-ace3-148ff77fd037'::uuid, 'Vynechala jsi cvičení? Dobře. Zítra uděláš malou verzi, stejně jako v [restartu bez restartu u dlouhodobého cvičení](/blog/jak-vydrzet-cvicit-dlouhodobe). Ne trest. Malý krok.'::text),
    ('ed42625a-3651-4c5b-bb54-3f66fa473fd0'::uuid, 'A stres dělá tři věci: zvyšuje chutě, snižuje kapacitu rozhodovat se v klidu a tlačí tě do rychlých řešení, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text),
    ('801a7c95-bce0-44c0-830c-2a97fd65c381'::uuid, 'Co s tím: nepotřebuješ trénink. Potřebuješ během dne pár krátkých rozhýbání, podobně jako v tom, [kdy pomůže spíš ulevit tělu a kdy se rozhýbat](/blog/nemam-energii-na-cviceni). Tělo se probere a hlava s ním.'::text),
    ('fd52ddda-2456-4e58-bb40-ce8596ee1b4c'::uuid, 'Co s tím: pokud je stres dlouhodobý, potřebuješ aspoň jednu krátkou věc, která ti během dne stáhne napětí, podobně jako v [malých změnách proti stresu a únavě](/blog/jak-zvladat-stres-a-byt-mene-unavena). Ne dovolenou. Krátký reset.'::text),
    ('dec825fc-0ed6-494e-9595-c05b668da687'::uuid, 'Co s tím: u jednoho jídla denně si dej cíl, aby tě opravdu zasytí, podobně jako v [jednoduchém systému jídla bez vaření](/blog/co-jist-kdyz-nestiham). Jen u jednoho. A sleduj rozdíl.'::text),
    ('3b2ae148-87d5-4d06-bd2a-8c892bc7ca99'::uuid, 'Tohle je přesně to, co z tebe udělá člověka, který „to drží“, podobně jako popisujeme u [dlouhodobého cvičení bez věčného restartu od pondělí](/blog/jak-vydrzet-cvicit-dlouhodobe). Ne člověka, který pořád začíná.'::text),
    ('e1f0138d-c593-451c-80e8-d8afa2c5c9eb'::uuid, 'Perfekcionismus často vytvoří spirálu: jedno vynechání → výčitka → trest → odpor → výpadek, podobně jako když se řeší [výčitkami z jídla](/blog/vycitky-z-jidla).'::text),
    ('3b534d3e-d92e-46a6-8e74-ba9b956bb13f'::uuid, 'A pak se divíš, že nejsi konzistentní, podobně jako u [dalších důvodů, které nejsou o disciplíně](/blog/proc-nevydrzis). Ne proto, že bys neměla disciplínu, ale protože jedeš v režimu „všechno nebo nic“.'::text),
    ('08f1257b-df5d-43ca-950d-04a80e29f0f8'::uuid, 'Smysl toho není v tom, že tím „vysekáš formu“. Smysl je v tom, že si buduješ návyk: já jsem člověk, který se o sebe stará, a přesně to je základ toho, [jak si návyk cvičení postavit natrvalo](/blog/jak-si-vytvorit-navyk-cviceni).'::text),
    ('18a1b92a-1d52-4bc7-9f05-381926b05f6c'::uuid, 'Někdy nejvíc pomůže, když na to nejsi sama. Když chceš, můžeš si svoje malé kroky sdílet i s dalšíma holkama — často právě tohle drží člověka v rytmu, podobně jako popisujeme u toho, [když ti nechybí motivace, ale podpora](/blog/proc-se-mi-nechce-cvicit).'::text),
    ('ff05a6a3-7f94-4342-89b2-e7899ea9c359'::uuid, 'A teď klíč: Ten druhý typ dne není selhání. Ten druhý typ dne je pojistka. V takovým dni nejde o výkon. Jde o to nepřerušit řetěz, podobně jako když si nejsi jistá, [jestli je lepší ulevit tělu, nebo se rozhýbat](/blog/nemam-energii-na-cviceni).'::text),
    ('87c8c5dc-4527-4da5-a688-8c942892dc6d'::uuid, 'Svačina do práce není „něco navíc“. Svačina do práce je pojistka. Je to jednoduchý způsob, jak si udržet energii, klid a hlavně to, aby se ti večer nerozpadl celý den, podobně jako v [dalších pravidlech pro jídlo v nabitém dni](/blog/jak-jist-zdrave-kdyz-nemas-cas).'::text),
    ('85908e60-6e1d-4314-ad63-5bd074705b1b'::uuid, 'A když mu ji nedáš v podobě normálního jídla, vezme si ji v podobě chutí. Sladké, pečivo, něco křupavého, „jen trochu“, podobně jako popisujeme u [sladkých chutí](/blog/sladke-chute). Protože mozek ve vyčerpání chce rychlé řešení.'::text),
    ('2abbc6b0-3819-4f88-9292-ebc04de4ed1e'::uuid, 'Spousta žen si myslí, že problém je večer. Že večer nemají vůli. Že večer [vyjídají ledničku](/blog/jak-prestat-vecer-vyjidat-lednicku) a pak se zlobí samy na sebe.'::text),
    ('cd430f25-bb65-4ba5-9b04-252282769ec3'::uuid, 'A večer? Tělo si řekne o energii. A sladké je nejrychlejší, stejně jako když [večer vyjídáš ledničku](/blog/jak-prestat-vecer-vyjidat-lednicku).'::text),
    ('e8afd51d-cbab-4985-8f8d-fc5b809e9f22'::uuid, 'Stres v těle vytváří napětí. A sladké je rychlá forma uklidnění, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani). Na chvíli se ti uleví. A proto to mozek chce znovu.'::text),
    ('7373261f-f609-406b-a764-4ec24b8068c8'::uuid, 'Co s tím: Nemusíš počítat gramy. Jen si u jídla polož jednoduchou otázku: „Mám tady něco, co mě zasytí?“ Když odpověď zní ne, sladké chutě budou častější, podobně jako když nemáš po ruce [dobře vybranou svačinu do práce](/blog/zdrave-svaciny-do-prace).'::text),
    ('5dc8be00-7e16-4875-9d8d-c5a802647991'::uuid, 'Proto nejdůležitější pravidlo zní: Návrat nesmí bolet. Návrat má být snadný na začátku, stejně jako v [dlouhodobém cvičení bez věčného pondělního restartu](/blog/jak-vydrzet-cvicit-dlouhodobe).'::text),
    ('d6f13cf1-9f64-4f11-9d5b-babcab17d6cd'::uuid, 'To je příliš, podobně jako u [dalších důvodů, proč to nevydrží](/blog/proc-nevydrzis). A přetížení je přesně to, co tě dostalo do výpadku.'::text),
    ('9e4ef2ac-8835-4e46-872a-c6f385ac803b'::uuid, 'Protože jakmile uděláš první dva kroky, vrací se důvěra, stejně jako když si postupně buduješ [dlouhodobý návyk cvičení](/blog/jak-si-vytvorit-navyk-cviceni). A s důvěrou přichází chuť pokračovat.'::text),
    ('062ef45e-785f-4a39-aa05-c66ece572df2'::uuid, 'Hodně lidí si řekne: „Budu cvičit večer.“ A pak přijde večer… a nejsou síly. Proto je lepší vybrat čas, který tě nebude stát poslední zbytky energie, podobně jako popisujeme u [prvního zařazení pohybu do nabitého týdne](/blog/jak-zacit-cvicit-kdyz-nemas-cas).'::text),
    ('6298b473-e7c5-4243-9156-e1d561b99631'::uuid, 'Perfekcionismus se často tváří jako snaha o kvalitu. Ve skutečnosti je to past, jak rozebíráme podrobněji u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit).'::text),
    ('98719d67-85c5-4d97-97ab-9d105a9426ac'::uuid, 'Poznáš to jednoduše. Ne podle toho, že jedeš každý den skvěle. Ale podle toho, že když přijde náročnější týden, úplně nezmizíš, podobně jako u [dlouhodobého cvičení bez pořád nového pondělí](/blog/jak-vydrzet-cvicit-dlouhodobe).'::text),
    ('1522f131-e5fc-404d-9180-ef14578d4bf0'::uuid, 'A přesně proto nebude fungovat rada typu „prostě si udělej čas“. Potřebuješ systém, který nepůjde proti realitě, podobně jako když si [nastavuješ hranice v plném diáři](/blog/jak-si-nastavit-hranice).'::text),
    ('0fd9d31a-47b7-436d-854c-74f7c3932335'::uuid, 'A tady pomáhá jedno přerámování: Těch 10 minut není sobeckost. Je to údržba. Je to způsob, jak být míň vyčerpaná. A když jsi míň vyčerpaná, jsi lepší máma, partnerka, člověk, a snáz si pro tenhle čas [získáš podporu i doma](/blog/jak-ziskat-podporu-doma).'::text),
    ('4f91be0f-7b6c-44e8-99ea-f2e2acc00bc1'::uuid, 'A tak ji odkládáš. A čím víc ji odkládáš, tím víc se vyčerpáš, podobně jako popisujeme u [únavy a stresu v běžném dni](/blog/jak-zvladat-stres-a-byt-mene-unavena). A čím víc se vyčerpáš, tím míň máš kapacitu začít. Je to kruh.'::text),
    ('d7d68c50-12ce-4733-918b-73d15e53eeb6'::uuid, 'Lidi, kteří vydrží dlouhodobě, nejsou nutně „tvrdší“. Mají hlavně nastavený systém tak, aby je podržel i v týdnech, kdy jsou unavení, přetížení nebo se jim prostě nechce, podobně jako popisujeme u [dlouhodobého cvičení bez věčného restartu](/blog/jak-vydrzet-cvicit-dlouhodobe). A přesně o tom je tenhle článek.'::text),
    ('531d712e-16bf-48c8-9952-3a0979e7d7c6'::uuid, 'Perfekcionismus je tichý zabiják, jak rozebíráme u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit). Když to nejde na sto procent, máš pocit, že to nemá cenu. A pak přijde nula.'::text),
    ('179f52f4-93b0-470d-8905-d7d90a2d461a'::uuid, 'Co s tím: Pomáhá mít podporu, podobně jako popisujeme u [podpory doma](/blog/jak-ziskat-podporu-doma). Prostředí, které tě připomene, že i malý krok se počítá. A že výpadek je normální, ne konec.'::text),
    ('5a0200fc-bda4-49c3-92dd-a33952fdfbcd'::uuid, 'Cíl návratu není výkon. Cíl návratu je znovu se rozjet, podobně jako rozebíráme u [návratu ke cvičení po výpadku](/blog/jak-se-vratit-ke-cviceni-po-vypadku).'::text),
    ('86d5a6a6-4089-4e83-8252-b5b0aa5197aa'::uuid, 'Tady je to nejčastější, co lidi zničí: Vynechají pár dní a pak se snaží „dohnat to“. Dají si velký plán, velký výkon, velký tlak, podobně jako u [potřeby mít to dokonalé](/blog/perfekcionismus-jak-se-ho-zbavit).'::text),
    ('810bb5be-3136-4c9e-ba44-68676be1cde0'::uuid, 'Výčitky jsou často horší než samotné vynechání, podobně jako popisujeme u [výčitek z jídla](/blog/vycitky-z-jidla). Berou energii, motivaci i chuť začít.'::text),
    ('4f7be4b9-877d-4590-84fc-abd97ae65565'::uuid, 'Proto lidé často vyjí „večer“. Když je konečně klid a tělo pustí napětí, mozek hledá způsob, jak se zklidnit, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text),
    ('24282fe8-d486-480f-afeb-f9b963693380'::uuid, 'Co s tím: Nepotřebuješ dokonalý jídelníček. Potřebuješ jednu pojistku, třeba i v podobě [svačiny do práce](/blog/zdrave-svaciny-do-prace). Něco, co tě přes den zasytí, aby večer nebyl „útok“.'::text),
    ('5da20ff6-f5ee-420d-bd89-28d8c26e0c5d'::uuid, 'Když jsi nevyspaná, tělo chce rychlou energii. A hádej, co je nejrychlejší. Sladké, pečivo, něco křupavého, něco „na chuť“, podobně jako rozebíráme u [sladkých chutí](/blog/sladke-chute).'::text),
    ('96cf5235-fb7f-4af8-8ee4-43d81dc2043b'::uuid, 'Tady je důležité udělat jednu věc: [nastavit hranici](/blog/jak-si-nastavit-hranice).'::text),
    ('93f111dd-2dbc-4263-a020-6a9d29f722e6'::uuid, 'Ty se konečně rozhodneš, že se o sebe začneš starat. Ne „až bude klid“. Teď. Chceš víc energie, lepší pocit v těle, víc klidu v hlavě, třeba i chuť [znovu se pohnout, i když se ti nechce](/blog/proc-se-mi-nechce-cvicit).'::text),
    ('2f6d1380-2288-4d5b-bd91-34c93bb053fb'::uuid, 'Zkus si to přerámovat: těch 20 minut není luxus. Je to údržba, podobně jako v [systému 10 minut jen pro sebe](/blog/jak-prestat-odkladat-sebe). Je to prevence. Aby ses nezlomila.'::text),
    ('4446f45f-47bd-4a86-88f0-7453bbb2fbf9'::uuid, 'Večer často nepřichází „lenost“. Přichází účet za celý den, podobně jako popisujeme u [stresového přejídání](/blog/stres-a-prejidani).'::text),
    ('7ebd2929-af2f-48fb-8fa1-e932c99ba611'::uuid, 'Dny, kdy nestíháš, střídají večery, kdy už nemáš sílu vůbec na nic. A když máš pocit, že jedeš „na výpary“ a [jsi pořád unavená](/blog/jsem-porad-unavena), nejsi v tom sama.'::text),
    ('3c2c6869-3d36-4508-ad74-d9fc96daeb71'::uuid, 'Tahle pauza není „ztráta času“. Je to způsob, jak si koupit energii zpátky, podobně jako když si nejsi jistá, [jestli ti pomůže spíš ulevit tělu, nebo se rozhýbat](/blog/nemam-energii-na-cviceni).'::text)
  ) as expected(id, text)
  left join public.blog_article_blocks b on b.id = expected.id
  where b.id is null or b.content->>'text' is distinct from expected.text;

  if mismatched_count > 0 then
    raise exception 'blog_article_blocks: % block(s) do not contain their planned internal link text after migration', mismatched_count;
  end if;
end $$;