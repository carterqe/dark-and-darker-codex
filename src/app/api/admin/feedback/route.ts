import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

const ALLOWED_STATUSES = ["new", "reviewed", "resolved"] as const;
type Status = (typeof ALLOWED_STATUSES)[number];
const STATUS_FILTERS = [...ALLOWED_STATUSES, "all"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

function checkOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return origin === new URL(siteUrl).origin;
  }

  const host = request.headers.get("host");
  if (!host) return false;
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return origin === `${proto}://${host}`;
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const statusParam = (request.nextUrl.searchParams.get("status") ??
    "new") as StatusFilter;
  if (!STATUS_FILTERS.includes(statusParam)) {
    return NextResponse.json(
      { error: `status must be one of: ${STATUS_FILTERS.join(", ")}` },
      { status: 400 },
    );
  }

  const db = createAdminClient();
  let query = db
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (statusParam !== "all") {
    query = query.eq("status", statusParam);
  }

  const { data, error } = await query;
  if (error) {
    console.error("admin feedback list error:", error);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [], count: data?.length ?? 0 });
}

export async function PATCH(request: NextRequest) {
  if (!checkOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { id, status } = body as { id?: unknown; status?: unknown };

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (!ALLOWED_STATUSES.includes(status as Status)) {
    return NextResponse.json(
      { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` },
      { status: 400 },
    );
  }

  const update: { status: Status; resolved_at: string | null } = {
    status: status as Status,
    resolved_at: status === "resolved" ? new Date().toISOString() : null,
  };

  const db = createAdminClient();
  const { error } = await db.from("feedback").update(update).eq("id", id);
  if (error) {
    console.error("admin feedback update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
