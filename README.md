# Digital Dashboard

Campaign management and promotions analytics platform built with Next.js, MongoDB, GSAP, and Three.js.

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

## Plans Location

are all in `plans/`. Read in this order:

### Main Data Flow

1. `CampaignBuilder` collects campaign data in Zustand.
2. `submitCampaign()` sends a POST request to `/api/campaigns`.
3. API route stores the campaign in MongoDB via Mongoose.
4. `dashboard/page.tsx` loads campaigns with `useCampaigns()`.
5. Success modal confirms creation and links to `/dashboard`.

---

## Status

- Build: passing
- Local app: working
- MongoDB: connected and tested
- Deployment: ready for Vercel

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## What’s Included

- 4-step campaign builder
- REST API for campaigns
- Dashboard with live data
- Animated homepage with 3D hero
- Error/loading/empty states

## Docs

- [Session Log](docs/session-log.md)
- [Implementation Plan](docs/implementation_plan.md)
- [Architecture](plans/architecture.md)
- [Roadmap](plans/roadmap.md)
- [Components](plans/components.md)
- [Decisions](plans/decisions.md)

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set env vars in Vercel
4. Deploy and smoke test
