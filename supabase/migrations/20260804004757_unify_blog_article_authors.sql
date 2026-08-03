-- Unifies blog article authorship under the single "Fit bez času" brand
-- author, so every article (public or not) is attributed the same way in
-- the database, the public site and BlogPosting structured data.
--
-- Confirmed via audit against the production Supabase project before
-- writing this migration: blog_authors has exactly one row with
-- author_key = 'fit-bez-casu' / display_name = 'Fit bez času' (no
-- duplicates) and one older row with author_key = 'klarka-a-david' /
-- display_name = 'Klárka a David' that 20 of 21 currently published
-- articles pointed to. Selecting by that stable key (rather than a
-- hardcoded id) keeps this migration readable while still being exact.
--
-- Deliberately does NOT touch or delete the 'klarka-a-david' author row -
-- it may still be referenced elsewhere/historically, and removing it is
-- out of scope for this change.
--
-- Idempotent and safe to re-run: if every article already points at the
-- target author, the UPDATE simply matches zero rows.
do $$
declare
  target_author_id uuid;
  remaining_count integer;
begin
  select id into target_author_id
  from public.blog_authors
  where author_key = 'fit-bez-casu' and display_name = 'Fit bez času';

  if target_author_id is null then
    raise exception 'blog_authors: no unique "Fit bez času" author found (author_key = fit-bez-casu) - aborting to avoid corrupting article authorship';
  end if;

  update public.blog_articles
  set author_id = target_author_id
  where author_id is distinct from target_author_id;

  select count(*) into remaining_count
  from public.blog_articles
  where author_id is distinct from target_author_id;

  if remaining_count > 0 then
    raise exception 'blog_articles: % article(s) still not attributed to Fit bez času after migration', remaining_count;
  end if;
end $$;
