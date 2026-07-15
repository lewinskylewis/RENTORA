-- 0006_audit_logs.sql
-- Append-only audit trail for privileged / lifecycle actions.

create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles (id) on delete set null,
  action        text not null,
  entity_type   text,
  entity_id     uuid,
  metadata      jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
create index if not exists audit_logs_actor_idx on public.audit_logs (actor_user_id);
create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);

-- Internal writer used by SECURITY DEFINER RPCs. Not exposed to clients.
create or replace function public.write_audit(
  _actor uuid, _action text, _entity_type text, _entity_id uuid, _metadata jsonb default '{}'::jsonb
) returns void
language sql security definer set search_path = public, pg_temp
as $$
  insert into public.audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  values (_actor, _action, _entity_type, _entity_id, coalesce(_metadata, '{}'::jsonb));
$$;
