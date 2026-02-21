# Keyboard Navigation Patterns

## Overview

All interactive elements must be accessible via keyboard. This document covers standard keyboard patterns for web applications.

---

## Standard Keys

### Navigation Keys

| Key | Action |
|-----|--------|
| `Tab` | Move to next focusable element |
| `Shift + Tab` | Move to previous focusable element |
| `Arrow keys` | Navigate within components (menus, tabs, grids) |
| `Home` | Jump to first item |
| `End` | Jump to last item |
| `Page Up/Down` | Scroll page |

### Activation Keys

| Key | Action |
|-----|--------|
| `Enter` | Activate focused element (button, link) |
| `Space` | Toggle (checkbox, switch), activate (button) |
| `Escape` | Close modal, cancel action, clear selection |

---

## Component Patterns

### Buttons

```
Tab → Focus button
Enter or Space → Activate button
```

### Links

```
Tab → Focus link
Enter → Follow link
```

### Checkboxes

```
Tab → Focus checkbox
Space → Toggle checked state
```

### Radio Buttons

```
Tab → Focus radio group
Arrow Up/Left → Select previous option
Arrow Down/Right → Select next option
Space → Select focused option (if not auto-select)
```

### Select/Dropdown

```
Tab → Focus select
Space/Enter/Arrow Down → Open dropdown
Arrow Up/Down → Navigate options
Enter → Select focused option
Escape → Close without selecting
Type character → Jump to matching option
```

### Text Input

```
Tab → Focus input
Type → Enter text
Ctrl/Cmd + A → Select all
Ctrl/Cmd + C/V/X → Copy/paste/cut
```

### Tabs

```
Tab → Focus tab list
Arrow Left/Right → Navigate between tabs
Enter/Space → Activate tab (if not auto-activated)
Home → First tab
End → Last tab
```

### Menu/Dropdown Menu

```
Enter/Space/Arrow Down → Open menu
Arrow Up/Down → Navigate menu items
Arrow Right → Open submenu
Arrow Left → Close submenu
Enter/Space → Activate menu item
Escape → Close menu
Type character → Jump to matching item
```

### Modal/Dialog

```
Tab → Cycles through focusable elements (trapped)
Shift + Tab → Reverse cycle
Escape → Close modal
```

### Data Table

```
Tab → Focus table (or first cell)
Arrow keys → Navigate cells
Enter → Activate cell content
Home → First cell in row
End → Last cell in row
Ctrl + Home → First cell in table
Ctrl + End → Last cell in table
```

### Accordion/Expansion Panel

```
Tab → Focus accordion header
Enter/Space → Expand/collapse panel
Arrow Up/Down → Move between headers
Home → First header
End → Last header
```

### Slider

```
Tab → Focus slider
Arrow Left/Down → Decrease value
Arrow Right/Up → Increase value
Home → Minimum value
End → Maximum value
Page Up/Down → Large increment
```

### Date Picker

```
Tab → Focus date input
Enter/Space → Open calendar
Arrow keys → Navigate days
Page Up/Down → Previous/next month
Shift + Page Up/Down → Previous/next year
Enter → Select date
Escape → Close calendar
```

---

## Focus Management

### Focus Indicators

All focusable elements MUST have visible focus indicators.

```css
/* Minimum focus style */
:focus {
  outline: 2px solid #4A5798;
  outline-offset: 2px;
}

/* Enhanced for high contrast */
:focus-visible {
  outline: 2px solid #4A5798;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(74, 87, 152, 0.25);
}
```

### Focus Order

Focus order should follow:
1. Visual/reading order (left-to-right, top-to-bottom in LTR languages)
2. Logical flow of the page
3. DOM order (avoid using tabindex > 0)

### Focus Trapping

For modals and dialogs:
1. Move focus to modal when opened
2. Tab cycles only within modal
3. Escape closes modal
4. Return focus to trigger element on close

### Skip Links

Provide skip link for keyboard users:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Later in page -->
<main id="main-content">...</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## ARIA Keyboard Patterns

### Managing Focus with roving tabindex

For composite widgets (toolbars, tab lists, menus):

```html
<div role="tablist">
  <button role="tab" tabindex="0" aria-selected="true">Tab 1</button>
  <button role="tab" tabindex="-1" aria-selected="false">Tab 2</button>
  <button role="tab" tabindex="-1" aria-selected="false">Tab 3</button>
</div>
```

- Only one item has `tabindex="0"` (the active/selected one)
- Others have `tabindex="-1"` (focusable but not in tab order)
- Arrow keys move focus and update tabindex

### aria-activedescendant

Alternative to roving tabindex:

```html
<div role="listbox" tabindex="0" aria-activedescendant="option-2">
  <div role="option" id="option-1">Option 1</div>
  <div role="option" id="option-2">Option 2</div>
  <div role="option" id="option-3">Option 3</div>
</div>
```

- Container receives focus
- `aria-activedescendant` indicates which child is "active"
- Arrow keys update `aria-activedescendant`

---

## Common Keyboard Shortcuts

### Application Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + F` | Find/search |
| `Ctrl/Cmd + /` | Toggle help |
| `?` | Show keyboard shortcuts |

### Table/List Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + A` | Select all |
| `Delete` | Delete selected |
| `Ctrl/Cmd + D` | Duplicate |
| `Ctrl/Cmd + E` | Edit selected |

---

## Testing Keyboard Accessibility

### Manual Testing

1. **Unplug your mouse** or disable trackpad
2. **Tab through entire page** - Can you reach everything?
3. **Activate everything** - Enter/Space works on all buttons?
4. **Navigate widgets** - Arrow keys work in menus, tabs?
5. **Escape modals** - Can you close all overlays?
6. **Check focus** - Is focus always visible?
7. **Check order** - Does tab order make sense?

### Checklist

- [ ] All interactive elements focusable
- [ ] Focus indicator always visible
- [ ] Tab order follows logical flow
- [ ] Can activate all buttons with Enter/Space
- [ ] Arrow keys work in composite widgets
- [ ] Escape closes modals/dropdowns
- [ ] No keyboard traps
- [ ] Skip links present
- [ ] Focus moves to modals when opened
- [ ] Focus returns when modals close

---

## Resources

- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [A11y Project Keyboard](https://www.a11yproject.com/posts/how-to-use-the-tabindex-attribute/)
