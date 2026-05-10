# Brief: Frontend Styling Refactor — Design System in Tailwind v4

## Initiative
**Name:** styling-refactor
**Type:** Refactor / Design System Implementation
**Priority:** High
**Date:** 2026-05-10

## Context

Project: `digital-dashboard` — Next.js 16 App Router campaign management platform.
Current styling: Tailwind CSS v4 with a near-empty `globals.css` (`@import 'tailwindcss';` only).
Problem: No design tokens, no theme directives, no responsive breakpoints, no dark mode, no custom utilities. For Tailwind v4, this is a skeleton with no design system.

## Goal

Implement a complete design system in `globals.css` using Tailwind v4 `@theme` directives, with full dark mode support and component migration strategy.

## Scope

### In Scope
1. Color tokens (primary, surface, text, accent) in `@theme`
2. Spacing scale in `@theme`
3. Typography tokens in `@theme`
4. Responsive breakpoints in `@theme`
5. Dark mode support (`prefers-color-scheme` + `data-theme` toggle)
6. Component migration: hardcoded styles → theme tokens
7. GSAP/Three.js integration preservation
8. Build verification after every wave

### Out of Scope
- New pages or features
- Backend changes
- Database schema changes
- Authentication changes

## Constraints

- Do NOT break existing GSAP ScrollTrigger animations
- Do NOT break Three.js canvas rendering
- Must pass `npm run build` after every wave
- No visual regression in core pages (home, dashboard, campaigns, contact, faq)
- No `as any`, `@ts-ignore`, or `@ts-expect-error`

## Acceptance Criteria

- [ ] `globals.css` contains a complete `@theme` directive with tokens
- [ ] Dark mode works via `prefers-color-scheme` and `data-theme`
- [ ] Responsive breakpoints defined and working
- [ ] `npm run build` passes with zero errors
- [ ] All core pages render without visual regression
- [ ] GSAP animations still function
- [ ] Three.js canvas still renders
- [ ] Evidence files exist for every wave
- [ ] Dual Momus gates both passed
- [ ] Plan archived and beads issue closed

## Suggested Vertical Slices

- SF-001: @theme foundation (colors, spacing, typography)
- SF-002: Responsive architecture (breakpoints, container queries)
- SF-003: Dark mode (prefers-color-scheme + toggle)
- SF-004: Component migration (FilterToolbar, CampaignBuilder, etc.)
- SF-005: GSAP/Three.js integration (preserve animations)
- SF-006: Regression verification (visual diff, build check)

## Governance

- v2.1.2 workflow with all gates enabled
- STOP at every gate for explicit user approval
- Evidence logged to `.sisyphus/evidence/styling-refactor/`
- wave-validator.sh run before presenting any wave summary
- Apply rules: `rules/concerns/coding-style.md`, `rules/languages/css.md`
