"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, Hammer, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  BUILD_CLASSES,
  BUILD_TAGS,
  GEAR_SLOTS,
  type BuildEquipment,
  type GearSlotKey,
} from "@/lib/build-types";
import { getClassPortrait } from "@/lib/darkerdb";
import { getClassData, getMemoryItems } from "@/lib/class-data";
import GearSlotEditor from "@/components/builds/GearSlotEditor";
import PerkSkillSelector from "@/components/builds/PerkSkillSelector";
import SpellSelector from "@/components/builds/SpellSelector";
import CharacterStatPanel from "@/components/builds/CharacterStatPanel";
import ShimmerText from "@/components/ui/ShimmerText";
import MedievalButton from "@/components/ui/MedievalButton";

const inputClass =
  "w-full px-3 py-2.5 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all";

const sectionLabel =
  "text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-2";

export default function CreateBuildClient() {
  const { user, profile, loading, openAuthModal, showToast } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<BuildEquipment>({});
  const [perks, setPerks] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [spells, setSpells] = useState<string[]>([]);
  const [gearMemoryBonus, setGearMemoryBonus] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classData = selectedClass ? getClassData(selectedClass) : null;

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAll = () => {
    setTitle("");
    setDescription("");
    setSelectedClass("");
    setTags([]);
    setEquipment({});
    setPerks([]);
    setSkills([]);
    setSpells([]);
    setError(null);
  };

  // Reset perks/skills when class changes
  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setPerks([]);
    setSkills([]);
    setSpells([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuthModal("login"); return; }
    if (!profile) { setError("Your profile isn't set up yet. Try signing out and back in."); return; }
    if (!title.trim()) { setError("Build title is required."); return; }
    if (!selectedClass) { setError("Please select a class."); return; }

    setSubmitting(true);
    setError(null);

    try {
      // Strip empty/null gear slots before saving
      const cleanEquipment: Record<string, unknown> = {};
      for (const [slot, item] of Object.entries(equipment)) {
        if (item) cleanEquipment[slot] = item;
      }

      const res = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          class: selectedClass,
          tags,
          equipment: cleanEquipment,
          perks,
          skills,
          spells,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to create build.");
        return;
      }

      showToast("Build published successfully!");
      router.push(`/builds/${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary/50 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Lock className="w-12 h-12 text-gold-dark mx-auto mb-4" />
        <h2 className="font-cinzel font-bold text-xl text-gold-primary mb-2">
          Sign in to Create Builds
        </h2>
        <p className="text-text-secondary mb-6">
          Join the community to share your loadouts with other adventurers.
        </p>
        <MedievalButton variant="primary" onClick={() => openAuthModal("signup")}>
          Create Account
        </MedievalButton>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          New Build
        </ShimmerText>
        <p className="text-text-secondary">
          Share your loadout with the community
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0" />
            <p className="text-sm text-accent-red">{error}</p>
          </div>
        )}

        {/* Class selection */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Class *</span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BUILD_CLASSES.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => handleClassChange(cls)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-sm border transition-all ${
                  selectedClass === cls
                    ? "border-gold-primary/50 bg-gold-primary/10"
                    : "border-border-subtle hover:border-gold-primary/30"
                }`}
              >
                <img
                  src={getClassPortrait(cls)}
                  alt={cls}
                  className="w-10 h-10 object-cover rounded-sm"
                />
                <span
                  className={`text-[10px] font-cinzel font-bold ${
                    selectedClass === cls
                      ? "text-gold-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {cls}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Title + Description */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-4">
          <div>
            <label className={sectionLabel}>Build Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
              placeholder="e.g. Dual Wield Speed Fighter, Budget Wizard..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={sectionLabel}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Explain your strategy, strengths, weaknesses, tips..."
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Tags</span>
          <div className="flex flex-wrap gap-2">
            {BUILD_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all cursor-pointer ${
                  tags.includes(tag)
                    ? "text-gold-light bg-bg-tertiary border-gold-primary/40"
                    : "text-text-secondary border-border-subtle hover:text-gold-primary hover:border-gold-dark"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Gear Slots</span>
          <div className="flex flex-col lg:flex-row gap-6 items-start mt-2">
            {/* Stat panel — left of gear grid on desktop, above on mobile */}
            <div className="w-full lg:w-64 xl:w-72 shrink-0">
              <CharacterStatPanel
                equipment={equipment}
                selectedClass={selectedClass}
                onMemoryCapacity={setGearMemoryBonus}
              />
            </div>
            {/* Gear grid */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-secondary mb-4">
                Select items, set rarity, then customize stat rolls.
              </p>
              {/* Armor slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GEAR_SLOTS.filter(({ key }) => key !== "primary" && key !== "secondary" && key !== "weapon2" && key !== "weapon2_offhand").map(({ key, label, slot_type }) => (
                  <GearSlotEditor
                    key={key}
                    slotLabel={label}
                    slotType={slot_type}
                    selectedClass={selectedClass}
                    value={equipment[key as GearSlotKey] ?? null}
                    onChange={(item) =>
                      setEquipment((prev) => ({ ...prev, [key]: item }))
                    }
                  />
                ))}
              </div>
              {/* Weapon slots */}
              <div className="mt-4 space-y-4">
                {/* Weapon 1 */}
                <div>
                  <span className={sectionLabel}>Weapon 1</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GearSlotEditor
                      slotLabel="Main Hand"
                      slotType="Primary"
                      selectedClass={selectedClass}
                      value={equipment.primary ?? null}
                      onChange={(item) =>
                        setEquipment((prev) => ({ ...prev, primary: item }))
                      }
                    />
                    <GearSlotEditor
                      slotLabel="Off-hand"
                      slotType="Secondary"
                      selectedClass={selectedClass}
                      value={equipment.secondary ?? null}
                      onChange={(item) =>
                        setEquipment((prev) => ({ ...prev, secondary: item }))
                      }
                    />
                  </div>
                </div>
                {/* Weapon 2 */}
                <div>
                  <span className={sectionLabel}>Weapon 2</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GearSlotEditor
                      slotLabel="Main Hand"
                      slotType="Primary"
                      selectedClass={selectedClass}
                      value={equipment.weapon2 ?? null}
                      onChange={(item) =>
                        setEquipment((prev) => ({ ...prev, weapon2: item }))
                      }
                    />
                    <GearSlotEditor
                      slotLabel="Off-hand"
                      slotType="Secondary"
                      selectedClass={selectedClass}
                      value={equipment.weapon2_offhand ?? null}
                      onChange={(item) =>
                        setEquipment((prev) => ({ ...prev, weapon2_offhand: item }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perks */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>
            Perks{" "}
            <span className="text-text-secondary font-normal normal-case">
              (select up to 4)
            </span>
          </span>
          {classData ? (
            <>
              <p className="text-xs text-text-secondary mb-3">
                {perks.length}/4 selected for {selectedClass}
              </p>
              <PerkSkillSelector
                type="perk"
                items={classData.perks}
                selected={perks}
                max={4}
                onChange={setPerks}
              />
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 py-4 text-center">
              Select a class above to see available perks.
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>
            Skills{" "}
            <span className="text-text-secondary font-normal normal-case">
              (select up to 2)
            </span>
          </span>
          {classData ? (
            <>
              <p className="text-xs text-text-secondary mb-3">
                {skills.length}/2 selected for {selectedClass}
              </p>
              <PerkSkillSelector
                type="skill"
                items={classData.skills}
                selected={skills}
                max={2}
                onChange={(next) => {
                  setSkills(next);
                  // Clear spells if all memory skills are deselected
                  const hasMemory = next.some((s) => s.includes("Memory"));
                  if (!hasMemory) setSpells([]);
                }}
              />
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 py-4 text-center">
              Select a class above to see available skills.
            </p>
          )}
        </div>

        {/* Spells / Songs / Forms (shown when a memory skill is selected) */}
        {selectedClass && (() => {
          const memoryGroups = getMemoryItems(selectedClass, skills);
          if (memoryGroups.length === 0) return null;
          return (
            <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-4">
              <span className={sectionLabel}>Memorized Spells / Songs / Forms</span>
              <p className="text-xs text-text-secondary mb-3">
                Select the spells, songs, or forms your character has memorized.
              </p>
              {memoryGroups.map((group) => (
                <SpellSelector
                  key={group.type}
                  label={group.label}
                  items={group.items}
                  selected={spells}
                  maxMemory={group.capacity + gearMemoryBonus}
                  onChange={setSpells}
                />
              ))}
            </div>
          );
        })()}

        {/* Submit */}
        {error && (
          <div className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0" />
            <p className="text-sm text-accent-red">{error}</p>
          </div>
        )}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-text-secondary hover:text-accent-red transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <MedievalButton type="submit" variant="primary" loading={submitting}>
            <Hammer className="w-4 h-4" />
            {submitting ? "Publishing..." : "Publish Build"}
          </MedievalButton>
        </div>
      </form>
    </div>
  );
}
