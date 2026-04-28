import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { checkOrigin } from "@/lib/origin-check";

const ALLOWED_CATEGORIES = ["bug", "suggestion", "data", "other"] as const;
type Category = (typeof ALLOWED_CATEGORIES)[number];

function truncate(value: string | null, max: number): string | null {
  if (value == null) return null;
  return value.length > max ? value.slice(0, max) : value;
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

  // Optional auth — anonymous submissions allowed.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { category, message } = body as {
    category?: unknown;
    message?: unknown;
  };

  if (!ALLOWED_CATEGORIES.includes(category as Category)) {
    return NextResponse.json(
      {
        error: `category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 2000
  ) {
    return NextResponse.json(
      { error: "message is required and must be at most 2000 characters" },
      { status: 400 },
    );
  }

  const pageUrl = truncate(request.headers.get("referer"), 500);
  const userAgent = truncate(request.headers.get("user-agent"), 500);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("feedback")
    .insert({
      user_id: user?.id ?? null,
      category,
      message: message.trim(),
      page_url: pageUrl,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("feedback insert error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }

  return NextResponse.json({ id: data.id });
}
