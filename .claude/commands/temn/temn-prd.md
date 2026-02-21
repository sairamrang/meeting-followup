---
description: "Create PRD (Product Requirements Document) for epic/initiative"
allowed-tools: ["Task", "Read", "Write", "Glob", "AskUserQuestion", "WebSearch", "WebFetch"]
---

<investigate_before_answering>
Read roadmap to find epic context before gathering PRD requirements.
</investigate_before_answering>

<web_research>
Use WebSearch/WebFetch for market research, competitive analysis, industry benchmarks.
</web_research>

<conversation_flow>
Ask 2-4 questions per interaction, then wait for user response.
</conversation_flow>

# PRD Builder

Create Product Requirements Documents for epics from the roadmap.

**Purpose:** Bridge between strategic roadmap and detailed specifications.

---

## SAFe Hierarchy

```
ROADMAP (Strategic)     → /temn:temn-roadmap
    ↓
PRD (Business Case)     → /temn:temn-prd (this command)
    ↓
SPEC (Requirements)     → /temn:temn-requirements
```

---

## Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Create** | `/temn:temn-prd [epic]` | Create PRD for epic |
| **Review** | `/temn:temn-prd review [epic]` | Review existing PRD |
| **Show** | `/temn:temn-prd show [epic]` | Display PRD content |

---

## Create Mode

```
Task: temn/temn-prd-agent
Prompt: Create PRD for: "{epic}"
```

**Questions (4 Categories):**
1. Problem & Opportunity - Pain point, market context, business impact
2. Users & Research - Personas, research findings, JTBD
3. Solution & Scope - Hypothesis, features, priorities
4. Success & Risks - Metrics, assumptions, risks

**Output:** `.temn/prds/{epic-name}-prd.md` (~150 lines max)

---

## What PRD Contains

| ✅ Include in PRD | ❌ Exclude (→ spec) |
|-------------------|---------------------|
| Problem Statement | Detailed requirements |
| Personas | Acceptance criteria |
| Market Opportunity | Technical architecture |
| Solution Hypothesis | API design |
| Success Metrics | UI components |
| Feature Scope (high-level) | Implementation details |
| Risks & Assumptions | Test strategy |

---

## Output Structure

```
.temn/prds/{epic-name}-prd.md    # ~150 lines max
```

---

## Quality Target

8.0+/10 for PRD

---

## Workflow

```bash
# 1. Create roadmap (if not exists)
/temn:temn-roadmap

# 2. Create PRD for priority epic
/temn:temn-prd "Epic: Savings Goals"
# Output: .temn/prds/savings-goals-prd.md

# 3. Create specs for features in PRD scope
/temn:temn-requirements "Goal Progress Tracking"
# References PRD for business context

# 4. Technical spec
/temn:temn-tech-spec "Goal Progress Tracking"
```

---

## Next Steps After PRD

| Option | Command |
|--------|---------|
| Create Spec | `/temn:temn-requirements "{feature from scope}"` |
| Technical Spec | `/temn:temn-tech-spec "{feature}"` |
| Development Plan | `/temn:temn-plan "{feature}"` |

---

## Key Rules

1. **Read roadmap first** - Find epic context
2. **Business focus** - WHY and WHO, not HOW
3. **~150 lines max** - Strategic, not detailed
4. **Link to roadmap** - Reference source epic
5. **Link to specs** - Table of features with spec links
6. **No technical details** - That's for specs
