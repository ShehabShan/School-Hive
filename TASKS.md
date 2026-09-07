# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- [ ] **N1. [Feature] Extract shared `useNotifications` data source** — *Next* — see TODO polish batch below. **P1 DONE** (see below). Sub-feature waves W1–W10 archived to `docs/TASK_HISTORY.md` 2026-09-04. Deploys need owner approval.

---

## TODO — Profile + Notifications + Threaded Replies Polish (2026-09-07 — P1)

> **Scope:** Profile header overlap bug + notifications move/cleanup/mute + nested reply threads (3-level cap) + `QuestionDetail` responsive redesign. Researched 2026-09-07 (`ProfileLayout.jsx:22/38`, `ProfileHeaderQuora.jsx:54`, `Nabvar.jsx:92`, `NotificationBell.jsx:8/32`, `notification.service.js:22`, `QuestionDetail.jsx:349`, `answer.validator.js:39`).

> **Build order:** `P1` can start in parallel with `N1/Q1`. Notifications chain `N1 → N2 → N3 → N4a → N4b`. Threads chain `Q1 → Q2 → Q3 → Q4` — `Q4` (responsive redesign) is intentionally last so layout accounts for final nested-comment UI. Implement small PRs per `AGENTS.md`.

> **Resolutions folded in (2026-09-07):** (1) keep bell in **both** main nav and dashboard nav sharing one `useNotifications` source — not a move; (2) mute = two options only — *mute this question/thread* (default) + *mute this notification type*, no actor-level mute; (3) restore cover+overlap on **public** profiles too — treat flat `ProfileHeaderQuora` as bug/drift, flag if intentional; (4) replies earn **no reputation** — lightweight upvote only; (5) **denormalize `commentCount`** on answers (like `answerCount`).

- [x] **P1. [Bug] Fix avatar-over-cover overlap + restore cover on public profiles** — `src/Component/profile/ProfileLayout.jsx:22,37-40` `overflow-hidden rounded-2xl` + `pt-0` first-child collapse clips `-mt-10 sm:-mt-12` avatar; `src/Component/profile/ProfileHeaderQuora.jsx:54` currently flat (no cover). Decision resolved: restore LinkedIn-style cover+overlap on **both** `ProfileLayout` (MyProfile) and `ProfileHeaderQuora` (PublicProfile) as one shared visual — they were built as a single component family, divergence is bug/drift. Fix: `pt-px` (or `border-t border-transparent`) to prevent margin collapse, `relative z-10 isolate` on avatar wrapper, audit outer `overflow-hidden` clipping `ring-4 ring-white`/`shadow-lift` (consider split `rounded-t-2xl`/`rounded-b-2xl` vs single outer), re-add `cover = hasValue(user.coverPhoto)?user.coverPhoto:bg` + `relative h-44 overflow-hidden` + `-mt-10` to Quora header; if during build this turns out to be an **intentional** divergence (not drift), do not silently keep flat — flag in `TASKS.md`/`HANDOFF_LOG.md` for owner double-check and pause. Remove or deprecate orphan `ProfileHeader.jsx`/`ProfileHeroV2.jsx`. Verify: at 320/768/1280 `MyProfile` and `/profile/:email` both show avatar top 40–56px overlapping cover bottom, `ring-4` fully visible, no white bleed over cover; `getComputedStyle .-mt-10 === -40px`; screenshot both routes. **DONE 2026-09-07 — `ProfileLayout.jsx:37-38` pt-px + isolate z-10, `ProfileHeaderQuora.jsx:58-76` cover restored, orphans deprecated, build + lint pass.**

- [ ] **N1. [Feature] Extract shared `useNotifications` data source** — Pull `useQuery ["notifications","me"]` + `markRead`/`markAllRead` + `unreadCount` out of `src/Component/QA/NotificationBell.jsx:32` into `src/Hooks/useNotifications.jsx` (enabled `!!user`, `staleTime 30s`, `refetchOnWindowFocus`, `GET /notifications/me?limit=10`, invalidates on PATCH). Both nav bells will share this single cache — not two independent systems. Keep outside-click + `Escape` handling and `aria-*` in presentational bell. Verify: any component calling `useNotifications()` sees same `unreadCount`/`data` and a single network request per 30s window.

- [ ] **N2. [Feature] Add notification bell to main site nav (keep dashboard bell — both visible)** — Render `<NotificationBell>` in `src/Pages/Sheard/Nabvar.jsx:172` right cluster as `Ask → Bell → avatar` (`hidden lg` mobile sheet too), gated `!!user`, badge `unread>9?"9+"`. **Keep** `src/Layout/AdminNavbar.jsx:119` bell inside `AdminDashboard.jsx:174` — dashboard users retain visibility without leaving the dashboard. Both bells consume `N1` (`useNotifications`) single source per resolution (1). Verify: signed-in user sees bell on `/`, `/allScholership`, `/questions/:id` outside any dashboard with same count as inside `…/Dashboard/*`; dropdown `limit=10` newest-first, click marks read and navigates `payload.questionId`.

- [ ] **N3. [Feature] Clean up notification system (while in N1/N2)** — While touching notifications, align client `limit=10` with server `src/controllers/notification.controller.js:10` (`limit 15/max 50`) — document or pass `limit`; bypass 30s LRU cache for `GET /notifications/me` (`src/app.js:55` auth route should not be cached); polish a11y focus trap/`role="menu"`/`Escape` closes/click-outside; keep daily dupe window `src/services/notification.service.js:15` `(recipientEmail,type,actorEmail,payload.questionId)` as-is. Not an open-ended redesign. Verify: `GET /notifications/me?limit=10` uncached, 30s stale + focus refetch, no duplicate fetches from two bells; a11y audit passes for dialog.

- [ ] **N4a. [Feature] Server: mute preferences store + filter (question + type only)** — Extend `users` with `notificationMutes: { mutedTypes:[], mutedQuestionIds:[] }` (or `notification_preferences` collection) — **only two mute scopes** per resolution (2): *this notification type* (`question_answered|answer_accepted|question_followed` + future `comment_reply`) and *this specific question/thread* (`payload.questionId`), no `actorEmail` mute (that's blocking — out of scope). Endpoints `PATCH /notifications/preferences/mute {type|questionId}` + `DELETE …/unmute` (auth), filter in `src/services/notification.service.js:createNotification` early-return if recipient muted that `type`/`questionId` and in `src/controllers/notification.controller.js:listMine` (`{type:{$nin:mutedTypes}, "payload.questionId":{$nin:mutedIds}}`). Verify: `PATCH …/mute {type:"question_followed"}` → subsequent `question_followed` for that user not inserted and not returned in `GET /notifications/me`; per-question mute hides only that thread; unmute restores.

- [ ] **N4b. [Feature] Client: per-notification kebab menu — mute this thread / mute this type** — Add `Ellipsis` kebab per `NotificationBell.jsx:107` row (hover/focus reveal) with **exactly two** actions per resolution (2): “Mute this question” (default, `Mute alerts for "…title"`) and “Mute this type” (`Mute question_answered` etc.), no “Mute this person”. Wire to `N4a` PATCH, optimistic hide + toast “Muted — Undo” (undo = unmute). Reuse `TYPE_META` tones `NotificationBell.jsx:8`. Verify: open bell → each row shows `⋯` on hover/focus → Mute thread hides future alerts for that `questionId` only, Mute type hides that `type` globally, badge + list update without reload; menu keyboard-navigable (arrows/Enter/Escape).

- [ ] **Q1. [Feature] Server: `comments` collection — nested replies on answers + denormalized `commentCount`, no reputation** — New `collections.comments` in `src/config/db.js:38` indexed `(answerId,createdAt)`, `(parentId,createdAt)`, `(questionId,createdAt)`. Validator `src/utils/comment.validator.js` (`body 1–2000 chars`, `answerId` required, `parentId` optional ObjectId). `buildCommentDoc {questionId,answerId,parentId|null,rootId,depth,body,authorId,authorEmail,createdAt,updatedAt}`. Routes `POST /answers/:id/comments` (auth, `depth=parent.depth+1`, denormalized `answers.$inc commentCount` like `answerCount` `server TASKS.md:Q&A redesign`), `GET /answers/:id/comments` (flat list or tree), `DELETE/PATCH /comments/:id` (owner|staff, `$inc commentCount -1`). No reputation awarded — per resolution (4) only Questions/Answers earn `+2/+10/+15`; replies get lightweight upvote only if added later, **no `reputationEvents` write**, no `applyReputation` call. Create `comment_reply` notification to `parentAuthor||answerAuthor` (self-block + 24h dedupe). Verify: `POST /answers/:aid/comments {body}` → 201 `depth 0` + `answers.commentCount` +1; reply to `parentId` → `depth 1`; `GET /answers/:aid/comments` returns tree; delete → `commentCount` −1; no `reputationEvents` doc created for any comment.

- [ ] **Q2. [Feature] Client: `CommentThread` + reply composer under each answer** — Under `src/Pages/QA/QuestionDetail.jsx:487` `answersSorted.map(a→<AnswerCard>)`, add `<CommentThread answerId={a._id} questionId={id}>` fetching `GET /answers/:id/comments` via `useQuery ["comments", answerId]`. Components `src/Component/QA/CommentItem.jsx` (`AuthorBlock` + `MarkdownBody` + `timeAgo` + Reply) + `src/Component/QA/ReplyComposer.jsx` (`RichTextEditor` 1–2000, `useRole` gate, `POST`), collapsible “Show N replies”, denormalized `commentCount` badge, invalidates `["comments",answerId]` + `["question",id]` on mutate. Supersedes flat model (`answer.validator.js:39` had no `parentId`). Verify: on `/questions/:id` each answer shows reply count, “Reply” opens inline editor, submit appears instantly, `commentCount` increments without reload; empty state “No replies yet”.

- [ ] **Q3. [Feature] Cap nesting at 3 levels, flatten deeper replies** — Extend `Q1/Q2` — server may store true `depth` but client renders `renderDepth = min(depth,3)` (or server clamps `depth=min(parent.depth+1,3)`). In `CommentThread` recursion indent `ml-0/ml-4/ml-8` or `border-l` per level, nodes with `depth>3` render as siblings under the depth-3 ancestor as `Reply to @name` (Reddit/Facebook pattern) with `createdAt` order preserved; no extra horizontal indent beyond level 3. Keep `Q2` as separate reviewable PR, `Q3` as follow-up. Verify: chain 0→1→2→3→4→5 renders indented to level 3 then 4/5 flattened at same indent under depth-3 parent, no overflow at 320px.

- [ ] **Q4. [Feature] Responsive redesign of `QuestionDetail` `motion.article` `src/Pages/QA/QuestionDetail.jsx:349` — desktop/tablet/mobile (after Q2/Q3)** — Sequenced last so layout accounts for final nested-comment UI (not reworked twice). Collapse left vote rail `w-[72px] sm:w-[84px] L357` on mobile to horizontal pill (upvote + score + share) above/below body to save width; keep vertical rail ≥640; adjust `p-5 sm:p-6 L384` → `p-4 sm:p-6`, `prose prose-sm sm:prose-base`, tags `gap-1.5` wrap, author row `flex-col xs:flex-row`, indents scale with viewport, `min-w-0` so threaded replies never cause horizontal scroll. Update `DetailSkeleton` to match. Verify: visual QA at 320/375/768/1024/1280 — no horizontal scroll, vote affordance thumb-reachable on mobile, article + nested replies breathe, right rail `lg:grid-cols-[1fr_340px] L345` intact; Lighthouse mobile ≥90.

---

## DONE — Q&A answers-only model: question comments removed (2026-09-04)

- [x] Card footer fix — the "comment" button was showing `answerCount` but opening a comment wall (`QuestionCard.jsx:152`); replaced with an **Answers chip** (existing `AnswerStat`: accepted ✓ / answered / unanswered states) linking to `/questions/:id#answer`; dead `⋯` dropped; compact views — client `85912bf`
- [x] `CommentThread.jsx` deleted (sole importer was the card); `question_comment`/`comment_reply` notification types removed from bell
- [x] Server: comment routes, controller fns, `comment.validator.js`, db collection wiring removed — `3744e08` on `feature/subfeatures`, **merged to main + DEPLOYED 2026-09-04** (owner approved; verified: `/questions/:id/comments` → 404). `question_comments` data **left in Mongo** per owner decision
- Spec §1.4 alignment: clarifications belong as comments *under answers* (→ B2), not a general wall on the question

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
