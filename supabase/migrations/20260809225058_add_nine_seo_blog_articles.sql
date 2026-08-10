-- Import of 9 new SEO blog articles from Word source documents in
-- import/blog-articles-2026-08/ (article 08_chut_na_sladke.docx was
-- audited and deliberately excluded - significant topical overlap with
-- the existing published article 'sladke-chute', to avoid SEO cannibalization;
-- that decision is tracked separately, not part of this migration).
--
-- Content notes:
-- - The Mifflin-St Jeor BMR equations in bazalni-metabolismus originally used
--   three different dash/minus glyphs across the two formulas (a plain hyphen,
--   an en dash, and a proper minus sign) - approved to unify on the mathematical
--   minus sign (U+2212) in both, values and meaning unchanged.
-- - The physical-vs-emotional-hunger comparison table in emocni-prejidani has
--   been converted to a numbered_list (title = signal name, text = both columns
--   combined) because the current renderer has no 'table' block type - approved
--   safe alternative, no new block type or renderer created.
-- - Every CTA below reuses the exact existing, already-published mealPlan CTA
--   content verbatim (url/title/text/eyebrow/button_label) for consistency with
--   all 5 pre-existing uses of it - nothing new was authored. emocni-prejidani
--   gets no CTA block at all (no natural existing CTA target; no URL invented
--   for the Word document's 'kalkulačka'/'osobní zhodnocení jídelníčku' mentions).
-- - 18 internal links were added inside existing paragraph blocks (never as new
--   paragraphs), each linking to a verified existing slug (6 of the 21 pre-existing
--   articles, plus other articles within this same batch). No self-links, no
--   duplicate targets per article, no link to the excluded chut-na-sladke article.
--
-- Status workflow (discovered via read-only production introspection of
-- public.validate_blog_article_transition(), a BEFORE INSERT OR UPDATE trigger
-- named blog_articles_validate_transition on public.blog_articles):
-- - INSERT must create the row as status = 'draft'. A direct INSERT as
--   'published' is rejected ('New blog article must start as draft') - this is
--   exactly what made the original version of this migration fail in production.
-- - The only allowed UPDATE transitions relevant here are draft -> ready and
--   ready -> published. A direct draft -> published UPDATE is not allowed.
-- - Moving into ready/scheduled/published requires: a non-empty excerpt, an
--   active category_id, an active author_id, at least one non-divider content
--   block, and - unless legacy_migrated = true - a featured_image_path and
--   featured_image_alt. All 9 articles use legacy_migrated = true (approved),
--   the same exception already used by the existing 21 articles, because none of
--   these 9 currently has a dedicated featured image; the site's ArticleImage
--   component already falls back to a category-based generated visual whenever
--   featured_image_path is null, so no image asset is required for this batch.
-- - This migration therefore performs the full legitimate lifecycle inside one
--   transaction: INSERT as draft -> INSERT the 332 blocks -> UPDATE draft -> ready
--   -> UPDATE ready -> published. No trigger is disabled, altered, or bypassed;
--   no schema or constraint is changed; session_replication_role is never touched.
--
-- Publication timing:
-- - published_at: the article-list query orders by
--   published_at desc nullslast, scheduled_at desc nullslast, updated_at desc, so
--   published_at is the primary, stable sort key. The production trigger only
--   auto-fills published_at when it is left null on the published transition, so
--   setting it explicitly on the ready -> published UPDATE is within the allowed
--   workflow, not a bypass. Each of the 9 rows gets its own published_at value one
--   second apart - now(), now() - 1s, ... now() - 8s - all evaluated inside this
--   single do $$ block's one transaction, i.e. anchored to the same real moment
--   this migration is actually applied. This is a one-second technical distinction
--   to make the display order deterministic, not a fabricated publication history.
-- - updated_at is never set explicitly anywhere in this migration - the existing
--   BEFORE UPDATE trigger blog_articles_set_updated_at (function set_updated_at())
--   manages it on every UPDATE, so it reflects the true last-modified time (the
--   moment of the final ready -> published UPDATE) with no artificial offset, and
--   stays free to change independently on any future edit.
--
-- Safety pattern: single atomic do $$ block covering pre-flight checks, the draft
-- INSERT, the block INSERT, both UPDATE transitions, and post-checks - any failure
-- anywhere rolls back the entire batch. Pre-flight checks confirm the category/
-- author rows exist and that none of the 9 slugs, 9 article ids, or 332 block ids
-- already exist. Post-checks verify exact article/block counts, final status,
-- legacy_migrated/indexing_enabled/recommended, null image/scheduled/archived
-- fields, internal links, CTA counts, and published_at ordering.
do $$
declare
  mismatched_count integer;
  existing_count integer;
  found_targets text[];
  ordered_slugs text[];
begin

  -- 1. Pre-flight: category and author rows must exist exactly as expected.
  if not exists (select 1 from public.blog_categories where id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and slug = 'jidelnicek-a-recepty' and active = true) then
    raise exception 'Precondition failed: category jidelnicek-a-recepty not found or inactive';
  end if;
  if not exists (select 1 from public.blog_categories where id = 'e0e2aeb7-6895-499e-a914-54c9a14f5936' and slug = 'osobni-rozvoj' and active = true) then
    raise exception 'Precondition failed: category osobni-rozvoj not found or inactive';
  end if;
  if not exists (select 1 from public.blog_authors where id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and author_key = 'fit-bez-casu' and active = true) then
    raise exception 'Precondition failed: author Fit bez casu not found or inactive';
  end if;

  -- 2. Pre-flight: none of the 9 slugs or 9 article ids may already exist.
  select count(*) into existing_count from public.blog_articles where slug in ('kaloricky-deficit', 'bazalni-metabolismus', 'zdrava-vecere', 'jidelnicek-na-hubnuti-pro-zeny', 'rychly-zdravy-obed-do-prace', 'jednoduchy-jidelnicek-na-hubnuti', 'kolik-kalorii-denne-pri-hubnuti', 'lehka-zdrava-vecere', 'emocni-prejidani');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the 9 new slugs already exist - migration already applied or slug collision', existing_count;
  end if;
  select count(*) into existing_count from public.blog_articles where id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the 9 new article ids already exist', existing_count;
  end if;

  -- 3. Pre-flight: none of the 332 new block ids may already exist.
  select count(*) into existing_count from public.blog_article_blocks where id in ('a147592d-cad1-48ab-880f-6e9b12e73748', 'f572ca30-227c-4985-b72c-59774bbd06a0', 'b24bd677-57b8-4f11-96ad-eaafc3ac2505', '7ab8face-0597-429c-ac67-f38b1d94f518', '45039d5b-61d4-409f-9aa5-c1b2d2bdb82f', 'ea0ad8db-038f-40b0-af04-ab5d33c3ba89', '227f68a7-9296-472c-8e0f-9f791d6a93ed', 'dfa69eef-df76-4cfb-9b9b-af6409dc6a38', 'd8e1e7e1-8a5d-4957-ae86-03c8643023b9', '632238fc-92b1-436d-9454-b3f8ae99f613', 'c5236a91-c96a-4123-9077-e1df8f3df980', 'a7589a73-0b4d-481d-add0-592d70829e30', 'f1255a1d-8e78-4746-9657-cfa40ab4a897', '531a7a95-b9cd-4761-a30c-acb949967af4', 'e55a9303-7190-40d8-ae70-6074b7f63aef', 'c0dd1abd-26af-42a2-bd22-4b98f2670cf7', '5bee368e-86e1-4783-a1b6-ea8c22b2c73a', 'fe49dfd5-5ea4-4e22-9b97-0498de10a90b', '4cd28941-b4c1-4472-b0fa-3df5fd42b744', 'e2558c4b-1824-4b25-aacb-c24256e21312', '15752fa3-2460-4b97-ac65-ed2149aee03e', 'f12b637c-5a01-457b-a3f3-ef8b6997ec0f', '8bb69b0a-8037-4d26-86a6-c88d95057577', 'fac4bf79-a119-4890-bd69-ffd03cc4ad45', '9a8a4cd5-1543-41c0-b351-d15efae622a8', '6888d89d-2e0b-4e76-bf96-0d5f34ee7105', 'c3f5cae7-828c-475e-aafa-60b79ad1b551', '12a85a2d-c364-4dcc-b026-658a41f40c28', '0aa70eea-8f77-446e-a5b6-b7acf7f50b3e', 'f8c8caad-b8b7-44d3-9221-dd119f199029', '0cdbbc6d-4815-4ec6-a6fb-80526f47c48f', '8c5abdda-39b6-4ded-a098-13e0f9cdea1c', '0ad3bf13-10d8-42c4-bdfb-0ce9f9dbd6da', '6a437036-83d0-483c-a860-7a4f69181ce8', 'b9708c1a-f208-4879-a968-76b5a2ad8dc3', 'fd9013d6-7e5a-4af8-942f-32b833b253dc', '46602e92-f891-4eae-9b29-9c4406aa6de2', '5ff28f93-b124-40b0-8d91-40698e1df3d8', '59d9dc7e-aad3-4c34-b58d-e50aaa9e1861', '56c962f5-995f-440f-84bb-1e27f1466877', '73050aae-b76a-4d15-a2dc-b411837c2a2c', 'acbfc3dc-b457-4378-98c2-41c7956843da', '2d87b110-3ca3-4b6a-bad6-e8dbabca8c2c', 'd574ffa8-f569-4dcb-9dcc-5999cda25701', '40454526-d8bb-4d39-a26f-d859ccbbf481', 'cfd1fbf3-8f2b-4213-9857-73a5afbf453b', 'ffb3cedf-0041-4a1d-b126-57244141e239', '51202b35-03bb-47dd-b6a4-bc4b890c7294', 'eeeeb6dc-ef88-489f-a1a5-2778ebee1d23', '51946fdc-79de-4570-8508-d31ea21961d5');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 0)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('edd45f9f-5662-4833-9d77-e3dcb3429f99', 'a896d3f0-98eb-47a3-86e4-979a78b1b4eb', '62ea28c0-fe72-4690-a214-853433fe5df2', '3390dda6-697f-45f0-9b83-c329a270a89e', 'c1d6926b-0afa-4dc8-9428-8fd4612d70a6', '914247de-e976-421b-a618-63c9cb41b97f', 'af48ffb2-04a9-4752-8653-1753f57a25c5', '4168ef2c-f62e-40b6-867f-57ff365ab104', '283528f9-00ff-4dc6-be08-011696c42dc4', 'd00732a1-ed0c-42f6-9aa5-804b5e60cd99', 'ec84d670-8b85-46cd-942f-9e23fa17bf6b', '2f1b3415-b83c-48ed-ad4a-eba8444502f8', '89160b4c-7fad-4357-9511-91626ef484d5', 'dd094319-b193-42ba-856a-c89f2603bc6b', '46212f9a-9662-45d4-8840-d7524a7fcd1b', 'f72fe605-9d15-46d3-9c97-014219e46c93', 'fb11059d-6546-4c61-b413-8b79277338cc', '11c2ccc9-a2d9-415c-8cfb-ce50d9b022a5', '8964a21b-0973-429e-bd82-52c8c9df4168', 'aa178686-483b-4cbe-bff7-9c8f839183f4', '630c35eb-f5b4-4c88-b68f-b5f9b99a4ccf', 'c1b6d81f-59dd-4125-a096-ac47da4245f0', '5fbc175f-8a10-442e-a7e5-67c28e0e8d00', '8bde9c6f-681d-481f-8c1f-ee761856020b', '47db53b8-375a-4ce5-b305-43677f0702c0', '3641dd8c-6ebe-4285-b08c-7582bebe1833', 'eb09926f-ff2f-4b80-890d-b09eb288187c', '26fbdf73-34ca-44a9-a9b4-107010800053', '074d4557-2096-4a6a-9d7e-6585b87fa3a5', '0a877867-ab2d-4623-adbe-26b54985c851', '3a46d2fd-b21a-4298-8e1d-2ca8e514a0d2', '7d3af294-f91c-4635-ab26-1f1e87e69fa9', '33495e6a-d8cd-4aab-8c47-250be58fb441', '5812fe44-f89b-47ff-bd15-7ec7118693e5', '8043b2ac-98d1-478d-8f1b-4cb2a25d9b8e', '4e8262ab-4d4e-49a9-bc2b-30e1841c94ab', '4941584f-7b12-4ca1-88b4-44c7ce65d0d7', '5b3cde89-9297-4c8f-9b57-bfb579ae88bd', 'd8abd0b7-ffb6-401f-9371-0f0be8012812', '383f397e-5df5-4db0-a1e0-699527c64d12', '9811293b-aed7-4b78-946f-f50eab1c2829', 'c1ce54b2-6ae0-45ae-9dcc-57a536e6d7aa', '74fad9d7-4505-46de-804c-6f1d472ece7c', 'f4937e43-f7d4-4668-a49f-3429594fa26d', 'dcaa6ac9-81c5-4693-9376-5d56bb10c8fe', 'bcf32017-a5da-46f6-8159-5db15226a407', 'ed53e43d-a150-4ffc-85ad-3d0d88280f4a', '0903522e-7a63-4534-b2a4-94bf2f21d498', 'ea0e0dcf-e49d-4ee6-b173-efaf190dd01c', '3c022649-a101-4165-8afb-44df34792349');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 50)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('dab679a7-74f4-4143-89a0-84555c6f7046', 'bf6a2322-2f21-45ec-9d04-06affa1b87ff', '8fd471d9-9d72-4908-bf40-623a3989b5bc', '691ece92-ba33-45ab-872b-fb211625e26b', '3c66fcd2-5333-4a0a-a0ac-0bbfe1ddec02', '3a1108fd-f799-40b3-9923-154d1bac757b', '7c0b04fc-645d-4a60-b2ae-7fad00ab90cc', '97a60392-32c8-49c7-892e-92c4b4abe028', 'a3f81e03-fd06-455c-9023-7a7d9bcaeb4a', 'c388675b-2085-421b-b7d6-f18acb18cabd', '9d8afa11-a31f-4871-9cee-42244619f534', '37dc69e0-d63e-4b34-97ba-c67da2aeada5', 'ce0b2f7e-2a90-476f-bccc-b55f12d24d75', '11221829-5c56-4258-85c9-15d1a3acaf23', '8ce78b8e-780d-4abc-914c-cd9bde7a4f20', '66917c9a-bd07-48f4-9f94-38de6f322823', '54e1734a-b83d-4677-8e49-6c9fa72cd6f4', '6864428e-98d0-49b6-a59a-d8953d6e057a', 'da53b503-9f9d-4293-bcd8-24540b6bf6b6', 'd0051298-9be2-46c5-b4a6-cebb2f0cb913', 'a8c6e0f3-4ff7-4bd4-bc4c-e823a62caab8', 'eebbe0f4-71bc-4517-ac11-23a0dcb039bf', '1b0b3bf3-b393-489d-8e2d-8b7034ba450a', '32d39300-3780-4787-892e-7c093374f2a5', '1204aa15-e6a5-4ed3-9cef-46673ad83685', '76de4066-6e48-4f70-883a-4dfac3984e52', '3e8596a6-8f32-4ed1-a3a1-8f05b95142be', '1055538d-5cc9-4efa-b7da-670fad22912f', 'e6f83727-6424-47eb-a2b7-9034c8df3239', '77dfeccb-5e26-40e0-a8e7-36afe2ddbcc1', 'd393f6e9-d546-4078-a520-aca21a26de2b', '736b2958-ce69-4a0e-b42d-ccac758f8a6c', '982db783-7b03-447a-9395-49a8819acbf9', '20f1f430-2f95-4c90-a566-7ad8285d8435', '77e18640-a60b-48f3-8e64-3fc2d2bf7c3f', 'd89fb2f9-dcec-46aa-9243-e6b8136cc89c', '256e02f0-92cf-426a-802e-b7f02c5be8df', '06c3618a-5420-4b8f-be69-062e1abb6dc6', '7b2c2412-fa44-4908-803d-252b7aa46785', 'c5d9c0af-cbf8-4f44-8e67-c53977419617', 'c62739b0-6065-4571-8316-714b45bfe057', '3433ca61-5bf9-48ee-a034-5d2a517b86ec', '085104c2-6bb7-4b21-9ced-27809fbac2fc', 'c0518701-50b2-46f8-b55f-3bd7c0f38dea', 'cce5249d-9646-4a2c-abbd-8d54c6209bde', '60d13c65-7738-4c5f-9d7c-01a191a21c1d', '32e421e6-c417-40fc-940d-2be1ffd0ecc2', '888d1501-424b-4aa4-9393-f79fa79f7f83', 'f0fce156-3b7f-49f9-a133-a13bc0f02321', '1448ed12-afc3-4641-9321-c70dc9e40e45');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 100)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('9891ff9e-6420-404b-acf6-7c5395ffb6cb', 'de00b52d-d25b-4f93-ba51-41c7010b9a3b', 'e07b9a93-ee7d-40aa-87dc-f57c084ad687', '5ee28e88-8489-4136-8997-8775a7f1674c', '23e3d66b-aac4-4067-9fa3-efbf4294d0e0', '45e38a10-5884-4231-8a61-5024ffc70a29', 'd00ad254-a7a3-4822-9630-c7a80ff6f269', '9d647920-eff4-4338-885e-da1547c81f07', 'ace0574a-a4a0-48a7-ade5-85db9de03535', 'ccc49599-4809-4833-b540-02ff1965cc0b', 'd531f98e-a7c6-4c10-a0b2-53b81ea477db', '4662e063-8cf4-4c50-bb68-54e973bec19a', '19647f84-976c-4c9b-9d84-0bd954ce0377', 'e6787ed6-e9a6-4dca-82e8-11cc0c21b5ac', 'd92babe7-7b80-4336-a7db-87bd98fa5f60', '09206c78-b373-4b67-84a4-15a6c2e5a1fd', 'fc33a49a-0c1a-4c1f-b338-508cb5307723', '3483dcc5-7a03-4d63-8867-e945cd20f3cf', '3cf0de75-b53b-4235-b6d9-8843c9188ab2', '678c5c10-bef3-4346-b172-1e0e9392cd30', '068b59e1-908e-42d2-8aea-d649815485a2', '61f919aa-b5d1-4e09-a953-3a44fd657aca', 'bbc9fbf6-6079-4de9-8fa7-6e10dd4e2c9b', '9d1b84ef-4482-4716-a293-5b6ad1f4c06f', '5ed61e52-d9dc-4b3a-ac6e-d7e2a9380444', '04eebd13-ff35-4f29-8f35-5be39ada9c2a', 'cb1a172a-d388-464a-94ad-08bff2e7349a', '903e234f-7099-444b-9fc5-5941d8224ad4', '46d8990e-3a12-4e33-a426-e6f27fef21dc', 'c2246b05-88e4-4dff-afc5-cb8ecf623f6b', '5b87d928-e216-4694-8670-9ae74899b98b', 'a8e44cfc-e427-4f89-92b6-ab20fdd9e120', '2f1a44cb-be01-4498-befa-a140afd50abe', '96bf4d25-500d-4a77-8079-a85874634700', '88c6d6bb-bd28-4d7b-b48c-a7e39647069b', '3a41d6db-feb6-4fda-b7ab-23aa5acdb0be', 'e59b1273-ae87-4f97-9dc9-c6665e1c0159', '3f701b31-e425-4ee8-bcb2-896e9fb049a6', '7137fb70-c51a-4483-8b76-73e4c9a297ff', 'b336d2f6-f941-45ac-ae06-21188715d767', 'a0c8f9b7-2ad7-4ee5-b4d2-1387cb0cb26b', '204c4f12-e23a-467b-a8c2-21f1fe06fd44', '713e4cd3-1fe2-4ae4-a895-cc809e1b4544', '67722a78-a75f-4b18-9b7f-d16d6e2fc9bf', '8dd5b892-8ef1-47d3-8c3b-8ec071b54803', '342a18f7-8882-4c9c-86f7-523b6c64e4ab', 'c2a00c93-253d-4cf4-bf5d-b58f21591084', '87dd0d9b-6345-40ae-9739-ddcb09ca712f', 'e25a84ff-0f1e-4872-b6d8-ce2bc080e324', '2ac7a18e-0f74-4471-9b98-0ef1e950447e');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 150)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('0c8d1363-f575-4b98-82ac-6f373f501eca', '331d8dcc-4f03-420c-9bc0-b3341b8386c2', '2298a6ba-d85b-4ef6-bbde-3a56f7db2528', '8bc92cfe-8c60-431f-a745-865b3a1bc331', 'c56d6301-c766-4fd2-8985-68c51c6970a2', '6c597727-ec59-42d3-852b-e204b9cebb7a', '368ba9fe-97e6-49f8-b606-258d13891673', 'f8cd965e-e09a-4c24-8cc9-cc5dcc5dc586', '6ff7115d-c9bc-4f0a-ba55-706f7748e7e6', 'ce41898e-0a61-4dd5-8216-f610e3e9fd3a', 'e1ad4646-6479-44a5-9065-139f1a7910a5', '3454c2f7-9c4b-432f-9c6e-49b37bad960c', '767939d3-4fd1-49da-b9d1-f9751da9739e', 'c9af1032-cade-4f6b-9761-206b4965eac8', '8ad435ea-1468-4626-8534-cafee19ef566', '25aff94d-7ae6-4db1-af6f-cda5ba78dbed', '4987a940-59a5-45c8-b21c-08fe3955048b', '7615854e-2694-439b-aa56-e6e2a0e3fef5', '7f9e069f-1c0f-45ce-bf4f-2520fb27ef71', 'cca7c58b-df36-43ad-8a12-da5930f5d03d', '846a3afa-28f7-44cd-b6ae-dff3342a1832', '900cef96-13da-43bf-94be-e88dc32199cc', 'e4615d7e-3ca0-4466-a8d0-90a027663e0e', 'd8171969-6c1f-496c-a21d-3f7eadf7f083', '605c0946-7029-40d1-8e6c-191391eb76c2', 'f58c2f13-e96e-4b8b-8cec-54228821c37b', 'f01af010-80c3-45dc-988c-90b1b580dd49', '322c29bf-5dc9-4163-aa13-cadc7bd44bf1', '6c75e7f2-7e23-48f4-9049-3149eb0ee9ed', '4f2a21e9-bc2a-488b-b5fe-c086ca73449d', 'f7081bcd-8cc3-4dbc-9816-212cb411492a', 'd083c9c8-e315-4e9d-8a46-f607d36ccdcb', '99a454f5-a2a0-4379-9587-77fa24c58552', 'c5d8e28e-f99f-4262-9db6-7e7f5fe6880c', '77037f5e-51c1-4b7f-9218-dcd62bfa3f44', '376d5388-e880-4db8-b188-ef27014f9f8a', '2e6fc7dc-21a2-4b90-9e14-a1c5509ec48d', '52ecbf61-64cf-4550-9a3a-00e82fe86085', '623fa969-20f4-4d82-99d3-0216945cfc6d', 'a38ec263-a12d-45ba-8c65-c91240970bbc', 'b449f586-7054-4b91-ba16-96bcf8e7a311', '433f9d11-b3d3-4d57-b4d2-dd5ffe363e19', 'e4f0d152-f52a-4133-a4b7-0e004258b283', '748589ea-86a0-4048-ae01-6bb5c7f65990', '712481c1-209c-4699-bb33-9f0497a7e4e5', '87039ba8-99cd-4c67-ab8b-ace3582d8d87', '4763222f-7eab-4a54-b07e-233eaeee6607', '13560e6c-64a3-473b-bcb6-24542dcd49ef', 'd9b544da-736f-4f8f-9a28-73a6b047a881', '02b82a4c-f2ec-4e9d-ab35-dd320a114c93');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 200)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('1b2f2c2e-1fee-4cff-9284-56e79e838895', 'ed99efa1-de9d-424c-87da-3eb922304a87', 'e23f902c-13ce-4285-8976-5beffa5f3e09', '690c1d76-3c89-4386-b4ca-a0c97f0d7a39', '2ae42714-91bb-41e3-a6e7-4347c6f38b92', '510df0bf-dff3-46c0-89f5-7ba6483baad0', '51342883-d98e-4ee2-96e1-01ba8cf6015b', '5b8f23c2-63de-49ed-bef2-09a4a7222129', '1ee45f46-328c-4548-9213-99cd53ea7324', '17ad7555-e307-49e6-bc20-3f716b8beace', 'd724573d-c736-45e2-88ba-3f89e989bf01', '0b4a8e5e-300e-4b68-8039-3b7038676f26', 'bd98c12c-ed41-42bd-bdee-f4bd88d131d3', 'fb35e45e-af01-4808-b3d3-364085ad9971', '2275eedf-f6ae-4c30-a43c-5d87b2e00d46', 'f7d3c6c7-6a04-47f7-8cc4-eaf6dde5e670', 'c54014b1-d6d8-45a4-88cc-7d6395328f13', '87c0fafb-5bf2-4f8b-bb3c-bba84e6eb4ec', '7f7cd50f-58a7-4168-b2d8-5a3f24ce3232', '397e2f37-d07c-4510-9d13-629f29a9ec37', 'cc864c1b-a1a5-4619-b353-8d94d71927b5', '1f2401be-f268-41d7-8d4f-5c2a97eedffa', '04ad20e0-290f-4771-a37c-39941ee7e5d2', '69234fa0-7609-4ff1-9ffc-6f0088791140', '83f9b009-98f3-4a9f-80c8-8c9f52c79818', '3614e1f6-77e6-4a3e-9785-26e1078e518c', '0fd50f4a-8b8f-42ed-96bc-909a448d2b4b', 'cd64d89e-0ac7-40fb-92b2-5e65ad624795', '858ebb2a-b15d-4811-9572-15400a1909fd', '197f5d3d-9403-43ca-9fc1-5968d3dad0e5', 'c06955d8-d163-4f72-82b3-5fb4ace7af40', '411a8eb4-cb73-4d28-95a2-32dbe56a4da0', '3a0d9846-79b5-46a8-833d-9ea1b2ff11f1', '0614f5b6-ec9d-4309-afd4-2ae0ffc21cb3', '866b8047-7aa3-49c5-a678-0715210d4c6d', 'cb5929eb-b52e-4a88-ab31-59938671e931', '0a7253e2-af22-4275-bfaa-9ab740b2036a', '26a3e766-7d5a-4ae6-b742-53ddd1524831', '872155db-9096-4d80-a3dc-be2c05139f9f', 'ee1319aa-9baa-4fc1-95b4-d5f823a3aa82', 'c784ad87-26dd-49b8-9500-17e41873f0b5', '4cad44be-9fa4-45e4-b745-614de42095c3', '6693ec82-2b8c-4eec-b880-e7595a6e4d56', '1dcde660-d5fb-4b6a-8331-c99b79852962', '68fc5dde-a039-4dcb-b6eb-257fbdc09cbe', '0c174863-fdba-41f9-b826-a1e45bb20793', 'cc6c1e77-84a1-49c6-b792-ed3861370109', 'a95bc163-c3d6-41fc-8120-c56099ebb119', 'f2a981bb-26d3-4f87-ae6d-3b055ce2c8e0', 'cf1e2cde-66b8-4df7-8d71-38ffc018d629');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 250)', existing_count;
  end if;
  select count(*) into existing_count from public.blog_article_blocks where id in ('6096bb4f-06b7-4792-a714-c68c387b33c4', 'e262040b-7648-4599-823c-5577a055908b', '78ea4e0d-421b-4e1e-a64e-038ea0b7baa9', 'c798dedd-f7a2-419f-9619-2bb4ea4e8aae', 'c1717cc7-0849-4496-8c59-ab984bc4815e', '56fe8d1d-e492-4a50-b6b2-b4a200fb385c', '0ab43f55-5425-4486-9246-1aa1e9e8ace9', '4732c03c-6cfc-4fb9-bd81-af184536fa33', 'e70128e6-9519-4ed2-a347-e589a16f724e', '671747f7-1421-4d47-9eae-8566b055d5e0', '4e047418-1efd-49b6-ac1b-a534bcf463c2', 'ddd8e343-cb08-4dc6-b803-2a1c1d0b84a7', '4e67aeb6-88fa-43c4-b340-9aecfb149f30', 'b049d434-4bcc-4709-a6c3-bce45032db90', 'cda6e991-56f5-4d97-9c7c-852918e7f165', '879bb54a-4b7a-421d-8398-a2ceb79f7a08', '7babe0a5-713f-4658-b37e-90fb62bbc9e9', '9548ed98-ac1e-495a-8c75-3fff96f18bf9', '1d02777e-a92d-4146-b0c6-1bdf7f885d56', '744daf47-4d67-4c2c-ade4-b0236313e575', '3f3962d5-d324-4c75-8778-269638d48a3a', '10cfb0aa-eb10-438e-92b3-17221ecdd595', 'dee953fe-f22a-4ecc-a0f0-a193518c2318', 'ccb91283-2c35-4514-8683-fb479659c6a5', 'e167e562-9140-494e-ae88-120dd492f193', '280cf68b-9a35-4ec6-ba0d-b8c27fc47043', 'acc8eb32-6190-42d7-966b-1a4d8ce576a1', '9c2123f1-6271-4139-b685-91c570d158eb', '950e7276-8724-4a5c-ae90-9bfd4102f56f', '67ae2bfe-9349-43fa-87ed-c5d2743baaf2', '35dfde6a-56ce-4ca5-b4a5-2d86bd1ee4a9', 'f23e24fe-3d35-439f-831a-44943ff2910d');
  if existing_count > 0 then
    raise exception 'Precondition failed: % of the new block ids already exist (batch starting at 300)', existing_count;
  end if;

  -- 4. Insert the 9 blog_articles rows as drafts. This is the only status the
  -- INSERT trigger allows for a new row. legacy_migrated = true (approved: no
  -- featured image for this batch, same exception already used by the existing
  -- 21 articles). indexing_enabled = false while still a draft - flipped to true
  -- only on the final ready -> published transition below. published_at/
  -- scheduled_at/archived_at all null at this stage.
  insert into public.blog_articles
    (id, title, slug, excerpt, category_id, author_id, status, featured_image_path, featured_image_alt, featured_image_caption, seo_title, seo_description, social_image_path, canonical_url, indexing_enabled, recommended, legacy_migrated, published_at, scheduled_at, archived_at)
  values
    ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'Kalorický deficit: Jak ho správně vypočítat a nehladovět', 'kaloricky-deficit', 'Praktický návod, jak nastavit hubnutí tak, aby bylo účinné, ale stále zvládnutelné v běžném životě.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Kalorický deficit: Jak ho správně vypočítat a nehladovět', 'Zjisti, co je kalorický deficit, jak ho orientačně vypočítat a nastavit tak, abys hubla bez neustálého hladu, únavy a večerního přejídání.', null, null, false, false, true, null, null, null),
    ('2b44d54a-a095-4488-bba2-e273ef66dfcd', 'Bazální metabolismus: Co znamená a jak ho vypočítat', 'bazalni-metabolismus', 'Srozumitelně o čísle, které často vidíš v kalkulačkách, ale snadno se vykládá špatně.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Bazální metabolismus: Co znamená a jak ho vypočítat', 'Co je bazální metabolismus, jak se počítá a proč není stejný jako doporučený kalorický příjem? Podívej se na praktický příklad i časté chyby.', null, null, false, false, true, null, null, null),
    ('0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'Zdravá večeře: 20 rychlých a sytých jídel', 'zdrava-vecere', 'Nápady na zdravou večeři, která je jednoduchá, chutná a zasytí tě déle než na hodinu.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Zdravá večeře: 20 rychlých a sytých jídel', 'Hledáš zdravou večeři, která je rychlá a opravdu zasytí? Vyber si z 20 jednoduchých teplých i studených jídel z běžných surovin.', null, null, false, false, true, null, null, null),
    ('04195582-11b5-4fe1-8a26-08b4fea157a6', 'Jídelníček na hubnutí pro ženy: Jak si poskládat celý den', 'jidelnicek-na-hubnuti-pro-zeny', 'Praktický systém, díky kterému nemusíš každý den začínat otázkou: Co mám vlastně jíst?', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Jídelníček na hubnutí pro ženy: Jak si poskládat celý den', 'Jak má vypadat jídelníček na hubnutí pro ženy? Nauč se poskládat snídani, oběd, svačinu i večeři tak, aby tě jídlo zasytilo.', null, null, false, false, true, null, null, null),
    ('acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'Rychlý zdravý oběd do práce: 15 jednoduchých nápadů', 'rychly-zdravy-obed-do-prace', 'Obědy do krabičky, které zvládneš připravit bez každodenního dlouhého vaření.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Rychlý zdravý oběd do práce: 15 jednoduchých nápadů', '15 nápadů na rychlý zdravý oběd do práce. Jednoduché krabičky s bílkovinami, zeleninou a přílohou, které tě zasytí na celé odpoledne.', null, null, false, false, true, null, null, null),
    ('e4efee92-c1c6-4435-b81c-c0b6880136bc', 'Jednoduchý jídelníček na hubnutí z běžných potravin', 'jednoduchy-jidelnicek-na-hubnuti', 'Ukázka, jak může vypadat celý týden bez drahých surovin, složitých receptů a odděleného vaření pro rodinu.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Jednoduchý jídelníček na hubnutí z běžných potravin', 'Jednoduchý jídelníček na hubnutí na 7 dní z běžných potravin. Inspirace na snídaně, obědy, svačiny a večeře bez složitého vaření.', null, null, false, false, true, null, null, null),
    ('4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'Kolik kalorií denně jíst při hubnutí', 'kolik-kalorii-denne-pri-hubnuti', 'Proč neexistuje jedno správné číslo pro všechny a jak si nastavit realistický výchozí příjem.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Kolik kalorií denně jíst při hubnutí', 'Kolik kalorií denně jíst při hubnutí? Zjisti, co ovlivňuje tvůj příjem, jak nastavit mírný deficit a proč univerzální čísla často nefungují.', null, null, false, false, true, null, null, null),
    ('5b0b2105-f978-476c-925e-0f4bec2f47b2', 'Lehká zdravá večeře, která tě opravdu zasytí', 'lehka-zdrava-vecere', 'Lehká nemusí znamenat malá. Nauč se připravit večeři, po které nebudeš za hodinu znovu hladová.', '2d2519ad-ad9e-40da-9f62-f449938757c2', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Lehká zdravá večeře, která tě opravdu zasytí', 'Lehká zdravá večeře nemusí být malá. Vyber si z 12 jednoduchých jídel, která obsahují bílkoviny a opravdu tě zasytí.', null, null, false, false, true, null, null, null),
    ('38333a17-c20a-4536-8785-c4b8ebd67b3e', 'Emoční přejídání: Jak poznat rozdíl mezi hladem a emocí', 'emocni-prejidani', 'Praktický a citlivý návod, jak si všimnout spouštěčů bez výčitek a dalšího zpřísňování jídelníčku.', 'e0e2aeb7-6895-499e-a914-54c9a14f5936', '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260', 'draft', null, null, null, 'Emoční přejídání: Jak poznat rozdíl mezi hladem a emocí', 'Co je emoční přejídání a jak poznat rozdíl mezi fyzickým hladem a emocí? Praktické kroky bez výčitek a dalšího zpřísňování jídelníčku.', null, null, false, false, true, null, null, null);

  -- 5. Insert the 332 blog_article_blocks rows, in position order per article -
  -- must happen before the draft -> ready transition, since the trigger requires
  -- at least one non-divider content block to allow that transition.
  insert into public.blog_article_blocks
    (id, article_id, block_type, position, content, settings)
  values
    ('a147592d-cad1-48ab-880f-6e9b12e73748', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 1, '{"text": "Kalorický deficit zní trochu technicky, ve skutečnosti ale popisuje jednoduchou věc: během dne přijmeš méně energie, než tvoje tělo spotřebuje. Právě tehdy začne tělo postupně využívat uložené zásoby a váha může klesat."}'::jsonb, '{}'::jsonb),
    ('f572ca30-227c-4985-b72c-59774bbd06a0', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 2, '{"text": "To ale neznamená, že musíš jíst co nejméně. Příliš nízký příjem často přinese hlad, únavu, chutě na sladké a večerní přejídání. Dobře nastavený kalorický deficit má být dostatečný pro hubnutí, ale zároveň takový, který zvládneš dodržovat i v práci, o víkendu a ve dnech, kdy nemáš všechno dokonale pod kontrolou."}'::jsonb, '{}'::jsonb),
    ('b24bd677-57b8-4f11-96ad-eaafc3ac2505', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 3, '{"text": "Co je kalorický deficit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('7ab8face-0597-429c-ac67-f38b1d94f518', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 4, '{"text": "Tvoje tělo potřebuje energii nepřetržitě. Spotřebovává ji na dýchání, činnost orgánů, udržení tělesné teploty, trávení i pohyb. Součet této spotřeby označujeme jako celkový denní energetický výdej."}'::jsonb, '{}'::jsonb),
    ('45039d5b-61d4-409f-9aa5-c1b2d2bdb82f', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 5, '{"text": "Když je tvůj průměrný příjem dlouhodobě nižší než výdej, vzniká kalorický deficit. Neřeší se jeden oběd ani jeden den. Rozhoduje opakující se průměr v čase."}'::jsonb, '{}'::jsonb),
    ('ea0ad8db-038f-40b0-af04-ab5d33c3ba89', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'info_box', 6, '{"title": "Jednoduchý příklad", "text": "Pokud tělo v průměru spotřebuje 2 100 kcal a ty přijmeš přibližně 1 750 až 1 850 kcal, vznikne kalorický deficit. Přesné číslo je vždy jen výchozí odhad a musí se upravovat podle vývoje váhy, hladu, energie a běžného fungování.", "variant": "neutral"}'::jsonb, '{}'::jsonb),
    ('227f68a7-9296-472c-8e0f-9f791d6a93ed', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 7, '{"text": "Jak vypočítat kalorický deficit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('dfa69eef-df76-4cfb-9b9b-af6409dc6a38', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 8, '{"text": "Nejdřív potřebuješ odhadnout svůj udržovací příjem, tedy množství energie, při kterém se tvoje hmotnost dlouhodobě výrazně nemění. Kalkulačky obvykle vycházejí z věku, výšky, hmotnosti, pohlaví a úrovně pohybu a dají ti orientační odpověď na to, [kolik kalorií denně při hubnutí](/blog/kolik-kalorii-denne-pri-hubnuti) má pro tebe smysl."}'::jsonb, '{}'::jsonb),
    ('d8e1e7e1-8a5d-4957-ae86-03c8643023b9', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 9, '{"text": "1. Odhadni bazální metabolismus", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('632238fc-92b1-436d-9454-b3f8ae99f613', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 10, '{"text": "[Bazální metabolismus](/blog/bazalni-metabolismus) je energie, kterou tělo spotřebuje v úplném klidu. Není to doporučený příjem pro hubnutí. Je to jen jedna část celkového výdeje."}'::jsonb, '{}'::jsonb),
    ('c5236a91-c96a-4123-9077-e1df8f3df980', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 11, '{"text": "2. Zohledni pohyb a běžný den", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('a7589a73-0b4d-481d-add0-592d70829e30', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 12, '{"text": "K bazálnímu metabolismu se přidává energie na chůzi, práci, domácnost, cvičení i trávení. Výsledkem je orientační celkový denní výdej neboli TDEE."}'::jsonb, '{}'::jsonb),
    ('f1255a1d-8e78-4746-9657-cfa40ab4a897', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 13, '{"text": "3. Zvol mírný deficit", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('531a7a95-b9cd-4761-a30c-acb949967af4', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 14, '{"text": "Pro většinu žen je rozumnější začít menším deficitem než agresivním omezením. Často se používá přibližně 10 až 20 % z udržovacího příjmu. Vyšší deficit není automaticky lepší. Čím větší omezení, tím těžší bývá dlouhodobé dodržování."}'::jsonb, '{}'::jsonb),
    ('e55a9303-7190-40d8-ae70-6074b7f63aef', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 15, '{"text": "Jak poznáš, že je deficit příliš velký", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c0dd1abd-26af-42a2-bd22-4b98f2670cf7', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'bullet_list', 16, '{"items": ["Máš silný hlad většinu dne a myšlenky se často točí kolem jídla.", "Večer pravidelně ztrácíš kontrolu a dojídáš vše, co přes den chybělo.", "Jsi unavená, podrážděná a klesá tvoje výkonnost.", "Vyřadila jsi celé skupiny potravin jen proto, abys ušetřila kalorie.", "Jídelníček nedokážeš dodržet déle než několik dnů.", "Máš pocit, že každá oslava nebo návštěva celý plán zničí."]}'::jsonb, '{}'::jsonb),
    ('5bee368e-86e1-4783-a1b6-ea8c22b2c73a', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 17, '{"text": "Jednotlivý horší den nemusí nic znamenat. Varovný je opakující se vzorec. Pokud plán vytváří neustálý boj s hladem, není dost dobře nastavený."}'::jsonb, '{}'::jsonb),
    ('fe49dfd5-5ea4-4e22-9b97-0498de10a90b', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 18, '{"text": "Jak být v kalorickém deficitu a nehladovět", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('4cd28941-b4c1-4472-b0fa-3df5fd42b744', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 19, '{"text": "Stav každé hlavní jídlo na bílkovinách", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e2558c4b-1824-4b25-aacb-c24256e21312', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 20, '{"text": "Bílkoviny pomáhají se sytostí a při hubnutí podporují udržení svalové hmoty. Do jídla můžeš zařadit vejce, skyr, tvaroh, maso, ryby, tofu, luštěniny nebo kvalitní sýry v přiměřeném množství."}'::jsonb, '{}'::jsonb),
    ('15752fa3-2460-4b97-ac65-ed2149aee03e', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 21, '{"text": "Přidej objem pomocí zeleniny a ovoce", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f12b637c-5a01-457b-a3f3-ef8b6997ec0f', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 22, '{"text": "Velký talíř nemusí znamenat velké množství kalorií. Zelenina, ovoce, polévky a další potraviny s nižší energetickou hustotou pomohou vytvořit porci, která působí jako normální jídlo, ne jako trestná dieta."}'::jsonb, '{}'::jsonb),
    ('8bb69b0a-8037-4d26-86a6-c88d95057577', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 23, '{"text": "Neboj se sacharidů ani tuků", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('fac4bf79-a119-4890-bd69-ffd03cc4ad45', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 24, '{"text": "Pečivo, rýže, brambory, vločky nebo těstoviny mohou být součástí jídelníčku na hubnutí. Stejně tak tuky. Rozhoduje množství, skladba celého dne a to, zda tě jídlo zasytí. Úplné zákazy často zvyšují chutě a pocit, že při první odchylce všechno selhalo."}'::jsonb, '{}'::jsonb),
    ('9a8a4cd5-1543-41c0-b351-d15efae622a8', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 25, '{"text": "Nešetři všechny kalorie na večer", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('6888d89d-2e0b-4e76-bf96-0d5f34ee7105', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 26, '{"text": "Pokud přes den jíš jen kávu, malý jogurt a lehký salát, není večerní hlad nedostatek vůle. Tělo si říká o energii. Pravidelnější a plnohodnotnější jídlo během dne bývá účinnější než snaha večer hlad přemoci, i když zrovna [nestíháš vařit](/blog/co-jist-kdyz-nestiham)."}'::jsonb, '{}'::jsonb),
    ('c3f5cae7-828c-475e-aafa-60b79ad1b551', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 27, '{"text": "Počítej s běžným životem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('12a85a2d-c364-4dcc-b026-658a41f40c28', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 28, '{"text": "Dobře nastavený příjem má prostor i na jídlo pro radost. Nemusíš každý den využít stejné potraviny ani trefit číslo na jednu kalorii. Důležitější je dlouhodobý průměr a opakovatelný režim."}'::jsonb, '{}'::jsonb),
    ('0aa70eea-8f77-446e-a5b6-b7acf7f50b3e', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 29, '{"text": "Jak dlouho sledovat výsledek", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f8c8caad-b8b7-44d3-9221-dd119f199029', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 30, '{"text": "Hmotnost kolísá podle množství vody, soli, sacharidů, trávení, menstruačního cyklu i času vážení. Proto nedává smysl hodnotit deficit podle dvou dnů. Sleduj ideálně několik týdnů, porovnávej průměry a všímej si také obvodů, oblečení, energie a hladu."}'::jsonb, '{}'::jsonb),
    ('0cdbbc6d-4815-4ec6-a6fb-80526f47c48f', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 31, '{"text": "Pokud se po několika týdnech nic nemění a zapisování odpovídá realitě, můžeš příjem mírně upravit nebo přidat běžný pohyb. Pokud hubneš rychle, jsi vyčerpaná a hladová, je naopak rozumné trochu přidat."}'::jsonb, '{}'::jsonb),
    ('8c5abdda-39b6-4ded-a098-13e0f9cdea1c', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 32, '{"text": "Nejčastější chyby při nastavování deficitu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('0ad3bf13-10d8-42c4-bdfb-0ce9f9dbd6da', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'numbered_list', 33, '{"items": [{"title": "", "text": "Považovat bazální metabolismus za doporučený denní příjem."}, {"title": "", "text": "Nadhodnotit pohyb a počítat s příliš vysokým výdejem."}, {"title": "", "text": "Nezapisovat olej, nápoje, ochutnávání a víkendová jídla."}, {"title": "", "text": "Jíst přes týden extrémně málo a o víkendu deficit nevědomky vyrovnat."}, {"title": "", "text": "Měnit příjem po každém jednotlivém vážení."}, {"title": "", "text": "Soudit úspěch jen podle čísla na váze."}]}'::jsonb, '{}'::jsonb),
    ('6a437036-83d0-483c-a860-7a4f69181ce8', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 34, '{"text": "Kalorický deficit nemusí znamenat život podle kalkulačky", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('b9708c1a-f208-4879-a968-76b5a2ad8dc3', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 35, '{"text": "Počítání kalorií může být užitečné jako dočasná zpětná vazba. Ukáže ti velikosti porcí, energeticky bohaté potraviny i to, kde naopak jíš zbytečně málo. Cílem ale nemusí být zapisovat všechno navždy. Cílem je postupně pochopit svůj příjem a poskládat si den tak, aby hubnutí zapadlo do života."}'::jsonb, '{}'::jsonb),
    ('fd9013d6-7e5a-4af8-942f-32b833b253dc', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'cta', 36, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('46602e92-f891-4eae-9b29-9c4406aa6de2', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'heading', 37, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5ff28f93-b124-40b0-8d91-40698e1df3d8', '625bbc2f-2f94-4dd4-bd18-16b6b09f872f', 'paragraph', 38, '{"text": "Kalorický deficit je základem snižování hmotnosti, ale nejlépe funguje tehdy, když není extrémní. Začni realistickým odhadem, sleduj delší vývoj a postav jídelníček na sytých běžných jídlech. Hubnutí nemá být soutěž o nejnižší příjem. Má to být systém, který dokážeš opakovat dostatečně dlouho, aby přinesl výsledek."}'::jsonb, '{}'::jsonb),
    ('59d9dc7e-aad3-4c34-b58d-e50aaa9e1861', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 1, '{"text": "Bazální metabolismus je množství energie, které tvoje tělo potřebuje k udržení základních životních funkcí v úplném klidu. I kdybys celý den jen ležela, tělo stále pracuje. Dýcháš, srdce pumpuje krev, mozek zpracovává informace, orgány fungují a tělo udržuje teplotu."}'::jsonb, '{}'::jsonb),
    ('56c962f5-995f-440f-84bb-1e27f1466877', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 2, '{"text": "Právě energii na tyto procesy označujeme jako bazální metabolismus, často zkráceně BMR. Je to důležité číslo, ale samo o sobě ti ještě neříká, [kolik kalorií máš jíst při hubnutí](/blog/kolik-kalorii-denne-pri-hubnuti)."}'::jsonb, '{}'::jsonb),
    ('73050aae-b76a-4d15-a2dc-b411837c2a2c', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 3, '{"text": "Co je bazální metabolismus", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('acbfc3dc-b457-4378-98c2-41c7956843da', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 4, '{"text": "Bazální metabolismus představuje nejnižší množství energie, které tělo potřebuje v přesně definovaných klidových podmínkách. V praxi se často pracuje s odhadem klidového metabolismu, protože skutečné laboratorní měření vyžaduje specifické podmínky."}'::jsonb, '{}'::jsonb),
    ('2d87b110-3ca3-4b6a-bad6-e8dbabca8c2c', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 5, '{"text": "U většiny lidí tvoří klidová spotřeba velkou část celkového denního výdeje. Zbytek připadá na běžný pohyb, cvičení a energii potřebnou ke zpracování jídla."}'::jsonb, '{}'::jsonb),
    ('d574ffa8-f569-4dcb-9dcc-5999cda25701', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 6, '{"text": "Co ovlivňuje hodnotu bazálního metabolismu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('40454526-d8bb-4d39-a26f-d859ccbbf481', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'bullet_list', 7, '{"items": ["Tělesná hmotnost a výška. Větší tělo obvykle potřebuje více energie.", "Množství svalové a další aktivní tkáně.", "Věk. S věkem se může měnit složení těla i běžná aktivita.", "Pohlaví, které je součástí používaných rovnic.", "Genetika, hormony, zdravotní stav a užívané léky.", "Dlouhodobý energetický příjem a výrazné změny hmotnosti."]}'::jsonb, '{}'::jsonb),
    ('cfd1fbf3-8f2b-4213-9857-73a5afbf453b', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 8, '{"text": "Jak se bazální metabolismus vypočítá", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('ffb3cedf-0041-4a1d-b126-57244141e239', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 9, '{"text": "Pro běžnou orientaci se používají predikční rovnice. Jednou z nejznámějších je rovnice Mifflin-St Jeor."}'::jsonb, '{}'::jsonb),
    ('51202b35-03bb-47dd-b6a4-bc4b890c7294', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'info_box', 10, '{"title": "Mifflin-St Jeor rovnice", "text": "Rovnice pro ženy\nBMR = 10 × hmotnost v kg + 6,25 × výška v cm − 5 × věk v letech − 161\n\nRovnice pro muže:\nBMR = 10 × hmotnost v kg + 6,25 × výška v cm − 5 × věk v letech + 5", "variant": "neutral"}'::jsonb, '{}'::jsonb),
    ('eeeeb6dc-ef88-489f-a1a5-2778ebee1d23', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 11, '{"text": "Příklad: žena ve věku 38 let, s výškou 168 cm a hmotností 78 kg má podle této rovnice odhadovaný bazální metabolismus přibližně 1 479 kcal za den."}'::jsonb, '{}'::jsonb),
    ('51946fdc-79de-4570-8508-d31ea21961d5', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 12, '{"text": "Například muž ve věku 38 let, s výškou 180 cm a hmotností 90 kg má podle této rovnice odhadovaný bazální metabolismus přibližně 1 840 kcal za den."}'::jsonb, '{}'::jsonb),
    ('edd45f9f-5662-4833-9d77-e3dcb3429f99', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 13, '{"text": "Výpočet je orientační. Dva lidi se stejným věkem, výškou a hmotností mohou mít v realitě odlišný výdej. Proto kalkulačka poskytuje výchozí bod, ne finální číslo."}'::jsonb, '{}'::jsonb),
    ('a896d3f0-98eb-47a3-86e4-979a78b1b4eb', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 14, '{"text": "Bazální metabolismus není totéž co denní kalorický příjem", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('62ea28c0-fe72-4690-a214-853433fe5df2', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 15, '{"text": "Tady vzniká nejčastější omyl. Kalkulačka ukáže například 1 450 kcal a žena si řekne, že právě tolik má jíst. Jenže bazální metabolismus nezahrnuje běžné fungování."}'::jsonb, '{}'::jsonb),
    ('3390dda6-697f-45f0-9b83-c329a270a89e', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 16, '{"text": "Jakmile vstaneš z postele, dojdeš do koupelny, připravíš snídani, pracuješ, uklízíš nebo jdeš na procházku, spotřeba se zvyšuje. Pro nastavení jídelníčku potřebuješ odhad celkového denního energetického výdeje, ne samotné BMR."}'::jsonb, '{}'::jsonb),
    ('c1d6926b-0afa-4dc8-9428-8fd4612d70a6', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 17, '{"text": "Od bazálního metabolismu k celkovému výdeji", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('914247de-e976-421b-a618-63c9cb41b97f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 18, '{"text": "Celkový denní energetický výdej se často označuje jako TDEE. Vzniká kombinací klidového metabolismu, běžného pohybu, cíleného cvičení a termického efektu potravy."}'::jsonb, '{}'::jsonb),
    ('af48ffb2-04a9-4752-8653-1753f57a25c5', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'bullet_list', 19, '{"items": ["Bazální nebo klidový metabolismus: energie na základní fungování.", "NEAT: běžný pohyb mimo cvičení, například chůze, stání, úklid a pohyb v práci.", "Cvičení: energie spotřebovaná při tréninku nebo sportu.", "Termický efekt potravy: energie potřebná ke zpracování přijatého jídla."]}'::jsonb, '{}'::jsonb),
    ('4168ef2c-f62e-40b6-867f-57ff365ab104', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 20, '{"text": "Právě běžný pohyb může vysvětlit, proč dvě ženy se stejným tréninkem mají jiný celkový výdej. Jedna většinu dne sedí, druhá nachodí tisíce kroků v práci a doma."}'::jsonb, '{}'::jsonb),
    ('283528f9-00ff-4dc6-be08-011696c42dc4', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 21, '{"text": "Může být bazální metabolismus zpomalený", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d00732a1-ed0c-42f6-9aa5-804b5e60cd99', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 22, '{"text": "Metabolismus není vypínač, který se jedním špatným jídlem zastaví. Tělo ale umí na dlouhodobý nedostatek energie a pokles hmotnosti reagovat. Menší tělo spotřebuje méně energie, může klesnout spontánní pohyb a člověk bývá unavenější."}'::jsonb, '{}'::jsonb),
    ('ec84d670-8b85-46cd-942f-9e23fa17bf6b', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 23, '{"text": "To neznamená, že už nejde zhubnout. Znamená to, že původní odhad nemusí po čase odpovídat nové hmotnosti a aktuálnímu režimu. Proto se příjem i výdej průběžně vyhodnocují podle reality a podle toho se upravuje i [kalorický deficit](/blog/kaloricky-deficit)."}'::jsonb, '{}'::jsonb),
    ('2f1b3415-b83c-48ed-ad4a-eba8444502f8', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 24, '{"text": "Jak zrychlit metabolismus", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('89160b4c-7fad-4357-9511-91626ef484d5', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 25, '{"text": "Žádná potravina nezpůsobí dramatické zvýšení bazálního metabolismu. Smysl má spíš chránit svalovou hmotu, pravidelně se hýbat, mít dostatek bílkovin, spát a nevolit zbytečně extrémní dietu."}'::jsonb, '{}'::jsonb),
    ('dd094319-b193-42ba-856a-c89f2603bc6b', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'bullet_list', 26, '{"items": ["Zařaď silový pohyb přiměřený svému stavu a zkušenostem.", "Udržuj běžnou denní aktivitu, například chůzi.", "Nastav mírný kalorický deficit místo drastického omezení.", "Jez dostatek bílkovin a celkově pestrý jídelníček.", "Počítej s tím, že při nižší hmotnosti bude výdej obvykle o něco nižší."]}'::jsonb, '{}'::jsonb),
    ('46212f9a-9662-45d4-8840-d7524a7fcd1b', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 27, '{"text": "Kdy výpočet nemusí stačit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f72fe605-9d15-46d3-9c97-014219e46c93', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 28, '{"text": "Kalkulačka může být méně přesná při výrazně neobvyklém množství svalové hmoty, velmi nízké nebo vysoké hmotnosti, v těhotenství a při kojení, u některých onemocnění nebo při užívání léků ovlivňujících hmotnost a metabolismus."}'::jsonb, '{}'::jsonb),
    ('fb11059d-6546-4c61-b413-8b79277338cc', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 29, '{"text": "Pokud máš dlouhodobou výraznou únavu, nevysvětlitelné změny hmotnosti, zimomřivost, změny cyklu nebo jiné zdravotní potíže, neřeš je jen úpravou kalorií. Zvaž návštěvu lékaře."}'::jsonb, '{}'::jsonb),
    ('11c2ccc9-a2d9-415c-8cfb-ce50d9b022a5', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 30, '{"text": "Jak číslo použít prakticky", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('8964a21b-0973-429e-bd82-52c8c9df4168', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'numbered_list', 31, '{"items": [{"title": "", "text": "Spočítej orientační BMR."}, {"title": "", "text": "Odhadni celkový denní výdej podle běžné aktivity."}, {"title": "", "text": "Pro hubnutí zvol mírný deficit, ne příjem automaticky na úrovni BMR."}, {"title": "", "text": "Sleduj několik týdnů průměrnou hmotnost, obvody, hlad a energii."}, {"title": "", "text": "Podle vývoje odhad uprav."}]}'::jsonb, '{}'::jsonb),
    ('aa178686-483b-4cbe-bff7-9c8f839183f4', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'cta', 32, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('630c35eb-f5b4-4c88-b68f-b5f9b99a4ccf', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'heading', 33, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c1b6d81f-59dd-4125-a096-ac47da4245f0', '2b44d54a-a095-4488-bba2-e273ef66dfcd', 'paragraph', 34, '{"text": "Bazální metabolismus je energie potřebná pro základní fungování těla v klidu. Je důležitou součástí výpočtu, ale není to automaticky množství, které máš jíst. Pro hubnutí potřebuješ znát přibližný celkový výdej a pracovat s realistickým deficitem. Výsledek kalkulačky ber jako start, který ověřuješ podle svého těla a vývoje v čase."}'::jsonb, '{}'::jsonb),
    ('5fbc175f-8a10-442e-a7e5-67c28e0e8d00', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 1, '{"text": "Zdravá večeře nemusí být salát bez chuti ani složitý recept, kvůli kterému strávíš hodinu v kuchyni. Dobrá večeře má hlavně zapadnout do tvého dne, dodat tělu potřebné živiny a zasytit tě tak, abys večer neměla potřebu neustále něco dojíst."}'::jsonb, '{}'::jsonb),
    ('8bde9c6f-681d-481f-8c1f-ee761856020b', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 2, '{"text": "Při hubnutí není nutné přestat jíst po šesté hodině. Důležitější je celkový příjem, skladba dne a množství, které odpovídá tvým potřebám. Klidně si dej teplou i studenou zdravou večeři. Vybírej podle času, hladu a toho, co už jsi během dne jedla, a pokud tě večer láká spíš nájezd na lednici, mrkni na to, [jak přestat večer vyjídat ledničku](/blog/jak-prestat-vecer-vyjidat-lednicku)."}'::jsonb, '{}'::jsonb),
    ('47db53b8-375a-4ce5-b305-43677f0702c0', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 3, '{"text": "Jak má vypadat zdravá večeře", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3641dd8c-6ebe-4285-b08c-7582bebe1833', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 4, '{"text": "Praktické vodítko je jednoduché: vyber zdroj bílkovin, přidej zeleninu nebo ovoce a podle hladu doplň sacharidovou přílohu a trochu tuku. Nemusí být v každém jídle všechno dokonale odměřené."}'::jsonb, '{}'::jsonb),
    ('eb09926f-ff2f-4b80-890d-b09eb288187c', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'bullet_list', 5, '{"items": ["Bílkoviny: vejce, maso, ryba, tvaroh, skyr, tofu, luštěniny nebo sýr.", "Zelenina: čerstvá, pečená, dušená, mražená nebo v polévce.", "Příloha: pečivo, brambory, rýže, kuskus, těstoviny nebo tortilla.", "Tuk: olej, ořechy, semínka, avokádo nebo tuk přirozeně obsažený v potravinách."]}'::jsonb, '{}'::jsonb),
    ('26fbdf73-34ca-44a9-a9b4-107010800053', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 6, '{"text": "20 nápadů na rychlou zdravou večeři", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('074d4557-2096-4a6a-9d7e-6585b87fa3a5', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 7, '{"text": "1. Omeleta se zeleninou a pečivem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('0a877867-ab2d-4623-adbe-26b54985c851', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 8, '{"text": "Vejce prošlehej, přidej mraženou nebo čerstvou zeleninu a opeč na pánvi. Podávej s krajícem kvalitního pečiva. Když máš větší hlad, přidej cottage nebo šunku."}'::jsonb, '{}'::jsonb),
    ('3a46d2fd-b21a-4298-8e1d-2ca8e514a0d2', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 9, '{"text": "2. Cottage miska s pečivem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('7d3af294-f91c-4635-ab26-1f1e87e69fa9', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 10, '{"text": "Cottage promíchej s rajčaty, okurkou, jarní cibulkou a bylinkami. Přidej pečivo a několik oliv. Za pár minut máš studenou zdravou večeři s bílkovinami."}'::jsonb, '{}'::jsonb),
    ('33495e6a-d8cd-4aab-8c47-250be58fb441', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 11, '{"text": "3. Tortilla s kuřecím masem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5812fe44-f89b-47ff-bd15-7ec7118693e5', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 12, '{"text": "Do celozrnné tortilly dej hotové kuřecí maso, zeleninu, jogurtový dresink a trochu sýra. Využít můžeš i maso, které zbylo od oběda."}'::jsonb, '{}'::jsonb),
    ('8043b2ac-98d1-478d-8f1b-4cb2a25d9b8e', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 13, '{"text": "4. Zapečený chléb se šunkou a sýrem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('4e8262ab-4d4e-49a9-bc2b-30e1841c94ab', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 14, '{"text": "Pečivo oblož kvalitní šunkou, sýrem a zeleninou, krátce zapeč. Přidej velkou zeleninovou přílohu."}'::jsonb, '{}'::jsonb),
    ('4941584f-7b12-4ca1-88b4-44c7ce65d0d7', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 15, '{"text": "5. Tuňákový salát s bramborami", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5b3cde89-9297-4c8f-9b57-bfb579ae88bd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 16, '{"text": "Smíchej tuňáka ve vlastní šťávě, vařené brambory, zelené fazolky, rajčata a jogurtovo-hořčičný dresink."}'::jsonb, '{}'::jsonb),
    ('d8abd0b7-ffb6-401f-9371-0f0be8012812', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 17, '{"text": "6. Tvarohová pomazánka", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('383f397e-5df5-4db0-a1e0-699527c64d12', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 18, '{"text": "Tvaroh ochuť solí, pepřem, bylinkami a trochou hořčice. Namaž na pečivo a doplň zeleninou. Pro jinou chuť přidej vejce nebo tuňáka."}'::jsonb, '{}'::jsonb),
    ('9811293b-aed7-4b78-946f-f50eab1c2829', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 19, '{"text": "7. Losos s bramborami a zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c1ce54b2-6ae0-45ae-9dcc-57a536e6d7aa', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 20, '{"text": "Filet lososa upeč nebo připrav v horkovzdušné fritéze. Podávej s bramborami a zeleninou. Aktivní příprava zabere jen několik minut."}'::jsonb, '{}'::jsonb),
    ('74fad9d7-4505-46de-804c-6f1d472ece7c', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 21, '{"text": "8. Čočkový salát s fetou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f4937e43-f7d4-4668-a49f-3429594fa26d', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 22, '{"text": "Použij předvařenou čočku, přidej zeleninu, trochu fety a jednoduchou zálivku. Luštěniny dodají vlákninu i bílkoviny."}'::jsonb, '{}'::jsonb),
    ('dcaa6ac9-81c5-4693-9376-5d56bb10c8fe', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 23, '{"text": "9. Kuskus s kuřetem a zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('bcf32017-a5da-46f6-8159-5db15226a407', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 24, '{"text": "Kuskus stačí zalít horkou vodou. Přidej hotové maso, zeleninu a jogurtový dip. Ideální večeře, když nechceš vařit přílohu."}'::jsonb, '{}'::jsonb),
    ('ed53e43d-a150-4ffc-85ad-3d0d88280f4a', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 25, '{"text": "10. Míchaná vejce se žampiony", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('0903522e-7a63-4534-b2a4-94bf2f21d498', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 26, '{"text": "Na pánvi opeč žampiony, přidej vejce a podávej s pečivem nebo vařenými bramborami. Zeleninu dej přímo do jídla nebo vedle."}'::jsonb, '{}'::jsonb),
    ('ea0e0dcf-e49d-4ee6-b173-efaf190dd01c', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 27, '{"text": "11. Skyr naslano", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3c022649-a101-4165-8afb-44df34792349', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 28, '{"text": "Skyr ochuť bylinkami, solí a pepřem. Přidej zeleninu, pečivo a semínka. Rychlá varianta pro večer, kdy se ti nechce zapínat sporák."}'::jsonb, '{}'::jsonb),
    ('dab679a7-74f4-4143-89a0-84555c6f7046', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 29, '{"text": "12. Kuřecí pánev s mraženou zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('bf6a2322-2f21-45ec-9d04-06affa1b87ff', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 30, '{"text": "Na pánvi připrav kuřecí kousky a sáček mražené zeleniny. Přidej sójovou omáčku a porci rýže nebo nudlí."}'::jsonb, '{}'::jsonb),
    ('8fd471d9-9d72-4908-bf40-623a3989b5bc', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 31, '{"text": "13. Pečené brambory s tvarohem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('691ece92-ba33-45ab-872b-fb211625e26b', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 32, '{"text": "Brambory upeč v troubě nebo fritéze, podávej s ochuceným tvarohem a zeleninovým salátem."}'::jsonb, '{}'::jsonb),
    ('3c66fcd2-5333-4a0a-a0ac-0bbfe1ddec02', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 33, '{"text": "14. Tofu se zeleninou a rýží", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3a1108fd-f799-40b3-9923-154d1bac757b', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 34, '{"text": "Tofu nakrájej, opeč s kořením a zeleninou. Přidej předvařenou rýži. Jídlo můžeš snadno připravit i do krabičky na další den."}'::jsonb, '{}'::jsonb),
    ('7c0b04fc-645d-4a60-b2ae-7fad00ab90cc', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 35, '{"text": "15. Rajčatová polévka s mozzarellou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('97a60392-32c8-49c7-892e-92c4b4abe028', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 36, '{"text": "Hustou rajčatovou polévku doplň mozzarellou, fazolemi nebo pečivem. Samotná řídká polévka by tě nemusela zasytit."}'::jsonb, '{}'::jsonb),
    ('a3f81e03-fd06-455c-9023-7a7d9bcaeb4a', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 37, '{"text": "16. Fazolová tortilla", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c388675b-2085-421b-b7d6-f18acb18cabd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 38, '{"text": "Rozmačkej fazole s kořením, dej je do tortilly se zeleninou, sýrem a jogurtem. Krátce opeč z obou stran."}'::jsonb, '{}'::jsonb),
    ('9d8afa11-a31f-4871-9cee-42244619f534', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 39, '{"text": "17. Řecký salát s kuřetem a pečivem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('37dc69e0-d63e-4b34-97ba-c67da2aeada5', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 40, '{"text": "Zeleninu, olivy a trochu fety doplň kuřecím masem a pečivem. Bez bílkovin a přílohy by šlo spíš o lehkou přílohu než plnohodnotnou večeři."}'::jsonb, '{}'::jsonb),
    ('ce0b2f7e-2a90-476f-bccc-b55f12d24d75', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 41, '{"text": "18. Těstovinový salát s tuňákem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('11221829-5c56-4258-85c9-15d1a3acaf23', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 42, '{"text": "Uvařené těstoviny smíchej s tuňákem, zeleninou a jogurtovým dresinkem. Připrav si rovnou dvě porce."}'::jsonb, '{}'::jsonb),
    ('8ce78b8e-780d-4abc-914c-cd9bde7a4f20', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 43, '{"text": "19. Cizrna na paprice", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('66917c9a-bd07-48f4-9f94-38de6f322823', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 44, '{"text": "Cizrnu prohřej s rajčaty, paprikou a kořením. Podávej s rýží, kuskusem nebo pečivem a lžící jogurtu."}'::jsonb, '{}'::jsonb),
    ('54e1734a-b83d-4677-8e49-6c9fa72cd6f4', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 45, '{"text": "20. Tvarohová miska nasladko", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('6864428e-98d0-49b6-a59a-d8953d6e057a', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 46, '{"text": "Tvaroh nebo skyr doplň ovocem, vločkami a trochou ořechů. Sladká večeře je v pořádku, pokud ti chutná a množství odpovídá tvému dni."}'::jsonb, '{}'::jsonb),
    ('da53b503-9f9d-4293-bcd8-24540b6bf6b6', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 47, '{"text": "Jak si vybrat večeři podle hladu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d0051298-9be2-46c5-b4a6-cebb2f0cb913', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 48, '{"text": "Po lehčím dni nebo odpolední svačině ti může stačit menší studená večeře, klidně inspirovaná tipy na [lehkou zdravou večeři](/blog/lehka-zdrava-vecere). Po náročném dni, delší chůzi nebo tréninku budeš pravděpodobně potřebovat větší porci a přílohu. Není chybou mít večer hlad. Chybou je ignorovat celý den potřeby těla a pak čekat, že tě zachrání malý salát."}'::jsonb, '{}'::jsonb),
    ('a8c6e0f3-4ff7-4bd4-bc4c-e823a62caab8', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 49, '{"text": "Co dělat, když máš po večeři pořád chuť jíst", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('eebbe0f4-71bc-4517-ac11-23a0dcb039bf', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'bullet_list', 50, '{"items": ["Zkontroluj, zda večeře obsahovala dostatek bílkovin a přiměřenou porci.", "Podívej se na celý den. Možná jsi měla příliš malou snídani nebo oběd.", "Rozliš hlad od zvyku jíst u televize.", "Když je to skutečný hlad, dej si plánovanou druhou večeři, například skyr s ovocem.", "Nevytvářej zákaz jídla po určité hodině jen proto, že hubneš."]}'::jsonb, '{}'::jsonb),
    ('1b0b3bf3-b393-489d-8e2d-8b7034ba450a', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'cta', 51, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('32d39300-3780-4787-892e-7c093374f2a5', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'heading', 52, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('1204aa15-e6a5-4ed3-9cef-46673ad83685', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', 'paragraph', 53, '{"text": "Zdravá večeře má být především normální a sytá. Nemusíš vyřadit pečivo, sacharidy ani teplé jídlo. Vyber bílkovinu, přidej zeleninu a podle hladu vhodnou přílohu. Když bude večeře chutnat a půjde rychle připravit, je mnohem větší šance, že u ní zůstaneš i v běžném týdnu."}'::jsonb, '{}'::jsonb),
    ('76de4066-6e48-4f70-883a-4dfac3984e52', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 1, '{"text": "Jídelníček na hubnutí pro ženy nemusí obsahovat zvláštní dietní potraviny ani pět krabiček, které musíš sníst přesně na minutu. Má ti dát strukturu, dostatek jídla a jistotu, že se během dne nemusíš spoléhat jen na vůli."}'::jsonb, '{}'::jsonb),
    ('3e8596a6-8f32-4ed1-a3a1-8f05b95142be', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 2, '{"text": "Dobře poskládaný den pomáhá omezit večerní hlad, chutě na sladké i chaotické dojídání. Neexistuje jeden univerzální jídelníček, který bude stejně fungovat ženě v kanceláři, mamince na rodičovské a ženě pracující ve směnách. Principy ale mohou být podobné."}'::jsonb, '{}'::jsonb),
    ('1055538d-5cc9-4efa-b7da-670fad22912f', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 3, '{"text": "Co má jídelníček na hubnutí splnit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e6f83727-6424-47eb-a2b7-9034c8df3239', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'bullet_list', 4, '{"items": ["Odpovídat přibližně tvému energetickému příjmu.", "Obsahovat dostatek bílkovin a vlákniny.", "Rozložit jídlo tak, aby ses necítila celý den hladová.", "Používat potraviny, které máš ráda a dokážeš běžně koupit.", "Počítat s prací, rodinou, návštěvami a dny bez vaření.", "Být dostatečně pružný, aby jedna změna neznamenala konec celého plánu."]}'::jsonb, '{}'::jsonb),
    ('77dfeccb-5e26-40e0-a8e7-36afe2ddbcc1', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 5, '{"text": "Kolikrát denně jíst při hubnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d393f6e9-d546-4078-a520-aca21a26de2b', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 6, '{"text": "Někomu vyhovují tři větší jídla, jiná žena potřebuje jednu nebo dvě svačiny. Počet jídel sám o sobě nerozhoduje o hubnutí. Důležité je, aby rozložení podporovalo sytost a vešlo se do celkového příjmu."}'::jsonb, '{}'::jsonb),
    ('736b2958-ce69-4a0e-b42d-ccac758f8a6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 7, '{"text": "Začni tím, co odpovídá tvému režimu. Pokud víš, že mezi obědem a večeří uplyne sedm hodin, plánovaná svačina může být lepší než snaha vydržet a následné přejedení, obzvlášť pokud řešíš, [jak jíst zdravě, když nemáš čas](/blog/jak-jist-zdrave-kdyz-nemas-cas)."}'::jsonb, '{}'::jsonb),
    ('982db783-7b03-447a-9395-49a8819acbf9', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 8, '{"text": "Jak poskládat hlavní jídlo", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('20f1f430-2f95-4c90-a566-7ad8285d8435', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 9, '{"text": "Nemusíš všechno vážit navždy. Pro orientaci si hlavní jídlo představ jako kombinaci několika částí, podobně jako v [jednoduchém jídelníčku na hubnutí](/blog/jednoduchy-jidelnicek-na-hubnuti)."}'::jsonb, '{}'::jsonb),
    ('77e18640-a60b-48f3-8e64-3fc2d2bf7c3f', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'bullet_list', 10, '{"items": ["Zdroj bílkovin: maso, ryba, vejce, mléčný výrobek, tofu nebo luštěniny.", "Příloha: brambory, rýže, těstoviny, pečivo, vločky, kuskus nebo jiný zdroj sacharidů.", "Zelenina nebo ovoce: objem, vláknina, vitaminy a pestrost.", "Přiměřené množství tuku: olej, ořechy, semínka, avokádo, sýr nebo tuk ze samotné potraviny."]}'::jsonb, '{}'::jsonb),
    ('d89fb2f9-dcec-46aa-9243-e6b8136cc89c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 11, '{"text": "Vzorový jídelníček na hubnutí na jeden den", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('256e02f0-92cf-426a-802e-b7f02c5be8df', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 12, '{"text": "Snídaně", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('06c3618a-5420-4b8f-be69-062e1abb6dc6', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 13, '{"text": "Ovesná kaše se skyrem, ovocem a trochou ořechů. Sladká snídaně nemusí znamenat málo bílkovin. Skyr nebo tvaroh pomůže, aby tě kaše zasytila déle."}'::jsonb, '{}'::jsonb),
    ('7b2c2412-fa44-4908-803d-252b7aa46785', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 14, '{"text": "Oběd", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c5d9c0af-cbf8-4f44-8e67-c53977419617', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 15, '{"text": "Kuřecí maso, pečené brambory a velká porce zeleniny s jogurtovým dipem. Běžné jídlo, které může jíst i zbytek rodiny."}'::jsonb, '{}'::jsonb),
    ('c62739b0-6065-4571-8316-714b45bfe057', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 16, '{"text": "Svačina", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3433ca61-5bf9-48ee-a034-5d2a517b86ec', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 17, '{"text": "Cottage, pečivo a zelenina nebo jogurt s ovocem. Svačinu zařaď podle délky mezery, hladu a celkového příjmu."}'::jsonb, '{}'::jsonb),
    ('085104c2-6bb7-4b21-9ced-27809fbac2fc', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 18, '{"text": "Večeře", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c0518701-50b2-46f8-b55f-3bd7c0f38dea', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 19, '{"text": "Tortilla s tuňákem, zeleninou, jogurtovým dresinkem a trochou sýra. Večeře může obsahovat přílohu. Není nutné jíst jen salát."}'::jsonb, '{}'::jsonb),
    ('cce5249d-9646-4a2c-abbd-8d54c6209bde', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'info_box', 20, '{"title": "Důležité", "text": "Vzor ukazuje skladbu, ne přesné porce. Stejná jídla mohou být pro jednu ženu málo a pro jinou příliš. Rozhoduje konkrétní množství a potřeby těla.", "variant": "neutral"}'::jsonb, '{}'::jsonb),
    ('60d13c65-7738-4c5f-9d7c-01a191a21c1d', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 21, '{"text": "Jak upravit jídelníček, když nemáš čas vařit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('32e421e6-c417-40fc-940d-2be1ffd0ecc2', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'bullet_list', 22, '{"items": ["Vař dvě až tři porce a část odlož na další den.", "Používej mraženou zeleninu, luštěniny a rychlé přílohy.", "Měj doma vejce, skyr, cottage, tuňáka, kvalitní pečivo a ovoce.", "Kombinuj domácí základ s hotovou součástí, například pečené kuře se salátem a pečivem.", "Nečekej na dokonalou přípravu. Jednoduché jídlo je lepší než několik hodin hladovění."]}'::jsonb, '{}'::jsonb),
    ('888d1501-424b-4aa4-9393-f79fa79f7f83', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 23, '{"text": "Jak vařit pro rodinu a zároveň hubnout", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f0fce156-3b7f-49f9-a133-a13bc0f02321', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 24, '{"text": "Nemusíš vařit dvě různá jídla. Často stačí upravit poměr na talíři. Rodina může mít stejné maso, přílohu i zeleninu, jen každý dostane množství odpovídající svým potřebám. U energeticky bohatých omáček a smažených jídel můžeš změnit způsob přípravy nebo velikost porce, ne celé rodinné menu."}'::jsonb, '{}'::jsonb),
    ('1448ed12-afc3-4641-9321-c70dc9e40e45', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 25, '{"text": "Co dělat s chutí na sladké", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('9891ff9e-6420-404b-acf6-7c5395ffb6cb', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 26, '{"text": "Nejdřív zkontroluj, zda jídelníček není příliš malý. Chuť na sladké večer často přichází po dni, kdy chyběla snídaně, oběd byl jen salát a svačina se nestihla. Sladké může být součástí jídelníčku, ale je lepší plánovat ho než čekat, až únava rozhodne za tebe."}'::jsonb, '{}'::jsonb),
    ('de00b52d-d25b-4f93-ba51-41c7010b9a3b', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 27, '{"text": "Nejčastější chyby v jídelníčku na hubnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e07b9a93-ee7d-40aa-87dc-f57c084ad687', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'numbered_list', 28, '{"items": [{"title": "", "text": "Příliš malé porce přes den a velký hlad večer."}, {"title": "", "text": "Málo bílkovin, protože většinu jídel tvoří jen pečivo, ovoce nebo zelenina."}, {"title": "", "text": "Úplné vyřazení oblíbených potravin a následný pocit selhání."}, {"title": "", "text": "Jídelníček plný receptů, na které není čas ani chuť."}, {"title": "", "text": "Stejné porce bez ohledu na pohyb, hlad a individuální příjem."}, {"title": "", "text": "Snaha dodržet plán dokonale místo dlouhodobě dostatečně dobře."}]}'::jsonb, '{}'::jsonb),
    ('5ee28e88-8489-4136-8997-8775a7f1674c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 29, '{"text": "Jak poznat, že je jídelníček nastavený dobře", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('23e3d66b-aac4-4067-9fa3-efbf4294d0e0', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'bullet_list', 30, '{"items": ["Většinu dne máš zvládnutelný hlad a energii.", "Nemyslíš neustále na jídlo.", "Dokážeš jídelníček dodržovat i v pracovním týdnu.", "Víš, čím jednotlivá jídla nahradit.", "Hmotnost nebo obvody se v delším období postupně mění.", "Po odchylce se vrátíš k dalšímu běžnému jídlu bez trestání."]}'::jsonb, '{}'::jsonb),
    ('45e38a10-5884-4231-8a61-5024ffc70a29', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'cta', 31, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('d00ad254-a7a3-4822-9630-c7a80ff6f269', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'heading', 32, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('9d647920-eff4-4338-885e-da1547c81f07', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'paragraph', 33, '{"text": "Jídelníček na hubnutí pro ženy má být individuální hlavně v množství a přizpůsobení režimu. Základ tvoří plnohodnotná jídla, dostatek bílkovin, zelenina, vhodné přílohy a realistické rozložení dne. Čím méně rozhodování a zbytečných zákazů jídelníček vyžaduje, tím větší šanci má fungovat dlouhodobě."}'::jsonb, '{}'::jsonb),
    ('ace0574a-a4a0-48a7-ade5-85db9de03535', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 1, '{"text": "Rychlý zdravý oběd do práce nemusí znamenat suché kuře s rýží pětkrát týdně. Potřebuješ hlavně jídla, která se snadno připraví, dobře přenesou a zasytí tě na celé odpoledne."}'::jsonb, '{}'::jsonb),
    ('ccc49599-4809-4833-b540-02ff1965cc0b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 2, '{"text": "Když oběd vynecháš nebo ho nahradíš kávou a malou sušenkou, večerní hlad není překvapení. Připravená krabička ti šetří nejen čas a peníze, ale také rozhodování ve chvíli, kdy už máš hlad, hlavně v dnech, kdy [nestíháš vařit](/blog/co-jist-kdyz-nestiham)."}'::jsonb, '{}'::jsonb),
    ('d531f98e-a7c6-4c10-a0b2-53b81ea477db', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 3, '{"text": "Co má obsahovat zdravý oběd do práce", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('4662e063-8cf4-4c50-bb68-54e973bec19a', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'bullet_list', 4, '{"items": ["Bílkovinu, která pomůže se sytostí.", "Přílohu v množství odpovídajícím tvému příjmu a aktivitě.", "Zeleninu, která přidá objem a pestrost.", "Trochu tuku nebo omáčku, aby jídlo nebylo suché a nechutné.", "Suroviny, které vydrží transport a případné ohřívání."]}'::jsonb, '{}'::jsonb),
    ('19647f84-976c-4c9b-9d84-0bd954ce0377', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 5, '{"text": "15 nápadů na rychlý zdravý oběd", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e6787ed6-e9a6-4dca-82e8-11cc0c21b5ac', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 6, '{"text": "1. Kuřecí kuskus se zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d92babe7-7b80-4336-a7db-87bd98fa5f60', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 7, '{"text": "Kuskus zalij horkou vodou, přidej kuřecí maso, zeleninu a jogurtový dresink. Využít můžeš maso z předchozí večeře."}'::jsonb, '{}'::jsonb),
    ('09206c78-b373-4b67-84a4-15a6c2e5a1fd', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 8, '{"text": "2. Těstovinový salát s tuňákem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('fc33a49a-0c1a-4c1f-b338-508cb5307723', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 9, '{"text": "Těstoviny smíchej s tuňákem, kukuřicí, rajčaty, okurkou a jogurtovým dresinkem. Chutná i studený."}'::jsonb, '{}'::jsonb),
    ('3483dcc5-7a03-4d63-8867-e945cd20f3cf', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 10, '{"text": "3. Rýžová miska s tofu", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3cf0de75-b53b-4235-b6d9-8843c9188ab2', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 11, '{"text": "Opečené tofu, rýže, mražená zelenina a sójová omáčka vytvoří jednoduchý oběd bez masa."}'::jsonb, '{}'::jsonb),
    ('678c5c10-bef3-4346-b172-1e0e9392cd30', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 12, '{"text": "4. Pečené kuře s bramborami", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('068b59e1-908e-42d2-8aea-d649815485a2', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 13, '{"text": "Na jeden plech dej kuřecí maso, brambory a zeleninu. Připravíš několik porcí najednou a ušetříš nádobí."}'::jsonb, '{}'::jsonb),
    ('61f919aa-b5d1-4e09-a953-3a44fd657aca', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 14, '{"text": "5. Čočkový salát s vejcem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('bbc9fbf6-6079-4de9-8fa7-6e10dd4e2c9b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 15, '{"text": "Předvařenou čočku doplň vejcem, zeleninou a hořčičnou zálivkou. Je sytý, levný a dobře se přenáší."}'::jsonb, '{}'::jsonb),
    ('9d1b84ef-4482-4716-a293-5b6ad1f4c06f', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 16, '{"text": "6. Tortilla s krůtí šunkou a cottage", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5ed61e52-d9dc-4b3a-ac6e-d7e2a9380444', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 17, '{"text": "Tortillu naplň cottage, kvalitní šunkou a zeleninou. Zabal ji zvlášť, pokud nechceš, aby zvlhla."}'::jsonb, '{}'::jsonb),
    ('04eebd13-ff35-4f29-8f35-5be39ada9c2a', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 18, '{"text": "7. Chilli s fazolemi", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('cb1a172a-d388-464a-94ad-08bff2e7349a', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 19, '{"text": "Rajčata, fazole, kukuřice a mleté maso nebo sójový granulát. Uvař větší hrnec a část zamraz."}'::jsonb, '{}'::jsonb),
    ('903e234f-7099-444b-9fc5-5941d8224ad4', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 20, '{"text": "8. Bulgur s kuřetem a fetou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('46d8990e-3a12-4e33-a426-e6f27fef21dc', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 21, '{"text": "Bulgur doplň kuřecím masem, pečenou zeleninou a trochou fety. Hodí se i jako studený salát."}'::jsonb, '{}'::jsonb),
    ('c2246b05-88e4-4dff-afc5-cb8ecf623f6b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 22, '{"text": "9. Rizoto z mražené zeleniny", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5b87d928-e216-4694-8670-9ae74899b98b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 23, '{"text": "Rýži, zeleninu a maso nebo tofu připrav v jedné pánvi. Mražená zelenina výrazně zkrátí práci."}'::jsonb, '{}'::jsonb),
    ('a8e44cfc-e427-4f89-92b6-ab20fdd9e120', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 24, '{"text": "10. Bramborový salát s jogurtem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('2f1a44cb-be01-4498-befa-a140afd50abe', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 25, '{"text": "Vařené brambory smíchej s vejcem, zeleninou a jogurtovo-hořčičným dresinkem."}'::jsonb, '{}'::jsonb),
    ('96bf4d25-500d-4a77-8079-a85874634700', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 26, '{"text": "11. Kuřecí kari s rýží", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('88c6d6bb-bd28-4d7b-b48c-a7e39647069b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 27, '{"text": "Kuřecí maso, zelenina, kari koření a lehká omáčka. Připrav rovnou několik porcí."}'::jsonb, '{}'::jsonb),
    ('3a41d6db-feb6-4fda-b7ab-23aa5acdb0be', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 28, '{"text": "12. Cizrnová miska", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e59b1273-ae87-4f97-9dc9-c6665e1c0159', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 29, '{"text": "Cizrnu doplň kuskusem, zeleninou a jogurtovým dipem. Pro vyšší sytost přidej vejce nebo sýr."}'::jsonb, '{}'::jsonb),
    ('3f701b31-e425-4ee8-bcb2-896e9fb049a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 30, '{"text": "13. Losos s bramborami", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('7137fb70-c51a-4483-8b76-73e4c9a297ff', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 31, '{"text": "Pečený losos, brambory a zelené fazolky jsou jednoduché a chutnají i po ohřátí."}'::jsonb, '{}'::jsonb),
    ('b336d2f6-f941-45ac-ae06-21188715d767', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 32, '{"text": "14. Wrap s kuřetem a zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('a0c8f9b7-2ad7-4ee5-b4d2-1387cb0cb26b', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 33, '{"text": "Kuře, zelenina a jogurtový dresink v tortille. Příprava je rychlá, když máš maso hotové dopředu."}'::jsonb, '{}'::jsonb),
    ('204c4f12-e23a-467b-a8c2-21f1fe06fd44', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 34, '{"text": "15. Zapečené těstoviny", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('713e4cd3-1fe2-4ae4-a895-cc809e1b4544', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 35, '{"text": "Těstoviny zapeč s kuřetem nebo tuňákem, zeleninou a sýrem. Dobře se porcuje a několik dní vydrží v lednici."}'::jsonb, '{}'::jsonb),
    ('67722a78-a75f-4b18-9b7f-d16d6e2fc9bf', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 36, '{"text": "Jak připravit obědy na více dní", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('8dd5b892-8ef1-47d3-8c3b-8ec071b54803', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'numbered_list', 37, '{"items": [{"title": "", "text": "Vyber jednu bílkovinu, například kuře, tofu nebo luštěniny."}, {"title": "", "text": "Připrav dvě přílohy, aby obědy nebyly každý den stejné."}, {"title": "", "text": "Použij dvě různé zeleninové kombinace nebo omáčky."}, {"title": "", "text": "Rozděl jídlo do krabiček až po vychladnutí."}, {"title": "", "text": "Část porcí dej do lednice a část podle potřeby zamraz."}]}'::jsonb, '{}'::jsonb),
    ('342a18f7-8882-4c9c-86f7-523b6c64e4ab', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 38, '{"text": "Co mít v práci jako záchranu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c2a00c93-253d-4cf4-bf5d-b58f21591084', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 39, '{"text": "Ani nejlepší plán nevyjde vždy. V práci se hodí mít několik trvanlivých nebo snadno dostupných možností: tuňáka, celozrnné krekry, ořechy v malé porci, proteinový nebo běžný jogurt v lednici, instantní kuskus, luštěninovou konzervu či polévku s rozumným složením, podobně jako v tipech na [zdravé svačiny do práce](/blog/zdrave-svaciny-do-prace)."}'::jsonb, '{}'::jsonb),
    ('87dd0d9b-6345-40ae-9739-ddcb09ca712f', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 40, '{"text": "Záchranné jídlo nemusí být dokonalé. Má zabránit tomu, abys do večera nejedla a pak přijela domů s pocitem, že sníš cokoliv."}'::jsonb, '{}'::jsonb),
    ('e25a84ff-0f1e-4872-b6d8-ce2bc080e324', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 41, '{"text": "Nejčastější chyba: příliš lehký oběd", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('2ac7a18e-0f74-4471-9b98-0ef1e950447e', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 42, '{"text": "Zeleninový salát bez bílkovin a přílohy může vypadat zdravě, ale často nevydrží na celé odpoledne. Pokud po obědě pravidelně hledáš sladké, zkontroluj nejdřív množství jídla, bílkoviny a sacharidovou přílohu."}'::jsonb, '{}'::jsonb),
    ('0c8d1363-f575-4b98-82ac-6f373f501eca', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'cta', 43, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('331d8dcc-4f03-420c-9bc0-b3341b8386c2', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'heading', 44, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('2298a6ba-d85b-4ef6-bbde-3a56f7db2528', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'paragraph', 45, '{"text": "Rychlý zdravý oběd do práce má být praktický, přenositelný a sytý. Nejvíc času ušetříš, když připravíš více porcí, využiješ hotové základy a nebudeš se bát jednoduchých kombinací. Krabička nemusí vypadat jako z kuchařky. Stačí, když ti pomůže normálně se najíst a pokračovat v dni bez vlčího hladu."}'::jsonb, '{}'::jsonb),
    ('8bc92cfe-8c60-431f-a745-865b3a1bc331', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 1, '{"text": "Jednoduchý jídelníček na hubnutí nemusí obsahovat potraviny, které běžně nejíš, ani recepty s dlouhým seznamem surovin. Hubnout můžeš s pečivem, bramborami, rýží, těstovinami, vejci, masem, mléčnými výrobky, luštěninami i oblíbeným sladkým."}'::jsonb, '{}'::jsonb),
    ('c56d6301-c766-4fd2-8985-68c51c6970a2', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 2, '{"text": "Rozhoduje množství a skladba celého dne. Proto ber následující jídelníček jako inspiraci, ne jako univerzální přesný plán pro každou ženu. Porce je potřeba přizpůsobit tvému příjmu, hladu, pohybu a zdravotnímu stavu, podobně jako v [jídelníčku na hubnutí pro ženy](/blog/jidelnicek-na-hubnuti-pro-zeny)."}'::jsonb, '{}'::jsonb),
    ('6c597727-ec59-42d3-852b-e204b9cebb7a', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 3, '{"text": "Zásady jednoduchého jídelníčku", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('368ba9fe-97e6-49f8-b606-258d13891673', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'bullet_list', 4, '{"items": ["Opakuj suroviny, ale měň jejich kombinace.", "Vař více porcí a využívej zbytky.", "Měj v každém hlavním jídle zdroj bílkovin.", "Nevynechávej přílohy jen proto, že hubneš.", "Používej mraženou zeleninu a předvařené luštěniny.", "Plánuj podle svého týdne, ne podle ideálního dne na internetu."]}'::jsonb, '{}'::jsonb),
    ('f8cd965e-e09a-4c24-8cc9-cc5dcc5dc586', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 5, '{"text": "Jednoduchý jídelníček na hubnutí na 7 dní", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('6ff7115d-c9bc-4f0a-ba55-706f7748e7e6', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 6, '{"text": "1. Pondělí", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('ce41898e-0a61-4dd5-8216-f610e3e9fd3a', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 7, '{"text": "Snídaně: ovesná kaše se skyrem a ovocem. Oběd: kuřecí maso, brambory a zelenina. Svačina: cottage s pečivem. Večeře: omeleta se zeleninou a pečivem."}'::jsonb, '{}'::jsonb),
    ('e1ad4646-6479-44a5-9065-139f1a7910a5', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 8, '{"text": "2. Úterý", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3454c2f7-9c4b-432f-9c6e-49b37bad960c', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 9, '{"text": "Snídaně: vejce, pečivo a zelenina. Oběd: zbylé kuře s kuskusem a zeleninou. Svačina: jogurt s ovocem. Večeře: tortilla s tuňákem, zeleninou a jogurtovým dresinkem."}'::jsonb, '{}'::jsonb),
    ('767939d3-4fd1-49da-b9d1-f9751da9739e', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 10, '{"text": "3. Středa", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c9af1032-cade-4f6b-9761-206b4965eac8', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 11, '{"text": "Snídaně: tvaroh s ovocem, vločkami a ořechy. Oběd: těstovinový salát s tuňákem. Svačina: ovoce a skyr. Večeře: pečené brambory s tvarohovým dipem a salátem."}'::jsonb, '{}'::jsonb),
    ('8ad435ea-1468-4626-8534-cafee19ef566', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 12, '{"text": "4. Čtvrtek", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('25aff94d-7ae6-4db1-af6f-cda5ba78dbed', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 13, '{"text": "Snídaně: pečivo s cottage a šunkou. Oběd: čočkový salát s vejcem a zeleninou. Svačina: jogurt nebo kefír. Večeře: kuřecí pánev s mraženou zeleninou a rýží."}'::jsonb, '{}'::jsonb),
    ('4987a940-59a5-45c8-b21c-08fe3955048b', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 14, '{"text": "5. Pátek", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('7615854e-2694-439b-aa56-e6e2a0e3fef5', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 15, '{"text": "Snídaně: overnight oats s jogurtem a ovocem. Oběd: zbytek kuřecí pánve. Svačina: tvarohový dezert nebo skyr. Večeře: zapečený chléb se šunkou, sýrem a zeleninou."}'::jsonb, '{}'::jsonb),
    ('7f9e069f-1c0f-45ce-bf4f-2520fb27ef71', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 16, '{"text": "6. Sobota", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('cca7c58b-df36-43ad-8a12-da5930f5d03d', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 17, '{"text": "Snídaně: míchaná vejce, pečivo a zelenina. Oběd: rodinné jídlo upravené velikostí porce, například pečené maso, brambory a salát. Svačina podle hladu. Večeře: řecký salát s kuřetem a pečivem."}'::jsonb, '{}'::jsonb),
    ('846a3afa-28f7-44cd-b6ae-dff3342a1832', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 18, '{"text": "7. Neděle", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('900cef96-13da-43bf-94be-e88dc32199cc', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 19, '{"text": "Snídaně: lívance z vloček a tvarohu s ovocem. Oběd: těstoviny s rajčatovou omáčkou, mletým masem a zeleninou. Svačina: ovoce a jogurt. Večeře: polévka doplněná vejcem, sýrem nebo pečivem."}'::jsonb, '{}'::jsonb),
    ('e4615d7e-3ca0-4466-a8d0-90a027663e0e', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'info_box', 20, '{"title": "Porce nejsou schválně uvedené", "text": "Bez znalosti konkrétního příjmu by přesná gramáž působila odborně, ale pro řadu žen by byla špatně. Jedna žena potřebuje k obědu 150 g vařených brambor, jiná 300 g. Univerzální jídelníček není jídelníček na míru.", "variant": "neutral"}'::jsonb, '{}'::jsonb),
    ('d8171969-6c1f-496c-a21d-3f7eadf7f083', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 21, '{"text": "Nákupní seznam na týden", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('605c0946-7029-40d1-8e6c-191391eb76c2', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'bullet_list', 22, '{"items": ["Vejce, kuřecí maso, tuňák, šunka, skyr, jogurt, tvaroh a cottage.", "Brambory, rýže, těstoviny, kuskus, ovesné vločky, pečivo a tortilly.", "Čočka nebo jiné luštěniny.", "Čerstvá a mražená zelenina, ovoce.", "Ořechy, olej, sýr, bylinky, koření, hořčice a bílý jogurt na dresinky."]}'::jsonb, '{}'::jsonb),
    ('f58c2f13-e96e-4b8b-8cec-54228821c37b', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 23, '{"text": "Jak jídelníček zlevnit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f01af010-80c3-45dc-988c-90b1b580dd49', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'bullet_list', 24, '{"items": ["Střídej maso s vejci, tvarohem a luštěninami.", "Kupuj sezonní nebo mraženou zeleninu.", "Využívej jednu surovinu ve více jídlech.", "Vař z toho, co už doma máš, a plánuj před nákupem.", "Neplať za potraviny označené jako fitness, když stejnou funkci splní běžná varianta."]}'::jsonb, '{}'::jsonb),
    ('322c29bf-5dc9-4163-aa13-cadc7bd44bf1', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 25, '{"text": "Jak jídelníček přizpůsobit většímu hladu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('6c75e7f2-7e23-48f4-9049-3149eb0ee9ed', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 26, '{"text": "Nejdřív přidej zeleninu, bílkoviny nebo trochu přílohy podle toho, co v jídle chybí. Pokud máš hlad každý den, nesnaž se ho řešit jen vodou a kávou. Může být potřeba upravit celý denní příjem."}'::jsonb, '{}'::jsonb),
    ('4f2a21e9-bc2a-488b-b5fe-c086ca73449d', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 27, '{"text": "Jak do jídelníčku zařadit sladké", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f7081bcd-8cc3-4dbc-9816-212cb411492a', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 28, '{"text": "Sladké nemusíš zakázat. Můžeš si dát menší porci po plnohodnotném jídle nebo ji plánovaně zařadit do svačiny. Často funguje lépe vědomá porce než několik dnů zákazu a následné dojedení všeho, co najdeš."}'::jsonb, '{}'::jsonb),
    ('d083c9c8-e315-4e9d-8a46-f607d36ccdcb', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 29, '{"text": "Proč jídelníček někdy nefunguje, i když vypadá zdravě", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('99a454f5-a2a0-4379-9587-77fa24c58552', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'bullet_list', 30, '{"items": ["Porce jsou větší, než odpovídá příjmu, nebo naopak tak malé, že vedou k dojídání.", "Nezapočítají se oleje, nápoje, ořechy a ochutnávání.", "Přes týden je režim velmi přísný a o víkendu se úplně rozpadne.", "Jídla neodpovídají chuti ani režimu, proto je žena stále nahrazuje.", "Očekávání výsledku je rychlejší, než odpovídá zdravému tempu."]}'::jsonb, '{}'::jsonb),
    ('c5d8e28e-f99f-4262-9db6-7e7f5fe6880c', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'cta', 31, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('77037f5e-51c1-4b7f-9218-dcd62bfa3f44', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'heading', 32, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('376d5388-e880-4db8-b188-ef27014f9f8a', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', 'paragraph', 33, '{"text": "Jednoduchý jídelníček na hubnutí stojí na opakovatelných jídlech, běžných potravinách a přípravě více porcí. Nemusí být dokonale pestrý každý jednotlivý den. Důležité je, aby byl dlouhodobě vyvážený, odpovídal tvému příjmu a dokázala ses k němu vracet bez pocitu, že musíš pokaždé začít znovu, i ve dnech, kdy řešíš, [jak jíst zdravě, když nemáš čas](/blog/jak-jist-zdrave-kdyz-nemas-cas)."}'::jsonb, '{}'::jsonb),
    ('2e6fc7dc-21a2-4b90-9e14-a1c5509ec48d', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 1, '{"text": "Kolik kalorií denně jíst při hubnutí? Nejpoctivější odpověď je: záleží na tvém těle a běžném dni. Stejný příjem nemůže automaticky fungovat drobné ženě se sedavou prací i vysoké ženě, která celý den chodí a několikrát týdně cvičí."}'::jsonb, '{}'::jsonb),
    ('52ecbf61-64cf-4550-9a3a-00e82fe86085', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 2, '{"text": "Na internetu často narazíš na univerzální jídelníčky s 1 200 nebo 1 500 kcal. Číslo ale samo o sobě nic neříká, dokud ho neporovnáš se svým výdejem. Pro jednu ženu může být 1 500 kcal rozumný deficit, pro jinou příliš málo."}'::jsonb, '{}'::jsonb),
    ('623fa969-20f4-4d82-99d3-0216945cfc6d', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 3, '{"text": "Co rozhoduje o tom, kolik kalorií potřebuješ", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('a38ec263-a12d-45ba-8c65-c91240970bbc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'bullet_list', 4, '{"items": ["Věk, výška a hmotnost.", "Množství svalové a tukové tkáně.", "Běžný pohyb během dne.", "Cvičení a jeho intenzita.", "Pracovní režim, spánek, stres a zdravotní stav.", "Cíl a tempo, kterým chceš hubnout."]}'::jsonb, '{}'::jsonb),
    ('b449f586-7054-4b91-ba16-96bcf8e7a311', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 5, '{"text": "Krok 1: Odhadni svůj celkový denní výdej", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('433f9d11-b3d3-4d57-b4d2-dd5ffe363e19', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 6, '{"text": "Výpočet začíná [bazálním metabolismem](/blog/bazalni-metabolismus). Ten se následně upraví podle aktivity, aby vznikl odhad celkového denního energetického výdeje. Kalkulačka pracuje s průměrem. Neví přesně, kolik kroků uděláš zítra ani jak moc se během práce skutečně hýbeš."}'::jsonb, '{}'::jsonb),
    ('e4f0d152-f52a-4133-a4b7-0e004258b283', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 7, '{"text": "Krok 2: Vytvoř mírný kalorický deficit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('748589ea-86a0-4048-ae01-6bb5c7f65990', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 8, '{"text": "Od odhadovaného udržovacího příjmu se obvykle odečte menší část, často přibližně 10 až 20 %, čímž vznikne [kalorický deficit](/blog/kaloricky-deficit). Příklad: při odhadovaném výdeji 2 000 kcal může být výchozím bodem přibližně 1 600 až 1 800 kcal. Není to předpis. Je to rozsah, který se ověřuje podle vývoje."}'::jsonb, '{}'::jsonb),
    ('712481c1-209c-4699-bb33-9f0497a7e4e5', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 9, '{"text": "Proč není dobrý nápad automaticky jíst 1 200 kcal", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('87039ba8-99cd-4c67-ab8b-ace3582d8d87', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 10, '{"text": "Velmi nízký příjem může krátkodobě přinést rychlejší pokles váhy, ale často se zhorší hlad, únava, výkon a schopnost plán dodržet. Žena pak několik dní jí málo, večer nebo o víkendu se přejí a má pocit, že nemá disciplínu."}'::jsonb, '{}'::jsonb),
    ('4763222f-7eab-4a54-b07e-233eaeee6607', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 11, '{"text": "Problém přitom nemusí být vůle. Plán může být jednoduše příliš přísný. U hubnutí nerozhoduje, jak málo dokážeš jíst tři dny, ale co dokážeš opakovat týdny a měsíce."}'::jsonb, '{}'::jsonb),
    ('13560e6c-64a3-473b-bcb6-24542dcd49ef', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 12, '{"text": "Jak poznat správný kalorický příjem", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d9b544da-736f-4f8f-9a28-73a6b047a881', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'bullet_list', 13, '{"items": ["Hmotnost nebo obvody se v delším období postupně mění.", "Hlad je zvládnutelný a neovládá celý den.", "Máš energii na práci, běžný pohyb a případné cvičení.", "Nedochází pravidelně k večernímu nebo víkendovému přejídání.", "Jídelníček obsahuje běžná jídla a nemusíš vyřazovat celé skupiny potravin."]}'::jsonb, '{}'::jsonb),
    ('02b82a4c-f2ec-4e9d-ab35-dd320a114c93', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 14, '{"text": "Proč se váha nemění každý týden stejně", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('1b2f2c2e-1fee-4cff-9284-56e79e838895', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 15, '{"text": "I při dobře nastaveném příjmu může váha několik dnů nebo týdnů kolísat. Ovlivňuje ji voda, sůl, zásoby glykogenu, trávení, menstruační cyklus i namáhavý trénink. Proto sleduj trend, ne jednotlivé ranní číslo."}'::jsonb, '{}'::jsonb),
    ('ed99efa1-de9d-424c-87da-3eb922304a87', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 16, '{"text": "Kdy příjem upravit", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e23f902c-13ce-4285-8976-5beffa5f3e09', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 17, '{"text": "Pokud po několika týdnech nejsou vidět žádné změny, nejdřív zkontroluj přesnost zapisování a konzistenci celého týdne. Teprve potom příjem mírně sniž nebo přidej pohyb. Pokud hubneš rychle, jsi unavená a hladová, příjem může být naopak příliš nízký."}'::jsonb, '{}'::jsonb),
    ('690c1d76-3c89-4386-b4ca-a0c97f0d7a39', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 18, '{"text": "Musíš počítat kalorie navždy", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('2ae42714-91bb-41e3-a6e7-4347c6f38b92', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 19, '{"text": "Nemusíš. Počítání může být učební nástroj, díky kterému pochopíš porce a složení jídel. Někomu vyhovuje dlouhodobě, jiná žena po čase přejde na opakující se šablony jídel a orientaci podle porcí."}'::jsonb, '{}'::jsonb),
    ('510df0bf-dff3-46c0-89f5-7ba6483baad0', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 20, '{"text": "Pokud v tobě zapisování vyvolává úzkost, nutkavou kontrolu nebo zhoršuje vztah k jídlu, není vhodné tlačit na přesnost za každou cenu. V takové situaci je lepší zvolit jiný způsob vedení a případně vyhledat odbornou pomoc."}'::jsonb, '{}'::jsonb),
    ('51342883-d98e-4ee2-96e1-01ba8cf6015b', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 21, '{"text": "Příklad výchozího postupu", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('5b8f23c2-63de-49ed-bef2-09a4a7222129', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'numbered_list', 22, '{"items": [{"title": "", "text": "Spočítej orientační celkový výdej."}, {"title": "", "text": "Zvol mírný deficit, ne nejnižší možné číslo."}, {"title": "", "text": "Poskládej příjem do jídel, která tě zasytí."}, {"title": "", "text": "Sleduj nejméně několik týdnů průměrnou váhu a obvody."}, {"title": "", "text": "Uprav pouze jednu věc a znovu vyhodnoť výsledek."}]}'::jsonb, '{}'::jsonb),
    ('1ee45f46-328c-4548-9213-99cd53ea7324', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'cta', 23, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('17ad7555-e307-49e6-bc20-3f716b8beace', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'heading', 24, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('d724573d-c736-45e2-88ba-3f89e989bf01', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', 'paragraph', 25, '{"text": "Správný denní příjem kalorií při hubnutí je individuální. Vychází z celkového výdeje a měl by vytvářet mírný, dlouhodobě zvládnutelný deficit. Nevybírej číslo podle cizího jídelníčku. Použij výpočet jako start a ověřuj ho podle trendu váhy, hladu, energie a schopnosti plán skutečně žít."}'::jsonb, '{}'::jsonb),
    ('0b4a8e5e-300e-4b68-8039-3b7038676f26', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 1, '{"text": "Lehká zdravá večeře bývá často zaměňovaná za co nejmenší večeři. Salát bez bílkovin, pár plátků okurky nebo samotný jogurt ale nemusí odpovídat tomu, jak velký máš večer hlad. Výsledkem je další jídlo u televize a pocit, že jsi večeři nezvládla."}'::jsonb, '{}'::jsonb),
    ('bd98c12c-ed41-42bd-bdee-f4bd88d131d3', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 2, '{"text": "Lehká večeře má být snadno stravitelná a přiměřená tvému dni, ne nutně miniaturní. Může obsahovat pečivo, brambory i jinou přílohu. Rozhoduje množství a celková skladba, stejně jako u běžné [zdravé večeře](/blog/zdrava-vecere)."}'::jsonb, '{}'::jsonb),
    ('fb35e45e-af01-4808-b3d3-364085ad9971', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 3, '{"text": "Proč tě lehká večeře někdy nezasytí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('2275eedf-f6ae-4c30-a43c-5d87b2e00d46', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'bullet_list', 4, '{"items": ["Chybí v ní bílkoviny.", "Porce je příliš malá vzhledem k celému dni.", "Přes den jsi jedla málo a tělo dohání energii večer.", "Večeře obsahuje jen zeleninu bez přílohy a tuku.", "Jíš velmi rychle a nevnímáš sytost.", "Po večeři pokračuje naučené zobání u televize."]}'::jsonb, '{}'::jsonb),
    ('f7d3c6c7-6a04-47f7-8cc4-eaf6dde5e670', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 5, '{"text": "Jak poskládat lehkou a sytou večeři", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c54014b1-d6d8-45a4-88cc-7d6395328f13', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 6, '{"text": "Začni bílkovinou. Přidej zeleninu a podle hladu menší nebo běžnou porci přílohy. Trocha tuku zlepší chuť a může přispět k sytosti. Večeře nemusí být úplně bez sacharidů."}'::jsonb, '{}'::jsonb),
    ('87c0fafb-5bf2-4f8b-bb3c-bba84e6eb4ec', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'bullet_list', 7, '{"items": ["Bílkovina: vejce, skyr, tvaroh, cottage, kuře, ryba, tofu nebo luštěniny.", "Zelenina: salát, rajčata, okurka, pečená zelenina, zeleninová polévka.", "Příloha: pečivo, brambory, tortilla, kuskus nebo rýže.", "Tuk: lžička oleje, pár ořechů, semínka, avokádo nebo trochu sýra."]}'::jsonb, '{}'::jsonb),
    ('7f7cd50f-58a7-4168-b2d8-5a3f24ce3232', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 8, '{"text": "12 lehkých zdravých večeří", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('397e2f37-d07c-4510-9d13-629f29a9ec37', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 9, '{"text": "1. Cottage s pečivem a zeleninou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('cc864c1b-a1a5-4619-b353-8d94d71927b5', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 10, '{"text": "Rychlá studená večeře, kterou připravíš za dvě minuty. Při větším hladu přidej vejce nebo více pečiva."}'::jsonb, '{}'::jsonb),
    ('1f2401be-f268-41d7-8d4f-5c2a97eedffa', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 11, '{"text": "2. Tvarohová pomazánka", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('04ad20e0-290f-4771-a37c-39941ee7e5d2', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 12, '{"text": "Tvaroh, bylinky, hořčice, zelenina a pečivo. Množství tuku můžeš upravit podle použitého tvarohu."}'::jsonb, '{}'::jsonb),
    ('69234fa0-7609-4ff1-9ffc-6f0088791140', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 13, '{"text": "3. Omeleta se špenátem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('83f9b009-98f3-4a9f-80c8-8c9f52c79818', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 14, '{"text": "Vejce, špenát a trochu sýra. Podávej se zeleninou a podle hladu s pečivem."}'::jsonb, '{}'::jsonb),
    ('3614e1f6-77e6-4a3e-9785-26e1078e518c', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 15, '{"text": "4. Tuňákový salát s bramborami", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('0fd50f4a-8b8f-42ed-96bc-909a448d2b4b', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 16, '{"text": "Tuňák, vařené brambory, zelenina a jogurtový dresink. Lehký, ale plnohodnotný."}'::jsonb, '{}'::jsonb),
    ('cd64d89e-0ac7-40fb-92b2-5e65ad624795', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 17, '{"text": "5. Zeleninová polévka s vejcem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('858ebb2a-b15d-4811-9572-15400a1909fd', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 18, '{"text": "Polévku doplň vejcem, fazolemi nebo pečivem. Samotný vývar či zelenina často nestačí."}'::jsonb, '{}'::jsonb),
    ('197f5d3d-9403-43ca-9fc1-5968d3dad0e5', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 19, '{"text": "6. Skyr naslano", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c06955d8-d163-4f72-82b3-5fb4ace7af40', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 20, '{"text": "Skyr s bylinkami, zeleninou, pečivem a několika semínky."}'::jsonb, '{}'::jsonb),
    ('411a8eb4-cb73-4d28-95a2-32dbe56a4da0', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 21, '{"text": "7. Tortilla s kuřetem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('3a0d9846-79b5-46a8-833d-9ea1b2ff11f1', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 22, '{"text": "Menší tortilla s kuřecím masem, zeleninou a jogurtovou omáčkou."}'::jsonb, '{}'::jsonb),
    ('0614f5b6-ec9d-4309-afd4-2ae0ffc21cb3', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 23, '{"text": "8. Pečená zelenina s fetou", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('866b8047-7aa3-49c5-a678-0715210d4c6d', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 24, '{"text": "Zeleninu doplň fetou nebo cizrnou a kouskem pečiva."}'::jsonb, '{}'::jsonb),
    ('cb5929eb-b52e-4a88-ab31-59938671e931', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 25, '{"text": "9. Krevety s kuskusem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('0a7253e2-af22-4275-bfaa-9ab740b2036a', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 26, '{"text": "Krevety připravíš během několika minut. Přidej kuskus a zeleninu."}'::jsonb, '{}'::jsonb),
    ('26a3e766-7d5a-4ae6-b742-53ddd1524831', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 27, '{"text": "10. Tofu salát s rýží", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('872155db-9096-4d80-a3dc-be2c05139f9f', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 28, '{"text": "Opečené tofu, zelenina a menší porce rýže vytvoří lehkou večeři bez masa."}'::jsonb, '{}'::jsonb),
    ('ee1319aa-9baa-4fc1-95b4-d5f823a3aa82', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 29, '{"text": "11. Tvaroh s ovocem", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('c784ad87-26dd-49b8-9500-17e41873f0b5', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 30, '{"text": "Sladká varianta s vločkami nebo menší porcí ořechů. Vhodná, když ti večer vyhovuje sladké jídlo."}'::jsonb, '{}'::jsonb),
    ('4cad44be-9fa4-45e4-b745-614de42095c3', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 31, '{"text": "12. Zapečené pečivo", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('6693ec82-2b8c-4eec-b880-e7595a6e4d56', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 32, '{"text": "Pečivo se šunkou, sýrem a rajčetem krátce zapeč. Doplň salátem."}'::jsonb, '{}'::jsonb),
    ('1dcde660-d5fb-4b6a-8331-c99b79852962', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 33, '{"text": "Je nutné vynechat pečivo a sacharidy", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('68fc5dde-a039-4dcb-b6eb-257fbdc09cbe', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 34, '{"text": "Není. Sacharidy večer samy o sobě nezastaví hubnutí. Pokud se vejdou do celkového příjmu, mohou být normální součástí večeře. Problém bývá spíš množství celého dne nebo to, že se k pečivu přidá hodně energeticky bohatých potravin bez kontroly porce."}'::jsonb, '{}'::jsonb),
    ('0c174863-fdba-41f9-b826-a1e45bb20793', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 35, '{"text": "Co jíst po večerním cvičení", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('cc6c1e77-84a1-49c6-b792-ed3861370109', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 36, '{"text": "Po cvičení není potřeba večeři vynechat. Přidej bílkoviny a podle intenzity i sacharidovou přílohu. Po lehké procházce bude potřeba jiná než po silovém tréninku nebo delším sportu."}'::jsonb, '{}'::jsonb),
    ('a95bc163-c3d6-41fc-8120-c56099ebb119', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 37, '{"text": "Co dělat, když máš hlad před spaním", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f2a981bb-26d3-4f87-ae6d-3b055ce2c8e0', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 38, '{"text": "Když je hlad skutečný, dej si menší plánované jídlo. Vhodný může být skyr, jogurt s ovocem, tvaroh, pečivo s cottage nebo jiná jednoduchá kombinace. Není nutné jít spát hladová jen kvůli hodině na displeji."}'::jsonb, '{}'::jsonb),
    ('cf1e2cde-66b8-4df7-8d71-38ffc018d629', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'cta', 39, '{"url": "https://www.fitbezcasu.cz/p/jidelnicek-pro-zdrave-hubnuti", "text": "Získej jednoduchý systém, podle kterého si poskládáš jídlo bez extrémů, každodenního přemýšlení a věčného začínání znovu.", "title": "Chceš konečně vědět, co a kolik jíst?", "eyebrow": "Jídelníček", "new_window": false, "button_label": "Prohlédnout jídelníček"}'::jsonb, '{}'::jsonb),
    ('6096bb4f-06b7-4792-a714-c68c387b33c4', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'heading', 40, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e262040b-7648-4599-823c-5577a055908b', '5b0b2105-f978-476c-925e-0f4bec2f47b2', 'paragraph', 41, '{"text": "Lehká zdravá večeře má být přiměřená, chutná a sytá. Stav ji na bílkovinách, přidej zeleninu a podle hladu přílohu. Nepotřebuješ jíst co nejméně ani vyřadit sacharidy. Potřebuješ večeři, po které se cítíš dobře a která zapadá do celého dne."}'::jsonb, '{}'::jsonb),
    ('78ea4e0d-421b-4e1e-a64e-038ea0b7baa9', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 1, '{"text": "Emoční přejídání znamená, že jídlo používáš jako reakci na emoci, napětí nebo situaci, ne pouze na fyzický hlad. Může přijít po stresujícím dni, hádce, pocitu osamění, nudě, ale také při oslavě nebo jako odměna, a úzce souvisí i s tím, jak [stres ovlivňuje přejídání](/blog/stres-a-prejidani)."}'::jsonb, '{}'::jsonb),
    ('c798dedd-f7a2-419f-9619-2bb4ea4e8aae', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 2, '{"text": "Občas jí z emocí téměř každý. Problém vzniká ve chvíli, kdy se jídlo stane hlavním nebo jediným způsobem, jak zvládat nepříjemné pocity, a po jídle se přidávají výčitky, další omezení a opakování stejného cyklu."}'::jsonb, '{}'::jsonb),
    ('c1717cc7-0849-4496-8c59-ab984bc4815e', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 3, '{"text": "Jak vypadá cyklus emočního přejídání", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('56fe8d1d-e492-4a50-b6b2-b4a200fb385c', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'numbered_list', 4, '{"items": [{"title": "", "text": "Přijde náročná situace nebo emoce."}, {"title": "", "text": "Objeví se silné nutkání jíst, často konkrétní potravinu."}, {"title": "", "text": "Jídlo přinese krátkou úlevu nebo otupění."}, {"title": "", "text": "Po jídle se dostaví výčitky, stud nebo pocit ztráty kontroly."}, {"title": "", "text": "Následuje rozhodnutí jíst méně, vynechat jídlo nebo začít znovu od dalšího dne."}, {"title": "", "text": "Hlad a další emoce zvyšují pravděpodobnost, že se cyklus zopakuje."}]}'::jsonb, '{}'::jsonb),
    ('0ab43f55-5425-4486-9246-1aa1e9e8ace9', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 5, '{"text": "Proto často nepomáhá přidat další zákaz. Zpřísnění může zvýšit hlad a tlak, který celý cyklus udržuje."}'::jsonb, '{}'::jsonb),
    ('4732c03c-6cfc-4fb9-bd81-af184536fa33', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 6, '{"text": "Fyzický hlad a emoční hlad", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('e70128e6-9519-4ed2-a347-e589a16f724e', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'numbered_list', 7, '{"items": [{"title": "Nástup", "text": "Fyzický hlad: Často přichází postupně. Emoční hlad nebo chuť: Může přijít náhle po konkrétní situaci."}, {"title": "Výběr jídla", "text": "Fyzický hlad: Obvykle vyhovuje více možností. Emoční hlad nebo chuť: Často chceš jednu konkrétní potravinu."}, {"title": "Tělesné signály", "text": "Fyzický hlad: Prázdný žaludek, pokles energie, kručení. Emoční hlad nebo chuť: Napětí, neklid, nuda nebo myšlenky na odměnu."}, {"title": "Po jídle", "text": "Fyzický hlad: Hlad postupně ustupuje. Emoční hlad nebo chuť: Nutkání může pokračovat i přes plný žaludek."}, {"title": "Pocity potom", "text": "Fyzický hlad: Běžné uspokojení. Emoční hlad nebo chuť: Častěji výčitky, stud nebo lítost."}]}'::jsonb, '{}'::jsonb),
    ('671747f7-1421-4d47-9eae-8566b055d5e0', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 8, '{"text": "Tyto znaky nejsou test ani diagnóza. Fyzický a emoční hlad se mohou překrývat. Můžeš být skutečně hladová a zároveň ve stresu."}'::jsonb, '{}'::jsonb),
    ('4e047418-1efd-49b6-ac1b-a534bcf463c2', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 9, '{"text": "Jak zjistit své spouštěče", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('ddd8e343-cb08-4dc6-b803-2a1c1d0b84a7', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 10, '{"text": "Na několik dní si zkus vést jednoduchý záznam. Nezapisuj jen kalorie. Zapiš čas, místo, co se dělo před jídlem, míru hladu a emoci. Cílem není kontrolovat se, ale uvidět opakující se vzorec."}'::jsonb, '{}'::jsonb),
    ('4e67aeb6-88fa-43c4-b340-9aecfb149f30', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'bullet_list', 11, '{"items": ["Přichází nutkání po konfliktu nebo pracovním stresu?", "Objevuje se večer, když konečně zůstaneš sama?", "Předchází mu dlouhá pauza bez jídla?", "Jíš hlavně u televize, v autě nebo tajně?", "Je spouštěčem únava, nuda, osamění nebo pocit, že si něco zasloužíš?"]}'::jsonb, '{}'::jsonb),
    ('b049d434-4bcc-4709-a6c3-bce45032db90', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 12, '{"text": "Co dělat ve chvíli, kdy přijde nutkání", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('cda6e991-56f5-4d97-9c7c-852918e7f165', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 13, '{"text": "1. Vytvoř krátkou pauzu", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('879bb54a-4b7a-421d-8398-a2ceb79f7a08', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 14, '{"text": "Nemusíš si jídlo zakázat. Dej si dvě až deset minut, několikrát se nadechni a pojmenuj, co se právě děje. Pauza nevypne emoci, ale může vytvořit prostor pro vědomější rozhodnutí."}'::jsonb, '{}'::jsonb),
    ('7babe0a5-713f-4658-b37e-90fb62bbc9e9', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 15, '{"text": "2. Zkontroluj fyzický hlad", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('9548ed98-ac1e-495a-8c75-3fff96f18bf9', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 16, '{"text": "Kdy jsi naposledy jedla? Bylo jídlo dostatečné? Pokud máš hlad, dej si normální jídlo. Emoce a hlad se mohou spojit a snaha vydržet situaci zhorší."}'::jsonb, '{}'::jsonb),
    ('1d02777e-a92d-4146-b0c6-1bdf7f885d56', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 17, '{"text": "3. Vyber další způsob úlevy", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('744daf47-4d67-4c2c-ade4-b0236313e575', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 18, '{"text": "Jídlo může zůstat jednou z možností, ale potřebuješ také jiné. Krátká procházka, teplá sprcha, hudba, telefonát, psaní, dechové cvičení nebo odchod z místnosti mohou pomoci změnit průběh situace."}'::jsonb, '{}'::jsonb),
    ('3f3962d5-d324-4c75-8778-269638d48a3a', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 19, '{"text": "4. Když se rozhodneš jíst, jez vědomě", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('10cfb0aa-eb10-438e-92b3-17221ecdd595', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 20, '{"text": "Dej jídlo na talíř, sedni si a odlož telefon. Jez bez trestání a vnímej, kdy úleva nebo chuť začíná slábnout. Vědomé jídlo není záruka malé porce, ale pomáhá vystoupit z automatického režimu."}'::jsonb, '{}'::jsonb),
    ('dee953fe-f22a-4ecc-a0f0-a193518c2318', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 21, '{"text": "5. Po epizodě nevynechávej další jídlo", "level": "h3", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('ccb91283-2c35-4514-8683-fb479659c6a5', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 22, '{"text": "Trest v podobě hladovění často připraví půdu pro další přejedení. Vrať se k běžnému jídlu. Jedna epizoda nevyžaduje očistu ani extrémní cvičení, ani zbytečné [výčitky z jídla](/blog/vycitky-z-jidla)."}'::jsonb, '{}'::jsonb),
    ('e167e562-9140-494e-ae88-120dd492f193', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 23, '{"text": "Jak předcházet emočnímu přejídání", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('280cf68b-9a35-4ec6-ba0d-b8c27fc47043', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'bullet_list', 24, '{"items": ["Jez dostatečně a pravidelně podle svých potřeb.", "Nastav realistický jídelníček bez absolutních zákazů.", "Sleduj spánek a únavu, které snižují schopnost zvládat stres.", "Připrav si seznam několika jiných způsobů uklidnění.", "Řeš opakující se zdroj stresu, nejen samotné jídlo.", "Mluv o problému s někým, komu důvěřuješ."]}'::jsonb, '{}'::jsonb),
    ('acc8eb32-6190-42d7-966b-1a4d8ce576a1', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 25, '{"text": "Kdy vyhledat odbornou pomoc", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('9c2123f1-6271-4139-b685-91c570d158eb', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 26, '{"text": "Vyhledej odbornou podporu, pokud máš opakované epizody velkého množství jídla s pocitem ztráty kontroly, jíš tajně, vyvoláváš zvracení, používáš projímadla, extrémně cvičíš jako kompenzaci, dlouhodobě hladovíš nebo jídlo výrazně ovlivňuje tvůj každodenní život."}'::jsonb, '{}'::jsonb),
    ('950e7276-8724-4a5c-ae90-9bfd4102f56f', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 27, '{"text": "Vhodným prvním krokem může být praktický lékař, psycholog, psychoterapeut, psychiatr nebo specializovaný tým pro poruchy příjmu potravy. Vyhledat pomoc není selhání. Je to přesnější reakce na problém, který samotný jídelníček nemusí vyřešit."}'::jsonb, '{}'::jsonb),
    ('67ae2bfe-9349-43fa-87ed-c5d2743baaf2', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'info_box', 28, '{"title": "Když je problém hlavně ve skladbě dne", "text": "Pokud se přejídání objevuje po dnech s velmi malým příjmem, může pomoci upravit porce a rozložení jídel. Osobní zhodnocení jídelníčku ukáže, zda tě večer nedohání obyčejný nedostatek energie. Při ztrátě kontroly nebo podezření na poruchu příjmu potravy ale patří hlavní podpora odborníkovi na psychické zdraví a poruchy příjmu potravy.", "variant": "neutral"}'::jsonb, '{}'::jsonb),
    ('35dfde6a-56ce-4ca5-b4a5-2d86bd1ee4a9', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'heading', 29, '{"text": "Shrnutí", "level": "h2", "anchor": ""}'::jsonb, '{}'::jsonb),
    ('f23e24fe-3d35-439f-831a-44943ff2910d', '38333a17-c20a-4536-8785-c4b8ebd67b3e', 'paragraph', 30, '{"text": "Emoční přejídání není nedostatek charakteru. Je to naučený způsob reakce, který může krátkodobě přinést úlevu, ale dlouhodobě problém udržuje. Začni pozorováním spouštěčů, rozlišuj hlad a emoci, vytvoř pauzu a přidej další způsoby zvládání. A když máš pocit ztráty kontroly, nečekej, až bude situace horší. Odborná pomoc je na místě."}'::jsonb, '{}'::jsonb);

  -- 6. Legitimate transition draft -> ready for all 9 articles. The trigger now
  -- validates excerpt/category/author/legacy_migrated-image-exception/block
  -- presence for every row; any failure here rolls back the whole migration.
  update public.blog_articles set status = 'ready' where id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e');
  select count(*) into mismatched_count from public.blog_articles where id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e') and status = 'ready';
  if mismatched_count <> 9 then
    raise exception 'draft -> ready transition failed for % of 9 articles', 9 - mismatched_count;
  end if;

  -- 7. Legitimate transition ready -> published for all 9 articles, one second
  -- apart on published_at (see Publication timing note above), indexing_enabled
  -- flipped to true. updated_at is left to the existing set_updated_at() trigger.
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() where id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f'; -- kaloricky-deficit
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '1 seconds' where id = '2b44d54a-a095-4488-bba2-e273ef66dfcd'; -- bazalni-metabolismus
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '2 seconds' where id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c'; -- zdrava-vecere
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '3 seconds' where id = '04195582-11b5-4fe1-8a26-08b4fea157a6'; -- jidelnicek-na-hubnuti-pro-zeny
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '4 seconds' where id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88'; -- rychly-zdravy-obed-do-prace
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '5 seconds' where id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc'; -- jednoduchy-jidelnicek-na-hubnuti
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '6 seconds' where id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9'; -- kolik-kalorii-denne-pri-hubnuti
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '7 seconds' where id = '5b0b2105-f978-476c-925e-0f4bec2f47b2'; -- lehka-zdrava-vecere
  update public.blog_articles set status = 'published', indexing_enabled = true, published_at = now() - interval '8 seconds' where id = '38333a17-c20a-4536-8785-c4b8ebd67b3e'; -- emocni-prejidani

  -- 8. Verify: exactly 9 new articles, all published, with the right slugs/
  -- category/author/legacy_migrated/indexing_enabled/recommended and null image/
  -- scheduled/archived fields.
  select count(*) into mismatched_count from public.blog_articles where id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e');
  if mismatched_count <> 9 then
    raise exception 'Post-check failed: expected 9 new blog_articles rows, found %', mismatched_count;
  end if;

  if not exists (select 1 from public.blog_articles where id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f' and slug = 'kaloricky-deficit' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article kaloricky-deficit does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '2b44d54a-a095-4488-bba2-e273ef66dfcd' and slug = 'bazalni-metabolismus' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article bazalni-metabolismus does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c' and slug = 'zdrava-vecere' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article zdrava-vecere does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '04195582-11b5-4fe1-8a26-08b4fea157a6' and slug = 'jidelnicek-na-hubnuti-pro-zeny' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article jidelnicek-na-hubnuti-pro-zeny does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88' and slug = 'rychly-zdravy-obed-do-prace' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article rychly-zdravy-obed-do-prace does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc' and slug = 'jednoduchy-jidelnicek-na-hubnuti' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article jednoduchy-jidelnicek-na-hubnuti does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9' and slug = 'kolik-kalorii-denne-pri-hubnuti' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article kolik-kalorii-denne-pri-hubnuti does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '5b0b2105-f978-476c-925e-0f4bec2f47b2' and slug = 'lehka-zdrava-vecere' and category_id = '2d2519ad-ad9e-40da-9f62-f449938757c2' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article lehka-zdrava-vecere does not match expected final state';
  end if;
  if not exists (select 1 from public.blog_articles where id = '38333a17-c20a-4536-8785-c4b8ebd67b3e' and slug = 'emocni-prejidani' and category_id = 'e0e2aeb7-6895-499e-a914-54c9a14f5936' and author_id = '5c9fe7fb-ca71-40c4-ae87-5aaf9e3c6260' and status = 'published' and legacy_migrated = true and indexing_enabled = true and recommended = false and featured_image_path is null and featured_image_alt is null and scheduled_at is null and archived_at is null and published_at is not null) then
    raise exception 'Post-check failed: article emocni-prejidani does not match expected final state';
  end if;

  -- 9. Verify: exact block count per article, no duplicate position, first/last block, CTA count.
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f';
  if mismatched_count <> 38 then
    raise exception 'Post-check failed: kaloricky-deficit expected 38 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f';
  if mismatched_count <> 38 then
    raise exception 'Post-check failed: kaloricky-deficit has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'a147592d-cad1-48ab-880f-6e9b12e73748' and article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: kaloricky-deficit first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '5ff28f93-b124-40b0-8d91-40698e1df3d8' and article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f' and position = 38 and block_type = 'paragraph') then
    raise exception 'Post-check failed: kaloricky-deficit last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: kaloricky-deficit expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd';
  if mismatched_count <> 34 then
    raise exception 'Post-check failed: bazalni-metabolismus expected 34 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd';
  if mismatched_count <> 34 then
    raise exception 'Post-check failed: bazalni-metabolismus has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '59d9dc7e-aad3-4c34-b58d-e50aaa9e1861' and article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: bazalni-metabolismus first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'c1b6d81f-59dd-4125-a096-ac47da4245f0' and article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd' and position = 34 and block_type = 'paragraph') then
    raise exception 'Post-check failed: bazalni-metabolismus last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: bazalni-metabolismus expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c';
  if mismatched_count <> 53 then
    raise exception 'Post-check failed: zdrava-vecere expected 53 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c';
  if mismatched_count <> 53 then
    raise exception 'Post-check failed: zdrava-vecere has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '5fbc175f-8a10-442e-a7e5-67c28e0e8d00' and article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: zdrava-vecere first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '1204aa15-e6a5-4ed3-9cef-46673ad83685' and article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c' and position = 53 and block_type = 'paragraph') then
    raise exception 'Post-check failed: zdrava-vecere last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: zdrava-vecere expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6';
  if mismatched_count <> 33 then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny expected 33 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6';
  if mismatched_count <> 33 then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '76de4066-6e48-4f70-883a-4dfac3984e52' and article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '9d647920-eff4-4338-885e-da1547c81f07' and article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6' and position = 33 and block_type = 'paragraph') then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88';
  if mismatched_count <> 45 then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace expected 45 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88';
  if mismatched_count <> 45 then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'ace0574a-a4a0-48a7-ade5-85db9de03535' and article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '2298a6ba-d85b-4ef6-bbde-3a56f7db2528' and article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88' and position = 45 and block_type = 'paragraph') then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc';
  if mismatched_count <> 33 then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti expected 33 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc';
  if mismatched_count <> 33 then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '8bc92cfe-8c60-431f-a745-865b3a1bc331' and article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '376d5388-e880-4db8-b188-ef27014f9f8a' and article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc' and position = 33 and block_type = 'paragraph') then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9';
  if mismatched_count <> 25 then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti expected 25 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9';
  if mismatched_count <> 25 then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '2e6fc7dc-21a2-4b90-9e14-a1c5509ec48d' and article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'd724573d-c736-45e2-88ba-3f89e989bf01' and article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9' and position = 25 and block_type = 'paragraph') then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2';
  if mismatched_count <> 41 then
    raise exception 'Post-check failed: lehka-zdrava-vecere expected 41 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2';
  if mismatched_count <> 41 then
    raise exception 'Post-check failed: lehka-zdrava-vecere has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '0b4a8e5e-300e-4b68-8039-3b7038676f26' and article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: lehka-zdrava-vecere first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'e262040b-7648-4599-823c-5577a055908b' and article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2' and position = 41 and block_type = 'paragraph') then
    raise exception 'Post-check failed: lehka-zdrava-vecere last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2' and block_type = 'cta';
  if mismatched_count <> 1 then
    raise exception 'Post-check failed: lehka-zdrava-vecere expected 1 cta block(s), found %', mismatched_count;
  end if;

  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e';
  if mismatched_count <> 30 then
    raise exception 'Post-check failed: emocni-prejidani expected 30 blocks, found %', mismatched_count;
  end if;
  select count(distinct position) into mismatched_count from public.blog_article_blocks where article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e';
  if mismatched_count <> 30 then
    raise exception 'Post-check failed: emocni-prejidani has duplicate position values';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = '78ea4e0d-421b-4e1e-a64e-038ea0b7baa9' and article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e' and position = 1 and block_type = 'paragraph') then
    raise exception 'Post-check failed: emocni-prejidani first block mismatch';
  end if;
  if not exists (select 1 from public.blog_article_blocks where id = 'f23e24fe-3d35-439f-831a-44943ff2910d' and article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e' and position = 30 and block_type = 'paragraph') then
    raise exception 'Post-check failed: emocni-prejidani last block mismatch';
  end if;
  select count(*) into mismatched_count from public.blog_article_blocks where article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e' and block_type = 'cta';
  if mismatched_count <> 0 then
    raise exception 'Post-check failed: emocni-prejidani expected 0 cta block(s), found %', mismatched_count;
  end if;

  -- 10. Verify: total block count across all 9 new articles.
  select count(*) into mismatched_count from public.blog_article_blocks where article_id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e');
  if mismatched_count <> 332 then
    raise exception 'Post-check failed: expected 332 total new blocks, found %', mismatched_count;
  end if;

  -- 11. Verify: internal links. Every [text](/blog/slug) markdown link inside a
  -- paragraph block's content->>'text' is extracted per article and checked against
  -- the exact approved target-slug set: no missing target, no unexpected extra link,
  -- no self-link, no link anywhere to the excluded /blog/chut-na-sladke article.
  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '625bbc2f-2f94-4dd4-bd18-16b6b09f872f' and b.block_type = 'paragraph';
  if found_targets <> array['bazalni-metabolismus', 'co-jist-kdyz-nestiham', 'kolik-kalorii-denne-pri-hubnuti'] then
    raise exception 'Post-check failed: kaloricky-deficit internal links mismatch - expected %, found %', array['bazalni-metabolismus', 'co-jist-kdyz-nestiham', 'kolik-kalorii-denne-pri-hubnuti'], found_targets;
  end if;
  if 'kaloricky-deficit' = any(found_targets) then
    raise exception 'Post-check failed: kaloricky-deficit contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '2b44d54a-a095-4488-bba2-e273ef66dfcd' and b.block_type = 'paragraph';
  if found_targets <> array['kaloricky-deficit', 'kolik-kalorii-denne-pri-hubnuti'] then
    raise exception 'Post-check failed: bazalni-metabolismus internal links mismatch - expected %, found %', array['kaloricky-deficit', 'kolik-kalorii-denne-pri-hubnuti'], found_targets;
  end if;
  if 'bazalni-metabolismus' = any(found_targets) then
    raise exception 'Post-check failed: bazalni-metabolismus contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '0ce3b37b-a4e7-45ac-a709-b236f0563b6c' and b.block_type = 'paragraph';
  if found_targets <> array['jak-prestat-vecer-vyjidat-lednicku', 'lehka-zdrava-vecere'] then
    raise exception 'Post-check failed: zdrava-vecere internal links mismatch - expected %, found %', array['jak-prestat-vecer-vyjidat-lednicku', 'lehka-zdrava-vecere'], found_targets;
  end if;
  if 'zdrava-vecere' = any(found_targets) then
    raise exception 'Post-check failed: zdrava-vecere contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '04195582-11b5-4fe1-8a26-08b4fea157a6' and b.block_type = 'paragraph';
  if found_targets <> array['jak-jist-zdrave-kdyz-nemas-cas', 'jednoduchy-jidelnicek-na-hubnuti'] then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny internal links mismatch - expected %, found %', array['jak-jist-zdrave-kdyz-nemas-cas', 'jednoduchy-jidelnicek-na-hubnuti'], found_targets;
  end if;
  if 'jidelnicek-na-hubnuti-pro-zeny' = any(found_targets) then
    raise exception 'Post-check failed: jidelnicek-na-hubnuti-pro-zeny contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88' and b.block_type = 'paragraph';
  if found_targets <> array['co-jist-kdyz-nestiham', 'zdrave-svaciny-do-prace'] then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace internal links mismatch - expected %, found %', array['co-jist-kdyz-nestiham', 'zdrave-svaciny-do-prace'], found_targets;
  end if;
  if 'rychly-zdravy-obed-do-prace' = any(found_targets) then
    raise exception 'Post-check failed: rychly-zdravy-obed-do-prace contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = 'e4efee92-c1c6-4435-b81c-c0b6880136bc' and b.block_type = 'paragraph';
  if found_targets <> array['jak-jist-zdrave-kdyz-nemas-cas', 'jidelnicek-na-hubnuti-pro-zeny'] then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti internal links mismatch - expected %, found %', array['jak-jist-zdrave-kdyz-nemas-cas', 'jidelnicek-na-hubnuti-pro-zeny'], found_targets;
  end if;
  if 'jednoduchy-jidelnicek-na-hubnuti' = any(found_targets) then
    raise exception 'Post-check failed: jednoduchy-jidelnicek-na-hubnuti contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '4eb4f682-1625-42ea-bd90-7e19c008a1d9' and b.block_type = 'paragraph';
  if found_targets <> array['bazalni-metabolismus', 'kaloricky-deficit'] then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti internal links mismatch - expected %, found %', array['bazalni-metabolismus', 'kaloricky-deficit'], found_targets;
  end if;
  if 'kolik-kalorii-denne-pri-hubnuti' = any(found_targets) then
    raise exception 'Post-check failed: kolik-kalorii-denne-pri-hubnuti contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '5b0b2105-f978-476c-925e-0f4bec2f47b2' and b.block_type = 'paragraph';
  if found_targets <> array['zdrava-vecere'] then
    raise exception 'Post-check failed: lehka-zdrava-vecere internal links mismatch - expected %, found %', array['zdrava-vecere'], found_targets;
  end if;
  if 'lehka-zdrava-vecere' = any(found_targets) then
    raise exception 'Post-check failed: lehka-zdrava-vecere contains a self-link';
  end if;

  select coalesce(array_agg(m[1] order by m[1]), array[]::text[]) into found_targets
    from public.blog_article_blocks b, regexp_matches(b.content->>'text', '\]\(/blog/([a-z0-9-]+)\)', 'g') as m
    where b.article_id = '38333a17-c20a-4536-8785-c4b8ebd67b3e' and b.block_type = 'paragraph';
  if found_targets <> array['stres-a-prejidani', 'vycitky-z-jidla'] then
    raise exception 'Post-check failed: emocni-prejidani internal links mismatch - expected %, found %', array['stres-a-prejidani', 'vycitky-z-jidla'], found_targets;
  end if;
  if 'emocni-prejidani' = any(found_targets) then
    raise exception 'Post-check failed: emocni-prejidani contains a self-link';
  end if;

  -- Global check: no link to the excluded chut-na-sladke article anywhere in the batch.
  select count(*) into mismatched_count
    from public.blog_article_blocks b
    where b.article_id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e') and b.block_type = 'paragraph'
      and b.content->>'text' like '%](/blog/chut-na-sladke)%';
  if mismatched_count > 0 then
    raise exception 'Post-check failed: found a link to the excluded /blog/chut-na-sladke article';
  end if;

  -- 12. Verify: published_at ordering matches the approved display order exactly.
  select array_agg(slug order by published_at desc) into ordered_slugs
    from public.blog_articles where id in ('625bbc2f-2f94-4dd4-bd18-16b6b09f872f', '2b44d54a-a095-4488-bba2-e273ef66dfcd', '0ce3b37b-a4e7-45ac-a709-b236f0563b6c', '04195582-11b5-4fe1-8a26-08b4fea157a6', 'acfb0ec1-31b8-4fa6-a2a2-3282bc6d2a88', 'e4efee92-c1c6-4435-b81c-c0b6880136bc', '4eb4f682-1625-42ea-bd90-7e19c008a1d9', '5b0b2105-f978-476c-925e-0f4bec2f47b2', '38333a17-c20a-4536-8785-c4b8ebd67b3e');
  if ordered_slugs <> array['kaloricky-deficit', 'bazalni-metabolismus', 'zdrava-vecere', 'jidelnicek-na-hubnuti-pro-zeny', 'rychly-zdravy-obed-do-prace', 'jednoduchy-jidelnicek-na-hubnuti', 'kolik-kalorii-denne-pri-hubnuti', 'lehka-zdrava-vecere', 'emocni-prejidani'] then
    raise exception 'Post-check failed: published_at order mismatch - expected %, found %', array['kaloricky-deficit', 'bazalni-metabolismus', 'zdrava-vecere', 'jidelnicek-na-hubnuti-pro-zeny', 'rychly-zdravy-obed-do-prace', 'jednoduchy-jidelnicek-na-hubnuti', 'kolik-kalorii-denne-pri-hubnuti', 'lehka-zdrava-vecere', 'emocni-prejidani'], ordered_slugs;
  end if;

end $$;
