-- 0002_profiles_and_roles.sql
-- Permanent user identity (profiles) + multi-role assignments (user_roles) +
-- tenant profile. Auth identities live in auth.users (Supabase Auth); profiles
-- holds application data keyed 1:1 by the same id.

-- ── Shared helpers ───────────────────────────────────────────────────────────

-- Keep updated_at fresh on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Normalize Kenyan phone numbers to E.164 (+2547XXXXXXXX / +2541XXXXXXXX).
-- Accepts 0712345678, 254712345678, +254712345678, spaces/dashes. Returns NULL
-- for empty input, and the digits prefixed with '+' for anything non-Kenyan so
-- the value is still deterministic.
create or replace function public.normalize_phone_ke(_raw text)
returns text
language plpgsql
immutable
as $$
declare
  digits text;
begin
  if _raw is null then return null; end if;
  digits := regexp_replace(_raw, '[^0-9]', '', 'g');
  if digits = '' then return null; end if;

  if left(digits, 1) = '0' and length(digits) = 10 then
    return '+254' || substring(digits from 2);       -- 07.. / 01.. -> +2547.. / +2541..
  elsif left(digits, 3) = '254' then
    return '+' || digits;                            -- 2547.. -> +2547..
  elsif length(digits) = 9 and left(digits, 1) in ('7', '1') then
    return '+254' || digits;                         -- 7.. / 1.. -> +2547.. / +2541..
  end if;
  return '+' || digits;                              -- fallback: deterministic E.164-ish
end;
$$;

-- ── profiles ─────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text,
  phone          text,
  email          citext,
  avatar_url     text,
  account_status public.account_status not null default 'active',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Normalized identifiers are unique so invitation-matching resolves to one user.
create unique index if not exists profiles_phone_key on public.profiles (phone) where phone is not null;
create unique index if not exists profiles_email_key on public.profiles (email) where email is not null;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Force phone into E.164 on write.
create or replace function public.profiles_normalize()
returns trigger language plpgsql as $$
begin
  new.phone := public.normalize_phone_ke(new.phone);
  return new;
end;
$$;
drop trigger if exists trg_profiles_normalize on public.profiles;
create trigger trg_profiles_normalize before insert or update of phone on public.profiles
  for each row execute function public.profiles_normalize();

-- ── user_roles ───────────────────────────────────────────────────────────────
create table if not exists public.user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        public.app_role not null,
  status      public.role_status not null default 'pending',
  approved_at timestamptz,
  approved_by uuid references public.profiles (id),
  created_at  timestamptz not null default now(),
  unique (user_id, role)   -- one row per (user, role); a person holds many roles
);
create index if not exists user_roles_user_idx on public.user_roles (user_id);
create index if not exists user_roles_lookup_idx on public.user_roles (user_id, role, status);

-- ── tenant_profiles ──────────────────────────────────────────────────────────
create table if not exists public.tenant_profiles (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null unique references public.profiles (id) on delete cascade,
  national_id_last4        text check (national_id_last4 is null or national_id_last4 ~ '^[0-9]{4}$'),
  emergency_contact_name   text,
  emergency_contact_phone  text,
  preferred_contact_method text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
drop trigger if exists trg_tenant_profiles_updated on public.tenant_profiles;
create trigger trg_tenant_profiles_updated before update on public.tenant_profiles
  for each row execute function public.set_updated_at();

-- ── Role helper functions (SECURITY DEFINER, bypass RLS to avoid recursion) ──
-- RLS policies call these; they must NOT themselves be gated by RLS or policies
-- that query user_roles would recurse infinitely.

create or replace function public.has_role(_user uuid, _role public.app_role, _status public.role_status default 'active')
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user and role = _role and status = _status
  );
$$;

create or replace function public.is_admin(_user uuid)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$ select public.has_role(_user, 'admin', 'active'); $$;

create or replace function public.is_active_agent(_user uuid)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$ select public.has_role(_user, 'agent', 'active'); $$;

-- current_agency_id() and agent_in_agency() live in 0003 (they reference
-- agent_profiles, which does not exist yet at this point).
