-- ============================================================
-- Dark and Darker Codex — Builds System Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- Profiles table (linked to Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

-- Builds table
create table if not exists builds (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  class text not null,
  tags text[] default '{}',
  equipment jsonb default '{}',
  perks text[] default '{}',
  skills text[] default '{}',
  spells text[] default '{}',
  vote_count integer default 0,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table builds enable row level security;

create policy "Public builds are viewable by everyone"
  on builds for select using (is_public = true);

create policy "Users can create builds"
  on builds for insert with check (auth.uid() = author_id);

create policy "Users can update their own builds"
  on builds for update using (auth.uid() = author_id);

create policy "Users can delete their own builds"
  on builds for delete using (auth.uid() = author_id);

-- Build votes (upvote only — row presence = upvoted)
create table if not exists build_votes (
  build_id uuid references builds(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (build_id, user_id)
);

alter table build_votes enable row level security;

create policy "Votes are viewable by everyone"
  on build_votes for select using (true);

create policy "Authenticated users can vote"
  on build_votes for insert with check (auth.uid() = user_id);

create policy "Users can remove their own vote"
  on build_votes for delete using (auth.uid() = user_id);

-- Build comments
create table if not exists build_comments (
  id uuid primary key default gen_random_uuid(),
  build_id uuid references builds(id) on delete cascade not null,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table build_comments enable row level security;

create policy "Comments are viewable by everyone"
  on build_comments for select using (true);

create policy "Authenticated users can comment"
  on build_comments for insert with check (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on build_comments for delete using (auth.uid() = author_id);

-- Trigger: sync vote_count on builds whenever a vote is added/removed
create or replace function sync_build_vote_count()
returns trigger as $$
begin
  update builds
  set vote_count = (
    select count(*) from build_votes
    where build_id = coalesce(new.build_id, old.build_id)
  )
  where id = coalesce(new.build_id, old.build_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists on_vote_change on build_votes;
create trigger on_vote_change
  after insert or delete on build_votes
  for each row execute function sync_build_vote_count();

-- Trigger: auto-update updated_at on builds
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists builds_updated_at on builds;
create trigger builds_updated_at
  before update on builds
  for each row execute function set_updated_at();

-- Profile creation is handled in application code (AuthModal.tsx)
-- after successful signup, rather than via a database trigger.

-- ============================================================
-- Migration: Add spells column (run if table already exists)
-- ============================================================
-- alter table builds add column if not exists spells text[] default '{}';

-- ============================================================
-- Length constraints (defense-in-depth)
-- ============================================================

-- Builds
alter table builds add constraint builds_title_length check (char_length(title) <= 100);
alter table builds add constraint builds_description_length check (char_length(description) <= 2000);
alter table builds add constraint builds_class_length check (char_length(class) <= 20);
alter table builds add constraint builds_tags_size check (array_length(tags, 1) is null or array_length(tags, 1) <= 5);
alter table builds add constraint builds_perks_size check (array_length(perks, 1) is null or array_length(perks, 1) <= 4);
alter table builds add constraint builds_skills_size check (array_length(skills, 1) is null or array_length(skills, 1) <= 4);
alter table builds add constraint builds_spells_size check (array_length(spells, 1) is null or array_length(spells, 1) <= 20);

-- Comments
alter table build_comments add constraint comments_content_length check (char_length(content) <= 500);

-- Profiles
alter table profiles add constraint profiles_username_length check (char_length(username) between 3 and 20);
