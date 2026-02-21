# Temenos UUX Component Catalog

This catalog documents all 58 components in the Temenos Unified UX (UUX) web component library.

## Overview

Temenos UUX provides a comprehensive set of enterprise-grade web components built on Lit and Material Web Components. All components follow the UUX design system principles and provide two density modes for optimal device adaptation.

### Installation

**Via CDN:**
```html
<script type="module" src="https://developer.temenos.com/uux/unified-ux-web.min.js"></script>
<link rel="stylesheet" href="https://developer.temenos.com/uux/base.css">
```

**Via npm:**
```bash
npm install @unified-ux/web
```

### Density Modes

All components support two density modes:
- **Standard** (desktop): 56px input height, 8px spacing units
- **Compact** (mobile/tablet): 40px input height, 6px spacing units

### Component Categories

Components are organized into 8 functional categories:

## Component Categories

### [Form Inputs](form-inputs.md)
14 components for data entry and user input
- Text Field, Text Area, Select, Autocomplete, Combobox
- Checkbox, Checkbox Group, Radio Group, Switch
- Date Picker, Date Calendar, Amount Field, File Upload

### [Date & Time Components](date-time.md)
7 advanced date/time selection components for complex temporal scenarios
- Date Range Picker, Date Relative Picker, Date Frequency Picker
- Date Recurrence Picker, Date Period Picker, Date Multi-Period Picker
- Period Combobox

### [Navigation](navigation.md)
4 components for application navigation and wayfinding
- Navigation Rail, Breadcrumbs, Tab Bar, Menu Button

### [Data Display](data-display.md)
8 components for presenting structured data and visualizations
- Flex Table, Tree, List, Grid
- Chart (HighCharts), Dashboard, Code Editor

### [Feedback & Status](feedback-status.md)
6 components for user feedback, notifications, and progress indication
- Tooltip, Notifications Panel, Linear Progress
- Badge, Error Summary, Stepper

### [Layout & Containers](layout-containers.md)
7 components for page structure and content organization
- Card, Expandable Card, Expansion Panel
- Dialog, Drawer, Form, Context Menu

### [Buttons & Actions](buttons-actions.md)
4 components for user actions and selections
- Button, Icon Button, Button Toggle, Chip Group

### [Specialized & Enterprise](specialized-enterprise.md)
8 domain-specific components for financial services and enterprise applications
- Hierarchy Field, Hierarchy Control, Compact Flagset
- File Drag-Drop Area, Chatbot, Chart, Dashboard

## Component Summary Table

| Component | Tag | Category | Key Use Case |
|-----------|-----|----------|--------------|
| Text Field | `<uwc-text-field>` | Form Inputs | Single-line text input |
| Text Area | `<uwc-text-area>` | Form Inputs | Multi-line text input |
| Text | `<uwc-text>` | Form Inputs | Read-only formatted text |
| Select | `<uwc-select>` | Form Inputs | Dropdown selection |
| Autocomplete | `<uwc-autocomplete>` | Form Inputs | Searchable dropdown with filtering |
| Combobox | `<uwc-combobox>` | Form Inputs | Select with custom input |
| Checkbox | `<uwc-checkbox>` | Form Inputs | Single binary choice |
| Checkbox Group | `<uwc-checkbox-group>` | Form Inputs | Multiple selection |
| Radio Group | `<uwc-radio-group>` | Form Inputs | Single selection from options |
| Switch | `<uwc-switch>` | Form Inputs | Toggle on/off |
| Date Picker | `<uwc-date-picker>` | Form Inputs | Simple date selection |
| Date Calendar | `<uwc-date-calendar>` | Form Inputs | Inline calendar |
| Amount Field | `<uwc-amount-field>` | Form Inputs | Currency input with formatting |
| File Upload | `<uwc-file-upload>` | Form Inputs | File selection button |
| Date Range Picker | `<uwc-date-range-picker>` | Date & Time | Start and end date selection |
| Date Relative Picker | `<uwc-date-relative-picker>` | Date & Time | Fixed or relative dates |
| Date Frequency Picker | `<uwc-date-frequency-picker>` | Date & Time | Recurring date patterns |
| Date Recurrence Picker | `<uwc-date-recurrence-picker>` | Date & Time | Complex recurrence rules |
| Date Period Picker | `<uwc-date-period-picker>` | Date & Time | Event period definition |
| Date Multi-Period Picker | `<uwc-date-multi-period-picker>` | Date & Time | Multiple non-contiguous periods |
| Period Combobox | `<uwc-period-combobox>` | Date & Time | Quick period selection |
| Navigation Rail | `<uwc-navigation-rail>` | Navigation | Vertical sidebar navigation |
| Breadcrumbs | `<uwc-breadcrumbs>` | Navigation | Hierarchical location indicator |
| Tab Bar | `<uwc-tab-bar>` | Navigation | Horizontal content tabs |
| Menu Button | `<uwc-menu-button>` | Navigation | Button with dropdown menu |
| Table | `<uwc-table>` | Data Display | Basic table (deprecated) |
| Flex Table | `<uwc-flex-table>` | Data Display | Advanced data table |
| Tree | `<uwc-tree>` | Data Display | Hierarchical data structure |
| List | `<uwc-list>` | Data Display | Simple item lists |
| Grid | `<uwc-grid>` | Data Display | Card-based grid layout |
| Chart | `<uwc-chart>` | Data Display | Data visualizations |
| Dashboard | `<uwc-dashboard>` | Data Display | Configurable dashboard layout |
| Code Editor | `<uwc-code-editor>` | Data Display | Syntax-highlighted code |
| Tooltip | `<uwc-tooltip>` | Feedback & Status | Contextual help text |
| Notifications Panel | `<uwc-notifications-panel>` | Feedback & Status | Alert/notification center |
| Linear Progress | `<uwc-linear-progress>` | Feedback & Status | Progress indicator |
| Badge | `<uwc-badge>` | Feedback & Status | Status/count indicator |
| Error Summary | `<uwc-error-summary>` | Feedback & Status | Form error aggregation |
| Stepper | `<uwc-stepper>` | Feedback & Status | Multi-step process indicator |
| Card | `<uwc-card>` | Layout & Containers | Content container |
| Expandable Card | `<uwc-expandable-card>` | Layout & Containers | Collapsible card |
| Expansion Panel | `<uwc-expansion-panel>` | Layout & Containers | Accordion panel |
| Dialog | `<uwc-dialog>` | Layout & Containers | Modal overlay |
| Drawer | `<uwc-drawer>` | Layout & Containers | Slide-in side panel |
| Form | `<uwc-form>` | Layout & Containers | Form container with validation |
| Context Menu | `<uwc-context-menu>` | Layout & Containers | Right-click menu |
| Button | `<uwc-button>` | Buttons & Actions | Primary action button |
| Icon Button | `<uwc-icon-button>` | Buttons & Actions | Icon-only button |
| Button Toggle | `<uwc-button-toggle>` | Buttons & Actions | Toggle button group |
| Chip Group | `<uwc-chip-group>` | Buttons & Actions | Tag/filter selection |
| Hierarchy Field | `<uwc-hierarchy-field>` | Specialized | Organizational hierarchy input |
| Hierarchy Control | `<uwc-hierarchy-control>` | Specialized | Hierarchy tree viewer |
| Compact Flagset | `<uwc-compact-flagset>` | Specialized | Multi-flag display |
| File Drag-Drop Area | `<uwc-file-dragdrop-area>` | Specialized | Drag-and-drop file upload |
| Chatbot | `<uwc-chatbot>` | Specialized | AI chat interface |

## Quick Reference

### Common Patterns

**Form with validation:**
```html
<uwc-form>
  <uwc-text-field label="Email" type="email" required></uwc-text-field>
  <uwc-amount-field label="Amount" currency="USD" required></uwc-amount-field>
  <uwc-date-picker label="Date" required></uwc-date-picker>
  <uwc-button type="submit">Submit</uwc-button>
</uwc-form>
```

**Data table with actions:**
```html
<uwc-flex-table
  data="..."
  columns="..."
  sortable
  filterable
  paginated>
</uwc-flex-table>
```

**Navigation structure:**
```html
<uwc-navigation-rail>
  <uwc-navigation-rail-item icon="home" label="Home"></uwc-navigation-rail-item>
  <uwc-navigation-rail-item icon="dashboard" label="Dashboard"></uwc-navigation-rail-item>
</uwc-navigation-rail>
```

## Best Practices

1. **Use appropriate density**: Standard for desktop, Compact for mobile/tablet
2. **Consistent validation**: Use `required`, `validationMessage` properties consistently
3. **Date component selection**: Choose the right date component for your temporal scenario
4. **Accessibility**: Always provide labels and aria attributes
5. **Performance**: Use virtual scrolling for large tables/lists
6. **Theming**: Override CSS custom properties for brand consistency

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 12+
- Chrome Mobile: Latest 2 versions

## Additional Resources

- [UUX Design System Documentation](https://developer.temenos.com/uux/)
- [Component API Reference](https://developer.temenos.com/uux/api/)
- [Design Tokens Reference](../foundations/07-design-tokens.md)
- [Accessibility Guidelines](../foundations/06-accessibility.md)

## Notes

- **Chart and Chatbot bundles**: Separate from core bundle, loaded independently
- **HighCharts license**: Required for `uwc-chart` component usage
- **Material Web Components**: Base dependency (note: deprecated by Google in 2023)
- **Versioning**: Uses YYYY.MM.NN format (non-standard)
