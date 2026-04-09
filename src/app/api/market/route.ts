import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fetchAll = params.get("fetchAll") === "true";

  if (!fetchAll) {
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/market${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Fetch all pages via cursor pagination (capped at 500 listings)
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "cursor") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "50");

  const allItems: unknown[] = [];
  let cursor: string | null = null;
  const maxPages = 10; // 50 * 10 = 500 max
  let page = 0;

  while (page < maxPages) {
    if (cursor) filterParams.set("cursor", cursor);
    const res = await fetch(`${API_BASE}/market?${filterParams.toString()}`);
    const data = await res.json();

    if (!data.body || data.body.length === 0) break;
    allItems.push(...data.body);

    // Get next cursor
    if (data.pagination?.next) {
      try {
        const nextUrl = new URL(data.pagination.next);
        cursor = nextUrl.searchParams.get("cursor");
        if (!cursor) break;
      } catch {
        break;
      }
    } else if (data.body.length >= 50) {
      const last = data.body[data.body.length - 1];
      cursor = last?.cursor ? String(last.cursor) : null;
      if (!cursor) break;
    } else {
      break;
    }

    page++;
  }

  return NextResponse.json({
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
}
