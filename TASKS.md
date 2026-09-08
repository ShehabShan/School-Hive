# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

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

## TODO — Stream Questions on BrowseQuestions (NDJSON) — AWAITING REVIEW (Do Not Code Yet)

> Consolidated from multi-turn discussion 2026-09-08. User requested: document all points first, review, then begin. Safe-by-default: only stream if Step 1 proves it helps and does not harm.

- [ ] **Step 1 — Confirm where time goes (gate before any streaming code)** — Open `Schole-hive-server/src/controllers/question.controller.js:22 listQuestions` confirm `find(filter).sort(sort).skip(skip).limit(limit).toArray():29` with `buildQuestionFilter`/`buildQuestionSort` `src/services/question.service.js` (regex `escapeRegex` 100, `$or` on title/body/tags, `apiStrict:true` no $text) — no per-question enrichment. Check `src/config/db.js:14 connect()` singleton + `src/app.js:11 ensureDb` `dbPromise` lazy cold Vercel path vs warm. Check complaint: `query slow` vs `wire waits for full array`. Instrument `console.time` around `connect` vs `countDocuments` vs `find first doc` vs `toArray`+`serialize/send` on Vercel preview cold/warm. Report before assuming streaming fixes. If `connect` dominates, streaming list alone won't help — needs connection reuse/Fluid fix separately.

- [ ] **Step 2 — Backend stream `GET /questions` (conditional, backward-compatible)** — Only if Step 1 shows wire buffering matters and Vercel can flush. Keep `buildQuestionFilter`/`buildQuestionSort`/`parsePagination {page:1,limit:12,maxLimit:50}` exactly; same filter/sort/skip/limit/order; don't reintroduce `$text`. Replace `.toArray()` with cursor iteration: `cursor = questions.find(filter).sort(sort).skip(skip).limit(limit); for await (const doc of cursor) res.write(JSON.stringify({type:'question',...doc})+'\n')`. Run `countDocuments(filter)` concurrently, send as `{type:'meta',total,page,totalPages}` line so client keeps counts/pagination alongside `type:'question'` lines. Set `Content-Type: application/x-ndjson; charset=utf-8`, `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`, `Connection: keep-alive`, CORS before first `write`; bypass `src/utils/cache.js 30s LRU` and `compression threshold:1024` for this route. On cursor error write `{type:'error',message}` then `res.end()` (status already sent). Hide behind `?stream=1` / env flag with fallback to current `res.json({data,total})` so revert is one line. **Vercel caveat:** `api/index.js` wraps Express `app` as single catch-all `vercel.json rewrites /(.*)->/api/index.js maxDuration:60`; Express+compression can buffer until `res.end()` even if `res.write` works locally. Must test on *deployed* preview with `curl --no-buffer` first-byte timing; if buffered, use dedicated `api/questions/stream.js` outside Express.

- [ ] **Step 3 — Frontend `BrowseQuestions.jsx:72` streaming fetch** — Current `useInfiniteQuery:107` `axios.get ${baseURL}/questions` `limit:12` `getNextPageParam:124`, no `signal`/abort, 400ms `useDebounced:14` `localQ->debouncedQ->searchParams`, `IntersectionObserver sentinel:86/153` + Load More `261`, `BrowseSkeleton:20`, `FilterChip:134`, `total=pages[0].total:133`. Move this one call out of `useQuery` (single-resolve ill-suited) to local `useStreamedQuestions` hook using native `fetch` + `AbortController`, `response.body.getReader()`, `TextDecoder` split `\n`, buffer partial line, branch `type`: `question` append to list immediate render, `meta` -> total/totalPages, `error` -> partial failure. Keep 400ms debounce for `q` but abort previous stream on `updateParams:98` fast filter change so stale `q=iel` doesn't append after `q=ielts`. Keep `FilterChip`/pagination UI functionally same, fed by incremental state + meta line. Don't change `QuestionCard` look, only when data shows; keep skeleton count = `limit` known upfront.

- [ ] **Step 4 — Verify** — Same inputs → same docs/order/limits only delivery changed. Test on real Vercel preview (not just `npm run dev`). Verify `FilterChip`, sort `newest/votes/views/relevance`, pagination `hasNextPage` via `meta` still correct, `total/totalPages` display `235 Showing {list.length} of {total}`. If cold `connect` dominates per Step 1, explicitly report streaming alone won't solve — needs connection strategy.

- [ ] **Safety/Opt-in:** Ship streaming as opt-in `?stream=1` with fallback; instant revert. Do not harm: no contract change, headers before write, no $text, no infinite scroll change.

## TODO — Infinite Scroll DOM Retention (200 Questions, 199 Images) — AWAITING REVIEW (Do Not Code Yet)

> Question: browsing 1→200 keeps all in DOM? Yes, heavy. Discussion 2026-09-08 — document solution, don't code yet.

- [ ] **Current:** `BrowseQuestions.jsx:131` `pages.flatMap(p=>p.data)` + `252 list.map(q=><QuestionListItem>)` unbounded, no virtualization/windowing/unmount (only fetch sentinel `86/153 rootMargin:200px` + Load More). `QuestionCard.jsx:19` `extractImages` capped 2, `<img loading="lazy" maxHeight:420>:139` defers network but DOM nodes/React fibers/decoded bitmaps/layout recalc still O(n) ~1500 elements for 200 cards, memory grows linearly — mobile jank.

- [ ] **Fix — Virtualization/windowing (core):** Render only viewport + overscan (~3-5 cards), recycle DOM. For variable height (text 0-2 images) use dynamic measurer: `react-virtuoso` (auto) or `@tanstack/react-virtual` `measureElement` + `estimateSize`. Keep `useInfiniteQuery` for data, virtualizer for render; `fetchNextPage` now `atBottom` of virtual list. Replace `list.map` with `virtualizer.getVirtualItems().map(virtualRow => <QuestionListItem key={list[virtualRow.index]._id} q={list[virtualRow.index]} ref={measure}>)`, container `height:100vh overflow:auto` or window scroller. Overscan reuses `rootMargin:200px` intent.

- [ ] **Image discipline:** Virtualization makes `loading="lazy"` sufficient (off-screen not in DOM). Add `decoding="async"`, `srcset`/CDN width, low-quality placeholder/blurhash, never preload 199 at once. Keep `BrowseSkeleton:20` as Virtuoso skeleton.

- [ ] **Alternatives:** Strict pagination `?page=` (cheapest, best SEO, worst endless browse) — would restore `?page` deleted `89-95` for single-column style; windowed cache (keep 200 data in memory `pages` but ~10 in DOM, back-scroll instant); interim cap `if(list.length>60) show "You've viewed 60, go to next page"` / `list.slice(-60)`.

- [ ] **How large sites do it:** Twitter/Facebook/Instagram/Reddit virtualize — ~15-20 DOM nodes recycled, tombstones placeholder height estimated then corrected, CDN + lazy + placeholder, hybrid infinite ~100 then “Show more” to avoid infinite heap.

- [ ] **Next:** After review, add `@tanstack/react-virtual` or `react-virtuoso` behind flag with fallback to current `list.map`; keep debounce/FilterChip/sort/AbortController from streaming plan; verify scroll 1→200 ~12 DOM cards, heap flat, scroll smooth, back-scroll instant via cached `pages`.

## TODO — Next

- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").
