# Campaign Templates Feature — Product Requirements Document

## Overview

Enable users to save campaign configurations as reusable templates and load them when creating new campaigns, reducing repetitive setup work.

## Goals

- Users can save a campaign configuration as a named template
- Users can browse and select from their saved templates when starting a new campaign
- Templates are scoped per-user (private to the creator)
- Users can delete templates they no longer need

## Non-Goals

- Sharing templates between users (public templates)
- Editing existing templates in-place (save-as-new or delete+recreate)
- Template versioning

## Models

### Template (Mongoose)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| userId | ObjectId (ref: User) | Yes | Indexed, ownership |
| name | String | Yes | Template display name |
| type | String enum | Yes | social / influencer / traditional / mixed |
| targetAudience | Embedded | Yes | Same shape as Campaign |
| budget | Number | Yes | Same as Campaign |
| tier | String enum | Yes | basic / premium / enterprise |
| duration | Number | Yes | Days |
| startDate | Date | No | Optional |
| createdAt | Date | auto | timestamps |
| updatedAt | Date | auto | timestamps |

## API Routes

### POST /api/templates

Create a new template from current campaign configuration.

- Body: `{ name, type, targetAudience, budget, tier, duration, startDate? }`
- Auth required
- Returns: `{ success, data: Template }`

### GET /api/templates

List all templates for the authenticated user.

- Auth required
- Returns: `{ success, data: Template[] }`

### GET /api/templates/:id

Load a single template by ID.

- Auth required
- Scoped to userId
- Returns: `{ success, data: Template }`

### DELETE /api/templates/:id

Delete a template.

- Auth required
- Scoped to userId
- Returns: `{ success, data: {} }`

## Frontend

### Zustand Store (templates slice)

- `templates: Template[]`
- `isLoading: boolean`
- `error: string | null`
- `fetchTemplates(): Promise<void>`
- `createTemplate(name: string, campaignData: CampaignData): Promise<void>`
- `deleteTemplate(id: string): Promise<void>`
- `loadTemplate(id: string): Promise<CampaignData | null>`

### UI Components

#### Step1Type — Template Selection

- Add a "Load from Template" dropdown above campaign type cards
- Dropdown lists user's saved templates by name
- On select: populate `campaignData` from template and advance to review or step 2

#### Step4Review — Save as Template

- Add "Save as Template" button alongside Launch Campaign
- Opens a small modal/prompt for template name
- On confirm: POST to /api/templates, show success toast, refresh template list

#### TemplateCard

- Card component for listing templates (name, type, budget, tier, created date)
- Delete button (with confirmation)
- Click to load template into builder

#### TemplatesPage (optional stretch)

- Dedicated page at `/templates` for managing all templates
- Empty state illustration when no templates exist

## Acceptance Criteria

### Wave 1

- [ ] Template Mongoose model exists with correct schema
- [ ] API routes: POST, GET list, GET by id, DELETE
- [ ] All routes protected by auth and scoped to userId
- [ ] Zustand store slice for templates with CRUD operations
- [ ] No orphaned files or unimplemented routes

### Wave 2

- [ ] "Save as Template" button in Step4Review with name input
- [ ] Template selection dropdown in Step1Type
- [ ] TemplateCard component renders template info correctly
- [ ] Loading a template populates CampaignBuilder state

### Wave 3

- [ ] Empty state shown when user has no templates
- [ ] Delete template functionality works (with confirmation)
- [ ] Build passes (`npm run build` exit code 0)
- [ ] All new components wired (no orphaned files)
- [ ] Post-change review passed

## Security & Privacy

- Templates are strictly user-scoped (userId filter on every query)
- No cross-user template access
- Auth middleware on all routes
