-- TEST PROJECT ONLY (germancourses-test). Never run on the live project, which already has this table.
-- A stand-in for the live public.messages table so the SPEC-2 migration can be tested.
-- scripts/wizard-test-supabase.sh can copy the exact live structure instead.
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 8 and 20),
  message text not null check (char_length(message) between 1 and 2000)
);

alter table public.messages enable row level security;

create policy "Visitors can send messages"
  on public.messages for insert to anon
  with check (true);

revoke all on public.messages from anon;
grant insert on public.messages to anon;
