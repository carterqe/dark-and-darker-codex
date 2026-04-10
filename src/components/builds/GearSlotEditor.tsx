"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DarkerDBItem } from "@/lib/darkerdb";
import type { BuildGearItem } from "@/lib/build-types";
import ItemSearchDropdown from "./ItemSearchDropdown";

interface GearSlotEditorProps {
  slotLabel: string;
  slotType: string;
  selectedClass?: string;
  value: BuildGearItem | null;
  onChange: (item: BuildGearItem | null) => void;
}

// Maximum number of secondary stat rolls allowed per rarity
const RARITY_MAX_ROLLS: Record<string, number> = {
  Poor: 0,
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Unique: 5,
  Artifact: 5,
};

interface StatRange {
  key: string;
  label: string;
  min: number;
  max: number;
  category: "primary" | "secondary";
}

function extractStatRanges(item: DarkerDBItem): StatRange[] {
  const ranges: StatRange[] = [];
  const seen = new Set<string>();

  for (const [key, value] of Object.entries(item)) {
    if (!key.startsWith("primary_min_")) continue;
    if (value == null || value === 0) continue;
    const statName = key.slice("primary_min_".length);
    if (seen.has(statName)) continue;
    seen.add(statName);
    const minVal = value as number;
    const maxVal = (item[`primary_max_${statName}`] as number) ?? minVal;
    ranges.push({ key: statName, label: statName.replace(/_/g, " "), min: minVal, max: maxVal, category: "primary" });
  }

  for (const [key, value] of Object.entries(item)) {
    if (!key.startsWith("secondary_min_") || key.includes("enchanted")) continue;
    if (value == null || value === 0) continue;
    const statName = key.slice("secondary_min_".length);
    if (seen.has(statName)) continue;
    seen.add(statName);
    const minVal = value as number;
    const maxVal = (item[`secondary_max_${statName}`] as number) ?? minVal;
    ranges.push({ key: `secondary_${statName}`, label: statName.replace(/_/g, " "), min: minVal, max: maxVal, category: "secondary" });
  }

  return ranges;
}

function formatStatLabel(s: string): string {
  return s.replace(/^secondary_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GearSlotEditor({
  slotLabel,
  slotType,
  selectedClass,
  value,
  onChange,
}: GearSlotEditorProps) {
  const [statRanges, setStatRanges] = useState<StatRange[]>([]);
  const [statsOpen, setStatsOpen] = useState(false);
  // Only tracks stats the user has explicitly enabled
  const [enabledStats, setEnabledStats] = useState<Record<string, number>>({});
  const initialStatsRef = useRef(value?.stats);
  initialStatsRef.current = value?.stats;

  const fetchItemStats = useCallback(async (itemId: number) => {
    const res = await fetch(`/api/items/${itemId}`);
    if (!res.ok) return;
    const data = await res.json();
    const item = data.body as DarkerDBItem;
    setStatRanges(extractStatRanges(item));
    // Restore previously saved stats (from existing build data)
    setEnabledStats(initialStatsRef.current ?? {});
  }, []);

  useEffect(() => {
    if (value?.item_id) {
      fetchItemStats(value.item_id);
    } else {
      setStatRanges([]);
      setEnabledStats({});
      setStatsOpen(false);
    }
  }, [value?.item_id, fetchItemStats]);

  const handleItemChange = (item: BuildGearItem | null) => {
    if (!item) { onChange(null); return; }
    setEnabledStats({});
    onChange({ ...item, stats: {} });
  };

  const maxRolls = RARITY_MAX_ROLLS[value?.rarity ?? ""] ?? 0;
  const enabledSecondaryCount = Object.keys(enabledStats).filter((k) =>
    statRanges.find((r) => r.key === k)?.category === "secondary"
  ).length;

  const toggleStat = (key: string) => {
    const range = statRanges.find((r) => r.key === key);
    if (!range || range.category === "primary") return;

    const next = { ...enabledStats };
    if (key in next) {
      delete next[key];
    } else {
      // Enforce rarity roll limit
      if (enabledSecondaryCount >= maxRolls) return;
      next[key] = range.min;
    }
    setEnabledStats(next);
    if (value) onChange({ ...value, stats: next });
  };

  const updateStatValue = (key: string, val: number) => {
    const range = statRanges.find((r) => r.key === key);
    if (!range) return;
    const clamped = Math.min(range.max, Math.max(range.min, val));
    const next = { ...enabledStats, [key]: clamped };
    setEnabledStats(next);
    if (value) onChange({ ...value, stats: next });
  };

  const primaryStats = statRanges.filter((s) => s.category === "primary");
  const secondaryStats = statRanges.filter((s) => s.category === "secondary");
  const enabledEntries = Object.entries(enabledStats);

  return (
    <div className="space-y-1">
      <ItemSearchDropdown
        slotLabel={slotLabel}
        slotType={slotType}
        selectedClass={selectedClass}
        value={value}
        onChange={handleItemChange}
      />

      {value && statRanges.length > 0 && (
        <div className="bg-bg-primary/40 border border-border-subtle/50 rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setStatsOpen(!statsOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-text-secondary hover:text-gold-primary transition-colors"
          >
            <span className="flex-1 min-w-0">
              {enabledEntries.length > 0 ? (
                <span className="flex flex-wrap gap-1">
                  {enabledEntries.map(([key, val]) => (
                    <span key={key} className="text-[9px] px-1 py-0.5 bg-accent-emerald/10 text-accent-emerald rounded-sm">
                      {formatStatLabel(key)} +{val}
                    </span>
                  ))}
                </span>
              ) : (
                <span>Stat Rolls</span>
              )}
            </span>
            {statsOpen ? <ChevronUp className="w-3 h-3 shrink-0 ml-2" /> : <ChevronDown className="w-3 h-3 shrink-0 ml-2" />}
          </button>

          {statsOpen && (
            <div className="px-3 pb-2 space-y-2">
              {primaryStats.length > 0 && (
                <div>
                  <span className="text-[9px] text-gold-dark uppercase tracking-wider font-bold block mb-1">
                    Primary (Fixed)
                  </span>
                  <div className="space-y-1">
                    {primaryStats.map((stat) => (
                      <div key={stat.key} className="flex items-center gap-2">
                        <span className="text-[10px] capitalize w-24 shrink-0 truncate text-text-secondary/60" title={formatStatLabel(stat.key)}>
                          {formatStatLabel(stat.key)}
                        </span>
                        <span className="text-[9px] text-text-secondary/40">
                          {stat.min}–{stat.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {secondaryStats.length > 0 && (
                <StatGroup
                  label={`Secondary (Socketable) — ${enabledSecondaryCount}/${maxRolls} rolls`}
                  labelColor="text-blue-400"
                  stats={secondaryStats}
                  enabled={enabledStats}
                  atLimit={enabledSecondaryCount >= maxRolls}
                  onToggle={toggleStat}
                  onValueChange={updateStatValue}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatGroup({
  label,
  labelColor,
  stats,
  enabled,
  atLimit,
  onToggle,
  onValueChange,
}: {
  label: string;
  labelColor: string;
  stats: StatRange[];
  enabled: Record<string, number>;
  atLimit?: boolean;
  onToggle: (key: string) => void;
  onValueChange: (key: string, val: number) => void;
}) {
  return (
    <div>
      <span className={`text-[9px] ${labelColor} uppercase tracking-wider font-bold block mb-1`}>
        {label}
      </span>
      <div className="space-y-1">
        {stats.map((stat) => {
          const isEnabled = stat.key in enabled;
          const isDisabled = !isEnabled && atLimit;
          return (
            <div key={stat.key} className="flex items-center gap-2">
              {/* Toggle checkbox */}
              <button
                type="button"
                onClick={() => onToggle(stat.key)}
                disabled={isDisabled}
                className={`w-3.5 h-3.5 rounded-sm border shrink-0 flex items-center justify-center transition-all ${
                  isEnabled
                    ? "bg-gold-primary/30 border-gold-primary/60"
                    : isDisabled
                      ? "border-border-subtle/30 cursor-not-allowed opacity-30"
                      : "border-border-subtle hover:border-gold-primary/40"
                }`}
              >
                {isEnabled && <span className="text-[8px] text-gold-primary">✓</span>}
              </button>

              <span
                className={`text-[10px] capitalize w-24 shrink-0 truncate ${
                  isEnabled ? "text-text-primary" : isDisabled ? "text-text-secondary/25" : "text-text-secondary/50"
                }`}
                title={formatStatLabel(stat.key)}
              >
                {formatStatLabel(stat.key)}
              </span>

              {isEnabled ? (
                <>
                  <input
                    type="number"
                    step="any"
                    min={stat.min}
                    max={stat.max}
                    value={enabled[stat.key]}
                    onChange={(e) => onValueChange(stat.key, parseFloat(e.target.value) || stat.min)}
                    className="w-16 px-1.5 py-0.5 bg-bg-secondary border border-border-subtle rounded-sm text-[10px] text-text-primary text-center focus:outline-none focus:border-gold-primary/50"
                  />
                  <span className="text-[9px] text-text-secondary/50 shrink-0">
                    {stat.min}–{stat.max}
                  </span>
                </>
              ) : (
                <span className={`text-[9px] ${isDisabled ? "text-text-secondary/15" : "text-text-secondary/30"}`}>
                  {stat.min}–{stat.max}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
