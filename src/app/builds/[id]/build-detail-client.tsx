"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ArrowLeft,
  Send,
  Trash2,
  Hammer,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  GEAR_SLOTS,
  type Build,
  type BuildComment,
} from "@/lib/build-types";
import { getClassPortrait, getRarityStyle } from "@/lib/darkerdb";
import { getClassData, getPerkIconUrl } from "@/lib/class-data";
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

export default function BuildDetailClient({ id }: { id: string }) {
  const { supabase, user, profile, openAuthModal } = useAuth();
  const [build, setBuild] = useState<Build | null>(null);
  const [comments, setComments] = useState<BuildComment[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBuild = async () => {
      const { data, error } = await supabase
        .from("builds")
        .select("*, profiles!author_id(username)")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBuild(data as Build);
      setVoteCount(data.vote_count ?? 0);

      // Check if current user has voted
      if (user) {
        const { data: voteRow } = await supabase
          .from("build_votes")
          .select("user_id")
          .eq("build_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        setHasVoted(!!voteRow);
      }

      // Fetch comments
      const { data: cmts } = await supabase
        .from("build_comments")
        .select("*, profiles!author_id(username)")
        .eq("build_id", id)
        .order("created_at", { ascending: true });

      setComments((cmts as BuildComment[]) ?? []);
      setLoading(false);
    };

    fetchBuild();
  }, [supabase, id, user]);

  const toggleVote = async () => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    if (hasVoted) {
      await supabase
        .from("build_votes")
        .delete()
        .eq("build_id", id)
        .eq("user_id", user.id);
      setHasVoted(false);
      setVoteCount((v) => v - 1);
    } else {
      await supabase
        .from("build_votes")
        .insert({ build_id: id, user_id: user.id });
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
      .insert({
        build_id: id,
        author_id: user.id,
        content: commentText.trim(),
      })
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
        <h2 className="font-cinzel font-bold text-xl text-text-secondary">
          Build not found
        </h2>
        <Link href="/builds" className="text-gold-primary hover:text-gold-light text-sm mt-4 inline-block">
          ← Back to Builds
        </Link>
      </div>
    );
  }

  const classColor = CLASS_COLORS[build.class] ?? "text-gold-primary";
  const gearEntries = GEAR_SLOTS.filter(
    ({ key }) => build.equipment?.[key as keyof typeof build.equipment]
  );

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
          <img
            src={getClassPortrait(build.class)}
            alt={build.class}
            className="w-16 h-16 rounded-sm object-cover opacity-90 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
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
              {/* Vote button */}
              <button
                onClick={toggleVote}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-sm border transition-all shrink-0 ${
                  hasVoted
                    ? "bg-gold-primary/20 border-gold-primary/50 text-gold-primary"
                    : "border-border-subtle text-text-secondary hover:border-gold-primary/30 hover:text-gold-primary"
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${hasVoted ? "fill-current" : ""}`} />
                <span className="text-xs font-cinzel font-bold">{voteCount}</span>
              </button>
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
            <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {build.description}
            </p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gear */}
        {gearEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-secondary border border-border-subtle rounded-sm p-6"
          >
            <h2 className="font-cinzel font-bold text-sm text-gold-primary mb-4">
              Equipment
            </h2>
            <div className="space-y-3">
              {gearEntries.map(({ key, label }) => {
                const item = build.equipment?.[key as keyof typeof build.equipment];
                if (!item) return null;
                const rs = getRarityStyle(item.rarity);
                const itemStats = item.stats ?? {};
                const hasStats = Object.keys(itemStats).length > 0;
                return (
                  <div key={key} className="border-b border-border-subtle/50 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[10px] text-text-secondary uppercase tracking-wider w-24 shrink-0">
                        {label}
                      </span>
                      <div className="flex items-center gap-2 text-right">
                        <Link
                          href={`/armory/${item.item_id}`}
                          className={`text-xs font-medium hover:underline ${rs.text}`}
                        >
                          {item.item_name}
                        </Link>
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
                            {stat.replace(/_/g, " ")} +{val}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Perks + Skills */}
        {(build.perks.length > 0 || build.skills.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-bg-secondary border border-border-subtle rounded-sm p-6 space-y-5"
          >
            {build.perks.length > 0 && (
              <PerkSkillSection
                title="Perks"
                names={build.perks}
                className={build.class}
              />
            )}
            {build.skills.length > 0 && (
              <PerkSkillSection
                title="Skills"
                names={build.skills}
                className={build.class}
              />
            )}
          </motion.div>
        )}
      </div>

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

        {/* Comment form */}
        {user ? (
          <form onSubmit={postComment} className="flex gap-2 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={500}
              placeholder="Share your thoughts..."
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

        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-text-secondary/50 text-center py-4">
              No comments yet. Be the first!
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

function PerkSkillIcon({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-8 h-8 rounded-sm bg-bg-tertiary border border-border-subtle flex items-center justify-center shrink-0">
        <span className="text-[9px] font-cinzel font-bold text-gold-dark">{name.charAt(0)}</span>
      </div>
    );
  }
  return (
    <img
      src={getPerkIconUrl(name)}
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
  const allItems = title === "Perks" ? classData?.perks : classData?.skills;

  return (
    <div>
      <h2 className="font-cinzel font-bold text-sm text-gold-primary mb-3">{title}</h2>
      <div className="space-y-2">
        {names.map((name) => {
          const data = allItems?.find((p) => p.name === name);
          return (
            <div key={name} className="flex items-start gap-3 py-2 px-3 bg-bg-primary/40 rounded-sm">
              <PerkSkillIcon name={name} />
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
