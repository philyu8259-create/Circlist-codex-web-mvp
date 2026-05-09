create policy "Admins can read all groups"
  on public.groups
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can insert groups"
  on public.groups
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update groups"
  on public.groups
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can read all join methods"
  on public.group_join_methods
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can insert join methods"
  on public.group_join_methods
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update join methods"
  on public.group_join_methods
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );
