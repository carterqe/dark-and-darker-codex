export interface Monster {
  id: string;
  name: string;
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
  { id: "skeleton", name: "Skeleton" },
  { id: "wraith", name: "Wraith" },
  { id: "zombie", name: "Zombie" },
  { id: "lava_turtle", name: "Lava Turtle" },
  { id: "plant_node", name: "Plant Node", aliases: ["Wardweed", "Lifeleaf"] },
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
];

export const ITEM_DROPS: ItemDrop[] = [
  { itemName: "Broken Skull", monsterIds: ["skeleton"] },
  { itemName: "Grave Essence", monsterIds: ["wraith", "zombie"] },
  { itemName: "Maggots", monsterIds: ["zombie"] },
  { itemName: "Phantom Flower", monsterIds: ["plant_node"] },
  { itemName: "Wardweed", monsterIds: ["plant_node"] },
  { itemName: "Lifeleaf", monsterIds: ["plant_node"] },
  { itemName: "Hardened Shell Fragment", monsterIds: ["lava_turtle"] },
];

export function getDropsFor(
  itemName: string,
): Array<{ monster: Monster; spawns: MonsterSpawn[] }> {
  const drop = ITEM_DROPS.find((d) => d.itemName === itemName);
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
