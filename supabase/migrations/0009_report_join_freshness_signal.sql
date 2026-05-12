create or replace function public.mark_group_needs_update_from_report()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.report_type in ('invalid_join_method', 'outdated_info') and new.group_id is not null then
    update public.groups
    set
      trust_signals = coalesce(
        (
          select array_agg(distinct signal)
          from unnest(
            array_append(
              array_remove(coalesce(trust_signals, '{}'::text[]), 'join_method_fresh'),
              'needs_update'
            )
          ) as signals(signal)
        ),
        array['needs_update']::text[]
      ),
      updated_at = now()
    where id = new.group_id;
  end if;

  return new;
end;
$$;

drop trigger if exists on_report_marks_group_needs_update on public.reports;

create trigger on_report_marks_group_needs_update
  after insert on public.reports
  for each row execute function public.mark_group_needs_update_from_report();
