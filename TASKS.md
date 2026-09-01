# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

---

## IN PROGRESS

- E2E smoke test of login/roles vs `localhost:5000` — **blocked**: `Schole-hive-server/.env` not yet created (user must add MONGO/DB creds + ACCESS_TOKEN_SECRET + ADMIN_EMAILS).

## DONE — Deploy Guard: no more localhost leaks (2026-09-02)

- [x] `scripts/check-dist-server-url.mjs` — scans `dist`; **fails** if any `localhost:<port>`/`127.0.0.1:<port>` survives or if the Vercel URL is missing
- [x] `scripts/prod-build.mjs` — forces `VITE_server_url=https://server-six-vert.vercel.app` (ignores dev `.env`), builds, then runs the check
- [x] `scripts/deploy.mjs` — guarded build + `firebase deploy` (token read from `docs/CREDENTIALS.md`)
- [x] `package.json` → `build:prod` + `deploy`; `npm run build` remains DEV-ONLY (bakes localhost:5000)
- [x] Verified: dev build fails the guard (exit 1, `localhost:5000` found); `build:prod` passes (0 local refs, Vercel URL present)
- [x] `docs/CREDENTIALS.md` — fresh `VERCEL_TOKEN` (validated: HTTP 200, accesses project `server`); `npm run deploy` usage
- [x] `docs/DEPLOY.md` rewritten — localhost-trap section, guarded deploy, server = push to `main` auto-deploy (Vercel already GitHub-linked)
- [x] GitHub push protection allowlisted for the token (owner clicked Allow); pushed `3463a0e`
- [x] Server repo docs aligned (`6207508`): deploy = push to `main`; creds live in client repo

## DONE — Role Portals, Institution Signup & Approvals (2026-09-02)

- [x] **3-role login** (`Login.jsx`): Student / Staff / Institution portal picker, password show-hide, inline forgot-password (reset email), busy states, role-routed post-login via `waitForToken` + `GET /users/me` + `dashboardForRole`; Google sign-in posts `accountType: student`
- [x] **Registration split** (`Registation.jsx`): Student vs Institution selector; institution collects org fields (orgName/orgType/orgCountry/orgWebsite/orgDescription) → `accountType:"institution"` → pending → `/pendingApproval`; SocialLogin only for students
- [x] **New pages/guards**: `PendingApproval` + `RejectedApproval` (`InstitutionStatus.jsx`), `InstitutionRoute` (approved-institution only), `SuperAdminRoute` (owner-only scholarship/approvals)
- [x] **Routes**: `/pendingApproval`, `/rejectedApproval`, `/institutionDashboard/*`; scholarship CRUD stripped from admin/mod dashboards; admin scholarship + `institutionApprovals` wrapped in `SuperAdminRoute`
- [x] **Dashboards/nav role-aware**: `AdminDashboard` sidebar (institution profile/add/manage/applications; superadmin + approvals; admin/mod lose scholarship items), `AdminNavbar` (institution label, review-history hidden for institutions), `Nabvar` (institution dashboard link + status link)
- [x] **Approvals page** (`InstitutionApprovals`): pending/approved/rejected tabs, approve, reject-with-reason, move-to-pending; `ManageUsers` shows institution + status badges
- [x] **`useRole` extended**: `status`, `me`, `isSuperAdmin`, `isInstitution`, `isApprovedInstitution`, `isPending`, `isRejected`; `MyProfile`/`PublicProfile` roleMeta + institution badge
- [x] **AuthProvider**: `sendResetPassword` (Firebase password reset) exposed
- [x] New helpers: `waitForToken.js`, `dashboardForRole.js`, `friendlyAuthError.js`
- [x] Lint-clean for touched files (pre-existing AuthProvider + PublicProfile warnings untouched); `npm run build` passes (localhost baked — dev only)
- [x] Committed `f0e683c`, pushed `origin/feature/login-roles`

## DONE — Review + Navbar Refactor (2026-09-01)

- [x] **Manage Reviews simplified** — removed category tabs (All/Pending/Approved/Rejected/Hidden/Removed) & `activeTab`; now queries fixed `status=approved` only (auto-approve model); header shows `total/approved/removed` + single `View History` link; removed bulk approve/reject & per-card history; kept Search + per-card `Remove` (with required reason + note) + `Edit` (typo fix)
- [x] **ReviewCard slimmed** — deleted `Approve/Reject/Hide` branches (dead on live server, `/moderate` 404) and per-card `View history` button; keeps `Remove` + `Edit` + avatar fallback + clickable profile; still supports `MyReviews` (owner delete+edit)
- [x] **New `ReviewHistory` page** — `GET /reviews/removed` list w/ reason/removedBy/removedAt/note + expandable per-review timeline via `GET /reviews/history/:id`; routes `/adminDashboard/manageReviews/history` + `/modaratorDashboard/myReviews/history`; accessible from ManageReviews header + dashboard navbar dropdown
- [x] **`useRole` hook** — consolidates 3 role queries (`useAdmin/useModaretor/useUser`) into one `GET /users/me` call returning `{role,isAdmin,isModaretor,isUser,loading}`
- [x] **Main navbar** — single `useRole`, click-outside + Esc to close profile dropdown, added `Saved Scholarships` dropdown item
- [x] **AdminNavbar** — `Log Out` now really calls `logOut()` + navigate `/`; avatar/initials fallback; header shows real `displayName + email + role` (not `@Admin`); removed filler (language dropdown, Billing/Invite/Support), kept theme + bell, added role-aware `Review History` link; removed `use client` + unused import
- [x] **AdminDashboard sidebar** — pruned dead `Widget`/`Application` sections (9 NotFound links); flat role-aware nav (`admin/mod/user` submenus rendered directly); role-aware settings link + avatar fallback + role label in footer
- [x] Lint-clean for touched files; `npm run build` passes

## DONE — Scholarship Transformation (2026-09-01)

- [x] Phase 0 — Archive DONE → `docs/TASK_HISTORY.md` (both repos)
- [x] Phase 1 — Server: faceted `GET /allScholership` (+ aliases), pagination `{data,total,page,totalPages}`, indexes, secured writes `verifyToken+verifyModaretor`, saved collection `POST/GET/DELETE /saved`, `GET /scholarships/stats`, schema `eligibility/benefits/duration/tags/currency` (pushed `a811734`, Vercel token blocked)
- [x] Phase 2 — Unified `ScholarshipCard` (browse/manage/compact) + `ScholarshipGrid/ScholarshipList` + `CountdownBadge` + `FilterChip`; `useScholership` params-aware + `useSaved/useToggleSave/useScholarshipStats`; `AllScholership` rebuilt (debounced q `400ms`, facets drawer/bottom-sheet, chips, sort `recommended/deadline/rating/newest/fees`, Grid/List, pagination 12/10, URL sync `?q=&category=&degree=&country=&maxFees=&sort=&page&view`, compare bar 4, saved toggle, `EmptyState` fix); `TopScholarship` rated sort + `Highlights` wired to `/stats` + `ScholershipStatic` rewritten to How it works + trending destinations
- [x] Phase 3 — `ScholarshipDetails` countdown + save/share/compare + eligibility/benefits/tags pills + `Intl.NumberFormat` + expired guard; new routes `/compare` + `/saved` + `/userDashboard/saved` + aliases `/scholarships/*`; `SavedScholarships` + `Compare` pages
- [x] Phase 4 — `ManageScholarships` unified card + search + `useAxiosSecure` delete; `AddScholarship/EditScholarship` secured (`useAxiosSecure`), new fields `currency/duration/eligibility/benefits/tags`, fix `masters→Masters` + `subjectName2` drop, `build 1.16MB` ok, dev `http://localhost:5173` ok

---

## BACKLOG / KNOWN GAPS

- [ ] E2E smoke test of login-roles vs `localhost:5000` — needs `Schole-hive-server/.env`.
- [ ] Merge `feature/login-roles` → `main` (both repos) to go live: Vercel auto-deploys server, then `npm run deploy` for client.
- [ ] Add automated tests (no test framework — `npm test` undefined).
- [ ] Centralize remaining duplicated cards (application/review).
- [ ] Accessibility & responsive polish for Home/hero.
- [ ] Consider `zod` validation centralization for `ScholarshipForm` dedup (partial done — fields added but not full `zod`).
