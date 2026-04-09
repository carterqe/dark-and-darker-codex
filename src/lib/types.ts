export interface Player {
  id: string;
  username: string;
  avatar_url: string;
  title: string;
  created_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
}

export interface Score {
  id: string;
  player_id: string;
  game_id: string;
  score: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface LeaderboardEntry {
  player_id: string;
  username: string;
  avatar_url: string;
  title: string;
  game_slug: string;
  total_score: number;
  games_played: number;
  best_score: number;
  last_active: string;
  rank: number;
  win_rate?: number;
  trend?: "up" | "down" | "stable";
}

export interface PlayerProfile extends Player {
  total_score: number;
  games_played: number;
  win_rate: number;
  best_rank: number;
  current_streak: number;
  avg_score: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
}

export interface MatchResult {
  id: string;
  game_name: string;
  result: "win" | "loss";
  score: number;
  opponent?: string;
  date: string;
}

export interface ActivityEvent {
  id: string;
  player: string;
  action: string;
  value?: string;
  timestamp: string;
}

export type GameCategory = "all" | "arena-pvp" | "dungeon-runs" | "speed-trials";
