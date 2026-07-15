-- 0008_functions_and_rpcs.sql
-- The auth trigger + all privileged workflows. Every mutation that must stay
-- atomic or must not be trusted to the client lives here as SECURITY DEFINER.

-- ── New user → profile + active tenant role + invitation matching ────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name  text := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name');
  v_phone text := public.normalize_phone_ke(coalesce(new.raw_user_meta_data->>'phone', new.phone));
begin
  insert into public.profiles (id, full_name, phone, email)
  values (new.id, v_name, v_phone, new.email)
  on conflict (id) do nothing;

  -- Public signup always yields an ACTIVE tenant role.
  insert into public.user_roles (user_id, role, status, approved_at)
  values (new.id, 'tenant', 'active', now())
  on conflict (user_id, role) do nothing;

  -- Auto-match any pending invitation addressed to this verified email/phone.
  update public.tenant_invitations
     set matched_user_id = new.id, status = 'matched'
   where status = 'pending'
     and matched_user_id is null
     and (
       (tenant_email is not null and tenant_email = new.email)
       or (v_phone is not null and tenant_phone = v_phone)
     );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Agent application: submit ────────────────────────────────────────────────
create or replace function public.submit_agent_application(
  _agency_name text,
  _applicant_name text,
  _phone text,
  _county text,
  _estimated_units_managed integer default null,
  _business_registration_number text default null,
  _notes text default null
) returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_app uuid;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  insert into public.agent_applications (
    user_id, agency_name, applicant_name, phone, email, county,
    estimated_units_managed, business_registration_number, notes, status
  ) values (
    v_uid, _agency_name, _applicant_name, public.normalize_phone_ke(_phone),
    (select email from public.profiles where id = v_uid),
    _county, _estimated_units_managed, _business_registration_number, _notes, 'pending'
  ) returning id into v_app;

  -- Agent role starts PENDING; the dashboard stays locked until approval.
  insert into public.user_roles (user_id, role, status)
  values (v_uid, 'agent', 'pending')
  on conflict (user_id, role) do update
    set status = case when public.user_roles.status = 'active' then 'active' else 'pending' end;

  perform public.write_audit(v_uid, 'agent_application_submitted', 'agent_application', v_app,
    jsonb_build_object('agency_name', _agency_name));
  return v_app;
end;
$$;

-- ── Agent application: review (admin only) ───────────────────────────────────
-- decision ∈ 'approved' | 'rejected' | 'needs_more_information'
create or replace function public.review_agent_application(
  _application_id uuid,
  _decision public.application_status,
  _notes text default null
) returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_admin uuid := auth.uid();
  v_app   public.agent_applications;
  v_agency uuid;
begin
  if not public.is_admin(v_admin) then raise exception 'admin only'; end if;

  select * into v_app from public.agent_applications where id = _application_id for update;
  if not found then raise exception 'application not found'; end if;

  update public.agent_applications
     set status = _decision, reviewed_by = v_admin, reviewed_at = now(),
         notes = coalesce(_notes, notes)
   where id = _application_id;

  if _decision = 'approved' then
    -- Create the agency and a verified agent profile, then activate the role.
    insert into public.agencies (name, business_registration_number, county, status)
    values (v_app.agency_name, v_app.business_registration_number, v_app.county, 'active')
    returning id into v_agency;

    insert into public.agent_profiles (user_id, agency_id, verification_status, onboarding_status)
    values (v_app.user_id, v_agency, 'verified', 'complete')
    on conflict (user_id) do update
      set agency_id = excluded.agency_id, verification_status = 'verified', onboarding_status = 'complete';

    insert into public.user_roles (user_id, role, status, approved_at, approved_by)
    values (v_app.user_id, 'agent', 'active', now(), v_admin)
    on conflict (user_id, role) do update
      set status = 'active', approved_at = now(), approved_by = v_admin;

    perform public.write_audit(v_admin, 'agent_approved', 'agent_application', _application_id,
      jsonb_build_object('user_id', v_app.user_id, 'agency_id', v_agency));

  elsif _decision = 'rejected' then
    update public.user_roles set status = 'rejected'
      where user_id = v_app.user_id and role = 'agent';
    perform public.write_audit(v_admin, 'agent_rejected', 'agent_application', _application_id,
      jsonb_build_object('user_id', v_app.user_id));
  else
    perform public.write_audit(v_admin, 'agent_needs_more_information', 'agent_application', _application_id,
      jsonb_build_object('user_id', v_app.user_id));
  end if;
end;
$$;

-- ── Agent lifecycle: suspend / reactivate (admin only) ───────────────────────
create or replace function public.set_agent_status(_user_id uuid, _status public.role_status)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_admin uuid := auth.uid();
begin
  if not public.is_admin(v_admin) then raise exception 'admin only'; end if;
  update public.user_roles set status = _status where user_id = _user_id and role = 'agent';
  update public.agent_profiles
     set verification_status = case when _status = 'active' then 'verified'
                                    when _status = 'suspended' then 'suspended'
                                    else verification_status end
   where user_id = _user_id;
  perform public.write_audit(v_admin,
    case when _status = 'suspended' then 'agent_suspended'
         when _status = 'active' then 'role_activated' else 'role_changed' end,
    'user_role', _user_id, jsonb_build_object('status', _status));
end;
$$;

-- ── Tenant invitation: create (active agent only) ────────────────────────────
-- Returns json: { invitation_id, matched (bool), token (raw, only when unmatched) }.
create or replace function public.create_tenant_invitation(
  _property_id uuid,
  _unit_id uuid,
  _tenant_name text,
  _tenant_email text,
  _tenant_phone text,
  _lease_start date default null,
  _lease_end date default null,
  _monthly_rent numeric default null,
  _deposit_amount numeric default null,
  _billing_day integer default null,
  _expires_in_days integer default 14
) returns jsonb
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid     uuid := auth.uid();
  v_agency  uuid := public.current_agency_id(v_uid);
  v_prop_agency uuid;
  v_matched uuid;
  v_phone   text := public.normalize_phone_ke(_tenant_phone);
  v_email   citext := nullif(_tenant_email, '')::citext;
  v_token   text := encode(gen_random_bytes(24), 'hex');
  v_id      uuid;
begin
  if not public.is_active_agent(v_uid) or v_agency is null then
    raise exception 'only active agents may invite tenants';
  end if;

  select agency_id into v_prop_agency from public.properties where id = _property_id;
  if v_prop_agency is null or v_prop_agency <> v_agency then
    raise exception 'property does not belong to your agency';
  end if;

  -- Match an existing verified account by normalized email/phone (never by name).
  select id into v_matched from public.profiles
   where (v_email is not null and email = v_email)
      or (v_phone is not null and phone = v_phone)
   limit 1;

  insert into public.tenant_invitations (
    agency_id, property_id, unit_id, invited_by_agent_id, tenant_name, tenant_email, tenant_phone,
    matched_user_id, invitation_token_hash, expires_at, status,
    lease_start, lease_end, monthly_rent, deposit_amount, billing_day
  ) values (
    v_agency, _property_id, _unit_id, v_uid, _tenant_name, v_email, v_phone,
    v_matched, encode(digest(v_token, 'sha256'), 'hex'),
    now() + make_interval(days => greatest(_expires_in_days, 1)),
    case when v_matched is not null then 'matched' else 'pending' end,
    _lease_start, _lease_end, _monthly_rent, _deposit_amount, _billing_day
  ) returning id into v_id;

  -- Reserve a vacant unit for this invitation.
  update public.units set occupancy_status = 'reserved'
    where id = _unit_id and occupancy_status = 'vacant';

  perform public.write_audit(v_uid, 'tenant_invited', 'tenant_invitation', v_id,
    jsonb_build_object('matched', v_matched is not null, 'unit_id', _unit_id));

  return jsonb_build_object(
    'invitation_id', v_id,
    'matched', v_matched is not null,
    'token', case when v_matched is null then v_token else null end
  );
end;
$$;

-- ── Tenant invitation: accept (tenant only, atomic) ──────────────────────────
create or replace function public.accept_tenant_invitation(_invitation_id uuid, _token text default null)
returns uuid
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid   uuid := auth.uid();
  v_inv   public.tenant_invitations;
  v_unit  public.units;
  v_tenancy uuid;
  v_status public.tenancy_status;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  select * into v_inv from public.tenant_invitations where id = _invitation_id for update;
  if not found then raise exception 'invitation not found'; end if;

  -- Belongs to this tenant: either pre-matched to them, or they hold the token.
  if v_inv.matched_user_id is distinct from v_uid then
    if _token is null or v_inv.invitation_token_hash is distinct from encode(digest(_token, 'sha256'), 'hex') then
      raise exception 'invitation does not belong to you';
    end if;
  end if;

  if v_inv.status = 'accepted' then raise exception 'invitation already accepted'; end if;
  if v_inv.status not in ('pending', 'matched') then raise exception 'invitation is % and cannot be accepted', v_inv.status; end if;
  if v_inv.expires_at is not null and v_inv.expires_at < now() then
    update public.tenant_invitations set status = 'expired' where id = _invitation_id;
    raise exception 'invitation has expired';
  end if;

  select * into v_unit from public.units where id = v_inv.unit_id for update;
  if v_unit.occupancy_status not in ('vacant', 'reserved') then
    raise exception 'unit is no longer available';
  end if;

  v_status := case when v_inv.lease_start is null or v_inv.lease_start <= current_date
                   then 'active' else 'pending_confirmation' end;

  insert into public.tenancies (
    tenant_user_id, property_id, unit_id, agency_id, created_by_agent_id,
    lease_start, lease_end, monthly_rent, deposit_amount, billing_day,
    status, tenant_accepted_at
  ) values (
    v_uid, v_inv.property_id, v_inv.unit_id, v_inv.agency_id, v_inv.invited_by_agent_id,
    v_inv.lease_start, v_inv.lease_end, v_inv.monthly_rent, v_inv.deposit_amount, v_inv.billing_day,
    v_status, now()
  ) returning id into v_tenancy;

  update public.tenant_invitations
     set status = 'accepted', accepted_at = now(), matched_user_id = v_uid
   where id = _invitation_id;

  update public.units set occupancy_status = 'occupied' where id = v_inv.unit_id;

  perform public.write_audit(v_uid, 'invitation_accepted', 'tenancy', v_tenancy,
    jsonb_build_object('invitation_id', _invitation_id, 'unit_id', v_inv.unit_id));
  return v_tenancy;
end;
$$;

-- ── Tenant invitation: reject (tenant only) ──────────────────────────────────
create or replace function public.reject_tenant_invitation(_invitation_id uuid, _token text default null)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_inv public.tenant_invitations;
begin
  select * into v_inv from public.tenant_invitations where id = _invitation_id for update;
  if not found then raise exception 'invitation not found'; end if;

  if v_inv.matched_user_id is distinct from v_uid then
    if _token is null or v_inv.invitation_token_hash is distinct from encode(digest(_token, 'sha256'), 'hex') then
      raise exception 'invitation does not belong to you';
    end if;
  end if;
  if v_inv.status not in ('pending', 'matched') then
    raise exception 'invitation is % and cannot be rejected', v_inv.status;
  end if;

  update public.tenant_invitations
     set status = 'rejected', rejected_at = now(), matched_user_id = coalesce(matched_user_id, v_uid)
   where id = _invitation_id;

  -- Return the unit to vacant if it was only reserved for this invitation.
  update public.units set occupancy_status = 'vacant'
    where id = v_inv.unit_id and occupancy_status = 'reserved';

  perform public.write_audit(v_uid, 'invitation_rejected', 'tenant_invitation', _invitation_id,
    jsonb_build_object('unit_id', v_inv.unit_id));
end;
$$;

-- ── Tenancy lifecycle: give notice / end ─────────────────────────────────────
create or replace function public.give_tenancy_notice(_tenancy_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uid uuid := auth.uid(); v_t public.tenancies;
begin
  select * into v_t from public.tenancies where id = _tenancy_id for update;
  if not found then raise exception 'tenancy not found'; end if;
  if not (v_t.tenant_user_id = v_uid or public.agent_in_agency(v_uid, v_t.agency_id) or public.is_admin(v_uid)) then
    raise exception 'not authorized';
  end if;
  if v_t.status <> 'active' then raise exception 'only active tenancies can be given notice'; end if;
  update public.tenancies set status = 'notice_given' where id = _tenancy_id;
  perform public.write_audit(v_uid, 'tenancy_notice_given', 'tenancy', _tenancy_id, '{}'::jsonb);
end;
$$;

create or replace function public.end_tenancy(_tenancy_id uuid)
returns void
language plpgsql security definer set search_path = public, pg_temp
as $$
declare v_uid uuid := auth.uid(); v_t public.tenancies;
begin
  select * into v_t from public.tenancies where id = _tenancy_id for update;
  if not found then raise exception 'tenancy not found'; end if;
  if not (public.agent_in_agency(v_uid, v_t.agency_id) or public.is_admin(v_uid)) then
    raise exception 'not authorized';
  end if;
  if v_t.status in ('ended', 'cancelled') then raise exception 'tenancy already closed'; end if;

  update public.tenancies set status = 'ended', ended_at = now() where id = _tenancy_id;
  -- Free the unit (unless it has moved to maintenance).
  update public.units set occupancy_status = 'vacant'
    where id = v_t.unit_id and occupancy_status = 'occupied';
  perform public.write_audit(v_uid, 'tenancy_ended', 'tenancy', _tenancy_id,
    jsonb_build_object('unit_id', v_t.unit_id));
end;
$$;

-- ── Grants: expose RPCs to signed-in users; keep internals private ───────────
revoke execute on function public.write_audit(uuid, text, text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.submit_agent_application(text, text, text, text, integer, text, text) to authenticated;
grant execute on function public.review_agent_application(uuid, public.application_status, text) to authenticated;
grant execute on function public.set_agent_status(uuid, public.role_status) to authenticated;
grant execute on function public.create_tenant_invitation(uuid, uuid, text, text, text, date, date, numeric, numeric, integer, integer) to authenticated;
grant execute on function public.accept_tenant_invitation(uuid, text) to authenticated;
grant execute on function public.reject_tenant_invitation(uuid, text) to authenticated;
grant execute on function public.give_tenancy_notice(uuid) to authenticated;
grant execute on function public.end_tenancy(uuid) to authenticated;
