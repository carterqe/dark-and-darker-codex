import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";

const ALLOWED_TARGET_TYPES = [
  "map", "quest", "item", "boss", "shrine", "campfire", "other",
] as const;
type TargetType = (typeof ALLOWED_TARGET_TYPES)[number];

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok } = rateLimit(ip, { limit: 10, windowMs: 60_000 });
  if (!ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // CSRF origin check
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Verify session from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const {
    target_type,
    target_id,
    field,
    current_value,
    suggested_value,
    reason,
  } = body;

  // --- Input validation ---

  if (!ALLOWED_TARGET_TYPES.includes(target_type as TargetType)) {
    return NextResponse.json(
      { error: `target_type must be one of: ${ALLOWED_TARGET_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  if (typeof target_id !== "string" || !target_id.trim() || target_id.length > 100) {
    return NextResponse.json(
      { error: "target_id is required and must be at most 100 characters" },
      { status: 400 },
    );
  }

  if (typeof field !== "string" || !field.trim() || field.length > 60) {
    return NextResponse.json(
      { error: "field is required and must be at most 60 characters" },
      { status: 400 },
    );
  }

  if (current_value != null && (typeof current_value !== "string" || current_value.length > 2000)) {
    return NextResponse.json(
      { error: "current_value must be a string of at most 2000 characters" },
      { status: 400 },
    );
  }

  if (typeof suggested_value !== "string" || !suggested_value.trim() || suggested_value.length > 2000) {
    return NextResponse.json(
      { error: "suggested_value is required and must be at most 2000 characters" },
      { status: 400 },
    );
  }

  if (reason != null && (typeof reason !== "string" || reason.length > 1000)) {
    return NextResponse.json(
      { error: "reason must be a string of at most 1000 characters" },
      { status: 400 },
    );
  }

  // --- Insert via RLS-respecting client ---

  const { data, error } = await supabase
    .from("corrections")
    .insert({
      user_id: user.id,
      target_type,
      target_id: target_id.trim(),
      field: field.trim(),
      current_value: current_value?.trim() ?? null,
      suggested_value: suggested_value.trim(),
      reason: reason?.trim() ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("corrections insert error:", error);
    return NextResponse.json(
      { error: "Failed to submit correction" },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data.id });
}
