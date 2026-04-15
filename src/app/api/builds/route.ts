import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  // Verify session from cookies
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, class: cls, tags, equipment, perks, skills, spells } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "Build title is required" }, { status: 400 });
  }
  if (!cls) {
    return NextResponse.json({ error: "Class is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("builds")
    .insert({
      author_id: user.id,
      title: title.trim(),
      description: description?.trim() ?? "",
      class: cls,
      tags: tags ?? [],
      equipment: equipment ?? {},
      perks: perks ?? [],
      skills: skills ?? [],
      spells: spells ?? [],
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
