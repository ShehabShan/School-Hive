# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

---

## IN PROGRESS

- E2E smoke test of login/roles vs `localhost:5000` — **blocked**: `Schole-hive-server/.env` not yet created (user must add MONGO/DB creds + ACCESS_TOKEN_SECRET + ADMIN_EMAILS).

## BACKLOG / KNOWN GAPS

- Merge `feature/login-roles` → `main` (both repos) to go live: Vercel auto-deploys server, then `npm run deploy` for client.
- Add automated tests (no test framework — `npm test` undefined).
- Centralize remaining duplicated cards (application/review).
- Accessibility & responsive polish for Home/hero.
- Consider `zod` validation centralization for `ScholarshipForm` dedup (partial done — fields added but not full `zod`).
