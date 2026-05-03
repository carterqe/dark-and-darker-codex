import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/characters/${id}`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
  return response;
}
