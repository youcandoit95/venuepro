# Competitor analysis — AYO Indonesia (for VenuePro)

_Researched 2026-06-25. "Verified" = found directly; "Inferred" = reasoned. Sources inline._

## TL;DR
**AYO is the real booking-with-payment competitor** (2,000+ venues, 6,800+ courts, padel = their largest category, ~900K–1.2M users). **It HOLDS the money** (player → AYO's gateway → "AYO Balance" wallet → released to venue 6h after event, bank withdrawal ≤24h later) and monetizes via **commission + SaaS subscription + a Rp 5.000 player convenience fee**. It has **no objective player rating system**, **no PWA**, a heavy/dated ~600KB site, and its most damaging reviews are **broken auth** and **"paid but the venue has no record / no refund."** → VenuePro's wedge: **venue = merchant-of-record (keeps 100%, instant, own Xendit), credits not commission, VPR rating, Lighthouse-99 PWA, booking-integrity guarantee.**

## What AYO is
- "Super sport community app": venue booking + social (sparring, Open Play/mabar, 37K+ communities) + operator SaaS (AYO Venue Management).
- Company **PT Ayo Indonesia Maju** (Jakarta), origin 2016 (IG football community) → booking product **Mar 2022**. Founders Samuel Hadeli Lie (CEO), Agustian Hermanto (CPO), Raimundus Johannes (COO). ~11–50 staff.
- Funding: **one disclosed Seed round (May 2023, amount undisclosed)**, led by Alpha Momentum Indonesia + Greysia Polii ("Chief Winning Officer") et al. No later round found. Treat capitalization as modest/unknown.
- Scale (mid-2026, self-reported): **2,000+ venues / 6,800+ courts / 100+ cities**; court mix **3,700+ padel** (largest), 1,400+ badminton, 400+ tennis, 200 mini-soccer, 200 futsal, 100 pickleball; **~900K–1.23M users**, 37K+ communities, 27 sports. Play 500K+ downloads (6.86K reviews); App Store ID 4.9★ (~3K).

## Business model / money flow (THE WEDGE)
- **3 revenue streams (confirmed):** booking **commission** + **SaaS subscription** (AVM) + **ad/sponsorship** (Liga AYO). Take-rate % and AVM price are **deliberately hidden** (sales-led "Hubungi Kami"; mystery-shop to learn).
- **Rp 5.000 player convenience fee** per online payment ("Biaya Layanan Transaksi," confirmed for Open Play) — **not refunded** on cancellation; widely resented.
- **AYO holds the money (collect-and-remit / escrow).** Funds flow player → AYO gateway → **AYO Balance** (AYO-controlled wallet) → venue/host balance **6h after event** (if no dispute) → bank withdrawal **≤24h** later. AYO never states money goes directly to the venue's own bank → AYO is functionally **merchant-of-record**; venue waits on AYO to get paid.
- Payment methods: GoPay, Virtual Account (10+ banks), Alfamart cash, DP ≥10%; QRIS/other e-wallets inferred. Aggregator undisclosed (Xendit suspected). Card unknown.

## Player-side
- Slot-based real-time court availability ("pick like cinema seats"); DP or full pay; reschedule; add-ons (racket rental).
- Social moat: Sparring + Open Play/mabar + 37K+ communities (the retention engine).
- **No objective player rating / level / MMR / skill tier** — confirmed by direct inspection. Matchmaking is manual/social. (Meanwhile ID padel rapidly adopting Playtomic 0–7 / World Padel Rating.) **Greenfield for VPR.**
- **No player prepaid wallet / credits / loyalty.** "AYO Balance" is a venue payout wallet, not a player top-up.
- Cancellation tiers (venue picks): Flexible (100% ≥24h, 50% <24h), Medium (100% ≥5d, 50% <5d), Strict (no refund). Rp 5.000 fee never refunded.

## Operator-side (AYO Venue Management)
- Separate operator app; **sales-assisted onboarding** (not fully self-serve). Booking calendar + anti-double-booking, walk-in/manual reservation (no dedicated cashier/POS module found), payout dashboard, analytics (revenue/occupancy), staff RBAC, memberships, vouchers, payment links, refund-policy control.
- **No dynamic/peak pricing found** (inferred gap → likely manual per-slot only).

## Tech / UX
- **Web = genuine SEO strength** (their hardest-to-copy moat): ayo.co.id/ayo.app same SSR site (Laravel/PHP + jQuery + Bootstrap), real HTML per-venue pages (`/v/<venue>`) with **JSON-LD Product + aggregateRating + offers**, templated **sport×city landing pages**. Deeply indexed. **VenuePro must match this from day one.**
- Web booking is real (slot/DP/reschedule/add-ons in markup) but pushes app install hard; some venues mandate app registration (resented).
- **No PWA** (no manifest/SW). Heavy/dated stack — venue pages **~590–620 KB**, render-blocking CDN assets → inferred mediocre mobile CWV.
- Native app iOS+Android (inferred Flutter, ~72–84 MB). **Indonesian-only** in practice (no real EN locale).

## Weaknesses (sourced from app-store reviews; 4.9★ headline masks severe 1–2★ functional complaints)
- **A. Broken auth (#1, in current 6.7.x):** "already registered / can't log in," OTP never arrives, raw backend errors leaked ("failed host lookup: gatewayayo.co.id"), "almost a month unable to log in."
- **B. Paid but venue has NO record (validates escrow-risk wedge):** "Payment succeeded… arrived, no booking under my name… no court left… no resolution."
- **C. Refund denied / closed venue still bookable / gateway fee not returned.**
- **D. Resented Rp 5.000 fee** pushed to consumers, not refunded.
- **E. Performance:** "7 minutes from open to payment at peak," "everything loading," crashes on long lists.
- **F. Notification spam + broken in-app toggle + late (post-event) notifications.**
- **G. Unresponsive CS / no in-app contact number.**
- **H. Host payout opacity:** "don't know when I can withdraw."
- **I. Broken location filter; time filter returns already-booked courts.**
- Operator complaints: none public (live in private WA groups) — evidence gap, not absence.

## How VenuePro beats AYO (→ folded into spec §2.1)
1. **Venue = merchant-of-record, keeps 100% direct to own Xendit** vs AYO holding money 6h–24h+ in AYO Balance (counters §6-B "paid but no booking", §6-H payout opacity).
2. **Credits not commission; no player surcharge** vs commission + unrefunded Rp 5.000 (counters §2, §6-C/D).
3. **Margin-aware VPR rating** vs AYO's *no* rating system (greenfield).
4. **Reliability at the booking→payment step** + transactionally-safe checkout vs "7-min pay," crashes, "paid but no booking" (counters §6-B/E).
5. **Flawless auth** (reliable OTP) vs AYO's #1 current complaint (§6-A).
6. **Match AYO's SSR/JSON-LD programmatic SEO, then beat it on speed** (Lighthouse-99 vs ~600KB jQuery stack).
7. **Installable PWA→native** vs AYO's no-PWA + forced buggy app install.
8. **Transparent instant payouts + self-serve onboarding** vs opaque timing + sales-gated AVM.
9. **Dynamic/peak pricing** for venues (AYO lacks it) — yield tooling aligned with "venue keeps 100%."
10. **Honest, throttled notifications with a working toggle** (§6-F).
11. **Responsive in-app support + booking-integrity guarantee** ("no venue record → instant auto-refund + comparable rebooking") turns AYO's worst failure into a trust headline (§6-B/C/G).
12. **Bilingual EN/ID** for Jakarta/Bali padel expat/tourist market (AYO is ID-only).

## Undisclosed / to mystery-shop
Commission %, AVM subscription price, payment aggregator (Xendit suspected), court-booking settlement clock, whether Rp 5.000 applies to plain bookings.

## Sources
ayo.app · ayo.app/venues · ayo.co.id/venue/features · ayo.app/terms-and-conditions · ayo.app/about-us · Play `coid.ayo.ayo_mobile_app` · App Store id1539581877 · heaptalk (seed round, "commission + subscription + ad sponsorship") · DealStreetAsia · AsiaTechDaily (Greysia Polii) · LinkedIn /company/ayo-app.
