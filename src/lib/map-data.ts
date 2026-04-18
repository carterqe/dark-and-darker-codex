export type FeatureType =
  | "extract"
  | "portal_red"
  | "shrine_health"
  | "shrine_protection"
  | "shrine_power"
  | "fountain_speed"
  | "altar"
  | "boss"
  | "campfire"
  | "treasure"
  | "monster_spawn";

export interface MapFeature {
  id: string;
  type: FeatureType;
  label: string;
  /** 0–100 percent from left edge of map canvas */
  x: number;
  /** 0–100 percent from top edge of map canvas */
  y: number;
  description?: string;
}

export interface DungeonMap {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  theme: "cave" | "crypt" | "ice" | "sea" | "inferno" | "ruins" | "abyss" | "firedeep";
  /** Logical canvas size in px — should match imageUrl natural dimensions when provided */
  width: number;
  height: number;
  /** Path to a static map image in /public, e.g. "/maps/goblin-cave.png". Falls back to CSS grid. */
  imageUrl?: string;
  /** If true, the map viewer shows a "Coming soon" placeholder instead of the canvas. */
  comingSoon?: boolean;
  bgColor: string;
  gridColor: string;
  accentColor: string;
  features: MapFeature[];
}

export interface FeatureMeta {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const FEATURE_META: Record<FeatureType, FeatureMeta> = {
  extract:          { label: "Extract Portal",       color: "#3dba76", bgColor: "rgba(20,70,45,0.92)",    borderColor: "rgba(61,186,118,0.9)"   },
  portal_red:       { label: "Red Portal",           color: "#ff5a4a", bgColor: "rgba(100,20,15,0.92)",   borderColor: "rgba(255,90,74,0.9)"    },
  shrine_health:    { label: "Shrine of Health",     color: "#4ade80", bgColor: "rgba(15,60,30,0.92)",    borderColor: "rgba(74,222,128,0.9)"   },
  shrine_protection:{ label: "Shrine of Protection", color: "#60a5fa", bgColor: "rgba(15,35,75,0.92)",    borderColor: "rgba(96,165,250,0.9)"   },
  shrine_power:     { label: "Shrine of Power",      color: "#fbbf24", bgColor: "rgba(70,45,5,0.92)",     borderColor: "rgba(251,191,36,0.9)"   },
  fountain_speed:   { label: "Fountain of Speed",    color: "#c4b5fd", bgColor: "rgba(45,25,80,0.92)",    borderColor: "rgba(196,181,253,0.9)"  },
  altar:            { label: "Altar of Sacrifice",   color: "#fb7185", bgColor: "rgba(80,10,25,0.92)",    borderColor: "rgba(251,113,133,0.9)"  },
  boss:             { label: "Boss",                 color: "#ff4444", bgColor: "rgba(90,8,8,0.95)",      borderColor: "rgba(255,68,68,0.95)"   },
  campfire:         { label: "Campfire",             color: "#fb923c", bgColor: "rgba(70,30,5,0.92)",     borderColor: "rgba(251,146,60,0.9)"   },
  treasure:         { label: "Treasure Room",        color: "#fde047", bgColor: "rgba(70,55,5,0.92)",     borderColor: "rgba(253,224,71,0.9)"   },
  monster_spawn:    { label: "Monster Spawn",         color: "#f472b6", bgColor: "rgba(80,15,55,0.92)",    borderColor: "rgba(244,114,182,0.95)" },
};

// Ordered list of all feature types (used for toggle panel). Campfires are
// excluded because they are player-placed Campfire Kit items, not fixed world
// objects — the wiki documents no static campfire spawn locations per map.
export const FEATURE_TYPES: FeatureType[] = [
  "extract",
  "portal_red",
  "shrine_health",
  "shrine_protection",
  "shrine_power",
  "fountain_speed",
  "altar",
  "boss",
  "treasure",
];

export const MAPS: DungeonMap[] = [
  // ─── RUINS OF FORGOTTEN CASTLE ─────────────────────────────────────────────
  {
    id: "ruins",
    name: "Ruins of Forgotten Castle",
    subtitle: "The First Floor",
    description:
      "The crumbling surface ruins of an ancient castle. Skeletons, wraiths, and ancient horrors roam the overgrown halls. Connects downward to the Crypts.",
    theme: "ruins",
    width: 1634,
    height: 1634,
    imageUrl: "/maps/ruins.webp",
    bgColor: "#0c0b09",
    gridColor: "rgba(100,85,60,0.11)",
    accentColor: "#a89060",
    features: [
      { id: "ru_ex1", type: "extract", label: "Extract Portal", x: 74.9, y: 10.4 },
      { id: "ru_ex2", type: "extract", label: "Extract Portal", x: 23.9, y: 11.2 },
      { id: "ru_ex3", type: "extract", label: "Extract Portal", x: 50.0, y: 11.6 },
      { id: "ru_ex4", type: "extract", label: "Extract Portal", x: 85.4, y: 20.8 },
      { id: "ru_ex5", type: "extract", label: "Extract Portal", x: 66.5, y: 33.9 },
      { id: "ru_ex6", type: "extract", label: "Extract Portal", x: 12.5, y: 51.1 },
      { id: "ru_ex7", type: "extract", label: "Extract Portal", x: 50.0, y: 52.3 },
      { id: "ru_ex8", type: "extract", label: "Extract Portal", x: 87.2, y: 57.1 },
      { id: "ru_ex9", type: "extract", label: "Extract Portal", x: 66.0, y: 62.6 },
      { id: "ru_ex10", type: "extract", label: "Extract Portal", x: 89.3, y: 77.2 },
      { id: "ru_ex11", type: "extract", label: "Extract Portal", x: 12.9, y: 87.0 },
      { id: "ru_ex12", type: "extract", label: "Extract Portal", x: 50.0, y: 98.0 },
      { id: "ru_rp1", type: "portal_red", label: "Down Portal", x: 31.2, y: 38.3 },
      { id: "ru_rp2", type: "portal_red", label: "Down Portal", x: 59.5, y: 40.3 },
      { id: "ru_rp3", type: "portal_red", label: "Down Portal", x: 37.3, y: 48.2 },
      { id: "ru_rp4", type: "portal_red", label: "Down Portal", x: 70.8, y: 67.3 },
      { id: "ru_shh1", type: "shrine_health", label: "Shrine of Health", x: 34.0, y: 16.3 },
      { id: "ru_shh2", type: "shrine_health", label: "Shrine of Health", x: 43.6, y: 43.6 },
      { id: "ru_shh3", type: "shrine_health", label: "Shrine of Health", x: 33.3, y: 77.0 },
      { id: "ru_shprot1", type: "shrine_protection", label: "Shrine of Protection", x: 24.9, y: 18.3 },
      { id: "ru_shprot2", type: "shrine_protection", label: "Shrine of Protection", x: 27.5, y: 24.3 },
      { id: "ru_shprot3", type: "shrine_protection", label: "Shrine of Protection", x: 40.6, y: 27.2 },
      { id: "ru_shprot4", type: "shrine_protection", label: "Shrine of Protection", x: 67.3, y: 27.2 },
      { id: "ru_shprot5", type: "shrine_protection", label: "Shrine of Protection", x: 34.0, y: 43.2 },
      { id: "ru_shprot6", type: "shrine_protection", label: "Shrine of Protection", x: 71.7, y: 62.8 },
      { id: "ru_shprot7", type: "shrine_protection", label: "Shrine of Protection", x: 27.3, y: 69.0 },
      { id: "ru_shpow1", type: "shrine_power", label: "Shrine of Power", x: 81.7, y: 51.9 },
      { id: "ru_sp1", type: "fountain_speed", label: "Fountain of Speed", x: 51.0, y: 56.9 },
      { id: "ru_alt1", type: "altar", label: "Altar of Sacrifice", x: 34.0, y: 23.6, description: "One-time resurrection shrine" },
      { id: "ru_alt2", type: "altar", label: "Altar of Sacrifice", x:  9.7, y: 32.0, description: "One-time resurrection shrine" },
      { id: "ru_alt3", type: "altar", label: "Altar of Sacrifice", x: 72.6, y: 34.0, description: "One-time resurrection shrine" },
      { id: "ru_alt4", type: "altar", label: "Altar of Sacrifice", x: 53.7, y: 62.2, description: "One-time resurrection shrine" },
      { id: "ru_alt5", type: "altar", label: "Altar of Sacrifice", x: 34.4, y: 71.3, description: "One-time resurrection shrine" },
      { id: "ru_alt6", type: "altar", label: "Altar of Sacrifice", x: 30.3, y: 72.1, description: "One-time resurrection shrine" },
      { id: "ru_boss1", type: "boss", label: "Spectral Knight",   x: 50.0, y: 33.1, description: "Boss: Spectral Knight" },
      { id: "ru_boss2", type: "boss", label: "Banshee",           x: 50.0, y: 66.0, description: "Boss: Banshee" },
      { id: "ru_boss3", type: "boss", label: "Giant Worm",        x: 29.2, y: 81.5, description: "Subboss: Giant Worm" },
      { id: "ru_boss4", type: "boss", label: "Golem",             x: 30.6, y: 67.9, description: "Subboss: Golem" },
      { id: "ru_boss5", type: "boss", label: "Cockatrice",        x: 52.3, y: 28.5, description: "Subboss: Cockatrice" },
      { id: "ru_boss6", type: "boss", label: "Skeleton Champion", x: 83.7, y: 84.5, description: "Subboss: Skeleton Champion" },
      { id: "ru_boss7", type: "boss", label: "Wraith",            x: 47.4, y: 30.9, description: "Subboss: Wraith" },
    ],
  },

  // ─── CRYPTS ────────────────────────────────────────────────────────────────
  {
    id: "crypts",
    name: "Crypts",
    subtitle: "The Second Floor",
    description:
      "The haunted underground crypts below the Ruins. Packed with undead and demonic forces. Bosses include the Skeleton Warlord and the Lich. Connects to the Inferno.",
    theme: "crypt",
    width: 1634,
    height: 1634,
    imageUrl: "/maps/howling-crypts.webp",
    bgColor: "#0a090f",
    gridColor: "rgba(80,70,110,0.11)",
    accentColor: "#8a8693",
    features: [
      { id: "cr_ex1", type: "extract", label: "Extract Portal", x: 17.3, y: 21.1 },
      { id: "cr_ex2", type: "extract", label: "Extract Portal", x: 79.4, y: 22.2 },
      { id: "cr_ex3", type: "extract", label: "Extract Portal", x: 57.7, y: 25.3 },
      { id: "cr_ex4", type: "extract", label: "Extract Portal", x: 75.6, y: 50.0 },
      { id: "cr_ex5", type: "extract", label: "Extract Portal", x: 40.1, y: 72.1 },
      { id: "cr_ex6", type: "extract", label: "Extract Portal", x: 58.7, y: 77.7 },
      { id: "cr_ex7", type: "extract", label: "Extract Portal", x: 86.0, y: 80.4 },
      { id: "cr_ex8", type: "extract", label: "Extract Portal", x: 18.3, y: 88.4 },
      { id: "cr_rp1", type: "portal_red", label: "Down Portal", x: 36.5, y: 41.0 },
      { id: "cr_rp2", type: "portal_red", label: "Down Portal", x: 63.7, y: 44.0 },
      { id: "cr_rp3", type: "portal_red", label: "Down Portal", x: 44.0, y: 55.9 },
      { id: "cr_rp4", type: "portal_red", label: "Down Portal", x: 46.3, y: 76.1 },
      { id: "cr_shh1", type: "shrine_health", label: "Shrine of Health", x: 55.8, y: 28.3 },
      { id: "cr_shh2", type: "shrine_health", label: "Shrine of Health", x: 17.4, y: 42.9 },
      { id: "cr_shh3", type: "shrine_health", label: "Shrine of Health", x: 14.8, y: 66.0 },
      { id: "cr_shprot1", type: "shrine_protection", label: "Shrine of Protection", x: 78.0, y: 11.2 },
      { id: "cr_shprot2", type: "shrine_protection", label: "Shrine of Protection", x: 69.3, y: 50.0 },
      { id: "cr_shprot3", type: "shrine_protection", label: "Shrine of Protection", x: 19.6, y: 59.0 },
      { id: "cr_shprot4", type: "shrine_protection", label: "Shrine of Protection", x: 80.0, y: 59.0 },
      { id: "cr_shprot5", type: "shrine_protection", label: "Shrine of Protection", x: 88.8, y: 66.0 },
      { id: "cr_shprot6", type: "shrine_protection", label: "Shrine of Protection", x: 19.6, y: 73.0 },
      { id: "cr_shprot7", type: "shrine_protection", label: "Shrine of Protection", x: 10.8, y: 76.4 },
      { id: "cr_shpow1", type: "shrine_power", label: "Shrine of Power", x: 78.0, y: 11.2 },
      { id: "cr_shpow2", type: "shrine_power", label: "Shrine of Power", x: 28.4, y: 40.6 },
      { id: "cr_shpow3", type: "shrine_power", label: "Shrine of Power", x: 69.2, y: 50.1 },
      { id: "cr_shpow4", type: "shrine_power", label: "Shrine of Power", x: 36.3, y: 54.0 },
      { id: "cr_shpow5", type: "shrine_power", label: "Shrine of Power", x: 68.3, y: 63.5 },
      { id: "cr_shpow6", type: "shrine_power", label: "Shrine of Power", x: 63.5, y: 68.3 },
      { id: "cr_shpow7", type: "shrine_power", label: "Shrine of Power", x: 28.5, y: 71.4 },
      { id: "cr_shpow8", type: "shrine_power", label: "Shrine of Power", x: 16.4, y: 73.4 },
      { id: "cr_sp1", type: "fountain_speed", label: "Fountain of Speed", x: 23.4, y: 22.2 },
      { id: "cr_sp2", type: "fountain_speed", label: "Fountain of Speed", x: 16.4, y: 58.6 },
      { id: "cr_alt1", type: "altar", label: "Altar of Sacrifice", x: 19.5, y: 13.7, description: "One-time resurrection shrine" },
      { id: "cr_alt2", type: "altar", label: "Altar of Sacrifice", x: 66.0, y: 46.6, description: "One-time resurrection shrine" },
      { id: "cr_alt3", type: "altar", label: "Altar of Sacrifice", x: 42.0, y: 50.0, description: "One-time resurrection shrine" },
      { id: "cr_alt4", type: "altar", label: "Altar of Sacrifice", x: 39.5, y: 53.9, description: "One-time resurrection shrine" },
      { id: "cr_boss1", type: "boss", label: "Skeleton Warlord",   x: 50.0, y: 49.0, description: "Boss: Skeleton Warlord. Drops Warlord's Broken Sword Blade." },
      { id: "cr_boss2", type: "boss", label: "Lich",               x: 50.0, y: 51.0, description: "Boss: Lich. Commands dark magic and undead." },
      { id: "cr_boss3", type: "boss", label: "Skeleton Champion",  x: 60.4, y: 39.9, description: "Subboss: Skeleton Champion" },
      { id: "cr_boss4", type: "boss", label: "Wraith",             x: 66.0, y: 33.4, description: "Subboss: Wraith" },
    ],
  },

  // ─── GOBLIN CAVE ───────────────────────────────────────────────────────────
  {
    id: "goblin_cave",
    name: "Goblin Cave",
    subtitle: "The Firedeep Entrance",
    description:
      "A cave system riddled with goblins, giant insects, and lava creatures. Features the Cyclops and Cave Troll as boss encounters. Contains Hell Portals leading down to the Firedeep (Season 8 floor 2).",
    theme: "cave",
    width: 1634,
    height: 1634,
    imageUrl: "/maps/goblin-cave.webp",
    bgColor: "#0d0a07",
    gridColor: "rgba(130,85,30,0.11)",
    accentColor: "#c4783a",
    features: [
      { id: "gc_ex1", type: "extract", label: "Extract Portal", x: 40.0, y: 12.1 },
      { id: "gc_ex2", type: "extract", label: "Extract Portal", x: 65.7, y: 20.6 },
      { id: "gc_ex3", type: "extract", label: "Extract Portal", x: 18.0, y: 35.7 },
      { id: "gc_ex4", type: "extract", label: "Extract Portal", x: 65.9, y: 37.3 },
      { id: "gc_ex5", type: "extract", label: "Extract Portal", x: 33.3, y: 42.1 },
      { id: "gc_ex6", type: "extract", label: "Extract Portal", x: 89.1, y: 42.7 },
      { id: "gc_ex7", type: "extract", label: "Extract Portal", x: 50.0, y: 50.0 },
      { id: "gc_ex8", type: "extract", label: "Extract Portal", x: 11.6, y: 59.6 },
      { id: "gc_ex9", type: "extract", label: "Extract Portal", x: 87.9, y: 66.0 },
      { id: "gc_ex10", type: "extract", label: "Extract Portal", x: 41.5, y: 75.0 },
      { id: "gc_ex11", type: "extract", label: "Extract Portal", x: 60.1, y: 87.8 },
      { id: "gc_shh1", type: "shrine_health", label: "Shrine of Health", x: 12.4, y: 20.1 },
      { id: "gc_shh2", type: "shrine_health", label: "Shrine of Health", x: 71.6, y: 33.4 },
      { id: "gc_shh3", type: "shrine_health", label: "Shrine of Health", x: 51.8, y: 34.3 },
      { id: "gc_shh4", type: "shrine_health", label: "Shrine of Health", x: 11.6, y: 49.7 },
      { id: "gc_shh5", type: "shrine_health", label: "Shrine of Health", x: 33.8, y: 55.5 },
      { id: "gc_shh6", type: "shrine_health", label: "Shrine of Health", x: 74.9, y: 56.2 },
      { id: "gc_shh7", type: "shrine_health", label: "Shrine of Health", x: 51.5, y: 67.3 },
      { id: "gc_shh8", type: "shrine_health", label: "Shrine of Health", x: 35.1, y: 68.5 },
      { id: "gc_shh9", type: "shrine_health", label: "Shrine of Health", x: 81.8, y: 73.1 },
      { id: "gc_shh10", type: "shrine_health", label: "Shrine of Health", x: 86.7, y: 77.8 },
      { id: "gc_shprot1", type: "shrine_protection", label: "Shrine of Protection", x: 12.4, y: 20.1 },
      { id: "gc_shprot2", type: "shrine_protection", label: "Shrine of Protection", x: 84.6, y: 52.7 },
      { id: "gc_shprot3", type: "shrine_protection", label: "Shrine of Protection", x: 52.0, y: 60.4 },
      { id: "gc_shpow1", type: "shrine_power", label: "Shrine of Power", x: 56.5, y: 81.5 },
      { id: "gc_sp1", type: "fountain_speed", label: "Fountain of Speed", x: 12.4, y: 20.1 },
      { id: "gc_sp2", type: "fountain_speed", label: "Fountain of Speed", x: 51.6, y: 67.5 },
      { id: "gc_alt1", type: "altar", label: "Altar of Sacrifice", x: 49.7, y: 17.9, description: "One-time resurrection shrine" },
      { id: "gc_alt2", type: "altar", label: "Altar of Sacrifice", x: 21.4, y: 29.8, description: "One-time resurrection shrine" },
      { id: "gc_alt3", type: "altar", label: "Altar of Sacrifice", x: 44.1, y: 43.2, description: "One-time resurrection shrine" },
      { id: "gc_alt4", type: "altar", label: "Altar of Sacrifice", x: 56.1, y: 44.0, description: "One-time resurrection shrine" },
      { id: "gc_alt5", type: "altar", label: "Altar of Sacrifice", x: 56.0, y: 56.1, description: "One-time resurrection shrine" },
      { id: "gc_alt6", type: "altar", label: "Altar of Sacrifice", x: 43.8, y: 56.2, description: "One-time resurrection shrine" },
      { id: "gc_alt7", type: "altar", label: "Altar of Sacrifice", x: 24.2, y: 65.2, description: "One-time resurrection shrine" },
      { id: "gc_alt8", type: "altar", label: "Altar of Sacrifice", x: 50.2, y: 86.8, description: "One-time resurrection shrine" },
      { id: "gc_boss1", type: "boss", label: "Giant Centipede",   x: 85.4, y: 78.7, description: "Subboss: Giant Centipede" },
      { id: "gc_boss2", type: "boss", label: "Cave Troll",        x: 67.9, y: 66.0, description: "Subboss: Cave Troll" },
      { id: "gc_boss3", type: "boss", label: "Cyclops",           x: 35.9, y: 34.0, description: "Boss: Cyclops. Drops Cyclops Precious Mirror." },
      { id: "gc_boss4", type: "boss", label: "Skeleton Champion", x: 35.5, y: 35.6, description: "Subboss: Skeleton Champion" },
    ],
  },

  // ─── INFERNO ───────────────────────────────────────────────────────────────
  {
    id: "inferno",
    name: "Inferno",
    subtitle: "The Third Floor",
    description:
      "The deepest floor beneath the Crypts — a demonic underworld ruled by the Ghost King. Wraiths, demons, and undead champions roam the burning halls. Accessible via red portals from the Crypts or Goblin Cave.",
    theme: "inferno",
    width: 874,
    height: 874,
    imageUrl: "/maps/inferno.webp",
    bgColor: "#120505",
    gridColor: "rgba(160,40,20,0.11)",
    accentColor: "#c4783a",
    features: [
      { id: "if_ex1", type: "extract", label: "Extract Portal", x: 86.1, y: 13.9 },
      { id: "if_ex2", type: "extract", label: "Extract Portal", x: 21.6, y: 21.6 },
      { id: "if_ex3", type: "extract", label: "Extract Portal", x: 78.5, y: 75.4 },
      { id: "if_ex4", type: "extract", label: "Extract Portal", x: 20.4, y: 79.4 },
      { id: "if_shh1", type: "shrine_health", label: "Shrine of Health", x: 89.2, y: 10.7 },
      { id: "if_shh2", type: "shrine_health", label: "Shrine of Health", x: 11.5, y: 11.5 },
      { id: "if_shh3", type: "shrine_health", label: "Shrine of Health", x: 67.0, y: 67.0 },
      { id: "if_shh4", type: "shrine_health", label: "Shrine of Health", x: 78.6, y: 81.8 },
      { id: "if_shh5", type: "shrine_health", label: "Shrine of Health", x: 40.0, y: 88.6 },
      { id: "if_shprot1", type: "shrine_protection", label: "Shrine of Protection", x: 27.1, y: 27.1 },
      { id: "if_shprot2", type: "shrine_protection", label: "Shrine of Protection", x: 67.7, y: 39.1 },
      { id: "if_shpow1", type: "shrine_power", label: "Shrine of Power", x: 89.6, y: 39.3 },
      { id: "if_alt1", type: "altar", label: "Altar of Sacrifice", x: 50.0, y: 15.0, description: "One-time resurrection shrine" },
      { id: "if_alt2", type: "altar", label: "Altar of Sacrifice", x: 20.5, y: 20.7, description: "One-time resurrection shrine" },
      { id: "if_alt3", type: "altar", label: "Altar of Sacrifice", x: 78.6, y: 80.5, description: "One-time resurrection shrine" },
      { id: "if_alt4", type: "altar", label: "Altar of Sacrifice", x: 16.3, y: 83.7, description: "One-time resurrection shrine" },
      { id: "if_boss1", type: "boss", label: "Ghost King",        x: 50.0, y: 50.0, description: "Boss: Ghost King — ruler of the Inferno" },
      { id: "if_boss2", type: "boss", label: "Demon Berserker",   x: 50.1, y: 88.3, description: "Subboss: Demon Berserker" },
      { id: "if_boss3", type: "boss", label: "Abomination",       x: 68.0, y: 70.0, description: "Subboss: Abomination" },
      { id: "if_boss4", type: "boss", label: "Demon Centaur",     x: 78.6, y: 78.2, description: "Subboss: Demon Centaur" },
      { id: "if_boss5", type: "boss", label: "Skeleton Champion", x: 32.0, y: 14.0, description: "Subboss: Skeleton Champion" },
      { id: "if_boss6", type: "boss", label: "Wraith",            x: 15.4, y: 15.5, description: "Subboss: Wraith" },
    ],
  },

  // ─── FROST MOUNTAIN ────────────────────────────────────────────────────────
  {
    id: "frost_mountain",
    name: "Frost Mountain",
    subtitle: "Ice Cavern",
    description:
      "The frozen depths of Frost Mountain. Kobolds, Ice Hounds, Frost Sentinels, and Frost Giants inhabit the permafrost tunnels. Contains void pits leading to the Ice Abyss.",
    theme: "ice",
    width: 1634,
    height: 1634,
    imageUrl: "/maps/ice-cavern.webp",
    bgColor: "#060d14",
    gridColor: "rgba(45,110,170,0.11)",
    accentColor: "#3a7cbd",
    features: [
      { id: "fm_ex1", type: "extract", label: "Extract Portal", x: 66.0, y: 18.1 },
      { id: "fm_ex2", type: "extract", label: "Extract Portal", x: 13.1, y: 22.7 },
      { id: "fm_ex3", type: "extract", label: "Extract Portal", x: 10.4, y: 33.8 },
      { id: "fm_ex4", type: "extract", label: "Extract Portal", x: 60.2, y: 40.0 },
      { id: "fm_ex5", type: "extract", label: "Extract Portal", x: 29.4, y: 49.5 },
      { id: "fm_ex6", type: "extract", label: "Extract Portal", x: 72.5, y: 59.5 },
      { id: "fm_ex7", type: "extract", label: "Extract Portal", x: 11.8, y: 59.9 },
      { id: "fm_ex8", type: "extract", label: "Extract Portal", x: 90.0, y: 65.6 },
      { id: "fm_ex9", type: "extract", label: "Extract Portal", x: 27.6, y: 72.5 },
      { id: "fm_ex10", type: "extract", label: "Extract Portal", x: 56.5, y: 88.1 },
      { id: "fm_rp1", type: "portal_red", label: "Void — Ice Abyss", x: 34.2, y: 65.4, description: "Jump into the void during Red Aurora to reach the Ice Abyss" },
      { id: "fm_rp2", type: "portal_red", label: "Void — Ice Abyss", x: 49.0, y: 76.0, description: "Jump into the void during Red Aurora to reach the Ice Abyss" },
      { id: "fm_shh1", type: "shrine_health", label: "Shrine of Health", x: 75.4, y: 11.5 },
      { id: "fm_shh2", type: "shrine_health", label: "Shrine of Health", x: 68.1, y: 23.8 },
      { id: "fm_shh3", type: "shrine_health", label: "Shrine of Health", x: 88.4, y: 44.8 },
      { id: "fm_shh4", type: "shrine_health", label: "Shrine of Health", x: 65.9, y: 57.1 },
      { id: "fm_shh5", type: "shrine_health", label: "Shrine of Health", x: 66.0, y: 66.0 },
      { id: "fm_shh6", type: "shrine_health", label: "Shrine of Health", x: 18.1, y: 67.7 },
      { id: "fm_shh7", type: "shrine_health", label: "Shrine of Health", x: 43.8, y: 69.5 },
      { id: "fm_shpow1", type: "shrine_power", label: "Shrine of Power", x: 17.1, y: 14.7 },
      { id: "fm_sp1", type: "fountain_speed", label: "Fountain of Speed", x: 16.7, y: 17.7 },
      { id: "fm_alt1", type: "altar", label: "Altar of Sacrifice", x: 33.0, y: 13.8, description: "One-time resurrection shrine" },
      { id: "fm_alt2", type: "altar", label: "Altar of Sacrifice", x: 67.1, y: 23.6, description: "One-time resurrection shrine" },
      { id: "fm_alt3", type: "altar", label: "Altar of Sacrifice", x: 82.8, y: 34.6, description: "One-time resurrection shrine" },
      { id: "fm_alt4", type: "altar", label: "Altar of Sacrifice", x: 66.6, y: 41.9, description: "One-time resurrection shrine" },
      { id: "fm_alt5", type: "altar", label: "Altar of Sacrifice", x: 87.2, y: 44.6, description: "One-time resurrection shrine" },
      { id: "fm_alt6", type: "altar", label: "Altar of Sacrifice", x: 65.9, y: 67.2, description: "One-time resurrection shrine" },
      { id: "fm_alt7", type: "altar", label: "Altar of Sacrifice", x: 17.2, y: 67.6, description: "One-time resurrection shrine" },
      { id: "fm_alt8", type: "altar", label: "Altar of Sacrifice", x: 84.4, y: 68.7, description: "One-time resurrection shrine" },
      { id: "fm_alt9", type: "altar", label: "Altar of Sacrifice", x: 81.5, y: 75.9, description: "One-time resurrection shrine" },
      { id: "fm_alt10", type: "altar", label: "Altar of Sacrifice", x: 49.7, y: 89.8, description: "One-time resurrection shrine" },
      { id: "fm_boss1", type: "boss", label: "Frost Giant Berserker", x: 14.8, y: 34.8, description: "Subboss: Frost Giant Berserker" },
      { id: "fm_boss2", type: "boss", label: "Frost Giant Shielder",  x: 33.4, y: 49.2, description: "Subboss: Frost Giant Shielder" },
      { id: "fm_boss3", type: "boss", label: "Skeleton Champion",     x: 80.0, y: 84.3, description: "Subboss: Skeleton Champion" },
      { id: "fm_boss4", type: "boss", label: "Yeti",                  x: 66.0, y: 21.9, description: "Subboss: Yeti" },
    ],
  },

  // ─── ICE ABYSS ─────────────────────────────────────────────────────────────
  {
    id: "ice_abyss",
    name: "Ice Abyss",
    subtitle: "The Frozen Deep",
    description:
      "A sub-dungeon beneath Frost Mountain, accessed by jumping into a void pit in the Ice Cavern while the Red Aurora effect is active. Extremely dangerous — home to the Frost Wyvern and the most powerful ice subbosses.",
    theme: "abyss",
    width: 874,
    height: 874,
    imageUrl: "/maps/ice-abyss.webp",
    bgColor: "#030810",
    gridColor: "rgba(30,80,140,0.11)",
    accentColor: "#5ba8e0",
    features: [
      { id: "ia_ex1", type: "extract", label: "Extract Portal", x: 49.9, y: 18.5 },
      { id: "ia_ex2", type: "extract", label: "Extract Portal", x: 50.0, y: 50.0 },
      { id: "ia_ex3", type: "extract", label: "Extract Portal", x: 28.5, y: 51.3 },
      { id: "ia_ex4", type: "extract", label: "Extract Portal", x: 71.0, y: 54.9 },
      { id: "ia_ex5", type: "extract", label: "Extract Portal", x: 52.8, y: 76.8 },
      { id: "ia_shh1", type: "shrine_health", label: "Shrine of Health", x: 91.6, y: 50.0 },
      { id: "ia_shh2", type: "shrine_health", label: "Shrine of Health", x: 85.8, y: 85.8 },
      { id: "ia_shprot1", type: "shrine_protection", label: "Shrine of Protection", x:  8.8, y: 62.6 },
      { id: "ia_shprot2", type: "shrine_protection", label: "Shrine of Protection", x: 62.6, y: 91.2 },
      { id: "ia_alt1", type: "altar", label: "Altar of Sacrifice", x: 50.0, y: 30.8, description: "One-time resurrection shrine" },
      { id: "ia_alt2", type: "altar", label: "Altar of Sacrifice", x: 69.3, y: 50.0, description: "One-time resurrection shrine" },
      { id: "ia_boss1", type: "boss", label: "Frost Wyvern",          x: 50.0, y: 50.0, description: "Boss: Frost Wyvern — Abyss apex predator" },
      { id: "ia_boss2", type: "boss", label: "Wendigo",                x: 21.6, y: 78.7, description: "Subboss: Wendigo. Drops Wendigo's Hoof." },
      { id: "ia_boss3", type: "boss", label: "Frost Demon",            x: 24.3, y: 51.5, description: "Subboss: Frost Demon" },
      { id: "ia_boss4", type: "boss", label: "Frost Giant Berserker",  x: 38.0, y: 28.0, description: "Subboss: Frost Giant Berserker" },
      { id: "ia_boss5", type: "boss", label: "Frost Giant Shielder",   x: 78.0, y: 40.0, description: "Subboss: Frost Giant Shielder" },
      { id: "ia_boss6", type: "boss", label: "Yeti",                   x: 32.0, y: 58.0, description: "Subboss: Yeti" },
    ],
  },

  // ─── SHIP GRAVEYARD ────────────────────────────────────────────────────────
  {
    id: "shipgraveyard",
    name: "Ship Graveyard",
    subtitle: "The Sunken Fleet",
    description:
      "A watery graveyard of ancient ships. Pirates, Tidewalkers, moray eels, and the massive Crocodilian and Bladehand guard its sunken treasures.",
    theme: "sea",
    width: 1584,
    height: 1093,
    imageUrl: "/maps/shipgraveyard.png",
    comingSoon: true,
    bgColor: "#050c12",
    gridColor: "rgba(28,95,120,0.11)",
    accentColor: "#2a6aad",
    features: [
      { id: "sg_ex1", type: "extract", label: "Extract — North Harbor",  x: 20, y: 5,  description: "Exit at the northern harbor" },
      { id: "sg_ex2", type: "extract", label: "Extract — East Shore",    x: 88, y: 24, description: "Exit on the eastern shoreline" },
      { id: "sg_ex3", type: "extract", label: "Extract — South Reef",    x: 52, y: 92, description: "Exit at the southern reef" },
      { id: "sg_ex4", type: "extract", label: "Extract — West Docks",    x: 5,  y: 58, description: "Exit at the western docks" },
      { id: "sg_ex5", type: "extract", label: "Extract — Circle Island", x: 70, y: 10, description: "Exit on Circle Island module" },
      { id: "sg_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 30, y: 36 },
      { id: "sg_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 72, y: 62 },
      { id: "sg_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 48, y: 56 },
      { id: "sg_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 60, y: 78 },
      { id: "sg_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 24, y: 74 },
      { id: "sg_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 82, y: 44, description: "One-time resurrection shrine" },
      { id: "sg_boss1", type: "boss", label: "Crocodilian", x: 55, y: 46, description: "Boss: Crocodilian. Drops Crocodilian Eyeball." },
      { id: "sg_boss2", type: "boss", label: "Bladehand",   x: 38, y: 66, description: "Boss: Bladehand." },
      { id: "sg_tr1", type: "treasure", label: "Pirate Prison",   x: 86, y: 14, description: "Pirate Prison module — locked chests with rare loot" },
      { id: "sg_tr2", type: "treasure", label: "Mermaid Coffins", x: 42, y: 80, description: "Mermaid Coffin chamber — 10 interactable coffins" },
      { id: "sg_tr3", type: "treasure", label: "Rock Island",     x: 15, y: 28, description: "Rock Island module with pirate loot" },
    ],
  },

  // ─── FIREDEEP ──────────────────────────────────────────────────────────────
  {
    id: "firedeep",
    name: "The Firedeep",
    subtitle: "Goblin Caves Floor 2",
    description:
      "The molten second floor of the Goblin Caves, introduced in Season 8. A persistent Infernal Heat debuff damages adventurers unless they stay near cooling crystals or Dwarven shrines. Fallen Dark Dwarves, Ifrit, and the Fire Colossus guard its depths.",
    theme: "firedeep",
    width: 1584,
    height: 1093,
    imageUrl: "/maps/firedeep.png",
    bgColor: "#140805",
    gridColor: "rgba(180,60,10,0.11)",
    accentColor: "#e05c1a",
    features: [
      { id: "fd_ex1", type: "extract", label: "Extract — Lava North",       x: 18, y: 5,  description: "Exit through the northern lava tube" },
      { id: "fd_ex2", type: "extract", label: "Extract — East Vent",        x: 88, y: 28, description: "Exit through the eastern magma vent" },
      { id: "fd_ex3", type: "extract", label: "Extract — South Shaft",      x: 50, y: 92, description: "Exit up the southern mine shaft" },
      { id: "fd_ex4", type: "extract", label: "Extract — West Tunnel",      x: 5,  y: 62, description: "Exit through the western tunnel" },
      { id: "fd_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 28, y: 35 },
      { id: "fd_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 70, y: 65 },
      { id: "fd_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 52, y: 58 },
      { id: "fd_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 38, y: 72 },
      { id: "fd_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 74, y: 30 },
      { id: "fd_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 20, y: 76, description: "One-time resurrection shrine" },
      { id: "fd_boss1", type: "boss", label: "Fire Colossus",  x: 50, y: 42, description: "Boss: Fire Colossus — the ultimate challenge of the Firedeep" },
      { id: "fd_boss2", type: "boss", label: "Ifrit",          x: 33, y: 60, description: "Subboss: Ifrit" },
      { id: "fd_boss3", type: "boss", label: "Dwarf Knight",   x: 68, y: 68, description: "Subboss: Dwarf Knight" },
      { id: "fd_boss4", type: "boss", label: "Lava Golem",     x: 55, y: 78, description: "Subboss: Lava Golem" },
      { id: "fd_tr1", type: "treasure", label: "Scorched Storage Room", x: 86, y: 82, description: "Chest + ore spawn in the northeast module" },
      { id: "fd_tr2", type: "treasure", label: "Lava Crossway",         x: 14, y: 18, description: "Module with the escape elevator" },
      { id: "fd_tr3", type: "treasure", label: "Anvil Outpost",         x: 60, y: 20, description: "Dwarven anvil module — stairs/climbing area" },
    ],
  },
];

// ─── CANONICAL NAME VALIDATION ──────────────────────────────────────────────
// Sources (Dark & Darker wiki):
//   https://darkanddarker.wiki.spellsandguns.com/Dungeon
//   https://darkanddarker.wiki.spellsandguns.com/Bosses
//   https://darkanddarker.wiki.spellsandguns.com/Subbosses
// Add to these sets (with a wiki-sourced justification in a comment) when the
// game adds a new map or boss. Module-load validation at the bottom throws on
// drift, so `next build` fails rather than shipping inaccurate names.

export const KNOWN_MAPS: ReadonlySet<string> = new Set([
  "Ruins of Forgotten Castle", // wiki parent dungeon; floor 1 is "The Ruins"
  "Crypts",                    // wiki: "The Howling Crypts" (floor 2)
  "Goblin Cave",               // wiki: "The Goblin Caves"
  "Inferno",                   // wiki: floor 3 of Ruins of Forgotten Castle
  "Frost Mountain",            // wiki parent dungeon; floor 1 is "Ice Cavern"
  "Ice Abyss",                 // wiki: floor 2 of Frost Mountain
  "Ship Graveyard",            // placeholder — not yet a canonical wiki dungeon
  "The Firedeep",              // wiki: Goblin Caves floor 2 (Season 8, launched 2026-01-29)
]);

// Canonical boss + subboss labels per map id. Entries are required for every
// non-`comingSoon` map. `comingSoon` maps are exempt (placeholder data allowed).
export const CANONICAL_BOSSES_BY_MAP: Readonly<Record<string, readonly string[]>> = {
  // Ruins bosses: Spectral Knight, Banshee. Subbosses: Giant Worm, Golem, Cockatrice, Skeleton Champion, Wraith.
  ruins:          ["Spectral Knight", "Banshee", "Giant Worm", "Golem", "Cockatrice", "Skeleton Champion", "Wraith"],
  // Howling Crypts bosses: Skeleton Warlord, Lich. Subbosses: Skeleton Champion, Wraith.
  crypts:         ["Skeleton Warlord", "Lich", "Skeleton Champion", "Wraith"],
  // Goblin Caves bosses: Cyclops, Cave Troll. Subbosses: Giant Centipede, Skeleton Champion.
  goblin_cave:    ["Cyclops", "Cave Troll", "Giant Centipede", "Skeleton Champion"],
  // Inferno boss: Ghost King. Subbosses: Demon Berserker, Demon Centaur, Skeleton Champion, Wraith.
  // Abomination is a canonical wiki subboss; its specific spawn map isn't wiki-documented but
  // is retained from prior data. Fire Colossus is NOT an Inferno boss — it is the boss of The
  // Firedeep (Goblin Caves floor 2) per wiki Bosses page.
  inferno:        ["Ghost King", "Demon Berserker", "Demon Centaur", "Abomination", "Skeleton Champion", "Wraith"],
  // Ice Cavern subbosses: Frost Giant Berserker, Frost Giant Shielder, Skeleton Champion, Yeti.
  // Wendigo moved to Ice Abyss per wiki — its Ice Cavern spawn was never wiki-confirmed.
  frost_mountain: ["Frost Giant Berserker", "Frost Giant Shielder", "Skeleton Champion", "Yeti"],
  // Ice Abyss boss: Frost Wyvern. Subbosses: Wendigo, Frost Demon, Frost Giant Berserker,
  // Frost Giant Shielder, Yeti (some shared with Ice Cavern per wiki).
  ice_abyss:      ["Frost Wyvern", "Wendigo", "Frost Demon", "Frost Giant Berserker", "Frost Giant Shielder", "Yeti"],
  // Firedeep boss: Fire Colossus. Subbosses: Ifrit, Dwarf Knight, Lava Golem (per wiki
  // Patch:6.10 and Subbosses pages). Introduced Season 8 (2026-01-29) as Goblin Caves floor 2.
  firedeep:       ["Fire Colossus", "Ifrit", "Dwarf Knight", "Lava Golem"],
};

(function validateMapData() {
  for (const map of MAPS) {
    if (!KNOWN_MAPS.has(map.name)) {
      throw new Error(
        `map-data: map name "${map.name}" (id=${map.id}) is not in KNOWN_MAPS. ` +
        `Fix the typo or add the canonical name with a wiki-sourced comment.`,
      );
    }
    if (map.comingSoon) continue;
    const allowed = CANONICAL_BOSSES_BY_MAP[map.id];
    if (!allowed) {
      throw new Error(
        `map-data: map id "${map.id}" (${map.name}) has no CANONICAL_BOSSES_BY_MAP entry. ` +
        `Add it (with a wiki source) or mark the map comingSoon: true.`,
      );
    }
    for (const feature of map.features) {
      if (feature.type !== "boss") continue;
      if (!allowed.includes(feature.label)) {
        throw new Error(
          `map-data: boss "${feature.label}" (id=${feature.id}) is not canonical for ${map.name}. ` +
          `Allowed: [${allowed.join(", ")}]. Fix the label or update CANONICAL_BOSSES_BY_MAP with a wiki source.`,
        );
      }
    }
  }
})();
