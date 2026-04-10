"use client";

import { useState } from "react";
import { Check, Info } from "lucide-react";
import { type PerkData, type SkillData, getPerkIconUrl } from "@/lib/class-data";

interface PerkSkillSelectorProps {
  type: "perk" | "skill";
  items: (PerkData | SkillData)[];
  selected: string[];
  max: number;
  onChange: (selected: string[]) => void;
}

function PerkIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-8 h-8 rounded-sm bg-bg-tertiary border border-border-subtle flex items-center justify-center shrink-0">
        <span className="text-[9px] font-cinzel font-bold text-gold-dark">
          {name.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={getPerkIconUrl(name)}
      alt={name}
      className="w-8 h-8 rounded-sm object-cover bg-bg-tertiary border border-border-subtle shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

export default function PerkSkillSelector({
  type,
  items,
  selected,
  max,
  onChange,
}: PerkSkillSelectorProps) {
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else if (selected.length < max) {
      onChange([...selected, name]);
    }
  };

  const atMax = selected.length >= max;

  return (
    <div className="space-y-1.5">
      {items.map((item) => {
        const isSelected = selected.includes(item.name);
        const isDisabled = !isSelected && atMax;

        return (
          <div key={item.name}>
            <button
              type="button"
              onClick={() => !isDisabled && toggle(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm border text-left transition-all ${
                isSelected
                  ? "border-gold-primary/50 bg-gold-primary/10"
                  : isDisabled
                    ? "border-border-subtle/30 opacity-40 cursor-not-allowed"
                    : "border-border-subtle hover:border-gold-primary/30 cursor-pointer"
              }`}
            >
              <PerkIcon name={item.name} />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-medium block ${
                    isSelected ? "text-gold-primary" : "text-text-primary"
                  }`}
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedInfo(expandedInfo === item.name ? null : item.name);
                  }}
                  className="text-text-secondary/40 hover:text-text-secondary transition-colors p-0.5"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                {isSelected && (
                  <Check className="w-4 h-4 text-gold-primary" />
                )}
              </div>
            </button>

            {/* Expanded description */}
            {expandedInfo === item.name && (
              <div className="ml-11 mr-3 mt-1 mb-0.5 px-3 py-2 bg-bg-primary/40 rounded-sm border border-border-subtle/30">
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
