"use client";

import { useEffect, useRef, useState } from "react";
import { Sword } from "lucide-react";
import type { BuildEquipment } from "@/lib/build-types";
import type { DarkerDBItem } from "@/lib/darkerdb";

// Base stats per class (no gear). Source: darkanddarker.wiki.spellsandguns.com
// memory_capacity = knowledge × 0.6 (rounded). Source: in-game character sheet.
const BASE_STATS: Record<string, Record<string, number>> = {
  Fighter:   { strength: 15, agility: 15, will: 15, knowledge: 15, resourcefulness: 15, health: 100,   move_speed: 307.5, memory_capacity: 9  },
  Barbarian: { strength: 20, agility: 13, will: 18, knowledge: 5,  resourcefulness: 12, health: 114.6, move_speed: 303.5, memory_capacity: 3  },
  Rogue:     { strength: 9,  agility: 25, will: 10, knowledge: 10, resourcefulness: 25, health: 83.5,  move_speed: 325,   memory_capacity: 6  },
  Ranger:    { strength: 12, agility: 20, will: 10, knowledge: 12, resourcefulness: 23, health: 91,    move_speed: 317.5, memory_capacity: 7  },
  Wizard:    { strength: 6,  agility: 15, will: 20, knowledge: 25, resourcefulness: 15, health: 83.5,  move_speed: 307.5, memory_capacity: 14 },
  Cleric:    { strength: 11, agility: 12, will: 23, knowledge: 20, resourcefulness: 12, health: 95,    move_speed: 301.5, memory_capacity: 12 },
  Bard:      { strength: 13, agility: 13, will: 11, knowledge: 20, resourcefulness: 15, health: 96,    move_speed: 303.5, memory_capacity: 12 },
  Warlock:   { strength: 11, agility: 14, will: 22, knowledge: 15, resourcefulness: 14, health: 96.5,  move_speed: 305.5, memory_capacity: 9  },
  Druid:     { strength: 12, agility: 12, will: 18, knowledge: 20, resourcefulness: 18, health: 95.5,  move_speed: 301.5, memory_capacity: 12 },
  Sorcerer:  { strength: 10, agility: 10, will: 25, knowledge: 20, resourcefulness: 12, health: 90,    move_speed: 295,   memory_capacity: 12 },
};

// primary_min_<field> → internal key
const PRIMARY_FIELDS: Record<string, string> = {
  strength: "strength",
  vigor: "vigor",
  agility: "agility",
  dexterity: "dexterity",
  will: "will",
  knowledge: "knowledge",
  resourcefulness: "resourcefulness",
  armor_rating: "armor_rating",
  additional_armor_rating: "armor_rating",
  move_speed: "move_speed",
  headshot_damage_reduction: "headshot_damage_reduction",
  luck: "luck",
  memory_capacity: "memory_capacity",
};

// secondary_<key> → internal key
const SECONDARY_FIELDS: Record<string, string> = {
  secondary_strength: "strength",
  secondary_vigor: "vigor",
  secondary_agility: "agility",
  secondary_dexterity: "dexterity",
  secondary_will: "will",
  secondary_knowledge: "knowledge",
  secondary_resourcefulness: "resourcefulness",
  secondary_additional_armor_rating: "armor_rating",
  secondary_magic_resistance: "magic_resistance",
  secondary_luck: "luck",
  secondary_memory_capacity_bonus: "memory_capacity",
  secondary_additional_memory_capacity: "memory_capacity",
  secondary_health_recovery_bonus: "health_recovery_bonus",
  secondary_spell_recovery_bonus: "spell_recovery_bonus",
  secondary_physical_healing_bonus: "physical_healing",
  secondary_magical_healing_bonus: "magical_healing",
  secondary_action_speed: "action_speed",
  secondary_manual_dexterity: "manual_dexterity",
  secondary_spell_casting_speed: "spell_casting_speed",
  secondary_equip_speed: "equip_speed",
  secondary_regular_interaction_speed: "regular_interaction_speed",
  secondary_magical_interaction_speed: "magical_interaction_speed",
  secondary_persuasiveness: "persuasiveness",
  secondary_buff_duration_bonus: "buff_duration",
  secondary_debuff_duration_bonus: "debuff_duration",
  secondary_cooldown_reduction_bonus: "cooldown_reduction",
  secondary_armor_penetration: "armor_penetration",
  secondary_magic_penetration: "magic_penetration",
  secondary_headshot_damage_reduction: "headshot_damage_reduction",
  secondary_projectile_damage_reduction: "projectile_damage_reduction",
  secondary_physical_damage_reduction: "physical_damage_reduction",
  secondary_magical_damage_reduction: "magical_damage_reduction",
  secondary_headshot_damage_bonus: "headshot_damage_bonus",
  secondary_physical_power: "physical_power",
  secondary_physical_damage_bonus: "physical_damage_bonus",
  secondary_magical_power: "magical_power",
  secondary_magical_damage_bonus: "magical_damage_bonus",
};

// Stat display format types
type StatFormat =
  | "plain"        // integer or decimal: "25"
  | "pct"          // percent: "12.5%"
  | "speed"        // speed + percent in parens: "307 (102.3%)"
  | "derived_pct"; // raw number + derived % in parens: "172 (40.8%)"

type StatDef = {
  key: string;
  label: string;
  format?: StatFormat;
  alwaysShow?: boolean;
  indent?: boolean;         // visually indented sub-row
  separator?: boolean;      // thin border above this row
  formula?: (v: number) => number; // for "derived_pct": converts raw → pct
};

// Armor rating → physical damage reduction % (community approximation)
const arToPdr = (ar: number) => (ar / (ar + 250)) * 100;
// Magic resistance → magical damage reduction %
const mrToMdr = (mr: number) => (mr / (mr + 250)) * 100;
// Physical / Magical power → damage bonus % (1 power ≈ 1%)
const powerToPct = (p: number) => p;

// Ordered exactly as requested — all stats always visible
const STAT_LIST: StatDef[] = [
  // Primary attributes
  { key: "strength",        label: "Strength",        alwaysShow: true },
  { key: "vigor",           label: "Vigor",           alwaysShow: true },
  { key: "agility",         label: "Agility",         alwaysShow: true },
  { key: "dexterity",       label: "Dexterity",       alwaysShow: true },
  { key: "will",            label: "Will",            alwaysShow: true },
  { key: "knowledge",       label: "Knowledge",       alwaysShow: true },
  { key: "resourcefulness", label: "Resourcefulness", alwaysShow: true },
  // Resources & utility
  { key: "health",                label: "Health",                alwaysShow: true, separator: true },
  { key: "physical_healing",      label: "Physical Healing",      alwaysShow: true },
  { key: "magical_healing",       label: "Magical Healing",       alwaysShow: true },
  { key: "memory_capacity",       label: "Memory Capacity",       alwaysShow: true },
  { key: "luck",                  label: "Luck",                  alwaysShow: true },
  { key: "health_recovery_bonus", label: "Health Recovery Bonus", alwaysShow: true, format: "pct" },
  { key: "spell_recovery_bonus",  label: "Spell Recovery Bonus",  alwaysShow: true, format: "pct" },
  // Speed & interaction
  { key: "move_speed",                label: "Move Speed",                alwaysShow: true, format: "speed",  separator: true },
  { key: "action_speed",              label: "Action Speed",              alwaysShow: true, format: "pct" },
  { key: "manual_dexterity",          label: "Manual Dexterity",          alwaysShow: true, format: "pct" },
  { key: "spell_casting_speed",       label: "Spell Casting Speed",       alwaysShow: true, format: "pct" },
  { key: "equip_speed",               label: "Equip Speed",               alwaysShow: true, format: "pct" },
  { key: "regular_interaction_speed", label: "Regular Interaction Speed", alwaysShow: true, format: "pct" },
  { key: "magical_interaction_speed", label: "Magical Interaction Speed", alwaysShow: true, format: "pct" },
  { key: "persuasiveness",            label: "Persuasiveness",            alwaysShow: true, format: "pct" },
  { key: "buff_duration",             label: "Buff Duration",             alwaysShow: true, format: "pct" },
  { key: "debuff_duration",           label: "Debuff Duration",           alwaysShow: true, format: "pct" },
  { key: "cooldown_reduction",        label: "Cooldown Reduction Bonus",  alwaysShow: true, format: "pct" },
  // Penetration & damage mitigation
  { key: "armor_penetration",           label: "Armor Penetration",           alwaysShow: true, format: "pct", separator: true },
  { key: "magic_penetration",           label: "Magic Penetration",           alwaysShow: true, format: "pct" },
  { key: "headshot_damage_reduction",   label: "Headshot Damage Reduction",   alwaysShow: true, format: "pct" },
  { key: "projectile_damage_reduction", label: "Projectile Damage Reduction", alwaysShow: true, format: "pct" },
  { key: "physical_damage_reduction",   label: "Physical Damage Reduction",   alwaysShow: true, format: "pct" },
  { key: "armor_rating",        label: "From Armor Rating",     alwaysShow: true, format: "derived_pct", formula: arToPdr, indent: true },
  { key: "magical_damage_reduction",    label: "Magical Damage Reduction",    alwaysShow: true, format: "pct" },
  { key: "magic_resistance",    label: "From Magic Resistance", alwaysShow: true, format: "derived_pct", formula: mrToMdr, indent: true },
  // Offense
  { key: "headshot_damage_bonus", label: "Headshot Damage Bonus", alwaysShow: true, format: "pct", separator: true },
  { key: "physical_damage_bonus", label: "Physical Power Bonus",  alwaysShow: true, format: "pct" },
  { key: "physical_power",  label: "From Physical Power",  alwaysShow: true, format: "derived_pct", formula: powerToPct, indent: true },
  { key: "magical_damage_bonus",  label: "Magic Power Bonus",     alwaysShow: true, format: "pct" },
  { key: "magical_power",   label: "From Magic Power",     alwaysShow: true, format: "derived_pct", formula: powerToPct, indent: true },
];

// ─── Aggregation ─────────────────────────────────────────────────────────────

function aggregateStats(
  selectedClass: string,
  equipment: BuildEquipment,
  itemData: Record<number, DarkerDBItem>
): Record<string, number> {
  const totals: Record<string, number> = {};
  const add = (key: string, val: number) => {
    totals[key] = (totals[key] ?? 0) + val;
  };

  // Seed with class base stats
  const base = BASE_STATS[selectedClass];
  if (base) {
    for (const [k, v] of Object.entries(base)) add(k, v);
  }

  // Layer in gear
  for (const slot of Object.values(equipment)) {
    if (!slot) continue;

    const item = itemData[slot.item_id];
    if (item) {
      for (const [field, value] of Object.entries(item)) {
        if (!field.startsWith("primary_min_")) continue;
        if (value == null || (value as number) === 0) continue;
        const mapped = PRIMARY_FIELDS[field.slice("primary_min_".length)];
        if (mapped) add(mapped, value as number);
      }
    }

    if (slot.stats) {
      for (const [key, val] of Object.entries(slot.stats)) {
        const mapped = SECONDARY_FIELDS[key];
        if (mapped && val) add(mapped, val);
      }
    }
  }

  return totals;
}

// ─── Formatting ──────────────────────────────────────────────────────────────

const BASE_SPEED = 300;

function fmtNum(value: number): string {
  const abs = Math.abs(value);
  const s = abs % 1 === 0 ? String(abs) : abs.toFixed(1);
  return value < 0 ? `-${s}` : s;
}

function renderValue(stat: StatDef, value: number): string {
  switch (stat.format) {
    case "pct":
      return `${fmtNum(value)}%`;
    case "speed": {
      const pct = (value / BASE_SPEED) * 100;
      return `${fmtNum(value)} (${fmtNum(pct)}%)`;
    }
    case "derived_pct": {
      const pct = stat.formula!(value);
      return `${fmtNum(value)} (${fmtNum(pct)}%)`;
    }
    default:
      return fmtNum(value);
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  equipment: BuildEquipment;
  selectedClass?: string;
  /** Called whenever the computed memory_capacity stat changes (base + gear). */
  onMemoryCapacity?: (capacity: number) => void;
}

export default function CharacterStatPanel({ equipment, selectedClass = "", onMemoryCapacity }: Props) {
  const [itemData, setItemData] = useState<Record<number, DarkerDBItem>>({});
  const fetchedIds = useRef(new Set<number>());
  const [showWeapon, setShowWeapon] = useState(false);
  const [weaponSlot, setWeaponSlot] = useState<"primary" | "secondary">("primary");

  useEffect(() => {
    const newIds = Object.values(equipment)
      .filter(Boolean)
      .map((s) => s!.item_id)
      .filter((id) => !fetchedIds.current.has(id));

    if (newIds.length === 0) return;
    newIds.forEach((id) => fetchedIds.current.add(id));

    Promise.all(
      newIds.map((id) =>
        fetch(`/api/items/${id}`)
          .then((r) => r.json())
          .then((d) => [id, d.body as DarkerDBItem] as const)
          .catch(() => null)
      )
    ).then((results) => {
      const updates: Record<number, DarkerDBItem> = {};
      for (const r of results) {
        if (r) updates[r[0]] = r[1];
      }
      setItemData((prev) => ({ ...prev, ...updates }));
    });
  }, [equipment]);

  const hasClass = !!BASE_STATS[selectedClass];

  // Build the equipment set to aggregate: always include armor, optionally include one weapon slot
  const activeEquipment: BuildEquipment = (() => {
    const armor = Object.fromEntries(
      Object.entries(equipment).filter(([k]) => k !== "primary" && k !== "secondary")
    ) as BuildEquipment;
    if (!showWeapon) return armor;
    const weapon = equipment[weaponSlot];
    return weapon ? { ...armor, [weaponSlot]: weapon } : armor;
  })();

  const stats = hasClass ? aggregateStats(selectedClass, activeEquipment, itemData) : {};

  const memCap = stats.memory_capacity ?? 0;
  const prevMemCapRef = useRef<number | null>(null);
  if (onMemoryCapacity && prevMemCapRef.current !== memCap) {
    prevMemCapRef.current = memCap;
    onMemoryCapacity(memCap);
  }

  if (!hasClass) {
    return (
      <div className="bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden">
        <div className="px-3 py-2 border-b border-border-subtle">
          <h2 className="font-cinzel font-bold text-xs text-gold-primary">Character Stats</h2>
        </div>
        <div className="px-3 py-8 text-center">
          <p className="text-xs text-text-secondary/40">Select a class to see character stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-border-subtle">
        <h2 className="font-cinzel font-bold text-xs text-gold-primary">Character Stats</h2>
        <p className="text-[9px] text-text-secondary/60 mt-0.5">{selectedClass} · base + gear</p>
      </div>

      <div className="px-3 py-2 space-y-px">
        {STAT_LIST.map((stat) => {
          const value = stats[stat.key] ?? 0;
          if (value === 0 && !stat.alwaysShow) return null;

          return (
            <div
              key={stat.key + stat.label}
              className={[
                "flex items-center justify-between gap-2 py-px",
                stat.separator ? "mt-2 pt-2 border-t border-border-subtle/40" : "",
                stat.indent ? "pl-3" : "",
              ].join(" ")}
            >
              <span
                className={`text-[10px] leading-tight ${
                  stat.indent ? "text-text-secondary/50" : "text-text-secondary"
                }`}
              >
                {stat.indent ? `↳ ${stat.label}` : stat.label}
              </span>
              <span
                className={`text-[10px] font-medium tabular-nums shrink-0 ${
                  value < 0
                    ? "text-accent-red"
                    : stat.indent
                      ? "text-text-secondary/70"
                      : "text-text-primary"
                }`}
              >
                {renderValue(stat, value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Weapon toggle */}
      <div className="px-3 py-2 border-t border-border-subtle/40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowWeapon((v) => !v)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border text-[10px] font-medium transition-all shrink-0 ${
            showWeapon
              ? "border-gold-primary/50 bg-gold-primary/10 text-gold-primary"
              : "border-border-subtle text-text-secondary hover:border-gold-primary/30 hover:text-text-primary"
          }`}
        >
          <Sword className="w-3 h-3" />
          With Weapon
        </button>

        {showWeapon && (
          <select
            value={weaponSlot}
            onChange={(e) => setWeaponSlot(e.target.value as "primary" | "secondary")}
            className="flex-1 px-2 py-1.5 bg-bg-primary border border-border-subtle rounded-sm text-[10px] text-text-primary focus:outline-none focus:border-gold-primary/50 transition-all"
          >
            <option value="primary">Primary Weapon</option>
            <option value="secondary">Secondary Weapon</option>
          </select>
        )}
      </div>
    </div>
  );
}
