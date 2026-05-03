import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGES = 10; // was 30 — items are cached anyway so 1000 items is plenty

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fetchAll = params.get("fetchAll") === "true";

  if (!fetchAll) {
    try {
      const qs = params.toString();
      const res = await fetch(`${API_BASE}/items${qs ? `?${qs}` : ""}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 300 },
      });
      const data = await res.json();
      const response = NextResponse.json(data);
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
      return response;
    } catch {
      return NextResponse.json({ error: "Failed to fetch items" }, { status: 503 });
    }
  }

  // fetchAll: page 1 first, then remaining pages in parallel
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "limit" && key !== "page") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "100");
  filterParams.set("page", "1");

  try {
    const firstRes = await fetch(`${API_BASE}/items?${filterParams.toString()}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 3600 },
    });
    const firstData = await firstRes.json();
    const allItems: unknown[] = firstData.body ?? [];
    const totalPages = Math.min(firstData.pagination?.num_pages ?? 1, MAX_PAGES);

    if (totalPages > 1) {
      const pagePromises: Promise<unknown[]>[] = [];
      for (let page = 2; page <= totalPages; page++) {
        const p = new URLSearchParams(filterParams);
        p.set("page", String(page));
        pagePromises.push(
          fetch(`${API_BASE}/items?${p.toString()}`, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            next: { revalidate: 300 },
          })
            .then((r) => r.json())
            .then((d) => d.body ?? [])
            .catch(() => [])
        );
      }
      const results = await Promise.all(pagePromises);
      for (const items of results) allItems.push(...(items as unknown[]));
    }

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
    response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 503 });
  }
}
