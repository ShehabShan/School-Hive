# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## Test Results — by Muse Spark (2026-09-09, branch `testing`, live https://scholarhive-913e4.web.app/)

Method: Playwright (same engine as `@playwright/mcp` MCP server) on Linux, headless Chromium `--no-sandbox`, viewports mobile 390×844 + desktop 1440×900. Raw JSON: `/tmp/opencode/qa/results2.json`, screenshots `/tmp/opencode/qa/home-mobile.png` + `home-desktop.png`. Correct routes taken from `src/routes/Routes.jsx` (note: first sweep used guessed URLs `/allScholarships`, `/login`, `/register`, `/qa` which correctly 404 — see F5).

PASS (no fix): `/`, `/scholarships`, `/allScholership`, `/questions`, `/signIn`, `/registration` render with correct H1; `overflowX 0` both viewports; `0` images missing alt; title consistent; Firebase rewrites `** → /index.html` working (deep links return 200 + app).

NEEDS FIX:

- [ ] **F1 [P0/Bug] Home stats API 500** — desktop `/` console: `Failed to load resource: 500` on `GET https://server-six-vert.vercel.app/allScholership/stats`. Mobile run clean (flaky or viewport-triggered). Fix: check server stats controller/route (likely in `Schole-hive-server`), add error guard + client fallback so home renders stats section without console error. Verify: load `/` desktop, no 500, no console error.
- [ ] **F2 [P1/Bug] Unsplash hotlink fails on scholarship lists** — `/scholarships` + `/allScholership` (both viewports): `requestfailed https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80`. Page still renders H1, so likely one card/banner image. Fix: self-host under `public/` or add `onError` fallback + `loading="lazy"`. Verify: no `requestfailed`, no broken-image icon.
- [ ] **F3 [P1/Perf] `/contact`, `/aboutUs`, `/compare` ~33s + empty H1** — vs ~3s for all other routes, both viewports; H1 empty (slow lazy chunk or blocking fetch, Suspense fallback stuck). Fix: inspect lazy imports + data fetching on `ContactPage`, `AboutUs`, `Compare`; preconnect/preload or remove blocking await. Verify: each < 5s on desktop, meaningful H1/heading present.
- [ ] **F4 [P2/UX] 404 page is a dead end (no nav)** — `/nonexistent-xyz-123`: H1 `Page not found` correct, but `navLinks 0` (no header/nav rendered, unlike 7 links on every other page). Fix: render `NotFound` inside `MainLayout` or add Home/browse links. Verify: 404 shows nav + working Home link.
- [ ] **F5 [P2/UX] Common guessed URLs 404** — `/allScholarships` (double-p), `/login`, `/register`, `/qa` all show `Page not found` (correct per current routes; first sweep confirmed). Canonical: `/scholarships` (also `/allScholership` typo-alias exists), `/signIn`, `/registration`, `/questions`. Fix (optional): add redirect aliases in `Routes.jsx` for the guessed names. Verify: each alias lands on canonical page, no 404.

## IN PROGRESS

- None — **P2 + visily QuestionDetails restyle + image double-border fix DONE** (26c3b9f). Ready for deploy.

---

## DONE — Q&A Image Double-Border Fix (2026-09-08)

- [x] **[Bug] Question/answer image double border on QuestionDetail** — `MarkdownBody.jsx:15` had `prose-img:border prose-img:border-slate-200` plus wrapper `span:26 rounded-2xl border border-slate-200 p-1.5 shadow-sm` → gap double border close to image + parent wrapper. Fix: keep single wrapper border, remove `prose-img:border/border-slate-200` (keep `prose-img:rounded-xl`). Covers both `QuestionDetail.jsx:404` question body and `AnswerCard.jsx:80` answer body via shared `MarkdownBody`. **DONE `MarkdownBody.jsx:15` single border, `lint 0`, `build` guard OK, deploys via `./scripts/deploy.sh --client-only`** **Verify:** `![img](url)` in Q body + A body shows one `rounded-2xl border` with `p-1.5` inset, `img` has no extra border, lightbox 320/768 intact.

---

## DONE — Profile Stats Row (P2) + Default Avatar Library (2026-09-08)

- [x] **P2. [Bug] Fix profile stats row — elevated tiles + singular (need-improvemtn.png)** — Red-marked `Applications/Reviews/Saved/Followers` below `Overview` tabs was `StatsRow.jsx:8` `grid-cols-3 gap-2 bg-slate-50 border-slate-100` flat strip on `bg-slate-50` page (low contrast, cramped `px-2 py-3`, `3+1` wrap). Adapted `QuestionDetail` `Stats` pattern (`QuestionDetail.jsx:621` `rounded-[20px] border-slate-200 bg-white p-5 shadow-soft` → `grid-cols-3 gap-3` `rounded-2xl bg-gradient-to-b from-white to-slate-50 ring-1`): wrapper `MyProfile.jsx:331` `rounded-[20px] border-slate-200 bg-white p-5 shadow-soft` with header `ShieldCheck` `text-xs uppercase tracking-widest`, tiles `StatsRow.jsx:8` `grid-cols-2 gap-3 sm:grid-cols-4` `rounded-2xl bg-gradient-to-b from-white to-slate-50 ring-1 ring-slate-100 px-2 py-4` `h-5 w-5 text-slate-400` `text-[18px] font-extrabold` `text-[10px] font-bold uppercase tracking-widest`; fixed `MyProfile.jsx:315`/`ProfileHeaderQuora.jsx:50` `label: "Followers"` static → `followers===1 ? "Follower" : "Followers"` (reuse `QuestionDetail.jsx:347`); kept `hasValue` `"null"` guard; checked `320/375/768/1024`. **DONE `StatsRow.jsx:8` `grid-cols-2` `gap-3` `rounded-2xl` gradient, `MyProfile.jsx:315,331` wrapper + singular, `ProfileHeaderQuora.jsx:50` singular, `build` `lint` 0** **Verify:** `320/375` `2×2` → `sm:4` equal, `gap-3` breathing, `rounded-2xl` elevated not flat, `1 follower` singular, `0` muted, no `null`, no `x` scroll.

- [x] **A1. [Feature] Avatar library — 20 pre-generated SVGs (consistent style + brand palette)** — Used `@dicebear/core` + `@dicebear/adventurer` (locked) via `scripts/generate-avatars.mjs`, seeds `hive-01…hive-20` to `public/avatars/avatar-01.svg…avatar-20.svg` (public URL-addressable, not `src/assist/bgImg` bundled). Palette: brand `50` `#eef2ff` `100` `#e0e7ff` `200` `#c7d2fe` `300` `#a5b4fc` `400` `#818cf8` `500` `#6366f1` `600` `#4f46e5` `700` `#4338ca` `900` `#312e81` + `accent #f59e0b`/`emerald #10b981`/`sky #0ea5e9` from `tailwind.config.js:12` + `daisyUI schoolhive`. Keep fallback. Verify: `ls public/avatars/*.svg` 20, each valid SVG, `npm run build` copies via `public`, no `localhost` refs. **DONE `public/avatars` 20, `scripts/generate-avatars.mjs`, `@dicebear/core`+`@dicebear/collection`**

- [x] **A2. [Feature] Server-side random assignment at registration (once, persisted)** — In `user.controller.js:createUser` (server-side, once): if `incoming.photoURL` empty/`null`/`isEmptyString` (no manual upload, and for Google no provider photo), pick `DEFAULT_AVATARS[Math.floor(Math.random()*20)]` (`"/avatars/avatar-0N.svg"`), set `photoURL` before `users.insertOne`, so it stays fixed (not re-randomized on page load). Also handle `existingUser` sync: only if `!existingUser.photoURL` and `incoming.photoURL` is default? Keep current `syncSet` logic but allow default assignment for brand-new users only. No backfill for existing users (conscious call — would mutate existing account data; flag if you’d prefer backfill). Keep initials fallback as defensive (`hasValue(photoURL)?photo:initials`). Verify: `POST /users {email, name, accountType:"student"}` with no `photoURL` → `users.findOne({email})` has `photoURL` `/avatars/avatar-*.svg` (one of 20); `POST /users` with `photoURL: "https://lh3.googleusercontent.com/…"` keeps that URL; second `POST /users` same email does not overwrite; `GET /users/me` returns `photoURL` starting `/avatars/` for default-assigned, `npm run lint` 0. **DONE `Schole-hive-server/src/utils/avatars.js`, `user.controller.js:68` `isEmptyPhotoUrl`+`pickRandomAvatar`, `Registation.jsx:132-224` sync Firebase to assigned `/avatars/`, `Nabvar.jsx:189`/`AdminNavbar.jsx:129` fallback to `me.photoURL` (DB) so default shows in nav, initials kept as defensive**

> **Assumption flagged:** Existing users with `photoURL: null` keep initials fallback — no backfill migration. If platform-wide consistency is wanted later, add a one-off `users.updateMany({photoURL:null}, {$set:{photoURL: random}})` migration (explicit, reviewed).

---

## DONE — Stream Questions on BrowseQuestions (NDJSON) — Implemented & Deployed 2026-09-08

> Built in order after review, full authority, committed `2ee551c` + `3bccbea`, deployed Vercel `server-munr5pbex` + Firebase `scholarhive-913e4.web.app`.

- [x] **Step 1 — Confirm where time goes** — Verified `question.controller.js:22` single `find(filter).sort(sort).skip(skip).limit(limit).toArray()` `29` with `question.service.js` regex, no per-question enrichment, `db.js:14` `ensureDb` `dbPromise` cold vs warm. Instrumented with `MEASURE=1` `console.time` around `connect`/`count`/`firstDoc`. Reported: streaming addresses wire buffering, not query slowness.

- [x] **Step 2 — Backend stream `GET /questions?stream=1`** — Kept `buildQuestionFilter`/`buildQuestionSort`/`parsePagination {page:1,limit:12,maxLimit:50}` same order, no `$text`. `cursor = questions.find(...).sort(...).skip(...).limit(...); countDocuments` concurrent, headers `Content-Type: application/x-ndjson`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no` before first write, `for await (doc of cursor) res.write({type:'question',...doc}+'\n')` with `flush()`, `meta` first line `{type:'meta',total,page,totalPages}`, `error` line on catch, bypass `cache.middleware` + `compression` for `stream=1`, fallback to `res.json` when no `stream`, `req close` → `cursor.close()`.

- [x] **Step 3 — Frontend `BrowseQuestions.jsx:72` streaming fetch** — Replaced `useInfiniteQuery` `axios` with `useStreamedQuestions.js` via `fetch` + `AbortController` + `getReader()`/`TextDecoder` split `\n` buffer partial, branch `meta/question/error`, `400ms` debounce kept, abort old stream on `updateParams` fast change, incremental `setPages` per question line, `FilterChip`/`pagination` fed by `meta`.

- [x] **Step 4 — Verify** — Same filter/sort/skip/limit docs/order, preview `curl --no-buffer` first byte < full JSON, `FilterChip`, sort `newest/votes/views/relevance`, `hasNextPage` via `meta`, `total` display intact. Cold `connect` dominates first hit — documented, streaming helps wire buffering.

- [x] **Safety/Opt-in:** `?stream=1` flag, instant revert to buffered `res.json`, no contract change, Vercel preview tested (Express shim `api/index.js` + `vercel.json` rewrites verified not buffering when `compression` bypassed).

## DONE — Infinite Scroll Virtualization (200 Questions) — Implemented & Deployed 2026-09-08

- [x] **Current:** `pages.flatMap` `131` + `252 list.map` unbounded O(n) ~1500 nodes for 200 cards, `loading="lazy"` defers network but DOM/memory grows.

- [x] **Fix — `react-virtuoso` windowing** — Added `react-virtuoso` dependency, replaced `list.map` with `<Virtuoso useWindowScroll data={list} endReached={fetchNextPage} overscan={400} increaseViewportBy={200} itemContent={(idx,q)=><QuestionListItem q={q} />} />`, `Footer` renders Load More / end. Only viewport + 3-5 overscan in DOM (~12 nodes for 200), off-screen images not in DOM, heap flat. Removed `sentinelRef`/`IntersectionObserver` `153`.

- [x] **Image discipline:** `loading="lazy"` + virtualization ensures off-screen never decoded; keeps `extractImages` cap 2, `maxHeight:420`, ready for `decoding="async"`/`srcset` later.

- [x] **Alternatives considered:** pagination `?page=` (best SEO) and windowed cache kept 200 data in memory but 10 DOM via virtualizer — chosen virtuoso for endless browse.

- [x] **Verify:** scroll 1→200 ~12 DOM cards, smooth, back-scroll instant via cached `pages`, build `72kB` `BrowseQuestions`, deployed.

## TODO — Next

- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").
