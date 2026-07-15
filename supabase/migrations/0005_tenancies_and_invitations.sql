-- 0005_tenancies_and_invitations.sql
-- Tenancies (the relationship between a permanent tenant user and a unit over a
-- period of time) and the invitations that create them.

-- ── tenancies ────────────────────────────────────────────────────────────────
create table if not exists public.tenancies (
  id                  uuid primary key default gen_random_uuid(),
  tenant_user_id      uuid not null references public.profiles (id) on delete cascade,
  property_id         uuid not null references public.properties (id) on delete restrict,
  unit_id             uuid not null references public.units (id) on delete restrict,
  agency_id           uuid not null references public.agencies (id) on delete restrict,
  created_by_agent_id uuid references public.profiles (id) on delete set null,
  lease_start         date,
  lease_end           date,
  monthly_rent        numeric(12,2) check (monthly_rent is null or monthly_rent >= 0),
  deposit_amount      numeric(12,2) check (deposit_amount is null or deposit_amount >= 0),
  billing_day         integer check (billing_day is null or (billing_day between 1 and 31)),
  status              public.tenancy_status not null default 'invited',
  tenant_accepted_at  timestamptz,
  ended_at            timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (lease_end is null or lease_start is null or lease_end >= lease_start)
);
create index if not exists tenancies_tenant_idx on public.tenancies (tenant_user_id);
create index if not exists tenancies_unit_idx on public.tenancies (unit_id);
create index if not exists tenancies_agency_idx on public.tenancies (agency_id);

-- One LIVE tenancy per unit. "Live" = a tenancy currently holding the unit.
-- Ended/cancelled/rejected tenancies stay as history and do not block re-letting.
create unique index if not exists tenancies_one_active_per_unit
  on public.tenancies (unit_id)
  where status in ('invited', 'pending_confirmation', 'active', 'notice_given');

drop trigger if exists trg_tenancies_updated on public.tenancies;
create trigger trg_tenancies_updated before update on public.tenancies
  for each row execute function public.set_updated_at();

-- Cross-entity integrity: unit must belong to the property, and agency must be
-- the property's agency. Enforced in a trigger because it spans tables.
create or replace function public.tenancies_validate()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_prop uuid;
  v_agency uuid;
begin
  select u.property_id, p.agency_id into v_prop, v_agency
  from public.units u join public.properties p on p.id = u.property_id
  where u.id = new.unit_id;

  if v_prop is null then
    raise exception 'unit % does not exist', new.unit_id;
  end if;
  if new.property_id <> v_prop then
    raise exception 'unit % does not belong to property %', new.unit_id, new.property_id;
  end if;
  if new.agency_id <> v_agency then
    raise exception 'tenancy agency % must match the property agency %', new.agency_id, v_agency;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_tenancies_validate on public.tenancies;
create trigger trg_tenancies_validate before insert or update on public.tenancies
  for each row execute function public.tenancies_validate();

-- ── tenant_invitations ───────────────────────────────────────────────────────
create table if not exists public.tenant_invitations (
  id                    uuid primary key default gen_random_uuid(),
  agency_id             uuid not null references public.agencies (id) on delete cascade,
  property_id           uuid not null references public.properties (id) on delete cascade,
  unit_id               uuid not null references public.units (id) on delete cascade,
  invited_by_agent_id   uuid references public.profiles (id) on delete set null,
  tenant_name           text,
  tenant_email          citext,
  tenant_phone          text,
  matched_user_id       uuid references public.profiles (id) on delete set null,
  invitation_token_hash text,                       -- sha256 hex of the raw token; raw is never stored
  expires_at            timestamptz,
  status                public.invitation_status not null default 'pending',
  -- lease terms carried on the invitation, applied to the tenancy on acceptance
  lease_start           date,
  lease_end             date,
  monthly_rent          numeric(12,2),
  deposit_amount        numeric(12,2),
  billing_day           integer check (billing_day is null or (billing_day between 1 and 31)),
  created_at            timestamptz not null default now(),
  accepted_at           timestamptz,
  rejected_at           timestamptz
);
create index if not exists invitations_unit_idx on public.tenant_invitations (unit_id);
create index if not exists invitations_matched_idx on public.tenant_invitations (matched_user_id);
create index if not exists invitations_email_idx on public.tenant_invitations (tenant_email);
create index if not exists invitations_phone_idx on public.tenant_invitations (tenant_phone);
create unique index if not exists invitations_token_key
  on public.tenant_invitations (invitation_token_hash) where invitation_token_hash is not null;
-- At most one open invitation per unit at a time.
create unique index if not exists invitations_one_open_per_unit
  on public.tenant_invitations (unit_id) where status in ('pending', 'matched');

-- Cross-entity integrity for invitations (mirror of tenancies_validate).
create or replace function public.invitations_validate()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_prop uuid;
  v_agency uuid;
begin
  new.tenant_phone := public.normalize_phone_ke(new.tenant_phone);

  select u.property_id, p.agency_id into v_prop, v_agency
  from public.units u join public.properties p on p.id = u.property_id
  where u.id = new.unit_id;

  if v_prop is null then
    raise exception 'unit % does not exist', new.unit_id;
  end if;
  if new.property_id <> v_prop then
    raise exception 'invited unit % does not belong to property %', new.unit_id, new.property_id;
  end if;
  if new.agency_id <> v_agency then
    raise exception 'invitation agency % must match the property agency %', new.agency_id, v_agency;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_invitations_validate on public.tenant_invitations;
create trigger trg_invitations_validate before insert or update on public.tenant_invitations
  for each row execute function public.invitations_validate();
