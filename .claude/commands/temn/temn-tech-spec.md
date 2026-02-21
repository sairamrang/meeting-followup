---
description: "Build technical specification for a feature (Technical Expert)"
allowed-tools: ["Task", "Read", "Write", "Glob", "AskUserQuestion", "WebSearch", "WebFetch"]
---

<investigate_before_answering>
Read functional spec and existing codebase patterns before asking questions.
Understand architecture to suggest appropriate technical approaches.
</investigate_before_answering>

<web_research>
Use WebSearch/WebFetch for current information when requirements involve:
- Security compliance (PCI-DSS, GDPR, SOC 2 updates)
- Third-party API integrations (check current docs)
- Performance best practices
- Technology choices that may have evolved
</web_research>

<conversation_flow>
Ask 2-4 questions per interaction, then wait for user response.
Validate understanding by summarizing before generating specifications.
</conversation_flow>

# Technical Specification Builder

Technical requirements only. Requires functional spec to exist first.

**Prerequisite:** Run `/temn:temn-requirements [feature]` first.

---

## Modes

| Mode | Command | Description |
|------|---------|-------------|
| **Create** | `/temn:temn-tech-spec [feature]` | Build technical spec |
| **Review** | `/temn:temn-tech-spec review [feature]` | Display spec (read-only) |
| **Enhance** | `/temn:temn-tech-spec enhance [feature]` | Improve technical spec quality |
| **Show** | `/temn:temn-tech-spec show [feature]` | Display full content |

---

## Create Mode

**Step 1: Verify Prerequisite**

Check that spec-functional.md exists in `.temn/specs/{XX-feature}/`

If not found, return:
```
Functional specification required first.
Run: /temn:temn-requirements [feature]
```

**Step 2: Invoke Technical Architect Agent**

```
Task: temn/temn-technical-architect
Prompt: Create technical specification for: "{feature}"
Context: Read spec-functional.md first.
```

**Questions (6 Technical Categories):**
1. NFRs - Performance, scalability, accessibility
2. Security - Auth, encryption, compliance
3. Risk & Failure - Error handling, edge cases
4. Technical Integration - API patterns, dependencies
5. Assumptions - Constraints, resources
6. Testing - Coverage >80%, test types

**Output:** spec-technical.md (~250 lines max) + update spec.yaml

---

## Enhance Mode

1. Read existing spec-technical.md
2. Evaluate quality score
3. Identify gaps (missing NFRs, security, testing, etc.)
4. Ask targeted questions to fill gaps
5. Update spec-technical.md
6. Update quality score in spec.yaml

---

## Review Mode

1. Resolve feature path: `.temn/specs/{XX-feature}/`
2. Read spec.yaml, spec-technical.md
3. Display summary: status, quality score, section previews

---

## Show Mode

Read and display full spec-technical.md content. No file modifications.

---

## Output Structure

```
.temn/specs/{XX-feature-name}/
├── spec.yaml              # Metadata, quality scores (updated)
├── spec-functional.md     # From temn-requirements
├── spec-technical.md      # ~250 lines max (NEW)
└── _artifacts/            # Plans, diagrams
```

---

## Quality Target

8.5+/10 for technical specification

---

## Next Steps

After technical spec is complete:

| Option | Command |
|--------|---------|
| Add Diagrams | `/temn:temn-diagram [feature]` |
| Render HTML | `/temn:temn-spec-render [feature]` |
| Development Plan | `/temn:temn-plan [feature]` |
| Architecture Review | `/temn:temn-architect [feature]` |

---

## Key Rules

1. **Facts over prose** - Tables and bullets, not paragraphs
2. **~250 lines max** - Hard limit for technical spec
3. **No code examples in spec** - Reference implementation files
4. **2-4 questions per interaction** - Never dump all questions
5. **Technical focus** - HOW, not WHAT/WHY
6. **Reference codebase patterns** - Suggest concrete approaches
