"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import {
  LeaderboardPlayer,
  LEADERBOARD_CATEGORIES,
  fetchLeaderboard,
  getClassPortrait,
} from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";
import ShimmerText from "@/components/ui/ShimmerText";

interface ClassDetailClientProps {
  className: string;
}

interface CategoryData {
  label: string;
  count: number;
  avgScore: number;
  topPlayers: LeaderboardPlayer[];
}

export default function ClassDetailClient({ className }: ClassDetailClientProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [radarData, setRadarData] = useState<{ subject: string; value: number; fullMark: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          LEADERBOARD_CATEGORIES.map(async (cat) => {
            const res = await fetchLeaderboard({ category: cat.value, limit: 250 });
            const all = res.body || [];
            const classEntries = all.filter((e) => e.class === className);
            return {
              label: cat.label,
              total: all.length,
              count: classEntries.length,
              avgScore: classEntries.length > 0
                ? Math.round(classEntries.reduce((s, e) => s + e.score, 0) / classEntries.length)
                : 0,
              topPlayers: classEntries.sort((a, b) => b.score - a.score).slice(0, 5),
            };
          })
        );

        setCategories(results);

        // Radar: normalize each category's class count relative to total
        setRadarData(
          results.map((r) => ({
            subject: r.label,
            value: r.total > 0 ? Math.round((r.count / r.total) * 100) : 0,
            fullMark: 50,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [className]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/classes"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-primary transition-colors text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to War Council
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center gap-6 mb-10"
      >
        <div className="w-24 h-24 rounded-full border-2 border-gold-primary overflow-hidden">
          <img src={getClassPortrait(className)} alt={className} className="w-full h-full object-cover" />
        </div>
        <div className="text-center sm:text-left">
          <ShimmerText as="h1" className="text-3xl sm:text-4xl">
            {className}
          </ShimmerText>
          <p className="text-text-secondary mt-1">Leaderboard performance across all categories</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary/50 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-secondary border border-border-subtle rounded-sm p-6 mb-8"
          >
            <h3 className="font-cinzel font-bold text-sm text-gold-dark uppercase tracking-wider mb-4">
              Category Representation (% of leaderboard)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(201,168,76,0.15)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#8a8693", fontSize: 11 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#c9a84c"
                    fill="#c9a84c"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category breakdowns */}
          <div className="space-y-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-bg-secondary border border-border-subtle rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel font-bold text-sm text-gold-primary">{cat.label}</h3>
                  <div className="flex gap-4 text-xs text-text-secondary">
                    <span>{cat.count} entries</span>
                    <span>Avg: {formatNumber(cat.avgScore)}</span>
                  </div>
                </div>

                {cat.topPlayers.length > 0 ? (
                  <div className="space-y-1">
                    {cat.topPlayers.map((p, j) => (
                      <div
                        key={`${p.character}-${j}`}
                        className="flex items-center justify-between py-2 px-3 bg-bg-primary/30 rounded-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-cinzel font-bold text-gold-dark w-4">
                            {j + 1}
                          </span>
                          <span className="text-sm text-text-primary">{String(p.character)}</span>
                        </div>
                        <span className="text-sm font-cinzel font-bold text-gold-primary">
                          {formatNumber(p.score)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary/60">No {className} players in this category.</p>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
