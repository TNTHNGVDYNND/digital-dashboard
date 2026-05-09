# Saved Filters Feature — Product Requirements Document

## Problem Statement

The Dashboard at `src/app/dashboard/page.tsx` currently renders every campaign for the authenticated user with no built-in filtering or saved-view workflow. Users who regularly inspect the same subsets of campaigns — for example active premium campaigns starting this month — must manually scan the full list and chart every time.

This creates three product gaps:

1. **Low retrieval speed** — users cannot quickly narrow the dashboard to the campaigns they care about.
2. **No repeatable workflow** — users cannot save common filter combinations and reapply them later.
3. **No shareable state** — dashboard state is not encoded in the URL, so refresh/back-navigation loses context.

The feature must add URL-synced filters for status, start-date range, and budget tier; persist named presets in MongoDB; and preserve the existing dashboard architecture and visual language already used across the app.

## Solution Overview

Saved Filters adds a URL-first filtering layer to the authenticated dashboard experience and a backend-backed preset system for named reuse.

### End State

- `src/lib/models/Campaign.ts` includes an explicit `status` enum with default `'active'`.
- Existing campaigns missing `status` are backfilled at deploy time via an idempotent server-side script in `scripts/backfill-status.ts` with audit logging.
- `src/app/dashboard/page.tsx` reads filter state from URL search params and derives a single filtered campaign dataset.
- `src/components/dashboard/FilterToolbar.tsx` exposes single-select status, start-date range, and single-select budget tier controls.
- `src/components/dashboard/SavedFiltersPopover.tsx` lists the current user’s saved presets.
- `src/components/dashboard/SaveFilterDialog.tsx`, `RenameFilterDialog.tsx`, and `DeleteFilterConfirmation.tsx` reuse the app’s Tailwind modal/overlay patterns rather than adding shadcn or Radix.
- `src/app/api/filters/route.ts` and `src/app/api/filters/[id]/route.ts` persist presets in MongoDB with strict user scoping via `auth()` from `src/lib/auth.ts`.
- `src/store/filters.ts` owns saved-filter CRUD state and network actions with per-action pending states so the list stays visible during mutations.
- The campaign list and `src/components/dashboard/AnalyticsChart.tsx` both consume the same filtered campaign array so the visualized data always matches the visible rows.

### MVP Scope

The smallest useful version includes:

- One dashboard toolbar
- URL-synced applied filters
- Single-select status filter
- Start-date range filter using `from` and `to`
- Single-select budget tier filter
- Save current filters as a named preset
- Apply preset from a popover
- Rename preset
- Delete preset with confirmation
- Dark mode parity
- Auth-protected, user-scoped preset storage

### Explicit MVP Limitations

- **Status is initially system/default-driven; no campaign edit UI changes status in MVP.**
- **All new campaigns default to `active`.**
- **Existing campaigns are backfilled to `active` at deploy time via `scripts/backfill-status.ts`.**
- **Status editing is deferred to a follow-on scope.**
- **Status and tier are single-select in MVP even though the backend clause model can support arrays later.**

### Foundation Phase — Schema & API (Prerequisite)

This work is required before user-visible slices ship, but it is not itself counted as a user-visible vertical slice:

- Add `status` enum + default to `Campaign`.
- Create `SavedFilter` schema.
- Add auth-scoped preset API routes.
- Add deploy-time `scripts/backfill-status.ts` with idempotency and audit logging.
- Define canonical query parsing/serialization helpers and reject invalid date ranges before save/apply.

### Recommended Vertical Slices

| Slice | Name | Outcome |
|---|---|---|
| 1 | URL-synced filtering + toolbar | Toolbar controls update URL and derive a single filtered dataset for both list and chart |
| 2 | Preset create/apply | Users save the current canonical filter query and reapply it from a popover |
| 3 | Preset management + hardening | Rename/delete flows, filtered-empty state, accessibility mechanics, dark mode, verification |

### Mid-Build Architecture Checkpoint

After Vertical Slice 1, pause and verify:

- URL search params are the sole source of truth for applied filters.
- `src/app/dashboard/page.tsx` computes one filtered array and passes it to both the list and `AnalyticsChart`.
- No component performs inline preset `fetch` calls; all preset network mutations remain centralized in `src/store/filters.ts`.
- Existing auth scoping (`auth()` + `session.user.id`) is preserved for all new routes.
- MVP semantics remain single-select for `status` and `tier`; no repeated query params are introduced.

## User Stories

### Foundation Phase — Schema & API (Prerequisite)

1. **As an authenticated dashboard user, I want every campaign to have an explicit status value, so that status filtering is deterministic and not inferred from fragile date math.**
   - Testable outcome: newly created campaigns default to `active`, and backfilled campaigns display `active` in MVP.

2. **As an authenticated user, I want saved filters persisted to MongoDB under my account, so that presets are available across devices and sessions.**
   - Testable outcome: `GET /api/filters` returns only presets where `userId === session.user.id`.

3. **As an authenticated user, I want saved-filter create, update, and delete routes to reject cross-user access, so that my presets remain private.**
   - Testable outcome: unauthenticated requests return `401`; valid users cannot read, rename, or delete another user’s preset by ID.

### Vertical Slice 1 — URL-Synced Filtering + Toolbar

4. **As a dashboard user, I want to filter campaigns by a single status, a start-date range, and a single budget tier from a toolbar, so that I can focus on the campaigns relevant to my task.**
   - Testable outcome: toolbar controls update the rendered campaign count without a full page reload.

5. **As a dashboard user, I want applied filters encoded in the dashboard URL, so that refresh, back/forward navigation, and copied links preserve the same filtered view.**
   - Testable outcome: loading `/dashboard` with canonical filter params reproduces the same filtered list and chart state.

6. **As a dashboard user, I want the analytics chart and campaign list to use the same filtered dataset, so that metrics never contradict the visible campaigns.**
   - Testable outcome: when filters reduce the list, `AnalyticsChart` shows data only for the same filtered campaigns.

7. **As a dashboard user, I want a distinct filtered empty state when no campaigns match my current filters, so that I know the system is working and can reset quickly.**
   - Testable outcome: when filters yield zero results, the page shows `No campaigns match the current filters` with a `Clear all filters` action that resets URL params.

### Vertical Slice 2 — Preset Create and Apply

8. **As a dashboard user, I want to save the currently applied filters as a named preset, so that I can quickly return to a repeated working view.**
   - Testable outcome: saving from the dialog creates a new preset row in MongoDB and it appears in the popover without a full refresh.

9. **As a dashboard user, I want to open a saved-filters popover and apply a preset with one click, so that the dashboard instantly switches to a known filter configuration.**
   - Testable outcome: clicking a preset closes the popover and updates the URL query string to the preset’s canonical filter query.

10. **As a dashboard user, I want preset names validated before save, so that my preset list stays readable and avoids empty or invalid entries.**
    - Testable outcome: blank names, whitespace-only names, overlength names, and invalid date ranges (`from > to`) are rejected with inline error feedback before mutation is sent.

### Vertical Slice 3 — Preset Management + Hardening

11. **As a dashboard user, I want to rename a saved preset, so that its label can evolve with my workflow without recreating it.**
    - Testable outcome: the rename dialog opens with the existing name and updates only the preset name on success while the list remains visible.

12. **As a dashboard user, I want a confirmation step before deleting a preset, so that I do not accidentally remove a useful saved view.**
    - Testable outcome: delete requires explicit confirmation and removes the preset from both UI state and the backend record while the list remains visible.

13. **As a keyboard and dark-mode user, I want every saved-filter control to remain accessible and visually consistent, so that the feature works with the rest of the dashboard experience.**
    - Testable outcome: dialogs trap focus, `Escape` closes overlays, focus returns to the trigger, popover rows support keyboard navigation, icon buttons have ARIA labels, and all new UI renders correctly in light and dark themes.

## Design Requirements

This feature is UI-visible and must conform to `DESIGN.md`.

### Source of Design Truth

- Primary design reference: `/home/vladi/developer/digital-dashboard/DESIGN.md`
- Existing component references:
  - `src/components/dashboard/CampaignEditModal.tsx`
  - `src/components/dashboard/CampaignDeleteModal.tsx`
  - `src/components/dashboard/AnalyticsChart.tsx`
  - `src/app/dashboard/page.tsx`

### Visual Constraints

- Use existing Tailwind-first dashboard styling; do **not** introduce shadcn/ui, Radix, or a new modal library.
- Reuse existing shape and border language:
  - `rounded-2xl`
  - `border border-gray-200 dark:border-gray-700` or `dark:border-gray-800`
  - Indigo primary action styles matching the dashboard/login screens
  - Destructive action styles matching `CampaignDeleteModal`
- Overlay/backdrop patterns should align with current modals:
  - `bg-gray-900/50 backdrop-blur-sm` for dashboard-style dialogs
- Dark mode must be implemented with existing `dark:` utility conventions already used in `src/app/dashboard/page.tsx`, `CampaignEditModal.tsx`, and `CampaignDeleteModal.tsx`.

### Component and Interaction Requirements

- `FilterToolbar` sits above the campaign list and below the page header.
- `StatusFilter` and `BudgetTierFilter` are single-select controls in MVP and use compact segmented buttons or select-like controls consistent with existing Tailwind button styling.
- `DateRangeFilter` uses two native date inputs for predictable browser behavior.
- `SavedFiltersPopover` must visually separate “apply preset” from destructive actions.
- `SaveFilterDialog`, `RenameFilterDialog`, and `DeleteFilterConfirmation` must mirror existing modal composition: centered card, explicit cancel/confirm actions, disabled loading states.
- No campaign-edit flow updates `status` in MVP; status is model/backfill-driven only.

### Responsive Behavior

- On desktop, toolbar controls may sit in a single row with wrapping.
- On tablet/mobile, controls may stack vertically, but preset save/apply actions must remain visible without horizontal overflow.
- The popover must remain reachable on smaller viewports and fall back to a full-width anchored panel if necessary.

### Accessibility Requirements

- This feature is **library-free** for overlays and popovers; accessibility mechanics must be implemented directly in React/Tailwind code rather than via Radix/shadcn.
- Dialogs: `role="dialog"`, `aria-modal="true"`, labeled title, initial focus in the first actionable/input element, `Escape` to close, focus return to trigger.
- Dialog focus trap must be implemented with `useEffect` + `ref`-based focus management.
- `Escape` close handling must be implemented with a `useEffect` keydown listener scoped to the open overlay.
- Focus return must restore the trigger via stored `document.activeElement` captured before opening.
- Popover trigger: `aria-haspopup`, `aria-expanded`, and keyboard toggle support.
- Popover keyboard navigation must support Arrow Up/Down movement across preset rows and `Enter` to apply the focused preset.
- Icon-only buttons: required `aria-label` values such as `Rename filter` and `Delete filter`.
- Preset list rows: preset apply affordance must be a native `<button>`.
- Error text for validation failures must be announced and visually associated with the field.

### Anti-Patterns to Avoid

- No localStorage-backed preset persistence.
- No inline `fetch` calls inside presentational components.
- No hidden filter state that diverges from URL search params.
- No chart behavior that ignores applied filters while the list changes.
- No light-theme-only styling.

## Implementation Decisions

### File and Module Scope

#### Existing files to modify

- `src/lib/models/Campaign.ts`
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/AnalyticsChart.tsx` (only if a prop or empty-state adjustment is needed)

#### New files to add

- `src/lib/models/SavedFilter.ts`
- `src/app/api/filters/route.ts`
- `src/app/api/filters/[id]/route.ts`
- `src/components/dashboard/FilterToolbar.tsx`
- `src/components/dashboard/StatusFilter.tsx`
- `src/components/dashboard/DateRangeFilter.tsx`
- `src/components/dashboard/BudgetTierFilter.tsx`
- `src/components/dashboard/SavedFiltersPopover.tsx`
- `src/components/dashboard/SaveFilterDialog.tsx`
- `src/components/dashboard/RenameFilterDialog.tsx`
- `src/components/dashboard/DeleteFilterConfirmation.tsx`
- `src/store/filters.ts`
- `scripts/backfill-status.ts`

### Module Boundaries

| Module | Interface (small) | Hides (large) |
|---|---|---|
| `src/lib/models/Campaign.ts` | `ICampaign`, `status` enum, schema default | Mongo schema internals, migration-safe defaults |
| `src/lib/models/SavedFilter.ts` | `ISavedFilter`, canonical preset shape | Mongo indexes, validation rules, timestamps |
| `src/app/api/filters/route.ts` | `GET`, `POST` | auth/session lookup, DB connection, payload validation, sort order |
| `src/app/api/filters/[id]/route.ts` | `PUT`, `DELETE` | ownership checks, not-found handling, mutation errors |
| `src/store/filters.ts` | `fetchFilters`, `createFilter`, `updateFilter`, `deleteFilter`, `isFetchingList`, `pendingAction`, `pendingById`, `error` | request lifecycles, local updates, error string normalization, per-row pending state |
| `src/components/dashboard/FilterToolbar.tsx` | toolbar props + callbacks | control layout, responsive wrapping, button state rendering |
| `src/components/dashboard/SavedFiltersPopover.tsx` | open/apply/select callbacks | list rendering, icon actions, empty state, focus behavior, keyboard navigation |
| `src/app/dashboard/page.tsx` | page composition, filtered dataset derivation | search-param parsing, canonical query generation, modal orchestration |
| `scripts/backfill-status.ts` | deploy-time backfill entrypoint | idempotent batch update, audit logging, rollout reporting |

### Data Contracts

#### Campaign status

- Add `status` to `ICampaign` and `CampaignSchema` in `src/lib/models/Campaign.ts`.
- Allowed values: `draft | active | paused | completed`.
- Default for new writes: `active`.
- MVP limitation: status is initially system/default-driven only; no campaign edit UI changes status in this scope.
- Legacy documents without `status` are backfilled to `active` at deploy time via `scripts/backfill-status.ts`.

#### Status backfill rollout plan

- `scripts/backfill-status.ts` must be **idempotent**: rerunning it only updates documents missing `status`.
- The script must emit **audit logging**: start time, end time, matched count, modified count, and any failures.
- Deploy sequence:
  1. Ship schema default `status: 'active'`.
  2. Run `scripts/backfill-status.ts` during deploy/rollout.
  3. Confirm audit logs show all missing-status campaigns were updated.
- Success criteria:
  - New campaigns created after deploy store `status: 'active'` by default.
  - Existing campaigns missing `status` are updated to `active`.
  - Backfilled campaigns display as `active` in the dashboard.
  - Re-running the script produces zero harmful duplicate effects.
- Rollback plan:
  - If the script misbehaves, stop the rollout and disable the saved-filters status UI before exposing it.
  - Because the backfill only writes missing values to `active`, rollback consists of removing or ignoring the new filter surface while preserving safe data defaults.
  - Keep audit logs so any touched records can be reviewed before retrying.

#### SavedFilter model

Recommended persisted shape in `src/lib/models/SavedFilter.ts`:

```ts
interface ISavedFilter extends Document {
  userId: Types.ObjectId;
  name: string;
  query: string;
  filters: FilterClause[];
  createdAt: Date;
  updatedAt: Date;
}
```

Recommended clause shape:

```ts
type FilterClause =
  | { key: 'status'; op: 'in'; value: string[] }
  | { key: 'dateRange'; op: 'between'; value: { from: string; to: string } }
  | { key: 'budgetTier'; op: 'in'; value: string[] };
```

- Backend `FilterClause` stays array-capable for future expansion.
- MVP UI remains single-select for `status` and `budgetTier`, so only one value per key is emitted into the canonical query string.

#### Saved filters store contract

`src/store/filters.ts` must support per-action pending state rather than a single global loading flag.

Recommended shape:

```ts
type PendingById = Record<string, 'rename' | 'delete'>;

interface SavedFiltersState {
  filters: ISavedFilter[];
  isFetchingList: boolean;
  pendingAction: 'create' | null;
  pendingById: PendingById;
  error: string | null;
  fetchFilters: () => Promise<void>;
  createFilter: (input: CreateSavedFilterInput) => Promise<void>;
  updateFilter: (id: string, input: UpdateSavedFilterInput) => Promise<void>;
  deleteFilter: (id: string) => Promise<void>;
}
```

Store behavior requirements:

- Keep the saved-filters list visible during create, rename, and delete mutations.
- Only disable the active submit control or active row action.
- Preserve current list contents when a mutation fails and surface `error` inline.
- `isFetchingList` is reserved for initial/refetch loading, not for every mutation.

#### Canonical query contract

Applied filters must serialize into a stable URLSearchParams string so preset application reproduces the exact view.

Recommended canonical keys:

- `status`
- `from`
- `to`
- `tier`

Canonicalization rules:

- Omit empty keys entirely.
- Store date values as ISO `YYYY-MM-DD` strings.
- Preserve deterministic key order: `status`, `from`, `to`, `tier`.
- Trim preset names before write.
- Strip unknown params before persisting a preset query.
- Reject invalid ranges (`from > to`) in the UI before save/apply.
- MVP uses a single value per key; repeated params are not supported.

Canonical URL examples:

- Valid: `/dashboard?status=active&from=2026-05-01&to=2026-05-31&tier=premium`
- Invalid: `/dashboard?status=active&from=2026-05-31&to=2026-05-01&tier=premium` is rejected in the UI before save and is not persisted.
- Unknown params are stripped from the saved preset query before write.
- MVP never stores repeated params such as `?status=active&status=paused`.

### Operational Constraints

- **Content boundaries**
  - Preset name: 1–50 visible characters after trim.
  - Query string persisted in MongoDB must be capped (recommended max 512 chars) to prevent malformed oversized payloads.
  - Only supported keys may be saved or applied; unknown query params are ignored for filtering and excluded from saved canonical queries.
- **Metric normalization**
  - No new analytics math is introduced; `AnalyticsChart` continues to derive from the filtered campaign collection already accepted as a prop.
- **Latency contract**
  - URL filter application should feel immediate because it is client-side derivation over an already-fetched campaign array.
  - Preset CRUD actions should show per-action disabled/loading states and inline error text if the request exceeds expected latency.
- **Rate-limit / retry behavior**
  - Preset APIs should return explicit error JSON on failure; UI should not retry destructively by default.
  - Repeated save clicks must be prevented with disabled submit states.
- **State persistence contract**
  - Applied filters persist in URL only.
  - Named presets persist in MongoDB only.
  - Ephemeral UI state (popover open, dialog open, form draft, pending action) lives in component state and/or `src/store/filters.ts`.
- **Error boundaries**
  - Auth failure: return `401` JSON from preset APIs.
  - Ownership failure / missing document: `404` without leaking whether another user owns the ID.
  - Validation failure: `400` with field-safe message.
  - UI failure state: preserve the currently visible list/popover while surfacing the mutation error.
  - Filtered empty state: if filters yield zero results, show `No campaigns match the current filters` with a `Clear all filters` action that removes canonical URL params.

### Architecture Rules

- No shared package extraction is required for this feature.
- No component may perform inline API calls for preset CRUD; those calls must be centralized in `src/store/filters.ts`.
- Existing campaign retrieval can remain in `src/hooks/useCampaigns.ts` with SWR.
- Saved filters should follow the existing backend-backed CRUD pattern used by `src/store/templates.ts` and `src/app/api/templates/*`, while intentionally deviating from the templates store’s single global `isLoading` pattern.
- The dashboard page must compute the filtered campaigns once and pass the result downward.

### Decision Log

#### Decision 1 — Add explicit `status` to Campaign
- **What:** Extend `src/lib/models/Campaign.ts` with a persisted `status` enum and default `'active'`.
- **Why:** Status-based filtering is a core product requirement, and deriving status from `startDate + duration` is brittle for paused campaigns, drafts, and manual overrides.
- **Alternative considered:** Derive status dynamically from dates.
- **Conditions:** This is the right choice while campaign lifecycle states are user-visible and filterable.
- **Escape plan:** If lifecycle state later becomes fully computed, keep the field temporarily, add read-time derivation parity checks, then migrate consumers off the persisted field.
- **Validation signals:** Users can filter reliably by status; legacy campaigns backfill cleanly; no dashboard branch has to infer special-case status.
- **Challenged instinct:** “We can save time by deriving status from dates.” That shortcut breaks as soon as paused/completed are not pure calendar math.

#### Decision 2 — URL-first applied filters, backend-backed presets
- **What:** Keep current applied filters in URL search params and persist named presets in MongoDB.
- **Why:** The URL is the correct source of truth for shareable, refresh-safe dashboard state; MongoDB is the correct source of truth for reusable named presets across devices.
- **Alternative considered:** Store both applied filters and presets in localStorage or Zustand only.
- **Conditions:** This stays correct while the dashboard remains a routed App Router page and saved presets must follow the user across sessions.
- **Escape plan:** If filters ever need server-side prefetching or team sharing, preserve the URL layer and extend the backend schema rather than collapsing back to local-only state.
- **Validation signals:** Refresh/back navigation preserves applied filters; a user signs in on another device and still sees saved presets.
- **Challenged instinct:** “One store can own everything.” Mixing transient applied state and persisted presets would blur responsibilities and weaken shareability.

#### Decision 3 — Persist both canonical `query` and structured `filters`
- **What:** Store a canonical query string plus structured `FilterClause[]` on each preset.
- **Why:** `query` enables exact reapplication to the URL; structured filters preserve future readability for UI chips, summaries, and migrations.
- **Alternative considered:** Store only the query string or only a nested JSON object.
- **Conditions:** This is the right tradeoff while the feature needs exact URL replay today and likely richer preset presentation later.
- **Escape plan:** If dual storage becomes redundant, keep `query` authoritative, backfill structured fields on read, then simplify the schema in a later migration.
- **Validation signals:** Applying a preset reproduces the exact URL state, and preset rows can display human-readable summaries without reparsing ad hoc strings.
- **Challenged instinct:** “Only store what we use immediately.” Minimal schemas can create avoidable migration cost when the UI needs richer filter summaries.
- **Reconciliation rule:** `query` is authoritative. On write, the server regenerates `filters` from `query`. If the client sends mismatched `query` and `filters`, the server ignores `filters` and derives from `query`.

#### Decision 4 — Reuse NextAuth route scoping and existing API patterns
- **What:** Implement preset APIs with `auth()` from `src/lib/auth.ts`, `session.user.id` from `src/types/next-auth.d.ts`, and user-scoped queries mirroring `src/app/api/templates/route.ts` and `src/app/api/templates/[id]/route.ts`.
- **Why:** The project already has a working auth and route pattern; matching it reduces risk and keeps behavior predictable.
- **Alternative considered:** Introduce a new auth abstraction or rely only on dashboard page protection.
- **Conditions:** This remains correct while auth continues to use NextAuth v5 sessions and all preset routes are private user data.
- **Escape plan:** If auth infrastructure changes later, preserve the route-level ownership checks and swap the session provider behind that boundary.
- **Validation signals:** Unauthenticated requests fail consistently; cross-user preset IDs never resolve; route handlers remain short and familiar.
- **Challenged instinct:** “The dashboard is already protected, so APIs are safe.” Client route protection never replaces per-route authorization.

#### Decision 5 — Tailwind overlays only; no new component library
- **What:** Build save/rename/delete surfaces with the same Tailwind overlay/card pattern already used by `CampaignEditModal.tsx` and `CampaignDeleteModal.tsx`, and implement focus/keyboard mechanics directly.
- **Why:** The app already has a visual language and implementation precedent; new UI dependencies would increase bundle, styling drift, and review surface for a small feature.
- **Alternative considered:** Introduce shadcn/ui or another dialog/popover library.
- **Conditions:** This is appropriate while the modal/popover interaction model stays modest and custom accessibility requirements remain manageable.
- **Escape plan:** If the dashboard accumulates many advanced overlays later, a dedicated abstraction can be introduced then and existing dialogs migrated together.
- **Validation signals:** New dialogs feel visually native, support dark mode, and do not add dependency churn.
- **Challenged instinct:** “A library will be faster.” For one feature in an established Tailwind codebase, integration cost can exceed the saved implementation time.

#### Decision 6 — Keep campaigns in SWR; manage presets in Zustand with per-action pending state
- **What:** Continue reading campaigns through `src/hooks/useCampaigns.ts` (SWR) while using `src/store/filters.ts` for preset CRUD state and mutations with `isFetchingList`, `pendingAction`, `pendingById`, and `error`.
- **Why:** Campaign fetching already works with SWR; presets need action-oriented orchestration without blanking the list during row-level mutations.
- **Alternative considered:** Reuse the templates store’s single global `isLoading` or move everything to one data layer.
- **Conditions:** This is the right split while campaigns are read-heavy collection data and presets need explicit create/update/delete commands plus row-level pending UX.
- **Escape plan:** If duplication between SWR and Zustand becomes painful, converge around a single data layer later, but only after measuring real maintenance cost.
- **Validation signals:** Campaign loading logic stays untouched, preset UI remains simple, and rename/delete actions do not hide the current list.
- **Challenged instinct:** “Consistency means one loading flag everywhere.” Row-level actions need more precise feedback than a single global spinner.

## Testing Decisions

### Feedback Loops

- **Primary verification:** `npm run build` must pass.
- **Static safety:** TypeScript coverage is enforced through Next build.
- **Route verification:** manual API checks for authenticated vs unauthenticated behavior on `/api/filters` and `/api/filters/:id`.
- **Operational verification:** run `scripts/backfill-status.ts` against relevant data and inspect audit logs.
- **UI verification:** manual dashboard walkthrough for filter application, preset CRUD, filtered-empty state, and URL persistence.

### TDD / Change Sequence

Recommended order:

1. Add `status` schema field with default `active`.
2. Add `scripts/backfill-status.ts` with idempotent audit-logged backfill behavior.
3. Add `SavedFilter` schema and API routes.
4. Add `src/store/filters.ts` with per-action pending state.
5. Add pure filter parsing/serialization helpers near the dashboard surface.
6. Wire `FilterToolbar` and filtered dataset derivation into `src/app/dashboard/page.tsx`.
7. Add save/apply/rename/delete dialogs and popover.
8. Run architecture checkpoint.
9. Run full build and manual QA.

### Manual QA Checkpoints

1. **Status default + backfill**
   - New campaigns created after deploy store and display `status: active` by default.
   - Existing campaigns missing `status` appear as `active` after running `scripts/backfill-status.ts`.
   - Re-running the script does not produce harmful duplicate effects.
2. **URL persistence**
   - Apply filters, refresh, and confirm identical results.
   - Copy URL into a new tab and confirm identical results.
   - Use back/forward and confirm filter state changes correctly.
   - Confirm canonical query ordering stays `status`, `from`, `to`, `tier`.
3. **Date validation**
   - Set `from > to` and confirm the UI blocks save/apply with inline feedback.
4. **Dataset consistency**
   - Confirm chart and campaign rows stay in sync under every filter combination.
   - Confirm status and tier behave as single-select inputs in MVP.
5. **Filtered empty state**
   - Apply filters that return zero campaigns and confirm the page shows `No campaigns match the current filters` plus `Clear all filters`.
   - Confirm `Clear all filters` removes canonical URL params.
6. **Preset lifecycle**
   - Save a preset.
   - Apply it from the popover.
   - Rename it.
   - Delete it.
   - Confirm list contents remain visible during each mutation.
7. **Security**
   - Verify unauthenticated API access returns `401`.
   - Verify one user cannot mutate another user’s preset by ID.
8. **Accessibility**
   - Keyboard open/close for popover and dialogs.
   - Focus trap works inside each dialog.
   - Focus returns to the trigger after close.
   - `Escape` closes overlays.
   - Arrow keys move through preset rows and `Enter` applies the focused preset.
   - Screen-reader labels exist for icon-only actions.
9. **Dark mode**
   - Confirm toolbar, popover, dialogs, text contrast, and hover states in dark theme.

### Regression Areas

- Dashboard load and empty state rendering in `src/app/dashboard/page.tsx`
- `AnalyticsChart` rendering when filtered list becomes empty or small
- Template management section beneath the campaigns area
- Existing campaign edit/delete flows
- Deploy-time `scripts/backfill-status.ts` behavior and audit output

## Out of Scope

- Sharing presets between users or teams
- Public preset links beyond the existing copied dashboard URL
- Advanced boolean query building (AND/OR groups, nested clauses, arbitrary fields)
- Multi-select status or multi-select budget tier in MVP
- Status editing UI on campaign create/edit flows
- Preset analytics, usage counts, favorites, or sorting by popularity
- Cross-page filter reuse outside `/dashboard`
- New design system dependencies or a shared overlay framework rewrite
- Server-side query filtering against MongoDB for campaigns; MVP filtering can operate on the already-fetched user campaign array

## Open Questions / Risks

1. **Date-range semantics**
   - MVP is locked to `startDate` filtering via `from` / `to`. This is simpler and consistent, but it does not represent “campaign active during period” semantics for long-running campaigns. Recommendation: document the behavior in UI copy if confusion emerges.

2. **Query drift risk**
   - If components independently parse or mutate search params, bugs may appear where saved presets no longer round-trip exactly. Recommendation: centralize parse/serialize helpers and treat canonical query generation as a tested boundary.

3. **Large dashboard lists**
   - Client-side filtering over the already-fetched campaign array is acceptable for MVP, but if campaign counts grow substantially, server-side filtering may become necessary. Recommendation: monitor dataset size after rollout rather than prematurely pushing filtering into the campaigns API.
