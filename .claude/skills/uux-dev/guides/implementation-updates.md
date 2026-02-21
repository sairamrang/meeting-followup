# Live Implementation Updates Guide

Provide transparency during implementation by communicating key decisions in real-time.

---

## When to Provide Updates

Communicate at these critical decision points:

### 1. Component Architecture (when starting)

```markdown
→ Designing component architecture...
Choosing [pattern] with [state management approach]
Reason: [why this architecture fits the requirements]
```

### 2. UWC Component Selection (as you choose components)

```markdown
→ Selecting UWC components...
Using uwc-[component] for [purpose] ([key feature])
Using uwc-[component] for [purpose] ([key feature])
Considered [alternative] but [reason for choice]
```

### 3. State Management (when designing state)

```markdown
→ Designing state management...
State in [location]: [state properties]
Reason: [why this state organization]
Events: [event-name] dispatched when [condition]
```

### 4. TypeScript Design (when creating interfaces)

```markdown
→ Implementing TypeScript interfaces...
Creating [InterfaceName] with [key properties]
Extending [BaseInterface] for [reason]
Generic types: [usage and rationale]
```

### 5. Form Validation (if implementing forms)

```markdown
→ Implementing validation strategy...
Client-side: [validation rules]
Error handling: [approach]
Real-time vs submit: [choice and why]
```

### 6. Accessibility Implementation

```markdown
→ Implementing accessibility features...
ARIA labels: [strategy]
Keyboard navigation: [keys supported]
Screen reader: [announcements for dynamic content]
```

### 7. Critical Trade-offs (when making significant choices)

```markdown
→ Making implementation decision...
Choice: [decision made]
Alternatives: [what was considered]
Trade-off: [what was gained vs sacrificed]
Rationale: [why this choice is best]
```

---

## Format Guidelines

Follow terminal output style:

- Use → for action steps
- Use normal text (not bold) for descriptions
- Indent details under the action
- Keep each update to 2-5 lines
- Be specific about WHY, not just WHAT
- Reference requirements/specs when relevant

---

## Example: Complete Implementation Flow

```markdown
→ Reading requirements...
Feature: Account hierarchy with parent-child relationships
Components needed: Form, tree display, service layer

→ Designing component architecture...
Choosing container pattern with coordinated child components
Reason: Form and tree need to share state and sync updates

→ Selecting UWC components...
Using uwc-tree for hierarchy display (built-in tree navigation)
Using uwc-text-field for account details (validation support)
Using uwc-select for parent selection (searchable dropdown)
Considered uwc-combo-box but uwc-select is simpler for fixed list

→ Designing state management...
State in HierarchyManagement component: accounts[], selectedId, isLoading
Reason: Parent component orchestrates form and tree coordination
Events: account-selected (from tree), account-saved (from form)

→ Implementing TypeScript interfaces...
Creating Account extends BaseAccount
Adding parentAccountId?: string for hierarchy
Creating HierarchyNode for tree structure with children[]

→ Implementing validation strategy...
Client-side: Check parentAccountId doesn't create circular reference
Real-time validation on parent selection change
Reason: Prevent invalid hierarchies before server submission

→ Implementing accessibility features...
ARIA labels on all icon buttons (add, edit, delete)
Keyboard: Tab navigation, Enter to select, Escape to cancel
Screen reader announces: "Account added to hierarchy" on save

→ Writing to source files...
Creating hierarchy-management.ts (main container)
Creating hierarchy-service.ts (tree operations, validation)
Creating hierarchy.types.ts (Account, HierarchyNode interfaces)
```

---

## Key Principles

1. **Updates show reasoning** - Final summary shows results
2. **Be specific** - "Using uwc-dialog for confirmation" not "Adding a modal"
3. **Explain trade-offs** - When choosing between options, explain why
4. **Reference requirements** - Link decisions to spec requirements
5. **Keep it brief** - 2-5 lines per update, not paragraphs
