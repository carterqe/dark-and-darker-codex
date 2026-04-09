"use client";

import { Search } from "lucide-react";

interface PlayerSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PlayerSearch({ value, onChange }: PlayerSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
      <input
        type="text"
        placeholder="Search all players..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-bg-secondary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 focus:shadow-[0_0_10px_rgba(201,168,76,0.1)] transition-all"
      />
    </div>
  );
}
