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

// Ordered list of all feature types (used for toggle panel)
export const FEATURE_TYPES: FeatureType[] = [
  "extract",
  "portal_red",
  "shrine_health",
  "shrine_protection",
  "shrine_power",
  "fountain_speed",
  "altar",
  "boss",
  "campfire",
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
    width: 773,
    height: 774,
    imageUrl: "/maps/ruins.jpg",
    bgColor: "#0c0b09",
    gridColor: "rgba(100,85,60,0.11)",
    accentColor: "#a89060",
    features: [
      { id: "ru_ex1", type: "extract", label: "Extract — North Gate",    x: 18, y: 5,  description: "Exit at the northern castle gate" },
      { id: "ru_ex2", type: "extract", label: "Extract — East Wall",     x: 90, y: 22, description: "Exit through a breach in the eastern wall" },
      { id: "ru_ex3", type: "extract", label: "Extract — South Field",   x: 52, y: 92, description: "Exit to the southern field" },
      { id: "ru_ex4", type: "extract", label: "Extract — West Barbican", x: 5,  y: 58, description: "Exit through the western barbican" },
      { id: "ru_rp1", type: "portal_red", label: "Down — Crypts",        x: 45, y: 50, description: "Staircase descending to the Crypts" },
      { id: "ru_rp2", type: "portal_red", label: "Down — Crypts",        x: 68, y: 35, description: "Secondary staircase to the Crypts" },
      { id: "ru_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 28, y: 30 },
      { id: "ru_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 74, y: 68 },
      { id: "ru_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 52, y: 72 },
      { id: "ru_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 36, y: 74 },
      { id: "ru_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 62, y: 22 },
      { id: "ru_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 84, y: 42, description: "One-time resurrection shrine" },
      { id: "ru_boss1", type: "boss", label: "Spectral Knight",   x: 40, y: 58, description: "Boss: Spectral Knight" },
      { id: "ru_boss2", type: "boss", label: "Banshee",           x: 65, y: 44, description: "Boss: Banshee" },
      { id: "ru_cf1", type: "campfire", label: "Campfire", x: 24, y: 48 },
      { id: "ru_cf2", type: "campfire", label: "Campfire", x: 78, y: 28 },
      { id: "ru_tr1", type: "treasure", label: "Armory",         x: 88, y: 74, description: "Ruins Armory module with weapon racks" },
      { id: "ru_tr2", type: "treasure", label: "Chapel Loot",    x: 14, y: 20, description: "Chapel module with sacred item spawns" },
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
    width: 886,
    height: 887,
    imageUrl: "/maps/howling-crypts.jpg",
    bgColor: "#0a090f",
    gridColor: "rgba(80,70,110,0.11)",
    accentColor: "#8a8693",
    features: [
      { id: "cr_ex1", type: "extract", label: "Extract — North Hall",    x: 20, y: 5,  description: "Exit portal in the northern corridor" },
      { id: "cr_ex2", type: "extract", label: "Extract — East Wing",     x: 90, y: 28, description: "Exit portal in the eastern wing" },
      { id: "cr_ex3", type: "extract", label: "Extract — South Gate",    x: 46, y: 93, description: "Exit portal at the southern gate" },
      { id: "cr_ex4", type: "extract", label: "Extract — West Passage",  x: 5,  y: 62, description: "Exit portal in the western passage" },
      { id: "cr_ex5", type: "extract", label: "Extract — Center Bridge", x: 55, y: 14, description: "Exit portal near the Center Bridge module" },
      { id: "cr_rp1", type: "portal_red", label: "Down — Inferno", x: 42, y: 45, description: "Staircase descending to the Inferno" },
      { id: "cr_rp2", type: "portal_red", label: "Down — Inferno", x: 70, y: 66, description: "Secondary staircase to the Inferno" },
      { id: "cr_sh1", type: "shrine_health",     label: "Shrine of Health",      x: 25, y: 35 },
      { id: "cr_sh2", type: "shrine_health",     label: "Shrine of Health",      x: 78, y: 56 },
      { id: "cr_sh3", type: "shrine_protection", label: "Shrine of Protection",  x: 50, y: 72 },
      { id: "cr_sh4", type: "shrine_power",      label: "Shrine of Power",       x: 30, y: 76 },
      { id: "cr_sp1", type: "fountain_speed",    label: "Fountain of Speed",     x: 65, y: 30 },
      { id: "cr_alt1", type: "altar",            label: "Altar of Sacrifice",    x: 14, y: 82, description: "One-time resurrection shrine" },
      { id: "cr_alt2", type: "altar",            label: "Altar of Sacrifice",    x: 86, y: 14, description: "One-time resurrection shrine" },
      { id: "cr_boss1", type: "boss", label: "Skeleton Warlord", x: 38, y: 58, description: "Boss: Skeleton Warlord. Drops Warlord's Broken Sword Blade." },
      { id: "cr_boss2", type: "boss", label: "Lich",             x: 50, y: 26, description: "Boss: Lich. Commands dark magic and undead." },
      { id: "cr_cf1", type: "campfire", label: "Campfire", x: 18, y: 52 },
      { id: "cr_cf2", type: "campfire", label: "Campfire", x: 72, y: 18 },
      { id: "cr_tr1", type: "treasure", label: "Pyramid",        x: 88, y: 88, description: "Pyramid module with high-value loot" },
      { id: "cr_tr2", type: "treasure", label: "Admirer's Room", x: 12, y: 18, description: "Admirer's Room with rare item spawns" },
    ],
  },

  // ─── GOBLIN CAVE ───────────────────────────────────────────────────────────
  {
    id: "goblin_cave",
    name: "Goblin Cave",
    subtitle: "The Firedeep Entrance",
    description:
      "A cave system riddled with goblins, giant insects, and lava creatures. Features the Cyclops and Cave Troll as boss encounters. Contains Hell Portals leading to the Inferno.",
    theme: "cave",
    width: 763,
    height: 762,
    imageUrl: "/maps/goblin-cave.png",
    bgColor: "#0d0a07",
    gridColor: "rgba(130,85,30,0.11)",
    accentColor: "#c4783a",
    features: [
      { id: "gc_ex1", type: "extract", label: "Extract — North Gate",   x: 18, y: 5,  description: "Exit portal on the northern cave mouth" },
      { id: "gc_ex2", type: "extract", label: "Extract — East Passage", x: 90, y: 22, description: "Exit portal on the eastern wall" },
      { id: "gc_ex3", type: "extract", label: "Extract — South Cave",   x: 52, y: 92, description: "Exit portal at the southern cave exit" },
      { id: "gc_ex4", type: "extract", label: "Extract — West Tunnel",  x: 5,  y: 58, description: "Exit portal through the western tunnel" },
      { id: "gc_ex5", type: "extract", label: "Extract — Ants Nest",    x: 78, y: 86, description: "Exit portal near the Ants Nest module" },
      { id: "gc_rp1", type: "portal_red", label: "Hell Portal",         x: 40, y: 40, description: "Descends to the Inferno" },
      { id: "gc_rp2", type: "portal_red", label: "Hell Portal",         x: 70, y: 62, description: "Descends to the Inferno" },
      { id: "gc_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 28, y: 32 },
      { id: "gc_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 72, y: 74 },
      { id: "gc_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 55, y: 52 },
      { id: "gc_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 35, y: 70 },
      { id: "gc_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 62, y: 24 },
      { id: "gc_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 82, y: 42, description: "One-time resurrection shrine" },
      { id: "gc_boss1", type: "boss", label: "Giant Centipede", x: 30, y: 60, description: "Sub-boss: Giant Centipede" },
      { id: "gc_boss2", type: "boss", label: "Cave Troll",      x: 48, y: 74, description: "Sub-boss: Cave Troll" },
      { id: "gc_boss3", type: "boss", label: "Cyclops",         x: 64, y: 44, description: "Boss: Cyclops. Drops Cyclops Precious Mirror." },
      { id: "gc_cf1", type: "campfire", label: "Campfire", x: 22, y: 48 },
      { id: "gc_cf2", type: "campfire", label: "Campfire", x: 76, y: 30 },
      { id: "gc_tr1", type: "treasure", label: "Lion's Head Chest Room", x: 88, y: 76, description: "High-value Lion's Head chests" },
      { id: "gc_tr2", type: "treasure", label: "Goblin Town Loot",       x: 42, y: 20, description: "Goblin Town module with stacked loot" },
    ],
  },

  // ─── INFERNO ───────────────────────────────────────────────────────────────
  {
    id: "inferno",
    name: "Inferno",
    subtitle: "The Third Floor",
    description:
      "The deepest floor beneath the Crypts. Demon forces, fire elementals, and the fearsome Fire Colossus await. Accessible via red portals from the Crypts or Goblin Cave.",
    theme: "inferno",
    width: 987,
    height: 986,
    imageUrl: "/maps/inferno.jpg",
    bgColor: "#120505",
    gridColor: "rgba(160,40,20,0.11)",
    accentColor: "#c4783a",
    features: [
      { id: "if_ex1", type: "extract", label: "Extract — North Exit",  x: 18, y: 5,  description: "Exit through the northern passage" },
      { id: "if_ex2", type: "extract", label: "Extract — East Gate",   x: 88, y: 28, description: "Exit through the eastern gate" },
      { id: "if_ex3", type: "extract", label: "Extract — South Vent",  x: 50, y: 92, description: "Exit through the southern lava vent" },
      { id: "if_ex4", type: "extract", label: "Extract — West Tunnel", x: 5,  y: 62, description: "Exit through the western tunnel" },
      { id: "if_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 28, y: 32 },
      { id: "if_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 70, y: 68 },
      { id: "if_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 55, y: 55 },
      { id: "if_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 40, y: 70 },
      { id: "if_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 75, y: 28 },
      { id: "if_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 18, y: 74, description: "One-time resurrection shrine" },
      { id: "if_boss1", type: "boss", label: "Fire Colossus",   x: 50, y: 44, description: "Boss: Fire Colossus." },
      { id: "if_boss2", type: "boss", label: "Demon Berserker", x: 35, y: 60, description: "Elite: Demon Berserker." },
      { id: "if_boss3", type: "boss", label: "Abomination",     x: 68, y: 70, description: "Elite: Abomination." },
      { id: "if_boss4", type: "boss", label: "Ghost King",      x: 62, y: 30, description: "Boss: Ghost King" },
      { id: "if_cf1", type: "campfire", label: "Campfire", x: 22, y: 48 },
      { id: "if_cf2", type: "campfire", label: "Campfire", x: 78, y: 62 },
      { id: "if_tr1", type: "treasure", label: "Burning Court", x: 88, y: 80, description: "Burning Court module — highest-tier loot" },
      { id: "if_tr2", type: "treasure", label: "Waiting Room",  x: 14, y: 20, description: "Waiting Room module" },
    ],
  },

  // ─── FROST MOUNTAIN ────────────────────────────────────────────────────────
  {
    id: "frost_mountain",
    name: "Frost Mountain",
    subtitle: "Ice Cavern",
    description:
      "The frozen depths of Frost Mountain. Kobolds, Ice Hounds, Frost Sentinels, and the Wendigo inhabit the permafrost tunnels. Contains void pits leading to the Ice Abyss.",
    theme: "ice",
    width: 890,
    height: 886,
    imageUrl: "/maps/ice-cavern.jpg",
    bgColor: "#060d14",
    gridColor: "rgba(45,110,170,0.11)",
    accentColor: "#3a7cbd",
    features: [
      { id: "fm_ex1", type: "extract", label: "Extract — North Pass",    x: 22, y: 5,  description: "Exit portal on the northern wall" },
      { id: "fm_ex2", type: "extract", label: "Extract — East Ice Wall", x: 88, y: 26, description: "Exit carved through the eastern ice wall" },
      { id: "fm_ex3", type: "extract", label: "Extract — South Cave",    x: 48, y: 93, description: "Exit at the southern cave mouth" },
      { id: "fm_ex4", type: "extract", label: "Extract — West Tunnel",   x: 5,  y: 65, description: "Exit through the western frost tunnel" },
      { id: "fm_rp1", type: "portal_red", label: "Void — Ice Abyss", x: 46, y: 48, description: "Jump into the void during Red Aurora to reach the Ice Abyss" },
      { id: "fm_rp2", type: "portal_red", label: "Void — Ice Abyss", x: 68, y: 34, description: "Secondary Ice Abyss void point" },
      { id: "fm_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 32, y: 38 },
      { id: "fm_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 72, y: 62 },
      { id: "fm_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 56, y: 70 },
      { id: "fm_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 78, y: 44 },
      { id: "fm_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 20, y: 74 },
      { id: "fm_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 76, y: 22, description: "One-time resurrection shrine" },
      { id: "fm_boss1", type: "boss", label: "Wendigo",               x: 50, y: 42, description: "Boss: Wendigo. Drops Wendigo's Hoof." },
      { id: "fm_boss2", type: "boss", label: "Frost Giant Berserker", x: 34, y: 62, description: "Sub-boss: Frost Giant Berserker" },
      { id: "fm_cf1", type: "campfire", label: "Campfire", x: 25, y: 55 },
      { id: "fm_cf2", type: "campfire", label: "Campfire", x: 80, y: 72 },
      { id: "fm_tr1", type: "treasure", label: "Treasure Hoard", x: 88, y: 88, description: "Ice Cavern treasure hoard — interactable 3 times" },
      { id: "fm_tr2", type: "treasure", label: "Icicle Cave",    x: 14, y: 24, description: "Icicle Cave module with rare spawn rates" },
      { id: "fm_tr3", type: "treasure", label: "Wolf Cave",      x: 60, y: 18, description: "Wolf Cave module with elite loot" },
    ],
  },

  // ─── ICE ABYSS ─────────────────────────────────────────────────────────────
  {
    id: "ice_abyss",
    name: "Ice Abyss",
    subtitle: "The Frozen Deep",
    description:
      "A sub-dungeon beneath Frost Mountain, accessed by jumping into void pits during a Red Aurora event. Extremely dangerous — home to the most powerful ice creatures.",
    theme: "abyss",
    width: 980,
    height: 980,
    imageUrl: "/maps/ice-abyss.png",
    bgColor: "#030810",
    gridColor: "rgba(30,80,140,0.11)",
    accentColor: "#5ba8e0",
    features: [
      { id: "ia_ex1", type: "extract", label: "Extract — Abyss Exit North", x: 20, y: 5,  description: "Exit back to Frost Mountain" },
      { id: "ia_ex2", type: "extract", label: "Extract — Abyss Exit South", x: 55, y: 92, description: "Southern exit from the Abyss" },
      { id: "ia_ex3", type: "extract", label: "Extract — Abyss Exit East",  x: 88, y: 50, description: "Eastern exit from the Abyss" },
      { id: "ia_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 30, y: 40 },
      { id: "ia_sh2", type: "shrine_protection", label: "Shrine of Protection", x: 65, y: 60 },
      { id: "ia_sh3", type: "shrine_power",      label: "Shrine of Power",      x: 45, y: 72 },
      { id: "ia_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 72, y: 28 },
      { id: "ia_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 18, y: 78, description: "One-time resurrection shrine" },
      { id: "ia_boss1", type: "boss", label: "Frost Wyvern",         x: 50, y: 40, description: "Boss: Frost Wyvern — Abyss apex predator" },
      { id: "ia_cf1", type: "campfire", label: "Campfire", x: 22, y: 62 },
      { id: "ia_tr1", type: "treasure", label: "Frozen Vault",  x: 82, y: 80, description: "Frozen Vault — highest-tier ice loot" },
      { id: "ia_tr2", type: "treasure", label: "Ice Hoard",     x: 14, y: 22, description: "Ancient Ice Hoard module" },
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
      { id: "sg_cf1", type: "campfire", label: "Campfire", x: 18, y: 46 },
      { id: "sg_cf2", type: "campfire", label: "Campfire", x: 78, y: 80 },
      { id: "sg_tr1", type: "treasure", label: "Pirate Prison",   x: 86, y: 14, description: "Pirate Prison module — locked chests with rare loot" },
      { id: "sg_tr2", type: "treasure", label: "Mermaid Coffins", x: 42, y: 80, description: "Mermaid Coffin chamber — 10 interactable coffins" },
      { id: "sg_tr3", type: "treasure", label: "Rock Island",     x: 15, y: 28, description: "Rock Island module with pirate loot" },
    ],
  },

  // ─── FIREDEEP (PLACEHOLDER — not yet a canonical wiki dungeon) ─────────────
  {
    id: "firedeep",
    name: "Firedeep",
    subtitle: "The Molten Core",
    description:
      "The volcanic heart beneath the Goblin Cave. Rivers of lava, fire elementals, and ancient flame giants make this one of the most hostile environments in the dungeon.",
    theme: "firedeep",
    width: 1584,
    height: 1093,
    imageUrl: "/maps/firedeep.png",
    comingSoon: true,
    bgColor: "#140805",
    gridColor: "rgba(180,60,10,0.11)",
    accentColor: "#e05c1a",
    features: [
      { id: "fd_ex1", type: "extract", label: "Extract — Lava North",  x: 18, y: 5,  description: "Exit through the northern lava tube" },
      { id: "fd_ex2", type: "extract", label: "Extract — East Vent",   x: 88, y: 28, description: "Exit through the eastern magma vent" },
      { id: "fd_ex3", type: "extract", label: "Extract — South Shaft", x: 50, y: 92, description: "Exit up the southern mine shaft" },
      { id: "fd_ex4", type: "extract", label: "Extract — West Tunnel", x: 5,  y: 62, description: "Exit through the western tunnel" },
      { id: "fd_sh1", type: "shrine_health",     label: "Shrine of Health",     x: 28, y: 35 },
      { id: "fd_sh2", type: "shrine_health",     label: "Shrine of Health",     x: 70, y: 65 },
      { id: "fd_sh3", type: "shrine_protection", label: "Shrine of Protection", x: 52, y: 58 },
      { id: "fd_sh4", type: "shrine_power",      label: "Shrine of Power",      x: 38, y: 72 },
      { id: "fd_sp1", type: "fountain_speed",    label: "Fountain of Speed",    x: 74, y: 30 },
      { id: "fd_alt1", type: "altar",            label: "Altar of Sacrifice",   x: 20, y: 76, description: "One-time resurrection shrine" },
      { id: "fd_boss1", type: "boss", label: "Magma Golem",       x: 50, y: 42, description: "Boss: Magma Golem — volcanic tank enemy" },
      { id: "fd_boss2", type: "boss", label: "Fire Giant",        x: 33, y: 60, description: "Elite: Fire Giant" },
      { id: "fd_boss3", type: "boss", label: "Flame Elemental",   x: 68, y: 68, description: "Elite: Flame Elemental" },
      { id: "fd_boss4", type: "boss", label: "Lava Golem",        x: 55, y: 78, description: "Boss: Lava Golem" },
      { id: "fd_cf1", type: "campfire", label: "Campfire", x: 24, y: 50 },
      { id: "fd_cf2", type: "campfire", label: "Campfire", x: 76, y: 64 },
      { id: "fd_tr1", type: "treasure", label: "Molten Vault",  x: 86, y: 82, description: "Molten Vault — fire-tier loot" },
      { id: "fd_tr2", type: "treasure", label: "Miner's Cache", x: 14, y: 18, description: "Old miner's cache with ore and rare finds" },
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
  "Firedeep",                  // placeholder — not yet a canonical wiki dungeon
]);

// Canonical boss + subboss labels per map id. Entries are required for every
// non-`comingSoon` map. `comingSoon` maps are exempt (placeholder data allowed).
export const CANONICAL_BOSSES_BY_MAP: Readonly<Record<string, readonly string[]>> = {
  // Ruins bosses: Spectral Knight, Banshee. Subbosses: Giant Worm, Golem, Cockatrice, Skeleton Champion, Wraith.
  ruins:          ["Spectral Knight", "Banshee", "Giant Worm", "Golem", "Cockatrice", "Skeleton Champion", "Wraith"],
  // Howling Crypts bosses: Skeleton Warlord, Lich. (Wiki does not enumerate Crypts subbosses.)
  crypts:         ["Skeleton Warlord", "Lich"],
  // Goblin Caves bosses: Cyclops, Cave Troll. Subboss: Giant Centipede.
  goblin_cave:    ["Cyclops", "Cave Troll", "Giant Centipede"],
  // Inferno boss: Ghost King. Subbosses: Demon Berserker, Demon Centaur, Skeleton Champion, Wraith.
  // Fire Colossus and Abomination are canonical names in the wiki boss/subboss lists; their
  // spawn map is not explicitly documented on the wiki, retained here from prior data.
  inferno:        ["Ghost King", "Fire Colossus", "Demon Berserker", "Demon Centaur", "Abomination", "Skeleton Champion", "Wraith"],
  // Ice Cavern subbosses: Frost Giant Berserker, Frost Giant Shielder, Skeleton Champion, Yeti.
  // Wendigo is a canonical subboss; specific Ice Cavern listing not confirmed but retained.
  frost_mountain: ["Frost Giant Berserker", "Frost Giant Shielder", "Skeleton Champion", "Yeti", "Wendigo"],
  // Ice Abyss boss: Frost Wyvern.
  ice_abyss:      ["Frost Wyvern"],
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
