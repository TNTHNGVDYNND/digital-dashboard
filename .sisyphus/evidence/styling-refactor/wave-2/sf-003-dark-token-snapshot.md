# SF-003 Dark Token Snapshot

## File: `src/app/globals.css`

### Tailwind v4 Dark Variant Configuration
```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

This makes the `dark:` utility variant respond to `data-theme="dark"` on the HTML element, rather than only `prefers-color-scheme: dark`.

### Dark Mode: OS Preference (`@media` block)
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-surface-0: #0f172a;
    --color-surface-50: #1e293b;
    --color-surface-100: #334155;
    --color-surface-200: #475569;
    --color-surface-300: #64748b;
    --color-surface-400: #94a3b8;
    --color-surface-500: #cbd5e1;

    --color-text-primary: #f8fafc;
    --color-text-secondary: #cbd5e1;
    --color-text-muted: #94a3b8;
    --color-text-inverse: #0f172a;

    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4);
  }
}
```

### Dark Mode: Explicit Override (`:root[data-theme="dark"]`)
```css
:root[data-theme="dark"] {
  --color-surface-0: #0f172a;
  --color-surface-50: #1e293b;
  --color-surface-100: #334155;
  --color-surface-200: #475569;
  --color-surface-300: #64748b;
  --color-surface-400: #94a3b8;
  --color-surface-500: #cbd5e1;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-muted: #94a3b8;
  --color-text-inverse: #0f172a;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4);
}
```

### Light Mode: Explicit Override (`:root[data-theme="light"]`)
```css
:root[data-theme="light"] {
  --color-surface-0: #ffffff;
  --color-surface-50: #f8fafc;
  --color-surface-100: #f1f5f9;
  --color-surface-200: #e2e8f0;
  --color-surface-300: #cbd5e1;
  --color-surface-400: #94a3b8;
  --color-surface-500: #64748b;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;
  --color-text-inverse: #f8fafc;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Token Override Summary

| Token | Light Default | Dark Override | Purpose |
|-------|--------------|---------------|---------|
| `--color-surface-0` | `#ffffff` | `#0f172a` | Page background |
| `--color-surface-50` | `#f8fafc` | `#1e293b` | Card/subtle surface |
| `--color-surface-100` | `#f1f5f9` | `#334155` | Elevated surface |
| `--color-surface-200` | `#e2e8f0` | `#475569` | Borders/dividers |
| `--color-surface-300` | `#cbd5e1` | `#64748b` | Muted borders |
| `--color-surface-400` | `#94a3b8` | `#94a3b8` | Placeholder text |
| `--color-surface-500` | `#64748b` | `#cbd5e1` | Secondary icons |
| `--color-text-primary` | `#0f172a` | `#f8fafc` | Headings, body text |
| `--color-text-secondary` | `#475569` | `#cbd5e1` | Descriptions |
| `--color-text-muted` | `#94a3b8` | `#94a3b8` | Hints, disabled |
| `--color-text-inverse` | `#f8fafc` | `#0f172a` | Text on primary buttons |

### Precedence Verification
1. `:root[data-theme="light"]` — wins unconditionally (explicit light override)
2. `:root[data-theme="dark"]` — wins unconditionally (explicit dark override)
3. `@media (prefers-color-scheme: dark)` — applied when no `data-theme` set
4. Default `@theme` values — light fallback

This matches the PRD contract: `data-theme` > OS preference > light fallback.
