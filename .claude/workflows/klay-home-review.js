export const meta = {
  name: 'klay-home-review',
  description: 'Review KLAY homepage via 4 ordered design skills (UI/UX Pro Max → Huashu → Impeccable+Taste → Playwright) then synthesize a prioritized punch-list',
  phases: [
    { title: 'UIUX', detail: 'ui-ux-pro-max skill review' },
    { title: 'Huashu', detail: 'huashu-design 5-dimension review' },
    { title: 'Taste', detail: 'impeccable + taste-skill critique' },
    { title: 'Playwright', detail: 'live responsive + interaction + console QA' },
    { title: 'Synthesis', detail: 'merge, dedupe, prioritize' },
  ],
}

const URL = 'http://localhost:8910';
const SHOTS = {
  desktop: '/Volumes/data/padel/review/site-desktop4.png',
  tablet: '/Volumes/data/padel/review/site-tablet4.png',
  mobile: '/Volumes/data/padel/review/site-mobile4.png',
};
const SK = '/Volumes/data/padel/.claude/skills';

const BRIEF = `
PRODUCT: "KLAY" — award-aspiring marketing + booking site for a premium padel club in Jakarta.
PLATFORM (IMPORTANT): this is now a LIGHTWEIGHT STATIC HTML PWA (no React) — vanilla HTML/CSS/JS, installable, offline via service worker. The client deliberately wants it light & fast.
DIRECTION (locked): "Clean Court" — WHITE-dominant, GREEN-accented, generous whitespace, minimalist, editorial. Real photography. Bilingual ID/EN.
Tokens: paper #FFFFFF, mist #F4F7F4, line #E4EBE5, forest #0E3B2A, green #1C7C54, lime #C6F24E (sparing accent), ink #16241D, muted #54635A.
Type: Fraunces (display) · Inter (body, BOLD nav links & buttons at weight 700) · JetBrains Mono (labels). Signature motif: a lime "court-line" delimiter + full-bleed "seam" rulings (no numbered eyebrows).
DELIBERATE CHOICES (do NOT flag as missing): nav menu & buttons use a BOLD heavier font weight by request; SCROLL EFFECTS ARE INTENTIONALLY OFF (no smooth-scroll, parallax, or scroll-reveal) — content is visible immediately for speed/lightness. Judge it as a fast static PWA, not a motion showcase.
Sections: Nav · Hero · Marquee · Manifesto(+3 pillars) · Stats(green band) · Courts(horizontal rail w/ arrows) · FieldBreak(full-bleed photo) · Booking(interactive, labelled, a11y slots) · Coaches(grid+filter+modal) · Membership(monthly/annual toggle) · Daftar(multi-step wizard) · Gallery(accessible lightbox) · Testimonials(editorial) · Footer(green). Court-line "seam" dividers between lower sections.
GOAL: genuinely award-grade (Awwwards/FWA) for a fast static PWA, distinctive, NOT templated. Lime is an accent only.
`;

const SHOTS_NOTE = `
Full-page screenshots (Read these absolute PNG paths to SEE the current build):
- Desktop 1440w: ${SHOTS.desktop}
- Tablet 834w:   ${SHOTS.tablet}
- Mobile 390w:   ${SHOTS.mobile}
Read desktop + mobile at minimum. Tie each finding to a section + viewport.
`;

// Lenient schema — plain strings, no additionalProperties:false, minimal required.
const FINDING = {
  type: 'object',
  properties: {
    area: { type: 'string' },
    viewport: { type: 'string', description: 'all | desktop | tablet | mobile' },
    severity: { type: 'string', description: 'P0 | P1 | P2' },
    title: { type: 'string' },
    problem: { type: 'string' },
    fix: { type: 'string' },
  },
  required: ['area', 'severity', 'title', 'fix'],
};
const STAGE_SCHEMA = {
  type: 'object',
  properties: {
    lens: { type: 'string' },
    score: { type: 'number' },
    summary: { type: 'string' },
    findings: { type: 'array', items: FINDING },
  },
  required: ['lens', 'score', 'summary', 'findings'],
};

const CONcise = 'Return AT MOST 8 findings. Keep summary ≤120 words and each problem/fix to 1-2 sentences. Output only the schema object.';

async function safe(fn) {
  try { return await fn(); } catch (e) { log('stage failed: ' + (e && e.message ? e.message : e)); return null; }
}
function digest(s) {
  if (!s) return '(stage unavailable)';
  return `${s.lens} (${s.score}/10): ${s.summary}\n` +
    (s.findings || []).map((f) => `- [${f.severity}] ${f.area}: ${f.title}`).join('\n');
}

// ---- 1. UI/UX Pro Max -------------------------------------------------------
phase('UIUX');
const uiux = await safe(() => agent(
  `Review the KLAY homepage using the **UI/UX Pro Max** skill. Load it: invoke Skill "padel:ui-ux-pro-max" and/or Read ${SK}/ui-ux-pro-max/SKILL.md; apply its UX guidelines in REVIEW mode.\n${BRIEF}\n${SHOTS_NOTE}\n` +
  `Audit usability, hierarchy, IA, affordances (booking grid/filters/toggles/CTAs), form UX, microcopy, accessibility (contrast, target size, focus, alt), mobile ergonomics. Award bar. ${CONcise}`,
  { label: 'lens:ui-ux-pro-max', phase: 'UIUX', schema: STAGE_SCHEMA },
));

// ---- 2. Huashu Design -------------------------------------------------------
phase('Huashu');
const huashu = await safe(() => agent(
  `Review the KLAY homepage using the **Huashu Design (花叔)** skill + its 5-dimension review. Load it: invoke Skill "padel:huashu-design" and/or Read ${SK}/huashu-design/SKILL.md and ${SK}/huashu-design/references/critique-guide.md.\n${BRIEF}\n${SHOTS_NOTE}\n` +
  `Prior UI/UX findings:\n${digest(uiux)}\n\nJudge across the 5 dimensions; focus on spacing rhythm, optical alignment, color discipline, type scale, photo art-direction, section transitions, anti-AI-slop. ${CONcise}`,
  { label: 'lens:huashu-design', phase: 'Huashu', schema: STAGE_SCHEMA },
));

// ---- 3. Impeccable + Taste --------------------------------------------------
phase('Taste');
const taste = await safe(() => agent(
  `Review the KLAY homepage using **Impeccable** + **Taste**. Load: invoke Skill "impeccable"; Read ${SK}/impeccable/reference/critique.md and ${SK}/impeccable/reference/audit.md; Read ${SK}/taste-skill/SKILL.md.\n${BRIEF}\n${SHOTS_NOTE}\n` +
  `Prior findings:\n${digest(uiux)}\n${digest(huashu)}\n\nDecide: is there ONE memorable signature, or pleasant-but-forgettable? Any remaining AI-default/templated reads? Apply Chanel's "remove one accessory". Name the single highest-leverage move to reach award-grade. ${CONcise}`,
  { label: 'lens:impeccable-taste', phase: 'Taste', schema: STAGE_SCHEMA },
));

// ---- 4. Playwright live QA --------------------------------------------------
phase('Playwright');
const pw = await safe(() => agent(
  `QA engineer. KLAY dev site is LIVE at ${URL}. Load Playwright tools via ToolSearch query "select:mcp__plugin_playwright_playwright__browser_navigate,mcp__plugin_playwright_playwright__browser_resize,mcp__plugin_playwright_playwright__browser_take_screenshot,mcp__plugin_playwright_playwright__browser_click,mcp__plugin_playwright_playwright__browser_console_messages,mcp__plugin_playwright_playwright__browser_evaluate" then use them.\n${BRIEF}\n` +
  `Test: (1) navigate ${URL}; (2) console_messages → errors/warnings; (3) resize 1440/834/390 → check no horizontal overflow (compare scrollWidth vs clientWidth via browser_evaluate), no overlap; (4) interactions: ID/EN toggle, booking select+Confirm (expect code), coach filter, membership toggle, gallery lightbox + Escape; (5) broken images / low contrast. Report reproducible findings. ${CONcise} If a tool is unavailable, say so in summary and score what you can.`,
  { label: 'lens:playwright', phase: 'Playwright', schema: STAGE_SCHEMA },
));

// ---- 5. Synthesis -----------------------------------------------------------
phase('Synthesis');
const all = [uiux, huashu, taste, pw].filter(Boolean);
const synthesis = await safe(() => agent(
  `Design lead consolidating a multi-lens review of the KLAY homepage into ONE prioritized punch-list.\n${BRIEF}\n\nFindings (JSON):\n${JSON.stringify(all)}\n\n` +
  `Merge duplicates, prioritize (P0 first). Give overall verdict (2-3 sentences), per-lens scores, overall /10, deduped prioritized findings, and the single highest-impact next change. ${CONcise}`,
  {
    label: 'synthesis', phase: 'Synthesis', effort: 'high',
    schema: {
      type: 'object',
      properties: {
        verdict: { type: 'string' },
        scores: {
          type: 'object',
          properties: { uiux: { type: 'number' }, huashu: { type: 'number' }, taste: { type: 'number' }, playwright: { type: 'number' }, overall: { type: 'number' } },
          required: ['overall'],
        },
        highestImpact: { type: 'string' },
        findings: { type: 'array', items: FINDING },
      },
      required: ['verdict', 'scores', 'highestImpact', 'findings'],
    },
  },
));

return { stages: { uiux, huashu, taste, playwright: pw }, synthesis };
