# SF-004 — Component Migration

**Slice ID:** SF-004  
**Name:** Component Migration  
**AFK:** Partial (build and token verification are automated; visual regression requires human review)  
**Effort Estimate:** Medium–Large (4–6 hours)  
**Type:** Feature slice (end-to-end migration)

---

## User Stories

8. **As a developer, I want a safe migration order, so that low-risk components are converted first before complex animated surfaces.**
   - Test: migration sequence starts with shared UI primitives and static components, then proceeds to dashboard/campaign/animated sections.

9. **As a stakeholder, I want core page visuals preserved during migration, so that refactor does not degrade UX.**
   - Test: home, dashboard, campaigns, contact, faq show no visual regression after migration.

---

## Acceptance Criteria

### Phase-1 Migration Inventory (in scope)

Migrate the following components to use semantic token-backed classes/utilities instead of literal, one-off values:

1. **Shared UI primitives** (`src/components/ui/*`):
   - [ ] `Button` — uses `primary-*`, `danger-*`, `surface-*`, `text-*` tokens
   - [ ] `Card` — uses `surface-*`, `radius-2xl`, `shadow-*` tokens
   - [ ] `Input` — uses `surface-*`, `text-*`, `border-subtle` tokens
   - [ ] `Badge` — uses `accent-*`, `success-*`, `warning-*`, `danger-*` tokens
   - [ ] `Modal` — uses `surface-*`, `backdrop-blur`, `shadow-*` tokens
   - [ ] `Toast` — uses `surface-*`, `accent-*`, `success-*`, `danger-*` tokens

2. **Dashboard components** (`src/components/dashboard/*`):
   - [ ] `FilterToolbar` — uses `surface-*`, `text-*`, `space-*` tokens
   - [ ] `StatusFilter` — uses semantic status color tokens
   - [ ] `DateRangeFilter` — uses `surface-*`, `text-*` tokens
   - [ ] `BudgetTierFilter` — uses `primary-*`, `surface-*` tokens
   - [ ] `SavedFiltersPopover` — uses `surface-*`, `shadow-*`, `text-*` tokens
   - [ ] `AnalyticsChart` — uses `primary-*`, `accent-*`, `surface-*` tokens

3. **Campaign builder** (`src/components/campaign/*`):
   - [ ] Step indicators — use `primary-*`, `surface-*`, `text-*` tokens
   - [ ] Form inputs — use `surface-*`, `text-*`, `border-subtle` tokens
   - [ ] Review cards — use `surface-*`, `radius-2xl`, `shadow-*` tokens
   - [ ] Success modal — use `surface-*`, `success-*`, `shadow-*` tokens

4. **Page shells**:
   - [ ] Layout wrappers — use `surface-0`, `text-primary` tokens
   - [ ] Nav — use `surface-*`, `primary-*`, `text-*` tokens
   - [ ] Footer — use `surface-*`, `text-muted` tokens
   - [ ] Section containers — use `space-*`, `surface-*` tokens

### Preservation Rules

- [ ] `rounded-2xl` shape language is preserved across all migrated components.
- [ ] `backdrop-blur` patterns are preserved for overlays.
- [ ] Existing `dark:` class conventions are replaced by semantic tokens (not duplicated).
- [ ] GSAP-owned properties (`transform`, `opacity`, `filter`) are NOT overridden by theme utility classes.
- [ ] Three.js canvas host and overlay positioning are NOT touched.

### Verification

- [ ] `npm run build` passes with zero errors.
- [ ] All core pages (home, dashboard, campaigns, contact, faq) render without visual regression:
  - Baseline: screenshots captured at `sm` (375px), `md` (768px), `lg` (1024px), `xl` (1440px)
  - Pass: no broken layout, no missing elements, no color/contrast failures vs baseline
- [ ] No console errors or warnings from migrated components.

---

## Dependencies

- **Blockers:** SF-001 (tokens must exist), SF-002 (responsive architecture must be defined), SF-003 (dark mode must be defined).
- **Blocked by this slice:** SF-005, SF-006.

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-004/`:

1. **Migration checklist:** Per-component pass/fail for token adoption.
2. **Before/after class diff:** For each migrated component, show old literal classes vs new semantic classes.
3. **Visual regression notes:**
   - Screenshot comparison (baseline vs post-migration) for home, dashboard, campaigns, contact, faq at `sm/md/lg/xl`.
   - Pass/fail for each page/viewport.
4. **Build log:** `npm run build` output saved as `build.log`.
5. **Console check:** Verify no new warnings/errors in browser DevTools console.

---

## Anti-Patterns to Avoid

- Do NOT use literal color utilities for semantic intent in migrated components.
- Do NOT mix independent ad-hoc dark-mode logic per component.
- Do NOT use inline `style` color values where tokenized utility/var should be used.
- Do NOT break `rounded-2xl` and existing modal/card shape consistency.
- Do NOT introduce utility collisions that disrupt GSAP transforms or Three.js layering.

---

## Notes

- This is the largest slice. Migrate in small batches (one component group at a time) and validate each batch immediately.
- GSAP-specific animated elements (Hero text reveals, Features card animations) are OUT OF SCOPE — preserve current inline/class styling.
- Three.js canvas host and overlay positioning are OUT OF SCOPE — do not touch.
- Any component with >50% of its styles tied to animation state is OUT OF SCOPE.
- Keep reversible commits per component group to simplify rollback.
