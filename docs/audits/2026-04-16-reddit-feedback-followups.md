# Reddit Launch Feedback — Human Action Items

Follow-ups from the 2026-04-16 Reddit launch thread after the agent-run work shipped. Everything below requires **you** — either because it needs game knowledge, dashboard access, or judgment calls an agent can't make.

---

## 1. Apply the corrections-schema migration in Supabase

**Why this is blocking:** `POST /api/corrections` will return 500 until the `corrections` table exists. The report-inaccuracy modal is wired but non-functional without this.

**Steps:**

1. Open the Supabase dashboard for this project.
2. Navigate to **SQL Editor** → **New query**.
3. Open `src/lib/corrections-schema.sql` locally and copy the entire file contents.
4. Paste into the SQL editor and run.
5. Verify success:
   - **Table Editor** → confirm `corrections` table exists with all columns.
   - **Authentication** → **Policies** → confirm two policies on `corrections`:
     - `Users can submit corrections` (INSERT)
     - `Users can view their own corrections` (SELECT)
   - Confirm RLS is **enabled** (toggle should be green).
6. Smoke test: once the modal is wired into a page, submit a test correction while logged in, then check the table has the row.

**Rollback if needed:**
```sql
drop table if exists corrections;
```

---

## 2. Resolve duplicate boss entries in map-data.ts

**The question:** Are these intentional (same mob spawns in two dungeons) or a data bug?

| Boss | Appears In | Feature IDs |
|------|------------|-------------|
| Skeleton Warlord | Ruins + Crypts | `ru_boss1`, `cr_boss1` |
| Ghost King | Crypts + Inferno | `cr_boss2`, `if_boss4` |

**Steps:**

1. Hop in-game and confirm which dungeons each boss actually spawns in.
2. If intentional, no code change needed — but consider adding a short comment on each duplicate entry so the next person auditing doesn't flag it again.
3. If it's a bug, delete the incorrect entry from `src/lib/map-data.ts` (or replace with the correct boss for that slot).

---

## 3. Fact-check shrine + campfire coordinates against live game

**Scope:** 15 campfire markers, 36 shrine markers. All hand-authored percentage coordinates in `src/lib/map-data.ts`. scaremenow specifically flagged shrines as "not well placed" and implied campfire icons shouldn't exist everywhere they do.

**Recommended workflow:**

1. Spin the dev server (`npm run dev`), open `/maps`, and put it on a second monitor.
2. Run dungeons one at a time with the map page open next to you.
3. For each map, focus on one feature type at a time — don't try to verify shrines + campfires + treasures in one pass, you'll lose track.
4. Use the correction modal once task #8 wires it up — you can log corrections to yourself as you go, then fix them in a batch.
5. Confirm with the community whether campfires actually exist as fixed world landmarks in DaD or whether those markers are spurious. If spurious, delete all 15 `*_cf*` entries.

**Maps to check, in priority order (by feature density and player traffic):**

- Ruins — 4 shrines, 2 campfires
- Crypts — 4 shrines, 2 campfires
- Goblin Cave — 4 shrines, 2 campfires
- Inferno — 4 shrines, 2 campfires
- Frost Mountain — 4 shrines, 2 campfires
- Ice Abyss — 3 shrines, 1 campfire
- Ship Graveyard — 3 shrines, 2 campfires
- Firedeep — 3 shrines, 2 campfires

---

## 4. Module visuals (Graveyard, Keep, Stables, Ruins default)

**The finding:** scaremenow said module visuals are outdated — but the codebase doesn't have module-level rendering. Maps are single background images. "Module" only appears as text inside treasure-marker descriptions.

**Decision you need to make:**

- **Option A — Skip:** Acknowledge that fixing this requires building module-level rendering (a significant feature), and deprioritize behind corrections pipeline + quest-drop v2.
- **Option B — Scope a v2:** Module polygons overlaid on each map, with per-module art/layouts. Big project; probably 2–3 weeks solo.

No action needed now — just know this is what scaremenow was asking for and decide when to revisit.

---

## 5. Low-priority flagged items (revisit later)

These came out of the Reddit thread but aren't actionable yet:

- **Market search autofill** (scaremenow) — nice-to-have, not urgent.
- **Gear score / Armory utility** (scaremenow) — currently unclear value; revisit once more players use the site.
- **Possible "Realms" removal downstream cleanup** — if any analytics or saved links point to the deleted `/realm` route, they'll now 404. Consider a redirect if you can see referral traffic to it.

---

## Tracking

Tasks #2, #3, #8, #9 in the current task list correspond to this file. Mark them complete as you clear each section.
