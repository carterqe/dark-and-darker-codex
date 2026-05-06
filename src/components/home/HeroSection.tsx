"use client";

import { motion } from "framer-motion";
import ShimmerText from "@/components/ui/ShimmerText";
import GoldDivider from "@/components/ui/GoldDivider";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 sm:py-28">
      {/* Radial glow behind title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-gold-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <p className="text-text-secondary text-sm uppercase tracking-[0.3em] mb-4 font-medium">
          Chronicle of Champions
        </p>

        <ShimmerText className="text-5xl sm:text-7xl lg:text-8xl mb-6 leading-tight">
          Dark and Darker Codex
        </ShimmerText>

        <p className="text-text-secondary text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          Track the leaderboards, build your perfect loadout, scout market
          prices, and master every dungeon — all in one place.
        </p>
      </motion.div>

      <GoldDivider className="mt-8" />
    </section>
  );
}
