import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";

// Ranks from highest to lowest
const RANK_TIERS = [
  "Demigod",
  "Exemplar I", "Exemplar II", "Exemplar III",
  "Voyager I", "Voyager II", "Voyager III",
  "Pathfinder I", "Pathfinder II", "Pathfinder III",
  "Wanderer I", "Wanderer II", "Wanderer III",
  "Apprentice I", "Apprentice II", "Apprentice III",
  "Neophyte I", "Neophyte II", "Neophyte III",
];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const ranked = params.get("ranked") === "true";

  // If not using ranked mode, pass through directly
  if (!ranked) {
    const url = `${API_BASE}/characters?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Ranked mode: fetch from highest rank tiers first, fill up to the limit
  const limit = parseInt(params.get("limit") || "25", 10);
  const page = parseInt(params.get("page") || "1", 10);
  const classFilter = params.get("class") || "";
  const nameFilter = params.get("name") || "";
  const offset = (page - 1) * limit;

  const collected: unknown[] = [];
  let totalCount = 0;
  let skipped = 0;

  for (const rank of RANK_TIERS) {
    if (collected.length >= limit) break;

    const qs = new URLSearchParams();
    qs.set("rank", rank);
    qs.set("sort", "adventure_points");
    qs.set("order", "desc");
    qs.set("limit", "50");
    if (classFilter && classFilter !== "all") qs.set("class", classFilter);
    if (nameFilter) qs.set("name", nameFilter);

    // Fetch all characters in this tier, then sort client-side
    // (API sort on adventure_points doesn't handle nulls well)
    let tierPage = 1;
    let tierTotal = 0;
    const tierChars: { adventure_points: number | null }[] = [];

    while (true) {
      qs.set("page", String(tierPage));
      const res = await fetch(`${API_BASE}/characters?${qs.toString()}`);
      const data = await res.json();

      if (tierPage === 1) {
        tierTotal = data.pagination?.total || 0;
        totalCount += tierTotal;
      }

      if (!data.body || data.body.length === 0) break;
      tierChars.push(...data.body);

      if (tierPage >= (data.pagination?.num_pages || 1)) break;
      // Cap pages fetched per tier to keep response times reasonable
      if (tierPage >= 10) break;
      tierPage++;
    }

    // Sort within tier: highest AP first, nulls last
    tierChars.sort((a, b) => {
      const apA = a.adventure_points ?? -1;
      const apB = b.adventure_points ?? -1;
      return apB - apA;
    });

    for (const char of tierChars) {
      if (collected.length >= limit) break;
      if (skipped < offset) {
        skipped++;
        continue;
      }
      collected.push(char);
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
      count: collected.length,
      limit,
      page,
      num_pages: Math.ceil(totalCount / limit),
      total: totalCount,
      next: null,
    },
    body: collected,
  });
}
