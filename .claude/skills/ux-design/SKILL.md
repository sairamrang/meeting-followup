# UX Design Skill

```yaml
---
name: ux-design
description: |
  Universal UX design principles and accessibility patterns.
  Use for: UI/UX reviews, accessibility audits, design system agnostic work,
  user experience evaluation, information architecture, interaction design.
  Auto-activates for: accessibility, WCAG, usability, user experience,
  inclusive design, screen reader, keyboard navigation, UX review.
---
```

## Overview

This skill provides **design system agnostic** UX principles and accessibility patterns applicable to ANY UI framework, component library, or design system.

**When to use this skill:**
- Reviewing UI/UX designs for usability
- Conducting accessibility audits (WCAG 2.2 compliance)
- Evaluating information architecture
- Designing interaction patterns
- Reviewing user flows and journeys
- Applying inclusive design principles

**This skill is NOT for:**
- Framework-specific implementations (use uux-dev for Temenos UUX)
- Component library code examples (use framework-specific skills)
- Specific design token values (use project's design system)

---

## Core References

### Accessibility Standards
- [WCAG 2.2 Patterns](standards/accessibility-wcag.md) - Complete accessibility checklist
- [Inclusive Design](standards/inclusive-design.md) - Design for diverse users
- [Keyboard Navigation](reference/keyboard-navigation.md) - Keyboard patterns

### UX Principles
- [Usability Heuristics](standards/usability-heuristics.md) - Nielsen's 10 heuristics
- [Interaction Design](patterns/interaction-design.md) - Affordances, feedback, states
- [Information Architecture](patterns/information-architecture.md) - Content hierarchy

### Design Patterns
- [User Flows](patterns/user-flows.md) - Journey mapping and flow design
- [Responsive Design](patterns/responsive-design.md) - Mobile-first approach
- [Form Design](patterns/form-design.md) - Form usability patterns

### Reference
- [Color Contrast](reference/color-contrast.md) - Contrast requirements
- [Screen Reader Patterns](reference/screen-reader-patterns.md) - Assistive tech support
- [Touch Targets](reference/touch-targets.md) - Mobile interaction areas

---

## Quick Reference

### WCAG 2.2 AA Requirements (Minimum)

| Category | Requirement | Standard |
|----------|-------------|----------|
| **Text Contrast** | 4.5:1 ratio | Normal text |
| **Large Text Contrast** | 3:1 ratio | 18px+ or 14px bold |
| **UI Component Contrast** | 3:1 ratio | Buttons, inputs, icons |
| **Touch Targets** | 24x24px minimum | Interactive elements |
| **Focus Indicators** | Visible outline | 2px min thickness |
| **Keyboard Access** | All functionality | No mouse required |
| **Form Labels** | Associated labels | Visible or aria-label |
| **Error Identification** | Clear messaging | Don't rely on color alone |

### Nielsen's 10 Usability Heuristics

1. **Visibility of system status** - Keep users informed
2. **Match between system and real world** - Use familiar language
3. **User control and freedom** - Provide undo/redo
4. **Consistency and standards** - Follow conventions
5. **Error prevention** - Prevent problems before they occur
6. **Recognition rather than recall** - Minimize memory load
7. **Flexibility and efficiency** - Accommodate expert users
8. **Aesthetic and minimalist design** - Remove unnecessary elements
9. **Help users recognize, diagnose, and recover from errors** - Clear error messages
10. **Help and documentation** - Provide searchable help

### Common Touch Targets

| Context | Minimum Size | Recommended |
|---------|--------------|-------------|
| Mobile | 44x44px | 48x48px |
| Desktop | 24x24px | 40x40px |
| With spacing | 8px gap | 12px gap |

### Form Design Principles

1. **Labels above fields** - Easier scanning
2. **Group related fields** - Logical sections
3. **Single column layouts** - Mobile-friendly
4. **Required field indicators** - Clear marking
5. **Inline validation** - Immediate feedback
6. **Error messages near field** - Clear association
7. **Progress indicators** - Multi-step forms

---

## UX Review Checklist

### Information Architecture
- [ ] Clear content hierarchy
- [ ] Logical navigation structure
- [ ] Consistent labeling
- [ ] Breadcrumbs for deep pages
- [ ] Search functionality (if needed)

### Interaction Design
- [ ] Clear affordances (buttons look clickable)
- [ ] Immediate feedback on actions
- [ ] Loading states for async operations
- [ ] Error states with recovery options
- [ ] Confirmation for destructive actions

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast passes (4.5:1 / 3:1)
- [ ] Focus indicators visible
- [ ] Touch targets adequate
- [ ] Alternative text for images
- [ ] Form labels associated

### Responsive Design
- [ ] Mobile-first approach
- [ ] Content readable without zooming
- [ ] Touch targets appropriate for device
- [ ] No horizontal scrolling
- [ ] Images scale appropriately

### User Flow
- [ ] Clear primary action
- [ ] Minimal steps to complete task
- [ ] Back button works as expected
- [ ] Progress saved (if applicable)
- [ ] Clear success/completion state

---

## Integration with Other Skills

### With uux-dev skill
- Use ux-design for principles and accessibility
- Use uux-dev for UWC component implementation

### With code-reviewer agent
- ux-design validates UX patterns
- code-reviewer validates code quality

### With accessibility-validator agent
- ux-design provides standards reference
- agent performs automated checks

---

## Key Principles

1. **User-Centered** - Design for real user needs, not assumptions
2. **Accessible by Default** - WCAG compliance is not optional
3. **Progressive Enhancement** - Core functionality works everywhere
4. **Consistent Patterns** - Reduce cognitive load
5. **Feedback Always** - Users should never wonder what happened
6. **Error Prevention** - Design to prevent mistakes
7. **Inclusive Design** - Consider diverse abilities and contexts

---

## Additional Resources

### External References
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [Nielsen Norman Group](https://www.nngroup.com/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [Material Design Guidelines](https://material.io/design)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**This skill provides universal UX principles. For framework-specific implementation, use the appropriate tech stack skill.**
