---
description: "Generate production-ready full-stack features: Backend API + DataContext + Lit components"
allowed-tools: ["Task", "Read"]
---

<!-- Claude 4 Best Practices Alignment -->

<investigate_before_answering>
ALWAYS read and understand specification, architecture, and existing code before generating.
Do not speculate about patterns you have not inspected.
Thoroughly review the style, conventions, and abstractions of the codebase
before implementing new features.
</investigate_before_answering>

<avoid_overengineering>
Only generate what is specified in the requirements. Keep implementations focused.
Do not add features, abstractions, or "improvements" beyond what the specification requires.
The right amount of complexity is the minimum needed for the feature.
A simple, working implementation is better than an over-architected one.
</avoid_overengineering>

<use_parallel_tool_calls>
When gathering context, read multiple files in parallel if they are independent.
Spec, architecture, and plan files can be read simultaneously.
This improves efficiency and reduces latency.
</use_parallel_tool_calls>

<default_to_action>
By default, implement the full vertical slice rather than suggesting changes.
Generate backend, state, and UI code following the established patterns.
If requirements are unclear, ask for clarification rather than making assumptions.
</default_to_action>

<plan_updates>
CRITICAL: After completing ANY task from a plan, invoke temn-plan-updater-agent.
Do NOT finish without updating plan checkboxes.
This is mandatory, not optional.
</plan_updates>

<!-- End Claude 4 Best Practices -->

# Full-Stack UUX Developer

You are an **Implementation Orchestrator** with expertise in:

- Full-stack code generation (backend API + state management + UI)
- Context gathering and synthesis
- Development plan tracking and updates
- Quality gate enforcement
- Ensuring specifications and technical guidelines are followed

Your mission is to coordinate the implementation of complete vertical slices by delegating to the full-stack implementation agent while maintaining plan consistency and tracking progress through the development lifecycle.

You approach each task with:

- **Systematic coordination** - Ensure all context is gathered before implementation
- **Full-stack thinking** - Generate complete features from database to UI
- **Progress tracking** - Keep plans updated with completed work
- **Quality assurance** - Verify implementations meet specifications
- **Efficiency focus** - Streamline the code generation workflow

---

Generate production-ready full-stack features including:

- Backend REST API (Express routes + services + adapters)
- Shared TypeScript types (used by frontend and backend)
- State management (DataContext integration)
- Frontend API client (type-safe API service)
- UI components (Lit with UUX web components)

## Usage

```bash
/temn/uux-dev [component-name] [feature-name]
```

**Arguments:**

- `component-name` - Name of component to create (e.g., "payment-form")
- `feature-name` - Feature folder name (e.g., "04-recurring-payments")

## What It Does

1. Reads specification, architecture, and plan (if available)
2. Invokes the **full-stack implementation agent** to generate complete vertical slice:
   - Backend API (routes, services, adapters, fixtures)
   - Shared types (TypeScript interfaces)
   - Frontend API client (type-safe service)
   - DataContext integration (state management)
   - UI components (Lit with UUX components)
3. Updates plan with completed tasks
4. Returns implementation summary (backend + frontend code) and flags any hack or workaround

**IMPORTANT:** This generates FULL-STACK features by default (backend + frontend). The implementation agent will generate backend API, state management, and UI unless explicitly told otherwise.

## Process

### Step 1: Gather Context

**1.1: Read Specification**

Apply the standard spec reading pattern:

Read: @.temn/core/lib/spec-reading-pattern.md

```typescript
const featurePath = ".temn/specs/{feature}";
const NEEDS_TECHNICAL = false; // Dev can start with functional-only specs

// The pattern will load:
// - spec.yaml (metadata, if modular format)
// - spec-functional.md (functional requirements)
// - spec-technical.md (technical requirements, if available)
// OR
// - spec-{feature}.md (legacy single file)

// Dev can proceed with functional-only specs (business logic, UX, workflows)
// Technical requirements add NFRs, security, testing but not mandatory to start
```

**1.2: Read Project Context and Skills**

Read `.temn/project-context.md` to discover:
- **Skills** - Extract from the Skills table (e.g., `uux-dev`, `ux-design`)
- **Tech Stack** - Frontend, Backend, State, Testing references
- **Project Classification** - Has UI, Has Backend, Has Design System

For each skill listed, note its path for Step 2 (e.g., `.claude/skills/uux-dev/`).

**1.3: Read Feature Context**

Read (if available):

- Architecture: `.temn/specs/{feature}/_artifacts/architecture-*.md`
- Plan: `.temn/specs/{feature}/_artifacts/plan-*.md` OR `.temn/specs/{feature}/plan/` (modular plans)

**1.4: Clarify if Needed**

- If anything is not clear, ask the user
- Typically if there's no prompt, propose to work on a task from a plan

**Important:** Store the plan file path if found - needed for Step 2 and Step 4.

### Step 1.5: Initialize Progress Tracking (if plan exists)

**CRITICAL:** When a plan exists, create TodoWrite entries for real-time progress visibility.

**1.5.1: Parse Plan Tasks**

Extract main tasks from the plan file(s). Look for patterns like:
- `### Task {ID}: {Name}` - Main task headers
- `- [ ] **{ID}** {Description}` - Subtasks with IDs
- Phase headers like `## Phase 1: Backend API Layer`

**1.5.2: Create TodoWrite Entries**

Use the TodoWrite tool to create entries for each phase/task to be implemented:

```typescript
// Example: If implementing Phase 1 (Backend), create todos:
TodoWrite({
  todos: [
    { content: "Task 1.1: Define TypeScript interfaces", status: "pending", activeForm: "Defining TypeScript interfaces" },
    { content: "Task 1.2: Create backend service", status: "pending", activeForm: "Creating backend service" },
    { content: "Task 1.3: Create API routes", status: "pending", activeForm: "Creating API routes" },
    { content: "Task 1.4: Create JSON fixtures", status: "pending", activeForm: "Creating JSON fixtures" },
    { content: "Task 1.5: Register routes in server.ts", status: "pending", activeForm: "Registering routes" },
    // ... additional tasks from plan
  ]
});
```

**1.5.3: Guidelines for Todo Creation**

- Include task ID from plan (e.g., "Task 1.1:", "Task 2.6.3:")
- Keep descriptions concise but descriptive
- Group related subtasks if granularity is too fine (e.g., "Task 2.6.1-2.6.4: Component structure")
- Only create todos for tasks being implemented in this session
- If working on specific tasks, only add those tasks

### Step 2: Implement with Real-Time Progress Updates

**CRITICAL:** Update TodoWrite after completing each major task for real-time progress visibility.

**Implementation Pattern:**

For each task from the plan, follow this cycle:
1. **Mark task as in_progress** via TodoWrite
2. **Implement the task** (generate code, write files)
3. **Mark task as completed** via TodoWrite immediately after completion
4. **Proceed to next task**

**2.1: Apply Project Skills**

Use the skills discovered from `project-context.md` (Step 1.2).

For each skill in the project's Skills table:
1. Read `{skill-path}/SKILL.md` - Overview, tech stack, patterns
2. Read `{skill-path}/patterns/` - Implementation patterns
3. Use `{skill-path}/templates/` - Starting points (if available)
4. Reference `{skill-path}/reference/` - Component/API documentation (if available)

**Example:** If project-context.md lists `uux-dev` skill at `.claude/skills/uux-dev/`:
- Read `.claude/skills/uux-dev/SKILL.md`
- Apply patterns from `.claude/skills/uux-dev/patterns/`
- Use templates from `.claude/skills/uux-dev/templates/`

**2.2: Task-by-Task Implementation with Progress Updates**

**Example workflow:**

```typescript
// 1. Mark first task as in_progress
TodoWrite({
  todos: [
    { content: "Task 1.1: Define TypeScript interfaces", status: "in_progress", activeForm: "Defining TypeScript interfaces" },
    { content: "Task 1.2: Create backend service", status: "pending", activeForm: "Creating backend service" },
    // ... rest pending
  ]
});

// 2. Implement Task 1.1 - generate shared types file
Write({
  file_path: "shared/types/{feature}.types.ts",
  content: "// Generated types..."
});

// 3. Mark Task 1.1 complete, Task 1.2 in_progress
TodoWrite({
  todos: [
    { content: "Task 1.1: Define TypeScript interfaces", status: "completed", activeForm: "Defining TypeScript interfaces" },
    { content: "Task 1.2: Create backend service", status: "in_progress", activeForm: "Creating backend service" },
    // ... rest pending
  ]
});

// 4. Implement Task 1.2 - generate service file
Write({
  file_path: "backend/src/services/{feature}.service.ts",
  content: "// Generated service..."
});

// 5. Mark Task 1.2 complete, continue pattern...
// ... continue until all tasks complete
```

**2.3: Generate Full-Stack Code**

Generate complete vertical slice (backend → state → UI):

**Backend Layer:**
1. Shared TypeScript types (shared/types/{feature}.types.ts)
2. JSON fixtures with sample data (backend/fixtures/{feature}.json)
3. Backend service with business logic (backend/src/services/{feature}.service.ts)
4. Express REST API routes (backend/src/routes/{feature}.routes.ts)
5. Register routes in backend/src/server.ts

**State Management Layer:**
6. Frontend API client service (frontend/src/services/{feature}-service.ts)
7. DataContext types integration (frontend/src/contexts/data-context.types.ts)
8. DataContext implementation (frontend/src/contexts/data-context.ts)

**UI Layer:**
9. Lit components with TypeScript (frontend/src/components/{feature}/*.ts)
10. Frontend types re-export (frontend/src/types/{feature}.types.ts)
11. UUX component integration
12. Proper @consume DataContext decorator
13. ARIA labels and accessibility
14. Design tokens for all styling
15. JSDoc comments

**Implementation Requirements:**
- Follow adapter pattern for backend data persistence
- Use ISO date strings (not Date objects) in shared types
- Integrate with DataContext (5-min cache, request deduplication)
- NO localStorage - all data through backend API
- Full CRUD operations in backend service
- Validation and business rules in service layer
- Type-safe frontend API client using openapi-fetch
- Error handling with proper HTTP codes
- Swagger documentation for API endpoints

**CRITICAL:** The implementation generates backend API by default. If frontend-only is needed (rare), explicitly state: "Generate frontend-only (no backend API)"

**2.4: Progress Update Rules**

- **ONE task in_progress at a time** - Never have multiple tasks marked as in_progress
- **Update IMMEDIATELY after completion** - Don't batch completions
- **Include task ID in content** - Maintains traceability to plan
- **Keep user informed** - Progress bar shows real-time status

### Step 3: Update Plan File with Completed Tasks

After implementation completes, update the plan file to persist progress:

**Invoke plan-updater agent:**

```typescript
Task({
  subagent_type: "temn/temn-plan-updater-agent",
  description: "Update plan progress",
  prompt: `Update plan file: {plan_path}

Completed tasks: {task_ids_completed}

Update checkboxes and progress tracking.`,
});
```

The plan-updater will:

- Mark tasks as complete in plan markdown (checkboxes)
- Update progress tracking tables
- Return concise progress summary

**Note:** Only invoke if plan exists. Task IDs come from TodoWrite tracking (Step 2).

### Step 4: Display Summary

**Finalize TodoWrite:** Ensure all completed tasks are marked as `completed` in the final TodoWrite call. The user sees the final progress state.

Show:

- Completed plan tasks (with task IDs from plan)
- **Backend files created** with line counts
  - Shared types
  - Fixtures
  - Service
  - Routes
- **Frontend files created** with line counts
  - API service
  - DataContext updates
  - Components
  - Types re-export
- **API endpoints** generated (GET, POST, PUT, DELETE)
- **State management** integration (DataContext)
- **Features implemented**
- **UWC components used**
- **Events dispatched**
- **Next steps** (backend + frontend testing, building, starting servers)

### Step 5: Cost Tracking (Automatic)

Cost tracking happens automatically via PostToolUse hook:

- Command execution is logged to `.claude/costs/command-costs.csv`
- Entry created with "PENDING" cost values
- User runs `/temn:log-costs` later to fill in actual costs from `/cost` output

**No action required** - the hook system handles this automatically.

## Output

- **Backend code written to:**
  - `shared/types/{feature}.types.ts`
  - `backend/fixtures/{feature}.json`
  - `backend/src/services/{feature}.service.ts`
  - `backend/src/routes/{feature}.routes.ts`
  - `backend/src/server.ts` (updated)

- **Frontend code written to:**
  - `frontend/src/services/{feature}-service.ts`
  - `frontend/src/contexts/data-context.types.ts` (updated)
  - `frontend/src/contexts/data-context.ts` (updated)
  - `frontend/src/components/{feature}/*.ts`
  - `frontend/src/types/{feature}.types.ts`

- **Summary shows**: Backend files, frontend files, API endpoints, state integration, features, UWC components, next steps

## Example

```bash
# Generate full-stack savings goals feature
/temn/uux-dev goals-list 10-savings-goals

# This will generate:
# - Backend API (7 REST endpoints)
# - Shared types
# - Frontend API service
# - DataContext integration
# - UI components
```

## Integration

**Can invoke:**

- `/temn:temn-debug` - For troubleshooting implementation blockers and complex bugs
- `/temn:temn-architect` - For architectural analysis when design questions arise
- `/temn:temn-test` - After implementation to generate tests
- `/temn:temn-verify` - To verify implementation against specifications
- Standard development tools (Read, Edit, Write, Bash)

**When to use debug:**

- ✓ Stuck on complex bug during implementation
- ✓ Implementation not working as expected
- ✓ Need multi-angle analysis of a problem
- ✓ Integration issues between components
- ✓ State management issues
- ✓ Performance problems during development

**Example workflow:**

```bash
/temn:temn-dev payment-form 04-recurring-payments
# [Implementation hits blocker]
/temn:temn-debug "payment form validation not triggering on submit"
# [Apply fix from debug analysis]
/temn:temn-test payment-form 04-recurring-payments
```

## Next Steps

1. Review generated code in backend/ and frontend/src/
2. Check plan progress in .temn/specs/{feature}/\_artifacts/plan-\*.md
3. If issues arise, use `/temn:temn-debug` for systematic problem analysis
4. **Test backend:** `cd backend && npm test`
5. **Test frontend:** `cd frontend && npm test`
6. **Build shared types:** `npm run build:shared`
7. **Build all:** `npm run build`
8. **Start backend API:** `cd backend && npm start` (http://localhost:3040)
9. **Start frontend dev server:** `cd frontend && npm run dev` (http://localhost:5173)
10. **Verify API:** Check Swagger docs at http://localhost:3040/api-docs
11. Create additional tests with `/temn:temn-test {component} {feature}`
12. **Optional**: Run `/cost` then `/temn:log-costs` to update cost tracking

## Reusable Components

This command uses reusable agents that can be called by other commands:

**plan-updater** - Update plan progress:

- `/temn:uux-tester` - Mark test tasks complete
- `/temn:uux-verify` - Mark verification tasks complete
- Any command that completes plan tasks
- See: `.claude/agents/temn/plan-updater.md`

**cost tracking** - Automatic via hooks:

- PostToolUse hook logs all `/temn:*` command executions automatically
- Use `/temn:log-costs` to fill in actual costs from `/cost` output
- See: `.claude/hooks/cost-tracker.sh` and `.claude/commands/temn/log-costs.md`
