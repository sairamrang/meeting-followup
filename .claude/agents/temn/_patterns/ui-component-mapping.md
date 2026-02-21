# UI Component Mapping Pattern

> **Shared reference for mapping requirements to UI components**

---

## Quick Reference Table

| Requirement Type | Suggested Components |
|-----------------|---------------------|
| Simple form | Text fields, selects, buttons, form container |
| Amount entry | Amount field (currency formatting) |
| Date selection | Date picker, date range picker |
| Recurring schedule | Frequency picker, recurrence picker |
| Multi-step form | Stepper (wizard pattern) |
| Multiple selection | Checkbox group, radio group, chip group |
| Data table | Data table (sort, filter, paginate, export) |
| Hierarchical data | Tree, hierarchy control |
| Charts | Chart components (bar, line, pie, etc.) |
| Dashboard | Dashboard layout (draggable widgets) |
| Simple lists | List, grid |
| App navigation | Navigation rail (side nav) |
| Page sections | Tab bar, expansion panel |
| Breadcrumbs | Breadcrumb component |
| Menus | Menu button, context menu |
| Cards | Card, expandable card |
| Modal dialogs | Dialog (confirmations, forms) |
| Side panels | Drawer (additional content) |
| Progress | Progress indicator, stepper |
| Notifications | Notification panel, toast |
| Status | Badge, status flag |
| Help text | Tooltip |
| Form errors | Error summary |
| File upload | File drag-drop area |
| Org structure | Hierarchy field |
| AI assistant | Chatbot component |
| Search | Autocomplete |

---

## By Category

### Forms & Data Entry
- **Simple forms**: Text fields, selects, buttons, form containers
- **Amount entry**: Amount fields with currency formatting
- **Date selection**: Date pickers, date range pickers
- **Recurring schedules**: Frequency pickers, recurrence pickers
- **Multi-step forms**: Steppers (wizard pattern)
- **Selection groups**: Checkbox groups, radio groups, chip groups

### Data Display
- **Tables**: Data tables with sorting, filtering, pagination, export
- **Hierarchical data**: Trees, hierarchy controls
- **Charts & analytics**: Various chart types
- **Dashboards**: Dashboard layouts with draggable widgets
- **Simple lists**: Lists, grids

### Navigation
- **App navigation**: Navigation rails (side navigation)
- **Page sections**: Tab bars, expansion panels
- **Breadcrumbs**: Breadcrumb components
- **Menus**: Menu buttons, context menus

### Layout & Containers
- **Cards**: Cards, expandable cards
- **Modals**: Dialogs for confirmations and forms
- **Side panels**: Drawers for additional content
- **Forms**: Form containers with validation

### Feedback & Status
- **Progress**: Progress indicators, steppers
- **Notifications**: Notification panels, toasts
- **Indicators**: Badges, status flags
- **Tooltips**: Help text
- **Errors**: Error summaries for forms

### Specialized
- **File upload**: File drag-drop areas
- **Account hierarchy**: Hierarchy fields for org structures
- **AI chatbot**: Chatbot components
- **Autocomplete**: Search with suggestions

---

## Component Selection Decision Tree

```
Need to display data?
├── Single record → Card
├── Multiple records
│   ├── Simple list → List/Grid
│   ├── Needs sort/filter → Data Table
│   └── Hierarchical → Tree
└── Analytics → Chart

Need user input?
├── Single value
│   ├── Text → Text Field
│   ├── Date → Date Picker
│   ├── Amount → Amount Field
│   └── Selection → Select/Radio
├── Multiple values
│   ├── Same type → Checkbox Group
│   └── Different types → Form
└── Multi-step → Stepper/Wizard

Need navigation?
├── App-level → Navigation Rail
├── Within page → Tabs
├── Context → Breadcrumb
└── Actions → Menu Button

Need feedback?
├── Inline → Tooltip/Badge
├── Temporary → Toast
├── Persistent → Notification Panel
└── Blocking → Dialog
```

---

## Usage Notes

1. **Read project's design system first** to understand available components
2. **Prefer standard components** over custom implementations
3. **Consider accessibility** when selecting components
4. **Match complexity** - don't use complex components for simple needs
5. **Consider mobile** - ensure components work on all devices
