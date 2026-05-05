import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";
import { TRADERS } from "@/lib/quest-data";

const VALID_QUEST_IDS = new Set(
  TRADERS.flatMap((t) => t.quests.map((q) => q.id)),
);

const ALLOWED_TIP_TYPES = ["general", "farming", "strategy", "warning"] as const;
type TipType = (typeof ALLOWED_TIP_TYPES)[number];

export async function GET(request: NextRequest) {
  const quest_id = request.nextUrl.searchParams.get("quest_id");

  if (!quest_id || !VALID_QUEST_IDS.has(quest_id)) {
    return NextResponse.json({ error: "Invalid quest_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quest_tips")
    .select("id, quest_id, user_id, content, tip_type, helpful_count, created_at, profiles!user_id(username)")
    .eq("quest_id", quest_id)
    .order("helpful_count", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("quest_tips select error:", error);
    return NextResponse.json({ error: "Failed to load tips" }, { status: 500 });
  }

  return NextResponse.json({ tips: data });
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 5, windowMs: 60_000 });
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
  const { quest_id, content, tip_type } = body ?? {};

  if (typeof quest_id !== "string" || !VALID_QUEST_IDS.has(quest_id)) {
    return NextResponse.json({ error: "Invalid quest_id" }, { status: 400 });
  }

  if (
    typeof content !== "string" ||
    content.trim().length < 10 ||
    content.trim().length > 500
  ) {
    return NextResponse.json(
      { error: "content must be between 10 and 500 characters" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TIP_TYPES.includes(tip_type as TipType)) {
    return NextResponse.json(
      { error: `tip_type must be one of: ${ALLOWED_TIP_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("quest_tips")
    .insert({
      quest_id,
      user_id: user.id,
      content: content.trim(),
      tip_type,
    })
    .select("id")
    .single();

  if (error) {
    console.error("quest_tips insert error:", error);
    return NextResponse.json({ error: "Failed to submit tip" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
