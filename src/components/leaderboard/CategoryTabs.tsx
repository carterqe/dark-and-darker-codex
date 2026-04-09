"use client";

import { motion } from "framer-motion";
import { Compass, Crosshair, Gem, DoorOpen, Skull } from "lucide-react";
import { LeaderboardCategory, LEADERBOARD_CATEGORIES } from "@/lib/darkerdb";

interface CategoryTabsProps {
  active: LeaderboardCategory;
  onChange: (cat: LeaderboardCategory) => void;
}

const categoryIcons: Record<LeaderboardCategory, typeof Compass> = {
  EA7_HR: Compass,
  EA7_HOF_SHR_KO: Crosshair,
  EA7_HOF_SHR_TC: Gem,
  EA7_HOF_SHR_EA: DoorOpen,
  EA7_HOF_SHR_B: Skull,
};

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {LEADERBOARD_CATEGORIES.map((cat) => {
        const isActive = active === cat.value;
        const Icon = categoryIcons[cat.value];
        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value)}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-sm transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "text-gold-light bg-bg-tertiary border border-gold-primary/40"
                  : "text-text-secondary border border-border-subtle hover:text-gold-primary hover:border-gold-dark"
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{cat.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
