import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/items/${id}`, {
    next: { revalidate: 300 },
  });
  const data = await res.json();
  const response = NextResponse.json(data);
  response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
  return response;
}
