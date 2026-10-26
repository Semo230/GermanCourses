-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Creates the "messages" table for the contact form, insert-only for the public page.

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 100),
  phone      text not null check (char_length(phone) between 8 and 20),
  message    text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- Row Level Security: nothing is allowed unless a policy permits it.
alter table public.messages enable row level security;

-- The only policy: visitors (anon role, used by the publishable key) may INSERT.
-- No SELECT, UPDATE or DELETE policies exist, so those are all blocked.
drop policy if exists "Allow public insert" on public.messages;
create policy "Allow public insert"
  on public.messages
  for insert
  to anon
  with check (true);

-- Extra safety at the permission level: anon can only insert these three columns
-- (created_at is always set by the database).
revoke all on public.messages from anon, authenticated;
grant insert (name, phone, message) on public.messages to anon;
