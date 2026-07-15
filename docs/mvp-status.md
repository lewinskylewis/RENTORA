# MVP status

Progress against the 25 completion criteria. **Foundation checkpoint** (Phases 2–3).

Legend: ✅ done · 🟡 backend ready, UI wiring pending · ⬜ not started

| # | Criterion | Status |
| --- | --- | --- |
| 1 | Both dashboards visually intact | ✅ |
| 2 | One authentication system | ✅ (client+provider; tenant UI join in P4) |
| 3 | Public tenant registration | 🟡 (signUp service + trigger; form in P4) |
| 4 | Submit agent application | 🟡 (RPC live; form in P5) |
| 5 | Pending agent blocked from dashboard | ✅ (guard + RLS) |
| 6 | Admin can approve | 🟡 (RPC live; admin UI in P6) |
| 7 | Approved agent enters dashboard | ✅ |
| 8 | Agent data from backend | 🟡 (services ready; wiring in P7) |
| 9 | Create/manage properties | 🟡 (service + RLS; UI in P7) |
| 10 | Create/manage units | 🟡 |
| 11 | Invite a tenant | 🟡 (RPC live; UI in P7) |
| 12 | Existing tenant gets matched invite | 🟡 (matching implemented) |
| 13 | New tenant claims matching invite | 🟡 (trigger implemented) |
| 14 | Accept/reject invitation | 🟡 (RPCs live; UI in P8) |
| 15 | Acceptance creates tenancy | 🟡 (atomic RPC) |
| 16 | Acceptance marks unit occupied | 🟡 |
| 17 | Tenancy shows in both dashboards | 🟡 |
| 18 | End tenancy + join new property | 🟡 (RPCs live) |
| 19 | Previous tenancy history retained | ✅ (schema + history-safe indexes) |
| 20 | No cross-agency access | ✅ (RLS) |
| 21 | Tenant/agent/admin routes protected | ✅ (guards + RLS) |
| 22 | RLS working | ✅ (authored; verify after migrations applied) |
| 23 | Production build passes | ✅ |
| 24 | Vercel desktop + mobile | 🟡 (config + responsive layouts; deploy to confirm) |
| 25 | Core workflows not hardcoded | 🟡 (backend done; UI swap in P7–P8) |

## Next phase

**Phase 4 — Authentication & role routing:** connect signup/login to Supabase,
move tenant/guest off the mock flag onto `SessionProvider`, add the multi-role
workspace chooser, and confirm guards against real sessions. Then Phase 5 (agent
application form), Phase 6 (admin approval UI), Phase 7 (agent dashboard live
data), Phase 8 (tenant invitations/tenancies UI), Phase 9 (lifecycle), Phase 10
(tests), Phase 11 (handoff).
