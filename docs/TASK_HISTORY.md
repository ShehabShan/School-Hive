# TASK_HISTORY.md — School-Hive (client) — Archive

Completed work moved from `TASKS.md`. `TASKS.md` stays lean (IN PROGRESS / TODO / BACKLOG). Newest completed block at top.

---

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
