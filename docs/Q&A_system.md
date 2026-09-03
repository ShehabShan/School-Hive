# School-Hive Q&A Forum — Feature Specification

**Status:** Ready to build
**Scope:** The Q&A Forum only — the first feature in the School-Hive sequence (Q&A Forum → Scholar Stories → Mentorship Network → SOP Lab → Country Hive). This document treats Mentorship, SOP Lab, and Country Hive as downstream consumers of what this feature produces, not as things to build now — but every design choice below is made with those downstream features in mind, especially Mentorship.

---

## Design Philosophy

Every source of scholarship and study-abroad guidance a South Asian student currently has — a Facebook group, a WhatsApp thread, a paid consultant — shares one property: it's a **conversation**, not an **asset**. The answer a senior gave in a Facebook group six months ago is technically still there, but it's unsearchable, unranked, uncredentialed, and buried under two thousand newer posts. The knowledge doesn't compound. Every cohort of students re-asks the same questions from scratch, and every predatory consultant's business model depends on exactly that: information asymmetry that resets every admissions cycle.

The Q&A Forum's job is to be the opposite of that. Three commitments run through every decision in this document:

1. **Permanence over chat.** A question asked once should, in principle, never need to be asked again. The unit of value isn't a conversation, it's a page — indexed, versioned, improvable, and still useful to a stranger three years from now.
2. **Verified trust over anonymity.** The single biggest thing this platform is selling, against both Facebook groups and ৳10k–50k+ consultants, is *"you can tell who actually knows what they're talking about."* Every mechanic below is designed to make expertise visible and cheap to verify, and to make bad-faith participation expensive.
3. **Compounding knowledge over repeated labor.** Every mechanic should make the *next* person's question easier to answer than the last one — through better tagging, canonical answers, freshness signals, or a bigger pool of proven experts. If a mechanic doesn't compound, it's not pulling its weight.

Everything below — the taxonomy, the reputation system, the moderation model, the migration plan — is an implementation of these three commitments.

---

## 1. Core Mechanics

### 1.1 Asking a question

A question is a structured object, not a free-text post. At compose time, the asker provides:

- **Title** — the question itself, phrased as a question (enforced with a lightweight nudge, not a hard block).
- **Body** — rich text (markdown), with image upload (screenshots of official notices, portals, rejection letters, etc.) and link embedding.
- **Category** (required, single-select from a fixed taxonomy — see 1.2).
- **Tags** (required, 1–5, mix of controlled vocabulary and free-form — see 1.2).
- **Context fields** (optional but strongly prompted, because they're what make this platform smarter than a generic forum):
  - Destination country of interest
  - Home country / education board (Bangladesh–National Curriculum, India–CBSE/ICSE/State board, Pakistan, Nepal, Sri Lanka, etc.)
  - Study level (Bachelor's / Master's / PhD / Diploma / Foundation)
  - Field of study
- **Language** — the question can be posted in English, Bengali, Hindi, or code-switched ("Banglish"/"Hinglish") text as typed. This is a deliberate choice, addressed further in 1.7 and Section 4 — forcing English-only would recreate exactly the barrier that makes the Facebook-group ecosystem feel more accessible than a "formal" platform.

**Design note:** the country/board/level context fields are the single biggest structural advantage this taxonomy has over Stack Overflow-style tagging. A generic tag ("scholarships") tells you the topic; a context field tells you whether an answer is even *relevant* to the asker. "What IELTS score do I need?" has a different correct answer depending on destination country and sometimes home-country passport — encoding that as structured metadata (rather than leaving it buried in prose) is what lets search, matching, and canonical answers actually work. This same metadata is also, not incidentally, the exact seed data Country Hive will need later — a question tagged `destination:Canada` + `home:Bangladesh` is a Country Hive entry waiting to happen.

### 1.2 Taxonomy

**Categories (top-level, fixed, small in number):**
Scholarships & Financial Aid · Visa & Application Process · University & Program Selection · Test Prep (IELTS/GRE/SAT/Duolingo English Test/etc.) · Campus Life & Culture Shock · Careers & Internships Abroad · Country-Specific (sub-categories per destination country).

**Tags:** free-form but suggested/autocompleted from a controlled vocabulary as the user types (mirrors Stack Overflow and GitHub's tag-suggestion UX). A small moderation/synonym-merging privilege (see Section 2) keeps `IELTS` and `ielts-exam` from fragmenting into separate tag clusters.

### 1.3 Duplicate detection at compose time

As the user types the title, a live-search panel shows similar existing questions — pulled by the same search index described in 1.7 — *before* they can submit. This is standard on Stack Overflow, GitHub Issues/Discussions, and most mature Q&A systems, for good reason: it's far cheaper to prevent a duplicate than to merge one later, and it immediately shows the asker the platform already has answers, which is itself a trust-building moment for a first-time visitor.

### 1.4 Answering

Answers are rich text/markdown, can embed images and links, and — this matters more here than on a generic Q&A site — are nudged (not forced) to cite a source for any factual, numeric, or policy claim ("IELTS 6.5 overall, no band under 6.0" should link to the university/embassy page it came from where possible). This nudge is also a reputation lever (Section 2) and a moderation signal (Section 3): a claim with a source is cheaper to trust and cheaper to audit than a bare assertion.

Follow-up questions on an answer live as **threaded comments under that specific answer** (not a general comment wall on the question) — this keeps clarifying back-and-forth attached to the exact claim it's about, the same pattern Stack Overflow and GitHub Discussions both converged on independently.

### 1.5 Accepting and voting

- The asker can mark **one answer as Accepted**, but — deliberately unlike a strict single-answer model — all other answers stay visible and votable. Subjective questions ("Is Germany or Canada better for my situation?") often have several *correct* answers depending on the asker's situation; hiding everything but the top one would throw away exactly the nuance a personal-context question needs.
- **Questions can only be upvoted, never downvoted.** This is a deliberate departure from Stack Overflow, where downvotable questions are a well-documented driver of the platform's reputation for hostility toward newcomers (see Section 8). A first-time asker should never be punished for asking.
- **Answers can be upvoted or downvoted**, but a downvote requires selecting a reason (`outdated`, `unsourced`, `off-topic`, `incorrect`) from a short list — a small piece of friction that converts a drive-by downvote into at least a minimal piece of feedback, and gives the answerer something actionable instead of an unexplained score drop.

### 1.6 Editing and the wiki layer

Any post can be suggested-edited by other users (typo fixes, added sources, updated numbers); low-trust users' edits go into a review queue, high-trust users' edits apply directly (see Section 2 for thresholds). This is essential for the freshness problem described in Section 3 — visa rules and required test scores change yearly, and an answer that was correct in 2024 can be actively harmful in 2026 if nobody can fix it without the original author's involvement.

### 1.7 Search

Full-text search over titles, bodies, and tags, with filters for category, tag, destination country, home country, and study level layered on top. Search should be **language-tolerant**: a query typed in Bengali or Hinglish should still surface relevant English-language answers and vice versa where reasonably possible (lightweight cross-language matching on the structured fields — category, tags, country — carries most of this weight even before any translation layer is involved, since those fields are language-independent). Results rank on a blend of relevance, vote score, recency, and accepted-answer status — conceptually similar to Stack Overflow's relevance ranking, with an explicit recency boost that generic Q&A search often under-weights but this domain can't afford to ignore.

---

## 2. Reputation & Incentives

The numbers below are **starting points, not settled science** — every mature reputation system (Stack Overflow's, Discourse's) was tuned repeatedly against real usage data, and this one should be too. What's fixed is the *structure*; the *thresholds* should move.

### 2.1 What earns points

| Action | Points | Rationale |
|---|---|---|
| Your answer gets upvoted | +10 | Primary quality signal |
| Your question gets upvoted | +2 | Small — asking well is good, but shouldn't rival answering well |
| Your answer is marked Accepted | +15 bonus | Asker confirms it solved their actual problem |
| Your answer includes a verifiable source link | +3 bonus | Rewards the exact behavior (sourcing) that makes claims auditable |
| First answer posted under a newly-created tag | +5, one-time | Seeds coverage in new topic areas as the platform grows |
| Logging in, browsing, existing without contributing | 0 | Deliberate. Brainly's own points-for-login design is a documented driver of low-value, high-volume noise on that platform (Section 8) — presence isn't the thing worth rewarding here, helping is. |

Reputation gained from a single day's activity is capped early on (mirroring Stack Overflow's daily rep cap), and reputation from votes cast by accounts with a mutual, near-exclusive voting history is discounted — both are anti-gaming measures, detailed in Section 8.

### 2.2 The privilege ladder

Privileges unlock progressively with reputation, delegating trust — and moderation capacity — outward as users prove themselves, instead of concentrating it in a small admin team that can't scale with the community (this structure is adapted from Stack Overflow's reputation-gated privileges and Discourse's trust levels, both covered in Section 8's failure-mode analysis of what happens when it's *missing*).

| Reputation | Privilege unlocked |
|---|---|
| 1 (default) | Ask, answer, comment on own posts |
| 15 | Upvote answers |
| 75 | Comment on any post |
| 125 | Downvote (reason required) |
| 300 | Suggest edits (applied directly, no review) |
| 750 | Access the flagged-content review queue |
| 1,500 | Vote to merge duplicate/near-duplicate questions into a canonical entry |
| 3,000 + active in 3 of the last 4 months | **Rising Helper** badge; prioritized in the "questions you can answer" feed (Section 6) |
| 7,500 + active in 6 of the last 9 months + top-decile accept-rate in a category | **Community Expert** badge (category-specific); eligible for Mentor Track nomination (Section 7) |

### 2.3 Non-point incentives

Points unlock privileges, but they're a weak motivator on their own — every platform studied for this spec pairs points with something more legible:

- **Category-specific expertise badges** on the profile ("Canada Study Visas," "Nepal-to-Australia Scholarships") rather than one undifferentiated score — this is what makes an expert *findable* for a specific need, and it's the direct precursor to Mentorship's category-based matching.
- **Impact framing on the profile**: "Helped 340 students this month" reframes the same activity as service rather than competition — a genuine motivational lever distinct from status-seeking, and one that costs nothing to display alongside the numeric reputation score.
- **Answer-streak and login-streak are kept separate**, and only the answer-streak is celebrated. A login streak with no contribution earns nothing (see 2.1) — the goal is to reward showing up *to help*, not just showing up.

### 2.4 Anti-gaming guardrails (built in from day one, not bolted on later)

- Daily reputation cap for new/low-trust accounts.
- Vote weight scales with the voter's own trust level; a vote from a brand-new account counts for less until that account has a track record.
- Votes between two accounts with an unusually exclusive mutual-voting pattern are flagged for review (the same class of detection Reddit uses against vote rings).
- No reputation is awarded for actions that don't require another user's judgment (see 2.1) — the entire point economy is anchored to *other people finding your contribution useful*, never to raw activity volume.

---

## 3. Quality Control & Moderation

The goal stated in the brief — accurate answers, spam and low-effort content discouraged, without heavy manual moderation — is achieved by **layering** cheap, automatic, and delegated defenses so that human moderators only ever see the small residue that nothing else caught. This is the single most important structural lesson from every case study in Section 8: platforms that tried to moderate a growing community with a fixed-size human team either collapsed in quality (Yahoo Answers) or shut the feature down entirely (Duolingo's forums).

### 3.1 The five layers

**Layer 0 — Prevention at compose time.** Duplicate-question detection (1.3), a minimum-effort nudge on very short questions/answers, and required categorization so nothing lands uncategorized in the first place. The cheapest moderation is the post that never needed moderating.

**Layer 1 — Passive community signal.** Upvotes, reason-tagged downvotes, and flags. A small number of flags from trusted accounts (not just raw flag count) is enough to auto-hide a post pending review — this alone handles the obvious cases (spam, off-topic, abusive) without any human in the loop.

**Layer 2 — Delegated community moderation.** Once a user crosses the 750-reputation threshold (2.2), they get access to review queues: flagged posts, first posts by brand-new users, suggested edits, and low-quality-answer review — directly modeled on Discourse's trust-level system and Stack Exchange's review queues. This is the mechanism that lets moderation capacity grow *with* the community instead of needing separate, linear investment as the platform scales.

**Layer 3 — Automated detection.** Spam-link and plagiarism detection running on every new post; a lightweight toxicity/tone classifier flags harsh or dismissive comments for review rather than blocking them outright (false positives are cheaper to review than a chilling effect on legitimate bluntness); new accounts are rate-limited.

**Layer 4 — Human escalation.** Reserved for appeals, safety issues (harassment, actual scam reports), and genuine edge cases the first four layers can't resolve. By design, this should be the *smallest* layer and the last resort — if Layer 4 is doing most of the work, the system above it isn't working.

### 3.2 The freshness problem

This is specific to this domain in a way none of the platforms researched for this spec fully solve, because none of them deal in content this time-sensitive: a visa policy, a required IELTS band, or a scholarship deadline that was correct in 2024 can be actively wrong in 2026. Generic Q&A platforms treat an old, highly-upvoted answer as reliably good; that assumption breaks here.

**Mechanism:** any answer in a fast-changing category (visa rules, deadlines, required scores) is tagged with a **"Last confirmed accurate: [date] by [N] users"** indicator. Once an answer passes an age threshold in one of those categories, readers see a lightweight "Is this still accurate?" prompt; enough "no" responses (or a suggested edit from a high-trust user) surfaces it for review and visually flags it for other readers in the meantime. This turns content decay from a silent failure mode into a visible, community-repairable one.

### 3.3 The ghostwriting boundary

Because one of this platform's categories is essentially "help with my SOP/essay," it inherits a risk Chegg never fully escaped: the gap between "helping someone understand and write their own material" and "writing it for them" is exactly where a free, well-intentioned Q&A answer can slide into an academic-integrity problem, or into training students to expect a finished product rather than feedback. The guideline, enforced through the same flag/review mechanism as everything else: **answers give feedback on a draft, point to structure and examples, and explain what strong answers do — they don't produce a submittable SOP for someone else's application.** This is a policy line, not a technical one, but it's worth stating explicitly here because it's the boundary most likely to erode quietly if it isn't named.

---

## 4. Discoverability

### 4.1 Browse

For visitors without a specific query: category landing pages, trending-this-week questions, and curated "Best of [Category]" collections. This matters disproportionately for a platform trying to look credible on day one, when there isn't yet enough content for search to be the primary discovery path (see Section 5).

### 4.2 Search

Covered in 1.7. The filter combination that matters most for this domain specifically is **destination country × home country × category** — a search for "scholarship" that can be narrowed to "Bangladesh → Germany, Master's" in two clicks is doing something no Facebook group search bar can do.

### 4.3 SEO and the AI-answer-engine era

Every question page should carry `QAPage` structured data (schema.org) — the same markup Stack Overflow and Quora use to become eligible for Google's Q&A rich results. It's worth being precise about what this does and doesn't buy in 2026: Google has scaled back how often Q&A rich results are visually shown compared to a few years ago, so this shouldn't be sold internally as a guaranteed traffic firehose. What it still reliably does is give Google (and AI answer engines — AI Overviews, and general-purpose assistants that cite web sources) a much cleaner signal for *what the page actually is*, which measurably helps both indexing and the odds of being the cited source when someone's query gets answered by an AI summary rather than a list of blue links. Either way, this is the acquisition channel no Facebook group can compete on: a Facebook group's content is functionally invisible to search engines, permanently. Every public question page here is a shot at organic, compounding discovery — which argues for turning schema markup on from launch day, not deferring it, since the value compounds with how long it's been indexed.

### 4.4 Mobile and low-bandwidth design

Given the target audience is mobile-first and often data-conscious, the discoverability surfaces above should degrade gracefully on slow connections — lightweight pages, lazy-loaded images, and a search experience that doesn't assume a fast connection to feel responsive. This isn't a separate feature so much as a constraint that should shape how 4.1–4.3 are actually built.

---

## 5. Migration & Onboarding: Winning the Exodus from Facebook and WhatsApp

This is where most of the platform's actual risk lives — everything in Sections 1–4 is wasted if nobody shows up on day one, and a Q&A platform's core weakness is that its value is entirely dependent on the content already there. This is a textbook two-sided cold-start problem, and the biggest strategic mistake available here is the one Google+ made: launching wide, to everyone, before there's a reason for any specific visitor to stay (Google+ reportedly saw the majority of its early sessions last under five seconds — people landed on an empty feed and left). The fix, consistent across every successful case studied for this spec — Quora's founder personally inviting known experts to seed early content, LinkedIn's invite-only launch through employee and investor contact lists — is the opposite: **launch narrow, seeded, and invited, not broad and empty.**

### 5.1 Launch narrow, not wide

Don't launch all five countries × all destination markets simultaneously. Pick one corridor with the highest existing Facebook-group activity (per the original market research, likely something like Bangladesh→Canada or India→Germany) and seed *that* corridor deeply enough that the first hundred visitors find something genuinely better than what they'd get in the group they came from. Expand corridor by corridor once one is demonstrably working, not before.

### 5.2 Recruit a founding cohort before public launch

Never launch with zero questions. Before the platform is public, recruit a small group of recent scholarship recipients / current students abroad / high-value FB-group answerers in the chosen corridor, and seed 100–300 real, high-quality Q&A pairs. This does double duty: day-one visitors see a credible, populated resource instead of an empty room, and the founding cohort becomes the first candidates for the Rising Helper / Community Expert badges in Section 2 — they're not just seed content, they're the platform's first reputation economy.

A specific, high-leverage tactic within this: identify the people who are *already* the best answerers inside the target Facebook groups, and personally invite them to build a permanent, credited profile here — the pitch is that their expertise currently evaporates into a chat log, and here it compounds and is attributable to them by name. This is a recruitment strategy (find and invite real people), not a content-scraping one — nothing here should involve copying existing Facebook-group posts onto the platform.

### 5.3 Trust transfer from day one

Because the core value proposition over both Facebook groups and paid consultants is trust, verification needs to be visible immediately, not added later as a "nice to have." A lightweight credential-verification flow (student ID, admission letter, or enrollment confirmation upload, reviewed once) unlocks a **Verified** badge on a profile from day one — "BUET '24, admitted TU Munich" carries real weight precisely because a Facebook group has no equivalent mechanism at all.

### 5.4 Frictionless reading, light-friction posting

Anyone can read and search without an account — this is what lets the SEO/AI-answer-engine channel in Section 4.3 actually convert people who land here from a Google search with no prior awareness of School-Hive. A lightweight signup (email or phone, common in the region) is required only to post, ask, or vote. This "lurker-to-contributor" funnel is close to universal across every successful UGC platform studied here.

### 5.5 The anti-scam wedge

Given predatory consultants charging ৳10k–50k+ are an explicit, named competitor in the original market research, "100% free, always" should be a loud and constantly-visible brand pillar, not a footnote. One feature-level implication: a lightweight, evidence-gated way for the community to flag and warn about known-predatory consultants adds real, differentiated value — but this needs a clear, conservative evidence policy (verified experiences, not unsubstantiated accusations) from day one to avoid becoming a defamation or misinformation risk itself.

### 5.6 A quick "bring your question" import

For a student mid-way through typing a question into a Facebook group, a near-zero-friction "ask it here instead" flow — paste in the rough question, get it auto-tagged and cleanly formatted, post in under 30 seconds — removes the main friction cost of switching platforms *at the exact moment* they're about to ask.

---

## 6. Retention: Bringing People Back Daily, Not Just Once

Askers and answerers have different retention problems, and treating them identically underserves both. Answerers are the scarce, valuable side of this marketplace — losing an active answerer costs more than losing an inactive asker — so retention design should weight toward them without neglecting askers entirely.

### 6.1 For askers

- **Notifications** on: an answer to your question, a comment reply, new activity on a question you're following.
- **"Still deciding?" nudges** are intentionally *not* included — the goal is to be useful when there's something to say, not to manufacture engagement.

### 6.2 For answerers (the higher-leverage side)

- **A personalized "questions you can answer" feed** — unanswered questions matching the categories/tags where this user has already proven expertise (via accepted answers and category badges from Section 2). This is the single highest-leverage daily habit loop in the whole spec: it turns "come back and see what's new" into "come back and see who needs exactly what you know," which is a fundamentally stickier hook.
- **A weekly "your impact" digest** ("You helped 12 students this week; 3 of your answers are still getting views from last month") — reinforces the service-framing incentive from Section 2.3 on a predictable cadence.
- **Notifications when an old answer gets a fresh wave of views or an "is this still accurate?" flag** — pulls proven experts back specifically when their expertise is needed again, which is both a retention hook and a content-freshness mechanism (Section 3.2) at the same time.

### 6.3 Streaks and leaderboards, done without the downsides

- If an answer-streak feature ships, it should have **freeze days and no shaming for a broken streak** — the well-documented criticism of aggressive streak mechanics (Duolingo among others) is that punishing a lapse turns a helpful habit cue into a source of guilt, which is the opposite of what a volunteer-driven help platform should be optimizing for.
- **Leaderboards reset weekly and monthly, not just all-time**, and are **scoped per category**, not global — an all-time global leaderboard only ever rewards the earliest, most prolific generalists; a category-scoped, period-reset leaderboard lets a newcomer who's deeply good at one narrow thing (say, Nepal-to-Australia scholarships) actually place, which is both fairer and a better incentive for the kind of deep, narrow expertise Mentorship will eventually need (Section 7).

---

## 7. The Bridge to Mentorship: Designing the Signal

The brief for this is explicit: design the reputation and quality signals so mentor-worthy users surface *naturally*, and be specific about the thresholds. The closest real-world precedent for exactly this problem is Google's Product Experts program (formerly Top Contributors): a tiered ladder where the lower tiers are awarded automatically by an algorithm, and the upper tiers require human review — explicitly *not* promoted on point-count alone, because Google's own program guidance is that answer quality, not volume, gates the higher tiers. That hybrid — **algorithmic nomination, human confirmation** — is the model this section adapts.

### 7.1 Why points alone can't be the gate

A single, purely point-based threshold is gameable (Section 8) and blind to the things that actually make someone a good 1:1 mentor: sustained effort over a burst, depth in a specific corridor over generalist breadth, and being someone people actually want to talk to. Mentorship is a much higher-trust, higher-stakes relationship than "upvoted answer on a public thread" — the bar to enter it needs to reflect that.

### 7.2 The multi-signal model

| Signal | What it measures | Why it's in the model |
|---|---|---|
| Volume with consistency | 50+ answers, active in ≥3 of the last 4 months | Filters out one-time effort spikes that a pure point-threshold would reward equally to sustained helpfulness |
| Quality ratio | Top-decile accepted-answer rate *within their primary category* | Raw point totals reward prolific-but-average answering; this doesn't. Mirrors Google's explicit "quality over quantity" promotion rule |
| Save/bookmark rate | How often an answer is bookmarked, not just upvoted | A save signals "I'll need this again" — a stronger, more deliberate trust signal than a passive upvote |
| Category depth | Concentrated activity and accept-rate within one corridor, not spread thin | A mentor is matched to students by specific corridor (e.g., "Bangladesh→Canada study visas"); depth in one area is more useful here than broad shallow helpfulness |
| Conduct record | Zero upheld moderation flags in the trailing 6 months | Knowledgeable but abrasive is a liability in a 1:1 relationship in a way it isn't in a public thread — Google's own program explicitly requires being "friendly and responsive," not just correct |
| Recency | Active within the last 30 days at time of review | Prevents graduating someone whose knowledge peaked two admissions cycles ago and is now stale on current deadlines and requirements |

### 7.3 The tiers

| Tier | How it's reached | What it unlocks |
|---|---|---|
| Contributor | Sign up | Ask, answer, vote |
| Rising Helper | Automatic, at 3,000 rep + 3-of-4-months active (Section 2.2) | Visible badge; priority placement in the "questions you can answer" feed |
| Community Expert (per category) | Automatic, at 7,500 rep + category-specific thresholds (Section 2.2) | Category badge shown on every answer in that category; eligible for category leaderboards and for Mentor Track nomination |
| **Verified Mentor** | **Not automatic.** Crossing Community Expert in ≥1 category triggers an *invitation* to apply; becoming a Verified Mentor requires the 7.2 signals plus a human review pass covering identity/credential verification (proof of current enrollment, admission, or completed degree) and a short conduct agreement | Listed in the Mentor directory; eligible for 1:1 matching once Mentorship launches; a genuinely resume-worthy "verified volunteer mentor" credential — worth calling out explicitly, since being a great answerer here has a nice full-circle payoff for the mentor's *own* future applications, not just the students they help |

### 7.4 Why this also solves Mentorship's own cold-start problem

The original research diagnosed Mentorship's core launch risk correctly: it's a two-sided marketplace that needs mentors and students at once, which is exactly the cold-start trap Section 5 was designed around. Building the signal pipeline above starting on day one of the Q&A Forum means that by the time Mentorship is ready to build, there's already a standing, algorithmically-surfaced, partially-vetted pool of mentor candidates with a proven track record on this exact platform — instead of needing to cold-recruit mentors from zero the way the Q&A Forum itself had to cold-recruit its founding cohort of answerers. This is the single biggest reason the "Q&A Forum first" sequencing works: it isn't just a standalone feature, it's Mentorship's supply pipeline running quietly in the background for as long as it takes to fill.

---

## 8. Failure Modes and Designed-In Defenses

Every row below is a real, documented failure pattern from an existing Q&A or community platform, not a hypothetical. The point of listing them here, at the design stage, is that every defense is cheaper to build in from the start than to retrofit after the failure has already happened.

| Failure mode | Real-world precedent | Root cause | School-Hive's defense |
|---|---|---|---|
| Toxic gatekeeping toward newcomers | Stack Overflow's long-documented reputation for hostility — "closed as duplicate," curt or dismissive comments toward beginner questions | Veteran users' status feels threatened by "trivial" questions; near-zero friction on harsh comments | Questions can never be downvoted (1.5); downvotes on answers require a constructive reason tag; a new-asker grace window before certain moderation actions apply |
| Reputation gaming / vote manipulation | Documented across Reddit (vote rings, IP-clustered voting) and generic karma systems | Raw vote counts are trusted equally regardless of source or pattern | Vote weight scales with voter trust level; daily rep caps; mutual-voting-pair anomaly detection (2.4) |
| Monetized flooding of low-quality content | Quora's Partner Program paid users per question based on traffic generated — as the community itself documented, this flooded the platform with low-quality, engagement-bait questions; it was fully retired everywhere by 2023, including the Bengali and Hindi versions that had run longest | Rewarding an action (asking) independent of whether the community actually needed that question asked | Never pay or reward per-question or per-answer volume; every incentive in Section 2 is anchored to *other users* finding the content useful, never to raw output |
| Answer-quality decay at scale | Yahoo Answers: 16 years of unmoderated growth left it dominated by trolling and low-effort content; shut down entirely in 2021, with declining trust cited alongside declining usage | Moderation capacity was never architected to scale with content volume | The five-layer moderation model (Section 3) delegates trust outward as the community grows, instead of relying on a fixed central team |
| AI-generated, low-effort or hallucinated answers | Stack Overflow banned ChatGPT-generated answers just six days after its late-2022 release, stating the error rate was too high and that the volume was "swamping" volunteer curation; a subsequent policy that restricted moderators from removing AI content (tied to a commercial content-licensing deal) triggered an open moderator strike in 2024–25 | Generation is now instant and free, flooding trust systems built for a slower era — worsened when the platform's own commercial incentives (data licensing) push against its community's quality incentives | Source-citation nudges raise the effort floor for factual claims (1.4); as a standing governance principle, commercial incentives should never override the community's own quality-control tooling |
| Moderator burnout / unsustainable moderation cost | Duolingo shut its community forums down entirely in March 2022, citing the operational burden of moderating at scale relative to their resourcing | Centralized, fixed-size (often volunteer) moderation teams don't scale linearly with content volume | Same defense as the Yahoo Answers row — delegated, trust-gated moderation is designed to grow moderation capacity *with* the community rather than as a separate cost center |
| Fragmented, duplicate knowledge | Generic to unmanaged Q&A platforms: the same question re-answered dozens of times, each answer partial | No canonicalization mechanism | Duplicate detection at compose time (1.3); canonical/wiki merge privilege at 1,500 rep (2.2) |
| Cold start / empty room at launch | Google+'s wide, unseeded launch reportedly saw the large majority of early sessions end in under five seconds | Launching broad before there's a reason for any specific visitor to stay | Narrow-corridor launch with a recruited, seeded founding cohort (Section 5) |
| Academic-integrity creep / answer-for-pay dynamics | Chegg was criticized for years for enabling homework-answer cheating, and then lost roughly half its subscriber base and the vast majority of its market value once free ChatGPT gave away for free what it had charged for | A business model built around "pay for the finished answer" rather than genuine understanding or guidance | The SOP/essay space is explicitly scoped to feedback-on-your-draft, never ghostwriting (3.3); the platform is free by design, so it has no Chegg-style paywall for a free AI tool to undercut — but the ghostwriting norm still needs active enforcement, since that boundary erodes quietly if unnamed |
| Identity/anonymity tension | Quora's retreat from a strict real-name policy (fully dropped ~2021) coincided with community perception of rising bot, troll, and low-effort content — yet a strict real-name mandate suppresses legitimate but sensitive questions (health, family conflict, financial hardship) | A single identity policy can't simultaneously serve accountability and psychological safety | Pseudonymous asking is allowed by default (a student asking "my family can't afford the visa fees, what are my options" shouldn't have to attach their real name); verified real identity is required only for the trust-critical side of the exchange — Verified badges and Mentor status (5.3, 7.3) |

---

## 9. Version 1 vs. Later — A Sequencing Plan

This is a sequencing question, not a difficulty one: **V1** is what the core loop and the platform's core trust claim structurally depend on from question #1. **Phase 2** is what genuinely cannot be well-designed without real usage data — not because it's hard to build, but because you'd be tuning it blind. **Phase 3** is what only becomes meaningful once there's a real community history behind it, and is what directly feeds Mentorship.

### V1 — launch-critical

- Structured question posting: category, tags, and the destination/home-country/study-level context fields (1.1–1.2) — this is the core differentiator over a generic forum and has to exist from the very first question.
- Duplicate detection at compose time (1.3) — prevents fragmentation from accumulating before it's a cleanup problem.
- Answering, Accept, upvote, and reason-tagged downvote (1.4–1.5) — the minimum viable quality-signal loop.
- Lightweight identity verification and the Verified badge (5.3) — the core trust claim has to be visible on day one, not added later once the "just another anonymous forum" impression has already set in.
- Full-text search and category/tag browse (1.7, 4.1–4.2) — has to work well *before* there's much content, so a founding cohort's seeded questions (5.2) actually feel discoverable.
- Basic points and a small set of starter badges (2.1, 2.3) — the founding cohort of answerers needs to feel recognized immediately, and this doesn't require any usage data to design a first version of.
- `QAPage` schema markup on every question (4.3) — cheap to include from day one, and the SEO/AI-citation value compounds with time indexed, so delaying it is a real cost, not neutral.
- The founding-cohort seeding and recruitment plan (5.1–5.2) — technically a launch activity rather than a "feature," but it belongs in V1 planning explicitly, because it's the single highest-risk item in this whole document if it gets treated as optional.

### Phase 2 — needs real usage data to design well

- The full trust-level-gated privilege ladder and delegated review queues (Section 2.2 thresholds, 3.1 Layer 2) — a small founding cohort should mostly be trusted by default; the delegation model earns its keep once there's enough volume that a fixed admin team can't keep up alone, and the right thresholds can only be set against real spam/abuse rates once they're observed.
- Canonical/wiki merge system (1.6, 3.1) — needs real duplicate clusters to exist before "which question is canonical" is a meaningful decision.
- The "is this still accurate?" freshness system (3.2) — needs a baseline content-decay rate to calibrate prompt timing against.
- The personalized "questions you can answer" feed (6.2) — needs answer-history and tag-performance data per user to actually personalize against.
- Leaderboards, weekly/monthly reset (6.3) — more meaningful once there's enough answer volume that a leaderboard reflects real variation rather than the same five founding-cohort members every week.
- Full notification and weekly-digest system (6.1–6.2).

### Phase 3 — needs community history, and feeds Mentorship directly

- The multi-signal Mentor Track scoring and tiered badges (7.2–7.3).
- The Verified Mentor human-review workflow (7.3).
- The public Mentor directory.
- Advanced anti-gaming: vote-ring and sockpuppet graph detection (2.4, 8) — only worth building once gaming is actually being observed, and needs a real vote graph to detect anomalies against in the first place.
- Advanced expert-to-unanswered-question matching/routing, beyond the basic tag-based feed in Phase 2.

---

## Appendix: Open Calibration Questions

Worth flagging explicitly rather than silently deciding: these are places where this spec makes a reasonable starting call, but the right answer depends on data this platform doesn't have yet.

- **Exact reputation thresholds** (Section 2.2, 7.2–7.3) are scaled down from Stack Overflow/Discourse precedent for a much smaller initial community — they should be revisited once real distributions of answer volume and quality exist.
- **How aggressively to nudge sourcing** (1.4) without making answering feel like a chore for a first-time contributor — likely worth A/B testing the nudge's framing once there's enough answer volume to compare.
- **Which corridor to launch first** (5.1) is a market-research question as much as a product one, and should be validated against wherever Facebook-group activity is actually most concentrated right now, not assumed.
- **How much of the anti-scam consultant-flagging feature (5.5) to build versus defer** — it's high-value but carries real evidence-policy and moderation risk, and may be safer to launch as a manually-curated resource before opening it to community flagging.