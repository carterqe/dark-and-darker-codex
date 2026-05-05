import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 10, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  // RLS enforces ownership; the delete will silently no-op if the tip belongs
  // to another user, so we check ownership explicitly to return a proper 403.
  const { data: tip } = await supabase
    .from("quest_tips")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!tip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (tip.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("quest_tips")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("quest_tips delete error:", error);
    return NextResponse.json({ error: "Failed to delete tip" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
