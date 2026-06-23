# KLAY — Padel Club Website — Design Spec

**Date:** 2026-06-23
**Status:** Draft for approval
**Type:** Award-grade showcase frontend (no real backend; mock + localStorage, backend-ready data layer)

---

## 1. Overview

A cinematic, single-page-immersive marketing + booking experience for **KLAY**, a premium padel club. The site must read as a *designed object* — not a template — at the level of an award-winning portfolio piece (Awwwards / FWA caliber). It ships three functional product surfaces on top of the showcase: **court booking**, **member registration (daftar)**, and **coach profiling**.

### Goals
- Distinctive, intentional visual identity ("Earthy Premium Sport") that does not look templated.
- Signature scroll storytelling with a recurring **hero object** (padel racket/ball) that travels across sections.
- Fully working *feeling* booking, registration, and coach-discovery flows backed by mock data + localStorage.
- Bilingual ID/EN with an in-page toggle.
- Excellent on mobile and tablet; touch-first booking grid.
- Performance + accessibility good enough to survive an award jury (Lighthouse ≥ 90 across the board, respects reduced-motion, keyboard-navigable).

### Non-Goals (YAGNI)
- No real server, database, auth, or payments. Data persists only in localStorage.
- No CMS. Content lives in typed TS dictionaries.
- No email/SMS sending. Form submits resolve via a mock API with simulated latency.

---

## 2. Brand

- **Name:** KLAY (wordmark, all-caps, tight tracking).
- **Positioning:** Not a "sports facility" — a *premium clubhouse* built around the golden-hour ritual of padel.
- **Voice:** Confident, warm, a little editorial. Short lines. Bilingual.
- **Tagline:** ID — *"Tanah lapang, jiwa juara."* · EN — *"Grounded. Relentless."*

---

## 3. Design System — "Earthy Premium Sport"

### 3.1 Color tokens
| Token | Hex | Use |
|---|---|---|
| `sand` | `#F2EBDD` | Primary light background |
| `bone` | `#E8DECF` | Secondary surfaces / cards |
| `clay` | `#C8654A` | Primary brand accent (terracotta) |
| `clay-deep` | `#A04B33` | Hover / pressed clay |
| `olive` | `#2F3A2C` | Deep turf green, dark sections |
| `espresso` | `#1E1915` | Near-black text / darkest sections |
| `lime` | `#C7F04A` | "Court Lime" — energy accent, CTAs & live status (used sparingly) |
| `muted` | `#7A7163` | Secondary text on light |

Texture layer: subtle film **grain/noise** overlay (SVG/feTurbulence, ~3–5% opacity) on hero + dark sections for an analog, expensive feel.

### 3.2 Typography
- **Display:** Fraunces (high-contrast serif, optical sizing) — headlines, hero.
- **Body/UI:** Geist Sans (fallback Inter) — paragraphs, buttons, nav.
- **Mono/labels:** Geist Mono (fallback JetBrains Mono) — small caps labels, times, prices, scores, section indices ("01 — Courts").
- Type scale: fluid `clamp()` based; hero display up to ~12vw, generous line-height control, tight tracking on display.

### 3.3 Motion language
- Smooth scroll via **Lenis**.
- Scroll-driven reveals & pinning via **GSAP ScrollTrigger**; component micro-interactions via **Framer Motion**.
- Easing: slow, weighted (custom cubic-bezier ~ `[0.16, 1, 0.3, 1]`). Word-by-word headline reveals. Parallax in layers.
- **Hard rule:** every animation gated behind `prefers-reduced-motion`; reduced-motion users get instant, non-jarring states.

### 3.4 Layout primitives
- Asymmetric editorial grid (12-col with intentional off-grid moments).
- Generous negative space on light sections; dense, cinematic dark sections.
- Section index labels (mono) + oversized section titles (serif).

---

## 4. Section Architecture (single-page + routed sub-surfaces)

Main page = immersive scroll. Booking, coach detail, and registration are routed/overlay surfaces so they can deep-link.

1. **Nav** — transparent over hero → solid (sand/blur) on scroll. Logo, anchor links, **ID/EN toggle**, sticky **Book** CTA. Mobile: full-screen overlay menu with staggered reveal.
2. **Hero** — golden-hour court image, layered parallax, word-by-word headline reveal, **hero object** (racket/ball) introduced here. Scroll cue. A compact "today's availability" peek that links to Booking.
3. **Manifesto** — large editorial statement; line-by-line scroll reveal; the hero object continues its scroll-linked journey here.
4. **Stats band** — animated counters (courts, members, hours played, tournaments). Mono numerals.
5. **Courts** — horizontal/pinned scroll of court cards: indoor/outdoor, surface, panoramic glass, price/hour, "Book this court".
6. **Booking** — interactive widget (see §5.1).
7. **Coaches** — filterable coach grid (see §5.2).
8. **Membership / Pricing** — tiers with monthly/annual toggle; recommended tier highlighted in lime.
9. **Daftar / Registration** — multi-step member signup (see §5.3).
10. **Gallery / Experience** — parallax masonry + lightbox.
11. **Testimonials** — slider/marquee of member quotes.
12. **Location & Hours + Footer** — map embed/static map, opening hours (mono), newsletter input, socials, big KLAY wordmark.

### Signature scroll moments
- Hero object (racket→ball) is a sticky, scroll-position-linked element that translates/rotates/scales across Hero → Manifesto → Stats.
- Courts section pins and scrolls horizontally on desktop; stacks/swipes on touch.
- Marquee strip ("PADEL • KLAY • GOLDEN HOUR • …") between dark/light section transitions.
- Numbers count up when the Stats band enters viewport.

---

## 5. Key Flows

### 5.1 Booking (mock + localStorage)
Layout decision: **one elegant booking panel** where steps reveal progressively inline (not separate pages); on mobile it compacts into a vertical wizard. Steps:
1. **Choose court** — from mock courts.
2. **Choose date** — date picker (next 14 days).
3. **Choose time slot** — grid of hourly slots with states: `available`, `booked`, `selected`, `live` (current hour). Touch-friendly tap targets (≥44px).
4. **Summary** — court, date, time, duration, price; optional add coach.
5. **Confirm** — validated via zod; on submit, mock API simulates latency, writes booking to localStorage, shows success state + confirmation code.
- Slot availability is generated deterministically from mock data (so it looks real and consistent), merged with any localStorage bookings (so a booked slot stays booked on reload).
- Deep-linkable: `/book?court=...&date=...`.

### 5.2 Coach profiling
- Grid of coaches; filter by specialty (e.g., Technique, Strategy, Junior, Fitness) and level (Beginner→Pro).
- Card: portrait, name, specialties (chips), rating, years, languages, hover reveal.
- **Detail** (dedicated route `/coaches/[slug]` for deep-linking): bio, certifications, stats, weekly availability, gallery, and **"Book this coach"** → prefills Booking with coach attached.

### 5.3 Registration (daftar) — multi-step
Steps: (1) Account basics, (2) Padel profile (level, goals, preferred times), (3) Membership tier, (4) Review & submit.
- Per-step validation (react-hook-form + zod), progress indicator, smooth step transitions, persists draft to localStorage, success screen with member ID. Mock only.

---

## 6. Mock Data Model (typed)

```ts
type Court = { id; name; type: 'indoor'|'outdoor'; surface; pricePerHour; features[]; image }
type Coach = { slug; name; portrait; specialties[]; level; rating; years; languages[]; bio; certifications[]; availability }
type Slot  = { hour; state: 'available'|'booked'|'live' }
type Booking = { id; courtId; date; hour; coachSlug?; name; phone; createdAt }   // localStorage
type MembershipTier = { id; name; priceMonthly; priceAnnual; perks[]; recommended? }
type Member = { id; name; email; level; tierId; createdAt }                       // localStorage
```

A thin **mock API layer** (`lib/api/*`) wraps all reads/writes with `async` + simulated latency, so a real backend can later replace internals without touching UI.

---

## 7. Tech Architecture

- **Next.js (App Router) + TypeScript + Tailwind CSS.**
- **Framer Motion** (component animation) + **GSAP/ScrollTrigger** (scroll) + **Lenis** (smooth scroll).
- **i18n:** lightweight typed dictionary + React context `useLang()` + `t()` helper; ID default, EN toggle; persisted to localStorage.
- **Forms:** react-hook-form + zod.
- **Fonts:** next/font (Fraunces, Geist Sans, Geist Mono).
- **Icons:** lucide-react. **Images:** next/image (curated padel photography placeholders).
- **State:** React context for lang + booking draft; localStorage persistence.

### Proposed file structure
```
app/            # routes: / , /book , /coaches/[slug] , /daftar
components/      # nav, hero, sections/*, booking/*, coaches/*, registration/*, ui/*
lib/            # api/ (mock), i18n/, data/ (mock content), motion/ (gsap+lenis setup), utils
public/         # images, grain svg, og
styles/         # tailwind globals, tokens
```

---

## 8. Responsive / A11y / Performance Requirements

- **Breakpoints:** mobile-first; tablet (md) and desktop (lg/xl) refinements. Horizontal-scroll Courts degrades to swipe stack on touch.
- **Touch targets** ≥ 44px (booking grid especially).
- **A11y:** semantic landmarks, labelled controls, visible focus rings, color-contrast AA on text, ARIA for tabs/dialogs/wizard, full keyboard nav, `prefers-reduced-motion` honored everywhere.
- **Performance:** Lighthouse ≥ 90 (Perf/A11y/Best/SEO) on mobile; lazy-load below-the-fold; optimized images; no layout shift.

---

## 9. "Loop Engineering Antar Agent" — Build Methodology

Executed via the Workflow tool (ultracode) as iterative loops:

- **Loop A — Design exploration:** parallel agents propose hero + section visual variants within the locked design system; a judge panel scores against award criteria; synthesize the winner.
- **Loop B — Build pipeline:** per-component build → self-review → fix (worktree isolation where agents touch files in parallel).
- **Loop C — Visual polish until pass:** design-critic agents review *real browser screenshots* (desktop/tablet/mobile) against an award rubric (typography, spacing, hierarchy, motion quality, responsiveness, a11y); emit a fix list; fix agents apply; re-screenshot; **repeat until critics pass or N rounds**.
- **Loop D — QA:** responsive sweep + Lighthouse + a11y checks; log any silent caps.

### Award rubric (used by critics)
Typographic craft · spacing rhythm · visual hierarchy · originality (non-template) · motion taste · responsive integrity · accessibility · performance · content polish (bilingual copy quality).

---

## 10. Success Criteria
- Looks award-worthy on first scroll (subjective, enforced via Loop C rubric ≥ agreed threshold).
- Booking, registration, and coach flows are fully operable end-to-end with mock data and survive reload.
- Bilingual toggle swaps all visible copy.
- Lighthouse ≥ 90 mobile; reduced-motion path verified; keyboard-navigable.
- No console errors; no layout shift on load.
