import { createClient } from "@supabase/supabase-js";

// Server-only admin client that bypasses RLS.
// Uses the service role key — never expose this to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key"
  );
}
