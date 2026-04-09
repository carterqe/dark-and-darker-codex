"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { DarkerDBItem, DarkerDBPagination, fetchItems } from "@/lib/darkerdb";
import ShimmerText from "@/components/ui/ShimmerText";
import ItemCard from "@/components/armory/ItemCard";
import ItemModal from "@/components/armory/ItemModal";
import ItemFilters from "@/components/armory/ItemFilters";
import MedievalButton from "@/components/ui/MedievalButton";

// All possible stats we care about
const ALL_STATS = [
  "strength", "dexterity", "agility", "vigor", "knowledge", "will",
  "max_health", "move_speed", "action_speed", "armor_rating", "magic_resistance",
  "physical_damage", "magical_damage", "weapon_damage", "armor_penetration",
  "magic_penetration", "physical_healing", "magical_healing", "luck",
  "resourcefulness", "persuasiveness",
];

export default function ArmoryClient() {
  const [items, setItems] = useState<DarkerDBItem[]>([]);
  const [pagination, setPagination] = useState<DarkerDBPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [rarity, setRarity] = useState("");
  const [slot, setSlot] = useState("");
  const [handType, setHandType] = useState("");
  const [stat, setStat] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<DarkerDBItem | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hasActiveFilter = !!(type || rarity || slot || handType || search.trim());

  const loadItems = (pageNum: number, append: boolean = false) => {
    if (!append) setLoading(true);

    const params: Record<string, string | number> = {};

    if (hasActiveFilter) {
      params.fetchAll = "true";
    } else {
      params.limit = 24;
      params.page = pageNum;
    }

    if (type) params.type = type;
    if (rarity) params.rarity = rarity;
    if (slot) params.slot_type = slot;
    if (handType) params.hand_type = handType;
    if (search.trim()) params.name = search.trim();

    fetchItems(params)
      .then((res) => {
        if (append) {
          setItems((prev) => [...prev, ...res.body]);
        } else {
          setItems(res.body || []);
        }
        if (res.pagination) setPagination(res.pagination);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  // Reload on API-side filter change (not stat, which is client-side)
  useEffect(() => {
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadItems(1), search ? 400 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [type, rarity, slot, handType, search]);

  // Compute available stats from loaded items (only stats with non-null/non-zero primary_min_ values)
  const availableStats = useMemo(() => {
    const found = new Set<string>();
    for (const item of items) {
      for (const s of ALL_STATS) {
        if (found.has(s)) continue;
        const val = item[`primary_min_${s}`];
        if (val != null && val !== 0) {
          found.add(s);
        }
      }
    }
    return ALL_STATS.filter((s) => found.has(s));
  }, [items]);

  // Reset stat if it's no longer available
  useEffect(() => {
    if (stat && !availableStats.includes(stat)) {
      setStat("");
    }
  }, [availableStats, stat]);

  // Client-side stat filter
  const filteredItems = useMemo(() => {
    if (!stat) return items;
    return items.filter((item) => {
      const val = item[`primary_min_${stat}`];
      return val != null && val !== 0;
    });
  }, [items, stat]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadItems(next, true);
  };

  const hasMore = pagination
    ? page < pagination.num_pages && pagination.total > items.length
    : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          The Armory
        </ShimmerText>
        <p className="text-text-secondary">
          Browse every weapon, armor, and artifact in the realm
        </p>
        {pagination && (
          <p className="text-xs text-text-secondary/60 mt-2">
            {pagination.total.toLocaleString()} items catalogued
          </p>
        )}
      </motion.div>

      <ItemFilters
        type={type}
        rarity={rarity}
        slot={slot}
        handType={handType}
        stat={stat}
        search={search}
        availableStats={availableStats}
        onTypeChange={setType}
        onRarityChange={setRarity}
        onSlotChange={setSlot}
        onHandTypeChange={setHandType}
        onStatChange={setStat}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-36 bg-bg-secondary/50 rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <Swords className="w-12 h-12 text-gold-dark mx-auto mb-4" />
          <p className="font-cinzel text-lg text-text-secondary">
            No items found in the armory...
          </p>
          {stat && (
            <p className="text-sm text-text-secondary/60 mt-2">
              No items with that stat bonus match your filters.
            </p>
          )}
        </div>
      ) : (
        <>
          {stat && (
            <p className="text-xs text-text-secondary mb-4">
              Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} with{" "}
              <span className="text-gold-primary font-medium">{stat.replace(/_/g, " ")}</span> bonus
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} onClick={() => setSelectedItem(item)} />
            ))}
          </div>

          {hasMore && !hasActiveFilter && (
            <div className="flex justify-center mt-8">
              <MedievalButton variant="secondary" onClick={loadMore}>
                Load More Items
              </MedievalButton>
            </div>
          )}
        </>
      )}
      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
