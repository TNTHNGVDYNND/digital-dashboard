# Momus PRD Review: styling-refactor
**Date:** 2026-05-10
**Artifacts reviewed:** PRD: `/home/vladi/developer/digital-dashboard/.sisyphus/prds/styling-refactor-prd.md`

## Summary
**Gate Decision:** FAIL
**Blocker count:** 9 total (1 critical, 8 major, 0 minor)

### Top 3 Risks
1. **Dark-mode contract contradiction** — PRD requires preserving `dark:` conventions while also requiring OS-driven default + `data-theme` override, but does not define a compatible precedence/variant strategy.
2. **Unbounded migration scope** — PRD leaves “how far migration goes” open, creating likely scope drift and unpredictable timeline.
3. **Non-objective verification** — key acceptance checks (“no flash”, “no visual regression”, “animations still function”) lack executable pass/fail criteria.

## Detailed Findings

### A. Logical Contradictions

A-1: **CRITICAL** Dark-mode mechanism conflict (`dark:` conventions vs `data-theme` override + OS default)
- Location: Design Requirements (lines 98, 150-154), Decision D3 (lines 203-211)
- Evidence: "Dark mode class conventions (`dark:`)" + "Automatic via `@media (prefers-color-scheme: dark)`" + "Manual override via `data-theme=\"dark\"`"
- Conflict: `dark:` variants and `data-theme` override are not automatically equivalent strategies in Tailwind v4. Without explicit variant/preference precedence, one requirement will undercut another.
- Fix: Define one canonical dark-mode contract with explicit precedence table. Recommended: semantic CSS variables as source of truth; `@media (prefers-color-scheme: dark)` sets default tokens; `:root[data-theme="dark"|"light"]` overrides deterministically; restrict `dark:` usage to non-token edge cases.

A-2: **MAJOR** Scope intent contradiction inside PRD itself
- Location: End State (line 34), User Story 8 test (line 71), Open Questions (line 298)
- Evidence: "Components consume semantic token-backed classes..." and migration sequence includes "dashboard/campaign/animated sections" while open question asks whether migration is full vs core-only.
- Conflict: PRD simultaneously claims a defined end state and leaves migration depth unresolved.
- Fix: Freeze scope in PRD now: either full component migration or explicit component inventory for phase-1 (core surfaces + shared primitives only).

### B. Scope Creep

B-1: **MAJOR** No-flash requirement has hidden implementation dependency not scoped as a module
- Location: Dark Mode no-flash (lines 155-158), Open Questions (line 300), Module Boundaries table (lines 172-179)
- Evidence: "Resolve theme preference before first meaningful paint (small bootstrap script or server-emitted attribute strategy)."
- Hidden dependency: Requires `src/app/layout.tsx` (or equivalent document bootstrap path) changes, but layout/bootstrap is not listed as a first-class module boundary.
- Fix: Add explicit module boundary + slice for first-paint theme bootstrap (layout script/attribute strategy), including SSR/CSR behavior.

B-2: **MAJOR** Workflow governance tasks are embedded as product acceptance criteria
- Location: Acceptance Criteria 9-10 (lines 317-318)
- Evidence: "Dual Momus gates both passed" and "Plan archived and beads issue closed"
- Hidden dependency: These are process/workflow outcomes outside product behavior and can fail independently of implementation quality.
- Fix: Move 9-10 to Delivery Checklist/Governance section; keep product acceptance criteria strictly implementation-observable.

B-3: **MAJOR** GSAP/Three.js preservation requires baseline artifacts not explicitly declared as prerequisites
- Location: GSAP/Three contract (lines 251-257), Testing Decisions (lines 264-265)
- Evidence: "match baseline" behavior is implied but no baseline capture requirement is defined before migration.
- Hidden dependency: Need pre-refactor baseline captures (timings/screens/stacking snapshots) to assess regressions objectively.
- Fix: Add prerequisite step: capture baseline evidence before first migration wave.

### C. Missing Verification

C-1: **MAJOR** `@theme` completeness is not objectively testable as written
- Location: User Story 1 test (line 44), Acceptance 1 (line 309)
- Evidence: "includes complete `@theme` tokens" / "contains a complete `@theme` directive"
- Problem: "complete" is undefined; auditors cannot deterministically pass/fail.
- Fix: Specify required token inventory (exact groups + minimum keys, e.g., `--color-primary-{50..900}`, required semantic aliases, `--breakpoint-*` tokens).

C-2: **MAJOR** No-flash requirement lacks measurable test protocol
- Location: User Story 7 test (line 66), Dark mode no-flash (lines 155-158)
- Evidence: "initial paint uses resolved theme without light/dark flicker"
- Problem: No measurement method (filmstrip, CPU throttling, forced theme transitions, screenshot checkpoints).
- Fix: Define executable check: e.g., Playwright trace with forced light/dark, first-frame screenshot assertion, and zero intermediate incorrect theme frame.

C-3: **MAJOR** “No visual regression” is subjective and unbounded
- Location: User Story 9 test (line 74), Acceptance 5 (line 313)
- Evidence: "show no visual regression"
- Problem: No baseline image set, viewport matrix, or tolerated diff threshold.
- Fix: Define exact pages + viewport set + baseline artifacts + max pixel/percentage diff threshold.

C-4: **MAJOR** GSAP verification is non-objective
- Location: User Story 10 test (line 79), Acceptance 6 (line 314)
- Evidence: "animations still function" / "timelines fire correctly"
- Problem: No specified selectors, trigger points, or expected timeline states.
- Fix: Add scripted checks per key animation: trigger scroll positions, expected class/style states, and tolerance bounds.

C-5: **MAJOR** Three.js verification is non-objective
- Location: User Story 11 test (line 82), Acceptance 7 (line 315)
- Evidence: "canvas still renders" / "layered correctly"
- Problem: No deterministic criteria for render success (frame rendered? interaction? z-index relation?).
- Fix: Add checks for non-empty frame render, canvas visibility, overlay contrast minimum, and stacking order assertions.

## Fix Recommendations (Priority Order)
1. **CRITICAL** Dark-mode mechanism conflict — define a single canonical token + override precedence model and constrain `dark:` usage — Effort: **medium (half day)**
2. **MAJOR** Freeze migration scope (full vs phase-1 inventory) and remove ambiguity from Open Questions — Effort: **small (1-4h)**
3. **MAJOR** Convert subjective checks into executable acceptance tests (no-flash, visual diff, GSAP, Three.js) — Effort: **medium (half day)**
4. **MAJOR** Move workflow gates (Momus/archival/beads) out of product acceptance criteria into delivery governance — Effort: **trivial (<1h)**
5. **MAJOR** Add explicit baseline-capture prerequisite for animation/3D and visual comparison — Effort: **small (1-4h)**

## Prior Review Context
No prior Momus PRD review found in `.sisyphus/notepads/styling-refactor/`.