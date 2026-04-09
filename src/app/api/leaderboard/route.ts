import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category") || "EA7_HR";
  const limit = params.get("limit") || "250";

  const qs = new URLSearchParams();
  qs.set("limit", limit);

  const res = await fetch(`${API_BASE}/leaderboards/${category}?${qs.toString()}`);
  const data = await res.json();

  return NextResponse.json(data);
}
