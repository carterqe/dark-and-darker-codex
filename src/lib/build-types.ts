export const GEAR_SLOTS = [
  { key: "head", label: "Head", slot_type: "Head" },
  { key: "chest", label: "Chest", slot_type: "Chest" },
  { key: "legs", label: "Legs", slot_type: "Legs" },
  { key: "hands", label: "Hands", slot_type: "Hands" },
  { key: "foot", label: "Foot", slot_type: "Foot" },
  { key: "back", label: "Back", slot_type: "Back" },
  { key: "necklace", label: "Necklace", slot_type: "Necklace" },
  { key: "ring", label: "Ring 1", slot_type: "Ring" },
  { key: "ring2", label: "Ring 2", slot_type: "Ring" },
  { key: "primary", label: "Weapon 1", slot_type: "Primary" },
  { key: "secondary", label: "Weapon 1 Off-hand", slot_type: "Secondary" },
  { key: "weapon2", label: "Weapon 2", slot_type: "Primary" },
  { key: "weapon2_offhand", label: "Weapon 2 Off-hand", slot_type: "Secondary" },
] as const;

export type GearSlotKey = (typeof GEAR_SLOTS)[number]["key"];

export interface BuildGearItem {
  item_id: number;
  item_name: string;
  rarity: string;
  gear_score: number;
  stats?: Record<string, number>; // Custom stat roll values, e.g. { "strength": 2.1 }
  hand?: ("main" | "off")[]; // Weapon hand usage tags (weapon slots only)
}

export type BuildEquipment = Partial<Record<GearSlotKey, BuildGearItem | null>>;

export interface Build {
  id: string;
  author_id: string;
  title: string;
  description: string;
  class: string;
  tags: string[];
  equipment: BuildEquipment;
  perks: string[];
  skills: string[];
  spells: string[];
  vote_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: { username: string } | null;
  user_voted?: boolean;
}

export interface BuildComment {
  id: string;
  build_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: { username: string } | null;
}

export const BUILD_CLASSES = [
  "Fighter",
  "Barbarian",
  "Rogue",
  "Ranger",
  "Wizard",
  "Cleric",
  "Bard",
  "Warlock",
  "Druid",
  "Sorcerer",
] as const;

export type BuildClass = (typeof BUILD_CLASSES)[number];

export const BUILD_TAGS = [
  "PvP",
  "PvE",
  "Solo",
  "Squad",
  "Budget",
  "Endgame",
  "Beginner",
  "Speed",
  "Tank",
  "Glass Cannon",
  "Support",
  "Stealth",
];
