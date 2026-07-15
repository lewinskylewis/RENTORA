# Roles & permissions

## Roles and statuses

Roles: `tenant`, `agent`, `admin`. Statuses: `pending`, `active`, `suspended`,
`rejected`. A public signup receives an **active tenant** role automatically (via
the `handle_new_user` trigger). An **agent** role is created **pending** on
application and only becomes `active` on admin approval.

## Login routing (target behavior)

| Situation | Lands on |
| --- | --- |
| Unauthenticated | `/login` |
| Tenant only | `/tenant/dashboard` |
| Approved agent | `/agent` |
| Tenant + active agent | may choose a workspace (Phase 4 chooser) |
| Pending / rejected / suspended agent | `/agent-application/status` |
| Admin | `/admin` |

Enforced by `src/app/routing/guards.tsx` (`RequireAuth`, `RequireAgent`,
`RequireAdmin`). Guards are convenience only — **RLS is the real boundary.**

## Row Level Security (summary)

Every table has RLS enabled (`0007_rls_policies.sql`). Policies use
`SECURITY DEFINER` helpers so they never recurse.

- **profiles** — read own; admins; agents may read profiles of tenants their
  agency manages (`agent_manages_user`). Update own (admins any).
- **user_roles** — read own; admins full. Clients never self-activate roles.
- **tenant_profiles** — own + admin only (holds emergency contacts).
- **agencies** — agent reads own agency; admins all. Insert admin-only.
- **agent_profiles** — own + admin.
- **agent_applications** — read/insert own; only admins update (review).
- **properties / units** — read + write restricted to the agent's agency
  (`agent_in_agency`) or admin. Insert requires an **active, verified** agent, so
  pending/rejected/suspended agents cannot create anything (their
  `current_agency_id` is NULL → the check fails).
- **tenancies** — tenant reads own (all history); agent reads only their agency's
  tenancies. So an old agent can't see a tenant's new tenancy under another
  agency, and vice-versa. Creation is via the accept RPC.
- **tenant_invitations** — matched tenant reads their own; agent reads their
  agency's. Creation/accept/reject via RPCs.
- **audit_logs** — admin, or the acting user's own entries. No client writes.

## Creating the first admin (securely)

The first public signup is a **tenant**, never an admin. To mint the first admin:

1. Sign up normally (creates the auth user + active tenant role).
2. In the Supabase SQL editor (service-role context) run:
   ```sql
   select public.grant_admin_by_email('you@example.com');
   ```

`grant_admin_by_email` is **not** granted to `authenticated`/`anon`, so it can
only run from the SQL editor or a service-role connection. Subsequent admins can
be added the same way or via admin tooling in a later phase.
