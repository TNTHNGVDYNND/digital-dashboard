# Slice 2.5 Evidence: Architecture Checkpoint

**Date:** 2026-05-09
**Slice:** 2.5

## Build Verification
- Command: `npm run build`
- Result: PASS (compiled successfully, TypeScript clean)

## Architecture Verification

### 1. URL search params are the sole source of truth for applied filters
- **Evidence:** `src/app/dashboard/page.tsx` lines 4, 34, 51
- `useSearchParams` from `next/navigation` reads current params
- `parseFilterQuery(searchParams)` derives filter state
- `serializeFilterQuery(next)` writes canonical params back to URL
- No other state (useState, Zustand, etc.) stores applied filters
- **Status:** ✓ PASS

### 2. `src/app/dashboard/page.tsx` computes one filtered array and passes it to both list and AnalyticsChart
- **Evidence:** `src/app/dashboard/page.tsx` lines 53-61, 158, 164-166
- `filteredCampaigns` computed once via `useMemo` with `applyFilters` helper
- `AnalyticsChart campaigns={filteredCampaigns}`
- Campaign list maps over `filteredCampaigns`
- **Status:** ✓ PASS

### 3. `src/app/dashboard/page.tsx` uses `src/store/filters.ts` for preset data and mutations; no inline preset `fetch` calls in any component
- **Evidence:** Grep for `fetch(.*api/filters` across `src/`
- All 4 occurrences are in `src/store/filters.ts` only
- No component file contains `fetch('/api/filters')`
- **Status:** ✓ PASS

### 4. Existing auth scoping is preserved
- **Evidence:** `src/app/api/filters/route.ts` and `src/app/api/filters/[id]/route.ts`
- All routes call `auth()` and check `session.user.id`
- GET scopes to `userId: session.user.id`
- POST sets `userId: session.user.id`
- PUT uses `findOneAndUpdate({ _id, userId })`
- DELETE uses `deleteOne({ _id, userId })`
- **Status:** ✓ PASS

### 5. MVP semantics remain single-select for `status` and `tier`; no repeated query params
- **Evidence:** `src/lib/filters/query.ts` lines 3, 43-52
- `CANONICAL_KEYS = ['status', 'from', 'to', 'tier']`
- `serializeFilterQuery` omits empty keys and uses deterministic order
- `parseFilterQuery` strips unknown keys
- `URLSearchParams.get(key)` returns single value, not array
- **Status:** ✓ PASS

## Summary
All architecture invariants verified. Foundation is solid for Wave 3 (Preset Create / Apply).
