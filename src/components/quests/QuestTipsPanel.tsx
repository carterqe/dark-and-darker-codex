"use client";

import { useState, useEffect, useRef } from "react";
import { ThumbsUp, Trash2, MessageSquarePlus, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type TipType = "general" | "farming" | "strategy" | "warning";

interface Tip {
  id: string;
  quest_id: string;
  user_id: string;
  content: string;
  tip_type: TipType;
  helpful_count: number;
  created_at: string;
  profiles: { username: string } | null;
  isOptimistic?: boolean;
}

const TIP_TYPE_META: Record<TipType, { label: string; color: string }> = {
  general:  { label: "General",  color: "text-gold-dark border-gold-primary/30 bg-gold-primary/10" },
  farming:  { label: "Farming",  color: "text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10" },
  strategy: { label: "Strategy", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  warning:  { label: "Warning",  color: "text-accent-red border-accent-red/30 bg-accent-red/10" },
};

export default function QuestTipsPanel({ questId }: { questId: string }) {
  const { user, profile, openAuthModal } = useAuth();
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [tipType, setTipType] = useState<TipType>("general");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLoading(true);
    setTips([]);
    fetch(`/api/quest-tips?quest_id=${questId}`)
      .then((r) => r.json())
      .then((d) => setTips(d.tips ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [questId]);

  useEffect(() => {
    if (showForm) textareaRef.current?.focus();
  }, [showForm]);

  const submitTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { openAuthModal("login"); return; }
    if (content.trim().length < 10) { setError("Tip must be at least 10 characters."); return; }

    setSubmitting(true);
    setError(null);

    const optimistic: Tip = {
      id: `optimistic-${Date.now()}`,
      quest_id: questId,
      user_id: user.id,
      content: content.trim(),
      tip_type: tipType,
      helpful_count: 0,
      created_at: new Date().toISOString(),
      profiles: { username: profile?.username ?? "You" },
      isOptimistic: true,
    };
    setTips((prev) => [optimistic, ...prev]);
    setContent("");
    setShowForm(false);

    const res = await fetch("/api/quest-tips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: questId, content: optimistic.content, tip_type: tipType }),
    });

    if (res.ok) {
      const { id } = await res.json();
      setTips((prev) =>
        prev.map((t) => (t.id === optimistic.id ? { ...t, id, isOptimistic: false } : t)),
      );
    } else {
      // Rollback
      setTips((prev) => prev.filter((t) => t.id !== optimistic.id));
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "Failed to submit tip.");
      setContent(optimistic.content);
      setShowForm(true);
    }
    setSubmitting(false);
  };

  const deleteTip = async (tipId: string) => {
    setTips((prev) => prev.filter((t) => t.id !== tipId));
    await fetch(`/api/quest-tips/${tipId}`, { method: "DELETE" });
  };

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-cinzel font-bold text-sm text-gold-primary">
          Community Tips
          {tips.length > 0 && (
            <span className="ml-2 text-[10px] text-text-secondary/60 font-normal font-sans">
              ({tips.length})
            </span>
          )}
        </h3>
        {!showForm && (
          <button
            onClick={() => {
              if (!user) { openAuthModal("login"); return; }
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-sm border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 transition-colors"
          >
            <MessageSquarePlus className="w-3 h-3" />
            Add Tip
          </button>
        )}
      </div>

      {/* Submission form */}
      {showForm && (
        <form onSubmit={submitTip} className="space-y-3">
          {error && (
            <p className="text-xs text-accent-red">{error}</p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(TIP_TYPE_META) as TipType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipType(t)}
                className={`text-[10px] px-2 py-1 rounded-sm border transition-all ${
                  tipType === t
                    ? TIP_TYPE_META[t].color
                    : "border-border-subtle text-text-secondary/60 hover:text-text-secondary"
                }`}
              >
                {TIP_TYPE_META[t].label}
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Share a helpful tip about this quest… (10–500 characters)"
            className="w-full px-3 py-2 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all resize-none"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-text-secondary/40">{content.length}/500</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setContent(""); setError(null); }}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || content.trim().length < 10}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-primary text-bg-primary font-cinzel font-bold text-xs rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tips list */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-text-secondary/40" />
        </div>
      ) : tips.length === 0 ? (
        <p className="text-xs text-text-secondary/40 text-center py-4">
          No tips yet. Be the first to help other adventurers!
        </p>
      ) : (
        <div className="space-y-3">
          {tips.map((tip) => {
            const meta = TIP_TYPE_META[tip.tip_type];
            return (
              <div
                key={tip.id}
                className={`rounded-sm p-3 border ${tip.isOptimistic ? "opacity-60" : ""} ${
                  tip.tip_type === "warning"
                    ? "bg-accent-red/5 border-accent-red/20"
                    : "bg-bg-primary/40 border-border-subtle/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm border ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-text-secondary/60">
                      {tip.profiles?.username ?? "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tip.helpful_count > 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-text-secondary/50">
                        <ThumbsUp className="w-2.5 h-2.5" />
                        {tip.helpful_count}
                      </span>
                    )}
                    {user?.id === tip.user_id && !tip.isOptimistic && (
                      <button
                        onClick={() => deleteTip(tip.id)}
                        className="text-text-secondary/30 hover:text-accent-red transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mt-2">{tip.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
