# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- None — Sub-feature waves W1–W10 DONE (see DONE stub below). B1–B18 backlog remains. Deploys need owner approval.

---

## TODO — MonkeyCode Deferred — P3 Backlog (2026-09-04)

> Not active — P3 nice-to-have, deferred per triage. File as future TODO only if you want. Each still one-sitting but low value/risk.

- [ ] **D1. [P3] ScholarshipCard duplication** — `src/Pages/AllScholership/ScholarshipCard.jsx` vs `src/Component/scholarship/ScholarshipCard.jsx` both used (discovery vs manage). Keep both for now; consolidate only if visual drift confirmed. No Verify until scheduled.

- [ ] **D2. [P3] AllScholership `Recommended` vs `Highest rated` identical** — `AllScholership.jsx:109` `rating` + `reviewsCount` same branch. Make `recommended` weighted `rating*0.6+recency*0.3+reviews*0.1` or drop duplicate. Defer.

- [ ] **D3. [P3] AllScholership dual client/server filtering `serverHasFilter~119`** — `AllScholership.jsx:89-130` implicit `resp.total vs filteredSorted.length` switch fragile. Pick server truth once facets ship. Defer.

- [ ] **D4. [P3] Compare N+1 + ids truncated** — `Compare.jsx:40 Promise.all GET /allScholership/:id ×4` + `slice 0,4` silent. Batch `GET /allScholership?ids=a,b` server endpoint needed. Defer (needs server).

- [ ] **D5. [P3] MyApplication dead lines + no pagination + useDebounced duplication** — `MyApplication.jsx:34` `next.delete("view"); next.set("view",view)` no-op, unbounded `apply` load, `AllScholership.jsx:25` + `BrowseQuestions.jsx:14` duplicate `useDebounced`. Extract `src/Hooks/useDebounce.js`. Defer.

---

## DONE — Sub-feature Waves 1–2 (2026-09-04, W1–W10; client `3e1f8af..ca2d785`, server `feature/subfeatures`)

> Triage + rejected false positives: see Wave header note preserved below. **DEPLOYED to production 2026-09-04** (owner approved): server `feature/subfeatures` → main → Vercel; client main → Firebase. All W1–W10 live.

- [x] **W1** Print/PDF export — Compare + application details (`window.print()` + global print CSS hiding chrome) — FEAT-206
- [x] **W2** Application `statusHistory` + user timeline (server `$push` on create/accept/cancel; fallback for old docs) — FEAT-203
- [x] **W3** Review helpful votes (toggle, own-excluded, PII-safe `helpfulCount`/`helpfulVoted`) + Most-helpful sort — FEAT-301
- [x] **W4** Rating filter chips — histogram already existed (`ScholarshipDetails.jsx:105`), trimmed to filter only — FEAT-303
- [x] **W5** Home "Closing soon" strip (server `sort=deadline&deadlineAfter=today`, draft/scheduled hidden) — FEAT-204
- [x] **W6** Apply draft autosave `apply:draft:<id>` (AnswerForm pattern, file input excluded, clear + restore) — FEAT-201
- [x] **W7** Privilege ladder card + next-unlock progress on PublicProfile (downvote tooltip already existed) — FEAT-106
- [x] **W8** ManageUsers: wired existing server q/role/page params + new `GET /users/export` CSV + loading skeleton — FEAT-504
- [x] **W9** Notifications: `notifications` collection + `/notifications/me|read/:id|read-all`, emit on answer/accept/comment/reply, real bell dropdown in AdminNavbar (all dashboards) — FEAT-101
- [x] **W10** Follow-question toggle in QuestionDetail right rail + asker notification — FEAT-102

> **Triage note (preserved from Wave 1 header):** rejected as false positives — FEAT-402 photo upload (exists `MyProfile.jsx:427`), FEAT-401 share (exists; OG part → B5), FEAT-403 forgot-password (exists; email-verify → B6), FEAT-108 ranked search (server search + `sort=relevance` + text index already exist), FEAT-703 as written (shared components already adopted; loading gaps → B17).

---

## DONE — Q&A answers-only model: question comments removed (2026-09-04)

- [x] Card footer fix — the "comment" button was showing `answerCount` but opening a comment wall (`QuestionCard.jsx:152`); replaced with an **Answers chip** (existing `AnswerStat`: accepted ✓ / answered / unanswered states) linking to `/questions/:id#answer`; dead `⋯` dropped; compact views — client `85912bf`
- [x] `CommentThread.jsx` deleted (sole importer was the card); `question_comment`/`comment_reply` notification types removed from bell
- [x] Server: comment routes, controller fns, `comment.validator.js`, db collection wiring removed — `3744e08` on `feature/subfeatures` (deploy pending approval). `question_comments` data **left in Mongo** per owner decision
- Spec §1.4 alignment: clarifications belong as comments *under answers* (→ B2), not a general wall on the question

---

## BACKLOG — Sub-features deferred (2026-09-04)

> From `docs/img/monkeycode-research-sub-feature.md` triage. Promote to TODO one at a time when waves above drain. Full-stack entries; anchors verified 2026-09-04.

- [ ] **B1. [M] Owner answer edit + editHistory (FEAT-103a)** — no PATCH/PUT on answers (`answer.routes.js:10-20`); owner-only PATCH + `editHistory[]` (editorEmail, at, reason); reuse `RichTextEditor`; history viewer. (103b suggested-edits folded into B3 queue.)
- [ ] **B2. [M] Threaded comments under answers (FEAT-109)** — comment system removed from questions 2026-09-04 (answers-only model, see DONE above); build fresh when scheduled: `GET/POST /answers/:id/comments`, threaded replies, denormalized `commentCount` on answers (like `answerCount`), new comment component.
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
