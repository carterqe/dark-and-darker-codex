import { NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/population`, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 30 },
    });
    const data = await res.json();
    const response = NextResponse.json(data);
    // 30s CDN cache — all users share one cached response instead of each hitting DarkerDB
    response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=10");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch population" }, { status: 503 });
  }
}
