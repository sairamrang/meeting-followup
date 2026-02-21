# Development Plan Templates

> **Reference for temn-planner** - Lean templates for development plans

---

## Template Selection

| Total Tasks | Strategy | Output |
|-------------|----------|--------|
| <= 30 | Single file | `plan/plan-{YYYYMMDD}.md` |
| > 30 | Modular | `plan/index.md` + phase files |

---

## Modular Templates (>30 tasks)

### index.md (MAX 25 lines - navigation ONLY)

```markdown
# Plan: {Feature Name}

| | |
|---|---|
| Tasks | {N} |
| Specs | [functional](../spec-functional.md) / [technical](../spec-technical.md) |

| Phase | File | Tasks |
|-------|------|-------|
| 1. Backend | [phase-1-backend.md](./phase-1-backend.md) | 6 |
| 2. State | [phase-2-state.md](./phase-2-state.md) | 4 |
| 3. UI | [phase-3-ui.md](./phase-3-ui.md) | 8 |

| Risk | Mitigation |
|------|------------|
| API timeout | Retry, cache |

-> [Task 1.1](./phase-1-backend.md#task-11)
```

**NO other content. NO headers like "## Phases". NO descriptions.**

### phase-{N}-{name}.md (100-200 lines)

```markdown
# Phase 1: Backend

Spec: [API](../spec-technical.md#api) | [Types](../spec-technical.md#types)

## Task 1.1: Shared Types {#task-11}
`shared/types/dashboard-types.ts`

- [ ] DashboardResponse interface
- [ ] AssetAllocation + AssetClass types
- [ ] Alert interface with severity levels
- [ ] SummaryCards + PortfolioIndicators

## Task 1.2: Dashboard Service {#task-12}
`services/dashboard-service.ts` | Deps: 1.1

- [ ] getDashboard(filters) -> DashboardResponse
- [ ] Bearer token auth header
- [ ] Response caching (5 min TTL)
- [ ] Error handling (timeout, 401, 5xx)
```

### risks.md (MAX 20 lines - table ONLY)

```markdown
# Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| API timeout | High | Retry, cache |
| Chart library | Med | Lazy load |
| WCAG compliance | High | axe-core |
| State race conditions | Med | Debounce |
```

**NO prose. NO descriptions. NO owners. NO probability columns. JUST the table.**

---

## Single File Template (<= 30 tasks)

```markdown
# Plan: {Feature Name}

| | |
|---|---|
| Tasks | {N} total |
| Specs | [functional](../spec-functional.md) / [technical](../spec-technical.md) |

## Phase 1: Foundation

### Task 1.1: {Task Name} {#task-11}
`path/to/file.ts`

- [ ] Subtask one
- [ ] Subtask two
- [ ] Subtask three

### Task 1.2: {Task Name} {#task-12}
`path/to/file.ts` | Deps: 1.1

- [ ] Subtask one
- [ ] Subtask two

## Phase 2: Quality

### Task 2.1: {Task Name} {#task-21}
...

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High | Mitigation |
```

---

## Task Structure

Each task follows this format:

```markdown
## Task X.Y: {Name} {#task-xy}
`path/to/file.ts` | Deps: X.Z (optional)

- [ ] One-line subtask
- [ ] One-line subtask
- [ ] One-line subtask
```

**Rules:**
- 3-6 subtasks per task
- One line per subtask (no multi-line)
- File path on first line
- Dependencies after pipe if needed
- Anchor for linking: `{#task-xy}`

---

## What NOT to Include

| Section | Why Excluded |
|---------|--------------|
| Architecture notes | In spec-technical.md |
| Quality gates | In spec NFRs |
| File structure | In spec architecture |
| Success metrics | In spec |
| AC traceability | In spec-functional.md |
| Effort estimates | Unreliable guesses |
| Rollout plan | PM territory |
| "Obvious" tasks | JSDoc, lint, etc. |

---

## Complexity Markers

Use in task names when helpful:

| Complexity | Marker | Example |
|------------|--------|---------|
| Simple | (none) | Task 1.1: Shared Types |
| Medium | `think hard` | Task 2.1: State Context `think hard` |
| High | `think harder` | Task 3.1: Complex Widget `think harder` |
| Critical | `ultrathink` | Task 4.1: Security Audit `ultrathink` |
