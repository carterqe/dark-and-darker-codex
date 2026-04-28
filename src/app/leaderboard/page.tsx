import type { Metadata } from "next";
import LeaderboardClient from "./leaderboard-client";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Live Dark and Darker leaderboards — track the top champions by ranked score, kills, treasure, extractions and bosses slain across every class.",
  alternates: { canonical: "/leaderboard" },
  openGraph: {
    title: "Dark and Darker Leaderboard — Top Champions",
    description:
      "Live rankings for Dark and Darker — ranked score, kills, treasure, extractions and bosses slain.",
    url: "/leaderboard",
    type: "website",
  },
  twitter: {
    title: "Dark and Darker Leaderboard — Top Champions",
    description:
      "Live rankings for Dark and Darker — ranked score, kills, treasure, extractions and bosses slain.",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
