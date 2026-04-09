"use client";

import { motion } from "framer-motion";
import { Sword, Shield, Crown, Flame, Zap, Star, Medal, Trophy, Lock } from "lucide-react";
import { Achievement } from "@/lib/types";

interface AchievementGridProps {
  achievements: Achievement[];
}

const iconMap: Record<string, typeof Sword> = {
  sword: Sword,
  shield: Shield,
  crown: Crown,
  flame: Flame,
  zap: Zap,
  star: Star,
  medal: Medal,
  trophy: Trophy,
};

export default function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <div>
      <h3 className="font-cinzel font-bold text-lg text-text-primary mb-6">
        Achievements
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((achievement, i) => {
          const Icon = iconMap[achievement.icon] || Trophy;
          const earned = achievement.earned;

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`relative bg-bg-secondary border rounded-sm p-4 text-center transition-all duration-200
                ${
                  earned
                    ? "border-gold-primary/40 hover:border-gold-primary/70"
                    : "border-border-subtle opacity-50 grayscale"
                }`}
            >
              {/* Lock overlay for unearned */}
              {!earned && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/40 rounded-sm z-10">
                  <Lock className="w-5 h-5 text-text-secondary/50" />
                </div>
              )}

              <Icon
                className={`w-8 h-8 mx-auto mb-2 ${
                  earned ? "text-gold-primary" : "text-text-secondary"
                }`}
              />
              <p
                className={`font-cinzel font-bold text-sm ${
                  earned ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {achievement.name}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
