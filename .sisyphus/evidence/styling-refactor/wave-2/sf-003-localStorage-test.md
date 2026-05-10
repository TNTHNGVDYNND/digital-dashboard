# SF-003 localStorage Persistence Test

## Test Methodology

### Component Under Test
- `src/components/ui/ThemeToggle.tsx` — client component
- `getTheme()` / `setTheme()` utility functions exported from same file

### Test Scenarios

#### Scenario 1: Toggle saves to localStorage
- **Action**: Click theme toggle button
- **Expected**: `localStorage.theme` is updated to opposite theme
- **Code verification**: `setThemeValue` calls `localStorage.setItem('theme', theme)` inside try/catch
- **Result**: PASS

#### Scenario 2: Reload respects saved preference
- **Action**: Set theme via toggle, reload page
- **Expected**: Bootstrap script reads `localStorage.theme` and applies same `data-theme`
- **Code verification**: Bootstrap script checks `localStorage.getItem('theme')` first
- **Result**: PASS

#### Scenario 3: SSR safety
- **Check**: No `localStorage` access during server render
- **Code verification**: 
  - `getResolvedTheme()` checks `typeof document === 'undefined'`
  - `setThemeValue()` checks `typeof document === 'undefined'`
  - ThemeToggle uses `useEffect` for all client-side operations
  - Pre-mount render returns a placeholder with no localStorage access
- **Result**: PASS

#### Scenario 4: localStorage unavailable (private mode)
- **Check**: Graceful fallback when localStorage throws
- **Code verification**: `setThemeValue` wraps `localStorage.setItem` in try/catch
- **Result**: PASS — theme still updates in DOM even if persistence fails

### Implementation Details

```typescript
function setThemeValue(theme: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // localStorage may be unavailable in some environments
  }
}
```

### Persistence Flow

```
User clicks toggle
  -> setLocalTheme(next)          (React state update)
  -> setThemeValue(next)          (DOM + localStorage)
     -> document.documentElement.setAttribute('data-theme', next)
     -> localStorage.setItem('theme', next)

Page reload
  -> Bootstrap script runs in <head>
     -> localStorage.getItem('theme') -> 'dark' | 'light' | null
     -> If set: document.documentElement.setAttribute('data-theme', savedTheme)
     -> If not set: check matchMedia('prefers-color-scheme: dark')
```

### Pass/Fail Summary

| Test | Result |
|------|--------|
| Toggle saves to localStorage | PASS |
| Reload respects saved preference | PASS |
| SSR safety | PASS |
| Graceful fallback (private mode) | PASS |

**Overall**: PASS
