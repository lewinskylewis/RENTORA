# Agent onboarding

Direct agent signup is **not** allowed. Agents are onboarded by application +
admin approval (invite-only manual approval is also supported via SQL/admin RPCs).

## Application → approval flow

1. A signed-in user opens **`/apply/agent`** and submits their details.
   The form calls `submit_agent_application()` (Phase 5 wires the full form; the
   route + page exist now).
2. The RPC inserts an `agent_applications` row (`status = pending`) and creates a
   **pending** `agent` role. It writes an `agent_application_submitted` audit log.
3. The user is blocked from `/agent` and sees **`/agent-application/status`**,
   which reflects their agent role: pending / rejected / suspended / approved.
4. An admin reviews at `/admin/agent-applications` (Phase 6 UI) and calls
   `review_agent_application(id, decision, notes)`:
   - **approved** → creates the agency, a **verified** `agent_profile`, sets the
     agent role `active`; audit `agent_approved`.
   - **rejected** → agent role `rejected`; audit `agent_rejected`.
   - **needs_more_information** → status set; audit logged.
5. Once approved, the guard lets the user into `/agent` and RLS grants
   agency-scoped access to properties, units, tenancies, and invitations.

## Suspend / reactivate

`set_agent_status(user_id, status)` (admin only) flips the agent role and
`agent_profile.verification_status`. A suspended agent immediately loses
create/write access (RLS `current_agency_id` returns NULL once not `verified`).

## Statuses to track

Applications: `pending`, `approved`, `rejected`, `needs_more_information`.
Agent verification: `pending`, `verified`, `rejected`, `suspended`.
These support the admin metrics (total/pending applications, active/suspended
agents) surfaced on `/admin`.
