# VenuePro — session log

Running log of completed tasks (newest first). Updated after each task per the standing habit
(memory + session + index). Memory lives at `~/.claude/projects/-Volumes-data/memory/`.

## 2026-06-25
- **Media policy: images-only, client-compressed; video disallowed.** Added client-side image pre-compression (Web Worker, WebP, lazy-loaded dashboard-only; `browser-image-compression ^2.0.2`) to §7.1; §7.4 file-upload now image-only (reject video/*, SVG), client compress = optimization not trust boundary (server re-encodes/strips EXIF). CSP deltas: `worker-src 'self'` + `img-src blob:` on dashboard. Updated §1/§4.1/§8.
- **Latest-stack verification → spec v1.3 (§4.1 pin table).** 13-component live-verified panel (context7 + web). Bumps: Laravel 12→13 (GA Mar 2026), Livewire 3→4 (built-in CSP-safe mode), PostgreSQL→18.4/PostGIS 3.6, Redis 8.8 (kept per owner; Valkey 9.1 noted), Vite 8/Node 24/Pest 4/Capacitor 8/MapLibre 5/Intervention v4. PHP stays ^8.4. Risk flags noted (avoid PG19 beta, MapLibre v6 pre-release, Capacitor 9 alpha, Node 26 non-LTS, PHPUnit 13 conflicts Pest). Raw: `tasks/wfa78pd2a.output`.
- **AYO competitor analysis → spec §2.1 + `competitor-ayo.md`.** Key finding: AYO HOLDS the money (AYO Balance, venue paid 6h–24h later, opaque), commission + Rp5.000 player fee, no player rating, no PWA, heavy ~600KB site, broken-auth/"paid-but-no-booking" reviews. Folded 11 "beats AYO" wedges into §2.1. Confirms VenuePro's core wedge: venue keeps 100% instant to own Xendit.
- **"Grapify" code/knowledge index + memory moved into repo.** `scripts/reindex.sh` (POSIX grep, no rg dependency) generates `docs/superpowers/INDEX.md` (heading map now; PHP/JS symbols once scaffolded; optional `.tags` via universal-ctags). Memory migrated from `~/.claude/...` into the repo at `docs/superpowers/memory/` (sustains in git); `~/.claude` copy is now just a pointer. Habit: rebuild index + update memory + session after each task.
- **CSP relaxed + Privacy/Hapus-Akun + Reclub wedge** → spec `f6e01b1`. CSP now allowlist-based (self-host default, whitelist named origins that can't be local; hard no `unsafe-inline`/`unsafe-eval` on script-src). Added Privacy Policy + Terms pages and self-service account deletion (UU PDP + Play/App Store req). Added §2.1 competitive positioning vs Reclub. Saved `docs/.../competitor-reclub.md`.
- **Expert-panel cross-feedback round → spec v1.2** `e46ff56`. 6 lenses (SEO · PWA→native · perf · OWASP · UX · UI design-system) + cross-feedback + synthesis. Lighthouse raised 98→≥99 per-route; added §7.1–7.8 (incl. design-system tokens) + Appendix A (14 resolved tensions). Panel raw output: `docs/.../expert-panel-result.json`.
- **Memory + session log set up.** Created MEMORY.md + user-profile, venuepro-project, venuepro-competitors, feedback-update-memory-session-index-after-task.
- **AYO competitor research** dispatched (background) → will produce `docs/.../competitor-ayo.md` + fold into spec §2.1.
- **Open:** confirm what "grapify" indexing tool is before installing.

## Earlier (pre-2026-06-25, summarized)
- v1.1 critique-hardened spec `69c4c5a` (SaaS credit model, venue merchant-of-record).
- Brainstorming flow at the "user reviews spec → writing-plans" gate.
- KORTA padel PWA shipped live (separate project, `/Volumes/data/padel`).
