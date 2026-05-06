"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ArrowLeft,
  Send,
  Trash2,
  Hammer,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  GEAR_SLOTS,
  type Build,
  type BuildComment,
} from "@/lib/build-types";
import { getClassPortrait, getRarityStyle } from "@/lib/darkerdb";
import { getClassData, getMemoryItems, getPerkIconUrl, getSkillIconUrl, getSpellIconUrl } from "@/lib/class-data";
import { timeAgo } from "@/lib/utils";
import CharacterStatPanel from "@/components/builds/CharacterStatPanel";

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

const RARITY_BORDER_COLOR: Record<string, string> = {
  Poor: "#6b7280",
  Common: "#d1d5db",
  Uncommon: "#4ade80",
  Rare: "#60a5fa",
  Epic: "#c084fc",
  Legendary: "#fb923c",
  Unique: "#d4a832",
  Artifact: "#f87171",
};

export default function BuildDetailClient({ id }: { id: string }) {
  const { supabase, user, profile, openAuthModal } = useAuth();
  const router = useRouter();
  const [build, setBuild] = useState<Build | null>(null);
  const [comments, setComments] = useState<BuildComment[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchBuild = async () => {
      const buildQuery = supabase
        .from("builds")
        .select("*, profiles!author_id(username)")
        .eq("id", id)
        .single();

      const commentsQuery = supabase
        .from("build_comments")
        .select("*, profiles!author_id(username)")
        .eq("build_id", id)
        .order("created_at", { ascending: true });

      const voteQuery = user
        ? supabase
            .from("build_votes")
            .select("user_id")
            .eq("build_id", id)
            .eq("user_id", user.id)
            .maybeSingle()
        : null;

      const [buildRes, commentsRes, voteRes] = await Promise.all([
        buildQuery,
        commentsQuery,
        voteQuery,
      ]);

      if (buildRes.error || !buildRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBuild(buildRes.data as Build);
      setVoteCount(buildRes.data.vote_count ?? 0);
      setComments((commentsRes.data as BuildComment[]) ?? []);
      setHasVoted(!!voteRes?.data);
      setLoading(false);
    };

    fetchBuild();
  }, [supabase, id, user]);

  // Auto-cancel the delete confirmation after 5 seconds
  useEffect(() => {
    if (!confirmDelete) return;
    const timer = setTimeout(() => setConfirmDelete(false), 5000);
    return () => clearTimeout(timer);
  }, [confirmDelete]);

  const toggleVote = async () => {
    if (!user) { openAuthModal("login"); return; }
    if (hasVoted) {
      await supabase.from("build_votes").delete().eq("build_id", id).eq("user_id", user.id);
      setHasVoted(false);
      setVoteCount((v) => v - 1);
    } else {
      await supabase.from("build_votes").insert({ build_id: id, user_id: user.id });
      setHasVoted(true);
      setVoteCount((v) => v + 1);
    }
  };

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) { openAuthModal("login"); return; }
    if (!commentText.trim()) return;

    setPosting(true);
    const { data, error } = await supabase
      .from("build_comments")
      .insert({ build_id: id, author_id: user.id, content: commentText.trim() })
      .select("*, profiles!author_id(username)")
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data as BuildComment]);
      setCommentText("");
    }
    setPosting(false);
  };

  const deleteComment = async (commentId: string) => {
    await supabase.from("build_comments").delete().eq("id", commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const deleteBuild = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await fetch(`/api/builds/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/builds");
    } else {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-bg-secondary/50 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (notFound || !build) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Hammer className="w-12 h-12 text-gold-dark mx-auto mb-4" />
        <h2 className="font-cinzel font-bold text-xl text-text-secondary">Build not found</h2>
        <p className="text-sm text-text-secondary/60 mt-2">This build may have been deleted or the link is invalid.</p>
        <Link href="/builds" className="flex items-center justify-center gap-1.5 text-gold-primary hover:text-gold-light text-sm mt-4">
          <ArrowLeft className="w-3 h-3" /> Back to Builds
        </Link>
      </div>
    );
  }

  const classColor = CLASS_COLORS[build.class] ?? "text-gold-primary";
  const gearEntries = GEAR_SLOTS.filter(
    ({ key }) => build.equipment?.[key as keyof typeof build.equipment],
  );
  const totalGS = gearEntries.reduce((sum, { key }) => {
    const item = build.equipment?.[key as keyof typeof build.equipment];
    return sum + (item?.gear_score ?? 0);
  }, 0);
  const isAuthor = user?.id === build.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Back */}
      <Link
        href="/builds"
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-primary transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Back to Builds
      </Link>

      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-secondary border border-border-subtle rounded-sm p-6"
      >
        <div className="flex items-start gap-4">
          <Image
            src={getClassPortrait(build.class)}
            alt={build.class}
            width={64}
            height={64}
            className="rounded-sm object-cover opacity-90 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className={`text-xs font-cinzel font-bold ${classColor} block mb-1`}>
                  {build.class}
                </span>
                <h1 className="font-cinzel font-bold text-2xl text-text-primary leading-tight">
                  {build.title}
                </h1>
                <p className="text-xs text-text-secondary mt-1">
                  by{" "}
                  <span className="text-gold-dark">
                    {build.profiles?.username ?? "Unknown"}
                  </span>{" "}
                  · {timeAgo(build.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Vote */}
                <button
                  onClick={toggleVote}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-sm border transition-all ${
                    hasVoted
                      ? "bg-gold-primary/20 border-gold-primary/50 text-gold-primary"
                      : "border-border-subtle text-text-secondary hover:border-gold-primary/30 hover:text-gold-primary"
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${hasVoted ? "fill-current" : ""}`} />
                  <span className="text-xs font-cinzel font-bold">{voteCount}</span>
                </button>

                {/* Author controls */}
                {isAuthor && (
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/builds/${id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-sm border border-border-subtle text-text-secondary/50 hover:border-gold-primary/40 hover:text-gold-primary text-xs font-cinzel font-bold transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    {confirmDelete && (
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={deleteBuild}
                      disabled={deleting}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-sm border text-xs font-cinzel font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        confirmDelete
                          ? "bg-accent-red/20 border-accent-red/60 text-accent-red hover:bg-accent-red/30"
                          : "border-border-subtle text-text-secondary/50 hover:border-accent-red/40 hover:text-accent-red"
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {confirmDelete ? "Confirm" : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {build.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {build.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 bg-gold-primary/10 text-gold-dark border border-gold-primary/20 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {build.description && (
          <div className="mt-5 pt-5 border-t border-border-subtle">
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
              {build.description}
            </p>
          </div>
        )}
      </motion.div>

      {/* Gear + Stat Panel */}
      {gearEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-secondary border border-border-subtle rounded-sm p-6"
        >
          <h2 className="font-cinzel font-bold text-sm text-gold-primary mb-4">Equipment</h2>
          <div className="space-y-2">
            {gearEntries.map(({ key, label }) => {
              const item = build.equipment?.[key as keyof typeof build.equipment];
              if (!item) return null;
              const rs = getRarityStyle(item.rarity);
              const borderColor = RARITY_BORDER_COLOR[item.rarity] ?? "#6b7280";
              const itemStats = item.stats ?? {};
              const hasStats = Object.keys(itemStats).length > 0;
              return (
                <div
                  key={key}
                  className="border-b border-border-subtle/50 last:border-0 pb-2 last:pb-0"
                >
                  <div
                    className="flex items-center justify-between py-1 pl-3 rounded-sm"
                    style={{ borderLeft: `2px solid ${borderColor}33` }}
                  >
                    <span className="text-[10px] text-text-secondary uppercase tracking-wider w-24 shrink-0">
                      {label}
                    </span>
                    <div className="flex items-center gap-2 text-right flex-wrap justify-end">
                      <Link
                        href={`/armory/${item.item_id}`}
                        className={`text-xs font-medium hover:underline ${rs.text}`}
                        style={{ color: borderColor }}
                      >
                        {item.item_name}
                      </Link>
                      {item.hand && item.hand.length > 0 && item.hand.map((h) => (
                        <span key={h} className="text-[9px] px-1.5 py-0.5 bg-gold-primary/10 text-gold-dark border border-gold-primary/20 rounded-sm">
                          {h === "main" ? "Main Hand" : "Off-hand"}
                        </span>
                      ))}
                      {item.gear_score > 0 && (
                        <span className="text-[10px] text-text-secondary/50 shrink-0">
                          GS {item.gear_score}
                        </span>
                      )}
                    </div>
                  </div>
                  {hasStats && (
                    <div className="flex flex-wrap gap-1.5 mt-1 ml-24">
                      {Object.entries(itemStats).map(([stat, val]) => (
                        <span
                          key={stat}
                          className="text-[10px] px-1.5 py-0.5 bg-accent-emerald/10 text-accent-emerald rounded-sm"
                        >
                          {stat.replace(/^secondary_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          {val != null ? ` +${val}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total GS */}
          {totalGS > 0 && (
            <div className="mt-4 pt-4 border-t border-border-subtle flex justify-end">
              <span className="text-xs font-cinzel font-bold text-gold-dark">
                Total GS: {totalGS}
              </span>
            </div>
          )}

          {/* Character stats inside gear card */}
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <CharacterStatPanel equipment={build.equipment ?? {}} selectedClass={build.class} />
          </div>
        </motion.div>
      )}

      {/* Perks + Skills — full width below gear */}
      {(build.perks.length > 0 || build.skills.length > 0 || (build.spells?.length ?? 0) > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-5"
        >
          {build.perks.length > 0 && (
            <PerkSkillSection title="Perks" names={build.perks} className={build.class} />
          )}
          {build.skills.length > 0 && (
            <PerkSkillSection title="Skills" names={build.skills} className={build.class} />
          )}
          {build.spells && build.spells.length > 0 && (
            <MemoryDisplay className={build.class} skills={build.skills} selected={build.spells} />
          )}
        </motion.div>
      )}

      {/* Comments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-bg-secondary border border-border-subtle rounded-sm p-6"
      >
        <h2 className="font-cinzel font-bold text-sm text-gold-primary mb-5">
          Discussion ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={postComment} className="flex gap-2 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
              placeholder="Share your thoughts on this build..."
              className="flex-1 px-3 py-2 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={posting || !commentText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold-primary text-bg-primary font-cinzel font-bold text-xs rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3 h-3" />
              Post
            </button>
          </form>
        ) : (
          <div className="mb-6 p-4 border border-border-subtle rounded-sm text-center">
            <p className="text-sm text-text-secondary">
              <button
                onClick={() => openAuthModal("login")}
                className="text-gold-primary hover:text-gold-light underline"
              >
                Sign in
              </button>{" "}
              to join the discussion
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-text-secondary/50 text-center py-4">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-cinzel font-bold text-gold-dark">
                      {comment.profiles?.username ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-text-secondary/50">
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {comment.content}
                  </p>
                </div>
                {user?.id === comment.author_id && (
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-text-secondary/30 hover:text-accent-red transition-colors shrink-0 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

function PerkSkillIcon({ name, type }: { name: string; type: "perk" | "skill" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-8 h-8 rounded-sm bg-bg-tertiary border border-border-subtle flex items-center justify-center shrink-0">
        <span className="text-[9px] font-cinzel font-bold text-gold-dark">{name.charAt(0)}</span>
      </div>
    );
  }
  const iconUrl = type === "perk" ? getPerkIconUrl(name) : getSkillIconUrl(name);
  return (
    <img
      src={iconUrl}
      alt={name}
      className="w-8 h-8 rounded-sm object-cover bg-bg-tertiary border border-border-subtle shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function PerkSkillSection({
  title,
  names,
  className,
}: {
  title: string;
  names: string[];
  className: string;
}) {
  const classData = getClassData(className);
  const isPerk = title === "Perks";
  const allItems = isPerk ? classData?.perks : classData?.skills;

  return (
    <div>
      <h2 className="font-cinzel font-bold text-sm text-gold-primary mb-3">{title}</h2>
      <div className="space-y-2">
        {names.map((name, i) => {
          const data = allItems?.find((p) => p.name === name);
          return (
            <div key={`${name}-${i}`} className="flex items-start gap-3 py-2 px-3 bg-bg-primary/40 rounded-sm">
              <PerkSkillIcon name={name} type={isPerk ? "perk" : "skill"} />
              <div className="min-w-0">
                <span className="text-sm font-medium text-text-primary block">{name}</span>
                {data?.description && (
                  <span className="text-[11px] text-text-secondary leading-relaxed block mt-0.5">
                    {data.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpellChipIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-5 h-5 rounded-sm bg-bg-tertiary border border-border-subtle flex items-center justify-center shrink-0">
        <span className="text-[9px] font-cinzel font-bold text-purple-400">{name.charAt(0)}</span>
      </div>
    );
  }
  return (
    <img
      src={getSpellIconUrl(name)}
      alt={name}
      className="w-5 h-5 rounded-sm object-cover bg-bg-tertiary border border-border-subtle shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function MemoryDisplay({
  className,
  skills,
  selected,
}: {
  className: string;
  skills: string[];
  selected: string[];
}) {
  const groups = getMemoryItems(className, skills);

  const sections = groups
    .map((g) => {
      const groupNames = new Set(g.items.map((i) => i.name));
      const items = selected
        .filter((name) => groupNames.has(name))
        .map((name) => ({ name, tier: g.items.find((i) => i.name === name)?.tier }));
      return { type: g.type, label: g.label, items };
    })
    .filter((s) => s.items.length > 0);

  const claimed = new Set(sections.flatMap((s) => s.items.map((i) => i.name)));
  const orphans = selected.filter((s) => !claimed.has(s));

  if (sections.length === 0 && orphans.length === 0) return null;

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={`${section.type}-${section.label}`}>
          <h2 className="font-cinzel font-bold text-sm text-purple-400 mb-3">
            Memorized {section.label}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {section.items.map(({ name, tier }) => (
              <span
                key={name}
                className="flex items-center gap-1.5 text-[11px] px-2 py-1 bg-purple-400/10 text-purple-300 border border-purple-400/20 rounded-sm"
              >
                <SpellChipIcon name={name} />
                {name}
                {tier != null && tier > 0 && (
                  <span className="text-[9px] text-purple-400/60 tabular-nums">T{tier}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
      {orphans.length > 0 && (
        <div>
          <h2 className="font-cinzel font-bold text-sm text-purple-400 mb-3">Memorized Spells</h2>
          <div className="flex flex-wrap gap-1.5">
            {orphans.map((name) => (
              <span
                key={name}
                className="flex items-center gap-1.5 text-[11px] px-2 py-1 bg-purple-400/10 text-purple-300 border border-purple-400/20 rounded-sm"
              >
                <SpellChipIcon name={name} />
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
