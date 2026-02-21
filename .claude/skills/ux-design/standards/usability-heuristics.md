# Usability Heuristics

## Nielsen's 10 Usability Heuristics

A comprehensive guide to evaluating user interface designs.

---

## 1. Visibility of System Status

**Keep users informed about what is going on through appropriate feedback within reasonable time.**

### Good Practices
- Show loading indicators for async operations
- Display progress bars for multi-step processes
- Confirm actions with success/error messages
- Show current location in navigation
- Indicate selected/active states

### Examples
```
✅ "Saving..." → "Saved successfully"
✅ Progress bar showing "Step 2 of 4"
✅ Current nav item highlighted
✅ "3 items selected" indicator

❌ Button clicked, nothing happens for 5 seconds
❌ Form submitted with no confirmation
❌ User doesn't know which page they're on
```

---

## 2. Match Between System and Real World

**Use familiar language, concepts, and conventions from the user's world.**

### Good Practices
- Use everyday language, not technical jargon
- Follow real-world conventions (calendar months, currency formats)
- Use familiar icons and metaphors
- Organize information logically for users

### Examples
```
✅ "Save" not "Persist to database"
✅ "Shopping cart" metaphor for e-commerce
✅ Calendar shows days like a physical calendar
✅ Trash can icon for delete

❌ Technical error: "SQLException: null pointer"
❌ "Submit query" instead of "Search"
❌ Unfamiliar icons without labels
```

---

## 3. User Control and Freedom

**Provide ways to undo, redo, and exit from unwanted states.**

### Good Practices
- Undo/redo functionality
- Clear "Cancel" and "Back" options
- Easy way to exit modals and wizards
- Ability to edit before final submission
- Don't auto-save without warning

### Examples
```
✅ "Undo" option after deletion
✅ "Cancel" button on all forms
✅ "X" to close modals
✅ "Edit" option before payment confirmation

❌ No way to cancel a long process
❌ Deleted item gone forever
❌ Can't go back in a wizard
```

---

## 4. Consistency and Standards

**Follow platform conventions and maintain internal consistency.**

### Good Practices
- Use consistent terminology throughout
- Same actions should have same results
- Follow platform UI conventions
- Consistent visual design (colors, spacing, fonts)
- Predictable component behavior

### Examples
```
✅ "Save" button always in same position
✅ Same date format throughout app
✅ Links always same color
✅ Primary action always on the right

❌ "Submit" on one form, "Send" on another
❌ Different button styles for same action
❌ Inconsistent navigation placement
```

---

## 5. Error Prevention

**Design to prevent problems from occurring in the first place.**

### Good Practices
- Validate input in real-time
- Use constraints (date pickers instead of free text)
- Confirm destructive actions
- Disable invalid options
- Provide clear defaults

### Examples
```
✅ Date picker prevents invalid dates
✅ "Are you sure you want to delete?"
✅ Disable "Submit" until form is valid
✅ Auto-format phone numbers

❌ Free text date entry
❌ Delete without confirmation
❌ Allow impossible selections
```

---

## 6. Recognition Rather Than Recall

**Minimize memory load by making objects, actions, and options visible.**

### Good Practices
- Show recently used items
- Provide autocomplete suggestions
- Display available options (don't hide in menus)
- Include helpful placeholders and examples
- Use persistent navigation

### Examples
```
✅ "Recently viewed" section
✅ Autocomplete in search
✅ Clear labels on all buttons
✅ Placeholder: "e.g., john@example.com"

❌ Users must remember keyboard shortcuts
❌ Important options hidden in deep menus
❌ Unlabeled icon buttons
```

---

## 7. Flexibility and Efficiency of Use

**Provide accelerators for expert users while still supporting novices.**

### Good Practices
- Keyboard shortcuts for common actions
- Customizable interface
- Frequently used items easily accessible
- Batch operations for power users
- Progressive disclosure

### Examples
```
✅ Ctrl+S to save
✅ Customizable dashboard
✅ "Quick actions" menu
✅ Bulk select and delete

❌ Only mouse interaction available
❌ Same interface for all user levels
❌ No shortcuts for frequent actions
```

---

## 8. Aesthetic and Minimalist Design

**Remove unnecessary elements that compete for attention.**

### Good Practices
- Show only relevant information
- Prioritize primary actions
- Use whitespace effectively
- Progressive disclosure for complexity
- Clear visual hierarchy

### Examples
```
✅ Single clear primary action per screen
✅ Expandable sections for details
✅ Clean, uncluttered layout
✅ Important info most prominent

❌ Too many CTAs competing for attention
❌ Dense walls of text
❌ Every option visible at once
```

---

## 9. Help Users Recognize, Diagnose, and Recover from Errors

**Error messages should be clear, constructive, and suggest solutions.**

### Good Practices
- Plain language error messages
- Explain what went wrong
- Suggest how to fix it
- Don't blame the user
- Position errors near the problem

### Examples
```
✅ "Email address is invalid. Please enter a valid email like name@example.com"
✅ Error message next to the field
✅ "No results found. Try different search terms"

❌ "Error 500"
❌ "Invalid input"
❌ Error at top of page, far from field
```

---

## 10. Help and Documentation

**Provide easily searchable documentation focused on user tasks.**

### Good Practices
- Searchable help content
- Context-sensitive help (tooltips, inline help)
- Step-by-step guides for complex tasks
- FAQ section
- Easy to access from any page

### Examples
```
✅ "?" icon with tooltip explanation
✅ Inline help text under complex fields
✅ Getting started tutorial
✅ Search in help documentation

❌ No help at all
❌ Help only in external documentation
❌ Jargon-filled help content
```

---

## Heuristic Evaluation Worksheet

### Rating Scale
- **0** - Not a usability problem
- **1** - Cosmetic problem only
- **2** - Minor usability problem
- **3** - Major usability problem
- **4** - Usability catastrophe

### Evaluation Template

| # | Heuristic | Rating | Issue | Recommendation |
|---|-----------|--------|-------|----------------|
| 1 | Visibility of system status | 0-4 | | |
| 2 | Match with real world | 0-4 | | |
| 3 | User control and freedom | 0-4 | | |
| 4 | Consistency and standards | 0-4 | | |
| 5 | Error prevention | 0-4 | | |
| 6 | Recognition over recall | 0-4 | | |
| 7 | Flexibility and efficiency | 0-4 | | |
| 8 | Aesthetic and minimalist | 0-4 | | |
| 9 | Error recovery | 0-4 | | |
| 10 | Help and documentation | 0-4 | | |

---

## Resources

- [Nielsen Norman Group - 10 Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Severity Ratings for Usability Problems](https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/)
- [How to Conduct a Heuristic Evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
