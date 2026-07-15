# Architecture

## Integration decision

Both dashboards were Figma Make exports sharing an identical stack (React 18,
Vite 6, Tailwind v4, the same 48-component shadcn `ui/` set, react-router v7).
**`Rentora.Os` (Tenant Dashboard) is the base app** because it already had the
clean feature architecture the brief asked the Agent folder to be reshaped into:

```
Rentora.Os/src/
  main.tsx                     ← BrowserRouter + SessionProvider
  app/
    App.tsx                    ← app state (theme, tenant mock-auth) → AppRoutes
    routing/
      AppRoutes.tsx            ← ONE router: tenant + guest + agent + admin + onboarding
      guards.tsx               ← RequireAuth / RequireAgent / RequireAdmin
      paths.ts
    providers/
      SessionProvider.tsx      ← Supabase session + roles (real auth boundary)
    layouts/
      AppLayout / Header / Sidebar    ← tenant chrome
      TenantThemeShell.tsx     ← wraps tenant/guest/auth in the dynamic theme
      AgentLayout.tsx          ← migrated Agent shell (fixed zinc/indigo)
      AdminLayout.tsx          ← minimal admin shell
    features/
      <tenant features…>       ← unchanged
      agent/pages/*            ← migrated verbatim from Rentora.Agent
      admin/pages/*            ← new, minimal
      onboarding/*             ← /apply/agent, /agent-application/status
    services/                  ← typed data-access layer (one module per domain)
    lib/                       ← supabase client, env, phone, cn helpers
    types/                     ← domain + database (Row) types
supabase/
  migrations/000*.sql          ← reproducible schema, RLS, functions
  config.toml
```

The Agent app's flat `components/*` + its own `createBrowserRouter` were replaced
by a single `<Routes>` tree. Its page components moved into
`features/agent/pages/` **unchanged** (they were self-contained — only `clsx`,
`tailwind-merge`, `lucide-react`).

## Two visual systems, preserved

- **Tenant OS** uses a dynamic 3-theme system (`cosmos`/`aurora`/`midnight`) that
  remaps Tailwind color variables on a `data-theme` root.
- **Agent** uses a fixed zinc/indigo dark palette written as explicit utility
  classes.

If the Agent dashboard rendered *inside* the tenant `data-theme` remap, its
indigo/emerald would be recolored (e.g. → green under `aurora`). So the router
mounts `/agent/*` and `/admin/*` **outside** `TenantThemeShell`. The tenant theme
wraps only `/login`, `/signup`, `/apply/*`, `/guest/*`, `/tenant/*`. Result: each
dashboard keeps its exact original look, verified rendering side-by-side.

## Authentication seam

`SessionProvider` is the single source of truth for identity + roles:

- **Configured** (env present): subscribes to Supabase auth, loads `profiles` +
  `user_roles` for the signed-in user, exposes `hasRole(role, status)`.
- **Dev mode** (no env): grants a labelled full-mock identity so the UI renders
  offline. Clearly not production.

Route guards read this context; **RLS enforces the same rules server-side** so a
direct URL, edited localStorage, or client tampering cannot escalate privileges.
The tenant/guest branch still uses a transitional `sessionStorage` mock flag
(`rentora.authState`); Phase 4 migrates it onto `SessionProvider` too.

## Data-access layer

UI never queries Supabase directly. Every read/write goes through
`src/app/services/*` (auth, session, applications, invitations, properties,
units, tenancies, agencies, admin, metrics). Privileged/atomic operations are
Postgres `SECURITY DEFINER` RPCs; services just call `supabase.rpc(...)`.
