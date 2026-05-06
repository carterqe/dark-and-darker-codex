"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  Package,
  Sword,
  Skull,
  Footprints,
  ShieldAlert,
  X,
  MapPin,
  Hand,
  Hammer,
  Zap,
  CheckSquare,
  Square,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TRADERS, getQuestItems, type Trader, type Quest, type QuestRequirement } from "@/lib/quest-data";
import { getRarityStyle } from "@/lib/darkerdb";
import { getDropsFor } from "@/lib/monster-data";
import ShimmerText from "@/components/ui/ShimmerText";
import QuestTipsPanel from "@/components/quests/QuestTipsPanel";

// ─── helpers ────────────────────────────────────────────────────────────────

function reqIcon(type: QuestRequirement["type"]) {
  switch (type) {
    case "item":     return <Package className="w-3.5 h-3.5 shrink-0" />;
    case "kill":     return <Skull className="w-3.5 h-3.5 shrink-0" />;
    case "extract":  return <Footprints className="w-3.5 h-3.5 shrink-0" />;
    case "survive":  return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
    case "explore":  return <MapPin className="w-3.5 h-3.5 shrink-0" />;
    case "interact": return <Hand className="w-3.5 h-3.5 shrink-0" />;
    case "destroy":  return <Hammer className="w-3.5 h-3.5 shrink-0" />;
    case "use":      return <Zap className="w-3.5 h-3.5 shrink-0" />;
  }
}

function reqColor(type: QuestRequirement["type"]) {
  switch (type) {
    case "item":     return "text-gold-dark";
    case "kill":     return "text-accent-red";
    case "extract":  return "text-accent-emerald";
    case "survive":  return "text-blue-400";
    case "explore":  return "text-cyan-400";
    case "interact": return "text-violet-400";
    case "destroy":  return "text-orange-400";
    case "use":      return "text-teal-400";
  }
}

const REQ_TYPE_LABELS: Record<QuestRequirement["type"], string> = {
  item: "Item",
  kill: "Kill",
  extract: "Extract",
  survive: "Survive",
  explore: "Explore",
  interact: "Interact",
  destroy: "Destroy",
  use: "Use",
};

// ─── QuestDetail ────────────────────────────────────────────────────────────

function QuestDetail({
  quest,
  trader,
  onBack,
  completedIds,
  onToggleComplete,
}: {
  quest: Quest;
  trader: Trader;
  onBack: () => void;
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
}) {
  const isComplete = completedIds.has(quest.id);

  return (
    <motion.div
      key={quest.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col gap-4"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors lg:hidden"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Quests
      </button>

      <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-5">
        {/* Quest header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: trader.accentColor }}>
              {trader.name}
            </p>
            <h2 className="font-cinzel font-bold text-xl text-text-primary leading-tight">{quest.name}</h2>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">{quest.description}</p>
          </div>
          {/* Completion toggle */}
          <button
            onClick={() => onToggleComplete(quest.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-cinzel font-bold transition-all shrink-0 ${
              isComplete
                ? "border-accent-emerald/50 bg-accent-emerald/10 text-accent-emerald"
                : "border-border-subtle text-text-secondary/60 hover:border-gold-primary/30 hover:text-gold-primary"
            }`}
          >
            {isComplete ? (
              <CheckSquare className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            {isComplete ? "Completed" : "Mark Complete"}
          </button>
        </div>

        <div className="border-t border-border-subtle" />

        {/* Requirements */}
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-gold-dark mb-3">
            Requirements
          </h3>
          <ul className="space-y-2">
            {quest.requirements.map((req, i) => (
              <li key={i} className={`flex items-start gap-2.5 text-sm ${reqColor(req.type)}`}>
                {reqIcon(req.type)}
                <span className="text-text-primary">
                  {req.description}
                  {req.type === "item" && req.rarity && (
                    <span className={`ml-1.5 text-[11px] font-medium ${getRarityStyle(req.rarity).text}`}>
                      ({req.rarity})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border-subtle" />

        {/* Reward */}
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-gold-dark mb-3">
            Reward
          </h3>
          <span className="text-sm font-medium text-gold-primary">{quest.reward.description}</span>
        </div>
      </div>

      {/* Community tips */}
      <QuestTipsPanel questId={quest.id} />
    </motion.div>
  );
}

// ─── QuestList ────────────────────────────────────────────────────────────────

function QuestList({
  trader,
  selectedQuest,
  onSelectQuest,
  onBack,
  completedIds,
  searchQuery,
  reqTypeFilter,
}: {
  trader: Trader;
  selectedQuest: Quest | null;
  onSelectQuest: (q: Quest) => void;
  onBack: () => void;
  completedIds: Set<string>;
  searchQuery: string;
  reqTypeFilter: QuestRequirement["type"] | "";
}) {
  const filtered = useMemo(() => {
    let quests = trader.quests;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      quests = quests.filter(
        (quest) =>
          quest.name.toLowerCase().includes(q) ||
          quest.description.toLowerCase().includes(q) ||
          quest.requirements.some((r) => r.description.toLowerCase().includes(q)),
      );
    }
    if (reqTypeFilter) {
      quests = quests.filter((quest) =>
        quest.requirements.some((r) => r.type === reqTypeFilter),
      );
    }
    return quests;
  }, [trader.quests, searchQuery, reqTypeFilter]);

  const completedCount = trader.quests.filter((q) => completedIds.has(q.id)).length;

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors mb-4 lg:hidden"
      >
        <ArrowLeft className="w-3 h-3" /> All Traders
      </button>

      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-cinzel font-bold text-lg" style={{ color: trader.accentColor }}>
            {trader.name}
          </h2>
          {completedCount > 0 && (
            <span className={`text-[11px] font-cinzel font-bold px-2 py-0.5 rounded-sm border ${
              completedCount === trader.quests.length
                ? "border-accent-emerald/50 bg-accent-emerald/10 text-accent-emerald"
                : "border-gold-primary/30 bg-gold-primary/5 text-gold-dark"
            }`}>
              {completedCount}/{trader.quests.length}
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-0.5">{trader.title}</p>
        <p className="text-xs text-text-secondary/70 mt-2 leading-relaxed">{trader.description}</p>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-text-secondary/50 text-center py-8">No quests match your filters.</p>
        ) : (
          filtered.map((quest) => {
            const isActive = selectedQuest?.id === quest.id;
            const isDone = completedIds.has(quest.id);
            return (
              <button
                key={quest.id}
                onClick={() => onSelectQuest(quest)}
                className={`w-full text-left px-3 py-3 rounded-sm border transition-all ${
                  isActive
                    ? "border-gold-primary/40 bg-gold-primary/10"
                    : isDone
                    ? "border-accent-emerald/20 bg-accent-emerald/5 hover:border-accent-emerald/30"
                    : "border-border-subtle hover:border-gold-primary/25 hover:bg-bg-tertiary"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {isDone ? (
                      <CheckSquare className="w-3 h-3 text-accent-emerald shrink-0" />
                    ) : (
                      <Square className="w-3 h-3 text-text-secondary/30 shrink-0" />
                    )}
                    <span className={`text-sm font-medium truncate ${isActive ? "text-gold-primary" : isDone ? "text-text-secondary line-through decoration-accent-emerald/40" : "text-text-primary"}`}>
                      {quest.name}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? "text-gold-primary" : "text-text-secondary/40"}`} />
                </div>
                <div className="mt-1 flex flex-wrap gap-1 ml-5">
                  {quest.requirements.map((req, i) => (
                    <span key={i} className={`text-[10px] flex items-center gap-1 ${reqColor(req.type)}`}>
                      {reqIcon(req.type)}
                      {req.type === "item" && req.item ? (
                        <>
                          {req.quantity != null ? `${req.quantity}×` : ""} {req.item}{" "}
                          {req.rarity && (
                            <span className={getRarityStyle(req.rarity).text}>({req.rarity})</span>
                          )}
                        </>
                      ) : req.description}
                    </span>
                  ))}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── QuestItemsTab ────────────────────────────────────────────────────────────

function QuestItemsTab({ onJumpToQuest }: { onJumpToQuest: (traderId: string, questId: string) => void }) {
  const [search, setSearch] = useState("");
  const allItems = useMemo(() => getQuestItems(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((entry) => entry.item.toLowerCase().includes(q));
  }, [allItems, search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quest items…"
          className="w-full pl-10 pr-10 py-2.5 bg-bg-secondary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <p className="text-xs text-text-secondary">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} required across all quests
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((entry) => {
          const drops = getDropsFor(entry.item);
          return (
            <motion.div
              key={entry.item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-bg-secondary border border-border-subtle rounded-sm p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="w-4 h-4 text-gold-dark shrink-0" />
                  <span className="text-sm font-medium text-text-primary truncate">{entry.item}</span>
                  <span className={`text-[10px] font-medium shrink-0 ${getRarityStyle(entry.rarity).text}`}>
                    ({entry.rarity})
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-gold-primary/10 border border-gold-primary/20 rounded-sm text-gold-dark font-medium shrink-0">
                  ×{entry.totalQuantity} total
                </span>
              </div>
              <div className="space-y-0.5">
                {entry.appearances.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => onJumpToQuest(a.traderId, a.questId)}
                    className="w-full flex items-center justify-between text-[11px] text-left -mx-1.5 px-1.5 py-1 rounded-sm hover:bg-gold-primary/10 hover:text-gold-primary transition-colors group"
                  >
                    <span className="text-text-secondary truncate group-hover:text-gold-primary">
                      <span className="text-gold-dark group-hover:text-gold-primary">{a.traderName}</span>
                      {" — "}
                      <span className="group-hover:underline">{a.questName}</span>
                    </span>
                    <span className="text-text-secondary/60 shrink-0 ml-2 group-hover:text-gold-primary">×{a.quantity}</span>
                  </button>
                ))}
              </div>
              {drops.length > 0 && (
                <div className="mt-3 pt-2 border-t border-border-subtle space-y-1">
                  {drops.map(({ monster, spawns }) => {
                    const mapIds = Array.from(new Set(spawns.map((s) => s.mapId)));
                    const firstMapId = mapIds[0];
                    const locationLabel = mapIds.length === 0
                      ? "Any map"
                      : mapIds.length === 1
                        ? firstMapId.replace(/_/g, " ")
                        : `${mapIds.length} maps`;
                    return (
                      <div key={monster.id} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-text-secondary truncate">
                          <Skull className="inline w-3 h-3 mr-1 text-accent-red" />
                          Dropped by: <span className="text-text-primary">{monster.name}</span>
                          <span className="text-text-secondary/60"> ({locationLabel})</span>
                        </span>
                        {firstMapId && (
                          <Link
                            href={`/maps?highlight=${monster.id}&map=${firstMapId}`}
                            className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-sm border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 transition-colors"
                          >
                            Show on map
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-secondary/40">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No items match your search.</p>
        </div>
      )}
    </div>
  );
}

// ─── ProgressTab ──────────────────────────────────────────────────────────────

function ProgressTab({
  completedIds,
  onToggleComplete,
  user,
  onSignIn,
}: {
  completedIds: Set<string>;
  onToggleComplete: (id: string) => void;
  user: unknown;
  onSignIn: () => void;
}) {
  const totalQuests = TRADERS.reduce((sum, t) => sum + t.quests.length, 0);
  const totalCompleted = completedIds.size;

  if (!user) {
    return (
      <div className="text-center py-24">
        <ListChecks className="w-12 h-12 text-gold-dark mx-auto mb-4" />
        <h2 className="font-cinzel font-bold text-xl text-text-secondary mb-2">Track Your Progress</h2>
        <p className="text-sm text-text-secondary/60 mb-6">Sign in to track which quests you&apos;ve completed.</p>
        <button
          onClick={onSignIn}
          className="px-6 py-2.5 bg-gold-primary text-bg-primary font-cinzel font-bold text-sm rounded-sm hover:bg-gold-light transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const pct = totalQuests > 0 ? Math.round((totalCompleted / totalQuests) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-bg-secondary border border-border-subtle rounded-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-cinzel font-bold text-sm text-gold-primary">Overall Progress</h2>
          <span className="text-sm font-cinzel font-bold text-gold-dark">
            {totalCompleted} / {totalQuests} ({pct}%)
          </span>
        </div>
        <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Per-trader checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {TRADERS.map((trader) => {
          const done = trader.quests.filter((q) => completedIds.has(q.id)).length;
          const allDone = trader.quests.length > 0 && done === trader.quests.length;
          return (
            <div
              key={trader.id}
              className={`bg-bg-secondary border rounded-sm p-4 ${allDone ? "border-accent-emerald/30" : "border-border-subtle"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-cinzel font-bold text-sm" style={{ color: trader.accentColor }}>
                  {trader.name}
                </h3>
                <span className={`text-[11px] font-cinzel font-bold ${allDone ? "text-accent-emerald" : "text-text-secondary/60"}`}>
                  {done}/{trader.quests.length}
                </span>
              </div>
              <div className="space-y-1">
                {trader.quests.map((quest) => {
                  const isDone = completedIds.has(quest.id);
                  return (
                    <button
                      key={quest.id}
                      onClick={() => onToggleComplete(quest.id)}
                      className="w-full flex items-center gap-2 text-left py-1 px-1 rounded-sm hover:bg-gold-primary/5 transition-colors group"
                    >
                      {isDone ? (
                        <CheckSquare className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-text-secondary/30 shrink-0 group-hover:text-text-secondary/60" />
                      )}
                      <span className={`text-[11px] ${isDone ? "text-text-secondary line-through decoration-accent-emerald/40" : "text-text-primary/80"}`}>
                        {quest.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

type Tab = "traders" | "items" | "progress";
type MobileStep = "traders" | "quests" | "detail";

export default function QuestsClient() {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("traders");
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [mobileStep, setMobileStep] = useState<MobileStep>("traders");
  const [completedQuestIds, setCompletedQuestIds] = useState<Set<string>>(new Set());
  const [questSearch, setQuestSearch] = useState("");
  const [reqTypeFilter, setReqTypeFilter] = useState<QuestRequirement["type"] | "">("");

  // Bulk-fetch all completions on mount (once user is known)
  useEffect(() => {
    if (!user) return;
    fetch("/api/quest-completions")
      .then((r) => r.json())
      .then((d) => setCompletedQuestIds(new Set(d.completed ?? [])))
      .catch(() => {});
  }, [user]);

  const toggleComplete = async (questId: string) => {
    if (!user) { openAuthModal("login"); return; }
    const isCompleted = completedQuestIds.has(questId);
    // Optimistic update
    setCompletedQuestIds((prev) => {
      const next = new Set(prev);
      isCompleted ? next.delete(questId) : next.add(questId);
      return next;
    });
    await fetch("/api/quest-completions", {
      method: isCompleted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: questId }),
    });
  };

  const handleSelectTrader = (trader: Trader) => {
    setSelectedTrader(trader);
    setSelectedQuest(null);
    setMobileStep("quests");
  };

  const handleSelectQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setMobileStep("detail");
  };

  const handleBackToTraders = () => {
    setSelectedTrader(null);
    setSelectedQuest(null);
    setMobileStep("traders");
  };

  const handleBackToQuests = () => {
    setSelectedQuest(null);
    setMobileStep("quests");
  };

  const handleJumpToQuest = (traderId: string, questId: string) => {
    const trader = TRADERS.find((t) => t.id === traderId);
    if (!trader) return;
    const quest = trader.quests.find((q) => q.id === questId);
    if (!quest) return;
    setSelectedTrader(trader);
    setSelectedQuest(quest);
    setActiveTab("traders");
    setMobileStep("detail");
  };

  const REQ_TYPES = Object.keys(REQ_TYPE_LABELS) as QuestRequirement["type"][];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Quest Guide
        </ShimmerText>
        <p className="text-text-secondary">
          Browse trader quests, track your progress, and share tips with the community.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-secondary border border-border-subtle rounded-sm p-1 w-fit">
        {(["traders", "items", "progress"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-cinzel font-bold rounded-sm transition-all ${
              activeTab === tab
                ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "traders" && <span className="flex items-center gap-1.5"><Sword className="w-3 h-3" />Traders</span>}
            {tab === "items" && <span className="flex items-center gap-1.5"><Package className="w-3 h-3" />Quest Items</span>}
            {tab === "progress" && (
              <span className="flex items-center gap-1.5">
                <ListChecks className="w-3 h-3" />
                Progress
                {completedQuestIds.size > 0 && (
                  <span className="text-[9px] px-1 py-0.5 bg-accent-emerald/20 text-accent-emerald rounded-sm">
                    {completedQuestIds.size}
                  </span>
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Traders tab ── */}
      {activeTab === "traders" && (
        <>
          {/* Search + filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary/60 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, monster, item…"
                value={questSearch}
                onChange={(e) => setQuestSearch(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-bg-secondary border border-border-subtle rounded-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/40"
              />
              {questSearch && (
                <button
                  onClick={() => setQuestSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary/60 hover:text-text-primary"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setReqTypeFilter("")}
                className={`px-2.5 py-1 text-[10px] font-medium rounded-sm border transition-all ${
                  reqTypeFilter === ""
                    ? "bg-gold-primary/15 border-gold-primary/30 text-gold-primary"
                    : "border-border-subtle text-text-secondary/60 hover:text-text-secondary"
                }`}
              >
                All
              </button>
              {REQ_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setReqTypeFilter(reqTypeFilter === type ? "" : type)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-sm border transition-all ${
                    reqTypeFilter === type
                      ? `bg-gold-primary/15 border-gold-primary/30 ${reqColor(type)}`
                      : "border-border-subtle text-text-secondary/60 hover:text-text-secondary"
                  }`}
                >
                  {reqIcon(type)}
                  {REQ_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 min-h-[600px]">
            {/* Trader sidebar */}
            <div className={`shrink-0 w-48 xl:w-56 ${mobileStep !== "traders" ? "hidden lg:block" : "block"}`}>
              <div className="space-y-1.5 sticky top-6">
                {TRADERS.map((trader) => {
                  const isActive = selectedTrader?.id === trader.id;
                  const done = trader.quests.filter((q) => completedQuestIds.has(q.id)).length;
                  const allDone = done === trader.quests.length;
                  return (
                    <button
                      key={trader.id}
                      onClick={() => handleSelectTrader(trader)}
                      className={`w-full text-left px-3 py-2.5 rounded-sm border transition-all ${
                        isActive
                          ? "border-gold-primary/40 bg-gold-primary/10"
                          : "border-border-subtle hover:border-gold-primary/25 hover:bg-bg-tertiary"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-cinzel font-bold block transition-colors ${isActive ? "text-gold-primary" : "text-text-primary"}`}>
                          {trader.name}
                        </span>
                        {done > 0 && (
                          <span className={`text-[9px] font-cinzel font-bold shrink-0 ${allDone ? "text-accent-emerald" : "text-text-secondary/50"}`}>
                            {done}/{trader.quests.length}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary/60">{trader.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quest list pane */}
            <div className={`flex-1 min-w-0 ${mobileStep === "quests" ? "block" : mobileStep === "detail" ? "hidden lg:block" : "hidden lg:block"}`}>
              {selectedTrader ? (
                <QuestList
                  trader={selectedTrader}
                  selectedQuest={selectedQuest}
                  onSelectQuest={handleSelectQuest}
                  onBack={handleBackToTraders}
                  completedIds={completedQuestIds}
                  searchQuery={questSearch}
                  reqTypeFilter={reqTypeFilter}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 text-text-secondary/40">
                  <Sword className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a trader to view their quests.</p>
                </div>
              )}
            </div>

            {/* Quest detail pane */}
            <div className={`flex-1 min-w-0 ${mobileStep === "detail" ? "block" : "hidden lg:block"}`}>
              {selectedQuest && selectedTrader ? (
                <QuestDetail
                  quest={selectedQuest}
                  trader={selectedTrader}
                  onBack={handleBackToQuests}
                  completedIds={completedQuestIds}
                  onToggleComplete={toggleComplete}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-24 text-text-secondary/40">
                  <ChevronRight className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a quest to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Quest Items tab ── */}
      {activeTab === "items" && <QuestItemsTab onJumpToQuest={handleJumpToQuest} />}

      {/* ── Progress tab ── */}
      {activeTab === "progress" && (
        <ProgressTab
          completedIds={completedQuestIds}
          onToggleComplete={toggleComplete}
          user={user}
          onSignIn={() => openAuthModal("login")}
        />
      )}
    </div>
  );
}
