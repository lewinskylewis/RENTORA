# Tenant invitations & tenancy lifecycle

An agent never creates a tenant account or password. They create an **invitation**;
the permanent tenant identity is always owned by the tenant.

## Creating an invitation

`create_tenant_invitation(property, unit, name, email, phone, lease terms…)`
(active agents only):

1. Verifies the property belongs to the agent's agency and the unit to the
   property (also enforced by triggers).
2. Normalizes email/phone and **searches for an existing verified account** by
   those identifiers (never by name). If found → `matched_user_id` set, status
   `matched`.
3. Inserts the invitation carrying the lease terms; generates a random token,
   stores only its `sha256` hash, and returns the **raw token once** when the
   tenant has no account yet (for a shareable link — future SMS/WhatsApp/email).
4. Reserves the unit (`vacant → reserved`) and writes a `tenant_invited` audit log.

## Two tenant scenarios

- **Existing Rentora account** → invitation is pre-matched; it appears in the
  tenant's dashboard (`/tenant`) to accept or reject. No duplicate account.
- **No account yet** → pending invitation only. When the person later signs up
  with the matching verified email/phone, `handle_new_user` auto-matches the
  invitation to their new account.

## Accept (atomic)

`accept_tenant_invitation(id, token?)` runs as one transaction:

1. Locks the invitation; verifies it belongs to the caller (matched or valid
   token), is not expired, and is `pending`/`matched` (blocks double-accept).
2. Locks the unit; requires `vacant`/`reserved`.
3. Creates the `tenancy` (status `active`, or `pending_confirmation` if the lease
   starts in the future), attached to the tenant's permanent account.
4. Marks the invitation `accepted`, the unit `occupied`; writes
   `invitation_accepted` audit. The `one active tenancy per unit` index prevents
   duplicates even under a race.

## Reject

`reject_tenant_invitation(id, token?)`: marks `rejected`, returns the unit to
`vacant` if it was only reserved for this invitation, writes an audit log. No
tenancy is created.

## Moving to a new home

The model never binds a tenant to one agent/agency:

1. Old tenancy → `give_tenancy_notice()` → `notice_given`, then `end_tenancy()`
   → `ended` + unit freed. It stays in history.
2. The new agent sends a fresh invitation; the tenant accepts; a new tenancy
   becomes the current home.
3. The tenant keeps the same account. RLS ensures the **old agent cannot see the
   new tenancy** and the **new agent cannot see the old one** (different agency).

`splitCurrentAndPast()` in `services/tenancies.ts` separates the current home from
previous homes for the tenant dashboard (Phase 8 UI).
