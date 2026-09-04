# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

> **Archive rule for new agents:** If a `## TODO — <Group>` batch is fully `[x]` checked (e.g. Profile System Redesign below was all done), move the entire batch to `docs/TASK_HISTORY.md` (newest block at top) and keep `TASKS.md` lean — `TASKS.md` should only hold `IN PROGRESS` + active `TODO`s + `DONE` stubs.

---

## IN PROGRESS

- None — all P2 batches completed, see `DONE` stubs and `TODO — Deferred` backlog below.

---

## TODO — MonkeyCode Deferred — P3 Backlog (2026-09-04)

> Not active — P3 nice-to-have, deferred per triage. File as future TODO only if you want. Each still one-sitting but low value/risk.

- [ ] **D1. [P3] ScholarshipCard duplication** — `src/Pages/AllScholership/ScholarshipCard.jsx` vs `src/Component/scholarship/ScholarshipCard.jsx` both used (discovery vs manage). Keep both for now; consolidate only if visual drift confirmed. No Verify until scheduled.

- [ ] **D2. [P3] AllScholership `Recommended` vs `Highest rated` identical** — `AllScholership.jsx:109` `rating` + `reviewsCount` same branch. Make `recommended` weighted `rating*0.6+recency*0.3+reviews*0.1` or drop duplicate. Defer.

- [ ] **D3. [P3] AllScholership dual client/server filtering `serverHasFilter~119`** — `AllScholership.jsx:89-130` implicit `resp.total vs filteredSorted.length` switch fragile. Pick server truth once facets ship. Defer.

- [ ] **D4. [P3] Compare N+1 + ids truncated** — `Compare.jsx:40 Promise.all GET /allScholership/:id ×4` + `slice 0,4` silent. Batch `GET /allScholership?ids=a,b` server endpoint needed. Defer (needs server).

- [ ] **D5. [P3] MyApplication dead lines + no pagination + useDebounced duplication** — `MyApplication.jsx:34` `next.delete("view"); next.set("view",view)` no-op, unbounded `apply` load, `AllScholership.jsx:25` + `BrowseQuestions.jsx:14` duplicate `useDebounced`. Extract `src/Hooks/useDebounce.js`. Defer.

---

## DONE — Performance Optimization (2026-09-04, 14 ranks, 13 branches)

- [x] **R1 pagination** `scholarship/review/apply/saved/question` `limit 20 max 50` + callers fix
- [x] **R2 compression** `compression 1.8.1` gzip
- [x] **R3+R8 images + Home lazy** `WebP 60%` src 26→12M, `Home` 110→68KB
- [x] **R4 icons** `lucide` only, `firebase/auth` lazy
- [x] **R5 fonts** 6→3 weights + preconnect API
- [x] **R6 rerenders** `useMemo/useCallback/memo` + singleton axios
- [x] **R7 roles** single `useRole`
- [x] **R9 cache** firebase `Cache-Control` + server LRU 30s
- [x] **R10 indexes** 9 new
- [x] **R11 parallel** `Promise.all` stats
- [x] **R12 bulk** `aggregate` rating + `bulkWrite`
- [x] **R13 jwt async** + HSTS + global 100/min
- Deferred per prompt: sweetalert vs toast, self-host fonts, dual-write tx, string→Date migration
- Report: `docs/PERFORMANCE_REPORT.md`, log: `docs/HANDOFF_LOG.md 2026-09-04`

## TODO — Next
- Merge `perf/*` branches into main in rank order + live `explain()` + Lighthouse + deploy (needs owner "deploy approved").
