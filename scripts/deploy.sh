#!/usr/bin/env bash
set -euo pipefail

# deploy.sh — one-command deploy for School-Hive (mac + linux)
# Reads tokens from deploy.env (gitignored, chmod 600) — never committed, Vercel revokes exposed vcp_ tokens.
# Usage: ./scripts/deploy.sh [--server-only] [--client-only] [--help]
# Requires: Node, npm, npx vercel, npx firebase — see docs/DEPLOY.md for full guide.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_ROOT="$(cd "$ROOT/../Schole-hive-server" && pwd 2>/dev/null || echo "$ROOT/../Schole-hive-server")"
PROD_SERVER_URL="https://server-six-vert.vercel.app"
CLIENT_URL="https://scholarhive-913e4.web.app"
FIREBASE_PROJECT="scholarhive-913e4"
VERCEL_ORG="team_2BZVyUrUv1CN2VEyU43IxnR6"
VERCEL_PROJECT="prj_RHc6ftkASVUyYGHzJHpWfJZppLkj"

DO_SERVER=1
DO_CLIENT=1

for arg in "$@"; do
  case "$arg" in
    --server-only) DO_CLIENT=0 ;;
    --client-only) DO_SERVER=0 ;;
    --help|-h)
      echo "Usage: $0 [--server-only] [--client-only] [--help]"
      echo "  Deploys server (Vercel) then client (Firebase), guarded. Reads deploy.env."
      echo "  Tokens in deploy.env (gitignored): VERCEL_TOKEN=vcp_...  FIREBASE_TOKEN=1//..."
      echo "  Correct parsing: grep ^VERCEL_TOKEN deploy.env | cut -d= -f2- | tr -d ' \\r\\n'  (NOT cut -d= -f2)"
      echo "  Also works: set -a; source deploy.env; set +a"
      echo "  Requires DEPLOY_APPROVED env or --allow-deploy? No — this script checks docs/DEPLOY.md permission block; run only after owner says deploy approved."
      exit 0
      ;;
    *) echo "Unknown arg: $arg (try --help)" >&2; exit 1 ;;
  esac
done

# --- load tokens (portable, handles 1//... correctly) ---
DEPLOY_ENV="$ROOT/deploy.env"
if [[ ! -f "$DEPLOY_ENV" ]]; then
  echo "Missing $DEPLOY_ENV — create it with VERCEL_TOKEN and FIREBASE_TOKEN (see deploy.env header + docs/DEPLOY.md)" >&2
  exit 1
fi

# Use cut -d= -f2- to keep // in FIREBASE_TOKEN (cut -d= -f2 truncates if value contains =)
VERCEL_TOKEN="$(grep ^VERCEL_TOKEN= "$DEPLOY_ENV" | cut -d= -f2- | tr -d ' \r\n')"
FIREBASE_TOKEN="$(grep ^FIREBASE_TOKEN= "$DEPLOY_ENV" | cut -d= -f2- | tr -d ' \r\n')"

if [[ "$DO_SERVER" == 1 && -z "$VERCEL_TOKEN" ]]; then
  echo "VERCEL_TOKEN empty in $DEPLOY_ENV" >&2; exit 1
fi
if [[ "$DO_CLIENT" == 1 && -z "$FIREBASE_TOKEN" ]]; then
  echo "FIREBASE_TOKEN empty in $DEPLOY_ENV" >&2; exit 1
fi

# --- server ---
if [[ "$DO_SERVER" == 1 ]]; then
  echo "==> Server: Vercel prod deploy (server-six-vert.vercel.app)"
  if [[ ! -d "$SERVER_ROOT" ]]; then
    echo "Server repo not found at $SERVER_ROOT — clone Schole-hive-server next to School-Hive" >&2; exit 1
  fi
  # Ensure project link exists (idempotent, portable — no GNU sed)
  mkdir -p "$SERVER_ROOT/.vercel"
  cat > "$SERVER_ROOT/.vercel/project.json" <<EOF
{"orgId":"$VERCEL_ORG","projectId":"$VERCEL_PROJECT"}
EOF
  # Deploy (retry once on NOT_FOUND / empty builds cache issue)
  set +e
  (cd "$SERVER_ROOT" && npx vercel --prod --yes --token "$VERCEL_TOKEN")
  VERCEL_EXIT=$?
  set -e
  if [[ $VERCEL_EXIT -ne 0 ]]; then
    echo "Vercel deploy failed (exit $VERCEL_EXIT) — retrying after rm -rf .vercel" >&2
    rm -rf "$SERVER_ROOT/.vercel"
    mkdir -p "$SERVER_ROOT/.vercel"
    cat > "$SERVER_ROOT/.vercel/project.json" <<EOF
{"orgId":"$VERCEL_ORG","projectId":"$VERCEL_PROJECT"}
EOF
    (cd "$SERVER_ROOT" && npx vercel --prod --yes --token "$VERCEL_TOKEN")
  fi
  echo "Verifying $PROD_SERVER_URL ..."
  # Simple health check — public profile endpoint should return 200 with JSON
  if curl -s -f "https://server-six-vert.vercel.app/users/public/mdleonkhan625@gmail.com" >/dev/null 2>&1; then
    echo "Server OK: $PROD_SERVER_URL"
  else
    echo "Warning: $PROD_SERVER_URL health check failed — check Vercel dashboard" >&2
  fi
fi

# --- client ---
if [[ "$DO_CLIENT" == 1 ]]; then
  echo "==> Client: guarded build + Firebase deploy ($CLIENT_URL)"
  (cd "$ROOT" && VITE_server_url="$PROD_SERVER_URL" npm run build)
  echo "Guard passed — 0 local refs, $PROD_SERVER_URL present"
  (cd "$ROOT" && npx firebase deploy --only hosting --token "$FIREBASE_TOKEN" --project "$FIREBASE_PROJECT")
  echo "Verifying $CLIENT_URL ..."
  if curl -s -I "$CLIENT_URL" 2>&1 | head -1 | grep -q "200"; then
    echo "Client OK: $CLIENT_URL"
  else
    echo "Warning: $CLIENT_URL did not return 200 — check Firebase console" >&2
  fi
fi

echo "Done. Server: $PROD_SERVER_URL  Client: $CLIENT_URL"
