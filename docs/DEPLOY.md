# DEPLOY.md — How to build & deploy

Two independent deployments:

| Piece | Host | Repo | URL |
|-------|------|------|-----|
| Client | Firebase Hosting | `School-Hive` (this repo) | https://scholarhive-913e4.web.app |
| Server | Vercel | `Schole-hive-server` | https://server-six-vert.vercel.app |

Deploy credentials are committed to this repo in plaintext (low-stakes test
project). They live in `docs/CREDENTIALS.md` — use the values from that file when
deploying. Do NOT assume this pattern is safe for production projects.

## Client (Firebase Hosting) — this repo

```bash
npm install
npm run build            # outputs dist/
# Firebase token is in docs/CREDENTIALS.md, then:
FIREBASE_TOKEN="1//0gmwHuLmy5qpZCgYIARAAGBASNwF-L9IrdpnUCzFU2ImJLTzfttxIYVT76bookqjajDOrCvvzKJ0v5BWr-s3mwElb6xsJkaR6ww0"
npx firebase-tools deploy --only hosting --token "$FIREBASE_TOKEN"
```

Firebase project id is `scholarhive-913e4` (see `.firebaserc` / `firebase.json`).
Alternative to the CLI: `npx firebase-tools login:ci --token "$FIREBASE_TOKEN"` to
install the token into the local Firebase CLI config before deploying.

## Server (Vercel) — Schole-hive-server repo

IMPORTANT: The production URL `https://server-six-vert.vercel.app` belongs to the
existing Vercel project named **`server`** (NOT `schole-hive-server`). If the repo
is not linked yet, run `npx vercel link --project server --yes --token "$VERCEL_TOKEN"`
FIRST. Deploying without linking will create a new throwaway project.

```bash
cd ../Schole-hive-server     # sibling repo
npm install
# Vercel token is in docs/CREDENTIALS.md, then:
VERCEL_TOKEN="vcp_8hSyyrgy1jHEaW2kCRc1RaaxwM5uET1BIMMmhvsIvIBmYpzG9B3QyLd2"
npx vercel link --project server --yes --token "$VERCEL_TOKEN"   # first time only
npx vercel --prod --yes --token "$VERCEL_TOKEN"
```

The Vercel project id is `server` (`server-six-vert.vercel.app`). `vercel.json` routes all traffic to `index.js`
(`@vercel/node`). The server reads env vars (`MONGO_URI` or `DB_USER`/`DB_PASS`,
`ACCESS_TOKEN_SECRET`, `ADMIN_EMAILS`, `NODE_ENV`) from the Vercel project's
Environment Variables panel — those are configured inside Vercel, not in the repo.

## Order & verification

1. Deploy the server first, confirm https://server-six-vert.vercel.app responds.
2. Deploy the client, confirm https://scholarhive-913e4.web.app loads.
3. Smoke-test auth (sign up / log in) since it round-trips client -> server `/jwt`.

## Local dev

```bash
cd School-Hive && cp .env.example .env   # fill VITE_* Firebase values
cd School-Hive && npm run dev            # Vite on :5173 — always uses https://server-six-vert.vercel.app
```

The client always fetches from Vercel (`https://server-six-vert.vercel.app`), even when running locally. Do not switch to `localhost:5000`.
