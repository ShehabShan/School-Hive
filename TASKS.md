# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

---

## IN PROGRESS

- Scholarship Transformation (2026-09-01) — see TODO below

## TODO — Scholarship Transformation

### Phase 0 — Archive (done this session)
- [x] Move completed DONE to `docs/TASK_HISTORY.md` (both repos)

### Phase 1 — Server foundations
- [ ] `GET /allScholership` upgrade: `q/category/subject/degree/country/city/maxFees/deadlineAfter/sort/page/limit`, indexes, pagination `{data,total,page,totalPages}`
- [ ] Secure `POST/PATCH/DELETE /allScholership` with `verifyToken+verifyModaretor`; alias `/scholarships` → same handler
- [ ] Saved/Wishlist: `saved` collection + `POST /saved` toggle, `GET /saved`, `DELETE /saved/:id` (`verifyToken`)
- [ ] `GET /scholarships/stats` real counts; extend schema optional `eligibility/benefits/duration/tags/currency`

### Phase 2 — Unified card + discovery
- [ ] `src/Component/scholarship/ScholarshipCard.jsx` + `ScholarshipGrid.jsx` + `CountdownBadge.jsx` + `FilterChip.jsx` (replace duplication)
- [ ] `useScholership` params-aware + `useSaved` hook; `CardGridSkeleton` loading
- [ ] Rebuild `AllScholership.jsx` (debounced search, faceted drawer/bottom-sheet, chips, sort Grid/List, pagination, URL sync)
- [ ] Refresh `TopScholarship` (rated sort) + wire `ScholarshipHighlights` to `/stats`, remove `ScholershipStatic` fiction

### Phase 3 — Details + Save/Compare
- [ ] `ScholarshipDetails` countdown + save/share + eligibility pills
- [ ] Saved dashboard tab + Compare (2–4) bar/page
- [ ] `EmptyState` prop fix + image fallback + `Intl.NumberFormat`

### Phase 4 — Forms & polish
- [ ] Extract `ScholarshipForm` (dedupe Add/Edit), zod validation, fix `scholarshipName/subjectName` drift + `masters` case
- [ ] Build/lint verification + manual smoke

---

## BACKLOG / KNOWN GAPS

- [ ] Add automated tests (no test framework — `npm test` undefined).
- [ ] Move hardcoded server URL (`server-six-vert.vercel.app`) into `VITE_` env var.
- [ ] Centralize remaining duplicated cards (application/review).
- [ ] Accessibility & responsive polish for Home/hero.

