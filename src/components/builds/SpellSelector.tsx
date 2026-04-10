"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { getSpellIconUrl } from "@/lib/class-data";

interface SpellSelectorProps {
  label: string;
  items: { name: string; tier?: number }[];
  selected: string[];
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
  onChange,
}: SpellSelectorProps) {
  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const hasTiers = items.some((i) => i.tier != null && i.tier > 0);
  const grouped = hasTiers ? groupByTier(items) : [[0, items] as const];

  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold block mb-2">
        {label}
        {selected.length > 0 && (
          <span className="text-text-secondary font-normal ml-1">
            ({selected.length} selected)
          </span>
        )}
      </span>
      <div className="space-y-3">
        {grouped.map(([tier, spells]) => (
          <div key={tier}>
            {hasTiers && (
              <span className="text-[9px] text-text-secondary/50 uppercase tracking-wider block mb-1">
                Tier {tier}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {spells.map((spell) => {
                const isSelected = selected.includes(spell.name);
                return (
                  <button
                    key={spell.name}
                    type="button"
                    onClick={() => toggle(spell.name)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-sm border text-left transition-all ${
                      isSelected
                        ? "border-purple-400/50 bg-purple-400/10"
                        : "border-border-subtle hover:border-purple-400/30 cursor-pointer"
                    }`}
                  >
                    <SpellIcon name={spell.name} />
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? "text-purple-300" : "text-text-primary"
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
