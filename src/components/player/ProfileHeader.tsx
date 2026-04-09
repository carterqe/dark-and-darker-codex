"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { PlayerProfile } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface ProfileHeaderProps {
  player: PlayerProfile;
}

export default function ProfileHeader({ player }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center gap-6 mb-10"
    >
      {/* Avatar with ornate ring */}
      <div className="relative w-28 h-28 flex-shrink-0">
        {/* Decorative ring SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="var(--gold-primary)"
            strokeWidth="1.5"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            stroke="var(--gold-dark)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
          {/* Corner diamonds */}
          {[0, 90, 180, 270].map((angle) => (
            <rect
              key={angle}
              x="57"
              y="1"
              width="6"
              height="6"
              rx="1"
              fill="var(--gold-primary)"
              transform={`rotate(${angle} 60 60) rotate(45 60 4)`}
            />
          ))}
        </svg>
        <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-gold-dark">
          <img
            src={player.avatar_url}
            alt={player.username}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="text-center sm:text-left">
        <h1 className="font-cinzel font-bold text-3xl sm:text-4xl text-text-primary mb-1">
          {player.username}
        </h1>
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
          <span className="px-3 py-1 text-xs font-cinzel font-bold text-gold-primary border border-gold-primary/30 rounded-sm bg-gold-primary/5">
            {player.title}
          </span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-text-secondary text-sm">
          <Calendar className="w-3.5 h-3.5" />
          <span>Joined {formatDate(player.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
}
