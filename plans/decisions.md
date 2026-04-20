# Key Decisions — digital-dashboard

> Architectural decisions made during Antigravity planning and OpenCode implementation.
> Each decision is recorded with reasoning and the alternative that was rejected.
> Do not reverse a decision without team discussion and updating this file.

---

## Decision Log

### Decision 1 — Framework: Next.js (App Router) over React SPA

- **Decision:** Next.js 16 with App Router
- **Reason:** Better SEO for marketing pages, built-in SSR for dashboard data, API routes in same codebase, optimized by default for Core Web Vitals
- **Alternative considered:** React SPA with Vite
- **Why alternative was rejected:** SPA has poor initial load performance, no SSR for dashboard data, requires separate backend setup, worse SEO for landing pages
- **Conditions to revisit:** If we need to decouple frontend/backend later for microservices
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 2 — Styling: TailwindCSS v4 over CSS Modules/Styled Components

- **Decision:** TailwindCSS v4 with utility-first approach
- **Reason:** Faster development, smaller bundle (purge unused styles), consistent design system via config, no runtime CSS-in-JS overhead
- **Alternative considered:** CSS Modules, Styled Components, SCSS
- **Why alternative was rejected:** CSS Modules = more context switching; Styled Components = runtime overhead; SCSS = build complexity without Tailwind's benefits
- **Conditions to revisit:** If we need highly dynamic theme switching beyond Tailwind's dark mode
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 3 — Animations: GSAP + Three.js over Framer Motion/Native CSS

- **Decision:** GSAP for scroll animations + Three.js/React Three Fiber for 3D
- **Reason:** GSAP has superior scroll-synced timeline control (ScrollTrigger); Three.js required for actual 3D assets (not just CSS 3D transforms)
- **Alternative considered:** Framer Motion, CSS @scroll-timeline, Lottie, CSS 3D transforms
- **Why alternative was rejected:** Framer Motion = heavier bundle; CSS @scroll-timeline = limited browser support; Lottie = vector only (not true 3D); CSS 3D = primitive compared to WebGL
- **Conditions to revisit:** If bundle size becomes critical and we need to drop Three.js
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 4 — State Management: Zustand over Redux Toolkit

- **Decision:** Zustand for client state, SWR for server state
- **Reason:** Zustand = minimal boilerplate, excellent TypeScript support, tiny bundle; SWR = handles caching, revalidation, mutations automatically
- **Alternative considered:** Redux Toolkit, React Context + useReducer, Jotai
- **Why alternative was rejected:** Redux Toolkit = too much boilerplate for this scale; Context = performance issues with frequent updates; Jotai = newer, less ecosystem maturity
- **Conditions to revisit:** If we need time-travel debugging or complex middleware
- **Made by:** Antigravity session + OpenCode implementation
- **Date:** 2026-04-20

---

### Decision 5 — Database: MongoDB over PostgreSQL

- **Decision:** MongoDB with Mongoose ODM
- **Reason:** Document structure perfect for flexible campaign payloads (varying fields per campaign type), schema-less evolution, natural fit with Node.js/JSON
- **Alternative considered:** PostgreSQL with Prisma, Firebase/Firestore
- **Why alternative was rejected:** PostgreSQL = rigid schema migrations for evolving campaign types; Firebase = vendor lock-in, harder to migrate away
- **Conditions to revisit:** If we need complex relational queries or ACID transactions across collections
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 6 — Hosting: Vercel over Railway/AWS

- **Decision:** Vercel for frontend + API routes, MongoDB Atlas for database
- **Reason:** Best-in-class Next.js integration, automatic preview deployments, edge CDN, serverless functions, zero DevOps
- **Alternative considered:** Railway, AWS Amplify, self-hosted VPS
- **Why alternative was rejected:** Railway = good but less Next.js-specific optimizations; AWS Amplify = complex config; Self-hosted = DevOps overhead
- **Conditions to revisit:** If we need dedicated servers for WebSocket persistence or massive scale
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 7 — Dashboard Route: `/dashboard` over Subdomain

- **Decision:** Dashboard at `/dashboard` route within main app
- **Reason:** Better SEO (single domain authority), no CORS issues with cookies, easier to maintain one codebase, seamless navigation
- **Alternative considered:** `dashboard.explicitpromo.com` subdomain
- **Why alternative was rejected:** Subdomain = separate SSL, CORS complexity, cookie sharing issues, SEO dilution
- **Conditions to revisit:** If we need to scale dashboard team independently with different tech stack
- **Made by:** Antigravity session
- **Date:** 2026-04-20

---

### Decision 8 — SSR-Safe ScrollTrigger: Dynamic Import Pattern

- **Decision:** Use dynamic `require()` inside `useEffect` for ScrollTrigger registration
- **Reason:** ScrollTrigger accesses `window` object which doesn't exist during SSR; dynamic import delays execution to client-side only
- **Alternative considered:** `typeof window !== 'undefined'` checks at module level, @gsap/react integration
- **Why alternative was rejected:** Module-level checks still execute import statements; @gsap/react adds complexity we don't need for our simple patterns
- **Conditions to revisit:** If Next.js adds better GSAP integration or we switch to Framer Motion
- **Made by:** OpenCode implementation
- **Date:** 2026-04-20

---

### Decision 9 — API Architecture: REST over GraphQL

- **Decision:** Traditional REST API with Next.js API routes
- **Reason:** Simple CRUD operations don't need GraphQL complexity, easier to debug, familiar to most developers, works great with SWR
- **Alternative considered:** GraphQL with Apollo Server, tRPC
- **Why alternative was rejected:** GraphQL = overkill for simple campaign CRUD; tRPC = tight coupling, harder to consume from external clients
- **Conditions to revisit:** If we build mobile apps or external API consumers needing flexible queries
- **Made by:** OpenCode implementation
- **Date:** 2026-04-20

---

### Decision 10 — Database Connection: Singleton with Caching

- **Decision:** MongoDB connection singleton cached in `global.mongoose` for serverless
- **Reason:** Next.js API routes run in serverless functions; without caching, each request creates new connection hitting MongoDB connection limits
- **Alternative considered:** New connection per request, connection pooling via mongoose.connect()
- **Why alternative was rejected:** New connection = connection limit exhaustion; basic mongoose.connect() doesn't handle serverless cold starts
- **Conditions to revisit:** If we migrate to dedicated servers or MongoDB Serverless tier
- **Made by:** OpenCode implementation
- **Date:** 2026-04-20

---

### Decision 11 — Homepage Navigation: Next.js Link over HTML Button

- **Decision:** Convert hero CTAs from `<button>` to Next.js `<Link>` components
- **Reason:** Buttons without onClick handlers were non-functional; Links provide proper routing, accessibility, and prefetching
- **Alternative considered:** Keep buttons with `onClick={() => router.push()}`, `<a>` tags
- **Why alternative was rejected:** Buttons with manual navigation = more code, less accessible; `<a>` tags without Next.js Link = no prefetching, full page reloads
- **Conditions to revisit:** If we need buttons that both navigate and perform actions (use `<Link>` with `onClick`)
- **Made by:** OpenCode implementation (user feedback)
- **Date:** 2026-04-20

---

## Deferred Decisions

> Things flagged as needing decision but not yet resolved.

| Decision needed | Options | Deadline | Owner |
|---|---|---|---|
| User Authentication | JWT vs NextAuth.js vs Custom | Phase 2 | Team |
| External Analytics | Google Analytics vs Mixpanel vs Custom | Phase 2 | Team |
| Real-time Updates | WebSockets vs SSE vs Polling | Phase 2 | Team |
| Payment Integration | Stripe vs PayPal vs RevenueCat | Phase 2 | Team |
| Email Service | SendGrid vs Mailgun vs AWS SES | Phase 2 | Team |

---

## Decisions Team Overrode

> Where team disagreed with Antigravity's recommendation. Document why.

| Antigravity said | Team chose | Reason for override |
|---|---|---|
| PostgreSQL | MongoDB | Team preferred document flexibility for campaign payloads |
| Subdomain dashboard | /dashboard route | Simpler deployment, no CORS issues |

---

*Produced by: Antigravity session + OpenCode implementation*
*Last updated: 2026-04-20*
