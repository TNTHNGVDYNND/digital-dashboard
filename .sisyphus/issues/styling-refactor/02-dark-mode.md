# SF-003 — Dark Mode

**Slice ID:** SF-003  
**Name:** Dark Mode  
**AFK:** Yes (clear acceptance criteria, automated pass/fail tests possible)  
**Effort Estimate:** Small–Medium (2–3 hours)  
**Type:** Enabling slice (foundational infrastructure)

---

## User Stories

5. **As a user, I want the app to follow my OS color preference, so that dark mode works automatically.**
   - Test: when OS is dark, app renders dark theme without manual action.

6. **As a user, I want a manual override via `data-theme`, so that I can choose dark mode independent of OS setting.**
   - Test: setting `data-theme="dark"` forces dark theme even if OS is light.

7. **As a user, I want no flash of wrong theme on load, so that theme transitions feel stable.**
   - Test: initial paint uses resolved theme without light/dark flicker.

---

## Acceptance Criteria

- [ ] Dark-mode token overrides are defined inside `@theme` or adjacent CSS blocks in `globals.css`:
  - All semantic color tokens (`primary`, `surface`, `text`, `accent`, `success`, `warning`, `danger`) have dark variants.
  - Dark values are applied via `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`.
- [ ] Theme resolution precedence is implemented correctly (highest to lowest):
  1. Explicit override: `:root[data-theme="dark"]` or `:root[data-theme="light"]` wins unconditionally.
  2. OS default: `@media (prefers-color-scheme: dark)` applied when no `data-theme` attribute is present.
  3. Light fallback: Default tokens are the light-theme values.
- [ ] No-flash bootstrap is implemented in `src/app/layout.tsx`:
  - An inline `<script>` in `<head>` reads `localStorage.theme` + `window.matchMedia('(prefers-color-scheme: dark)')`.
  - The script sets `data-theme` on `<html>` before any render-blocking resources.
  - No React hydration mismatch occurs.
- [ ] `localStorage` persistence:
  - Manual `data-theme` choice is saved to `localStorage.theme`.
  - On next visit, the saved choice is respected (falls back to OS preference if none saved).
- [ ] No-flash verification protocol passes:
  - Load page with OS dark mode enabled + clear cache. First paint must show dark theme (no light frame visible).
  - Load page with `localStorage.theme = "dark"` while OS is light. First paint must show dark theme.
  - Measurement: Use browser DevTools Performance panel → Screenshots. Verify no intermediate light frame at timestamp 0.
  - Pass criterion: Zero incorrect-theme frames in first 2 render passes.
- [ ] `npm run build` passes with zero errors.
- [ ] The `dark:` utility variant is restricted to edge cases only; all first-party components must use semantic tokens.

---

## Dependencies

- **Blockers:** SF-001 (theme tokens must exist before dark overrides can be defined).
- **Blocked by this slice:** SF-004, SF-005, SF-006.

---

## Evidence Requirements

Capture the following in `.sisyphus/evidence/styling-refactor/sf-003/`:

1. **Dark token snapshot:** Relevant dark-mode CSS blocks from `globals.css`.
2. **Bootstrap script snapshot:** The inline `<script>` from `layout.tsx`.
3. **No-flash test results:**
   - Screenshot or DevTools Performance panel recording showing first paint is correct.
   - Pass/fail note for both OS-dark and localStorage-dark scenarios.
4. **localStorage persistence test:**
   - Set theme manually → reload → verify persisted.
5. **Build log:** `npm run build` output saved as `build.log`.

---

## Anti-Patterns to Avoid

- Do NOT use `dark:` utility variant for first-party components (reserved for third-party overrides).
- Do NOT introduce per-component ad-hoc dark-mode logic.
- Do NOT cause React hydration mismatch with the inline script (must run before React hydrates).
- Do NOT forget to handle the `data-theme="light"` explicit override case.

---

## Notes

- The no-flash bootstrap is the most critical and fragile part of this slice. Test thoroughly in both SSR and CSR contexts.
- If a `ThemeProvider` component is preferred over an inline script, ensure it still sets the attribute before first paint.
- Dark-mode tokens should mirror the light-mode structure exactly (same token names, different values).
