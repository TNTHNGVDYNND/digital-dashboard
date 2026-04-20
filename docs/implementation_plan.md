# Implementation Plan: Explicit Promotions Analysis

Based on research into `https://explicitpromo.com/`, here is the detailed technical breakdown and implementation architecture patterns.

## 1. Architecture Overview
The system follows a modern **Decoupled SPA Architecture** with a high-performance frontend and a service-oriented backend.

```text
[ Presentation Layer ] (Latest React + GSAP + TailwindCSS + WebGL/Three.js)
       |
       |-- [ Client State ] (Zustand for Multi-step Campaigns)
       |-- [ Animation Engine ] (GSAP ScrollTrigger + SplitText)
       |
[ Integration Layer ] (API Gateway / Next.js API Routes)
       |
       |-- [ Authentication ] (JWT/Cookie-based for Dashboards)
       |-- [ External Services ] (DEFERRED - Future implementation)
       |
[ Data Layer ] (MongoDB + Headless CMS for FAQs/Content)
       |
[ Infrastructure ] (Vercel CDN + App Hosting)
```

## 2. Technology Stack Recommendation
For each layer, here is the recommended tech based on the team's preferences:

- **Framework**: **Next.js (App Router)**
  - *Pros/Cons vs main alternative (React SPA)*: Next.js provides better SEO for marketing pages, easier SSR for dashboard data, and built-in optimization. React SPA is fully client-side which harms initial load and SEO.
  - *Why*: Critical for marketing sites where SEO and LCP matter.

- **Styling**: **Latest TailwindCSS**
  - *Pros/Cons vs main alternative (Styled Components)*: Tailwind enables faster development, smaller bundle sizes, and a consistent utility-first design without runtime overhead.
  - *Why*: Matches the modern ecosystem and facilitates rapid iteration on complex UI components.

- **Animations & 3D**: **GSAP + WebGL/Three.js**
  - *Pros/Cons vs main alternative (CSS Transitions/Lottie)*: Native CSS lacks granular timeline control. Lottie is great for vector, but true 3D interactions require WebGL/Three.js context.
  - *Why*: GSAP handles scroll-synced timelines; Three.js manages the premium 3D assets rendering (e.g. speakers, animated icons).

- **State Management**: **Zustand**
  - *Pros/Cons vs main alternative (Redux Toolkit)*: Zustand is much lighter weight for the Campaign Builder state machine with zero boilerplate.
  - *Why*: Solves multi-step form and cart state elegantly.

- **Backend / API**: **Node.js (Next.js API Routes)**
  - *Pros/Cons vs main alternative (Python/Django)*: Node.js matches the frontend language (TypeScript) and handles high-concurrency API requests efficiently.
  - *Why*: Context switching is minimized, keeping the full stack under Next.js and deployed smoothly to Vercel.

- **Database**: **MongoDB**
  - *Pros/Cons vs main alternative (PostgreSQL)*: Document structure allows rapid manipulation of varying campaign payloads and flex-schemas.
  - *Why*: Matches the decoupled SPA perfectly, very common with Node/Next stacks and easy to bootstrap.

## 3. Project Structure
```text
/public/assets      # WebGL models, Lottie files, high-res images
/src/app            # Next.js App Router (Pages: Home, Contact, FAQ, Campaigns)
/src/app/dashboard  # Protected area for user dashboards
/src/components
  /ui               # Atomic components (Buttons, Inputs, Modals)
  /sections         # Complex sections (Hero, Analytics Map, Social Proof)
  /campaign         # Logic/UI for the 4-step Campaign Builder
  /canvas           # Three.js / WebGL wrapped components (R3F)
/src/hooks          # Custom hooks (useGSAPAnimations)
/src/store          # Zustand stores for global and campaign state
/src/styles         # Global CSS and Tailwind configurations
```

## 4. Component Inventory
| Component | States | Key Props | Complexity | Notes |
|---|---|---|---|---|
| **Preloader** | progress (0-100), fadeOut | `onComplete` | Low | Runs on **initial load** only, syncing with WebGL asset loading. |
| **HeroSection** | enter, active | `title`, `ctaText` | Medium | Heavy GSAP implementation (SplitText). Study staggered text reveals. |
| **3D Elements** | loading, rotating | `modelPath`, `scale` | High | Implement via React Three Fiber (R3F) for integration. |
| **CampaignBuilder**| stepIndex (1-4), tier| `baseData`, `onFinish`| High | Complex math for stream/reach calculation. Zustand stored. |
| **PricingCard** | hover, selected | `title`, `price` | Medium | Glassmorphism effects and custom hover states via Tailwind. |

## 5. Implementation Roadmap
1. **Foundation & Layout**: Setup Next.js + TailwindCSS + MongoDB connection.
   * *Why in this order*: Establishes the design system and data backbone setup.
2. **Asset Pipeline & Preloader**: Setup Three.js canvas layer, models, and initial page load preloader.
   * *Why in this order*: 3D loading drives the overall time-to-interactivity, meaning the preloader must be tuned for it.
3. **Hero & Scroll Animations**: Implement GSAP ScrollTrigger for landing page sections.
   * *Why in this order*: Core brand identity; hardest visual layer to get right alongside the 3D canvas.
4. **Campaign Builder (Core Module)**: Build the multi-step state machine using Zustand.
   * *Why in this order*: The primary conversion engine (business value), needing deep state management.
5. **Dashboard Implementation**: Setup `/dashboard` routes, user auth, and backend integrations.
   * *Why in this order*: Converts the functional builder UI into a complete tracked system context.
   * *(Note: External analytic platforms deferred to Phase 2 for learning focus)*

## 6. Key Decisions & Rationale
- **Decision:** **Vercel** for hosting infrastructure.
  - **Reason:** Best-in-class integration with Next.js App Router, API routes, and edge functionality. Reduces devops overhead.
- **Decision:** Implement **WebGL/Three.js** for 3D Assets.
  - **Reason:** Enables high-fidelity interactive elements that respond to scroll and mouse positioning, impossible with static videos.
- **Decision:** Dashboard under `/dashboard` route.
  - **Reason:** Better for SEO context and avoids complex cross-domain cookie sharing which happens on sub-domains.
- **Decision:** **Initial Load-only Preloader**.
  - **Reason:** Firing preloader only on first visit keeps SPA-like instant navigation between internal pages while still hydrating thick 3D assets cleanly upfront.

## 7. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Three.js / WebGL causing initial load delays | High | High | Lazy load the `<Canvas>` component and use `useGLTF` caching strategies. |
| State Management bugs in multi-step | Low | High | Architect the Zustand store modularity upfront. |
| Vercel DB Connection limits (Serverless) | Med | Med | Use proper connection pooling for MongoDB with edge-compatible driver mapping. |

## 8. Resolved Architecture Decisions
✅ **Stack Details**: Confirmed React 18/19, TailwindCSS, Next.js, Node.js + MongoDB.
✅ **Asset Delivery**: 3D items confirmed as WebGL/Three.js.
✅ **Service Strategy**: External analytics APIs deferred. Focus is strictly on standard components and system mechanics for learning/practice.
✅ **Routing**: Dashboard mapped to `/dashboard` directly within the Next.js app.

## 9. Estimated Effort
- **Components**: ~18-22 core components
- **API endpoints**: ~6 (Auth, Models, Builder State, User Stats)
- **Pages/screens**: ~8 + Dashboard internals
- **Complexity**: High (Combining WebGL + GSAP + Application Logic)
- **Realistic MVP timeline**: **6-8 weeks** (for 2-person team mastering these patterns)

---

## Calibration Notes

| Date | What worked | What to change |
| ---- | ----------- | -------------- |
| 2026-04-20 | Subagent successfully diagnosed the DOM, UI interactions, and architecture. | Initial draft assumed subdomains/postgres. Fine-tuned with team: React/Tailwind, MongoDB, Vercel, Three.js, inline-Dashboard. |
