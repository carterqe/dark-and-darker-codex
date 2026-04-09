"use client";

import { motion } from "framer-motion";
import { Trophy, Gamepad2, Target, Medal, Flame, BarChart3 } from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { useCountUp } from "@/hooks/useCountUp";
import { formatNumber } from "@/lib/utils";

interface StatsGridProps {
  player: PlayerProfile;
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Trophy;
  index: number;
}

function StatCard({ label, value, suffix = "", icon: Icon, index }: StatCardProps) {
  const { value: animatedValue, ref } = useCountUp(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-bg-secondary border border-border-subtle rounded-sm p-5 text-center"
    >
      <Icon className="w-5 h-5 text-gold-dark mx-auto mb-3" />
      <p className="text-2xl font-cinzel font-bold text-gold-primary">
        {formatNumber(animatedValue)}
        {suffix}
      </p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </motion.div>
  );
}

export default function StatsGrid({ player }: StatsGridProps) {
  const stats = [
    { label: "Total Score", value: player.total_score, icon: Trophy },
    { label: "Games Played", value: player.games_played, icon: Gamepad2 },
    { label: "Win Rate", value: player.win_rate, suffix: "%", icon: Target },
    { label: "Best Rank", value: player.best_rank, icon: Medal },
    { label: "Current Streak", value: player.current_streak, icon: Flame },
    { label: "Avg Score", value: player.avg_score, icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  );
}
