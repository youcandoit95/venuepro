# VenuePro v1 — Implementation Roadmap (system-flow sequence)

> **For agentic workers:** This roadmap decomposes VenuePro v1 into **14 ordered, independently-shippable plans**. Each plan produces working, testable software and has its own document `2026-06-25-venuepro-NN-<name>.md`. Build them **in order** — later plans consume interfaces from earlier ones. Use **superpowers:subagent-driven-development** (recommended) or **superpowers:executing-plans** to execute each plan task-by-task.

**Source spec:** `docs/superpowers/specs/2026-06-24-venuepro-v1-design.md` (v1.3). Read it before starting. Competitive intent tracked in `docs/superpowers/memory/competitive-backlog.md` (update Status → In progress/Done as plans ship).

**Goal:** Ship the VenuePro v1 booking + operations core — players discover and book/pay courts (money 100% to the venue's own Xendit), venues manage inventory/schedule/pricing/bookings/refunds and buy prepaid credits — as a fast (Lighthouse ≥99), secure, installable PWA that is mobile-app-packaging-ready.

**Out of this roadmap (deferred):** VPR rating, Open Match (v1.5); tournaments/season-series (v2).

---

## Global Constraints (apply to EVERY task in EVERY plan — verbatim from the spec)

- **No platform fund custody.** Booking money flows 100% to the **venue's Xendit xenPlatform sub-account** (venue = merchant of record). The platform records but **never holds/aggregates/splits** booking funds. Platform revenue = **credit sales** only. All Xendit calls go through one gateway service that derives `for-user-id` strictly from the **route-bound authorized `venue_id`** (never request input).
- **Tenancy.** Bind active venue **from the route**, never from request body. Do **not** global-scope public read models; tenant-scope only the dashboard/admin. `Gate::before` grants `platform_admin` only. Every dashboard resource has a Policy checking `$user->venue_id === $model->venue_id`. **Isolation tests are blocking.**
- **Booking integrity** is the DB `EXCLUDE USING gist (court_id WITH =, booked_range WITH &&) WHERE (status IN ('hold','paid','confirmed'))` — never application-level locks alone. Walk-ins use the same path.
- **Money mutations happen only inside the verified, idempotent Xendit webhook path** (`webhook_events.event_id` UNIQUE before side-effects; allowed-transition matrix via conditional UPDATE; amount + sub-account↔venue_id re-validation).
- **Security:** `script-src` has **no `unsafe-inline`, no `unsafe-eval`** (Livewire 4 `csp_safe=true` + `@alpinejs/csp`). CSP is an **allowlist** (self-host default; named external origins only, recorded in `config/csp.php`). FormRequests/DTOs only (never `request()->all()`); guard `role, venue_id, status, balance, xendit_subaccount_id, price_idr, service_fee_idr, rating_avg`. Encrypt phone at rest + blind-index; mask in UI/logs. Secrets vaulted; Redis password-protected; `APP_DEBUG=false` in non-local.
- **Performance:** Lighthouse **≥ 0.99 per-route, all 4 categories** (CI-gated). Public SSR routes ≤ 30 KB JS (br), ≤ 14 KB critical CSS inline; **Livewire/Alpine never load on public SSR routes**; CLS = 0 (stored image width/height, reserved boxes, metric-matched font fallback). Third-party JS = 0 on public critical path.
- **Uploads = images only** (jpg/png/webp); **video not permitted**. Client-side compression is an optimization, not a trust boundary; server re-encodes + strips EXIF + magic-byte validates.
- **Locale:** Bahasa Indonesia primary, **IDR** (`Rp 250.000`, id-ID), **WIB**. Reviewed string catalogue; no improvised template copy.
- **Stack pins (spec §4.1):** Laravel `^13.0` · PHP `^8.4` · Livewire `^4.3` (`csp_safe=true`) · Alpine `^3.15` + `@alpinejs/csp` · Tailwind `^4.3` · PostgreSQL `18.4` + PostGIS `3.6` + `btree_gist` · Redis `8.8` (`REDIS_CLIENT=phpredis`) · Vite `^8.1` + `laravel-vite-plugin ^3.1` · Node `24` LTS · Pest `^4.7` · `spatie/laravel-permission ^8` · `laravel/sanctum ^4.3` · `xendit/xendit-php ^7` · `intervention/image ^4.1` · `browser-image-compression ^2.0.2`.
- **Discipline:** DRY, YAGNI, TDD (test first, watch it fail, minimal pass, commit), frequent commits. After each plan ships: run `./scripts/reindex.sh`, update `docs/superpowers/session-log.md` and the relevant memory + `competitive-backlog.md` Status.

---

## Plan sequence (build in this order)

| # | Plan | Depends on | Deliverable (definition of done) |
|---|------|-----------|----------------------------------|
| **01** | **Foundation & toolchain** | — | App boots on Laravel 13/PHP 8.4; PostgreSQL 18+PostGIS+btree_gist + Redis 8.8 connected; Vite 8 + Tailwind v4 `@theme` seed + Livewire 4 (`csp_safe`) + Alpine-csp build; base SSR layout renders; CSP/security-header middleware (allowlist) live; CI runs Pest + Pint + PHPStan + build green; health-check route passes a Pest test. |
| **02** | **Identity, roles & account lifecycle** | 01 | Phone/WA **OTP** login (rate-limited, enumeration-safe, phone encrypted+blind-index); roles (player/venue_owner/venue_staff/platform_admin) via spatie; route-bound tenancy scaffolding + `Gate::before`; **Privacy Policy + Terms** SSR pages; **account deletion** (OTP-gated, anonymize-not-hard-delete, audit-logged). Tests: OTP abuse/enumeration, role gates, tenancy isolation skeleton, deletion anonymization. |
| **03** | **Venue & courts** | 02 | venue_owner CRUDs venues (geo/PostGIS, amenities, slug, status) + courts (sport/surface/environment/buffer/duration); **image-only photo uploads** (client-compressed, server re-encode/EXIF-strip/magic-byte/signed-URL). Tests: tenancy (A can't edit B), upload rejects video/non-image, geo persists. |
| **04** | **Schedule & pricing** | 03 | `operating_hours` + `operating_hour_overrides` (holidays), `pricing_rules` (peak/off-peak bands), `availability_exceptions` (maintenance/event/holiday/weather/private). Tests: override beats base hours; price resolves by band; exception blocks a window. |
| **05** | **Availability & booking core** | 04 | Slot generation (duration + turnaround buffer + band price), **booking with the EXCLUDE constraint + 10-min hold + Redis UX lock**, expiry release job, **walk-in** entry. Tests (blocking): parallel-insert overlap rejected (incl. 60/90/120-min crossings + walk-in), exception overlap rejected, hold expiry frees slot. |
| **06** | **Payments (Xendit xenPlatform)** | 05 | Venue sub-account onboarding; **charge on-behalf** (QRIS/e-wallet/VA) so funds land in the venue's sub-account; **webhook**: signature + IP allowlist + `event_id` idempotency + transition matrix + amount/sub-account↔venue_id re-validation; `for-user-id` gateway (confused-deputy blocked). Tests: dup/out-of-order webhook, amount-tamper, cross-tenant `paid` rejected, hold→paid transition. |
| **07** | **Credits (platform monetisation)** | 06 | `credit_packages`, `credit_wallets`, `credit_transactions`; venue top-up (paid to the **platform's** Xendit, separate from booking flow); **1 credit deducted per confirmed booking** (atomic, idempotent, inside webhook path); reversal on refund; "insufficient credits → bookings paused" fail-safe. Tests: deduct exactly once, reverse once, never negative. |
| **08** | **Cancellation & refund** | 07 | Per-venue `cancellation_policies` (tiers/grace/no-show/service-fee-non-refundable); **venue-executed refund** (OTP/re-auth-gated, refund % server-computed, idempotent, audit-logged); **hard disclosure** chip + **required server-enforced versioned consent** before payable charge; credit reversal on refund. Tests: refund % per tier, service-fee retained, consent gate blocks charge, refund idempotent. |
| **09** | **Trust (venue reviews)** | 08 | `venue_reviews` by players with a completed booking; maintains `venues.rating_avg/count`; render as crawlable SSR text + AggregateRating later (P11). Tests: only completed-booking players review, one review per booking, aggregate recomputes. |
| **10** | **Notifications** | 06 | Provider-agnostic Notification channel + queue; **WhatsApp confirmation + reminder + email fallback**; `notifications_log`; `push_subscriptions` rail (web-push/VAPID now, FCM/APNs token slot later). Tests: booking-confirmed fans out, reminder scheduled, channel-cost circuit breaker. |
| **11** | **Public discovery + SSR/SEO** | 05, 09 | Public SSR (zero-JS-dependent) discovery (`/{sport}/{city}`), venue (`/venue/{slug}`) + booking (`/venue/{slug}/book`) pages; **JSON-LD** (SportsActivityLocation/Offer/AggregateRating/Breadcrumb/FAQ); sitemap/robots; **self-hosted static map facade**; radius search (PostGIS, bound params). Tests: JS-disabled fetch asserts title/single-canonical/single-h1/parseable JSON-LD; zero map JS on load; Lighthouse ≥0.99 on each public route. |
| **12** | **Venue dashboard (Livewire PWA app-shell)** | 05–10 | Persistent app-shell (top bar + bottom-tab nav, `wire:persist`, `wire:navigate`) with calendar, bookings (incl. walk-in), pricing, blocks, cancellation policy, **refunds**, **credit balance + top-up**, reviews. Tests: shell survives nav (no content `@persist`), steady-state + SW-warmed Lighthouse ≥0.99, tenancy on every action. |
| **13** | **Platform admin** | 06, 07, 12 | Venue onboarding/moderation, credit-package CRUD + manual top-ups, oversight; `Gate::before` platform_admin only. Tests: admin-only access, non-admin 403, credit package lifecycle. |
| **14** | **PWA & mobile-app readiness + perf/security hardening** | 01–13 | Complete manifest + maskable icons; surface/method-aware self-healing **service worker**; `/.well-known/assetlinks.json` + AASA routes; **Sanctum Bearer API** surface for the iOS shell; finalize design-system tokens; **per-route Lighthouse-99 CI matrix** (incl. dashboard cold/steady/SW-warmed) + structured-data CI gate + `budgets.json`/`size-limit`; full CSP/security-header pipeline; OWASP suites (webhook tamper, tenancy, OTP abuse) green; wrapper-auth acceptance (TWA + WKWebView). |

### Dependency notes
- **01 → 02 → 03 → 04 → 05** is the strict spine (each needs the prior's schema/interfaces).
- **06** needs bookings (05); **07** needs payments (06); **08** needs credits (07, for reversal).
- **10** can start after **06** (booking-confirmed event exists) and run in parallel with 08/09.
- **11** needs venue/court/availability (05) + reviews (09) for AggregateRating.
- **12** integrates 05–10 behind the app-shell; **13** needs 06/07 + the dashboard shell (12).
- **14** is the cross-cutting hardening/readiness pass — runs last but its CI gates (Lighthouse, structured-data, budgets, security suites) should be **stubbed in 01** and **tightened as each surface lands**.

### Per-plan ship ritual (definition of "done" for the plan, not just the code)
1. All plan tasks' tests green (`vendor/bin/pest`), Pint + PHPStan clean, `npm run build` ok.
2. Relevant Lighthouse/structured-data CI gates for the surfaces this plan touched are passing (or explicitly stubbed with a logged TODO if 14 hasn't tightened them yet).
3. `./scripts/reindex.sh`; update `session-log.md`, the relevant memory file, and `competitive-backlog.md` Status.
4. Conventional commit(s); plan checkboxes ticked.
