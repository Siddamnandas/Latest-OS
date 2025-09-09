# Leela OS — Product Requirements Document (PRD) v1.0

**Audience:** Product, Design, Eng, Data, GTM  
**Version:** 1.0 (Foundational)  
**Scope:** MVP → V2 roadmap for a mobile app that helps Indian parent-couples (28–45) reduce friction, increase affection, and manage daily life through a myth-inspired Balance OS.

---

## 1) Vision & Strategy
**North Star:** Reduce household friction and increase affection by balancing three forces weekly: **Play & Romance (Radha–Krishna), Duty & Responsibility (Sita–Ram), Self‑care & Energy (Shiva–Shakti).**

**Core Thesis:** Homes thrive on *exchange* (offers received/returned), not scorekeeping. Leela OS encodes small, voluntary exchanges into a weekly ritual loop so couples feel seen as partners and as people, not just co‑managers of logistics.

**Target Users:** Urban Indian couples 28–45 with 0–13-year-old kids; time‑poor, app‑literate, WhatsApp‑heavy, seeking practical relief + emotional reconnection.

**Positioning / UVPs**
- **Integrated Relationship OS:** Logistics + connection + energy—one canvas.
- **AI Load Balancer (Fairness):** Proactively reassigns chores/promises based on capacity (calendars, context), with consent.
- **Cultural Resonance:** Mythic archetypes make complex dynamics simple and playful (non-dogmatic, inclusive).
- **Doing, not just planning:** One‑tap decisions, weekend planner, recipe/genie, gifting concierge.

**Competitive Frame**
- *Cozi:* Strong planner but no fairness/connection layer. **Leela OS** adds AI Load Balancer + intimacy loops.
- *Paired:* Connection prompts, but not embedded in daily life with kids. **Leela OS** is context‑aware (calendar, routines).
- *Duolingo:* Habit loop works; **Leela OS** adapts streaks to *couple* habits (with forgiveness + shared wins).

**Non-Goals (MVP):** Therapy replacement, child-facing screens, financial management, co‑parenting legal workflows.

---

## 2) Success Metrics (MVP → V1)
**Activation:**
- A1: % users completing onboarding Q&A + Balance Compass (>70%).
- A2: First “svaha” (offer) created within 24h (>60%).

**Engagement:**
- E1: Daily 30‑Second Sync completion rate (>40%).
- E2: Weekly Plan → Do → Reflect loop completion (>35%).
- E3: Avg. # of couple micro‑rituals/week (>3).

**Outcome Signals:**
- O1: Self‑reported “household ease” ↑ after 14 days.
- O2: “Warmth” actions/week (affection acts, gratitude signals) ↑.
- O3: Child rhythm markers (storytime, outdoor minutes) ↑.

**Retention (D30):** >25% (MVP), >35% (V1).

---

## 3) Core Experience & Information Architecture

### 3.1 Home (Daily Hub)
- **Top – You:** Mood + Energy check‑in (10s). Private.
- **Middle – Us:** Partner mood snapshot (if shared), “One Shared Thing” for today, top AI Nudge card.
- **Bottom – Family & Future:** Next family event/ritual, quick link to Taskboard.
- **FAB (+):** Capture Memory, Quick Task, Send Offer.

### 3.2 Balance Compass (Onboarding + Weekly)
- 9–12 situational forced‑choice items map current tilt across three spokes. Output is a pie with percentages. Generates weekly **micro‑tasks** to *fill what’s low* and *ease what’s high*.

### 3.3 Weekly Yagna Loop
- **Plan (Sun night, 10m):** Choose 2–3 micro‑offers per spoke (Play/Duty/Energy).
- **Do (Week):** Subtle reminders; completion returns quiet **tathastu** (relief/appreciation/time‑credit).
- **Reflect (Weekend, 7m):** Recap nourished areas; adjust next week.

### 3.4 Personal Dashboards (Private)
- **Energy Well (Shiva–Shakti):** Sleep/strain inputs, overextension alerts, quick reset rituals, boundary phrase builder.
- **Duty Ledger (Sita–Ram):** Recurring chores, promise heat‑map, contingency swaps (auto suggestions with consent).
- **Playbook (Radha–Krishna):** Micro‑affection prompts, 10–30m playlets, memory‑openers.

### 3.5 Shared Spaces
- **Home Rhythm Board:** Family calendar + aggregate energy/warmth meters (no rankings).
- **Couple Pulse:** Weekly Play/Duty dials; one joint micro‑ritual suggestion.
- **Kids Dashboard (0–13):** Growth mandala (sleep, movement, joy, learning, bonding). **Silent assignments** to one parent; both view child outcomes only.

---

## 4) Feature Requirements (Detailed)
Each item: **Goal → User Stories → Acceptance Criteria → Data/Events → Privacy**

### 4.1 Current-Time Mood Check‑Ins
**Goal:** Learn daily rhythms; fuel nudges; show trends.
**User Stories:**
- As a parent, I can log mood/energy in 2 taps.
- As a couple, we can optionally share snapshots.
**Acceptance Criteria:**
- 2‑tap input; optional emoji + note.
- 7/30‑day trend charts (private; couples can share aggregate).
**Data/Events:** `mood_checkin_created`, fields: user_id, ts, mood, energy, shared:boolean.
**Privacy:** Private by default; partner sees only if shared.

### 4.2 Ambient Relationship Behaviour Sensing (Opt‑in)
**Goal:** Infer patterns to reduce friction.
**Signals:** Calendar, location tags (temple, cinema, school), weather, optional voice‑tone moments, smart‑home scenes.
**User Stories:**
- As a user, I can opt-in to signals; see/disable each source.
- As a couple, we get pattern insights (e.g., chaotic Wednesdays).
**Acceptance Criteria:**
- Granular permissions; view/edit data; one‑tap revoke.
- Insight cards with actionable suggestions.
**Data/Events:** `context_signal_ingested`, `pattern_insight_generated`.
**Privacy:** On‑device processing where feasible; redact PII; roll‑up only in shared spaces.

### 4.3 Rasa Worlds (Archetype Metaverse)
**Goal:** Make balance playful and memorable.
**User Stories:**
- As a partner, I see my weekly pie on a mythic home screen.
- As a couple, we hold a shared mandala that updates with actions.
**Acceptance Criteria:**
- Visual pie/mandala with 3 spokes; tooltips; weekly change arrows.
- Micro‑tasks tagged to spokes; completion animates spoke fill.
**Data/Events:** `rasa_score_updated`, `spoke_task_completed`.
**Privacy:** Personal tasks private unless shared.

### 4.4 Couple Quests & Side Missions
**Goal:** Unforced, fun engagement to rebalance.
**User Stories:**
- As a user, I get 1–2 optional quests/week tied to imbalances.
- As a couple, we can accept/snooze/swipe for a different quest.
**Acceptance Criteria:**
- Quest cards for Radha–Krishna, Sita–Ram, Shiva–Shakti.
- Rewards: **Lakshmi Coins** + spoke balance effect.
**Data/Events:** `quest_offered`, `quest_accepted`, `quest_completed`, `coins_earned`.
**Privacy:** Completion visible only if marked share.

### 4.5 Couple Leaderboards (Opt‑in, Anonymized)
**Goal:** City‑wise celebration without shame.
**User Stories:**
- As a couple, we can opt into city leagues.
- As a user, I can see playful stats (laughs, festival teamwork).
**Acceptance Criteria:**
- Pseudonymous handles; no raw counts of chores; only celebratory badges.
- City filters; weekly winners; bi‑weekly prize draw.
**Data/Events:** `league_opt_in`, `badge_awarded`, `leaderboard_position`.
**Privacy:** Differential privacy thresholds; never display private logs.

### 4.6 “Memory Jukebox”
**Goal:** Surface and save joy.
**User Stories:**
- As a partner, I can drop a photo/memory quickly; app resurfaces contextually.
**Acceptance Criteria:**
- 2‑tap capture; auto‑tag (weather, place); weekly throwback.
**Data/Events:** `memory_added`, `memory_resurfaced`.
**Privacy:** Private by default; share toggle.

### 4.7 Daily Darshan (Seeing the Other)
**Goal:** Ritualize sattvic listening.
**User Stories:**
- As a partner, I get a 2‑minute prompt to share a non‑logistics story; the other gets a “just listen” cue.
**Acceptance Criteria:**
- Timer; gentle script; optional reflection note after.
**Data/Events:** `darshan_prompted`, `darshan_completed`.
**Privacy:** No transcription unless explicitly saved.

### 4.8 “Win a Free Outing” (City Rasa Winners)
**Goal:** Surprise & delight; PR flywheel.
**User Stories:**
- As an opt‑in couple, we enter bi‑weekly draws if we top celebratory metrics.
**Acceptance Criteria:**
- Fair draw; fraud checks; in‑app prize claim flow.
**Data/Events:** `prize_eligibility`, `prize_awarded`.
**Privacy:** Consent before public mentions.

### 4.9 One‑Tap Decisions (Decision Autopilot)
**Goal:** Kill decision fatigue.
**User Stories:**
- As a user, I accept templated micro‑decisions (groceries, gifts).
**Acceptance Criteria:**
- 1–3 smart options; learns preferences; one‑tap execute or link‑out.
**Data/Events:** `autodecision_shown`, `autodecision_selected`.
**Privacy:** Vendor integrations via consent.

### 4.10 Fridge‑to‑Table Genie
**Goal:** Dinner paralysis relief.
**User Stories:**
- As a user, I snap pantry; get 3 quick recipes; missing items → grocery link.
**Acceptance Criteria:**
- Image → ingredients parse; 3 recipes <30 mins; one‑tap cart.
**Data/Events:** `pantry_photo_uploaded`, `recipe_suggested`, `cart_created`.
**Privacy:** Photos local‑first; delete anytime.

### 4.11 Secret Couple Loop (Private Play)
**Goal:** Digital intimacy beyond logistics.
**User Stories:**
- As a partner, I get private nudges/games (1‑word mood → flirty GIF, 30‑sec challenges).
**Acceptance Criteria:**
- Non‑cringe tone; opt‑in themes; memory bank rewards.
**Data/Events:** `private_nudge_sent`, `mini_challenge_completed`.
**Privacy:** Locked space; no leaderboard impact.

### 4.12 Contextual AI Nudges (Whisper, Not Push)
**Goal:** Feel life‑timed, not app‑timed.
**Triggers:** Weather, time/day, calendar, location (home approach), kid events.
**User Stories:**
- As a user, I get anticipatory suggestions (chai‑weather, PTM pep‑note, “almost home” snap).
**Acceptance Criteria:**
- Quiet hours; frequency cap; per‑trigger opt‑out.
**Data/Events:** `nudge_sent`, `nudge_interacted`.
**Privacy:** Granular controls; local geofencing where possible.

### 4.13 Music: Combined Playlist
**Goal:** Shared vibe builder.
**User Stories:**
- As a couple, we combine favorites; app injects 10% “us‑songs” based on moments.
**Acceptance Criteria:**
- Add from Spotify/Apple (if possible); export playlist.
**Data/Events:** `playlist_created`, `song_suggested`.
**Privacy:** OAuth; revoke anytime.

### 4.14 Collaborative Goals & Milestones
**Goal:** Build toward shared dreams.
**User Stories:**
- As a couple, we add long‑term goals (trip, class) → micro‑steps.
**Acceptance Criteria:**
- Progress bar; occasional nudge into weekly plan.
**Data/Events:** `goal_created`, `goal_step_completed`.

### 4.15 Shared Document Vault
**Goal:** Reduce mental load of important papers.
**User Stories:**
- As a couple, we store insurance forms, medical consents, contacts.
**Acceptance Criteria:**
- Encrypted at rest; tag/search; shareable PDF.
**Data/Events:** `doc_added`, `doc_shared`.

### 4.16 Parenting Sync
**Goal:** Keep both parents aligned.
**User Stories:**
- As a parent, I upload school circular; AI summarizes; creates tasks.
- As a parent, I keep a log of child challenges for doctor/teacher.
**Acceptance Criteria:**
- OCR/summarize; smart tasks; shared view.
**Data/Events:** `circular_uploaded`, `summary_generated`.

### 4.17 AI Memory Weaver (Throwback Nudges)
**Goal:** Rekindle warmth.
**User Stories:**
- As a user, I opt‑in to gallery scan; get weekly “Forgotten Memory” prompts.
**Acceptance Criteria:**
- On‑device scan where feasible; rich notification; share option.
**Data/Events:** `memory_weaver_prompted`.

### 4.18 AI Conflict Solver → Argument Autopsy
**Goal:** Learn after conflict.
**User Stories:**
- As a partner, post‑conflict I answer 2 questions privately; app offers a neutral summary to both.
**Acceptance Criteria:**
- Separate prompts; synthesis card; no blame language.
**Data/Events:** `autopsy_submitted`, `autopsy_summary_shared`.
**Privacy:** Private unless both consent to share summary.

### 4.19 AI Auto‑Scheduling Rituals
**Goal:** Reduce coordination overhead.
**User Stories:**
- As a couple, date night slots are proposed across calendars.
**Acceptance Criteria:**
- 3–4 future slots; tap to book; reminders.
**Data/Events:** `ritual_slots_suggested`, `ritual_booked`.

### 4.20 AI Gift & Celebration Assistant
**Goal:** Never miss moments.
**User Stories:**
- As a partner, I get curated gifts/reservations 2 weeks before key dates.
**Acceptance Criteria:**
- 3 ideas; affiliate links; optional auto‑order.
**Data/Events:** `gift_suggestions_generated`, `gift_purchased`.

### 4.21 Parenting Prep Automation
**Goal:** Smooth kid events.
**User Stories:**
- As a parent, soccer game spawns subtasks (pack water, wash kit) assigned by capacity.
**Acceptance Criteria:**
- Auto tasks; reassignment suggestions.
**Data/Events:** `prep_tasks_created`, `task_reassigned`.

### 4.22 One‑Tap Weekend Planner (Killer Feature)
**Goal:** Plan balanced weekends in one tap.
**User Stories:**
- As a family, we get an AI plan: one outing, chore blocks, rest pockets, couple time.
**Acceptance Criteria:**
- Preview → accept/edit; integrates booking and grocery flows.
**Data/Events:** `weekend_plan_generated`, `plan_accepted`.

### 4.23 Partner’s World Briefing (Daily)
**Goal:** Empathy on rails.
**User Stories:**
- As a partner, I get a morning brief: partner’s key event, shared task, suggested micro‑gesture.
**Acceptance Criteria:**
- Opt‑in; accurate; actionable; 1 card/day.
**Data/Events:** `briefing_sent`, `briefing_acknowledged`.

### 4.24 AI Love‑Language Translator
**Goal:** Appreciation that lands.
**User Stories:**
- As a user, I type what I did; app reframes it in partner’s preferred style.
**Acceptance Criteria:**
- 5 templates; editable; save to message apps.
**Data/Events:** `love_language_note_created`.

### 4.25 Parenting Experience (6 Days / 6 Activities)
**Goal:** Parent‑led, screen‑free child engagement.
**Modules:**
- **Emotion Explorers** (emoji/words for scenarios).
- **Kindness Jar** (log kind acts; weekly reflection).
- **Curiosity QnA** (myth‑inspired weekend questions).
- **Krishna Day** (playful prank, parent‑mediated).
- **Saraswati Day** (creative act together).
- **Hanuman Day** (helper mission; celebrate with photo).
**AI Logic:**
- Randomize 3 themed days/week; alternate parent roles; rotate prompts by age (0–2, 3–5, 6–9, 10–13).
**Events:** `px_activity_assigned`, `px_completed`, `px_memory_saved`.

---

## 5) Gamification & Economy
**Lakshmi Coins:** Earn via quests, darshan, daily sync, weekend planner acceptance, kindness jar.  
**Sinks:** Unlock bedtime stories, couple meditations, challenge packs; **streak repair** (forgiveness); raffle entries for city prizes.  
**Design:** Adult‑friendly; no dark patterns; generous early loop.

---

## 6) Monetization & Plans
**Freemium:** Taskboard, calendar, daily mood check‑in, 1 AI nudge/day, Conflict Solver 3x/month, rotating 5 bedtime stories.

**Leela+ (Premium):** Unlimited AI coach, Load Balancer & automations, full library, One‑Tap Weekend Planner, Concierge (gifts/booking), deep insights (Relationship Pulse, Autopsy summaries), customization/themes.

**Partnerships:** Affiliate gifting (Amazon, florist), booking (events/parks), grocery integrations.

---

## 7) Privacy, Safety, Consent
- Private‑by‑default for personal logs; explicit share toggles.
- Child data aggregates; no parent attribution on child tasks.
- Granular data source permissions; easy revoke; export/delete.
- On‑device processing where possible (gallery, geofencing); encrypted at rest.
- Sensible quiet hours; safety words to suspend nudges.

---

## 8) Technical Overview (MVP → V1)
**Client:** Flutter/React Native; local DB (SQLite/Room) + secure storage; push via FCM/APNs.  
**Backend:** Firebase (Auth, Firestore), Cloud Functions (AI orchestration), Cloud Storage (memories).  
**AI:** On‑device (mood classification, gallery clustering) + server LLM for text generation (nudges, summaries); rules engine for contexts.

**Integrations (opt‑in):** Google/Apple Calendar, Weather API, Maps/Places, Spotify/Apple Music (playlist), Amazon Affiliate, Swiggy/Instacart or local equivalent.

**Event Schema:** Standard `event_name`, `user_id`, `household_id`, `ts`, `payload`. Table of key events defined per feature above.

---

## 9) Rollout Plan
**MVP (8–10 weeks):**
- Onboarding + Balance Compass
- Daily Home (30‑Second Sync)
- Weekly Yagna Loop
- Energy/Duty/Play basic modules
- Parenting Sync (circular summary), Kids Dashboard (single child)
- One‑Tap Weekend Planner (beta), Memory Jukebox (basic)
- Contextual Nudges (calendar/time/weather), Love‑Language Translator

**V1 (next 12 weeks):**
- Ambient Sensing v1, AI Load Balancer
- Couple Quests, Secret Couple Loop
- City Leaderboards + Prize engine
- Fridge‑to‑Table Genie, Gift Assistant, Parenting Prep Automation
- Collaborative Goals, Doc Vault, Combined Playlist

---

## 10) Risks & Mitigations
- **Privacy sensitivities:** Ship with strict defaults; transparency UI; local processing.
- **Partner asymmetry:** Coaching copy + fairness engine to avoid weaponization.
- **Nudge fatigue:** Frequency caps, quiet hours, snooze logic, seasonal themes.
- **Cultural fit:** Optional skin for non‑myth terms; keep symbols functional, not prescriptive.

---

## 11) Open Questions
1. What’s the minimal dataset for fair Load Balancer suggestions without feeling intrusive?  
2. Prize logistics by city: compliance, taxes, fulfilment partners.  
3. Optimal coin sinks that feel valuable but not pay‑to‑love.  
4. Integrations priority by market (Zomato vs Swiggy; Amazon vs Flipkart).

---

## 12) Sample Push Copy (Tone: warm, specific, unbossy)
- **Morning Sync:** “☀️ Your 30‑sec sync with {Partner} is ready. One shared thing today: {item}. Want a tiny nudge for later?”
- **Chai Weather:** “Rain + free 15 mins tonight — fancy a balcony chai & story?”
- **PTM Day:** “Kid’s PTM at 3pm. Send a ‘we got this!’ snap?”
- **Friday Micro‑Date:** “Long week. AI found a 20‑min micro‑date after bedtime. Wanna see?”
- **Win:** “You hit a 7‑day Connection Streak! 20 Lakshmi Coins added.”

---

## 13) Acceptance Criteria Summary (MVP)
- Users complete onboarding pie; receive spoke‑tagged tasks.
- Daily Home shows You/Us/Family sections; 30‑sec loop <30s median.
- Weekly Plan/Reflect surfaces; at least one joint micro‑ritual weekly.
- Kids Dashboard live with 6 parent‑led activities; logging works.
- One‑Tap Weekend Planner generates plan with edit/accept; ≥50% accept rate among those who open.
- Privacy center ships with per‑signal toggles + export/delete.

---

## 14) Appendix — Data Dictionary (Excerpts)
- `rasa_scores`: {play:number, duty:number, energy:number, week_id}
- `offers`: {spoke, type, planned_at, completed_at, shared:boolean}
- `nudges`: {trigger, content_id, delivered_at, interacted:boolean}
- `kids_activity_log`: {child_id, theme, assigned_to, completed_at}
- `coins_ledger`: {delta, reason, balance}

---

**TL;DR:** Leela OS stitches logistics, intimacy, and energy into one balanced ritual. Private effort, shared outcomes. Adult‑friendly gamification. Cultural resonance. Practical automations that make families feel lighter, warmer, and more *together*. 

