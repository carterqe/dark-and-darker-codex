"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Hammer, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  BUILD_CLASSES,
  BUILD_TAGS,
  GEAR_SLOTS,
  type Build,
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

export default function EditBuildClient({ id }: { id: string }) {
  const { supabase, user, profile, loading: authLoading, openAuthModal, showToast } = useAuth();
  const router = useRouter();

  const [buildLoading, setBuildLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [forbidden, setForbidden] = useState(false);

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

  // Load existing build and pre-populate form
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    supabase
      .from("builds")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); setBuildLoading(false); return; }
        const build = data as Build;
        if (build.author_id !== user.id) { setForbidden(true); setBuildLoading(false); return; }
        setTitle(build.title);
        setDescription(build.description ?? "");
        setSelectedClass(build.class);
        setTags(build.tags ?? []);
        setEquipment((build.equipment as BuildEquipment) ?? {});
        setPerks(build.perks ?? []);
        setSkills(build.skills ?? []);
        setSpells(build.spells ?? []);
        setBuildLoading(false);
      });
  }, [supabase, id, user, authLoading]);

  const toggleTag = (tag: string) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

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
      const cleanEquipment: Record<string, unknown> = {};
      for (const [slot, item] of Object.entries(equipment)) {
        if (item) cleanEquipment[slot] = item;
      }

      const res = await fetch(`/api/builds/${id}`, {
        method: "PATCH",
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
      if (!res.ok) { setError(json.error ?? "Failed to save changes."); return; }

      showToast("Build updated!");
      router.push(`/builds/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || buildLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-bg-secondary/50 rounded-sm animate-pulse" />
        ))}
        <div className="flex justify-center pt-4">
          <Loader2 className="w-5 h-5 animate-spin text-text-secondary/40" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Lock className="w-12 h-12 text-gold-dark mx-auto mb-4" />
        <h2 className="font-cinzel font-bold text-xl text-gold-primary mb-2">Sign in to edit builds</h2>
        <MedievalButton variant="primary" onClick={() => openAuthModal("login")}>Sign In</MedievalButton>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="font-cinzel text-lg text-text-secondary">Build not found.</p>
        <Link href="/builds" className="flex items-center justify-center gap-1.5 text-gold-primary hover:text-gold-light text-sm mt-4">
          <ArrowLeft className="w-3 h-3" /> Back to Builds
        </Link>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Lock className="w-12 h-12 text-gold-dark mx-auto mb-4" />
        <p className="font-cinzel text-lg text-text-secondary">You don&apos;t have permission to edit this build.</p>
        <Link href={`/builds/${id}`} className="text-gold-primary hover:text-gold-light text-sm mt-4 inline-block">← Back to Build</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/builds/${id}`}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Build
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Edit Build
        </ShimmerText>
        <p className="text-text-secondary">Make changes and save your updated loadout.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0" />
            <p className="text-sm text-accent-red">{error}</p>
          </div>
        )}

        {/* Class */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Class *</span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BUILD_CLASSES.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => handleClassChange(cls)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-sm border transition-all focus-visible:ring-2 focus-visible:ring-gold-primary/50 ${
                  selectedClass === cls
                    ? "border-gold-primary/50 bg-gold-primary/10"
                    : "border-border-subtle hover:border-gold-primary/30"
                }`}
              >
                <img src={getClassPortrait(cls)} alt={cls} className="w-10 h-10 object-cover rounded-sm" />
                <span className={`text-[10px] font-cinzel font-bold ${selectedClass === cls ? "text-gold-primary" : "text-text-secondary"}`}>
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
            <div className="w-full lg:w-64 xl:w-72 shrink-0">
              <CharacterStatPanel equipment={equipment} selectedClass={selectedClass} onMemoryCapacity={setGearMemoryBonus} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GEAR_SLOTS.filter(({ key }) => key !== "primary" && key !== "secondary" && key !== "weapon2" && key !== "weapon2_offhand").map(({ key, label, slot_type }) => (
                  <GearSlotEditor
                    key={key}
                    slotLabel={label}
                    slotType={slot_type}
                    selectedClass={selectedClass}
                    value={equipment[key as GearSlotKey] ?? null}
                    onChange={(item) => setEquipment((prev) => ({ ...prev, [key]: item }))}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <span className={sectionLabel}>Weapon 1</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GearSlotEditor slotLabel="Main Hand" slotType="Primary" selectedClass={selectedClass} value={equipment.primary ?? null} onChange={(item) => setEquipment((prev) => ({ ...prev, primary: item }))} />
                    <GearSlotEditor slotLabel="Off-hand" slotType={["Secondary", "Shield"]} selectedClass={selectedClass} value={equipment.secondary ?? null} onChange={(item) => setEquipment((prev) => ({ ...prev, secondary: item }))} />
                  </div>
                </div>
                <div>
                  <span className={sectionLabel}>Weapon 2</span>
                  <p className="text-xs text-text-secondary/60 mb-2">Optional swap set — useful for carrying a ranged backup or a situational off-hand.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GearSlotEditor slotLabel="Main Hand" slotType="Primary" selectedClass={selectedClass} value={equipment.weapon2 ?? null} onChange={(item) => setEquipment((prev) => ({ ...prev, weapon2: item }))} />
                    <GearSlotEditor slotLabel="Off-hand" slotType={["Secondary", "Shield"]} selectedClass={selectedClass} value={equipment.weapon2_offhand ?? null} onChange={(item) => setEquipment((prev) => ({ ...prev, weapon2_offhand: item }))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perks */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Perks <span className="text-text-secondary font-normal normal-case">(select up to 4)</span></span>
          {classData ? (
            <>
              <p className="text-xs text-text-secondary mb-3">{perks.length}/4 selected for {selectedClass}</p>
              <PerkSkillSelector type="perk" items={classData.perks} selected={perks} max={4} onChange={setPerks} />
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 py-4 text-center">Select a class above to see available perks.</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6">
          <span className={sectionLabel}>Skills <span className="text-text-secondary font-normal normal-case">(select up to 2)</span></span>
          {classData ? (
            <>
              <p className="text-xs text-text-secondary mb-3">{skills.length}/2 selected for {selectedClass}</p>
              <PerkSkillSelector
                type="skill"
                items={classData.skills}
                selected={skills}
                max={2}
                onChange={(next) => {
                  setSkills(next);
                  if (!next.some((s) => s.includes("Memory"))) setSpells([]);
                }}
              />
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 py-4 text-center">Select a class above to see available skills.</p>
          )}
        </div>

        {/* Spells */}
        {selectedClass && (() => {
          const memoryGroups = getMemoryItems(selectedClass, skills);
          if (memoryGroups.length === 0) return null;
          return (
            <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-4">
              <span className={sectionLabel}>Memorized Spells / Songs / Forms</span>
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
        <div className="flex items-center justify-end gap-4">
          <Link
            href={`/builds/${id}`}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </Link>
          <MedievalButton type="submit" variant="primary" loading={submitting}>
            <Hammer className="w-4 h-4" />
            {submitting ? "Saving…" : "Save Changes"}
          </MedievalButton>
        </div>
      </form>
    </div>
  );
}
