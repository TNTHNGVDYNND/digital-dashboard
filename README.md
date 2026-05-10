# Digital Dashboard — Explicit Promotions

A full-stack campaign management and promotions analytics platform built with Next.js, MongoDB, and Three.js.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]() [![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)]() [![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue)]() [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)]()

## 🚀 Live Demo

**Coming soon** — Deployed on Vercel (deployment pending manual GitHub push)

Local development:

```bash
npm run dev
# Open http://localhost:3000
```

## ✨ Features

### Frontend

- **Modern UI** — Built with TailwindCSS v4 and responsive design
- **Design System** — Semantic token-driven styling via `@theme` directive
  - 66 semantic tokens: colors (primary, surface, text, accent, success, warning, danger), spacing, typography, breakpoints, radii, shadows
  - Dark mode: `prefers-color-scheme` + manual `data-theme` toggle
  - ThemeToggle component with SSR-safe hydration
- **Animations** — GSAP ScrollTrigger for scroll-synced animations
- **3D Elements** — Three.js + React Three Fiber rotating hero scene
- **Performance** — Next.js App Router with static optimization
- **Accessible** — ARIA labels, keyboard navigation, focus management

### Campaign Builder

- **4-Step Form** — Type → Audience → Budget → Review
- **State Management** — Zustand for complex multi-step form state
- **Targeting** — Age, gender, interests, locations with tag selection
- **Pricing Tiers** — Basic ($999), Premium ($2,499), Enterprise ($4,999)
- **Reach Calculator** — Estimated audience based on tier and budget
- **Success Modal** — Confirmation with dashboard link

### Backend

- **Database** — MongoDB Atlas with Mongoose ODM
- **REST API** — 5 endpoints for full CRUD operations
- **Data Fetching** — SWR for caching and revalidation
- **SSR-Safe** — Dynamic imports for client-only libraries
- **Serverless-Ready** — Connection pooling for Vercel deployment

## Tech Stack

| Layer           | Technology                         |
| --------------- | ---------------------------------- |
| **Framework**   | Next.js 16 (App Router) + React 19 |
| **Language**    | TypeScript 6 (strict mode)         |
| **Styling**     | TailwindCSS v4 + `@theme` design system |
| **Animations**  | GSAP 3 + ScrollTrigger             |
| **3D Graphics** | Three.js + React Three Fiber       |
| **State**       | Zustand (client) + SWR (server)    |
| **Database**    | MongoDB Atlas + Mongoose           |
| **Hosting**     | Vercel (deployment ready)          |

## Project Structure

```
digital-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/campaigns/      # REST API routes
│   │   ├── campaigns/          # Campaign builder page
│   │   ├── dashboard/          # Analytics dashboard
│   │   ├── contact/            # Contact page
│   │   ├── faq/               # FAQ page
│   │   ├── error.tsx          # Global error boundary
│   │   ├── loading.tsx        # Loading state
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── campaign/          # Builder components
│   │   ├── sections/          # Homepage sections
│   │   ├── canvas/            # Three.js components
│   │   └── ui/                # Reusable UI + ThemeToggle
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Database + models
│   └── store/                 # Zustand stores
├── .env.local                 # Environment variables
└── [config files]            # TS, ESLint, Prettier
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/digital-dashboard.git
cd digital-dashboard
```

1. **Install dependencies**

```bash
npm install
```

1. **Set up environment variables**

```bash
# Create .env.local
cp .env.example .env.local

# Edit with your values:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-dashboard
# JWT_SECRET=your-secret-key
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

1. **Run development server**

```bash
npm run dev
```

1. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

Implemented in `src/app/globals.css` using Tailwind v4 `@theme` directives.

### Semantic Tokens

| Category | Tokens | Example |
|----------|--------|---------|
| **Colors** | `primary-{50-900}`, `surface-{0-500}`, `text-{primary,secondary,muted,inverse}`, `accent-{500,600}`, `success-{500,600}`, `warning-{500,600}`, `danger-{500,600}` | `--color-primary-600: #4f46e5` |
| **Spacing** | `space-{4,8,12,16,20,24,32,40,48,64,80,96}` | `--spacing-16: 1rem` |
| **Typography** | `font-sans`, `font-display`, `text-{xs-4xl}`, `font-{normal-bold}`, `leading-{tight,relaxed}` | `--text-lg: 1.125rem` |
| **Breakpoints** | `sm`, `md`, `lg`, `xl`, `2xl` | `--breakpoint-lg: 64rem` |
| **Radii** | `sm`, `md`, `lg`, `xl`, `2xl`, `full` | `--radius-2xl: 1rem` |
| **Shadows** | `sm`, `md`, `lg`, `xl` | `--shadow-lg: 0 10px 15px...` |

### Dark Mode

- **Automatic**: Respects `prefers-color-scheme: dark`
- **Manual Override**: `data-theme="dark"` / `data-theme="light"` attribute on `<html>`
- **No-Flash Bootstrap**: Inline script in `layout.tsx` runs before first paint
- **Persistence**: `localStorage.theme` stores user preference
- **ThemeToggle**: SSR-safe React component in navbar

### Component Migration

**24 components migrated** from hardcoded literal classes to semantic tokens:
- **UI Primitives** (2): PricingCard, StepIndicator
- **Dashboard** (11): FilterToolbar, AnalyticsChart, StatusFilter, etc.
- **Campaign Builder** (7): CampaignBuilder, Step1Type–Step4Review, SuccessModal, TemplateCard
- **Page Shells** (4): campaigns, contact, dashboard, faq

**Preserved (out of scope):**
- GSAP-animated sections (HeroSection, FeaturesSection, CTASection, etc.)
- Three.js canvas host and overlay positioning

**Deferred:**
- Navbar, loading.tsx, error.tsx, login/register pages still contain some literal colors (tracked for follow-up)

---

## 📊 API Endpoints

| Endpoint              | Method | Description         |
| --------------------- | ------ | ------------------- |
| `/api/campaigns`      | GET    | List all campaigns  |
| `/api/campaigns`      | POST   | Create new campaign |
| `/api/campaigns/[id]` | GET    | Get single campaign |
| `/api/campaigns/[id]` | PUT    | Update campaign     |
| `/api/campaigns/[id]` | DELETE | Delete campaign     |

### Campaign Schema

```typescript
{
  name: string;                    // Campaign name
  type: "social" | "influencer" | "traditional" | "mixed";
  targetAudience: {
    ageRange: number[];            // [min, max]
    gender: "all" | "male" | "female" | "other";
    interests: string[];           // Selected interests
    locations: string[];         // Selected locations
  };
  budget: number;                // Campaign budget
  tier: "basic" | "premium" | "enterprise";
  duration: number;              // Days
  createdAt: Date;
  updatedAt: Date;
}
```

## Pages

### Homepage (`/`)

- Animated hero with 3D scene
- Social proof logos
- Feature cards
- Analytics preview section
- Call-to-action

### Campaign Builder (`/campaigns`)

- Step 1: Choose campaign type (Social, Influencer, Traditional, Mixed)
- Step 2: Define target audience (name, age, gender, interests, locations)
- Step 3: Set budget and tier (with reach calculator)
- Step 4: Review and launch
- Success modal with dashboard link

### Dashboard (`/dashboard`)

- List of created campaigns
- Campaign details (name, type, tier, budget, duration)
- Empty state with CTA

## 🔧 Development

### Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run format` — Format with Prettier

### Key Architectural Decisions

1. **Next.js App Router** — For SSR/SEO benefits on marketing pages
2. **TailwindCSS v4 + `@theme`** — CSS-native design system with semantic tokens, zero runtime
3. **GSAP + Three.js** — Superior animation control and 3D capabilities
4. **Zustand** — Minimal state management for campaign builder
5. **MongoDB** — Flexible document structure for campaign data
6. **SWR** — Automatic caching and revalidation for server state

## 📈 Roadmap

### Phase 1: MVP ✅ Complete

- [x] Next.js foundation with TypeScript
- [x] TailwindCSS styling
- [x] **Semantic design system** (`@theme` tokens, dark mode, responsive)
- [x] GSAP animations + Three.js 3D
- [x] 4-step campaign builder
- [x] MongoDB integration
- [x] REST API
- [x] Dashboard with live data
- [x] Responsive design
- [x] Accessibility audit

### Phase 2: Enhancement (Planned)

- [ ] User authentication (NextAuth.js)
- [ ] External analytics integration
- [ ] Campaign editing/deletion UI
- [ ] Advanced analytics charts
- [ ] Real-time updates (WebSockets)
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Actual 3D models (replace placeholder cube)

## 🧪 Testing

### Manual Test Checklist

- [ ] Homepage animations work on scroll
- [ ] 3D scene renders in hero
- [ ] Campaign builder: complete all 4 steps
- [ ] Campaign appears in dashboard after creation
- [ ] Database shows campaign document
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] **Dark mode toggles correctly** (manual + OS preference)
- [ ] **No flash of wrong theme on load**
- [ ] Build passes with 0 errors

### API Testing

```bash
# List campaigns
curl http://localhost:3000/api/campaigns

# Create campaign
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Campaign",
    "type": "social",
    "targetAudience": {
      "ageRange": [25, 45],
      "gender": "all",
      "interests": ["Technology"],
      "locations": ["New York"]
    },
    "budget": 2500,
    "tier": "premium",
    "duration": 14
  }'
```

## 🐛 Known Issues

None currently — all resolved:

- ✅ SSR hydration mismatch (fixed)
- ✅ ScrollTrigger SSR safety (fixed)
- ✅ Non-functional hero buttons (fixed)

## Docs

- [Session Log](docs/session-log.md)
- [Implementation Plan](docs/implementation_plan.md)
- [Architecture](plans/architecture.md)
- [Roadmap](plans/roadmap.md)
- [Components](plans/components.md)
- [Decisions](plans/decisions.md)
- [Styling Refactor PRD](.sisyphus/prds/styling-refactor-prd.md)
- [Styling Refactor Plan](.sisyphus/plans/styling-refactor.md)

## Contributing

This project was built as a learning exercise combining Antigravity planning + OpenCode implementation.

**Architecture planning:** [Antigravity](https://antigravity.example.com)
**Implementation:** OpenCode Agent "Sisyphus"

## License

MIT License — feel free to use this as a starter template for your own projects.

## 🙏 Acknowledgments

- Design inspiration: [explicitpromo.com](https://explicitpromo.com/)
- GSAP: [greensock.com](https://greensock.com)
- Three.js: [threejs.org](https://threejs.org)
- Next.js: [nextjs.org](https://nextjs.org)

---

**Built with ❤️ using modern web technologies**

_Last updated: 2026-05-10_

---

## Recent Changes

### Styling Refactor (2026-05-10)

Implemented a complete design system using Tailwind v4 `@theme` directives:
- 66 semantic tokens (colors, spacing, typography, breakpoints, radii, shadows)
- Dark mode with `prefers-color-scheme` + manual `data-theme` toggle
- No-flash bootstrap script in `layout.tsx`
- ThemeToggle component with SSR-safe hydration
- 24 components migrated to semantic tokens
- GSAP animations and Three.js canvas preserved
- Full governance: PRD → Plan → 5 Waves → Evidence Archive

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set env vars in Vercel
4. Deploy and smoke test
