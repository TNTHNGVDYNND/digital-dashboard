# SF-005 — GSAP / Three.js Integration

**Slice ID:** SF-005  
**Name:** GSAP / Three.js Integration  
**AFK:** No (requires manual visual verification of animations and 3D rendering)  
**Effort Estimate:** Small–Medium (2–3 hours)  
**Type:** Feature slice (end-to-end verification)

---

## User Stories

10. **As an end user, I want existing GSAP animations to remain smooth, so that the polished motion experience is preserved.**
    - Test: ScrollTrigger timelines fire correctly; no timing/layout break from token migration.

11. **As an end user, I want Three.js hero/canvas rendering unaffected, so that 3D visuals remain functional and layered correctly.**
    - Test: canvas renders as before with correct z-index stacking and no color bleed from global styles.

---

## Acceptance Criteria

### GSAP Verification

- [ ] `src/components/sections/Hero.tsx` ScrollTrigger fires at expected scroll positions (match baseline ± 50px tolerance).
- [ ] `src/components/sections/Features.tsx` card reveal triggers fire correctly.
- [ ] No `gsap` console warnings or errors after migration.
- [ ] Transform/opacity/filter properties owned by GSAP are NOT overridden by theme utility classes.
- [ ] Specific selectors verified:
  - [ ] `.hero-title` — text reveal animation intact
  - [ ] `.hero-subtitle` — text reveal animation intact
  - [ ] `.feature-card` — card entrance animation intact
  - [ ] `.feature-icon` — icon entrance animation intact
- [ ] Timeline easing curves match baseline (no timing regressions).

### Three.js Verification

- [ ] Canvas element renders non-empty frame (WebGL context active, `canvas.toDataURL()` not all-transparent).
- [ ] Canvas remains visible with `z-index > 0` in its stacking context.
- [ ] Overlay text elements maintain `> 4.5:1` contrast against canvas background (measured via computed styles).
- [ ] Canvas container position (`relative`/`absolute`/`fixed`) has NOT changed from baseline.
- [ ] No WebGL context loss errors in console.

### General

- [ ] `npm run build` passes with zero errors.
- [ ] No new console warnings or errors on home page (where GSAP and Three.js coexist).

---

## Dependencies

- **Blockers:** SF-001 (tokens must exist), SF-004 (component migration must be complete enough that GSAP/Three.js hosts are not broken).
- **Blocked by this slice:** SF-006.

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-005/`:

1. **GSAP baseline comparison:**
   - ScrollTrigger start/end positions (baseline vs post-migration) for Hero and Features.
   - Pass/fail for ± 50px tolerance.
2. **GSAP console check:** Screenshot or text capture of console showing zero gsap warnings/errors.
3. **Three.js rendering check:**
   - Screenshot of hero canvas showing non-empty frame.
   - `canvas.toDataURL()` sample or visual confirmation.
4. **Three.js layering check:**
   - Screenshot showing canvas z-index and overlay text positioning.
   - Contrast ratio measurement (DevTools or manual) for overlay text vs canvas background.
5. **Build log:** `npm run build` output saved as `build.log`.

---

## Anti-Patterns to Avoid

- Do NOT rewrite GSAP timelines or Three.js scene logic unless required for a compatibility fix.
- Do NOT apply theme utility classes to GSAP-owned elements (transform/opacity/filter).
- Do NOT change canvas container positioning or z-index contract.
- Do NOT introduce global styles that affect WebGL canvas color or transparency.

---

## Notes

- This slice is verification-heavy, not implementation-heavy. The work is confirming that prior slices did not break animation/3D behavior.
- If regressions are found, the fix may require rolling back specific component migration changes rather than rewriting GSAP/Three.js code.
- The preservation contract (D5 and D6 from PRD) should be the guiding principle here.
- Test on the home page primarily, as it contains both GSAP and Three.js elements.
