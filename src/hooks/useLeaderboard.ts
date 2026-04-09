"use client";

import { useState, useEffect, useRef } from "react";
import {
  LeaderboardPlayer,
  LeaderboardCategory,
  fetchLeaderboard,
} from "@/lib/darkerdb";

export function useLeaderboard(category: LeaderboardCategory = "EA7_HR") {
  const [entries, setEntries] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LeaderboardPlayer[] | null>(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Load 250 entries from the leaderboard
  useEffect(() => {
    setLoading(true);
    setSearchQuery("");
    setSearchResults(null);

    fetchLeaderboard({ category, limit: 250 })
      .then((res) => setEntries(res.body || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  // Search: uses our server-side search endpoint which indexes all ranks
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setSearching(true);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.body || []);
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const displayEntries = (searchResults !== null ? searchResults : entries).slice(0, 250);

  return {
    entries: displayEntries,
    loading,
    searching,
    searchQuery,
    setSearchQuery,
  };
}
