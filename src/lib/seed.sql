-- ============================================
-- Dark and Darker Codex — Database Schema & Seed Data
-- ============================================

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  title TEXT DEFAULT 'Adventurer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Games / categories
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT
);

-- Scores
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  game_id UUID REFERENCES games(id),
  score INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id as player_id,
  p.username,
  p.avatar_url,
  p.title,
  g.slug as game_slug,
  SUM(s.score) as total_score,
  COUNT(s.id) as games_played,
  MAX(s.score) as best_score,
  MAX(s.created_at) as last_active,
  RANK() OVER (PARTITION BY g.slug ORDER BY SUM(s.score) DESC) as rank
FROM scores s
JOIN players p ON s.player_id = p.id
JOIN games g ON s.game_id = g.id
GROUP BY p.id, p.username, p.avatar_url, p.title, g.slug;

-- ============================================
-- Seed Games
-- ============================================
INSERT INTO games (name, slug) VALUES
  ('Arena PvP', 'arena-pvp'),
  ('Dungeon Runs', 'dungeon-runs'),
  ('Speed Trials', 'speed-trials')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Players (50 fantasy-themed names)
-- ============================================
INSERT INTO players (username, avatar_url, title) VALUES
  ('Shadowmere', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shadowmere', 'Grand Champion'),
  ('Ironveil', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ironveil', 'Warlord'),
  ('Thornwick', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Thornwick', 'Shadowlord'),
  ('Ashenvale', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ashenvale', 'Archmage'),
  ('Drakemoor', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Drakemoor', 'Dragonslayer'),
  ('Grimhollow', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Grimhollow', 'Vanguard'),
  ('Nightshade', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nightshade', 'Sentinel'),
  ('Stormforge', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Stormforge', 'Berserker'),
  ('Ebonhart', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ebonhart', 'Paladin'),
  ('Frostweaver', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Frostweaver', 'Assassin'),
  ('Blazecrown', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Blazecrown', 'Conqueror'),
  ('Wolfsbane', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Wolfsbane', 'Gladiator'),
  ('Ravencrest', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ravencrest', 'Duelist'),
  ('Duskwalker', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Duskwalker', 'Sorcerer'),
  ('Moonfire', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Moonfire', 'Knight Commander'),
  ('Steelwind', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Steelwind', 'Adventurer'),
  ('Emberstrike', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emberstrike', 'Veteran'),
  ('Silverthorn', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Silverthorn', 'Initiate'),
  ('Bloodraven', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bloodraven', 'Challenger'),
  ('Goldheart', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Goldheart', 'Elite'),
  ('Voidbringer', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Voidbringer', 'Grand Champion'),
  ('Starfall', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Starfall', 'Warlord'),
  ('Runeblade', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Runeblade', 'Shadowlord'),
  ('Crystalvein', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Crystalvein', 'Archmage'),
  ('Darkholme', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Darkholme', 'Dragonslayer'),
  ('Flamewarden', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Flamewarden', 'Vanguard'),
  ('Icethorn', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Icethorn', 'Sentinel'),
  ('Shadowpine', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shadowpine', 'Berserker'),
  ('Stormrider', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Stormrider', 'Paladin'),
  ('Thunderclap', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Thunderclap', 'Assassin'),
  ('Greymantle', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Greymantle', 'Conqueror'),
  ('Bonechill', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bonechill', 'Gladiator'),
  ('Wyrmslayer', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Wyrmslayer', 'Duelist'),
  ('Soulkeeper', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Soulkeeper', 'Sorcerer'),
  ('Dawnbreaker', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dawnbreaker', 'Knight Commander'),
  ('Nethervoid', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nethervoid', 'Adventurer'),
  ('Ironbark', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ironbark', 'Veteran'),
  ('Ashwalker', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ashwalker', 'Initiate'),
  ('Frostfang', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Frostfang', 'Challenger'),
  ('Emberglow', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emberglow', 'Elite'),
  ('Vipersting', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vipersting', 'Grand Champion'),
  ('Oakheart', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oakheart', 'Warlord'),
  ('Mistweaver', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mistweaver', 'Shadowlord'),
  ('Sunforge', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sunforge', 'Archmage'),
  ('Nightbloom', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nightbloom', 'Dragonslayer'),
  ('Stoneguard', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Stoneguard', 'Vanguard'),
  ('Hexblade', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hexblade', 'Sentinel'),
  ('Crowfeather', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Crowfeather', 'Berserker'),
  ('Dreadmaw', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dreadmaw', 'Paladin'),
  ('Lightveil', 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lightveil', 'Assassin')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- Seed Scores (multiple scores per player across games)
-- Uses generate_series for bulk insert
-- ============================================
DO $$
DECLARE
  player_rec RECORD;
  game_rec RECORD;
  i INTEGER;
  score_val INTEGER;
BEGIN
  FOR player_rec IN SELECT id FROM players LOOP
    FOR game_rec IN SELECT id FROM games LOOP
      -- Each player gets 3-10 scores per game
      FOR i IN 1..floor(random() * 8 + 3)::int LOOP
        score_val := floor(random() * 5000 + 500)::int;
        INSERT INTO scores (player_id, game_id, score, created_at)
        VALUES (
          player_rec.id,
          game_rec.id,
          score_val,
          now() - (random() * 30 || ' days')::interval
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
