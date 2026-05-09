# Issue 00: Foundation Phase — Schema & API (Prerequisite)

> **Type:** AFK  
> **Blockers:** None  
> **PRD Reference:** `.sisyphus/prds/saved-filters-prd.md` — Foundation Phase section  
> **Estimated Complexity:** Medium

---

## Description

Lay the data and API foundation required before any user-visible saved-filters UI can ship. This slice covers schema changes, backend routes, deploy-time backfill, and canonical query helpers. It produces no dashboard UI changes but must be fully verified before Slice 1 begins.

---

## Acceptance Criteria

- [ ] `src/lib/models/Campaign.ts` extended with `status` enum (`draft | active | paused | completed`) and default value `active` on the Mongoose schema.
- [ ] `src/lib/models/SavedFilter.ts` created with the recommended shape: `userId`, `name`, `query`, `filters: FilterClause[]`, `createdAt`, `updatedAt`.
- [ ] `src/app/api/filters/route.ts` implements `GET` (list user-scoped presets) and `POST` (create preset) with auth via `auth()` from `src/lib/auth.ts`.
- [ ] `src/app/api/filters/[id]/route.ts` implements `PUT` (rename) and `DELETE` with ownership checks; returns `401` for unauthenticated, `404` for missing/cross-user IDs.
- [ ] `scripts/backfill-status.ts` created and idempotent: only updates documents missing `status`, emits audit log with start time, end time, matched count, modified count, and any failures.
- [ ] Canonical query parsing/serialization helpers created (location TBD by implementer, recommended near dashboard surface or `src/lib/filters/`): deterministic key order (`status`, `from`, `to`, `tier`), ISO `YYYY-MM-DD` dates, omission of empty keys, stripping of unknown params, rejection of invalid date ranges (`from > to`).
- [ ] `npm run build` passes with zero TypeScript errors after all new files are added.
- [ ] Manual API verification: `GET /api/filters` returns only presets for the authenticated user; unauthenticated requests return `401`.

---

## Files to Create / Modify

### Modify
- `src/lib/models/Campaign.ts`

### Create
- `src/lib/models/SavedFilter.ts`
- `src/app/api/filters/route.ts`
- `src/app/api/filters/[id]/route.ts`
- `scripts/backfill-status.ts`
- Canonical query helpers (new module, e.g. `src/lib/filters/query.ts` or similar)

---

## Verification Steps

1. Run `npm run build` — must pass.
2. Run `scripts/backfill-status.ts` against local/dev MongoDB and inspect audit log.
3. Use `curl` or Postman to verify:
   - `POST /api/filters` with valid payload creates a preset scoped to the session user.
   - `GET /api/filters` returns only that user's presets.
   - `PUT /api/filters/:id` with another user's ID returns `404`.
   - `DELETE /api/filters/:id` without auth returns `401`.
4. Verify `Campaign` schema default: create a campaign without `status` and confirm it stores `active`.

---

## Notes

- This issue is **not user-visible** by itself. It is a strict prerequisite for Slice 1.
- Keep route handlers short and familiar; mirror the existing `src/app/api/templates/*` pattern.
- The `FilterClause` type should be defined in a shared location so it can be imported by both backend and frontend.
- Do **not** introduce any dashboard UI components in this slice.
