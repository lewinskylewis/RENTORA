# Database

All schema lives in `supabase/migrations/` and is reproducible. Apply in order
(GitHub integration, `supabase db push`, or paste into the SQL editor).

| Migration | Contents |
| --- | --- |
| `0001_extensions_and_enums.sql` | `pgcrypto`, `citext`; all status enums |
| `0002_profiles_and_roles.sql` | `profiles`, `user_roles`, `tenant_profiles`; `set_updated_at`, `normalize_phone_ke`, role helpers (`has_role`, `is_admin`, `is_active_agent`) |
| `0003_agencies_and_agents.sql` | `agencies`, `agent_profiles`, `agent_applications`; `current_agency_id`, `agent_in_agency` |
| `0004_properties_and_units.sql` | `properties`, `units`; `unit_agency_id` |
| `0005_tenancies_and_invitations.sql` | `tenancies`, `tenant_invitations` + cross-entity validation triggers |
| `0006_audit_logs.sql` | `audit_logs`, internal `write_audit` |
| `0007_rls_policies.sql` | RLS enabled + policies on every table; `agent_manages_user` |
| `0008_functions_and_rpcs.sql` | `handle_new_user` trigger + all workflow RPCs |
| `0009_admin_bootstrap.sql` | `grant_admin_by_email` (service-role only) |

## Entities

`profiles` (1:1 with `auth.users`) · `user_roles` (many per user) ·
`tenant_profiles` · `agencies` · `agent_profiles` · `agent_applications` ·
`properties` · `units` · `tenancies` · `tenant_invitations` · `audit_logs`.

One permanent user identity; roles are separate rows so a person can be tenant +
agent + admin at once.

## Key constraints

- `user_roles unique (user_id, role)` — one row per role per user.
- `units unique (property_id, unit_number)` — one unit number per property.
- `tenancies_one_active_per_unit` — partial unique index on `unit_id` for live
  statuses (`invited`, `pending_confirmation`, `active`, `notice_given`). Ended /
  cancelled tenancies stay as history and don't block re-letting.
- `invitations_one_open_per_unit` — one open invitation per unit.
- `invitations_token_key` — invitation token hashes are unique (tokens are stored
  only as `sha256`, never in plain text).
- Check constraints: `national_id_last4 ~ '^[0-9]{4}$'`, `billing_day 1..31`,
  non-negative money/bedroom counts, `lease_end >= lease_start`.
- Cross-entity triggers (`tenancies_validate`, `invitations_validate`): unit must
  belong to the named property, and the agency must be the property's agency.

## Phone normalization

`normalize_phone_ke()` folds `0712345678`, `254712345678`, `+254712345678`, and
`712345678` to a single E.164 value (`+254712345678`). Applied by trigger on
`profiles.phone` and inside invitation/application RPCs. A client mirror lives in
`src/app/lib/phone.ts` for instant form feedback.

## Types

`src/app/types/database.ts` holds hand-authored `Row` types mirroring these
tables. When the CLI is linked, regenerate with:
`supabase gen types typescript --linked > src/app/types/database.ts`.
