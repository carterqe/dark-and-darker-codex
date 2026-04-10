"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Primary stats
  for (const [key, value] of Object.entries(item)) {
    if (!key.startsWith("primary_min_")) continue;
    if (value == null || value === 0) continue;

    const statName = key.slice("primary_min_".length);
    if (seen.has(statName)) continue;
    seen.add(statName);

    const minVal = value as number;
    const maxKey = `primary_max_${statName}`;
    const maxVal = (item[maxKey] as number) ?? minVal;

    ranges.push({
      key: statName,
      label: statName.replace(/_/g, " "),
      min: minVal,
      max: maxVal,
      category: "primary",
    });
  }

  // Secondary stats (enchantable via merchant)
  for (const [key, value] of Object.entries(item)) {
    if (!key.startsWith("secondary_min_")) continue;
    // Skip enchanted variants — they're a sub-range of secondary
    if (key.includes("enchanted")) continue;
    if (value == null || value === 0) continue;

    const statName = key.slice("secondary_min_".length);
    if (seen.has(statName)) continue;
    seen.add(statName);

    const minVal = value as number;
    const maxKey = `secondary_max_${statName}`;
    const maxVal = (item[maxKey] as number) ?? minVal;

    ranges.push({
      key: `secondary_${statName}`,
      label: statName.replace(/_/g, " "),
      min: minVal,
      max: maxVal,
      category: "secondary",
    });
  }

  return ranges;
}

function formatStatLabel(s: string): string {
  return s
    .replace(/^secondary_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
  const [statValues, setStatValues] = useState<Record<string, number>>({});

  const fetchItemStats = useCallback(async (itemId: number) => {
    const res = await fetch(`/api/items/${itemId}`);
    if (!res.ok) return;
    const data = await res.json();
    const item = data.body as DarkerDBItem;
    const ranges = extractStatRanges(item);
    setStatRanges(ranges);

    const defaults: Record<string, number> = {};
    for (const r of ranges) {
      defaults[r.key] = value?.stats?.[r.key] ?? r.min;
    }
    setStatValues(defaults);
  }, [value?.stats]);

  useEffect(() => {
    if (value?.item_id) {
      fetchItemStats(value.item_id);
    } else {
      setStatRanges([]);
      setStatValues({});
      setStatsOpen(false);
    }
  }, [value?.item_id, fetchItemStats]);

  const handleItemChange = (item: BuildGearItem | null) => {
    if (!item) {
      onChange(null);
      return;
    }
    onChange({ ...item, stats: {} });
  };

  const updateStat = (key: string, val: number) => {
    const range = statRanges.find((r) => r.key === key);
    if (!range) return;
    const clamped = Math.min(range.max, Math.max(range.min, val));

    const newStats = { ...statValues, [key]: clamped };
    setStatValues(newStats);

    if (value) {
      onChange({ ...value, stats: newStats });
    }
  };

  const primaryStats = statRanges.filter((s) => s.category === "primary");
  const secondaryStats = statRanges.filter((s) => s.category === "secondary");

  return (
    <div className="space-y-1">
      <ItemSearchDropdown
        slotLabel={slotLabel}
        slotType={slotType}
        selectedClass={selectedClass}
        value={value}
        onChange={handleItemChange}
      />

      {/* Stat customization */}
      {value && statRanges.length > 0 && (
        <div className="bg-bg-primary/40 border border-border-subtle/50 rounded-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setStatsOpen(!statsOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] text-text-secondary hover:text-gold-primary transition-colors"
          >
            <span>
              Stat Rolls
              {Object.keys(value.stats ?? {}).length > 0 && (
                <span className="ml-1 text-gold-dark">
                  ({Object.keys(value.stats ?? {}).length} set)
                </span>
              )}
            </span>
            {statsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {statsOpen && (
            <div className="px-3 pb-2 space-y-2">
              {/* Primary stats */}
              {primaryStats.length > 0 && (
                <div>
                  <span className="text-[9px] text-gold-dark uppercase tracking-wider font-bold block mb-1">
                    Primary
                  </span>
                  <div className="space-y-1">
                    {primaryStats.map((stat) => (
                      <StatRow
                        key={stat.key}
                        stat={stat}
                        value={statValues[stat.key] ?? stat.min}
                        onChange={(val) => updateStat(stat.key, val)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary stats (enchantable) */}
              {secondaryStats.length > 0 && (
                <div>
                  <span className="text-[9px] text-blue-400 uppercase tracking-wider font-bold block mb-1">
                    Secondary (Enchantable)
                  </span>
                  <div className="space-y-1">
                    {secondaryStats.map((stat) => (
                      <StatRow
                        key={stat.key}
                        stat={stat}
                        value={statValues[stat.key] ?? stat.min}
                        onChange={(val) => updateStat(stat.key, val)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatRow({
  stat,
  value,
  onChange,
}: {
  stat: StatRange;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[10px] text-text-secondary capitalize w-24 shrink-0 truncate"
        title={formatStatLabel(stat.key)}
      >
        {formatStatLabel(stat.key)}
      </span>
      <input
        type="number"
        step="any"
        min={stat.min}
        max={stat.max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || stat.min)}
        className="w-16 px-1.5 py-0.5 bg-bg-secondary border border-border-subtle rounded-sm text-[10px] text-text-primary text-center focus:outline-none focus:border-gold-primary/50"
      />
      <span className="text-[9px] text-text-secondary/50 shrink-0">
        {stat.min}–{stat.max}
      </span>
    </div>
  );
}
