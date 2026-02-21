# Interaction Design Patterns

## Overview

Interaction design defines how users interact with a system. This document covers universal patterns applicable to any design system.

---

## Affordances and Signifiers

### Affordances

What an object allows you to do.

| Element | Affordance |
|---------|------------|
| Button | Can be pressed |
| Link | Can be followed |
| Input field | Can receive text |
| Slider | Can be dragged |
| Checkbox | Can be toggled |

### Signifiers

Visual cues that indicate affordances.

| Signifier | Indicates |
|-----------|-----------|
| Raised/shadowed button | Pressable |
| Underlined text | Clickable link |
| Blinking cursor | Text input ready |
| Grab handle | Draggable |
| Empty checkbox | Toggle available |

**Rule:** Every interactive element should have clear signifiers.

---

## Feedback Patterns

### Immediate Feedback

Every user action should have visible feedback.

| Action | Feedback |
|--------|----------|
| Hover | Visual change (color, shadow) |
| Click/tap | Press state, ripple effect |
| Focus | Focus ring/outline |
| Input | Character appears |
| Selection | Highlight, checkmark |

### System Feedback

Communicate system status to users.

| Status | Feedback Pattern |
|--------|------------------|
| Loading | Spinner, skeleton, progress bar |
| Success | Check mark, green color, toast |
| Error | Red color, icon, message |
| Warning | Yellow/orange, caution icon |
| Processing | Disabled state, loading indicator |

### Feedback Timing

| Type | Response Time | User Perception |
|------|---------------|-----------------|
| Instant | <100ms | Feels immediate |
| Fast | 100ms-300ms | Acceptable |
| Medium | 300ms-1s | Noticeable delay |
| Slow | 1s-10s | Need progress indicator |
| Long | >10s | Need progress + time estimate |

---

## State Management

### Component States

Every interactive component should handle these states:

1. **Default** - Normal, resting state
2. **Hover** - Mouse over (desktop)
3. **Focus** - Keyboard focus
4. **Active/Pressed** - During interaction
5. **Selected** - Currently chosen
6. **Disabled** - Cannot interact
7. **Error** - Invalid state
8. **Loading** - Processing

### State Combinations

| State | Visual Treatment |
|-------|------------------|
| Default | Base styling |
| Hover | Lighter/darker background, shadow |
| Focus | Outline ring (2px+) |
| Active | Pressed appearance, darker |
| Disabled | Reduced opacity (0.4-0.6), cursor: not-allowed |
| Error | Red border, error icon |
| Loading | Spinner overlay, pulsing |

---

## Progressive Disclosure

**Show users only what they need, when they need it.**

### Techniques

| Technique | Use When |
|-----------|----------|
| Expandable sections | Additional details available |
| "Show more" | Long lists or content |
| Tooltips | Brief contextual help |
| Modals | Focused sub-tasks |
| Steppers | Multi-step processes |
| Mega menus | Complex navigation |

### Examples

```
Level 1: Summary view (always visible)
Level 2: Expandable details (click to reveal)
Level 3: Modal/drawer (focused interaction)
Level 4: New page (separate context)
```

---

## Error Handling Patterns

### Prevention vs. Recovery

| Strategy | Example |
|----------|---------|
| **Prevention** | Disable submit until form valid |
| **Early warning** | Real-time validation |
| **Confirmation** | "Are you sure?" for destructive actions |
| **Recovery** | Undo option after action |

### Error Message Anatomy

Good error messages include:

1. **What happened** - Clear description
2. **Why it happened** - If helpful
3. **How to fix it** - Specific guidance
4. **Where it happened** - Visual indication

```
✅ "Email is invalid. Enter a valid email like name@example.com"
❌ "Invalid input"
```

### Error Placement

| Error Type | Placement |
|------------|-----------|
| Field error | Below/beside the field |
| Form error | Top of form (summary) |
| System error | Modal or toast |
| Page error | Error page with recovery options |

---

## Loading Patterns

### When to Use Each

| Pattern | Best For |
|---------|----------|
| **Spinner** | Brief waits (<3 seconds) |
| **Progress bar** | Determinate progress (file upload) |
| **Skeleton** | Content loading (preserves layout) |
| **Optimistic UI** | Fast operations (instant feedback) |
| **Background loading** | Non-blocking operations |

### Loading States Checklist

- [ ] Show loading indicator immediately (<100ms)
- [ ] Indicate what's loading if not obvious
- [ ] Show progress if determinate
- [ ] Provide cancel option for long operations
- [ ] Handle timeout gracefully
- [ ] Show error state if failed

---

## Navigation Patterns

### Primary Navigation

| Pattern | Use When |
|---------|----------|
| Top navbar | Standard web apps |
| Side navbar | Complex dashboards, many sections |
| Bottom navbar | Mobile apps, <5 items |
| Hamburger menu | Mobile, space-constrained |
| Tab bar | Related content sections |

### Secondary Navigation

| Pattern | Use When |
|---------|----------|
| Breadcrumbs | Deep hierarchies |
| Tabs | Related views of same data |
| Pagination | Long lists |
| Jump links | Long single pages |

### Navigation Principles

1. **Current location clear** - User always knows where they are
2. **Available paths visible** - Clear next steps
3. **Consistent placement** - Same location across pages
4. **Keyboard accessible** - Tab through all nav items
5. **Skip links available** - Bypass repeated nav

---

## Form Patterns

### Input Patterns

| Input Type | Use When |
|------------|----------|
| Text field | Free-form text |
| Text area | Multi-line text |
| Select | 4-7 predefined options |
| Radio buttons | 2-4 mutually exclusive options |
| Checkboxes | Multiple selections allowed |
| Toggle/switch | Binary on/off |
| Date picker | Date selection |
| Autocomplete | Many options, searchable |

### Form Layout

| Pattern | Use When |
|---------|----------|
| Single column | Mobile, simple forms |
| Two column | Desktop, related field pairs |
| Inline | Compact, editing in place |
| Multi-step | Complex, long forms |

### Validation Patterns

| Type | When | Example |
|------|------|---------|
| Inline | On blur/change | Email format check |
| On submit | Form submission | All required fields |
| Real-time | As user types | Password strength |
| Server-side | After submit | Username availability |

---

## Modal/Dialog Patterns

### When to Use Modals

✅ **Use for:**
- Confirmation of destructive actions
- Focused data entry (edit, create)
- Important alerts requiring action
- Previews (image, document)

❌ **Avoid for:**
- Error messages (use inline)
- Long forms (use page)
- Complex flows (use page/stepper)
- Non-critical information (use toast)

### Modal Best Practices

1. **Clear title** - What this modal is for
2. **Focused content** - Single purpose
3. **Clear actions** - Primary and secondary buttons
4. **Easy dismissal** - X button, click outside, Escape key
5. **Focus management** - Trap focus, return focus on close
6. **Accessible** - Screen reader announces

---

## Responsive Patterns

### Touch vs. Click

| | Click (Desktop) | Touch (Mobile) |
|---|-----------------|----------------|
| Target size | 24px minimum | 44px minimum |
| Hover | Available | Not available |
| Precision | High | Lower |
| Gestures | Click, double-click | Tap, swipe, pinch |

### Adaptation Strategies

| Strategy | Example |
|----------|---------|
| Reflow | Columns → stacked |
| Hide | Sidebar → hamburger |
| Relocate | Top nav → bottom nav |
| Resize | Smaller text, images |
| Replace | Hover tooltip → tap tooltip |

---

## Microinteractions

Small interactions that enhance the experience.

### Examples

| Interaction | Enhancement |
|-------------|-------------|
| Like button | Heart fills with animation |
| Pull to refresh | Animated indicator |
| Swipe to delete | Item slides away |
| Toggle | Smooth on/off animation |
| Submit | Button transforms to checkmark |

### Principles

1. **Purpose** - Every microinteraction has a reason
2. **Subtlety** - Enhance, don't distract
3. **Brevity** - Quick, not prolonged
4. **Consistency** - Same interaction, same result
5. **Reducible** - Respect prefers-reduced-motion

---

## Resources

- [Laws of UX](https://lawsofux.com/)
- [Material Design Interaction](https://material.io/design/interaction)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Microinteractions by Dan Saffer](https://microinteractions.com/)
