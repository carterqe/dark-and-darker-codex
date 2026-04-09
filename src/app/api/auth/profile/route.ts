import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const { username, access_token } = await request.json();

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  // Verify the user's identity using their access token
  let userId: string | null = null;

  if (access_token) {
    // Token passed directly from signUp response (cookies may not be set yet)
    const admin = createAdminClient();
    const { data } = await admin.auth.getUser(access_token);
    userId = data.user?.id ?? null;
  }

  if (!userId) {
    // Fallback: try cookie-based session
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use admin client to bypass RLS for profile creation
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .upsert({ id: userId, username: username.trim() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
