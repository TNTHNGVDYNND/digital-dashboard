# SF-002 — Responsive Architecture

**Slice ID:** SF-002  
**Name:** Responsive Architecture  
**AFK:** Yes (clear acceptance criteria, no visual taste required)  
**Effort Estimate:** Small (1–2 hours)  
**Type:** Enabling slice (foundational infrastructure)

---

## User Stories

3. **As a mobile user, I want predictable responsive layouts across pages, so that UI remains readable and usable across viewport sizes.**
   - Test: breakpoint strategy (`sm/md/lg/xl/2xl`) is defined and applied to key containers and component layouts.

4. **As a developer, I want a documented responsive rule set, so that new components follow the same layout behavior.**
   - Test: PRD and implementation include explicit breakpoint intent and anti-patterns.

---

## Acceptance Criteria

- [ ] Breakpoints are explicitly defined in `@theme` within `globals.css`:
  - `--breakpoint-sm` (≈ 640px)
  - `--breakpoint-md` (≈ 768px)
  - `--breakpoint-lg` (≈ 1024px)
  - `--breakpoint-xl` (≈ 1280px)
  - `--breakpoint-2xl` (≈ 1536px)
- [ ] Page shells (`src/app/layout.tsx` wrappers, nav, footer, section containers) use responsive container classes:
  - `sm`: baseline mobile improvements
  - `md`: tablet stacking → split layouts
  - `lg`: desktop default two-column patterns
  - `xl/2xl`: wide dashboard and hero spacing refinements
- [ ] At least one responsive layout transition is applied per core page shell (home, dashboard, campaigns, contact, faq).
- [ ] Container query support is documented (either via `@container` or Tailwind v4 container utilities) for dashboard-dense components.
- [ ] `npm run build` passes with zero errors.
- [ ] No horizontal scrollbars appear at `sm` (375px) and `md` (768px) viewports on any core page.

---

## Dependencies

- **Blockers:** SF-001 (theme tokens must exist before responsive utilities can reference them).
- **Blocked by this slice:** SF-004, SF-005, SF-006.

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-002/`:

1. **Breakpoint definition snapshot:** Relevant `@theme` breakpoint lines from `globals.css`.
2. **Responsive layout notes:** Document intended layout transitions per page shell.
3. **Viewport smoke test:** Check home, dashboard, campaigns, contact, faq at `sm` (375px), `md` (768px), `lg` (1024px), `xl` (1440px) — note any horizontal scroll or broken layout.
4. **Build log:** `npm run build` output saved as `build.log`.

---

## Anti-Patterns to Avoid

- Do NOT use ad-hoc media queries outside the defined breakpoint scale.
- Do NOT introduce viewport-specific hacks (e.g., `!important` width overrides).
- Do NOT break existing GSAP ScrollTrigger positioning with responsive margin/padding changes.

---

## Notes

- This slice focuses on defining and applying the breakpoint contract, not full component migration.
- Responsive behavior should be verified on real device emulators or browser DevTools, not just by reading CSS.
- Document anti-patterns in a brief `responsive-rules.md` note inside the evidence folder for future developers.
