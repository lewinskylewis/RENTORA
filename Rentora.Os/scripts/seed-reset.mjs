// Deletes the seeded auth users. ON DELETE CASCADE on profiles removes their
// roles, tenancies, invitations, agent profiles, etc. Agencies/properties owned
// by the seed agent are removed via the agency cascade when its rows go, except
// the agency row itself — this script also clears the seed agency by name.
//
//   Usage (from Rentora.Os/):  npm run seed:reset
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const envFile = readFileSync(resolve(__dirname, "..", ".env"), "utf8");
  for (const line of envFile.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* ignore */ }

const URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_KEY) { console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const db = createClient(URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
const SEED_EMAILS = ["admin@rentora.local", "agent@rentora.local", "pending.agent@rentora.local", "tenant@rentora.local"];

const { data: list } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
for (const email of SEED_EMAILS) {
  const u = list.users.find((x) => x.email === email);
  if (u) { await db.auth.admin.deleteUser(u.id); console.log("deleted", email); }
}
await db.from("agencies").delete().eq("name", "Skyline Property Management");
console.log("✓ Reset complete.");
