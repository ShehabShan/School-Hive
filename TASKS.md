# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- **Q&A Forum Round — 8 Issues (2026-09-04)** — see TODO below. Tasks added per prompt, tagged `[Bug]/[Feature]`, each ends `Verify:`. Implement one at a time, stop for review after each commit (no batching).

---

## TODO — Q&A Forum Round — 8 Issues (2026-09-04)

> Add each as own task, tagged [Bug]/[Feature], small one-sitting ending `Verify:` — same format as existing.
> Reference screenshots: `Image 1 = current All Questions grid (2-col, title+excerpt+category/tag chips+vote/view/time)` at placeholder `docs/img/all-questions-current.png`; `Image 2 = Quora post-style single-column (avatar+author header, title, truncated body+More, footer vote/comment)` at placeholder `docs/img/quora-reference.png`.

- [x] **1. [Bug] Gate "Show scheduled scholarships" to scholarship creators** — Hide `PreferencesPanel.jsx:27` Toggle `Show scheduled scholarships` unless `isInstitution || isSuperAdmin` (same guard as `Routes.jsx:114 SuperAdminRoute` + `132 InstitutionRoute` for `AddScholarship`/`ManageScholarships`). Keep other prefs (`showStatsOnPublic`, `emailNotifications`, `visibility`) visible to all. Verify: student/mod/admin Settings shows 2 toggles (no Show scheduled), institution/superadmin shows 3; toggle persists via `PATCH /users/me` → `GET /users/me` preferences; lint/build pass.

- [x] **2. [Bug] Fix broken profile stats/tabs on every role (student/institution/admin/moderator/superadmin)** — `MyProfile.jsx:309 adminStats` labels `Users/Scholarships/Applications/Pending` render as `div` (no `to`) via `StatsRow.jsx:9` → click NOP and broken `grid-cols-3` wrapping; institution `to:"#students"` hash NOP. Add `to` for every `adminStats` entry (`Users→/adminDashboard/manageUsers`, `Scholarships→/adminDashboard/manageScholarships` + `/institutionDashboard/manageScholarships`, `Applications→/adminDashboard/manageAppliedApplication`, `Pending→/adminDashboard/manageReviews`), fix `#students` → `/institutionDashboard/students`, enable `allUsers` + `reviewStats` queries for moderator (`isAdminOrMod`). Verify: every role's profile page stats chips are clickable `Link` with hover lift, navigation works, no hash, lint/build; manual role-switch smoke.

- [x] **3. [Feature] Follower-visibility single setting (covers followers+following)** — If `preferences.showFollowersOnPublic === false` anyone (visitor) sees no follower data; when on, anyone can see who is following him and who he is following. Add `users.preferences.showFollowersOnPublic` boolean default `true` (`!==false` legacy) — no new collection/index, follows reuse `db.js:33 follows + 3 indexes`. Server: `createUser:128` default, `profile.validator.js:164` `Boolean()` + `_preferencesPatch`, `patchMe:460` merge fallback `showFollowersOnPublic:true`, gate `getFollowers:571` (return empty when hidden unless owner/staff), `getPublicStats:402` + `pickPublic:286` counts `undefined` when hidden (hides `StatsRow` tile via `hasValue`). Client: one `<Toggle Show followers …>` in `PreferencesPanel.jsx:27` (`checked={p.showFollowersOnPublic !== false}`), conditional omit in `ProfileHeaderQuora.jsx:44` + `PublicProfile.jsx:101` (`headerStats` omit when hidden && !isOwner). Verify: toggle OFF → visitor `GET /users/:email/followers` empty + `GET /users/public/:email/stats` followers 0/hidden, owner still sees true via `GET /users/me/stats`; ON → visitor sees list+counts; lint/build + curl.

- [x] **4. [Bug] "Answer" tab on public profile redirects to "About"** — Root cause `PublicProfile.jsx:82 useEffect([aTotal,qTotal,active])` bounce loop when `aTotal===0` re-fires on every `active` click → `setActive("about")`. Make fallback mount-only (remove `active` from deps, `hasInteracted` ref guard after first user click, `catch→undefined` not `0` premature). Keep `AnswersTab.jsx:59` empty state `No answers yet`. Verify: clicking Answer stays on Answers showing list or empty state (does not bounce), Questions/About not forced, both totals loaded correctly; lint/build.

- [ ] **5. [Feature] Show question author everywhere + link to public profile** — Every card on `All Questions` (`BrowseQuestions.jsx:225-228` `QuestionCard` + `QuestionListItem`) + detail page (`QuestionDetail.jsx:180`). Wrap `AuthorBlock.jsx:11-40` avatar+name in `<Link to={`/profile/${encodeURIComponent(email)}`}>` with hover/underline guard, deduped `useAuthor.js:12` cache. Restructure `QuestionCard.jsx:51,88` outer `Link` → `article/div` + interior title `Link to /questions/:id` + isolated author link (`stopPropagation`) to avoid nested anchors. Verify: every browse card header shows avatar+name+Verified+time linking to `/profile/:email`, detail page author linked, no nested `<a>` violation, lint/build.

- [ ] **6. [Needs scoping → Feature] "Your Answer" section — easy/reliable improvements (propose in TASKS, then implement minimal)** — Current `QuestionDetail.jsx:207 #answer` + `AnswerForm.jsx:5-43` + `RichTextEditor.jsx:14`. Scoping picks (A = Guidance+trust strip, B = Editor ergonomics+draft, C = Positioning/disclosure) — implement easy/reliable per owner approval: A (3 bullets + identity row + isAsker warning) + B-lite (localStorage draft debounce 500ms + Edit|Preview tabs + live 20-char hint, disable Post until ≥20). Verify: editor shows guideline + Posting as row, draft persists across refresh until post, preview tabs work, guest CTA still gated by `me`, lint/build.

- [ ] **7. [Feature] Redesign All Questions cards single-column post-style + author header (ties to #5)** — Fast-loading: no extra fetch, hydrate `AuthorBlock` via cached `useAuthor` only, keep same `rounded-2xl border bg-white p-4` shell. Current 2-col grid (`BrowseQuestions.jsx:226 sm:grid-cols-2` + `QuestionCard.jsx:85 180char`) → single column `space-y-4` post: header `<AuthorBlock size="sm" time>`, title `text-[16px] font-bold`, body `stripMarkdown` truncated ~150 chars + `More` expand (`useState expanded`, `preventDefault`), footer `ArrowBigUp voteScore · MessageSquare answerCount · Eye viewCount` `border-t text-xs`. Placeholders `docs/img/all-questions-current.png` (Image 1) and `docs/img/quora-reference.png` (Image 2) for audit. Deprecate `view` toggle/limit fork. Verify: All Questions renders single column, author at top linked, More expands/collapses, footer counts correct, skeleton updated to avatar header, mobile stack, lint/build.

- [ ] **8. [Feature] Replace pagination with infinite scroll on All Questions (keep filter/search/URL-sync)** — Fast-loading: `useInfiniteQuery` (already `5.65.0`) + native `IntersectionObserver` (no new dep), no `react-infinite-scroll-component`. Current `BrowseQuestions.jsx:80 page From searchParams + 101 useQuery page/limit 15|12 + 231 pager 5-window + Page X of Y:211`. Replace with `useInfiniteQuery` `initialPageParam:1` `getNextPageParam(last=>last.page<last.totalPages?page+1:undefined)`, queryKey without `page` (keep `q,category,tag,destinationCountry,homeCountry,studyLevel,sort`), flatten `pages.flatMap`, sentinel `ref` `rootMargin 200px` → `fetchNextPage()` + fallback `Load more`, remove pager + `Page X of Y` → `Showing {shown} of {total}` + end `You've reached the end`, reset scroll on filter/sort change, keep `updateParams` URL-sync for filters/search/sort (no `page` param), `activeFilters` preserved, server `parsePagination` unchanged. Verify: scroll triggers next page, filter/sort resets to top page1, URL filters preserved, no pager, `totalPages` respected, `limit 12` consistent, lint/build, no `maxLimit 50` breach.

---

## DONE — Performance Optimization (2026-09-04, 14 ranks, 13 branches)

- [x] **R1 pagination** `scholarship/review/apply/saved/question` `limit 20 max 50` + callers fix
- [x] **R2 compression** `compression 1.8.1` gzip
- [x] **R3+R8 images + Home lazy** `WebP 60%` src 26→12M, `Home` 110→68KB
- [x] **R4 icons** `lucide` only, `firebase/auth` lazy
- [x] **R5 fonts** 6→3 weights + preconnect API
- [x] **R6 rerenders** `useMemo/useCallback/memo` + singleton axios
- [x] **R7 roles** single `useRole`
- [x] **R9 cache** firebase `Cache-Control` + server LRU 30s
- [x] **R10 indexes** 9 new
- [x] **R11 parallel** `Promise.all` stats
- [x] **R12 bulk** `aggregate` rating + `bulkWrite`
- [x] **R13 jwt async** + HSTS + global 100/min
- Deferred per prompt: sweetalert vs toast, self-host fonts, dual-write tx, string→Date migration
- Report: `docs/PERFORMANCE_REPORT.md`, log: `docs/HANDOFF_LOG.md 2026-09-04`

## TODO — Next
- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").

