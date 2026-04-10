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

  // Fetch all pages for the given filters
  const filterParams = new URLSearchParams();
  for (const [key, val] of params.entries()) {
    if (key !== "fetchAll" && key !== "limit" && key !== "page") {
      filterParams.set(key, val);
    }
  }
  filterParams.set("limit", "100");

  const allItems: unknown[] = [];
  let page = 1;
  const maxPages = 30; // 100 * 30 = 3000 items max (covers full item DB)

  while (page <= maxPages) {
    filterParams.set("page", String(page));
    const res = await fetch(`${API_BASE}/items?${filterParams.toString()}`);
    const data = await res.json();

    if (!data.body || data.body.length === 0) break;
    allItems.push(...data.body);

    if (!data.pagination || page >= data.pagination.num_pages) break;
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
