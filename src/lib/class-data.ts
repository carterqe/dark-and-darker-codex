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
  /**
   * Inherent memory capacity the class has without any Memory skill selected.
   * Classes with a value > 0 always show the spell/song/form selector.
   */
  baseMemory?: {
    spell?:      number;
    music?:      number;
    shapeshift?: number;
    sorcery?:    number;
  };
  /**
   * Additional capacity granted by Memory skills: [skill 1 only, skill 1 + skill 2]
   * Spell costs = spell tier. Form costs = 1 per form.
   */
  memoryCapacity?: {
    spell?:      [number, number];
    music?:      [number, number];
    shapeshift?: [number, number];
    sorcery?:    [number, number];
  };
}

const WIKI = "https://darkanddarker.wiki.spellsandguns.com/Special:FilePath";

// Overrides for icons whose wiki filenames differ from our display names.
// Value format: "<WikiPrefix>_<WikiSlug>" — the function appends ".png".
const ICON_OVERRIDES: Record<string, string> = {
  // Perks
  "Two-Handed Weapon Expert": "Perk_Two_Handed_Weapon_Expert", // hyphen removed on wiki
  "Blood Exchange":           "Skill_Blood_Exchange",           // filed under Skill on wiki
  "Wanderer's Luck":          "Perk_Wanderers_Luck",            // no apostrophe on wiki
  "Trap and Locks":           "Perk_Trap_And_Locks",            // capitalisation on wiki
  "Ranged Weapons Mastery":   "Perk_Ranged_Weapons_Expert",     // icon may still use old name on wiki
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

// Returns the memory type label, available items, and memory capacity based on selected skills
export function getMemoryItems(className: string, selectedSkills: string[]): {
  type: "spells" | "songs" | "forms";
  label: string;
  items: { name: string; tier?: number }[];
  capacity: number;
}[] {
  const data = CLASS_DATA[className];
  if (!data) return [];

  const cap  = data.memoryCapacity ?? {};
  const base = data.baseMemory     ?? {};

  /** Additional capacity granted by Memory skills on top of any base memory. */
  function skillSlots(
    prefix: string,
    pair: [number, number] | undefined,
    defaultPair: [number, number] = [4, 8]
  ): number {
    const [s1, s1s2] = pair ?? defaultPair;
    const hasBase = selectedSkills.includes(prefix);
    const hasT2   = selectedSkills.includes(`${prefix} 2`);
    if (hasBase && hasT2) return s1s2;
    if (hasBase)           return s1;
    return 0;
  }

  const results: { type: "spells" | "songs" | "forms"; label: string; items: { name: string; tier?: number }[]; capacity: number }[] = [];

  const hasSpellMemorySkill = selectedSkills.some((s) => s.startsWith("Spell Memory"));
  if ((hasSpellMemorySkill || base.spell !== undefined) && data.spells) {
    results.push({ type: "spells",  label: "Spells",           items: data.spells, capacity: (base.spell ?? 0) + skillSlots("Spell Memory", cap.spell) });
  }

  const hasMusicMemorySkill = selectedSkills.some((s) => s.startsWith("Music Memory"));
  if ((hasMusicMemorySkill || (base.music ?? 0) > 0) && data.songs) {
    results.push({ type: "songs",   label: "Songs",            items: data.songs,  capacity: (base.music ?? 0) + skillSlots("Music Memory", cap.music) });
  }

  const hasShapeshiftMemorySkill = selectedSkills.some((s) => s.startsWith("Shapeshift Memory"));
  if ((hasShapeshiftMemorySkill || (base.shapeshift ?? 0) > 0) && data.shapeshiftForms) {
    results.push({ type: "forms",   label: "Shapeshift Forms", items: data.shapeshiftForms.map((f) => ({ name: f })), capacity: (base.shapeshift ?? 0) + skillSlots("Shapeshift Memory", cap.shapeshift, [2, 4]) });
  }

  const hasSorceryMemorySkill = selectedSkills.some((s) => s.startsWith("Sorcery Memory"));
  if ((hasSorceryMemorySkill || (base.sorcery ?? 0) > 0) && data.spells) {
    results.push({ type: "spells",  label: "Sorcery",          items: data.spells, capacity: (base.sorcery ?? 0) + skillSlots("Sorcery Memory", cap.sorcery) });
  }

  return results;
}

export const CLASS_DATA: Record<string, ClassPerksSkills> = {
  Fighter: {
    perks: [
      { name: "Adrenaline Spike", description: "When your health drops below 40%, gain 15% action speed for 12s." },
      { name: "Combo Attack", description: "Successful melee attacks increase physical damage by 10% for 2s." },
      { name: "Counterattack", description: "Successful block increases action speed by 10% for 3s." },
      { name: "Defense Mastery", description: "Increase armor rating bonus from equipped armor by 10%." },
      { name: "Dual Wield", description: "While you have weapons equipped in both hands, gain 10% action speed." },
      { name: "Projectile Resistance", description: "Reduce incoming projectile damage by 10%." },
      { name: "Shield Mastery", description: "While in defensive stance, gain 10% move speed. When you successfully block an attack, gain 50% action speed towards your next block." },
      { name: "Swift", description: "Increase base move speed by 5." },
      { name: "Sword Mastery", description: "Increase physical attack power by 5 when using a sword." },
      { name: "Weapon Mastery", description: "Allows equipping any weapon regardless of class requirement." },
    ],
    skills: [
      { name: "Adrenaline Rush", description: "Increase action speed by 25% for 8s. After the duration ends, attack and movement speed are temporarily reduced for 6s." },
      { name: "Breakthrough", description: "Remove all movement speed debuffs and gain complete knockback immunity for 8s." },
      { name: "Perfect Block", description: "Blocks all incoming damage for 1 attack within a short window." },
      { name: "Second Wind", description: "Recover 50% of max health over 12s." },
      { name: "Shield Slam", description: "Deal 25 physical damage and reduce the target's move speed by 20% for 2s." },
      { name: "Sprint", description: "Increase move speed by 30% for 6s." },
      { name: "Taunt", description: "Increase aggro to all monsters within 7.5m by 50% and gain 15% defense rating bonus for 8s." },
      { name: "Victory Strike", description: "Your next attack deals 20% bonus damage. Heals 5% of max HP on kill." },
    ],
  },
  Barbarian: {
    perks: [
      { name: "Axe Specialization", description: "Increase physical attack power by 5 when using an axe." },
      { name: "Berserker", description: "Gain 3% damage for every 10% HP missing." },
      { name: "Blood Exchange", description: "Sacrifice 30 HP to boost physical attack power by 10 for 8s." },
      { name: "Carnage", description: "Killing a target grants +75 armor rating for 7s." },
      { name: "Iron Will", description: "Increase magic resistance by 100." },
      { name: "Morale Boost", description: "Killing a player recovers 12% of maximum HP." },
      { name: "Robust", description: "Increase max health bonus by 15%." },
      { name: "Savage", description: "Increase physical damage by 10% when not wearing chest armor." },
      { name: "Smash", description: "Allows destroying unreinforced doors and containers. Slightly increases attack power when breaking blocks or parries." },
      { name: "Toughness", description: "Increase max health bonus by 10%." },
      { name: "Treacherous Lungs", description: "Increase the duration of all shout skills by 30%." },
      { name: "Two-Handed Weapon Expert", description: "Increase physical damage by 5% when using a two-handed weapon." },
    ],
    skills: [
      { name: "Achilles Strike", description: "Slash that reduces target's move speed by 40% for 3s." },
      { name: "Rage", description: "Increase strength by 10 and move speed by 15% for 6s. Defense is reduced by 20% during this time." },
      { name: "Reckless Attack", description: "Your next attack ignores 75% of the target's defense. Your own armor rating is reduced by 55 for the duration." },
      { name: "Savage Roar", description: "Inflict fear on nearby enemies, reducing their physical damage by 25% for 6s." },
      { name: "War Cry", description: "Increase max health of yourself and nearby allies by 25% for 7s." },
    ],
  },
  Rogue: {
    perks: [
      { name: "Ambush", description: "When coming out of Hide, gain 10% move speed and 50% physical damage bonus for 3s." },
      { name: "Creep", description: "Completely eliminate footstep sounds while crouching or moving slowly." },
      { name: "Dagger Mastery", description: "Increase physical damage by 15% when using a dagger." },
      { name: "Double Jump", description: "Gain the ability to jump an additional time in the air, but lose 18 move speed." },
      { name: "Hide Mastery", description: "Extends the duration of the Hide skill by 40 seconds." },
      { name: "Jokester", description: "Give yourself and all nearby party members +2 to all attributes." },
      { name: "Lethal Mark", description: "Mark a target with your first attack; deal 20% bonus damage to marked targets." },
      { name: "Pickpocket", description: "Steal items from nearby enemies. Your Hide will not be revealed when bumped into. Items worn in utility slots do not appear on the waist." },
      { name: "Poisoned Weapon", description: "Successful weapon attacks apply poison dealing 4 magic damage over 4s. Stacks up to 5 times." },
      { name: "Stealth", description: "While in Hide, you can move up to 10 steps while crouching." },
      { name: "Thrust", description: "While using a dagger, gain 20% armor penetration." },
      { name: "Trap and Locks", description: "Pick locks without a lockpick and detect and disarm nearby traps." },
      { name: "Trickster", description: "Successfully dodging an attack resets the cooldown of your active skill." },
      { name: "Veil of Shadows", description: "While in Hide, move at 30% speed instead of being fully stopped." },
    ],
    skills: [
      { name: "Caltrops", description: "Throw caltrops on the ground, dealing 10 physical damage and slowing enemies by 50% for 2s." },
      { name: "Cut Throat", description: "Dashing attack that silences the target for 3s." },
      { name: "Dual Strike", description: "Rapidly strike twice in quick succession with your equipped weapons." },
      { name: "Hide", description: "Become invisible. You can swap equipment while hidden, but any movement, attack, or skill use will reveal you." },
      { name: "Rupture", description: "Stab the target, causing them to bleed for 20 physical damage over 5s." },
      { name: "Shadowstep", description: "Instantly teleport behind a targeted enemy within short range." },
      { name: "Smoke Bomb", description: "Create a smoke cloud covering a 7.5m area for 30s. Enemies entering the smoke have their move speed reduced by 20%." },
      { name: "Sneak Attack", description: "Your next attack deals 50% additional weapon damage." },
      { name: "Weakpoint Attack", description: "If successful, reduces the target's defense by 50% for 5s." },
    ],
  },
  Ranger: {
    perks: [
      { name: "Chase", description: "Increase move speed by 10% for 3s after killing a target." },
      { name: "Crossbow Mastery", description: "Increase physical damage by 5% when using a crossbow. Gain 50% action speed while reloading a crossbow." },
      { name: "Enhanced Hearing", description: "Extend the range of footstep sounds you can hear." },
      { name: "First Aid", description: "Using a bandage or healing item restores 30% more health." },
      { name: "Kinesthesia", description: "Increase move speed by 10% while drawing a bow." },
      { name: "Longshot Expert", description: "Deal up to 20 additional physical damage to targets at long range, scaling with distance." },
      { name: "Nimble Hands", description: "Increase draw speed by 15% when using a bow." },
      { name: "Point-Blank Expert", description: "Deal 3 additional true physical damage to targets within close range." },
      { name: "Ranged Weapons Mastery", description: "Increase physical damage by 5% with ranged weapons." },
      { name: "Sharpshooter", description: "Increase headshot damage by 15%." },
      { name: "Spear Proficiency", description: "Gain +10 Strength when attacking with a spear." },
      { name: "Tracking", description: "Monsters and players leave visible footprints." },
      { name: "Trap Expert", description: "Install traps faster." },
      { name: "Windfletch", description: "Arrows and bolts travel 25% faster." },
    ],
    skills: [
      { name: "Explosive Shot", description: "Fire an explosive arrow that detonates 3s after impact, dealing 5 magic damage to nearby enemies and applying a 1s burn." },
      { name: "Field Ration", description: "Instantly recover 25 health." },
      { name: "Forceful Shot", description: "Fire a powerful arrow that knocks back the target." },
      { name: "Multishot", description: "Fire 5 arrows in a spread pattern." },
      { name: "Overdraw", description: "Hold the draw past the normal release point for up to 3s, greatly increasing arrow damage and range." },
      { name: "Penetrating Shot", description: "Fire an arrow that pierces through targets." },
      { name: "Quick Fire", description: "When attacking with a bow, increase action speed by 50% for 8s." },
      { name: "Quick Shot", description: "Hold three arrows in your shooting hand and fire them rapidly in succession." },
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
    memoryCapacity: { spell: [5, 5] },
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
    memoryCapacity: { spell: [5, 5] },
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
    memoryCapacity: { music: [5, 5] },
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
      { name: "Antimagic", description: "Increase magic resistance by 15%, except against divine magic." },
      { name: "Curse Mastery", description: "Increase the duration of all curses you cast by 30%." },
      { name: "Dark Enhancement", description: "Dark magic spells deal 10% bonus damage." },
      { name: "Dark Reflection", description: "Reflect 10 magical damage to the melee attacker when struck." },
      { name: "Demon Armor", description: "Allows equipping plate armor, but reduces spell casting speed by 10%." },
      { name: "Immortal Lament", description: "Casting spells will no longer reduce your health below 1." },
      { name: "Infernal Pledge", description: "Reduce damage taken from Undead and Demons by 25%." },
      { name: "Malice", description: "Increase Will, boosting your magical damage output." },
      { name: "Shadow Touch", description: "Dealing physical damage with a melee weapon deals 3 true magical damage and restores 3 health." },
      { name: "Soul Collector", description: "Killing an enemy charges a Darkness Shard. Each shard grants 20% dark magic damage bonus (up to 5). Shards are consumed when casting a dark magic spell." },
      { name: "Torture Mastery", description: "Each tick of curse damage restores 2 health. All Warlock spell costs are tripled while this perk is equipped." },
      { name: "Vampirism", description: "Increase magical healing bonus by 20%." },
    ],
    skills: [
      { name: "Blood Pact", description: "Transform into Demon Form, gaining +50 max health, +30 armor rating, and +30 magic resistance. Emits magical damage to nearby enemies and consumes Darkness Shards to gain +1 to all attributes per shard." },
      { name: "Blow of Corruption", description: "Melee strike that applies a curse dealing damage over time." },
      { name: "Dark Offering", description: "Sacrifice health to restore spell casts." },
      { name: "Phantomize", description: "Become ethereal for 4s, preventing direct targeting. Existing area effects and damage over time can still affect you." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
    baseMemory:     { spell: 0 },
    memoryCapacity: { spell: [2, 2] },
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
      { name: "Dreamwalk", description: "When receiving damage in human form, gain 5 Magical Power for 4s and briefly become a spirit: pass through targets and become invincible, but cannot attack or use skills." },
      { name: "Enhanced Wildness", description: "Increase damage in animal form by 5." },
      { name: "Force of Nature", description: "Increase spell damage by 10% in human form." },
      { name: "Herbal Sensing", description: "Highlight nearby herbs and healing items." },
      { name: "Lifebloom Aura", description: "Nearby allies slowly regenerate health." },
      { name: "Natural Healing", description: "Restore 1 health every 3s to yourself and nearby allies." },
      { name: "Shapeshift Mastery", description: "Reduce cooldown of shapeshifting." },
      { name: "Spirit Bond", description: "Every second, absorb 15% of damage taken by party members, up to 20 damage per instance." },
      { name: "Spirit Magic Mastery", description: "Increase spell damage by 5%." },
      { name: "Sun and Moon", description: "Alternate between bonus spell damage and bonus healing." },
      { name: "Thorn Coat", description: "Attackers take 5 true damage when striking you in melee." },
    ],
    skills: [
      { name: "Shapeshift Memory", description: "Memorize animal forms to shapeshift into." },
      { name: "Shapeshift Memory 2", description: "Memorize additional animal forms." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
    ],
    memoryCapacity: { spell: [5, 5], shapeshift: [5, 5] },
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
      { name: "Apex of Sorcery", description: "While casting spells, reduce movement speed by 99%, but gain 50% magic damage bonus and 50% spell casting speed." },
      { name: "Mana Fold", description: "Reduce all spell cooldowns by 25%, but lose 15% spell casting speed." },
      { name: "Spell Sculpting", description: "Increase spell range by 25% and area of effect by 25%, but increase all spell cooldowns by 25%." },
      { name: "Spell Stride", description: "Gain 5% movement speed bonus while casting spells." },
      { name: "Time Distortion", description: "All spell casting times are reduced to instant, but cooldown times are 3× as long." },
      { name: "Merged Might", description: "Gain 5 magical power when casting merged spells; afterward, receive 5% movement speed bonus for 2 seconds." },
      { name: "Innate Talent", description: "When casting spells with bare hands, gain 7 Magical Power." },
      { name: "Elemental Fury", description: "For each 1% health lost, gain 0.75% cooldown reduction." },
      { name: "Mana Flow", description: "For each successful spell cast, gain 10% magic damage bonus (stacks up to 3 times)." },
      { name: "Lightning Mastery", description: "Once every 3 seconds while dealing lightning magic damage, inflict electric shock for 2 seconds, transferring 5 lightning magical damage to the closest target within 2m." },
      { name: "Air Mastery", description: "Gain 50% air magic knockback bonus and 50% air magic damage bonus." },
    ],
    skills: [
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
    memoryCapacity: { spell: [5, 5] },
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
