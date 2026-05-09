insert into public.categories (slug, name_zh, name_en, sort_order)
values ('one-person-company', '一人公司', 'One-Person Company', 45)
on conflict (slug) do update
set
  name_zh = excluded.name_zh,
  name_en = excluded.name_en,
  sort_order = excluded.sort_order;
