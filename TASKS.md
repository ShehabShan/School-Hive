# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- None — Default avatar library **COMPLETE 2026-09-08** (A1, A2 done, ready for review). Polish round archived to `docs/TASK_HISTORY.md` 2026-09-07. Deploys need owner approval — ask via `question` tool.

---

## TODO — Next

- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").

---

## DONE — Default Avatar Library (2026-09-08)

- [x] **A1. [Feature] Avatar library — 20 pre-generated SVGs (consistent style + brand palette)** — Used `@dicebear/core` + `@dicebear/adventurer` (locked) via `scripts/generate-avatars.mjs`, seeds `hive-01…hive-20` to `public/avatars/avatar-01.svg…avatar-20.svg` (public URL-addressable, not `src/assist/bgImg` bundled). Palette: brand `50` `#eef2ff` `100` `#e0e7ff` `200` `#c7d2fe` `300` `#a5b4fc` `400` `#818cf8` `500` `#6366f1` `600` `#4f46e5` `700` `#4338ca` `900` `#312e81` + `accent #f59e0b`/`emerald #10b981`/`sky #0ea5e9` from `tailwind.config.js:12` + `daisyUI schoolhive`. Keep fallback. Verify: `ls public/avatars/*.svg` 20, each valid SVG, `npm run build` copies via `public`, no `localhost` refs. **DONE `public/avatars` 20, `scripts/generate-avatars.mjs`, `@dicebear/core`+`@dicebear/collection`**

- [x] **A2. [Feature] Server-side random assignment at registration (once, persisted)** — In `user.controller.js:createUser` (server-side, once): if `incoming.photoURL` empty/`null`/`isEmptyString` (no manual upload, and for Google no provider photo), pick `DEFAULT_AVATARS[Math.floor(Math.random()*20)]` (`"/avatars/avatar-0N.svg"`), set `photoURL` before `users.insertOne`, so it stays fixed (not re-randomized on page load). Also handle `existingUser` sync: only if `!existingUser.photoURL` and `incoming.photoURL` is default? Keep current `syncSet` logic but allow default assignment for brand-new users only. No backfill for existing users (conscious call — would mutate existing account data; flag if you’d prefer backfill). Keep initials fallback as defensive (`hasValue(photoURL)?photo:initials`). Verify: `POST /users {email, name, accountType:"student"}` with no `photoURL` → `users.findOne({email})` has `photoURL` `/avatars/avatar-*.svg` (one of 20); `POST /users` with `photoURL: "https://lh3.googleusercontent.com/…"` keeps that URL; second `POST /users` same email does not overwrite; `GET /users/me` returns `photoURL` starting `/avatars/` for default-assigned, `npm run lint` 0. **DONE `Schole-hive-server/src/utils/avatars.js`, `user.controller.js:68` `isEmptyPhotoUrl`+`pickRandomAvatar`, `Registation.jsx:132-224` sync Firebase to assigned `/avatars/`, `Nabvar.jsx:189`/`AdminNavbar.jsx:129` fallback to `me.photoURL` (DB) so default shows in nav, initials kept as defensive**

> **Assumption flagged:** Existing users with `photoURL: null` keep initials fallback — no backfill migration. If platform-wide consistency is wanted later, add a one-off `users.updateMany({photoURL:null}, {$set:{photoURL: random}})` migration (explicit, reviewed).
