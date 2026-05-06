import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";

const ALLOWED_CLASSES = [
  "Fighter", "Barbarian", "Rogue", "Ranger", "Wizard",
  "Cleric", "Bard", "Warlock", "Druid", "Sorcerer",
] as const;

function validateStringArray(
  value: unknown,
  maxItems: number,
  maxLen: number,
): string[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length > maxItems) return null;
  for (const item of value) {
    if (typeof item !== "string" || item.length > maxLen) return null;
  }
  return value;
}

export async function PATCH(
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

  // Verify ownership before update
  const { data: existing } = await supabase
    .from("builds")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, class: cls, tags, equipment, perks, skills, spells } = body;

  if (typeof title !== "string" || !title.trim() || title.length > 100) {
    return NextResponse.json(
      { error: "Title is required and must be at most 100 characters" },
      { status: 400 },
    );
  }

  if (description != null && (typeof description !== "string" || description.length > 2000)) {
    return NextResponse.json(
      { error: "Description must be at most 2000 characters" },
      { status: 400 },
    );
  }

  if (!ALLOWED_CLASSES.includes(cls)) {
    return NextResponse.json(
      { error: `Class must be one of: ${ALLOWED_CLASSES.join(", ")}` },
      { status: 400 },
    );
  }

  const validatedTags = validateStringArray(tags ?? [], 5, 30);
  if (!validatedTags) {
    return NextResponse.json(
      { error: "Tags must be an array of up to 5 strings (max 30 chars each)" },
      { status: 400 },
    );
  }

  const validatedPerks = validateStringArray(perks ?? [], 4, 50);
  if (!validatedPerks) {
    return NextResponse.json(
      { error: "Perks must be an array of up to 4 strings (max 50 chars each)" },
      { status: 400 },
    );
  }

  const validatedSkills = validateStringArray(skills ?? [], 2, 50);
  if (!validatedSkills) {
    return NextResponse.json(
      { error: "Skills must be an array of up to 2 strings (max 50 chars each)" },
      { status: 400 },
    );
  }

  const validatedSpells = validateStringArray(spells ?? [], 20, 50);
  if (!validatedSpells) {
    return NextResponse.json(
      { error: "Spells must be an array of up to 20 strings (max 50 chars each)" },
      { status: 400 },
    );
  }

  if (
    equipment != null &&
    (typeof equipment !== "object" ||
      Array.isArray(equipment) ||
      JSON.stringify(equipment).length > 10000)
  ) {
    return NextResponse.json(
      { error: "Equipment must be a plain object (max 10 000 chars serialized)" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("builds")
    .update({
      title: title.trim(),
      description: description?.trim() ?? "",
      class: cls,
      tags: validatedTags,
      equipment: equipment ?? {},
      perks: validatedPerks,
      skills: validatedSkills,
      spells: validatedSpells,
    })
    .eq("id", id);

  if (error) {
    console.error("builds update error:", error);
    return NextResponse.json({ error: "Failed to update build" }, { status: 500 });
  }

  return NextResponse.json({ id });
}

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

  const { data: existing } = await supabase
    .from("builds")
    .select("author_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.author_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("builds").delete().eq("id", id);

  if (error) {
    console.error("builds delete error:", error);
    return NextResponse.json({ error: "Failed to delete build" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
