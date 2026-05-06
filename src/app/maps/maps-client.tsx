"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  Zap,
  Heart,
  Shield,
  Swords,
  Wind,
  Plus,
  Skull,
  Gem,
  Flame,
  Clock,
  X,
  Target,
  Layers,
} from "lucide-react";
import {
  MAPS,
  FEATURE_META,
  type DungeonMap,
  type FeatureType,
} from "@/lib/map-data";
import {
  MONSTERS,
  MONSTER_SPAWNS,
  findMonsterByName,
  getDropsForMonster,
} from "@/lib/monster-data";
import ShimmerText from "@/components/ui/ShimmerText";

// ─── Feature icons (used as list bullets, not positional markers) ────────────

const FEATURE_ICONS: Record<FeatureType, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  extract:           DoorOpen,
  portal_red:        Zap,
  shrine_health:     Heart,
  shrine_protection: Shield,
  shrine_power:      Swords,
  fountain_speed:    Wind,
  altar:             Plus,
  boss:              Skull,
  campfire:          Flame, // unused — campfires are player-placed
  treasure:          Gem,
  monster_spawn:     Target,
};

const FEATURE_DISPLAY_ORDER: FeatureType[] = [
  "extract",
  "portal_red",
  "shrine_health",
  "shrine_protection",
  "shrine_power",
  "fountain_speed",
  "altar",
];

// ─── Data helpers ────────────────────────────────────────────────────────────

function uniqueBosses(map: DungeonMap) {
  const main: Array<{ label: string; description?: string }> = [];
  const sub: Array<{ label: string; description?: string }> = [];
  const seen = new Set<string>();
  for (const f of map.features) {
    if (f.type !== "boss" || seen.has(f.label)) continue;
    seen.add(f.label);
    const isMainBoss = f.description?.toLowerCase().startsWith("boss:") ?? false;
    (isMainBoss ? main : sub).push({ label: f.label, description: f.description });
  }
  return { main, sub };
}

function featureCounts(map: DungeonMap): Partial<Record<FeatureType, number>> {
  const counts: Partial<Record<FeatureType, number>> = {};
  for (const f of map.features) {
    if (f.type === "boss" || f.type === "treasure") continue;
    counts[f.type] = (counts[f.type] ?? 0) + 1;
  }
  return counts;
}

function notableModules(map: DungeonMap) {
  return map.features.filter((f) => f.type === "treasure" && f.description);
}

function mobsForMap(mapId: string) {
  const ids = Array.from(
    new Set(MONSTER_SPAWNS.filter((s) => s.mapId === mapId).map((s) => s.monsterId)),
  );
  return ids
    .map((id) => MONSTERS.find((m) => m.id === id))
    .filter((m): m is (typeof MONSTERS)[number] => Boolean(m));
}

function dungeonsForMonster(monsterId: string) {
  return Array.from(
    new Set(MONSTER_SPAWNS.filter((s) => s.monsterId === monsterId).map((s) => s.mapId)),
  );
}

// ─── Coming soon view ────────────────────────────────────────────────────────

function ComingSoonView({ map }: { map: DungeonMap }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-6 select-none"
      style={{ background: `radial-gradient(ellipse at center, ${map.bgColor} 0%, #060508 100%)` }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${map.accentColor}33`, boxShadow: `0 0 32px ${map.accentColor}22` }}
        />
        <div className="absolute inset-3 rounded-full" style={{ border: `1px solid ${map.accentColor}55` }} />
        <Clock style={{ width: 36, height: 36, color: map.accentColor, opacity: 0.85 }} />
      </div>

      <div className="text-center space-y-2 max-w-xs px-4">
        <p className="font-cinzel font-bold text-xl tracking-wide" style={{ color: map.accentColor }}>
          {map.name}
        </p>
        <p className="text-xs text-text-secondary/60 uppercase tracking-widest">{map.subtitle}</p>
        <div
          className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-widest"
          style={{
            color: map.accentColor,
            borderColor: `${map.accentColor}55`,
            backgroundColor: `${map.accentColor}0f`,
          }}
        >
          <Clock className="w-3 h-3" />
          Coming Soon
        </div>
        <p className="text-[11px] text-text-secondary/50 leading-relaxed pt-2">{map.description}</p>
      </div>
    </div>
  );
}

// ─── Dungeon reference view ──────────────────────────────────────────────────

interface ReferenceViewProps {
  map: DungeonMap;
  highlightedMonsterId: string | null;
  onSelectMap: (id: string) => void;
  onClearHighlight: () => void;
}

function DungeonReferenceView({
  map,
  highlightedMonsterId,
  onSelectMap,
  onClearHighlight,
}: ReferenceViewProps) {
  const { main: mainBosses, sub: subBosses } = useMemo(() => uniqueBosses(map), [map]);
  const counts = useMemo(() => featureCounts(map), [map]);
  const modules = useMemo(() => notableModules(map), [map]);
  const mobs = useMemo(() => mobsForMap(map.id), [map.id]);

  const highlightedMonster = highlightedMonsterId
    ? MONSTERS.find((m) => m.id === highlightedMonsterId) ?? null
    : null;
  const highlightDungeons = highlightedMonsterId
    ? dungeonsForMonster(highlightedMonsterId)
    : [];

  return (
    <div className="flex-1 overflow-y-auto">
      <motion.div
        key={map.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="max-w-4xl mx-auto px-5 sm:px-8 py-8 space-y-8"
      >
        {/* Header */}
        <header className="space-y-2">
          <p
            className="text-[11px] uppercase tracking-[0.25em] font-bold"
            style={{ color: map.accentColor, opacity: 0.85 }}
          >
            {map.subtitle}
          </p>
          <ShimmerText as="h2" className="text-3xl sm:text-4xl">
            {map.name}
          </ShimmerText>
          <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
            {map.description}
          </p>
        </header>

        {/* Highlighted monster banner */}
        {highlightedMonster && (
          <div
            className="rounded-sm border px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{
              backgroundColor: FEATURE_META.monster_spawn.bgColor,
              borderColor: FEATURE_META.monster_spawn.borderColor,
            }}
          >
            <Target className="w-4 h-4 shrink-0" style={{ color: FEATURE_META.monster_spawn.color }} />
            <span className="text-xs font-cinzel font-bold uppercase tracking-widest" style={{ color: FEATURE_META.monster_spawn.color }}>
              Tracking
            </span>
            <span className="text-sm font-medium text-text-primary">{highlightedMonster.name}</span>
            {highlightDungeons.length > 0 && (
              <>
                <span className="text-[11px] text-text-secondary">·</span>
                <span className="text-[11px] text-text-secondary mr-1">Spawns in:</span>
                <div className="flex flex-wrap gap-1">
                  {highlightDungeons.map((id) => {
                    const dungeon = MAPS.find((m) => m.id === id);
                    if (!dungeon) return null;
                    const isCurrent = id === map.id;
                    return (
                      <button
                        key={id}
                        onClick={() => onSelectMap(id)}
                        disabled={isCurrent}
                        className={`text-[11px] px-2 py-0.5 rounded-sm border transition-colors ${
                          isCurrent
                            ? "border-gold-primary/50 bg-gold-primary/10 text-gold-primary cursor-default"
                            : "border-border-subtle text-text-secondary hover:text-gold-primary hover:border-gold-primary/40"
                        }`}
                      >
                        {dungeon.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <button
              onClick={onClearHighlight}
              className="ml-auto text-[11px] text-text-secondary hover:text-gold-primary flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        )}

        {/* Bosses */}
        {(mainBosses.length > 0 || subBosses.length > 0) && (
          <Section title="Bosses" icon={Skull} accentColor={FEATURE_META.boss.color}>
            {mainBosses.length > 0 && (
              <ul className="space-y-1.5 mb-3">
                {mainBosses.map((b) => {
                  const monster = findMonsterByName(b.label);
                  const drops = monster ? getDropsForMonster(monster.id) : [];
                  return (
                    <li key={b.label} className="flex items-start gap-2 text-sm">
                      <Skull className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: FEATURE_META.boss.color }} />
                      <div>
                        <span className="font-cinzel font-bold text-text-primary">{b.label}</span>
                        {b.description && (
                          <span className="text-text-secondary text-[12px] block leading-snug">
                            {b.description.replace(/^Boss:\s*/i, "")}
                          </span>
                        )}
                        {drops.length > 0 && (
                          <span className="text-[11px] block leading-snug mt-0.5">
                            <span className="text-gold-dark">Drops:</span>{" "}
                            <span className="text-text-secondary">{drops.join(", ")}</span>
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {subBosses.length > 0 && (
              <div className="text-[12px] text-text-secondary">
                <span className="text-gold-dark font-cinzel font-bold uppercase tracking-widest text-[10px] mr-2">
                  Subbosses
                </span>
                {subBosses.map((b, i) => (
                  <span key={b.label}>
                    <span className="text-text-primary">{b.label}</span>
                    {i < subBosses.length - 1 && <span className="text-text-secondary/50">, </span>}
                  </span>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* Mob pool */}
        {mobs.length > 0 && (
          <Section title="Mob Pool" icon={Target} accentColor={FEATURE_META.monster_spawn.color}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {mobs.map((m) => {
                const isHighlighted = m.id === highlightedMonsterId;
                const drops = getDropsForMonster(m.id);
                return (
                  <li
                    key={m.id}
                    className={`px-2.5 py-1.5 rounded-sm border text-sm ${
                      isHighlighted
                        ? "border-pink-400/60 bg-pink-500/10"
                        : "border-border-subtle bg-bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Target
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: isHighlighted ? FEATURE_META.monster_spawn.color : "#8a8693" }}
                      />
                      <span className={isHighlighted ? "text-text-primary font-medium" : "text-text-secondary"}>
                        {m.name}
                      </span>
                      {m.aliases && m.aliases.length > 0 && (
                        <span className="text-[10px] text-text-secondary/50">
                          ({m.aliases.join(", ")})
                        </span>
                      )}
                    </div>
                    {drops.length > 0 && (
                      <p className="mt-1 pl-5 text-[11px] text-text-secondary/70 leading-snug">
                        <span className="text-gold-dark">Drops:</span>{" "}
                        <span className="text-text-secondary">{drops.join(", ")}</span>
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="text-[10px] text-text-secondary/50 mt-2 italic">
              Documented spawns — list may be incomplete.
            </p>
          </Section>
        )}

        {/* Features */}
        <Section title="Features" icon={Layers} accentColor="#a89060">
          <p className="text-[11px] text-text-secondary/60 mb-3 italic">
            Spawn locations are randomized per run — counts below are documented candidate positions
            from common module layouts, not guaranteed spawns.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {FEATURE_DISPLAY_ORDER.map((type) => {
              const count = counts[type];
              if (!count) return null;
              const meta = FEATURE_META[type];
              const Icon = FEATURE_ICONS[type];
              return (
                <li
                  key={type}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm border border-border-subtle bg-bg-secondary/40 text-sm"
                >
                  <div
                    className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                    style={{ backgroundColor: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: meta.color }} />
                  </div>
                  <span className="text-text-secondary flex-1">{meta.label}</span>
                  <span className="text-[11px] text-text-secondary/50 font-mono">×{count}</span>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Notable modules */}
        {modules.length > 0 && (
          <Section title="Notable Modules" icon={Gem} accentColor={FEATURE_META.treasure.color}>
            <ul className="space-y-2">
              {modules.map((m) => (
                <li key={m.id} className="text-sm">
                  <span className="font-cinzel font-bold text-text-primary">{m.label}</span>
                  {m.description && (
                    <span className="text-text-secondary text-[12px] block leading-snug">
                      {m.description}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </motion.div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  title,
  icon: Icon,
  accentColor,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-border-subtle bg-bg-secondary/30 p-4 sm:p-5">
      <h3 className="flex items-center gap-2 mb-3 font-cinzel font-bold text-sm uppercase tracking-widest">
        <Icon className="w-4 h-4" style={{ color: accentColor }} />
        <span style={{ color: accentColor }}>{title}</span>
      </h3>
      {children}
    </section>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

function MapsClientInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // URL is the source of truth for which dungeon and which monster highlight.
  const urlMapId = searchParams.get("map");
  const highlightedMonsterId = searchParams.get("highlight");

  const selectedMap = useMemo<DungeonMap>(() => {
    if (urlMapId) {
      const found = MAPS.find((m) => m.id === urlMapId);
      if (found) return found;
    }
    if (highlightedMonsterId) {
      const dungeons = dungeonsForMonster(highlightedMonsterId);
      const found = dungeons.length > 0 ? MAPS.find((m) => m.id === dungeons[0]) : undefined;
      if (found) return found;
    }
    return MAPS[0];
  }, [urlMapId, highlightedMonsterId]);

  const buildHref = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname, searchParams],
  );

  const selectMapById = useCallback(
    (id: string) => {
      router.replace(
        buildHref((p) => p.set("map", id)),
        { scroll: false },
      );
    },
    [router, buildHref],
  );

  const clearHighlight = useCallback(() => {
    router.replace(
      buildHref((p) => p.delete("highlight")),
      { scroll: false },
    );
  }, [router, buildHref]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* Page header */}
      <div className="shrink-0 px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-4 border-b border-border-subtle">
        <div>
          <ShimmerText as="h1" className="text-2xl sm:text-3xl leading-tight">
            Dungeon Reference
          </ShimmerText>
          <p className="text-xs text-text-secondary mt-0.5">
            Bosses, mob pools, and feature counts per dungeon — DaD layouts are procedurally generated, so positions are not fixed.
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary border border-border-subtle rounded-sm hover:text-gold-primary hover:border-gold-primary/30 transition-all shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{sidebarOpen ? "Hide Panel" : "Show Panel"}</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar — dungeon picker */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="shrink-0 overflow-hidden border-r border-border-subtle bg-bg-primary flex flex-col"
              style={{ minWidth: 0 }}
            >
              <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1" style={{ width: 220 }}>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark mb-1 px-1">
                  Dungeons
                </p>
                <div className="space-y-1">
                  {MAPS.map((m) => {
                    const active = m.id === selectedMap.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => selectMapById(m.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-sm border transition-all ${
                          active
                            ? "border-gold-primary/40 bg-gold-primary/10"
                            : "border-border-subtle hover:border-gold-primary/25 hover:bg-bg-secondary"
                        }`}
                      >
                        <span
                          className={`text-xs font-cinzel font-bold block ${
                            active ? "text-gold-primary" : "text-text-primary"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span className="text-[10px] text-text-secondary/60">
                          {m.comingSoon ? (
                            <span style={{ color: m.accentColor, opacity: 0.75 }}>Coming soon</span>
                          ) : (
                            m.subtitle
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 min-w-0 relative bg-bg-primary flex flex-col">
          {selectedMap.comingSoon ? (
            <ComingSoonView map={selectedMap} />
          ) : (
            <DungeonReferenceView
              map={selectedMap}
              highlightedMonsterId={highlightedMonsterId}
              onSelectMap={selectMapById}
              onClearHighlight={clearHighlight}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function MapsClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full text-text-secondary/60 text-sm">
          Loading reference…
        </div>
      }
    >
      <MapsClientInner />
    </Suspense>
  );
}
