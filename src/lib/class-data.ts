export interface PerkData {
  name: string;
  description: string;
}

export interface SkillData {
  name: string;
  description: string;
}

export interface SpellEntry {
  name: string;
  tier: number;
}

export interface ClassPerksSkills {
  perks: PerkData[];
  skills: SkillData[];
  spells?: SpellEntry[];
  songs?: SpellEntry[];
  shapeshiftForms?: string[];
}

const WIKI = "https://darkanddarker.wiki.spellsandguns.com/Special:FilePath";

// Overrides for icons whose wiki filenames differ from our display names.
// Value format: "<WikiPrefix>_<WikiSlug>" — the function appends ".png".
const ICON_OVERRIDES: Record<string, string> = {
  // Perks
  "Two-Handed Weapon Expert": "Perk_Two_Handed_Weapon_Expert", // hyphen removed on wiki
  "Blood Exchange":           "Skill_Blood_Exchange",           // filed under Skill on wiki
  "Wanderer's Luck":          "Perk_Wanderers_Luck",            // no apostrophe on wiki
  // Druid perks — wiki uses camelCase filenames
  "Force of Nature":          "Perk_ForceOfNature",
  "Sun and Moon":             "Perk_SunAndMoon",
  "Lifebloom Aura":           "Perk_LifebloomAura",
  "Thorn Coat":               "Perk_ThornCoat",
  "Herbal Sensing":           "Perk_HerbalSensing",
  "Enhanced Wildness":        "Perk_EnhancedWildness",
  "Spirit Bond":              "Perk_SpiritBond",
  "Natural Healing":          "Perk_NaturalHealing",
  "Spirit Magic Mastery":     "Perk_SpiritMagicMastery",
  // Skills — "Memory 2" variants share the base Memory icon
  "Spell Memory 2":           "Skill_Spell_Memory",
  "Music Memory 2":           "Skill_Music_Memory",
  "Shapeshift Memory 2":      "Skill_Shapeshift_Memory",
  // Skills — miscategorised or camelCase on wiki
  "Zap":                      "Spell_Zap",                      // filed under Spell on wiki
  "Party Maker":              "Skill_Partymaker",               // camelCase, no space on wiki
};

function iconUrl(defaultPrefix: string, name: string): string {
  if (ICON_OVERRIDES[name]) {
    return `${WIKI}/${ICON_OVERRIDES[name]}.png`;
  }
  return `${WIKI}/${defaultPrefix}_${encodeURIComponent(name.replace(/ /g, "_"))}.png`;
}

export function getPerkIconUrl(name: string): string {
  return iconUrl("Perk", name);
}

export function getSkillIconUrl(name: string): string {
  return iconUrl("Skill", name);
}

export function getSpellIconUrl(name: string): string {
  return iconUrl("Spell", name);
}

// Returns the memory type label and available items based on selected skills
export function getMemoryItems(className: string, selectedSkills: string[]): {
  type: "spells" | "songs" | "forms";
  label: string;
  items: { name: string; tier?: number }[];
}[] {
  const data = CLASS_DATA[className];
  if (!data) return [];

  const results: { type: "spells" | "songs" | "forms"; label: string; items: { name: string; tier?: number }[] }[] = [];

  const hasSpellMemory = selectedSkills.some((s) => s.startsWith("Spell Memory"));
  const hasMusicMemory = selectedSkills.some((s) => s.startsWith("Music Memory"));
  const hasShapeshiftMemory = selectedSkills.some((s) => s.startsWith("Shapeshift Memory"));

  if (hasSpellMemory && data.spells) {
    results.push({ type: "spells", label: "Spells", items: data.spells });
  }
  if (hasMusicMemory && data.songs) {
    results.push({ type: "songs", label: "Songs", items: data.songs });
  }
  if (hasShapeshiftMemory && data.shapeshiftForms) {
    results.push({ type: "forms", label: "Shapeshift Forms", items: data.shapeshiftForms.map((f) => ({ name: f })) });
  }

  return results;
}

export const CLASS_DATA: Record<string, ClassPerksSkills> = {
  Fighter: {
    perks: [
      { name: "Adrenaline Spike", description: "When your health drops below 40%, gain 15% action speed for 12s." },
      { name: "Combo Attack", description: "Successful melee attacks increase damage by 10% for 2s (stacks up to 3)." },
      { name: "Counterattack", description: "Successful block increases action speed by 10% for 3s." },
      { name: "Defense Expert", description: "Increase armor rating bonus from equipped armor by 10%." },
      { name: "Dual Wield", description: "Equip a weapon in each hand. Main-hand damage reduced by 30%." },
      { name: "Projectile Resistance", description: "Reduce incoming projectile damage by 10%." },
      { name: "Shield Expert", description: "Increase move speed by 10% while holding a shield." },
      { name: "Swift", description: "Increase base move speed by 5." },
      { name: "Sword Mastery", description: "Increase physical attack power by 5 when using a sword." },
      { name: "Weapon Mastery", description: "Allows equipping any weapon regardless of class requirement." },
    ],
    skills: [
      { name: "Adrenaline Rush", description: "Increase action speed by 25% for 8s." },
      { name: "Breakthrough", description: "Dash forward a short distance, dealing damage to enemies in the path." },
      { name: "Perfect Block", description: "Blocks all incoming damage for 1 attack within a short window." },
      { name: "Second Wind", description: "Recover 50% of max health over 12s. 24s cooldown." },
      { name: "Shield Slam", description: "Slam your shield forward, stunning enemies hit for 2s." },
      { name: "Sprint", description: "Increase move speed by 30% for 6s." },
      { name: "Taunt", description: "Force nearby monsters to target you for 6s." },
      { name: "Victory Strike", description: "Your next attack deals 20% bonus damage. Heals 15% HP on kill." },
    ],
  },
  Barbarian: {
    perks: [
      { name: "Axe Specialization", description: "Increase physical attack power by 5 when using an axe." },
      { name: "Berserker", description: "Gain 3% damage for every 10% HP missing." },
      { name: "Blood Exchange", description: "Sacrifice 30 HP to boost physical attack power by 10 for 8s." },
      { name: "Carnage", description: "Killing a player restores 20% of max health." },
      { name: "Iron Will", description: "Increase magic resistance by 50." },
      { name: "Morale Boost", description: "Increase max health by 10%." },
      { name: "Savage", description: "Increase physical damage by 10% when not wearing chest armor." },
      { name: "Toughness", description: "Increase max health by 25 HP." },
      { name: "Two-Handed Weapon Expert", description: "Increase physical damage by 5% when using a two-handed weapon." },
    ],
    skills: [
      { name: "Achilles Strike", description: "Slash that reduces target's move speed by 40% for 3s." },
      { name: "Rage", description: "Increase strength by 10 and move speed by 15% for 6s." },
      { name: "Reckless Attack", description: "Your next attack deals 50% bonus damage but costs 10% max HP." },
      { name: "Savage Roar", description: "Inflict fear on nearby enemies, reducing their physical damage by 25% for 6s." },
      { name: "War Cry", description: "Increase max health of yourself and nearby allies by 25 for 8s." },
    ],
  },
  Rogue: {
    perks: [
      { name: "Ambush", description: "Your first attack out of Hide deals 50% bonus damage." },
      { name: "Back Attack", description: "Deal 30% bonus damage when attacking from behind." },
      { name: "Creep", description: "Footstep sounds are reduced while crouching or walking slowly." },
      { name: "Dagger Expert", description: "Increase physical attack power by 5 when using a dagger." },
      { name: "Hidden Pockets", description: "Potions do not appear on your waist." },
      { name: "Lockpick Expert", description: "Able to pick locks without a lockpick." },
      { name: "Pickpocket", description: "Steal items from enemy players." },
      { name: "Poisoned Weapon", description: "Successful weapon attacks apply poison dealing 4 damage over 4s." },
      { name: "Stealth", description: "Become invisible while hiding in dark areas when not moving." },
      { name: "Trap Detection", description: "Highlight nearby traps." },
    ],
    skills: [
      { name: "Caltrops", description: "Throw caltrops on the ground, slowing enemies who walk over them." },
      { name: "Cut Throat", description: "Dashing attack that silences the target for 3s." },
      { name: "Hide", description: "Become invisible for 5s. Moving or attacking breaks stealth." },
      { name: "Rupture", description: "Stab that applies a bleed dealing damage over time." },
      { name: "Smoke Bomb", description: "Create a smoke cloud that blocks vision for 6s." },
      { name: "Weakpoint Attack", description: "Your next attack reduces target's armor by 50% for 5s." },
    ],
  },
  Ranger: {
    perks: [
      { name: "Chase", description: "Increase move speed by 10% for 3s after killing a target." },
      { name: "Crossbow Mastery", description: "Increase physical damage by 5% when using a crossbow." },
      { name: "Enhanced Hearing", description: "Extend the range of footstep sounds you can hear." },
      { name: "Kinesthesia", description: "Increase move speed by 10% while aiming a bow." },
      { name: "Nimble Hands", description: "Increase action speed by 15% when using a bow." },
      { name: "Ranged Weapons Expert", description: "Increase physical damage by 5% with ranged weapons." },
      { name: "Sharpshooter", description: "Increase headshot damage by 15%." },
      { name: "Spear Proficiency", description: "Increase physical damage by 5 when using a spear." },
      { name: "Tracking", description: "Monsters and players leave visible footprints." },
    ],
    skills: [
      { name: "Field Ration", description: "Eat rations to restore health over time." },
      { name: "Forceful Shot", description: "Fire a powerful arrow that knocks back the target." },
      { name: "Multishot", description: "Fire 5 arrows in a spread pattern." },
      { name: "Penetrating Shot", description: "Fire an arrow that pierces through targets." },
      { name: "Quick Fire", description: "Massively increase attack speed with bows for a short time." },
      { name: "Quick Shot", description: "Rapidly fire an arrow with reduced draw time." },
      { name: "True Shot", description: "Fire a perfectly accurate arrow with increased damage." },
    ],
  },
  Wizard: {
    perks: [
      { name: "Arcane Feedback", description: "Successful spell hits restore spell memory." },
      { name: "Arcane Mastery", description: "Increase arcane spell damage by 5%." },
      { name: "Fire Mastery", description: "Increase fire spell damage by 5%." },
      { name: "Ice Mastery", description: "Increase ice spell damage by 5%." },
      { name: "Ice Shield", description: "When hit, create a frost shield that reduces next damage by 20%." },
      { name: "Mana Surge", description: "Increase magical damage by 10% for 6s after casting." },
      { name: "Melt", description: "Fire spells apply a debuff reducing target's physical armor by 10%." },
      { name: "Quick Chant", description: "Increase spell casting speed by 15%." },
      { name: "Reactive Shield", description: "Automatically cast a shield when health drops below 15%." },
      { name: "Sage", description: "Increase knowledge by 10%." },
      { name: "Spell Overload", description: "Spells deal 2% more damage per remaining spell count." },
      { name: "Staff Mastery", description: "Increase magical damage by 5% when using a staff." },
    ],
    skills: [
      { name: "Arcane Shield", description: "Create a protective barrier absorbing damage." },
      { name: "Intense Focus", description: "Increase magical damage by 15% for 8s." },
      { name: "Meditation", description: "Recover spell casts over time while standing still." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
    spells: [
      { name: "Zap", tier: 1 },
      { name: "Light Orb", tier: 1 },
      { name: "Magic Lock", tier: 2 },
      { name: "Slow", tier: 2 },
      { name: "Ignite", tier: 2 },
      { name: "Ice Bolt", tier: 2 },
      { name: "Magic Missile", tier: 3 },
      { name: "Haste", tier: 3 },
      { name: "Lightning Strike", tier: 4 },
      { name: "Invisibility", tier: 4 },
      { name: "Fireball", tier: 4 },
      { name: "Explosion", tier: 5 },
      { name: "Chain Lightning", tier: 6 },
    ],
  },
  Cleric: {
    perks: [
      { name: "Advanced Healer", description: "Increase healing output by 5." },
      { name: "Blunt Weapon Mastery", description: "Increase physical damage by 5% with blunt weapons." },
      { name: "Brewmaster", description: "Potions last 30% longer." },
      { name: "Faithfulness", description: "Increase duration of self-cast spells by 10%." },
      { name: "Holy Aura", description: "Increase HP recovery of yourself and nearby allies by 3." },
      { name: "Holy Water", description: "Splash holy water to deal damage to undead and heal allies." },
      { name: "Kindness", description: "Healing spells also heal you for 15% of the amount." },
      { name: "Over Healing", description: "Excess healing grants a shield up to 10% max HP." },
      { name: "Perseverance", description: "Reduce incoming damage by 3 from all sources." },
      { name: "Protection from Evil", description: "Reduce damage from undead monsters by 15%." },
      { name: "Requiem", description: "Resurrect an ally with 25% HP using a resurrection shrine." },
      { name: "Undead Slaying", description: "Increase damage to undead monsters by 20%." },
    ],
    skills: [
      { name: "Divine Protection", description: "Grant a shield to yourself or ally that absorbs damage." },
      { name: "Holy Purification", description: "Create a zone that heals allies and damages undead." },
      { name: "Judgement", description: "Release a wave of holy energy dealing damage in a cone." },
      { name: "Smite", description: "Imbue your weapon with holy power. Next attack deals bonus damage." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
    spells: [
      { name: "Protection", tier: 1 },
      { name: "Bless", tier: 1 },
      { name: "Divine Strike", tier: 2 },
      { name: "Cleanse", tier: 2 },
      { name: "Lesser Heal", tier: 3 },
      { name: "Bind", tier: 3 },
      { name: "Holy Strike", tier: 4 },
      { name: "Holy Light", tier: 5 },
      { name: "Sanctuary", tier: 6 },
      { name: "Locust Swarm", tier: 7 },
      { name: "Earthquake", tier: 7 },
      { name: "Resurrection", tier: 8 },
    ],
  },
  Bard: {
    perks: [
      { name: "Charismatic Performance", description: "Increase buff duration of songs by 2s." },
      { name: "Dancing Feet", description: "Increase move speed by 10% while playing music." },
      { name: "Fermata", description: "Song effects linger 2s after the music stops." },
      { name: "Jolly Time", description: "Allies in range of your songs gain 10% action speed." },
      { name: "Lore Mastery", description: "Identify items 50% faster." },
      { name: "Melodic Protection", description: "Allies in range of your songs gain 10 armor rating." },
      { name: "Rapier Mastery", description: "Increase physical damage by 3 when using a rapier." },
      { name: "Reinforced Instruments", description: "Instruments take less durability damage." },
      { name: "Story Teller", description: "Increase interaction speed by 25%." },
      { name: "Superior Dexterity", description: "Increase dexterity by 10%." },
      { name: "Wanderer's Luck", description: "Increase luck by 50." },
      { name: "War Song", description: "Allies in range of your songs gain 3 physical power." },
    ],
    skills: [
      { name: "Dissonance", description: "Play a jarring note that interrupts enemies." },
      { name: "Encore", description: "Play the last song again instantly without cost." },
      { name: "Party Maker", description: "Throw a party popper that stuns nearby enemies." },
      { name: "Music Memory", description: "Memorize songs to play in the dungeon." },
      { name: "Music Memory 2", description: "Memorize additional songs to play in the dungeon." },
    ],
    songs: [
      { name: "Aria of Alacrity", tier: 1 },
      { name: "Ballad of Courage", tier: 1 },
      { name: "Beats of Alacrity", tier: 1 },
      { name: "Harmonic Shield", tier: 1 },
      { name: "Lament of Languor", tier: 2 },
      { name: "Song of Silence", tier: 2 },
      { name: "Tranquility", tier: 2 },
      { name: "Chaotic Discord", tier: 3 },
      { name: "Din of Darkness", tier: 3 },
      { name: "Peacemaking", tier: 3 },
      { name: "Piercing Shrill", tier: 3 },
      { name: "Rousing Rhythms", tier: 3 },
      { name: "Shriek of Weakness", tier: 3 },
      { name: "Song of Shadow", tier: 3 },
      { name: "Chorale of Clarity", tier: 3 },
      { name: "Banshees Howl", tier: 3 },
      { name: "Accelerando", tier: 4 },
      { name: "Allegro", tier: 4 },
      { name: "Unchained Harmony", tier: 5 },
    ],
  },
  Warlock: {
    perks: [
      { name: "Antimagic", description: "Increase magic resistance by 25%." },
      { name: "Curse Mastery", description: "Curse spells last 2s longer." },
      { name: "Dark Enhancement", description: "Dark magic spells deal 10% bonus damage." },
      { name: "Dark Reflection", description: "Reflect 10% of magical damage taken back to the attacker." },
      { name: "Demon Armor", description: "Gain 10 armor rating when you summon a demon." },
      { name: "Immortal Lament", description: "When health drops below 15%, gain damage reduction for 3s." },
      { name: "Infernal Pledge", description: "Spells cost health instead of spell memory." },
      { name: "Malice", description: "Deal 5% more damage to players." },
      { name: "Shadow Touch", description: "Melee attacks apply a dark curse reducing healing by 50%." },
      { name: "Soul Collector", description: "Killing a target restores 10% of max HP." },
      { name: "Torture Mastery", description: "Increase damage of damage-over-time effects by 10%." },
      { name: "Vampirism", description: "Spell damage heals you for a portion of damage dealt." },
    ],
    skills: [
      { name: "Blood Pact", description: "Sacrifice health to empower your next spell." },
      { name: "Blow of Corruption", description: "Melee strike that applies a curse dealing damage over time." },
      { name: "Dark Offering", description: "Sacrifice health to restore spell casts." },
      { name: "Phantomize", description: "Become ethereal for 4s, passing through obstacles and becoming untargetable." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
    spells: [
      { name: "Power of Sacrifice", tier: 1 },
      { name: "Curse of Weakness", tier: 1 },
      { name: "Bolt of Darkness", tier: 1 },
      { name: "Curse of Pain", tier: 2 },
      { name: "Bloodstained Blade", tier: 2 },
      { name: "Spell Predation", tier: 3 },
      { name: "Evil Eye", tier: 3 },
      { name: "Ray of Darkness", tier: 4 },
      { name: "Life Drain", tier: 4 },
      { name: "Hellfire", tier: 4 },
      { name: "Flame Walker", tier: 5 },
      { name: "Eldritch Shield", tier: 5 },
      { name: "Summon Hydra", tier: 6 },
    ],
  },
  Druid: {
    perks: [
      { name: "Dreamwalk", description: "Gain 10% move speed in human form." },
      { name: "Enhanced Wildness", description: "Increase damage in animal form by 5." },
      { name: "Force of Nature", description: "Increase spell damage by 10% in human form." },
      { name: "Herbal Sensing", description: "Highlight nearby herbs and healing items." },
      { name: "Lifebloom Aura", description: "Nearby allies slowly regenerate health." },
      { name: "Natural Healing", description: "Slowly regenerate 1 HP every 3s." },
      { name: "Shapeshift Mastery", description: "Reduce cooldown of shapeshifting." },
      { name: "Spirit Bond", description: "While in animal form, reduce damage taken by 5%." },
      { name: "Spirit Magic Mastery", description: "Increase spell damage by 5%." },
      { name: "Sun and Moon", description: "Alternate between bonus spell damage and bonus healing." },
      { name: "Thorn Coat", description: "Attackers take 5 physical damage when striking you in melee." },
    ],
    skills: [
      { name: "Shapeshift Memory", description: "Memorize animal forms to shapeshift into." },
      { name: "Shapeshift Memory 2", description: "Memorize additional animal forms." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
    ],
    spells: [
      { name: "Nature's Touch", tier: 1 },
      { name: "Barkskin Armor", tier: 2 },
      { name: "Orb of Nature", tier: 2 },
      { name: "Dreamfire", tier: 3 },
      { name: "Thorn Barrier", tier: 4 },
      { name: "Entangling Vines", tier: 4 },
      { name: "Restore", tier: 5 },
      { name: "Summon Treant", tier: 5 },
      { name: "Tree of Life", tier: 6 },
      { name: "Mending Grove", tier: 6 },
    ],
    shapeshiftForms: [
      "Bear",
      "Chicken",
      "Panther",
      "Rat",
      "Penguin",
    ],
  },
  Sorcerer: {
    perks: [
      { name: "Apex of Sorcery", description: "While casting spells, move at 1% movement speed, but gain 50% Magical Power Bonus and 50% Spell Casting Speed." },
      { name: "Mana Fold", description: "Reduces cooldowns to 0.75× their length while suffering a 15% reduction in spell casting velocity." },
      { name: "Spell Sculpting", description: "Increases the range of all spells to 125% and the area of effect by 25%, but increases radial spell cooldowns by 1.25×." },
      { name: "Spell Stride", description: "Grants 30% movement speed bonus when casting two spells simultaneously." },
      { name: "Time Distortion", description: "Reduces cast time of all spells by 50%, but increases cooldown time for all spells by 2×." },
      { name: "Merged Might", description: "Gain 5 magical power when casting merged spells; afterward, receive 5% movement speed bonus for 2 seconds." },
      { name: "Innate Talent", description: "When casting spells with bare hands, gain 5 Magical Power and 10% Spell Casting Speed." },
      { name: "Elemental Fury", description: "For each 1% health lost, gain 0.5% cooldown reduction and 0.25% magical power bonus." },
      { name: "Mana Flow", description: "For each successful spell cast, gain 5% Magical Power Bonus (stacks up to 3 times)." },
      { name: "Lightning Mastery", description: "Gain 25% lightning power bonus; once every 2 seconds while dealing lightning damage, transfer 5 lightning damage to closest target within 2m." },
      { name: "Air Mastery", description: "Gain 25% air knockback bonus and 50% air power bonus." },
    ],
    skills: [
      { name: "Sorcery Memory", description: "Gain the ability to use sorcery in the dungeon." },
      { name: "Sorcery Memory 2", description: "Gain the ability to use additional sorcery in the dungeon." },
      { name: "Sorcery Combat", description: "Gain the ability to wield magical casting weapons in melee combat." },
    ],
    spells: [
      { name: "Fire Arrow", tier: 1 },
      { name: "Stone Skin", tier: 1 },
      { name: "Water Bolt", tier: 1 },
      { name: "Glaciate", tier: 2 },
      { name: "Windblast", tier: 2 },
      { name: "Eruption", tier: 2 },
      { name: "Flamestrike", tier: 2 },
      { name: "Ice Spear", tier: 3 },
      { name: "Fire Orb", tier: 3 },
      { name: "Lightning Bolt", tier: 3 },
      { name: "Vortex", tier: 4 },
      { name: "Levitation", tier: 4 },
      { name: "Lightning Sphere", tier: 4 },
      { name: "Summon Earth Elemental", tier: 5 },
    ],
  },
};

export function getClassData(className: string): ClassPerksSkills | null {
  return CLASS_DATA[className] ?? null;
}
