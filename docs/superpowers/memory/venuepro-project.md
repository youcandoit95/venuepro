---
name: venuepro-project
description: "VenuePro — Indonesian court-booking SaaS (padel/tennis, Jakarta) — current state, model, and where the spec lives"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0adddf45-9fb2-448a-8466-0f2f35efa1bb
---

**VenuePro** (venuepro.asia) = court-booking SaaS for Indonesia, Jakarta-first, padel + tennis. Stack (verified latest-stable 2026-06, pinned in spec §4.1): **Laravel 13** + Blade (SSR public) / **Livewire 4** (CSP-safe mode) / **Alpine 3** / **Tailwind v4** + **PostgreSQL 18.4** / **PostGIS 3.6** (btree_gist EXCLUDE no-overlap) + **Redis 8.8** (Valkey 9.1 = permissive drop-in alt) + Xendit `^7`. PHP `^8.4`, Vite 8, Node 24 LTS, Pest 4, Capacitor 8. Repo `/Volumes/data/venuepro` (git).

**Load-bearing model decisions (locked):**
- **Venue = merchant of record** via Xendit xenPlatform sub-accounts → 100% of booking money goes to the venue's own account; **platform NEVER holds/custodies booking funds** (avoids PJP/escrow + marketplace tax-collector exposure; platform stays non-PKP SaaS).
- **Platform monetizes via prepaid CREDITS** (~1 credit/confirmed booking), not commission.
- Refunds executed by the venue per its own CancellationPolicy; hard, server-enforced disclosures on transaction pages.
- v1 = booking + operations core. **VPR rating (margin-aware Elo+RD) + Open Match deferred to v1.5.**

**Spec:** `docs/superpowers/specs/2026-06-24-venuepro-v1-design.md` (**v1.3, latest-stack — LOCKED**). §7 covers the owner's six hard requirements: SEO/AEO, PWA→native (TWA + iOS Capacitor), **Lighthouse ≥99 per-route**, OWASP security, UX, design-system tokens. CSP is **allowlist-based** (hard no `unsafe-inline`/`unsafe-eval` on script-src). Privacy/Terms pages + **account deletion ("Hapus akun")** in v1. Uploads **images only** (client-compressed); video disallowed.

**Status (2026-06-25):** brainstorming DONE → writing-plans. **Roadmap (14 plans) + Plan 01 (Foundation) written; nothing executed yet (no Laravel app).** Repo pushed to github.com/youcandoit95/venuepro (VenuePro at root, KORTA in `korta-template/`). **▶ Next: execute Plan 01 — see `docs/superpowers/HANDOFF.md`.** Competitors: [[venuepro-competitors]]; backlog: [[competitive-backlog]]; rules: [[feedback-update-memory-session-index-after-task]], [[feedback-env-credentials]].

Related KORTA padel PWA also vendored at `korta-template/` (and live separately at `/Volumes/data/padel` → padel.myansenriadi.com).
