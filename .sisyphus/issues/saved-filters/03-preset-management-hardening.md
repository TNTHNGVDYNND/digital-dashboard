# Issue 03: Vertical Slice 3 — Preset Management + Hardening

> **Type:** human-review  
> **Blockers:** `02-preset-create-apply`  
> **PRD Reference:** `.sisyphus/prds/saved-filters-prd.md` — Vertical Slice 3 section  
> **Estimated Complexity:** Medium

---

## Description

Complete the saved-filters feature with preset rename and delete flows, filtered-empty state polish, full accessibility mechanics, dark mode parity, and final verification. This slice is classified as **human-review** because it requires taste-checking on interaction feel, dark-mode visual consistency, and accessibility behavior that automated tests cannot fully validate.

---

## Acceptance Criteria

### Preset Management
- [ ] `src/components/dashboard/RenameFilterDialog.tsx` created:
  - Opens from a rename icon button in each `SavedFiltersPopover` row.
  - Pre-populates with the existing preset name.
  - Validates new name with same rules as save dialog (blank, whitespace-only, over-50 chars rejected).
  - On success, updates only the preset name while the popover list remains visible.
- [ ] `src/components/dashboard/DeleteFilterConfirmation.tsx` created:
  - Opens from a delete icon button in each `SavedFiltersPopover` row.
  - Requires explicit confirmation (e.g., "Delete" button in destructive style).
  - On confirm, removes the preset from both UI state and backend; list remains visible.
- [ ] Rename and delete icon buttons have `aria-label` values (`Rename filter`, `Delete filter`).

### Accessibility
- [ ] All dialogs (`SaveFilterDialog`, `RenameFilterDialog`, `DeleteFilterConfirmation`) implement:
  - `role="dialog"` and `aria-modal="true"`
  - Labeled title
  - Initial focus in the first actionable/input element
  - `Escape` key closes the dialog
  - Focus returns to the trigger button on close (capture `document.activeElement` before opening)
  - Focus trap implemented with `useEffect` + `ref`-based focus management
- [ ] `SavedFiltersPopover` trigger has `aria-haspopup`, `aria-expanded`, and keyboard toggle support.
- [ ] Popover keyboard navigation supports Arrow Up/Down movement across preset rows and `Enter` to apply the focused preset.
- [ ] Error text for validation failures is visually associated with the field and announced to screen readers.

### Dark Mode & Visual Polish
- [ ] All new components (`FilterToolbar`, `SavedFiltersPopover`, dialogs) render correctly in dark theme using existing `dark:` utility conventions.
- [ ] Text contrast, hover states, and border colors match the dashboard's existing visual language.
- [ ] Destructive actions use the same color/style as `CampaignDeleteModal`.

### Hardening
- [ ] Filtered empty state message and `Clear all filters` action verified in both light and dark themes.
- [ ] No light-theme-only styling anywhere in the saved-filters surface.
- [ ] `npm run build` passes.
- [ ] Full manual QA checklist completed (see PRD Manual QA Checkpoints 6–9).

---

## Files to Create / Modify

### Modify
- `src/components/dashboard/SavedFiltersPopover.tsx` (add rename/delete icon buttons and wire dialogs)
- `src/app/dashboard/page.tsx` (orchestrate rename/delete dialog state if needed)

### Create
- `src/components/dashboard/RenameFilterDialog.tsx`
- `src/components/dashboard/DeleteFilterConfirmation.tsx`

---

## Verification Steps

1. Run `npm run build` — must pass.
2. **Preset lifecycle:**
   - Save a preset.
   - Rename it → confirm name updates in popover list without list disappearing.
   - Delete it → confirm confirmation dialog appears, then preset removed without list disappearing.
3. **Accessibility:**
   - Tab to popover trigger, press `Enter` → popover opens.
   - Use Arrow Up/Down to navigate preset rows, `Enter` to apply.
   - Open a dialog, press `Escape` → dialog closes, focus returns to trigger.
   - Tab through dialog elements; focus must not escape the dialog while open.
   - Verify icon buttons have `aria-label` attributes in DevTools Accessibility panel.
4. **Dark mode:**
   - Toggle dark mode and verify toolbar, popover, dialogs, text contrast, and hover states.
5. **Keyboard-only workflow:**
   - Apply filters, save preset, apply preset, rename preset, delete preset — all without using a mouse.
6. **Regression:**
   - Confirm existing campaign edit/delete flows are unaffected.
   - Confirm `AnalyticsChart` still renders correctly when filtered list is empty or small.

---

## Notes

- This is the final slice. After completion, run the full architecture checkpoint from the PRD and the complete manual QA checklist.
- Because this slice involves UI polish and accessibility, it is classified as **human-review** — a human should verify the interaction feel, dark-mode visuals, and keyboard navigation before marking complete.
- Do not introduce shadcn/ui, Radix, or any new modal library; implement all overlay mechanics directly in React/Tailwind.
- Ensure `src/store/filters.ts` per-action pending states work correctly for rename and delete (row-level spinners/disabled states).
