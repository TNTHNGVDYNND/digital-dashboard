# SF-003 Bootstrap Script Snapshot

## File: `src/app/layout.tsx`

### Inline Script (IIFE in `<head>`)

```tsx
const THEME_BOOTSTRAP = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || theme === 'light') {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

// In JSX:
<head>
  <script
    id="theme-bootstrap"
    dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }}
  />
</head>
```

### Script Behavior

| Scenario | Expected Result |
|----------|----------------|
| `localStorage.theme = "dark"` | Sets `data-theme="dark"` on `<html>` |
| `localStorage.theme = "light"` | Sets `data-theme="light"` on `<html>` |
| No `localStorage.theme` + OS dark | Sets `data-theme="dark"` on `<html>` |
| No `localStorage.theme` + OS light | Sets `data-theme="light"` on `<html>` |
| localStorage throws (private mode) | Falls back to `data-theme="light"` |

### Placement Verification
- Script is rendered inside `<head>` before `<body>`
- Runs as inline IIFE with no external dependencies
- Executes before any render-blocking resources
- No flash of wrong theme possible because script runs synchronously in `<head>`

### SSR Safety
- Script is a string constant, not a client-side module import
- `dangerouslySetInnerHTML` is used to inject the IIFE directly
- No hydration mismatch because the script sets the attribute before React hydrates
- `suppressHydrationWarning` is already present on `<html>` and `<body>`
