"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Users, DoorOpen, Skull, TrendingUp, ArrowUp, Sparkles, Store,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  DarkerDBPopulation, DarkerDBMarketListing, LeaderboardPlayer,
  fetchPopulation, fetchMarket, fetchLeaderboard,
} from "@/lib/darkerdb";
import { formatNumber, timeAgo } from "@/lib/utils";
import ShimmerText from "@/components/ui/ShimmerText";
import { getRarityStyle } from "@/lib/darkerdb";

interface PopSnapshot {
  time: string;
  online: number;
  lobby: number;
  dungeon: number;
}

export default function RealmClient() {
  const [pop, setPop] = useState<DarkerDBPopulation | null>(null);
  const [popHistory, setPopHistory] = useState<PopSnapshot[]>([]);
  const [recentListings, setRecentListings] = useState<DarkerDBMarketListing[]>([]);
  const [recentSold, setRecentSold] = useState<DarkerDBMarketListing[]>([]);
  const [movers, setMovers] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const popHistoryRef = useRef<PopSnapshot[]>([]);

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        const [popRes, listingsRes, soldRes, lbRes] = await Promise.all([
          fetchPopulation(),
          fetchMarket({ limit: 10 }),
          fetchMarket({ limit: 10, has_sold: "true" }),
          fetchLeaderboard({ category: "EA7_HR", limit: 50 }),
        ]);

        setPop(popRes.body);
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        const snapshot = { time: now, online: popRes.body.num_online, lobby: popRes.body.num_lobby, dungeon: popRes.body.num_dungeon };
        popHistoryRef.current = [snapshot];
        setPopHistory([snapshot]);

        setRecentListings(listingsRes.body || []);
        setRecentSold(soldRes.body || []);

        // Compute movers: biggest position gains
        const lb = lbRes.body || [];
        const sorted = lb
          .filter((e) => e.previous_position != null && e.current_position < e.previous_position!)
          .map((e) => ({ ...e, delta: e.previous_position! - e.current_position }))
          .sort((a, b) => b.delta - a.delta)
          .slice(0, 5);
        setMovers(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Poll population every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPopulation()
        .then((res) => {
          setPop(res.body);
          const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          const snapshot = { time: now, online: res.body.num_online, lobby: res.body.num_lobby, dungeon: res.body.num_dungeon };
          popHistoryRef.current = [...popHistoryRef.current.slice(-29), snapshot];
          setPopHistory([...popHistoryRef.current]);
        })
        .catch(console.error);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">The Realm</ShimmerText>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-bg-secondary/50 rounded-sm animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">The Realm</ShimmerText>
        <p className="text-text-secondary">Live pulse of the dungeon</p>
      </motion.div>

      {/* Population cards */}
      {pop && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Online", value: pop.num_online, icon: Users, color: "text-accent-emerald" },
            { label: "In Lobby", value: pop.num_lobby, icon: DoorOpen, color: "text-gold-primary" },
            { label: "In Dungeon", value: pop.num_dungeon, icon: Skull, color: "text-accent-red" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-bg-secondary border border-border-subtle rounded-sm p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <p className={`text-2xl font-cinzel font-bold ${s.color}`}>{formatNumber(s.value)}</p>
              <p className="text-xs text-text-secondary">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Population chart */}
      {popHistory.length > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-bg-secondary border border-border-subtle rounded-sm p-5 mb-8">
          <h3 className="font-cinzel font-bold text-sm text-gold-dark uppercase tracking-wider mb-4">Session Population</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={popHistory}>
                <defs>
                  <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: "#8a8693", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: "#12121a", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "2px", color: "#e8e6e1", fontSize: 12 }} />
                <Area type="monotone" dataKey="online" stroke="#c9a84c" fill="url(#popGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Market feeds + Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Listings */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-bg-secondary border border-border-subtle rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-gold-primary" />
            <h3 className="font-cinzel font-bold text-sm text-gold-primary">Fresh Wares</h3>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentListings.map((l) => {
              const rs = getRarityStyle(l.rarity);
              return (
                <div key={l.id} className="flex items-center justify-between py-2 px-3 bg-bg-primary/30 rounded-sm">
                  <div>
                    <p className={`text-xs font-medium ${rs.text}`}>{l.item || l.archetype}</p>
                    <p className="text-[10px] text-text-secondary">{timeAgo(l.created_at)}</p>
                  </div>
                  <span className="text-xs font-cinzel font-bold text-gold-primary">{formatNumber(l.price)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Sales */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-bg-secondary border border-border-subtle rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent-emerald" />
            <h3 className="font-cinzel font-bold text-sm text-accent-emerald">Coin Exchanged</h3>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentSold.map((l) => {
              const rs = getRarityStyle(l.rarity);
              return (
                <div key={l.id} className="flex items-center justify-between py-2 px-3 bg-bg-primary/30 rounded-sm">
                  <div>
                    <p className={`text-xs font-medium ${rs.text}`}>{l.item || l.archetype}</p>
                    <p className="text-[10px] text-text-secondary">{l.sold_at ? timeAgo(l.sold_at) : "—"}</p>
                  </div>
                  <span className="text-xs font-cinzel font-bold text-accent-emerald">{formatNumber(l.price)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Leaderboard Movers */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-bg-secondary border border-border-subtle rounded-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-gold-primary" />
            <h3 className="font-cinzel font-bold text-sm text-gold-primary">Rising Champions</h3>
          </div>
          <div className="space-y-2">
            {movers.map((m, i) => {
              const delta = m.previous_position! - m.current_position;
              return (
                <div key={`${m.character}-${i}`} className="flex items-center justify-between py-2 px-3 bg-bg-primary/30 rounded-sm">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{String(m.character)}</p>
                    <p className="text-[10px] text-text-secondary">{m.class} · #{m.current_position}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-accent-emerald">
                    <ArrowUp className="w-3 h-3" />
                    +{delta}
                  </span>
                </div>
              );
            })}
            {movers.length === 0 && (
              <p className="text-sm text-text-secondary/60 text-center py-4">No rank changes detected.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
