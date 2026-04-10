"use client";

import { useState } from "react";
import { Swords, Loader2 } from "lucide-react";
import { LeaderboardCategory } from "@/lib/darkerdb";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import CategoryTabs from "./CategoryTabs";
import PlayerSearch from "./PlayerSearch";
import LeaderboardRow from "./LeaderboardRow";

export default function LeaderboardTable() {
  const [category, setCategory] = useState<LeaderboardCategory>("EA7_HR");
  const {
    entries,
    loading,
    searching,
    searchQuery,
    setSearchQuery,
  } = useLeaderboard(category);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <CategoryTabs active={category} onChange={setCategory} />
        <div className="flex items-center gap-3">
          <PlayerSearch value={searchQuery} onChange={setSearchQuery} />
          {searching && (
            <Loader2 className="w-4 h-4 text-gold-dark animate-spin" />
          )}
        </div>
        {searchQuery && !searching && entries.length > 0 && (
          <p className="text-xs text-text-secondary">
            Found {entries.length} result{entries.length !== 1 ? "s" : ""} across all ranks
          </p>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-14 bg-bg-secondary/50 rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20">
          <Swords className="w-12 h-12 text-gold-dark mx-auto mb-4" />
          <p className="font-cinzel text-lg text-text-secondary">
            No champions have risen yet...
          </p>
          <p className="text-sm text-text-secondary/60 mt-2">
            {searchQuery
              ? "No player found. Try a different name."
              : "Be the first to claim glory."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold-dark/30">
                <th className="py-3 px-2 sm:px-4 text-left text-[10px] sm:text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider w-10 sm:w-16">
                  #
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-[10px] sm:text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider">
                  Player
                </th>
                <th className="py-3 px-2 sm:px-4 text-left text-[10px] sm:text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider hidden md:table-cell">
                  Class
                </th>
                <th className="py-3 px-2 sm:px-4 text-right text-[10px] sm:text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider">
                  Score
                </th>
                <th className="py-3 px-2 sm:px-4 text-center text-[10px] sm:text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider w-10 sm:w-12">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <LeaderboardRow
                  key={`${entry.character}-${entry.current_position}-${i}`}
                  entry={entry}
                  index={i}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
