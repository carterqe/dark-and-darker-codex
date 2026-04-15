"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { type DarkerDBItem } from "@/lib/darkerdb";
import type { BuildGearItem } from "@/lib/build-types";

// DarkerDB uses a bitmask for required_class
const CLASS_BITMASK: Record<string, number> = {
  Fighter: 1,
  Barbarian: 2,
  Rogue: 4,
  Ranger: 8,
  Wizard: 16,
  Cleric: 32,
  Bard: 64,
  Warlock: 128,
  Druid: 256,
  Sorcerer: 512,
};

function canClassEquip(requiredClass: unknown, className: string): boolean {
  if (requiredClass == null) return true;
  const mask = typeof requiredClass === "number" ? requiredClass : parseInt(String(requiredClass), 10);
  if (isNaN(mask)) return true;
  const classBit = CLASS_BITMASK[className] ?? 0;
  return (mask & classBit) !== 0;
}

interface ItemSearchDropdownProps {
  slotLabel: string;
  slotType: string;
  selectedClass?: string;
  value: BuildGearItem | null;
  onChange: (item: BuildGearItem | null) => void;
}

export default function ItemSearchDropdown({
  slotLabel,
  slotType,
  selectedClass,
  value,
  onChange,
}: ItemSearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<DarkerDBItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<DarkerDBItem[]>([]);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch ALL items for this slot once when dropdown opens
  const fetchSlotItems = useCallback(async () => {
    if (loaded) return;
    setFetching(true);
    const params = new URLSearchParams({ slot_type: slotType, fetchAll: "true" });
    const res = await fetch(`/api/items?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setAllItems(data.body ?? []);
      setLoaded(true);
    }
    setFetching(false);
  }, [slotType, loaded]);

  // Re-fetch when slot type changes
  useEffect(() => {
    setLoaded(false);
    setAllItems([]);
  }, [slotType]);

  // Filter items by class and search query
  useEffect(() => {
    let items = allItems;

    // Filter by class: use bitmask to check if class can equip item
    if (selectedClass) {
      items = items.filter((item) => canClassEquip(item.required_class, selectedClass));
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Deduplicate by name — keep the highest rarity entry so secondary stat
    // ranges are always fully populated (rarity is chosen separately via dropdown)
    const RARITY_RANK: Record<string, number> = {
      Poor: 0, Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5, Unique: 6, Artifact: 7,
    };
    const best = new Map<string, typeof items[number]>();
    for (const item of items) {
      const existing = best.get(item.name);
      if (!existing || (RARITY_RANK[item.rarity] ?? 0) > (RARITY_RANK[existing.rarity] ?? 0)) {
        best.set(item.name, item);
      }
    }
    items = Array.from(best.values());

    // Sort alphabetically
    items.sort((a, b) => a.name.localeCompare(b.name));

    // If searching, show all matches; otherwise cap to avoid huge initial list
    setFilteredResults(query.trim() ? items : items.slice(0, 100));
  }, [allItems, selectedClass, query]);

  // Close on outside click — only active while open
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const select = (item: DarkerDBItem) => {
    onChange({
      item_id: item.id,
      item_name: item.name,
      rarity: "Common",
      gear_score: item.gear_score,
    });
    setOpen(false);
    setQuery("");
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div ref={containerRef} className="relative">
      <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1">
        {slotLabel}
      </span>

      {/* Selected item display / trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) fetchSlotItems();
        }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-bg-primary border border-border-subtle rounded-sm text-xs transition-all hover:border-gold-primary/40 text-left"
      >
        {value ? (
          <span className="font-medium truncate text-text-primary">
            {value.item_name}
          </span>
        ) : (
          <span className="text-text-secondary/50">Empty</span>
        )}
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              onClick={clear}
              className="text-text-secondary/50 hover:text-accent-red transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-bg-secondary border border-border-subtle rounded-sm shadow-xl overflow-hidden">
          <div className="relative border-b border-border-subtle">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${slotLabel.toLowerCase()}...`}
              className="w-full pl-8 pr-3 py-2 bg-transparent text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
            />
          </div>
          <div className="max-h-72 overflow-y-auto">
            {fetching ? (
              <div className="px-3 py-4 text-center text-xs text-text-secondary/50">
                Loading items...
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-text-secondary/50">
                No items found
              </div>
            ) : (
              filteredResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-bg-tertiary text-left transition-colors"
                >
                  <span className="text-xs font-medium truncate text-text-primary">
                    {item.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
