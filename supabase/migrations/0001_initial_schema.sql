create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'moderator', 'admin');
create type public.group_platform as enum ('wechat', 'qq', 'telegram', 'discord', 'slack', 'other');
create type public.moderation_status as enum ('draft', 'pending', 'approved', 'rejected', 'changes_requested', 'suspended', 'needs_update');
create type public.join_method_type as enum ('qr_code', 'invite_link', 'group_number', 'admin_contact', 'application_form', 'manual_notes');
create type public.join_method_visibility as enum ('public', 'members_only', 'admin_only');
create type public.report_type as enum ('spam', 'scam', 'invalid_join_method', 'outdated_info', 'abuse', 'other');
create type public.claim_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (display_name is null or char_length(display_name) <= 80)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_zh text not null,
  name_en text not null,
  description_zh text,
  description_en text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  owner_id uuid references public.profiles(id) on delete set null,
  slug text not null unique,
  name text not null,
  platform public.group_platform not null,
  tags text[] not null default '{}',
  short_description text not null,
  description text not null,
  suitable_for text,
  language text,
  region text,
  activity_level text not null default 'unknown',
  join_policy text not null default 'approval_required',
  price text not null default 'unknown',
  rules_summary text,
  owner_verified boolean not null default false,
  moderation_status public.moderation_status not null default 'pending',
  trust_signals text[] not null default '{}',
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint groups_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint groups_activity_level_check check (activity_level in ('low', 'medium', 'high', 'unknown')),
  constraint groups_join_policy_check check (join_policy in ('open', 'approval_required', 'admin_contact', 'invite_only')),
  constraint groups_price_check check (price in ('free', 'paid', 'unknown')),
  constraint groups_name_length check (char_length(name) between 2 and 160)
);

create table public.group_join_methods (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  type public.join_method_type not null,
  label text not null,
  value text not null,
  visibility public.join_method_visibility not null default 'public',
  review_status public.moderation_status not null default 'pending',
  expires_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint group_join_methods_review_status_check check (review_status in ('pending', 'approved', 'rejected', 'needs_update', 'suspended'))
);

create table public.group_submissions (
  id uuid primary key default gen_random_uuid(),
  submitter_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  group_id uuid references public.groups(id) on delete set null,
  proposed_name text not null,
  proposed_platform public.group_platform not null,
  proposed_join_method public.join_method_type,
  proposed_join_value text,
  proposed_payload jsonb not null default '{}'::jsonb,
  moderation_status public.moderation_status not null default 'pending',
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint group_submissions_name_length check (char_length(proposed_name) between 2 and 160)
);

create table public.ownership_claims (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade,
  claim_status public.claim_status not null default 'pending',
  evidence text not null,
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ownership_claims_one_open_claim unique (group_id, claimant_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade,
  join_method_id uuid references public.group_join_methods(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  report_type public.report_type not null,
  details text,
  status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint reports_has_target check (group_id is not null or join_method_id is not null),
  constraint reports_details_length check (details is null or char_length(details) <= 2000)
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_events_action_length check (char_length(action) between 2 and 120)
);

create index categories_sort_order_idx on public.categories(sort_order, slug);
create index groups_category_status_idx on public.groups(category_id, moderation_status);
create index groups_platform_status_idx on public.groups(platform, moderation_status);
create index group_join_methods_group_status_idx on public.group_join_methods(group_id, review_status, visibility);
create index group_submissions_submitter_idx on public.group_submissions(submitter_id, created_at desc);
create index ownership_claims_claimant_idx on public.ownership_claims(claimant_id, created_at desc);
create index reports_created_at_idx on public.reports(created_at desc);
create index audit_events_entity_idx on public.audit_events(entity_type, entity_id, created_at desc);

insert into public.categories (slug, name_zh, name_en, sort_order)
values
  ('ai', 'AI', 'AI', 10),
  ('overseas', '出海', 'Overseas Business', 20),
  ('programming', '编程', 'Programming', 30),
  ('investment', '投资', 'Investment', 40),
  ('indie-dev', '独立开发', 'Indie Development', 50);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.groups enable row level security;
alter table public.group_join_methods enable row level security;
alter table public.group_submissions enable row level security;
alter table public.ownership_claims enable row level security;
alter table public.reports enable row level security;
alter table public.audit_events enable row level security;

create policy "Public can read categories"
  on public.categories
  for select
  using (true);

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Public can read approved groups"
  on public.groups
  for select
  using (moderation_status = 'approved');

create policy "Public can read approved public join methods"
  on public.group_join_methods
  for select
  using (
    visibility = 'public'
    and review_status = 'approved'
    and exists (
      select 1
      from public.groups
      where groups.id = group_join_methods.group_id
        and groups.moderation_status = 'approved'
    )
  );

create policy "Users can insert own group submissions"
  on public.group_submissions
  for insert
  to authenticated
  with check (
    (select auth.uid()) = submitter_id
    and moderation_status = 'pending'
    and moderator_notes is null
  );

create policy "Users can read own group submissions"
  on public.group_submissions
  for select
  to authenticated
  using ((select auth.uid()) = submitter_id);

create policy "Users can insert own ownership claims"
  on public.ownership_claims
  for insert
  to authenticated
  with check (
    (select auth.uid()) = claimant_id
    and claim_status = 'pending'
    and moderator_notes is null
  );

create policy "Users can read own ownership claims"
  on public.ownership_claims
  for select
  to authenticated
  using ((select auth.uid()) = claimant_id);

create policy "Anyone can insert reports"
  on public.reports
  for insert
  -- Clients hold the anon key, so report targets must be validated in RLS
  -- instead of relying only on the server action.
  with check (
    (reporter_id is null or (select auth.uid()) = reporter_id)
    and status = 'pending'
    and group_id is not null
    and exists (
      select 1
      from public.groups
      where groups.id = reports.group_id
        and groups.moderation_status = 'approved'
    )
    and (
      join_method_id is null
      or exists (
        select 1
        from public.group_join_methods
        where group_join_methods.id = reports.join_method_id
          and group_join_methods.group_id = reports.group_id
          and group_join_methods.visibility = 'public'
          and group_join_methods.review_status = 'approved'
      )
    )
  );
