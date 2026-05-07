import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STEAM_NEWS_URL =
  "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=2016590&count=40&format=json";

export interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  is_external_url: boolean;
  author: string;
  contents: string;
  feedlabel: string;
  date: number;
  feedname: string;
  feed_type: number;
  appid: number;
}

export async function GET() {
  try {
    const res = await fetch(STEAM_NEWS_URL, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Steam API error" }, { status: 502 });
    }

    const data = await res.json();
    const allItems: SteamNewsItem[] = data?.appnews?.newsitems ?? [];

    // Only official Ironmace announcements
    const items = allItems.filter(
      (item) => item.feedname === "steam_community_announcements"
    );

    const response = NextResponse.json({ items });
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=1800, stale-while-revalidate=300"
    );
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to fetch patch notes" }, { status: 503 });
  }
}
