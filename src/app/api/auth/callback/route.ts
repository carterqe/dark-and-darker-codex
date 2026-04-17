import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/builds";

  // Only allow same-origin relative paths — reject protocol-relative (`//evil.com`)
  // and backslash-prefixed (`/\evil.com`) forms that browsers would send off-site.
  const safeNext = /^\/(?![/\\])/.test(requestedNext) ? requestedNext : "/builds";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${safeNext}`);
}
