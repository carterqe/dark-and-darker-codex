import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: {
    absolute: "DaD Codex — Dark and Darker Leaderboards, Builds & Market",
  },
  description:
    "Track Dark and Darker leaderboards, top champions, live server population, character builds, market prices, dungeon maps, and classes — all in one companion site.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DaD Codex — Dark and Darker Leaderboards, Builds & Market",
    description:
      "Top champions, live server population, builds, market prices, dungeon maps and class guides for Dark and Darker.",
    url: "/",
    type: "website",
  },
  twitter: {
    title: "DaD Codex — Dark and Darker Leaderboards, Builds & Market",
    description:
      "Top champions, live server population, builds, market prices, dungeon maps and class guides for Dark and Darker.",
  },
};

export default function Home() {
  return <HomeClient />;
}
