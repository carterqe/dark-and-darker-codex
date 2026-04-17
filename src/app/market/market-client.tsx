"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Store, Search, ChevronDown, Coins, Clock, TrendingDown, TrendingUp,
  BarChart3, Package,
} from "lucide-react";
import { DarkerDBMarketListing, fetchMarket, getRarityStyle } from "@/lib/darkerdb";
import { formatNumber, timeAgo } from "@/lib/utils";
import ShimmerText from "@/components/ui/ShimmerText";
import MedievalButton from "@/components/ui/MedievalButton";

const RARITIES = ["", "Poor", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Unique", "Artifact"];
const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "false", label: "Active" },
  { value: "true", label: "Sold" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

// Maps each slot dropdown value to keywords that actually appear in DarkerDB item/archetype names.
// Slot labels like "Chest" or "Legs" never appear in item names themselves — items are named
// "Gambeson", "Hauberk", "Leggings", "Hosen", etc.
const SLOT_SEARCH_TERMS: Record<string, string[]> = {
  Boots:    ["boots", "shoe", "sabaton"],
  Chest:    ["gambeson", "armor", "robe", "mail", "brigandine", "hauberk", "cuirass",
             "doublet", "surcoat", "regalia", "vestment", "cassock", "harness", "breastplate", "tunic"],
  Gloves:   ["gloves", "gauntlet", "mitten"],
  Helmet:   ["helm", "hood", "hat", "cap", "coif", "barbute", "armet", "kettle", "skull", "crown"],
  Legs:     ["leggings", "hosen", "pants", "breeches", "chaps", "tights", "kilt"],
  Cape:     ["cloak", "cape", "mantle"],
  Necklace: ["necklace", "pendant", "amulet", "collar", "talisman"],
  Ring:     ["ring", "band", "signet"],
  Sword:    ["sword", "rapier", "falchion", "saber"],
  Axe:      ["axe", "hatchet"],
  Mace:     ["mace", "flail", "morningstar", "club", "warhammer", "hammer"],
  Dagger:   ["dagger", "knife", "stiletto", "kris"],
  Staff:    ["staff", "scepter", "crystal ball", "spellbook"],
  Bow:      ["bow"],
  Crossbow: ["crossbow", "arbalest"],
  Shield:   ["shield", "buckler", "pavise"],
  Potion:   ["potion", "flask", "elixir", "tonic", "draught"],
  Lantern:  ["lantern"],
  Torch:    ["torch"],
};

const ALL_MARKET_STATS = [
  "armor_rating", "magic_resistance", "strength", "dexterity", "agility", "vigor",
  "knowledge", "will", "max_health", "move_speed", "action_speed",
  "weapon_damage", "additional_weapon_damage", "physical_damage_bonus",
  "magical_damage", "armor_penetration", "magic_penetration",
  "physical_healing", "magical_healing", "physical_power", "magical_power",
  "luck", "resourcefulness", "persuasiveness", "cooldown_reduction_bonus",
  "buff_duration_bonus", "debuff_duration_bonus", "spell_casting_speed",
  "regular_interaction_speed", "magical_interaction_speed",
];

function formatStatLabel(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const pillClass = (active: boolean) =>
  `px-3 py-1.5 text-xs font-medium rounded-sm cursor-pointer transition-all duration-200 whitespace-nowrap ${
    active
      ? "text-gold-light bg-bg-tertiary border border-gold-primary/40"
      : "text-text-secondary border border-border-subtle hover:text-gold-primary hover:border-gold-dark"
  }`;
const selectClass =
  "bg-bg-secondary border border-border-subtle rounded-sm px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-gold-primary/50 transition-all cursor-pointer appearance-none pr-7";
const inputClass =
  "w-full bg-bg-secondary border border-border-subtle rounded-sm px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all";

function extractStats(listing: DarkerDBMarketListing): { name: string; value: string }[] {
  const stats: { name: string; value: string }[] = [];
  for (const [key, value] of Object.entries(listing)) {
    if ((key.startsWith("primary_") || key.startsWith("secondary_")) && value != null && value !== 0) {
      if (key.startsWith("primary_") || key.startsWith("secondary_")) {
        const name = key.replace(/^(primary_|secondary_)/, "").replace(/_/g, " ");
        stats.push({ name, value: String(value) });
      }
    }
  }
  return stats;
}

export default function MarketClient() {
  const [listings, setListings] = useState<DarkerDBMarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("");
  const [soldFilter, setSoldFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [stats, setStats] = useState<string[]>([]);
  const [slot, setSlot] = useState("");

  // Price summary for searched item
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const hasActiveFilter = !!(search.trim() || rarity || soldFilter || minPrice || maxPrice || slot || stats.length > 0);

  const load = (append: boolean = false, cursorVal?: string) => {
    if (!append) { setLoading(true); setError(false); }
    else setLoadingMore(true);

    const params: Record<string, string | number> = {};

    if (hasActiveFilter) {
      params.fetchAll = "true";
    } else {
      params.limit = 50;
      if (cursorVal) params.cursor = cursorVal;
    }

    // Only send archetype for text search — all other filters applied client-side
    // to avoid broken/empty results from uncertain DarkerDB filter param formats
    if (search.trim()) {
      params.archetype = search.trim();
    }

    fetchMarket(params)
      .then((res) => {
        const items = res.body || [];
        if (append) {
          setListings((prev) => [...prev, ...items]);
        } else {
          setListings(items);
        }
        if (!hasActiveFilter && items.length > 0 && res.pagination?.next) {
          const u = new URL(res.pagination.next);
          setCursor(u.searchParams.get("cursor") || undefined);
          setHasMore(true);
        } else if (!hasActiveFilter && items.length >= 50) {
          setCursor(String((items[items.length - 1] as Record<string, unknown>)?.cursor || ""));
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      })
      .catch(() => setError(true))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    setCursor(undefined);
    setExpandedRow(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(), search || minPrice || maxPrice ? 500 : 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, rarity, soldFilter, minPrice, maxPrice, slot, stats]);

  // Compute available stats from loaded listings
  const availableStats = useMemo(() => {
    const found = new Set<string>();
    for (const listing of listings) {
      for (const s of ALL_MARKET_STATS) {
        if (found.has(s)) continue;
        const pKey = `primary_${s}`;
        const sKey = `secondary_${s}`;
        if ((listing[pKey] != null && listing[pKey] !== 0) ||
            (listing[sKey] != null && listing[sKey] !== 0)) {
          found.add(s);
        }
      }
    }
    return ALL_MARKET_STATS.filter((s) => found.has(s));
  }, [listings]);

  // Reset stats if no longer available — use ref to avoid triggering the load useEffect
  const statsRef = useRef(stats);
  statsRef.current = stats;
  useEffect(() => {
    if (statsRef.current.length > 0) {
      const valid = statsRef.current.filter((s) => availableStats.includes(s));
      if (valid.length !== statsRef.current.length) setStats(valid);
    }
  }, [availableStats]); // intentionally excludes stats to avoid double-load cascade

  // All filtering is done client-side for reliability
  const sortedListings = useMemo(() => {
    let filtered = listings;

    // Rarity filter
    if (rarity) {
      filtered = filtered.filter((l) => l.rarity === rarity);
    }

    // Status filter
    if (soldFilter === "true") {
      filtered = filtered.filter((l) => l.has_sold);
    } else if (soldFilter === "false") {
      filtered = filtered.filter((l) => !l.has_sold && !l.has_expired);
    }

    // Price range filter
    const minP = minPrice ? parseFloat(minPrice) : null;
    const maxP = maxPrice ? parseFloat(maxPrice) : null;
    if (minP !== null || maxP !== null) {
      filtered = filtered.filter((l) => {
        if (minP !== null && l.price < minP) return false;
        if (maxP !== null && l.price > maxP) return false;
        return true;
      });
    }

    // Slot filter: use keyword map to match slot categories to actual item/archetype names
    // e.g. "Chest" → ["gambeson", "armor", "robe", ...] since items are never named "Chest"
    if (slot) {
      const terms = SLOT_SEARCH_TERMS[slot] ?? [slot.toLowerCase()];
      filtered = filtered.filter((l) => {
        const name = (l.item || l.archetype || "").toLowerCase();
        const archetype = (l.archetype || "").toLowerCase();
        return terms.some((term) => name.includes(term) || archetype.includes(term));
      });
    }

    // Multi-stat filter: listing must have ALL selected stats
    if (stats.length > 0) {
      filtered = filtered.filter((l) =>
        stats.every((s) => {
          const pVal = l[`primary_${s}`];
          const sVal = l[`secondary_${s}`];
          return (pVal != null && pVal !== 0) || (sVal != null && sVal !== 0);
        })
      );
    }

    const copy = [...filtered];
    if (sortBy === "price_asc") copy.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") copy.sort((a, b) => b.price - a.price);
    return copy;
  }, [listings, sortBy, stats, slot, rarity, soldFilter, minPrice, maxPrice]);

  // Price analytics when searching a specific item
  const priceAnalytics = useMemo(() => {
    if (!search.trim() || listings.length === 0) return null;
    const active = listings.filter((l) => !l.has_sold && !l.has_expired);
    const sold = listings.filter((l) => l.has_sold);
    if (active.length === 0 && sold.length === 0) return null;

    const activePrices = active.map((l) => l.price);
    const soldPrices = sold.map((l) => l.price);

    return {
      activeCount: active.length,
      soldCount: sold.length,
      lowestActive: activePrices.length ? Math.min(...activePrices) : null,
      highestActive: activePrices.length ? Math.max(...activePrices) : null,
      avgActive: activePrices.length ? Math.round(activePrices.reduce((a, b) => a + b, 0) / activePrices.length) : null,
      avgSold: soldPrices.length ? Math.round(soldPrices.reduce((a, b) => a + b, 0) / soldPrices.length) : null,
      lastSoldPrice: sold.length ? sold[0].price : null,
    };
  }, [listings, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10 animate-fade-in-up">
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          The Market
        </ShimmerText>
        <p className="text-text-secondary">
          Real-time marketplace &mdash; monitor prices, find deals, track sales
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Rarity */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Rarity</span>
          <div className="flex flex-wrap gap-1.5">
            {RARITIES.map((r) => (
              <button key={r || "all-r"} onClick={() => setRarity(r)} className={pillClass(rarity === r)}>
                {r || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Status</span>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((s) => (
              <button key={s.value || "all-s"} onClick={() => setSoldFilter(s.value)} className={pillClass(soldFilter === s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price range + Sort + Search row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            {/* Price range */}
            <div className="w-full sm:w-auto">
              <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Price Range</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className={`${inputClass} w-full sm:w-20`}
                />
                <span className="text-text-secondary text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={`${inputClass} w-full sm:w-20`}
                />
              </div>
            </div>

            {/* Gear Slot */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Gear Slot</span>
              <div className="relative">
                <select value={slot} onChange={(e) => setSlot(e.target.value)} className={selectClass}>
                  <option value="">All Slots</option>
                  <optgroup label="Armor">
                    <option value="Boots">Boots</option>
                    <option value="Chest">Chest</option>
                    <option value="Gloves">Gloves</option>
                    <option value="Helmet">Helmet</option>
                    <option value="Legs">Legs</option>
                    <option value="Cape">Cape</option>
                  </optgroup>
                  <optgroup label="Accessories">
                    <option value="Necklace">Necklace</option>
                    <option value="Ring">Ring</option>
                  </optgroup>
                  <optgroup label="Weapons">
                    <option value="Sword">Sword</option>
                    <option value="Axe">Axe</option>
                    <option value="Mace">Mace</option>
                    <option value="Dagger">Dagger</option>
                    <option value="Staff">Staff</option>
                    <option value="Bow">Bow</option>
                    <option value="Crossbow">Crossbow</option>
                    <option value="Shield">Shield</option>
                  </optgroup>
                  <optgroup label="Utility">
                    <option value="Potion">Potion</option>
                    <option value="Lantern">Lantern</option>
                    <option value="Torch">Torch</option>
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Stat Bonus (multi-select) */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
                Stat Bonus {stats.length > 0 && `(${stats.length})`}
              </span>
              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !stats.includes(val)) {
                      setStats([...stats, val]);
                    }
                  }}
                  className={selectClass}
                >
                  <option value="">{stats.length > 0 ? "Add stat..." : "Any Stat"}</option>
                  {availableStats
                    .filter((s) => !stats.includes(s))
                    .map((s) => (
                      <option key={s} value={s}>{formatStatLabel(s)}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
              </div>
              {stats.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {stats.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStats(stats.filter((x) => x !== s))}
                      className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-gold-primary/15 text-gold-light border border-gold-primary/30 rounded-sm hover:bg-accent-red/20 hover:text-accent-red hover:border-accent-red/30 transition-all cursor-pointer"
                    >
                      {formatStatLabel(s)} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div>
              <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">Sort By</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={selectClass}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
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
              placeholder="Search item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Price Analytics Card */}
      {priceAnalytics && (
        <div className="bg-bg-secondary border border-gold-primary/20 rounded-sm p-5 mb-6 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-gold-primary" />
            <h3 className="font-cinzel font-bold text-sm text-gold-primary">
              Price Summary — {search}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {priceAnalytics.activeCount > 0 && (
              <>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">Active Listings</p>
                  <p className="text-lg font-cinzel font-bold text-gold-primary">{priceAnalytics.activeCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-accent-emerald" /> Lowest
                  </p>
                  <p className="text-lg font-cinzel font-bold text-accent-emerald">{formatNumber(priceAnalytics.lowestActive!)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-accent-red" /> Highest
                  </p>
                  <p className="text-lg font-cinzel font-bold text-accent-red">{formatNumber(priceAnalytics.highestActive!)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">Avg Active Price</p>
                  <p className="text-lg font-cinzel font-bold text-gold-light">{formatNumber(priceAnalytics.avgActive!)}</p>
                </div>
              </>
            )}
            {priceAnalytics.soldCount > 0 && (
              <>
                <div>
                  <p className="text-[10px] text-text-secondary uppercase tracking-wider">Recent Sales</p>
                  <p className="text-lg font-cinzel font-bold text-text-primary">{priceAnalytics.soldCount}</p>
                </div>
                {priceAnalytics.avgSold != null && (
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">Avg Sold Price</p>
                    <p className="text-lg font-cinzel font-bold text-text-primary">{formatNumber(priceAnalytics.avgSold)}</p>
                  </div>
                )}
                {priceAnalytics.lastSoldPrice != null && (
                  <div>
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">Last Sold</p>
                    <p className="text-lg font-cinzel font-bold text-text-primary">{formatNumber(priceAnalytics.lastSoldPrice)}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-bg-secondary/50 rounded-sm animate-pulse" style={{ animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <Store className="w-12 h-12 text-accent-red/60 mx-auto mb-4" />
          <p className="font-cinzel text-lg text-text-secondary">Failed to load marketplace data</p>
          <p className="text-sm text-text-secondary/60 mt-2">Please try again later.</p>
        </div>
      ) : sortedListings.length === 0 ? (
        <div className="text-center py-20">
          <Store className="w-12 h-12 text-gold-dark mx-auto mb-4" />
          <p className="font-cinzel text-lg text-text-secondary">The marketplace is empty...</p>
          <p className="text-sm text-text-secondary/60 mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-text-secondary mb-3">
            {sortedListings.length} listing{sortedListings.length !== 1 ? "s" : ""}
            {stats.length > 0 && (
              <span> with <span className="text-gold-primary font-medium">{stats.map(formatStatLabel).join(" + ")}</span></span>
            )}
            {slot && (
              <span> in <span className="text-gold-primary font-medium">{slot}</span></span>
            )}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-dark/30">
                  <th className="py-3 px-4 text-left text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider">Item</th>
                  <th className="py-3 px-4 text-right text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider">Price</th>
                  <th className="py-3 px-4 text-right text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider hidden md:table-cell">Qty</th>
                  <th className="py-3 px-4 text-left text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider hidden lg:table-cell">Stats</th>
                  <th className="py-3 px-4 text-right text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider hidden md:table-cell">
                    <Clock className="w-3 h-3 inline" /> Time
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-cinzel font-bold text-gold-dark uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedListings.map((listing, i) => {
                  const rs = getRarityStyle(listing.rarity);
                  const stats = extractStats(listing);
                  const isExpanded = expandedRow === listing.id;
                  const sockets = [listing.socket_1, listing.socket_2, listing.socket_3, listing.socket_4, listing.socket_5]
                    .filter(Boolean) as string[];

                  return (
                    <tr
                      key={`${listing.id}-${i}`}
                      className="border-b border-border-subtle hover:bg-bg-tertiary/50 transition-all cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(i * 15, 300)}ms` }}
                      onClick={() => setExpandedRow(isExpanded ? null : listing.id)}
                    >
                      {/* Item */}
                      <td className="py-3 px-4">
                        <div>
                          <span className={`font-medium text-sm ${rs.text}`}>
                            {listing.item || listing.archetype}
                          </span>
                          <span className={`block text-[10px] uppercase tracking-wider ${rs.text} opacity-60`}>
                            {listing.rarity}
                            {sockets.length > 0 && (
                              <span className="ml-1.5 text-blue-400">
                                {sockets.length} gem{sockets.length !== 1 ? "s" : ""}
                              </span>
                            )}
                          </span>
                          {/* Expanded stats */}
                          {isExpanded && stats.length > 0 && (
                            <div className="mt-2 space-y-0.5 animate-fade-in-up">
                              {stats.map((s) => (
                                <div key={s.name} className="flex justify-between text-[10px] py-0.5 px-2 bg-bg-primary/30 rounded-sm">
                                  <span className="text-text-secondary capitalize">{s.name}</span>
                                  <span className={`font-bold ${Number(s.value) >= 0 ? "text-accent-emerald" : "text-accent-red"}`}>
                                    {Number(s.value) > 0 ? "+" : ""}{s.value}
                                  </span>
                                </div>
                              ))}
                              {sockets.length > 0 && (
                                <div className="flex gap-1 pt-1">
                                  {sockets.map((s, j) => (
                                    <span key={j} className="text-[9px] px-1.5 py-0.5 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-sm">
                                      {String(s).replace(/_\d+$/, "").replace(/([A-Z])/g, " $1").trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-right align-top">
                        <span className="font-cinzel font-bold text-gold-primary text-sm flex items-center justify-end gap-1">
                          <Coins className="w-3 h-3 text-gold-dark" />
                          {formatNumber(listing.price)}
                        </span>
                        {listing.quantity > 1 && (
                          <span className="block text-[10px] text-text-secondary">
                            {formatNumber(Math.round(listing.price_per_unit))} ea
                          </span>
                        )}
                      </td>

                      {/* Qty */}
                      <td className="py-3 px-4 text-right text-sm text-text-secondary hidden md:table-cell align-top">
                        <span className="flex items-center justify-end gap-1">
                          <Package className="w-3 h-3" />
                          {listing.quantity}
                        </span>
                      </td>

                      {/* Stats preview */}
                      <td className="py-3 px-4 text-left text-xs text-text-secondary hidden lg:table-cell align-top">
                        {stats.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {stats.slice(0, 3).map((s) => (
                              <span
                                key={s.name}
                                className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                                  Number(s.value) >= 0
                                    ? "bg-accent-emerald/10 text-accent-emerald"
                                    : "bg-accent-red/10 text-accent-red"
                                }`}
                              >
                                {s.name.slice(0, 12)} {Number(s.value) > 0 ? "+" : ""}{s.value}
                              </span>
                            ))}
                            {stats.length > 3 && (
                              <span className="text-[10px] text-text-secondary/40">+{stats.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-secondary/30">&mdash;</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-4 text-right text-xs text-text-secondary hidden md:table-cell align-top">
                        {listing.has_sold && listing.sold_at
                          ? <span className="text-accent-emerald">Sold {timeAgo(listing.sold_at)}</span>
                          : timeAgo(listing.created_at)
                        }
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right align-top">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                          listing.has_sold
                            ? "bg-accent-emerald/20 text-accent-emerald"
                            : listing.has_expired
                              ? "bg-accent-red/20 text-accent-red"
                              : "bg-gold-primary/20 text-gold-primary"
                        }`}>
                          {listing.has_sold ? "SOLD" : listing.has_expired ? "EXPIRED" : "ACTIVE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <MedievalButton variant="secondary" onClick={() => load(true, cursor)} loading={loadingMore}>
                Load More Listings
              </MedievalButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
