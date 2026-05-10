# Responsive Rules for Future Developers

**Project:** digital-dashboard  
**Date:** 2026-05-10  
**Scope:** Wave 1 responsive architecture contract

---

## Breakpoint Strategy

Breakpoints are defined in `src/app/globals.css` via `@theme`:

```css
--breakpoint-sm: 40rem;   /* 640px  */
--breakpoint-md: 48rem;   /* 768px  */
--breakpoint-lg: 64rem;   /* 1024px */
--breakpoint-xl: 80rem;   /* 1280px */
--breakpoint-2xl: 96rem;  /* 1536px */
```

Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`.

---

## Page Shell Contract

Every page shell (`src/app/*/page.tsx`) MUST:

1. **Use `<main>` as the root element**
2. **Apply `min-h-screen`** to ensure the page fills the viewport
3. **Apply `px-4` minimum** for mobile safe area (increase to `sm:px-6` or `lg:px-8` as needed)
4. **Use `container mx-auto max-w-*`** for content width capping on large screens
5. **Apply `overflow-x-hidden`** if the page contains full-bleed sections (home page)

---

## Responsive Anti-Patterns

### ❌ NEVER: Fixed widths on mobile

```tsx
// Bad — breaks on narrow viewports
<div className="w-[375px]">
```

### ❌ NEVER: Hardcoded pixel padding without responsive scaling

```tsx
// Bad — 32px padding is too much on mobile
<div className="px-8">

// Good — scales with breakpoint
<div className="px-4 sm:px-6 lg:px-8">
```

### ❌ NEVER: Breakpoint-only layouts without mobile fallback

```tsx
// Bad — no default layout below sm
<div className="sm:grid sm:grid-cols-2">

// Good — mobile-first with enhancement
<div className="grid grid-cols-1 sm:grid-cols-2">
```

### ❌ NEVER: Horizontal scroll caused by full-bleed children

```tsx
// Bad — child breaks out of parent width
<div className="w-screen">

// Good — constrain to parent
<div className="w-full">
```

### ❌ NEVER: Touch targets smaller than 44px on mobile

```tsx
// Bad — 32px button is hard to tap
<button className="h-8 w-8">

// Good — 44px minimum touch target
<button className="h-11 w-11">
```

### ❌ NEVER: Font sizes that don't scale down for mobile

```tsx
// Bad — 2.25rem is too large on 375px screens
<h1 className="text-4xl">

// Good — scales from 1.875rem to 2.25rem
<h1 className="text-3xl sm:text-4xl">
```

---

## Preferred Patterns

### ✅ Mobile-first utility stacking

```tsx
<div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
```

### ✅ Fluid typography

```tsx
<h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
```

### ✅ Responsive grid transitions

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
```

### ✅ Container + max-width for readability

```tsx
<main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
  <div className="container mx-auto max-w-5xl">
    {/* content */}
  </div>
</main>
```

---

## Page-Specific Responsive Notes

| Page | Container | Key Responsive Behavior |
|---|---|---|
| Home | None (full-bleed sections) | `overflow-x-hidden` on `<main>`; sections manage own padding |
| Dashboard | `max-w-5xl` | Filter toolbar stacks → horizontal; campaign grid 1→2→3 cols |
| Campaigns | `max-w-4xl` | Builder form stays single column; padding scales |
| Contact | None (centered) | `px-4` safe area; typography scales |
| FAQ | None (centered) | `px-4` safe area; typography scales |

---

## Verification Checklist

Before committing a new page or component:

- [ ] Page has `px-4` minimum horizontal padding
- [ ] Typography uses at least one responsive breakpoint (`sm:` or higher)
- [ ] No fixed pixel widths that break below 375px
- [ ] No horizontal scroll at 375px viewport
- [ ] Touch targets are ≥ 44px on mobile
- [ ] Build passes (`npm run build`)
