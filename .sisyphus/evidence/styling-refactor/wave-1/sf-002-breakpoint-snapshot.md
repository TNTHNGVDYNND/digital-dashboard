# SF-002 Breakpoint Snapshot

**File:** `src/app/globals.css`
**Date:** 2026-05-10
**Slice:** SF-002 — Responsive Architecture

## Breakpoint Definitions

```css
@theme {
  --breakpoint-sm: 40rem;   /* 640px  */
  --breakpoint-md: 48rem;   /* 768px  */
  --breakpoint-lg: 64rem;   /* 1024px */
  --breakpoint-xl: 80rem;   /* 1280px */
  --breakpoint-2xl: 96rem;  /* 1536px */
}
```

## Breakpoint Intent

| Breakpoint | Width | Layout Purpose |
|---|---|---|
| `sm` | 640px | Baseline mobile improvements — increase padding, bump font sizes |
| `md` | 768px | Tablet stacking → split layouts — two-column grids activate |
| `lg` | 1024px | Desktop default — full navigation, sidebars, max-width containers |
| `xl` | 1280px | Wide desktop — expanded spacing, larger hero elements |
| `2xl` | 1536px | Ultra-wide — dashboard refinements, max content width |

## Responsive Transitions Applied Per Page Shell

### Home (`src/app/page.tsx`)
- Already had `overflow-x-hidden` on `<main>` to prevent horizontal scroll
- No changes needed — GSAP sections handle their own responsive behavior

### Dashboard (`src/app/dashboard/page.tsx`)
- Already responsive: `sm:flex-row`, `sm:grid-cols-2`, `lg:grid-cols-3`
- Container: `container mx-auto max-w-5xl`
- No changes needed — existing patterns are sound

### Campaigns (`src/app/campaigns/page.tsx`)
- **Added:** `container mx-auto max-w-4xl` for consistent content width
- **Added:** `px-4 py-8 sm:px-6 sm:py-12` — tighter padding on mobile, relaxed on desktop
- **Added:** `text-3xl sm:text-4xl` — smaller heading on mobile
- **Added:** `text-base sm:text-lg` — smaller subtitle on mobile
- **Added:** `mb-8 sm:mb-12` — reduced margin on mobile

### Contact (`src/app/contact/page.tsx`)
- **Added:** `px-4` — horizontal padding on mobile to prevent edge touching
- **Added:** `text-3xl sm:text-4xl` — responsive heading size
- **Added:** `text-base sm:text-lg` — responsive subtitle size
- **Added:** `mt-3 sm:mt-4` — responsive margin

### FAQ (`src/app/faq/page.tsx`)
- **Added:** `px-4` — horizontal padding on mobile
- **Added:** `text-3xl sm:text-4xl` — responsive heading size
- **Added:** `text-base sm:text-lg` — responsive subtitle size
- **Added:** `mt-3 sm:mt-4` — responsive margin

## Verification

| Page | sm (375px) | md (768px) | lg (1024px) | xl (1440px) |
|---|---|---|---|---|
| Home | overflow-x-hidden ✅ | overflow-x-hidden ✅ | overflow-x-hidden ✅ | overflow-x-hidden ✅ |
| Dashboard | container + px-4 ✅ | container + px-4 ✅ | max-w-5xl ✅ | max-w-5xl ✅ |
| Campaigns | px-4 py-8 text-3xl ✅ | px-6 py-12 text-4xl ✅ | max-w-4xl ✅ | max-w-4xl ✅ |
| Contact | px-4 text-3xl ✅ | px-4 text-4xl ✅ | centered ✅ | centered ✅ |
| FAQ | px-4 text-3xl ✅ | px-4 text-4xl ✅ | centered ✅ | centered ✅ |

## Horizontal Scroll Check

| Page | sm (375px) | md (768px) |
|---|---|---|
| Home | No horizontal scroll ✅ | No horizontal scroll ✅ |
| Dashboard | No horizontal scroll ✅ | No horizontal scroll ✅ |
| Campaigns | No horizontal scroll ✅ | No horizontal scroll ✅ |
| Contact | No horizontal scroll ✅ | No horizontal scroll ✅ |
| FAQ | No horizontal scroll ✅ | No horizontal scroll ✅ |
