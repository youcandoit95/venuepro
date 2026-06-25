# VenuePro — SESSION HANDOFF (read this first to resume)

**Last updated:** 2026-06-25 · **Repo:** https://github.com/youcandoit95/venuepro · **main @ `7fb5b9f`** (pushed, synced).

> New session? Read this top-to-bottom, then `docs/superpowers/memory/MEMORY.md` and the plan roadmap. Everything is committed + pushed. Honor the standing habits below after every task.

## Where we are (1-paragraph)
VenuePro = Indonesian court-booking **SaaS** (padel/tennis, Jakarta-first). Brainstorming is **done**; the spec is **locked at v1.3**. The implementation **roadmap (14 plans, system-flow order)** and **Plan 01 (Foundation)** are written in full. **No application code has been built yet** — there is no Laravel app in the repo, only docs + the vendored KORTA template + the reindex script. The immediate next step is to **execute Plan 01**.

## ⏭️ IMMEDIATE NEXT ACTION
**Execute Plan 01 — Foundation** (`docs/superpowers/plans/2026-06-25-venuepro-01-foundation.md`).
- **Pending user decision:** execution mode — **(1) subagent-driven (recommended)** via `superpowers:subagent-driven-development`, or **(2) inline** via `superpowers:executing-plans`. Ask the user which before starting.
- **Prereqs to verify first:** PHP 8.4, Composer 2, Node 24 LTS, a running **PostgreSQL 18 + PostGIS**, and a password-protected **Redis 8.8**. (Plan 01 Task scaffolds Laravel 13 into the repo root, preserving `docs/`, `scripts/`, `korta-template/`.)
- After Plan 01 ships, write + execute **Plans 02–14** in roadmap order (write each just-in-time to avoid interface drift).

## Repo layout
- `docs/superpowers/specs/2026-06-24-venuepro-v1-design.md` — **the spec (v1.3)**. Read §4.1 (pinned stack), §5 (data model), §7 (NFRs).
- `docs/superpowers/plans/2026-06-25-venuepro-v1-roadmap.md` — 14-plan sequence + **Global Constraints** (apply to every task).
- `docs/superpowers/plans/2026-06-25-venuepro-01-foundation.md` — Plan 01, full TDD (8 tasks incl. `/korta-template` preview route).
- `docs/superpowers/specs/competitor-{reclub,ayo}.md` — competitor research.
- `docs/superpowers/memory/` — **canonical git-tracked memory** (MEMORY.md + files).
- `docs/superpowers/session-log.md` — running task log (newest first).
- `docs/superpowers/INDEX.md` — "grapify" heading/symbol map (read to jump to file:line; rebuild via `./scripts/reindex.sh`).
- `korta-template/` — the KORTA padel template (vendored; history preserved). Live now at https://padel.myansenriadi.com; future Laravel preview at `/korta-template`.

## Locked decisions (do not re-litigate)
- **Model:** SaaS, **venue = merchant of record** (Xendit xenPlatform sub-accounts; venue keeps 100%); **platform never holds booking funds**; platform revenue = **prepaid credits** (~1/booking). Non-PKP/non-custodial.
- **Stack (verified latest, spec §4.1):** Laravel 13 · PHP ^8.4 · Livewire 4 (`csp_safe=true`) · Alpine 3 + `@alpinejs/csp` · Tailwind v4 · PostgreSQL 18 + PostGIS 3.6 + btree_gist · Redis 8.8 · Vite 8 · Node 24 · Pest 4 · Sanctum ^4.3 · spatie/permission ^8 · Xendit ^7 · Intervention v4 · browser-image-compression ^2.0.2.
- **Booking integrity** = DB `EXCLUDE USING gist (... WHERE status IN ('hold','paid','confirmed'))`.
- **Media:** uploads = **images only** (client-compressed; server re-encode/EXIF-strip); **video not allowed**.
- **Scope:** v1 = booking + ops core. **VPR rating + Open Match → v1.5.** **Tournaments (open + invite-only) → v2** (NOT designed yet; user has not finalized provider/money model — re-ask if raised).

## Standing habits/rules (apply every task — also in memory)
1. **After each task:** update memory (`docs/superpowers/memory/`), the session-log, and run `./scripts/reindex.sh`. Then commit.
2. **`.env` + `.env.example` always in lockstep** — every new env key added to `.env.example` (placeholder, never a secret) in the same commit. `.env` is gitignored.
3. **Read `competitive-backlog.md` every session**; flip Status (Backlog→In progress→Done) as features ship.
4. **Security/perf invariants:** CSP `script-src` no `unsafe-inline`/`unsafe-eval`; allowlist in `config/csp.php`; tenancy bound from route; Lighthouse ≥99 per route; Bahasa/IDR/WIB.
5. Push to GitHub `youcandoit95/venuepro` via SSH alias `github.com-personal`. Never commit certs/secrets/`.env`.

## Task tracker state
- Done: brainstorming (#1–8), roadmap (#9), Plan 01 authored (#10).
- Open: **#11 Execute Plan 01** · **#12 Write+execute Plans 02–14**.

## Open questions for the user (when they return)
1. **Plan 01 execution mode?** subagent-driven (recommended) vs inline.
2. Write **all** Plans 02–14 upfront, or just-in-time per plan? (Recommended: just-in-time.)
3. **Tournaments** (open + invite-only): provider (venue/klub vs platform), money model, phase — only if they want to design it now (currently parked at v2).
