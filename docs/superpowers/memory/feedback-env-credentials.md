---
name: feedback-env-credentials
description: Standing rule — all credentials/config in .env; keep .env.example in lockstep whenever a new env key is added
metadata:
  type: feedback
---

**All credentials and config values go in `.env`** (read via `config()`, never hardcoded). **`.env.example` must always be updated** — whenever any task adds a new env key, add it to `.env.example` in the **same commit** with a safe placeholder/empty value (never a real secret).

**Why:** keeps secrets out of code/git (`.env` is gitignored) while `.env.example` stays the committed, complete contract of required keys so a fresh clone / new env / CI knows exactly what to set. Applies across VenuePro ([[venuepro-project]]) — Xendit keys, WA BSP, DB/Redis password, APP_KEY, VAPID, etc.

**How to apply:** part of the per-task ritual ([[feedback-update-memory-session-index-after-task]]). Before committing a task that introduces config: grep the diff for new `env()`/`config()` keys and confirm each exists in `.env.example` with a placeholder. Reject otherwise.
