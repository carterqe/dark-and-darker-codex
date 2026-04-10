"use client";

import Image from "next/image";
import { LeaderboardPlayer, getClassPortrait } from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";
import RankBadge from "@/components/ui/RankBadge";
import TrendArrow from "@/components/ui/TrendArrow";

interface LeaderboardRowProps {
  entry: LeaderboardPlayer;
  index: number;
}

function getTrend(entry: LeaderboardPlayer): "up" | "down" | "stable" {
  if (entry.previous_position == null) return "stable";
  if (entry.current_position < entry.previous_position) return "up";
  if (entry.current_position > entry.previous_position) return "down";
  return "stable";
}

export default function LeaderboardRow({ entry, index }: LeaderboardRowProps) {
  const pos = entry.current_position;
  const isTop3 = pos <= 3;
  const rowBg = isTop3
    ? pos === 1
      ? "bg-gold-primary/[0.04]"
      : pos === 2
        ? "bg-silver/[0.03]"
        : "bg-bronze/[0.03]"
    : "";

  return (
    <tr
      className={`group border-b border-border-subtle hover:bg-bg-tertiary/50 hover:border-l-2 hover:border-l-gold-primary transition-all duration-200 animate-fade-in-up ${rowBg}`}
      style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
    >
      {/* Position */}
      <td className="py-3 px-2 sm:px-4 w-10 sm:w-16">
        <RankBadge rank={pos} />
      </td>

      {/* Player */}
      <td className="py-3 px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-border-subtle overflow-hidden flex-shrink-0">
            <Image
              src={getClassPortrait(entry.class)}
              alt={entry.class}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="font-medium text-text-primary text-xs sm:text-sm block truncate">
              {entry.character}
            </span>
            <span className="block text-[10px] sm:text-xs text-text-secondary truncate">
              {entry.rank || entry.class}
            </span>
          </div>
        </div>
      </td>

      {/* Class */}
      <td className="py-3 px-2 sm:px-4 text-sm text-text-secondary hidden md:table-cell">
        {entry.class}
      </td>

      {/* Score */}
      <td className="py-3 px-2 sm:px-4 text-right font-cinzel font-bold text-gold-primary text-xs sm:text-sm">
        {formatNumber(entry.score)}
      </td>

      {/* Trend */}
      <td className="py-3 px-2 sm:px-4 text-center w-10 sm:w-12">
        <TrendArrow trend={getTrend(entry)} />
      </td>
    </tr>
  );
}
