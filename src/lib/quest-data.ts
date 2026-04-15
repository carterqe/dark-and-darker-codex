export interface QuestRequirement {
  type: "item" | "kill" | "extract" | "survive";
  description: string;
  item?: string;
  rarity?: string;
  monster?: string;
  quantity?: number;
}

export interface QuestReward {
  gold?: number;
  xp?: number;
  item?: string;
  description: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  requirements: QuestRequirement[];
  reward: QuestReward;
}

export interface Trader {
  id: string;
  name: string;
  title: string;
  description: string;
  accentColor: string;
  quests: Quest[];
}

export const TRADERS: Trader[] = [
  {
    id: "weaponsmith",
    name: "Weaponsmith",
    title: "The Iron Forger",
    description:
      "A master craftsman who deals in all manner of bladed and ranged weapons. He seeks raw materials to fuel his forge and fine specimens to study.",
    accentColor: "#a0a0b8",
    quests: [
      {
        id: "weaponsmith_1",
        name: "Iron Supply Run",
        description:
          "The forge runs cold without ore. Bring me iron from the depths and I'll make it worth your while.",
        requirements: [
          { type: "item", item: "Iron Ore", rarity: "Common", quantity: 5, description: "Collect 5 Iron Ore" },
        ],
        reward: { gold: 50, description: "50 Gold" },
      },
      {
        id: "weaponsmith_2",
        name: "Scrap Reclamation",
        description:
          "Old scraps can be reworked into something useful. Gather what's left behind in the ruins.",
        requirements: [
          { type: "item", item: "Old Scrap", rarity: "Poor", quantity: 5, description: "Collect 5 Old Scrap" },
        ],
        reward: { gold: 40, description: "40 Gold" },
      },
      {
        id: "weaponsmith_3",
        name: "Coal for the Forge",
        description:
          "No coal, no heat. No heat, no steel. Bring me a good supply and the forge stays lit.",
        requirements: [
          { type: "item", item: "Coal", rarity: "Common", quantity: 5, description: "Collect 5 Coal" },
        ],
        reward: { gold: 60, description: "60 Gold" },
      },
      {
        id: "weaponsmith_4",
        name: "Steel Acquisition",
        description:
          "Refined steel is worth far more to me than raw ore. Show me you know the difference.",
        requirements: [
          { type: "item", item: "Iron Ingot", rarity: "Uncommon", quantity: 3, description: "Collect 3 Iron Ingots" },
        ],
        reward: { gold: 100, description: "100 Gold" },
      },
      {
        id: "weaponsmith_5",
        name: "A Worthy Blade",
        description:
          "There is a blade said to rest in the dungeon — ancient, but still sharp. I must see it.",
        requirements: [
          { type: "item", item: "Stiletto", rarity: "Uncommon", quantity: 1, description: "Recover 1 Stiletto" },
        ],
        reward: { gold: 200, item: "Falchion", description: "200 Gold + Falchion" },
      },
      {
        id: "weaponsmith_6",
        name: "Hatchet Collection",
        description: "Salvageable throwing weapons are in short supply. Bring me what you find.",
        requirements: [
          { type: "item", item: "Hatchet", rarity: "Common", quantity: 2, description: "Recover 2 Hatchets" },
        ],
        reward: { gold: 80, description: "80 Gold" },
      },
    ],
  },
  {
    id: "armorer",
    name: "Armorer",
    title: "The Shield Warden",
    description:
      "A stoic craftsman who specializes in defensive equipment. He prizes quality metals and recovered armor sets from the dungeon.",
    accentColor: "#8aabcf",
    quests: [
      {
        id: "armorer_1",
        name: "Helmet Recovery",
        description:
          "Adventurers leave their helmets behind far too often. Retrieve what can still be salvaged.",
        requirements: [
          { type: "item", item: "Leather Cap", rarity: "Common", quantity: 2, description: "Recover 2 Leather Caps" },
        ],
        reward: { gold: 60, description: "60 Gold" },
      },
      {
        id: "armorer_2",
        name: "Iron Plate Sample",
        description:
          "I need iron ore to study the quality coming out of the lower depths. Bring me a large supply.",
        requirements: [
          { type: "item", item: "Iron Ore", rarity: "Common", quantity: 8, description: "Collect 8 Iron Ore" },
        ],
        reward: { gold: 75, description: "75 Gold" },
      },
      {
        id: "armorer_3",
        name: "Hide Tanning",
        description:
          "Before I can line armor, I need raw hides. Wolf leather makes excellent padding.",
        requirements: [
          { type: "item", item: "Wolf Pelt", rarity: "Common", quantity: 3, description: "Collect 3 Wolf Pelts" },
        ],
        reward: { gold: 90, description: "90 Gold" },
      },
      {
        id: "armorer_4",
        name: "Chest Piece Requisition",
        description:
          "A full set of recovered plate tells me more than any sketch. Bring back a chest piece from the dungeon.",
        requirements: [
          { type: "item", item: "Rondel Dagger", rarity: "Uncommon", quantity: 1, description: "Recover 1 Rondel Dagger" },
          { type: "extract", description: "Extract successfully from the dungeon" },
        ],
        reward: { gold: 180, description: "180 Gold" },
      },
      {
        id: "armorer_5",
        name: "The Reinforced Set",
        description:
          "I want to see how well a reinforced leather set holds up. Find me the pieces.",
        requirements: [
          { type: "item", item: "Leather Armor", rarity: "Common", quantity: 1, description: "Recover 1 Leather Armor" },
          { type: "item", item: "Leather Gloves", rarity: "Common", quantity: 1, description: "Recover 1 Leather Gloves" },
        ],
        reward: { gold: 250, item: "Buckler", description: "250 Gold + Buckler" },
      },
    ],
  },
  {
    id: "tailor",
    name: "Tailor",
    title: "The Thread Keeper",
    description:
      "A meticulous craftsperson who works with cloth, leather, and fine fabrics. She pays well for quality materials recovered from expeditions.",
    accentColor: "#c48fb8",
    quests: [
      {
        id: "tailor_1",
        name: "Ruined but Usable",
        description:
          "Even ruined cloth has its uses. Bring me a supply and I'll extract what fibers I can.",
        requirements: [
          { type: "item", item: "Ruined Cloth", rarity: "Poor", quantity: 5, description: "Collect 5 Ruined Cloth" },
        ],
        reward: { gold: 40, description: "40 Gold" },
      },
      {
        id: "tailor_2",
        name: "Linen Demand",
        description: "Linen is the backbone of any good garment. My stock is running low.",
        requirements: [
          { type: "item", item: "Linen", rarity: "Common", quantity: 4, description: "Collect 4 Linen" },
        ],
        reward: { gold: 70, description: "70 Gold" },
      },
      {
        id: "tailor_3",
        name: "Wool Gathering",
        description: "Warm wool is worth its weight in silver. Adventurers rarely think to bring it back.",
        requirements: [
          { type: "item", item: "Wool", rarity: "Common", quantity: 3, description: "Collect 3 Wool" },
        ],
        reward: { gold: 80, description: "80 Gold" },
      },
      {
        id: "tailor_4",
        name: "Button Bounty",
        description: "It sounds trivial, but quality buttons are nearly impossible to source. Bring me a collection.",
        requirements: [
          { type: "item", item: "Button", rarity: "Common", quantity: 10, description: "Collect 10 Buttons" },
        ],
        reward: { gold: 55, description: "55 Gold" },
      },
      {
        id: "tailor_5",
        name: "Fastener Hunt",
        description: "Buckles and clasps hold everything together — literally. I need a fresh supply.",
        requirements: [
          { type: "item", item: "Buckle", rarity: "Common", quantity: 6, description: "Collect 6 Buckles" },
        ],
        reward: { gold: 65, description: "65 Gold" },
      },
      {
        id: "tailor_6",
        name: "Fine Leather Order",
        description: "Bear leather is coarse but durable. Perfect for reinforcing a thick traveling coat.",
        requirements: [
          { type: "item", item: "Bear Skin", rarity: "Uncommon", quantity: 1, description: "Collect 1 Bear Skin" },
        ],
        reward: { gold: 140, item: "Cloth Shirt", description: "140 Gold + Cloth Shirt" },
      },
      {
        id: "tailor_7",
        name: "Rope and String",
        description: "Strong rope is a staple of my work. Bring me enough to resupply.",
        requirements: [
          { type: "item", item: "Rope", rarity: "Common", quantity: 3, description: "Collect 3 Rope" },
        ],
        reward: { gold: 50, description: "50 Gold" },
      },
    ],
  },
  {
    id: "alchemist",
    name: "Alchemist",
    title: "The Brew Master",
    description:
      "An eccentric scholar obsessed with potions and reagents. She will pay generously for raw magical materials and alchemical samples.",
    accentColor: "#6bbf8e",
    quests: [
      {
        id: "alchemist_1",
        name: "Crude Samples",
        description:
          "Even crude healing potions give me valuable data to work with. Bring me a batch.",
        requirements: [
          { type: "item", item: "Healing Potion", rarity: "Common", quantity: 3, description: "Collect 3 Healing Potions" },
        ],
        reward: { gold: 60, description: "60 Gold" },
      },
      {
        id: "alchemist_2",
        name: "Crystal Harvest",
        description: "Rough crystal from the mines is the base for half my formulas. I need more.",
        requirements: [
          { type: "item", item: "Rough Crystal", rarity: "Common", quantity: 4, description: "Collect 4 Rough Crystals" },
        ],
        reward: { gold: 80, description: "80 Gold" },
      },
      {
        id: "alchemist_3",
        name: "Antidote Requisition",
        description: "Antidotes are in high demand and short supply. Bring me what you find.",
        requirements: [
          { type: "item", item: "Antidote Potion", rarity: "Uncommon", quantity: 3, description: "Collect 3 Antidote Potions" },
        ],
        reward: { gold: 100, description: "100 Gold" },
      },
      {
        id: "alchemist_4",
        name: "Magical Infusion Study",
        description:
          "Refined magic crystals hold properties I've barely begun to understand. Bring me specimens.",
        requirements: [
          { type: "item", item: "Magic Crystal", rarity: "Rare", quantity: 3, description: "Collect 3 Magic Crystals" },
        ],
        reward: { gold: 130, description: "130 Gold" },
      },
      {
        id: "alchemist_5",
        name: "Mana Potion Analysis",
        description: "There's something unusual about the mana potions coming out of that dungeon. I need to study them.",
        requirements: [
          { type: "item", item: "Potion of Mana", rarity: "Common", quantity: 3, description: "Collect 3 Potions of Mana" },
        ],
        reward: { gold: 90, description: "90 Gold" },
      },
      {
        id: "alchemist_6",
        name: "Darkwood Shroom",
        description: "The luminous mushrooms found in the lower depths have fascinating catalytic properties.",
        requirements: [
          { type: "item", item: "Glowing Mushroom", rarity: "Uncommon", quantity: 5, description: "Collect 5 Glowing Mushrooms" },
        ],
        reward: { gold: 120, item: "Potion of Haste", description: "120 Gold + Potion of Haste" },
      },
    ],
  },
  {
    id: "woodsman",
    name: "Woodsman",
    title: "The Forest Keeper",
    description:
      "A grizzled hunter who knows the wilderness better than any dungeon crawler. He deals in animal materials, hides, and trophies.",
    accentColor: "#8ab87a",
    quests: [
      {
        id: "woodsman_1",
        name: "Wolf Pack Problem",
        description:
          "Wolves have been prowling near the entrance again. Thin the pack and bring me proof.",
        requirements: [
          { type: "kill", monster: "Wolf", quantity: 5, description: "Kill 5 Wolves" },
        ],
        reward: { gold: 70, description: "70 Gold" },
      },
      {
        id: "woodsman_2",
        name: "Pelt Collection",
        description: "Wolf pelt is prime material. Bring me a good stack.",
        requirements: [
          { type: "item", item: "Wolf Pelt", rarity: "Common", quantity: 4, description: "Collect 4 Wolf Pelts" },
        ],
        reward: { gold: 80, description: "80 Gold" },
      },
      {
        id: "woodsman_3",
        name: "Antler Trophy",
        description: "Deer antler makes for strong tools and fine decoration. Bring me a pair.",
        requirements: [
          { type: "item", item: "Deer Antler", rarity: "Common", quantity: 2, description: "Collect 2 Deer Antlers" },
        ],
        reward: { gold: 90, description: "90 Gold" },
      },
      {
        id: "woodsman_4",
        name: "Bat Wing Harvest",
        description:
          "The cavern bats are a nuisance, but their wings are useful. Bring me a collection.",
        requirements: [
          { type: "item", item: "Bat Wing", rarity: "Common", quantity: 5, description: "Collect 5 Bat Wings" },
        ],
        reward: { gold: 75, description: "75 Gold" },
      },
      {
        id: "woodsman_5",
        name: "Bear Bounty",
        description: "A bear has taken up residence in the eastern wing. Deal with it and bring back the skin.",
        requirements: [
          { type: "kill", monster: "Cave Troll", quantity: 1, description: "Kill 1 Cave Troll" },
          { type: "item", item: "Bear Skin", rarity: "Uncommon", quantity: 1, description: "Collect 1 Bear Skin" },
        ],
        reward: { gold: 200, item: "Forest Cloak", description: "200 Gold + Forest Cloak" },
      },
      {
        id: "woodsman_6",
        name: "Bone Collection",
        description: "Bone fragments and scraps are surprisingly useful for tools and trade.",
        requirements: [
          { type: "item", item: "Bone Fragment", rarity: "Poor", quantity: 8, description: "Collect 8 Bone Fragments" },
        ],
        reward: { gold: 60, description: "60 Gold" },
      },
      {
        id: "woodsman_7",
        name: "Living Off the Land",
        description: "Prove you can survive a run without any bought equipment. I respect self-sufficiency.",
        requirements: [
          { type: "survive", description: "Complete a dungeon run and extract successfully" },
          { type: "extract", description: "Extract from Goblin Caves" },
        ],
        reward: { gold: 150, description: "150 Gold" },
      },
    ],
  },
  {
    id: "surgeon",
    name: "Surgeon",
    title: "The Field Medic",
    description:
      "A steady-handed healer who patches up adventurers — for a price. She collects medical supplies from the dungeon to maintain her stock.",
    accentColor: "#cf9e6b",
    quests: [
      {
        id: "surgeon_1",
        name: "Bandage Supply",
        description: "My bandage supply never lasts long. Bring me whatever you find out there.",
        requirements: [
          { type: "item", item: "Bandage", rarity: "Common", quantity: 6, description: "Collect 6 Bandages" },
        ],
        reward: { gold: 50, description: "50 Gold" },
      },
      {
        id: "surgeon_2",
        name: "Tourniquet Recovery",
        description:
          "Tourniquets save lives, and adventurers leave them behind constantly. Collect them for me.",
        requirements: [
          { type: "item", item: "Torniquet", rarity: "Common", quantity: 3, description: "Collect 3 Torniquets" },
        ],
        reward: { gold: 80, description: "80 Gold" },
      },
      {
        id: "surgeon_3",
        name: "Healing Potion Procurement",
        description:
          "I use healing potions constantly for emergency treatment. Keep my shelves stocked.",
        requirements: [
          { type: "item", item: "Healing Potion", rarity: "Common", quantity: 4, description: "Collect 4 Healing Potions" },
        ],
        reward: { gold: 100, description: "100 Gold" },
      },
      {
        id: "surgeon_4",
        name: "Field Kit Components",
        description: "A proper surgeon's kit is worth more than any sword to someone bleeding out.",
        requirements: [
          { type: "item", item: "Bandage", rarity: "Common", quantity: 4, description: "Collect 4 Bandages" },
          { type: "item", item: "Torniquet", rarity: "Common", quantity: 2, description: "Collect 2 Torniquets" },
        ],
        reward: { gold: 160, item: "Potion of Invisibility", description: "160 Gold + Potion of Invisibility" },
      },
      {
        id: "surgeon_5",
        name: "Antidote Stockpile",
        description:
          "Poison is common in those dungeons. I need antidotes on hand for when people crawl back in.",
        requirements: [
          { type: "item", item: "Antidote Potion", rarity: "Uncommon", quantity: 4, description: "Collect 4 Antidote Potions" },
        ],
        reward: { gold: 120, description: "120 Gold" },
      },
    ],
  },
  {
    id: "wizard",
    name: "Wizard",
    title: "The Arcane Scholar",
    description:
      "An aged scholar obsessed with cataloguing magical artifacts and scrolls from the dungeon. He pays handsomely for items of arcane interest.",
    accentColor: "#9b7fc4",
    quests: [
      {
        id: "wizard_1",
        name: "Ruined Scroll Recovery",
        description:
          "Even damaged scrolls carry traces of their original enchantments. Bring me what you find.",
        requirements: [
          { type: "item", item: "Ruined Scroll", rarity: "Poor", quantity: 4, description: "Collect 4 Ruined Scrolls" },
        ],
        reward: { gold: 70, description: "70 Gold" },
      },
      {
        id: "wizard_2",
        name: "A Scroll of Knowledge",
        description:
          "A scroll of knowledge is worth more to me than any treasure. Bring one back intact.",
        requirements: [
          { type: "item", item: "Scroll of Knowledge", rarity: "Rare", quantity: 1, description: "Recover 1 Scroll of Knowledge" },
        ],
        reward: { gold: 200, description: "200 Gold" },
      },
      {
        id: "wizard_3",
        name: "Crystal Attunement",
        description: "Magic crystals from the dungeon hum with residual energy I need to study.",
        requirements: [
          { type: "item", item: "Magic Crystal", rarity: "Rare", quantity: 4, description: "Collect 4 Magic Crystals" },
        ],
        reward: { gold: 150, description: "150 Gold" },
      },
      {
        id: "wizard_4",
        name: "Lantern Acquisition",
        description:
          "The magical lanterns down there never seem to run out of fuel. I want one for study.",
        requirements: [
          { type: "item", item: "Lantern", rarity: "Common", quantity: 2, description: "Recover 2 Lanterns" },
        ],
        reward: { gold: 130, description: "130 Gold" },
      },
      {
        id: "wizard_5",
        name: "Spellbook Fragment",
        description:
          "A spellbook from the old era would be the crown jewel of my collection. Find one.",
        requirements: [
          { type: "item", item: "Spellbook", rarity: "Epic", quantity: 1, description: "Recover 1 Spellbook" },
        ],
        reward: { gold: 350, item: "Wizard Hat", description: "350 Gold + Wizard Hat" },
      },
      {
        id: "wizard_6",
        name: "Mystic Ore",
        description: "Rough crystal embedded in ore still carries residual magical charge. I need samples.",
        requirements: [
          { type: "item", item: "Rough Crystal", rarity: "Common", quantity: 5, description: "Collect 5 Rough Crystals" },
        ],
        reward: { gold: 110, description: "110 Gold" },
      },
    ],
  },
  {
    id: "collector",
    name: "Collector",
    title: "The Antiquarian",
    description:
      "A well-dressed merchant with an eye for rarities. He pays top gold for jewelry, precious stones, artifacts, and items of unusual value.",
    accentColor: "#c9a84c",
    quests: [
      {
        id: "collector_1",
        name: "Rings of Interest",
        description:
          "A ring recovered from the dungeon carries history. Bring me what you find, condition is secondary.",
        requirements: [
          { type: "item", item: "Ring", rarity: "Common", quantity: 2, description: "Recover 2 Rings" },
        ],
        reward: { gold: 150, description: "150 Gold" },
      },
      {
        id: "collector_2",
        name: "Necklace Appraisal",
        description:
          "Necklaces are often enchanted. I collect them to study and occasionally resell.",
        requirements: [
          { type: "item", item: "Necklace", rarity: "Uncommon", quantity: 1, description: "Recover 1 Necklace" },
        ],
        reward: { gold: 120, description: "120 Gold" },
      },
      {
        id: "collector_3",
        name: "Golden Relic",
        description:
          "A golden goblet from the old era is worth a small fortune to the right buyer.",
        requirements: [
          { type: "item", item: "Golden Goblet", rarity: "Rare", quantity: 1, description: "Recover 1 Golden Goblet" },
        ],
        reward: { gold: 300, description: "300 Gold" },
      },
      {
        id: "collector_4",
        name: "Coin Collection",
        description: "Old coins fetch a fine price from historians. Bring me a good haul.",
        requirements: [
          { type: "item", item: "Gold Coin", rarity: "Common", quantity: 10, description: "Collect 10 Gold Coins" },
        ],
        reward: { gold: 200, description: "200 Gold" },
      },
      {
        id: "collector_5",
        name: "Precious Gemstone",
        description: "A flawless ruby would complete my current collection. I'd pay handsomely.",
        requirements: [
          { type: "item", item: "Ruby", rarity: "Rare", quantity: 1, description: "Recover 1 Ruby" },
        ],
        reward: { gold: 400, description: "400 Gold" },
      },
      {
        id: "collector_6",
        name: "The Grand Artifact",
        description:
          "There are rumors of a true artifact buried in the deeper floors. I want it — bring it back in one piece.",
        requirements: [
          { type: "item", item: "Mystical Orb", rarity: "Epic", quantity: 1, description: "Recover 1 Mystical Orb" },
          { type: "extract", description: "Extract successfully from the Ruins" },
        ],
        reward: { gold: 600, item: "Sapphire Ring", description: "600 Gold + Sapphire Ring" },
      },
    ],
  },
  {
    id: "miller",
    name: "Miller",
    title: "The Provisions Master",
    description:
      "A practical merchant who keeps the camp fed. He deals in foodstuffs, grain, and everyday provisions — the unglamorous backbone of any expedition.",
    accentColor: "#c4a96b",
    quests: [
      {
        id: "miller_1",
        name: "Grain Haul",
        description:
          "Food is as important as steel down there. Bring me grain flour and I'll keep the camp fed.",
        requirements: [
          { type: "item", item: "Grain Flour", rarity: "Common", quantity: 5, description: "Collect 5 Grain Flour" },
        ],
        reward: { gold: 45, description: "45 Gold" },
      },
      {
        id: "miller_2",
        name: "Water Run",
        description:
          "Fresh water is harder to find than you'd think in those ruins. Bring me as much as you can carry.",
        requirements: [
          { type: "item", item: "Water", rarity: "Common", quantity: 4, description: "Collect 4 Water" },
        ],
        reward: { gold: 40, description: "40 Gold" },
      },
      {
        id: "miller_3",
        name: "Provisions Recovery",
        description: "Adventurers leave food behind constantly. Retrieve it — I don't care if it's been in a dead man's pack.",
        requirements: [
          { type: "item", item: "Provisions", rarity: "Common", quantity: 5, description: "Collect 5 Provisions" },
        ],
        reward: { gold: 55, description: "55 Gold" },
      },
      {
        id: "miller_4",
        name: "Dried Meat Supply",
        description: "Dried meat keeps for weeks. Bring me a supply to trade with the fighters.",
        requirements: [
          { type: "item", item: "Dried Meat", rarity: "Common", quantity: 4, description: "Collect 4 Dried Meat" },
        ],
        reward: { gold: 60, description: "60 Gold" },
      },
      {
        id: "miller_5",
        name: "Mushroom Bounty",
        description:
          "The mushrooms growing in the dungeon are strange but edible. Bring me a large collection for study.",
        requirements: [
          { type: "item", item: "Mushroom", rarity: "Common", quantity: 6, description: "Collect 6 Mushrooms" },
        ],
        reward: { gold: 50, description: "50 Gold" },
      },
      {
        id: "miller_6",
        name: "Full Larder",
        description: "I need a wide variety of goods to restock fully after last season's shortage.",
        requirements: [
          { type: "item", item: "Provisions", rarity: "Common", quantity: 3, description: "Collect 3 Provisions" },
          { type: "item", item: "Dried Meat", rarity: "Common", quantity: 2, description: "Collect 2 Dried Meat" },
          { type: "item", item: "Grain Flour", rarity: "Common", quantity: 2, description: "Collect 2 Grain Flour" },
        ],
        reward: { gold: 180, item: "Torch", description: "180 Gold + Torch" },
      },
    ],
  },
];

// Derive a flat list of all quest items with context, deduplicated by item name + aggregated
export interface QuestItemEntry {
  item: string;
  rarity: string;
  appearances: { traderName: string; questName: string; quantity: number }[];
  totalQuantity: number;
}

export function getQuestItems(): QuestItemEntry[] {
  const map = new Map<string, QuestItemEntry>();

  for (const trader of TRADERS) {
    for (const quest of trader.quests) {
      for (const req of quest.requirements) {
        if (req.type !== "item" || !req.item) continue;
        const key = req.item;
        if (!map.has(key)) {
          map.set(key, { item: key, rarity: req.rarity ?? "Common", appearances: [], totalQuantity: 0 });
        }
        const entry = map.get(key)!;
        entry.appearances.push({
          traderName: trader.name,
          questName: quest.name,
          quantity: req.quantity ?? 1,
        });
        entry.totalQuantity += req.quantity ?? 1;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.item.localeCompare(b.item));
}
