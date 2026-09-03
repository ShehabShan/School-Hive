# Q&A Forum — Founding-Cohort Seeding Checklist (Task 13, ops-only)

This is the V1 launch checklist for the Q&A Forum — no code, just operations.
Corridor chosen per Q9 resolved: **Bangladesh → Canada (provisional)** — see `TASKS.md:65` caveat.

## 0. Corridor validation (before recruiting)
- [ ] Manually check post-frequency in 2–3 named Bangladesh↔Canada Facebook groups (and 1 alternate, e.g. India→Germany) — confirm active high volume per spec Appendix.
- [ ] If Canada corridor volume low, fallback to India→Germany (validate same way).
- [ ] Record decision + date + group names in this file.

## 1. Recruit founding cohort (pre-launch)
- [ ] Identify 15–25 recent scholarship recipients / current students abroad in Bangladesh→Canada corridor.
- [ ] Identify 5–10 best FB-group answerers in that corridor (quality > quantity).
- [ ] Personal invite pitch: “expertise evaporates in chat, here it compounds + is credited by name” (spec 5.2). No scraping — invite people, not copy posts.
- [ ] Confirm availability + Verified docs (student ID / admission letter / enrollment) for day-one trust transfer.

## 2. Seed content (100–300 Q&A pairs before public)
- [ ] Each question: `category` + `tags 1–5` + `context { destinationCountry: Canada, homeCountry: Bangladesh, studyLevel, fieldOfStudy }` + `language` + source link where factual (visa scores, deadlines, fees).
- [ ] Cover 7 categories at least 10 questions each; prioritize Scholarships & Financial Aid, Visa & Application Process, Test Prep for this corridor.
- [ ] Ensure tags use controlled vocab slugs (e.g. `ielts`, `canada`, `scholarship`, `visa`) — display label auto-title-cased.
- [ ] Body: markdown, code-switched allowed (Banglish/Hinglish) as typed.
- [ ] Duplicate check: seed via `AskQuestion` → `DuplicatePanel` should show no false duplicates for seeded set.

## 3. Verification & badges
- [ ] All founding cohort submit `POST /verify-request` (credentialUrl) → superadmin approves via `/adminDashboard/verifyRequests` → `GET /users/me` returns `isVerified:true`.
- [ ] Verified badge visible on profile (`ProfileHeader`) + every answer header (`AnswerCard`).

## 4. Quality & freshness
- [ ] Each seeded answer with numeric/policy claim has `sourceLink` (+3) — auditable.
- [ ] No AI-hallucinated numbers; review one peer per answer before seed freeze.

## 5. Launch readiness
- [ ] Corridor has 100–300 seeded questions each with above fields, founding cohort Verified.
- [ ] Day-one visitor via `BrowseQuestions` (`/questions`) sees populated grid, not empty room; `QAPage` schema present on `/questions/:id`.
- [ ] Point table active: test upvote → +10, question upvote → +2, accepted → +15, source → +3, daily cap 50.
- [ ] Public can read/search without account; posting/voting requires sign-in.

## 6. Post-launch
- [ ] Monitor `GET /questions` analytics, reputation daily cap, downvote reasons weekly.
- [ ] Expand corridor-by-corridor only after first corridor demonstrably working (spec 5.1).

---
*Ops-only — no code stubs. Update this checklist as recruiting progresses.*
