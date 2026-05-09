# Slice 2.2 Evidence: FilterToolbar + URL Sync

**Date:** 2026-05-09
**Slice:** 2.2

## Build Verification
- Command: `npm run build`
- Result: PASS (compiled successfully, TypeScript clean, static pages generated)

## Files Created
- `src/components/dashboard/FilterToolbar.tsx`

## Files Modified
- `src/app/dashboard/page.tsx`

## PRD Compliance Checklist
- [x] FilterToolbar composes StatusFilter, DateRangeFilter, BudgetTierFilter
- [x] FilterToolbar sits above campaign list, below page header
- [x] Responsive layout: single row desktop (`sm:flex-row`), vertical stack mobile (`flex-col`)
- [x] page.tsx reads filter state from URL search params via `useSearchParams`
- [x] page.tsx derives single filtered campaign array using canonical query helpers
- [x] Filtered array passed to both campaign list and AnalyticsChart
- [x] URL updates via `useRouter().replace()` with canonical key order
- [x] `scroll: false` passed to `router.replace()` to avoid scroll jumps
- [x] Campaigns without `startDate` excluded when any date range filter is active
- [x] Popover state (`isPopoverOpen`) owned by page.tsx for future waves
- [x] No inline fetches in components

## Wiring Check
- `FilterToolbar` imported and rendered in `page.tsx`
- `AnalyticsChart` receives `filteredCampaigns` instead of raw `campaigns`
- Campaign list renders `filteredCampaigns`
- `parseFilterQuery` and `serializeFilterQuery` imported from `@/lib/filters/query`

## Deviation Notes
- Filtered empty state (Slice 2.3) was implemented inline during this slice because without it, a zero-result filter would show the "No campaigns yet" empty state intended for users with no campaigns at all, which is incorrect UX. This is a Rule 2 auto-fix (missing critical functionality for correctness).
