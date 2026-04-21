"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Clock, Eye } from "lucide-react";

export type FeedbackStatus = "new" | "reviewed" | "resolved";
export type FeedbackCategory = "bug" | "suggestion" | "data" | "other";

export interface FeedbackItem {
  id: string;
  user_id: string | null;
  category: FeedbackCategory;
  message: string;
  page_url: string | null;
  user_agent: string | null;
  status: FeedbackStatus;
  created_at: string;
  resolved_at: string | null;
}

type Filter = FeedbackStatus | "all";

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "resolved", label: "Resolved" },
  { value: "all", label: "All" },
];

const CATEGORY_STYLES: Record<FeedbackCategory, string> = {
  bug: "bg-accent-red/15 text-accent-red border-accent-red/40",
  suggestion: "bg-gold-primary/15 text-gold-primary border-gold-primary/40",
  data: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  other: "bg-text-secondary/15 text-text-secondary border-text-secondary/40",
};

const STATUS_STYLES: Record<FeedbackStatus, string> = {
  new: "text-accent-red",
  reviewed: "text-gold-primary",
  resolved: "text-accent-emerald",
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminFeedbackClient({
  items,
}: {
  items: FeedbackItem[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("new");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      new: 0,
      reviewed: 0,
      resolved: 0,
      all: items.length,
    };
    for (const item of items) c[item.status]++;
    return c;
  }, [items]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.status === filter);
  }, [items, filter]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/feedback", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Failed to update");
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="font-cinzel font-bold text-2xl text-gold-primary mb-1">
          Feedback
        </h1>
        <p className="text-sm text-text-secondary">
          Showing the most recent 200 submissions.
        </p>
      </header>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-border-subtle">
        {FILTER_TABS.map((tab) => {
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 text-xs font-cinzel font-bold uppercase tracking-wider border-b-2 transition-colors ${
                active
                  ? "text-gold-primary border-gold-primary"
                  : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-text-secondary/70 font-normal">
                {counts[tab.value]}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 text-accent-red shrink-0" />
          <p className="text-xs text-accent-red">{error}</p>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="text-center py-16 text-text-secondary text-sm">
          No feedback in this view.
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const isExpanded = expanded.has(item.id);
            const showExpand = item.message.length > 220;
            const messagePreview =
              !isExpanded && showExpand
                ? `${item.message.slice(0, 220)}…`
                : item.message;
            const busy = busyId === item.id || pending;

            return (
              <li
                key={item.id}
                className="bg-bg-secondary border border-border-subtle rounded-sm p-4"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-sm ${CATEGORY_STYLES[item.category]}`}
                    >
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold ${STATUS_STYLES[item.status]}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status !== "reviewed" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(item.id, "reviewed")}
                        className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-gold-primary hover:text-gold-light disabled:opacity-50 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Reviewed
                      </button>
                    )}
                    {item.status !== "resolved" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(item.id, "resolved")}
                        className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-accent-emerald hover:opacity-80 disabled:opacity-50 transition-colors"
                      >
                        <Check className="w-3 h-3" /> Resolved
                      </button>
                    )}
                    {item.status !== "new" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => updateStatus(item.id, "new")}
                        className="text-[10px] uppercase tracking-wider font-bold text-text-secondary hover:text-text-primary disabled:opacity-50 transition-colors"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-text-primary whitespace-pre-wrap break-words mb-3">
                  {messagePreview}
                </p>
                {showExpand && (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.id)}
                    className="text-[10px] uppercase tracking-wider font-bold text-gold-dark hover:text-gold-primary mb-3 transition-colors"
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>
                )}

                <div className="text-[11px] text-text-secondary space-y-0.5 border-t border-border-subtle/60 pt-2">
                  <div>
                    <span className="uppercase tracking-wider text-[10px] text-text-secondary/70 mr-2">
                      Page
                    </span>
                    <span className="break-all">
                      {item.page_url ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="uppercase tracking-wider text-[10px] text-text-secondary/70 mr-2">
                      User
                    </span>
                    <span className="font-mono">
                      {item.user_id ?? "anonymous"}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
