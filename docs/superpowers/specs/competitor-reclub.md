# Competitor analysis — Reclub (for VenuePro)

_Researched 2026-06. Sources at bottom. "Verified" = found directly; "Inferred" = reasoned from evidence._

## TL;DR
**Reclub is NOT a booking marketplace — it's a social-sports community + matchmaking app that processes NO money.** Its FAQ states payments are "in the roadmap" (not live). Every booking is an individual **host** collecting via **manual bank transfer + payment-proof screenshot**. This is the core exploitable gap (and a documented fraud problem). The real *booking-with-payment* competitor is **AYO** (separate report).

## What Reclub is
- Positioning: "platform empowering sports communities" / "Matchup & find games nearby." Social-sports community + pickup-game matchmaking, not court rental.
- Company: **Reclub PBC** (US Public Benefit Corp), founded 2018 (Tony Ho, Luis Aloma); global pickleball/social-sports origin, padel/Indonesia is a recent high-growth surface.
- Sports: padel (ID #1), tennis, pickleball, badminton, volleyball, etc. Geo: USA/Canada/Vietnam/Taiwan/PH/Germany/India/**Indonesia** (Jakarta dominant + Tangerang/Bandung/Bali/Surabaya/Palembang/Batam).
- Scale: Google Play **500K+ installs** (~4.6, 13.9K reviews); App Store 4.8–4.9 (~9.7K), "#1 in Sports." Large ID padel clubs (Midnight Padel 7.2K members, BANZAI 7.6K). **Numbers are global, not ID-specific.**
- Funding: **unclear/unverified** (Tracxn "none" vs Crunchbase convertible-note hint). Do not assume well-capitalized.

## Player-side
- Discovery is **community-centric** (clubs, member counts), not venue/court-centric. No "browse this court's open slots, book now."
- Booking: request → host confirms → **pay host by bank transfer** → send proof. Slot-level, not court-level.
- **Payment: NONE in-app.** Manual transfer to a host's personal account; proof screenshots. No QRIS/e-wallet/card/split/deposit/escrow.
- Open Match: **strongest feature** — round-robin, Americano/Mexicano, join-by-level, waitlists, team draw.
- Rating: **self-declared 1.0–10.0** (no verification, openly **sandbagged**); "Street Cred" peer-kudos reputation; DUPR integration is **pickleball-only** (no objective padel/tennis rating).
- Memberships/credits: none for players except "Reclub Supporter" subscription (~$2–3/mo) for ad-removal/stats/receipt tooling.
- Cancellation/refund: **no platform engine**; per-host, usually "no refund, give your slot away."
- Notifications: present but a **top complaint** (spam, 2 AM invites, unmutable).

## Venue/operator-side
- **No venue-as-business tooling.** "Clubs" are social groups, not commercial venue accounts. No court-inventory calendar, no revenue/payout dashboard, no disbursement, no dynamic pricing, no walk-in/POS.
- No commission/listing fee — **because Reclub touches no money.**

## Tech / UX
- **Native app is the product** (iOS ~188 MB); must install to transact.
- **Web (reclub.co) has genuinely good SSR/SEO** — indexed club (`/clubs/@…`), meet (`/m/…`), sport/city (`/id/sports/padel`) pages with rich metadata. **Strength.** But web is **read-only** — funnels to the app; **no web booking/payment, no PWA.**
- Bilingual ID/EN. UX strengths: matchmaking, community feel, level discovery. Pain points (reviews): **freeze/blank-screen after location/map tap**, notification spam, photo-upload failures, rating abuse by unverified accounts.

## Monetization
- Player subscription "Reclub Supporter" (~$2–3/mo, ~$20–30/yr) + banner ads. **No commission/booking fee/take-rate — captures 0% of GMV.** Strategically fragile vs a transaction model.

## Weaknesses (sourced)
1. **Systemic fraud / no buyer protection** — peer-to-peer money, no escrow/dispute; viral warnings of hosts no-showing or running fictitious bookings with "no intention to refund."
2. No in-app payment (manual transfer + screenshot).
3. No refund/cancellation engine.
4. Unverified, gamed self-rating; no objective padel/tennis rating.
5. App stability bugs (freeze/blank screen).
6. Notification spam.
7. Rating/review abuse from unverified accounts.
8. No venue-business tooling.
9. Web non-transactional (install wall).
10. 0% of GMV monetized.

## How VenuePro beats Reclub (→ folded into spec §2.1)
Trust/money-safety wedge ("bayar ke venue, bukan orang asing", merchant-of-record on venue's own Xendit, auditable/refundable) · real in-app QRIS payment with venue keeping 100% · court-level inventory + instant confirmed booking (EXCLUDE constraint kills double/fictitious booking) · margin-aware VPR rating vs sandbagged self-rating · prepaid credits as instant refund-to-wallet rail + venue-friendly monetization · real operator dashboard · web that transacts (SSR + PWA→native, out-SEO with on-page booking) · Lighthouse-99 perf vs freeze-prone app · system-enforced no-show/deposit + verified identity + dispute flow.

**Positioning rule:** don't out-community Reclub day one — **out-trust and out-transact** it; ship just enough Open-Match/level-based social (v1.5) to neutralize stickiness.

## Caveats (unverified)
Exact funding; ID-specific MAU/downloads; reclub.co Lighthouse number (not audited); whether payments shipped since FAQ (a Jan-2026 meet still used manual BCA transfer — recheck before citing publicly).

## Sources
reclub.co · App Store id1323924315 · Google Play co.reclub · pickleball.reclub.co/faq ("does not support payments yet") · help.reclub.co (Street Cred) · reclub.co/m/9WJRFI (manual transfer, no-refund) · voila.id self-rating guide · Threads @drg_nadia (fraud warning) · Threads @rendy.f.wangsa (sandbagging) · ayo.app · reclub.co/id/sports/padel.
