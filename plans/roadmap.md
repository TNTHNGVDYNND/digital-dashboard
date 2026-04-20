# Implementation Roadmap — digital-dashboard

> Execution order matters. Each milestone must be complete before the next starts.
> Update status as work progresses.

---

## Milestones Overview

| # | Milestone | Status | Est. Time |
|---|---|---|---|
| 1 | Foundation — project setup, base structure | ✅ Done | ~1h |
| 2 | Asset Pipeline & Preloader | ✅ Done | ~30m |
| 3 | Hero & Scroll Animations | ✅ Done | ~45m |
| 4 | Campaign Builder (Core Module) | ✅ Done | ~1h |
| 5 | MVP polish — error handling, loading states | ✅ Done | ~45m |
| 6 | Deployment | ✅ Ready | ~15m setup |

Status key: ⬜ Not started → 🔄 In progress → ✅ Done → ⏸ Blocked

---

## Milestone 1 — Foundation

**Goal:** Working project with correct structure, tools configured, deployable skeleton.

**Steps:**
1. [x] Initialize Next.js (App Router) + TypeScript
2. [x] Configure TailwindCSS v4
3. [x] Set up folder structure per architecture.md section 3
4. [x] Configure ESLint + Prettier
5. [x] Set up environment variables (.env.example)
6. [x] Create placeholder pages (Home, Contact, FAQ, Campaigns, Dashboard)
7. [x] Verify build passes

**Done when:** App builds cleanly with all routes rendering — ✅ Verified 2026-04-20

---

## Milestone 2 — Asset Pipeline & Preloader

**Goal:** Setup Three.js canvas layer, models, and initial page load preloader.

**Steps:**
1. [x] Install Three.js, React Three Fiber (R3F), and GSAP
2. [x] Install Zustand for preloader state management
3. [x] Create Preloader component (progress 0-100%, fadeOut animation)
4. [x] Create Zustand store for preloader state (initial-load-only tracking)
5. [x] Create PreloaderWrapper for layout integration
6. [x] Create SceneCanvas wrapper component for Three.js
7. [x] Create PlaceholderModel component (rotating cube demo)
8. [x] Create HeroScene component combining canvas + model
9. [x] Update Home page to demo 3D scene
10. [x] Verify build passes with new dependencies

**Done when:** Preloader displays on first load only, 3D scene renders on homepage, build passes — ✅ Verified 2026-04-20

---

## Milestone 3 — Hero & Scroll Animations

**Goal:** Implement GSAP ScrollTrigger for landing page sections with animated hero text reveals.

**Steps:**
1. [x] Create useGSAPAnimations hook (useScrollAnimation, useFadeInUp)
2. [x] Create HeroSection with word-by-word text animation (SplitText alternative)
3. [x] Create SocialProofSection with client logos
4. [x] Create FeaturesSection with staggered card animations
5. [x] Create AnalyticsMapSection with scroll-triggered stats
6. [x] Create CTASection with gradient background
7. [x] Update home page to include all animated sections
8. [x] Register ScrollTrigger plugin globally in hooks
9. [x] Verify build passes

**Done when:** Homepage has animated sections with GSAP ScrollTrigger, all text reveals and scroll animations working, build passes — ✅ Verified 2026-04-20

---

## Milestone 4 — Campaign Builder (Core Module)

**Goal:** Build the multi-step state machine using Zustand — the primary conversion engine.

**Steps:**
1. [x] Create Zustand campaign store with state machine (stepIndex, campaignData, actions)
2. [x] Create StepIndicator UI component for progress display
3. [x] Create PricingCard UI component (glassmorphism per architecture.md)
4. [x] Step 1: Campaign Type selection (Social, Influencer, Traditional, Mixed)
5. [x] Step 2: Target Audience (name, age, gender, interests, locations)
6. [x] Step 3: Budget & Reach (3 tiers: Basic/Premium/Enterprise, duration slider, estimated reach calculation)
7. [x] Step 4: Review & Confirm (summary display, submit action)
8. [x] Create CampaignBuilder master component with step navigation
9. [x] Update campaigns page with builder
10. [x] Verify build passes

**Done when:** 4-step campaign builder is functional with Zustand state management, all steps render correctly, build passes — ✅ Verified 2026-04-20

---

## Milestone 5 — MVP Polish

**Goal:** Production-ready UX — every error state handled, every loading state shown, responsive on mobile.

**Steps:**
1. [x] Error boundaries on all async operations
2. [x] Loading states for all data fetching
3. [x] Empty states for all list/table views
4. [x] Mobile responsive check (test at 375px, 768px, 1280px)
5. [x] Accessibility audit (keyboard navigation, ARIA labels, contrast)
6. [x] Final code review

**Done when:** App works gracefully when things go wrong, on all screen sizes. — ✅ Verified 2026-04-20

---

## Milestone 6 — Deployment

**Goal:** Deploy the application to Vercel with production database.

**Pre-deployment (Completed):**
1. [x] Production MongoDB Atlas cluster configured
2. [x] Environment variables prepared (.env.local with MONGODB_URI)
3. [x] Build passes cleanly with no errors
4. [x] All API routes tested locally
5. [x] Campaign submission flow verified end-to-end

**Manual Deployment Steps (Pending):**
1. Push code to GitHub repository
2. Connect repository to Vercel (vercel.com)
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI` (production cluster — already configured)
   - `JWT_SECRET` (already configured)
   - `NEXT_PUBLIC_APP_URL` (update to production URL after deploy)
4. Deploy and verify production URL
5. Run smoke tests on production

**Done when:** Production URL is live and all MVP features work — ✅ Ready for deployment 2026-04-20

---

## What's Out of Scope (Future Phases)

- [Feature deferred from MVP — document here so it's not forgotten]
- [Feature deferred]
- [Feature deferred]

---

*Produced by Antigravity: 2026-04-20*
*Team review: [pending / approved on YYYY-MM-DD]*
