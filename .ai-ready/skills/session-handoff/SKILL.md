---
name: session-handoff
description: Session-start orientation and session-end handoff ritual. Load at the START of any session in this repo, and follow the "End of session / budget pressure" steps before finishing work or when running low on token budget. Ensures a brand-new AI session can resume exactly where the last one stopped.
---

# Session Handoff

This project uses a written continuity system so that any AI session (possibly a
different tool or agent) can pick up where the last one left off without the human
re-explaining anything. The system lives in the repo and is therefore available to
any future session that has access to it.

## At the START of a session

Follow the mandatory onboarding in `AGENTS.md` (this is the same rule). In short:

1. Read `TASKS.md` — DONE / IN PROGRESS / BACKLOG.
2. Read the newest (top) entry in `docs/HANDOFF_LOG.md` — the last session's
   summary, decisions, and what it left unfinished.
3. Read `docs/DEPLOY.md` and `docs/CREDENTIALS.md` — how to build/deploy and where
   deploy secrets live (secrets are NOT in the repo).
4. Read `../Schole-hive-server/AGENTS.md` if the sibling server repo is present.

Then verify the actual state against the docs before trusting them completely
(e.g. `git status`, `git log --oneline -5`). If the docs are out of date, fix them
as part of your first task.

## While working

- Update `TASKS.md` as units move from BACKLOG -> IN PROGRESS -> DONE.
- Follow the standing working rules in `AGENTS.md`:
  - commit after every small, working unit of progress,
  - push after every commit,
  - no debug leftovers,
  - deploy credentials for this test project are intentionally committed in
    `docs/CREDENTIALS.md` (see `AGENTS.md` for the exact policy).

## At the END of a session (or under token-budget pressure)

If you are about to stop, OR if you risk running out of context/token budget
mid-task, do this BEFORE anything is left uncommitted:

1. **Commit + push whatever is currently done and working** — even if incomplete
   or unpolished. Never leave work only in the session environment.
2. Append a dated entry to the TOP of `docs/HANDOFF_LOG.md` (keep previous
   entries below), with:
   - what was DONE this session,
   - what is IN PROGRESS (and where exactly — file paths, function names),
   - what is LEFT (next steps for the following session),
   - any DECISIONS & CONTEXT that a fresh session needs (chosen approaches,
     constraints, gotchas, links to relevant docs/commits).
3. Update `TASKS.md` to match (mark finished units DONE, move started-but-not-finished
   units to IN PROGRESS, add newly discovered work to BACKLOG).
4. Commit and push those continuity-file updates so the next session sees them
   remotely.

## Output

When the handoff is complete, tell the human: what was committed and pushed, where
the handoff entry was written, and one line on what the next session should do first.
