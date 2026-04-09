"use client";

import { motion } from "framer-motion";
import {
  Calendar, Shield, Swords, Star, User, Award,
} from "lucide-react";
import { DarkerDBCharacter, getClassPortrait } from "@/lib/darkerdb";
import { formatDate } from "@/lib/utils";

interface PlayerProfileClientProps {
  character: DarkerDBCharacter;
}

function StatCard({
  label,
  value,
  icon: Icon,
  index,
}: {
  label: string;
  value: string | number;
  icon: typeof Shield;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-bg-secondary border border-border-subtle rounded-sm p-5 text-center"
    >
      <Icon className="w-5 h-5 text-gold-dark mx-auto mb-3" />
      <p className="text-2xl font-cinzel font-bold text-gold-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{label}</p>
    </motion.div>
  );
}

export default function PlayerProfileClient({
  character,
}: PlayerProfileClientProps) {
  const stats = [
    { label: "Level", value: character.level, icon: Star },
    { label: "Class", value: character.class, icon: Swords },
    { label: "Rank", value: character.rank, icon: Award },
    {
      label: "Rating",
      value: character.rating ?? "Unrated",
      icon: Shield,
    },
    {
      label: "Adventure Points",
      value: character.adventure_points ?? "N/A",
      icon: User,
    },
    {
      label: "Last Active",
      value: formatDate(character.updated_at),
      icon: Calendar,
    },
  ];

  return (
    <div>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center gap-6 mb-10"
      >
        {/* Avatar with ornate ring */}
        <div className="relative w-28 h-28 flex-shrink-0">
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
              src={getClassPortrait(character.class)}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center sm:text-left">
          <h1 className="font-cinzel font-bold text-3xl sm:text-4xl text-text-primary mb-1">
            {character.name}
          </h1>
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <span className="px-3 py-1 text-xs font-cinzel font-bold text-gold-primary border border-gold-primary/30 rounded-sm bg-gold-primary/5">
              {character.class}
            </span>
            <span className="px-3 py-1 text-xs font-cinzel font-bold text-text-secondary border border-border-subtle rounded-sm">
              {character.rank}
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-text-secondary text-sm">
            <Star className="w-3.5 h-3.5" />
            <span>Level {character.level}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>
    </div>
  );
}
