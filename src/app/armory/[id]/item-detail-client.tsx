"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Coins, Skull } from "lucide-react";
import { DarkerDBItem, getRarityStyle } from "@/lib/darkerdb";
import { getDropsFor } from "@/lib/monster-data";
import { formatNumber } from "@/lib/utils";

interface ItemDetailClientProps {
  item: DarkerDBItem;
}

// Extract non-null stat fields grouped by prefix
function extractStats(item: DarkerDBItem) {
  const groups: { label: string; prefix: string }[] = [
    { label: "Primary Stats", prefix: "primary_" },
    { label: "Secondary Stats", prefix: "secondary_min_" },
    { label: "Enchanted Stats", prefix: "secondary_min_enchanted_" },
  ];

  const result: { label: string; stats: { name: string; value: string }[] }[] = [];

  for (const group of groups) {
    const stats: { name: string; value: string }[] = [];
    for (const [key, value] of Object.entries(item)) {
      if (key.startsWith(group.prefix) && value != null && value !== 0) {
        const name = key
          .replace(group.prefix, "")
          .replace(/_/g, " ")
          .replace(/\bmin\b|\bmax\b/g, "")
          .trim();
        // Deduplicate by name
        if (!stats.find((s) => s.name === name)) {
          const minKey = key;
          const maxKey = key.replace("_min_", "_max_").replace("primary_min", "primary_max");
          const minVal = item[minKey];
          const maxVal = item[maxKey];
          if (minVal != null && maxVal != null && minVal !== maxVal) {
            stats.push({ name, value: `${minVal} – ${maxVal}` });
          } else if (value != null) {
            stats.push({ name, value: String(value) });
          }
        }
      }
    }
    if (stats.length > 0) {
      result.push({ label: group.label, stats });
    }
  }

  return result;
}

export default function ItemDetailClient({ item }: ItemDetailClientProps) {
  const rarity = getRarityStyle(item.rarity);
  const statGroups = extractStats(item);
  const drops = getDropsFor(item.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className={`bg-bg-secondary border-l-4 ${rarity.border} border border-border-subtle rounded-sm p-6 mb-6`}>
        <span className={`text-xs uppercase tracking-wider font-bold ${rarity.text}`}>
          {item.rarity}
        </span>
        <h1 className={`font-cinzel font-bold text-2xl sm:text-3xl ${rarity.text} mt-1 mb-2`}>
          {item.name}
        </h1>
        <p className="text-sm text-text-secondary mb-4">
          {[item.type, item.slot_type, item.armor_type, item.hand_type].filter(Boolean).join(" · ")}
        </p>
        {item.description && (
          <p className="text-sm text-text-secondary/80 italic border-t border-border-subtle pt-4">
            {item.description}
          </p>
        )}

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border-subtle">
          {item.gear_score > 0 && (
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gold-dark" />
              <span className="text-sm text-text-primary">Gear Score: <strong>{item.gear_score}</strong></span>
            </div>
          )}
          {item.vendor_price > 0 && (
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-gold-dark" />
              <span className="text-sm text-text-primary">Vendor: <strong>{formatNumber(item.vendor_price)}</strong></span>
            </div>
          )}
          {item.required_class && (
            <span className="text-sm text-text-secondary">
              Required: <strong className="text-text-primary">{item.required_class}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Dropped by */}
      {drops.length > 0 && (
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-5 mb-6">
          <h3 className="font-cinzel font-bold text-sm text-gold-dark uppercase tracking-wider mb-3 flex items-center gap-2">
            <Skull className="w-4 h-4 text-accent-red" />
            Dropped By
          </h3>
          <ul className="space-y-2">
            {drops.map(({ monster, spawns }) => {
              const mapIds = Array.from(new Set(spawns.map((s) => s.mapId)));
              const firstMapId = mapIds[0];
              const locationLabel =
                mapIds.length === 0
                  ? "Location unknown"
                  : mapIds.length === 1
                    ? firstMapId.replace(/_/g, " ")
                    : `${mapIds.length} maps`;
              return (
                <li
                  key={monster.id}
                  className="flex items-center justify-between gap-3 py-2 px-3 bg-bg-primary/30 rounded-sm"
                >
                  <div className="text-sm min-w-0">
                    <span className="text-text-primary font-medium">{monster.name}</span>
                    {monster.isBoss && (
                      <span className="ml-1.5 text-[10px] uppercase tracking-wider text-accent-red/80">
                        Boss
                      </span>
                    )}
                    <span className="text-text-secondary/60 text-xs ml-2 capitalize">
                      {locationLabel}
                    </span>
                  </div>
                  {firstMapId && (
                    <Link
                      href={`/maps?highlight=${monster.id}&map=${firstMapId}`}
                      className="shrink-0 text-[11px] px-2 py-1 rounded-sm border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 transition-colors"
                    >
                      Show on map
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Stat groups */}
      {statGroups.length > 0 ? (
        <div className="space-y-6">
          {statGroups.map((group) => (
            <div key={group.label} className="bg-bg-secondary border border-border-subtle rounded-sm p-5">
              <h3 className="font-cinzel font-bold text-sm text-gold-dark uppercase tracking-wider mb-4">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center justify-between py-1.5 px-3 bg-bg-primary/30 rounded-sm"
                  >
                    <span className="text-xs text-text-secondary capitalize">{stat.name}</span>
                    <span className="text-xs font-bold text-text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 text-center">
          <p className="text-sm text-text-secondary">No stat modifiers on this item.</p>
        </div>
      )}
    </motion.div>
  );
}
