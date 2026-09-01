# CREDENTIALS.md — Deploy credentials

This file contains the deployment credentials for this project **in plaintext**.

> IMPORTANT: These values are intentionally committed to this repo for this
> low-stakes test project. The project owner has explicitly accepted the risk of
> storing them in a public repo because credentials stored outside the repo do
> not persist across session environments and would break the continuity
> system's purpose. DO NOT assume this pattern is safe for production projects.

## Credential values

| Variable          | Value                                                                                                                        | Used for            | Project        |
|-------------------|------------------------------------------------------------------------------------------------------------------------------|---------------------|----------------|
| `VERCEL_TOKEN`    | `vcp_1HjsppAyJTM33ZtjpHVO7g7wJS16zrbUbBj1XQOGAZZWmGdbLF4FpuBy`                                                               | `vercel --token`    | server-six-vert |
| `FIREBASE_TOKEN`  | `1//0gmwHuLmy5qpZCgYIARAAGBASNwF-L9IrdpnUCzFU2ImJLTzfttxIYVT76bookqjajDOrCvvzKJ0v5BWr-s3mwElb6xsJkaR6ww0`                  | `firebase deploy`   | scholarhive-913e4 |

## How a future session uses them

Use the values from this file directly (export them inline, or read from this
file) — there is no external env file to source:

```bash
VERCEL_TOKEN="vcp_1HjsppAyJTM33ZtjpHVO7g7wJS16zrbUbBj1XQOGAZZWmGdbLF4FpuBy"
FIREBASE_TOKEN="1//0gmwHuLmy5qpZCgYIARAAGBASNwF-L9IrdpnUCzFU2ImJLTzfttxIYVT76bookqjajDOrCvvzKJ0v5BWr-s3mwElb6xsJkaR6ww0"

# client — guarded build + deploy:
cd /workspace
npm run deploy          # builds with the Vercel server URL, rejects any localhost leak, then firebase deploy

# server (sibling repo):
cd ../Schole-hive-server
npx vercel link --project server --yes --token "$VERCEL_TOKEN"   # first time only
npx vercel --prod --yes --token "$VERCEL_TOKEN"                  # optional — GitHub push to main auto-deploys
```

Full deploy walkthrough: `docs/DEPLOY.md`.

## Guardrails

- These values are intentionally committed for this test project; do not assume
  this pattern is safe for production projects.
- If you suspect a token leaked (e.g. you see unexpected usage or billing), tell
  the project owner so it can be rotated in Firebase Console / Vercel dashboard,
  and update the values in this file.
