import { createClient } from "@/lib/supabase-server";
import type { User } from "@supabase/supabase-js";

function getAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email?.toLowerCase();
  if (!email) return null;

  const allowlist = getAllowlist();
  if (allowlist.length === 0) return null;

  return allowlist.includes(email) ? user : null;
}
