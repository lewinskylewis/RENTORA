import { requireSupabase } from "@/app/lib/supabase";
import { normalizePhoneKe } from "@/app/lib/phone";

export interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

/** Public tenant registration. The DB trigger creates the profile + active
 *  tenant role and matches any pending invitations for this email/phone. */
export async function signUp({ email, password, fullName, phone }: SignUpInput) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: normalizePhoneKe(phone) ?? undefined,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const sb = requireSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const sb = requireSupabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}
