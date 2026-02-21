# TEMN Shared Patterns

> **Reusable patterns and templates for agents**

---

## Templates

| Template | Purpose | Used By |
|----------|---------|---------|
| [roadmap-template.md](./roadmap-template.md) | Strategic roadmap format | temn-roadmap |
| [prd-template.md](./prd-template.md) | PRD (business case) format | temn-prd |
| [spec-functional-template.md](./spec-functional-template.md) | Functional spec format | temn-requirements |
| [spec-technical-template.md](./spec-technical-template.md) | Technical spec format | temn-tech-spec |

---

## Patterns

| Pattern | Purpose | Used By |
|---------|---------|---------|
| [question-framework.md](./question-framework.md) | Structured question gathering | temn-requirements, temn-prd |
| [ui-component-mapping.md](./ui-component-mapping.md) | Requirements to UI mapping | temn-requirements, temn-architect |

---

## Document Hierarchy

```
ROADMAP (Strategic)        → roadmap-template.md
    ↓
PRD (Business Case)        → prd-template.md (optional)
    ↓
SPEC (Requirements)        → spec-functional-template.md
                           → spec-technical-template.md
```

---

## Usage

Agents reference templates for output format:

```markdown
## Output Format
**Template:** @.claude/agents/temn/_patterns/spec-functional-template.md
```

---

## Benefits

- **Token efficiency**: Agents reference instead of embedding
- **Consistency**: Same format across outputs
- **Maintainability**: Update template once
- **Clarity**: Templates are pure format, agents have instructions
