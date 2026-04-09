"use client";

import { motion } from "framer-motion";
import { DarkerDBItem, getRarityStyle } from "@/lib/darkerdb";
import { formatNumber } from "@/lib/utils";
import { Coins, Shield } from "lucide-react";

interface ItemCardProps {
  item: DarkerDBItem;
  index: number;
  onClick: () => void;
}

export default function ItemCard({ item, index, onClick }: ItemCardProps) {
  const rarity = getRarityStyle(item.rarity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
    >
      <div
        onClick={onClick}
        className={`relative bg-bg-secondary border-l-2 ${rarity.border} border border-border-subtle rounded-sm p-4 hover:bg-bg-tertiary/50 transition-all duration-200 cursor-pointer group h-full`}
      >
        {/* Rarity + gear score */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-[10px] uppercase tracking-wider font-bold ${rarity.text}`}>
            {item.rarity}
          </span>
          {item.gear_score > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-text-secondary">
              <Shield className="w-3 h-3" />
              {item.gear_score}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className={`font-cinzel font-bold text-sm ${rarity.text} group-hover:brightness-125 transition-all mb-1 leading-tight`}>
          {item.name}
        </h3>

        {/* Type info */}
        <p className="text-[11px] text-text-secondary mb-3">
          {[item.type, item.slot_type, item.armor_type].filter(Boolean).join(" · ")}
        </p>

        {/* Bottom stats */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border-subtle">
          {item.vendor_price > 0 && (
            <span className="flex items-center gap-1 text-xs text-gold-dark">
              <Coins className="w-3 h-3" />
              {formatNumber(item.vendor_price)}
            </span>
          )}
          {item.slot_type && (
            <span className="text-[10px] text-text-secondary/60">
              {item.slot_type}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
