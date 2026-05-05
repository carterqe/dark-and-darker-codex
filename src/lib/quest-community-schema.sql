-- Quest completions: tracks which quests each user has marked complete.
-- quest_id matches the string IDs in src/lib/quest-data.ts (e.g. "alchemist_1").

create table if not exists quest_completions (
  user_id      uuid references auth.users(id) on delete cascade not null,
  quest_id     text not null check (char_length(quest_id) <= 60),
  completed_at timestamptz default now(),
  primary key (user_id, quest_id)
);

alter table quest_completions enable row level security;

create policy "Users can view their own completions"
  on quest_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own completions"
  on quest_completions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own completions"
  on quest_completions for delete
  using (auth.uid() = user_id);

create index if not exists quest_completions_user_idx on quest_completions (user_id);

-- ─────────────────────────────────────────────────────────────────────────────

-- Quest tips: community-submitted tips per quest.
-- tip_type values: general | farming | strategy | warning

create table if not exists quest_tips (
  id            uuid primary key default gen_random_uuid(),
  quest_id      text not null check (char_length(quest_id) <= 60),
  user_id       uuid references auth.users(id) on delete cascade not null,
  content       text not null check (char_length(content) between 10 and 500),
  tip_type      text not null default 'general'
                  check (tip_type in ('general', 'farming', 'strategy', 'warning')),
  helpful_count integer not null default 0,
  created_at    timestamptz default now()
);

alter table quest_tips enable row level security;

create policy "Tips are viewable by everyone"
  on quest_tips for select using (true);

create policy "Authenticated users can insert tips"
  on quest_tips for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own tips"
  on quest_tips for delete
  using (auth.uid() = user_id);

create index if not exists quest_tips_quest_id_idx on quest_tips (quest_id);
create index if not exists quest_tips_helpful_idx  on quest_tips (quest_id, helpful_count desc, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────

-- Quest tip votes: one vote per user per tip.

create table if not exists quest_tip_votes (
  tip_id  uuid references quest_tips(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  primary key (tip_id, user_id)
);

alter table quest_tip_votes enable row level security;

create policy "Tip votes are viewable by everyone"
  on quest_tip_votes for select using (true);

create policy "Authenticated users can vote on tips"
  on quest_tip_votes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own tip vote"
  on quest_tip_votes for delete
  using (auth.uid() = user_id);

-- Trigger: keep quest_tips.helpful_count in sync with vote count.

create or replace function sync_quest_tip_helpful_count()
returns trigger as $$
begin
  update quest_tips
  set helpful_count = (
    select count(*) from quest_tip_votes
    where tip_id = coalesce(new.tip_id, old.tip_id)
  )
  where id = coalesce(new.tip_id, old.tip_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists on_tip_vote_change on quest_tip_votes;
create trigger on_tip_vote_change
  after insert or delete on quest_tip_votes
  for each row execute function sync_quest_tip_helpful_count();
