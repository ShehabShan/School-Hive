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

## IN PROGRESS

_(nothing right now — next unit goes here when started)_

---

## BACKLOG / KNOWN GAPS

_(candidate work, not yet started. Add anything you find.)_

- [ ] Add automated tests (no test framework wired up yet — `npm test` is undefined).
- [ ] Move hardcoded server URL (`server-six-vert.vercel.app`) into a `VITE_` env var so local/staging are switchable without editing source.
- [ ] Review `Home` + hero/banner sections for accessibility and responsive polish.
- [ ] Centralize shared card components (scholarship/application/review cards are duplicated across dashboards).
- [ ] Add client-side form validation (apply, add scholarship, add review, registration).
