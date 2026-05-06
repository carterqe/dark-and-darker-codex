"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LEADERBOARD_CATEGORIES, fetchLeaderboard, getClassPortrait } from "@/lib/darkerdb";
import { CLASS_DATA } from "@/lib/class-data";
import ShimmerText from "@/components/ui/ShimmerText";

const CLASSES = ["Fighter", "Barbarian", "Rogue", "Ranger", "Wizard", "Cleric", "Bard", "Warlock", "Druid", "Sorcerer"];

const CLASS_ROLE: Record<string, string> = {
  Fighter:   "Melee · Frontline",
  Barbarian: "Melee · Bruiser",
  Rogue:     "Melee · Stealth",
  Ranger:    "Ranged · Skirmisher",
  Wizard:    "Magic · Burst",
  Cleric:    "Magic · Support",
  Bard:      "Magic · Utility",
  Warlock:   "Magic · Drain",
  Druid:     "Magic · Shapeshift",
  Sorcerer:  "Magic · Elemental",
};

export default function ClassesClient() {
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          LEADERBOARD_CATEGORIES.map((cat) =>
            fetchLeaderboard({ category: cat.value, limit: 250 })
              .then((r) => r.body || [])
              .catch(() => [])
          )
        );
        const all = results.flat();
        const total = all.length;
        const map: Record<string, number> = {};
        for (const cls of CLASSES) {
          const count = all.filter((e) => e.class === cls).length;
          map[cls] = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
        }
        setUsage(map);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sorted = loading
    ? CLASSES
    : [...CLASSES].sort((a, b) => (usage[b] ?? 0) - (usage[a] ?? 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Classes
        </ShimmerText>
        <p className="text-text-secondary">
          Every class — perks, skills, spells, and current pick rates.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((cls, i) => {
          const data = CLASS_DATA[cls];
          const pct = usage[cls] ?? 0;
          const spellCount = data?.spells?.length ?? 0;
          const songCount = data?.songs?.length ?? 0;
          const formCount = data?.shapeshiftForms?.length ?? 0;

          return (
            <div
              key={cls}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
            >
              <Link href={`/classes/${cls}`}>
                <div className="h-full bg-bg-secondary border border-border-subtle rounded-sm p-5 hover:border-gold-primary/30 hover:bg-bg-tertiary/50 transition-all group flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full border border-border-subtle overflow-hidden shrink-0">
                      <Image src={getClassPortrait(cls)} alt={cls} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-cinzel font-bold text-lg text-text-primary group-hover:text-gold-primary transition-colors leading-tight">
                        {cls}
                      </h3>
                      <p className="text-[10px] text-text-secondary/60 mt-0.5">{CLASS_ROLE[cls]}</p>
                    </div>
                  </div>

                  {/* Perk / skill / spell counts */}
                  <div className="flex flex-wrap gap-1.5">
                    {data && (
                      <>
                        <span className="text-[10px] px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary/70">
                          {data.perks.length} perks
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary/70">
                          {data.skills.length} skills
                        </span>
                        {spellCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary/70">
                            {spellCount} spells
                          </span>
                        )}
                        {songCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary/70">
                            {songCount} songs
                          </span>
                        )}
                        {formCount > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-sm border border-border-subtle text-text-secondary/70">
                            {formCount} forms
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pick rate bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary/60">Pick rate</span>
                      {loading ? (
                        <span className="w-8 h-3 bg-bg-primary/60 rounded animate-pulse inline-block" />
                      ) : (
                        <span className="text-gold-primary font-bold">{pct}%</span>
                      )}
                    </div>
                    <div className="h-1 bg-bg-primary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-primary/60 rounded-full transition-all duration-700"
                        style={{ width: loading ? "0%" : `${Math.min(pct * 4.5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
