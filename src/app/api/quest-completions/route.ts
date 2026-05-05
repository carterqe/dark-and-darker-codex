import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";
import { TRADERS } from "@/lib/quest-data";

const VALID_QUEST_IDS = new Set(
  TRADERS.flatMap((t) => t.quests.map((q) => q.id)),
);

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("quest_completions")
    .select("quest_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("quest_completions select error:", error);
    return NextResponse.json({ error: "Failed to load completions" }, { status: 500 });
  }

  return NextResponse.json({ completed: data.map((r) => r.quest_id) });
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 30, windowMs: 60_000 });
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

  const body = await request.json().catch(() => null);
  const { quest_id } = body ?? {};

  if (typeof quest_id !== "string" || !VALID_QUEST_IDS.has(quest_id)) {
    return NextResponse.json({ error: "Invalid quest_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("quest_completions")
    .upsert({ user_id: user.id, quest_id }, { onConflict: "user_id,quest_id" });

  if (error) {
    console.error("quest_completions upsert error:", error);
    return NextResponse.json({ error: "Failed to save completion" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 30, windowMs: 60_000 });
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

  const body = await request.json().catch(() => null);
  const { quest_id } = body ?? {};

  if (typeof quest_id !== "string" || !VALID_QUEST_IDS.has(quest_id)) {
    return NextResponse.json({ error: "Invalid quest_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("quest_completions")
    .delete()
    .eq("user_id", user.id)
    .eq("quest_id", quest_id);

  if (error) {
    console.error("quest_completions delete error:", error);
    return NextResponse.json({ error: "Failed to remove completion" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
