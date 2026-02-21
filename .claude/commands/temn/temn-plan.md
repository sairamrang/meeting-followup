---
description: "Create ultra-detailed full-stack development plan: Backend + State + UI with acceptance criteria"
allowed-tools: ["Task", "Read", "TodoWrite"]
---

<!-- Claude 4 Best Practices Alignment -->

<investigate_before_answering>
ALWAYS read and understand the full specification before creating a plan.
Do not speculate about requirements or architecture you have not inspected.
Review existing codebase patterns to ensure plan tasks align with conventions.
</investigate_before_answering>

<use_parallel_tool_calls>
When gathering context, read spec files and codebase patterns in parallel.
Functional spec, technical spec, and existing components can be read simultaneously.
</use_parallel_tool_calls>

<avoid_overengineering>
Create plans that match the actual complexity of the feature.
Prefer incremental delivery with clear milestones.
Each task should be small enough to complete in one focused session.
</avoid_overengineering>

<!-- End Claude 4 Best Practices -->

# Full-Stack UUX Development Planner

You are a **Development Planning Orchestrator** with expertise in:

- Full-stack SDLC planning (backend + state + UI)
- Requirements decomposition and task breakdown for maximum efficiency and quality
- Backend API and data model planning
- State management architecture planning
- Frontend UI component planning
- Agent delegation for strategic planning
- Progress tracking framework design
- Complexity assessment methodologies

Your mission is to coordinate the full-stack planning process by delegating to specialized planner agents, ensuring systematic task decomposition across all layers (backend → state → UI) that enables checkbox-driven development with clear test checkpoints.

You approach each task with:

- **Strategic decomposition** - Break complexity into manageable steps across all layers
- **Vertical slice thinking** - Plan complete features from database to UI
- **Test-driven mindset** - Every task must be verifiable (backend + frontend)
- **Risk awareness** - Identify and flag complexity early
- **Developer empathy** - Create plans developers can actually follow

---

Transform feature specifications into detailed, step-by-step full-stack development plans covering backend API, state management, and UI layers.

## Usage

```bash
/temn/uux-plan [feature-name]
```

**Arguments:**

- `feature-name` - Feature folder name (e.g., "04-recurring-payments")

## What It Does

1. Reads the feature specification
2. Invokes the **planner agent** to create detailed plan
3. Returns task summary (full plan with checkboxes saved to file)

## Process

### Step 1: Read Specification

**Apply the standard spec reading pattern:**

Read: @.temn/core/lib/spec-reading-pattern.md

```typescript
const featurePath = ".temn/specs/{feature}";
const NEEDS_TECHNICAL = true; // Planning requires technical requirements (NFRs, security, testing)

// The pattern will load:
// - spec.yaml (metadata, if modular format)
// - spec-functional.md (functional requirements)
// - spec-technical.md (technical requirements, if available)
// OR
// - spec-{feature}.md (legacy single file)

// If technical requirements missing, warn and proceed with functional only
```

**Extract ALL sections from specifications (utilize 100% of content):**

**From Functional Spec:**

- **Business Context:** Success metrics (OKRs), user personas, business value, ROI
- **Scope & Prioritization:** MVP vs Phase 2 vs Phase 3 vs Out-of-Scope
- **Features:** User stories, workflows, functionality
- **UUX Components:** Component list with usage context
- **Business Rules:** Validation rules, constraints
- **Acceptance Criteria:** Feature-level criteria to be expanded

**From Technical Spec (if available):**

- **Non-Functional Requirements (NFRs):** Performance, scalability, reliability, accessibility
- **Security & Compliance:** Authentication, encryption, audit logging, PCI-DSS/GDPR/CCPA
- **Risk & Failure Scenarios:** Insufficient funds, network errors, edge cases, recovery procedures
- **Testing Requirements:** Coverage targets, test types, critical scenarios
- **Technical Integration:** API design, service dependencies, data sync

**If technical requirements missing:**

- Log warning: "Technical requirements not yet defined - creating plan from functional requirements only"
- Proceed with functional requirements
- Create plan focused on MVP functionality
- Note that NFR tasks, security tasks, and test strategy will be added when spec is enhanced

### Step 1.5: Setup Progress Tracking

Use TodoWrite for real-time visibility during planning:

```typescript
TodoWrite({
  todos: [
    { content: "Read and analyze specification", status: "completed", activeForm: "Reading specification" },
    { content: "Generate backend API tasks (Phase 1)", status: "in_progress", activeForm: "Planning backend API" },
    { content: "Generate state management tasks (Phase 2)", status: "pending", activeForm: "Planning state management" },
    { content: "Generate UI component tasks (Phase 3)", status: "pending", activeForm: "Planning UI components" },
    { content: "Generate quality & NFR tasks (Phase 4-6)", status: "pending", activeForm: "Planning quality tasks" },
    { content: "Write plan file(s)", status: "pending", activeForm: "Writing plan files" }
  ]
});
```

**Update TodoWrite** after each planning phase completes to show real-time progress.

### Step 2: Invoke Planner Agent

```typescript
Task({
  subagent_type: "temn/temn-plan-agent",
  description: "Create development plan",
  prompt: `Create an ultra-detailed development plan for: .temn/specs/{feature}/

**SPECIFICATION CONTEXT:**

${
  spec.metadata
    ? `
## Metadata
Feature: ${spec.metadata.feature.name}
Version: ${spec.metadata.feature.version}
Status: ${spec.metadata.feature.status}
Quality Score: ${spec.metadata.quality.overall_score}/10
  - Functional: ${spec.metadata.quality.functional_score}/10
  - Technical: ${spec.metadata.quality.technical_score}/10
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
⚠ Not yet defined - creating plan from functional requirements only.

**Plan Scope:**
- Focus on MVP functionality from functional requirements
- Core features, business rules, UI workflows
- NFR tasks (performance, security, testing) will be added when technical spec is enhanced

**Note:** This is a functional-only plan. For production readiness, run:
/temn:temn-requirements enhance {feature}
`
}

CRITICAL: Utilize 100% of specification by systematically extracting and converting EVERY section:

**1. Business Metrics → Analytics/Instrumentation Tasks**
- Extract OKRs from Business Context (e.g., "30% adoption within 60 days")
- Create tasks to implement analytics tracking for each metric
- Create dashboard tasks to visualize business metrics

**2. NFRs → Implementation + Validation Tasks**
- Extract performance requirements (e.g., "page load < 2s")
- Extract scalability requirements (e.g., "10,000 schedules")
- Extract security requirements (e.g., "MFA required", "AES-256 encryption")
- Extract accessibility requirements (e.g., "WCAG 2.1 Level AA")
- Create implementation tasks for EACH NFR
- Create validation/test tasks to verify EACH NFR

**3. Security & Compliance → Configuration + Audit Tasks**
- Extract authentication/authorization requirements
- Extract encryption requirements (at rest, in transit)
- Extract audit logging requirements
- Extract compliance requirements (PCI-DSS, GDPR, CCPA, SOC 2)
- Create configuration tasks for security controls
- Create audit logging implementation tasks
- Create compliance verification tasks

**4. Failure Scenarios → Test Scenario Tasks**
- Extract failure scenarios from Risk & Failure Scenarios section
- Create systematic test tasks for EACH scenario
- Include retry logic testing, error handling testing

**5. MVP Prioritization → Task Organization**
- Group tasks by business priority (MVP → Phase 2 → Phase 3)
- NOT by SDLC phase (Setup → Core → Testing)
- Clearly separate MVP tasks from Phase 2/3 tasks

**6. Acceptance Criteria → Comprehensive Task Mapping**
- Expand feature-level AC to Given/When/Then format
- Map EVERY AC to specific implementation tasks
- Create validation tasks for each AC

Create a comprehensive FULL-STACK plan with:

**Phase Structure (Vertical Slice Approach):**
- **Phase 1: Backend API Layer**
  - 1.1 Shared TypeScript types
  - 1.2 Backend service (business logic, validation)
  - 1.3 Backend routes (REST API endpoints)
  - 1.4 JSON fixtures (sample data)
  - 1.5 Backend tests
  - 1.6 API documentation (Swagger)

- **Phase 2: State Management Layer**
  - 2.1 Frontend API service (openapi-fetch client)
  - 2.2 DataContext types integration
  - 2.3 DataContext implementation (refresh methods, cache)
  - 2.4 State management tests

- **Phase 3: UI Components Layer**
  - 3.1 Component structure and hierarchy
  - 3.2 UWC component integration
  - 3.3 @consume DataContext pattern
  - 3.4 Form validation
  - 3.5 Event handling
  - 3.6 Component tests

- **Phase 4: Quality & NFRs**
  - 4.1 Performance optimization (API + UI)
  - 4.2 Accessibility (WCAG 2.2 AA)
  - 4.3 Security validation
  - 4.4 Error handling
  - 4.5 Integration tests

- **Phase 5: Analytics & Instrumentation**
  - 5.1 OKR tracking implementation
  - 5.2 Performance monitoring
  - 5.3 Business metrics dashboards

- **Phase 6: Compliance & Verification**
  - 6.1 Compliance validation
  - 6.2 End-to-end testing
  - 6.3 Acceptance criteria verification

**Task Details:**
- Detailed tasks with subtasks (15-30 min granularity)
- Checkboxes for tracking
- Thinking keywords for complex tasks (think hard, ultrathink)
- File paths for backend, state, and UI files
- Test-along checkpoints for each layer
- Acceptance criteria mapping (Given/When/Then format)
- Risk assessment (backend + frontend)
- Dependency graph (backend → state → UI)

**CRITICAL:** Tasks MUST span all three layers:
- Backend tasks → Create API endpoints, services, validation
- State tasks → Integrate with DataContext, create API clients
- UI tasks → Build components with @consume pattern

NO localStorage - all data flows through backend API.

**OUTPUT FORMAT:**

Use **MODULAR OUTPUT** (multiple files) if total tasks > 30.
Use **SINGLE FILE** if total tasks <= 30.

**Modular Output (>30 tasks):**
Write to .temn/specs/{feature}/plan/:
1. index.md - Navigation and overview
2. phase-1-backend.md - All Phase 1 tasks with checkboxes
3. phase-2-state.md - All Phase 2 tasks with checkboxes
4. phase-3-ui-mvp.md - All Phase 3 tasks with checkboxes
5. phase-4-quality.md - All Phase 4 tasks with checkboxes
6. (Additional phase files as needed)
7. risks.md - Risk matrix only (NO AC duplication)

Each phase file should:
- Link to spec sections (e.g., [spec-technical.md](../spec-technical.md#api-specification))
- Have task anchors for navigation (## Task 1.1: Name {#task-11})
- Be self-contained for that phase's implementation

**Single File (<=30 tasks):**
Write to: .temn/specs/{feature}/plan/plan-{YYYYMMDD}.md

Return task summary only (60-100 lines max)

Follow the OUTPUT STRATEGY in your agent prompt.`,
});
```

### Step 3: Display Summary

**Finalize TodoWrite:** Mark all planning tasks as completed.

Show:

- All phases and task counts:
  - Phase 1: Backend API Layer (shared types, services, routes, fixtures)
  - Phase 2: State Management Layer (API client, DataContext integration)
  - Phase 3: UI Components Layer (Lit components, UWC, @consume pattern)
  - Phase 4: Quality & NFRs (performance, accessibility, security)
  - Phase 5: Analytics & Instrumentation (OKRs, monitoring)
  - Phase 6: Compliance & Verification (compliance, e2e tests)
- Estimated effort (backend + state + UI)
- Complexity level (full-stack complexity assessment)
- Critical path (dependencies: backend → state → UI)
- High-risk tasks (across all layers)
- File path to full plan

## Output

**For large plans (>30 tasks) - Modular Output:**
- **Index file**: `.temn/specs/{feature}/plan/index.md`
- **Phase files**: `.temn/specs/{feature}/plan/phase-{N}-{name}.md`
- **Risks**: `.temn/specs/{feature}/plan/risks.md`

**For small plans (<=30 tasks) - Single File:**
- **Full plan saved** to `.temn/specs/{feature}/plan/plan-{date}.md`

**Summary shows**: All phase tasks (6 phases covering backend + state + UI), effort estimates, risks, next steps

## Example

```bash
/temn/uux-plan 04-recurring-payments
```

## Next Steps

1. Review full plan in file
2. Start with Phase 1, Task 1.1
3. Track progress with checkboxes
4. Run tests after each task
5. Move to implementation with `/temn/uux-dev`
