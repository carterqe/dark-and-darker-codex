"use client";

import { Search, ChevronDown } from "lucide-react";

interface ItemFiltersProps {
  type: string;
  rarity: string;
  slot: string;
  handType: string;
  stat: string;
  search: string;
  availableStats: string[];
  onTypeChange: (v: string) => void;
  onRarityChange: (v: string) => void;
  onSlotChange: (v: string) => void;
  onHandTypeChange: (v: string) => void;
  onStatChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

const TYPES = ["", "Weapon", "Armor", "Accessory", "Utility", "Misc"];
const RARITIES = ["", "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Unique", "Artifact"];

const pillClass = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer transition-all duration-200 whitespace-nowrap ${
    active
      ? "text-gold-light bg-bg-tertiary border border-gold-primary/40"
      : "text-text-secondary border border-border-subtle hover:text-gold-primary hover:border-gold-dark"
  }`;

const selectClass =
  "bg-bg-secondary border border-border-subtle rounded-sm px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-gold-primary/50 transition-all cursor-pointer appearance-none pr-7";

function formatStatName(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Combined value encodes both slot_type and hand_type
// Prefixed to distinguish: "slot:Head", "hand:One Handed"
function handleSlotChange(
  value: string,
  onSlotChange: (v: string) => void,
  onHandTypeChange: (v: string) => void
) {
  if (value.startsWith("hand:")) {
    onSlotChange("");
    onHandTypeChange(value.slice(5));
  } else if (value.startsWith("slot:")) {
    onHandTypeChange("");
    onSlotChange(value.slice(5));
  } else {
    onSlotChange("");
    onHandTypeChange("");
  }
}

function getCurrentSlotValue(slot: string, handType: string): string {
  if (handType) return `hand:${handType}`;
  if (slot) return `slot:${slot}`;
  return "";
}

export default function ItemFilters({
  type,
  rarity,
  slot,
  stat,
  search,
  handType,
  availableStats,
  onTypeChange,
  onRarityChange,
  onSlotChange,
  onHandTypeChange,
  onStatChange,
  onSearchChange,
}: ItemFiltersProps) {
  const combinedSlotValue = getCurrentSlotValue(slot, handType);

  return (
    <div className="space-y-3 mb-6">
      {/* Type pills + Search */}
      {/* Type pills */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Type</span>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button key={t || "all-type"} onClick={() => onTypeChange(t)} className={pillClass(type === t)}>
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity pills */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Rarity</span>
        <div className="flex flex-wrap gap-1.5">
          {RARITIES.map((r) => (
            <button key={r || "all-rarity"} onClick={() => onRarityChange(r)} className={pillClass(rarity === r)}>
              {r || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Gear Slot + Stat + Search row */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Gear Slot</span>
          <div className="relative">
            <select
              value={combinedSlotValue}
              onChange={(e) => handleSlotChange(e.target.value, onSlotChange, onHandTypeChange)}
              className={selectClass}
            >
              <option value="">All Slots</option>
              <optgroup label="Armor">
                <option value="slot:Head">Head</option>
                <option value="slot:Chest">Chest</option>
                <option value="slot:Legs">Legs</option>
                <option value="slot:Hands">Hands</option>
                <option value="slot:Foot">Foot</option>
                <option value="slot:Back">Back</option>
                <option value="slot:Sash">Sash</option>
              </optgroup>
              <optgroup label="Accessories">
                <option value="slot:Necklace">Necklace</option>
                <option value="slot:Ring">Ring</option>
              </optgroup>
              <optgroup label="Weapons">
                <option value="slot:Primary">Primary Weapon</option>
                <option value="slot:Secondary">Secondary / Off-hand</option>
                <option value="hand:One Handed">One Handed</option>
                <option value="hand:Two Handed">Two Handed</option>
              </optgroup>
              <optgroup label="Other">
                <option value="slot:Utility">Utility</option>
                <option value="slot:Unarmed">Unarmed</option>
              </optgroup>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Stat Bonus</span>
          <div className="relative">
            <select value={stat} onChange={(e) => onStatChange(e.target.value)} className={selectClass}>
              <option value="">Any Stat</option>
              {availableStats.map((s) => (
                <option key={s} value={s}>{formatStatName(s)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
          </div>
        </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 focus:shadow-[0_0_10px_rgba(201,168,76,0.1)] transition-all"
          />
        </div>
      </div>
    </div>
  );
}
