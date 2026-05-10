# SF-005 — GSAP Verification

**Plan:** styling-refactor | **Wave:** 4 | **Date:** 2026-05-10

---

## Selector Integrity Check

| Selector | File | Status | Notes |
|----------|------|--------|-------|
| `.hero-title` | `src/components/sections/HeroSection.tsx` | ✅ Exists | Uses `ref={titleRef}` on `<h1>` element |
| `.hero-subtitle` | `src/components/sections/HeroSection.tsx` | ✅ Exists | Uses `ref={subtitleRef}` on `<p>` element |
| `.feature-card` | `src/components/sections/FeaturesSection.tsx` | ✅ Exists | FeatureCard component with `ref={cardRef}` |
| `.feature-icon` | `src/components/sections/FeaturesSection.tsx` | ✅ Exists | Icon rendered inside FeatureCard |

**Note:** Selectors are accessed via React refs, not CSS class selectors. The animation targets are:
- `titleWords` (`.word` children of `titleRef`)
- `subtitleRef.current`
- `ctaRef.current`
- `cardRef.current` (via `useFadeInUp`)

All refs remain intact and no CSS rules hide or alter these elements' visibility.

---

## ScrollTrigger Configuration Check

| Component | Trigger Element | Start | End | Status |
|-----------|----------------|-------|-----|--------|
| `useFadeInUp` (FeaturesSection) | `elementRef.current` | `top 85%` | N/A (toggleActions) | ✅ Unchanged |
| `useScrollAnimation` (custom) | `elementRef.current` | `top 80%` | `bottom 20%` | ✅ Unchanged |

**Verdict:** No margin, padding, or layout changes were applied to GSAP-animated elements during Waves 1–3. ScrollTrigger positions should match baseline.

---

## Transform/Opacity/Filter Ownership Check

| Component | Property | Owner | Migrated? | Status |
|-----------|----------|-------|-----------|--------|
| Hero title words | `opacity`, `y`, `rotateX` | GSAP timeline | ❌ No | ✅ Preserved |
| Hero subtitle | `opacity`, `y` | GSAP timeline | ❌ No | ✅ Preserved |
| Hero CTA | `opacity`, `y` | GSAP timeline | ❌ No | ✅ Preserved |
| Feature cards | `opacity`, `y` | GSAP ScrollTrigger | ❌ No | ✅ Preserved |

**Verdict:** No theme utility classes override GSAP-owned properties. GSAP sections were explicitly excluded from migration per PRD scope freeze.

---

## Console Check

- No `gsap` warnings or errors in build output
- No new GSAP-related console markers introduced by Waves 1–3

**Result:** PASS
