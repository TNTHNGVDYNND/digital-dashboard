# Issue 02: Vertical Slice 2 — Preset Create and Apply

> **Type:** AFK  
> **Blockers:** `01-url-synced-filtering`  
> **PRD Reference:** `.sisyphus/prds/saved-filters-prd.md` — Vertical Slice 2 section  
> **Estimated Complexity:** Medium

---

## Description

Allow users to save the currently applied filters as a named preset and reapply saved presets from a popover. This slice wires the preset CRUD UI to the backend APIs established in the Foundation Phase and the URL-synced filter state from Slice 1.

---

## Acceptance Criteria

- [ ] `src/store/filters.ts` created with the recommended Zustand store shape:
  - `filters: ISavedFilter[]`
  - `isFetchingList: boolean`
  - `pendingAction: 'create' | null`
  - `pendingById: Record<string, 'rename' | 'delete'>`
  - `error: string | null`
  - Actions: `fetchFilters`, `createFilter`, `updateFilter`, `deleteFilter`
- [ ] Store behavior: list remains visible during create/update/delete mutations; only the active submit/row action is disabled; errors surface inline without blanking the list.
- [ ] `src/components/dashboard/SaveFilterDialog.tsx` created:
  - Opens from a "Save current filters" trigger in the toolbar.
  - Input for preset name with validation: blank, whitespace-only, and over-50-char names rejected with inline error.
  - Validates current filter query for invalid date ranges (`from > to`) before allowing save.
  - On success, closes dialog and the new preset appears in the popover list without a full refresh.
- [ ] `src/components/dashboard/SavedFiltersPopover.tsx` created:
  - Trigger button opens a popover listing the current user's saved presets.
  - Each preset row is a native `<button>` that applies the preset on click.
  - Clicking a preset closes the popover and updates the URL query string to the preset's canonical filter query.
  - Visually separates "apply preset" affordance from destructive actions (rename/delete icons).
  - Empty state when user has no presets.
- [ ] Preset names are trimmed before write.
- [ ] Unknown query params are stripped from the saved preset query before write.
- [ ] `npm run build` passes.
- [ ] Manual QA: save a preset, apply it from the popover, confirm URL and dashboard update instantly.

---

## Files to Create / Modify

### Modify
- `src/app/dashboard/page.tsx` (orchestrate dialog/popover open state)
- `src/components/dashboard/FilterToolbar.tsx` (add save-filter trigger and saved-filters popover trigger)

### Create
- `src/store/filters.ts`
- `src/components/dashboard/SavedFiltersPopover.tsx`
- `src/components/dashboard/SaveFilterDialog.tsx`

---

## Verification Steps

1. Run `npm run build` — must pass.
2. Apply filters on the dashboard and click "Save current filters".
3. Attempt to save with blank name → inline error.
4. Attempt to save with `from > to` → inline error.
5. Save with valid name → preset appears in popover list immediately.
6. Change filters manually, then click the saved preset → URL updates to preset query, dashboard filters reapply.
7. Refresh page after applying a preset → same filtered state restored.
8. Verify list remains visible during save mutation (no full-page spinner).

---

## Notes

- All preset network mutations must be centralized in `src/store/filters.ts`; no inline `fetch` calls in presentational components.
- Reuse existing Tailwind overlay/card patterns from `CampaignEditModal.tsx` / `CampaignDeleteModal.tsx` for the save dialog.
- The popover must remain reachable on smaller viewports; fall back to full-width anchored panel if necessary.
- Rename and delete flows are intentionally **excluded** from this slice; they ship in Slice 3.
