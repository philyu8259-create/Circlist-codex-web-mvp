alter table public.reports
  add column if not exists reporter_ip text;

create index if not exists reports_reporter_id_created_at_idx on public.reports (reporter_id, created_at desc);
create index if not exists reports_reporter_ip_created_at_idx on public.reports (reporter_ip, created_at desc);
