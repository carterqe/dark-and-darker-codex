export interface QuestRequirement {
  type: "item" | "kill" | "extract" | "survive" | "explore" | "interact" | "destroy" | "use";
  description: string;
  item?: string;
  rarity?: string;
  monster?: string;
  location?: string;
  quantity?: number;
}

export interface QuestReward {
  gold?: number;
  xp?: number;
  affinity?: number;
  item?: string;
  description: string;
}

export interface Quest {
  id: string;
  name: string;
  chapter?: string;
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
  // ─── ALCHEMIST ─────────────────────────────────────────────────────────────
  {
    id: "alchemist",
    name: "Alchemist",
    title: "The Brew Master",
    description:
      "An eccentric scholar who now handles potions, reagents, and medical supplies after absorbing the camp's former Surgeon and Fortune Teller roles. She pays generously for alchemical samples, healing materials, and arcane curiosities from across the dungeons.",
    accentColor: "#6bbf8e",
    quests: [
      // Chapter 1 – Other Solutions
      {
        id: "alchemist_1",
        name: "Hidden Within The Lines",
        chapter: "Other Solutions",
        description: "There are secrets buried in the Crypt Chapel that no amount of brewing can reveal. I need you to explore it firsthand.",
        requirements: [
          { type: "explore", location: "Crypt Chapel", quantity: 1, description: "Explore the Crypt Chapel" },
        ],
        reward: { gold: 30, xp: 25, affinity: 25, description: "30 Gold, +25 XP, +25 Affinity" },
      },
      {
        id: "alchemist_2",
        name: "Test Run",
        chapter: "Other Solutions",
        description: "Certain herbs have alchemical potential I haven't fully mapped. Bring back fresh specimens for my laboratory.",
        requirements: [
          { type: "item", item: "Phantom Flower", rarity: "Common", quantity: 1, description: "Collect 1 Phantom Flower" },
          { type: "item", item: "Wardweed", rarity: "Common", quantity: 1, description: "Collect 1 Wardweed" },
          { type: "item", item: "Lifeleaf", rarity: "Common", quantity: 1, description: "Collect 1 Lifeleaf" },
        ],
        reward: { gold: 30, xp: 25, description: "30 Gold, Random Uncommon Weapon, +25 XP" },
      },
      {
        id: "alchemist_3",
        name: "Hocus Pocus",
        chapter: "Other Solutions",
        description: "Dark components from the Crypt are the base of my most potent formulae. Don't ask what they're for.",
        requirements: [
          { type: "item", item: "Broken Skull", rarity: "Common", quantity: 2, description: "Collect 2 Broken Skulls" },
          { type: "item", item: "Grave Essence", rarity: "Common", quantity: 1, description: "Collect 1 Grave Essence" },
          { type: "item", item: "Maggots", rarity: "Common", quantity: 2, description: "Collect 2 Maggots" },
        ],
        reward: { gold: 30, xp: 25, affinity: 25, description: "30 Gold, Random Uncommon Armor, +25 XP, +25 Affinity" },
      },
      // Chapter 2 – Always Intrigued
      {
        id: "alchemist_4",
        name: "Mixing Things Up",
        chapter: "Always Intrigued",
        description: "I need field data on how potions interact with one another. Use one of each type in a single Crypt run.",
        requirements: [
          { type: "use", item: "Potion of Healing", location: "Crypt", quantity: 1, description: "Use 1 Potion of Healing in the Crypt" },
          { type: "use", item: "Potion of Protection", location: "Crypt", quantity: 1, description: "Use 1 Potion of Protection in the Crypt" },
          { type: "use", item: "Potion of Invisibility", location: "Crypt", quantity: 1, description: "Use 1 Potion of Invisibility in the Crypt" },
          { type: "use", item: "Potion of Magic Protection", location: "Crypt", quantity: 1, description: "Use 1 Potion of Magic Protection in the Crypt (single session)" },
        ],
        reward: { gold: 75, xp: 125, description: "75 Gold, Random Uncommon Weapon, +125 XP" },
      },
      {
        id: "alchemist_5",
        name: "Death In The Air",
        chapter: "Always Intrigued",
        description: "Death Skulls drift through the Crypt with unusual arcane signatures. I need you to eliminate a cluster for study.",
        requirements: [
          { type: "kill", monster: "Death Skull", location: "Crypt", quantity: 5, description: "Kill 5 Death Skulls in the Crypt (single session)" },
        ],
        reward: { gold: 75, xp: 150, description: "75 Gold, 2× Random Uncommon Armor, +150 XP" },
      },
      {
        id: "alchemist_6",
        name: "Death Awakens",
        chapter: "Always Intrigued",
        description: "The undead of the Crypt grow restless. Thin their numbers — skeleton and wraith alike.",
        requirements: [
          { type: "kill", monster: "Skeleton Swordsman", location: "Crypt", quantity: 7, description: "Kill 7 Skeleton Swordsmen in the Crypt" },
          { type: "kill", monster: "Skeleton Axeman", location: "Crypt", quantity: 7, description: "Kill 7 Skeleton Axemen in the Crypt" },
          { type: "kill", monster: "Skeleton Archer", location: "Crypt", quantity: 7, description: "Kill 7 Skeleton Archers in the Crypt" },
          { type: "kill", monster: "Wraith", location: "Crypt", quantity: 2, description: "Kill 2 Wraiths in the Crypt" },
        ],
        reward: { gold: 75, xp: 150, affinity: 25, description: "75 Gold, Random Uncommon Weapon, Random Uncommon Armor, +150 XP, +25 Affinity" },
      },
      // Chapter 3 – The Darkness Within
      {
        id: "alchemist_7",
        name: "Oh Brother",
        chapter: "The Darkness Within",
        description: "My supply of healing compounds is dangerously low. Gather these potions and I'll continue the research.",
        requirements: [
          { type: "item", item: "Potion of Healing", rarity: "Common", quantity: 2, description: "Collect 2 Potions of Healing" },
          { type: "item", item: "Potion of Protection", rarity: "Common", quantity: 2, description: "Collect 2 Potions of Protection" },
          { type: "item", item: "Potion of Invisibility", rarity: "Common", quantity: 2, description: "Collect 2 Potions of Invisibility" },
        ],
        reward: { gold: 125, xp: 200, description: "125 Gold, 2× Rare Arcane Essence, Random Rare Armor, +200 XP" },
      },
      {
        id: "alchemist_8",
        name: "The Kobold's Chemistry",
        chapter: "The Darkness Within",
        description: "The Ice Kobolds have developed a crude alchemy of their own. Eliminate their practitioners and bring me data.",
        requirements: [
          { type: "kill", monster: "Ice Kobold Axeman", location: "Ice Cavern", quantity: 10, description: "Kill 10 Ice Kobold Axemen in the Ice Cavern" },
          { type: "kill", monster: "Ice Kobold Archer", location: "Ice Cavern", quantity: 10, description: "Kill 10 Ice Kobold Archers in the Ice Cavern" },
        ],
        reward: { gold: 125, xp: 250, description: "125 Gold, 2× Random Rare Weapon, +250 XP" },
      },
      {
        id: "alchemist_9",
        name: "More Than Meets the Eye",
        chapter: "The Darkness Within",
        description: "The Wolf Cave in the Ice Cavern holds unusual crystalline formations I haven't catalogued. Explore it.",
        requirements: [
          { type: "explore", location: "Ice Cavern — Wolf Cave", quantity: 1, description: "Explore the Wolf Cave in the Ice Cavern" },
        ],
        reward: { gold: 125, xp: 350, affinity: 25, description: "125 Gold, 2× Random Rare Armor, +350 XP, +25 Affinity" },
      },
      // Chapter 4 – Land for Alchemy
      {
        id: "alchemist_10",
        name: "The First Experimental Materials",
        chapter: "Land for Alchemy",
        description: "Lava Turtles carry hardened shell material with remarkable heat-resistance properties. Harvest them.",
        requirements: [
          { type: "kill", monster: "Lava Turtle", location: "The Ashen Range", quantity: 7, description: "Kill 7 Lava Turtles in the The Ashen Range" },
          { type: "item", item: "Hardened Shell Fragment", rarity: "Common", quantity: 4, description: "Collect 4 Hardened Shell Fragments" },
        ],
        reward: { gold: 125, xp: 200, description: "125 Gold, 4× Rare Arcane Essence, +200 XP" },
      },
      {
        id: "alchemist_11",
        name: "Dangerous Applications",
        chapter: "Land for Alchemy",
        description: "Lava Slimes contain a magma essence that could revolutionise heat-based transmutation.",
        requirements: [
          { type: "kill", monster: "Lava Slime", location: "The Ashen Range", quantity: 5, description: "Kill 5 Lava Slimes in the The Ashen Range" },
          { type: "item", item: "Magma Essence", rarity: "Uncommon", quantity: 3, description: "Collect 3 Magma Essences" },
        ],
        reward: { gold: 125, xp: 250, description: "125 Gold, 2× Random Rare Weapon, +250 XP" },
      },
      {
        id: "alchemist_12",
        name: "For Safe Experimentation",
        chapter: "Land for Alchemy",
        description: "Fire Spirits carry a flickering ember that burns without consuming fuel. I must study it.",
        requirements: [
          { type: "kill", monster: "Fire Spirit", location: "The Ashen Range", quantity: 3, description: "Kill 3 Fire Spirits in the The Ashen Range" },
          { type: "item", item: "Flickering Ember", rarity: "Uncommon", quantity: 2, description: "Collect 2 Flickering Embers" },
        ],
        reward: { gold: 125, xp: 350, description: "125 Gold, 2× Random Rare Armor, +350 XP" },
      },
      // Chapter 5 – Not For The Weak
      {
        id: "alchemist_13",
        name: "Secrets and Vermin",
        chapter: "Not For The Weak",
        description: "The hidden statue lever in the Crypt opens passages I've never mapped. Pull it — and deal with what comes.",
        requirements: [
          { type: "interact", item: "Hidden Statue Lever", location: "Crypt", quantity: 1, description: "Interact with the Hidden Statue Lever in the Crypt" },
          { type: "kill", monster: "Giant Worm", location: "Crypt", quantity: 3, description: "Kill 3 Giant Worms in the Crypt" },
        ],
        reward: { gold: 150, xp: 300, affinity: 25, description: "150 Gold, Random Epic Weapon, +300 XP, +25 Affinity" },
      },
      {
        id: "alchemist_14",
        name: "Vials and Venom",
        chapter: "Not For The Weak",
        description: "Spider pots throughout the Crypt contain a potent venom I need to neutralise — and collect.",
        requirements: [
          { type: "destroy", item: "Spider Pot", location: "Crypt", quantity: 13, description: "Destroy 13 Spider Pots in the Crypt" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Armor, +350 XP" },
      },
      {
        id: "alchemist_15",
        name: "Endure And Prevail",
        chapter: "Not For The Weak",
        description: "Sustained exposure to the Crypt's environment is the only way to measure long-term alchemical decay rates. Survive it.",
        requirements: [
          { type: "survive", location: "Crypt", quantity: 6, description: "Survive 6 runs in the Crypt" },
          { type: "kill", monster: "Skeleton", location: "Crypt", quantity: 44, description: "Kill 44 Skeletons in the Crypt" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 25, description: "150 Gold, 2× Random Epic Armor, +1000 XP, +25 Affinity" },
      },
      // Chapter 6 – The Path to the Inferno
      {
        id: "alchemist_16",
        name: "Expedition into the Inferno",
        chapter: "The Path to the Inferno",
        description: "The Inferno modules of the Crypt are untested ground for my research. Map them thoroughly.",
        requirements: [
          { type: "explore", location: "Crypt — Bloody Falls", quantity: 1, description: "Explore Bloody Falls in the Crypt" },
          { type: "explore", location: "Crypt — Hellcross Bridge", quantity: 1, description: "Explore Hellcross Bridge in the Crypt" },
          { type: "explore", location: "Crypt — Doom Cage", quantity: 1, description: "Explore Doom Cage in the Crypt" },
          { type: "explore", location: "Crypt — Drain", quantity: 1, description: "Explore the Drain in the Crypt" },
        ],
        reward: { gold: 200, xp: 500, description: "200 Gold, Random Epic Weapon, Random Epic Armor, 2× Epic Arcane Essence, +500 XP" },
      },
      {
        id: "alchemist_17",
        name: "Inferno Obstructors",
        chapter: "The Path to the Inferno",
        description: "Demon Berserkers block access to the deepest alchemical sites. Remove them — quickly.",
        requirements: [
          { type: "kill", monster: "Demon Berserker", location: "Crypt", quantity: 3, description: "Kill 3 Demon Berserkers in the Crypt (single session)" },
        ],
        reward: { gold: 200, xp: 500, description: "200 Gold, Random Epic Weapon, Random Epic Armor, 2× Epic Arcane Essence, +500 XP" },
      },
      {
        id: "alchemist_18",
        name: "A King Once Past",
        chapter: "The Path to the Inferno",
        description: "The Demon Overseer is the final obstacle to the Inferno's secrets. End his reign.",
        requirements: [
          { type: "kill", monster: "Demon Overseer", location: "Inferno", quantity: 1, description: "Kill the Demon Overseer in the Inferno" },
        ],
        reward: { gold: 200, xp: 1000, description: "200 Gold, Random Epic Weapon, Random Epic Armor, 2× Epic Arcane Essence, +1000 XP" },
      },
    ],
  },

  // ─── ARMOURER ──────────────────────────────────────────────────────────────
  {
    id: "armourer",
    name: "Armourer",
    title: "The Shield Warden",
    description:
      "A stoic craftsman who specializes in defensive equipment. He prizes quality metals and recovered armor specimens from all corners of the dungeon.",
    accentColor: "#8aabcf",
    quests: [
      // Chapter 1 – Second Chances
      {
        id: "armourer_1",
        name: "Forged from Ruin",
        chapter: "Second Chances",
        description: "Cobalt ore holds properties that ordinary iron cannot match. Bring me samples from the depths.",
        requirements: [
          { type: "item", item: "Cobalt Ore", rarity: "Common", quantity: 2, description: "Collect 2 Cobalt Ore" },
        ],
        reward: { gold: 50, xp: 50, affinity: 25, description: "50 Gold, 4× Uncommon Arcane Essence, +50 XP, +25 Affinity" },
      },
      {
        id: "armourer_2",
        name: "Damned Survivor",
        chapter: "Second Chances",
        description: "The undead swarm the Crypt in unusual formations. Eliminate them and I will study what you've seen.",
        requirements: [
          { type: "kill", monster: "Zombie", location: "Crypt", quantity: 5, description: "Kill 5 Zombies in the Crypt" },
          { type: "kill", monster: "Giant Dragonfly", location: "Crypt", quantity: 5, description: "Kill 5 Giant Dragonflies in the Crypt" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, 2× Random Uncommon Weapon, +50 XP" },
      },
      {
        id: "armourer_3",
        name: "Slipping Away",
        chapter: "Second Chances",
        description: "Recovered armor tells me more than any schematic. Bring back armor from the field.",
        requirements: [
          { type: "item", item: "Uncommon Armor", rarity: "Uncommon", quantity: 2, description: "Collect 2 pieces of Uncommon Armor" },
        ],
        reward: { gold: 50, xp: 75, affinity: 25, description: "50 Gold, 2× Random Uncommon Armor, +75 XP, +25 Affinity" },
      },
      // Chapter 2 – Guiding Light
      {
        id: "armourer_4",
        name: "Lobster Red",
        chapter: "Guiding Light",
        description: "Rubysilver ore has a warmth to it that suggests heat-resistant properties. I need samples immediately.",
        requirements: [
          { type: "item", item: "Rubysilver Ore", rarity: "Uncommon", quantity: 2, description: "Collect 2 Rubysilver Ore" },
        ],
        reward: { gold: 75, xp: 75, description: "75 Gold, Random Rare Armor, +75 XP" },
      },
      {
        id: "armourer_5",
        name: "Graveyard Shift",
        chapter: "Guiding Light",
        description: "The Crypt Graveyard module holds ruins of old equipment I haven't been able to examine.",
        requirements: [
          { type: "explore", location: "Crypt — Graveyard", quantity: 1, description: "Explore the Crypt Graveyard" },
        ],
        reward: { gold: 100, xp: 100, description: "100 Gold, Random Rare Armor, +100 XP" },
      },
      {
        id: "armourer_6",
        name: "Something Supernatural",
        chapter: "Guiding Light",
        description: "Wisps and slimes corrode armor at an unusual rate. Study them — by elimination.",
        requirements: [
          { type: "kill", monster: "Wisp", location: "Crypt", quantity: 7, description: "Kill 7 Wisps in the Crypt" },
          { type: "kill", monster: "Slime", location: "Crypt", quantity: 7, description: "Kill 7 Slimes in the Crypt" },
        ],
        reward: { gold: 100, xp: 100, description: "100 Gold, Random Rare Weapon, +100 XP" },
      },
      // Chapter 3 – Armor to Withstand the Sea
      {
        id: "armourer_7",
        name: "Ore of the Blue Maelstrom",
        chapter: "Armor to Withstand the Sea",
        description: "Tidestone ore from the ShipGraveyard is unlike anything I've worked with. I need a supply.",
        requirements: [
          { type: "item", item: "Tidestone Ore", rarity: "Uncommon", quantity: 3, description: "Collect 3 Tidestone Ore" },
        ],
        reward: { gold: 100, xp: 175, description: "100 Gold, 2× Random Rare Armor, +175 XP" },
      },
      {
        id: "armourer_8",
        name: "Shells and Spines",
        chapter: "Armor to Withstand the Sea",
        description: "Natural armor from the sea's creatures outperforms anything I forge. I need specimens to reverse-engineer.",
        requirements: [
          { type: "item", item: "Hard Crab Shell", rarity: "Common", quantity: 3, description: "Collect 3 Hard Crab Shells" },
          { type: "item", item: "Sharp Sea Urchin Spine", rarity: "Common", quantity: 3, description: "Collect 3 Sharp Sea Urchin Spines" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, Random Rare Weapon, Random Rare Armor, +200 XP" },
      },
      {
        id: "armourer_9",
        name: "Monsters Among the Waves",
        chapter: "Armor to Withstand the Sea",
        description: "The Tidewalkers guard their territory fiercely. Cut through them and report on how their armor holds.",
        requirements: [
          { type: "kill", monster: "Tidewalker Spearer", location: "ShipGraveyard", quantity: 10, description: "Kill 10 Tidewalker Spearers in the ShipGraveyard" },
          { type: "kill", monster: "Tidewalker Clubfighter", location: "ShipGraveyard", quantity: 10, description: "Kill 10 Tidewalker Clubfighters in the ShipGraveyard" },
          { type: "kill", monster: "Tidewalker Shaman", location: "ShipGraveyard", quantity: 5, description: "Kill 5 Tidewalker Shamans in the ShipGraveyard" },
        ],
        reward: { gold: 100, xp: 175, affinity: 25, description: "100 Gold, Random Rare Weapon, Random Rare Armor, +175 XP, +25 Affinity" },
      },
      // Chapter 4 – Tough Stuff
      {
        id: "armourer_10",
        name: "The Difference in Craftsmanship",
        chapter: "Tough Stuff",
        description: "Precision tools are the backbone of any quality armorer's work. Bring me what can be salvaged.",
        requirements: [
          { type: "item", item: "Hourglass", rarity: "Common", quantity: 2, description: "Collect 2 Hourglasses" },
          { type: "item", item: "Walking Cane", rarity: "Common", quantity: 2, description: "Collect 2 Walking Canes" },
        ],
        reward: { gold: 150, xp: 300, affinity: 25, description: "150 Gold, 2× Random Rare Armor, +300 XP, +25 Affinity" },
      },
      {
        id: "armourer_11",
        name: "Ale-Soaked Insights",
        chapter: "Tough Stuff",
        description: "The Crypt Stables held soldiers in their day. The armor left behind may still teach me something.",
        requirements: [
          { type: "explore", location: "Crypt — Stables", quantity: 1, description: "Explore the Crypt Stables" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Armor, +350 XP" },
      },
      {
        id: "armourer_12",
        name: "Death's Knight",
        chapter: "Tough Stuff",
        description: "The Spectral Knight is the ultimate test of any armor's endurance. Destroy it.",
        requirements: [
          { type: "kill", monster: "Spectral Knight", location: "Crypt", quantity: 1, description: "Kill the Spectral Knight in the Crypt" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, Random Epic Weapon, Random Epic Armor, +1000 XP, +50 Affinity" },
      },
      // Chapter 5 – Harsh Truth
      {
        id: "armourer_13",
        name: "Infectious Inspection",
        chapter: "Harsh Truth",
        description: "Infected flesh and bandages are destroying the armor I loan out. I need to understand what we're dealing with.",
        requirements: [
          { type: "item", item: "Infected Flesh", rarity: "Common", quantity: 10, description: "Collect 10 Infected Flesh" },
          { type: "item", item: "Old Bloody Bandage", rarity: "Common", quantity: 10, description: "Collect 10 Old Bloody Bandages" },
          { type: "kill", monster: "Zombie", location: "Crypt", quantity: 25, description: "Kill 25 Zombies in the Crypt" },
          { type: "kill", monster: "Mummy", location: "Crypt", quantity: 25, description: "Kill 25 Mummies in the Crypt" },
        ],
        reward: { gold: 150, xp: 300, affinity: 25, description: "150 Gold, 2× Random Epic Weapon, +300 XP, +25 Affinity" },
      },
      {
        id: "armourer_14",
        name: "Monsters and Traps",
        chapter: "Harsh Truth",
        description: "The Crypt's traps are more sophisticated than any smith I know. I need activation data.",
        requirements: [
          { type: "interact", item: "Axe Trap", location: "Crypt", quantity: 15, description: "Activate 15 Axe Traps in the Crypt" },
          { type: "interact", item: "Wall Spike", location: "Crypt", quantity: 15, description: "Activate 15 Wall Spikes in the Crypt" },
          { type: "interact", item: "Floor Spikes", location: "Crypt", quantity: 15, description: "Activate 15 Floor Spikes in the Crypt" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, 4× Epic Arcane Essence, +350 XP" },
      },
      {
        id: "armourer_15",
        name: "Deepening Suspicion",
        chapter: "Harsh Truth",
        description: "I need a comprehensive map of the Crypt's modules. Explore every chamber that matters.",
        requirements: [
          { type: "explore", location: "Crypt — 15 Modules", quantity: 15, description: "Explore 15 distinct Crypt modules (Admirer's Room, Barracks, Catacomb, Wheel, Cliffs, Center Altar, Hallways, Pyramid, Broken Bridge, Cistern, Fishing Grounds, Sewers, Storeroom, Prisons B, Center Bridge)" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, 2× Random Epic Armor, +1000 XP, +50 Affinity" },
      },
    ],
  },

  // ─── GOBLIN MERCHANT ───────────────────────────────────────────────────────
  {
    id: "goblin_merchant",
    name: "Goblin Merchant",
    title: "The Green Dealer",
    description:
      "A treacherous but resourceful goblin who has abandoned his kin for profit. He deals in goblin trophies, cave materials, and the spoils of chaos.",
    accentColor: "#4a9a3f",
    quests: [
      // Chapter 1 – Kin No More
      {
        id: "goblin_1",
        name: "Away With The Green Skins",
        chapter: "Kin No More",
        description: "My kin make for lousy business partners. Thin their numbers in the The Ashen Range.",
        requirements: [
          { type: "kill", monster: "Goblin Axeman", location: "The Ashen Range", quantity: 3, description: "Kill 3 Goblin Axemen in the The Ashen Range" },
          { type: "kill", monster: "Goblin Warrior", location: "The Ashen Range", quantity: 3, description: "Kill 3 Goblin Warriors in the The Ashen Range" },
          { type: "kill", monster: "Goblin Archer", location: "The Ashen Range", quantity: 3, description: "Kill 3 Goblin Archers in the The Ashen Range" },
        ],
        reward: { gold: 30, xp: 25, description: "30 Gold, Random Uncommon Armor, +25 XP" },
      },
      {
        id: "goblin_2",
        name: "Gobbo's Favorite Fleshy",
        chapter: "Kin No More",
        description: "The Cave Altar is where my kin make their sacrifices. Go see what they're leaving behind.",
        requirements: [
          { type: "explore", location: "The Ashen Range — Cave Altar A", quantity: 1, description: "Explore the Cave Altar in the The Ashen Range" },
        ],
        reward: { gold: 30, xp: 25, description: "30 Gold, Random Uncommon Weapon, +25 XP" },
      },
      {
        id: "goblin_3",
        name: "A Goblin's Pride",
        chapter: "Kin No More",
        description: "Goblin ears fetch a high price from the right buyers — don't ask questions.",
        requirements: [
          { type: "item", item: "Goblin Ear", rarity: "Common", quantity: 4, description: "Collect 4 Goblin Ears" },
        ],
        reward: { gold: 30, xp: 40, affinity: 25, description: "30 Gold, Random Uncommon Armor, +40 XP, +25 Affinity" },
      },
      // Chapter 2 – Make Them Pay
      {
        id: "goblin_4",
        name: "Questionable Ingredients",
        chapter: "Make Them Pay",
        description: "A bug shell from the The Ashen Range — don't ask what I'm cooking. You don't want to know.",
        requirements: [
          { type: "item", item: "Bug Shell", rarity: "Common", quantity: 1, description: "Collect 1 Bug Shell" },
        ],
        reward: { gold: 50, xp: 75, description: "50 Gold, 3× Common Surgical Kit, Random Uncommon Weapon, +75 XP" },
      },
      {
        id: "goblin_5",
        name: "Gobbo's Famous Grubs",
        chapter: "Make Them Pay",
        description: "Mages, centipedes, spiders — all taste better than they look. Clear them out of my cave.",
        requirements: [
          { type: "kill", monster: "Goblin Mage", location: "The Ashen Range", quantity: 3, description: "Kill 3 Goblin Mages in the The Ashen Range" },
          { type: "kill", monster: "Giant Centipede", location: "The Ashen Range", quantity: 2, description: "Kill 2 Giant Centipedes in the The Ashen Range" },
          { type: "kill", monster: "Giant Spider", location: "The Ashen Range", quantity: 3, description: "Kill 3 Giant Spiders in the The Ashen Range" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, 2× Random Uncommon Armor, +50 XP" },
      },
      {
        id: "goblin_6",
        name: "The Way Out",
        chapter: "Make Them Pay",
        description: "Surviving the The Ashen Range is harder than it looks. Prove you can do it repeatedly.",
        requirements: [
          { type: "survive", location: "The Ashen Range", quantity: 3, description: "Survive 3 runs in the The Ashen Range" },
        ],
        reward: { gold: 50, xp: 50, affinity: 25, description: "50 Gold, Random Uncommon Armor, Random Uncommon Weapon, +50 XP, +25 Affinity" },
      },
      // Chapter 3 – Gobbo's Little Trick
      {
        id: "goblin_7",
        name: "Easy Pickings",
        chapter: "Gobbo's Little Trick",
        description: "The ash piles in the The Ashen Range hide things my kin left behind. Sift through them.",
        requirements: [
          { type: "interact", item: "Ash Pile", location: "The Ashen Range", quantity: 5, description: "Search 5 Ash Piles in the The Ashen Range" },
        ],
        reward: { gold: 50, xp: 75, description: "50 Gold, 2× Uncommon Arcane Essence, +75 XP" },
      },
      {
        id: "goblin_8",
        name: "An Unforgettable Taste",
        chapter: "Gobbo's Little Trick",
        description: "Fire Lizard tail is the finest ingredient in my culinary arsenal. Harvest them and bring me the tail.",
        requirements: [
          { type: "kill", monster: "Fire Lizard", location: "The Ashen Range", quantity: 10, description: "Kill 10 Fire Lizards in the The Ashen Range" },
          { type: "item", item: "Blazing Tail", rarity: "Common", quantity: 1, description: "Collect 1 Blazing Tail" },
        ],
        reward: { gold: 50, xp: 75, description: "50 Gold, Random Uncommon Armor, Random Uncommon Weapon, +75 XP" },
      },
      {
        id: "goblin_9",
        name: "One Very Hot Bite",
        chapter: "Gobbo's Little Trick",
        description: "Lava mushrooms grow only in the hottest corners of the cave. They're worth more than gold to me.",
        requirements: [
          { type: "item", item: "Lava Mushroom", rarity: "Common", quantity: 5, description: "Collect 5 Lava Mushrooms" },
        ],
        reward: { gold: 50, xp: 100, description: "50 Gold, 2× Random Uncommon Armor, 2× Random Uncommon Weapon, +100 XP" },
      },
      // Chapter 4 – Favorite Soft Skin
      {
        id: "goblin_10",
        name: "A New Delicacy",
        chapter: "Favorite Soft Skin",
        description: "Death Beetles are armored pests but they contain something nutritious. Harvest them.",
        requirements: [
          { type: "kill", monster: "Death Beetle", location: "The Ashen Range", quantity: 5, description: "Kill 5 Death Beetles in the The Ashen Range" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 2× Rare Arcane Essence, Random Rare Armor, +200 XP" },
      },
      {
        id: "goblin_11",
        name: "Crate Chaos",
        chapter: "Favorite Soft Skin",
        description: "The Dwarven crates in the The Ashen Range are full of junk — but my junk. Smash them.",
        requirements: [
          { type: "destroy", item: "Dwarven Small Wooden Crate", location: "The Ashen Range", quantity: 15, description: "Destroy 15 Dwarven Small Wooden Crates in the The Ashen Range" },
        ],
        reward: { gold: 100, xp: 175, description: "100 Gold, 4× Rare Arcane Essence, +175 XP" },
      },
      {
        id: "goblin_12",
        name: "Gobo Brawl",
        chapter: "Favorite Soft Skin",
        description: "Beast Goblins are the meanest of my kind. Take out a pack of them in a single run.",
        requirements: [
          { type: "kill", monster: "Beast Goblin", location: "The Ashen Range", quantity: 12, description: "Kill 12 Beast Goblins in the The Ashen Range (single session)" },
        ],
        reward: { gold: 100, xp: 200, affinity: 25, description: "100 Gold, 3× Rare Surgical Kit, Random Rare Armor, +200 XP, +25 Affinity" },
      },
      // Chapter 5 – Greater Threats
      {
        id: "goblin_13",
        name: "Shiny Secrets",
        chapter: "Greater Threats",
        description: "The Lion's Head chests in the The Ashen Range are where my kin stash their best loot. Open two in a single run.",
        requirements: [
          { type: "interact", item: "Lion's Head Chest", location: "The Ashen Range", quantity: 2, description: "Open 2 Lion's Head Chests in the The Ashen Range (single session)" },
        ],
        reward: { gold: 150, xp: 300, affinity: 25, description: "150 Gold, 2× Random Rare Armor, +300 XP, +25 Affinity" },
      },
      {
        id: "goblin_14",
        name: "Gamba",
        chapter: "Greater Threats",
        description: "The Cave Pit Hall is where my kin throw their prisoners. Go look — and deal with the centipedes first.",
        requirements: [
          { type: "kill", monster: "Giant Centipede", location: "The Ashen Range", quantity: 2, description: "Kill 2 Giant Centipedes in the The Ashen Range" },
          { type: "explore", location: "The Ashen Range — Cave Pit Hall", quantity: 1, description: "Explore the Cave Pit Hall in the The Ashen Range" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Weapon, +350 XP" },
      },
      {
        id: "goblin_15",
        name: "One Eyed Foe",
        chapter: "Greater Threats",
        description: "The Cyclops is the biggest bully in the The Ashen Range — and I want his territory.",
        requirements: [
          { type: "kill", monster: "Cyclops", location: "The Ashen Range", quantity: 1, description: "Kill the Cyclops in the The Ashen Range" },
        ],
        reward: { gold: 375, xp: 1000, affinity: 50, description: "375 Gold, Unique Gold Coin Bag, +1000 XP, +50 Affinity" },
      },
    ],
  },

  // ─── LEATHERSMITH ──────────────────────────────────────────────────────────
  {
    id: "leathersmith",
    name: "Leathersmith",
    title: "The Hide Tanner",
    description:
      "A methodical craftsperson who works with hide, leather, and cloth. She seeks specimens from across the dungeons to refine her techniques.",
    accentColor: "#a07840",
    quests: [
      // Chapter 1 – Finding Hope
      {
        id: "leather_1",
        name: "Cap-tivating Adventures",
        chapter: "Finding Hope",
        description: "A leather cap is a start — bring me one from the dungeon and we'll see what you're made of.",
        requirements: [
          { type: "item", item: "Leather Cap", rarity: "Common", quantity: 1, description: "Collect 1 Leather Cap" },
        ],
        reward: { gold: 50, xp: 50, affinity: 25, description: "50 Gold, 2× Random Uncommon Armor, +50 XP, +25 Affinity" },
      },
      {
        id: "leather_2",
        name: "Time to Heal",
        chapter: "Finding Hope",
        description: "The Shrine of Health in the Crypt is a landmark I use to date old leather finds. Go and interact with it.",
        requirements: [
          { type: "interact", item: "Shrine of Health", location: "Crypt", quantity: 1, description: "Interact with a Shrine of Health in the Crypt" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, 2× Random Uncommon Weapon, +50 XP" },
      },
      {
        id: "leather_3",
        name: "Campfire Tales",
        chapter: "Finding Hope",
        description: "The Bandit Camp in the Crypt is full of abandoned leatherwork I haven't been able to recover.",
        requirements: [
          { type: "explore", location: "Crypt — Bandit Camp", quantity: 1, description: "Explore the Bandit Camp in the Crypt" },
        ],
        reward: { gold: 50, xp: 75, affinity: 25, description: "50 Gold, 2× Random Uncommon Armor, +75 XP, +25 Affinity" },
      },
      // Chapter 2 – Learning The Truth
      {
        id: "leather_4",
        name: "Oaken Up",
        chapter: "Learning The Truth",
        description: "The Oak Chests in the Ice Cavern are sealed with fine leatherwork I need to examine. Open ten in a single run.",
        requirements: [
          { type: "interact", item: "Oak Chest", location: "Ice Cavern", quantity: 10, description: "Open 10 Oak Chests in the Ice Cavern (single session)" },
        ],
        reward: { gold: 100, xp: 175, description: "100 Gold, 2× Random Uncommon Weapon, +175 XP" },
      },
      {
        id: "leather_5",
        name: "Frosty Encounters",
        chapter: "Learning The Truth",
        description: "Kobold ears and bones from the Ice Cavern are the raw material of the finest cold-weather leather.",
        requirements: [
          { type: "item", item: "Kobold's Ear", rarity: "Common", quantity: 2, description: "Collect 2 Kobold's Ears" },
          { type: "item", item: "Bone", rarity: "Common", quantity: 2, description: "Collect 2 Bones" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 2× Random Rare Weapon, +200 XP" },
      },
      {
        id: "leather_6",
        name: "Into The Abyss",
        chapter: "Learning The Truth",
        description: "Ice Hounds and Frost Sentinels have hide unlike anything I've tanned. Fight through them.",
        requirements: [
          { type: "kill", monster: "Ice Hound", location: "Ice Cavern", quantity: 3, description: "Kill 3 Ice Hounds in the Ice Cavern" },
          { type: "kill", monster: "Frost Sentinel", location: "Ice Cavern", quantity: 2, description: "Kill 2 Frost Sentinels in the Ice Cavern" },
        ],
        reward: { gold: 100, xp: 200, affinity: 25, description: "100 Gold, 2× Random Rare Armor, +200 XP, +25 Affinity" },
      },
      // Chapter 3 – Midnight Stories
      {
        id: "leather_7",
        name: "Whispers in the Ruins",
        chapter: "Midnight Stories",
        description: "Skeletons and Harpies in the Crypt have worn-through armor worth studying. Clear them in a single excursion.",
        requirements: [
          { type: "kill", monster: "Skeleton", location: "Crypt", quantity: 10, description: "Kill 10 Skeletons in the Crypt (single session)" },
          { type: "kill", monster: "Harpy", location: "Crypt", quantity: 2, description: "Kill 2 Harpies in the Crypt (single session)" },
        ],
        reward: { gold: 150, xp: 350, affinity: 25, description: "150 Gold, 2× Random Rare Armor, +350 XP, +25 Affinity" },
      },
      {
        id: "leather_8",
        name: "Dukes of The Dead",
        chapter: "Midnight Stories",
        description: "The elite undead of the Crypt wear the finest — and most damaged — leather I've ever seen. Defeat them all in a single run.",
        requirements: [
          { type: "kill", monster: "Wraith", location: "Crypt", quantity: 1, description: "Kill 1 Wraith in the Crypt (single session)" },
          { type: "kill", monster: "Skeleton Champion", location: "Crypt", quantity: 1, description: "Kill 1 Skeleton Champion in the Crypt (single session)" },
          { type: "kill", monster: "Demon Centaur", location: "Crypt", quantity: 1, description: "Kill 1 Demon Centaur in the Crypt (single session)" },
          { type: "kill", monster: "Demon Berserker", location: "Crypt", quantity: 1, description: "Kill 1 Demon Berserker in the Crypt (single session)" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Armor, +350 XP" },
      },
      {
        id: "leather_9",
        name: "Warlord's Bane",
        chapter: "Midnight Stories",
        description: "The Skeleton Warlord's armor is the pinnacle of undead craftsmanship. Destroy it — and bring me its secrets.",
        requirements: [
          { type: "kill", monster: "Skeleton Warlord", location: "Crypt", quantity: 1, description: "Kill the Skeleton Warlord in the Crypt" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, 2× Random Epic Armor, +1000 XP, +50 Affinity" },
      },
      // Chapter 4 – It's All In The Details
      {
        id: "leather_10",
        name: "Echoes of Memory",
        chapter: "It's All In The Details",
        description: "Specific outfit pieces from the dungeon will complete my reference collection. Find them.",
        requirements: [
          { type: "item", item: "Sturdy Cloth", rarity: "Common", quantity: 3, description: "Collect 3 Sturdy Cloth" },
          { type: "item", item: "Spider Silk", rarity: "Common", quantity: 3, description: "Collect 3 Spider Silk" },
          { type: "item", item: "Rare Warden Outfit", rarity: "Rare", quantity: 1, description: "Collect 1 Rare Warden Outfit" },
          { type: "item", item: "Rare Troubadour Outfit", rarity: "Rare", quantity: 1, description: "Collect 1 Rare Troubadour Outfit" },
          { type: "item", item: "Rare Marauder Outfit", rarity: "Rare", quantity: 1, description: "Collect 1 Rare Marauder Outfit" },
        ],
        reward: { gold: 150, xp: 300, affinity: 25, description: "150 Gold, 2× Random Epic Weapon, +300 XP, +25 Affinity" },
      },
      {
        id: "leather_11",
        name: "Faith and Worry",
        chapter: "It's All In The Details",
        description: "Thirty skeletons in a single Crypt run — I need to know how your equipment holds up under that strain.",
        requirements: [
          { type: "kill", monster: "Skeleton", location: "Crypt", quantity: 30, description: "Kill 30 Skeletons in the Crypt (single session)" },
        ],
        reward: { gold: 150, xp: 300, description: "150 Gold, 2× Random Epic Armor, +300 XP" },
      },
      {
        id: "leather_12",
        name: "The Shadow of the Dream",
        chapter: "It's All In The Details",
        description: "Human Remains from the dungeon carry an imprint of whoever wore the last leather. Bring me one.",
        requirements: [
          { type: "item", item: "Human Remains", rarity: "Rare", quantity: 1, description: "Collect 1 Human Remains" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, 2× Epic Arcane Essence, Random Epic Armor, Random Epic Weapon, +1000 XP, +50 Affinity" },
      },
    ],
  },

  // ─── MINER ─────────────────────────────────────────────────────────────────
  {
    id: "miner",
    name: "Miner",
    title: "The Deeprock Digger",
    description:
      "A weathered dwarf who has seen the The Ashen Range's fiery depths firsthand. He deals in ore, lava materials, and the remnants of his fallen kin.",
    accentColor: "#c4783a",
    quests: [
      // Chapter 1 – Into the Firedeep
      {
        id: "miner_1",
        name: "The Land in Flames",
        chapter: "Into the Firedeep",
        description: "The The Ashen Range's lower reaches are burning. Go in and make it out alive — that's step one.",
        requirements: [
          { type: "survive", location: "The Ashen Range", quantity: 1, description: "Survive 1 run in the The Ashen Range" },
        ],
        reward: { gold: 75, xp: 50, description: "75 Gold, Random Uncommon Weapon, +50 XP" },
      },
      {
        id: "miner_2",
        name: "Traces of the Scattered",
        chapter: "Into the Firedeep",
        description: "The Broken Stone Bridge module in the The Ashen Range is where my kin fell. I need to know what's left.",
        requirements: [
          { type: "explore", location: "The Ashen Range — Broken Stone Bridge", quantity: 1, description: "Explore the Broken Stone Bridge in the The Ashen Range" },
        ],
        reward: { gold: 75, xp: 50, description: "75 Gold, 2× Random Uncommon Weapon, +50 XP" },
      },
      {
        id: "miner_3",
        name: "Those Bound in Fire",
        chapter: "Into the Firedeep",
        description: "Dwarf soldiers bound to the fire still patrol the The Ashen Range. End their suffering.",
        requirements: [
          { type: "kill", monster: "Dwarf Handcannoneer", location: "The Ashen Range", quantity: 5, description: "Kill 5 Dwarf Handcannoneers in the The Ashen Range" },
          { type: "kill", monster: "Dwarf Mauler", location: "The Ashen Range", quantity: 5, description: "Kill 5 Dwarf Maulers in the The Ashen Range" },
          { type: "kill", monster: "Dwarf Axeman", location: "The Ashen Range", quantity: 5, description: "Kill 5 Dwarf Axemen in the The Ashen Range" },
        ],
        reward: { gold: 75, xp: 75, description: "75 Gold, Random Uncommon Weapon, Random Uncommon Armor, +75 XP" },
      },
      // Chapter 2 – The Broken Remains
      {
        id: "miner_4",
        name: "Beasts in the Flames",
        chapter: "The Broken Remains",
        description: "Flame Boars have overrun sections of the The Ashen Range. Cull them and bring back their tusks.",
        requirements: [
          { type: "kill", monster: "Flame Boar", location: "The Ashen Range", quantity: 10, description: "Kill 10 Flame Boars in the The Ashen Range" },
          { type: "item", item: "Cracked Tusk", rarity: "Common", quantity: 3, description: "Collect 3 Cracked Tusks" },
        ],
        reward: { gold: 125, xp: 250, description: "125 Gold, 2× Random Rare Armor, +250 XP" },
      },
      {
        id: "miner_5",
        name: "Unbelievable News",
        chapter: "The Broken Remains",
        description: "Fallen Dwarves throughout the The Ashen Range carry messages I never received. Recover them.",
        requirements: [
          { type: "interact", item: "Fallen Dwarf", location: "The Ashen Range", quantity: 10, description: "Inspect 10 Fallen Dwarves in the The Ashen Range" },
        ],
        reward: { gold: 125, xp: 250, description: "125 Gold, 2× Random Rare Weapon, +250 XP" },
      },
      {
        id: "miner_6",
        name: "Servant of Fire",
        chapter: "The Broken Remains",
        description: "The Lava Golem serves the fire itself. Nothing will change down there until it's destroyed.",
        requirements: [
          { type: "kill", monster: "Lava Golem", location: "The Firedeep", quantity: 1, description: "Kill the Lava Golem in the Firedeep" },
        ],
        reward: { gold: 125, xp: 500, description: "125 Gold, 2× Random Rare Armor, Random Rare Weapon, +500 XP" },
      },
      // Chapter 3 – The Fire That Will Not End
      {
        id: "miner_7",
        name: "To Find an Opening",
        chapter: "The Fire That Will Not End",
        description: "The Burning Court is where the fire converges. Reach it.",
        requirements: [
          { type: "explore", location: "The Ashen Range — Burning Court", quantity: 1, description: "Explore the Burning Court in the The Ashen Range" },
        ],
        reward: { gold: 150, xp: 300, description: "150 Gold, 2× Random Epic Armor, +300 XP" },
      },
      {
        id: "miner_8",
        name: "Final Preparations",
        chapter: "The Fire That Will Not End",
        description: "Fire Spirits and Fire Elementals are the lifeblood of the blaze. Extinguish them.",
        requirements: [
          { type: "kill", monster: "Fire Spirit", location: "The Firedeep", quantity: 15, description: "Kill 15 Fire Spirits in the Firedeep" },
          { type: "kill", monster: "Fire Elemental", location: "The Firedeep", quantity: 15, description: "Kill 15 Fire Elementals in the Firedeep" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Weapon, Random Epic Armor, +350 XP" },
      },
      {
        id: "miner_9",
        name: "The Incomplete Colossus",
        chapter: "The Fire That Will Not End",
        description: "The Fire Colossus stands as a monument to our failure. Tear it down.",
        requirements: [
          { type: "kill", monster: "Fire Colossus", location: "The Firedeep", quantity: 1, description: "Kill the Fire Colossus in the Firedeep" },
        ],
        reward: { gold: 200, xp: 1000, description: "200 Gold, Random Epic Weapon, Random Epic Armor, 2× Epic Arcane Essence, +1000 XP" },
      },
    ],
  },

  // ─── NAVIGATOR ─────────────────────────────────────────────────────────────
  {
    id: "navigator",
    name: "Navigator",
    title: "The Tide Warden",
    description:
      "A seasoned mariner haunted by the ShipGraveyard's history. He seeks fellow adventurers willing to brave the waves, the pirates, and the monsters lurking in the deep.",
    accentColor: "#3a7cbd",
    quests: [
      // Chapter 1 – First Step to Set Sail
      {
        id: "nav_1",
        name: "For a Sturdy Hull",
        chapter: "First Step to Set Sail",
        description: "A ship is nothing without sound timber. Bring me building materials from the graveyard.",
        requirements: [
          { type: "item", item: "Billet", rarity: "Common", quantity: 3, description: "Collect 3 Billets" },
          { type: "item", item: "Bavin", rarity: "Common", quantity: 3, description: "Collect 3 Bavins" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, Random Uncommon Armor, 3× Common Potion of Healing, Uncommon Aquaglow Lantern, +50 XP" },
      },
      {
        id: "nav_2",
        name: "The Cloth That Wraps the Wind",
        chapter: "First Step to Set Sail",
        description: "Good sailcloth is harder to find than treasure these days. Bring me what's left.",
        requirements: [
          { type: "item", item: "Sturdy Cloth", rarity: "Common", quantity: 3, description: "Collect 3 Sturdy Cloth" },
          { type: "item", item: "Pincushion", rarity: "Common", quantity: 1, description: "Collect 1 Pincushion" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, 2× Uncommon Trap Disarming Kit, Common Ale, 3× Common Potion of Healing, +50 XP" },
      },
      {
        id: "nav_3",
        name: "The Knot That Binds All",
        chapter: "First Step to Set Sail",
        description: "Rope is the skeleton of every vessel. Bring me old rope and a length of sturdy rope.",
        requirements: [
          { type: "item", item: "Old Rope", rarity: "Common", quantity: 3, description: "Collect 3 Old Rope" },
          { type: "item", item: "Sturdy Rope", rarity: "Uncommon", quantity: 1, description: "Collect 1 Sturdy Rope" },
        ],
        reward: { gold: 75, xp: 75, description: "75 Gold, Random Uncommon Weapon, Random Uncommon Armor, +75 XP" },
      },
      // Chapter 2 – A Debt to Be Repaid
      {
        id: "nav_4",
        name: "Shadow of the Past",
        chapter: "A Debt to Be Repaid",
        description: "The pirates of the ShipGraveyard are dead men who won't stay dead. Cut them down.",
        requirements: [
          { type: "kill", monster: "Pirate Swordsman", location: "ShipGraveyard", quantity: 5, description: "Kill 5 Pirate Swordsmen in the ShipGraveyard" },
          { type: "kill", monster: "Pirate Bowman", location: "ShipGraveyard", quantity: 5, description: "Kill 5 Pirate Bowmen in the ShipGraveyard" },
        ],
        reward: { gold: 75, xp: 75, description: "75 Gold, 2× Uncommon Arcane Essence, +75 XP" },
      },
      {
        id: "nav_5",
        name: "Coffins Beneath the Waves",
        chapter: "A Debt to Be Repaid",
        description: "Mermaid Coffins dot the ShipGraveyard seabed. Open ten and tell me what's inside.",
        requirements: [
          { type: "interact", item: "Mermaid Coffin", location: "ShipGraveyard", quantity: 10, description: "Open 10 Mermaid Coffins in the ShipGraveyard" },
        ],
        reward: { gold: 100, xp: 100, description: "100 Gold, Random Uncommon Weapon, +100 XP" },
      },
      {
        id: "nav_6",
        name: "Trial of Worth",
        chapter: "A Debt to Be Repaid",
        description: "The ShipGraveyard doesn't suffer fools. Prove you can survive it three times over.",
        requirements: [
          { type: "survive", location: "ShipGraveyard", quantity: 3, description: "Survive 3 runs in the ShipGraveyard" },
        ],
        reward: { gold: 100, xp: 100, description: "100 Gold, Random Uncommon Weapon, 2× Uncommon Arcane Essence, Random Uncommon Armor, +100 XP" },
      },
      // Chapter 3 – The Promise Left Behind
      {
        id: "nav_7",
        name: "Brawler of the Sea",
        chapter: "The Promise Left Behind",
        description: "The Tidewalkers are expanding their territory. Push them back.",
        requirements: [
          { type: "kill", monster: "Tidewalker Clubfighter", location: "ShipGraveyard", quantity: 7, description: "Kill 7 Tidewalker Clubfighters in the ShipGraveyard" },
          { type: "kill", monster: "Tidewalker Boomerang", location: "ShipGraveyard", quantity: 7, description: "Kill 7 Tidewalker Boomerangs in the ShipGraveyard" },
          { type: "kill", monster: "Tidewalker Spearer", location: "ShipGraveyard", quantity: 3, description: "Kill 3 Tidewalker Spearers in the ShipGraveyard" },
        ],
        reward: { gold: 125, xp: 100, description: "125 Gold, 2× Rare Arcane Essence, +100 XP" },
      },
      {
        id: "nav_8",
        name: "Pieces of a Broken Dream",
        chapter: "The Promise Left Behind",
        description: "Old Nautical Chart Fragments are scattered across the ShipGraveyard. Piece together the route.",
        requirements: [
          { type: "item", item: "Old Nautical Chart Fragment", rarity: "Common", quantity: 4, description: "Collect 4 Old Nautical Chart Fragments" },
        ],
        reward: { gold: 125, xp: 100, description: "125 Gold, Random Rare Armor, +100 XP" },
      },
      {
        id: "nav_9",
        name: "Where the Map Points",
        chapter: "The Promise Left Behind",
        description: "The Pirate Prison in the ShipGraveyard holds the last known coordinates of a lost fleet.",
        requirements: [
          { type: "explore", location: "ShipGraveyard — Pirate Prison", quantity: 1, description: "Explore the Pirate Prison in the ShipGraveyard" },
        ],
        reward: { gold: 150, xp: 150, description: "150 Gold, Random Rare Weapon, +150 XP" },
      },
      // Chapter 4 – In Search of the Echoes of the Past
      {
        id: "nav_10",
        name: "An Unforgotten Memory",
        chapter: "In Search of the Echoes of the Past",
        description: "Moray Eels and Sea Piranhas guard the sunken ships. Find the Sailor's Journal among the wreckage.",
        requirements: [
          { type: "kill", monster: "Moray Eel", location: "ShipGraveyard", quantity: 10, description: "Kill 10 Moray Eels in the ShipGraveyard" },
          { type: "kill", monster: "Sea Piranha", location: "ShipGraveyard", quantity: 10, description: "Kill 10 Sea Piranhas in the ShipGraveyard" },
          { type: "item", item: "Sailor's Journal", rarity: "Uncommon", quantity: 1, description: "Collect 1 Sailor's Journal" },
        ],
        reward: { gold: 150, xp: 300, description: "150 Gold, Random Epic Armor, +300 XP" },
      },
      {
        id: "nav_11",
        name: "A Wish Etched in Ink",
        chapter: "In Search of the Echoes of the Past",
        description: "Coral and pearl from the ShipGraveyard carry the memory of ships long gone.",
        requirements: [
          { type: "item", item: "Coral Fragment", rarity: "Common", quantity: 3, description: "Collect 3 Coral Fragments" },
          { type: "item", item: "Shining Pearl", rarity: "Uncommon", quantity: 1, description: "Collect 1 Shining Pearl" },
        ],
        reward: { gold: 150, xp: 300, description: "150 Gold, Random Epic Weapon, +300 XP" },
      },
      {
        id: "nav_12",
        name: "The Path Beyond the Map",
        chapter: "In Search of the Echoes of the Past",
        description: "The Crocodilian is the ShipGraveyard's apex predator. Kill it and claim the eyeball.",
        requirements: [
          { type: "kill", monster: "Crocodilian", location: "ShipGraveyard", quantity: 1, description: "Kill the Crocodilian in the ShipGraveyard" },
          { type: "item", item: "Crocodilian Eyeball", rarity: "Rare", quantity: 1, description: "Collect 1 Crocodilian Eyeball" },
        ],
        reward: { gold: 200, xp: 500, description: "200 Gold, Random Epic Weapon, Random Epic Armor, 2× Epic Arcane Essence, +500 XP" },
      },
    ],
  },

  // ─── TAILOR ────────────────────────────────────────────────────────────────
  {
    id: "tailor",
    name: "Tailor",
    title: "The Thread Keeper",
    description:
      "A meticulous craftsperson who works with cloth, leather, and fine fabrics. She pays well for quality materials and interesting specimens recovered from expeditions.",
    accentColor: "#c48fb8",
    quests: [
      {
        id: "tailor_1",
        name: "Threads of the Fallen",
        description: "The Crypt's elite leave behind ruined fabric that still holds alchemical properties. Bring me specimens.",
        requirements: [
          { type: "kill", monster: "Demon Berserker", quantity: 1, description: "Kill 1 Demon Berserker" },
          { type: "kill", monster: "Demon Bat", quantity: 2, description: "Kill 2 Demon Bats" },
          { type: "kill", monster: "Skeleton Mage", quantity: 3, description: "Kill 3 Skeleton Mages" },
        ],
        reward: { gold: 75, xp: 50, affinity: 25, description: "75 Gold, 3× Silver Powder, Ornate Jazerant, +50 XP, +25 Affinity" },
      },
      {
        id: "tailor_2",
        name: "Copperlight Collection",
        description: "A full Copperlight set is the finest light armor ever made. Bring me the attire and pants.",
        requirements: [
          { type: "item", item: "Copperlight Attire", rarity: "Uncommon", quantity: 1, description: "Collect 1 Copperlight Attire" },
          { type: "item", item: "Copperlight Pants", rarity: "Uncommon", quantity: 1, description: "Collect 1 Copperlight Pants" },
        ],
        reward: { gold: 75, xp: 25, description: "75 Gold, Shoes of Darkness, Frost Amulet, +25 XP" },
      },
      {
        id: "tailor_3",
        name: "Blood Platforms",
        description: "The Blood Platforms of the Howling Crypt are stained with the finest dyes I've ever seen.",
        requirements: [
          { type: "explore", location: "Crypt — Blood Platforms", quantity: 1, description: "Explore Blood Platforms in the Howling Crypt" },
        ],
        reward: { gold: 75, xp: 50, affinity: 25, description: "75 Gold, Rubysilver Vestment, +50 XP, +25 Affinity" },
      },
      {
        id: "tailor_4",
        name: "Adventurer's Garments",
        description: "Bards and Rangers wear garments built for agility and elegance. I need their measurements — taken the hard way.",
        requirements: [
          { type: "kill", monster: "Bard", quantity: 1, description: "Kill 1 Bard (PvP)" },
          { type: "kill", monster: "Ranger", quantity: 1, description: "Kill 1 Ranger (PvP)" },
        ],
        reward: { gold: 125, xp: 200, description: "125 Gold, Hand Crossbow, Lute, +200 XP" },
      },
      {
        id: "tailor_5",
        name: "Shrine of the Craft",
        description: "The The Ashen Range's Shrines of Health have a peculiar effect on fabrics. Interact with four of them.",
        requirements: [
          { type: "interact", item: "Shrine of Health", location: "The Ashen Range", quantity: 4, description: "Interact with 4 Shrines of Health in the The Ashen Range" },
        ],
        reward: { gold: 125, xp: 175, description: "125 Gold, Ring of Vitality, Chaperon, +175 XP" },
      },
      {
        id: "tailor_6",
        name: "Dark Fabric Commission",
        description: "Enchanted dark fabric, old cloth, and spider silk are the three pillars of my finest work. Bring them all.",
        requirements: [
          { type: "item", item: "Enchanted Dark Fabric", rarity: "Rare", quantity: 3, description: "Collect 3 Enchanted Dark Fabric" },
          { type: "item", item: "Old Cloth", rarity: "Common", quantity: 8, description: "Collect 8 Old Cloth" },
          { type: "item", item: "Spider Silk", rarity: "Common", quantity: 1, description: "Collect 1 Spider Silk" },
        ],
        reward: { gold: 125, xp: 200, affinity: 25, description: "125 Gold, Mystic Vestments, Cloak of Darkness, +200 XP, +25 Affinity" },
      },
    ],
  },

  // ─── TAVERN MASTER ─────────────────────────────────────────────────────────
  {
    id: "tavern_master",
    name: "Tavern Master",
    title: "The Innkeeper",
    description:
      "A gruff but generous host who keeps the camp fed and armed. He collects trinkets, trophies, and provisions from adventurers willing to do his dirty work.",
    accentColor: "#c9883c",
    quests: [
      {
        id: "tavern_1",
        name: "Barracks Inspection",
        description: "The old Barracks in the Howling Crypts used to supply my tavern. I need to know if anything's left.",
        requirements: [
          { type: "explore", location: "Crypt — Barracks", quantity: 1, description: "Explore the Barracks in the Howling Crypts" },
        ],
        reward: { gold: 50, xp: 25, description: "50 Gold, 3× Potion of Protection, 3× Potion of Healing, +25 XP" },
      },
      {
        id: "tavern_2",
        name: "Skeleton Clearance",
        description: "Skeleton patrols have been disrupting supply runs. Clear out the lot of them.",
        requirements: [
          { type: "kill", monster: "Skeleton Archer", quantity: 5, description: "Kill 5 Skeleton Archers" },
          { type: "kill", monster: "Skeleton Footman", quantity: 5, description: "Kill 5 Skeleton Footmen" },
          { type: "kill", monster: "Skeleton Guardsman", quantity: 5, description: "Kill 5 Skeleton Guardsmen" },
        ],
        reward: { gold: 50, xp: 25, description: "50 Gold, Crossbow, 3× Bandage, +25 XP" },
      },
      {
        id: "tavern_3",
        name: "Looted Ale",
        description: "Adventurers never drink all the ale they find. Bring me what they leave behind.",
        requirements: [
          { type: "item", item: "Ale", rarity: "Common", quantity: 5, description: "Collect 5 Ale (looted)" },
        ],
        reward: { gold: 50, xp: 40, affinity: 25, description: "50 Gold, 3× Ale, Adventurer Boots, +40 XP, +25 Affinity" },
      },
      {
        id: "tavern_4",
        name: "Curiosity Cabinet",
        description: "My tavern needs decorations. Bring me a collection of oddities from the Crypt.",
        requirements: [
          { type: "item", item: "Broken Skull", rarity: "Common", quantity: 2, description: "Collect 2 Broken Skulls" },
          { type: "item", item: "Golden Tooth", rarity: "Common", quantity: 2, description: "Collect 2 Golden Teeth" },
          { type: "item", item: "Rusty Broken Sword", rarity: "Poor", quantity: 2, description: "Collect 2 Rusty Broken Swords" },
          { type: "item", item: "Bone", rarity: "Common", quantity: 4, description: "Collect 4 Bones" },
        ],
        reward: { gold: 75, xp: 75, description: "75 Gold, Loose Trousers, 3× Bandage, +75 XP" },
      },
      {
        id: "tavern_5",
        name: "Elite Undead Bounty",
        description: "A Skeleton Champion and a Wraith have been seen near the supply road. I'm putting a bounty on them.",
        requirements: [
          { type: "kill", monster: "Skeleton Champion", quantity: 1, description: "Kill 1 Skeleton Champion" },
          { type: "kill", monster: "Wraith", quantity: 1, description: "Kill 1 Wraith" },
          { type: "kill", monster: "Skeleton Mage", quantity: 3, description: "Kill 3 Skeleton Mages" },
        ],
        reward: { gold: 75, xp: 50, description: "75 Gold, Riveted Gloves, 3× Potion of Invisibility, +50 XP" },
      },
      {
        id: "tavern_6",
        name: "Veteran's Run",
        description: "Five successful runs through the Howling Crypts and I'll consider you a regular.",
        requirements: [
          { type: "survive", location: "Crypt", quantity: 5, description: "Survive 5 runs in the Howling Crypts" },
        ],
        reward: { gold: 75, xp: 75, affinity: 10, description: "75 Gold, 3× Surgical Kit, 6× Bandage, +75 XP, +10 Affinity" },
      },
    ],
  },

  // ─── THE COLLECTOR ─────────────────────────────────────────────────────────
  {
    id: "collector",
    name: "The Collector",
    title: "The Antiquarian",
    description:
      "A well-dressed merchant with an eye for rarities. He pays top gold for jewelry, precious stones, trophies, and items of unusual value from across the dungeons.",
    accentColor: "#c9a84c",
    quests: [
      {
        id: "collector_1",
        name: "Frozen Trophies",
        description: "The Ice Cavern's creatures carry trophies unlike any I've catalogued. Clear the path to them.",
        requirements: [
          { type: "kill", monster: "Frost Giant Berserker", location: "Ice Cavern", quantity: 1, description: "Kill 1 Frost Giant Berserker in the Ice Cavern" },
          { type: "kill", monster: "Frost Wolf", location: "Ice Cavern", quantity: 3, description: "Kill 3 Frost Wolves in the Ice Cavern" },
          { type: "kill", monster: "Frost Walker", location: "Ice Cavern", quantity: 5, description: "Kill 5 Frost Walkers in the Ice Cavern" },
        ],
        reward: { gold: 50, xp: 25, description: "50 Gold, Round Shield, Survival Bow, +25 XP" },
      },
      {
        id: "collector_2",
        name: "Ancient Relics",
        description: "Ancient scrolls, gold crowns, and gold waterpots are the pillars of any serious collection. Bring them.",
        requirements: [
          { type: "item", item: "Ancient Scroll", rarity: "Uncommon", quantity: 2, description: "Collect 2 Ancient Scrolls" },
          { type: "item", item: "Gold Crown", rarity: "Uncommon", quantity: 2, description: "Collect 2 Gold Crowns" },
          { type: "item", item: "Gold Waterpot", rarity: "Common", quantity: 2, description: "Collect 2 Gold Waterpots" },
        ],
        reward: { gold: 50, xp: 25, description: "50 Gold, Lantern, 3× Potion of Magic Protection, +25 XP" },
      },
      {
        id: "collector_3",
        name: "Kobold Trophy Run",
        description: "Kobold ears are a peculiar item I've developed a fondness for. Bring me a batch.",
        requirements: [
          { type: "item", item: "Kobold's Ear", rarity: "Common", quantity: 6, description: "Collect 6 Kobold's Ears" },
        ],
        reward: { gold: 50, xp: 40, description: "50 Gold, Kris Dagger, Rat Pendant, +40 XP" },
      },
      {
        id: "collector_4",
        name: "Competitive Acquisition",
        description: "Other collectors send adventurers into the Ice Cavern. Eliminate the competition.",
        requirements: [
          { type: "kill", monster: "Player", location: "Ice Cavern", quantity: 6, description: "Kill 6 Players in the Ice Cavern (PvP)" },
        ],
        reward: { gold: 100, xp: 150, description: "100 Gold, 6× Potion of Protection, 6× Potion of Magic Protection, 3× Surgical Kit, +150 XP" },
      },
      {
        id: "collector_5",
        name: "Ice Cavern Survey",
        description: "I need a full survey of the Four Route module in the Ice Cavern for a new acquisition.",
        requirements: [
          { type: "explore", location: "Ice Cavern — Four Route", quantity: 1, description: "Explore the Four Route in the Ice Cavern" },
        ],
        reward: { gold: 100, xp: 125, description: "100 Gold, 5× Campfire Kit, Ring of Survival, +125 XP" },
      },
      {
        id: "collector_6",
        name: "Nature's Bounty",
        description: "A diverse collection of natural materials from the dungeon is the foundation of any great display.",
        requirements: [
          { type: "item", item: "Grave Essence", rarity: "Common", quantity: 6, description: "Collect 6 Grave Essence" },
          { type: "item", item: "Moldy Bread", rarity: "Poor", quantity: 4, description: "Collect 4 Moldy Bread" },
          { type: "item", item: "Wolf Fang", rarity: "Common", quantity: 4, description: "Collect 4 Wolf Fangs" },
          { type: "item", item: "Wolf Pelt", rarity: "Common", quantity: 4, description: "Collect 4 Wolf Pelts" },
        ],
        reward: { gold: 100, xp: 150, description: "100 Gold, Wolf Hunter Leggings, Phoenix Choker, +150 XP" },
      },
    ],
  },

  // ─── WEAPONSMITH ───────────────────────────────────────────────────────────
  {
    id: "weaponsmith",
    name: "Weaponsmith",
    title: "The Iron Forger",
    description:
      "A master craftsman who deals in all manner of weapons. He seeks raw materials, recovered arms, and proof of combat prowess to fuel his legendary forge.",
    accentColor: "#a0a0b8",
    quests: [
      // Chapter 1 – Forging A Legacy
      {
        id: "weaponsmith_1",
        name: "Tombstone",
        chapter: "Forging A Legacy",
        description: "The dead of the Crypt rest in stone tombs and caskets. Disturb their rest — I need to know what's down there.",
        requirements: [
          { type: "interact", item: "Stone Tomb", location: "Crypt", quantity: 3, description: "Interact with 3 Stone Tombs in the Crypt" },
          { type: "interact", item: "Casket", location: "Crypt", quantity: 3, description: "Interact with 3 Caskets in the Crypt" },
        ],
        reward: { gold: 50, xp: 50, affinity: 25, description: "50 Gold, 4× Uncommon Arcane Essence, +50 XP, +25 Affinity" },
      },
      {
        id: "weaponsmith_2",
        name: "The Statues Are Alive",
        chapter: "Forging A Legacy",
        description: "Living Statues in the Crypt move like soldiers and hit like anvils. I need to understand how they're constructed.",
        requirements: [
          { type: "kill", monster: "Living Statue", location: "Crypt", quantity: 5, description: "Kill 5 Living Statues in the Crypt" },
        ],
        reward: { gold: 50, xp: 50, description: "50 Gold, 3× Uncommon Trap Disarming Kit, 3× Uncommon Potion of Protection, +50 XP" },
      },
      {
        id: "weaponsmith_3",
        name: "Farm It or Buy It",
        chapter: "Forging A Legacy",
        description: "Gold ingots are the starting point of any serious forging operation. Bring me one.",
        requirements: [
          { type: "item", item: "Gold Ingot", rarity: "Common", quantity: 1, description: "Collect 1 Gold Ingot" },
        ],
        reward: { gold: 50, xp: 75, affinity: 25, description: "50 Gold, 2× Uncommon Arcane Essence, Random Uncommon Armor, +75 XP, +25 Affinity" },
      },
      // Chapter 2 – Remember Your Heritage
      {
        id: "weaponsmith_4",
        name: "Forbidden Craft",
        chapter: "Remember Your Heritage",
        description: "Recovered weapons teach me more than any blueprint. Bring me uncommon arms from the field.",
        requirements: [
          { type: "item", item: "Uncommon Weapon", rarity: "Uncommon", quantity: 3, description: "Collect 3 Uncommon Weapons" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 2× Random Uncommon Weapon, +200 XP" },
      },
      {
        id: "weaponsmith_5",
        name: "Tales of Power",
        chapter: "Remember Your Heritage",
        description: "The Ice Cavern Pyramid holds relics of an ancient forging tradition. Explore it.",
        requirements: [
          { type: "explore", location: "Ice Cavern — Pyramid", quantity: 1, description: "Explore the Pyramid module in the Ice Cavern" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 3× Random Rare Weapon, +200 XP" },
      },
      {
        id: "weaponsmith_6",
        name: "Growing Whispers",
        chapter: "Remember Your Heritage",
        description: "Ice Giant Spiders in the Ice Cavern carry chitinous material with remarkable edge-holding properties.",
        requirements: [
          { type: "kill", monster: "Ice Giant Spider", location: "Ice Cavern", quantity: 5, description: "Kill 5 Ice Giant Spiders in the Ice Cavern" },
        ],
        reward: { gold: 100, xp: 175, affinity: 25, description: "100 Gold, 3× Random Rare Weapon, +175 XP, +25 Affinity" },
      },
      // Chapter 3 – Traces of the Dwarves
      {
        id: "weaponsmith_7",
        name: "In Search of the Dwarven Land",
        chapter: "Traces of the Dwarves",
        description: "The Magma Falls in the The Ashen Range is where the Dwarves once ran their foundries. Go see what remains.",
        requirements: [
          { type: "explore", location: "The Ashen Range — Magma Falls", quantity: 1, description: "Explore the Magma Falls module in the The Ashen Range" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 4× Rare Arcane Essence, +200 XP" },
      },
      {
        id: "weaponsmith_8",
        name: "The Potential of Obsidian",
        chapter: "Traces of the Dwarves",
        description: "Obsidian ore from the The Ashen Range is harder than anything I've worked with. I need samples.",
        requirements: [
          { type: "item", item: "Obsidian Ore", rarity: "Common", quantity: 3, description: "Collect 3 Obsidian Ore" },
        ],
        reward: { gold: 100, xp: 200, description: "100 Gold, 2× Random Rare Armor, +200 XP" },
      },
      {
        id: "weaponsmith_9",
        name: "What the Dwarves Made",
        chapter: "Traces of the Dwarves",
        description: "The Dwarf soldiers still guard their old forge. Eliminate them and recover what's left of their tools.",
        requirements: [
          { type: "kill", monster: "Dwarf Handcannoneer", location: "The Ashen Range", quantity: 10, description: "Kill 10 Dwarf Handcannoneers in the The Ashen Range" },
          { type: "kill", monster: "Dwarf Mauler", location: "The Ashen Range", quantity: 10, description: "Kill 10 Dwarf Maulers in the The Ashen Range" },
          { type: "item", item: "Melted Pickaxe Head", rarity: "Common", quantity: 7, description: "Collect 7 Melted Pickaxe Heads" },
        ],
        reward: { gold: 100, xp: 250, description: "100 Gold, 3× Random Rare Weapon, +250 XP" },
      },
      // Chapter 4 – Iron In Blood
      {
        id: "weaponsmith_10",
        name: "A Lot of Pots",
        chapter: "Iron In Blood",
        description: "The Crypt's pots contain reusable metal. Smash ten in a single run.",
        requirements: [
          { type: "destroy", item: "Pot", location: "Crypt", quantity: 10, description: "Destroy 10 Pots in the Crypt (single session)" },
        ],
        reward: { gold: 150, xp: 350, affinity: 25, description: "150 Gold, 2× Random Rare Weapon, +350 XP, +25 Affinity" },
      },
      {
        id: "weaponsmith_11",
        name: "Something Good In Something Small",
        chapter: "Iron In Blood",
        description: "Small Oak Chests in the Crypt sometimes hold old weapon components I can repurpose. Open twenty-five.",
        requirements: [
          { type: "interact", item: "Small Oak Chest", location: "Crypt", quantity: 25, description: "Open 25 Small Oak Chests in the Crypt" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, Random Epic Armor, +350 XP" },
      },
      {
        id: "weaponsmith_12",
        name: "Golden Dreams",
        chapter: "Iron In Blood",
        description: "Golden Chests in the Crypt are locked with mechanisms worth studying. Open five of them.",
        requirements: [
          { type: "interact", item: "Golden Chest", location: "Crypt", quantity: 5, description: "Open 5 Golden Chests in the Crypt" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, 4× Epic Arcane Essence, +1000 XP, +50 Affinity" },
      },
      // Chapter 5 – Carving a Legacy
      {
        id: "weaponsmith_13",
        name: "Culling the Enemy",
        chapter: "Carving a Legacy",
        description: "Harpies, Living Armor, and Ruins Golems — the Crypt's finest fighters. Eliminate them in volume.",
        requirements: [
          { type: "kill", monster: "Harpy", location: "Crypt", quantity: 15, description: "Kill 15 Harpies in the Crypt" },
          { type: "kill", monster: "Living Armor", location: "Crypt", quantity: 20, description: "Kill 20 Living Armor in the Crypt" },
          { type: "kill", monster: "Ruins Golem", location: "Crypt", quantity: 9, description: "Kill 9 Ruins Golems in the Crypt" },
        ],
        reward: { gold: 150, xp: 350, affinity: 25, description: "150 Gold, 2× Random Epic Armor, +350 XP, +25 Affinity" },
      },
      {
        id: "weaponsmith_14",
        name: "Gathering Progress",
        chapter: "Carving a Legacy",
        description: "Rotten fluids, armor scrap, and rare weapons are the raw inputs of my finest work. Gather them.",
        requirements: [
          { type: "item", item: "Rotten Fluids", rarity: "Common", quantity: 10, description: "Collect 10 Rotten Fluids" },
          { type: "item", item: "Armor Scrap", rarity: "Common", quantity: 10, description: "Collect 10 Armor Scraps" },
          { type: "item", item: "Rare Weapon", rarity: "Rare", quantity: 10, description: "Collect 10 Rare Weapons" },
        ],
        reward: { gold: 150, xp: 350, description: "150 Gold, 2× Random Epic Armor, +350 XP" },
      },
      {
        id: "weaponsmith_15",
        name: "Piercing Heat",
        chapter: "Carving a Legacy",
        description: "A Broken Bone Spike, a Spectral Hilt, and a Warlord's Broken Sword Blade — the components of a weapon unlike any other.",
        requirements: [
          { type: "item", item: "Broken Bone Spike", rarity: "Common", quantity: 1, description: "Collect 1 Broken Bone Spike" },
          { type: "item", item: "Spectral Hilt", rarity: "Common", quantity: 1, description: "Collect 1 Spectral Hilt" },
          { type: "item", item: "Warlord's Broken Sword Blade", rarity: "Common", quantity: 1, description: "Collect 1 Warlord's Broken Sword Blade" },
        ],
        reward: { gold: 150, xp: 1000, affinity: 50, description: "150 Gold, 2× Random Epic Weapon, +1000 XP, +50 Affinity" },
      },
      // Chapter 6 – Steel and Resolve
      {
        id: "weaponsmith_16",
        name: "A Weapon That Pierces All",
        chapter: "Steel and Resolve",
        description: "Five epic weapons and a vial of smoky poison powder — the final ingredients before the masterwork.",
        requirements: [
          { type: "item", item: "Epic Weapon", rarity: "Epic", quantity: 5, description: "Collect 5 Epic Weapons" },
          { type: "item", item: "Smoky Poison Powder", rarity: "Common", quantity: 1, description: "Collect 1 Smoky Poison Powder" },
        ],
        reward: { gold: 225, xp: 500, description: "225 Gold, Random Legendary Weapon, +500 XP" },
      },
      {
        id: "weaponsmith_17",
        name: "The Vile Ones",
        chapter: "Steel and Resolve",
        description: "The Abomination, the Cerberus, and the Dreadspine — the Crypt's most terrible guardians. Destroy them all.",
        requirements: [
          { type: "kill", monster: "Abomination", location: "Crypt", quantity: 10, description: "Kill 10 Abominations in the Crypt" },
          { type: "kill", monster: "Cerberus", location: "Crypt", quantity: 10, description: "Kill 10 Cerberuses in the Crypt" },
          { type: "kill", monster: "Dreadspine", location: "Crypt", quantity: 10, description: "Kill 10 Dreadspines in the Crypt" },
        ],
        reward: { gold: 250, xp: 500, description: "250 Gold, 2× Legend Arcane Essence, +500 XP" },
      },
      {
        id: "weaponsmith_18",
        name: "Out of the Dark",
        chapter: "Steel and Resolve",
        description: "The Demon Overseer, the Skeleton Warlord, and the Lich. Three rulers of the dungeon's darkness. End them.",
        requirements: [
          { type: "kill", monster: "Demon Overseer", location: "Inferno", quantity: 1, description: "Kill the Demon Overseer in the Inferno" },
          { type: "kill", monster: "Skeleton Warlord", location: "Crypt", quantity: 1, description: "Kill the Skeleton Warlord in the Crypt" },
          { type: "kill", monster: "Lich", location: "Crypt", quantity: 1, description: "Kill the Lich in the Crypt" },
        ],
        reward: { gold: 250, xp: 1000, description: "250 Gold, 2× Random Legendary Armor, +1000 XP" },
      },
    ],
  },

  // ─── WOODSMAN ──────────────────────────────────────────────────────────────
  {
    id: "woodsman",
    name: "Woodsman",
    title: "The Forest Keeper",
    description:
      "A grizzled hunter who knows every dungeon's layout better than its inhabitants. He deals in survival gear, campfire materials, and the spoils of difficult hunts.",
    accentColor: "#8ab87a",
    quests: [
      {
        id: "woodsman_1",
        name: "Campfire Salvage",
        description: "Looted campfires from the dungeon can be broken down into useful materials. Bring me five.",
        requirements: [
          { type: "item", item: "Campfire Kit", rarity: "Common", quantity: 5, description: "Collect 5 Campfire Kits (looted)" },
        ],
        reward: { gold: 50, xp: 25, affinity: 25, description: "50 Gold, Surgical Kit, 3× Explosive Bottle, +25 XP, +25 Affinity" },
      },
      {
        id: "woodsman_2",
        name: "Inferno Hunt",
        description: "A Demon Centaur and its pack of Demon Dogs have staked out a section of the Inferno. Deal with them.",
        requirements: [
          { type: "kill", monster: "Demon Centaur", location: "Inferno", quantity: 1, description: "Kill 1 Demon Centaur in the Inferno" },
          { type: "kill", monster: "Demon Dog", location: "Inferno", quantity: 5, description: "Kill 5 Demon Dogs in the Inferno" },
        ],
        reward: { gold: 50, xp: 40, description: "50 Gold, Potion of Luck, Heavy Leather Leggings, +40 XP" },
      },
      {
        id: "woodsman_3",
        name: "Prisons Patrol",
        description: "Prisons A in the Howling Crypts is a chokepoint I use for tracking game. Report on current conditions.",
        requirements: [
          { type: "explore", location: "Crypt — Prisons A", quantity: 1, description: "Explore Prisons A in the Howling Crypts" },
        ],
        reward: { gold: 50, xp: 25, affinity: 25, description: "50 Gold, Leather Cap, Dashing Boots, +25 XP, +25 Affinity" },
      },
      {
        id: "woodsman_4",
        name: "Crypt Predator",
        description: "Other adventurers are the most dangerous prey. Hunt them in the Howling Crypts.",
        requirements: [
          { type: "kill", monster: "Player", location: "Crypt", quantity: 6, description: "Kill 6 Players in the Howling Crypts (PvP)" },
        ],
        reward: { gold: 100, xp: 150, description: "100 Gold, War Hammer, Crystal Ball, +150 XP" },
      },
      {
        id: "woodsman_5",
        name: "Explosive Cache",
        description: "Explosive bottles are a woodsman's best friend in a tight spot. Collect seven.",
        requirements: [
          { type: "item", item: "Explosive Bottle", rarity: "Common", quantity: 7, description: "Collect 7 Explosive Bottles" },
        ],
        reward: { gold: 100, xp: 125, description: "100 Gold, Lantern, Forest Hood, +125 XP" },
      },
      {
        id: "woodsman_6",
        name: "Waiting Room",
        description: "The Waiting Room in the Inferno is where I set my most complex traps. Make sure it's clear.",
        requirements: [
          { type: "explore", location: "Inferno — Waiting Room", quantity: 1, description: "Explore the Waiting Room in the Inferno" },
        ],
        reward: { gold: 100, xp: 125, affinity: 25, description: "100 Gold, Demonclad Leggings, Round Shield, +125 XP, +25 Affinity" },
      },
    ],
  },
];

// Derive a flat list of all quest items with context, deduplicated by item name + aggregated
export interface QuestItemAppearance {
  traderId: string;
  traderName: string;
  questId: string;
  questName: string;
  quantity: number;
}

export interface QuestItemEntry {
  item: string;
  rarity: string;
  appearances: QuestItemAppearance[];
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
          traderId: trader.id,
          traderName: trader.name,
          questId: quest.id,
          questName: quest.name,
          quantity: req.quantity ?? 1,
        });
        entry.totalQuantity += req.quantity ?? 1;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.item.localeCompare(b.item));
}
