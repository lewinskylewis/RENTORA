import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/app/lib/supabase";
import { loadSessionBundle } from "@/app/services/session";
import { signOut as authSignOut } from "@/app/services/auth";
import type { ProfileRow, UserRoleRow, AppRole, RoleStatus } from "@/app/types/database";

interface SessionContextValue {
  loading: boolean;
  /** True when a real Supabase backend is wired up. When false the app runs in
   *  a labelled DEV mode (all roles granted) so the dashboards render offline. */
  isConfigured: boolean;
  userId: string | null;
  profile: ProfileRow | null;
  roles: UserRoleRow[];
  hasRole: (role: AppRole, status?: RoleStatus) => boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

// DEV fallback identity — only used when Supabase env is absent.
const DEV_PROFILE: ProfileRow = {
  id: "dev-user",
  full_name: "Dev User",
  phone: "+254712345678",
  email: "dev@rentora.local",
  avatar_url: null,
  account_status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
const DEV_ROLES: UserRoleRow[] = (["tenant", "agent", "admin"] as AppRole[]).map((role, i) => ({
  id: `dev-role-${i}`,
  user_id: "dev-user",
  role,
  status: "active",
  approved_at: new Date().toISOString(),
  approved_by: null,
  created_at: new Date().toISOString(),
}));

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [roles, setRoles] = useState<UserRoleRow[]>([]);

  const hydrate = useCallback(async (uid: string | null) => {
    if (!uid || !supabase) {
      setUserId(null);
      setProfile(null);
      setRoles([]);
      return;
    }
    try {
      const bundle = await loadSessionBundle(uid);
      setUserId(uid);
      setProfile(bundle.profile);
      setRoles(bundle.roles);
    } catch {
      // A signed-in user with no profile yet (trigger lag) — keep the id.
      setUserId(uid);
      setProfile(null);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    // DEV mode: no backend configured → grant a full mock identity so every
    // workspace is reachable for visual verification. Clearly not production.
    if (!isSupabaseConfigured || !supabase) {
      setProfile(DEV_PROFILE);
      setRoles(DEV_ROLES);
      setUserId(DEV_PROFILE.id);
      setLoading(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      await hydrate(data.session?.user.id ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await hydrate(session?.user.id ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [hydrate]);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    await hydrate(userId);
  }, [hydrate, userId]);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await authSignOut();
  }, []);

  const hasRole = useCallback(
    (role: AppRole, status: RoleStatus = "active") =>
      roles.some((r) => r.role === role && r.status === status),
    [roles],
  );

  const value = useMemo<SessionContextValue>(
    () => ({ loading, isConfigured: isSupabaseConfigured, userId, profile, roles, hasRole, refresh, signOut }),
    [loading, userId, profile, roles, hasRole, refresh, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}
