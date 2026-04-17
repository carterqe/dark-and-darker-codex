-- ============================================================
-- Dark and Darker Codex — Corrections (community reports) Schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================
--
-- Purpose: let signed-in users report inaccuracies in map, quest,
-- item (etc.) data so the maintainer can review & fix them.
--
-- Conventions mirror builds-schema.sql: gen_random_uuid primary key,
-- timestamptz created_at default now(), RLS enabled, explicit
-- per-role policies, and defense-in-depth length constraints.
-- ============================================================

create table if not exists corrections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete cascade not null,
  target_type text not null check (
    target_type in ('map', 'quest', 'item', 'boss', 'shrine', 'campfire', 'other')
  ),
  target_id text not null,
  field text not null,
  current_value text,
  suggested_value text not null,
  reason text,
  status text default 'pending' not null check (
    status in ('pending', 'accepted', 'rejected')
  )
);

alter table corrections enable row level security;

-- Authed users can INSERT their own row
create policy "Users can submit corrections"
  on corrections for insert with check (auth.uid() = user_id);

-- Users can SELECT only their own rows.
-- (Service role bypasses RLS automatically, so maintainer tooling
-- using the service role key reads everything without a policy.)
create policy "Users can view their own corrections"
  on corrections for select using (auth.uid() = user_id);

-- No UPDATE / DELETE policies = clients cannot mutate or remove.
-- Status transitions (pending -> accepted/rejected) happen via the
-- service role only.

-- ============================================================
-- Length constraints (defense-in-depth)
-- ============================================================

alter table corrections add constraint corrections_target_id_length
  check (char_length(target_id) <= 100);
alter table corrections add constraint corrections_field_length
  check (char_length(field) <= 60);
alter table corrections add constraint corrections_current_value_length
  check (current_value is null or char_length(current_value) <= 2000);
alter table corrections add constraint corrections_suggested_value_length
  check (char_length(suggested_value) between 1 and 2000);
alter table corrections add constraint corrections_reason_length
  check (reason is null or char_length(reason) <= 1000);

-- Helpful index for the maintainer's review queue
create index if not exists corrections_status_created_at_idx
  on corrections (status, created_at desc);
