import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = "https://api.darkerdb.com/v1";

// In-memory cache
let cachedCharacters: {
  name: string;
  nameLower: string;
  class: string;
  level: number;
  rank: string;
  adventure_points: number | null;
}[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

const RANKS = [
  "Demigod",
  "Exemplar I", "Exemplar II", "Exemplar III",
  "Voyager I", "Voyager II", "Voyager III",
  "Pathfinder I", "Pathfinder II", "Pathfinder III",
  "Wanderer I", "Wanderer II", "Wanderer III",
  "Apprentice I", "Apprentice II", "Apprentice III",
  "Neophyte I", "Neophyte II", "Neophyte III",
];

async function fetchRankPage(rank: string, page: number) {
  try {
    const res = await fetch(
      `${API_BASE}/characters?rank=${encodeURIComponent(rank)}&sort=level&order=desc&limit=50&page=${page}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const data = await res.json();
    return data.body || [];
  } catch {
    return [];
  }
}

async function buildCache() {
  if (cachedCharacters.length > 0 && Date.now() - cacheTimestamp < CACHE_TTL) {
    return;
  }

  const allChars: typeof cachedCharacters = [];

  // Fetch in batches of 3 ranks to avoid overwhelming the upstream API
  for (let i = 0; i < RANKS.length; i += 3) {
    const batch = RANKS.slice(i, i + 3);
    const results = await Promise.all(
      batch.map((rank) => fetchRankPage(rank, 1))
    );
    for (const chars of results) {
      for (const c of chars) {
        allChars.push({
          name: c.name,
          nameLower: String(c.name).toLowerCase(),
          class: c.class,
          level: c.level,
          rank: c.rank,
          adventure_points: c.adventure_points,
        });
      }
    }
  }

  cachedCharacters = allChars;
  cacheTimestamp = Date.now();
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ body: [] });
  }

  // Try exact match from API first (covers all 918k players)
  try {
    const res = await fetch(
      `${API_BASE}/characters?name=${encodeURIComponent(request.nextUrl.searchParams.get("q")!.trim())}&limit=1`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();
    if (data.body && data.body.length > 0) {
      const c = data.body[0];
      return NextResponse.json({
        body: [{
          character: c.name,
          class: c.class,
          rank: c.rank,
          karma: 0,
          score: c.adventure_points ?? 0,
          current_position: 1,
          previous_position: null,
          level: c.level,
        }],
      });
    }
  } catch { /* fall through to cache */ }

  // Fall back to cached partial search
  await buildCache();

  const matches = cachedCharacters
    .filter((c) => c.nameLower.includes(query))
    .slice(0, 50)
    .map((c, i) => ({
      character: c.name,
      class: c.class,
      rank: c.rank,
      karma: 0,
      score: c.adventure_points ?? 0,
      current_position: i + 1,
      previous_position: null,
      level: c.level,
    }));

  return NextResponse.json({ body: matches });
}
