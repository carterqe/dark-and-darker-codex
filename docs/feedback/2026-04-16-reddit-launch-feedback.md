# Reddit Launch Feedback — 2026-04-16

**Source:** [r/DarkAndDarker — Dark and Darker Codex announcement](https://www.reddit.com/r/DarkAndDarker/comments/1snmwis/dark_and_darker_codex_a_new_site_for_dad_players/)
**Stats:** 4.3K views, 38 upvotes / 21 downvotes, ~8 distinct commenters
**Raw transcript:** [`raw-feedback.md`](./raw-feedback.md)

---

## Overall sentiment

Mixed-positive. Concept lands well ("killer stuff", "really clean", "so promising") but execution has obvious rough edges — the site is clearly early and people can see it. Downvote ratio (21/38) suggests some Reddit users soured on the launch, likely tied to the bugs encountered on first visit.

---

## Bug reports

### Market page (highest volume — 3 commenters)
- **Market stuck loading** on first visit (Myels_Magus) — OP fixed this mid-thread.
- **Gear slot dropdown returns zero results** for valid slots like Boots even though matching items are visible in the all-items listing. OP diagnosed: archetype filter was being sent as the slot label ("Boots") instead of matching against the full item names ("Padded Leather Boots", "Rogue Boots"). Fixed during thread.
- **Dropdown filters still broken in general** after the boots fix (Myels_Magus, second follow-up): "still really having a hard time with all the drop down menu filters. Might have to go through all of them and fix it up."
- **"This shit is so buggy"** (theflossboss1) — downvoted (-2) but a real signal about first-impression quality.

### Maps page (scaremenow, detailed)
- **Shrines are not well placed.**
- **Lava Golem is placed in Goblin Caves**, should be in Firedeep.
- **Bosses are not in their correct modules.**
- **Modules don't match current visuals**: Graveyard, Keep, Stables, and the default Ruins layout.
- **Campfire icon** — reader questioned why it exists as a marker type.

---

## Feature requests

### High-interest
- **DPS / damage-per-hit calculator** (BronzeEagle88) — build a loadout, see damage breakdown. Wiki has the formulas. Include a "sudo enemy" mode to test against, e.g., 40% PDR targets.
- **Monster drop pools, especially for quest items** (Jeicam_, scaremenow) — quest item → which mob drops it → "show on map" button to highlight where that mob spawns. scaremenow gave concrete examples: Broken Skull → Skeleton (any map); Bellows → Wraiths in specific modules.
- **Boss stats + summary pages** (Jeicam_).
- **Module-based maps instead of whole-map view** (Jeicam_) — maps flip between random and fixed, so listing modules is more durable. Add player spawn spots.
- **Community submission / correction workflow** (Total-Brick-1136, scaremenow implicit) — user-submitted info over datamined where possible. Devs flip between active/inactive changes, so a submission pipeline keeps data fresh.
- **Market search autofill** (scaremenow).

### Lower-interest / contextual
- **tarkov.dev as reference** (Jeicam_) — explicit "for inspiration" pointer.
- **OSRS-style live market reference** (Total-Brick-1136) — framing, not a new feature: this is the niche to own.

### Features questioned
- **Realm page** (scaremenow) — "I don't see a real need/use for the Realms information about the market (what's put for sale, what's bought) especially since we can't preview the stats on equipment."
- **Gear score labeling** (scaremenow) — "I don't see the use of marking the gear score (or the Armory) of items at the moment, but it could be useful in the future."

---

## Data accuracy concerns

Three commenters independently raised accuracy as the dominant concern over features:

- **scaremenow:** "Is the information on the page Datamined? I would rather it be user-submitted, through experience."
- **Total-Brick-1136:** "the main focus should be around accuracy with reference info such as the interactive maps as they seem slightly outdated... if the accuracy of the site is treated as the priority and the flair comes second, you'll see a lot more interaction with the site."
- **Myels_Magus (implicit):** multiple market filter bugs read as correctness failures, not just UX issues.

---

## Positive signals

- Myels_Magus: "Oh wow! This is really great! Makes me wish we had an active wiki team again. But this is going to be a great tool."
- misa222: "this looks so promising. Thank you so much!"
- Total-Brick-1136: "Absolutely killer stuff my guy, really clean website and I can see the potential... hold that line champion."
- BronzeEagle88: "good work keep working on it man take your time so you dont get burned out"

---

## Context: the wiki vacuum

The wiki team has largely quit (Myels_Magus). The community doesn't have a maintained reference right now. This is both an opportunity and a warning: people *want* a replacement, but they'll judge harshly if the replacement isn't accurate.

---

## Recommended priorities

Based on volume, severity, and strategic position:

### Immediate (fix before next push)
1. **Audit every market filter dropdown.** Same bug class as the boots fix likely affects rarity, stat, slot — Myels_Magus said so explicitly. One comprehensive pass, not whack-a-mole.
2. **Maps accuracy pass.** scaremenow gave a specific punch-list: Lava Golem → Firedeep, shrine positions, boss modules, Graveyard / Keep / Stables / default Ruins modules. These are named errors — fix them.

### Near-term (next 1–2 weeks)
3. **Community correction pipeline.** Even a minimal version — a "report inaccuracy" button on maps/items that posts to a moderation queue — would directly address the #1 strategic concern (accuracy/trust) and the datamined-vs-community-submitted tension. This is higher-leverage than any single feature.
4. **Market search autofill.** Small, high-visibility UX win.

### Medium-term
5. **DPS calculator tied to the build system.** Single highest-value feature request, fits naturally into the existing build pages, uses wiki-published formulas. Defensible moat vs. a plain wiki.
6. **Quest-item → mob → map linkage.** Two people asked for this (Jeicam_, scaremenow). Ties quest data, mob data, and maps into one flow — which also forces the maps data to be accurate.

### Reconsider
7. **Realm page scope.** scaremenow explicitly doesn't see the value, especially without equipment stat previews. Either invest in making it useful (stat previews on listings) or deprioritize.
8. **Module-based maps.** Jeicam_'s suggestion to list modules instead of static whole-map layouts is worth taking seriously — it avoids the exact accuracy problem scaremenow flagged (positions being wrong when the game flips between fixed and random).

### Lower priority
9. Boss stats pages (Jeicam_).
10. Gear score UI — defer until a real use case emerges (scaremenow's instinct was right: not useful today).

---

## Critical framing for the roadmap

The signal across these 8 commenters is consistent: **accuracy is the moat, not features.** The DaD community has been burned by a dying wiki and they're evaluating this site through that lens. A site with fewer features but correct data beats a feature-rich site with outdated positions and broken filters. Any roadmap decision should be weighed against that — if a new feature requires data you can't keep current, it's a liability.

The second-order insight: a community correction pipeline is load-bearing. Without one, accuracy degrades the moment the game patches. With one, the site becomes self-reinforcing and the community starts doing the maintenance for you. This is what the old wiki had and lost. If the goal is to own the niche long-term, this is the feature that matters most.
