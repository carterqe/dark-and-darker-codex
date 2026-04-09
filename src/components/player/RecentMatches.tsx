"use client";

import { motion } from "framer-motion";
import { MatchResult } from "@/lib/types";
import { formatNumber, formatDate } from "@/lib/utils";
import { Scroll } from "lucide-react";

interface RecentMatchesProps {
  matches: MatchResult[];
}

export default function RecentMatches({ matches }: RecentMatchesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-6">
        <Scroll className="w-5 h-5 text-gold-primary" />
        <h3 className="font-cinzel font-bold text-lg text-text-primary">
          Recent Matches
        </h3>
      </div>

      <div className="space-y-2">
        {matches.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center justify-between bg-bg-secondary border border-border-subtle rounded-sm px-4 py-3"
          >
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                  match.result === "win"
                    ? "bg-accent-emerald/20 text-accent-emerald"
                    : "bg-accent-red/20 text-accent-red"
                }`}
              >
                {match.result.toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-text-primary">{match.game_name}</p>
                {match.opponent && (
                  <p className="text-xs text-text-secondary">
                    vs {match.opponent}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-cinzel font-bold text-gold-primary">
                {formatNumber(match.score)}
              </p>
              <p className="text-xs text-text-secondary">
                {formatDate(match.date)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
