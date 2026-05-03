import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") || "EA7_HR";
  const limit = Math.min(parseInt(params.get("limit") || "250", 10), 500);

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));

  try {
    const res = await fetch(`${API_BASE}/leaderboards/${category}?${qs.toString()}`, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 60 },
    });
    const data = await res.json();
    const response = NextResponse.json(data);
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 503 });
  }
}
