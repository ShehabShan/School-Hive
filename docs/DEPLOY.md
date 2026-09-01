# DEPLOY.md — How to build & deploy

> **⛔ DEPLOY PERMISSION REQUIRED — DO NOT DEPLOY WITHOUT OWNER APPROVAL**
> Agents (and humans following agent instructions) MUST NOT run `npm run deploy`, `npm run build:prod` for deploy, `npx firebase deploy`, `npx vercel --prod`, or `git push origin main` (server) without the owner's explicit `deploy approved` / `yes deploy` message in the current session. Ask via the `question` tool and wait. See `AGENTS.md` §2 "DEPLOY BLOCK". Pushing to `feature/*` is allowed; production deploys are blocked.

Two independent deployments:

| Piece | Host | Repo | URL |
|-------|------|------|-----|
| Client | Firebase Hosting | `School-Hive` (this repo) | https://scholarhive-913e4.web.app |
| Server | Vercel | `Schole-hive-server` | https://server-six-vert.vercel.app |

Deploy credentials are committed to this repo in plaintext (low-stakes test
project). They live in `docs/CREDENTIALS.md` — use the values from that file when
deploying. Do NOT assume this pattern is safe for production projects.

## The localhost trap (read first)

The dev `.env` sets `VITE_server_url=http://localhost:5000` so local sessions hit
the local server. A plain `npm run build` bakes that localhost URL into `dist/` —
**deploying that breaks production**. Always deploy the client through the READY
guarded command `npm run deploy` (or `npm run build:prod` for build-only), which:

1. Forces `VITE_server_url=https://server-six-vert.vercel.app` (dev `.env` is ignored),
2. Builds the bundle, then
3. Fails with a non-zero exit if any `localhost`/`127.0.0.1` reference survives, or
   if the Vercel server URL is missing from the bundle.

The guard also runs as part of `npm run deploy` right before the Firebase deploy.

## Client (Firebase Hosting) — this repo

```bash
npm install
npm run deploy           # guarded build + dist check + firebase deploy (token read from docs/CREDENTIALS.md)
# or build-only, to inspect first:
npm run build:prod       # guarded build + dist check, no deploy
npm run build            # plain build — DEV ONLY (bakes localhost:5000 from .env)
```

Firebase project id is `scholarhive-913e4` (see `.firebaserc` / `firebase.json`).
If the committed `FIREBASE_TOKEN` is ever expired, rotate it with
`npx firebase-tools login:ci` and update `docs/CREDENTIALS.md`.

## Server (Vercel)

The project is **already linked to GitHub** (`ShehabShan/Schole-hive-server`) with
auto-deploy enabled: every push to `main` deploys production to
`https://server-six-vert.vercel.app`. Normal flow:

```bash
cd ../Schole-hive-server
git checkout main && git pull
git merge feature/login-roles          # promote work to main
git push origin main                   # Vercel auto-deploys
```

CLI fallback (e.g. if GitHub integration is off): the project is named **`server`**
(existing production URL `server-six-vert.vercel.app`). Use the `VERCEL_TOKEN`
from `docs/CREDENTIALS.md`, and link to the existing project first or you'll create
a throwaway one:

```bash
cd ../Schole-hive-server
VERCEL_TOKEN="<from School-Hive/docs/CREDENTIALS.md>"
npx vercel link --project server --yes --token "$VERCEL_TOKEN"   # first time only
npx vercel --prod --yes --token "$VERCEL_TOKEN"
```

The server reads its env vars (`DB_USER`/`DB_PASS`, `ACCESS_TOKEN_SECRET`,
`ADMIN_EMAILS`) from the Vercel project's Environment Variables panel — they are
configured there, not in the repo. For local runs, mirror those values into the
gitignored `Schole-hive-server/.env`.

## Order & verification

1. Deploy the server first (push to `main`), confirm https://server-six-vert.vercel.app responds.
2. Deploy the client, confirm https://scholarhive-913e4.web.app is NOT built against
   localhost: `grep -c "localhost:5000" dist/assets/*.js` must return 0 before pushing
   to Firebase (the `deploy` guard now enforces this automatically).
3. Smoke-test auth (sign up / log in) since it round-trips client -> server `/jwt`.

## Local dev

```bash
cd School-Hive && cp .env.example .env   # VITE_* Firebase values + VITE_server_url=http://localhost:5000
cd School-Hive && npm run dev            # Vite on :5173 — talks to the local server on :5000
cd ../Schole-hive-server && npm start    # local API (needs Schole-hive-server/.env)
```

`VITE_server_url` defaults to the Vercel server if unset, so a deploy build without
`.env` is still safe — but always use the guarded commands anyway.