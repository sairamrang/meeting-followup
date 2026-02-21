---
description: "Generate comprehensive full-stack test suites: Backend + DataContext + UI with >80% coverage"
allowed-tools: ["Task", "Read", "Bash", "TodoWrite"]
---

<!-- Claude 4 Best Practices Alignment -->

<investigate_before_answering>
ALWAYS read and understand the implementation before generating tests.
Do not speculate about code behavior you have not inspected.
Review existing test patterns to ensure consistency with project conventions.
</investigate_before_answering>

<avoid_overengineering>
Generate tests that cover the specified requirements and actual code paths.
Focus on practical coverage (>80%), not theoretical exhaustiveness.
Test edge cases that exist in the code, not hypothetical scenarios.
</avoid_overengineering>

<use_parallel_tool_calls>
When gathering context, read implementation files and spec files in parallel.
Component files, service files, and existing tests can be read simultaneously.
</use_parallel_tool_calls>

<!-- End Claude 4 Best Practices -->

# Full-Stack Test Generator

Generate comprehensive test suites using a **progressive, phase-based approach** that covers backend API, state management, and UI components with >80% coverage.

---

## Usage

```bash
# Full-stack tests (recommended)
/temn:temn-test [feature-name]

# Layer-specific tests
/temn:temn-test [feature-name] --backend
/temn:temn-test [feature-name] --state
/temn:temn-test [component-name] [feature-name]  # UI only
```

**Arguments:**
- `feature-name` - Feature folder (e.g., "04-recurring-payments")
- `component-name` - Component to test (e.g., "payment-history")
- `--backend` - Backend tests only
- `--state` - State management tests only

---

## Testing Layers

| Layer | What to Test | Location | Target |
|-------|--------------|----------|--------|
| **Backend** | Routes, services, validation | `backend/src/**/__tests__/` | >80% |
| **State** | API client, DataContext, cache | `frontend/src/**/__tests__/` | >80% |
| **UI** | Components, interactions, a11y | `test/unit/{feature}/` | >80% |

---

## Progressive Phases

Reference: @.claude/agents/temn/_patterns/test-phases.md

| Phase | Name | Tests | Coverage | Focus |
|-------|------|-------|----------|-------|
| 1 | Foundation | 5-8 | 30-40% | Initialization, defaults |
| 2 | Interactions | 10-15 | 55-65% | User actions, events |
| 3 | Edge Cases | 10-15 | 70-80% | Errors, validation |
| 4 | Coverage Gaps | 5-10 | >80% | A11y, uncovered code |

**Per phase:** Generate → Run → Verify → Fix failures → Proceed

---

## Process

### Step 1: Read Specification

Apply spec reading pattern: @.temn/core/lib/spec-reading-pattern.md

```
Feature: .temn/specs/{feature}/
- spec.yaml (metadata)
- spec-functional.md (acceptance criteria)
- spec-technical.md (test requirements)
```

### Step 2: Setup Progress Tracking

```typescript
TodoWrite({
  todos: [
    { content: "Phase 1: Foundation tests", status: "in_progress" },
    { content: "Phase 2: Interaction tests", status: "pending" },
    { content: "Phase 3: Edge case tests", status: "pending" },
    { content: "Phase 4: Accessibility & gap tests", status: "pending" },
    { content: "Verify >80% coverage", status: "pending" }
  ]
});
```

### Step 3: Execute Progressive Testing

For each phase, invoke the test generator agent:

```typescript
Task({
  subagent_type: "temn/temn-test-agent",
  description: `Generate Phase ${phaseNum} tests`,
  prompt: `Generate Phase ${phaseNum} tests for: ${componentName}
    Feature: ${featureName}
    Spec: ${specContent}
    Phase instructions: ${phaseInstructions}`
});

// Run tests
Bash({ command: "npm test" });

// Verify, fix failures, proceed
```

### Step 4: Final Validation

```bash
npm test
# Verify coverage >80%
# Generate gap tests if needed
```

---

## Output Format

### Per Phase

```markdown
Phase X Complete

| Phase | Tests | Coverage | Status |
|-------|-------|----------|--------|
| 1 | X | XX% | Pass |
| 2 | X | XX% | Pass |
| 3 | - | - | Pending |
| 4 | - | - | Pending |
```

### Final Summary

```markdown
Test Suite Complete

**Feature:** [feature-name]
**Component:** [component-name]

| Phase | Tests | Coverage | Status |
|-------|-------|----------|--------|
| 1 Foundation | X | XX% | Pass |
| 2 Interactions | X | XX% | Pass |
| 3 Edge Cases | X | XX% | Pass |
| 4 Accessibility | X | XX% | Pass |

**Total:** XX tests | **Coverage:** XX% (target >80%)
**File:** [component.test.ts](test/unit/feature/component.test.ts)
```

---

## Integration

**Related commands:**
- `/temn:temn-debug` - Diagnose test failures
- `/temn:temn-dev` - Fix code issues revealed by tests
- `/temn:temn-verify` - Verify against specifications

**When to use debug:**
- Tests failing for unclear reasons
- Flaky test behavior
- Mock/stub setup problems
- Test timeout issues

---

## Coverage Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Statements | 75% | >80% |
| Branches | 70% | >75% |
| Functions | 75% | >80% |
| Lines | 75% | >80% |

**Critical paths must have 100% coverage:**
- User interactions
- Form submissions
- Error handling
- Event dispatching

---

## Next Steps

1. Run tests: `npm test`
2. Review coverage report
3. Fix failing tests (use `/temn:temn-debug` if stuck)
4. Address a11y violations
5. Verify with `/temn:temn-verify`
