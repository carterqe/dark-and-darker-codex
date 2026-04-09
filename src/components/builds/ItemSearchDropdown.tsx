"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { getRarityStyle, type DarkerDBItem } from "@/lib/darkerdb";
import type { BuildGearItem } from "@/lib/build-types";

interface ItemSearchDropdownProps {
  slotLabel: string;
  slotType: string;
  value: BuildGearItem | null;
  onChange: (item: BuildGearItem | null) => void;
}

export default function ItemSearchDropdown({
  slotLabel,
  slotType,
  value,
  onChange,
}: ItemSearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DarkerDBItem[]>([]);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(
    async (q: string) => {
      setFetching(true);
      const params = new URLSearchParams({ slot_type: slotType, limit: "10" });
      if (q) params.set("name", q);
      const res = await fetch(`/api/items?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.body ?? []);
      }
      setFetching(false);
    },
    [slotType]
  );

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), query ? 300 : 0);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open, search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (item: DarkerDBItem) => {
    onChange({
      item_id: item.id,
      item_name: item.name,
      rarity: item.rarity,
      gear_score: item.gear_score,
    });
    setOpen(false);
    setQuery("");
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const rs = value ? getRarityStyle(value.rarity) : null;

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
          if (!open) search(query);
        }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-bg-primary border border-border-subtle rounded-sm text-xs transition-all hover:border-gold-primary/40 text-left"
      >
        {value ? (
          <span className={`font-medium truncate ${rs?.text}`}>
            {value.item_name}
            <span className="ml-1.5 opacity-50 font-normal">{value.rarity}</span>
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
          <div className="max-h-48 overflow-y-auto">
            {fetching ? (
              <div className="px-3 py-4 text-center text-xs text-text-secondary/50">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-text-secondary/50">
                No items found
              </div>
            ) : (
              results.map((item) => {
                const style = getRarityStyle(item.rarity);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-bg-tertiary text-left transition-colors"
                  >
                    <span className={`text-xs font-medium truncate ${style.text}`}>
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[10px] ${style.text} opacity-60`}>
                        {item.rarity}
                      </span>
                      {item.gear_score > 0 && (
                        <span className="text-[10px] text-text-secondary/50">
                          GS {item.gear_score}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
