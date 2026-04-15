"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Coins, Sword, Sparkles } from "lucide-react";
import { DarkerDBItem, getRarityStyle, getItemClasses } from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";

interface ItemModalProps {
  item: DarkerDBItem | null;
  onClose: () => void;
}

const WIKI_BASE = "https://darkanddarker.wiki.spellsandguns.com";

function getItemImageUrl(name: string): string {
  const sanitized = name.replace(/ /g, "_");
  return `${WIKI_BASE}/Special:Redirect/file/${encodeURIComponent(sanitized)}.png`;
}

function getItemImageFallback(name: string): string {
  const sanitized = name.replace(/ /g, "_");
  return `${WIKI_BASE}/Special:Redirect/file/${encodeURIComponent(sanitized)}_1.png`;
}

// Extract meaningful non-null stats grouped by category
function extractStatGroups(item: DarkerDBItem): { label: string; stats: { name: string; value: string }[] }[] {
  const prefixes = [
    { label: "Primary", minPrefix: "primary_min_", maxPrefix: "primary_max_" },
  ];

  const groups: { label: string; stats: { name: string; value: string }[] }[] = [];

  for (const { label, minPrefix, maxPrefix } of prefixes) {
    const stats: { name: string; value: string }[] = [];
    const seen = new Set<string>();

    for (const [key, value] of Object.entries(item)) {
      if (!key.startsWith(minPrefix)) continue;
      if (value == null || value === 0) continue;

      const statName = key.slice(minPrefix.length).replace(/_/g, " ");
      if (seen.has(statName)) continue;
      seen.add(statName);

      const maxKey = maxPrefix + key.slice(minPrefix.length);
      const minVal = value as number;
      const maxVal = item[maxKey] as number | null;

      if (maxVal != null && minVal !== maxVal) {
        stats.push({ name: statName, value: `${minVal} – ${maxVal}` });
      } else {
        stats.push({ name: statName, value: String(minVal) });
      }
    }

    if (stats.length > 0) {
      groups.push({ label, stats });
    }
  }

  return groups;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  const [imgFailed, setImgFailed] = useState(0);

  useEffect(() => {
    setImgFailed(0);
  }, [item?.id]);

  if (!item) return null;

  const rarity = getRarityStyle(item.rarity);
  const statGroups = extractStatGroups(item);
  const classes = getItemClasses(item.required_class);
  const name = item.name || item.archetype;
  const imgSrcs = [getItemImageUrl(name), getItemImageFallback(name)];

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative bg-bg-secondary border-l-4 ${rarity.border} border border-border-subtle rounded-sm w-full max-w-lg max-h-[85vh] overflow-y-auto`}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-text-secondary hover:text-gold-primary transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Item image showcase */}
              <div className="flex items-center justify-center py-10 sm:py-14 px-6 sm:px-8 bg-gradient-to-b from-bg-tertiary/80 via-bg-secondary to-bg-secondary border-b border-border-subtle min-h-[200px] sm:min-h-[260px] relative overflow-hidden">
                {/* Radial glow behind item */}
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                  <div className={`w-36 h-36 sm:w-48 sm:h-48 rounded-full ${rarity.bg} blur-[60px] opacity-60`} />
                </div>

                <div className="relative">
                  {/* Ornate frame */}
                  <div className={`relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center border-2 ${rarity.border} bg-bg-primary/50 rounded-sm`}>
                    {/* Corner ornaments */}
                    <span className={`absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 ${rarity.border}`} />
                    <span className={`absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 ${rarity.border}`} />
                    <span className={`absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 ${rarity.border}`} />
                    <span className={`absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 ${rarity.border}`} />

                    {/* Inner border */}
                    <div className={`absolute inset-3 border ${rarity.border} rounded-sm opacity-30`} />

                    {imgFailed < imgSrcs.length ? (
                      <img
                        src={imgSrcs[imgFailed]}
                        alt={item.name}
                        className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]"
                        onError={() => setImgFailed((f) => f + 1)}
                      />
                    ) : (
                      <Sword className={`relative z-10 w-20 h-20 ${rarity.text} opacity-50`} />
                    )}
                  </div>

                  {/* Outer decorative diamonds */}
                  <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${rarity.bg} border ${rarity.border}`} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${rarity.bg} border ${rarity.border}`} />
                  <div className={`absolute top-1/2 -left-2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 ${rarity.bg} border ${rarity.border}`} />
                  <div className={`absolute top-1/2 -right-2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 ${rarity.bg} border ${rarity.border}`} />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <span className={`text-[10px] uppercase tracking-wider font-bold ${rarity.text}`}>
                  {item.rarity}
                </span>
                <h2 className={`font-cinzel font-bold text-2xl ${rarity.text} mt-1 mb-1`}>
                  {item.name}
                </h2>
                <p className="text-xs text-text-secondary mb-4">
                  {[item.type, item.slot_type, item.armor_type, item.hand_type].filter(Boolean).join(" · ")}
                </p>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-text-secondary/80 italic mb-4 pb-4 border-b border-border-subtle">
                    {item.description}
                  </p>
                )}

                {/* Special Effect */}
                {item.effect && (
                  <div className="flex items-start gap-2 mb-4 pb-4 border-b border-border-subtle bg-gold-primary/5 -mx-6 px-6 py-3">
                    <Sparkles className="w-4 h-4 text-gold-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-gold-light">
                      {item.effect}
                    </p>
                  </div>
                )}

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border-subtle">
                  {item.gear_score > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-gold-dark" />
                      <span className="text-sm text-text-primary">
                        Gear Score: <strong className="text-gold-primary">{item.gear_score}</strong>
                      </span>
                    </div>
                  )}
                  {item.vendor_price > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-gold-dark" />
                      <span className="text-sm text-text-primary">
                        Value: <strong className="text-gold-primary">{formatNumber(item.vendor_price)} Gold</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Classes */}
                <div className="mb-4 pb-4 border-b border-border-subtle">
                  <h3 className="font-cinzel font-bold text-xs text-gold-dark uppercase tracking-wider mb-2">
                    Classes
                  </h3>
                  {classes === "All" ? (
                    <span className="text-sm text-text-secondary">All</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {classes.map((cls) => (
                        <span
                          key={cls}
                          className="text-[11px] px-2 py-0.5 bg-bg-primary/50 border border-border-subtle rounded-sm text-text-secondary"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                {statGroups.length > 0 ? (
                  <div className="space-y-4">
                    {statGroups.map((group) => (
                      <div key={group.label}>
                        <h3 className="font-cinzel font-bold text-xs text-gold-dark uppercase tracking-wider mb-2">
                          {group.label} Attributes
                        </h3>
                        <div className="grid grid-cols-1 gap-1.5">
                          {group.stats.map((stat) => (
                            <div
                              key={stat.name}
                              className="flex items-center justify-between py-2 px-3 bg-bg-primary/30 rounded-sm"
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
                  <p className="text-sm text-text-secondary/60 text-center py-2">No stat modifiers.</p>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
