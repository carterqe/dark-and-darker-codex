"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEADERBOARD_CATEGORIES, fetchLeaderboard, getClassPortrait } from "@/lib/darkerdb";
import { CLASS_DATA, getPerkIconUrl, getSkillIconUrl } from "@/lib/class-data";
import ShimmerText from "@/components/ui/ShimmerText";

const CLASSES = ["Fighter", "Barbarian", "Rogue", "Ranger", "Wizard", "Cleric", "Bard", "Warlock", "Druid", "Sorcerer"];

const CLASS_DESCRIPTIONS: Record<string, string> = {
  Fighter:   "A versatile frontline combatant skilled with swords, shields, and heavy armor. Excels at controlling engagements and sustaining through fights.",
  Barbarian: "A ferocious berserker who trades defense for raw power. Massive health pools and devastating two-handed weapons make them a terrifying presence.",
  Rogue:     "A nimble assassin who strikes from the shadows. Masters of stealth, traps, and burst damage — deadly if you never see them coming.",
  Ranger:    "A patient hunter who dominates at range with bows and spears. Superior tracking and mobility make them difficult to pin down.",
  Wizard:    "A fragile but devastating spellcaster. Commands arcane, fire, and ice magic capable of wiping entire rooms in seconds.",
  Cleric:    "A holy warrior who heals allies and smites the undead. One of the most team-dependent classes, but invaluable in a party.",
  Bard:      "A support class that buffs allies through music. Deceptively strong solo fighter with access to disabling songs and social tools.",
  Warlock:   "A dark magic user who drains life and curses enemies. Sustains through damage dealt and punishes targets with damage-over-time.",
  Druid:     "A shapeshifter who alternates between human spell-casting and powerful animal forms. Highly versatile but demanding to master.",
  Sorcerer:  "A dual-spell weaver who merges elemental magic for unique effects. Extremely high skill ceiling with some of the strongest burst potential.",
};

function IconImg({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) return <div className="w-7 h-7 rounded-sm bg-bg-primary/60 shrink-0" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={28}
      height={28}
      className="rounded-sm shrink-0 object-contain"
      onError={() => setErr(true)}
      unoptimized
    />
  );
}

export default function ClassDetailClient({ className }: { className: string }) {
  const [pickRate, setPickRate] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(
          LEADERBOARD_CATEGORIES.map((cat) =>
            fetchLeaderboard({ category: cat.value, limit: 250 })
              .then((r) => r.body || [])
              .catch(() => [])
          )
        );
        const all = results.flat();
        const total = all.length;
        const count = all.filter((e) => e.class === className).length;
        setPickRate(total > 0 ? Math.round((count / total) * 1000) / 10 : 0);
      } catch {
        setPickRate(null);
      }
    }
    load();
  }, [className]);

  const data = CLASS_DATA[className];
  const description = CLASS_DESCRIPTIONS[className] ?? "";

  const tiersBySpell = data?.spells
    ? [...new Set(data.spells.map((s) => s.tier))].sort((a, b) => a - b)
    : [];
  const tiersBySong = data?.songs
    ? [...new Set(data.songs.map((s) => s.tier))].sort((a, b) => a - b)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/classes"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-primary transition-colors text-sm mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Classes
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10"
      >
        <div className="relative w-24 h-24 rounded-full border-2 border-gold-primary/40 overflow-hidden shrink-0">
          <Image src={getClassPortrait(className)} alt={className} fill sizes="96px" className="object-cover" />
        </div>
        <div className="text-center sm:text-left">
          <ShimmerText as="h1" className="text-3xl sm:text-4xl mb-2">
            {className}
          </ShimmerText>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">{description}</p>

          {/* Pick rate */}
          <div className="mt-4 flex items-center gap-3 justify-center sm:justify-start">
            <span className="text-xs text-text-secondary/60">Pick rate</span>
            {pickRate === null ? (
              <span className="w-12 h-3 bg-bg-secondary rounded animate-pulse inline-block" />
            ) : (
              <span className="text-sm font-cinzel font-bold text-gold-primary">{pickRate}%</span>
            )}
            <div className="flex-1 max-w-[160px] h-1 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-primary/60 rounded-full transition-all duration-700"
                style={{ width: pickRate !== null ? `${Math.min(pickRate * 4.5, 100)}%` : "0%" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Perks */}
        {data && (
          <Section title="Perks" delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.perks.map((perk) => (
                <div key={perk.name} className="flex items-start gap-3 p-3 bg-bg-primary/30 rounded-sm border border-border-subtle/50">
                  <IconImg src={getPerkIconUrl(perk.name)} alt={perk.name} />
                  <div className="min-w-0">
                    <p className="text-xs font-cinzel font-bold text-gold-dark leading-snug">{perk.name}</p>
                    <p className="text-[11px] text-text-secondary/70 mt-0.5 leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {data && (
          <Section title="Skills" delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.skills.map((skill) => (
                <div key={skill.name} className="flex items-start gap-3 p-3 bg-bg-primary/30 rounded-sm border border-border-subtle/50">
                  <IconImg src={getSkillIconUrl(skill.name)} alt={skill.name} />
                  <div className="min-w-0">
                    <p className="text-xs font-cinzel font-bold text-gold-dark leading-snug">{skill.name}</p>
                    <p className="text-[11px] text-text-secondary/70 mt-0.5 leading-relaxed">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Spells */}
        {data?.spells && data.spells.length > 0 && (
          <Section title="Spells" delay={0.2}>
            <div className="space-y-4">
              {tiersBySpell.map((tier) => (
                <div key={tier}>
                  <p className="text-[10px] uppercase tracking-wider text-gold-dark/70 font-bold mb-2">Tier {tier}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.spells!.filter((s) => s.tier === tier).map((spell) => (
                      <span
                        key={spell.name}
                        className="text-xs px-2.5 py-1 rounded-sm border border-border-subtle bg-bg-primary/30 text-text-secondary"
                      >
                        {spell.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Songs */}
        {data?.songs && data.songs.length > 0 && (
          <Section title="Songs" delay={0.2}>
            <div className="space-y-4">
              {tiersBySong.map((tier) => (
                <div key={tier}>
                  <p className="text-[10px] uppercase tracking-wider text-gold-dark/70 font-bold mb-2">Tier {tier}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.songs!.filter((s) => s.tier === tier).map((song) => (
                      <span
                        key={song.name}
                        className="text-xs px-2.5 py-1 rounded-sm border border-border-subtle bg-bg-primary/30 text-text-secondary"
                      >
                        {song.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Shapeshift forms */}
        {data?.shapeshiftForms && data.shapeshiftForms.length > 0 && (
          <Section title="Shapeshift Forms" delay={0.25}>
            <div className="flex flex-wrap gap-1.5">
              {data.shapeshiftForms.map((form) => (
                <span
                  key={form}
                  className="text-xs px-2.5 py-1 rounded-sm border border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald"
                >
                  {form}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Class nav */}
      <div className="mt-12 pt-6 border-t border-border-subtle">
        <p className="text-[10px] uppercase tracking-wider text-text-secondary/40 mb-3">Other Classes</p>
        <div className="flex flex-wrap gap-2">
          {CLASSES.filter((c) => c !== className).map((c) => (
            <Link
              key={c}
              href={`/classes/${c}`}
              className="text-xs px-2.5 py-1 rounded-sm border border-border-subtle text-text-secondary hover:text-gold-primary hover:border-gold-primary/30 transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h2 className="font-cinzel font-bold text-sm text-gold-primary uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </motion.div>
  );
}
