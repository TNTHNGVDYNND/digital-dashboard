# Execution Plan: Campaign Templates Feature

## Project
- **Name**: campaign-templates
- **Root**: /home/vladi/developer/digital-dashboard
- **Started**: 2026-05-09

## Waves

### Wave 1 — Schema & API
**Goal**: Foundation layer. Model, API, and store.

#### Slice 1.1: Template Mongoose Model
- **Files**: `src/lib/models/Template.ts`
- **Work**: Create Template schema matching Campaign shape plus `name` and `userId`
- **Verification**: Import works, TypeScript compiles

#### Slice 1.2: API Routes
- **Files**: `src/app/api/templates/route.ts`, `src/app/api/templates/[id]/route.ts`
- **Work**: Implement POST, GET (list), GET (by id), DELETE following existing campaign route patterns
- **Verification**: All routes auth-protected and user-scoped

#### Slice 1.3: Zustand Store Slice
- **Files**: `src/store/templates.ts`
- **Work**: Create separate templates store with fetch, create, delete, load actions
- **Verification**: Store exports cleanly, TypeScript compiles

---

### Wave 2 — UI Integration
**Goal**: Wire templates into CampaignBuilder flow.

#### Slice 2.1: Template Selection in Step1Type
- **Files**: `src/components/campaign/Step1Type.tsx`
- **Work**: Add dropdown to load template, populate campaignData, advance step
- **Verification**: Dropdown renders, selection works, data populates

#### Slice 2.2: Save as Template in Step4Review
- **Files**: `src/components/campaign/Step4Review.tsx`
- **Work**: Add "Save as Template" button + name input modal, call store action
- **Verification**: Button works, modal opens, template saves, success feedback

#### Slice 2.3: TemplateCard Component
- **Files**: `src/components/campaign/TemplateCard.tsx`
- **Work**: Card UI for template listing with name, type, budget, tier, date, delete button
- **Verification**: Renders with mock data, delete triggers confirmation

---

### Wave 3 — Polish & Verification
**Goal**: Edge cases, cleanup, build verification.

#### Slice 3.1: Empty State & Delete Flow
- **Files**: `src/components/campaign/TemplateCard.tsx` (update), `src/components/campaign/EmptyTemplates.tsx` (new)
- **Work**: Empty state when no templates, delete with confirmation modal
- **Verification**: Empty state renders, delete removes template and updates UI

#### Slice 3.2: Build & Wiring Check
- **Work**: Run `npm run build`, verify no TypeScript errors, check all imports resolve
- **Verification**: Build exit code 0, no orphaned files, all components wired

#### Slice 3.3: Post-Change Review
- **Work**: Run security scan, check auth on routes, verify no `console.log` or debug code
- **Verification**: No security issues, no debug code, auth correct
