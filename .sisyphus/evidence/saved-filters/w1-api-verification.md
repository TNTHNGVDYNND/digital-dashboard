# Slice 1.3 Evidence: Auth-Scoped Preset API Routes

## Changes
- Created `src/app/api/filters/route.ts` — GET (list user-scoped presets) and POST (create preset)
- Created `src/app/api/filters/[id]/route.ts` — PUT (rename) and DELETE with ownership checks

## Build Verification
```
✓ Compiled successfully in 6.0s
  Running TypeScript ...
  Finished TypeScript in 4.6s ...
✓ Generating static pages using 11 workers (14/14) in 295ms
```

## PRD Compliance
- [x] `GET /api/filters` returns user-scoped presets (uses `auth()`, filters by `session.user.id`)
- [x] `POST /api/filters` creates preset scoped to authenticated user
- [x] `PUT /api/filters/[id]` updates only if owned by user, returns 404 otherwise
- [x] `DELETE /api/filters/[id]` deletes only if owned by user, returns 404 otherwise
- [x] Unauthenticated requests return 401 on all routes
- [x] Server canonicalizes `query` on POST/PUT
- [x] Server derives `filters` from canonical `query`, ignores client-supplied `filters`
- [x] Returns 400 if `query` is malformed or exceeds 512 characters
- [x] Deterministic key order: `status`, `from`, `to`, `tier`
- [x] ISO `YYYY-MM-DD` date validation; rejects `from > to`
- [x] Strips unknown params from query
- [x] Build passes with zero TypeScript errors

## Wiring Check
- `src/app/api/filters/route.ts` imports `SavedFilter` from `@/lib/models/SavedFilter` ✓
- `src/app/api/filters/[id]/route.ts` imports `SavedFilter` from `@/lib/models/SavedFilter` ✓
- Both routes import `auth` from `@/lib/auth` ✓
- Both routes appear in Next.js build output (`/api/filters`, `/api/filters/[id]`) ✓

## Goal-Backward Verification

**Slice Goal:** Authenticated users can CRUD their own presets; cross-user access is rejected; server is the single source of truth for `filters` derivation

| # | Truth (Observable Behavior) | Artifacts | Wiring | Status |
|---|------------------------------|-----------|--------|--------|
| 1 | GET returns only current user's presets | `src/app/api/filters/route.ts` | `find({ userId: session.user.id })` | ✓ VERIFIED |
| 2 | POST stamps userId and canonicalizes query | `src/app/api/filters/route.ts` | `processQuery` helper + `userId: session.user.id` | ✓ VERIFIED |
| 3 | PUT checks ownership before updating | `src/app/api/filters/[id]/route.ts` | `findOneAndUpdate({ _id, userId })` | ✓ VERIFIED |
| 4 | DELETE checks ownership before deleting | `src/app/api/filters/[id]/route.ts` | `deleteOne({ _id, userId })` | ✓ VERIFIED |
| 5 | Unauthenticated requests get 401 | Both route files | `if (!session?.user?.id) return 401` | ✓ VERIFIED |
| 6 | Cross-user access returns 404 | Both route files | Ownership check returns 404 on miss | ✓ VERIFIED |
| 7 | Malformed/oversized query returns 400 | Both route files | `processQuery` returns null → 400 | ✓ VERIFIED |
| 8 | Server derives filters from query, ignores client filters | Both route files | `processQuery` generates `filters` from parsed query | ✓ VERIFIED |

**Anti-patterns:** None

**Overall Status:** passed
