"use client";

import { LeaderboardPlayer } from "@/lib/darkerdb";
import ChampionCard from "./ChampionCard";
import ShimmerText from "@/components/ui/ShimmerText";

interface TopChampionsProps {
  champions: LeaderboardPlayer[];
}

export default function TopChampions({ champions }: TopChampionsProps) {
  if (champions.length < 3) {
    return (
      <section className="py-12 px-4 text-center">
        <p className="text-text-secondary text-sm">Leaderboard data unavailable right now.</p>
      </section>
    );
  }

  // Reorder: 2nd, 1st, 3rd for visual hierarchy
  const ordered = [
    { player: champions[1], displayRank: 2 },
    { player: champions[0], displayRank: 1 },
    { player: champions[2], displayRank: 3 },
  ];

  return (
    <section className="py-12 px-4">
      <div className="text-center mb-10">
        <ShimmerText as="h2" className="text-3xl sm:text-4xl">
          Top Champions
        </ShimmerText>
        <p className="text-text-secondary text-sm mt-2">
          Season 7 &mdash; Veteran Adventurer
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {ordered.map(({ player, displayRank }) => (
          <ChampionCard
            key={player.character}
            entry={player}
            displayRank={displayRank}
          />
        ))}
      </div>
    </section>
  );
}
