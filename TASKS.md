# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit of work -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE**.
- When you find new work -> add it to **BACKLOG** (or **TODO** if it is next).

Detailed session narrative and decisions live in `docs/HANDOFF_LOG.md` (newest at top).
Deploy procedure and credentials live in `docs/DEPLOY.md`.

---

## DONE

### Session-continuity system (this setup)
- [x] `AGENTS.md` — project rules + standing working rules (commit frequently, push after every commit, token-budget safety, update continuity files).
- [x] `TASKS.md` — this status file.
- [x] `docs/HANDOFF_LOG.md` — session-by-session handoff log.
- [x] `docs/DEPLOY.md` — deploy procedure; deploy credentials committed directly in `docs/CREDENTIALS.md` (low-stakes test project; owner accepted the risk).
- [x] `.ai-ready/skills/session-handoff/` — handoff skill that future sessions load to orient + write continuity updates.
- [x] `docs/CREDENTIALS.md` — deploy credentials registry; values are committed directly in this file (owner accepted committing them for this test project so they persist across sessions).

### Core client (as found at setup)
- [x] Vite + React 18 app scaffold, Tailwind + daisyUI, React Router v6.
- [x] Firebase Auth integration (`src/Firebase/firebase.init.js`, `AuthProvider.jsx`): email/password + Google sign-in, profile update, JWT issue (`/jwt`) and clear (`/clear-jwt`) on auth state change.
- [x] Axios instances: `useAxiosPublic` (base URL `https://server-six-vert.vercel.app`), `useAxiosSecure` (Bearer token from `access-token` localStorage, auto-logout on 401).
- [x] Public pages: Home, AllScholership + ScholarshipDetails(+reviews), Apply/:id (private), Contact, AboutUs, Login, Registration, NotFound.
- [x] Role dashboards + route guards: `UserRoute`, `ModaretorRoute`, `AdminRoute`.
- [x] User dashboard: myProfile, myApplication (+details, +addReviews/:id), myReviews.
- [x] Moderator dashboard: myProfile, manageScholarships (+edit/:id), myReviews, allAppliedScholarships (+details/:id), addScholarships.
- [x] Admin dashboard: adminProfile, addScholarships, manageScholarships (+edit/:id), manageAppliedApplication, allAppliedScholarships/:id, manageUsers, manageReviews.
- [x] React-Query hooks for server state (`useScholership`, `useSingleScholership`, `useReviews`, role hooks).

---

## UI Redesign — Component Checklist

Each item is a visual/UX pass only. Keep behavior and data contracts intact. Follow
the required order for every item: update this checklist -> commit -> push -> deploy.

### Global shell and public components
- [x] `src/Pages/Sheard/Nabvar.jsx` — public navigation (visual pass + Firebase deploy completed)
- [x] `src/Layout/MainLayout.jsx` — public page shell
- [x] `src/Component/Footer.jsx` — site footer
- [x] `src/Layout/Home.jsx` — home composition
- [x] `src/Component/HeroCoursor/HeroCarousel.jsx` — hero
- [x] `src/Component/AboutUs/AboutUs.jsx` — about section
- [x] `src/Pages/TopScholarship/TopScholarship.jsx` — featured scholarships
- [x] `src/Component/ExtraFeature/ScholarshipHighlights.jsx` — highlights
- [x] `src/Component/ExtraFeature/ScholershipStatic.jsx` — statistics
- [x] `src/Component/Banner.jsx` — banner
- [x] `src/Pages/Contact/ContactPage.jsx` — contact
- [x] `src/Component/ErrorPage/NotFound.jsx` — not found
- [x] `src/Component/DataNotAvailable/DataNotAvailable.jsx` — empty data state

### Shared UI primitives
- [x] `src/Component/ui/EmptyState.jsx`
- [x] `src/Component/ui/FormField.jsx`
- [x] `src/Component/ui/PageHeader.jsx`
- [x] `src/Component/ui/Skeleton.jsx`
- [x] `src/Component/ui/Spinner.jsx`
- [x] `src/Component/ui/Stars.jsx`
- [x] `src/Component/ui/StatCard.jsx`
- [x] `src/Component/ui/StatusBadge.jsx`

### Authentication
- [x] `src/Pages/Authentication/Login.jsx`
- [x] `src/Pages/Authentication/Registation.jsx`
- [x] `src/Pages/Authentication/SocialLogin.jsx`

### Scholarship discovery and details
- [x] `src/Pages/AllScholership/AllScholership.jsx`
- [x] `src/Pages/AllScholership/ScholarshipCard.jsx`
- [x] `src/Pages/ScholarshipDetails/ScholarshipDetails.jsx`
- [x] `src/Pages/ScholarshipDetails/AllReviews.jsx`

### User dashboard
- [x] `src/Layout/UserDashboard.jsx`
- [x] `src/Pages/UserPage/MyProfile/MyProfile.jsx`
- [x] `src/Pages/UserPage/MyApplication/MyApplication.jsx`
- [x] `src/Pages/UserPage/MyApplication/MyApplicationCard.jsx`
- [x] `src/Pages/UserPage/MyApplication/ApplicationCardForUser.jsx`
- [x] `src/Pages/UserPage/MyReviews/MyReviews.jsx`
- [x] `src/Pages/UserPage/Apply/Apply.jsx`
- [x] `src/Pages/AddReview/AddReview.jsx`

### Moderator dashboard
- [x] `src/Layout/ModaratorDashboard.jsx`
- [x] `src/Pages/ModaratorPages/AddScholarship/AddScholarship.jsx`
- [x] `src/Pages/ModaratorPages/ManageScholarships/ManageScholarships.jsx`
- [x] `src/Pages/ModaratorPages/ManageScholarships/ManageScholareCard.jsx`
- [x] `src/Pages/ModaratorPages/ManageScholarships/EditScholarship.jsx`
- [x] `src/Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship.jsx`
- [x] `src/Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard.jsx`

### Admin dashboard
- [x] `src/Layout/AdminDashboard.jsx`
- [x] `src/Layout/AdminNavbar.jsx`
- [x] `src/Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication.jsx`
- [x] `src/Pages/AdminPages/ManageUsers/ManageUsers.jsx`
- [x] `src/Pages/AdminPages/ManageReviews/ManageReview.jsx`
- [x] `src/Pages/AdminPages/ManageReviews/ReviewCard.jsx`

### Review System — Proper Moderation (2026-09-01)
- [x] Server: `verifyModaretor`, indexes `(reviewer_email, scholarShip_id)` unique, `(scholarShip_id, status)`, `recalcScholarshipRating`
- [x] Server: `POST /addReviews` secured, validates 1-5 rating + 5-500 comment, gates `apply.applicationStatus==="accepted"`, dup 409, `status="pending"` + `isVerified`
- [x] Server: `GET /allReviews` enforces `email===decoded` unless staff + `status/q/scholarShip_id/page/limit`, safe join
- [x] Server: `GET /allReviews/:id` public now `status="approved"` only
- [x] Server: `DELETE /allReviews/:id` secured owner|staff + recalc, `PATCH /allReviews/:id` owner edit → re-pending, `PATCH /allReviews/:id/moderate` staff only, `GET /reviews/stats`
- [x] Client: `useReviews` fix `queryKey` + `StatusBadge` add `approved/hidden`, `ScholarshipDetails` shows approved only
- [x] Client: `ManageReview` queue — tabs Pending/Approved/Rejected/Hidden, search, bulk approve/reject, stats, `ReviewCard` verified shield + moderation meta + checkbox
- [x] Client: `AddReview` gate — accepted-only + 1-per-scholarship + `useAxiosSecure` + pending toast, `MyApplication` conditional star, `MyReviews` edit via PATCH

### User & Admin Profile — Full-Fledged (2026-09-01)
- [x] Server: `POST /users` persists `photoURL` + `createdAt/updatedAt`, `GET /user` secured, `GET /users` staff-only, `GET /users/me` + `PATCH /users/me` whitelist (name/photoURL/coverPhoto/phone/bio/city/country/skills) with validation
- [x] Client: `MyProfile` rewrite — cover+avatar upload via imgbb, role badge (Student/Moderator/Admin/Owner), real stats (apply/reviews/scholarships vs platform metrics), tabs About/Activity/Settings, inline edit via `PATCH /users/me` + `updateUserProfile` sync, skills chips, Admin authorities panel with quick links
- [x] Auth: `Registation` + `Login` now send `photoURL` on `POST /users` so DB and Firebase stay synced

---

## IN PROGRESS

- Nothing currently in progress.

---

## BACKLOG / KNOWN GAPS

_(candidate work, not yet started. Add anything you find.)_

- [ ] Add automated tests (no test framework wired up yet — `npm test` is undefined).
- [ ] Move hardcoded server URL (`server-six-vert.vercel.app`) into a `VITE_` env var so local/staging are switchable without editing source.
- [ ] Review `Home` + hero/banner sections for accessibility and responsive polish.
- [ ] Centralize shared card components (scholarship/application/review cards are duplicated across dashboards).
- [ ] Add client-side form validation (apply, add scholarship, add review, registration).
