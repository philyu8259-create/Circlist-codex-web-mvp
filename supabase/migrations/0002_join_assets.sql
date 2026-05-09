insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'join-assets',
  'join-assets',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload own join assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'join-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can read own join assets"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'join-assets'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
