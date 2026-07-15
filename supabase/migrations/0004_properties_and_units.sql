-- 0004_properties_and_units.sql
-- Properties belong to an agency; units belong to a property.

-- ── properties ───────────────────────────────────────────────────────────────
create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  agency_id     uuid not null references public.agencies (id) on delete cascade,
  created_by    uuid references public.profiles (id) on delete set null,
  name          text not null,
  property_type text,
  description   text,
  address       text,
  county        text,
  town          text,
  latitude      double precision,
  longitude     double precision,
  status        public.property_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists properties_agency_idx on public.properties (agency_id);
drop trigger if exists trg_properties_updated on public.properties;
create trigger trg_properties_updated before update on public.properties
  for each row execute function public.set_updated_at();

-- ── units ────────────────────────────────────────────────────────────────────
create table if not exists public.units (
  id               uuid primary key default gen_random_uuid(),
  property_id      uuid not null references public.properties (id) on delete cascade,
  unit_number      text not null,
  unit_type        text,
  bedrooms         integer check (bedrooms is null or bedrooms >= 0),
  bathrooms        integer check (bathrooms is null or bathrooms >= 0),
  monthly_rent     numeric(12,2) check (monthly_rent is null or monthly_rent >= 0),
  deposit_amount   numeric(12,2) check (deposit_amount is null or deposit_amount >= 0),
  occupancy_status public.occupancy_status not null default 'vacant',
  listing_status   public.listing_status not null default 'private',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (property_id, unit_number)   -- one unit number per property
);
create index if not exists units_property_idx on public.units (property_id);
create index if not exists units_occupancy_idx on public.units (occupancy_status);
drop trigger if exists trg_units_updated on public.units;
create trigger trg_units_updated before update on public.units
  for each row execute function public.set_updated_at();

-- The agency that owns the property a unit sits in (used by cross-entity checks).
create or replace function public.unit_agency_id(_unit uuid)
returns uuid
language sql stable security definer set search_path = public, pg_temp
as $$
  select p.agency_id
  from public.units u
  join public.properties p on p.id = u.property_id
  where u.id = _unit;
$$;
