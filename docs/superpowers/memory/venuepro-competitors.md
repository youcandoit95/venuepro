---
name: venuepro-competitors
description: "VenuePro's Indonesian competitors — Reclub & AYO — model, gaps, and VenuePro's wedge"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 0adddf45-9fb2-448a-8466-0f2f35efa1bb
---

VenuePro ([[venuepro-project]]) competes against two incumbents on different axes:

- **Reclub** — social-sports community + matchmaking app (500K+ global installs, padel-strong Jakarta). **Processes NO money** (manual bank transfer + payment-proof screenshots → documented fraud/no-refund). Self-declared 1–10 rating (sandbagged; no objective padel/tennis rating). Great SSR/SEO web but **read-only** (must install 188 MB app to transact). No venue-business tooling. Monetizes thin player subscription (0% of GMV). Full report: `docs/superpowers/specs/competitor-reclub.md`.
- **AYO** (ayo.co.id) — the real booking-with-payment competitor (~2,000 venues / 6,800+ courts / ~1M users; padel = largest category). **Key wedge: AYO HOLDS the money** ("AYO Balance" wallet, released to venue 6h after event + bank withdrawal ≤24h; opaque payout) and charges **commission + SaaS sub + a Rp 5.000 player fee**. Has **no player rating system**, **no PWA**, a heavy ~600KB jQuery site, is ID-only; worst reviews = broken auth + "paid but venue has no record" + slow checkout. Strong SSR/JSON-LD SEO (must match). Full report: `docs/superpowers/specs/competitor-ayo.md`.

**VenuePro's wedge** (the intersection neither fully owns): trusted, instant, in-app booking where the **venue keeps 100% of the money** (merchant-of-record + credits, not commission), fair **margin-aware VPR rating**, and a fast **SSR/PWA web that actually converts**. Beats Reclub on trust/payment/inventory/operator-tooling; beats AYO by venue keeping 100% (no commission, no platform-held funds). Positioning rule: don't out-community Reclub — **out-trust and out-transact** it; folded into spec §2.1.
