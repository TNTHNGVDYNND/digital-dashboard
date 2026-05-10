# Styling Refactor — Product Requirements Document

## Problem Statement

`src/app/globals.css` currently contains only:

```css
@import 'tailwindcss';
```

This means the product has no centralized design tokens, no explicit theme model, no responsive architecture beyond ad-hoc utility usage, and no global dark-mode contract. Styling decisions are currently distributed across components as hardcoded classes.

### Current Impact

1. **Inconsistent visual language**: color/spacing/typography decisions are repeated and drift over time.
2. **Slow UI development**: every component change re-decides foundational styling.
3. **Dark-mode fragility**: no system-level token strategy; dark styling is manual and uneven.
4. **Refactor risk**: GSAP and Three.js experiences can regress when class-level overrides are changed in isolation.
5. **Poor scalability**: no semantic token contract for future features.

## Solution Overview

Implement a full Tailwind v4 design system in `globals.css` using `@theme`, then migrate component styling to semantic tokens while preserving behavior on core pages and animation/3D integration.

### End State

- `globals.css` defines semantic tokens via `@theme` for:
  - colors
  - typography
  - spacing
  - breakpoints
  - radii/shadows (as needed)
- Dark mode works by default using `prefers-color-scheme` and can be explicitly overridden with `data-theme="dark"`.
- Components consume semantic token-backed classes/utilities rather than literal, one-off values.
- Existing conventions from `DESIGN.md` are preserved (indigo primary, red danger, rounded-2xl, dark variants, backdrop blur).
- GSAP ScrollTrigger and Three.js/R3F layers remain stable (no z-index/canvas regressions, no animation breakage).
- Verification evidence is recorded for each wave in `.sisyphus/evidence/styling-refactor/`.

## User Stories (Grouped by Vertical Slice)

## SF-001 — @theme Foundation

1. **As a frontend developer, I want semantic theme tokens in `globals.css`, so that components share one design contract.**
   - Test: `globals.css` includes complete `@theme` tokens for color, spacing, typography, and breakpoints.

2. **As a product team member, I want semantic tokens (primary/surface/text/etc.) instead of literal color classes, so that we can change branding with minimal churn.**
   - Test: migrated components reference semantic classes or CSS vars, not arbitrary literals for core UI intent.

## SF-002 — Responsive Architecture

3. **As a mobile user, I want predictable responsive layouts across pages, so that UI remains readable and usable across viewport sizes.**
   - Test: breakpoint strategy (`sm/md/lg/xl/2xl`) is defined and applied to key containers and component layouts.

4. **As a developer, I want a documented responsive rule set, so that new components follow the same layout behavior.**
   - Test: PRD and implementation include explicit breakpoint intent and anti-patterns.

## SF-003 — Dark Mode

5. **As a user, I want the app to follow my OS color preference, so that dark mode works automatically.**
   - Test: when OS is dark, app renders dark theme without manual action.

6. **As a user, I want a manual override via `data-theme`, so that I can choose dark mode independent of OS setting.**
   - Test: setting `data-theme="dark"` forces dark theme even if OS is light.

7. **As a user, I want no flash of wrong theme on load, so that theme transitions feel stable.**
   - Test: initial paint uses resolved theme without light/dark flicker.

## SF-004 — Component Migration

8. **As a developer, I want a safe migration order, so that low-risk components are converted first before complex animated surfaces.**
   - Test: migration sequence starts with shared UI primitives and static components, then proceeds to dashboard/campaign/animated sections.

9. **As a stakeholder, I want core page visuals preserved during migration, so that refactor does not degrade UX.**
   - Test: home, dashboard, campaigns, contact, faq show no visual regression after migration.

## SF-005 — GSAP/Three.js Integration

10. **As an end user, I want existing GSAP animations to remain smooth, so that the polished motion experience is preserved.**
    - Test: ScrollTrigger timelines fire correctly; no timing/layout break from token migration.

11. **As an end user, I want Three.js hero/canvas rendering unaffected, so that 3D visuals remain functional and layered correctly.**
    - Test: canvas renders as before with correct z-index stacking and no color bleed from global styles.

## SF-006 — Regression Verification

12. **As the delivery team, I want repeatable verification gates, so that refactor quality is measurable and auditable.**
    - Test: build passes, visual checks complete, and evidence artifacts are written per wave.

## Design Requirements

### Source of Truth and Existing Conventions

- Reference: `/home/vladi/developer/digital-dashboard/DESIGN.md`
- Must preserve:
  - Primary action language: **indigo-600 family**
  - Danger action language: **red-600 family**
  - Shape language: **rounded-2xl**
  - Dark mode class conventions (`dark:`)
  - Backdrop patterns (`backdrop-blur` for overlays)

### Color System (Light + Dark)

Define semantic token families and map them to scale values; avoid hardcoded literal usage in component intent.

Required semantic groups:

- `primary` (indigo-based, e.g. 50–900 with action defaults around 600/700)
- `surface` (base backgrounds/cards/elevated surfaces)
- `text` (primary/secondary/muted/inverse)
- `accent` (supporting highlight color family)
- `success`
- `warning`
- `danger` (red family)

Example naming direction:

- `--color-primary-500`, `--color-surface-100`, `--color-text-900`, etc.
- semantic aliases for intent (e.g. `--color-bg-default`, `--color-fg-muted`, `--color-border-subtle`) may be layered on top.

### Spacing Scale

- Extend beyond default utility spacing for dashboard density and campaign builder rhythm.
- Include intermediate spacing tokens used repeatedly in UI shells and controls.
- Keep spacing contract monotonic and documented (no ad-hoc one-offs in components).

### Typography

Define tokenized typography for:

- Font families (sans/display/mono as needed)
- Sizes (body, label, heading tiers)
- Weights
- Line heights

Requirement: text styles for cards, modals, form labels, and section headings are standardized and reusable.

### Responsive Breakpoints Strategy

Use explicit `sm/md/lg/xl/2xl` strategy aligned to existing layout behavior:

- `sm`: baseline mobile improvements
- `md`: tablet stacking → split layouts
- `lg`: desktop default two-column patterns
- `xl/2xl`: wide dashboard and hero spacing refinements

Document intended layout transitions per page shell and core component clusters.

### Dark Mode Strategy

**Canonical contract** (precedence, highest to lowest):
1. **Explicit override**: `:root[data-theme="dark"]` or `:root[data-theme="light"]` wins unconditionally.
2. **OS default**: `@media (prefers-color-scheme: dark)` applied when no `data-theme` attribute is present.
3. **Light fallback**: Default tokens are the light-theme values.

**Implementation path**:
- All semantic tokens are defined as CSS custom properties (`--color-*`) inside `@theme`.
- Light values are the defaults; dark values are applied via `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`.
- The `dark:` utility variant is **restricted** to edge cases only (e.g., third-party component overrides). All first-party components must use semantic tokens.
- A small inline `<script>` in `src/app/layout.tsx` (or a dedicated `ThemeProvider`) reads `localStorage` + `prefers-color-scheme` and sets `data-theme` on `:root` before the first paint. This prevents flash of wrong theme (FOUT).

**No-flash verification protocol**:
- Test: Load page with OS dark mode enabled + clear cache. First paint must show dark theme (no light frame visible).
- Test: Load page with `localStorage.theme = "dark"` while OS is light. First paint must show dark theme.
- Measurement: Use browser DevTools Performance panel → Screenshots. Verify no intermediate light frame at timestamp 0.
- Pass criterion: Zero incorrect-theme frames in first 2 render passes.

### Component Anti-Patterns to Avoid

- Literal color utilities for semantic intent in migrated components.
- Mixing independent ad-hoc dark-mode logic per component.
- Inline `style` color values where tokenized utility/var should be used.
- Breaking `rounded-2xl` and existing modal/card shape consistency.
- Introducing utility collisions that disrupt GSAP transforms or Three.js layering.

## Implementation Decisions

### Module Boundaries

| Module | Interface (small) | Hides (large) |
|---|---|---|
| `src/app/globals.css` | Theme token contract (`@theme`, dark-mode overrides, base layer vars) | Raw palette mappings, token indirection, normalization logic |
| `src/app/layout.tsx` + theme bootstrap | `data-theme` attribute on `<html>` | Inline script logic, localStorage read, OS preference detection |
| `src/components/ui/*` | Reusable component class APIs | Detailed utility composition and state variants |
| `src/components/sections/*` | Section props and composition | Responsive layout internals and presentation detail |
| `src/components/campaign/*` | Builder step interfaces | Styling internals and token migration details |
| Theme toggle utility (if added) | `getTheme()/setTheme()` | Local persistence and DOM attribute synchronization |
| Verification artifacts in `.sisyphus/evidence/styling-refactor/` | Wave evidence files | Manual QA notes, screenshots, check transcripts |

### Baseline Capture Prerequisite (Before Wave 1)

Before any migration begins, capture baseline evidence:
1. **Build baseline**: `npm run build` output saved to `.sisyphus/evidence/styling-refactor/baseline-build.log`
2. **Visual baseline**: Screenshot home, dashboard, campaigns, contact, faq at sm/md/lg/xl viewports
3. **GSAP baseline**: Record current ScrollTrigger start/end positions and console output for Hero and Features sections
4. **Three.js baseline**: Verify canvas renders, record frame presence and overlay contrast

These baselines are the reference for all regression checks in Waves 2-6.

### Migration Scope Freeze

**Phase-1 migration inventory (in scope for this initiative):**
1. **Shared UI primitives** (`src/components/ui/*`): Button, Card, Input, Badge, Modal, Toast
2. **Dashboard components** (`src/components/dashboard/*`): FilterToolbar, StatusFilter, DateRangeFilter, BudgetTierFilter, SavedFiltersPopover, AnalyticsChart
3. **Campaign builder** (`src/components/campaign/*`): Step indicators, form inputs, review cards, success modal
4. **Page shells**: Layout wrappers, nav, footer, section containers

**Out of scope for this initiative (leave as-is):**
1. GSAP-specific animated elements (Hero text reveals, Features card animations) — preserve current inline/class styling
2. Three.js canvas host and overlay positioning
3. Any component with >50% of its styles tied to animation state

### Decision Log

#### D1 — Tailwind v4 theme source in CSS (`@theme`) over legacy JS config
- **What:** Define design system in `globals.css` using Tailwind v4 `@theme` directives.
- **Why:** Tailwind v4 promotes CSS-native theme authoring and reduces config drift.
- **Alternative considered:** Continue with v3-style `tailwind.config.js` extension.
- **Rejected because:** adds split brain (JS config + CSS), less aligned with v4 direction.
- **Conditions:** right while project stays on Tailwind v4 CSS-first architecture.
- **Escape plan:** if plugin compatibility requires JS config, mirror tokens from CSS into generated config bridge.
- **Validation signals:** token changes propagate consistently across pages; no missing utilities during build.
- **Challenged instinct:** “config file is always cleaner” is not true in v4 CSS-first workflow.

#### D2 — Semantic color tokens over literal color naming
- **What:** Use semantic token categories (`primary`, `surface`, `text`, etc.) with scale-backed vars.
- **Why:** supports theme swaps and future rebranding with lower migration cost.
- **Alternative considered:** direct literal palette usage in each component.
- **Rejected because:** duplicates intent and increases drift.
- **Conditions:** right while team values design consistency and maintainability.
- **Escape plan:** provide compatibility aliases for frequently used literal classes during transition.
- **Validation signals:** reduced literal color churn in PRs, predictable dark/light mapping.
- **Challenged instinct:** “faster to just use literal classes” is short-term only.

#### D3 — Dark mode default from OS + `data-theme` override
- **What:** System preference is default; attribute override enforces explicit user choice.
- **Why:** balances zero-config user comfort with product-level control.
- **Alternative considered:** class-only dark mode toggled manually.
- **Rejected because:** loses automatic preference alignment and can increase flash risk.
- **Conditions:** right while product needs both passive and explicit theme behavior.
- **Escape plan:** if complexity rises, simplify to attribute-only with persisted preference.
- **Validation signals:** no theme flash; correct mode under both OS and manual override scenarios.
- **Challenged instinct:** “just use `dark:` class everywhere” ignores first-paint correctness.

#### D4 — Migration order: low-risk primitives first
- **What:** migrate shared UI/static components first, then complex/animated surfaces.
- **Why:** isolates risk and makes regressions easier to detect.
- **Alternative considered:** big-bang migration across all pages at once.
- **Rejected because:** high blast radius and harder debugging.
- **Conditions:** right for refactors touching many components.
- **Escape plan:** if dependencies force complex component early, gate with dedicated visual diff/evidence.
- **Validation signals:** early waves remain stable; later waves have reduced surprises.
- **Challenged instinct:** “finish fastest with one pass” often increases rollback costs.

#### D5 — Preserve GSAP via transform/opacity ownership boundaries
- **What:** keep GSAP-owned properties (transform/opacity/filter where applicable) under animation control; tokens affect static style layers.
- **Why:** avoids CSS class changes overriding timeline-driven states.
- **Alternative considered:** rewriting animated style properties into theme-driven classes indiscriminately.
- **Rejected because:** can break timeline interpolation and trigger jitter.
- **Conditions:** right while existing timeline architecture remains class+inline hybrid.
- **Escape plan:** move critical animated properties to dedicated GSAP-managed CSS vars if conflicts arise.
- **Validation signals:** ScrollTrigger start/end positions and easing behavior match baseline.
- **Challenged instinct:** “all styles should be utility classes” fails for animation-owned props.

#### D6 — Preserve Three.js boundaries through explicit layering contract
- **What:** enforce z-index/positioning contract for canvas wrappers and overlay content; keep renderer colors independent from CSS tokens unless intentionally mapped.
- **Why:** prevents canvas occlusion or unexpected color inheritance effects.
- **Alternative considered:** broad global style overrides on canvas/container elements.
- **Rejected because:** increases risk of render stacking and compositing bugs.
- **Conditions:** right while R3F canvas remains a separate rendering context.
- **Escape plan:** isolate canvas host styles into dedicated wrapper class with strict reset.
- **Validation signals:** hero 3D scene remains visible, interactive, and layered correctly.
- **Challenged instinct:** “global CSS is harmless for canvas” is false in layered UIs.

### Tailwind v4 `@theme` Syntax Specifics (Documented Contract)

- Tokens are declared in CSS via `@theme { ... }` in `globals.css`.
- Theme values become utility-aware through Tailwind v4 compilation.
- Theme extension is handled in CSS instead of `tailwind.config.js` as primary source.
- Prefer semantic token names and map to palette scales internally.
- Keep dark-mode token overrides explicit in theme-aware blocks/media rules.

### GSAP/Three.js Preservation Contract

**GSAP verification criteria (per wave):**
- ScrollTrigger start/end positions must match baseline ± 50px tolerance
- Timeline easing curves must not change (no timing regressions)
- No `gsap` console warnings or errors after migration
- Transform/opacity/filter properties owned by GSAP must not be overridden by theme utility classes
- Specific selectors to verify: `.hero-title`, `.hero-subtitle`, `.feature-card`, `.feature-icon`

**Three.js verification criteria (per wave):**
- Canvas element must render non-empty frame (WebGL context active, `canvas.toDataURL()` not all-transparent)
- Canvas must remain visible with `z-index > 0` in its stacking context
- Overlay text elements must maintain `> 4.5:1` contrast against canvas background (measured via computed styles)
- Canvas container position (`relative`/`absolute`/`fixed`) must not change
- No WebGL context loss errors in console

## Testing Decisions

### Feedback Loops

1. **Type + lint loop** for all touched TS/TSX/CSS files.
2. **Build gate**: run `npm run build` after every wave.
3. **Visual/manual loop**: targeted page review (home, dashboard, campaigns, contact, faq).
4. **Animation/3D loop**: dedicated checks for GSAP timelines and Three.js rendering.

### TDD/Refactor Approach

- Use small migration batches (component group per wave).
- Validate each batch immediately with build + manual smoke checks.
- Keep reversible commits per wave to simplify rollback.

### Manual QA Checkpoints

For each wave, capture evidence under `.sisyphus/evidence/styling-refactor/`:

- Theme token diff summary
- Responsive snapshots/notes at `sm/md/lg/xl/2xl`
- Dark mode checks:
  - OS dark default
  - `data-theme="dark"` override
  - no flash on load
- Core page visual regression checklist
- GSAP interaction checks (scroll-linked sequences)
- Three.js hero rendering and layering checks
- Build log excerpt

## Out of Scope

- New product features/pages
- Backend/API/data model changes unrelated to styling system
- Authentication/authorization changes
- Rewriting GSAP timelines or Three.js scene logic (unless required for compatibility fix)
- Brand redesign beyond codifying existing design language

## Open Questions / Risks

1. **Theme persistence:** Should manual `data-theme` choice persist in local storage/session for future visits? → **Decision: Yes**, use `localStorage` with fallback to OS preference. Implementation in Wave 2 (SF-003).
2. **No-flash implementation location:** inline script in root layout vs server-set attribute strategy. → **Decision:** Inline script in `src/app/layout.tsx` `<head>` before any render-blocking resources. This is the most reliable SSR/CSR approach.
3. **Third-party style interactions:** any library CSS that may not follow semantic token intent. → **Mitigation:** Scope third-party overrides to explicit wrapper classes; do not apply `@theme` tokens to third-party DOM.
4. **Animation coupling risk:** some GSAP sequences may rely on exact computed sizes/colors. → **Mitigation:** Baseline capture prerequisite (see above) + preserve GSAP-owned properties (transform/opacity/filter) during migration.
5. **Canvas contrast risk:** dark tokens may reduce legibility of text overlays on 3D backgrounds. → **Mitigation:** Verify overlay text uses `text-inverse` token; if contrast fails, add dedicated `--color-canvas-overlay` token.

**Resolved questions (frozen in PRD):**
- Token adoption depth: Phase-1 inventory defined above (shared UI + dashboard + campaign builder + page shells). GSAP/Three.js animated surfaces are out of scope.
- Migration scope: Frozen. See "Migration Scope Freeze" section.

## Acceptance Criteria

### Product Acceptance Criteria (implementation-observable only)

1. [ ] `globals.css` contains `@theme` directive with **minimum token inventory**:
   - Colors: `primary-{50,100,200,300,400,500,600,700,800,900}`, `surface-{0,50,100,200,300,400,500}`, `text-{primary,secondary,muted,inverse}`, `accent-{500,600}`, `success-{500,600}`, `warning-{500,600}`, `danger-{500,600}` (mapped to red family)
   - Spacing: `space-{4,8,12,16,20,24,32,40,48,64,80,96}`
   - Typography: `font-sans`, `font-display`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `leading-tight`, `leading-normal`, `leading-relaxed`
   - Breakpoints: `--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`, `--breakpoint-xl`, `--breakpoint-2xl`
2. [ ] Dark mode works via `prefers-color-scheme` and `data-theme` with no flash on load (verified per no-flash protocol)
3. [ ] Responsive breakpoints defined and applied to all core page shells
4. [ ] `npm run build` passes with zero errors
5. [ ] All core pages (home, dashboard, campaigns, contact, faq) render without visual regression:
   - Baseline: screenshots captured at `sm` (375px), `md` (768px), `lg` (1024px), `xl` (1440px)
   - Pass: no broken layout, no missing elements, no color/contrast failures vs baseline
6. [ ] GSAP animations verified: `src/components/sections/Hero.tsx` ScrollTrigger fires at expected scroll positions; `src/components/sections/Features.tsx` card reveals trigger correctly; no console errors from GSAP
7. [ ] Three.js canvas verified: Hero canvas renders non-empty frames; canvas is visible above background; overlay text maintains `> 4.5:1` contrast ratio against canvas

### Delivery Governance Checklist (tracked separately, not product acceptance)
- [ ] Evidence files exist for every wave in `.sisyphus/evidence/styling-refactor/`
- [ ] Dual Momus gates both passed
- [ ] Plan archived and beads issue closed

## PRD Hardening Checklist

- [x] Content Boundaries defined (token groups and migration boundaries)
- [x] Score/Metric Normalization not applicable (no scoring domain in this initiative)
- [x] Fixture/Test Data Provenance not applicable (UI styling refactor)
- [x] Latency/Performance Contracts defined qualitatively (no animation regressions, no flash)
- [x] Token/Rate Limits not applicable (no external API quota behavior)
- [x] Error Boundaries defined (build gate + regression evidence per wave)
- [x] State/Persistence Contract defined for theme override mechanism
- [x] Shared packages first not applicable (single-app styling initiative)
- [x] No inline API calls requirement preserved (no new data fetching in scope)
- [x] Mid-build architecture checkpoint included (after initial component migration wave)
- [x] MVP-first scope maintained (foundation → migration → verification)
