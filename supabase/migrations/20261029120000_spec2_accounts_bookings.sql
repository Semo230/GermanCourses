-- SPEC-2.md 2.10: student accounts, courses, bookings (orders), quiz results, message status.
-- Additive only: nothing existing is dropped or rewritten. Apply to germancourses-test first.

-- ---------------------------------------------------------------------------
-- Admin check: Frau Asmaa's account has app_metadata.role = 'admin'. Only the
-- server (service role / SQL) can set app_metadata, so nobody can grant it to themselves.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per account (name, WhatsApp, student group)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  whatsapp text not null default '' check (whatsapp = '' or whatsapp ~ '^\+?[0-9 ]{8,20}$'),
  -- GLOSSARY.md "Student group". Null until a Google sign-up fills it in on the first visit.
  student_group text check (student_group in ('experimental', 'private', 'international', 'adult')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Students read their own profile, the admin reads all"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Students edit their own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Rows are created only by the trigger below. Students may change these three columns only.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, whatsapp, student_group) on public.profiles to authenticated;

-- Creates the profile at sign-up or invite from the details passed in user metadata
-- (sign-up form or the admin's invite). Bad values are dropped instead of blocking sign-up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name text := left(btrim(coalesce(meta ->> 'full_name', meta ->> 'name', '')), 100);
  v_whatsapp text := btrim(coalesce(meta ->> 'whatsapp', ''));
  v_group text := meta ->> 'student_group';
begin
  if v_whatsapp !~ '^\+?[0-9 ]{8,20}$' then
    v_whatsapp := '';
  end if;
  if v_group is null or v_group not in ('experimental', 'private', 'international', 'adult') then
    v_group := null;
  end if;

  insert into public.profiles (id, full_name, whatsapp, student_group)
  values (new.id, v_name, v_whatsapp, v_group)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- courses: hidden by default, hidden instead of deleted
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  level text not null check (level in ('A1', 'A2')),
  mode text not null check (mode in ('in_person', 'online', 'both')),
  description text not null default '' check (char_length(description) <= 1000),
  visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Everyone reads visible courses, the admin reads all"
  on public.courses for select to anon, authenticated
  using (visible or (select public.is_admin()));

create policy "The admin adds courses"
  on public.courses for insert to authenticated
  with check ((select public.is_admin()));

create policy "The admin edits courses"
  on public.courses for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- No delete policy and no delete grant: courses are hidden, never deleted.
revoke all on public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
grant insert (name, level, mode, description, visible), update (name, level, mode, description, visible)
  on public.courses to authenticated;

create trigger courses_touch before update on public.courses
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- orders (bookings): a request, no price or payment (docs/adr/0002)
-- ---------------------------------------------------------------------------
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  -- Restrict: an account with bookings can't be deleted, because bookings are never deleted.
  student_id uuid not null default auth.uid() references public.profiles (id) on delete restrict,
  course_id uuid not null references public.courses (id) on delete restrict,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  whatsapp text not null check (whatsapp ~ '^\+?[0-9 ]{8,20}$'),
  note text not null default '' check (char_length(note) <= 1000),
  -- GLOSSARY.md: جديد / اتواصلنا / اتسجّل / مقفول
  status text not null default 'new' check (status in ('new', 'contacted', 'enrolled', 'closed')),
  -- Set by the order-emails Edge Function. 'failed' shows "email not sent" in the dashboard.
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  created_at timestamptz not null default now()
);

create index orders_student_id_idx on public.orders (student_id);
create index orders_course_id_idx on public.orders (course_id);
create index orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

create policy "Students book visible courses for themselves, always as new"
  on public.orders for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and status = 'new'
    and email_status = 'pending'
    and exists (select 1 from public.courses c where c.id = course_id and c.visible)
  );

create policy "Students read their own bookings, the admin reads all"
  on public.orders for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

create policy "The admin changes the status"
  on public.orders for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Students can only fill these columns; status, email status and the student id come from defaults.
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
grant insert (course_id, full_name, whatsapp, note) on public.orders to authenticated;
grant update (status) on public.orders to authenticated;

-- ---------------------------------------------------------------------------
-- quiz_results: only the student sees them (not the admin)
-- ---------------------------------------------------------------------------
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  score smallint not null check (score between 0 and 10),
  -- Score ranges from SPEC.md: 0-3, 4-7, 8-10.
  result text not null check (
    (result = 'start' and score between 0 and 3)
    or (result = 'basics' and score between 4 and 7)
    or (result = 'ready_a2' and score between 8 and 10)
  ),
  created_at timestamptz not null default now()
);

create index quiz_results_student_id_idx on public.quiz_results (student_id);

alter table public.quiz_results enable row level security;

create policy "Students save their own quiz results"
  on public.quiz_results for insert to authenticated
  with check (student_id = (select auth.uid()));

create policy "Students read their own quiz results"
  on public.quiz_results for select to authenticated
  using (student_id = (select auth.uid()));

revoke all on public.quiz_results from anon, authenticated;
grant select on public.quiz_results to authenticated;
grant insert (score, result) on public.quiz_results to authenticated;

-- ---------------------------------------------------------------------------
-- messages (contact form): add a status. Visitors keep their insert-only rule.
-- ---------------------------------------------------------------------------
alter table public.messages
  add column if not exists status text not null default 'new' check (status in ('new', 'replied'));

create policy "The admin reads messages"
  on public.messages for select to authenticated
  using ((select public.is_admin()));

create policy "The admin marks messages as replied"
  on public.messages for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Only the status can ever be changed, by anyone.
revoke update on public.messages from anon, authenticated;
grant select on public.messages to authenticated;
grant update (status) on public.messages to authenticated;

-- ---------------------------------------------------------------------------
-- admin_students(): the Students page. Email, sign-in method and account status
-- live in auth.users, so this reads them for the admin only.
-- ---------------------------------------------------------------------------
create or replace function public.admin_students()
returns table (
  id uuid,
  email text,
  full_name text,
  whatsapp text,
  student_group text,
  created_at timestamptz,
  providers text[],
  account_status text,
  last_sign_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only' using errcode = '42501';
  end if;

  return query
  select
    u.id,
    u.email::text,
    coalesce(p.full_name, ''),
    coalesce(p.whatsapp, ''),
    p.student_group,
    u.created_at,
    coalesce(array(select jsonb_array_elements_text(u.raw_app_meta_data -> 'providers')), array['email']),
    case
      when u.email_confirmed_at is not null then 'active'
      when u.invited_at is not null then 'invited'
      else 'unconfirmed'
    end,
    u.last_sign_in_at
  from auth.users u
  left join public.profiles p on p.id = u.id
  where coalesce(u.raw_app_meta_data ->> 'role', '') <> 'admin'
  order by u.created_at desc;
end;
$$;

revoke execute on function public.admin_students() from public, anon;
grant execute on function public.admin_students() to authenticated;

-- Used by the invite-student Edge Function (service role only) to see whether an email has an account.
create or replace function public.account_status_for_email(p_email text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when u.id is null then 'none'
    when u.email_confirmed_at is not null then 'active'
    when u.invited_at is not null then 'invited'
    else 'unconfirmed'
  end
  from (select 1) dummy
  left join auth.users u on lower(u.email) = lower(btrim(p_email));
$$;

revoke execute on function public.account_status_for_email(text) from public, anon, authenticated;
grant execute on function public.account_status_for_email(text) to service_role;
