# Question Framework

> 12 requirement categories across 2 phases. Source of truth for requirements gathering.

---

## Phase 1: Functional (5 Categories)

| # | Category | Key Questions | Maps To |
|---|----------|---------------|---------|
| 1 | **Business Context** | Problem? Users? Value? Success metrics? | Overview section |
| 2 | **Features & Scope** | P0/P1/P2 priorities? Out of scope? Data needs? | Requirements table |
| 3 | **Business Rules** | Validation? Permissions? Constraints? Calculations? | Business Rules list |
| 4 | **User Experience** | Workflows? Actions? Feedback? States? | User Stories |
| 5 | **Integration** | Existing features? Navigation? | Out of Scope / spec.yaml |

---

## Phase 2: Technical (7 Categories)

| # | Category | Key Questions | Maps To |
|---|----------|---------------|---------|
| 1 | **API Design** | Endpoints? Methods? Request/Response? | API table |
| 2 | **UI Components** | uwc-* components? Layout? Specialized UI? | UI Components table |
| 3 | **NFRs** | Performance? Scalability? Accessibility? | NFRs table |
| 4 | **Security** | Auth? Encryption? Audit? Compliance? | Security section |
| 5 | **Risk & Failure** | Error handling? Empty states? Recovery? | Risks table |
| 6 | **Assumptions** | Constraints? Dependencies? Third-party? | Assumptions list |
| 7 | **Testing** | Coverage (>80%)? Test types? Critical paths? | Testing table |

---

## Interaction Pattern

```
1. Ask 2-4 questions (one category at a time)
2. STOP - Wait for user response
3. Process answers, ask follow-ups if needed
4. STOP - Wait again
5. Move to next category
6. Repeat until all categories covered
7. Summarize understanding
8. STOP - Wait for confirmation
9. Generate spec files
```

**Tool Usage:**
| Situation | Method |
|-----------|--------|
| Open exploration | Conversational (2-4 questions) |
| Key decisions | `AskUserQuestion` tool |
| Priority selection | `AskUserQuestion` with options |

---

## Quality Scoring

| Score | Functional | Technical |
|-------|-----------|-----------|
| 9-10 | Complete requirements, clear AC, full UI mapping | Complete NFRs, security, testing |
| 8-8.9 | Strong requirements, good AC | Good NFRs, security covered |
| 7-7.9 | Clear requirements, basic AC | Basic NFRs, some security |
| 6-6.9 | Acceptable, AC needs work | Minimal NFRs |
| <6 | Needs improvement | Incomplete |

**Targets:**
- Phase 1 (Functional): 8.5+/10
- Phase 2 (Technical): 8.5+/10
- Overall: 8.5+/10
