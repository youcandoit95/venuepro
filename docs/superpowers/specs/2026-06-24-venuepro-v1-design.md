# VenuePro (venuepro.asia) — v1 Design Spec (v1.1, critique-hardened)

**Date:** 2026-06-24 (rev 2026-06-25)
**Status:** Draft for review
**Supersedes:** the initial v1 draft (1% split commission + VPR/Open Match in v1). This revision incorporates a 6-lens expert critique and the owner's final business decisions.

> **Headline model change:** VenuePro is a **pure SaaS** for court businesses, monetised by **prepaid credits**. The **venue is the merchant of record** — booking money flows **100% to the venue's own Xendit account**; **the platform never holds, aggregates, or splits booking funds**. This eliminates payment-custody/PJP licensing exposure and keeps the platform out of marketplace tax-collection (PMK 37/2025). v1 ships the booking + operations core; **player rating (VPR) and Open Match move to v1.5**.

---

## 1. Overview & Scope

VenuePro is a court-booking platform for Indonesia (Jakarta first), launching with **padel & tennis**, extensible to other venue types later. Players discover venues and book/pay; venues manage courts, schedule, pricing, bookings, and refunds. The **public discovery + booking surface is SSR for SEO**; the **venue dashboard + platform admin are Livewire PWAs**.

**Monetisation:** venues buy **prepaid credits**; each confirmed online booking deducts **1 credit** (configurable). Platform revenue = credit sales only. Player payment goes **directly to the venue** (venue = merchant of record via Xendit). The platform never touches booking money.

### v1 In-Scope
1. **Identity & roles** — phone/WhatsApp OTP auth; roles: player, venue_owner, venue_staff, platform_admin.
2. **Venue & courts** — CRUD, geo (PostGIS), amenities; **operating hours + date-specific overrides** (holidays); **peak/off-peak pricing**; **availability blocks** (maintenance/event/weather/private).
3. **Discovery (public, SSR + SEO)** — search by sport/location(radius)/price/availability; venue + court pages; schema.org; **self-hosted map (facade)**.
4. **Availability & booking** — slot generation (duration options + turnaround buffer + band-aware pricing); **DB-enforced no-overlap**; hold/expiry; staff **walk-in** entry.
5. **Payments (venue merchant-of-record)** — player pays 100% to the **venue's Xendit (xenPlatform sub-account)**; **platform credit wallet** deducts per booking; webhook-driven, idempotent. **No platform fund custody.**
6. **Cancellation / refund** — per-venue **CancellationPolicy**; **the venue performs refunds** (from its own Xendit balance) per its policy; **hard, prominent disclosures on every transaction page**; service fee non-refundable.
7. **Trust** — **venue ratings/reviews** by players (accountability mechanism).
8. **Notifications** — WhatsApp confirmation + reminder; email fallback (queued).
9. **Venue dashboard (Livewire PWA)** — calendar, bookings, walk-in, pricing, blocks, cancellation policy, refunds, **credit balance + top-up**, reviews.
10. **Platform admin** — venue onboarding/moderation, credit packages & top-ups, oversight.
11. **PWA / SEO / Lighthouse ≥98 shell** — installable, offline shell, **all assets & fonts self-hosted (no CDN)**, schema.org, sitemap.

### v1.5 (next spec, designed-for now)
- **VPR rating** (margin-aware Elo+RD; padel doubles, tennis singles+doubles) seeded by **"friendly match with confirmed score"** (breaks the rating↔matchmaking circular dependency).
- **Open Match / matchmaking** (per-head payment, team balancing, state machine, anti-gaming).
- Automated payouts/disbursement is N/A here (venue holds funds), but credit auto-billing / metering refinements land here.

### Out of Scope (later)
Recurring bookings, waitlist auto-rebook, full dynamic/last-minute pricing, memberships/prepaid player credits, coaching scheduling, tournaments/season-series (feed VPR), multi-venue chain analytics, native apps, in-app chat.

---

## 2. Market & Operating Context (Jakarta 2026)

Padel supply has matured; operator pain = **utilisation (off-peak), no-shows, and discovery** vs the old "no courts" problem. Booking is still WhatsApp/IG DM + manual transfer + screenshot. Payments: **QRIS + e-wallet + VA** dominate; **WhatsApp** is comms; **Google Maps** is discovery. Operators currently demand manual transfer because **they control the money** — so VenuePro keeps them as merchant of record (money goes straight to them), which is also the lowest-regulation path.

---

## 3. Legal / Tax / Custody Position (load-bearing)

- **Platform never holds booking funds.** Using **Xendit xenPlatform managed sub-accounts**, each venue is a sub-account that **owns its funds**; charges are created "on behalf of" the venue → 100% lands in the venue's sub-account. The platform is **not a fund custodian** → avoids PJP/escrow licensing (BI 23/6/2021).
- **Platform is a SaaS vendor, not a marketplace payment-collector** → **not the PMK 37/2025 0.5% PPh collector** (that regime targets platforms that collect/route seller payments). Platform income = **credit sales** only.
- **Tax (platform's own income):** below the **PKP threshold (Rp4.8 B/yr turnover)** the platform is **non-PKP → no PPN, no e-faktur**, paying only **PPh final 0.5%** on gross (PP 55/2022). e-Faktur/PPN becomes required only upon PKP registration.
- **Venue is merchant of record** → handles its own booking-revenue taxes (its sale, its PPN/PPh). The platform stays out of the booking tax loop.
- **Disclaimer:** this is the structurally-minimal position, not formal tax/legal advice — **confirm with a tax consultant + Xendit onboarding/KYB** before production.

---

## 4. Architecture

- **Laravel 12 · PHP 8.4.** **Blade (SSR public) + Livewire 3 + Alpine + Tailwind** (dashboard/admin). Server-rendered, minimal JS → the lowest-risk path to **Lighthouse ≥98 + SEO + offline**.
- **PostgreSQL** + **PostGIS** (radius search) + full-text search. Extensions: `btree_gist` (no-overlap constraint).
- **Redis**: cache (hot availability), queues (notifications, webhooks side-effects), sessions, and a **fast-fail UX lock** for booking (not the integrity guarantee).
- **Payments: Xendit xenPlatform** — managed sub-accounts (venue = sub-account, owns funds), charges (QRIS/e-wallet/VA), webhooks. Platform credit wallet billed separately.
- **Notifications:** WhatsApp Business API (provider TBD at impl) + email fallback; queued.
- **Multi-tenancy (corrected):** **do NOT global-scope public read models** (discovery queries across all venues). Tenant-scope **only the dashboard surface**, binding the active venue **from the route** (not an implicit global scope). Platform-admin access via `Gate::before`, not `withoutGlobalScopes`. `venue_id` denormalised onto bookings for cheap scoping + constraints. **Isolation tests required.**
- **Build:** Vite; **all CSS/JS/fonts/images self-hosted/local — zero external CDN.**

---

## 5. Data Model (v1)

Single Postgres DB; PostGIS geometry; `venue_id` denormalised where needed.

**Identity:** `users` (name, phone[WA], email?, role) · OTP via phone/WA.
**Venue/courts:** `venues` (owner_id, name, slug, description, address, geom, status[pending|active|suspended], amenities, rating_avg, rating_count, xendit_subaccount_id) · `courts` (venue_id, name, sport[padel|tennis], surface, environment[indoor|outdoor], attributes, buffer_min, default_duration_min, active).
**Schedule/pricing:** `operating_hours` (court_id|venue_id, weekday, open, close) · `operating_hour_overrides` (date-specific holiday hours/closures) · `pricing_rules` (court_id, time-band, tier[peak|offpeak], price_idr, duration_min). · `availability_exceptions` (court_id|venue_id, starts_at, ends_at, reason[maintenance|event|holiday|weather|private], recurring?).
**Booking:** `bookings` (venue_id, court_id, player_id?, **booked_range tstzrange GENERATED from starts_at+duration_min**, starts_at, duration_min, status[hold|paid|confirmed|cancelled|no_show], price_idr, service_fee_idr, source[online|walkin], hold_expires_at, payment_ref).
  - **Integrity:** `EXCLUDE USING gist (court_id WITH =, booked_range WITH &&) WHERE (status IN ('hold','paid','confirmed'))` → overlapping bookings are a hard DB error (handles 60/90/120-min crossings). Walk-ins go through the same constraint.
**Payments:** `payments` (booking_id, venue_id, provider[xendit], provider_ref, method[qris|ewallet|va], amount_idr, status[pending|paid|failed|refunded], settlement_status, raw_payload) — **funds belong to the venue's sub-account; platform records but never holds.** · `webhook_events` (provider, event_id **UNIQUE**, processed_at) for idempotency.
**Credits (platform monetisation):** `credit_wallets` (venue_id, balance) · `credit_transactions` (venue_id, type[topup|booking_deduct|refund_reverse|adjustment], amount, booking_id?, balance_after) · `credit_packages` (name, credits, price_idr) — platform sells these (its only revenue).
**Cancellation/refund:** `cancellation_policies` (venue_id, tiers JSON[{hours_before, refund_pct}], grace_min, no_show_after_min, service_fee_refundable[false], notes) · refunds executed by venue via Xendit; logged on `payments`.
**Trust:** `venue_reviews` (venue_id, player_id, booking_id, rating[1–5], comment, created_at) → maintains `venues.rating_avg/count`.
**Ops:** `notifications_log`.

*(v1.5 tables — reserved, not built in v1: `player_ratings`, `matches`/`match_sides`/`match_sets`/`match_confirmations`, `rating_history`, `open_matches`/`open_match_participants`.)*

---

## 6. Key Flows & Error Handling

### 6.1 Booking + payment (venue merchant-of-record, no double-booking)
1. Player selects court+date+slot; server checks `bookings` **and `availability_exceptions`** for overlap.
2. Acquire **Redis UX lock** (fast fail) + DB transaction; **INSERT booking(status=hold, booked_range, hold_expires_at=now()+10min)** — the **EXCLUDE constraint** is the real guarantee; a `23P01` conflict → "slot just taken".
3. Create a Xendit charge **on the venue's sub-account** (QRIS/e-wallet/VA); **charge expiry = hold expiry**. Optional **service fee** (venue-configurable; covers the venue's MDR — i.e. player can be made to bear processing cost) added to the charge.
4. **Webhook** (verify `x-callback-token`; insert into `webhook_events` first for idempotency): on `paid`, **atomic conditional transition** `UPDATE … WHERE id=? AND status='hold' AND hold_expires_at>now()`; if 0 rows → late payment → trigger venue refund + notify. On success → `confirmed`, **deduct 1 credit** from the venue wallet (`credit_transactions`), enqueue WA confirmation + reminder.
5. **Insufficient credits:** if the venue wallet is empty, online bookings are **paused for that venue** until top-up (the monetisation lever); walk-ins still allowed.
6. **Timeouts/failures:** hold expires → job releases (DELETE/cancel hold) + cancel the pending charge.
7. **Walk-in:** staff create `booking(source=walkin, status=confirmed)` directly through the same EXCLUDE constraint (no online payment; **no credit deduction** — inventory only).
- **Allowed-transition matrix** prevents stale/out-of-order webhooks from overwriting terminal states.

### 6.2 Cancellation / refund (venue-owned)
- Each transaction page shows a **hard, unmissable disclosure** before payment: the **venue's cancellation policy**, "**refunds are handled by the venue**", "**service fee is non-refundable**", "**venue-initiated cancellation (e.g. weather/maintenance) = full refund**".
- Player or venue initiates cancellation → policy computes refund %. **The venue executes the Xendit refund from its own balance** via the dashboard; platform logs it and **reverses the deducted credit** if cancelled before play. No-show auto-marked after `no_show_after_min` (staff-overridable).
- Accountability is via **venue rating** — venues that mishandle refunds get downrated.

### 6.3 Credit top-up
Venue buys a `credit_package` → pays the **platform** (this IS platform revenue; the only money the platform receives) → `credit_transactions(topup)`. Low-balance reminders.

---

## 7. Non-Functional Requirements

### 7.1 Lighthouse ≥ 98 (mobile, all categories)
- SSR Blade for public pages; Livewire only where interactive; defer/minimise JS; keep total JS small (budget enforced).
- **Self-hosted fonts** (woff2, subset, `font-display: swap`, preload critical). **No Google Fonts / no external CDN — all assets local via Vite.**
- **Map = self-hosted static map image on the LCP path with a click-to-load interactive facade** (or MapLibre GL + self-hosted Jakarta vector/PMTiles). **No embedded Google Maps JS on the gated path** (resolves the no-CDN contradiction).
- Responsive **WebP/AVIF** with explicit width/height (no CLS); lazy-load below fold; preload LCP image; inline critical CSS; brotli; long-cache hashed assets.
- A11y AA. **Lighthouse CI gate (<98 fails the pipeline).** Validate on low-end Android profile (Livewire payload realism).

### 7.2 SEO
- SSR, indexable venue/court/discovery pages; clean URLs (`/{sport}/{city}/{venue-slug}`, `/venue/{slug}`).
- **schema.org**: `SportsActivityLocation`, `Offer`/`AggregateOffer`, `AggregateRating` (venue reviews). Sitemap.xml (+ scalable generation), robots.txt, canonical, OG/Twitter. Local SEO (NAP + static map). Locale `id` (EN later).

### 7.3 PWA / offline
- Manifest + service worker: cache app shell + static assets, offline fallback page, **stale-while-revalidate** for discovery/availability (clearly time-stamped to avoid acting on stale availability — bookings always re-validate server-side via the EXCLUDE constraint). Installable; local icons.

### 7.4 Security / tenancy / i18n
- Route-bound venue scoping + policies; `Gate::before` for platform admin; **tests proving venue-staff cannot reach another venue's data.** Phone/WA OTP + rate limiting. **Idempotent, signature-verified webhooks.** CSRF, security headers, validation.
- **Bahasa Indonesia** primary, **IDR**, **WIB**.

### 7.5 Marketplace cold-start (go-to-market)
- **Supply-led:** hand-onboard **3–8 concierge anchor venues** in one Jakarta cluster before player acquisition; import a venue's existing forward bookings; "powered by your IG/WA" so venues keep their funnel.
- **Hide, don't show empty:** radius-discovery and (later) Open Match/VPR are gated behind a written **liquidity threshold** (N rated players, Y venues) and hidden below it.

---

## 8. v1 Module / Component Breakdown

1. Identity & roles (OTP, policies, route-bound venue scope).
2. Venue & courts (CRUD, hours + overrides, pricing, blocks, geo).
3. Discovery (public SSR, search, schema.org, map facade).
4. Availability & booking (slot/buffer/band-aware pricing, EXCLUDE constraint + Redis, walk-in).
5. Payments (Xendit xenPlatform sub-accounts, webhook idempotency) — venue merchant-of-record.
6. Credits (wallet, top-up, per-booking deduction, packages).
7. Cancellation/refund (policy engine, venue-executed refunds, hard disclosures).
8. Trust (venue reviews/ratings).
9. Notifications (WA + email, queued).
10. Venue dashboard (Livewire PWA).
11. Platform admin (onboarding/moderation, credit packages).
12. PWA/SEO/perf shell (manifest, SW, self-host, map facade, Lighthouse CI).

---

## 9. Testing Strategy

- **Pest.** **Booking concurrency:** prove the **EXCLUDE constraint** rejects overlaps (incl. 60/90/120-min crossings + walk-in path) under parallel inserts. **Webhook idempotency** (duplicate/out-of-order events; transition matrix). **Credit deduction/reversal** correctness. **Cancellation/refund** computations + service-fee-non-refundable. **Tenancy isolation** (cross-venue access denied). **Map/no-CDN** check (no external requests on gated pages). **Lighthouse CI** budget (≥98) + a11y. Browser tests for player-book + venue-dashboard flows.

---

## 10. Repo & Setup (first implementation step)

- Scaffold **Laravel 12** (Livewire 3, Tailwind, Pest, `spatie/laravel-permission`, **Xendit SDK (xenPlatform)**, PostGIS-enabled migrations, `btree_gist`). Local Postgres + Redis (Redis needs a password) already running.
- **Repo:** SaaS lives at `/Volumes/data/venuepro` (new). Decide at scaffold whether to use the existing `youcandoit95/venuepro` GitHub repo (and move the KORTA padel PWA to `demo/` or its own repo) or a fresh repo. Default: fresh repo for the SaaS; KORTA stays as-is.
- Env: Xendit keys + sub-account onboarding; WA provider keys; `venuepro.asia`.

---

## 11. Success Criteria (v1)

- Player completes discover → book → pay (to the venue's Xendit) → WA confirmation, with **no double-booking under concurrency** (DB-proven).
- Venue: lists courts + hours/overrides + pricing + blocks; sees bookings (incl. walk-in); sets a cancellation policy; **executes a refund**; tops up & spends **credits** (platform's only revenue); has a **public rating**.
- Platform **never holds booking funds** (Xendit sub-account verified); is non-custodial and not a marketplace tax-collector.
- Every transaction page carries **hard cancellation/refund disclosures** before payment.
- **Lighthouse ≥ 98** (mobile, all categories) on key public pages; installable PWA + offline shell; **zero external CDN/font/map requests** on gated pages; SSR pages indexable with schema.org.

---

## 12. Open Items (confirm during/after scaffold)
- Final GitHub repo decision (reuse `venuepro` vs new).
- WhatsApp BSP/provider selection.
- Xendit xenPlatform account-type + per-venue KYB onboarding UX.
- Tax-consultant confirmation of the non-PKP SaaS-credit position before production.
