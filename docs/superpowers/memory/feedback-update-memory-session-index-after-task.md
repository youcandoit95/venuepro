---
name: feedback-update-memory-session-index-after-task
description: Standing habit — after every completed task, update memory + session log + the code/knowledge index ("grapify")
metadata:
  type: feedback
---

After **every completed task**, the user wants three things updated, every time:
1. **Memory** — these project memory files + `MEMORY.md` index (canonical copy lives in-repo at `docs/superpowers/memory/`, so it sustains in git).
2. **Session** — the running session/progress log at `docs/superpowers/session-log.md`.
3. **"Grapify"** — confirmed = a **local code/semantic index** so I locate symbols & spec sections without reading whole files (saves tokens). Implemented as **`scripts/reindex.sh`** → generates **`docs/superpowers/INDEX.md`** (markdown heading map now; PHP/JS/route symbol map once Laravel is scaffolded; optional `.tags` if universal-ctags installed). **Rebuild it after each task** and consult `INDEX.md` before reading large files.

**Why:** the user is doing long, multi-session work (VenuePro SaaS [[venuepro-project]]) and wants continuity + low token cost — the index avoids re-reading large files; memory/session keep state across compactions.

**How to apply:** treat it as a per-task ritual. When a task finishes: (a) append/update the relevant memory file + `MEMORY.md`, (b) note progress in the session log, (c) run `./scripts/reindex.sh`. Keep entries terse.
