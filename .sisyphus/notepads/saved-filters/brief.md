# Brief: Saved Filters Feature

## Context
The Digital Dashboard is a Next.js 16 App Router application using TypeScript, Tailwind CSS v4, Zustand, SWR, and Mongoose. The Dashboard page (`/dashboard`) currently lists all user campaigns with no filtering capability. Users need a way to filter campaigns by status, date range, and budget tier, and save frequently used filter combinations as named presets.

## Goal
Implement a "Saved Filters" feature that allows users to:
1. Filter campaigns on the Dashboard by:
   - **Status**: draft, active, paused, completed
   - **Date Range**: start date from/to
   - **Budget Tier**: basic, premium, enterprise
2. Save current filter configurations as named presets
3. Quickly apply saved presets from a popover/list
4. Rename and delete saved presets

## Non-Goals
- Cross-user filter sharing (public presets)
- Advanced query builder (AND/OR logic, custom fields)
- Filter analytics or usage metrics

## Key Decisions (from DESIGN.md)
- **Add `status` field to Campaign model** with default `'active'` and one-time migration
- **Hybrid persistence**: URL searchParams for applied filters, backend MongoDB for named presets
- **No localStorage for presets** (follow Templates pattern: backend-backed)
- **Reuse existing Tailwind modal patterns** (no new UI library dependencies)

## Acceptance Criteria
- [ ] Campaign model includes `status` enum field
- [ ] Dashboard displays filter toolbar with status, date range, and budget tier controls
- [ ] Applied filters sync to URL search params and persist on refresh
- [ ] Campaign list and AnalyticsChart respect applied filters
- [ ] Users can save current filters as named presets via modal
- [ ] Users can apply, rename, and delete saved presets
- [ ] All presets are user-scoped (auth-protected API routes)
- [ ] Build passes (`npm run build` exit code 0)
- [ ] No orphaned files, all components wired
- [ ] Post-change review passed

## Constraints
- Must follow existing codebase patterns (Zustand stores, SWR hooks, Tailwind styling, custom modals)
- Must be accessible (keyboard navigation, ARIA labels, focus management)
- Must integrate with existing NextAuth authentication
- Must work in dark mode (existing `dark:` Tailwind prefixes)

## First Execution Wave
Wave 1 — Schema & API Foundation
- Slice 1.1: Add `status` field to Campaign Mongoose model + migration logic
- Slice 1.2: Create SavedFilter Mongoose model
- Slice 1.3: Implement API routes (GET /api/filters, POST /api/filters, PUT /api/filters/:id, DELETE /api/filters/:id) with auth and user scoping
- Slice 1.4: Create Zustand store for saved filters (fetch, create, update, delete)

## Files of Reference
- `src/lib/models/Campaign.ts` — model to extend
- `src/app/dashboard/page.tsx` — page to modify
- `src/store/templates.ts` — closest existing pattern for backend-backed CRUD store
- `src/components/dashboard/CampaignEditModal.tsx` — modal pattern to replicate
- `DESIGN.md` — full design document with component specs, data models, UI flows
