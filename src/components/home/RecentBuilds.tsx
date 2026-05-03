"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hammer, ThumbsUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getClassPortrait } from "@/lib/darkerdb";
import { timeAgo } from "@/lib/utils";
import ShimmerText from "@/components/ui/ShimmerText";

interface BuildSummary {
  id: string;
  title: string;
  class: string;
  vote_count: number | null;
  created_at: string;
  profiles: { username: string } | null;
}

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
  Sorcerer: "text-cyan-400",
};

export default function RecentBuilds() {
  const { supabase } = useAuth();
  const [builds, setBuilds] = useState<BuildSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("builds")
      .select("id, title, class, vote_count, created_at, profiles!author_id(username)")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setBuilds((data as unknown as BuildSummary[]) ?? []);
        setLoading(false);
      });
  }, [supabase]);

  if (loading) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-bg-secondary/50 rounded-sm animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (builds.length === 0) {
    return (
      <section className="py-12 px-4 text-center">
        <Hammer className="w-10 h-10 text-gold-dark mx-auto mb-4" />
        <p className="text-text-secondary text-sm mb-6">
          No community builds yet. Be the first to share one.
        </p>
        <Link
          href="/builds/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-cinzel font-bold text-gold-primary border border-gold-primary/40 rounded-sm hover:bg-gold-primary/10 transition-all"
        >
          <Hammer className="w-3.5 h-3.5" />
          Create Build
        </Link>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="text-center mb-10">
        <ShimmerText as="h2" className="text-3xl sm:text-4xl">
          Recent Community Builds
        </ShimmerText>
        <p className="text-text-secondary text-sm mt-2">
          Fresh loadouts from fellow adventurers
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {builds.map((build, i) => {
          const classColor = CLASS_COLORS[build.class] ?? "text-gold-primary";
          return (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/builds/${build.id}`}
                className="block h-full bg-bg-secondary border border-border-subtle rounded-sm p-5 hover:border-gold-primary/40 hover:bg-bg-tertiary/40 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Image
                    src={getClassPortrait(build.class)}
                    alt={build.class}
                    width={48}
                    height={48}
                    className="rounded-sm object-cover opacity-90 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className={`text-[10px] font-cinzel font-bold ${classColor} block uppercase tracking-wider`}>
                      {build.class}
                    </span>
                    <h3 className="font-cinzel font-bold text-base text-text-primary leading-tight truncate">
                      {build.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>
                    by <span className="text-gold-dark">{build.profiles?.username ?? "Unknown"}</span>
                  </span>
                  <span>{timeAgo(build.created_at)}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border-subtle/50 flex items-center gap-1.5 text-[11px] text-text-secondary">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{build.vote_count ?? 0}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
