export interface Monster {
  id: string;
  name: string;
  /** True for documented main/sub bosses; false/undefined for normal mobs. */
  isBoss?: boolean;
  aliases?: string[];
}

export interface MonsterSpawn {
  monsterId: string;
  mapId: string;
  module?: string;
  x?: number;
  y?: number;
}

export interface ItemDrop {
  itemName: string;
  monsterIds: string[];
  note?: string;
}

export const MONSTERS: Monster[] = [
  // ── Mobs ────────────────────────────────────────────────────────────────────
  { id: "skeleton", name: "Skeleton" },
  { id: "wraith", name: "Wraith" },
  { id: "zombie", name: "Zombie" },
  { id: "lava_turtle", name: "Lava Turtle" },
  { id: "plant_node", name: "Plant Node", aliases: ["Wardweed", "Lifeleaf"] },

  // ── Bosses with documented signature drops (per map-data feature descriptions) ─
  { id: "skeleton_warlord", name: "Skeleton Warlord", isBoss: true },
  { id: "cyclops", name: "Cyclops", isBoss: true },
  { id: "crocodilian", name: "Crocodilian", isBoss: true },
  { id: "wendigo", name: "Wendigo", isBoss: true },
  { id: "demon_overseer", name: "Demon Overseer", isBoss: true },
];

export const MONSTER_SPAWNS: MonsterSpawn[] = [
  { monsterId: "skeleton", mapId: "ruins", x: 32, y: 44 },
  { monsterId: "skeleton", mapId: "ruins", x: 60, y: 30 },
  { monsterId: "skeleton", mapId: "ruins", x: 48, y: 66 },
  { monsterId: "skeleton", mapId: "crypts", x: 28, y: 48 },
  { monsterId: "skeleton", mapId: "crypts", x: 56, y: 38 },
  { monsterId: "skeleton", mapId: "crypts", x: 72, y: 62 },

  { monsterId: "wraith", mapId: "crypts", x: 44, y: 22 },
  { monsterId: "wraith", mapId: "crypts", x: 66, y: 50 },
  { monsterId: "wraith", mapId: "crypts", x: 22, y: 68 },
  { monsterId: "wraith", mapId: "ruins", x: 70, y: 52 },

  { monsterId: "zombie", mapId: "crypts", x: 38, y: 66 },
  { monsterId: "zombie", mapId: "crypts", x: 62, y: 74 },
  { monsterId: "zombie", mapId: "crypts", x: 18, y: 40 },
  { monsterId: "zombie", mapId: "ruins", x: 55, y: 80 },

  { monsterId: "lava_turtle", mapId: "inferno", x: 44, y: 54 },
  { monsterId: "lava_turtle", mapId: "inferno", x: 60, y: 36 },
  { monsterId: "lava_turtle", mapId: "inferno", x: 30, y: 72 },
  { monsterId: "lava_turtle", mapId: "firedeep", x: 42, y: 50 },
  { monsterId: "lava_turtle", mapId: "firedeep", x: 66, y: 56 },

  { monsterId: "plant_node", mapId: "ruins", x: 26, y: 64 },
  { monsterId: "plant_node", mapId: "ruins", x: 72, y: 38 },
  { monsterId: "plant_node", mapId: "goblin_cave", x: 36, y: 52 },
  { monsterId: "plant_node", mapId: "goblin_cave", x: 58, y: 68 },
  { monsterId: "plant_node", mapId: "frost_mountain", x: 48, y: 56 },

  // Boss spawns mirror the boss feature locations in map-data.ts
  { monsterId: "skeleton_warlord", mapId: "crypts" },
  { monsterId: "cyclops", mapId: "goblin_cave" },
  { monsterId: "crocodilian", mapId: "shipgraveyard" },
  { monsterId: "wendigo", mapId: "ice_abyss" },
  { monsterId: "demon_overseer", mapId: "inferno" },
];

export const ITEM_DROPS: ItemDrop[] = [
  { itemName: "Broken Skull", monsterIds: ["skeleton"] },
  { itemName: "Grave Essence", monsterIds: ["wraith", "zombie"] },
  { itemName: "Maggots", monsterIds: ["zombie"] },
  { itemName: "Phantom Flower", monsterIds: ["plant_node"] },
  { itemName: "Wardweed", monsterIds: ["plant_node"] },
  { itemName: "Lifeleaf", monsterIds: ["plant_node"] },
  { itemName: "Hardened Shell Fragment", monsterIds: ["lava_turtle"] },

  // Signature boss drops — names match the descriptions in src/lib/map-data.ts.
  { itemName: "Warlord's Broken Sword Blade", monsterIds: ["skeleton_warlord"] },
  { itemName: "Cyclops Precious Mirror", monsterIds: ["cyclops"] },
  { itemName: "Crocodilian Eyeball", monsterIds: ["crocodilian"] },
  { itemName: "Wendigo's Hoof", monsterIds: ["wendigo"] },
];

/** Returns the monsters (and their spawns) that drop the given item name. */
export function getDropsFor(
  itemName: string,
): Array<{ monster: Monster; spawns: MonsterSpawn[] }> {
  const drop = ITEM_DROPS.find(
    (d) => d.itemName.toLowerCase() === itemName.toLowerCase(),
  );
  if (!drop) return [];
  const results: Array<{ monster: Monster; spawns: MonsterSpawn[] }> = [];
  for (const monsterId of drop.monsterIds) {
    const monster = MONSTERS.find((m) => m.id === monsterId);
    if (!monster) continue;
    const spawns = MONSTER_SPAWNS.filter((s) => s.monsterId === monsterId);
    results.push({ monster, spawns });
  }
  return results;
}

/** Returns every item known to drop from the given monster id. */
export function getDropsForMonster(monsterId: string): string[] {
  return ITEM_DROPS.filter((d) => d.monsterIds.includes(monsterId)).map(
    (d) => d.itemName,
  );
}

/** Looks up a monster by case-insensitive name match (used to bridge map-data boss labels). */
export function findMonsterByName(name: string): Monster | undefined {
  const target = name.toLowerCase();
  return MONSTERS.find(
    (m) =>
      m.name.toLowerCase() === target ||
      m.aliases?.some((a) => a.toLowerCase() === target),
  );
}
