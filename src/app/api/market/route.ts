import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.darkerdb.com/v1";
const FETCH_TIMEOUT_MS = 8000;
const MAX_PAGES = 5; // was 10 — 250 listings is plenty, sequential so keep this tight
const MAX_ARCHETYPES = 100;
const ARCHETYPE_MAX_PAGES = 3;

function aggregatedEnvelope(body: unknown[]) {
  return {
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
      count: body.length,
      limit: body.length,
      page: 1,
      num_pages: 1,
      total: body.length,
      next: null,
    },
    body,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const fetchAll = params.get("fetchAll") === "true";
  const archetypesRaw = params.get("archetypes");

  if (archetypesRaw) {
    const archetypes = Array.from(
      new Set(
        archetypesRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    );

    if (archetypes.length === 0) {
      return NextResponse.json({ error: "archetypes param is empty" }, { status: 400 });
    }
    if (archetypes.length > MAX_ARCHETYPES) {
      return NextResponse.json(
        { error: `too many archetypes (max ${MAX_ARCHETYPES})` },
        { status: 400 }
      );
    }

    const passthrough = new URLSearchParams();
    for (const [key, val] of params.entries()) {
      if (
        key !== "archetypes" &&
        key !== "archetype" &&
        key !== "fetchAll" &&
        key !== "cursor" &&
        key !== "limit"
      ) {
        passthrough.set(key, val);
      }
    }

    const results = await Promise.all(
      archetypes.map(async (arch) => {
        const collected: Record<string, unknown>[] = [];
        let cursor: string | null = null;
        try {
          for (let page = 0; page < ARCHETYPE_MAX_PAGES; page++) {
            const qp = new URLSearchParams(passthrough);
            qp.set("archetype", arch);
            qp.set("limit", "50");
            if (cursor) qp.set("cursor", cursor);

            const res = await fetch(`${API_BASE}/market?${qp.toString()}`, {
              signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
              next: { revalidate: 60 },
            });
            const data = await res.json();
            const body = Array.isArray(data.body) ? data.body : [];
            if (body.length === 0) break;
            collected.push(...body);

            if (data.pagination?.next) {
              try {
                const nextUrl = new URL(data.pagination.next);
                cursor = nextUrl.searchParams.get("cursor");
                if (!cursor) break;
              } catch { break; }
            } else if (body.length >= 50) {
              const last = body[body.length - 1];
              cursor = last?.cursor ? String(last.cursor) : null;
              if (!cursor) break;
            } else {
              break;
            }
          }
        } catch { /* per-archetype failure — return partial */ }
        return collected;
      })
    );

    const seen = new Set<unknown>();
    const merged: Record<string, unknown>[] = [];
    for (const group of results) {
      for (const item of group) {
        const id = item?.id;
        if (id != null) {
          if (seen.has(id)) continue;
          seen.add(id);
        }
        merged.push(item);
      }
    }

    const response = NextResponse.json(aggregatedEnvelope(merged));
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=20");
    return response;
  }

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

  const seen = new Set<unknown>();
  const allItems: Record<string, unknown>[] = [];
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

      const body: Record<string, unknown>[] = Array.isArray(data.body) ? data.body : [];
      if (body.length === 0) break;

      let addedThisPage = 0;
      for (const item of body) {
        const id = item?.id;
        if (id != null) {
          if (seen.has(id)) continue;
          seen.add(id);
        }
        allItems.push(item);
        addedThisPage++;
      }
      if (addedThisPage === 0) break;

      if (data.pagination?.next) {
        try {
          const nextUrl = new URL(data.pagination.next);
          cursor = nextUrl.searchParams.get("cursor");
          if (!cursor) break;
        } catch { break; }
      } else if (body.length >= 50) {
        const last = body[body.length - 1];
        cursor = last?.cursor ? String(last.cursor) : null;
        if (!cursor) break;
      } else {
        break;
      }

      page++;
    }
  } catch { /* timeout or network error — return what we have */ }

  const response = NextResponse.json(aggregatedEnvelope(allItems));
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=20");
  return response;
}
