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
- [ ] `src/Component/AboutUs/AboutUs.jsx` — about section
- [ ] `src/Pages/TopScholarship/TopScholarship.jsx` — featured scholarships
- [ ] `src/Component/ExtraFeature/ScholarshipHighlights.jsx` — highlights
- [ ] `src/Component/ExtraFeature/ScholershipStatic.jsx` — statistics
- [ ] `src/Component/Banner.jsx` — banner
- [ ] `src/Pages/Contact/ContactPage.jsx` — contact
- [ ] `src/Component/ErrorPage/NotFound.jsx` — not found
- [ ] `src/Component/DataNotAvailable/DataNotAvailable.jsx` — empty data state

### Shared UI primitives
- [ ] `src/Component/ui/EmptyState.jsx`
- [ ] `src/Component/ui/FormField.jsx`
- [ ] `src/Component/ui/PageHeader.jsx`
- [ ] `src/Component/ui/Skeleton.jsx`
- [ ] `src/Component/ui/Spinner.jsx`
- [ ] `src/Component/ui/Stars.jsx`
- [ ] `src/Component/ui/StatCard.jsx`
- [ ] `src/Component/ui/StatusBadge.jsx`

### Authentication
- [ ] `src/Pages/Authentication/Login.jsx`
- [ ] `src/Pages/Authentication/Registation.jsx`
- [ ] `src/Pages/Authentication/SocialLogin.jsx`

### Scholarship discovery and details
- [ ] `src/Pages/AllScholership/AllScholership.jsx`
- [ ] `src/Pages/AllScholership/ScholarshipCard.jsx`
- [ ] `src/Pages/ScholarshipDetails/ScholarshipDetails.jsx`
- [ ] `src/Pages/ScholarshipDetails/AllReviews.jsx`

### User dashboard
- [ ] `src/Layout/UserDashboard.jsx`
- [ ] `src/Pages/UserPage/MyProfile/MyProfile.jsx`
- [ ] `src/Pages/UserPage/MyApplication/MyApplication.jsx`
- [ ] `src/Pages/UserPage/MyApplication/MyApplicationCard.jsx`
- [ ] `src/Pages/UserPage/MyApplication/ApplicationCardForUser.jsx`
- [ ] `src/Pages/UserPage/MyReviews/MyReviews.jsx`
- [ ] `src/Pages/UserPage/Apply/Apply.jsx`
- [ ] `src/Pages/AddReview/AddReview.jsx`

### Moderator dashboard
- [ ] `src/Layout/ModaratorDashboard.jsx`
- [ ] `src/Pages/ModaratorPages/AddScholarship/AddScholarship.jsx`
- [ ] `src/Pages/ModaratorPages/ManageScholarships/ManageScholarships.jsx`
- [ ] `src/Pages/ModaratorPages/ManageScholarships/ManageScholareCard.jsx`
- [ ] `src/Pages/ModaratorPages/ManageScholarships/EditScholarship.jsx`
- [ ] `src/Pages/ModaratorPages/AllAppliedScholarship/AllAppliedScholarship.jsx`
- [ ] `src/Pages/ModaratorPages/AllAppliedScholarship/ViewDetails/ApplicationCard.jsx`

### Admin dashboard
- [ ] `src/Layout/AdminDashboard.jsx`
- [ ] `src/Layout/AdminNavbar.jsx`
- [ ] `src/Pages/AdminPages/ManageAppliedApplication/ManageAppliedApplication.jsx`
- [ ] `src/Pages/AdminPages/ManageUsers/ManageUsers.jsx`
- [ ] `src/Pages/AdminPages/ManageReviews/ManageReview.jsx`
- [ ] `src/Pages/AdminPages/ManageReviews/ReviewCard.jsx`

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
