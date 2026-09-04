# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- **Sub-feature waves queued (2026-09-04)** — Wave 1 quick wins (W1–W8) + Wave 2 notification spine (W9–W10) in TODO below; 18 deferred sub-features in BACKLOG (B1–B18). Source `docs/img/monkeycode-research-sub-feature.md`, triaged against code — 5 false positives rejected (see Wave 1 header). One task at a time, stop for review after each commit.

---

## TODO — MonkeyCode Deferred — P3 Backlog (2026-09-04)

> Not active — P3 nice-to-have, deferred per triage. File as future TODO only if you want. Each still one-sitting but low value/risk.

- [ ] **D1. [P3] ScholarshipCard duplication** — `src/Pages/AllScholership/ScholarshipCard.jsx` vs `src/Component/scholarship/ScholarshipCard.jsx` both used (discovery vs manage). Keep both for now; consolidate only if visual drift confirmed. No Verify until scheduled.

- [ ] **D2. [P3] AllScholership `Recommended` vs `Highest rated` identical** — `AllScholership.jsx:109` `rating` + `reviewsCount` same branch. Make `recommended` weighted `rating*0.6+recency*0.3+reviews*0.1` or drop duplicate. Defer.

- [ ] **D3. [P3] AllScholership dual client/server filtering `serverHasFilter~119`** — `AllScholership.jsx:89-130` implicit `resp.total vs filteredSorted.length` switch fragile. Pick server truth once facets ship. Defer.

- [ ] **D4. [P3] Compare N+1 + ids truncated** — `Compare.jsx:40 Promise.all GET /allScholership/:id ×4` + `slice 0,4` silent. Batch `GET /allScholership?ids=a,b` server endpoint needed. Defer (needs server).

- [ ] **D5. [P3] MyApplication dead lines + no pagination + useDebounced duplication** — `MyApplication.jsx:34` `next.delete("view"); next.set("view",view)` no-op, unbounded `apply` load, `AllScholership.jsx:25` + `BrowseQuestions.jsx:14` duplicate `useDebounced`. Extract `src/Hooks/useDebounce.js`. Defer.

---

## TODO — Sub-feature Wave 1: Quick wins (2026-09-04)

> Source: `docs/img/monkeycode-research-sub-feature.md` (AI-generated, triaged against code 2026-09-04). Full-stack entries — server work included per task; `npm run lint`/`npm run build` (client) + `node --check` (server) before each small commit.
> **Rejected as false positives (do NOT re-file):** FEAT-402 profile photo upload (exists — `MyProfile.jsx:427` imgbb "Upload photo"); FEAT-401 share button (exists — `ProfileHeaderQuora.jsx:129-136`; OG-tags remainder merged into B5); FEAT-403 forgot-password (exists — `AuthProvider.jsx:51` `sendResetPassword` + `Login.jsx:117`; email-verify remainder kept as B6); FEAT-108 ranked search (premise wrong — server-side search + `sort=relevance` + text index already exist: `question.service.js:31-56`, `db.js:115-118`); FEAT-703 as written (shared `EmptyState`/`StatusBadge` already adopted — only loading gaps kept as B17).

- [x] **W1. [S] Print/export Compare + application summary (FEAT-206)** — `Compare.jsx` has clipboard Share (`:68-71,114`) but no export: print stylesheet + `window.print()` button on `Compare.jsx` and application detail; print shows only the comparison/summary card (hide navbar/footer). No new dependency. Verify: print preview shows only the comparison/summary card, not navbar/footer; lint/build.

- [x] **W2. [S] Application statusHistory + user timeline (FEAT-203)** — server: accept (`PATCH /allapply/accepted/:id` → `"accepted"`, `apply.controller.js:87`) and cancel-as-reject (`PATCH /allapply/cancel/:id` → `"rejected"`, `:75`) append `{status, at, by}` to `statusHistory[]`. Client: timeline in `ApplicationCardForUser.jsx` (currently only a StatusBadge pill `:36` + Feedback box). Verify: accept/cancel appends a dated event; user card renders timeline; old docs without history render fine; lint/build + node --check.

- [x] **W3. [S] "Helpful" votes on reviews (FEAT-301)** — server: `helpfulEmails[]` on review + `POST /reviews/:id/helpful` toggle (own review excluded) + `helpfulCount` in review responses. Client: helpful button on scholarship-detail review cards (list at `ScholarshipDetails.jsx:216`, card `Pages/ScholarshipDetails/AllReviews.jsx`) + sort-by-helpful. Verify: toggle once per user, own review excluded, count updates; lint/build + node --check.

- [x] **W4. [S] Star distribution + rating filter on detail page (FEAT-303)** — rating buckets via server aggregate summary (pattern from perf R12) or client-side from reviews already fetched on detail; CSS-only histogram + rating filter chips above the review grid in `ScholarshipDetails.jsx`. Verify: buckets sum to review count; filter works; lint/build.

- [x] **W5. [S] "Closing soon" deadline strip (FEAT-204)** — Home strip reusing `CountdownBadge` (`Component/scholarship/CountdownBadge.jsx:26`) + `useScholership`, sorted by upcoming `applicationDeadline` ascending; past deadlines excluded. Home has no deadline strip today (`Home.jsx:24-29`). Verify: strip shows only future deadlines ascending; stale scholarships excluded; lint/build.

- [x] **W6. [S] Apply form draft autosave (FEAT-201)** — `Apply.jsx` is an uncontrolled FormData form (`:56-57`) with a required file input (`:253-258` — file cannot be restored, exclude from draft). Debounced save to `localStorage apply:draft:<scholarshipId>` mirroring the per-entity inline pattern `AnswerForm.jsx:10` (`answers:draft:${questionId}`) — NOT `useQADraft` (single global key `qa-draft-v1`); restore on mount, "Clear draft", saved indicator. Verify: reload mid-form restores text/select fields; clear works; existing submit flow unchanged; lint/build.

- [x] **W7. [S] Reputation privilege ladder UI (FEAT-106)** — server: none (rep stored/awarded already). Client: privileges card/route from `docs/Q&A_system.md` §2.2 ladder (1/15/75/125/300/750/1500) + "X rep to unlock Y" progress on profile (`StatsRow`/sidebar); tooltip "requires N rep" on gated actions — downvote@125 gate already exists (`AnswerCard.jsx:27,64-67`), badges@3/10 in `BadgeRow.jsx:20-22`; don't duplicate gates. Verify: ladder matches spec table; own rep-to-next visible; gated action tooltip; lint/build.

- [x] **W8. [S/M] ManageUsers search/pagination/export (FEAT-504, corrected)** — server `GET /users` ALREADY supports q-search/role/status/orgType filters/sort/page-limit max 50 (`user.controller.js:184-213`); client `ManageUsers.jsx:34-40` fetches all with no search/pager/loading. Wire search box + filters + pager + row count to the existing params; add `GET /users/export` CSV (staff-only, new) ; add shared loading skeleton (currently none). Verify: search + paging are server-side correct; CSV downloads with headers; lint/build + node --check.

---

## TODO — Sub-feature Wave 2: Notification spine (2026-09-04)

- [x] **W9. [M] Real notifications for Q&A events (FEAT-101)** — server: `notifications` collection (recipientEmail, type, actorEmail, payload, read, createdAt) + `db.js` indexes (recipientEmail+createdAt, recipientEmail+read) + `notification.routes.js`: `GET /notifications/me`, `PATCH /notifications/read/:id`, `PATCH /notifications/read-all`, unread count; emit on answer created / answer accepted (`answer.controller.js:129-137`) / question comment (`question.controller.js:173-206`) / follow (W10); daily-cap fan-out (one per actor per question per type). Client: replace the hardcoded-`0` bell `AdminNavbar.jsx:119-124` with a real dropdown (list, unread dot, mark-read, link to `/questions/:id`), refetch-on-focus via TanStack Query. v1 = Q&A events only, no email. Verify: answering creates a notification for the asker; bell shows unread count; click marks read + navigates; server returns 401 for other users' notifications; lint/build + node --check.

- [x] **W10. [S] Follow a question / watchlist (FEAT-102)** — server: reuse the `follows` pattern (`user.controller.js:551-594`, indexes `db.js:98-100`) — `POST/GET/DELETE /questions/:id/follow` + follower count on question detail. Client: follow toggle in `QuestionDetail.jsx` right rail (AuthorBlock-style count); feeds W9 notifications. Verify: toggle persists; count updates; lint/build + node --check.

---

## BACKLOG — Sub-features deferred (2026-09-04)

> From `docs/img/monkeycode-research-sub-feature.md` triage. Promote to TODO one at a time when waves above drain. Full-stack entries; anchors verified 2026-09-04.

- [ ] **B1. [M] Owner answer edit + editHistory (FEAT-103a)** — no PATCH/PUT on answers (`answer.routes.js:10-20`); owner-only PATCH + `editHistory[]` (editorEmail, at, reason); reuse `RichTextEditor`; history viewer. (103b suggested-edits folded into B3 queue.)
- [ ] **B2. [M] Threaded comments under answers (FEAT-109)** — `CommentThread.jsx:43-46` renders only a placeholder for answers; extend `comment.validator.js` (questionId-only, `:24-29`) to accept `answerId`; `GET/POST /answers/:id/comments`; denormalize `commentCount` on answers (like `answerCount`, perf R12).
- [ ] **B3. [M] Content flags + moderation queue (FEAT-104 + FEAT-502, paired)** — no flags anywhere today; `flags` collection (targetType/targetId/reason/reporterEmail/status) + POST/GET/PATCH + auto-hide at threshold; staff queue page (tabs: Flagged / Suggested edits (103b, rep≥300) / First posts) with Approve/Dismiss/Remove.
- [ ] **B4. [M] Inquiry lifecycle (FEAT-601)** — only POST/GET exist (`inquiry.routes.js:9-10`); `status:"open"` written at create (`inquiry.controller.js:15`) but never updatable. PATCH status (open/in_progress/resolved) + `replies[]` (staffEmail, body, at) + small staff inbox UI; public form unchanged.
- [ ] **B5. [M] Route-level SEO/OG meta (FEAT-701 + FEAT-401 remainder)** — `react-helmet-async` in deps but zero `<Helmet>` usages (only HelmetProvider `main.jsx:32`; `QAPageSchema.jsx:39` is a raw script). Add title/description/canonical/OG per public route (scholarship detail, profile, browse, compare).
- [ ] **B6. [S] Email verification (FEAT-403 remainder)** — `sendEmailVerification` absent (0 matches); send after signup + "unverified" banner in profile + resend control. (Forgot-password already exists — `AuthProvider.jsx:51`.)
- [ ] **B7. [M] Admin dashboard home (FEAT-501)** — no index/analytics route under adminDashboard (`Routes.jsx:110-125`); DashboardHome with StatCards (users by role, scholarships by status/country, applications by status, Q&A/review totals) via `Promise.all` (perf R11); `/scholarships/stats` exists as base (`scholarship.controller.js:72-86`).
- [ ] **B8. [M] Freshness layer (FEAT-105)** — `confirmedCount`/`lastConfirmedAt`/`staleFlagged` on answers + `POST /answers/:id/confirm` + `/stale`; "Last confirmed accurate … by N" chip + "Is this still accurate? [Yes/No/Suggest edit]" on old answers; eligible fast-changing categories in `src/constants/qa.js`.
- [ ] **B9. [M] Saved-scholarship folders/notes (FEAT-205)** — saved doc is `{userEmail, scholarshipId, savedAt}` (`saved.controller.js:18`), routes are POST toggle/GET/DELETE only (`saved.routes.js:8-11`); add optional `folder`+`note` + PATCH `/saved/:id`; folder chips + inline note edit in `SavedScholarships.jsx:29` (currently flat grid).
- [ ] **B10. [S] Category/impact badges on profile (FEAT-107)** — compute best-category (accepted answers/upvotes) + monthly "helped N students" in public stats (`user.controller.js:331-374` area); display chips on PublicProfile header row.
- [ ] **B11. [S/M] Trending this week (FEAT-110, trimmed)** — no trending endpoint; `GET /questions/trending?days=7` (votes+answers+recency blend) + home strip reusing `QuestionListItem`. (Category filtering already works in browse — category pages dropped from scope.)
- [ ] **B12. [M] Institution per-scholarship funnel (FEAT-207, trimmed)** — institution totals already via `/users/me/stats` (`user.controller.js:346-359`); add applications-by-scholarship-by-status aggregate endpoint + StatCards/CSS bars in institution dashboard (no chart lib).
- [ ] **B13. [M] Institution announcements (FEAT-208)** — after W9 ships; `announcements` collection (institutionEmail, title, body, createdAt) + compose box in `InstitutionStudentPortal.jsx` + visible only to that institution's students.
- [ ] **B14. [L] Follow feed (FEAT-404)** — `useFollow` exists (`useFollow.jsx:7`) but no feed ("Following" marked "Future" in `Nabvar.jsx:162`); `GET /feed/me` aggregate of followed users' recent questions/answers, newest first; list on profile Activity tab.
- [ ] **B15. [L] Application documents (FEAT-202)** — no `documents[]` on apply (`createApply` raw insert `apply.controller.js:27`); upload with progress in `Apply.jsx` (decide host first: Firebase Storage vs imgbb — imgbb pattern exists `Apply.jsx:20`) + viewer/download in mod/admin `ApplicationCard`; keep list endpoints light (documents in single-get only).
- [ ] **B16. [M] Accessibility & focus pass (FEAT-702)** — aria/keyboard semantics on `QuestionCard`, `PreferencesPanel` toggles, `SectionAccordion`, admin tables, `BrowseQuestions` mobile sheet; skip-to-content link + brand focus-visible rings.
- [ ] **B17. [S] Loading-state gaps only (FEAT-703, trimmed)** — real gaps: no loading state at all in `ManageUsers.jsx` + AllAppliedScholarship; ad-hoc pulse skeletons in `ManageReview.jsx:129-134` + MyApplication list view (`:151`). Replace with shared `CardGridSkeleton`. (Empty states already use shared components — rest of the report claim rejected.)
- [ ] **B18. [M] Role & verification audit log (FEAT-503)** — role patch is a bare updateOne (`user.controller.js:479-485`); verify/institution approvals store reviewedBy/reviewedAt on-doc only; add `auditLogs` collection + write on those actions + superadmin-only read-only list page.

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
