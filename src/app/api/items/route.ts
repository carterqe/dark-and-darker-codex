import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fetchAll = params.get("fetchAll") === "true";

  if (!fetchAll) {
    const qs = params.toString();
    const res = await fetch(`${API_BASE}/items${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Fetch all pages for the given filters — first page to get total, then rest in parallel
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "limit" && key !== "page") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "100");
  filterParams.set("page", "1");

  const firstRes = await fetch(`${API_BASE}/items?${filterParams.toString()}`);
  const firstData = await firstRes.json();
  const allItems: unknown[] = firstData.body ?? [];

  const totalPages = firstData.pagination?.num_pages ?? 1;
  const maxPages = Math.min(totalPages, 30);

  if (maxPages > 1) {
    // Fetch remaining pages in parallel
    const pagePromises = [];
    for (let page = 2; page <= maxPages; page++) {
      const p = new URLSearchParams(filterParams);
      p.set("page", String(page));
      pagePromises.push(
        fetch(`${API_BASE}/items?${p.toString()}`)
          .then((r) => r.json())
          .then((d) => d.body ?? [])
          .catch(() => [])
      );
    }
    const results = await Promise.all(pagePromises);
    for (const items of results) {
      allItems.push(...items);
    }
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
