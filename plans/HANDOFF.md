# HANDOFF.md — digital-dashboard

> Read this first. This file is the short resume point for the next agent.

---

## Current State

- MVP is complete and build passes.
- MongoDB Atlas is connected and campaign CRUD works locally.
- Homepage, campaigns builder, dashboard, and API routes are implemented.
- Docs were updated: `docs/session-log.md`, `plans/roadmap.md`, `plans/architecture.md`, `plans/components.md`, `plans/decisions.md`, `README.md`.

---

## What to Do Next

1. Deploy to Vercel.
2. Smoke test the production URL.
3. Confirm env vars in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

---

## Do Not Do Yet

- Do not start Phase 2 features before deployment is verified.
- Do not replace the current MVP stack without team approval.
- Do not remove the docs/plans files; they are the source of truth.

---

## Main Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── campaigns/page.tsx
│   ├── dashboard/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   └── api/campaigns/
├── components/
├── hooks/
├── lib/
└── store/
```

---

## Deferred Backlog (Phase 2)

- User authentication
- External analytics integration
- Campaign edit/delete UI
- Advanced analytics charts
- Real-time updates
- Payment integration
- Email notifications
- Real 3D model assets

---

## Where the Details Live

- `docs/session-log.md` — implementation history
- `docs/implementation_plan.md` — full architecture + rationale
- `plans/roadmap.md` — milestone status and future work
- `plans/components.md` — component inventory
- `plans/decisions.md` — architectural decisions

---

*Updated by OpenCode on 2026-04-20*
