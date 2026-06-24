# Plan 01 — Foundation & Toolchain — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is **Plan 01 of 14** — see `2026-06-25-venuepro-v1-roadmap.md`.

**Goal:** Stand up a booting Laravel 13 app wired to PostgreSQL 18 (PostGIS + btree_gist), Redis 8.8, and a Vite 8 / Tailwind v4 / Livewire 4 (CSP-safe) frontend, with a strict-CSP security-header pipeline, a green CI (Pest + Pint + PHPStan + build), and a passing health check — the foundation every later plan builds on.

**Architecture:** Standard Laravel 13 monolith. Public pages are server-rendered Blade (no Livewire/Alpine on the public critical path); the authenticated surface (later plans) is Livewire 4 in CSP-safe mode. Postgres is the single source of truth; Redis backs cache/queue/session. One global `SecurityHeaders` middleware emits an allowlist CSP (no `unsafe-inline`/`unsafe-eval` on `script-src`) sourced from `config/csp.php`.

**Tech Stack:** Laravel `^13.0`, PHP `^8.4`, Pest `^4.7`, PostgreSQL `18.4` + PostGIS `3.6` + `btree_gist`, Redis `8.8` (phpredis), Vite `^8.1` + `laravel-vite-plugin ^3.1` (Node 24 LTS), Tailwind `^4.3` (`@theme`), Livewire `^4.3` (`csp_safe=true`), Alpine `^3.15` (`@alpinejs/csp`), Larastan `^3`, Pint.

## Global Constraints

See **`2026-06-25-venuepro-v1-roadmap.md` → Global Constraints** — every task inherits them. Foundation-critical ones: `script-src` never has `unsafe-inline`/`unsafe-eval`; CSP is an allowlist in `config/csp.php`; **Livewire/Alpine must not load on public SSR routes**; `APP_DEBUG=false` outside local; Redis password-protected; Bahasa Indonesia / `<html lang="id">`; DRY/YAGNI/TDD/frequent commits.

**Prerequisites (verify before Task 1):** PHP 8.4 (`php -v`), Composer 2 (`composer -V`), Node 24 LTS (`node -v`), a running PostgreSQL 18 with PostGIS available, and a password-protected Redis 8.8 (`redis-cli -a "$REDIS_PASSWORD" ping` → `PONG`). The repo already contains `docs/`, `scripts/reindex.sh`, `.gitignore`, and git history — the scaffold must preserve them.

---

## File Structure (created/owned by this plan)

- `composer.json`, `package.json`, `vite.config.js` — toolchain manifests (root)
- `.env` / `.env.example` — Postgres + Redis + app config
- `app/Http/Middleware/SecurityHeaders.php` — emits allowlist CSP + security headers
- `config/csp.php` — single source of truth for the CSP allowlist
- `config/livewire.php` — published; `csp_safe => true`
- `database/migrations/*_enable_postgres_extensions.php` — `postgis` + `btree_gist`
- `resources/css/app.css` — Tailwind v4 `@import` + `@theme` design-token seed
- `resources/js/app.js` — Livewire/Alpine (CSP build) entry (no public-route import)
- `resources/views/layouts/public.blade.php` — base SSR layout (`lang="id"`, no inline JS)
- `resources/views/welcome.blade.php` — minimal SSR landing using the layout
- `.github/workflows/ci.yml` — CI (services: postgres+redis; pest, pint, phpstan, build)
- `phpstan.neon`, `pint.json` — static analysis + style config
- `.lighthouserc.cjs`, `budgets.json` — Lighthouse/budget **stubs** (tightened in Plan 14)
- `tests/Feature/{BootTest,DatabaseExtensionsTest,RedisCacheTest,SecurityHeadersTest,HealthCheckTest}.php`, `tests/Feature/FrontendBuildTest.php`

---

## Task 1: Scaffold Laravel 13 + Pest 4 (app boots)

**Files:**
- Create: Laravel app at repo root (preserving `docs/`, `scripts/`, `.git`, our `.gitignore` entries)
- Create: `tests/Feature/BootTest.php`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a booting Laravel 13 app; `vendor/bin/pest` runner; the root URL `/` renders Laravel's default response (replaced in Task 4)

- [ ] **Step 1: Scaffold Laravel 13 into the existing repo (merge, don't clobber)**

```bash
cd /Volumes/data/venuepro
composer create-project "laravel/laravel:^13.0" .laravel-tmp --no-interaction
# copy app files into the repo root WITHOUT touching .git, docs/, scripts/, our .gitignore
rsync -a --exclude='.git' --exclude='.gitignore' .laravel-tmp/ ./
# merge Laravel's ignore rules into ours (keep our .tags etc.), then de-dupe
cat .laravel-tmp/.gitignore >> .gitignore && awk '!seen[$0]++' .gitignore > .gitignore.tmp && mv .gitignore.tmp .gitignore
rm -rf .laravel-tmp
composer install --no-interaction
```

Expected: `php artisan about` prints "Environment … Laravel Version 13.x … PHP Version 8.4.x".

- [ ] **Step 2: Install Pest 4 as the test runner**

```bash
composer remove phpunit/phpunit --dev --no-interaction 2>/dev/null || true
composer require pestphp/pest:^4.7 pestphp/pest-plugin-laravel:^4 --dev --with-all-dependencies --no-interaction
./vendor/bin/pest --init
```

Expected: `tests/Pest.php` exists; `./vendor/bin/pest` runs the example test green.

- [ ] **Step 3: Write the failing boot test**

```php
<?php
// tests/Feature/BootTest.php
it('boots and responds on the root url', function () {
    $this->get('/')->assertOk();
});

it('runs on php 8.4+ and laravel 13+', function () {
    expect(PHP_VERSION_ID)->toBeGreaterThanOrEqual(80400);
    expect(app()->version())->toStartWith('13.');
});
```

- [ ] **Step 4: Run it (the boot test should already pass; version assertions confirm the stack)**

Run: `./vendor/bin/pest --filter=BootTest`
Expected: PASS (Laravel's default `/` returns 200; version assertions hold). If `app()->version()` is not `13.*`, the scaffold pinned the wrong major — fix `composer.json` `"laravel/framework": "^13.0"` and `composer update`.

- [ ] **Step 5: Pin PHP in composer.json**

Set in `composer.json`: `"require": { "php": "^8.4 || ^8.5", ... }`. Run `composer update --no-interaction`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(foundation): scaffold Laravel 13 + Pest 4"
```

---

## Task 2: PostgreSQL 18 + PostGIS + btree_gist

**Files:**
- Modify: `.env`, `.env.example` (DB connection → pgsql)
- Create: `database/migrations/2026_06_25_000001_enable_postgres_extensions.php`
- Create: `tests/Feature/DatabaseExtensionsTest.php`

**Interfaces:**
- Consumes: booting app (Task 1)
- Produces: a migrated Postgres DB with `postgis` + `btree_gist` enabled — the prerequisite for the booking EXCLUDE constraint (Plan 05) and PostGIS geo (Plan 03)

- [ ] **Step 1: Point the app at PostgreSQL**

In `.env` (and mirror keys in `.env.example` with empty secrets):

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=venuepro
DB_USERNAME=venuepro
DB_PASSWORD=secret
```

Create the database: `createdb venuepro` (or via your PG client).

- [ ] **Step 2: Write the failing extensions test**

```php
<?php
// tests/Feature/DatabaseExtensionsTest.php
use Illuminate\Support\Facades\DB;

it('has postgis and btree_gist enabled', function () {
    $exts = DB::table('pg_extension')->pluck('extname')->all();
    expect($exts)->toContain('postgis');
    expect($exts)->toContain('btree_gist');
});

it('can use a gist EXCLUDE over tstzrange (smoke)', function () {
    DB::statement('CREATE TEMP TABLE _ex (id int, r tstzrange, EXCLUDE USING gist (id WITH =, r WITH &&))');
    DB::statement("INSERT INTO _ex VALUES (1, tstzrange(now(), now() + interval '1 hour'))");
    expect(fn () => DB::statement("INSERT INTO _ex VALUES (1, tstzrange(now() + interval '30 min', now() + interval '90 min'))"))
        ->toThrow(\Illuminate\Database\QueryException::class);
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `./vendor/bin/pest --filter=DatabaseExtensionsTest`
Expected: FAIL — extensions not yet created (`postgis`/`btree_gist` missing).

- [ ] **Step 4: Create the extensions migration**

```php
<?php
// database/migrations/2026_06_25_000001_enable_postgres_extensions.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');
    }

    public function down(): void
    {
        DB::statement('DROP EXTENSION IF EXISTS btree_gist');
        DB::statement('DROP EXTENSION IF EXISTS postgis');
    }
};
```

Ensure the test suite migrates fresh against the real Postgres (no SQLite): in `phpunit.xml` confirm `DB_CONNECTION=pgsql` is **not** overridden to sqlite, and use a dedicated `venuepro_testing` database (`DB_DATABASE` env in the `<php>` block). Add `uses(Illuminate\Foundation\Testing\RefreshDatabase::class)->in('Feature');` in `tests/Pest.php`.

- [ ] **Step 5: Run migrations + test to verify it passes**

Run: `php artisan migrate --force && ./vendor/bin/pest --filter=DatabaseExtensionsTest`
Expected: PASS (both extensions present; the EXCLUDE smoke rejects the overlap with a `QueryException`).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(foundation): PostgreSQL 18 + PostGIS + btree_gist"
```

---

## Task 3: Redis 8.8 (cache / queue / session)

**Files:**
- Modify: `.env`, `.env.example`, `config/database.php` (redis client = phpredis)
- Create: `tests/Feature/RedisCacheTest.php`

**Interfaces:**
- Consumes: booting app (Task 1)
- Produces: Redis-backed cache/queue/session — the booking UX-lock (Plan 05) and queues (Plan 10) depend on it

- [ ] **Step 1: Configure Redis (phpredis, password)**

In `.env` / `.env.example`:

```dotenv
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=changeme
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

Ensure the `phpredis` extension is loaded: `php -m | grep -i redis` → `redis`.

- [ ] **Step 2: Write the failing Redis cache test**

```php
<?php
// tests/Feature/RedisCacheTest.php
use Illuminate\Support\Facades\Cache;

it('round-trips a value through the redis cache store', function () {
    Cache::store('redis')->put('vp:ping', 'pong', 10);
    expect(Cache::store('redis')->get('vp:ping'))->toBe('pong');
})->skip(fn () => ! extension_loaded('redis'), 'phpredis not installed');
```

- [ ] **Step 3: Run it to verify it fails (or errors on connection)**

Run: `./vendor/bin/pest --filter=RedisCacheTest`
Expected: FAIL — connection refused / auth error until `.env` points at the running password-protected Redis. (If phpredis is missing, the test skips — install it first.)

- [ ] **Step 4: Start/verify Redis and re-run**

Run: `redis-cli -a "$REDIS_PASSWORD" ping` → `PONG`, then `./vendor/bin/pest --filter=RedisCacheTest`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(foundation): Redis 8.8 cache/queue/session (phpredis)"
```

---

## Task 4: Frontend toolchain (Vite 8 + Tailwind v4 + Livewire 4 CSP-safe) + base SSR layout

**Files:**
- Modify: `package.json`, `vite.config.js`
- Create: `resources/css/app.css`, `resources/js/app.js`
- Create: `resources/views/layouts/public.blade.php`
- Modify: `resources/views/welcome.blade.php`
- Modify: `config/livewire.php` (publish first)
- Create: `tests/Feature/FrontendBuildTest.php`

**Interfaces:**
- Consumes: booting app (Task 1)
- Produces: `resources/views/layouts/public.blade.php` (the base layout later public pages `@extends`), compiled Tailwind `@theme` tokens, and a Livewire 4 install in CSP-safe mode (used by dashboards from Plan 12)

- [ ] **Step 1: Install Livewire 4 + frontend deps**

```bash
composer require livewire/livewire:^4.3 --no-interaction
php artisan livewire:publish --config
npm install -D tailwindcss@^4.3 @tailwindcss/vite@^4.3 vite@^8.1 laravel-vite-plugin@^3.1
npm install alpinejs@^3.15 @alpinejs/csp@^3.15 browser-image-compression@^2.0.2
```

Then set CSP-safe mode in `config/livewire.php`: `'csp_safe' => true,` (auto-switches Alpine to the `@alpinejs/csp` build and avoids `eval`).

- [ ] **Step 2: Configure Vite 8 + Tailwind v4 plugin**

```js
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({ input: ['resources/css/app.css', 'resources/js/app.js'], refresh: true }),
        tailwindcss(),
    ],
});
```

- [ ] **Step 3: Seed the design-system `@theme` tokens (Tailwind v4, OKLCH)**

```css
/* resources/css/app.css */
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

  --color-bg: oklch(0.99 0.005 250);
  --color-surface: oklch(1 0 0);
  --color-text: oklch(0.22 0.02 250);
  --color-text-muted: oklch(0.55 0.02 250);
  --color-border: oklch(0.92 0.01 250);
  --color-primary: oklch(0.55 0.13 200);
  --color-primary-fg: oklch(0.99 0 0);

  --text-base: 1rem;        /* 16px — public body + all inputs (prevents iOS zoom) */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

:root { color-scheme: light; }
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
```

- [ ] **Step 4: Minimal JS entry (Livewire owns Alpine in CSP-safe mode)**

```js
// resources/js/app.js
// Public SSR pages must NOT import this bundle. Livewire (loaded only on the
// authenticated surface from Plan 12) injects Alpine's CSP build via csp_safe.
import './bootstrap';
```

- [ ] **Step 5: Base public layout — `lang="id"`, no inline script**

```blade
{{-- resources/views/layouts/public.blade.php --}}
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>@yield('title', 'VenuePro')</title>
    @vite('resources/css/app.css')
</head>
<body>
    <main>@yield('content')</main>
</body>
</html>
```

```blade
{{-- resources/views/welcome.blade.php (replace Laravel's default) --}}
@extends('layouts.public')
@section('title', 'VenuePro — booking lapangan padel & tennis')
@section('content')
    <h1>VenuePro</h1>
    <p>Booking lapangan padel &amp; tennis di Jakarta.</p>
@endsection
```

- [ ] **Step 6: Write the failing frontend test**

```php
<?php
// tests/Feature/FrontendBuildTest.php
it('renders the SSR landing in Bahasa with no inline script and no public JS bundle', function () {
    $html = $this->get('/')->assertOk()->getContent();
    expect($html)->toContain('<html lang="id">');
    expect($html)->not->toContain('<script>');          // no inline script on public route
    expect($html)->not->toContain('resources/js/app.js'); // Livewire/Alpine bundle absent on public SSR
});

it('compiled the design-system tokens into the built CSS', function () {
    $manifest = public_path('build/manifest.json');
    expect(file_exists($manifest))->toBeTrue();
    $css = collect(json_decode(file_get_contents($manifest), true))
        ->firstWhere(fn ($e) => str_ends_with($e['src'] ?? '', 'app.css'));
    $built = public_path('build/'.$css['file']);
    expect(file_get_contents($built))->toContain('--color-primary');
})->skip(fn () => ! file_exists(public_path('build/manifest.json')), 'run `npm run build` first');
```

- [ ] **Step 7: Build and run the test**

Run: `npm run build && ./vendor/bin/pest --filter=FrontendBuildTest`
Expected: PASS (landing is Bahasa, no inline/public JS; built CSS carries `--color-primary`).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat(foundation): Vite 8 + Tailwind v4 @theme + Livewire 4 (csp_safe) + base layout"
```

---

## Task 5: Security headers + allowlist CSP middleware

**Files:**
- Create: `config/csp.php`
- Create: `app/Http/Middleware/SecurityHeaders.php`
- Modify: `bootstrap/app.php` (register middleware globally)
- Create: `tests/Feature/SecurityHeadersTest.php`

**Interfaces:**
- Consumes: booting app (Task 1), base layout (Task 4)
- Produces: `config('csp')` allowlist + `SecurityHeaders` middleware emitting the CSP — the single place later plans add named external origins (e.g. Xendit in Plan 06)

- [ ] **Step 1: Create the CSP allowlist (single source of truth)**

```php
<?php
// config/csp.php  — self-host by default; add named external origins here with a reason.
return [
    // script-src is the hard line: no 'unsafe-inline', no 'unsafe-eval', ever.
    'script-src' => ["'self'", "'strict-dynamic'"],
    'style-src'  => ["'self'"],
    'img-src'    => ["'self'", 'data:'],
    'font-src'   => ["'self'"],
    'connect-src'=> ["'self'"],   // + https://*.xendit.co in Plan 06
    'frame-ancestors' => ["'none'"],
    'base-uri'   => ["'self'"],
    'form-action'=> ["'self'"],
    'object-src' => ["'none'"],
];
```

- [ ] **Step 2: Write the failing security-headers test**

```php
<?php
// tests/Feature/SecurityHeadersTest.php
it('sends a strict allowlist CSP with no unsafe directives', function () {
    $res = $this->get('/');
    $csp = $res->headers->get('Content-Security-Policy');
    expect($csp)->not->toBeNull();
    expect($csp)->toContain("script-src 'self'");
    expect($csp)->not->toContain('unsafe-inline');
    expect($csp)->not->toContain('unsafe-eval');
    expect($csp)->toContain("object-src 'none'");
    expect($csp)->toContain("frame-ancestors 'none'");
});

it('sends the baseline security headers', function () {
    $res = $this->get('/');
    expect($res->headers->get('X-Content-Type-Options'))->toBe('nosniff');
    expect($res->headers->get('Referrer-Policy'))->toBe('strict-origin-when-cross-origin');
    expect($res->headers->get('Permissions-Policy'))->toContain('geolocation=(self)');
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `./vendor/bin/pest --filter=SecurityHeadersTest`
Expected: FAIL — no CSP/security headers yet.

- [ ] **Step 4: Implement the middleware**

```php
<?php
// app/Http/Middleware/SecurityHeaders.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $directives = collect(config('csp'))
            ->map(fn (array $sources, string $name) => $name.' '.implode(' ', $sources))
            ->push("upgrade-insecure-requests")
            ->implode('; ');

        $response->headers->set('Content-Security-Policy', $directives);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(self), camera=(), microphone=()');
        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        }

        return $response;
    }
}
```

- [ ] **Step 5: Register it globally**

In `bootstrap/app.php`, inside `->withMiddleware(function (Middleware $middleware) { ... })`:

```php
$middleware->append(\App\Http\Middleware\SecurityHeaders::class);
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `./vendor/bin/pest --filter=SecurityHeadersTest`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(foundation): allowlist CSP + security-header middleware"
```

---

## Task 6: CI pipeline (Pest + Pint + PHPStan + build) + Lighthouse/budget stubs

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `phpstan.neon`, `pint.json`
- Create: `.lighthouserc.cjs`, `budgets.json` (stubs; enforced in Plan 14)
- Modify: `composer.json` (require larastan dev)

**Interfaces:**
- Consumes: all prior tasks (the CI runs their tests)
- Produces: a green pipeline gating every later plan's merges

- [ ] **Step 1: Install Larastan + Pint config**

```bash
composer require larastan/larastan:^3.0 --dev --no-interaction
```

```neon
# phpstan.neon
includes:
    - vendor/larastan/larastan/extension.neon
parameters:
    level: 6
    paths: [app, database, config]
```

```json
// pint.json
{ "preset": "laravel" }
```

- [ ] **Step 2: Lighthouse + budget stubs (not enforced yet)**

```js
// .lighthouserc.cjs — Plan 14 tightens assertions to >=0.99 per route
module.exports = {
  ci: {
    collect: { url: ['http://127.0.0.1:8000/'], numberOfRuns: 1, settings: { preset: 'desktop' } },
    assert: { assertions: { 'categories:performance': ['warn', { minScore: 0.9 }] } },
  },
};
```

```json
// budgets.json — Plan 14 enforces; here it documents the targets
[{ "path": "/*", "resourceSizes": [
  { "resourceType": "script", "budget": 30 },
  { "resourceType": "total", "budget": 300 }
] }]
```

- [ ] **Step 3: Write the CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI
on: { push: {}, pull_request: {} }
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgis/postgis:18-3.6
        env: { POSTGRES_USER: venuepro, POSTGRES_PASSWORD: secret, POSTGRES_DB: venuepro_testing }
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U venuepro" --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:8.8
        ports: ['6379:6379']
        options: --health-cmd "redis-cli ping" --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.4', extensions: 'redis, pdo_pgsql', coverage: none }
      - uses: actions/setup-node@v4
        with: { node-version: '24' }
      - run: composer install --no-interaction --prefer-dist
      - run: cp .env.example .env && php artisan key:generate
        env: { DB_DATABASE: venuepro_testing, DB_USERNAME: venuepro, DB_PASSWORD: secret, REDIS_PASSWORD: '' }
      - run: npm ci && npm run build
      - run: ./vendor/bin/pint --test
      - run: ./vendor/bin/phpstan analyse --no-progress
      - run: php artisan migrate --force && ./vendor/bin/pest
        env: { DB_DATABASE: venuepro_testing, DB_USERNAME: venuepro, DB_PASSWORD: secret, REDIS_PASSWORD: '' }
```

- [ ] **Step 4: Verify the pipeline locally (same commands CI runs)**

Run: `./vendor/bin/pint --test && ./vendor/bin/phpstan analyse --no-progress && npm run build && ./vendor/bin/pest`
Expected: all four green. Fix any Pint/PHPStan findings before committing.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "ci(foundation): Pest + Pint + PHPStan + build pipeline; Lighthouse/budget stubs"
```

---

## Task 7: Health check + plan ship ritual

**Files:**
- Create: `tests/Feature/HealthCheckTest.php`
- Modify: `docs/superpowers/session-log.md`, `docs/superpowers/memory/venuepro-project.md`

**Interfaces:**
- Consumes: all prior tasks
- Produces: a verified `/up` health endpoint; the foundation is "done"

- [ ] **Step 1: Write the failing health test**

```php
<?php
// tests/Feature/HealthCheckTest.php
it('exposes the framework health endpoint', function () {
    $this->get('/up')->assertOk();
});
```

- [ ] **Step 2: Run it**

Run: `./vendor/bin/pest --filter=HealthCheckTest`
Expected: PASS (Laravel 13 ships the `/up` health route by default). If the route was removed during scaffolding, re-add it via `->withRouting(health: '/up')` in `bootstrap/app.php`.

- [ ] **Step 3: Full suite green**

Run: `./vendor/bin/pest`
Expected: all Feature tests pass (Boot, DatabaseExtensions, RedisCache, FrontendBuild, SecurityHeaders, HealthCheck).

- [ ] **Step 4: Run the plan ship ritual**

```bash
./scripts/reindex.sh
```

Append to `docs/superpowers/session-log.md` under today: "Plan 01 (Foundation) shipped — Laravel 13 + PG18/PostGIS/btree_gist + Redis 8.8 + Vite8/Tailwind v4/Livewire 4 csp_safe + allowlist CSP + CI green." No `competitive-backlog.md` rows flip yet (foundation is infrastructure).

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(foundation): health check + Plan 01 ship ritual"
```

---

## Self-Review (run before handoff)

**Spec coverage (Plan 01 scope = spec §4 Architecture + §4.1 stack + §10 Repo & Setup):**
- Laravel 13 / PHP 8.4 → Task 1 ✓ · PostgreSQL 18 + PostGIS + btree_gist → Task 2 ✓ · Redis 8.8 → Task 3 ✓ · Vite 8 + Tailwind v4 `@theme` + Livewire 4 csp_safe + base SSR layout → Task 4 ✓ · allowlist CSP + security headers (§7.4) → Task 5 ✓ · CI + Lighthouse/budget stubs (§7.1/§9) → Task 6 ✓ · health check (§11) → Task 7 ✓.
- Deferred to later plans (correctly out of Plan 01): all domain tables (Plans 02–10), public SEO pages (11), dashboard shell (12), full Lighthouse-99 enforcement + SW + manifest + Sanctum (14).

**Placeholder scan:** no TBD/TODO; every code/config step shows full content. ✓

**Type/name consistency:** `config('csp')` keys (Task 1/5) match the middleware reader; `resources/views/layouts/public.blade.php` (Task 4) is the named base layout later plans `@extends`; `.env` keys consistent across Tasks 2/3/6. ✓
