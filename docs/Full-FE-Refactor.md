# Full Frontend Styling Refactor — v2.1.2 Skill Chain Prompt Testing

---

## Intent Classification

**I detect implementation intent.**
I am requesting a full frontend styling refactor for my Next.js project `digital-dashboard` using the v2.1.2 Sisyphus planning workflow with all governance gates enabled.

**Current State:**

- Project: `/home/vladi/developer/digital-dashboard`
- Framework: Next.js 16.x with App Router
- Styling: Tailwind CSS v4.2.2 (latest)
- Global CSS: `/home/vladi/developer/digital-dashboard/src/app/globals.css` — currently contains ONLY `@import 'tailwindcss';`
- **Problem:** No design tokens, no theme directives, no responsive breakpoints, no dark mode, no custom utilities. For Tailwind v4, this is a skeleton with no design system.

**Desired Outcome:**
A complete design system implemented in `globals.css` using Tailwind v4 `@theme` directives, including:

1. Color tokens (primary, surface, text, accent)
2. Spacing scale
3. Typography tokens
4. Responsive breakpoints
5. Dark mode support (`prefers-color-scheme` + `data-theme` toggle)
6. Integration preservation: GSAP animations and Three.js/R3F canvas must not break
7. Component migration strategy: hardcoded styles in existing components migrated to theme tokens

**Constraints:**

- Do NOT break existing GSAP ScrollTrigger animations
- Do NOT break Three.js canvas rendering
- Must pass `npm run build` after every wave
- No visual regression in core pages (home, dashboard, campaigns, contact, faq)

---

## Phase Execution Request

**Run the complete v2.1.2 workflow from Phase 1 through Phase 10.**

**Mandatory requirements:**

- **STOP at every gate** and present the artifact for my approval
- **Do NOT proceed** to the next phase until I explicitly type "approved" or "continue"
- **Use the correct category/model** for each phase per SYSTEM-OVERVIEW.md v2.1.2
- **Log evidence** to `.sisyphus/evidence/styling-refactor/` after every wave
- **Run wave-validator.sh** before presenting any wave summary
- **Apply rules** from `rules/concerns/coding-style.md` and `rules/languages/css.md` during Wave execution

---

## Phase-by-Phase Breakdown

### Phase 1: Discovery (if needed)

```
Skill: discovery-orchestrator
Category: deep (GPT-5.4)
Purpose: Clarify scope if my intent is ambiguous
Expected output: Validated brief
Gate: Checkpoint 1 — Brief validated? STOP for my approval.
```

### Phase 2: Brief Loader

```
Skill: brief-loader
Category: orchestration
Purpose: Load and validate the approved brief
Expected output: "Brief validated"
Gate: Checkpoint 2 — STOP for my approval.
```

### Phase 3: PRD Writer

```
Skill: prd-writer
Category: deep (GPT-5.4)
Purpose: Write the Product Requirements Document for the styling refactor
Artifacts: .sisyphus/prds/styling-refactor-prd.md
Key sections to include:
  - @theme directive design
  - Color palette (light + dark)
  - Spacing and typography scales
  - Responsive breakpoint strategy
  - Dark mode implementation (prefers-color-scheme + data-theme)
  - GSAP/Three.js integration requirements
  - Component migration plan
  - Acceptance criteria (build pass, no visual regression)
Gate: STOP for my approval before Momus review.
```

### Gate 1: Momus PRD Review (MANDATORY)

```
Skill: momus-prd-reviewer
Category: deep (GPT-5.4)
Purpose: Ruthless review of the PRD
Check categories:
  A. Logical contradictions
  B. Scope creep
  C. Verification gaps
Expected output: PASS / WARNING / FAIL with blocker count
Gate: STOP. I must approve or request fixes before proceeding.
DO NOT proceed if FAIL.
```

### Phase 4: Issue Creator

```
Skill: issue-creator
Category: orchestration
Purpose: Break PRD into vertical slices (beads)
Artifacts: .sisyphus/issues/styling-refactor/
Expected slices (suggested):
  - SF-001: @theme foundation (colors, spacing, typography)
  - SF-002: Responsive architecture (breakpoints, container queries)
  - SF-003: Dark mode (prefers-color-scheme + toggle)
  - SF-004: Component migration (FilterToolbar, CampaignBuilder, etc.)
  - SF-005: GSAP/Three.js integration (preserve animations)
  - SF-006: Regression verification (visual diff, build check)
Gate: STOP for my approval.
```

### Phase 5: Plan Writer

```
Skill: plan-writer
Category: orchestration
Purpose: Create execution plan from PRD + issues
Artifacts: .sisyphus/plans/styling-refactor.md
Must include:
  - Wave-by-wave slice assignment
  - Dependencies between slices
  - Evidence requirements per wave
  - Regression checkpoints
Gate: STOP for my approval before Momus review.
```

### Gate 2: Momus Plan Review (MANDATORY)

```
Skill: momus-plan-reviewer
Category: deep (GPT-5.4)
Purpose: Ruthless review of the execution plan
Check categories:
  D. Dependency gaps
  E. Integration risks
  F. Resource/verification gaps
Expected output: PASS / WARNING / FAIL with blocker count
Gate: STOP. I must approve or request fixes before proceeding.
DO NOT proceed if FAIL.
```

### Phase 6: Wave Executor — Wave 1

```
Skill: wave-executor
Category: orchestration (kimi-k2.6)
Purpose: Execute Wave 1 slices
Expected: SF-001 + SF-002 (theme foundation + responsive)
Required actions:
  - Load rules in Step 0 (coding-style.md, css.md)
  - Write actual CSS code to globals.css
  - Run npm run build
  - Generate evidence files
  - Run wave-validator.sh
Evidence: .sisyphus/evidence/styling-refactor/wave-1/
Gate: STOP. Present wave summary. I approve "continue" or "fix".
```

### Phase 6: Wave Executor — Wave 2

```
Skill: wave-executor
Category: orchestration (kimi-k2.6)
Purpose: Execute Wave 2 slices
Expected: SF-003 (dark mode)
Required actions:
  - Implement dark mode tokens
  - Add data-theme toggle support
  - Verify no flash on load
  - Run npm run build
  - Generate evidence files
  - Run wave-validator.sh
Evidence: .sisyphus/evidence/styling-refactor/wave-2/
Gate: STOP. Present wave summary. I approve "continue" or "fix".
```

### Phase 6: Wave Executor — Wave 3

```
Skill: wave-executor
Category: orchestration (kimi-k2.6)
Purpose: Execute Wave 3 slices
Expected: SF-004 (component migration)
Required actions:
  - Migrate hardcoded styles in components to theme tokens
  - Update FilterToolbar, CampaignBuilder, etc.
  - Run npm run build
  - Generate evidence files
  - Run wave-validator.sh
Evidence: .sisyphus/evidence/styling-refactor/wave-3/
Gate: STOP. Present wave summary. I approve "continue" or "fix".
```

### Phase 6: Wave Executor — Wave 4

```
Skill: wave-executor
Category: orchestration (kimi-k2.6)
Purpose: Execute Wave 4 slices
Expected: SF-005 (GSAP/Three.js integration)
Required actions:
  - Verify GSAP ScrollTrigger animations still work
  - Verify Three.js canvas renders correctly
  - Check z-index and positioning conflicts
  - Run npm run build
  - Generate evidence files
  - Run wave-validator.sh
Evidence: .sisyphus/evidence/styling-refactor/wave-4/
Gate: STOP. Present wave summary. I approve "continue" or "fix".
```

### Phase 6: Wave Executor — Wave 5

```
Skill: wave-executor
Category: orchestration (kimi-k2.6)
Purpose: Execute Wave 5 slices
Expected: SF-006 (regression verification)
Required actions:
  - Verify all core pages render correctly
  - Check responsive behavior on sm/md/lg/xl breakpoints
  - Verify dark mode toggle works across pages
  - Run npm run build (final)
  - Generate evidence files
  - Run wave-validator.sh
Evidence: .sisyphus/evidence/styling-refactor/wave-5/
Gate: STOP. Present wave summary. I approve "continue" or "fix".
```

### Regression Gate (Between Waves)

```
Skill: regression-gate
Category: unspecified-low (GLM-5.1)
Purpose: Cross-wave regression testing
Trigger: Before each new wave after Wave 1
Expected output: PASS / FAIL — no breakage in existing features
```

### Phase 7: Plan Updater

```
Skill: plan-updater
Category: orchestration
Purpose: Log final progress, mark tasks complete
Artifacts: Update .sisyphus/plans/styling-refactor.md with completion status
Gate: STOP for my review of progress log.
```

### Phase 8: Plan Closer

```
Skill: plan-closer
Category: orchestration
Purpose: Archive state, close beads issue
Artifacts:
  - Final evidence archived
  - Beads issue closed
  - Wiki updated (vault-ops)
Gate: STOP for my final approval to close.
```

### Phase 9: Security Auditor (Optional but Recommended)

```
Skill: security-auditor
Category: automatic
Purpose: Pre-deployment security scan
Trigger: If any CSS injection risks were introduced
Expected output: PASS / WARNING / FAIL
```

### Phase 10: Vault Ops (Publishing)

```
Skill: vault-ops
Category: unspecified-low (GLM-5.1)
Purpose: Publish discoveries to wiki
Artifacts: Wiki page updated with styling refactor learnings
```

---

## My Approval Checkpoints

I will explicitly approve at these gates by typing one of:

- `"approved"` — proceed to next phase
- `"approved with override"` — proceed despite warnings
- `"fix"` — address blockers and re-present
- `"continue"` — proceed to next wave
- `"close plan"` — trigger plan-closer

**DO NOT proceed past any gate without my explicit approval.**

---

## Context Files to Read First

The orchestrator should read these before starting:

1. `/home/vladi/.config/opencode/SYSTEM-OVERVIEW.md` — workflow reference
2. `/home/vladi/developer/digital-dashboard/src/app/globals.css` — current (empty) state
3. `/home/vladi/developer/digital-dashboard/AGENTS.md` — project context
4. `/home/vladi/.config/opencode/rules/concerns/coding-style.md` — coding conventions
5. `/home/vladi/.config/opencode/skills/wave-executor/SKILL.md` — wave execution steps

---

## Success Criteria

- [ ] `globals.css` contains a complete `@theme` directive with tokens
- [ ] Dark mode works via `prefers-color-scheme` and `data-theme`
- [ ] Responsive breakpoints defined and working
- [ ] `npm run build` passes with zero errors
- [ ] All core pages render without visual regression
- [ ] GSAP animations still function
- [ ] Three.js canvas still renders
- [ ] Evidence files exist for every wave
- [ ] Dual Momus gates both passed
- [ ] Plan archived and beads issue closed

---

_Session starter: Paste this entire document as your first message._
_Expected behavior: Orchestrator pauses at Phase 1, asks for approval before proceeding._
