"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import { TRADERS, getQuestItems, type Trader, type Quest, type QuestRequirement } from "@/lib/quest-data";
import { getRarityStyle } from "@/lib/darkerdb";
import { getDropsFor } from "@/lib/monster-data";
import ShimmerText from "@/components/ui/ShimmerText";

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

// ─── sub-components ─────────────────────────────────────────────────────────

function QuestDetail({ quest, trader, onBack }: { quest: Quest; trader: Trader; onBack: () => void }) {
  return (
    <motion.div
      key={quest.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors mb-4 lg:hidden"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Quests
      </button>

      <div className="bg-bg-secondary border border-border-subtle rounded-sm p-6 flex-1 space-y-5">
        {/* Quest header */}
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: trader.accentColor }}>
            {trader.name}
          </p>
          <h2 className="font-cinzel font-bold text-xl text-text-primary leading-tight">{quest.name}</h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">{quest.description}</p>
        </div>

        {/* Divider */}
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

        {/* Divider */}
        <div className="border-t border-border-subtle" />

        {/* Reward */}
        <div>
          <h3 className="text-[10px] uppercase tracking-wider font-bold text-gold-dark mb-3">
            Reward
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gold-primary">{quest.reward.description}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuestList({
  trader,
  selectedQuest,
  onSelectQuest,
  onBack,
}: {
  trader: Trader;
  selectedQuest: Quest | null;
  onSelectQuest: (q: Quest) => void;
  onBack: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors mb-4 lg:hidden"
      >
        <ArrowLeft className="w-3 h-3" /> All Traders
      </button>

      {/* Trader header */}
      <div className="mb-4">
        <h2
          className="font-cinzel font-bold text-lg"
          style={{ color: trader.accentColor }}
        >
          {trader.name}
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">{trader.title}</p>
        <p className="text-xs text-text-secondary/70 mt-2 leading-relaxed">{trader.description}</p>
      </div>

      {/* Quest list */}
      <div className="space-y-1.5 overflow-y-auto flex-1">
        {trader.quests.map((quest) => {
          const isActive = selectedQuest?.id === quest.id;
          return (
            <button
              key={quest.id}
              onClick={() => onSelectQuest(quest)}
              className={`w-full text-left px-3 py-3 rounded-sm border transition-all ${
                isActive
                  ? "border-gold-primary/40 bg-gold-primary/10"
                  : "border-border-subtle hover:border-gold-primary/25 hover:bg-bg-tertiary"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-medium ${isActive ? "text-gold-primary" : "text-text-primary"}`}>
                  {quest.name}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${isActive ? "text-gold-primary" : "text-text-secondary/40"}`} />
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {quest.requirements.map((req, i) => (
                  <span
                    key={i}
                    className={`text-[10px] flex items-center gap-1 ${reqColor(req.type)}`}
                  >
                    {reqIcon(req.type)}
                    {req.type === "item" && req.item ? (
                      <>
                        {req.quantity}× {req.item}{" "}
                        {req.rarity && (
                          <span className={getRarityStyle(req.rarity).text}>
                            ({req.rarity})
                          </span>
                        )}
                      </>
                    ) : req.description}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Quest Items tab ─────────────────────────────────────────────────────────

function QuestItemsTab() {
  const [search, setSearch] = useState("");
  const allItems = useMemo(() => getQuestItems(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((entry) => entry.item.toLowerCase().includes(q));
  }, [allItems, search]);

  return (
    <div className="space-y-4">
      {/* Search */}
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

      {/* Item grid */}
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
              <div className="space-y-1">
                {entry.appearances.map((a, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-text-secondary truncate">
                      <span className="text-gold-dark">{a.traderName}</span>
                      {" — "}
                      {a.questName}
                    </span>
                    <span className="text-text-secondary/60 shrink-0 ml-2">×{a.quantity}</span>
                  </div>
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

// ─── Main component ──────────────────────────────────────────────────────────

type Tab = "traders" | "items";
type MobileStep = "traders" | "quests" | "detail";

export default function QuestsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("traders");
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  // mobile step navigation
  const [mobileStep, setMobileStep] = useState<MobileStep>("traders");

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Quests
        </ShimmerText>
        <p className="text-text-secondary">
          Browse trader quests and search for required items across all of Dark and Darker.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-secondary border border-border-subtle rounded-sm p-1 w-fit">
        {(["traders", "items"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-all ${
              activeTab === tab
                ? "bg-gold-primary/15 text-gold-primary border border-gold-primary/30"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab === "traders" ? (
              <span className="flex items-center gap-1.5"><Sword className="w-3 h-3" />Traders</span>
            ) : (
              <span className="flex items-center gap-1.5"><Package className="w-3 h-3" />Quest Items</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Traders tab ── */}
      {activeTab === "traders" && (
        <div className="flex gap-4 min-h-[600px]">
          {/* ── Trader sidebar (always visible on desktop, hidden on mobile when deeper) ── */}
          <div className={`shrink-0 w-48 xl:w-56 ${mobileStep !== "traders" ? "hidden lg:block" : "block"}`}>
            <div className="space-y-1.5 sticky top-6">
              {TRADERS.map((trader) => {
                const isActive = selectedTrader?.id === trader.id;
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
                    <span
                      className={`text-xs font-cinzel font-bold block transition-colors ${
                        isActive ? "text-gold-primary" : "text-text-primary"
                      }`}
                    >
                      {trader.name}
                    </span>
                    <span className="text-[10px] text-text-secondary/60">{trader.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Quest list pane ── */}
          <div
            className={`flex-1 min-w-0 ${
              mobileStep === "quests"
                ? "block"
                : mobileStep === "detail"
                ? "hidden lg:block"
                : "hidden lg:block"
            }`}
          >
            {selectedTrader ? (
              <QuestList
                trader={selectedTrader}
                selectedQuest={selectedQuest}
                onSelectQuest={handleSelectQuest}
                onBack={handleBackToTraders}
              />
            ) : (
              /* Empty state — no trader selected */
              <div className="h-full flex flex-col items-center justify-center text-center py-24 text-text-secondary/40">
                <Sword className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a trader to view their quests.</p>
              </div>
            )}
          </div>

          {/* ── Quest detail pane ── */}
          <div
            className={`flex-1 min-w-0 ${
              mobileStep === "detail"
                ? "block"
                : "hidden lg:block"
            }`}
          >
            {selectedQuest && selectedTrader ? (
              <QuestDetail
                quest={selectedQuest}
                trader={selectedTrader}
                onBack={handleBackToQuests}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-24 text-text-secondary/40">
                <ChevronRight className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Select a quest to view its details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Quest Items tab ── */}
      {activeTab === "items" && <QuestItemsTab />}
    </div>
  );
}
