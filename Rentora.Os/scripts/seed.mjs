// RENTORA development seed.
// Creates a realistic dataset the existing dashboards can display. Uses the
// SERVICE-ROLE key (bypasses RLS) and the Auth admin API — run it locally only,
// never ship the service-role key to the browser.
//
//   Usage (from Rentora.Os/):
//     SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
//   or put those in .env (this script loads it) and run:  npm run seed
//
// Re-running: call `npm run seed:reset` first (see scripts/seed-reset.mjs) or
// delete the seeded auth users from the Supabase dashboard, then re-run.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { randomBytes, createHash } from "node:crypto";

// ── Load .env (simple parser; no dependency) ─────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(resolve(__dirname, "..", ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* no .env — rely on real env vars */ }

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY. See .env.example.");
  process.exit(1);
}

const db = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const PASSWORD = "Rentora#2026";

async function ensureUser(email, fullName, phone) {
  // Create (or fetch existing) a confirmed auth user; the handle_new_user trigger
  // creates the profile + active tenant role.
  const { data, error } = await db.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone },
  });
  if (error && !/already/i.test(error.message)) throw error;
  let id = data?.user?.id;
  if (!id) {
    const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    id = list.users.find((u) => u.email === email)?.id;
  }
  if (!id) throw new Error(`could not resolve user ${email}`);
  return id;
}

async function main() {
  console.log("Seeding RENTORA dev data…");

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminId = await ensureUser("admin@rentora.local", "Amina Admin", "+254700000001");
  const agentId = await ensureUser("agent@rentora.local", "Alex Mwangi", "+254700000002");
  const pendingAgentId = await ensureUser("pending.agent@rentora.local", "Peter Pending", "+254700000003");
  const tenantId = await ensureUser("tenant@rentora.local", "Tessa Tenant", "+254700000004");

  // Admin role (mirrors grant_admin_by_email).
  await db.from("user_roles").upsert(
    { user_id: adminId, role: "admin", status: "active", approved_at: new Date().toISOString() },
    { onConflict: "user_id,role" },
  );

  // ── Approved agent → agency + verified agent profile + active role ──────────
  const { data: agency } = await db
    .from("agencies")
    .insert({ name: "Skyline Property Management", county: "Nairobi", phone: "+254700000010", email: "hello@skyline.local", status: "active" })
    .select("*")
    .single();

  await db.from("agent_profiles").upsert(
    { user_id: agentId, agency_id: agency.id, verification_status: "verified", onboarding_status: "complete", job_title: "Lead Agent" },
    { onConflict: "user_id" },
  );
  await db.from("user_roles").upsert(
    { user_id: agentId, role: "agent", status: "active", approved_at: new Date().toISOString(), approved_by: adminId },
    { onConflict: "user_id,role" },
  );

  // ── Pending agent (application in flight, role pending) ─────────────────────
  await db.from("agent_applications").insert({
    user_id: pendingAgentId, agency_name: "Green Homes Ltd", applicant_name: "Peter Pending",
    phone: "+254700000003", email: "pending.agent@rentora.local", county: "Kiambu",
    estimated_units_managed: 20, status: "pending",
  });
  await db.from("user_roles").upsert(
    { user_id: pendingAgentId, role: "agent", status: "pending" },
    { onConflict: "user_id,role" },
  );

  // ── Properties + units ──────────────────────────────────────────────────────
  const { data: props } = await db
    .from("properties")
    .insert([
      { agency_id: agency.id, created_by: agentId, name: "Skyline Apartments", property_type: "apartment", county: "Nairobi", town: "Embakasi East", address: "Skyline Rd", status: "active" },
      { agency_id: agency.id, created_by: agentId, name: "Riverfront Lofts", property_type: "apartment", county: "Nairobi", town: "Westlands", address: "River Dr", status: "active" },
    ])
    .select("*");
  const [p1, p2] = props;

  const { data: units } = await db
    .from("units")
    .insert([
      { property_id: p1.id, unit_number: "4C", unit_type: "2BR", bedrooms: 2, bathrooms: 2, monthly_rent: 60000, deposit_amount: 60000, occupancy_status: "vacant", listing_status: "private" },
      { property_id: p1.id, unit_number: "5B", unit_type: "1BR", bedrooms: 1, bathrooms: 1, monthly_rent: 40000, deposit_amount: 40000, occupancy_status: "vacant", listing_status: "published" },
      { property_id: p1.id, unit_number: "2A", unit_type: "Studio", bedrooms: 0, bathrooms: 1, monthly_rent: 28000, deposit_amount: 28000, occupancy_status: "vacant", listing_status: "published" },
      { property_id: p2.id, unit_number: "301", unit_type: "3BR", bedrooms: 3, bathrooms: 2, monthly_rent: 95000, deposit_amount: 95000, occupancy_status: "vacant", listing_status: "private" },
    ])
    .select("*");
  const u4c = units.find((u) => u.unit_number === "4C");
  const u5b = units.find((u) => u.unit_number === "5B");
  const u301 = units.find((u) => u.unit_number === "301");

  // ── Active tenancy for the existing tenant (unit 4C occupied) ───────────────
  await db.from("tenancies").insert({
    tenant_user_id: tenantId, property_id: p1.id, unit_id: u4c.id, agency_id: agency.id,
    created_by_agent_id: agentId, lease_start: "2026-01-01", lease_end: "2026-12-31",
    monthly_rent: 60000, deposit_amount: 60000, billing_day: 1, status: "active",
    tenant_accepted_at: new Date().toISOString(),
  });
  await db.from("units").update({ occupancy_status: "occupied" }).eq("id", u4c.id);

  // ── Ended tenancy (history) on unit 301 ─────────────────────────────────────
  await db.from("tenancies").insert({
    tenant_user_id: tenantId, property_id: p2.id, unit_id: u301.id, agency_id: agency.id,
    created_by_agent_id: agentId, lease_start: "2024-01-01", lease_end: "2024-12-31",
    monthly_rent: 90000, deposit_amount: 90000, billing_day: 1, status: "ended",
    tenant_accepted_at: "2024-01-01T00:00:00Z", ended_at: "2024-12-31T00:00:00Z",
  });

  // ── Matched invitation (tenant already has an account) on unit 5B ───────────
  await db.from("tenant_invitations").insert({
    agency_id: agency.id, property_id: p1.id, unit_id: u5b.id, invited_by_agent_id: agentId,
    tenant_name: "Tessa Tenant", tenant_email: "tenant@rentora.local", tenant_phone: "+254700000004",
    matched_user_id: tenantId, status: "matched",
    lease_start: "2026-08-01", monthly_rent: 40000, deposit_amount: 40000, billing_day: 1,
    expires_at: new Date(Date.now() + 14 * 864e5).toISOString(),
  });
  await db.from("units").update({ occupancy_status: "reserved" }).eq("id", u5b.id);

  // ── Unmatched invitation (no account yet) on unit 2A, with a shareable link ─
  const rawToken = randomBytes(24).toString("hex");
  const u2a = units.find((u) => u.unit_number === "2A");
  await db.from("tenant_invitations").insert({
    agency_id: agency.id, property_id: p1.id, unit_id: u2a.id, invited_by_agent_id: agentId,
    tenant_name: "Newcomer Njoroge", tenant_email: "newcomer@example.com", tenant_phone: "+254711223344",
    invitation_token_hash: createHash("sha256").update(rawToken).digest("hex"), status: "pending",
    lease_start: "2026-09-01", monthly_rent: 28000, deposit_amount: 28000, billing_day: 5,
    expires_at: new Date(Date.now() + 14 * 864e5).toISOString(),
  });
  await db.from("units").update({ occupancy_status: "reserved" }).eq("id", u2a.id);

  console.log("\n✓ Seed complete.");
  console.log("  Login password for all seeded users:", PASSWORD);
  console.log("  admin@rentora.local  (admin)");
  console.log("  agent@rentora.local  (approved agent, agency: Skyline Property Management)");
  console.log("  pending.agent@rentora.local  (pending agent)");
  console.log("  tenant@rentora.local  (tenant with active + ended tenancy + a matched invitation)");
  console.log("  Unmatched invitation link token:", rawToken);
}

main().catch((e) => {
  console.error("Seed failed:", e.message ?? e);
  process.exit(1);
});
