"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import TopChampions from "@/components/home/TopChampions";
import ServerPopulation from "@/components/home/ServerPopulation";
import GoldDivider from "@/components/ui/GoldDivider";
import MedievalButton from "@/components/ui/MedievalButton";
import { LeaderboardPlayer, fetchLeaderboard } from "@/lib/darkerdb";

export default function HomeClient() {
  const [topPlayers, setTopPlayers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchLeaderboard({ category: "EA7_HR", limit: 3 })
      .then((res) => setTopPlayers(res.body))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-8 px-4">
        <ServerPopulation />
      </section>

      <GoldDivider />

      {loading ? (
        <div className="flex justify-center gap-6 py-12 px-4 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-72 bg-bg-secondary/50 rounded-sm animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-sm">Failed to load champions. Please try again later.</p>
        </div>
      ) : (
        <TopChampions champions={topPlayers} />
      )}

      <div className="flex justify-center py-8">
        <Link href="/leaderboard">
          <MedievalButton>View Full Leaderboard</MedievalButton>
        </Link>
      </div>
    </div>
  );
}
