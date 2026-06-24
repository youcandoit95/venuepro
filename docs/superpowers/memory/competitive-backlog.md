---
name: competitive-backlog
description: VenuePro "beat Reclub & AYO" differentiator backlog — feature wedges + build status; read every new session and update Status as features ship
metadata:
  type: project
---

**Beat-the-competition backlog for VenuePro** ([[venuepro-project]], rivals in [[venuepro-competitors]]). Each row is a concrete wedge tied to a sourced Reclub/AYO gap. **Status vocab:** `Backlog` (not started) · `In progress` · `Done` · `Deferred`. Update Status as features ship; keep the prose in spec §2.1 in sync. As of 2026-06-25 nothing is implemented → all `Backlog`.

| # | Differentiator | Beats | Maps to competitor gap | Phase | Status |
|---|---|---|---|---|---|
| 1 | Venue = merchant-of-record; keeps **100%** direct to own Xendit (platform holds nothing) | Both | Reclub takes no money (fraud/no-refund); AYO holds funds in "AYO Balance" 6h–24h+ | v1 | Backlog |
| 2 | Real **in-app payment** (QRIS/e-wallet/card), one-tap | Reclub | Reclub = manual transfer + payment-proof screenshots | v1 | Backlog |
| 3 | **No commission + no player surcharge** (credit model) | AYO | AYO charges venue commission + unrefunded Rp 5.000 player fee | v1 | Backlog |
| 4 | **Court-level inventory + instant confirmed booking** | Reclub | Reclub = "request → wait → maybe" host sessions | v1 | Backlog |
| 5 | **DB EXCLUDE constraint** kills double/fictitious booking | Both | Reclub fictitious bookings; AYO "paid but venue has no record" | v1 | Backlog |
| 6 | **Prepaid credits** = instant refund-to-wallet rail + venue-friendly monetization | Both | Reclub can't refund; AYO commission + opaque | v1 | Backlog |
| 7 | **Booking-integrity guarantee** (no venue record → instant auto-refund + comparable rebook) | AYO | AYO's worst failure mode (paid, no booking, no resolution) | v1 | Backlog |
| 8 | **Reliable auth / OTP** | AYO | AYO's #1 current complaint (can't log in / OTP never arrives) | v1 | Backlog |
| 9 | **Fast, transactionally-safe checkout** (no "7-min pay") | AYO | AYO slow checkout + crashes at peak | v1 | Backlog |
| 10 | **Operator dashboard** (calendar, occupancy, revenue, walk-in/POS) | Reclub | Reclub has no venue-business tooling | v1 | Backlog |
| 11 | **Dynamic / peak pricing** for venues | AYO | AYO appears to lack automated peak pricing | v1 | Backlog |
| 12 | **Transparent instant payouts + self-serve onboarding** | AYO | AYO payout timing opaque; onboarding sales-gated | v1 | Backlog |
| 13 | **Web that transacts** (SSR + on-page booking/payment) | Both | Both have read-only webs that funnel to an app | v1 | Backlog |
| 14 | **Match SSR/JSON-LD programmatic SEO, then beat on speed** | Both | AYO strong SEO but ~600KB jQuery; Reclub read-only | v1 | Backlog |
| 15 | **Installable PWA → native** (TWA + Capacitor) | Both | AYO no PWA + forced app install; Reclub 188MB app | v1 | Backlog |
| 16 | **Lighthouse-99 performance** | Both | AYO heavy/slow; Reclub freeze/blank-screen bugs | v1 | Backlog |
| 17 | **Honest, opt-in, quiet-hours notifications + working toggle** | Both | Both have named notification-spam complaints | v1 | Backlog |
| 18 | **Verified identities + real dispute/refund flow** (payment-trail backed) | Both | Neither protects buyers; Reclub rating abuse | v1 | Backlog |
| 19 | **System-enforced no-show / deposit protection** | Reclub | Reclub protects neither side from no-shows | v1 | Backlog |
| 20 | **Margin-aware VPR rating** (fair, anti-sandbag) | Both | Reclub self-rating (sandbagged); AYO has NO rating | v1.5 | Backlog |
| 21 | **Open Match / level-based social** (just enough to neutralize stickiness) | Reclub | Reclub's social/matchmaking moat | v1.5 | Backlog |
| 22 | **Bilingual EN/ID** (expat/tourist padel market) | AYO | AYO is Indonesian-only in practice | v1 i18n-ready · EN v1.5 | Backlog |

**Positioning rule:** don't out-*community* Reclub day one — **out-*trust* and out-*transact*** both; ship just enough Open-Match/social (v1.5) to neutralize Reclub's stickiness; the all-in wedge AYO can't match without re-architecting is **#1 (venue keeps 100%, platform holds nothing)**.
