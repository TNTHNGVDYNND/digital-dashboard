# Momus Plan Review: saved-filters
**Date:** 2026-05-09
**Artifacts reviewed:**
- Plan: `/home/vladi/developer/digital-dashboard/.sisyphus/plans/saved-filters.md`
- PRD: not reviewed
- Prior plan review: not found

## Summary
**Gate Decision:** WARNING
**Blocker count:** 1 total (0 critical, 1 major, 0 minor)

### Top 3 Risks
1. Popover state ownership remains underspecified — the plan still leaves room for `FilterToolbar` or `SavedFiltersPopover` to own open/close state instead of `page.tsx`.
2. Keyboard interaction complexity in the popover remains medium-risk — row-level navigation plus separate action buttons needs careful focus design.
3. Final QA burden is still high — many acceptance checks are manual and concentrated late in Wave 4/Task 5.1.

## Verification of Previously Reported Blockers

### Fixed
- **D-1 — Store timing:** Fixed. `src/store/filters.ts` is now created in **Wave 2 / Slice 2.4**, and **Slice 2.5** plus **Task 5.1** explicitly verify `src/app/dashboard/page.tsx` uses that store with no inline preset `fetch` calls.
- **E-1 — Query authority:** Fixed. **Slice 1.3** now says: "On `POST`/`PUT`, the server canonicalizes `query`, derives `filters` from it, and ignores any client-supplied `filters` that do not match the derived set" and "Returns `400` if `query` is malformed or exceeds 512 characters`."
- **E-2 — Row interaction:** Fixed. **Slice 3.2** now requires: "Each preset row is a `<div>` container (not a button)" with a separate apply `<button>` and separate rename/delete icon buttons.
- **F-1 — A11y split:** Fixed. Accessibility work is now split into **Slice 4.3a: Dialog accessibility mechanics** and **Slice 4.3b: Popover accessibility mechanics**.
- **F-2 — File paths locked:** Fixed. The plan now consistently specifies exact file paths for created/modified files across all waves.
- **F-3 — Null `startDate`:** Fixed. **Slice 2.2** now states: "Campaigns without `startDate` are EXCLUDED when any date range filter is active. When no date range is set, they appear normally."

### Still Open
#### D-2: MAJOR — Popover state ownership still ambiguous
- **Location:** Contract: `FilterToolbar`; Contract: `SavedFiltersPopover`; Wave 3 / Slice 3.2
- **Evidence:**
  - `FilterToolbar` props include `savedFiltersCount`, `onTogglePopover`, `filters`, `onApplyFilter`, `onRenameFilter`, `onDeleteFilter`, `pendingById`
  - `SavedFiltersPopover` invariants require `isOpen: boolean` and `onToggle: () => void`
  - Slice 3.2 says only: `src/components/dashboard/FilterToolbar.tsx — add saved-filters popover trigger`
- **Gap:** The blocker asked for `src/app/dashboard/page.tsx` to own fetch state, popover state, and callbacks. The revised plan clearly moves fetch/mutation ownership upward, but it still does not explicitly state where `isOpen` lives for the popover. Because `FilterToolbar` does not accept `isPopoverOpen` (or equivalent) while `SavedFiltersPopover` requires `isOpen`, the plan still permits local state inside `FilterToolbar` or `SavedFiltersPopover`, which reintroduces the same coordination ambiguity during apply/rename/delete flows.
- **Fix:** Make ownership explicit in the plan and contract. Example: add `isPopoverOpen: boolean` and `onPopoverOpenChange: (open: boolean) => void` (or equivalent) to `FilterToolbar`, and state in Slice 3.2 / Slice 2.5 / Task 5.1 that `src/app/dashboard/page.tsx` owns popover open state and passes it down.

## Detailed Findings
### D. Dependency Gaps
D-2: **MAJOR** — Popover state ownership still ambiguous.

### E. Integration Risks
No blockers found in E.

### F. Resource & Assumption Risks
No blockers found in F.

## Fix Recommendations (Priority Order)
1. **MAJOR** Popover state ownership still ambiguous — explicitly add controlled popover-open props to `FilterToolbar` and restate page-level ownership in the slice/checkpoint text — Effort: trivial
