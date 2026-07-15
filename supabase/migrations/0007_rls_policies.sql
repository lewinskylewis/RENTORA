-- 0007_rls_policies.sql
-- Row Level Security. Frontend route guards are convenience only; THIS is the
-- real authorization boundary. Helper functions are SECURITY DEFINER so policies
-- never recurse back through the tables they protect.

-- Can an agent see a given user? True when that user is a tenant the agent's
-- agency manages (an active/historic tenancy) OR has a live invitation from it.
create or replace function public.agent_manages_user(_agent uuid, _target uuid)
returns boolean
language sql stable security definer set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.tenancies t
    where t.tenant_user_id = _target
      and t.agency_id = public.current_agency_id(_agent)
  ) or exists (
    select 1 from public.tenant_invitations i
    where i.matched_user_id = _target
      and i.agency_id = public.current_agency_id(_agent)
      and i.status in ('pending', 'matched')
  );
$$;

-- Enable RLS everywhere.
alter table public.profiles            enable row level security;
alter table public.user_roles          enable row level security;
alter table public.tenant_profiles     enable row level security;
alter table public.agencies            enable row level security;
alter table public.agent_profiles      enable row level security;
alter table public.agent_applications  enable row level security;
alter table public.properties          enable row level security;
alter table public.units               enable row level security;
alter table public.tenancies           enable row level security;
alter table public.tenant_invitations  enable row level security;
alter table public.audit_logs          enable row level security;

-- ── profiles ─────────────────────────────────────────────────────────────────
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()) or public.agent_manages_user(auth.uid(), id));

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin(auth.uid()))
  with check (id = auth.uid() or public.is_admin(auth.uid()));

-- ── user_roles ───────────────────────────────────────────────────────────────
drop policy if exists user_roles_select on public.user_roles;
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists user_roles_admin_write on public.user_roles;
create policy user_roles_admin_write on public.user_roles for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ── tenant_profiles ──────────────────────────────────────────────────────────
drop policy if exists tenant_profiles_rw on public.tenant_profiles;
create policy tenant_profiles_rw on public.tenant_profiles for all to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- ── agencies ─────────────────────────────────────────────────────────────────
drop policy if exists agencies_select on public.agencies;
create policy agencies_select on public.agencies for select to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), id));

drop policy if exists agencies_update on public.agencies;
create policy agencies_update on public.agencies for update to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), id))
  with check (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), id));

drop policy if exists agencies_admin_insert on public.agencies;
create policy agencies_admin_insert on public.agencies for insert to authenticated
  with check (public.is_admin(auth.uid()));

-- ── agent_profiles ───────────────────────────────────────────────────────────
drop policy if exists agent_profiles_select on public.agent_profiles;
create policy agent_profiles_select on public.agent_profiles for select to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists agent_profiles_update on public.agent_profiles;
create policy agent_profiles_update on public.agent_profiles for update to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- ── agent_applications ───────────────────────────────────────────────────────
drop policy if exists agent_applications_select on public.agent_applications;
create policy agent_applications_select on public.agent_applications for select to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists agent_applications_insert on public.agent_applications;
create policy agent_applications_insert on public.agent_applications for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists agent_applications_admin_update on public.agent_applications;
create policy agent_applications_admin_update on public.agent_applications for update to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ── properties ───────────────────────────────────────────────────────────────
drop policy if exists properties_select on public.properties;
create policy properties_select on public.properties for select to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id));

-- INSERT requires an ACTIVE, VERIFIED agent whose agency owns the row. Pending /
-- rejected / suspended agents have no verified agent_profile, so current_agency_id
-- returns NULL and this check fails — exactly the required behavior.
drop policy if exists properties_insert on public.properties;
create policy properties_insert on public.properties for insert to authenticated
  with check (public.agent_in_agency(auth.uid(), agency_id) and created_by = auth.uid());

drop policy if exists properties_update on public.properties;
create policy properties_update on public.properties for update to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id))
  with check (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id));

drop policy if exists properties_delete on public.properties;
create policy properties_delete on public.properties for delete to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id));

-- ── units ────────────────────────────────────────────────────────────────────
drop policy if exists units_select on public.units;
create policy units_select on public.units for select to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), public.unit_agency_id(id)));

drop policy if exists units_insert on public.units;
create policy units_insert on public.units for insert to authenticated
  with check (exists (
    select 1 from public.properties p
    where p.id = property_id and public.agent_in_agency(auth.uid(), p.agency_id)
  ));

drop policy if exists units_update on public.units;
create policy units_update on public.units for update to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), public.unit_agency_id(id)))
  with check (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), public.unit_agency_id(id)));

drop policy if exists units_delete on public.units;
create policy units_delete on public.units for delete to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), public.unit_agency_id(id)));

-- ── tenancies ────────────────────────────────────────────────────────────────
-- A tenant sees only their own tenancies (all history). An agent sees only
-- tenancies for THEIR agency — so an old agent cannot see a tenant's new tenancy
-- under a different agency, and vice versa.
drop policy if exists tenancies_select on public.tenancies;
create policy tenancies_select on public.tenancies for select to authenticated
  using (
    tenant_user_id = auth.uid()
    or public.is_admin(auth.uid())
    or public.agent_in_agency(auth.uid(), agency_id)
  );

drop policy if exists tenancies_agent_update on public.tenancies;
create policy tenancies_agent_update on public.tenancies for update to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id))
  with check (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id));

drop policy if exists tenancies_admin_insert on public.tenancies;
create policy tenancies_admin_insert on public.tenancies for insert to authenticated
  with check (public.is_admin(auth.uid()));
-- (Normal creation is via accept_tenant_invitation(), a SECURITY DEFINER RPC.)

-- ── tenant_invitations ───────────────────────────────────────────────────────
drop policy if exists invitations_select on public.tenant_invitations;
create policy invitations_select on public.tenant_invitations for select to authenticated
  using (
    matched_user_id = auth.uid()
    or public.is_admin(auth.uid())
    or public.agent_in_agency(auth.uid(), agency_id)
  );

drop policy if exists invitations_agent_update on public.tenant_invitations;
create policy invitations_agent_update on public.tenant_invitations for update to authenticated
  using (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id))
  with check (public.is_admin(auth.uid()) or public.agent_in_agency(auth.uid(), agency_id));
-- (Creation via create_tenant_invitation(); accept/reject via RPCs.)

-- ── audit_logs ───────────────────────────────────────────────────────────────
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs for select to authenticated
  using (public.is_admin(auth.uid()) or actor_user_id = auth.uid());
-- No client INSERT/UPDATE/DELETE: writes only through write_audit() (definer).
