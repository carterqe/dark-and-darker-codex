"use client";

import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, ChevronDown, ChevronUp, Clock } from "lucide-react";
import type { SteamNewsItem } from "@/app/api/patch-notes/route";
import ShimmerText from "@/components/ui/ShimmerText";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function timeAgo(unix: number): string {
  const seconds = Math.floor(Date.now() / 1000) - unix;
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const PREVIEW_LENGTH = 600;

function PatchNoteCard({ item, index }: { item: SteamNewsItem; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const plainText = stripHtml(item.contents);
  const isLong = plainText.length > PREVIEW_LENGTH;
  const preview = isLong && !expanded ? plainText.slice(0, PREVIEW_LENGTH) + "…" : plainText;

  return (
    <article className="bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-subtle/50 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-cinzel font-bold text-base text-text-primary leading-snug">
            {item.title}
          </h2>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-text-secondary/70">
              <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
              <time dateTime={new Date(item.date * 1000).toISOString()}>
                {formatDate(item.date)}
              </time>
              <span className="text-text-secondary/40">·</span>
              <span>{timeAgo(item.date)}</span>
            </span>
            {item.author && (
              <span className="text-[11px] text-gold-dark/70">by {item.author}</span>
            )}
          </div>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View "${item.title}" on Steam`}
          className="shrink-0 flex items-center gap-1 text-[11px] text-text-secondary/60 hover:text-gold-primary transition-colors mt-0.5"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Steam</span>
        </a>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <pre className="whitespace-pre-wrap font-sans text-sm text-text-secondary/90 leading-relaxed break-words">
          {preview}
        </pre>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-gold-primary/70 hover:text-gold-primary transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                Read more
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

export default function PatchNotesClient() {
  const [items, setItems] = useState<SteamNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/patch-notes")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load patch notes.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Newspaper className="w-6 h-6 text-gold-primary shrink-0" aria-hidden="true" />
          <div>
            <h1 className="font-cinzel font-bold text-2xl text-gold-primary">
              <ShimmerText>Patch Notes</ShimmerText>
            </h1>
            <p className="text-xs text-text-secondary/60 mt-0.5">
              Official Ironmace announcements via Steam
            </p>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-bg-secondary border border-border-subtle rounded-sm h-40 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-sm px-5 py-4 text-sm text-accent-red">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-text-secondary/60 text-center py-16">
            No patch notes found.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, i) => (
              <PatchNoteCard key={item.gid} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
