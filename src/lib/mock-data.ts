import { LeaderboardEntry, PlayerProfile, Achievement, MatchResult, ActivityEvent } from "./types";
import { getAvatarUrl } from "./utils";

const fantasyNames = [
  "Shadowmere", "Ironveil", "Thornwick", "Ashenvale", "Drakemoor",
  "Grimhollow", "Nightshade", "Stormforge", "Ebonhart", "Frostweaver",
  "Blazecrown", "Wolfsbane", "Ravencrest", "Duskwalker", "Moonfire",
  "Steelwind", "Emberstrike", "Silverthorn", "Bloodraven", "Goldheart",
  "Voidbringer", "Starfall", "Runeblade", "Crystalvein", "Darkholme",
  "Flamewarden", "Icethorn", "Shadowpine", "Stormrider", "Thunderclap",
  "Greymantle", "Bonechill", "Wyrmslayer", "Soulkeeper", "Dawnbreaker",
  "Nethervoid", "Ironbark", "Ashwalker", "Frostfang", "Emberglow",
  "Vipersting", "Oakheart", "Mistweaver", "Sunforge", "Nightbloom",
  "Stoneguard", "Hexblade", "Crowfeather", "Dreadmaw", "Lightveil",
];

const titles = [
  "Grand Champion", "Warlord", "Shadowlord", "Archmage", "Dragonslayer",
  "Vanguard", "Sentinel", "Berserker", "Paladin", "Assassin",
  "Conqueror", "Gladiator", "Duelist", "Sorcerer", "Knight Commander",
  "Adventurer", "Veteran", "Initiate", "Challenger", "Elite",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  date.setHours(randomInt(0, 23), randomInt(0, 59));
  return date.toISOString();
}

// Generate stable mock data using seeded approach
let seed = 42;
function seededRandom(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function seededInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min;
}

export function generateLeaderboardData(gameSlug: string = "all"): LeaderboardEntry[] {
  seed = 42; // Reset seed for consistency
  const entries: LeaderboardEntry[] = fantasyNames.map((name, index) => {
    const totalScore = seededInt(1000, 50000);
    const gamesPlayed = seededInt(10, 500);
    const winRate = seededInt(20, 95);
    const trends: ("up" | "down" | "stable")[] = ["up", "down", "stable"];

    return {
      player_id: `player-${index + 1}`,
      username: name,
      avatar_url: getAvatarUrl(name),
      title: titles[index % titles.length],
      game_slug: gameSlug,
      total_score: totalScore,
      games_played: gamesPlayed,
      best_score: seededInt(totalScore * 0.1, totalScore * 0.5),
      last_active: randomDate(30),
      rank: 0,
      win_rate: winRate,
      trend: trends[seededInt(0, 2)],
    };
  });

  // Sort by total score descending and assign ranks
  entries.sort((a, b) => b.total_score - a.total_score);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

export function getTopChampions(): LeaderboardEntry[] {
  return generateLeaderboardData().slice(0, 3);
}

export function getPlayerProfile(id: string): PlayerProfile | null {
  const index = parseInt(id.replace("player-", "")) - 1;
  if (index < 0 || index >= fantasyNames.length) return null;

  seed = 42 + index;
  return {
    id,
    username: fantasyNames[index],
    avatar_url: getAvatarUrl(fantasyNames[index]),
    title: titles[index % titles.length],
    created_at: randomDate(365),
    total_score: seededInt(5000, 50000),
    games_played: seededInt(50, 500),
    win_rate: seededInt(30, 90),
    best_rank: seededInt(1, 20),
    current_streak: seededInt(0, 15),
    avg_score: seededInt(100, 1000),
  };
}

export function getPlayerAchievements(): Achievement[] {
  return [
    { id: "1", name: "First Blood", description: "Win your first match", icon: "sword", earned: true, earned_at: randomDate(200) },
    { id: "2", name: "Century", description: "Play 100 matches", icon: "shield", earned: true, earned_at: randomDate(150) },
    { id: "3", name: "Untouchable", description: "Win 10 matches in a row", icon: "crown", earned: true, earned_at: randomDate(100) },
    { id: "4", name: "Dragonslayer", description: "Defeat the final boss", icon: "flame", earned: true, earned_at: randomDate(80) },
    { id: "5", name: "Speed Demon", description: "Complete a speed trial under 2 minutes", icon: "zap", earned: false },
    { id: "6", name: "Perfectionist", description: "Achieve a perfect score", icon: "star", earned: false },
    { id: "7", name: "Veteran", description: "Play 500 matches", icon: "medal", earned: false },
    { id: "8", name: "Legend", description: "Reach rank #1", icon: "trophy", earned: false },
  ];
}

export function getPlayerMatches(): MatchResult[] {
  const opponents = fantasyNames.slice(0, 15);
  return Array.from({ length: 15 }, (_, i) => ({
    id: `match-${i + 1}`,
    game_name: ["Arena PvP", "Dungeon Runs", "Speed Trials"][i % 3],
    result: (Math.random() > 0.4 ? "win" : "loss") as "win" | "loss",
    score: randomInt(500, 5000),
    opponent: opponents[i % opponents.length],
    date: randomDate(30),
  }));
}

export function getRankHistory(): { date: string; rank: number }[] {
  const data: { date: string; rank: number }[] = [];
  let rank = randomInt(20, 40);
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    rank = Math.max(1, Math.min(50, rank + randomInt(-3, 2)));
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rank,
    });
  }
  return data;
}

export function getActivityFeed(): ActivityEvent[] {
  return [
    { id: "1", player: "Shadowmere", action: "claimed rank", value: "#1", timestamp: randomDate(0) },
    { id: "2", player: "Ironveil", action: "scored", value: "12,500 pts", timestamp: randomDate(0) },
    { id: "3", player: "Thornwick", action: "won 5 matches in a row", timestamp: randomDate(0) },
    { id: "4", player: "Ashenvale", action: "claimed rank", value: "#4", timestamp: randomDate(1) },
    { id: "5", player: "Drakemoor", action: "scored", value: "9,800 pts", timestamp: randomDate(1) },
    { id: "6", player: "Grimhollow", action: "earned achievement", value: "Dragonslayer", timestamp: randomDate(1) },
    { id: "7", player: "Nightshade", action: "claimed rank", value: "#7", timestamp: randomDate(2) },
    { id: "8", player: "Stormforge", action: "scored", value: "15,200 pts", timestamp: randomDate(2) },
  ];
}
