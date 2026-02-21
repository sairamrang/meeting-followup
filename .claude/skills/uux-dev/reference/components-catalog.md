# Temenos UUX Design System - Start Here

> **For Building UUX Screens:** Start with the [Component Catalog](#-component-catalog) below. All 58 UUX components have the design system built-in.
>
> **For Custom Elements:** Reference the [Design System Documentation](#-design-system-documentation) when building elements outside the UUX component library.

---

## 🎯 Component Catalog

### Quick Start for Building UUX Screens

**Follow these steps:**

1. **Find your components** → Browse the [Component Categories](#component-categories) or [Component Summary Table](#component-summary-table) below
2. **Get implementation code** → Open the relevant category file with full code examples:
   - Forms? → [form-inputs.md](components/form-inputs.md)
   - Buttons? → [buttons-actions.md](components/buttons-actions.md)
   - Tables/Charts? → [data-display.md](components/data-display.md)
   - Cards/Dialogs? → [layout-containers.md](components/layout-containers.md)
   - Navigation? → [navigation.md](components/navigation.md)
   - Date/Time? → [date-time.md](components/date-time.md)
   - Notifications? → [feedback-status.md](components/feedback-status.md)
   - Enterprise? → [specialized-enterprise.md](components/specialized-enterprise.md)
3. **Copy & customize** → All components include ready-to-use HTML code examples

### Component Categories

**58 production-ready web components** organized into 8 categories:

- **[Form Inputs](components/form-inputs.md)** (14): Text fields, selects, checkboxes, date pickers
- **[Date & Time](components/date-time.md)** (7): Advanced date/period pickers for financial apps
- **[Navigation](components/navigation.md)** (4): Navigation rail, breadcrumbs, tabs, menus
- **[Data Display](components/data-display.md)** (8): Tables, trees, charts, dashboards
- **[Feedback & Status](components/feedback-status.md)** (6): Tooltips, notifications, progress, badges
- **[Layout & Containers](components/layout-containers.md)** (7): Cards, dialogs, drawers, forms
- **[Buttons & Actions](components/buttons-actions.md)** (4): Buttons, icon buttons, toggles, chips
- **[Specialized](components/specialized-enterprise.md)** (8): Hierarchies, chatbot, file drag-drop

**See:** [components/index.md](components/index.md) for complete catalog with detailed descriptions

### Component Summary Table

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

---

## 📋 Quick Reference

### Essential Values

| Concept | Value | Token |
|---------|-------|-------|
| **Grid Unit** | 8px | `--uwc-grid-unit` |
| **Primary Color** | #4A5798 | `--uwc-color-brand-primary` |
| **Body Text Size** | 14px | `--uwc-font-size-body` |
| **Body Text Color** | #3B3B3B | `--uwc-color-gray-dark` |
| **Gutter Width** | 24px (3G) | `--uwc-layout-gutter` |
| **Container Padding (Standard)** | 24px (3G) | `--uwc-layout-padding-standard` |
| **Input Height (Standard)** | 56px | `--uwc-input-height-standard` |
| **Button Height (Standard)** | 48px | `--uwc-button-height-standard` |
| **Min Contrast Ratio** | 4.5:1 | N/A |
| **Touch Target Min** | 40×40px | `--uwc-touch-target-min` |

### Common Spacing

| Spacing | Pixels | Grid Units | Token |
|---------|--------|------------|-------|
| Tight | 8px | 1G | `--uwc-spacing-1` |
| Medium | 16px | 2G | `--uwc-spacing-2` |
| Generous | 24px | 3G | `--uwc-spacing-3` |
| Large | 32px | 4G | `--uwc-spacing-4` |

### Component Density Modes

All components support two density modes:
- **Standard** (desktop): 56px input height, 48px button height, 8px spacing units
- **Compact** (mobile/tablet): 40px input height, 40px button height, 6px spacing units

---

## 📖 Common UUX Patterns

### Building a Form

```html
<uwc-form>
  <uwc-text-field label="Email" type="email" required></uwc-text-field>
  <uwc-amount-field label="Amount" currency="USD" required></uwc-amount-field>
  <uwc-date-picker label="Date" required></uwc-date-picker>
  <uwc-button variant="filled" type="submit">Submit</uwc-button>
</uwc-form>
```

### Card Layout

```html
<uwc-card>
  <h2 slot="header">Card Title</h2>
  <!-- Card content -->
  <div slot="actions">
    <uwc-button variant="outlined">Cancel</uwc-button>
    <uwc-button variant="filled">Save</uwc-button>
  </div>
</uwc-card>
```

### Data Table with Actions

```html
<uwc-flex-table
  data="..."
  columns="..."
  sortable
  filterable
  paginated>
</uwc-flex-table>
```

### Navigation Structure

```html
<uwc-navigation-rail>
  <uwc-navigation-rail-item icon="home" label="Home"></uwc-navigation-rail-item>
  <uwc-navigation-rail-item icon="dashboard" label="Dashboard"></uwc-navigation-rail-item>
</uwc-navigation-rail>
```

### Button Group Pattern

```html
<div class="button-group">
  <uwc-button variant="outlined">Cancel</uwc-button>
  <uwc-button variant="filled">Save</uwc-button>
</div>
```

---

## 📐 Design System Documentation

**Use when:** Building custom elements outside the UUX component library, or needing to understand design principles and foundations.

**Note:** UUX components already implement these design system rules internally. Reference these files only when creating custom elements or styling outside the component library.

### Core Documentation Files

| File | Content | When to Use |
|------|---------|-------------|
| **[01-overview.md](foundations/01-overview.md)** | Design philosophy, principles, and foundation | Understanding the "why" behind design decisions |
| **[02-colors.md](foundations/02-colors.md)** | Color palettes, hex values, and design tokens | Choosing colors for custom UI elements and states |
| **[03-typography.md](foundations/03-typography.md)** | Type scale, hierarchy, and text styles | Styling custom text outside components |
| **[04-layout-spacing.md](foundations/04-layout-spacing.md)** | Grid system, spacing rules, Golden Form | Laying out pages and custom containers |
| **[05-components.md](foundations/05-components.md)** | Component guidelines, sizing, and states | Understanding component behavior and states |
| **[06-accessibility.md](foundations/06-accessibility.md)** | WCAG 2.2 AA compliance and testing | Ensuring custom elements are accessible |
| **[07-design-tokens.md](foundations/07-design-tokens.md)** | CSS custom properties reference | Implementing custom designs with design tokens |

### Key Design System Concepts

#### Color System

**Blue is at the heart of Temenos.** The color system includes:
- **Temenos Palette** (Primary brand blue): #2C3361, #293276, **#4A5798**, #C9D9F2, #EBF3FF
- **Grayscale Palette**: Black to white in 5 steps
- **Status Palettes**: Green (positive), Red (negative), Orange (notice)
- **Categorical Palette**: 8 colors for data visualization

**See:** [02-colors.md](foundations/02-colors.md)

#### Grid System

**12-column responsive layout** with:
- **Grid Units:** 1G = 8px (baseline for all spacing)
- **Gutters:** 3G (24px) between columns
- **Container Padding:** 3G (standard) or 2G (compact)
- **Two Densities:** Standard (desktop) and Compact (mobile)

**See:** [04-layout-spacing.md](foundations/04-layout-spacing.md)

#### Typography Hierarchy

**9 text style levels** from H1 (34px) to Small (12px):
1. Page Heading (H1 Emphasis) - 34px
2. Page Sub-heading (H1) - 24px
3. Card Group Title (H2 Emphasis) - 20px
4. Card Title (H2) - 20px
5. Section Title (H3 Emphasis) - 16px
6. Section Sub-heading (H3) - 16px
7. Large Text - 16px
8. Body Text - 14px (most common)
9. Small Text/Caption - 12px

**See:** [03-typography.md](foundations/03-typography.md)

#### Design Tokens

Use CSS custom properties for all design values:
```css
color: var(--uwc-color-brand-primary);
padding: var(--uwc-spacing-3);
font-size: var(--uwc-font-size-body);
```

**See:** [07-design-tokens.md](foundations/07-design-tokens.md)

#### Design Principles

Four core principles guide all UUX design decisions:

1. **Simple and Progressive** - Concise, unambiguous design with progressive disclosure
2. **Power to Cut Through** - Balance speed, familiarity, and technical capability
3. **User Needs Before Solutions** - Meet customers where they are
4. **Aesthetics with a Purpose** - Form and function work together

**See:** [01-overview.md](foundations/01-overview.md) for detailed explanations

#### Accessibility

All UUX components target **WCAG 2.2 AA compliance** as a minimum standard:
- **Color Contrast:** Minimum 4.5:1 for standard text, 3:1 for large text
- **Keyboard Navigation:** All components fully keyboard accessible
- **Touch Targets:** Minimum 40px × 40px (48px recommended)
- **Focus Indicators:** Always visible 2px outline

**See:** [06-accessibility.md](foundations/06-accessibility.md)

---

## 🖼️ Visual Reference Assets

Reference images are available in the `assets/` directory:

**Color Palettes** (`assets/color-palettes/`)
- Temenos palette (light theme)
- Grayscale palette
- Status palettes (positive, negative, notice)
- Categorical palette
- Contrast check examples

**Typography** (`assets/typography/`)
- Typography hierarchy chart
- Text contrast examples

**Layout** (`assets/layout/`)
- Grid layout examples (columns, gutters, padding)
- Component spacing diagrams

---

## 🔄 Using This Documentation with Claude Code

When building with Claude Code, mention the appropriate files:

**For Building UUX Screens:**
- "Create a login form using UUX components"
- "Build a data table with uwc-flex-table from the component catalog"
- "Use the form-inputs component documentation"
- "Follow the button patterns from buttons-actions.md"

**For Custom Elements:**
- "Use the Temenos color palette from foundations/02-colors.md"
- "Follow the grid system in foundations/04-layout-spacing.md"
- "Apply design tokens from foundations/07-design-tokens.md"
- "Ensure this meets the accessibility guidelines in foundations/06-accessibility.md"

---

## 🛠️ Tools and Resources

### Recommended Tools

- **Color Contrast:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility Testing:** [AXE DevTools](https://www.deque.com/axe/devtools/)
- **CSS Grid:** Browser DevTools
- **Design Tokens:** CSS Custom Properties

### External References

- [Temenos UUX Documentation](https://developer.temenos.com/uux/)
- [Component API Reference](https://developer.temenos.com/uux/api/)
- [Material Design](https://material.io/design) - Foundation of UUX design system
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Web Content Accessibility Guidelines

---

## 📝 Document Status

**Version:** 1.0
**Last Updated:** 2025
**Source:** Extracted from Temenos UUX official documentation
**Extracted by:** Claude Code

**Completeness:**
- ✅ All 5 design pages processed
- ✅ Complete 58-component catalog with code examples
- ✅ Color values, typography, layout system documented
- ✅ Component guidelines included
- ✅ Accessibility requirements documented
- ✅ Design tokens compiled

---

## 🤝 Contributing

This documentation is a reference extracted from the official Temenos UUX design system. For updates or corrections:

1. Verify against [official Temenos UUX documentation](https://developer.temenos.com/uux/docs/design/design-system)
2. Update relevant markdown files
3. Maintain consistency with design token naming
4. Keep examples clear and actionable

---

## 📞 Support

For questions about the UUX design system:
- **Official Documentation:** https://developer.temenos.com/uux/docs/design/design-system
- **Developer Portal:** https://developer.temenos.com/
- **Community:** https://basecamp.temenos.com/s/

---

**Happy designing! 🎨**

Build beautiful, accessible, and consistent Temenos experiences with confidence.
