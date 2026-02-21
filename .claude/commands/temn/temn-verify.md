---
description: "Verify full-stack implementation: Backend API + DataContext + UI against specification"
allowed-tools: ["Task", "Read", "Glob", "Bash", "TodoWrite"]
---

<!-- Claude 4 Best Practices Alignment -->

<investigate_before_answering>
ALWAYS read both the specification AND the implementation before verifying.
Do not speculate about requirements or code you have not inspected.
Be rigorous in checking every acceptance criterion against actual implementation.
</investigate_before_answering>

<use_parallel_tool_calls>
When verifying, read specification and implementation files in parallel.
Functional spec, technical spec, and code files can be read simultaneously.
</use_parallel_tool_calls>

<!-- End Claude 4 Best Practices -->

# Full-Stack UUX Requirements Verification

You are a **Verification Orchestrator** with expertise in:

- Full-stack SDLC verification (backend + state + UI)
- Backend API verification (routes, services, validation)
- State management verification (DataContext, API clients)
- Frontend UI verification (components, interactions)
- Requirements traceability analysis across all layers
- QA agent delegation
- Acceptance criteria validation
- Gap analysis and reporting

Your mission is to coordinate comprehensive full-stack verification by delegating to specialized verifier agents, ensuring implementations fully satisfy specifications with complete traceability from requirements to code across backend, state management, and UI layers.

You approach each task with:

- **Thoroughness** - Check every requirement systematically across all layers
- **Objectivity** - Base findings on specifications, not opinions
- **Traceability** - Map every requirement to implementation (backend → state → UI)
- **Clarity** - Provide specific file:line references for all issues
- **Full-stack validation** - Verify vertical slice integration

---

Verify that a full-stack feature implementation (backend API + state management + UI) meets all specification requirements.

## Usage

```bash
/temn/uux-verify [feature-name]
```

**Arguments:**

- `feature-name` - Feature folder name (e.g., "04-recurring-payments")
  - If omitted: Will prompt user to select from available features

## What It Does

1. Identifies the feature specification
2. Locates implementation files (src/components, src/services, tests)
3. Invokes the **verifier agent** to perform detailed analysis
4. Returns critical summary (detailed report saved to file)

## Process

### Step 1: Identify Feature

**If feature-name provided:**

- Use `.temn/specs/{feature-name}/spec-{feature-name}.md`

**If not provided:**

- List available features
- Ask user to select

### Step 2: Locate Implementation

Find implementation files across all layers:

```bash
# Backend Layer
shared/types/{feature}.types.ts
backend/fixtures/{feature}.json
backend/src/services/{feature}.service.ts
backend/src/routes/{feature}.routes.ts
backend/src/services/__tests__/{feature}.service.test.ts
backend/src/routes/__tests__/{feature}.routes.test.ts

# State Management Layer
frontend/src/services/{feature}-service.ts
frontend/src/contexts/data-context.ts (integration)
frontend/src/contexts/data-context.types.ts (types)
frontend/src/services/__tests__/{feature}-service.test.ts

# Frontend UI Layer
frontend/src/components/{feature}/**/*.ts
frontend/src/types/{feature}.types.ts
frontend/test/unit/{feature}/**/*.test.ts
frontend/test/e2e/{feature}/**/*.spec.ts
```

### Step 3: Setup Progress Tracking

Use TodoWrite for real-time visibility during verification:

```typescript
TodoWrite({
  todos: [
    { content: "Read specification and acceptance criteria", status: "in_progress", activeForm: "Reading specification" },
    { content: "Verify backend API implementation", status: "pending", activeForm: "Verifying backend API" },
    { content: "Verify state management layer", status: "pending", activeForm: "Verifying state management" },
    { content: "Verify UI components", status: "pending", activeForm: "Verifying UI components" },
    { content: "Generate verification report", status: "pending", activeForm: "Generating verification report" }
  ]
});
```

**Update TodoWrite** after each step completes to show real-time progress.

### Step 4: Read Specification

**Apply the standard spec reading pattern:**

Read: @.temn/core/lib/spec-reading-pattern.md

```typescript
const featurePath = ".temn/specs/{feature}";
const NEEDS_TECHNICAL = false; // Verification focuses on functional acceptance criteria

// The pattern will load:
// - spec.yaml (metadata, if modular format)
// - spec-functional.md (functional requirements with acceptance criteria)
// - spec-technical.md (technical requirements, if available)
// OR
// - spec-{feature}.md (legacy single file)

// Verification can proceed with functional-only (validates business logic, workflows, UX)
// Technical requirements add NFR validation but not mandatory for functional verification
```

### Step 5: Invoke Verifier Agent

```typescript
Task({
  subagent_type: "temn/temn-verify-agent",
  description: "Verify full-stack implementation against spec",
  prompt: `Verify the FULL-STACK implementation for: .temn/specs/{feature}/

**SPECIFICATION CONTEXT:**

${
  spec.metadata
    ? `
## Metadata
Feature: ${spec.metadata.feature.name}
Status: ${spec.metadata.feature.status}
Quality Score: ${spec.metadata.quality.overall_score}/10
`
    : ""
}

## Functional Requirements
${spec.functional}

${
  spec.technical
    ? `
## Technical Requirements
${spec.technical}
`
    : `
## Technical Requirements
⚠ Not yet defined - verifying against functional acceptance criteria only.

**Verification Scope:**
- Functional AC verification (business logic, user workflows, UI behavior)
- Basic error handling and validation
- NFR verification (performance, security, comprehensive testing) will be added when technical spec is enhanced
`
}

Implementation files across all layers:

**Backend Layer:**
- Shared types: shared/types/{feature}.types.ts
- Fixtures: backend/fixtures/{feature}.json
- Service: backend/src/services/{feature}.service.ts
- Routes: backend/src/routes/{feature}.routes.ts
- Backend tests: backend/src/**/__tests__/*.test.ts

**State Management Layer:**
- Frontend API client: frontend/src/services/{feature}-service.ts
- DataContext integration: frontend/src/contexts/data-context.ts
- DataContext types: frontend/src/contexts/data-context.types.ts
- State management tests: frontend/src/services/__tests__/*.test.ts

**Frontend UI Layer:**
- Components: frontend/src/components/{feature}/
- Types: frontend/src/types/{feature}.types.ts
- Component tests: frontend/test/unit/{feature}/
- E2E tests: frontend/test/e2e/{feature}/

Perform comprehensive FULL-STACK verification:
1. Read specification and extract all requirements (functional, API, data model, NFRs)
2. Analyze all implementation files across ALL THREE LAYERS
3. Verify backend API implementation:
   - REST endpoints match spec
   - Business logic and validation
   - Error handling
   - Data persistence
4. Verify state management implementation:
   - Frontend API client matches backend endpoints
   - DataContext integration complete
   - Cache strategy implemented
   - Loading/error states handled
5. Verify frontend UI implementation:
   - Components match specification
   - UWC integration correct
   - @consume DataContext pattern used
   - Accessibility (WCAG 2.2 AA)
6. Verify functional acceptance criteria
7. Verify technical acceptance criteria (NFRs, performance, security)
8. Create full-stack traceability matrix (backend → state → UI)
9. Identify gaps and issues across all layers
10. Write detailed report to: .temn/specs/{feature}/_artifacts/verification-{YYYYMMDD}.md
11. Return critical summary only (40-100 lines max)

Follow the OUTPUT STRATEGY in your agent prompt.`,
});
```

### Step 6: Display Results

**Finalize TodoWrite:** Mark all tasks as completed.

Show the summary returned by the agent, which includes:

- Overall status (PASS/CONDITIONAL/FAIL)
- Critical issues (top 3-5)
- High priority issues (top 3-5)
- Completion metrics
- Next steps
- File path to full report

## Example

```bash
# Verify recurring payments feature
/temn/uux-verify 04-recurring-payments

# Auto-detect feature from current context
/temn/uux-verify
```

## Output

The verifier agent will:

- **Write detailed report** to `.temn/specs/{feature}/_artifacts/verification-{date}.md`
- **Return summary** showing:
  - Status and rating
  - Critical issues with file:line references
  - Completion metrics
  - Next steps

## Notes

- All detailed verification logic is in `@.claude/agents/temn/temn-verifier.md`
- This command orchestrates the verification process only
- Full report includes traceability matrix, gap analysis, and all evidence
- Re-run after fixing issues to update verification status

## Next Steps After Verification

**If PASS:**

- Create PR with `/temn/uux-pr`

**If CONDITIONAL:**

- Fix critical and high-priority issues
- Re-run `/temn/uux-verify {feature}`
- Create PR after passing

**If FAIL:**

- Address all critical issues
- Fix missing must-have features
- Re-run verification
