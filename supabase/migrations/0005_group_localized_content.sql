alter table public.groups
add column if not exists localized_content jsonb not null default '{}'::jsonb;
