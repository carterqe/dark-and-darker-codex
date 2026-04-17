# Application Audit — 2026-04-16

Full-app audit of the Dark and Darker Codex (Next.js 16 / React 19 / Supabase) covering API routes, client pages, shared libs, and build health.

Typecheck: clean (`tsc --noEmit` exit 0).
Lint: **20 errors, 11 warnings** (React 19 / Next 16 stricter rules).

---

## Security / correctness

### 1. Open-redirect in `/api/auth/callback/route.ts:14`
`${origin}${next}` is unvalidated. `?next=//evil.com` or `?next=/\evil.com` can redirect users off-site after email confirmation.

**Fix:** require `next` to start with `/` and reject `//` / `/\`.

### 2. Signup TOCTOU in `AuthModal.tsx:64–74`
Client runs `select username` then `supabase.auth.signUp`. Two concurrent signups with the same username can both pass the check; one ends up with an orphaned `auth.users` row and an "Account created but profile setup failed" error. The server endpoint returns 409 correctly, but the race still creates an unusable auth account.

**Fix:** drop the pre-check (let the server 409 be the only source of truth) or handle 409 by deleting / signing out the user.

### 3. `/api/characters/[id]/route.ts` and `/api/items/[id]/route.ts` — no timeout / no error handling
No `AbortSignal.timeout`, no `res.ok` check, no try/catch. Upstream hang → route hangs. Upstream 500 → error body returned as 200.

### 4. Pass-through cache poisoning
`/api/leaderboard`, `/api/population`, `/api/characters` (non-ranked), `/api/items` (non-fetchAll), `/api/market` (non-fetchAll) all set `Cache-Control: public, s-maxage=…` without checking `res.ok`. A single upstream 5xx gets CDN-cached for the full TTL (30s–1h).

**Fix:** `if (!res.ok) throw` before setting the cache header.

---

## Reliability / UX

### 5. `/api/characters` ranked mode — unvalidated pagination
`parseInt(limit)` / `parseInt(page)` with no clamp: `NaN`, negative, or huge values are accepted.

### 6. Title length mismatch
- Create form: `maxLength={80}` (`create-client.tsx:216`)
- API: validates `<= 100` (`builds/route.ts`)
- DB constraint: `<= 100`

Tighten one or unify on 100.

### 7. Vote toggle has no error rollback
`build-detail-client.tsx:105–119` — optimistic state update with no revert if the Supabase call fails. UI shows voted; DB doesn't.

---

## Dead code (safe to delete)

Legacy from a pre-DarkerDB version of the app, referenced by nothing routed:

- `src/lib/types.ts`
- `src/lib/mock-data.ts`
- `src/lib/seed.sql`
- `src/components/player/*` (5 files: `AchievementGrid`, `ProfileHeader`, `RecentMatches`, `StatsGrid`, plus whatever imports from `@/lib/types`)
- `src/components/home/ActivityFeed.tsx`

---

## Lint errors (React 19 / Next 16 stricter rules)

### 8. `react-hooks/set-state-in-effect` — 8 occurrences
Calling `setState` synchronously inside `useEffect` triggers cascading renders.

- `builds-client.tsx:36`
- `armory-client.tsx:71, 95`
- `ItemSearchDropdown.tsx:79, 116`
- `ItemModal.tsx:69`
- `AuthModal.tsx:25`
- `useLeaderboard.ts:20, 33`

Most are spurious loading-flag patterns that can be removed or lifted into event handlers.

### 9. `react-hooks/error-boundaries`
`player/[id]/page.tsx:28–37` and `armory/[id]/page.tsx:24–32` construct JSX inside try/catch. React doesn't immediately render components, so errors from these components aren't caught.

**Fix:** move the fetch + null-check outside try/catch; only render JSX once data is known good.

### 10. `react-hooks/refs-during-render`
- `CharacterStatPanel.tsx:278–279` — real bug, accessing refs during render.
- `market-client.tsx:187` — our recent ref-to-break-useEffect-cycle; the pattern works but the rule still flags it. Safer to refactor.

### 11. `@next/next/no-img-element` warnings
- `PerkSkillSelector.tsx`
- `SpellSelector.tsx`
- `ProfileHeader.tsx` (dead code)

---

## Suggested fix order

1. **#1** — one-liner, real security impact
2. **#2** — broken signup UX
3. **#3 + #4** — resilience, low effort
4. **#8–#11** — lint errors (React 19 surfaced them for a reason)
5. **#5–#7** — reliability polish
6. **Dead code cleanup** — bundle size / maintenance
