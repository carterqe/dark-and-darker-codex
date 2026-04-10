"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hammer, Plus, ThumbsUp, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BUILD_CLASSES, type Build } from "@/lib/build-types";
import { getClassPortrait } from "@/lib/darkerdb";
import ShimmerText from "@/components/ui/ShimmerText";
import MedievalButton from "@/components/ui/MedievalButton";
import { timeAgo } from "@/lib/utils";

const CLASS_COLORS: Record<string, string> = {
  Fighter: "text-red-400",
  Barbarian: "text-orange-400",
  Rogue: "text-yellow-400",
  Ranger: "text-green-400",
  Wizard: "text-blue-400",
  Cleric: "text-white",
  Bard: "text-pink-400",
  Warlock: "text-purple-400",
  Druid: "text-emerald-400",
};

export default function BuildsClient() {
  const { supabase, user, openAuthModal } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "top">("newest");

  useEffect(() => {
    setLoading(true);

    let query = supabase
      .from("builds")
      .select("*, profiles!author_id(username)")
      .eq("is_public", true);

    if (classFilter) query = query.eq("class", classFilter);
    if (sortBy === "newest") query = query.order("created_at", { ascending: false });
    else query = query.order("vote_count", { ascending: false });

    query.limit(50).then(({ data, error }) => {
      if (error) console.error("Builds fetch error:", error);
      setBuilds((data as Build[]) ?? []);
      setLoading(false);
    });
  }, [supabase, classFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <ShimmerText as="h1" className="text-4xl sm:text-5xl mb-3">
          Community Builds
        </ShimmerText>
        <p className="text-text-secondary">
          Share your loadouts. Learn from the best.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        {/* Class filter */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5">
            Class
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setClassFilter("")}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all cursor-pointer ${
                classFilter === ""
                  ? "text-gold-light bg-bg-tertiary border-gold-primary/40"
                  : "text-text-secondary border-border-subtle hover:text-gold-primary hover:border-gold-dark"
              }`}
            >
              All
            </button>
            {BUILD_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`px-3 py-1.5 text-xs font-medium rounded-sm border transition-all cursor-pointer ${
                  classFilter === cls
                    ? "text-gold-light bg-bg-tertiary border-gold-primary/40"
                    : "text-text-secondary border-border-subtle hover:text-gold-primary hover:border-gold-dark"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Right: sort + create */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-border-subtle rounded-sm overflow-hidden">
            {(["newest", "top"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1 ${
                  sortBy === s
                    ? "bg-gold-primary/15 text-gold-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {s === "newest" ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <ThumbsUp className="w-3 h-3" />
                )}
                {s === "newest" ? "Newest" : "Top"}
              </button>
            ))}
          </div>
          {user ? (
            <Link href="/builds/create">
              <MedievalButton variant="primary">
                <Plus className="w-4 h-4" />
                New Build
              </MedievalButton>
            </Link>
          ) : (
            <MedievalButton variant="primary" onClick={() => openAuthModal("login")}>
              <Plus className="w-4 h-4" />
              New Build
            </MedievalButton>
          )}
        </div>
      </div>

      {/* Builds grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-bg-secondary/50 rounded-sm animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      ) : builds.length === 0 ? (
        <div className="text-center py-20">
          <Hammer className="w-12 h-12 text-gold-dark mx-auto mb-4" />
          <p className="font-cinzel text-lg text-text-secondary">
            No builds yet
            {classFilter ? ` for ${classFilter}` : ""}.
          </p>
          <p className="text-sm text-text-secondary/60 mt-2">
            Be the first to share your loadout!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map((build, i) => (
            <BuildCard key={build.id} build={build} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function BuildCard({ build, index }: { build: Build; index: number }) {
  const classColor = CLASS_COLORS[build.class] ?? "text-gold-primary";

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <Link href={`/builds/${build.id}`}>
        <div className="h-full bg-bg-secondary border border-border-subtle rounded-sm p-5 hover:border-gold-primary/30 hover:bg-bg-tertiary/50 transition-all group cursor-pointer">
          {/* Class + votes row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Image
                src={getClassPortrait(build.class)}
                alt={build.class}
                width={32}
                height={32}
                className="rounded-sm object-cover opacity-80"
              />
              <span className={`text-xs font-cinzel font-bold ${classColor}`}>
                {build.class}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <ThumbsUp className="w-3 h-3" />
              {build.vote_count}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-cinzel font-bold text-sm text-text-primary group-hover:text-gold-light transition-colors mb-1 leading-snug">
            {build.title}
          </h3>

          {/* Author + time */}
          <p className="text-[10px] text-text-secondary mb-3">
            by{" "}
            <span className="text-gold-dark">
              {build.profiles?.username ?? "Unknown"}
            </span>{" "}
            · {timeAgo(build.created_at)}
          </p>

          {/* Description preview */}
          {build.description && (
            <p className="text-xs text-text-secondary/70 line-clamp-2 mb-3">
              {build.description}
            </p>
          )}

          {/* Tags */}
          {build.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {build.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 bg-gold-primary/10 text-gold-dark border border-gold-primary/20 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
