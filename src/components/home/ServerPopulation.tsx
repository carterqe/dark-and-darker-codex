"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, DoorOpen, Skull } from "lucide-react";
import { DarkerDBPopulation, fetchPopulation } from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";

export default function ServerPopulation() {
  const [pop, setPop] = useState<DarkerDBPopulation | null>(null);

  useEffect(() => {
    fetchPopulation()
      .then((res) => setPop(res.body))
      .catch(console.error);

    // Refresh every 60s
    const interval = setInterval(() => {
      fetchPopulation()
        .then((res) => setPop(res.body))
        .catch(console.error);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!pop) {
    return (
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-36 h-20 bg-bg-secondary/50 rounded-sm animate-pulse"
          />
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Online Now", value: pop.num_online, icon: Users, color: "text-accent-emerald" },
    { label: "In Lobby", value: pop.num_lobby, icon: DoorOpen, color: "text-gold-primary" },
    { label: "In Dungeon", value: pop.num_dungeon, icon: Skull, color: "text-accent-red" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4" role="region" aria-label="Live server population">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-bg-secondary/60 border border-border-subtle rounded-sm px-5 py-3 text-center min-w-[130px]"
        >
          <stat.icon className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} aria-hidden="true" />
          <p className={`text-xl font-cinzel font-bold ${stat.color}`} aria-label={`${formatNumber(stat.value)} ${stat.label}`}>
            {formatNumber(stat.value)}
          </p>
          <p className="text-xs text-text-secondary" aria-hidden="true">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
