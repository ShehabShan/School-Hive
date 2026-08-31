# DEPLOY.md — How to build & deploy

Two independent deployments:

| Piece | Host | Repo | URL |
|-------|------|------|-----|
| Client | Firebase Hosting | `School-Hive` (this repo) | https://scholarhive-913e4.web.app |
| Server | Vercel | `Schole-hive-server` | https://server-six-vert.vercel.app |

Deploy credentials are NOT committed to either repo. See `docs/CREDENTIALS.md`
for where they live and how to load them.

## Client (Firebase Hosting) — this repo

```bash
npm install
npm run build            # outputs dist/
# load Firebase token (see CREDENTIALS.md), then:
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
# load Vercel token (see CREDENTIALS.md), then:
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

## Local dev (both repos side by side)

```bash
cd School-Hive && cp .env.example .env   # fill VITE_* Firebase values
cd School-Hive && npm run dev            # Vite on :5173
cd Schole-hive-server && npm run dev     # Express on :5000
```

Switch the client to localhost by uncommenting `baseURL: "http://localhost:5000"`
in `src/Hooks/useAxiosPublic.jsx` / `useAxiosSecure.jsx` (the production Vercel URL
is the default and should be restored before committing).
