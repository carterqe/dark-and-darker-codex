export interface PerkData {
  name: string;
  description: string;
}

export interface SkillData {
  name: string;
  description: string;
}

export interface ClassPerksSkills {
  perks: PerkData[];
  skills: SkillData[];
}

const WIKI = "https://darkanddarker.wiki.spellsandguns.com/Special:FilePath";

export function getPerkIconUrl(name: string): string {
  return `${WIKI}/Perk_${encodeURIComponent(name.replace(/ /g, "_"))}.png`;
}

export function getSkillIconUrl(name: string): string {
  return `${WIKI}/Skill_${encodeURIComponent(name.replace(/ /g, "_"))}.png`;
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
      { name: "Arcane Feedback", description: "Successful spell hits restore 5% max spell memory." },
      { name: "Arcane Mastery", description: "Increase arcane spell damage by 5%." },
      { name: "Fire Mastery", description: "Increase fire spell damage by 5%." },
      { name: "Ice Shield", description: "When hit, create a frost shield that reduces next damage by 20%." },
      { name: "Mana Surge", description: "Increase magical damage by 10% for 6s after casting." },
      { name: "Melt", description: "Fire spells apply a debuff reducing target's physical armor by 10%." },
      { name: "Quick Chant", description: "Increase spell casting speed by 15%." },
      { name: "Reactive Shield", description: "Automatically cast a shield when health drops below 15%." },
      { name: "Sage", description: "Increase knowledge by 10%." },
    ],
    skills: [
      { name: "Arcane Shield", description: "Create a protective barrier absorbing damage." },
      { name: "Intense Focus", description: "Increase magical damage by 15% for 8s." },
      { name: "Meditation", description: "Recover spell casts over time while standing still." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
  },
  Cleric: {
    perks: [
      { name: "Advanced Healer", description: "Increase healing output by 5." },
      { name: "Blunt Weapon Mastery", description: "Increase physical damage by 5% with blunt weapons." },
      { name: "Brewmaster", description: "Potions last 30% longer." },
      { name: "Holy Aura", description: "Increase HP recovery of yourself and nearby allies by 3." },
      { name: "Kindness", description: "Healing spells also heal you for 15% of the amount." },
      { name: "Perseverance", description: "Reduce incoming damage by 3 from all sources." },
      { name: "Protection from Evil", description: "Reduce damage from undead monsters by 15%." },
      { name: "Requiem", description: "Resurrect an ally with 25% HP using a resurrection shrine." },
      { name: "Undead Slaying", description: "Increase damage to undead monsters by 20%." },
    ],
    skills: [
      { name: "Holy Purification", description: "Create a zone that heals allies and damages undead." },
      { name: "Judgment", description: "Release a wave of holy energy dealing damage in a cone." },
      { name: "Smite", description: "Imbue your weapon with holy power. Next attack deals bonus damage." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
  },
  Bard: {
    perks: [
      { name: "Charismatic Performance", description: "Increase buff duration of songs by 2s." },
      { name: "Dancing Feet", description: "Increase move speed by 10% while playing music." },
      { name: "Jolly Time", description: "Allies in range of your songs gain 10% action speed." },
      { name: "Lore Mastery", description: "Identify items 50% faster." },
      { name: "Melodic Protection", description: "Allies in range of your songs gain 10 armor rating." },
      { name: "Rapier Mastery", description: "Increase physical damage by 3 when using a rapier." },
      { name: "Story Teller", description: "Increase interaction speed by 25%." },
      { name: "War Song", description: "Allies in range of your songs gain 3 physical power." },
    ],
    skills: [
      { name: "Encore", description: "Play the last song again instantly without cost." },
      { name: "Music Memory", description: "Memorize songs to play in the dungeon." },
      { name: "Music Memory 2", description: "Memorize additional songs to play in the dungeon." },
    ],
  },
  Warlock: {
    perks: [
      { name: "Antimagic", description: "Increase magic resistance by 25%." },
      { name: "Curse Mastery", description: "Curse spells last 2s longer." },
      { name: "Dark Enhancement", description: "Dark magic spells deal 10% bonus damage." },
      { name: "Dark Reflection", description: "Reflect 10% of magical damage taken back to the attacker." },
      { name: "Demon Armor", description: "Gain 10 armor rating when you summon a demon." },
      { name: "Infernal Surge", description: "After casting, gain 5% action speed for 5s." },
      { name: "Malice", description: "Deal 5% more damage to players." },
      { name: "Soul Collector", description: "Killing a target restores 10% of max HP." },
      { name: "Torture Mastery", description: "Increase damage of damage-over-time effects by 10%." },
    ],
    skills: [
      { name: "Phantomize", description: "Become ethereal for 4s, passing through obstacles and becoming untargetable." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
  },
  Druid: {
    perks: [
      { name: "Animal Kinship", description: "Reduce damage taken from animals by 25%." },
      { name: "Dreamwalk", description: "Gain 10% move speed in human form." },
      { name: "Enhanced Wildness", description: "Increase damage in animal form by 5." },
      { name: "Force of Nature", description: "Increase spell damage by 10% in human form." },
      { name: "Herbal Sensing", description: "Highlight nearby herbs and healing items." },
      { name: "Natural Healing", description: "Slowly regenerate 1 HP every 3s." },
      { name: "Spirit Bond", description: "While in animal form, reduce damage taken by 5%." },
      { name: "Thorn Coat", description: "Attackers take 5 physical damage when striking you in melee." },
    ],
    skills: [
      { name: "Nature's Touch", description: "Heal yourself or an ally for a moderate amount." },
      { name: "Shapeshift Memory", description: "Memorize animal forms to shapeshift into." },
      { name: "Spell Memory", description: "Memorize spells to cast in the dungeon." },
      { name: "Spell Memory 2", description: "Memorize additional spells to cast in the dungeon." },
    ],
  },
};

export function getClassData(className: string): ClassPerksSkills | null {
  return CLASS_DATA[className] ?? null;
}
