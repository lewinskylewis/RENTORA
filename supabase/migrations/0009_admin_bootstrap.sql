-- 0009_admin_bootstrap.sql
-- Securely minting the FIRST admin. This function is intentionally NOT granted
-- to `authenticated` or `anon`; it can only be executed from the Supabase SQL
-- editor / a service-role connection. The first public signup is a tenant, never
-- an admin. To create your first admin:
--   1. Sign up normally (creates the auth user + tenant role).
--   2. In the SQL editor run:  select public.grant_admin_by_email('you@example.com');
create or replace function public.grant_admin_by_email(_email text)
returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uid uuid;
begin
  select id into v_uid from public.profiles where email = _email::citext;
  if v_uid is null then raise exception 'no profile with email %', _email; end if;

  insert into public.user_roles (user_id, role, status, approved_at)
  values (v_uid, 'admin', 'active', now())
  on conflict (user_id, role) do update set status = 'active', approved_at = now();

  perform public.write_audit(v_uid, 'role_activated', 'user_role', v_uid,
    jsonb_build_object('role', 'admin', 'via', 'grant_admin_by_email'));
  return v_uid;
end;
$$;

revoke execute on function public.grant_admin_by_email(text) from public, anon, authenticated;
