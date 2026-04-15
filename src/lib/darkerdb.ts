// Client-side calls go through our Next.js API routes to avoid CORS.
// Server-side calls (route handlers) hit DarkerDB directly.
const API_BASE = "/api";

export interface DarkerDBCharacter {
  id: number;
  account_id: number;
  name: string;
  class: string;
  level: number;
  rank: string;
  rating: number | null;
  adventure_points: number | null;
  updated_at: string;
}

export interface LeaderboardPlayer {
  character: string;
  class: string;
  rank: string | null;
  karma: number;
  score: number;
  current_position: number;
  previous_position: number | null;
  level?: number;
}

export type LeaderboardCategory =
  | "EA7_HR"
  | "EA7_HOF_SHR_KO"
  | "EA7_HOF_SHR_TC"
  | "EA7_HOF_SHR_EA"
  | "EA7_HOF_SHR_B";

export const LEADERBOARD_CATEGORIES: { value: LeaderboardCategory; label: string }[] = [
  { value: "EA7_HR", label: "Ranked Score" },
  { value: "EA7_HOF_SHR_KO", label: "Kills" },
  { value: "EA7_HOF_SHR_TC", label: "Treasure Score" },
  { value: "EA7_HOF_SHR_EA", label: "Extractions" },
  { value: "EA7_HOF_SHR_B", label: "Bosses Slain" },
];

export interface DarkerDBPopulation {
  timestamp: string;
  num_online: number;
  num_lobby: number;
  num_dungeon: number;
}

export interface DarkerDBPagination {
  count: number;
  limit: number;
  page: number;
  num_pages: number;
  total: number;
  next: string | null;
}

export interface DarkerDBResponse<T> {
  version: string;
  status: string;
  code: number;
  query_time: number;
  query_date: string;
  stage: string;
  build: string;
  patch: number;
  meta: {
    method: string;
    request: string;
    query: Record<string, unknown>;
    params: unknown[];
  };
  pagination?: DarkerDBPagination;
  body: T;
}

export type CharacterClass =
  | "all"
  | "Fighter"
  | "Barbarian"
  | "Rogue"
  | "Ranger"
  | "Wizard"
  | "Cleric"
  | "Bard"
  | "Warlock"
  | "Druid";

export const CHARACTER_CLASSES: { value: CharacterClass; label: string }[] = [
  { value: "all", label: "All Classes" },
  { value: "Fighter", label: "Fighter" },
  { value: "Barbarian", label: "Barbarian" },
  { value: "Rogue", label: "Rogue" },
  { value: "Ranger", label: "Ranger" },
  { value: "Wizard", label: "Wizard" },
  { value: "Cleric", label: "Cleric" },
  { value: "Bard", label: "Bard" },
  { value: "Warlock", label: "Warlock" },
  { value: "Druid", label: "Druid" },
];

// Rank ordering from lowest (0) to highest (18)
const RANK_ORDER: Record<string, number> = {
  "Neophyte III": 0,
  "Neophyte II": 1,
  "Neophyte I": 2,
  "Apprentice III": 3,
  "Apprentice II": 4,
  "Apprentice I": 5,
  "Wanderer III": 6,
  "Wanderer II": 7,
  "Wanderer I": 8,
  "Pathfinder III": 9,
  "Pathfinder II": 10,
  "Pathfinder I": 11,
  "Voyager III": 12,
  "Voyager II": 13,
  "Voyager I": 14,
  "Exemplar III": 15,
  "Exemplar II": 16,
  "Exemplar I": 17,
  "Demigod": 18,
};

export function getRankValue(rank: string): number {
  return RANK_ORDER[rank] ?? -1;
}

// Wiki class portrait images
const CLASS_PORTRAITS: Record<string, string> = {
  Fighter: "https://darkanddarker.wiki.spellsandguns.com/images/f/f9/Fighters.png",
  Barbarian: "https://darkanddarker.wiki.spellsandguns.com/images/1/16/Barbarians.png",
  Rogue: "https://darkanddarker.wiki.spellsandguns.com/images/2/22/Rogues.png",
  Ranger: "https://darkanddarker.wiki.spellsandguns.com/images/1/19/Rangers.png",
  Wizard: "https://darkanddarker.wiki.spellsandguns.com/images/2/2a/Wizards.png",
  Cleric: "https://darkanddarker.wiki.spellsandguns.com/images/4/49/Clerics.png",
  Bard: "https://darkanddarker.wiki.spellsandguns.com/images/e/ee/Bards.png",
  Warlock: "https://darkanddarker.wiki.spellsandguns.com/images/1/1c/Warlocks.png",
  Druid: "https://darkanddarker.wiki.spellsandguns.com/images/9/91/Druids.png",
  Sorcerer: "https://darkanddarker.wiki.spellsandguns.com/images/c/ca/Sorcerers.png",
};

export function getClassPortrait(className: string): string {
  return CLASS_PORTRAITS[className] ?? CLASS_PORTRAITS["Fighter"];
}

export async function fetchCharacters(params: {
  limit?: number;
  page?: number;
  sort?: string;
  order?: string;
  class?: string;
  name?: string;
  ranked?: string;
}): Promise<DarkerDBResponse<DarkerDBCharacter[]>> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.order) searchParams.set("order", params.order);
  if (params.class && params.class !== "all") searchParams.set("class", params.class);
  if (params.name) searchParams.set("name", params.name);
  if (params.ranked) searchParams.set("ranked", params.ranked);

  const qs = searchParams.toString();
  const url = `${API_BASE}/characters${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`DarkerDB API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchCharacterById(
  id: number
): Promise<DarkerDBResponse<DarkerDBCharacter>> {
  const res = await fetch(`${API_BASE}/characters/${id}`);

  if (!res.ok) {
    throw new Error(`DarkerDB API error: ${res.status}`);
  }

  return res.json();
}

export async function fetchLeaderboard(params: {
  category: LeaderboardCategory;
  limit?: number;
  page?: number;
}): Promise<DarkerDBResponse<LeaderboardPlayer[]>> {
  const searchParams = new URLSearchParams();
  searchParams.set("category", params.category);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));

  const res = await fetch(`${API_BASE}/leaderboard?${searchParams.toString()}`);

  if (!res.ok) {
    throw new Error(`DarkerDB API error: ${res.status}`);
  }

  return res.json();
}

// --- Items ---

export interface DarkerDBItem {
  id: number;
  cursor: string;
  archetype: string;
  name: string;
  rarity: string;
  description: string;
  effect: string | null;
  type: string;
  armor_type: string | null;
  slot_type: string | null;
  hand_type: string | null;
  required_class: string | null;
  max_stack_size: number;
  inventory_width: number;
  inventory_height: number;
  vendor_price: number;
  gear_score: number;
  experience: number;
  adventure_points: number | null;
  [key: string]: unknown; // dynamic stat fields
}

export type ItemRarity = "Poor" | "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Unique" | "Artifact";

export const RARITY_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  Poor: { text: "text-text-secondary", border: "border-text-secondary/40", bg: "bg-text-secondary/10" },
  Common: { text: "text-gray-200", border: "border-gray-400/40", bg: "bg-gray-400/10" },
  Uncommon: { text: "text-green-400", border: "border-green-400/40", bg: "bg-green-400/10" },
  Rare: { text: "text-blue-400", border: "border-blue-400/40", bg: "bg-blue-400/10" },
  Epic: { text: "text-purple-400", border: "border-purple-400/40", bg: "bg-purple-400/10" },
  Legendary: { text: "text-orange-400", border: "border-orange-400/40", bg: "bg-orange-400/10" },
  Unique: { text: "text-gold-primary", border: "border-gold-primary/40", bg: "bg-gold-primary/10" },
  Artifact: { text: "text-red-400", border: "border-red-400/40", bg: "bg-red-400/10" },
};

export function getRarityStyle(rarity: string) {
  return RARITY_COLORS[rarity] ?? RARITY_COLORS["Common"];
}

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
};

/** Decodes required_class bitmask → list of class names, or "All" if unrestricted. */
export function getItemClasses(requiredClass: string | number | null | undefined): string[] | "All" {
  if (requiredClass == null) return "All";
  const mask = typeof requiredClass === "number" ? requiredClass : parseInt(String(requiredClass), 10);
  if (isNaN(mask) || mask === 0) return "All";
  const classes = Object.entries(CLASS_BITMASK)
    .filter(([, bit]) => (mask & bit) !== 0)
    .map(([name]) => name);
  return classes.length === Object.keys(CLASS_BITMASK).length ? "All" : classes;
}

export async function fetchItems(params: {
  limit?: number;
  page?: number;
  type?: string;
  rarity?: string;
  slot_type?: string;
  armor_type?: string;
  hand_type?: string;
  name?: string;
  fetchAll?: string;
}): Promise<DarkerDBResponse<DarkerDBItem[]>> {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.page) searchParams.set("page", String(params.page));
  if (params.type) searchParams.set("type", params.type);
  if (params.rarity) searchParams.set("rarity", params.rarity);
  if (params.slot_type) searchParams.set("slot_type", params.slot_type);
  if (params.armor_type) searchParams.set("armor_type", params.armor_type);
  if (params.hand_type) searchParams.set("hand_type", params.hand_type);
  if (params.name) searchParams.set("name", params.name);
  if (params.fetchAll) searchParams.set("fetchAll", params.fetchAll);

  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/items${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`DarkerDB API error: ${res.status}`);
  return res.json();
}

export async function fetchItemById(id: number): Promise<DarkerDBResponse<DarkerDBItem>> {
  const res = await fetch(`${API_BASE}/items/${id}`);
  if (!res.ok) throw new Error(`DarkerDB API error: ${res.status}`);
  return res.json();
}

// --- Market ---

export interface DarkerDBMarketListing {
  id: number;
  item_id: number;
  item: string;
  archetype: string;
  rarity: string;
  price: number;
  price_per_unit: number;
  quantity: number;
  created_at: string;
  expires_at: string;
  sold_at: string | null;
  has_sold: boolean;
  has_expired: boolean;
  socket_1: string | null;
  socket_2: string | null;
  socket_3: string | null;
  socket_4: string | null;
  socket_5: string | null;
  [key: string]: unknown;
}

export async function fetchMarket(params: {
  limit?: number;
  cursor?: string;
  archetype?: string;
  rarity?: string;
  has_sold?: string;
  price?: string;
  fetchAll?: string;
}): Promise<DarkerDBResponse<DarkerDBMarketListing[]>> {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.cursor) searchParams.set("cursor", params.cursor);
  if (params.archetype) searchParams.set("archetype", params.archetype);
  if (params.rarity) searchParams.set("rarity", params.rarity);
  if (params.has_sold) searchParams.set("has_sold", params.has_sold);
  if (params.price) searchParams.set("price", params.price);
  if (params.fetchAll) searchParams.set("fetchAll", params.fetchAll);

  const qs = searchParams.toString();
  const res = await fetch(`${API_BASE}/market${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`DarkerDB API error: ${res.status}`);
  return res.json();
}

export async function fetchPopulation(): Promise<
  DarkerDBResponse<DarkerDBPopulation>
> {
  const res = await fetch(`${API_BASE}/population`);

  if (!res.ok) {
    throw new Error(`DarkerDB API error: ${res.status}`);
  }

  return res.json();
}
