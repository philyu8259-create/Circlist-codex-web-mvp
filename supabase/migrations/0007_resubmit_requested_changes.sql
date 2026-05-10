drop policy if exists "Users can resubmit change requested submissions"
  on public.group_submissions;

create policy "Users can resubmit change requested submissions"
  on public.group_submissions
  for update
  to authenticated
  using (
    (select auth.uid()) = submitter_id
    and moderation_status = 'changes_requested'
  )
  with check (
    (select auth.uid()) = submitter_id
    and moderation_status = 'pending'
    and moderator_notes is null
  );
