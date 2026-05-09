# Saved Filters — UI/UX Design Document

## Feature
Enable users to save campaign filter configurations (status, date range, budget tier) as named presets and quickly apply them on the Dashboard.

---

## Design Principles
- **URL-first**: Applied filters live in the URL so they are shareable and back-button friendly.
- **Backend presets**: Named saved filters are persisted in MongoDB for cross-device access.
- **Reuse existing patterns**: Use the same Tailwind modal, Zustand store, and SWR data patterns already in the codebase.
- **Keyboard accessible**: All dialogs and filter lists are fully keyboard navigable.

---

## Filter Dimensions

| Dimension | UI Control | Values | Source |
|---|---|---|---|
| **Status** | Toggle button group (or select) | `draft`, `active`, `paused`, `completed` | Requires adding `status` field to `Campaign` model (recommended) OR deriving from `startDate + duration` vs `now` |
| **Date Range** | Two date inputs (from → to) | ISO date strings | `startDate` field on Campaign |
| **Budget Tier** | Toggle button group | `basic`, `premium`, `enterprise` | `tier` field on Campaign |

### Decision: Add `status` to Campaign model
Deriving status from dates is fragile (clock skew, edge cases). Adding an explicit `status` enum to `CampaignSchema` is cleaner, supports manual overrides, and aligns with the user's explicit requirement. Migration: existing campaigns without `status` default to `active`.

---

## Persistence Architecture (Hybrid)

| Layer | Technology | Purpose |
|---|---|---|
| **Applied filters** | URL `searchParams` | Shareable, server-renderable current state |
| **Saved presets** | MongoDB + Mongoose | Named, reusable, cross-device |
| **UI state** | Client Zustand/reducer | Popover open, dialog visibility, draft names |

### Why not localStorage for presets?
localStorage is device-local and cannot sync across sessions. The existing Templates feature already uses a backend-backed pattern; Saved Filters should follow the same reliability standard.

---

## Component Inventory

### New Components

| Component | Path | Responsibility |
|---|---|---|
| `FilterToolbar` | `src/components/dashboard/FilterToolbar.tsx` | Horizontal bar containing all filter controls + Saved Filters button |
| `StatusFilter` | `src/components/dashboard/StatusFilter.tsx` | Toggle group for campaign status |
| `DateRangeFilter` | `src/components/dashboard/DateRangeFilter.tsx` | From/to date inputs |
| `BudgetTierFilter` | `src/components/dashboard/BudgetTierFilter.tsx` | Toggle group for budget tier |
| `SavedFiltersPopover` | `src/components/dashboard/SavedFiltersPopover.tsx` | Popover listing saved presets with apply/rename/delete actions |
| `SaveFilterDialog` | `src/components/dashboard/SaveFilterDialog.tsx` | Modal to name and save the current filter set |
| `RenameFilterDialog` | `src/components/dashboard/RenameFilterDialog.tsx` | Modal to rename an existing saved filter |
| `DeleteFilterConfirmation` | `src/components/dashboard/DeleteFilterConfirmation.tsx` | Confirmation overlay before deleting a preset (mirrors `CampaignDeleteModal`) |

### Modified Components

| Component | Change |
|---|---|
| `src/app/dashboard/page.tsx` | Add `FilterToolbar` above campaign list; derive filtered campaign list from URL params before rendering |
| `src/lib/models/Campaign.ts` | Add `status` enum field with default `'active'` |
| `src/components/dashboard/AnalyticsChart.tsx` | Optionally accept `campaigns` prop directly (already does) — no change needed if parent filters before passing |

---

## UI Flows

### Flow 1: Apply Filters
1. User clicks status / date range / budget tier controls in `FilterToolbar`
2. Each change updates URL `searchParams` via `useRouter().replace()`
3. Dashboard page reads `searchParams` and filters `campaigns` array before rendering list + chart

### Flow 2: Save Current Filters
1. User clicks "Save Filters" button in toolbar
2. `SaveFilterDialog` opens with focused name input
3. User enters name, clicks "Save"
4. Frontend POSTs to `/api/filters` with `{ name, query: currentSearchParamsString }`
5. On success: dialog closes, `SavedFiltersPopover` list refreshes, success toast (or inline text) shown

### Flow 3: Apply a Saved Filter
1. User clicks "Saved Filters" button → popover opens
2. User clicks a saved preset name
3. Popover closes, URL updates to preset's `query`, campaign list re-filters

### Flow 4: Rename a Saved Filter
1. User clicks rename icon (pencil) on a preset in the popover
2. `RenameFilterDialog` opens with current name in input
3. User edits, clicks "Rename"
4. Frontend PUTs to `/api/filters/:id` with `{ name }`
5. On success: list refreshes

### Flow 5: Delete a Saved Filter
1. User clicks delete icon (trash) on a preset
2. `DeleteFilterConfirmation` overlay appears
3. User confirms
4. Frontend DELETEs `/api/filters/:id`
5. On success: list refreshes

---

## Accessibility (ARIA)

- **Dialogs**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title. Focus moves into first input on open. `Escape` closes. Focus returns to trigger button on close.
- **Popover**: Trigger button has `aria-haspopup="dialog"` (or `true`) and `aria-expanded` synced to open state.
- **Icon buttons**: Every icon-only button has an `aria-label` (e.g., "Rename filter", "Delete filter").
- **Filter list**: Preset names are rendered as `<button>` elements so they are naturally keyboard-focusable and activatable.

Sources: WAI-ARIA APG Dialog Modal pattern, WAI-ARIA APG Menu Button pattern.

---

## Data Model

### SavedFilter (Mongoose)

```ts
interface ISavedFilter extends Document {
  userId: Types.ObjectId;
  name: string;
  query: string;           // canonical URLSearchParams string
  filters: FilterClause[]; // structured for future UI display
  createdAt: Date;
  updatedAt: Date;
}
```

### FilterClause (TypeScript)

```ts
type FilterClause =
  | { key: 'status'; op: 'in'; value: string[] }
  | { key: 'dateRange'; op: 'between'; value: { from: string; to: string } }
  | { key: 'budgetTier'; op: 'in'; value: string[] };
```

---

## API Surface

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/filters` | Yes | List saved filters for current user |
| POST | `/api/filters` | Yes | Create a new saved filter preset |
| PUT | `/api/filters/:id` | Yes | Rename an existing preset |
| DELETE | `/api/filters/:id` | Yes | Delete a preset |

---

## State Management

### Zustand Store: `useFiltersStore`

```ts
interface FiltersStore {
  savedFilters: ISavedFilter[];
  isLoading: boolean;
  error: string | null;
  fetchFilters: () => Promise<void>;
  createFilter: (name: string, query: string, filters: FilterClause[]) => Promise<void>;
  updateFilter: (id: string, name: string) => Promise<void>;
  deleteFilter: (id: string) => Promise<void>;
}
```

### Client URL Sync
- `useSearchParams` reads current applied filters.
- `useRouter().replace(pathname + '?' + newQueryString)` updates URL without scrolling.
- `Suspense` boundary required around any client component using `useSearchParams` if the page is statically prerendered.

---

## Styling Conventions

- Tailwind CSS v4 (already configured).
- No shadcn/ui or Radix — all components use raw Tailwind classes matching existing patterns:
  - Rounded cards: `rounded-2xl`
  - Borders: `border border-gray-200 dark:border-gray-700`
  - Primary action: `bg-indigo-600 text-white hover:bg-indigo-700`
  - Danger action: `bg-red-600 text-white hover:bg-red-700`
  - Backdrop: `bg-gray-900/50 backdrop-blur-sm`
  - Dark mode: `dark:` prefix classes (existing convention in dashboard).

---

## File Structure (New & Modified)

```
src/
  lib/
    models/
      SavedFilter.ts          (new)
      Campaign.ts             (+status field)
  app/
    api/
      filters/
        route.ts              (new: GET, POST)
        [id]/
          route.ts            (new: PUT, DELETE)
    dashboard/
      page.tsx                (+FilterToolbar, URL param filtering)
  components/
    dashboard/
      FilterToolbar.tsx       (new)
      StatusFilter.tsx        (new)
      DateRangeFilter.tsx     (new)
      BudgetTierFilter.tsx    (new)
      SavedFiltersPopover.tsx (new)
      SaveFilterDialog.tsx    (new)
      RenameFilterDialog.tsx  (new)
      DeleteFilterConfirmation.tsx (new)
  store/
    filters.ts                (new)
```

---

## Open Questions (to resolve in PRD)
1. Should `status` be added to `Campaign` schema with a one-time migration, or derived dynamically?
2. Should date range filter on `startDate` only, or on a computed active period (`startDate` → `startDate + duration`)?
3. Should the AnalyticsChart also respect the applied filters, or always show all campaigns?

---

## References
- Next.js App Router `searchParams` docs: https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
- Next.js `useSearchParams`: https://nextjs.org/docs/app/api-reference/functions/use-search-params
- Shelf saved-filter-presets.tsx (real-world popover + dialog pattern): https://github.com/Shelf-nu/shelf.nu
- WAI-ARIA APG Dialog Modal: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
