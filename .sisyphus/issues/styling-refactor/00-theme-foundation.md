# SF-001 — @theme Foundation

**Slice ID:** SF-001  
**Name:** @theme Foundation  
**AFK:** Yes (clear acceptance criteria, no visual taste required)  
**Effort Estimate:** Small (1–2 hours)  
**Type:** Enabling slice (foundational infrastructure)

---

## User Stories

1. **As a frontend developer, I want semantic theme tokens in `globals.css`, so that components share one design contract.**
   - Test: `globals.css` includes complete `@theme` tokens for color, spacing, typography, and breakpoints.

2. **As a product team member, I want semantic tokens (primary/surface/text/etc.) instead of literal color classes, so that we can change branding with minimal churn.**
   - Test: migrated components reference semantic classes or CSS vars, not arbitrary literals for core UI intent.

---

## Acceptance Criteria

- [ ] `src/app/globals.css` contains a single `@theme { ... }` directive with the following token inventory:
  - **Colors:**
    - `primary-{50,100,200,300,400,500,600,700,800,900}` (indigo family, 600/700 as action defaults)
    - `surface-{0,50,100,200,300,400,500}` (page → elevated surface scale)
    - `text-{primary,secondary,muted,inverse}` (foreground intents)
    - `accent-{500,600}` (supporting highlight)
    - `success-{500,600}`
    - `warning-{500,600}`
    - `danger-{500,600}` (red family)
  - **Spacing:** `space-{4,8,12,16,20,24,32,40,48,64,80,96}` (dashboard density + builder rhythm)
  - **Typography:**
    - `font-sans`, `font-display`, `font-mono`
    - `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`
    - `font-normal`, `font-medium`, `font-semibold`, `font-bold`
    - `leading-tight`, `leading-normal`, `leading-relaxed`
  - **Breakpoints:** `--breakpoint-sm`, `--breakpoint-md`, `--breakpoint-lg`, `--breakpoint-xl`, `--breakpoint-2xl`
  - **Radii/Shadows (as needed):** `radius-sm`, `radius-md`, `radius-lg`, `radius-xl`, `radius-2xl`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`
- [ ] All token values are mapped to concrete palette values (no undefined references).
- [ ] Light-theme values are the default; dark overrides are stubbed (empty or commented) and will be populated in SF-003.
- [ ] `npm run build` passes with zero errors after token introduction.
- [ ] No existing component styling is broken by the new `@theme` block (verify by running the app and checking home/dashboard/campaigns pages render correctly).

---

## Dependencies

- **Blockers:** None (first slice — no upstream dependencies).
- **Blocked by this slice:** SF-002, SF-003, SF-004, SF-005, SF-006.

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-001/`:

1. **Token inventory snapshot:** Copy of the final `@theme` block from `globals.css`.
2. **Build log:** `npm run build` output saved as `build.log`.
3. **Smoke test notes:** Brief manual check that home, dashboard, and campaigns pages still render without console errors.
4. **Token diff summary:** List of all tokens defined vs. what existed before (baseline: only `@import 'tailwindcss'`).

---

## Anti-Patterns to Avoid

- Do NOT use literal color utilities inside `@theme` (e.g., no `bg-indigo-600` as a token name).
- Do NOT introduce ad-hoc one-off spacing values outside the defined scale.
- Do NOT break existing Tailwind v4 compilation (verify utilities still generate).

---

## Notes

- This slice is purely additive: it introduces tokens without migrating any components.
- Dark-mode token overrides are intentionally left as stubs here; full dark mapping happens in SF-003.
- Preserve existing conventions from `DESIGN.md`: indigo primary, red danger, rounded-2xl shape language.
