# CREDENTIALS.md — Deploy credentials registry

This file is the **registry** for deployment secrets. It lists what exists and where
it lives. It deliberately contains NO secret values — secrets are never committed to
this repo (see the `No secrets in the repo` rule in `AGENTS.md`).

## Where credentials are stored

Deploy tokens live OUTSIDE the repo, in a single git-ignored env file owned by the
session environment:

```
~/.config/school-hive/deploy.env
```

Permissions on that file are `600` (owner read/write only). The same filename
(`deploy.env`) is gitignored in both this repo and `Schole-hive-server` as a
safety net, so even a copy of the file could never be committed.

## What's in it

The file defines these variables:

| Variable          | Used for            | Project        |
|-------------------|---------------------|----------------|
| `VERCEL_TOKEN`    | `vercel --token`    | server-six-vert |
| `FIREBASE_TOKEN`  | `firebase deploy`   | scholarhive-913e4 |

If the file is missing, the tokens must be re-supplied by the project owner and
written back to `~/.config/school-hive/deploy.env` (mode `600`).

## How a future session uses them

To deploy, source the file and pass the vars to the CLI (never echo the values,
never write them into any tracked file):

```bash
set -a
# shellcheck disable=SC1091
. ~/.config/school-hive/deploy.env
set +a

# client
cd /workspace && npm run build
npx firebase-tools deploy --only hosting --token "$FIREBASE_TOKEN"

# server (sibling repo)
cd ../Schole-hive-server
npx vercel --prod --token "$VERCEL_TOKEN"
```

Full deploy walkthrough: `docs/DEPLOY.md`.

## Guardrails

- NEVER print, log, or write a token value into a repo file, a commit message, or a
  support request.
- If you suspect a token leaked, tell the project owner so it can be rotated in
  Firebase Console / Vercel dashboard and re-written to `deploy.env`.
