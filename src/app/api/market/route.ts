import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.darkerdb.com/v1";
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGES = 20; // 20 × 50 = 1000 recent listings — gives client-side filters more to work with

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

  // Page-paginated fetch, capped at MAX_PAGES. `?page=N` is reliable for pagination
  // (unlike `cursor=` which upstream returns inconsistently). Dedup by id handles the
  // small ~3% overlap rate observed across pages.
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "cursor" && key !== "page") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "50");

  const byId = new Map<number, unknown>();

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      filterParams.set("page", String(page));
      const res = await fetch(`${API_BASE}/market?${filterParams.toString()}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 60 },
      });
      const data = await res.json();

      const body = (data?.body as Array<{ id?: number }>) ?? [];
      if (body.length === 0) break;
      for (const item of body) {
        if (item?.id != null && !byId.has(item.id)) byId.set(item.id, item);
      }
      if (body.length < 50) break;
    }
  } catch { /* timeout or network error — return what we have */ }

  const allItems = [...byId.values()];

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
