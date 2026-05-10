# Testing SPEC

Skill Chain Reaction for: "Plan a frontend styling refactor"
Based on your SYSTEM-OVERVIEW.md v2.1.2 architecture, here's how the skill chain would fire:
Phase 0: Intent Classification
Sisyphus (Orchestrator) detects: Open-ended implementation request → Routes to discovery first (vague scope: "styling refactor" could mean anything from tokens to responsive grid).

---

Phase 1: Discovery (if needed)
task(
category="deep",
load_skills=["discovery-orchestrator"],
prompt="User wants 'frontend styling refactor' for digital-dashboard.
Current state: globals.css has only '@import tailwindcss'.
Tech: Next.js 16, Tailwind v4.2.2, GSAP, Three.js/R3F.
Scope is unclear. Clarify: tokens? responsive? dark mode?
animation integration? component library?"
)
Output: Clarified brief → "Add design system tokens, responsive architecture, and dark mode support to globals.css while preserving existing GSAP/Three.js styles"

---

Phase 2: Brief Validation
task(
category="orchestration",
load_skills=["brief-loader"],
prompt="Validate brief for digital-dashboard styling refactor..."
)
Gate: Checkpoint 1 — Brief validated? ✅

---

Phase 3: PRD Writing
task(
category="deep",
load_skills=["prd-writer"],
prompt="Write PRD for: Add Tailwind v4 theme system to digital-dashboard.
Must include: @theme directive, color tokens, spacing scale,
responsive breakpoints, dark mode via @media (prefers-color-scheme),
integration with existing GSAP animations (no visual regression),
preserve Three.js canvas styling."
)
Artifact produced: .sisyphus/prds/styling-refactor-prd.md

---

Phase 4: PRD Review (Momus Gate 1)
task(
category="deep",
load_skills=["momus-prd-reviewer"],
prompt="Review PRD: /home/vladi/developer/digital-dashboard/.sisyphus/prds/styling-refactor-prd.md"
)
Expected output:

- Category A (Contradictions): Check if theme tokens conflict with existing inline styles in src/components/canvas/ or GSAP ScrollTrigger pinning
- Category B (Scope): Verify "preserve Three.js" doesn't mean "don't touch canvas" — canvas might need z-index adjustments
- Category C (Verification): How do we verify dark mode without visual regression tests?
  Gate Decision: PASS / WARNING / FAIL → User approves

---

Phase 5: Issue Creation (Vertical Slices)
task(
category="orchestration",
load_skills=["issue-creator"],
prompt="Break PRD into vertical slices for styling refactor..."
)
Expected slices:

1. SF-001: @theme foundation — colors, spacing, typography tokens in globals.css
2. SF-002: Responsive architecture — breakpoints, container queries for dashboard grid
3. SF-003: Dark mode — prefers-color-scheme + data-theme toggle integration
4. SF-004: Component migration — migrate hardcoded styles in FilterToolbar, CampaignBuilder to theme tokens
5. SF-005: GSAP/Three.js integration — ensure animations don't break with new token system
6. SF-006: Regression verification — visual diff check (manual or scripted)

---

Phase 6: Plan Writing
task(
category="orchestration",
load_skills=["plan-writer"],
prompt="Create execution plan from PRD + issues for styling refactor..."
)
Artifact: .sisyphus/plans/styling-refactor.md

---

Phase 7: Plan Review (Momus Gate 2)
task(
category="deep",
load_skills=["momus-plan-reviewer"],
prompt="Review plan: /home/vladi/developer/digital-dashboard/.sisyphus/plans/styling-refactor.md"
)
Expected checks:

- D (Dependencies): Does SF-004 (component migration) depend on SF-001 (tokens) being deployed first?
- E (Integration): Will dark mode toggle conflict with existing Zustand store in src/store/?
- F (Resources): Do we need Storybook or Chromatic for visual regression? (Probably manual for now)
  Gate Decision: PASS / WARNING → User approves

---

Phase 8: Wave Execution (Where actual work happens)
task(
category="orchestration",
load_skills=["wave-executor"],
prompt="Execute Wave 1: SF-001 (theme foundation) + SF-002 (responsive)..."
)
Step 0: Load rules from rules/concerns/coding-style.md, rules/languages/css.md
Step 1: Invoke frontend-ui-ux agent (visual-engineering category) to write actual CSS
Step 2: Run wave-validator.sh — check evidence exists in .sisyphus/evidence/styling-refactor/
Step 3: Return summary → "Wave 1 complete. Continue?"

---

Phase 9: Regression Gate (Between Waves)
task(
category="unspecified-low",
load_skills=["regression-gate"],
prompt="Run regression before Wave 2: verify existing campaigns page, dashboard,
builder still render correctly with new theme tokens..."
)
Expected: Build passes, no visual regression in core flows.

---

Phase 10: Plan Closure
task(
category="orchestration",
load_skills=["plan-closer"],
prompt="Close styling-refactor plan, archive evidence, update wiki..."
)
Artifacts: Evidence archived, beads issue closed, vault-ops publishes to wiki.

---

What would actually change in globals.css after all 6 waves:
@import 'tailwindcss';
@theme {
/_Colors_/
--color-primary: #3b82f6;
--color-primary-dark: #1d4ed8;
--color-surface: #ffffff;
--color-surface-dark: #0f172a;

/_Spacing_/
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 2rem;

/_Typography_/
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'Fira Code', monospace;

/_Breakpoints _/
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
}
/_ Dark mode _/
@media (prefers-color-scheme: dark) {
:root {
--color-surface: var(--color-surface-dark);
}
}
/_ Preserve GSAP/Three.js canvas_/
.canvas-wrapper {
position: relative;
z-index: 1;
}

---

breakpoints _/
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
}
/_ Dark mode _/
@media (prefers-color-scheme: dark) {
:root {
--color-surface: var(--color-surface-dark);
}
}
/_ Preserve GSAP/Three.js canvas\*/
.canvas-wrapper {
position: relative;
z-index: 1;
}

---
