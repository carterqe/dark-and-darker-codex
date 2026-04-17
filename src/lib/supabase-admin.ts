import { createClient } from "@supabase/supabase-js";

// Server-only admin client that bypasses RLS.
// Uses the service role key — never expose this to the browser.
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error(
    "Missing Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) — see .env.local.example"
  );

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createAdminClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}
