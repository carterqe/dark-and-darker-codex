function normalizeUrl(input: string): string {
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  return withScheme.replace(/\/$/, "");
}

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  "https://www.darkandarkercodex.com";

export const SITE = {
  name: "DaD Codex",
  fullName: "Dark and Darker Codex",
  url: normalizeUrl(rawUrl),
  description:
    "Dark and Darker companion site — leaderboards, builds, market prices, dungeon maps, classes, and quests for the worthy champion.",
  shortDescription:
    "Leaderboards, builds, market, and maps for Dark and Darker.",
  locale: "en_US",
  themeColor: "#0a0a0f",
} as const;

export function absoluteUrl(path = "/"): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE.url}${path}`;
}
