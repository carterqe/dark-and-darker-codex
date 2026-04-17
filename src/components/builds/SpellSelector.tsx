"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { getSpellIconUrl } from "@/lib/class-data";

interface SpellSelectorProps {
  label: string;
  items: { name: string; tier?: number }[];
  selected: string[];
  /** Total memory slots available. Undefined = no cap enforced. */
  maxMemory?: number;
  onChange: (selected: string[]) => void;
}

function SpellIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-7 h-7 rounded-sm bg-bg-tertiary border border-border-subtle flex items-center justify-center shrink-0">
        <span className="text-[9px] font-cinzel font-bold text-purple-400">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={getSpellIconUrl(name)}
      alt={name}
      className="w-7 h-7 rounded-sm object-cover bg-bg-tertiary border border-border-subtle shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

// Group spells by tier for display
function groupByTier(items: { name: string; tier?: number }[]) {
  const groups = new Map<number, { name: string; tier?: number }[]>();
  for (const item of items) {
    const tier = item.tier ?? 0;
    if (!groups.has(tier)) groups.set(tier, []);
    groups.get(tier)!.push(item);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => a - b);
}

export default function SpellSelector({
  label,
  items,
  selected,
  maxMemory,
  onChange,
}: SpellSelectorProps) {
  const hasLimit = maxMemory != null;

  // Sum of tiers of items in this group that are currently selected
  const usedMemory = items.reduce((sum, item) => {
    return selected.includes(item.name) ? sum + (item.tier ?? 1) : sum;
  }, 0);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      if (hasLimit) {
        const cost = items.find((i) => i.name === name)?.tier ?? 1;
        if (usedMemory + cost > maxMemory!) return;
      }
      onChange([...selected, name]);
    }
  };

  const hasTiers = items.some((i) => i.tier != null && i.tier > 0);
  const grouped = hasTiers ? groupByTier(items) : [[0, items] as const];

  const memoryFull = hasLimit && usedMemory >= maxMemory!;
  const memoryPct  = hasLimit ? Math.min(100, (usedMemory / maxMemory!) * 100) : 0;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">
          {label}
        </span>

        {hasLimit && (
          <div className="flex items-center gap-2">
            {/* Progress bar */}
            <div className="w-24 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${memoryPct}%`,
                  backgroundColor: memoryFull ? "#f87171" : "#a78bfa",
                }}
              />
            </div>
            <span className={`text-[10px] font-medium tabular-nums ${memoryFull ? "text-red-400" : "text-purple-400/70"}`}>
              {usedMemory} / {maxMemory}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {grouped.map(([tier, spells]) => (
          <div key={tier}>
            {hasTiers && (
              <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider block mb-1">
                Tier {tier} &mdash; costs {tier} {tier === 1 ? "slot" : "slots"}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {spells.map((spell) => {
                const isSelected = selected.includes(spell.name);
                const cost = spell.tier ?? 1;
                const wouldExceed = hasLimit && !isSelected && usedMemory + cost > maxMemory!;

                return (
                  <button
                    key={spell.name}
                    type="button"
                    onClick={() => toggle(spell.name)}
                    disabled={wouldExceed}
                    title={wouldExceed ? `Requires ${cost} slot${cost !== 1 ? "s" : ""} (${maxMemory! - usedMemory} remaining)` : undefined}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-sm border text-left transition-all ${
                      isSelected
                        ? "border-purple-400/50 bg-purple-400/10"
                        : wouldExceed
                          ? "border-border-subtle/30 opacity-35 cursor-not-allowed"
                          : "border-border-subtle hover:border-purple-400/30 cursor-pointer"
                    }`}
                  >
                    <SpellIcon name={spell.name} />
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? "text-purple-300" : wouldExceed ? "text-text-secondary/40" : "text-text-primary"
                      }`}
                    >
                      {spell.name}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-purple-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
