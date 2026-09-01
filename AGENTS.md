# AGENTS.md — School-Hive (client)

Project-level rules and session-continuity system for AI coding agents.
Any AI agent starting a session in this repository MUST read this file first
and follow the rules below. These rules are deliberately written to survive
session restarts, so a brand-new session can pick up without being told again.

## 1. MANDATORY onboarding — read these before doing anything

When you start a session in this repo, in this order:

1. Read `TASKS.md` — the current state: what is DONE, what is IN PROGRESS, what is LEFT.
2. Read the newest (top) entry in `docs/HANDOFF_LOG.md` — the most recent session summary and any decisions/context.
3. Read `docs/DEPLOY.md` — how to build/deploy (client = Firebase Hosting, server = Vercel).
4. Read this repo's sibling `../Schole-hive-server/AGENTS.md` if present — the MERN backend lives in a separate repo and the client talks to its API.

Do NOT re-discover the codebase from scratch. Use the above files to orient first,
then explore specific areas only as needed.

## 2. STANDING WORKING RULES (apply to every session, no exceptions)

These are the ground rules you must follow for the whole session:

- **Commit frequently.** Make a small, working commit after every unit of progress: one component, one fix, one page, one config change. Do NOT batch many pieces of work into one large commit at the end.
- **Push after every commit.** After committing, immediately `git push` so progress is saved remotely. Never leave work only on the local machine / session environment.
- **Token/usage-budget safety.** If you are at risk of running out of context/token budget mid-task, IMMEDIATELY commit and push whatever is currently done and working (even if incomplete or not fully polished). Never leave uncommitted or unpushed changes. Document what is unfinished in `TASKS.md` and the handoff log first so the next session can continue.
- **Update continuity files as you go.** Keep `TASKS.md` and `docs/HANDOFF_LOG.md` current:
  - When you START a unit of work: move it to IN PROGRESS in `TASKS.md`.
  - When you FINISH a unit: mark it DONE in `TASKS.md`.
  - When you finish a meaningful chunk (or end the session / hit budget limits): append a dated entry to `docs/HANDOFF_LOG.md` describing what was done, what's in progress, what's left, and any decisions/context the next session needs. Commit and push these updates.
- **Deploy credentials live in this repo on purpose.** The Vercel/Firebase deploy tokens for this low-stakes test project are committed in `docs/CREDENTIALS.md` — the owner accepted this so credentials persist across session environments. Do NOT assume this pattern is safe for production projects. Never commit NEW secrets (DB URIs, JWT secrets, real passwords) — those stay in Vercel env vars / local `.env`.
- **DEPLOY BLOCK — owner permission required (client + server).** NEVER run `npm run deploy`, `npm run build:prod` for deploy purposes, `npx firebase deploy`, `npx firebase-tools deploy`, `npx vercel --prod`, `vercel --prod`, `git push origin main` (server auto-deploys), or `git merge feature/* -> main` without the owner's explicit permission in the current session. Permission must be an explicit user message such as `deploy approved`, `yes deploy`, or `allow deploy`. If a task would require a deploy, you MUST first ask the owner via the `question` tool and wait for affirmative confirmation. Document the decision in `docs/HANDOFF_LOG.md`. This rule overrides "Commit frequently / Push after every commit" for production deploys — pushing to `feature/*` branches is allowed, pushing/deploying to `main`/production is not. The technical guard `scripts/deploy.mjs` also enforces this (requires `DEPLOY_APPROVED=yes` or `--allow-deploy`).
- **No debug leftovers.** Remove `console.log` debug statements before committing.

## 3. Project overview

MERN-stack scholarship management platform ("School-Hive" / "SoloSphere"):
- **Client (this repo):** React 18 + Vite 5, Tailwind CSS + daisyUI, `react-router-dom` v6, `@tanstack/react-query`, `axios`, `framer-motion`, `lucide-react`, `sweetalert2`, `react-hot-toast`, Firebase Auth (email/password + Google).
- **Server (separate repo `Schole-hive-server`):** Express + MongoDB, deployed to Vercel at `https://server-six-vert.vercel.app`.

Live deployments:
- Client: `https://scholarhive-913e4.web.app` (Firebase Hosting)
- Server: `https://server-six-vert.vercel.app` (Vercel)

## 4. Commands

```bash
npm install          # install dependencies (node_modules is gitignored)
npm run dev          # start Vite dev server (default http://localhost:5173)
npm run build        # production build -> dist/
npm run lint         # eslint (js,jsx), --max-warnings 0
npm run preview      # preview the production build
```

- The app reads Firebase config from `.env` (Vite env vars, prefix `VITE_`). See `.env.example` for the required variables; copy it to `.env` for local dev. `.env` is gitignored.
- The server URL is hardcoded as `https://server-six-vert.vercel.app` in `src/Hooks/useAxiosPublic.jsx` and `src/Hooks/useAxiosSecure.jsx` (a `localhost:5000` alternative is commented out).

## 5. Repository layout (client)

- `src/main.jsx` — app entry, sets up QueryClient + RouterProvider.
- `src/routes/Routes.jsx` — all routes. Public routes + three role dashboards:
  - `/userDashboard` (guarded by `UserRoute`) — myProfile, myApplication(+/:id, addReviews/:id), myReviews.
  - `/modaratorDashboard` (guarded by `ModaretorRoute`) — myProfile, manageScholarships(+/:id edit), myReviews, allAppliedScholarships(+/:id), addScholarships.
  - `/adminDashboard` (guarded by `AdminRoute`) — adminProfile, addScholarships, manageScholarships(+/:id), manageAppliedApplication, allAppliedScholarships/:id, manageUsers, manageReviews.
- `src/Firebase/` — `firebase.init.js` (config from env) and `AuthProvider.jsx` (auth context: createUser, signIn, googleSingIn, logOut, updateUserProfile; posts `/jwt` to the server on login and `/clear-jwt` on logout, stores JWT in localStorage under `access-token`).
- `src/Hooks/` — data hooks: `useAxiosPublic`, `useAxiosSecure` (attaches `Bearer` token, logs out on 401), `useAuth`, `useAdmin`, `useSuperAdmin`, `useModaretor`, `useUser`, `useScholership`, `useSingleScholership`, `useReviews`.
- `src/Pages/` — feature pages grouped by area (Authentication, UserPage, ModaratorPages, AdminPages, AllScholership, ScholarshipDetails, Contact, AddReview, TopScholarship).
- `src/Layout/` — `MainLayout`, `Home`, role dashboards and navbars (`AdminDashboard`, `UserDashboard`, `ModaratorDashboard`, `AdminNavbar`, `MainLayout`).
- `src/Component/` — shared components (Banner, Footer, ErrorPage/NotFound, HeroCarousel, AboutUs, etc.).

Conventions: `jsx` files, functional components, hooks for data access, `useQuery` for server state. No TypeScript.

## 6. Related repo

The backend is a separate repo: `https://github.com/ShehabShan/Schole-hive-server`.
It must be cloned next to this one as `Schole-hive-server` for full local dev.
If present, read its `AGENTS.md` / `TASKS.md` / handoff log too. Its deployment
uses Vercel; details are in `docs/DEPLOY.md`.

## 7. Onboarding reference

- `TASKS.md` — status of the project (done / in progress / todo).
- `docs/HANDOFF_LOG.md` — session-by-session handoff log (newest at top).
- `docs/DEPLOY.md` — deployment procedure + where deploy credentials live.
- `docs/` — additional project documentation.
