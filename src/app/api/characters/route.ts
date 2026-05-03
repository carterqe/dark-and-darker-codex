import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.darkerdb.com/v1";
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGES_PER_TIER = 3; // was 10 — caps sequential pages within one rank

const RANK_TIERS = [
  "Demigod",
  "Exemplar I", "Exemplar II", "Exemplar III",
  "Voyager I", "Voyager II", "Voyager III",
  "Pathfinder I", "Pathfinder II", "Pathfinder III",
  "Wanderer I", "Wanderer II", "Wanderer III",
  "Apprentice I", "Apprentice II", "Apprentice III",
  "Neophyte I", "Neophyte II", "Neophyte III",
];

async function fetchTierChars(
  rank: string,
  classFilter: string,
  nameFilter: string
): Promise<{ chars: { adventure_points: number | null }[]; total: number }> {
  const qs = new URLSearchParams();
  qs.set("rank", rank);
  qs.set("sort", "adventure_points");
  qs.set("order", "desc");
  qs.set("limit", "50");
  if (classFilter && classFilter !== "all") qs.set("class", classFilter);
  if (nameFilter) qs.set("name", nameFilter);
  qs.set("page", "1");

  try {
    const res = await fetch(`${API_BASE}/characters?${qs.toString()}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: 60 },
    });
    const data = await res.json();

    const chars: { adventure_points: number | null }[] = data.body ?? [];
    const total: number = data.pagination?.total ?? 0;
    const numPages = Math.min(data.pagination?.num_pages ?? 1, MAX_PAGES_PER_TIER);

    if (numPages > 1) {
      const pagePromises: Promise<{ adventure_points: number | null }[]>[] = [];
      for (let page = 2; page <= numPages; page++) {
        const p = new URLSearchParams(qs);
        p.set("page", String(page));
        pagePromises.push(
          fetch(`${API_BASE}/characters?${p.toString()}`, {
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            next: { revalidate: 60 },
          })
            .then((r) => r.json())
            .then((d) => (d.body ?? []) as { adventure_points: number | null }[])
            .catch(() => [])
        );
      }
      const extraPages = await Promise.all(pagePromises);
      for (const batch of extraPages) chars.push(...batch);
    }

    return { chars, total };
  } catch {
    return { chars: [], total: 0 };
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ranked = params.get("ranked") === "true";

  // Non-ranked: simple pass-through with cache
  if (!ranked) {
    const passParams = new URLSearchParams(params);
    passParams.delete("ranked");
    try {
      const res = await fetch(`${API_BASE}/characters?${passParams.toString()}`, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        next: { revalidate: 30 },
      });
      const data = await res.json();
      const response = NextResponse.json(data);
      response.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=10");
      return response;
    } catch {
      return NextResponse.json({ error: "Failed to fetch characters" }, { status: 503 });
    }
  }

  // Ranked mode: fetch ALL rank tiers in parallel (was sequential)
  const limit = parseInt(params.get("limit") || "25", 10);
  const page = parseInt(params.get("page") || "1", 10);
  const classFilter = params.get("class") || "";
  const nameFilter = params.get("name") || "";
  const offset = (page - 1) * limit;

  const tierResults = await Promise.allSettled(
    RANK_TIERS.map((rank) => fetchTierChars(rank, classFilter, nameFilter))
  );

  const collected: unknown[] = [];
  let totalCount = 0;
  let skipped = 0;

  for (const result of tierResults) {
    if (result.status === "rejected") continue;
    const { chars, total } = result.value;
    totalCount += total;

    chars.sort((a, b) => (b.adventure_points ?? -1) - (a.adventure_points ?? -1));

    for (const char of chars) {
      if (collected.length >= limit) break;
      if (skipped < offset) { skipped++; continue; }
      collected.push(char);
    }
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
      count: collected.length,
      limit,
      page,
      num_pages: Math.ceil(totalCount / limit),
      total: totalCount,
      next: null,
    },
    body: collected,
  });
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
  return response;
}
