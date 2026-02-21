# Progressive Testing Methodology

> **Universal 4-phase approach for any tech stack**

---

## Phase Overview

| Phase | Name | Tests | Coverage | Focus |
|-------|------|-------|----------|-------|
| 1 | Foundation | 5-8 | 30-40% | Basic functionality, initialization |
| 2 | Interactions | 10-15 | 55-65% | User actions, state changes |
| 3 | Edge Cases | 10-15 | 70-80% | Errors, validation, boundaries |
| 4 | Coverage Gaps | 5-10 | >80% | Remaining uncovered code |

---

## Phase Details

### Phase 1: Foundation
- Unit under test exists and initializes
- Default configuration works
- Basic operations complete successfully
- **File Action:** CREATE test file

### Phase 2: Interactions
- User-triggered actions work
- State updates correctly
- Integrations function properly
- **File Action:** APPEND to test file

### Phase 3: Edge Cases
- Empty/null data handling
- Invalid input validation
- Error scenarios handled gracefully
- Boundary conditions respected
- **File Action:** APPEND to test file

### Phase 4: Coverage Gaps
- Analyze coverage report
- Target uncovered lines/branches
- Fill remaining gaps to reach >80%
- **File Action:** APPEND to test file

---

## Coverage Requirements

| Metric | Minimum | Target |
|--------|---------|--------|
| Lines | 75% | >80% |
| Branches | 70% | >75% |
| Functions | 75% | >80% |

---

## Process

```
For each phase:
1. Generate tests for phase scope
2. Run tests immediately
3. Check coverage increment
4. Fix failures before proceeding
5. Move to next phase
```

---

## Output Format

```markdown
Phase X Complete

**Tests:** X generated | **Coverage:** XX% (+Y%)
**File:** [test-file](path)

| Phase | Tests | Coverage | Status |
|-------|-------|----------|--------|
| 1 | X | XX% | Pass |
| 2 | X | XX% | Pass |
| 3 | - | - | Pending |
| 4 | - | - | Pending |

**Next:** [action]
```
