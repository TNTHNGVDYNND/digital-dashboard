# Component Inventory — digital-dashboard

> Frontend projects only. Lists all UI components, their states, props, and complexity.
> Use this as a build checklist — check off each component as it's implemented.

---

## Pages / Routes

| Route | Component | Status |
|---|---|---|
| `/` | `HomePage` | ✅ |
| `/campaigns` | `CampaignsPage` | ✅ |
| `/dashboard` | `DashboardPage` | ✅ |
| `/contact` | `ContactPage` | ✅ (placeholder) |
| `/faq` | `FAQPage` | ✅ (placeholder) |

---

## Component Inventory

### Layout Components

| Component | States | Key Props | Complexity | Status |
|---|---|---|---|---|
| `PreloaderWrapper` | loading, complete | `children` | Medium | ✅ |
| `Layout` (implicit in root) | default | `children` | Low | ✅ |

### Section Components (Homepage)

| Component | States | Key Props | Complexity | Status |
|---|---|---|---|---|
| `HeroSection` | enter, active | — | High | ✅ |
| `SocialProofSection` | default | — | Low | ✅ |
| `FeaturesSection` | scroll-triggered | — | Medium | ✅ |
| `AnalyticsMapSection` | scroll-triggered | — | Medium | ✅ |
| `CTASection` | fade-in-up | — | Low | ✅ |

### Campaign Builder Components

| Component | States | Key Props | Complexity | Status |
|---|---|---|---|---|
| `CampaignBuilder` | stepIndex (0-3) | — | High | ✅ |
| `StepIndicator` | active step | `currentStep`, `totalSteps`, `labels` | Low | ✅ |
| `Step1Type` | selected | `campaignData`, `updateCampaignData` | Medium | ✅ |
| `Step2Audience` | form inputs | `campaignData`, `updateTargetAudience` | Medium | ✅ |
| `Step3Budget` | tier selection | `campaignData`, `estimatedReach` | Medium | ✅ |
| `Step4Review` | review, submitting | `campaignData`, `submitCampaign` | Medium | ✅ |
| `SuccessModal` | open/closed | `isOpen`, `onClose`, `campaignName` | Low | ✅ |

### 3D / Canvas Components

| Component | States | Key Props | Complexity | Status |
|---|---|---|---|---|
| `SceneCanvas` | default | `children`, `className` | Medium | ✅ |
| `PlaceholderModel` | rotating | — | Medium | ✅ |
| `HeroScene` | default | — | Medium | ✅ |

### UI Components

| Component | States | Key Props | Complexity | Status |
|---|---|---|---|---|
| `PricingCard` | hover, selected | `title`, `price`, `features`, `isSelected`, `onSelect` | Medium | ✅ |
| `StepIndicator` | progress | `currentStep`, `totalSteps`, `labels` | Low | ✅ |
| `Preloader` | progress (0-100) | `onComplete` | Low | ✅ |

---

## State Management Map

| State | Where it lives | What owns it |
|---|---|---|
| Preloader loading state | Zustand store (`preloader.ts`) | `usePreloaderStore` |
| Campaign builder step | Zustand store (`campaign.ts`) | `useCampaignStore` |
| Campaign form data | Zustand store (`campaign.ts`) | `useCampaignStore` |
| Campaigns list | SWR hook (`useCampaigns.ts`) | `useCampaigns()` |
| Single campaign | SWR hook (`useCampaigns.ts`) | `useCampaign(id)` |

---

## Data Fetching Map

| Data | Hook | Endpoint | Cache Strategy |
|---|---|---|---|
| Campaigns list | `useCampaigns()` | GET /api/campaigns | SWR with revalidation |
| Single campaign | `useCampaign(id)` | GET /api/campaigns/[id] | SWR with revalidation |
| Create campaign | `createCampaign()` | POST /api/campaigns | SWR mutation + revalidate |
| Update campaign | `updateCampaign()` | PUT /api/campaigns/[id] | Manual revalidation |
| Delete campaign | `deleteCampaign()` | DELETE /api/campaigns/[id] | Manual revalidation |

---

## API Routes

| Endpoint | Method | Description | Status |
|---|---|---|---|
| `/api/campaigns` | GET | List all campaigns | ✅ |
| `/api/campaigns` | POST | Create new campaign | ✅ |
| `/api/campaigns/[id]` | GET | Get single campaign | ✅ |
| `/api/campaigns/[id]` | PUT | Update campaign | ✅ |
| `/api/campaigns/[id]` | DELETE | Delete campaign | ✅ |

---

## Custom Hooks

| Hook | Purpose | Status |
|---|---|---|
| `useScrollAnimation` | GSAP ScrollTrigger wrapper | ✅ |
| `useFadeInUp` | Simple fade-in-up animation | ✅ |
| `useCampaigns()` | Fetch all campaigns with SWR | ✅ |
| `useCampaign(id)` | Fetch single campaign with SWR | ✅ |

---

## Future Components (Phase 2)

| Component | Purpose | Priority |
|---|---|---|
| `LoginPage` | User authentication | High |
| `Navbar` | Site navigation with auth | Medium |
| `Sidebar` | Dashboard navigation | Medium |
| `Footer` | Site footer | Low |
| `CampaignEditModal` | Edit existing campaigns | Medium |
| `CampaignDeleteModal` | Confirm deletion | Medium |
| `AnalyticsChart` | Chart.js or Recharts integration | Medium |
| `NotificationBell` | Real-time notifications | Low |

---

*Last updated: 2026-04-20 (OpenCode implementation session)*
