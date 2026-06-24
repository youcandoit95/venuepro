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
- **AYO** (ayo.co.id) — the real booking-with-payment competitor (~2,010+ venues, in-app QRIS/e-wallet, disburses to venues, "AYO Venue Management" SaaS). Full weakness analysis: `docs/superpowers/specs/competitor-ayo.md` (research in progress as of 2026-06-25).

**VenuePro's wedge** (the intersection neither fully owns): trusted, instant, in-app booking where the **venue keeps 100% of the money** (merchant-of-record + credits, not commission), fair **margin-aware VPR rating**, and a fast **SSR/PWA web that actually converts**. Beats Reclub on trust/payment/inventory/operator-tooling; beats AYO by venue keeping 100% (no commission, no platform-held funds). Positioning rule: don't out-community Reclub — **out-trust and out-transact** it; folded into spec §2.1.
