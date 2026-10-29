-- SPEC-2.md 2.6: every new booking calls the order-emails Edge Function, which emails
-- Frau Asmaa and the student from her Gmail. The booking is saved even if this fails.
--
-- Needs one Vault entry per project with the function's address (not secret, but differs per project):
--   select vault.create_secret('https://<project-ref>.supabase.co/functions/v1/order-emails', 'order_emails_url');
-- The shared secret below is generated here and only ever lives in Vault: the Edge Function checks it
-- through order_emails_secret_ok(), so nobody has to copy it anywhere.

create extension if not exists pg_net with schema extensions;

select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'order_emails_secret')
where not exists (select 1 from vault.secrets where name = 'order_emails_secret');

create or replace function public.order_emails_secret_ok(p_secret text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from vault.decrypted_secrets
    where name = 'order_emails_secret' and decrypted_secret = p_secret
  );
$$;

revoke execute on function public.order_emails_secret_ok(text) from public, anon, authenticated;
grant execute on function public.order_emails_secret_ok(text) to service_role;

-- Trigger functions can't be called usefully over the API, but keep them off it anyway.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text;
  v_secret text;
begin
  select decrypted_secret into v_url from vault.decrypted_secrets where name = 'order_emails_url';
  select decrypted_secret into v_secret from vault.decrypted_secrets where name = 'order_emails_secret';

  if v_url is null or v_secret is null then
    update public.orders
      set email_status = 'failed', email_error = 'Emails are not set up (Vault secrets missing).'
      where id = new.id;
    return null;
  end if;

  -- Asynchronous: the booking is committed straight away, the emails follow.
  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_secret),
    body := jsonb_build_object('order_id', new.id),
    timeout_milliseconds := 15000
  );
  return null;
end;
$$;

revoke execute on function public.notify_new_order() from public, anon, authenticated;

create trigger on_order_created
  after insert on public.orders
  for each row execute function public.notify_new_order();
