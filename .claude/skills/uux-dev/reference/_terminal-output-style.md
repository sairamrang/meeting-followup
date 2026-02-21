# Terminal Output Style Guide

**Version:** 1.0
**Last Updated:** 2025-01-30

This guide defines the visual styling system for all Claude Code command and agent outputs, based on modern terminal UI best practices.

---

## Design Principles

### 1. Subtlety Over Saturation
- Use color **sparingly** - if everything is colored, nothing stands out
- Prefer understated styling for secondary information
- Avoid excessive decoration or emoji

### 2. Semantic Meaning
- Colors and symbols should convey meaning
- Status indicators should be immediately recognizable
- Maintain consistency across all outputs

### 3. Visual Hierarchy
- Lead with essential information
- De-emphasize metadata and paths
- Structure output for quick scanning

### 4. Accessibility
- Respect `NO_COLOR` environment variable
- Never rely solely on color to convey meaning
- Maintain high contrast ratios (> 4.5:1)

---

## Markdown Styling System

Since Claude Code outputs are rendered as markdown in VSCode, we use GitHub-flavored markdown conventions:

### Text Weight

```markdown
**Bold text**       → Phase headers, key actions, emphasis
*Italic text*       → Rarely used, optional emphasis
Normal text         → Main content, descriptions
```

### Status Indicators

```markdown
✓   Success, completion, passed checks (use with normal text)
✗   Failure, errors, failed checks (use with normal text)
→   Step indicator, flow direction
•   List items, bullet points
⚠   Warning, caution (minimal use)
```

**Important:** Use text symbols (✓ ✗) not emoji (✅ ❌) for a more professional, terminal-native feel.

### Color Through Emphasis

Since we can't directly specify colors in markdown, we use formatting conventions:

```markdown
**PASS**           → Bold for positive status
**FAIL**           → Bold for negative status
[file.ts](path)    → Cyan hyperlinks for file references
> Note: ...        → Blockquotes for important notes
```

### File References

Always use markdown links for files:

```markdown
[filename.ts](src/components/filename.ts)
[filename.ts:42](src/components/filename.ts#L42)
[filename.ts:42-51](src/components/filename.ts#L42-L51)
```

---

## Visual Structure Patterns

### Pattern 1: Phase Headers

```markdown
**Phase 1: Setup & Initialization**

Tasks in this phase...
```

**Rules:**
- Bold phase name
- No emoji, no boxes
- Clean, scannable

### Pattern 2: Step Indicators

```markdown
→ Reading specification...
  src/features/04-recurring-payments/spec-recurring-payments.md

→ Analyzing implementation...
  Found 12 components, 8 services, 23 tests
```

**Rules:**
- Use → for action steps
- Indent details under the step
- File paths on their own line

### Pattern 3: Status Updates

```markdown
✓ Specification analyzed (8 user stories, 15 requirements)
✓ Implementation verified (12 components found)
✗ Tests incomplete (coverage: 67%, target: 80%)
```

**Rules:**
- ✓ for success, ✗ for failures
- Status text in normal weight
- Metrics in parentheses

### Pattern 4: File Lists

```markdown
**Files Created:**
- [recurring-form.ts](src/components/payments/recurring-form.ts) (347 lines)
- [payment.types.ts](src/types/payment.types.ts) (89 lines)
- [payment.service.ts](src/services/payments/payment.service.ts) (156 lines)
```

**Rules:**
- Bold section header
- Markdown links for files
- Line counts or metadata in parentheses

### Pattern 5: Metrics & Statistics

```markdown
**Verification Summary:**
- User Stories: 5/5 (100%)
- Must-Have Features: 7/8 (88%)
- Test Coverage: 89%
- Overall Score: 8.7/10
```

**Rules:**
- Bold header
- Dash bullets for metrics
- Percentages and fractions for clarity

### Pattern 6: Issue Lists

```markdown
**High Priority Issues:**

1. Missing end date validation in form
   [recurring-form.ts:145](src/components/payments/recurring-form.ts#L145)
   Recommendation: Add check that end date is after start date

2. Insufficient error handling in API call
   [payment.service.ts:78](src/services/payments/payment.service.ts#L78)
   Recommendation: Add try-catch and user-friendly error messages
```

**Rules:**
- Bold section header with priority level
- Numbered list
- File reference with line number
- Recommendation indented

### Pattern 7: Dividers

Use sparingly for major section breaks:

```markdown
───────────────────────────────────────
```

**Rules:**
- Use simple dash characters: `───` (not heavy `━━━`)
- Only for major section breaks
- Don't overuse - white space is better

---

## Output Templates

### Template: Command Initialization

```markdown
**UUX Developer**
Generating production-ready component...

→ Reading specification...
  [spec-recurring-payments.md](features/04-recurring-payments/spec-recurring-payments.md)

→ Reading architecture...
  [architecture-20250130.md](features/04-recurring-payments/_artifacts/architecture-20250130.md)

→ Launching implementation agent...
```

### Template: Successful Completion

```markdown
✓ Code generated successfully

**Files Created:**
- [component.ts](src/components/feature/component.ts) (347 lines)
- [types.ts](src/types/feature.types.ts) (89 lines)

**Next Steps:**
1. Review code → [component.ts](src/components/feature/component.ts)
2. Create tests → `/temn:uux-tester component feature`
3. Run tests → `npm test`
```

### Template: Verification Report

```markdown
**Verification Report**
Feature: 04-recurring-payments

**Overall Status:** ✓ PASS | Score: 8.7/10 | Completion: 94%

**Requirements Coverage:**
- User Stories: 5/5 (100%)
- Must-Have Features: 7/8 (88%)
- Test Coverage: 89%

**High Priority Issues:** 2 found

1. Missing end date validation
   [recurring-form.ts:145](src/components/payments/recurring-form.ts#L145)

2. Insufficient error handling
   [payment.service.ts:78](src/services/payments/payment.service.ts#L78)

**Next Steps:**
1. Fix high priority issues
2. Re-run verification
3. Create PR when passing
```

### Template: Plan Summary

```markdown
**Development Plan Created**

**Overview:**
- 6 phases, 24 tasks
- Estimated effort: 12-16 hours
- Complexity: Medium-High

**Phase 1: Setup & Initialization** (4 tasks)
- Create project structure
- Set up routing
- Configure types
- Initialize services

**Phase 2: Core Implementation** (8 tasks)
- Build form components
- Implement validation
- Create service layer
- Add state management

**Detailed Plan:**
[plan-20250130.md](features/04-recurring-payments/_artifacts/plan-20250130.md)

**Next Steps:**
1. Review full plan
2. Start Phase 1, Task 1.1
3. Track progress with checkboxes
```

---

## Anti-Patterns (Don't Do)

### ❌ Too Much Decoration

```markdown
╭──────────────────────────────────────╮
│  🚀 LAUNCHING AGENT 🚀               │
╰──────────────────────────────────────╯

🎯 **TASK:** Generate component
🔥 **STATUS:** In Progress
✨ **RESULT:** Success
```

**Why:** Excessive decoration creates visual noise, emoji overuse looks unprofessional.

### ❌ All Caps Overuse

```markdown
**FILES CREATED:**
**COMPONENTS GENERATED:**
**NEXT STEPS:**
```

**Why:** Shouting. Use sentence case for readability.

### ❌ No Visual Hierarchy

```markdown
Reading specification
Reading architecture
Analyzing requirements
Generating code
Creating tests
```

**Why:** Everything looks the same. Use bullets, indentation, and structure.

### ❌ Emoji Overload

```markdown
✅ Success! 🎉
📁 Files created: 🎯
🚀 Next steps: 💪
```

**Why:** Unprofessional, distracting, and not terminal-native.

---

## Agent Output Strategy

When agents return summaries to commands, they should follow this structure:

```markdown
1. **Status Line** - Overall result (✓/✗, score if applicable)
2. **Key Metrics** - Numbers, percentages, completion stats
3. **Main Findings** - 3-5 most important items
4. **File References** - Where to find detailed output
5. **Next Steps** - 2-4 actionable items
```

**Length Guidelines:**
- Command outputs: 30-100 lines
- Agent summaries: 20-80 lines
- Keep detailed analysis in artifact files

---

## Examples from Modern CLI Tools

### bat (syntax highlighter)
- Clean, minimal output
- Subtle line numbers in dim gray
- Code stands out, metadata fades

### delta (git diff)
- Semantic colors (green adds, red removes)
- Dim file paths and line numbers
- Focus on content changes

### starship (prompt)
- Minimal symbols
- Semantic colors for git status
- Information-dense without clutter

### GitHub CLI
- Bold for actions
- Dim for metadata (URLs, IDs)
- Clear status indicators (✓ ✗)

---

## Quick Reference

**For Status:**
- ✓ Success
- ✗ Failure
- → Action/Step

**For Emphasis:**
- **Bold** for headers, actions, status
- Normal for content
- Parentheses for metadata

**For Structure:**
- Dash bullets (-) for lists
- Numbered lists (1.) for sequences
- Indentation for hierarchy
- White space for breathing room

**For Files:**
- Always use markdown links: `[file.ts](path)`
- Include line numbers when relevant: `[file.ts:42](path#L42)`

---

## Implementation Notes

When updating agents:

1. Add OUTPUT STRATEGY section to agent prompt
2. Reference this style guide
3. Include 2-3 formatted examples
4. Emphasize clarity over decoration

When updating commands:

1. Update "Display Summary" sections
2. Show formatted output examples
3. Ensure consistency with other commands

---

**Remember:** Subtle, professional, scannable. Let the content shine, not the decoration.
