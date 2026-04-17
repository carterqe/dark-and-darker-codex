import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGES = 5; // was 10 — 250 listings is plenty, sequential so keep this tight

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fetchAll = params.get("fetchAll") === "true";

  if (!fetchAll) {
    try {
      const qs = params.toString();
      const res = await fetch(`${API_BASE}/market${qs ? `?${qs}` : ""}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 60 },
      });
      const data = await res.json();
      const response = NextResponse.json(data);
      response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=20");
      return response;
    } catch {
      return NextResponse.json({ error: "Failed to fetch market" }, { status: 503 });
    }
  }

  // Cursor-paginated fetch, capped at MAX_PAGES * 50 = 250 listings
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "cursor") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "50");

  const allItems: unknown[] = [];
  let cursor: string | null = null;
  let page = 0;

  try {
    while (page < MAX_PAGES) {
      if (cursor) filterParams.set("cursor", cursor);
      const res = await fetch(`${API_BASE}/market?${filterParams.toString()}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 60 },
      });
      const data = await res.json();

      if (!data.body || data.body.length === 0) break;
      allItems.push(...data.body);

      if (data.pagination?.next) {
        try {
          const nextUrl = new URL(data.pagination.next);
          cursor = nextUrl.searchParams.get("cursor");
          if (!cursor) break;
        } catch { break; }
      } else if (data.body.length >= 50) {
        const last = data.body[data.body.length - 1];
        cursor = last?.cursor ? String(last.cursor) : null;
        if (!cursor) break;
      } else {
        break;
      }

      page++;
    }
  } catch { /* timeout or network error — return what we have */ }

  const response = NextResponse.json({
    version: "1.0.7",
    status: "OK",
    code: 200,
    query_time: 0,
    query_date: new Date().toISOString(),
    stage: "proxy",
    build: "",
    patch: 0,
    meta: { method: "GET", request: "", query: {}, params: [] },
    pagination: {
      count: allItems.length,
      limit: allItems.length,
      page: 1,
      num_pages: 1,
      total: allItems.length,
      next: null,
    },
    body: allItems,
  });
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=20");
  return response;
}
