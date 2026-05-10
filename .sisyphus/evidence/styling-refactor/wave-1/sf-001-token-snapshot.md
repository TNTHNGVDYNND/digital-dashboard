# SF-001 Token Snapshot

**File:** `src/app/globals.css`
**Date:** 2026-05-10
**Slice:** SF-001 — @theme Foundation

## Final @theme Block

```css
@theme {
  /* ── Colors: Primary (indigo) ── */
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;

  /* ── Colors: Surface (slate) ── */
  --color-surface-0: #ffffff;
  --color-surface-50: #f8fafc;
  --color-surface-100: #f1f5f9;
  --color-surface-200: #e2e8f0;
  --color-surface-300: #cbd5e1;
  --color-surface-400: #94a3b8;
  --color-surface-500: #64748b;

  /* ── Colors: Text ── */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-text-inverse: #f8fafc;

  /* ── Colors: Accent (violet) ── */
  --color-accent-500: #8b5cf6;
  --color-accent-600: #7c3aed;

  /* ── Colors: Success (emerald) ── */
  --color-success-500: #10b981;
  --color-success-600: #059669;

  /* ── Colors: Warning (amber) ── */
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;

  /* ── Colors: Danger (red) ── */
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;

  /* ── Spacing ── */
  --spacing-4: 0.25rem;
  --spacing-8: 0.5rem;
  --spacing-12: 0.75rem;
  --spacing-16: 1rem;
  --spacing-20: 1.25rem;
  --spacing-24: 1.5rem;
  --spacing-32: 2rem;
  --spacing-40: 2.5rem;
  --spacing-48: 3rem;
  --spacing-64: 4rem;
  --spacing-80: 5rem;
  --spacing-96: 6rem;

  /* ── Typography: Font families ── */
  --font-sans:
    'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;

  /* ── Typography: Font sizes ── */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* ── Typography: Font weights ── */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ── Typography: Line heights ── */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* ── Breakpoints ── */
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;

  /* ── Radii ── */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

## Base Layer Styles

```css
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--color-surface-0);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    line-height: var(--leading-normal);
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
    line-height: var(--leading-tight);
  }

  p {
    color: var(--color-text-secondary);
  }

  a {
    color: var(--color-primary-600);
  }

  a:hover {
    color: var(--color-primary-700);
  }
}
```

## Token Inventory vs PRD Acceptance Criteria #1

| Token Group | Required | Status |
|---|---|---|
| primary-50..900 | 10 values | ✅ 10/10 defined |
| surface-0..500 | 6 values | ✅ 6/6 defined |
| text-primary,secondary,muted,inverse | 4 values | ✅ 4/4 defined |
| accent-500,600 | 2 values | ✅ 2/2 defined |
| success-500,600 | 2 values | ✅ 2/2 defined |
| warning-500,600 | 2 values | ✅ 2/2 defined |
| danger-500,600 | 2 values | ✅ 2/2 defined |
| space-4,8,12,16,20,24,32,40,48,64,80,96 | 12 values | ✅ 12/12 defined |
| font-sans, font-display | 2 values | ✅ 2/2 defined |
| text-xs..4xl | 8 values | ✅ 8/8 defined |
| font-normal,medium,semibold,bold | 4 values | ✅ 4/4 defined |
| leading-tight,normal,relaxed | 3 values | ✅ 3/3 defined |
| breakpoint-sm,md,lg,xl,2xl | 5 values | ✅ 5/5 defined |

## Notes

- `@import 'tailwindcss'` is preserved as the first line.
- Default Tailwind colors are NOT overridden (`--color-*: initial` was NOT used) to preserve existing component styling.
- Semantic tokens are additive and coexist with default utilities.
- Base layer styles use semantic tokens but do not override utility classes (lower specificity).
