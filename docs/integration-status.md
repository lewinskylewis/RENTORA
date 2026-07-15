# Integration status

Snapshot after **Phase 2 (app integration)** + **Phase 3 (backend foundation)**.

## Done

- ✅ Two apps merged into one (`Rentora.Os` base). Both dashboards render with
  their **original styling preserved and isolated** (verified: `/tenant/dashboard`,
  `/agent`, `/admin`, `/login`).
- ✅ One router, one `SessionProvider`, one Supabase client, route guards.
- ✅ Full backend authored: 9 migrations (schema, enums, constraints, triggers,
  RLS on every table, workflow RPCs, admin bootstrap), `.env.example`,
  hand-authored DB types, typed service layer, dev seed script.
- ✅ Production build passes (`npm run build`); strict typecheck clean.

## Live vs. mocked (per page)

| Area | State | Notes |
| --- | --- | --- |
| Auth (Supabase) | **Backend ready** | client + provider done; tenant login still on transitional mock flag until Phase 4 |
| Roles / guards | **Live** | via SessionProvider + RLS (dev mode grants all roles offline) |
| Agent application / status | Route + page live | full form submission → Phase 5 |
| Admin overview | **Live counts** (when configured) | approve/suspend UI → Phase 6 |
| Agent dashboard, properties, units, tenants, vacancies, invitations, finance, maintenance, leads, reports, settings | **Still inline mock data** | services exist; UI wiring is Phase 7 |
| Tenant dashboard, listings, payments, maintenance, move-out | **Still mock data** | invitations/tenancies wiring is Phase 8 |

## Service layer ↔ backend (ready to wire)

`services/{applications,invitations,properties,units,tenancies,agencies,admin,metrics,session,auth}.ts`
are implemented against the RPCs/tables and typed, awaiting UI consumption in
Phases 4–9.

## Known limitations (this checkpoint)

- Tenant/guest access still uses `sessionStorage` mock auth (Phase 4 unifies it).
- Payments, maintenance, finance, reports, leads remain UI-only (post-MVP phases).
- Automated tests not yet added (Phase 10).
- `Rentora.Agent/` source folder retained (not yet archived).
