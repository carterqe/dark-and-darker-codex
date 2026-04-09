"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LeaderboardPlayer,
  LeaderboardCategory,
  LEADERBOARD_CATEGORIES,
  fetchLeaderboard,
  getClassPortrait,
} from "@/lib/darkerdb";
import ShimmerText from "@/components/ui/ShimmerText";

interface ClassStats {
  name: string;
  count: number;
  percentage: number;
  avgScore: number;
  topPlayer: string;
  topScore: number;
  tier: "S" | "A" | "B" | "C";
}

const TIER_COLORS = {
  S: { text: "text-gold-primary", bg: "bg-gold-primary/20", border: "border-gold-primary/40" },
  A: { text: "text-accent-emerald", bg: "bg-accent-emerald/20", border: "border-accent-emerald/40" },
  B: { text: "text-silver", bg: "bg-silver/20", border: "border-silver/40" },
  C: { text: "text-bronze", bg: "bg-bronze/20", border: "border-bronze/40" },
};

const CLASSES = ["Fighter", "Barbarian", "Rogue", "Ranger", "Wizard", "Cleric", "Bard", "Warlock", "Druid"];

function computeTier(pct: number): "S" | "A" | "B" | "C" {
  if (pct >= 15) return "S";
  if (pct >= 10) return "A";
  if (pct >= 5) return "B";
  return "C";
}

export default function ClassesClient() {
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch all 5 leaderboard categories
        const results = await Promise.all(
          LEADERBOARD_CATEGORIES.map((cat) =>
            fetchLeaderboard({ category: cat.value, limit: 250 })
              .then((r) => r.body || [])
              .catch(() => [] as LeaderboardPlayer[])
          )
        );

        // Aggregate all entries
        const allEntries = results.flat();
        const total = allEntries.length;

        // Compute per-class stats
        const stats: ClassStats[] = CLASSES.map((cls) => {
          const entries = allEntries.filter((e) => e.class === cls);
          const count = entries.length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const avgScore = count > 0 ? Math.round(entries.reduce((s, e) => s + e.score, 0) / count) : 0;
          const top = entries.sort((a, b) => b.score - a.score)[0];

          return {
            name: cls,
            count,
            percentage: Math.round(pct * 10) / 10,
            avgScore,
            topPlayer: top ? String(top.character) : "—",
            topScore: top ? top.score : 0,
            tier: computeTier(pct),
          };
        }).sort((a, b) => b.percentage - a.percentage);

        setClassStats(stats);
      } catch (err) {
        console.error("Failed to load class stats:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          The War Council
        </ShimmerText>
        <p className="text-text-secondary">
          Class meta analysis &mdash; who dominates the leaderboards
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-48 bg-bg-secondary/50 rounded-sm animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classStats.map((cls, i) => {
            const tierStyle = TIER_COLORS[cls.tier];
            return (
              <motion.div
                key={cls.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/classes/${cls.name}`}>
                  <div className="bg-bg-secondary border border-border-subtle rounded-sm p-5 hover:bg-bg-tertiary/50 hover:border-gold-dark/40 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border border-border-subtle overflow-hidden">
                          <img src={getClassPortrait(cls.name)} alt={cls.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-cinzel font-bold text-lg text-text-primary group-hover:text-gold-primary transition-colors">
                            {cls.name}
                          </h3>
                          <p className="text-xs text-text-secondary">{cls.count} leaderboard entries</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-cinzel font-bold rounded-sm ${tierStyle.text} ${tierStyle.bg} border ${tierStyle.border}`}>
                        {cls.tier}
                      </span>
                    </div>

                    {/* Representation bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">Representation</span>
                        <span className="text-gold-primary font-bold">{cls.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-primary/60 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(cls.percentage * 3, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-xs border-t border-border-subtle pt-3">
                      <div>
                        <span className="text-text-secondary">Avg Score</span>
                        <p className="font-cinzel font-bold text-gold-dark">{cls.avgScore.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-text-secondary">Top Player</span>
                        <p className="font-bold text-text-primary truncate max-w-[120px]">{cls.topPlayer}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
