# Issue 01: Vertical Slice 1 — URL-Synced Filtering + Toolbar

> **Type:** AFK  
> **Blockers:** `00-foundation-phase`  
> **PRD Reference:** `.sisyphus/prds/saved-filters-prd.md` — Vertical Slice 1 section  
> **Estimated Complexity:** Medium

---

## Description

Add a URL-first filtering layer to the authenticated dashboard. Users can filter campaigns by status, start-date range, and budget tier from a toolbar. Applied filters are encoded in the URL so refresh, back/forward, and copied links preserve state. The campaign list and analytics chart must consume the same filtered dataset.

---

## Acceptance Criteria

- [ ] `src/components/dashboard/FilterToolbar.tsx` created and sits above the campaign list, below the page header.
- [ ] `src/components/dashboard/StatusFilter.tsx` created: single-select control for `draft | active | paused | completed`.
- [ ] `src/components/dashboard/DateRangeFilter.tsx` created: two native date inputs (`from` and `to`) with validation that rejects `from > to`.
- [ ] `src/components/dashboard/BudgetTierFilter.tsx` created: single-select control for budget tier.
- [ ] `src/app/dashboard/page.tsx` updated to:
  - Read filter state from URL search params on mount and on param changes.
  - Derive a single filtered campaign array using the canonical query helpers.
  - Pass the filtered array to both the campaign list and `AnalyticsChart`.
  - Generate canonical query string for the current applied filters.
- [ ] URL search params are the **sole source of truth** for applied filters; no hidden filter state diverges from the URL.
- [ ] Filtered empty state implemented: when filters yield zero campaigns, display `No campaigns match the current filters` with a `Clear all filters` action that removes all canonical URL params.
- [ ] Toolbar controls update the rendered campaign count and chart without a full page reload.
- [ ] Loading `/dashboard?status=active&from=2026-05-01&to=2026-05-31&tier=premium` reproduces the same filtered list and chart state.
- [ ] `npm run build` passes.
- [ ] Manual QA: chart and campaign rows stay in sync under every filter combination.

---

## Files to Create / Modify

### Modify
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/AnalyticsChart.tsx` (only if prop or empty-state adjustment needed)

### Create
- `src/components/dashboard/FilterToolbar.tsx`
- `src/components/dashboard/StatusFilter.tsx`
- `src/components/dashboard/DateRangeFilter.tsx`
- `src/components/dashboard/BudgetTierFilter.tsx`

---

## Verification Steps

1. Run `npm run build` — must pass.
2. Open `/dashboard` and apply each filter individually and in combination.
3. Confirm URL updates correctly with canonical key order (`status`, `from`, `to`, `tier`).
4. Refresh the page and confirm identical filtered results.
5. Copy URL to a new tab and confirm identical results.
6. Use browser back/forward and confirm filter state changes correctly.
7. Apply filters that yield zero campaigns and confirm the filtered empty state with `Clear all filters`.
8. Verify `AnalyticsChart` updates to reflect only the filtered campaigns.

---

## Architecture Checkpoint (Post-Slice)

After this slice is complete, pause and verify:

- [ ] URL search params are the sole source of truth for applied filters.
- [ ] `src/app/dashboard/page.tsx` computes one filtered array and passes it to both the list and `AnalyticsChart`.
- [ ] No component performs inline preset `fetch` calls.
- [ ] Existing auth scoping is preserved.
- [ ] MVP semantics remain single-select for `status` and `tier`; no repeated query params.

---

## Notes

- Reuse existing Tailwind-first dashboard styling; do not introduce shadcn/ui or Radix.
- Status and tier are single-select in MVP even though the backend clause model supports arrays later.
- The toolbar should be responsive: single row on desktop, vertical stack on mobile.
- This slice intentionally does **not** include preset save/apply UI; that is Slice 2.
