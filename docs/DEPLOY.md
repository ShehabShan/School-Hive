# DEPLOY.md — How to build & deploy

> **⛔ DEPLOY PERMISSION REQUIRED — DO NOT DEPLOY WITHOUT OWNER APPROVAL**
> Agents (and humans following agent instructions) MUST NOT run `npm run deploy`, `npm run build:prod` for deploy, `npx firebase deploy`, `npx vercel --prod`, or `git push origin main` (server) without the owner's explicit `deploy approved` / `yes deploy` message in the current session. Ask via the `question` tool and wait. See `AGENTS.md` §2 "DEPLOY BLOCK". Pushing to `feature/*` is allowed; production deploys are blocked.

Two independent deployments:

| Piece | Host | Repo | URL |
|-------|------|------|-----|
| Client | Firebase Hosting | `School-Hive` (this repo) | https://scholarhive-913e4.web.app |
| Server | Vercel | `Schole-hive-server` | https://server-six-vert.vercel.app |

Tokens are **local-only** in `deploy.env` at the repo root (`School-Hive/deploy.env` and identical `Schole-hive-server/deploy.env`). They are gitignored (`deploy.env`, `chmod 600`) and **never committed** — Vercel revokes exposed `vcp_` tokens. Rotate via `https://vercel.com/account/tokens` (Vercel) and `npx firebase login:ci --project scholarhive-913e4` (Firebase), then update both `deploy.env` files (keep them in sync: `cp School-Hive/deploy.env Schole-hive-server/deploy.env`).

## Fast path — one command (reads `deploy.env` automatically)

```bash
# from School-Hive/ — deploys server then client, guarded
./scripts/deploy.sh              # both (default)
./scripts/deploy.sh --server-only  # only Vercel
./scripts/deploy.sh --client-only  # only Firebase (guarded build)
./scripts/deploy.sh --help       # usage + token parsing notes
# npm aliases:
npm run deploy          # same as ./scripts/deploy.sh
npm run deploy:server   # server only
npm run deploy:client   # client only
npm run build:prod      # guarded build only (no deploy)
```

`deploy.sh` handles: correct token parsing for `FIREBASE_TOKEN=1//...` (not `cut -d= -f2`), `VITE_server_url` guard, `.vercel/project.json` creation (`team_2BZVyUrUv1CN2VEyU43IxnR6` / `prj_RHc6ftkASVUyYGHzJHpWfJZppLkj`), cache-bust retry on `NOT_FOUND`, and post-deploy `curl` verification.

## The localhost trap (read first)

The dev `.env` sets `VITE_server_url=http://localhost:5000` so local sessions hit the local server. A plain `npm run build` bakes that localhost URL into `dist/` — **deploying that breaks production**. Always deploy the client through the guarded path (`npm run build:prod` or `npm run deploy` / `./scripts/deploy.sh`), which:

1. Forces `VITE_server_url=https://server-six-vert.vercel.app` (dev `.env` is ignored),
2. Builds the bundle, then
3. Fails with a non-zero exit if any `localhost`/`127.0.0.1` reference survives, or if the Vercel server URL is missing from the bundle (`scripts/check-dist-server-url.mjs`).

## Manual steps (if not using `deploy.sh`)

### Correct token parsing (do not use `cut -d= -f2`)

```bash
# preferred — handles 1//... correctly
set -a; source deploy.env; set +a
echo "$VERCEL_TOKEN" | cut -c1-8   # check: vcp_4BBr
# without source (portable, mac + linux):
VERCEL_TOKEN=$(grep ^VERCEL_TOKEN deploy.env | cut -d= -f2- | tr -d ' \r\n')
FIREBASE_TOKEN=$(grep ^FIREBASE_TOKEN deploy.env | cut -d= -f2- | tr -d ' \r\n')
# wrong: grep ... | cut -d= -f2  (truncates if value ever contains =)
```

### Client (Firebase Hosting) — this repo

```bash
npm install
VITE_server_url=https://server-six-vert.vercel.app npm run build   # runs guard, must say OK — 0 local refs
# or
npm run build:prod   # same as above, alias
npx firebase deploy --only hosting --token "$FIREBASE_TOKEN" --project scholarhive-913e4
```

Firebase project id is `scholarhive-913e4` (see `.firebaserc` / `firebase.json`).

### Server (Vercel)

The project is **already linked to GitHub** (`ShehabShan/Schole-hive-server`) with auto-deploy: every push to `main` deploys `https://server-six-vert.vercel.app`. Normal flow:

```bash
cd ../Schole-hive-server
git checkout main && git pull
git merge feature/xxx          # promote work to main
git push origin main           # Vercel auto-deploys
```

CLI fallback (when GitHub integration is off or you need immediate deploy): project is **`server`** (`server-six-vert.vercel.app`, `orgId team_2BZVyUrUv1CN2VEyU43IxnR6`, `projectId prj_RHc6ftkASVUyYGHzJHpWfJZppLkj`). Link to the existing project first or you'll create a throwaway:

```bash
cd ../Schole-hive-server
mkdir -p .vercel && cat > .vercel/project.json <<'EOF'
{"orgId":"team_2BZVyUrUv1CN2VEyU43IxnR6","projectId":"prj_RHc6ftkASVUyYGHzJHpWfJZppLkj"}
EOF
npx vercel --prod --yes --token "$VERCEL_TOKEN"
# if https://server-six-vert.vercel.app returns NOT_FOUND (0 builds / cache): rm -rf .vercel && retry the block above
```

The server reads its env vars (`DB_USER`/`DB_PASS`, `ACCESS_TOKEN_SECRET`, `ADMIN_EMAILS`) from the Vercel project's Environment Variables panel — they are configured there, not in the repo. For local runs, mirror those values into the gitignored `Schole-hive-server/.env`.

## Order & verification

1. Deploy the server first (push to `main` or CLI), confirm `curl -s https://server-six-vert.vercel.app/users/public/mdleonkhan625@gmail.com | grep '"city": null'` is not `"city": "null"` and `GET /users/me` auth gate returns `{"message":"unauthorize access"}`.
2. Deploy the client, confirm `grep -c "localhost:5000" dist/assets/*.js` is 0 (guard enforces this) and `curl -I https://scholarhive-913e4.web.app` is 200.
3. Smoke-test auth (sign up / log in) since it round-trips client → server `/jwt`.

## Troubleshooting

- **`NOT_FOUND bom1::...` on server-six-vert after `vercel --prod`**: build had 0 files / `Restored build cache` with empty `builds: []`. Fix: `rm -rf .vercel && npx vercel --prod --yes --token "$VERCEL_TOKEN"` (forced rebuild, 50+ files, `Build Completed ... [3s]`).
- **`The token provided via --token is not valid`**: you used `cut -d= -f2` which truncates `FIREBASE_TOKEN=1//...` or has trailing spaces/`\r`. Use `cut -d= -f2- | tr -d ' \r\n'` or `source deploy.env`.
- **`invalidToken` on Vercel API**: token expired — rotate at `https://vercel.com/account/tokens` and update both `deploy.env` files.
- **`firebase deploy` 401 / `Failed to authenticate`**: `FIREBASE_TOKEN` expired — `npx firebase login:ci --project scholarhive-913e4` and update both `deploy.env` files.

## Local dev

```bash
cd School-Hive && cp .env.example .env   # VITE_* Firebase values + VITE_server_url=http://localhost:5000
cd School-Hive && npm run dev            # Vite on :5173 — talks to the local server on :5000
cd ../Schole-hive-server && npm start    # local API (needs Schole-hive-server/.env)
```

`VITE_server_url` defaults to the Vercel server if unset, so a deploy build without `.env` is still safe — but always use the guarded commands anyway.
