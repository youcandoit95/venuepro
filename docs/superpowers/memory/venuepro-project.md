---
name: venuepro-project
description: "VenuePro — Indonesian court-booking SaaS (padel/tennis, Jakarta) — current state, model, and where the spec lives"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0adddf45-9fb2-448a-8466-0f2f35efa1bb
---

**VenuePro** (venuepro.asia) = court-booking SaaS for Indonesia, Jakarta-first, padel + tennis. Stack: Laravel 12 + Blade (SSR public) / Livewire 3 / Alpine / Tailwind v4 + Postgres/PostGIS (btree_gist EXCLUDE no-overlap) + Redis + Xendit. Repo `/Volumes/data/venuepro` (git).

**Load-bearing model decisions (locked):**
- **Venue = merchant of record** via Xendit xenPlatform sub-accounts → 100% of booking money goes to the venue's own account; **platform NEVER holds/custodies booking funds** (avoids PJP/escrow + marketplace tax-collector exposure; platform stays non-PKP SaaS).
- **Platform monetizes via prepaid CREDITS** (~1 credit/confirmed booking), not commission.
- Refunds executed by the venue per its own CancellationPolicy; hard, server-enforced disclosures on transaction pages.
- v1 = booking + operations core. **VPR rating (margin-aware Elo+RD) + Open Match deferred to v1.5.**

**Spec:** `docs/superpowers/specs/2026-06-24-venuepro-v1-design.md` (currently **v1.2, panel-hardened**). §7 covers the owner's six hard requirements: SEO/AEO, PWA→native (TWA + iOS Capacitor), **Lighthouse ≥99 per-route**, OWASP security, UX, design-system tokens. CSP is **allowlist-based** (self-host default; whitelist named origins that can't be local; hard no `unsafe-inline`/`unsafe-eval` on script-src). Privacy Policy + Terms pages and **self-service account deletion ("Hapus akun")** are in v1 scope (UU PDP + Play/App Store requirement).

**Status:** brainstorming spec at the "user reviews spec → writing-plans" gate. Competitors analyzed: [[venuepro-competitors]].

Related KORTA padel PWA (separate, live) lives at `/Volumes/data/padel` (padel.myansenriadi.com).
