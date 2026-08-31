# HANDOFF_LOG.md — School-Hive (client)

Session-by-session handoff log. **Newest entry at the top.**
Every session that does meaningful work appends a dated entry here before finishing
(or before hitting a token/budget limit) and commits + pushes it.
Format: one entry per session, `YYYY-MM-DD` heading, then a short summary of
DONE / IN PROGRESS / LEFT / DECISIONS & CONTEXT.

---

## 2026-08-31 — Deploy credentials moved into the repo

**What was done**
- Per owner decision, deploy credentials are now committed directly in `docs/CREDENTIALS.md` (plaintext). Credentials stored outside the repo did not persist across session environments, breaking the continuity system's purpose.
- Updated `docs/CREDENTIALS.md`, `docs/DEPLOY.md`, `AGENTS.md`, and the `session-handoff` skill to use the in-repo values directly (no more sourcing `~/.config/school-hive/deploy.env`).
- Mirrored the same changes in the server repo (`../Schole-hive-server/docs/CREDENTIALS.md` and `docs/DEPLOY.md`).

**Decisions & context**
- `docs/CREDENTIALS.md` is now the single source of truth for deploy tokens (Vercel + Firebase). The owner accepted the risk of committing them to this low-stakes test repo. Do NOT assume this pattern is safe for production.
- The old external file `~/.config/school-hive/deploy.env` may still exist in some environments but is no longer the source of truth. `deploy.env` remains gitignored as a safety net.

**In progress**
- Nothing. Baseline established.

**Left / next**
- See `TASKS.md` BACKLOG.

---

## 2026-08-31 — Session-continuity system setup

**What was done**
- Created the session-continuity system: `AGENTS.md`, `TASKS.md`, `docs/HANDOFF_LOG.md`, `docs/DEPLOY.md`, `docs/CREDENTIALS.md`, and a `session-handoff` skill under `.ai-ready/skills/`.
- Baked standing working rules into `AGENTS.md`: commit after every small unit of progress, push after every commit, and emergency commit+push before running out of token budget (with continuity files updated first).
- Hardened `.gitignore`: added `deploy.env`, `*.pem`, `*.key`, `.firebase/`, and an explicit `!.env.example` keep-rule.

**Decisions & context**
- Chose the `AGENTS.md` convention (used by opencode, Cursor, Claude Code) as the single always-loaded rules file, with `TASKS.md` + `docs/HANDOFF_LOG.md` as the state/narrative, and a `session-handoff` skill as the ritual future agents load on start.
- NOTE (superseded): deploy tokens were initially stored at `~/.config/school-hive/deploy.env` outside the repo, but are now committed directly in `docs/CREDENTIALS.md` per the owner's decision (see entry above).
- The client had no test framework; `npm run lint` is the main gate. Builds via `npm run build`.

**In progress**
- Nothing. Baseline established.

**Left / next**
- See `TASKS.md` BACKLOG for candidate work (no automated tests, server URL hardcoded in axios hooks, duplicated card components, etc.).

---

_(older entries go below — none yet; this is the first session recorded)_
