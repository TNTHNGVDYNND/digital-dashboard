# SF-006 — Regression Verification

**Slice ID:** SF-006  
**Name:** Regression Verification  
**AFK:** Partial (build is automated; visual regression requires human review)  
**Effort Estimate:** Small–Medium (2–3 hours)  
**Type:** Verification slice (final gate)

---

## User Stories

12. **As the delivery team, I want repeatable verification gates, so that refactor quality is measurable and auditable.**
    - Test: build passes, visual checks complete, and evidence artifacts are written per wave.

---

## Acceptance Criteria

### Final Build Gate

- [ ] `npm run build` passes with zero errors and zero warnings.
- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run format` produces no diff (all files already formatted).

### Visual Regression on All Core Pages

- [ ] Home page (`/`):
  - [ ] No broken layout at `sm/md/lg/xl` viewports.
  - [ ] Hero section renders correctly (3D canvas + overlay text).
  - [ ] Feature cards animate correctly on scroll.
  - [ ] No color/contrast failures vs baseline.
- [ ] Dashboard page (`/dashboard`):
  - [ ] Campaign list renders correctly.
  - [ ] Filter toolbar is functional and styled correctly.
  - [ ] Empty state (if applicable) renders correctly.
  - [ ] No color/contrast failures vs baseline.
- [ ] Campaigns page (`/campaigns`):
  - [ ] 4-step builder renders correctly.
  - [ ] All form inputs are styled and functional.
  - [ ] Success modal renders correctly.
  - [ ] No color/contrast failures vs baseline.
- [ ] Contact page (`/contact`):
  - [ ] Form and content render correctly.
  - [ ] No color/contrast failures vs baseline.
- [ ] FAQ page (`/faq`):
  - [ ] Content renders correctly.
  - [ ] No color/contrast failures vs baseline.

### Evidence Capture

- [ ] Evidence files exist for every wave in `.sisyphus/evidence/styling-refactor/`:
  - [ ] `sf-001/` — theme token snapshot, build log, smoke test notes
  - [ ] `sf-002/` — breakpoint snapshot, responsive layout notes, viewport smoke test
  - [ ] `sf-003/` — dark token snapshot, bootstrap script, no-flash test results, localStorage persistence test
  - [ ] `sf-004/` — migration checklist, before/after class diff, visual regression notes, build log
  - [ ] `sf-005/` — GSAP baseline comparison, console check, Three.js rendering/layering check, build log
  - [ ] `sf-006/` — final build log, visual regression checklist, wave-validator output
- [ ] `wave-validator.sh` (or equivalent verification script) runs and passes.

### Theme Verification

- [ ] Dark mode works via `prefers-color-scheme` (OS dark → app dark).
- [ ] Dark mode works via `data-theme="dark"` override.
- [ ] No flash of wrong theme on load (verified per no-flash protocol from SF-003).

### Animation/3D Verification

- [ ] GSAP ScrollTrigger positions match baseline (from SF-005 evidence).
- [ ] Three.js canvas renders correctly (from SF-005 evidence).

---

## Dependencies

- **Blockers:** All prior slices (SF-001 through SF-005) must be complete and evidence captured.
- **Blocked by this slice:** None (final slice).

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-006/`:

1. **Final build log:** `npm run build` output saved as `build.log`.
2. **Lint/format check:** `npm run lint` and `npm run format` output saved as `lint.log`.
3. **Visual regression checklist:** Per-page, per-viewport pass/fail table.
4. **Evidence completeness audit:** Checklist confirming all `sf-001` through `sf-005` evidence folders exist and contain required files.
5. **Wave validator output:** Run `wave-validator.sh` (or equivalent) and save output as `validator.log`.
6. **Summary report:** One-page markdown summary of the entire refactor initiative, including:
   - What was changed
   - What was preserved
   - Any known issues or deferred work
   - Sign-off statement

---

## Anti-Patterns to Avoid

- Do NOT skip visual regression checks because "build passed."
- Do NOT skip evidence capture for any wave.
- Do NOT sign off if any prior slice evidence is missing or incomplete.

---

## Notes

- This is the final gate. No code changes should happen in this slice — only verification and evidence capture.
- If regressions are found, create a follow-up issue rather than expanding this slice's scope.
- The summary report is the handoff artifact for the next initiative or production deployment.
- Delivery governance checklist (from PRD) is tracked here but does not block product acceptance:
  - [ ] Evidence files exist for every wave
  - [ ] Dual Momus gates both passed
  - [ ] Plan archived and beads issue closed
