# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- None — **P2 DONE**, Q5 ready for review. Polish round + Default avatar library archived, ready for Q5.

---

## TODO — Profile + QuestionDetails Cards (2026-09-08)

- [ ] **Q5. [Feature] Rebuild QuestionDetails question card to match question-details-card.png (narrow, header-first, framed image, light tags, footer vote)** — Supersedes earlier vague "move AuthorBlock to top" / "redesign image" — build to this reference specifically. Reference is narrow/mobile capture; extend same language to desktop keeping `w-[84px]` vertical rail on desktop (`hidden sm:flex` reasonable per brief) — flag choice. Header inside `motion.article` `border-b` with `AuthorBlock` wired via props `email/role/isVerified` (+ `time={q.createdAt}` for full `Sep 3, 2026 at 08:27 PM` via `AuthorBlock` second line `role · date`, not `credential`/`timeAgo` short; plain role `Student` not badge), `…` placeholder (`Ellipsis` non-functional, or trivially wire `handleShare` `QuestionDetail.jsx:194` clipboard). Image in contained framed `rounded-2xl border-slate-200 bg-white p-1.5 shadow-sm` with inner `img rounded-xl object-contain max-h-[320-560] w-full` (not full-bleed). Tags light `bg-slate-100 text-slate-700 ring-1 ring-slate-200` (not `bg-slate-900` dark). Footer `border-t` with vote pill `border-slate-200 rounded-full bg-slate-50` (`arrow h-7 w-7` + count) + `Upvote to reward asker` right. Flag: `✓ Helpful context` decorative not built; `…` placeholder non-functional unless `handleShare` trivial. **Verify:** `320/768` centered `~640px` card `header avatar·Follow·Verified·…` / `Student · date` / body / framed image `rounded-2xl` / light `#IELTS` pills / footer `1 votes` pill + `Upvote to reward asker` (rail still on `sm:`), no `Helpful context`, `npm run build` + `grep localhost` 0.

---

## DONE — Profile Stats Row (P2) + Default Avatar Library (2026-09-08)

- [x] **P2. [Bug] Fix profile stats row — elevated tiles + singular (need-improvemtn.png)** — Red-marked `Applications/Reviews/Saved/Followers` below `Overview` tabs was `StatsRow.jsx:8` `grid-cols-3 gap-2 bg-slate-50 border-slate-100` flat strip on `bg-slate-50` page (low contrast, cramped `px-2 py-3`, `3+1` wrap). Adapted `QuestionDetail` `Stats` pattern (`QuestionDetail.jsx:621` `rounded-[20px] border-slate-200 bg-white p-5 shadow-soft` → `grid-cols-3 gap-3` `rounded-2xl bg-gradient-to-b from-white to-slate-50 ring-1`): wrapper `MyProfile.jsx:331` `rounded-[20px] border-slate-200 bg-white p-5 shadow-soft` with header `ShieldCheck` `text-xs uppercase tracking-widest`, tiles `StatsRow.jsx:8` `grid-cols-2 gap-3 sm:grid-cols-4` `rounded-2xl bg-gradient-to-b from-white to-slate-50 ring-1 ring-slate-100 px-2 py-4` `h-5 w-5 text-slate-400` `text-[18px] font-extrabold` `text-[10px] font-bold uppercase tracking-widest`; fixed `MyProfile.jsx:315`/`ProfileHeaderQuora.jsx:50` `label: "Followers"` static → `followers===1 ? "Follower" : "Followers"` (reuse `QuestionDetail.jsx:347`); kept `hasValue` `"null"` guard; checked `320/375/768/1024`. **DONE `StatsRow.jsx:8` `grid-cols-2` `gap-3` `rounded-2xl` gradient, `MyProfile.jsx:315,331` wrapper + singular, `ProfileHeaderQuora.jsx:50` singular, `build` `lint` 0** **Verify:** `320/375` `2×2` → `sm:4` equal, `gap-3` breathing, `rounded-2xl` elevated not flat, `1 follower` singular, `0` muted, no `null`, no `x` scroll.

- [x] **A1. [Feature] Avatar library — 20 pre-generated SVGs (consistent style + brand palette)** — Used `@dicebear/core` + `@dicebear/adventurer` (locked) via `scripts/generate-avatars.mjs`, seeds `hive-01…hive-20` to `public/avatars/avatar-01.svg…avatar-20.svg` (public URL-addressable, not `src/assist/bgImg` bundled). Palette: brand `50` `#eef2ff` `100` `#e0e7ff` `200` `#c7d2fe` `300` `#a5b4fc` `400` `#818cf8` `500` `#6366f1` `600` `#4f46e5` `700` `#4338ca` `900` `#312e81` + `accent #f59e0b`/`emerald #10b981`/`sky #0ea5e9` from `tailwind.config.js:12` + `daisyUI schoolhive`. Keep fallback. Verify: `ls public/avatars/*.svg` 20, each valid SVG, `npm run build` copies via `public`, no `localhost` refs. **DONE `public/avatars` 20, `scripts/generate-avatars.mjs`, `@dicebear/core`+`@dicebear/collection`**

- [x] **A2. [Feature] Server-side random assignment at registration (once, persisted)** — In `user.controller.js:createUser` (server-side, once): if `incoming.photoURL` empty/`null`/`isEmptyString` (no manual upload, and for Google no provider photo), pick `DEFAULT_AVATARS[Math.floor(Math.random()*20)]` (`"/avatars/avatar-0N.svg"`), set `photoURL` before `users.insertOne`, so it stays fixed (not re-randomized on page load). Also handle `existingUser` sync: only if `!existingUser.photoURL` and `incoming.photoURL` is default? Keep current `syncSet` logic but allow default assignment for brand-new users only. No backfill for existing users (conscious call — would mutate existing account data; flag if you’d prefer backfill). Keep initials fallback as defensive (`hasValue(photoURL)?photo:initials`). Verify: `POST /users {email, name, accountType:"student"}` with no `photoURL` → `users.findOne({email})` has `photoURL` `/avatars/avatar-*.svg` (one of 20); `POST /users` with `photoURL: "https://lh3.googleusercontent.com/…"` keeps that URL; second `POST /users` same email does not overwrite; `GET /users/me` returns `photoURL` starting `/avatars/` for default-assigned, `npm run lint` 0. **DONE `Schole-hive-server/src/utils/avatars.js`, `user.controller.js:68` `isEmptyPhotoUrl`+`pickRandomAvatar`, `Registation.jsx:132-224` sync Firebase to assigned `/avatars/`, `Nabvar.jsx:189`/`AdminNavbar.jsx:129` fallback to `me.photoURL` (DB) so default shows in nav, initials kept as defensive**

> **Assumption flagged:** Existing users with `photoURL: null` keep initials fallback — no backfill migration. If platform-wide consistency is wanted later, add a one-off `users.updateMany({photoURL:null}, {$set:{photoURL: random}})` migration (explicit, reviewed).

---

## TODO — Next

- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").
