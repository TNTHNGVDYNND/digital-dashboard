# Learnings: Styling Refactor

**Initiative:** styling-refactor
**Date:** 2026-05-10

---

## What Worked Well

1. **Tailwind v4 @theme directive** — CSS-native token authoring is cleaner than JS config; no split-brain between tailwind.config.js and globals.css
2. **Phase-1 scope freeze** — Excluding GSAP/Three.js surfaces from migration prevented animation breakage
3. **Animation/3D mini-gates** — Early drift detection in Waves 2 and 3 caught potential issues before they became expensive regressions
4. **Semantic token design** — Using `primary-*`, `surface-*`, `text-*` instead of literal colors made dark mode implementation straightforward
5. **Inline no-flash bootstrap** — IIFE script in `<head>` is the most reliable SSR/CSR approach for theme resolution

## What Was Challenging

1. **Subagent spending limit** — Wave 3 subagent failed due to workspace spending cap; had to complete wave manually
2. **ESLint config drift** — Pre-existing circular structure error in eslint.config.mjs prevented `npm run lint` from running throughout all waves
3. **Headless environment** — No browser-based verification for no-flash or visual regression; relied on static analysis

## Decisions Made

- Used `@custom-variant dark` to bridge Tailwind's `dark:` utilities to `data-theme` attribute
- Kept `dark:` class variants on out-of-scope components (HeroSection, FeaturesSection) rather than forcing token migration on animated surfaces
- Deferred Navbar and auth pages to reduce blast radius on high-traffic components

## For Future Initiatives

- Capture browser-based baselines (Playwright screenshots) when environment supports it
- Fix ESLint config before starting any new initiative
- Consider using `reference-checker` more aggressively to prevent duplicate work
