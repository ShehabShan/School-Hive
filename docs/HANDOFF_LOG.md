# HANDOFF_LOG.md — School-Hive (client)

Session-by-session handoff log. **Newest entry at the top.**
Every session that does meaningful work appends a dated entry here before finishing
(or before hitting a token/budget limit) and commits + pushes it.
Format: one entry per session, `YYYY-MM-DD` heading, then a short summary of
DONE / IN PROGRESS / LEFT / DECISIONS & CONTEXT.

---

## 2026-09-02 — LinkedIn-Style Profile Refactor

### DONE
- Created 5 shared profile components under `src/Component/profile/`:
  - `RoleBadge.jsx` — shared role metadata (label, color, icon for each role)
  - `ProfileHeader.jsx` — cover photo + overlapping avatar + name + stats + edit button
  - `AboutSection.jsx` — bio with show-more truncation + skills tags
  - `Sidebar.jsx` — contact info + member info cards
  - `ActivitySection.jsx` — applications + reviews with status badges
- Rewrote `PublicProfile.jsx` — two-column LinkedIn layout (main content + sidebar), responsive
- Rewrote `MyProfile.jsx` — 572→~300 lines, modal edit overlay, uses shared components
- Updated `ManageUsers.jsx` — imports shared `roleMeta` from RoleBadge
- Build passes, lint clean (no new errors)
- Commit `8ea2169`, pushed to `feature/login-roles`

### IN PROGRESS
- E2E smoke test (blocked on server .env)

### DECISIONS & CONTEXT
- Profile route stays `/profile/:email` — no server changes needed
- Edit mode is a modal overlay (not inline tabs) — cleaner UX
- `roleMeta` extracted to shared `RoleBadge.jsx` — eliminates duplication across 3 files
- `ActivitySection` shows 4 applications + 3 reviews on profile (view all links to dashboard)
- Mobile responsive: single column on small screens, two-column on `lg:`

---

## 2026-09-02 — Deploy guard: no localhost leaks + working Vercel token

**What was done**
- **Tokens validated live** (read-only): old `VERCEL_TOKEN` → `invalidToken:true` (expired); `FIREBASE_TOKEN` → valid (`scholarhive-913e4` listed). Fresh `VERCEL_TOKEN` created by owner, validated HTTP 200 via `GET /v9/projects` (access to project `server`).
- **Critical discovery:** the Vercel project `server` is already linked to GitHub `ShehabShan/Schole-hive-server` with **auto-deploy on push to `main`** — current prod is READY/PROMOTED at `server-six-vert.vercel.app` (verified HTTP 200 "School Hive server is running"), running pre-roles code. Server env vars already set in the Vercel panel (`DB_USER/DB_PASS/ACCESS_TOKEN_SECRET/ADMIN_EMAILS`).
- **Guarded build chain added** (`npm run build` stays DEV-ONLY): `scripts/check-dist-server-url.mjs` (fails on `localhost:<port>`/`127.0.0.1:<port>` in `dist`, requires Vercel URL present), `scripts/prod-build.mjs` (forces `VITE_server_url=https://server-six-vert.vercel.app`, builds, checks), `scripts/deploy.mjs` (guarded build + `firebase deploy` using `FIREBASE_TOKEN` parsed from `docs/CREDENTIALS.md`). `package.json`: `build:prod` and `deploy`.
- **Verified both ways:** dev build → guard exits 1 (`localhost:5000` + missing Vercel URL); `build:prod` → OK, 0 local refs, Vercel URL present. Early over-strict version also matched harmless lib strings (`new URL("http://localhost")`) — narrowed to port-based patterns.
- **Docs updated:** `docs/CREDENTIALS.md` (new token, `npm run deploy` usage), `docs/DEPLOY.md` (localhost-trap, guarded deploy, server=push-to-main). Server repo `docs/CREDENTIALS.md` + `docs/DEPLOY.md` aligned (`6207508`).

**Blockers / notes**
- GitHub push protection flags the committed `vcp_` token; owner **allowlisted** the value via the unblock link (re-push succeeded, client `3463a0e`). A new token in future would need a new allow.
- Server not yet live with roles code — merge `feature/login-roles` → `main` (both repos) is the remaining go-live step, deferred until E2E passes.

**LEFT / NEXT**
1. User creates `Schole-hive-server/.env` (mirror Vercel panel values) → E2E vs `localhost:5000` (student, institution pending→approve→add scholarship, admin/mod 403, reject flow, forgot-password).
2. E2E green → merge `feature/login-roles` → `main` both repos (Vercel auto-deploys server), then `npm run deploy` for client.

---

## 2026-09-02 — Role portals, institution signup & approvals (branch `feature/login-roles`)

**What was done** (client side of the login/roles upgrade; server work in `Schole-hive-server` is committed `295e71e`)
- **`Login.jsx` rewritten** — 3-portal picker (Student / Staff / Institution), password show/hide, inline forgot-password flow (Firebase reset email via new `AuthProvider.sendResetPassword`), busy/loading states, friendly errors (`friendlyAuthError.js`). After login, waits for the JWT (`waitForToken.js`), fetches `/users/me`, then `dashboardForRole(me)` → `/adminDashboard/adminProfile` (superadmin/admin), `/modaratorDashboard/myProfile` (moderator), `/pendingApproval` / `/rejectedApproval` / `/institutionDashboard/myProfile` (institution by status), else original target. Google sign-in posts `accountType: "student"`.
- **`Registation.jsx` rewritten** — Student / Institution selector. Institution collects org fields (`orgName / orgType / orgCountry / orgWebsite / orgDescription`) and posts `accountType: "institution"` → success Swal → `/pendingApproval`. `SocialLogin` shown only for student portal. Google sign-in → `/`.
- **New `InstitutionStatus.jsx`** — default `PendingApproval` (role/status redirection guard + org summary) and `RejectedApproval` (shows `statusNote` when rejected). Routes `/pendingApproval`, `/rejectedApproval` under `MainLayout`.
- **New guards** — `InstitutionRoute` (approved-institution only; pending/rejected redirect to status pages), `SuperAdminRoute` (owner-only). `useRole` now returns `status, me, isSuperAdmin, isInstitution, isApprovedInstitution, isPending, isRejected` (single `/users/me` query).
- **`Routes.jsx`** — `/institutionDashboard/*` (myProfile, addScholarships, manageScholarships + `:id`, allAppliedScholarships + `:id`) under `InstitutionRoute`; scholarship CRUD **removed** from mod/admin dashboards; admin-side scholarship routes + `institutionApprovals` wrapped in `SuperAdminRoute`.
- **`AdminDashboard.jsx`** — role-aware sidebar: institution (Profile/Add Scholarship/My Scholarships/Applications), superadmin (adds Manage Scholarships + Manage Users + Institution Approvals), plain admin (reviews/history/applications/users — no scholarships), moderator (reviews/history/applications).
- **`AdminNavbar.jsx`** — institution label, Review History item hidden for non-staff.
- **`Nabvar.jsx`** — institution dashboard/status link; `links` now include institutions.
- **`MyProfile.jsx` / `PublicProfile.jsx`** — `institution` added to `roleMeta` (badge shows "Institution").
- **New `InstitutionApprovals.jsx`** (`/adminDashboard/institutionApprovals`, superadmin) — pending/approved/rejected tabs, approve, reject-with-reason (Swal textarea), move-to-pending, shows `statusNote`/`reviewedBy`/`reviewedAt`. `ManageUsers.jsx` shows institution status badges instead of role-assign buttons.
- **Helpers** — `src/lib/waitForToken.js`, `src/lib/dashboardForRole.js`, `src/lib/friendlyAuthError.js`.

**Commit/push** — client `f0e683c` on `origin/feature/login-roles`. Server `295e71e` pushed (see server handoff log).

**DEPLOY HAZARD (important)** — the client `.env` currently has `VITE_server_url=http://localhost:5000`. Any plain `npm run build` **bakes localhost:5000 into `dist`** (verified: 7 references, 0 Vercel refs in last build). Production deploy MUST use `VITE_server_url=https://server-six-vert.vercel.app npm run build` then `grep "localhost:5000" dist/assets/*.js` must return 0 before `firebase deploy`.

**IN PROGRESS / BLOCKED**
- E2E smoke test of the full role flow vs `localhost:5000` — **blocked until the user creates `Schole-hive-server/.env`** (Option A: local Mongo creds + `ACCESS_TOKEN_SECRET` + `ADMIN_EMAILS`; values mirror the Vercel dashboard). Also blocked further up by expired `VERCEL_TOKEN` for production deploy/testing.

**LEFT / NEXT**
1. User creates `Schole-hive-server/.env` → run E2E: student login, institution register→pending screen, superadmin approve (adminProfile → Manage Users → Institution Approvals), institution adds/edits own scholarship, admin/mod confirm create/edit/delete now blocked (server 403), institution reject → rejected screen, forgot-password email.
2. Optional polish — "Published by" org attribution on scholarship cards/details; `Registation` Google path → role-routed `/` instead of hardcoded.
3. Production deploy requires fresh `VERCEL_TOKEN` for server, then client rebuild with Vercel URL override (hazard above) before `firebase deploy`.

---

## 2026-09-01 — Server URL switchable via env var

**What was done**
- Added `VITE_server_url` env variable to toggle between local dev server (`http://localhost:5000`) and production Vercel server (`https://server-six-vert.vercel.app`).
- Updated `useAxiosPublic.jsx`, `useAxiosSecure.jsx`, `Faq.jsx` to read from `import.meta.env.VITE_server_url` with Vercel fallback.
- Updated `.env` and `.env.example` with the new variable.

**LEFT**
- None — standalone change, no tasks affected.

---

## 2026-09-01 — Manage Reviews simplified (auto-approve model) + navbar/dashboard refactor

**What was done**
- **Manage Reviews (auto-approve, no moderation queue):** removed category tabs (`All/Pending/Approved/Rejected/Hidden/Removed`) + `activeTab` + bulk approve/reject + per-card history. Now queries `status=approved` only; header shows `total/approved/removed` + one `View History` link; per-card action is `Remove` (required reason + optional note, soft-delete → history) + `Edit` (typo fix). `ReviewCard` deleted `Approve/Reject/Hide` branches (dead on live server where `PATCH /moderate` 404s) and per-card `View history`; still used by `MyReviews` (owner delete+edit) and now has avatar fallback.
- **New `ReviewHistory` page** (`src/Pages/AdminPages/ManageReviews/ReviewHistory.jsx`): lists `GET /reviews/removed` with `removedBy/removedAt/removedReason/removedNote`, expandable per-review timeline via `GET /reviews/history/:id`. Routes `/adminDashboard/manageReviews/history` + `/modaratorDashboard/myReviews/history`. Reachable from ManageReviews header and dashboard navbar dropdown.
- **`useRole` hook** (`src/Hooks/useRole.jsx`): one `GET /users/me` → `{role,isAdmin,isModaretor,isUser,loading}` replaces triple `useAdmin/useModaretor/useUser` calls. `isAdmin` includes `superadmin`.
- **Main navbar (`Nabvar.jsx`):** uses `useRole`; profile dropdown closes on click-outside + Esc; added `Saved Scholarships` item. Kept filename typo (imports depend on it).
- **`AdminNavbar.jsx`:** `Log Out` now really calls `logOut()` + `navigate("/")`; avatar/initials fallback; dropdown header shows real `displayName + email + role` (was hardcoded `@Admin`); removed filler (language dropdown, Billing/Invite/Support) & `use client` + unused `Keyboard`; kept theme toggle + bell; added role-aware `Review History` link.
- **`AdminDashboard.jsx` sidebar:** removed dead `Widget`/`Application` sections (9 `NotFound` links); flat role-aware nav from `useRole`; role-aware settings link + avatar fallback + role label footer.
- Cleaned unused `ReviewCard` import in `ScholarshipDetails.jsx`.
- Verification: `npm run build` ok; lint clean for all touched files (residual lint errors are pre-existing elsewhere).

**In progress**
- None.

**Left / next**
- **Server Vercel deploy STILL BLOCKED** — `VERCEL_TOKEN` expired. All server code (`removed` status, `GET /reviews/removed`, `GET /reviews/history/:id`, auto-approve, `/users/me`) is on `main` but NOT live. Until deployed: `Remove` returns old-DELETE behavior risk & `/reviews/removed` will 404 → `ReviewHistory` shows empty/error. Rotate token then `npx vercel --prod --yes --token`.
- Manual smoke: remove a review → confirm it appears in Review History, rating recalcs.

**Decisions & context**
- Kept `Edit` on review card (admin typo fix > delete+recreate). History is a page not modal (audit-friendly, shareable). `FORM:` no API change needed client-side (`DELETE /allReviews/:id` already supports `{reason,note}` on `main`).

---

## 2026-09-01 — Scholarship transformation: unified card + faceted discovery + saved/compare

**What was done**
- Archived `TASKS.md` DONE → `docs/TASK_HISTORY.md` (`3eebf6d` client, `a811734` server).
- Server `Schole-hive-server/index.js:a811734`: `GET /allScholership` (+ aliases) faceted `q/category/subject/degree/country/city/maxFees/deadlineAfter/sort/page/limit` + pagination `{data,total,page,totalPages}` + indexes (`country+category+degree`, `subject`, `deadline`, `rating`, `fees`, `text`), secured `POST/PATCH/DELETE` with `verifyToken+verifyModaretor`, saved collection `POST/GET/DELETE /saved` + `GET /saved/check/:id` unique `(userEmail,scholarshipId)`, `GET /scholarships/stats` live counts (totalStipend/avgFees/byCategory/byCountry). Vercel deploy blocked — `VERCEL_TOKEN` invalid (`vcp_8h...` expired).
- Client `557e540`: new `src/Component/scholarship/` — `ScholarshipCard` (browse/manage/compact, `Intl.NumberFormat`, `CountdownBadge`, saved/compare, image fallback, `line-clamp-2`) replaces 85% duplicate `ScholarshipCard`/`ManageScholareCard`; `ScholarshipGrid`/`ScholarshipList` + `FilterChip` + `CountdownBadge` (`getDeadlineState` emerald/amber/rose). `useScholership` params-aware, `useSaved/useToggleSave/useScholarshipStats`.
- `AllScholership.jsx` rebuild: debounced `q` 400ms across 7 fields, faceted sidebar (category/degree/subject/country fee slider `0-2000`) + bottom-sheet mobile, chips `Clear all`, sort `recommended/deadline/rating/newest/fees`, Grid/List `12/10`, pagination `5` window, URL sync `?q=&category=&degree=&country=&maxFees=&sort=&page&view`, compare bar `≤4` + saved toggle (`PrivateRoute` gate). `EmptyState` fix (now `action` ReactNode).
- `TopScholarship` now `sort=rating limit 6` (not `slice(0,6)`), `Highlights` wired to `/stats` (live `total/ stipend/ apps/ pending`), `ScholershipStatic` rewritten from fake `24/1,284/$1.2M/2025` to `How it works` 3 steps + `Trending destinations` (`byCountry`) + `Why School-Hive` CTA.
- `ScholarshipDetails` (+251→~180 lines): `CountdownBadge` + save/share/compare (clipboard + `localStorage compareIds`), `eligibility/benefits/tags/duration` pills, `Intl` fees, expired guard `Admin Can't Apply`/`Closed`, breadcrumb.
- New routes `/compare` (`ids=a,b,c` side-by-side 4 + add more), `/saved` (`PrivateRoute`) + `/userDashboard/saved`, aliases `/scholarships`/`/scholarships/:id`; `ManageScholarships` unified manage card + search + `useAxiosSecure` delete; `Add/Edit` secured + new fields `currency/duration/eligibility/benefits/tags`, fix `masters→Masters` + `subjectName2` phantom, `serviceCharge` numeric cast.
- Verification: `npm run build 1.16MB` ok, `dev http://localhost:5173` (pid 16725) ok, `lint` pre-existing errors only.

**In progress**
- Nothing — discovery + saved/compare + details shipped.

**Left / next**
- Rotate `VERCEL_TOKEN` then `npx vercel --prod --yes --token "$VERCEL_TOKEN"` to publish server live (code on `main` but `https://server-six-vert.vercel.app` still old). Verify `GET /allScholership?q=oxford&country=UK&sort=deadline` + saved toggle + `/compare` smoke on live. `TASKS.md` BACKLOG still open (tests, `VITE_` server URL env, remaining card dedup, `zod` full form).

**Decisions & context**
- Kept misspelled `allScholership` + collection `scholership` for backward compat, added `/scholarships` aliases. Saved requires login (standard). Compare is client `localStorage` (no backend). Deadline countdown is `yyyy-MM-dd` string math (today 0). Build chunk 1.16MB unchanged (no heavy dep, only `zod` deferred).

---

## 2026-09-01 — Full-fledged user/admin profile (same component, role-aware authorities)

**What was done**
- Decided fields for best result: keep `name/email/photoURL`, add `phone/city/country/bio/skills[]/coverPhoto/createdAt` (remove dummy `Age/Georgia/113/12.2k/128/hardcoded 12 skills`). User and Admin share `MyProfile.jsx` (`2e37678`) — role-aware render via `useAdmin/useModaretor`.
- Server `Schole-hive-server/index.js:ab9b2c1`: `POST /users` now persists `photoURL/createdAt/updatedAt` + sync on dup, `GET /user` secured (`verifyToken+email===decoded` unless staff), `GET /users` staff-only, new `GET /users/me` + `PATCH /users/me` whitelist (`name/photoURL/coverPhoto/phone/bio/city/country/skills`) with 2-600 validation.
- Client `MyProfile.jsx` rewrite: cover `profileBg.jpg` fallback or `coverPhoto`, avatar `ring-4` upload via `imgbb` (`VITE_IMAGE_HOSTING_KEY` same as `AddScholarship`), role badge `Student|Moderator|Administrator|Owner` (`Crown/ShieldCheck/Award/GraduationCap`), stats `Applications/Reviews/Saved` (user) vs `Users/Scholarships/My Applications/Pending Reviews` (admin, via `/users`, `/allScholership`, `/reviews/stats`), tabs `About|Activity|Settings` (removed dead `edit/timeline/gallery/friends`), `About` = Personal Info + bio + skills chips + Contact + Admin authorities quick links (`Manage Users/Scholarships/Applications/Reviews`), `Activity` = recent `apply` (`StatusBadge`) + reviews (`Stars`), `Settings` = form `PATCH /users/me` + `updateUserProfile` sync + `toast` + `refetch`; loading `Spinner`, `motion` hero.
- Auth `Registation.jsx:39` + `Login.jsx:31` now send `photoURL` on `POST /users` so DB and Firebase stay synced (prior `photo` was dropped).
- Built `1.13 MB` (`vite build` ok), pushed `2e37678` to `main`, Firebase `✔ Deploy complete` to `https://scholarhive-913e4.web.app`. Server pushed `ab9b2c1` but Vercel `token invalid` still blocks live deploy (same `VERCEL_TOKEN` blocker).

**In progress**
- Nothing — profile feature complete.

**Left / next**
- Rotate `VERCEL_TOKEN` then deploy server; verify `PATCH /users/me` live. BACKLOG still open.

**Decisions & context**
- Same component for both roles keeps maintenance low; admin authorities shown as amber `Admin Panel` card only when `isAdmin||isModaretor`. Skills capped 20, bio 600, phone 30.

---

## 2026-09-01 — Fix navigation blank + upgrade react-router to 7.18.3

**What was done**
- Fixed white blank on Home → Scholarships navigation reported by user: root cause was `useScholership`/`useSingleScholership` queryKey including `user?.email` (cache thrash on auth load) + `AllScholership` derived state via `useEffect` race that could leave `filteredScholarships` empty during fast client navigation. Fixed `src/Hooks/useScholership.jsx:11` and `src/Hooks/useSingleScholership.jsx:6` to stable `queryKey` (`["scholership"]` / `["singleScholership", id]`), remove `useAuth`, add `staleTime`/`gcTime`; rewrote `AllScholership.jsx:8` to `useMemo` derive filtered from `searchTerm` (no effect). Also changed `MainLayout.jsx:56` `AnimatePresence mode="wait" → "sync"` + `initial={false}` so route transition never blocks render (was 250ms white flash that stuck if exit never fired). Verified `npm run build` (`1.11 MB` with router 7) and `npm run lint` (pre-existing errors only).
- Upgraded `react-router-dom` `6.23.0 → 7.18.3` (latest): `npm install react-router-dom@7.18.3`, added `future: { v7_startTransition:true, v7_relativeSplatPath:true }` to `createBrowserRouter` in `src/routes/Routes.jsx:32` and `future` to `RouterProvider` in `src/main.jsx:18`. Build passes.
- Commits `2d3fd98` (nav fix) + `8e78577` (router upgrade), both pushed to `School-Hive/main`, Firebase hosting deployed `✔ Deploy complete` to `https://scholarhive-913e4.web.app`.

**In progress**
- Nothing.

**Left / next**
- Manual verify live navigation Home→Scholarships without refresh; no further router work needed. Consider `npm audit fix` for 26 vulns (2 low/7 moderate) and updating `react` 18.2.0 → 19 if desired (2-year drift).

**Decisions & context**
- Kept misspelled path `allScholership` for backward compat (consistent across `Nabvar.jsx:63` + `Routes.jsx:43`); fixing spelling would require server collection rename.
- Chose minimal `future` flags only (not `v7_fetcherPersist` etc.) as those two are the ones that will become default in v7 and were flagged by `npm view` deprecation warnings.
- Did not bump `react`/`react-dom` to keep risk low; router 7 supports React 18.

---

## 2026-09-01 — Proper review system: verified-applicant, 1-per-scholarship, admin/mod queue

**What was done**
- Moved review system from open write/delete to verified moderation (your `accepted`-only gate, 1 per `(email, scholarship)`):
  - Server `Schole-hive-server/index.js` (`3e7cd5e`): added `verifyModaretor`, indexes `unique(reviewer_email,scholarShip_id)` + `(scholarShip_id,status)`, `recalcScholarshipRating` → `scholership.rating`/`reviewsCount`; `POST /addReviews` now `verifyToken+loadAuthUser`, validates 1-5/5-500, requires `apply.applicationStatus==="accepted"`, dup `409`, `status="pending"`+`isVerified`+`createdAt`; `GET /allReviews` enforces `email===decoded` unless staff + `status/q/scholarShip_id/page/limit` safe join; `GET /allReviews/:id` public now `approved` only; `DELETE` secured owner|staff + recalc; `PATCH /:id` owner edit → re-pending; `PATCH /:id/moderate` staff `approved|rejected|hidden|pending` + `moderatedBy/At`; `GET /reviews/stats` staff.
  - Client `5bfb60c` + `5755c74` + `6609a0e`: `useReviews` fix `queryKey` + `StatusBadge` `approved/hidden`, `ManageReview` queue with tabs Pending/Approved/Rejected/Hidden, search, bulk approve/reject, stats, `ReviewCard` verified shield + `StatusBadge` + checkbox + approve/reject/hide/edit/delete; `AddReview` now `useAxiosSecure`, pre-flight `apply` + dup check via `GET /allReviews?email&scholarShip_id`, blocked unless accepted, already-reviewed gate; `MyApplication` conditional star (accepted && not reviewed) + shield; `MyReviews` edit via `PATCH` re-queue.
- Built + pushed client `6609a0e`, deployed to `https://scholarhive-913e4.web.app` (`✔ Deploy complete`); built server ok (`node --check`), pushed `3e7cd5e` to `Schole-hive-server/main`.
- Updated `TASKS.md` with `Review System — Proper Moderation` DONE checklist (client + server).

**Blocker**
- Vercel deploy `Schole-hive-server` failed: `Error: The token provided via --token is not valid` (`VERCEL_TOKEN` in `School-Hive/docs/CREDENTIALS.md:15` is expired/invalid). Server code is pushed to `main` but live `https://server-six-vert.vercel.app` still old until token rotated. Firebase hosting succeeded.

**In progress**
- Nothing — review system feature complete.

**Left / next**
- Rotate `VERCEL_TOKEN`, then `npx vercel --prod --yes --token "$VERCEL_TOKEN"` from `Schole-hive-server` to publish. Verify `POST /addReviews` 403 gate + 409 dup + moderation flow on live.
- `BACKLOG` still open (tests, env var for server URL, etc.).

**Decisions & context**
- Chose `accepted`-only gate (not `pending`) per your final confirmation — mirrors Amazon `Verified Purchase`; trade honest negative still allowed but only from verified. Moderation stays light: human tabs, not ML.
- Kept single `ReviewCard` component reused by `MyReviews` (owner edit) and `ManageReview` (staff queue) via conditional `onApprove` prop.
- Edit from owner re-sets to `pending` (re-moderate); staff edit keeps status — preserves trust.

---

## 2026-09-01 — UI Redesign checklist completed; all remaining components shipped

**What was done**
- Completed the remaining 14 items in `TASKS.md` "UI Redesign — Component Checklist" that were `[ ]` at session start. Each was handled in the required order: checklist → commit → push → Firebase deploy, with `dist/` rebuilt and `https://scholarhive-913e4.web.app` verified after every push:
  1. `src/Pages/AddReview/AddReview.jsx` — `003f676` — star-rating UI, gradient university header, `FormField` + `react-hot-toast`, framer-motion fade-in, responsive meta row; build+deploy OK.
  2. `src/Layout/ModaratorDashboard.jsx` — `df89f1c` — rebuilt to match `UserDashboard` pattern (sticky sidebar, gradient header, avatar card, horizontal mobile tabs, `FaUserShield`/`FaThList` icons, brand-50 active states).
  3. `src/Pages/ModaratorPages/AddScholarship/AddScholarship.jsx` — `a2ab6ae` — unified with `Apply` form (gradient header, `SectionTitle`, `FormField`, rounded-2xl card, fees breakdown, DatePicker drawer, toast, submitting state).
  4. `src/Pages/ModaratorPages/ManageScholarships/ManageScholarships.jsx` — `7537695` — `PageHeader` + `EmptyState` + staggered `framer-motion` grid, refactored Swal to brand colors.
  5. `src/Pages/ModaratorPages/ManageScholarships/ManageScholareCard.jsx` — `d1b8af3` — mirrors `ScholarshipCard` (gradient overlay, rank pill, `Stars`, view/edit/delete icon buttons).
  6. `src/Pages/ModaratorPages/ManageScholarships/EditScholarship.jsx` — `1d488a1` — same shell as AddScholarship but with prefilled data, controlled selects, optional image upload, toast + navigate.
  7. `src/Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship.jsx` — `86c5af4` — table with `PageHeader`/`StatusBadge`/`EmptyState`, brand confirm dialogs, responsive pill statuses.
  8. `src/Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard.jsx` — `6d2470b` — `PageHeader`+`StatusBadge`+fee-summary card, grid info rows with brand icon pills, `Spinner` loading.
  9. `src/Layout/AdminDashboard.jsx` — `bf4fd1d` — branded sidebar (gradient header, `brand-50`/`brand-600` active states, `slate-50` background, rounded-xl nav).
  10. `src/Layout/AdminNavbar.jsx` — `e74a4fe` — slate/brand palette, rounded-xl inputs, soft shadows, avatar ring.
  11. `src/Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication.jsx` — `87f063f` — cloned polished moderator table for admin route.
  12. `src/Pages/AdminPages/ManageUsers/ManageUsers.jsx` — `7249ea5` — `PageHeader` table with role badges (`superadmin`/`admin`/`modaretor`), brand action pills, lock for owner.
  13. `src/Pages/AdminPages/ManageReviews/ManageReview.jsx` — `6f1bbfc` — `PageHeader` + staggered grid, empty state.
  14. `src/Pages/AdminPages/ManageReviews/ReviewCard.jsx` — `1885aff` — soft card with `Stars`, avatar gradient, date/hash pills, rose delete button.
- Restored deleted `.env.example` before first commit (`git restore`).
- Verified Firebase Hosting token from `docs/CREDENTIALS.md` now succeeds (previous `401` from 2026-08-31 is resolved; all 14 deploys returned `✔ Deploy complete` to `scholarhive-913e4`).
- `TASKS.md` checklist is now 100% `[x] Done`; `IN PROGRESS` is clear.

**In progress**
- Nothing. Checklist fully complete.

**Left / next**
- `TASKS.md` BACKLOG remains (tests, env-var server URL, centralize duplicated cards, client-side validation). Those are independent of the UI redesign and can be tackled next.
- Verify live site `https://scholarhive-913e4.web.app` manually for auth round-trip (`/jwt`) and role dashboards, and run `npm run lint` (pre-existing `prop-types`/`unescaped-entities` errors unrelated to this pass).
- Server repo `Schole-hive-server` was untouched (no UI change needed a backend field).

**Decisions & context**
- Kept all data contracts intact — visual/UX only, no logic rewrite; reused Tailwind + daisyUI + `framer-motion` + `lucide-react` + existing primitives (`PageHeader`, `FormField`, `StatusBadge`, `EmptyState`, `Stars`, `Spinner`).
- Moderator and admin tables share the same table/card pattern for consistency; `AddScholarship`/`EditScholarship` share the `Apply` form shell.
- Build size remains ~1.05 MB JS / ~146 KB CSS (`vite build` warnings about chunk size are pre-existing).

---

## 2026-08-31 — Public navigation redesign pushed; Firebase deploy blocked

**What was done**
- Added the `UI Redesign — Component Checklist` to `TASKS.md` because it did not exist.
- Refreshed `src/Pages/Sheard/Nabvar.jsx` with stronger active states, gradient brand styling, responsive mobile navigation, improved avatar fallback, and clearer signed-in affordances. Functionality and routes were preserved.
- Pushed the visual change to `main` in commit `85f00268a7ba972f1a6129075d81060838373e75`.
- Added the explicit Firebase hosting site to `firebase.json` in commit `6b3b94c4dc9c7f86f03f578a6746369775cb7611` so the current Firebase CLI can resolve the hosting target.
- Production build passes using a temporary safe dependency resolution. The repository's normal install is blocked by the package firewall rejecting the lockfile's `websocket-driver@0.7.4`; lint still reports pre-existing errors outside this unit.

**In progress**
- Navigation remains `[~]` until the required Firebase deploy completes.

**Blocker**
- Firebase Hosting deploy reaches project `scholarhive-913e4` but returns HTTP 401: the token in `docs/CREDENTIALS.md` is invalid or expired. Do not paste a replacement credential into chat; repair the repo's deployment credential through the appropriate secure channel, then rerun the documented hosting deploy.

**Left / next**
- After Firebase deployment succeeds, mark navigation `[x]`, commit/push the checklist state, and continue with `src/Layout/MainLayout.jsx`.

---

## 2026-08-31 — Deploy credentials moved into the repo

**What was done**
- Per owner decision, deploy credentials are now committed directly in `docs/CREDENTIALS.md` (plaintext). Credentials stored outside the repo did not persist across session environments, breaking the continuity system's purpose.
- Updated `docs/CREDENTIALS.md`, `docs/DEPLOY.md`, `AGENTS.md`, and the `session-handoff` skill to use the in-repo values directly (no more sourcing `~/.config/school-hive/deploy.env`).
- Mirrored the same changes in the server repo (`../Schole-hive-server/docs/CREDENTIALS.md` and `docs/DEPLOY.md`).

**Decisions & context**
- `docs/CREDENTIALS.md` is now the single source of truth for deploy tokens (Vercel + Firebase). The owner accepted the risk of committing them to this low-stakes test repo. Do NOT assume this pattern is safe for production.
- The old external file `~/.config/school-hive/deploy.env` may still exist in some environments but is no longer the source of truth. `deploy.env` remains gitignored as a safety net.

**In progress**
- Nothing. Baseline established.

**Left / next**
- See `TASKS.md` BACKLOG.

---

## 2026-08-31 — Session-continuity system setup

**What was done**
- Created the session-continuity system: `AGENTS.md`, `TASKS.md`, `docs/HANDOFF_LOG.md`, `docs/DEPLOY.md`, `docs/CREDENTIALS.md`, and a `session-handoff` skill under `.ai-ready/skills/`.
- Baked standing working rules into `AGENTS.md`: commit after every small unit of progress, push after every commit, and emergency commit+push before running out of token budget (with continuity files updated first).
- Hardened `.gitignore`: added `deploy.env`, `*.pem`, `*.key`, `.firebase/`, and an explicit `!.env.example` keep-rule.

**Decisions & context**
- Chose the `AGENTS.md` convention (used by opencode, Cursor, Claude Code) as the single always-loaded rules file, with `TASKS.md` + `docs/HANDOFF_LOG.md` as the state/narrative, and a `session-handoff` skill as the ritual future agents load on start.
- NOTE (superseded): deploy tokens were initially stored at `~/.config/school-hive/deploy.env` outside the repo, but are now committed directly in `docs/CREDENTIALS.md` per the owner's decision (see entry above).
- The client had no test framework; `npm run lint` is the main gate. Builds via `npm run build`.

**In progress**
- Nothing. Baseline established.

**Left / next**
- See `TASKS.md` BACKLOG for candidate work (no automated tests, server URL hardcoded in axios hooks, duplicated card components, etc.).

---

_(older entries go below — none yet; this is the first session recorded)_
