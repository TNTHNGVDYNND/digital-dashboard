# AGENTS.md — digital-dashboard

> OpenCode agents read this file first. It defines the project, the current state,
> and what the team is building. Converted from CLAUDE.md or GEMINI.md on handoff.
> Schema reference: antigravity-test/docs/AGENTS-schema.md

---

## Project Identity

- **Name:** digital-dashboard (Explicit Promotions)
- **Type:** new
- **Created:** 2026-04-20
- **Source:** Antigravity session
- **Status:** in-progress

---

## What We Are Building

A campaign management and promotions analytics platform inspired by explicitpromo.com. Users create multi-step promotional campaigns, view analytics dashboards, and manage their promotions. The frontend features scroll-synced animations (GSAP), 3D elements (Three.js/R3F), and a multi-step campaign builder.

---

## Tech Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend | Next.js (App Router) + React | 16.x / 19.x | TypeScript, TailwindCSS v4 |
| Animations | GSAP + Three.js (R3F) | — | ScrollTrigger, SplitText, WebGL |
| State | Zustand | — | Campaign builder state machine |
| Backend | Next.js API Routes | — | Node.js, REST |
| Database | MongoDB | — | Document store for campaigns |
| Hosting | Vercel | — | CDN + App Hosting |

---

## Current State

**All 6 Milestones Complete — Ready for Production Deployment**

Built a full-stack campaign management platform with:
- **Frontend:** Next.js app with GSAP animations, Three.js hero, responsive design
- **Backend:** REST API with Next.js API Routes + MongoDB Atlas
- **Core Feature:** 4-step campaign builder
- **State Management:** Zustand for builder + preloader
- **Build:** ✅ Passing
- **Local Testing:** ✅ Campaign creation → DB write → dashboard display verified

---

## Main Structure

```text
src/
├── app/
│   ├── page.tsx               # Homepage with hero + animated sections
│   ├── campaigns/page.tsx     # 4-step campaign builder
│   ├── dashboard/page.tsx     # Campaign dashboard + empty/loading states
│   ├── contact/page.tsx       # Contact placeholder
│   ├── faq/page.tsx           # FAQ placeholder
│   └── api/campaigns/
│       ├── route.ts           # GET + POST
│       └── [id]/route.ts      # GET + PUT + DELETE
├── components/
│   ├── campaign/              # Builder steps + success modal
│   ├── sections/              # Hero, social proof, features, analytics, CTA
│   ├── canvas/                # Three.js / R3F wrappers
│   └── ui/                    # Shared UI pieces
├── hooks/                     # GSAP + SWR hooks
├── lib/                       # MongoDB connection + Mongoose models
└── store/                     # Zustand stores
```

For the full implementation record, see:
- `docs/session-log.md`
- `docs/implementation_plan.md`
- `plans/architecture.md`
- `plans/roadmap.md`
- `plans/components.md`
- `plans/decisions.md`

---

## Plans Location

All Antigravity-produced plans are in `plans/`. Read in this order:

1. `plans/HANDOFF.md` — start here. Session summary + first action for OpenCode
2. `plans/architecture.md` — system design and decisions
3. `plans/roadmap.md` — implementation order with milestones
4. `plans/components.md` — component inventory (frontend projects)
5. `plans/decisions.md` — key architectural decisions and rationale

---

## Active Workstream

**Current milestone:** Milestone 6 — Deployment (Ready)
**Status:** Ready for Vercel deployment.
**Next action:** Push to GitHub, connect Vercel, set env vars, smoke test.
**Blocked on:** Manual deployment step

---

## Team Conventions

- Follow plans/architecture.md decisions
- Run CONTRIBUTE ritual at end of each OpenCode session
- File discoveries to `docs/discoveries/` in antigravity-test/
- Use Prettier for formatting (`npm run format`)
- No `as any`, `@ts-ignore`, or `@ts-expect-error`

---

## Constraints

- **Scope:** MVP complete; future work lives in docs/ and plans/
- **Deployment:** Ready for Vercel (manual deployment by user)
- **Timeline:** Development complete 2026-04-20

---

*Converted from: Antigravity session output*
*Conversion date: 2026-04-20*
*Schema version: 1.0*
