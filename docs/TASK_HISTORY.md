# TASK_HISTORY.md — School-Hive (client) — Archive

Completed work moved from `TASKS.md`. `TASKS.md` stays lean (IN PROGRESS / TODO / BACKLOG). Newest completed block at top.

> **For new agents:** When a `## TODO — <Group>` batch in `TASKS.md` is fully `[x]` completed, move the entire batch here (newest at top) and keep `TASKS.md` lean.

---

## 2026-09-04 — Profile System Redesign (Quora-inspired, premium, imgbb) — Completed Batch Moved

> **Context:** Full redesign of user profile system extending the existing working app (do not rebuild). Fix `null`/blank rendering bug, adapt Quora UX principles (hierarchy, credibility signals, progressive disclosure, graceful empty states) to School-Hive's real content model (scholarships, applications, reviews, saved, Q&A questions/answers, follows, institution org data).
> **Decisions locked:** Keep native `mongodb` driver (no Mongoose). Media via existing `imgbb` URL pipeline (no new multer/cloudinary). Schema `headline`/`coverPhoto`/`socials` already exist — no hard new fields unless genuinely fitting; backend validation hardened via manual `profile.validator.js` (no new lib). Design reuses `tailwind.config.js:brand/daisyUI schoolhive/Sora/shadow-soft` (no new visual style).
> **Tab decision:** `Overview` default for all visitors (premium first impression); returning owners with data land on `Overview` with activity preview + deep tabs — `Activity`/`Q&A`/`Saved` as secondary tabs, not default (keeps hero hierarchy clean; `Education`/`Achievements` remain subtabs/sections within Overview on mobile via accordion). Sticky `rounded-full ring-1` pill bar stays.

### Phase 3 — Fix the Empty-Field Bug

- [x] **3.1 Reusable empty-value guard** — Create `src/utils/hasValue.js` (`hasValue(v)` true if `v != null && String(v).trim()!==""` && array `length>0 && some(hasValue)` && object has any child hasValue; treats `0` as value via `??` not `||`) + `src/Component/ui/OptionalField.jsx` + `src/Component/profile/Section.jsx` (`<Section title icon emptyHint isOwner onAdd>` hides whole section when empty; owner sees subtle `+ Add your bio` CTA, visitor sees hidden). Verify: `hasValue(null)===false`, `hasValue("")===false`, `hasValue([])===false`, `hasValue([null])===false`, `hasValue(0)===true`, `hasValue({city:"",country:null})===false`, Section hides with empty array, renders with CTA when `isOwner`.
- [x] **3.2 Apply guard to 16 render sites** — (a) `src/Component/profile/ProfileHeroV2.jsx:45,47,48,52` headline/location/joined/socials/stats; `src/Component/profile/Sidebar.jsx:22-47` contact/member; `src/Component/profile/AboutSection.jsx:22,42` bio/skills. (b) `src/Component/profile/TimelineSection.jsx:23-109` 5 timelines + `src/Component/profile/GalleryStrip.jsx:4-44` + `src/Component/profile/SocialLinks.jsx:10-29`. (c) `src/Pages/UserPage/MyProfile/MyProfile.jsx:271-295` bio/skills/headline/org fields + tabs `310-342` empty placeholders + stats `230-248` numeric `??` fix; `src/Pages/PublicProfile/PublicProfile.jsx:101-114`. (d) Chrome/QA/scholarship: `src/Component/QA/AuthorBlock.jsx:11-40`, `src/Pages/Sheard/Nabvar.jsx:187-196`, `src/Layout/AdminDashboard.jsx:152-162`, `src/Layout/AdminNavbar.jsx:127-203`, `src/Pages/ScholarshipDetails/AllReviews.jsx:24-33`, `src/Pages/AdminPages/ManageReviews/ReviewCard.jsx:20-57`, `src/Pages/ScholarshipDetails/ScholarshipDetails.jsx:136,148`, `src/Component/scholarship/ScholarshipCard.jsx:54`, `src/Component/scholarship/details/SummaryCard.jsx:36` + `src/Component/profile/TimelineSection.jsx:44` fix `e.org + " • "` → `[e.org,e.location].filter(Boolean).join(" • ")` and city/country joins → `.filter(Boolean).join(", ")`. Pass `isOwner` (compare `dbUser.email` vs `authUser.email`); visitor hides, owner shows CTA linking to edit modal tab. Verify: profile with all optionals empty shows no literal `null`/`null, null`/`null •` in DOM (`grep -r "null" dist` 0 + visual), visitor empty sections hidden, own empty sections show `+ Add` prompts.
- [x] **3.3 Array/nested safety** — Empty arrays (`education[]`, `experience[]`, `certifications[]`, `achievements[]`, `gallery[]`, `languages[]`, `interests[]`) hide whole list container not just list; nested objects (`context`, `socials`) hide when all leaves empty. Verify: `education=[]` hides `EducationTimeline` wrapper, `socials={linkedin:null,...}` hides `SocialLinks`.

### Phase 4 — Redesign Profile UI (Quora-inspired, premium, responsive)

- [x] **4.1 Profile header — cover + avatar premium layout** — New `src/Component/profile/ProfileLayout.jsx` wrapping hero: full-bleed cover (`coverPhoto || profileBg.jpg`), overlapping circular avatar `-mt-12 ring-4 shadow-lift` (imgbb upload via `VITE_IMAGE_HOSTING_KEY` same as `MyProfile handleSave` + `AddScholarship`), name (`|| "Anonymous"`) + inline `RoleBadge` + verified `ShieldCheck` + online dot, one-line `headline` (italic `line-clamp-1`, hide if empty via `hasValue`), location `filter(Boolean).join`, joined `month short year`, top-right actions `Edit Profile` (own) vs `Follow/Following + Share` (visitor, `useFollow`), completeness donut `CompletenessMeter` own only, sticky pill tab bar `rounded-full ring-1 ring-slate-100` `overflow-x-auto`. Reuse `brand-600`, `shadow-soft/lift`, `Sora`. Verify: cover fallback, avatar initials, verified badge, actions correct per `isOwner`, tabs sticky, mobile single-column.
- [x] **4.2 Stats row — real metrics only** — New `src/Component/profile/StatsRow.jsx`: Student `Applications | Reviews | Saved | Followers | Following | Questions | Answers` (from `GET /users/me/stats:329` + `GET /users/public/:email/stats:369` + `GET /questions?authorEmail` + `GET /saved`/`useSaved`), Institution `Scholarships Created | Applicants | Students | Followers` (via `useMeStats`/`usePublicStats` + `GET /allScholership?createdBy`), Admin/Mod `Users | Scholarships | Pending Reviews` (already in `MyProfile statsData`); each count `?? 0` + clickable `Link` to dashboard/search; `overflow-x-auto` scroll chips on mobile, `null` stats hide tile via `hasValue` (no `0||—` bug). Verify: counts match live API, no invented fields, institution vs student vs staff variants correct.
- [x] **4.3 About/bio + highlights** — Redesigned `src/Component/profile/AboutSection.jsx` + `src/Component/profile/Sidebar.jsx` integration: bio `whitespace-pre-wrap` + expand `180 chars ...more`, skills/interests pills (`brand-50`/`slate-50`), languages `name • level`, joined card, contact card (mailto phone location website via `SocialLinks`), all gated by `Section` (owner CTA, visitor hidden). Verify: empty bio shows CTA own / hidden visitor, expand toggles, pills hide when empty.
- [x] **4.4 Credentials timeline — education/experience/certs/achievements** — Refine `src/Component/profile/TimelineSection.jsx` + `src/Component/profile/GalleryStrip.jsx`: per-row icon + `line-clamp-3` + edit pencil `+ Add` inline CTA owner (opens edit modal step 3), visitor hidden; `GalleryStrip` 2–3col grid + YouTube `extractYouTubeId` embed else link, empty `return null` visitor / `+ Add gallery` owner. Verify: empty `education` hides card visitor, shows CTA owner; `e.school` empty title hidden not blank card.
- [x] **4.5 Tabbed feed — Overview/Activity/Q&A/Saved/Students + Settings** — Rework `src/Pages/UserPage/MyProfile/MyProfile.jsx` + `src/Pages/PublicProfile/PublicProfile.jsx`: tabs `Overview (About+Gallery+Highlights+Activity preview+StatsRow)` default for all, `Education & Experience`, `Achievements`, `Activity` (Applications+Reviews via `ActivitySection`), `Q&A` (Questions via `GET /questions?authorEmail` + Answers via new `GET /answers?authorEmail` if needed), `Saved` (own only via `useSaved`), `Students` (institution via `InstitutionStudentPortal`), `Settings` (`PreferencesPanel`). Left `lg:grid-cols-[1fr_340px]` (feed + Sidebar+Gallery), mobile accordion/single-col, skeletons + error retry, `framer-motion` `opacity 0 y 8`. Verify: Overview default, tabs filter correct collections, Saved hidden for visitors, Students only for `isInstitution`.
- [x] **4.6 Edit profile flow — 4-step imgbb wizard polish** — Polish existing `MyProfile` steps 1–4 (Identity/Bio/Links, Bio&Links, Timeline, Institution): cover/avatar upload via `https://api.imgbb.com/1/upload?key=${VITE_IMAGE_HOSTING_KEY}` (same as `handleSave:367-372`), `split(",").map(trim).filter(Boolean)` for skills/interests/gallery, `String(x).trim()||null` for optionals, `PATCH /users/me` → `updateUserProfile` Firebase sync + `refetch`, validation `name.length>=2 195`, preferences merge via `PreferencesPanel`. Keep existing guard, add inline field validity hints. Verify: save round-trips to `GET /users/me` and reflects in `ProfileLayout`, empty→null coalesce keeps hides, gallery 6 URL limit.

### Phase 5 — Backend Changes

- [x] **5.1 Schema — keep additive, no breaking migration** — No required new fields; `headline(120)`, `coverPhoto(2000)`, `socials{linkedin,twitter,github,website}(300)`, full `education/experience/certifications/achievements/gallery/videoIntro` already exist (see `Schole-hive-server/src/controllers/user.controller.js:67-170` + `patchMe allowed:443` + `computeCompleteness:5-31`). Propose only if fitting: no `pronouns`/`locationPublic` without prompt — leave optional. Document `isVerified` (global) vs `verified` (institution) distinction. Existing `null`s stay valid, no backfill. Verify: `db.users.findOne({email})` with `null` optionals stays valid, no migration script needed.
- [x] **5.2 GET endpoints — clean public data** — Keep `GET /users/me` full doc (own) + `GET /users/public/:email` via `pickPublic:259-306` with `preferences.visibility==="private"` minimal + `GET /users/public/:email/stats` respecting `showStatsOnPublic` (already at `user.controller:316,369`); no new endpoint. Ensure `follows` counts via `getPublicStats`. Verify: `GET /users/public/:email` with `visibility=private` returns `{_id,name,photoURL,role,headline}` only, `GET .../stats` respects `showStatsOnPublic`.
- [x] **5.3 Validation hardening — profile.validator.js** — Extract inline `patchMe:447-597` into `Schole-hive-server/src/utils/profile.validator.js` (`validateProfilePatch` returns `{valid,errors,data}` reusing Q&A validator pattern), keep `allowed` whitelist 35 fields, add URL check via `new URL()` for `photoURL/coverPhoto/gallery/orgGallery/orgVideoUrl/orgBrochureUrl/orgMapUrl/videoIntro/socials/*` (like `answer.validator:3`), keep length caps `2000/500/600/120/80/30`, `toArrayLimit` 20/12/6/5, reuse `imgbb` URL acceptance. Wire into `PATCH /users/me:442` with `400 {errors}`. No new dep (no `zod`/`joi`). Verify: `PATCH /users/me {photoURL:"not-a-url"}` → 400, `PATCH {bio: "x".repeat(601)}` → 400, valid patch → recomputes `completeness:603`.
- [x] **5.4 Upload pipeline — reuse imgbb** — Keep URL-string storage (no `multer`/`cloudinary`/`S3`); imgbb client upload in `MyProfile` already posts `https://api.imgbb.com/1/upload` with `VITE_IMAGE_HOSTING_KEY` and stores returned URL via `PATCH /users/me`. Document env `VITE_IMAGE_HOSTING_KEY` required for local dev. Verify: avatar/cover upload returns `display_url` and persists after `PATCH /users/me`.

### Explicitly excluded

- No Mongoose, no new upload lib, no mock/hardcoded profile data, no new required schema fields, no existing route breaks.

---

## 2026-09-03 — Q&A Forum V1 Complete (13/13) + Q&A Redesign Merged & Deployed

- **Q&A redesign (feature/qa-redesign → main d81864f / server 5c8e19f+05a5bdb)** — markdown rendering (`react-markdown` + `remark-gfm` + `@tailwindcss/typography`, `MarkdownBody` — bold/images/tables/code parse), `answerCount` denormalized + backfill, Detail overhaul (AuthorBlock via `/users/public/:email`, upvote-only question rail, sort tabs accepted pinned, `RichTextEditor` + source chip, Related rail, skeletons, share), Browse overhaul (list-first workspace header, category pills, sort, mobile drawer, Trending removed), legacy `/questions/ask-legacy` + `QuestionForm` deleted. Guarded build 60–62 files, lint passing, merged + deployed Firebase/Vercel.
- **Task 1 — Question collection** — `questions` + 8 indexes (`category`, `context.*`, `authorEmail+createdAt`, `createdAt`, `acceptedAnswerId`, `questions_text_idx`), `qa.constants.js` 7 categories + 60 tags + 4 languages, `question.validator.js`.
- **Task 2 — Answer collection + reputationEvents** — `answers` + `reputationEvents` collections + indexes + `users.reputation=0`/`isVerified=false` backfill + `pickPublic` expose + anonymize on delete + `answer.validator.js` + `reputation.js` (POINTS, DAILY_CAP 50).
- **Task 3 — Server CRUD Questions** — `question.service.js` (`buildQuestionFilter`/`buildQuestionSort`), 5 handlers `POST /questions`, `GET /questions` paginated `?q=&category=&tag=&dest=&home=&studyLevel=&sort=&page=&limit=`, `GET /questions/:id` (+answers/accepted/viewCount), `PATCH`/`DELETE` owner|staff.
- **Task 4 — Answers, voting, reputation** — `POST /questions/:id/answers` (+3 sourceLink, +5 first-tag), `PATCH /questions/:id/accept` (+15 asker-only), `POST /answers/:id/upvote` (+10, self 400, dup 409), `POST /answers/:id/downvote` (reason enum, rep ≥125) + `reputationEvents` write-through + daily cap.
- **Task 5 — Ask Question flow** — `/questions/ask` + `AskQuestionWizard` + `qa.js` constants + `QuestionForm` (title nudge, markdown+imgbb, category/tags 1–5 autocomplete, context 4 fields, language pills) + `RoleBadge` Staff/Institution.
- **Task 6 — Detail + Answering + Accept** — `/questions/:id` header badges + viewCount + answers accepted-first + `AnswerForm` + `AnswerCard` (badge, MarkdownBody, vote, accepted border) + `CommentThread`.
- **Task 7 — Voting UI + reason-tagged downvote** — `AnswerCard` ▲/▼ + rep gate 125 + modal `outdated|unsourced|off-topic|incorrect` + toast + invalidate.
- **Task 8 — Search + Browse + Filters** — `BrowseQuestions.jsx` debounced `q` 400ms + `GET /questions` filters `?q=&category=&tag=&dest=&home=&studyLevel=&sort=&page=&view=` URL sync + grid/list + FiltersBar.
- **Task 9 — Duplicate-detection panel** — `DuplicatePanel.jsx` debounced `GET /questions?q=title&limit=5` top 5 + `AskQuestion` integration + body nudge.
- **Task 10 — Points + starter badges** — question +2 `upvoterIds`, `ProfileHeader` reputation + `BadgeRow` 4 badges, `QuestionDetail` upvote button, daily cap 50.
- **Task 11 — Verified badge flow** — `verifyRequests` collection + indexes + `verify.controller.js` (`POST` pending, `GET /me`, `GET` superadmin, `PATCH` approved→`isVerified:true`) + `VerifyRequest.jsx` (imgbb) + `VerifyApprovals.jsx` SuperAdmin.
- **Task 12 — SEO QAPage** — `QAPageSchema.jsx` `@type QAPage` + `mainEntity` + `acceptedAnswer`/`suggestedAnswer`/`author`/`upvoteCount`/`datePublished`.
- **Task 13 — Founding-cohort seeding checklist** — `docs/QA_SEEDING_CHECKLIST.md` ops-only (corridor BD→CA provisional, 15–25 founders, 100–300 Q&A, 7 categories ≥10, Verified badges, launch readiness).
- Q1–Q9 resolved (roles open, separate `verifyRequests`, dual reputation, 45-tag vocab, 7 categories, cap 50, immediate sourceLink, Mixed language, BD→CA corridor provisional).
- Deployed: client `d81864f` → `https://scholarhive-913e4.web.app`, server `5c8e19f`+`05a5bdb` → `https://server-six-vert.vercel.app` (manual `npx vercel --prod --yes`).

---

## 2026-09-02 — Perf & Pipeline Hardening

- Code-split routes (`Routes.jsx`): 23 pages lazy-loaded via `React.lazy` + `Suspense` (`RouteFallback` spinner); initial bundle 1.23MB -> 235KB vendor + 178KB main + on-demand chunks (66% cut, verified `npm run build` split output)
- Vite manualChunks (`vite.config.js`): vendor / query / ui / firebase chunks, chunkSizeWarning 600
- ESLint pipeline fixed (`.eslintrc.cjs`): disable `react/prop-types` (no prop-types lib), `no-console`/`no-empty`/`react-refresh`/`exhaustive-deps` off; cleaned 33 stale `eslint-disable` comments; `npm run lint` now passes with --max-warnings 0
- QueryClient hardened (`main.jsx`): retry 1, stale 5m, gc 10m, refetchOnWindowFocus false; root `ErrorBoundary`
- New UI primitives: `ErrorBoundary.jsx` + `RouteFallback.jsx`
- Fixes: `UserDashboard` desktop nav restored (was unused navList), `ProfileHeader` unused email, `AllScholership` unused motion, `ScholarshipDetails` unused Banknote/CalendarDays, `SavedScholarships` unused Trash2, `Gallery` empty block
- Security: `npm audit fix` 27->3 vulns (remaining esbuild/vite requires breaking vite 8)
- Server (`index.js`): json limit 100kb, security headers (nosniff/DENY/XSS/Referrer/Permissions), rate limiter POST /jwt 20/min/IP (429)
- Commits `cb2dc56` client + `0acbbfe` server, pushed to `feature/login-routes`

## 2026-09-02 — Role Portals, Institution Signup & Approvals

- 3-role login (`Login.jsx`): Student / Staff / Institution portal picker, password show-hide, inline forgot-password (reset email), busy states, role-routed post-login via `waitForToken` + `GET /users/me` + `dashboardForRole`; Google sign-in posts `accountType: student`
- Registration split (`Registation.jsx`): Student vs Institution selector; institution collects org fields (orgName/orgType/orgCountry/orgWebsite/orgDescription) → `accountType:"institution"` → pending → `/pendingApproval`; SocialLogin only for students
- New pages/guards: `PendingApproval` + `RejectedApproval` (`InstitutionStatus.jsx`), `InstitutionRoute` (approved-institution only), `SuperAdminRoute` (owner-only scholarship/approvals)
- Routes: `/pendingApproval`, `/rejectedApproval`, `/institutionDashboard/*`; scholarship CRUD stripped from admin/mod dashboards; admin scholarship + `institutionApprovals` wrapped in `SuperAdminRoute`
- Dashboards/nav role-aware: `AdminDashboard` sidebar (institution profile/add/manage/applications; superadmin + approvals; admin/mod lose scholarship items), `AdminNavbar` (institution label, review-history hidden for institutions), `Nabvar` (institution dashboard link + status link)
- Approvals page (`InstitutionApprovals`): pending/approved/rejected tabs, approve, reject-with-reason, move-to-pending; `ManageUsers` shows institution + status badges
- `useRole` extended: `status`, `me`, `isSuperAdmin`, `isInstitution`, `isApprovedInstitution`, `isPending`, `isRejected`; `MyProfile`/`PublicProfile` roleMeta + institution badge
- AuthProvider: `sendResetPassword` (Firebase password reset) exposed
- New helpers: `waitForToken.js`, `dashboardForRole.js`, `friendlyAuthError.js`
- Lint-clean for touched files; `npm run build` passes (localhost baked — dev only)
- Committed `f0e683c`, pushed `origin/feature/login-routes`

## 2026-09-02 — Institution Role Restrictions + Saved Count Fix

- Saved count bug fixed: `MyProfile.jsx` — replaced `GET /allScholership` query with `useSaved()` hook for the "Saved" stat (was showing total scholarships, now shows actual saved count)
- Clickable profile stats: `ProfileHeader.jsx` — stats support `to` property, render as `<Link>` for navigation (Applications -> dashboard, Reviews -> reviews, Saved -> /saved)
- Institution blocked from applying: `ScholarshipDetails.jsx` — `handleApply` now checks `isInstitution` in addition to `isAdmin`; server `POST /apply` rejects non-`user` roles with 403
- Applications page removed from institution: `AdminDashboard.jsx` sidebar + `Routes.jsx` — institution no longer sees "Applications" in nav or routes
- Institution sees only own scholarships: `ManageScholarships.jsx` — client-side filter by `createdBy === user.email` for institution role; "Add Scholarship" link dynamically routes to `/institutionDashboard/addScholarships`
- Server `index.js` — `POST /apply` now uses `loadAuthUser` + role guard (`role !== "user"` -> 403)
- Commit `47beafc` (client), `4c7ef48` (server), both pushed to `feature/login-roles`

## 2026-09-02 — LinkedIn-Style Profile Refactor

- `src/Component/profile/RoleBadge.jsx` — shared role metadata (single source of truth, used by MyProfile, PublicProfile, ManageUsers)
- `src/Component/profile/ProfileHeader.jsx` — cover photo (full-bleed), avatar (overlapping), name, role badge, location, joined date, stats row, edit button
- `src/Component/profile/AboutSection.jsx` — bio with show-more truncation (180 chars), skills tags
- `src/Component/profile/Sidebar.jsx` — contact info (email, phone, location, website), member info card
- `src/Component/profile/ActivitySection.jsx` — applications + reviews with status badges and star ratings
- `PublicProfile.jsx` rewritten — two-column LinkedIn layout (main + sidebar), responsive
- `MyProfile.jsx` rewritten — 572→~300 lines, modal edit overlay, uses shared components
- `ManageUsers.jsx` updated — imports shared `roleMeta` from RoleBadge (replaces inline `roleBadge` function)
- `npm run build` passes, lint clean (no new errors)
- Commit `8ea2169`, pushed to `feature/login-roles`

## 2026-09-02 — Deploy Guard: no more localhost leaks

- `scripts/check-dist-server-url.mjs` — scans `dist`; **fails** if any `localhost:<port>`/`127.0.0.1:<port>` survives or if the Vercel URL is missing
- `scripts/prod-build.mjs` — forces `VITE_server_url=https://server-six-vert.vercel.app` (ignores dev `.env`), builds, then runs the check
- `scripts/deploy.mjs` — guarded build + `firebase deploy` (token read from `docs/CREDENTIALS.md`)
- `package.json` → `build:prod` + `deploy`; `npm run build` remains DEV-ONLY (bakes localhost:5000)
- Verified: dev build fails the guard (exit 1, `localhost:5000` found); `build:prod` passes (0 local refs, Vercel URL present)
- `docs/CREDENTIALS.md` — fresh `VERCEL_TOKEN` (validated: HTTP 200, accesses project `server`); `npm run deploy` usage
- `docs/DEPLOY.md` rewritten — localhost-trap section, guarded deploy, server = push to `main` auto-deploy (Vercel already GitHub-linked)
- GitHub push protection allowlisted for the token (owner clicked Allow); pushed `3463a0e`
- Server repo docs aligned (`6207508`): deploy = push to `main`; creds live in client repo

## 2026-09-01 — Review + Navbar Refactor

- Manage Reviews simplified — removed category tabs (All/Pending/Approved/Rejected/Hidden/Removed) & `activeTab`; now queries fixed `status=approved` only (auto-approve model); header shows `total/approved/removed` + single `View History` link; removed bulk approve/reject & per-card history; kept Search + per-card `Remove` (with required reason + note) + `Edit` (typo fix)
- ReviewCard slimmed — deleted `Approve/Reject/Hide` branches (dead on live server, `/moderate` 404) and per-card `View history` button; keeps `Remove` + `Edit` + avatar fallback + clickable profile; still supports `MyReviews` (owner delete+edit)
- New `ReviewHistory` page — `GET /reviews/removed` list w/ reason/removedBy/removedAt/note + expandable per-review timeline via `GET /reviews/history/:id`; routes `/adminDashboard/manageReviews/history` + `/modaratorDashboard/myReviews/history`; accessible from ManageReviews header + dashboard navbar dropdown
- `useRole` hook — consolidates 3 role queries (`useAdmin/useModaretor/useUser`) into one `GET /users/me` call returning `{role,isAdmin,isModaretor,isUser,loading}`
- Main navbar — single `useRole`, click-outside + Esc to close profile dropdown, added `Saved Scholarships` dropdown item
- AdminNavbar — `Log Out` now really calls `logOut()` + navigate `/`; avatar/initials fallback; header shows real `displayName + email + role` (not `@Admin`); removed filler (language dropdown, Billing/Invite/Support), kept theme + bell, added role-aware `Review History` link; removed `use client` + unused import
- AdminDashboard sidebar — pruned dead `Widget`/`Application` sections (9 NotFound links); flat role-aware nav (`admin/mod/user` submenus rendered directly); role-aware settings link + avatar fallback + role label in footer
- Lint-clean for touched files; `npm run build` passes

## 2026-09-01 — Scholarship Transformation

- Phase 0 — Archive DONE → `docs/TASK_HISTORY.md` (both repos)
- Phase 1 — Server: faceted `GET /allScholership` (+ aliases), pagination `{data,total,page,totalPages}`, indexes, secured writes `verifyToken+verifyModaretor`, saved collection `POST/GET/DELETE /saved`, `GET /scholarships/stats`, schema `eligibility/benefits/duration/tags/currency` (pushed `a811734`, Vercel token blocked)
- Phase 2 — Unified `ScholarshipCard` (browse/manage/compact) + `ScholarshipGrid/ScholarshipList` + `CountdownBadge` + `FilterChip`; `useScholership` params-aware + `useSaved/useToggleSave/useScholarshipStats`; `AllScholership` rebuilt (debounced q `400ms`, facets drawer/bottom-sheet, chips, sort `recommended/deadline/rating/newest/fees`, Grid/List, pagination 12/10, URL sync `?q=&category=&degree=&country=&maxFees=&sort=&page&view`, compare bar 4, saved toggle, `EmptyState` fix); `TopScholarship` rated sort + `Highlights` wired to `/stats` + `ScholershipStatic` rewritten to How it works + trending destinations
- Phase 3 — `ScholarshipDetails` countdown + save/share/compare + eligibility/benefits/tags pills + `Intl.NumberFormat` + expired guard; new routes `/compare` + `/saved` + `/userDashboard/saved` + aliases `/scholarships/*`; `SavedScholarships` + `Compare` pages
- Phase 4 — `ManageScholarships` unified card + search + `useAxiosSecure` delete; `AddScholarship/EditScholarship` secured (`useAxiosSecure`), new fields `currency/duration/eligibility/benefits/tags`, fix `masters→Masters` + `subjectName2` drop, `build 1.16MB` ok, dev `http://localhost:5173` ok

## 2026-09-01 — User & Admin Profile — Full-Fledged

- Server: `POST /users` persists `photoURL` + `createdAt/updatedAt`, `GET /user` secured, `GET /users` staff-only, `GET /users/me` + `PATCH /users/me` whitelist (name/photoURL/coverPhoto/phone/bio/city/country/skills) with validation
- Client: `MyProfile` rewrite — cover+avatar upload via imgbb, role badge (Student/Moderator/Admin/Owner), real stats (apply/reviews/scholarships vs platform metrics), tabs About/Activity/Settings, inline edit via `PATCH /users/me` + `updateUserProfile` sync, skills chips, Admin authorities panel with quick links
- Auth: `Registation` + `Login` now send `photoURL` on `POST /users` so DB and Firebase stay synced

## 2026-09-01 — Review System — Proper Moderation

- Server: `verifyModaretor`, indexes `(reviewer_email, scholarShip_id)` unique, `(scholarShip_id, status)`, `recalcScholarshipRating`
- Server: `POST /addReviews` secured, validates 1-5 rating + 5-500 comment, gates `apply.applicationStatus==="accepted"`, dup 409, `status="pending"` + `isVerified`
- Server: `GET /allReviews` enforces `email===decoded` unless staff + `status/q/scholarShip_id/page/limit`, safe join
- Server: `GET /allReviews/:id` public now `status="approved"` only
- Server: `DELETE /allReviews/:id` secured owner|staff + recalc, `PATCH /allReviews/:id` owner edit → re-pending, `PATCH /allReviews/:id/moderate` staff only, `GET /reviews/stats`
- Client: `useReviews` fix `queryKey` + `StatusBadge` add `approved/hidden`, `ScholarshipDetails` shows approved only
- Client: `ManageReview` queue — tabs Pending/Approved/Rejected/Hidden, search, bulk approve/reject, stats, `ReviewCard` verified shield + moderation meta + checkbox
- Client: `AddReview` gate — accepted-only + 1-per-scholarship + `useAxiosSecure` + pending toast, `MyApplication` conditional star, `MyReviews` edit via PATCH

## 2026-09-01 — UI Redesign — Component Checklist (45 items, visual/UX pass)

### Global shell and public components
- `src/Pages/Sheard/Nabvar.jsx` — public navigation (visual pass + Firebase deploy completed)
- `src/Layout/MainLayout.jsx` — public page shell
- `src/Component/Footer.jsx` — site footer
- `src/Layout/Home.jsx` — home composition
- `src/Component/HeroCoursor/HeroCarousel.jsx` — hero
- `src/Component/AboutUs/AboutUs.jsx` — about section
- `src/Pages/TopScholarship/TopScholarship.jsx` — featured scholarships
- `src/Component/ExtraFeature/ScholarshipHighlights.jsx` — highlights
- `src/Component/ExtraFeature/ScholershipStatic.jsx` — statistics
- `src/Component/Banner.jsx` — banner
- `src/Pages/Contact/ContactPage.jsx` — contact
- `src/Component/ErrorPage/NotFound.jsx` — not found
- `src/Component/DataNotAvailable/DataNotAvailable.jsx` — empty data state

### Shared UI primitives
- `src/Component/ui/EmptyState.jsx`
- `src/Component/ui/FormField.jsx`
- `src/Component/ui/PageHeader.jsx`
- `src/Component/ui/Skeleton.jsx`
- `src/Component/ui/Spinner.jsx`
- `src/Component/ui/Stars.jsx`
- `src/Component/ui/StatCard.jsx`
- `src/Component/ui/StatusBadge.jsx`

### Authentication
- `src/Pages/Authentication/Login.jsx`
- `src/Pages/Authentication/Registation.jsx`
- `src/Pages/Authentication/SocialLogin.jsx`

### Scholarship discovery and details
- `src/Pages/AllScholership/AllScholership.jsx`
- `src/Pages/AllScholership/ScholarshipCard.jsx`
- `src/Pages/ScholarshipDetails/ScholarshipDetails.jsx`
- `src/Pages/ScholarshipDetails/AllReviews.jsx`

### User dashboard
- `src/Layout/UserDashboard.jsx`
- `src/Pages/UserPage/MyProfile/MyProfile.jsx`
- `src/Pages/UserPage/MyApplication/MyApplication.jsx`
- `src/Pages/UserPage/MyApplication/MyApplicationCard.jsx`
- `src/Pages/UserPage/MyApplication/ApplicationCardForUser.jsx`
- `src/Pages/UserPage/MyReviews/MyReviews.jsx`
- `src/Pages/UserPage/Apply/Apply.jsx`
- `src/Pages/AddReview/AddReview.jsx`

### Moderator dashboard
- `src/Layout/ModaratorDashboard.jsx`
- `src/Pages/ModaratorPages/AddScholarship/AddScholarship.jsx`
- `src/Pages/ModaratorPages/ManageScholarships/ManageScholarships.jsx`
- `src/Pages/ModaratorPages/ManageScholarships/ManageScholareCard.jsx`
- `src/Pages/ModaratorPages/ManageScholarships/EditScholarship.jsx`
- `src/Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship.jsx`
- `src/Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard.jsx`

### Admin dashboard
- `src/Layout/AdminDashboard.jsx`
- `src/Layout/AdminNavbar.jsx`
- `src/Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication.jsx`
- `src/Pages/AdminPages/ManageUsers/ManageUsers.jsx`
- `src/Pages/AdminPages/ManageReviews/ManageReview.jsx`
- `src/Pages/AdminPages/ManageReviews/ReviewCard.jsx`

## Core client (as found at setup) + Session-continuity system

- Vite + React 18 app scaffold, Tailwind + daisyUI, React Router v6.
- Firebase Auth (`src/Firebase/firebase.init.js`, `AuthProvider.jsx`): email/password + Google, JWT `/jwt` + `/clear-jwt`.
- Axios instances: `useAxiosPublic` / `useAxiosSecure` (Bearer `access-token`, auto-logout on 401).
- Public pages: Home, AllScholership + ScholarshipDetails(+reviews), Apply/:id (private), Contact, AboutUs, Login, Registration, NotFound.
- Role dashboards + route guards: `UserRoute`, `ModaretorRoute`, `AdminRoute` + their pages.
- React-Query hooks (`useScholership`, `useSingleScholership`, `useReviews`, role hooks).
- Session-continuity system: `AGENTS.md`, `TASKS.md`, `docs/HANDOFF_LOG.md`, `docs/DEPLOY.md`, `docs/CREDENTIALS.md`, `.ai-ready/skills/session-handoff/`.
