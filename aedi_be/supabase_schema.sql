-- Run this in Supabase SQL Editor.
-- Create tables
create table if not exists public."Email_breach_checker" (
  id bigserial primary key,
  email_address text not null,
  date_time timestamptz not null default now()
);

create table if not exists public."Malware_scanner" (
  id bigserial primary key,
  url_or_file_name text not null
);

-- Enable Row Level Security (recommended). For demo, allow anon insert/select.
alter table public."Email_breach_checker" enable row level security;
alter table public."Malware_scanner" enable row level security;

-- Policy: allow anyone with anon key to insert/select (demo only; tighten for prod)
create policy if not exists "Anon can insert email breach" on public."Email_breach_checker"
  for insert to anon using (true) with check (true);
create policy if not exists "Anon can select email breach" on public."Email_breach_checker"
  for select to anon using (true);

create policy if not exists "Anon can insert malware scan" on public."Malware_scanner"
  for insert to anon using (true) with check (true);
create policy if not exists "Anon can select malware scan" on public."Malware_scanner"
  for select to anon using (true);
