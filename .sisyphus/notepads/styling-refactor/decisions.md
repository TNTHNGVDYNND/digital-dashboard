# Decisions — styling-refactor

> Decision log for the styling-refactor initiative.
> Entries are dated and signed off at wave closure.

---

## D1 — Tailwind v4 theme source in CSS (`@theme`) over legacy JS config

- **What:** Define design system in `globals.css` using Tailwind v4 `@theme` directives.
- **Why:** Tailwind v4 promotes CSS-native theme authoring and reduces config drift.
- **Alternative considered:** Continue with v3-style `tailwind.config.js` extension.
- **Rejected because:** adds split brain (JS config + CSS), less aligned with v4 direction.
- **Conditions:** right while project stays on Tailwind v4 CSS-first architecture.
- **Escape plan:** if plugin compatibility requires JS config, mirror tokens from CSS into generated config bridge.
- **Validation signals:** token changes propagate consistently across pages; no missing utilities during build.
- **Challenged instinct:** "config file is always cleaner" is not true in v4 CSS-first workflow.

## D2 — Semantic color tokens over literal color naming

- **What:** Use semantic token categories (`primary`, `surface`, `text`, etc.) with scale-backed vars.
- **Why:** supports theme swaps and future rebranding with lower migration cost.
- **Alternative considered:** direct literal palette usage in each component.
- **Rejected because:** duplicates intent and increases drift.
- **Conditions:** right while team values design consistency and maintainability.
- **Escape plan:** provide compatibility aliases for frequently used literal classes during transition.
- **Validation signals:** reduced literal color churn in PRs, predictable dark/light mapping.
- **Challenged instinct:** "faster to just use literal classes" is short-term only.

## D3 — Dark mode default from OS + `data-theme` override

- **What:** System preference is default; attribute override enforces explicit user choice.
- **Why:** balances zero-config user comfort with product-level control.
- **Alternative considered:** class-only dark mode toggled manually.
- **Rejected because:** loses automatic preference alignment and can increase flash risk.
- **Conditions:** right while product needs both passive and explicit theme behavior.
- **Escape plan:** if complexity rises, simplify to attribute-only with persisted preference.
- **Validation signals:** no theme flash; correct mode under both OS and manual override scenarios.
- **Challenged instinct:** "just use `dark:` class everywhere" ignores first-paint correctness.

## D4 — Migration order: low-risk primitives first

- **What:** migrate shared UI/static components first, then complex/animated surfaces.
- **Why:** isolates risk and makes regressions easier to detect.
- **Alternative considered:** big-bang migration across all pages at once.
- **Rejected because:** high blast radius and harder debugging.
- **Conditions:** right for refactors touching many components.
- **Escape plan:** if dependencies force complex component early, gate with dedicated visual diff/evidence.
- **Validation signals:** early waves remain stable; later waves have reduced surprises.
- **Challenged instinct:** "finish fastest with one pass" often increases rollback costs.

## D5 — Preserve GSAP via transform/opacity ownership boundaries

- **What:** keep GSAP-owned properties (transform/opacity/filter where applicable) under animation control; tokens affect static style layers.
- **Why:** avoids CSS class changes overriding timeline-driven states.
- **Alternative considered:** rewriting animated style properties into theme-driven classes indiscriminately.
- **Rejected because:** can break timeline interpolation and trigger jitter.
- **Conditions:** right while existing timeline architecture remains class+inline hybrid.
- **Escape plan:** move critical animated properties to dedicated GSAP-managed CSS vars if conflicts arise.
- **Validation signals:** ScrollTrigger start/end positions and easing behavior match baseline.
- **Challenged instinct:** "all styles should be utility classes" fails for animation-owned props.

## D6 — Preserve Three.js boundaries through explicit layering contract

- **What:** enforce z-index/positioning contract for canvas wrappers and overlay content; keep renderer colors independent from CSS tokens unless intentionally mapped.
- **Why:** prevents canvas occlusion or unexpected color inheritance effects.
- **Alternative considered:** broad global style overrides on canvas/container elements.
- **Rejected because:** increases risk of render stacking and compositing bugs.
- **Conditions:** right while R3F canvas remains a separate rendering context.
- **Escape plan:** isolate canvas host styles into dedicated wrapper class with strict reset.
- **Validation signals:** hero 3D scene remains visible, interactive, and layered correctly.
- **Challenged instinct:** "global CSS is harmless for canvas" is false in layered UIs.
