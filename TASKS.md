# TASKS.md — School-Hive (client)

Live project status. Keep this file current every session:
- When you START a unit -> move it to **IN PROGRESS**.
- When you FINISH a unit -> move it to **DONE** (then archive to `docs/TASK_HISTORY.md` at milestone).
- When you find new work -> add it to **BACKLOG** (or **TODO** if next).

History: `docs/TASK_HISTORY.md` (archived DONE) · Narrative: `docs/HANDOFF_LOG.md` · Deploy: `docs/DEPLOY.md`.

---

## IN PROGRESS

- Nothing — transformation shipped 2026-09-01, awaiting manual smoke

## DONE — Scholarship Transformation (2026-09-01)

- [x] Phase 0 — Archive DONE → `docs/TASK_HISTORY.md` (both repos)
- [x] Phase 1 — Server: faceted `GET /allScholership` (+ aliases), pagination `{data,total,page,totalPages}`, indexes, secured writes `verifyToken+verifyModaretor`, saved collection `POST/GET/DELETE /saved`, `GET /scholarships/stats`, schema `eligibility/benefits/duration/tags/currency` (pushed `a811734`, Vercel token blocked)
- [x] Phase 2 — Unified `ScholarshipCard` (browse/manage/compact) + `ScholarshipGrid/ScholarshipList` + `CountdownBadge` + `FilterChip`; `useScholership` params-aware + `useSaved/useToggleSave/useScholarshipStats`; `AllScholership` rebuilt (debounced q `400ms`, facets drawer/bottom-sheet, chips, sort `recommended/deadline/rating/newest/fees`, Grid/List, pagination 12/10, URL sync `?q=&category=&degree=&country=&maxFees=&sort=&page&view`, compare bar 4, saved toggle, `EmptyState` fix); `TopScholarship` rated sort + `Highlights` wired to `/stats` + `ScholershipStatic` rewritten to How it works + trending destinations
- [x] Phase 3 — `ScholarshipDetails` countdown + save/share/compare + eligibility/benefits/tags pills + `Intl.NumberFormat` + expired guard; new routes `/compare` + `/saved` + `/userDashboard/saved` + aliases `/scholarships/*`; `SavedScholarships` + `Compare` pages
- [x] Phase 4 — `ManageScholarships` unified card + search + `useAxiosSecure` delete; `AddScholarship/EditScholarship` secured (`useAxiosSecure`), new fields `currency/duration/eligibility/benefits/tags`, fix `masters→Masters` + `subjectName2` drop, `build 1.16MB` ok, dev `http://localhost:5173` ok

---

## BACKLOG / KNOWN GAPS

- [ ] Rotate `VERCEL_TOKEN` (expired, `docs/CREDENTIALS.md:15` invalid) then `npx vercel --prod --yes --token` to publish server `a811734` live.
- [ ] Add automated tests (no test framework — `npm test` undefined).
- [ ] Move hardcoded server URL (`server-six-vert.vercel.app`) into `VITE_` env var.
- [ ] Centralize remaining duplicated cards (application/review).
- [ ] Accessibility & responsive polish for Home/hero.
- [ ] Consider `zod` validation centralization for `ScholarshipForm` dedup (partial done — fields added but not full `zod`).
