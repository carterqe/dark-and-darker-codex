import type { Metadata } from "next";
import LeaderboardClient from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Leaderboard — EA Season 7 (Historical)",
  description:
    "Historical Dark and Darker leaderboard from Early Access Season 7. Preserved for reference only — no longer updated.",
  alternates: { canonical: "/leaderboard" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Dark and Darker Leaderboard — EA Season 7 (Historical)",
    description:
      "Historical Dark and Darker leaderboard from Early Access Season 7. Preserved for reference only — no longer updated.",
    url: "/leaderboard",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Leaderboard — EA Season 7 (Historical)",
    description:
      "Historical Dark and Darker leaderboard from Early Access Season 7. Preserved for reference only — no longer updated.",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
