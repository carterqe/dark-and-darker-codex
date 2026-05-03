"use client";

import { motion } from "framer-motion";
import ShimmerText from "@/components/ui/ShimmerText";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";

export default function LeaderboardClient() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-block mb-4 px-3 py-1 border border-gold-primary/40 rounded-sm text-[11px] font-cinzel font-bold tracking-[0.2em] uppercase text-gold-dark bg-gold-primary/5">
          EA Season 7 &mdash; Historical
        </div>
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Leaderboard
        </ShimmerText>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Preserved rankings from Early Access Season 7. This board is no longer
          updated — current standings live in-game.
        </p>
      </motion.div>

      <LeaderboardTable />
    </div>
  );
}
