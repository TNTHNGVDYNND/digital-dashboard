# Saved Filters — Execution Plan

## TL;DR

Add URL-synced filtering and backend-persisted named presets to the authenticated dashboard. Users filter campaigns by status, date range, and budget tier; save combinations as named presets; and reapply, rename, or delete them. Four waves, medium effort.

**Deliverables:**
1. Campaign `status` schema + backfill script + `SavedFilter` schema + auth-scoped API routes
2. Filter toolbar with URL-synced controls and a single filtered dataset shared by list and chart
3. Save-filter dialog and saved-filters popover for preset create/apply
4. Rename/delete dialogs, full a11y mechanics, dark mode parity, final build + QA

**Effort:** Medium

---

## Waves

### Wave 1: Foundation Phase — Schema, API, Store, Backfill

> **Blocked by:** None
> **Issue:** `00-foundation-phase`
> **Type:** AFK

#### Slice 1.1: Extend Campaign schema with `status`
- **Files to modify:**
  - `src/lib/models/Campaign.ts` — add `status` enum (`draft | active | paused | completed`) with default `active` to schema and `ICampaign` interface
- **Expected outcome:** New campaigns default to `active`; existing documents can be backfilled
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Create a campaign without `status` and confirm it stores `active`
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w1-campaign-schema-build.log`

#### Slice 1.2: Create `SavedFilter` schema
- **Files to create:**
  - `src/lib/models/SavedFilter.ts` — `ISavedFilter` interface + Mongoose schema with `userId`, `name`, `query`, `filters: FilterClause[]`, timestamps
  - Define shared `FilterClause` type in `src/types/filters.ts`
- **Expected outcome:** MongoDB collection ready for preset CRUD; type shared across stack
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] TypeScript can import `FilterClause` from both a route handler and a store file
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w1-savedfilter-schema-build.log`

#### Slice 1.3: Add auth-scoped preset API routes
- **Files to create:**
  - `src/app/api/filters/route.ts` — `GET` (list user-scoped presets) and `POST` (create preset) with `auth()` from `src/lib/auth.ts`
  - `src/app/api/filters/[id]/route.ts` — `PUT` (rename) and `DELETE` with ownership checks; returns `401` for unauthenticated, `404` for missing/cross-user IDs
- **Server-side query authority:**
  - On `POST`/`PUT`, the server canonicalizes `query`, derives `filters` from it, and ignores any client-supplied `filters` that do not match the derived set
  - Returns `400` if `query` is malformed or exceeds 512 characters
- **Expected outcome:** Authenticated users can CRUD their own presets; cross-user access is rejected; server is the single source of truth for `filters` derivation
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] `curl` / Postman: `POST /api/filters` creates a preset scoped to session user
  - [ ] `GET /api/filters` returns only that user's presets
  - [ ] `PUT /api/filters/:id` with another user's ID returns `404`
  - [ ] `DELETE /api/filters/:id` without auth returns `401`
  - [ ] Send a `POST` with mismatched `query` + `filters` payload; confirm server ignores client `filters` and derives from `query`
  - [ ] Send a `POST` with malformed `query` (>512 chars); confirm `400` response
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w1-api-verification.md`

#### Slice 1.4: Create deploy-time backfill script
- **Files to create:**
  - `scripts/backfill-status.ts` — idempotent script that updates only documents missing `status`, emits audit log with start time, end time, matched count, modified count, and any failures
- **Expected outcome:** Legacy campaigns receive `status: 'active'` safely; rerunning produces no duplicate effects
- **Verification:**
  - [ ] Run `scripts/backfill-status.ts` against local/dev MongoDB and inspect audit log
  - [ ] Re-run script and confirm `modified count === 0`
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w1-backfill-audit.log`

#### Slice 1.5: Canonical query parsing/serialization helpers
- **Files to create:**
  - `src/lib/filters/query.ts` — `parseFilterQuery(searchParams)`, `serializeFilterQuery(filters)`, `validateDateRange(from, to)`
  - Deterministic key order: `status`, `from`, `to`, `tier`
  - ISO `YYYY-MM-DD` dates; omit empty keys; strip unknown params; reject `from > to`
- **Expected outcome:** URL search params round-trip exactly; invalid ranges are caught before save/apply
- **Verification:**
  - [ ] Unit-style sanity check: `serializeFilterQuery({ status: 'active', from: '2026-05-01', to: '2026-05-31', tier: 'premium' })` produces `status=active&from=2026-05-01&to=2026-05-31&tier=premium`
  - [ ] `parseFilterQuery` strips unknown keys and rejects invalid date ranges
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w1-query-helpers-check.md`

---

### Wave 2: URL-Synced Filtering + Toolbar

> **Blocked by:** Wave 1
> **Issue:** `01-url-synced-filtering`
> **Type:** AFK

#### Slice 2.1: Build filter control components
- **Files to create:**
  - `src/components/dashboard/StatusFilter.tsx` — single-select control for `draft | active | paused | completed`
  - `src/components/dashboard/DateRangeFilter.tsx` — two native date inputs (`from`, `to`) with validation that rejects `from > to`
  - `src/components/dashboard/BudgetTierFilter.tsx` — single-select control for budget tier
- **Expected outcome:** Each control is a reusable, styled component consistent with existing Tailwind dashboard language
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Controls render correctly in light and dark themes
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w2-controls-build.log`

#### Slice 2.2: Build `FilterToolbar` and wire to dashboard page
- **Popover state ownership:** `src/app/dashboard/page.tsx` owns `isPopoverOpen` state and passes it down through `FilterToolbar` to `SavedFiltersPopover` as controlled props (`isPopoverOpen`, `onPopoverOpenChange`). `FilterToolbar` and `SavedFiltersPopover` must NOT own popover open state locally.
- **Files to create:**
  - `src/components/dashboard/FilterToolbar.tsx` — composes `StatusFilter`, `DateRangeFilter`, `BudgetTierFilter`; sits above campaign list, below page header; responsive layout (single row desktop, vertical stack mobile)
- **Files to modify:**
  - `src/app/dashboard/page.tsx` — read filter state from URL search params on mount and on param changes; derive a single filtered campaign array using canonical query helpers; pass filtered array to both campaign list and `AnalyticsChart`; generate canonical query string for current applied filters
  - **Null `startDate` behavior:** Campaigns without `startDate` are EXCLUDED when any date range filter is active. When no date range is set, they appear normally.
- **Expected outcome:** Toolbar controls update URL and derive a single filtered dataset for both list and chart
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Apply each filter individually and in combination; confirm URL updates with canonical key order (`status`, `from`, `to`, `tier`)
  - [ ] Refresh page and confirm identical filtered results
  - [ ] Copy URL to new tab and confirm identical results
  - [ ] Use browser back/forward and confirm filter state changes correctly
  - [ ] Apply a date range filter and confirm campaigns without `startDate` are excluded
  - [ ] Clear date range and confirm campaigns without `startDate` reappear
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w2-toolbar-url-verification.md`

#### Slice 2.3: Filtered empty state
- **Files to modify:**
  - `src/app/dashboard/page.tsx` — when filters yield zero campaigns, display `No campaigns match the current filters` with a `Clear all filters` action that removes all canonical URL params
- **Expected outcome:** Users understand when filters are too restrictive and can reset instantly
- **Verification:**
  - [ ] Apply filters that yield zero campaigns; confirm empty state message and `Clear all filters` action appear
  - [ ] Click `Clear all filters`; confirm URL params are removed and full list reappears
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w2-empty-state-verification.md`

#### Slice 2.4: Create `src/store/filters.ts`
- **Files to create:**
  - `src/store/filters.ts` — Zustand store with:
    - `filters: ISavedFilter[]`
    - `isFetchingList: boolean`
    - `pendingAction: 'create' | null`
    - `pendingById: Record<string, 'rename' | 'delete'>`
    - `error: string | null`
    - Actions: `fetchFilters`, `createFilter`, `updateFilter`, `deleteFilter`
  - Behavior: list remains visible during mutations; only active submit/row action is disabled; errors surface inline without blanking the list
- **Expected outcome:** All preset network mutations centralized; no inline `fetch` in presentational components
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Store can be imported into `src/app/dashboard/page.tsx` and a component without circular deps
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w2-store-build.log`

#### Slice 2.5: Architecture checkpoint (post-slice)
- **Verify:**
  - [ ] URL search params are the sole source of truth for applied filters
  - [ ] `src/app/dashboard/page.tsx` computes one filtered array and passes it to both the list and `AnalyticsChart`
  - [ ] `src/app/dashboard/page.tsx` uses `src/store/filters.ts` for preset data and mutations; no inline preset `fetch` calls in any component
  - [ ] Existing auth scoping is preserved
  - [ ] MVP semantics remain single-select for `status` and `tier`; no repeated query params
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w2-architecture-checkpoint.md`

---

### Wave 3: Preset Create / Apply

> **Blocked by:** Wave 2
> **Issue:** `02-preset-create-apply`
> **Type:** AFK

#### Slice 3.1: Create `SaveFilterDialog`
- **Files to create:**
  - `src/components/dashboard/SaveFilterDialog.tsx` — opens from "Save current filters" trigger; name input with validation (blank, whitespace-only, over-50 chars rejected with inline error); validates current filter query for invalid date ranges (`from > to`) before allowing save; on success closes dialog and new preset appears in popover list without full refresh
- **Files to modify:**
  - `src/components/dashboard/FilterToolbar.tsx` — add "Save current filters" trigger button
  - `src/app/dashboard/page.tsx` — orchestrate dialog open/close state
- **Expected outcome:** Users can save current filter configuration as a named preset
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Attempt save with blank name → inline error
  - [ ] Attempt save with `from > to` → inline error
  - [ ] Save with valid name → preset appears in popover list immediately
  - [ ] List remains visible during save mutation (no full-page spinner)
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w3-save-dialog-verification.md`

#### Slice 3.2: Create `SavedFiltersPopover`
- **Files to create:**
  - `src/components/dashboard/SavedFiltersPopover.tsx` — trigger button opens popover listing current user's saved presets
  - **Row interaction model:** Each preset row is a `<div>` container (not a button) containing:
    - A separate `<button>` for the preset name that applies the preset on click
    - Separate icon buttons for rename and delete (not nested inside the apply button)
  - Clicking a preset closes popover and updates URL query string to the preset's canonical filter query
  - Visually separates "apply preset" affordance from destructive actions (rename/delete icons)
  - Empty state when user has no presets; responsive (remains reachable on smaller viewports)
- **Files to modify:**
  - `src/components/dashboard/FilterToolbar.tsx` — add saved-filters popover trigger
- **Expected outcome:** Users can view and apply saved presets with one click
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Change filters manually, then click a saved preset → URL updates to preset query, dashboard filters reapply
  - [ ] Refresh page after applying a preset → same filtered state restored
  - [ ] Popover closes on apply and focus returns to trigger
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w3-popover-verification.md`

---

### Wave 4: Preset Management + Hardening

> **Blocked by:** Wave 3
> **Issue:** `03-preset-management-hardening`
> **Type:** human-review

#### Slice 4.1: Create `RenameFilterDialog`
- **Files to create:**
  - `src/components/dashboard/RenameFilterDialog.tsx` — opens from rename icon button in each `SavedFiltersPopover` row; pre-populates with existing preset name; validates new name with same rules as save dialog (blank, whitespace-only, over-50 chars rejected); on success updates only the preset name while popover list remains visible
- **Files to modify:**
  - `src/components/dashboard/SavedFiltersPopover.tsx` — add rename icon button with `aria-label="Rename filter"`
- **Expected outcome:** Users can rename presets without recreating them
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Rename a preset → confirm name updates in popover list without list disappearing
  - [ ] Verify `aria-label="Rename filter"` is present in DevTools Accessibility panel
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-rename-verification.md`

#### Slice 4.2: Create `DeleteFilterConfirmation`
- **Files to create:**
  - `src/components/dashboard/DeleteFilterConfirmation.tsx` — opens from delete icon button in each `SavedFiltersPopover` row; requires explicit confirmation (e.g., "Delete" button in destructive style matching `CampaignDeleteModal`); on confirm removes preset from both UI state and backend; list remains visible
- **Files to modify:**
  - `src/components/dashboard/SavedFiltersPopover.tsx` — add delete icon button with `aria-label="Delete filter"`
- **Expected outcome:** Users cannot accidentally delete presets
- **Verification:**
  - [ ] `npm run build` passes
  - [ ] Delete a preset → confirm confirmation dialog appears, then preset removed without list disappearing
  - [ ] Verify `aria-label="Delete filter"` is present in DevTools Accessibility panel
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-delete-verification.md`

#### Slice 4.3a: Dialog accessibility mechanics
- **Files to modify:**
  - `src/components/dashboard/SaveFilterDialog.tsx`
  - `src/components/dashboard/RenameFilterDialog.tsx`
  - `src/components/dashboard/DeleteFilterConfirmation.tsx`
- **Requirements:**
  - All dialogs: `role="dialog"`, `aria-modal="true"`, labeled title
  - Initial focus in first actionable/input element
  - `Escape` key closes dialog
  - Focus returns to trigger on close (capture `document.activeElement` before opening)
  - Focus trap via `useEffect` + `ref`-based management
- **Expected outcome:** All dialogs are fully keyboard and screen-reader accessible
- **Verification:**
  - [ ] Open a dialog, press `Escape` → dialog closes, focus returns to trigger
  - [ ] Tab through dialog elements; focus must not escape the dialog while open
  - [ ] Verify dialog title is announced by screen reader on open
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-a11y-dialogs-verification.md`

#### Slice 4.3b: Popover accessibility mechanics
- **Files to modify:**
  - `src/components/dashboard/SavedFiltersPopover.tsx`
- **Requirements:**
  - Popover trigger: `aria-haspopup`, `aria-expanded`, keyboard toggle support
  - Popover keyboard navigation: Arrow Up/Down across preset rows, `Enter` to apply focused preset
  - Error text visually associated with field and announced to screen readers
- **Expected outcome:** Popover is fully keyboard and screen-reader accessible
- **Verification:**
  - [ ] Tab to popover trigger, press `Enter` → popover opens
  - [ ] Use Arrow Up/Down to navigate preset rows, `Enter` to apply
  - [ ] Popover closes on apply and focus returns to trigger
  - [ ] Verify icon buttons have `aria-label` attributes in DevTools Accessibility panel
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-a11y-popover-verification.md`

#### Slice 4.4: Dark mode + visual polish
- **Files to modify:**
  - `src/components/dashboard/FilterToolbar.tsx`
  - `src/components/dashboard/SavedFiltersPopover.tsx`
  - `src/components/dashboard/SaveFilterDialog.tsx`
  - `src/components/dashboard/RenameFilterDialog.tsx`
  - `src/components/dashboard/DeleteFilterConfirmation.tsx`
- **Requirements:**
  - All new components render correctly in dark theme using existing `dark:` utility conventions
  - Text contrast, hover states, and border colors match dashboard's existing visual language
  - Destructive actions use same color/style as `CampaignDeleteModal`
  - No light-theme-only styling anywhere in the saved-filters surface
- **Expected outcome:** Feature is visually consistent with the rest of the dashboard in both themes
- **Verification:**
  - [ ] Toggle dark mode and verify toolbar, popover, dialogs, text contrast, and hover states
  - [ ] Verify filtered empty state message and `Clear all filters` action in both light and dark themes
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-darkmode-verification.md`

#### Slice 4.5: Final build + regression check
- **Verification:**
  - [ ] `npm run build` passes with zero TypeScript errors
  - [ ] Existing campaign edit/delete flows are unaffected
  - [ ] `AnalyticsChart` still renders correctly when filtered list is empty or small
  - [ ] Template management section beneath campaigns area is unaffected
  - [ ] Full manual QA checklist completed (PRD Manual QA Checkpoints 1–9)
  - **Evidence path:** `.sisyphus/evidence/saved-filters/w4-final-build.log`

---

## Integration + Final Verification (blocked by all above)

- [ ] **Task 5.1: Integration + Final Verification**
  - **What:** Wire up all modules, run full test suite, verify PRD acceptance criteria
  - **Output:** All tests passing, PRD acceptance criteria checked off
  - **Verify:**
    - [ ] All PRD acceptance criteria met (Foundation Phase + 3 Vertical Slices)
    - [ ] `npm run build` passes (attach build log)
    - [ ] No debug code or TODO markers left in new/modified files
    - [ ] All new files listed in PRD are created and all modified files are updated
    - [ ] Architecture checkpoint from PRD passed:
      - URL search params are sole source of truth for applied filters
      - `src/app/dashboard/page.tsx` computes one filtered array and passes it to both list and `AnalyticsChart`
      - `src/app/dashboard/page.tsx` uses `src/store/filters.ts` for preset data and mutations; no component performs inline preset `fetch` calls
      - Existing auth scoping preserved
      - MVP semantics remain single-select for `status` and `tier`
    - [ ] Manual QA checklist completed (PRD Manual QA Checkpoints 1–9)
    - [ ] Evidence artifacts logged in `.sisyphus/evidence/saved-filters/`
  - **Evidence path:** `.sisyphus/evidence/saved-filters/integration-final-verification.md`

---

## Component Contracts

### Contract: SavedFiltersPopover

**Invariants:**
- Props: `filters: ISavedFilter[]`, `onApply: (query: string) => void`, `onRename: (id: string) => void`, `onDelete: (id: string) => void`, `pendingById: Record<string, 'rename' | 'delete'>`, `isOpen: boolean`, `onToggle: () => void`
- No direct store coupling — receives data and callbacks via props only
- Responsive: desktop popover panel; mobile falls back to full-width anchored panel

**Verification:**
- [ ] Test: keyboard open/close toggle via `Enter` on trigger
- [ ] Test: Arrow Up/Down navigates preset rows; `Enter` applies focused preset
- [ ] Test: focus returns to trigger after popover closes

**Forbidden:**
- Do NOT import store directly
- Do NOT perform inline `fetch` calls
- Do NOT use inline styles for colors

### Contract: FilterToolbar

**Invariants:**
- Props: `status`, `from`, `to`, `tier` values + `onChange` callbacks for each; `onSave` callback; `savedFiltersCount: number`; `isPopoverOpen: boolean`; `onPopoverOpenChange: (open: boolean) => void`; `filters: ISavedFilter[]`; `onApplyFilter: (query: string) => void`; `onRenameFilter: (id: string) => void`; `onDeleteFilter: (id: string) => void`; `pendingById: Record<string, 'rename' | 'delete'>`
- No direct store coupling — receives data and callbacks via props only
- Responsive: single row with wrapping on desktop; vertical stack on mobile

**Verification:**
- [ ] Test: each control change calls `onChange` with correct canonical value
- [ ] Test: responsive layout does not clip on 375px viewport

**Forbidden:**
- Do NOT import store directly
- Do NOT parse URL search params internally

### Contract: SaveFilterDialog

**Invariants:**
- Props: `isOpen: boolean`, `onClose: () => void`, `onSave: (name: string) => Promise<void>`, `currentQuery: string`, `isPending: boolean`, `error: string | null`
- No direct store coupling — receives data and callbacks via props only
- Focus trap active while open; `Escape` calls `onClose`; focus returns to trigger on close

**Verification:**
- [ ] Test: blank name shows inline error and prevents save
- [ ] Test: `Escape` closes dialog and returns focus to trigger
- [ ] Test: focus is trapped inside dialog while open

**Forbidden:**
- Do NOT import store directly
- Do NOT perform inline `fetch` calls

### Contract: RenameFilterDialog

**Invariants:**
- Props: `isOpen: boolean`, `onClose: () => void`, `onRename: (name: string) => Promise<void>`, `currentName: string`, `isPending: boolean`, `error: string | null`
- No direct store coupling — receives data and callbacks via props only
- Focus trap active while open; `Escape` calls `onClose`; focus returns to trigger on close

**Verification:**
- [ ] Test: pre-populates with `currentName`
- [ ] Test: `Escape` closes dialog and returns focus to trigger
- [ ] Test: focus is trapped inside dialog while open

**Forbidden:**
- Do NOT import store directly
- Do NOT perform inline `fetch` calls

### Contract: DeleteFilterConfirmation

**Invariants:**
- Props: `isOpen: boolean`, `onClose: () => void`, `onConfirm: () => Promise<void>`, `filterName: string`, `isPending: boolean`
- No direct store coupling — receives data and callbacks via props only
- Focus trap active while open; `Escape` calls `onClose`; focus returns to trigger on close

**Verification:**
- [ ] Test: destructive action uses same style as `CampaignDeleteModal`
- [ ] Test: `Escape` closes dialog and returns focus to trigger
- [ ] Test: focus is trapped inside dialog while open

**Forbidden:**
- Do NOT import store directly
- Do NOT perform inline `fetch` calls

---

## Notepad

- **Decisions:** `.sisyphus/notepads/saved-filters/decisions.md`
- **Problems:** `.sisyphus/notepads/saved-filters/problems.md`
- **Learnings:** `.sisyphus/notepads/saved-filters/learnings.md`
