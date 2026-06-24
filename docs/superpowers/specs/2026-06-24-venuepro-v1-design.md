# VenuePro (venuepro.asia) — v1 Design Spec

**Date:** 2026-06-24
**Status:** Draft for review
**Scope:** v1 = Sprint 1–2 (core marketplace transaction loop + venue dashboard + payments + WhatsApp + VPR rating engine + Open Match/matchmaking). Later phases (recurring/waitlist, membership, full dynamic pricing, tournaments/season-series) are out of v1 and get their own specs.

---

## 1. Overview

VenuePro is a **two-sided court-booking marketplace** for Indonesia (Jakarta first), launching with **padel and tennis** and designed to extend to other venue/business types later. Players discover venues, check real-time court availability, book a slot, and **pay the full amount online**; venue operators manage their courts, schedule, and pricing, and receive payouts. The platform charges a **1% fee deducted from the venue** (player pays full price; venue payout = transaction − 1%).

A core differentiator is a **fair, UTR-grade player rating (VPR)** that powers **Open Match / matchmaking** and (later) tournaments — turning solo/duo players into bookings and filling courts.

### v1 Goals
- A player can: discover a venue (SEO/SSR + map), see real-time court availability, book a slot, pay full online (QRIS/e-wallet/VA via Xendit), and receive WhatsApp confirmation + reminder.
- A venue can: list venue + courts, set operating hours and peak/off-peak pricing, see/manage bookings, enter walk-in/phone bookings, and receive payout (−1% fee).
- The platform can: onboard/moderate venues, take the 1% fee, and orchestrate payouts.
- **VPR rating engine** live: padel doubles; tennis singles **and** doubles (separate). Calibrated from **Open Match** results (verified, score-based, margin-aware).
- **Open Match / matchmaking**: players join open 2v2 matches by level; results feed VPR.
- **Non-functional, hard requirements:** Lighthouse ≥ 98 (all categories, mobile), strong SEO, installable PWA with offline shell, **all libraries, assets, and fonts self-hosted/local (no CDN)**.

### Non-Goals (v1)
- Recurring bookings, waitlist auto-rebook, full dynamic/last-minute pricing engine, memberships/prepaid credits, coaching scheduling, tournaments/season-series, multi-venue chain dashboards, reviews/ratings of venues, in-app chat. (All are planned for later phases.)
- No native mobile apps (PWA only).

---

## 2. Market Context (Jakarta 2026)

- Padel supply has matured; the operator pain shifted from "no courts" to **utilisation (filling off-peak), no-shows, and discovery/competition**.
- Booking is still largely WhatsApp/IG DM + manual bank transfer + screenshot → double-bookings and manual payment confirmation. Replacing this is the immediate value.
- Indonesia payment reality: **QRIS + e-wallets (GoPay/OVO/DANA/ShopeePay) + VA** dominate (cards minor). **WhatsApp** is the comms channel; **Google Maps** is discovery.
- Tax: PPN (11–12%) handling on invoices/payouts.

---

## 3. Personas & Roles

- **Player** (demand): books courts, joins open matches, has a VPR rating + match history. Auth via phone/WhatsApp OTP.
- **Venue owner** (supply, tenant): owns a venue, manages courts/pricing/bookings, sees payouts.
- **Venue staff**: front-desk; manage bookings, enter walk-ins (scoped to their venue).
- **Platform admin** (VenuePro): onboard/moderate venues, fees, payouts, global oversight.

Roles via `spatie/laravel-permission`; venue-scoped abilities enforced by policies + a global tenant scope.

---

## 4. Architecture

- **Laravel 12**, PHP 8.4. **Blade + Livewire 3 + Alpine.js + Tailwind** (server-rendered → minimal JS, best for Lighthouse ≥98, SEO, and offline). Public marketplace = SSR Blade; venue/admin dashboard = Livewire PWA.
- **PostgreSQL** with **PostGIS** (geo radius search) + full-text search for discovery.
- **Redis**: cache (hot availability), queue (notifications, payouts, rating updates), session, and **atomic locks** to prevent double-booking.
- **Payments: Xendit** (QRIS, e-wallet, VA) — chosen for its disbursement/payout APIs suited to marketplace payouts and the 1% fee model. Webhook-driven, idempotent.
- **Notifications:** WhatsApp Business API (provider TBD at impl — e.g., official Cloud API or a local BSP) + email fallback; queued via Redis.
- **Multi-tenancy:** **single database, row-level scoping by `venue_id`** (required so the public side can search/aggregate across all venues). Platform admin bypasses the venue scope.
- **Build:** Vite, **all assets/fonts bundled locally** (no external CDN). Brotli/gzip at the edge.

### Front-end rendering decision
Chosen: **Blade + Livewire 3 + Alpine** over Inertia/Vue SPA or a separate Next.js front-end, because server-rendering with minimal JS is the lowest-risk path to Lighthouse ≥ 98 + SEO + offline, and keeps a single Laravel codebase.

---

## 5. Data Model (core entities)

Single Postgres DB; row-level `venue_id` scoping; PostGIS geometry for venue location.

- **users**: id, name, phone (WA), email?, role, created_at. Auth: phone/WA OTP.
- **player_ratings**: user_id, sport (`padel`|`tennis`), discipline (`singles`|`doubles`), R (numeric 0–7), RD, sigma, n_matches, last_played_at. Padel uses `doubles` only; tennis has both rows.
- **venues** (tenant): id, owner_id, name, slug, description, address, geom (PostGIS point), status (`pending`|`active`|`suspended`), amenities, created_at.
- **courts**: id, venue_id, name, sport, surface, environment (`indoor`|`outdoor`), attributes (glass/panoramic…), active.
- **operating_hours**: id, court_id (or venue_id), weekday, open_time, close_time.
- **pricing_rules**: id, court_id, weekday/date-band, time-band (start,end), tier (`peak`|`offpeak`), price (IDR), slot_minutes (e.g., 60/90).
- **bookings**: id, player_id (nullable for walk-in), court_id, starts_at, duration_min, status (`hold`|`paid`|`confirmed`|`cancelled`|`no_show`), amount, source (`online`|`walkin`), hold_expires_at, created_at.
- **payments**: id, booking_id, provider (`xendit`), provider_ref, method (`qris`|`ewallet`|`va`), amount, platform_fee (1%), status (`pending`|`paid`|`failed`|`refunded`), raw_payload. Webhook events table for idempotency.
- **payouts**: id, venue_id, period, gross, fee, net, status (`pending`|`paid`), provider_ref, invoice_no (PPN).
- **open_matches**: id, court_id, starts_at, duration_min, sport, level_min, level_max, fee_per_head, status (`open`|`full`|`confirmed`|`cancelled`|`completed`). **open_match_participants**: open_match_id, user_id, paid (bool), team (`A`|`B`).
- **matches**: id, sport, discipline, source (`open_match`|`friendly`|`tournament`), status (`pending`|`confirmed`|`disputed`|`void`), played_at. **match_sides**: match_id, side (`A`|`B`), user_ids[1–2]. **match_sets**: match_id, set_no, games_a, games_b. **match_confirmations**: match_id, user_id, confirmed.
- **rating_history**: id, match_id, user_id, sport, discipline, r_before, r_after, rd_before, rd_after, created_at.
- **notifications_log**: id, user_id, channel (`whatsapp`|`email`), template, payload, status.

---

## 6. Key Flows & Error Handling

### 6.1 Booking + full online payment (no double-booking)
1. Player selects court + date + slot. Server validates availability against `bookings` (status in hold/paid/confirmed) for that court/time.
2. Acquire **Redis lock** keyed `lock:court:{id}:{slotStart}` (short TTL) + open a DB transaction; re-check availability; create `booking(status=hold, hold_expires_at=now+10min)`.
3. Create Xendit charge (QRIS/e-wallet/VA); show payment UI.
4. **Webhook** (signature-verified, idempotent) on payment success → `payment=paid`, `booking=confirmed`; release lock; enqueue WhatsApp confirmation + schedule reminder (2h before).
5. **Timeouts/failures:** hold expires → release slot (job) + cancel pending payment; payment failed → booking cancelled; refund path on cancellation per policy.
6. **Walk-in:** staff creates `booking(source=walkin, status=confirmed)` directly (no online payment), still blocks the slot.

### 6.2 Open Match
1. A player creates an open match on an available slot (sets sport + level range) OR joins an existing one matching their VPR (±0.5, looseable).
2. Each joiner pays their per-head fee online (same payment loop). When 4 paid → `full` → teams balanced by VPR (minimise team-rating gap) → `confirmed` + WA to all.
3. After play, any participant enters the score; **both sides confirm** (or venue staff verifies) → `match=confirmed` → trigger VPR update for all 4. Disputed/unconfirmed → excluded until resolved.

### 6.3 VPR rating update
On `match=confirmed`: compute team-average ratings → expected score share E (logistic) → actual share S (games-based, margin-aware) → per-player Glicko-2 step scaled by RD and match weight → write `rating_history` + update `player_ratings`. Idempotent per match (guard against double-apply).

### 6.4 Payout
Nightly job aggregates a venue's `paid` bookings for the period → gross − 1% fee = net → create `payout` + **PPN e-invoice** → Xendit disbursement (or manual for v1) → mark paid. Reconciliation report for platform admin.

---

## 7. VPR — VenuePro Rating (fairness spec)

**Philosophy (UTR-grade):** rating derives from **actual results + game margin + opponent strength + reliability**, not win/loss or self-rating. Displayed on a familiar **0.00–7.00** scale (FIP/NTRP-like). **Per-sport, per-discipline:** padel `doubles`; tennis `singles` and `doubles` separately.

**Engine (Glicko-2 + margin + doubles handling):** each player has R, RD (uncertainty), σ (volatility).
- Team rating = mean of its players' R.
- Expected score share: `E_A = 1 / (1 + 10^(-(Rteam_A − Rteam_B)/α))`, α ≈ 1.0.
- Actual share: `S_A = games_A / (games_A + games_B)` (margin-aware).
- Per-player update: `R' = R + K · g(RD) · w · (S_A − E_A)` — `g(RD)` larger when uncertain (fast calibration), `w` = match weight (set format, competitive/tournament > friendly, recency). RD shrinks after a match, grows with inactivity.
- Emergent fairness: beating stronger teams gains more; beating much weaker gains ~0; being "carried" by a strong partner yields small gains (team was favoured). Mismatch (|gap| > 2.0) dampens gains further (anti-farming).

**Onboarding:** self-assessment seeds initial R with **high RD**; first **10 matches = provisional** (fast swings, flagged "calibrating").

**What counts (use-case rules):**
| Case | Counts? | Rule |
|---|---|---|
| Plain booking (no score) | No | Rating only from scored matches |
| Open Match (system 2v2) | Yes | Primary engine; all 4 updated |
| Friendly + recorded score | Yes | Only if both sides confirm |
| Tournament/league | Yes | Higher weight `w` |
| Mixed-level pairs | Yes | Team average + per-player RD scaling |
| Much weaker opponent (gap > 2.0) | Damped | ~0 gain on win; still drop on loss |
| Walkover/retirement/incomplete | Partial/excluded | Sets below threshold excluded |
| Disputed score | No (until resolved) | Both-side confirm / staff verify |
| Returning after inactivity | Yes | RD widened → recalibrates |

**Anti-gaming:** only **verified** matches (booked + played at venue + score confirmed) count; diminishing returns vs weak opponents; anti-sandbagging (losses to weaker still drop you); inactivity decay; transparent per-match Δ history shown to players.

**Tournament note (planned, design-compatible now):** tournament matches use the same engine with higher `w`; both venue-run and platform-run events feed VPR. The `matches.source = tournament` path is reserved in the data model so the later tournament module plugs in without rework.

---

## 8. Non-Functional Requirements

### 8.1 Lighthouse ≥ 98 (mobile, all categories)
- SSR Blade pages; defer/minimise JS (Livewire on demand, Alpine for small interactions).
- **Self-hosted fonts** (woff2, subset, `font-display: swap`, preload critical weights). **No Google Fonts / no external CDN** — all CSS/JS/images local via Vite.
- Responsive images in **WebP/AVIF** with explicit width/height (no CLS); lazy-load below the fold; `<link rel=preload>` LCP image.
- Inline critical CSS; brotli/gzip; long-cache hashed assets.
- Accessibility AA (semantic landmarks, labels, focus, contrast). **Lighthouse CI gate in pipeline** (fail < 98).

### 8.2 SEO
- SSR, indexable venue/court/discovery pages; clean URLs (`/{sport}/{city}/{venue-slug}`, `/venue/{slug}`).
- **schema.org**: `SportsActivityLocation`, `Offer`/`AggregateOffer` (price/availability), `AggregateRating` (later), `Event` (tournaments later). Sitemap.xml + robots.txt + canonical + OG/Twitter meta. Local SEO (NAP, embedded map). `hreflang` id (EN later).

### 8.3 PWA / offline
- Web app manifest + service worker: cache the app shell and static assets, offline fallback page, and cache GET availability/discovery responses (stale-while-revalidate). Installable; local icons (192/512/maskable). Push notifications later.

### 8.4 Security, tenancy, i18n
- Row-level `venue_id` scope + Laravel policies; platform admin bypass. Phone/WA OTP auth + rate limiting. **Idempotent, signature-verified payment webhooks.** CSRF, headers, validation.
- Locale: **Bahasa Indonesia** primary, **IDR**, **WIB**. EN later.

---

## 9. v1 Module / Component Breakdown

1. **Identity & roles** — phone/WA OTP auth, roles/policies, venue scope.
2. **Venue & courts** — venue/court CRUD, operating hours, peak/off-peak pricing, geo.
3. **Discovery (public, SSR)** — search by sport/location(radius)/price/availability, venue + court pages, schema.org.
4. **Availability & booking** — slot generation, Redis-locked booking, hold/expiry, walk-in entry.
5. **Payments (Xendit)** — charge, webhook, refund; **payouts** (−1% fee) + PPN invoice.
6. **Notifications** — WhatsApp confirmation/reminder + email fallback (queued).
7. **VPR rating engine** — formula service, provisional/onboarding, history. (Pure, heavily unit-tested.)
8. **Open Match / matchmaking** — create/join by level, per-head payment, team balancing, score entry + confirmation → rating.
9. **Venue dashboard** — calendar, bookings, walk-in, pricing, payouts (Livewire PWA).
10. **Platform admin** — venue onboarding/moderation, fees, payouts oversight.
11. **PWA/SEO/perf shell** — manifest, service worker, local assets/fonts, Lighthouse CI.

---

## 10. Testing Strategy

- **Pest** (Laravel default). **VPR formula: exhaustive unit tests** with golden/known cases (fairness invariants: beating stronger > weaker; carried-partner small gain; provisional convergence; damping vs weak; decay). This is correctness-critical.
- **Feature tests:** booking concurrency/double-booking prevention, payment webhook idempotency, open-match fill→confirm→rating, payout fee math + PPN.
- **Browser tests** (Pest browser / Dusk) for the core player + venue flows.
- **Lighthouse CI** budget (≥98) and a11y checks in pipeline.

---

## 11. Repo & Setup (first implementation step)

- Scaffold a fresh **Laravel 12** app (Livewire 3, Tailwind, Pest, spatie/permission, Xendit SDK, PostGIS migration support). Local Postgres + Redis already running.
- **Repo decision (to confirm at scaffold):** make the existing `youcandoit95/venuepro` repo the SaaS (move the KORTA padel HTML PWA to a `demo/` or separate repo), **or** use a new repo for the SaaS and keep `venuepro` for KORTA. Default proposal: SaaS in a new repo, KORTA stays as-is.
- Env: Redis requires auth (set password); Xendit keys; WA provider keys; app at `venuepro.asia`.

---

## 12. Success Criteria (v1)

- Player completes discover → book → pay (Xendit QRIS/e-wallet) → WhatsApp confirmation, with **no double-booking** under concurrency.
- Venue lists courts + pricing, sees bookings (incl. walk-in), and gets a payout report (gross − 1%) with a PPN invoice.
- VPR produces fair, stable ratings (unit-tested invariants) for padel doubles + tennis singles/doubles; Open Match fills, plays, and updates ratings end-to-end.
- **Lighthouse ≥ 98** (mobile, all categories) on key public pages; installable PWA with offline shell; **zero external CDN/font requests**; SSR pages indexable with schema.org.

---

## 13. Out of Scope (later phases, own specs)

- **Phase 3:** recurring bookings + waitlist auto-rebook; full dynamic/last-minute pricing engine.
- **Phase 4:** membership & prepaid credits.
- **Phase 5:** tournaments + season series (venue- and platform-run) feeding VPR; coaching/clinics; add-ons (rental/F&B); multi-venue chains; reviews; advanced analytics; extension to other business/venue types.
