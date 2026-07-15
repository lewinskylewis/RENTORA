# RENTORA

Rental-management SaaS + property-discovery platform for Kenya. One application,
one authentication system, one Supabase backend, and role-based workspaces for
**tenants**, **agents**, and **administrators**.

This repository integrates two previously-separate Figma Make exports:

| Original project | Role | Where it lives now |
| --- | --- | --- |
| `Rentora.Os` | Tenant Dashboard — **the base app** | `Rentora.Os/` (the single app) |
| `Rentora.Agent` | Agent Dashboard | migrated into `Rentora.Os/src/app/features/agent` and mounted at `/agent/*` |

> The standalone `Rentora.Agent/` folder is kept as the migration source for this
> phase and will be archived once integration is fully verified. **The live app is
> `Rentora.Os/`.**

## Tech stack

React 18 · Vite 6 · TypeScript (strict) · Tailwind v4 · Radix/shadcn · react-router v7 · Supabase (Postgres + Auth + RLS).

## Quick start

```bash
cd Rentora.Os
npm install
cp .env.example .env          # then fill in your Supabase URL + anon key
npm run dev                   # http://localhost:5173
```

Without Supabase env vars the app runs in a labelled **dev mode** (a full mock
identity with all roles) so every workspace renders offline.

## Backend setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema — either:
   - **GitHub integration:** connect this repo; Supabase auto-applies `supabase/migrations/*.sql`, **or**
   - **CLI:** `supabase link --project-ref <ref>` then `supabase db push`, **or**
   - **SQL editor:** paste each `supabase/migrations/000*.sql` in order.
3. Copy `Project Settings → API` values into `Rentora.Os/.env`:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
4. Create the first admin (see [docs/roles-and-permissions.md](docs/roles-and-permissions.md)):
   sign up normally, then in the SQL editor run
   `select public.grant_admin_by_email('you@example.com');`
5. (Optional) seed dev data:
   ```bash
   # add SUPABASE_SERVICE_ROLE_KEY to .env first (server-only, never VITE_)
   npm run seed          # npm run seed:reset to wipe seeded users
   ```

## Commands

| Command (in `Rentora.Os/`) | Does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run build` | typecheck + production build |
| `npm run seed` / `seed:reset` | load / clear dev seed data |

## Documentation

- [docs/architecture.md](docs/architecture.md) — how the two apps became one; routing & theme isolation.
- [docs/database.md](docs/database.md) — tables, constraints, functions, migrations.
- [docs/roles-and-permissions.md](docs/roles-and-permissions.md) — roles, RLS, first admin.
- [docs/agent-onboarding.md](docs/agent-onboarding.md) — application → approval flow.
- [docs/tenant-invitations.md](docs/tenant-invitations.md) — invite / match / accept / move-out.
- [docs/integration-status.md](docs/integration-status.md) — what's live vs. still mocked.
- [docs/mvp-status.md](docs/mvp-status.md) — progress against the MVP completion criteria.

## Deployment (Vercel)

Set the project root to `Rentora.Os`, build command `npm run build`, output `dist`.
Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables.
`Rentora.Os/vercel.json` provides SPA rewrites so deep links / refreshes resolve.
