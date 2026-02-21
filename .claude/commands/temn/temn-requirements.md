---
description: "Gather functional/business requirements (Product Manager)"
allowed-tools: ["Task", "Read", "Write", "Glob", "AskUserQuestion", "WebSearch", "WebFetch"]
---

<investigate_before_answering>
Read project context and existing features before gathering requirements.
Understand existing patterns to suggest appropriate UI components.
</investigate_before_answering>

<web_research>
Use WebSearch/WebFetch for current information when requirements involve:
- Regulatory compliance updates
- Third-party API integrations
- Industry standards or best practices
</web_research>

<conversation_flow>
Ask 2-4 questions per interaction, then wait for user response.
Validate understanding by summarizing before generating specifications.
</conversation_flow>

# Functional Requirements Gathering

Business and functional requirements only. For technical spec, use `/temn:temn-tech-spec`.

---

## Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Create** | `/temn:temn-requirements [feature]` | Build functional spec |
| **Review** | `/temn:temn-requirements review [feature]` | Display spec (read-only) |
| **Enhance** | `/temn:temn-requirements enhance [feature]` | Improve functional spec quality |
| **Quick** | `/temn:temn-requirements quick "[desc]"` | Lightweight spec |
| **Show** | `/temn:temn-requirements show [feature]` | Display full content |

---

## Create Mode

Invoke product manager agent:

```
Task: temn/temn-requirements-agent
Prompt: Create functional specification for: "{feature}"
```

**Questions (5 Business Categories):**
1. Business Context - Problem, users, value, metrics
2. Features & Scope - P0/P1/P2, out of scope
3. Business Rules - Validation, permissions
4. User Experience - Workflows, states
5. Integration - Existing features, navigation

**NOT in functional spec (belongs in technical spec):**
- UUX/UI Components (e.g., `<uwc-*>`)
- API endpoints
- Code examples
- Architecture diagrams

**Output:** spec.yaml + spec-functional.md (~200 lines max)

**Final Step - Auto Review:**
After generating spec, automatically run review and include report:

```markdown
---
## Quality Review

| Category | Score | Notes |
|----------|-------|-------|
| Clarity | X/10 | [assessment] |
| Completeness | X/10 | [assessment] |
| User Stories | X/10 | [assessment] |
| Business Rules | X/10 | [assessment] |
| Consistency | X/10 | [assessment] |
| Scope | X/10 | [assessment] |

**Overall:** X.X/10
**Structure:** ✅ Valid (no misplaced sections)
**App Fit:** [assessment]

### Recommendations
- [improvement 1]
- [improvement 2]
```

---

## Enhance Mode

1. Read existing spec-functional.md
2. Evaluate quality score
3. Identify gaps (missing business context, user stories, etc.)
4. Ask targeted questions to fill gaps
5. Update spec-functional.md
6. Update quality score in spec.yaml

---

## Review Mode

1. Resolve feature path: `.temn/specs/{XX-feature}/`
2. Read spec.yaml, spec-functional.md, project-context.md
3. **Validate structure** - Check for misplaced sections:
   - ❌ `## UUX Components` or `## UI Components` → belongs in technical spec
   - ❌ `## API` or `## Endpoints` → belongs in technical spec
   - ❌ Code blocks with `<uwc-*>` → belongs in technical spec
   - ❌ `## Architecture` → belongs in technical spec

4. **Evaluate quality** (score each 1-10):

| Category | Check |
|----------|-------|
| Clarity | Requirements are unambiguous, testable |
| Completeness | All P0 requirements have acceptance criteria |
| User Stories | Cover key personas, have clear benefit |
| Business Rules | Explicit validation/permission constraints |
| Consistency | Aligns with existing app patterns |
| Scope | Clear out-of-scope boundaries |

5. **App fit assessment**:
   - Read existing specs in `.temn/specs/` for patterns
   - Check navigation placement makes sense
   - Verify terminology matches existing features
   - Identify potential conflicts with existing features

6. Display summary:
   - Status, quality score, section previews
   - Quality breakdown by category
   - App fit assessment
   - **Report violations** if any misplaced sections found
   - Recommendations for improvement

---

## Quick Mode

```
Task: temn/temn-product-owner
Prompt: Create lightweight specification for: "{feature}"
Quick mode - reduced questions, single file output.
```

Target quality: 6.5+/10

---

## Show Mode

Read and display full spec-functional.md content. No file modifications.

---

## Output Structure

```
.temn/specs/{XX-feature-name}/
├── spec.yaml              # Metadata, quality scores
├── spec-functional.md     # ~200 lines max
└── _artifacts/            # Plans, diagrams
```

---

## Quality Target

8.5+/10 for functional specification

---

## Next Steps

After functional spec is complete:

| Option | Command |
|--------|---------|
| Technical Spec | `/temn:temn-tech-spec [feature]` |
| Add Diagrams | `/temn:temn-diagram [feature]` |
| Render HTML | `/temn:temn-spec-render [feature]` |
| Development Plan | `/temn:temn-plan [feature]` |

---

## Key Rules

1. **Facts over prose** - Tables and bullets, not paragraphs
2. **~200 lines max** - Hard limit for functional spec
3. **No code examples** - Reference implementation files
4. **2-4 questions per interaction** - Never dump all questions
5. **Business focus** - WHAT and WHY, not HOW
6. **No UUX/UI components** - Component selection belongs in technical spec
7. **No API details** - Endpoints, payloads belong in technical spec

## Functional Spec Allowed Sections

| ✅ Include | ❌ Exclude (→ technical spec) |
|-----------|-------------------------------|
| Overview | UUX Components |
| User Stories | API Endpoints |
| Requirements (P0/P1/P2) | Architecture |
| Business Rules | Code Examples |
| User Workflows | Type Definitions |
| Acceptance Criteria | File Structure |
| Success Metrics | NFRs (Performance, etc.) |
| Out of Scope | Testing Strategy |
