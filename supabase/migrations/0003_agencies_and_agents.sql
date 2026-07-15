-- 0003_agencies_and_agents.sql
-- Agencies, agent profiles, and agent applications.

-- ── agencies ─────────────────────────────────────────────────────────────────
create table if not exists public.agencies (
  id                           uuid primary key default gen_random_uuid(),
  name                         text not null,
  business_registration_number text,
  phone                        text,
  email                        citext,
  address                      text,
  county                       text,
  logo_url                     text,
  status                       public.agency_status not null default 'active',
  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now()
);
drop trigger if exists trg_agencies_updated on public.agencies;
create trigger trg_agencies_updated before update on public.agencies
  for each row execute function public.set_updated_at();

-- ── agent_profiles ───────────────────────────────────────────────────────────
create table if not exists public.agent_profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null unique references public.profiles (id) on delete cascade,
  agency_id           uuid references public.agencies (id) on delete set null,
  job_title           text,
  verification_status public.verification_status not null default 'pending',
  onboarding_status   text not null default 'not_started',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists agent_profiles_agency_idx on public.agent_profiles (agency_id);
drop trigger if exists trg_agent_profiles_updated on public.agent_profiles;
create trigger trg_agent_profiles_updated before update on public.agent_profiles
  for each row execute function public.set_updated_at();

-- ── agent_applications ───────────────────────────────────────────────────────
create table if not exists public.agent_applications (
  id                           uuid primary key default gen_random_uuid(),
  user_id                      uuid not null references public.profiles (id) on delete cascade,
  agency_name                  text not null,
  applicant_name               text not null,
  phone                        text,
  email                        citext,
  county                       text,
  estimated_units_managed      integer check (estimated_units_managed is null or estimated_units_managed >= 0),
  business_registration_number text,
  notes                        text,
  status                       public.application_status not null default 'pending',
  reviewed_by                  uuid references public.profiles (id),
  reviewed_at                  timestamptz,
  created_at                   timestamptz not null default now()
);
create index if not exists agent_applications_user_idx on public.agent_applications (user_id);
create index if not exists agent_applications_status_idx on public.agent_applications (status);
-- At most one open application per user (partial unique on the "in flight" states).
create unique index if not exists agent_applications_one_open
  on public.agent_applications (user_id)
  where status in ('pending', 'needs_more_information');

-- ── Agency helper functions (need agent_profiles to exist) ───────────────────
create or replace function public.current_agency_id(_user uuid)
returns uuid
language sql stable security definer set search_path = public, pg_temp
as $$
  select ap.agency_id
  from public.agent_profiles ap
  where ap.user_id = _user
    and ap.verification_status = 'verified'
  limit 1;
$$;

-- True when the user is an active agent for the given agency.
create or replace function public.agent_in_agency(_user uuid, _agency uuid)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$
  select public.is_active_agent(_user) and public.current_agency_id(_user) = _agency;
$$;
