"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { LeaderboardPlayer, getClassPortrait } from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";

interface ChampionCardProps {
  entry: LeaderboardPlayer;
  displayRank: number;
}

const rankStyles = {
  1: {
    borderColor: "border-gold-primary",
    glowColor: "rgba(201, 168, 76, 0.3)",
    labelColor: "text-gold-light",
    bgGlow: "from-gold-primary/10",
    size: "md:scale-110",
    label: "Champion",
  },
  2: {
    borderColor: "border-silver",
    glowColor: "rgba(168, 168, 184, 0.25)",
    labelColor: "text-silver",
    bgGlow: "from-silver/10",
    size: "",
    label: "Runner-up",
  },
  3: {
    borderColor: "border-bronze",
    glowColor: "rgba(138, 103, 70, 0.25)",
    labelColor: "text-bronze",
    bgGlow: "from-bronze/10",
    size: "",
    label: "Third Place",
  },
};

export default function ChampionCard({ entry, displayRank }: ChampionCardProps) {
  const style = rankStyles[displayRank as keyof typeof rankStyles] || rankStyles[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: displayRank * 0.15 }}
      className={`${style.size}`}
    >
      <motion.div
        className={`relative bg-bg-secondary border ${style.borderColor} rounded-sm p-6 text-center overflow-hidden`}
        whileHover={{
          y: -4,
          boxShadow: `0 0 40px ${style.glowColor}`,
        }}
        animate={{
          boxShadow: [
            `0 0 10px ${style.glowColor}`,
            `0 0 25px ${style.glowColor}`,
            `0 0 10px ${style.glowColor}`,
          ],
        }}
        transition={{
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${style.bgGlow} to-transparent opacity-50`}
        />

        {/* Corner ornaments */}
        <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-inherit" />
        <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-inherit" />
        <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-inherit" />
        <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-inherit" />

        <div className="relative z-10">
          {/* Crown for rank 1 */}
          {displayRank === 1 && (
            <Crown className="w-8 h-8 text-gold-primary mx-auto mb-2" />
          )}

          {/* Avatar */}
          <div
            className={`w-20 h-20 mx-auto rounded-full border-2 ${style.borderColor} overflow-hidden mb-4`}
          >
            <img
              src={getClassPortrait(entry.class)}
              alt={entry.class}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Name & class */}
          <h3 className="font-cinzel font-bold text-xl text-text-primary mb-1">
            {entry.character}
          </h3>
          <p className={`text-xs uppercase tracking-wider ${style.labelColor} mb-1`}>
            {entry.class}
          </p>
          <p className="text-xs text-text-secondary mb-3">
            {entry.rank || "Unranked"}
          </p>

          {/* Score */}
          <div className="mt-2">
            <p className="text-2xl font-cinzel font-bold text-gold-primary">
              {formatNumber(entry.score)}
            </p>
            <p className="text-xs text-text-secondary mt-1">Score</p>
          </div>

          {/* Rank label */}
          <div
            className={`mt-4 inline-block px-3 py-1 rounded-sm border ${style.borderColor} bg-bg-primary/50`}
          >
            <span className={`text-xs font-cinzel font-bold ${style.labelColor}`}>
              {style.label}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
