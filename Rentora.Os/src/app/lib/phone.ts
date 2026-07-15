// Client-side mirror of the SQL normalize_phone_ke() for form validation/preview.
// The database is still the source of truth; this just gives instant feedback.
export function normalizePhoneKe(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits === "") return null;
  if (digits.length === 10 && digits.startsWith("0")) return "+254" + digits.slice(1);
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.length === 9 && /^[71]/.test(digits)) return "+254" + digits;
  return "+" + digits;
}

export function isValidKenyanPhone(raw: string | null | undefined): boolean {
  const n = normalizePhoneKe(raw);
  return !!n && /^\+254[71]\d{8}$/.test(n);
}
