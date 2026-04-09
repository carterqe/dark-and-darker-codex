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
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Leaderboard
        </ShimmerText>
        <p className="text-text-secondary">
          Dark and Darker &mdash; champions ranked by level
        </p>
      </motion.div>

      <LeaderboardTable />
    </div>
  );
}
