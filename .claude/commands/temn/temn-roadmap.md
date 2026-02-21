---
description: "Create strategic product roadmap with vision, OKRs, and epics"
allowed-tools: ["Task"]
---

# Product Roadmap

Create strategic roadmaps: vision, OKRs, epic list.

**Focus:** Strategic direction. Details go to PRD/Spec.

---

## Usage

```bash
/temn:temn-roadmap
/temn:temn-roadmap "Card Management for 2026"
```

---

## Output

**File:** `.temn/roadmap/roadmap.md`

**Contains (template sections only):**
- Vision (2-3 sentences)
- OKRs table (objective, key result, target)
- Epics table (name, quarter, effort, status)

---

## Process

```typescript
Task({
  subagent_type: "temn/temn-roadmap-agent",
  description: "Create product roadmap",
  prompt: `Create roadmap. Follow template exactly. Output ONLY template sections.`
});
```

---

## After Roadmap (return to user)

```
Roadmap created: .temn/roadmap/roadmap.md

Next steps:
- /temn:temn-prd "{epic}" → Business case (optional)
- /temn:temn-requirements "{epic}" → Feature specification
```
