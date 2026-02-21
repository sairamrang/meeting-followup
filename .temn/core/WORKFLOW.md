# UUX Development Workflow

> **Quick Reference Guide** - Scan the first section, then dive into details as needed

---

## 🚀 Quick Start: Choose Your Path

### Path 1: Standard (Most Common) - 5 steps
```
/temn-requirements → /temn-dev → /temn-test → /temn-verify → /temn-pr → Merge → /temn-release-notes → Deploy
```
**Use when:** You have a clear feature idea and want the standard workflow

### Path 2: Systematic (Complex Features) - 6 steps
```
/temn-requirements → /temn-plan → Follow plan checkboxes → /temn-verify → /temn-pr → Merge → /temn-release-notes → Deploy
```
**Use when:** Complex feature needing step-by-step breakdown with test checkpoints

### Path 3: Minimal (Simple Features) - 4 steps
```
/temn-dev → /temn-test → /temn-verify → /temn-pr → Merge → /temn-release-notes → Deploy
```
**Use when:** Very simple feature with obvious requirements

### Path 4: Strategic (Epic-Level) - Full SAFe flow
```
/temn-roadmap → /temn-prd → /temn-requirements → /temn-plan → ... → Deploy
```
**Use when:** Epic-level initiative needing business case before detailed specs

---

## 📋 Command Cheat Sheet

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/temn-roadmap` | Create strategic roadmap with epics | Annual/quarterly planning |
| `/temn-prd` | Create PRD (business case) for epic | Epic-level initiatives (optional) |
| `/temn-requirements` | Create specification from vague idea | Start of every feature (asks questions) |
| `/temn-plan` | Generate detailed step-by-step plan | Complex features needing breakdown |
| `/temn-architect` | Review technical architecture | Before coding OR for code quality review |
| `/temn-dev` | Implement the feature | After spec/plan, creates UWC components |
| `/temn-test` | Generate test suite (>80% coverage) | After implementation |
| `/temn-review` | Comprehensive code + UX/design review | After implementation (full quality audit) |
| `/temn-ux-review` | Focused UX/UI design review only | Screenshots/visuals (design validation) |
| `/temn-verify` | Verify against requirements | Before PR (expect CONDITIONAL PASS first) |
| `/temn-pr` | Create pull request with quality ratings | After verification PASS |
| `/temn-release-notes` | Generate release notes from git history | After merge (before/during release) |
| `/temn-diagram` | Generate Mermaid diagrams | Document architecture/flows |

---

## 🎯 30-Second Decision Tree

```
Do you have a spec file?
├─ NO  → Start with /temn-requirements
└─ YES → Is it complex (>3 components)?
         ├─ YES → Use /temn-plan (get step-by-step tasks)
         └─ NO  → Use /temn-dev (implement directly)
                  ↓
               /temn-test (generate tests)
                  ↓
               /temn-verify (check requirements)
                  ├─ PASS → /temn-pr → Merge → /temn-release-notes → Deploy 🚀
                  └─ CONDITIONAL → Fix issues → Re-verify
```

---

## 🔄 Visual Workflow (Complete)

```
┌─────────────────────────────────────────────────────────────┐
│                  Feature Development Lifecycle               │
└─────────────────────────────────────────────────────────────┘

1. REQUIREMENTS      → /temn-requirements    → Spec with acceptance criteria
   ↓
2. PLANNING          → /temn-plan (optional) → Detailed task breakdown
   ↓
3. BRANCH SETUP      → git checkout -b       → feature/[name]
   ↓
4. ARCHITECTURE      → /temn-architect (opt) → Technical review
   ↓
5. IMPLEMENTATION    → /temn-dev             → UWC components + services
   ↓
6. TESTING           → /temn-test            → Unit + E2E tests
   ↓
7. UX/DESIGN REVIEW  → /temn-ux-review (opt) → Visual design + UX patterns
   (OR /temn-review for comprehensive code + design review)
   ↓
8. VERIFICATION      → /temn-verify          → Requirements compliance
   ↓
9. FIX ISSUES        → [Address gaps]        → Fix critical/high priority
   ↓
10. RE-VERIFY        → /temn-verify          → Confirm PASS ✅
   ↓
11. PULL REQUEST     → /temn-pr              → Auto-create with ratings
   ↓
12. MERGE & RELEASE  → git merge + /temn-release-notes → Professional release notes
   ↓
13. DEPLOY           → 🚀 Ship it!
```

**Key Decision Points:**
- **Step 2 (Planning):** Skip for simple features (<3 components)
- **Step 4 (Architecture):** Skip unless uncertain about approach
- **Step 7 (UX/Design Review):** Use `/temn-ux-review` for visual design focus, `/temn-review` for comprehensive audit; skip for non-UI features
- **Step 9 (Fix):** Expect this - first verify usually CONDITIONAL PASS

---

## 💡 Golden Rules

1. **Always verify before PR** - `/temn-verify` catches missing requirements
2. **Expect CONDITIONAL PASS first time** - It's normal, just fix and re-verify
3. **Use feature branches** - `git checkout -b feature/[name]` before coding
4. **Test coverage >80%** - Verification checks this
5. **Run design review for UI features** - Use `/temn-ux-review` or `/temn-review` to catch UX and accessibility issues early

---

## 🎓 Example: Building "Recurring Payments" Feature

### Quick Path (5 minutes to start coding):
```bash
# 1. Create spec
/temn-requirements
> "I want recurring payments feature"
[Agent asks questions, generates spec in .temn/specs/recurring-payments/spec.md]

# 2. Create branch
git checkout -b feature/recurring-payments

# 3. Implement
/temn-dev
> Specification: .temn/specs/recurring-payments/spec.md
[Agent builds components]

# 4. Test
/temn-test
> Generate tests for .temn/specs/recurring-payments/spec.md

# 5. Verify
/temn-verify
> Specification: .temn/specs/recurring-payments/spec.md
[Gets CONDITIONAL PASS with 2 critical issues]

# 6. Fix issues and re-verify
[Fix the 2 issues]
/temn-verify
> [Same files]
[Gets PASS ✅]

# 7. Create PR
/temn-pr
[Auto-creates PR with quality ratings]
```

---

# 📖 DETAILED GUIDE

> Everything below provides in-depth explanations of each phase

---

## Phase 1: Requirements Specification

**Command:** `/temn-requirements`
**Output:** `.temn/specs/[feature-name]/spec.md`
**Time:** 10-15 minutes (includes Q&A)

### TL;DR
Transform vague idea → Complete specification with acceptance criteria. The PM agent asks questions, you answer, it generates a structured spec.

### What You Get
- User stories (As a user, I want...)
- Must/Should/Could-have features (MoSCoW)
- UWC component recommendations
- Technical requirements (interfaces, services, state)
- Functional acceptance criteria (user perspective)
- Technical acceptance criteria (implementation perspective)

### Process
```bash
/temn-requirements

# Agent asks questions like:
# - What payment types support recurrence?
# - What frequencies? (daily, weekly, monthly, custom?)
# - Can users edit/pause/delete recurring payments?
# - Integration with existing transfer wizard?
# - Edge cases: failed payments, insufficient funds?

# You answer questions

# Agent generates:
# .temn/specs/recurring-payments/spec.md
```

### When to Skip
- Never skip this for new features (prevents rework)
- Only skip if you already have a complete written spec

### Next Step
→ Go to Phase 2 (Planning) for complex features
→ Or skip to Phase 4 (Implementation) for simple features

**[Details: Examples, Templates, Best Practices](#phase-1-details)**

---

## Phase 2: Development Planning (Optional but Recommended)

**Command:** `/temn-plan`
**Output:** `.temn/specs/[feature-name]/plan.md`
**Time:** 5 minutes to generate, saves hours during implementation

### TL;DR
Converts spec → Ultra-detailed checklist with test commands. Each subtask takes 15-30 min. Includes complexity markers (⚡ think hard/harder/ultrathink).

### What You Get
- 6-phase task hierarchy (Setup → Core → Integration → Testing → Polish → Verification)
- Granular subtasks (2.1.1, 2.1.2, ...) with checkboxes
- Test command for each subtask
- Complexity markers showing difficulty
- Acceptance criteria mapping
- Progress tracking table

### Example Subtask
```markdown
### Task 2.1: Implement Frequency Service ⚡ think harder

- [ ] **2.1.1** Create basic service structure
  - Export FrequencyService class
  - **Test:** npm run build
  - **Expected:** TypeScript compiles

- [ ] **2.1.2** Implement calculateNextOccurrence() - daily ⚡ think hard
  - Handle "every N days" logic
  - **Test:** npm test -- frequency-service.test.ts
  - **Expected:** Daily calculations work
```

### Complexity Markers
- ⚡ **think hard** - Medium complexity (service methods, events)
- ⚡ **think harder** - High complexity (wizards, date logic, state)
- ⚡ **ultrathink** - Critical (architecture, edge cases, security)

### When to Use
- Complex features (>3 components)
- Multiple services/state management
- Want systematic test-driven approach
- Learning the codebase

### When to Skip
- Simple 1-2 component features
- Quick fixes or tweaks
- You're very familiar with the pattern

### Next Step
→ Follow the plan step-by-step (check boxes as you go)
→ Or skip to Phase 4 (Implementation) and use plan as reference

**[Details: Full Plan Structure, Usage Guide](#phase-2-details)**

---

## Phase 2.5: Branch Setup

**Action:** `git checkout -b feature/[feature-name]`
**Time:** 30 seconds

### TL;DR
Create feature branch before coding. Keeps main stable, enables clean PRs.

### Branch Naming
- `feature/[name]` - New features (e.g., `feature/recurring-payments`)
- `fix/[name]` - Bug fixes
- `refactor/[name]` - Refactoring
- `docs/[name]` - Documentation

### Why Required
✅ Keeps main branch deployable
✅ Isolates your work
✅ Enables parallel development
✅ Makes PRs clean
✅ Easy to abandon if needed

### Commands
```bash
# Create new branch
git checkout -b feature/recurring-payments

# List existing branches
git branch --list "feature/*"

# Switch to existing branch
git checkout feature/recurring-payments
```

### When Done
- **After** creating spec/plan
- **Before** running `/temn-dev`

**[Details: Best Practices, Conventions](#phase-2-5-details)**

---

## Phase 3: Architecture Review (Optional)

**Command:** `/temn-architect`
**Use Cases:** (1) Before coding - validate approach, (2) After coding - review quality
**Time:** 5-10 minutes

### TL;DR - Before Coding
Validate technical approach before implementing. Get component recommendations, state management strategy, alternative approaches.

### TL;DR - After Coding
Get code quality ratings across 8 categories. Receives architectural feedback separate from requirements verification.

### What You Get (Pre-Implementation)
- Architecture validation
- Component composition diagram
- Alternative UWC component suggestions
- State management recommendations
- Performance optimization strategies
- Risk assessment

### What You Get (Post-Implementation)
- Overall code quality rating (X/10)
- 8 category ratings (Design System, Component Selection, Architecture, TypeScript, Performance, Accessibility, Testing, Maintainability)
- Top 3 required improvements
- Approval status (Approved/Conditional/Blocked)

### When to Use
- Complex feature with multiple approaches possible
- Uncertain about component selection
- Want architectural validation before coding
- Want code quality feedback after implementation
- Learning best practices

### When to Skip
- Simple straightforward features
- Following existing patterns
- Time-sensitive

### Next Step
→ Use recommendations in implementation
→ Or address feedback if post-implementation review

**[Details: Review Process, Rating Categories](#phase-3-details)**

---

## Phase 4: Implementation

**Command:** `/temn-dev`
**Output:** Component files in `src/`
**Time:** Varies by feature complexity

### TL;DR
Build the feature using Lit elements and UWC components. Agent reads spec/plan, implements with proper TypeScript, design tokens, accessibility.

### What Agent Does
- Reads specification
- Reads UUX design system docs
- Implements using UWC components (`<uwc-*>`)
- Uses design tokens (`var(--uwc-*)`)
- Follows TypeScript interfaces from spec
- Implements business rules
- Adds JSDoc comments
- Ensures WCAG 2.2 AA compliance

### Process
```bash
/temn-dev

# Specify:
# - Specification file path
# - Plan file (if using /temn-plan approach)
# - Any existing components to reference
```

### File Structure Created
```
src/
├── components/
│   └── recurring-payment-form.ts
├── services/
│   └── recurring-payment-service.ts
└── types/
    └── recurring-payment.d.ts
```

### Key Principles
- **Use UWC components** - Don't reinvent `<uwc-button>`, `<uwc-text-field>`, etc.
- **Use design tokens** - `var(--uwc-color-primary)` not `#0066cc`
- **TypeScript strict mode** - Proper typing, no `any`
- **Accessibility first** - ARIA labels, keyboard nav, focus management
- **Reactive Lit patterns** - `@property()`, `@state()`, lifecycle methods

### When to Skip
Never - you need implementation to proceed.

### Next Step
→ Generate tests

**[Details: Implementation Standards, Examples](#phase-4-details)**

---

## Phase 5: Testing

**Command:** `/temn-test`
**Output:** Test files in `test/`
**Coverage Target:** >80%

### TL;DR
Generate comprehensive test suite from spec. Unit tests for all components/services, E2E tests for critical flows, accessibility tests.

### What You Get
- Unit tests (>80% coverage target)
- E2E tests for user workflows
- Accessibility tests (WCAG 2.2 AA)
- Edge case tests from specification
- Mock data and fixtures

### Process
```bash
/temn-test

# Specify:
# - Specification file (extracts acceptance criteria)
# - Implementation files to test
```

### File Structure Created
```
test/
├── unit/
│   ├── recurring-payment-form.test.ts
│   └── recurring-payment-service.test.ts
├── e2e/
│   └── recurring-payment-workflow.spec.ts
└── fixtures/
    └── recurring-payment-data.ts
```

### Test Framework
- **Unit:** Vitest or Jest
- **E2E:** Playwright
- **Accessibility:** axe-core

### Run Tests
```bash
# All tests
npm test

# Unit only
npm run test:unit

# E2E only
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Next Step
→ Optional: Run UX review (`/temn-review`)
→ Or skip to verification

**[Details: Test Patterns, Coverage Requirements](#phase-5-details)**

---

## Phase 6: UI/UX & Design Review (Optional but Recommended)

**Commands:**
- `/temn-ux-review` - Focused UX/UI design review (visual design, layout, UX patterns)
- `/temn-review` - Comprehensive review (code quality + UX/design combined)

**Output:** Review report with ratings and recommendations
**Time:** 5-10 minutes each

### TL;DR
Choose between focused design review or comprehensive code+design audit. Both provide expert feedback with category ratings and actionable recommendations.

### When to Use Which Command

**Use `/temn-ux-review` when:**
- You have screenshots or visual mockups
- Focus on visual design and UX patterns
- Want design system compliance validation (grid, typography, colors)
- Checking layout and visual hierarchy
- Need visual accessibility audit (contrast, touch targets)
- Quick design validation needed

**Use `/temn-review` when:**
- Want both code quality AND design feedback
- Comprehensive quality audit needed
- Checking technical implementation AND user experience
- Before creating PR (full quality assurance)
- Learning best practices across all dimensions

### What You Get from `/temn-ux-review`

**8 Design Categories (1-10 scale):**
1. **Design Principle Compliance** - Simple & Progressive, Power to Cut Through, User Needs, Aesthetics with Purpose
2. **Layout & Grid System** - 12-column grid, Golden Form, gutters, responsive
3. **Visual Hierarchy & Typography** - Typography scale, heading structure, readability
4. **Color Usage & Contrast** - Palette compliance, status colors, WCAG contrast
5. **Spacing & Alignment** - Grid units (1G=8px), component spacing, white space
6. **Component Density & Sizing** - Standard/Compact modes, touch targets (44x44px)
7. **User Experience Flow** - Task flow, progressive disclosure, feedback
8. **Visual Accessibility** - Visual contrast, touch targets, focus visibility

**Output:**
- Full report: `.temn/specs/{feature}/_artifacts/design-review-{date}.md`
- Concise terminal summary with top 3 design issues
- Approval status (BLOCKED/CONDITIONAL/APPROVED)

### What You Get from `/temn-review`

**Combined Code + Design Review:**
- All categories from code-reviewer agent (8 technical categories)
- All categories from design-reviewer agent (8 design categories)
- Integrated findings and recommendations
- Consolidated approval status

**16 Total Categories:**
- 8 technical (Design System Compliance, Component Selection, Architecture, TypeScript, Performance, Accessibility, Testing, Maintainability)
- 8 design (Design Principles, Layout/Grid, Visual Hierarchy, Colors, Spacing, Density, UX Flow, Visual Accessibility)

### Process

**Option 1: Design-Only Review**
```bash
# Review by feature name
/temn-ux-review recurring-payments

# Review by screenshot
/temn-ux-review screenshots/payment-form.png

# Review by component folder
/temn-ux-review src/components/recurring-payments/
```

**Option 2: Comprehensive Review**
```bash
# Full code + design review
/temn-review recurring-payments
```

### Example Design Review Report
```markdown
## UX/UI Design Review: Recurring Payments Form

### Overall Rating: 7/10 - CONDITIONAL

| Category | Rating | Status |
|----------|--------|--------|
| Design Principle Compliance | 8/10 | ✓ |
| Layout & Grid System | 6/10 | ⚠ |
| Visual Hierarchy | 7/10 | ✓ |
| Color Usage & Contrast | 5/10 | ⚠ |
| Spacing & Alignment | 6/10 | ⚠ |
| Component Density | 8/10 | ✓ |
| User Experience Flow | 8/10 | ✓ |
| Visual Accessibility | 5/10 | ❌ |

### Top 3 Required Design Changes

1. **CRITICAL: Fix contrast ratios**
   - Problem: Text contrast 3.2:1 (requires 4.5:1)
   - Solution: Use uwc-color-neutral-900 for body text

2. **HIGH: Align to 12-column grid**
   - Problem: Container not aligned to grid columns
   - Solution: Use 8-column layout (2 columns margin each side)

3. **MEDIUM: Apply grid unit spacing**
   - Problem: Using 15px padding (not grid unit)
   - Solution: Use 2G (16px) spacing with uwc-spacing-2 token
```

### Comparison Table

| Aspect | `/temn-ux-review` | `/temn-review` | `/temn-verify` |
|--------|-------------------|----------------|----------------|
| **Focus** | Visual design & UX patterns | Code quality + Design | Requirements fulfillment |
| **Input** | Screenshots/visuals/code | Source code | Spec + code |
| **Categories** | 8 design categories | 16 (8 code + 8 design) | Acceptance criteria |
| **Evaluates** | Layout, typography, UX flow | Everything | Features complete? |
| **When** | After visuals ready | After implementation | Before production |
| **Time** | 5-10 min | 10-15 min | 5 min |

### When to Skip
- Non-UI features (backend, API only)
- Very simple features (single action, no visual component)
- Time-sensitive hotfixes

### Recommended Workflow

**For UI Features:**
1. Implement feature → `/temn-test`
2. Run `/temn-ux-review` (catch design issues early)
3. Fix critical design issues
4. Run `/temn-verify` (requirements compliance)
5. Optional: Run `/temn-review` for comprehensive audit before PR

**For Complex UI Features:**
1. Implement → `/temn-test`
2. Run `/temn-ux-review` (visual design)
3. Fix design issues
4. Run `/temn-review` (full quality check)
5. Fix code quality issues
6. Run `/temn-verify` (requirements)
7. Create PR

### Next Step
→ Fix critical/high priority issues from review
→ Then proceed to verification

**[Details: Rating Rubrics, Examples](#phase-6-details)**

---

## Phase 7: Requirements Verification

**Command:** `/temn-verify`
**Output:** Verification report with PASS/CONDITIONAL/FAIL status
**Time:** 5 minutes

### TL;DR
Validate implementation fulfills ALL requirements from spec. Creates traceability matrix (requirement → code → test). Identifies gaps. Prioritizes issues.

### What You Get
- Overall status (PASS/CONDITIONAL PASS/FAIL)
- Completion metrics (Must-have features %, Functional AC %, Technical AC %)
- Critical issues list (🔴 must fix)
- High-priority issues list (🟡 should fix)
- Medium-priority issues list (🟢 nice to fix)
- Traceability matrix
- Approval recommendation

### Process
```bash
/temn-verify

# Specify:
# - Specification file path
# - Implementation files
# - Test files
```

### Example Report
```markdown
# Requirements Verification Report

## Executive Summary
**Overall Status:** ⚠️ CONDITIONAL PASS

**Completion Metrics:**
- Must-Have Features: 9/10 (90%) ⚠️
- Functional AC: 14/16 (87.5%) ⚠️
- Technical AC: 20/25 (80%) ⚠️

## Critical Issues (2)
1. Missing feature: Pause recurring payment - 🔴 CRITICAL
   Requirement: AC-F3 - User can pause/resume recurring payments
   Impact: User story #3 cannot be completed

2. Missing ARIA labels on 2 icon buttons - 🔴 CRITICAL
   Location: recurring-payment-form.ts:145, 167
   Impact: WCAG 2.2 AA violation

## High Priority Issues (3)
1. Hard-coded spacing values - 🟡 HIGH
2. Test coverage 78% (target 80%) - 🟡 HIGH
3. Missing JSDoc on service methods - 🟡 HIGH

## Approval Status
**Status:** ⚠️ CONDITIONAL PASS

**Conditions:**
1. Must fix 2 critical issues
2. Should fix 3 high-priority issues
3. Re-verify after fixes
```

### Possible Outcomes

**✅ PASS**
- All requirements met
- All acceptance criteria satisfied
- Ready for production
- Proceed to PR or deploy

**⚠️ CONDITIONAL PASS** (Most Common First Time)
- Most requirements met
- Some critical or high-priority issues
- Fix issues and re-verify
- Expected scenario

**❌ FAIL**
- Significant gaps or missing features
- Multiple critical issues
- Not ready for production
- Address issues and re-implement

### Key Insight
**Expect CONDITIONAL PASS on first verification** - It's normal! Fix the issues and re-verify. It's much faster than discovering problems in production.

### Next Step
→ If PASS: Create PR
→ If CONDITIONAL/FAIL: Fix issues (Phase 8)

**[Details: Verification Criteria, Traceability Matrix](#phase-7-details)**

---

## Phase 8: Fix Issues

**Time:** Varies by number of issues
**Priority:** Fix 🔴 Critical first, then 🟡 High, then 🟢 Medium

### TL;DR
Address gaps from verification report and UX review. Work systematically through prioritized list. Test each fix.

### Process
```
For each issue in verification report:
1. Locate - Use file:line reference from report
2. Fix - Implement the required change
3. Test - Verify fix works
4. Document - Update code comments if needed
```

### Example Fixes

**From Verification Report:**
```typescript
// Issue: Missing feature (AC-F3)
// Add pause payment functionality

async pausePayment(id: string) {
  const payment = await this.getPayment(id);
  payment.status = 'paused';
  await this.updatePayment(payment);
  this.dispatchEvent(new CustomEvent('payment-paused', { detail: { id } }));
}
```

**From UX Review:**
```typescript
// Issue: Missing ARIA label on icon button
// Location: recurring-payment-form.ts:145

// BEFORE
<uwc-icon-button icon="pause" @click=${this.handlePause}></uwc-icon-button>

// AFTER
<uwc-icon-button
  icon="pause"
  .ariaLabel=${'Pause recurring payment'}
  @click=${this.handlePause}>
</uwc-icon-button>
```

**From UX Review Quick Win:**
```typescript
// Quick win: Change primary button variant
// Location: recurring-payment-form.ts:89

// BEFORE
<uwc-button .variant=${'outlined'} .label=${'Create Payment'}>

// AFTER
<uwc-button .variant=${'filled'} .label=${'Create Payment'}>
```

### Issue Priorities

**🔴 CRITICAL** - Must fix before production
- Missing required features
- Accessibility violations (WCAG 2.2 AA failures)
- Security issues
- Broken user flows

**🟡 HIGH** - Should fix before production
- Hard-coded values (should use design tokens)
- Test coverage below 80%
- Missing documentation (JSDoc)
- Performance issues

**🟢 MEDIUM** - Can defer to next sprint
- Minor refactoring opportunities
- Additional test cases
- Code organization improvements

### Next Step
→ Re-verify (Phase 9)

**[Details: Fix Strategies, Common Issues](#phase-8-details)**

---

## Phase 9: Re-Verification

**Command:** `/temn-verify` (same command)
**Expected Outcome:** ✅ PASS
**Time:** 5 minutes

### TL;DR
Run verification again after fixing issues. Confirm all critical/high issues resolved. Should get PASS status.

### Process
```bash
/temn-verify

# Same specification and files as before
# Agent re-checks all requirements
```

### Verify Fix Checklist
- Critical issues resolved? ✅
- High-priority issues addressed? ✅
- Test coverage >80%? ✅
- All acceptance criteria met? ✅

### Expected Report
```markdown
# Requirements Verification Report

## Executive Summary
**Overall Status:** ✅ PASS

**Completion Metrics:**
- Must-Have Features: 10/10 (100%) ✅
- Functional AC: 16/16 (100%) ✅
- Technical AC: 24/25 (96%) ✅

## Issues
No critical or high-priority issues found.

## Approval Status
**Status:** ✅ APPROVED - Ready for Production

All requirements fulfilled. Implementation meets specification.
```

### If Still CONDITIONAL/FAIL
- Review remaining issues
- Check if you missed any fixes
- Re-read verification report carefully
- Fix additional issues
- Verify again

### Next Step
→ Create PR (Phase 10)

**[Details: Verification Best Practices](#phase-9-details)**

---

## Phase 10: Pull Request Creation

**Command:** `/temn-pr`
**Output:** GitHub PR with comprehensive description
**Time:** 2-3 minutes

### TL;DR
Auto-create professional PR with quality ratings, review time estimate, comprehensive description linking spec and verification reports.

### What You Get
- PR title and description
- Quality ratings (7 categories, 0-10 scale)
- Estimated review time
- Merge recommendation
- Links to specification and verification reports
- Summary of changes
- Test results
- Pre-merge checklist

### Process
```bash
/temn-pr

# Agent automatically:
# 1. Runs sanity checks (build, test, lint)
# 2. Analyzes changes (files, lines, complexity)
# 3. Rates quality across 7 categories
# 4. Estimates review time
# 5. Generates PR description
# 6. Creates GitHub PR
```

### Quality Ratings
1. **Code Quality** - Clean code, patterns, maintainability
2. **Design System Compliance** - UWC components, design tokens
3. **Testing** - Coverage, test quality, edge cases
4. **Accessibility** - WCAG 2.2 AA compliance
5. **Performance** - Efficiency, optimization
6. **Documentation** - JSDoc, README, comments
7. **Architecture** - Structure, separation of concerns

### Example PR Description
```markdown
## Summary
Implements recurring payments feature with full UWC design system integration.

## Changes
- Added RecurringPaymentForm component (258 lines)
- Implemented FrequencyService with date calculations (142 lines)
- Created comprehensive test suite (312 lines, 87% coverage)

## Quality Ratings
- Code Quality: 8.5/10 🟢
- Design System Compliance: 9/10 🟢
- Testing: 8/10 🟢
- Accessibility: 9/10 🟢
- Overall: 8.6/10 🟢

## Review Estimate
⏱️ 25-30 minutes

## Merge Recommendation
✅ **APPROVE** - Ready to merge

## Links
- [Specification](.temn/specs/recurring-payments/spec.md)
- [Verification Report](.temn/specs/recurring-payments/_artifacts/verification-pass.md)
- [Development Plan](.temn/specs/recurring-payments/plan.md)

## Pre-Merge Checklist
- ✅ All tests passing
- ✅ Build successful
- ✅ Lint passing
- ✅ Requirements verification: PASS
- ✅ Test coverage: 87%
- ✅ Accessibility: WCAG 2.2 AA compliant
```

### Sanity Checks Run
- `npm run build` - Build successful?
- `npm test` - All tests passing?
- `npm run lint` - Linting passing?
- Git status - All files committed?

### Next Step
→ Optional: Get code review (`/temn-architect`)
→ Or: Merge and deploy!

**[Details: PR Best Practices, Review Process](#phase-10-details)**

---

## Phase 11: Code Review (Optional)

**Command:** `/temn-architect`
**Use:** Post-implementation quality review
**Time:** 5-10 minutes

### TL;DR
Get architectural and code quality feedback. 8-category ratings. Top 3 improvements. Approval status. Use after PR creation for extra quality assurance.

### When to Use
- Want architectural feedback separate from requirements
- Learning best practices
- High-stakes production feature
- Before merging to main branch

### What You Get
- Overall rating (X/10)
- 8 category ratings (Design System, Component Selection, Architecture, TypeScript, Performance, Accessibility, Testing, Maintainability)
- Top 3 required improvements
- Approval status (Approved/Conditional/Blocked)
- Architectural recommendations

### Process
```bash
/temn-architect

# Specify:
# - Implementation files to review
# - Specification file (for context)
```

### Difference from Other Reviews

| Aspect | `/temn-verify` | `/temn-review` | `/temn-architect` |
|--------|---------------|----------------|-------------------|
| **Focus** | Requirements fulfillment | Visual design & UX | Code quality & architecture |
| **Based on** | Specification | Design principles & WCAG | Best practices & patterns |
| **Input** | Spec + code | Screenshot/app | Source code |
| **Checks** | All AC met? Features complete? | Usable? Accessible? Good UX? | Clean code? Well-architected? |
| **Output** | PASS/FAIL vs spec | UX ratings + design feedback | Code ratings + improvements |

### When to Skip
- Simple features
- Time-sensitive
- Already very confident in code quality

### Next Step
→ Address feedback if needed
→ Merge PR
→ Deploy!

**[Details: Review Criteria, Rating Rubrics](#phase-11-details)**

---

## Phase 12: Release Notes Generation

**Command:** `/temn-release-notes`
**Output:** `RELEASE_NOTES-{version}.md`
**Time:** 2-5 minutes

### TL;DR
Generate professional release notes by analyzing git commits, linking to specifications, and extracting user benefits. Creates documentation for users, PMs, and technical teams.

### What You Get
- Release highlights (3-5 key accomplishments)
- New features (user benefits + technical details)
- Bug fixes (issue, resolution, impact)
- Quality metrics (test coverage, completion rates)
- Contributors list
- Breaking changes (if any)
- Documentation links

### Process
```bash
# After merging PR(s) to main
/temn-release-notes --from v1.0.0 --to v1.1.0

# OR for unreleased changes (draft)
/temn-release-notes --draft

# OR for last N commits
/temn-release-notes --last 10 --version 1.1.0

# OR between commits
/temn-release-notes --from abc123 --to def456
```

### Example Usage Scenarios

**Scenario 1: Regular Release (with tags)**
```bash
# Tag the release point
git tag -a v1.1.0 -m "Release 1.1.0"

# Generate release notes
/temn-release-notes --from v1.0.0 --to v1.1.0

# Review and edit RELEASE_NOTES-1.1.0.md if needed

# Push tag
git push origin v1.1.0
```

**Scenario 2: First Release (no previous tags)**
```bash
# Generate notes for last 20 commits
/temn-release-notes --last 20 --version 1.0.0

# Or from a specific commit
/temn-release-notes --from <first-commit> --version 1.0.0
```

**Scenario 3: Preview Before Release (draft)**
```bash
# Generate draft notes to see what will be in release
/temn-release-notes --draft

# Review RELEASE_NOTES-draft-{date}.md
# Make any final commits
# Then generate final version with tag
```

### What Agent Does
1. Analyzes git log for commit range
2. Parses conventional commits (feat:, fix:, docs:, etc.)
3. Maps commits to feature specifications
4. Extracts user benefits from specs
5. Aggregates quality metrics from PR analyses
6. Identifies breaking changes
7. Generates structured release notes
8. Writes detailed report to file
9. Returns concise summary

### Release Notes Structure
```markdown
# Release Notes - 1.1.0 (2024-11-04)

## 🎯 Release Highlights
- [Top 3-5 achievements]

## ✨ New Features
[Each feature with user benefits, technical details, spec links]

## 🐛 Bug Fixes
[Issues resolved with impact]

## 🔧 Improvements
[Performance, code quality, UX enhancements]

## 📊 Quality Metrics
[Test coverage, quality scores, completion]

## 👥 Contributors
[All commit authors]

## ⚠️ Breaking Changes
[If any - with migration guidance]
```

### When to Use
- **After merging PRs** - Generate notes for what was merged
- **Before releases** - Create draft to preview what's included
- **During release prep** - Generate professional documentation
- **For stakeholder updates** - Create business-friendly summaries
- **For changelog** - Maintain release history

### When to Skip
- Never skip for production releases
- For internal dev branches, draft notes are sufficient
- Single-commit hotfixes may not need formal notes

### Tips for Better Notes
1. **Use conventional commits**: `feat:`, `fix:`, `docs:`, etc.
2. **Keep specs updated**: Agent extracts user benefits from specs
3. **Run PR analyses**: Quality metrics come from `/temn-pr` reports
4. **Tag releases**: Makes it easy to generate notes between versions
5. **Review before publishing**: Edit generated notes if needed

### Example Output (Summary)
```markdown
**Release Notes Generated Successfully**

**Version**: 1.1.0
**Date Range**: 2024-10-01 to 2024-11-04
**Commits Analyzed**: 47

## Release Highlights
- Recurring Payments: Automate regular transactions
- Diagram Generation: Visualize architecture
- Enhanced Testing: 87% coverage across features

## Summary
**New Features**: 8
**Bug Fixes**: 12
**Improvements**: 6
**Breaking Changes**: 0

## Quality Metrics
- Average Feature Quality: 8.5/10
- Test Coverage: 87%
- Requirements Delivered: 42/42

**Detailed Report**: [RELEASE_NOTES-1.1.0.md](RELEASE_NOTES-1.1.0.md)
```

### Next Step
→ Review and publish release notes
→ Deploy to production (Phase 13)

**[Quick Start Guide: RELEASE_NOTES_GUIDE.md](../RELEASE_NOTES_GUIDE.md)**

---

## Phase 13: Production Deployment

**Action:** Deploy to production
**Time:** Varies by deployment process

### TL;DR
Ship it! Run final checks, build for production, deploy, monitor.

### Pre-Deployment Checklist
- ✅ Verification status: PASS
- ✅ All critical issues resolved
- ✅ All high-priority issues addressed
- ✅ Test coverage >80%
- ✅ WCAG 2.2 AA compliant
- ✅ Design system compliant
- ✅ PR merged to main
- ✅ Code review approved (if performed)

### Deployment Commands
```bash
# Run final tests
npm test
npm run test:e2e

# Build for production
npm run build

# Deploy (your process)
npm run deploy
# OR
git push origin main
# OR
[your CI/CD pipeline]
```

### Post-Deployment
- Monitor for errors (check logs, error tracking)
- Collect user feedback
- Verify success criteria from specification
- Update documentation if needed
- Celebrate! 🎉

### Rollback Plan
Keep verification report and test results in case you need to:
- Identify what was deployed
- Compare against requirements
- Debug production issues
- Roll back if critical issues found

---

# 📊 APPENDIX

## A. Workflow Comparison Table

| Path | Steps | Commands | Time | Best For |
|------|-------|----------|------|----------|
| **Standard** | 6 | requirements → dev → test → verify → pr → release-notes | 2-4 hours | Most features |
| **Systematic** | 7 | requirements → plan → [follow plan] → verify → pr → release-notes | 4-8 hours | Complex features |
| **Minimal** | 5 | dev → test → verify → pr → release-notes | 1-2 hours | Simple features |
| **Thorough** | 9 | requirements → plan → architect → dev → test → review → verify → pr → release-notes | 6-10 hours | High-stakes features |

## B. Command Usage Frequency

**Always Use:**
- `/temn-verify` - Before every PR
- `/temn-pr` - To create PRs
- `/temn-release-notes` - Before/during releases

**Usually Use:**
- `/temn-requirements` - Start of features (80% of time)
- `/temn-dev` - Implementation (90% of time)
- `/temn-test` - After implementation (90% of time)

**Sometimes Use:**
- `/temn-plan` - Complex features (40% of time)
- `/temn-review` - UI features (60% of time)
- `/temn-architect` - Before OR after coding (30% of time)
- `/temn-diagram` - Documentation needs (20% of time)

## C. Tips for Success

### 1. Always Start with Specification
- Use `/temn-requirements` even for "simple" features
- Clear requirements prevent rework
- Acceptance criteria guide implementation and verification

### 2. Verify Early and Often
- Run `/temn-verify` as soon as implementation is "done"
- Don't wait until the end to find missing features
- Re-verify after each batch of fixes

### 3. Expect CONDITIONAL PASS First Time
- It's normal and expected
- Verification helps you catch issues before users do
- Fix critical/high issues, re-verify, move on

### 4. Use All Three Review Commands for Complete Quality
- `/temn-verify` → Did we build what was requested? (Requirements)
- `/temn-review` → Is it usable and accessible? (UX/Design)
- `/temn-architect` → Did we build it well? (Code Quality)
- All three provide value, serve different purposes

### 5. Use Feature Branches
- Always use `feature/[name]` branches
- Keeps main stable
- Enables clean PRs
- Industry best practice

### 6. Save Verification Reports
- Create `.temn/specs/[name]/_artifacts/` directory
- Keep historical verification reports
- Track progress over iterations
- Evidence for compliance/audits

## D. Common Mistakes to Avoid

### ❌ Don't Skip Specification
"I know what I want to build" - You'll miss edge cases and acceptance criteria

### ❌ Don't Skip Verification
"I tested it manually" - Verification ensures ALL requirements met, not just happy path

### ❌ Don't Code on Main Branch
"It's just a small change" - Feature branches enable safe development and clean history

### ❌ Don't Ignore CONDITIONAL PASS
"Close enough" - Fix critical/high issues or users will find them

### ❌ Don't Skip Tests
"I'll add them later" - Test coverage <80% fails verification

### ❌ Don't Ignore Accessibility
"We'll fix it later" - WCAG 2.2 AA is required, not optional

## E. Success Metrics

Track these across your features:

### Specification Quality
- Time from vague idea to complete spec
- Number of clarification questions needed
- Completeness of acceptance criteria

### Implementation Quality
- First-time verification pass rate (target: 20-30% PASS first time)
- Average number of critical issues per feature (target: <2)
- Average number of verification iterations (target: 2)

### Process Efficiency
- Time from specification to production (target: <2 weeks)
- Rework percentage (fixes after verification) (target: <20%)
- Test coverage consistency (target: >80%)

### Compliance
- WCAG 2.2 AA pass rate (target: 100%)
- Design system compliance rate (target: >90%)
- Requirements traceability completeness (target: 100%)

## F. Getting Help

### Commands
- `/temn-help` - Show all available commands
- Check `.claude/commands/temn/` for command documentation

### Documentation
- UUX Design System: [developer.temenos.com/uux](https://developer.temenos.com/uux)
- Lit: [lit.dev](https://lit.dev)
- WCAG 2.2: [w3.org/WAI/WCAG22/quickref](https://www.w3.org/WAI/WCAG22/quickref/)

---

## 🚀 Ready to Start?

Pick your path and begin:

```bash
# Standard Path (Most Common)
/temn-requirements

# Systematic Path (Complex Features)
/temn-requirements
/temn-plan

# Minimal Path (Simple Features)
/temn-dev
```

The workflow will guide you through the rest! 🎨🏦✨
