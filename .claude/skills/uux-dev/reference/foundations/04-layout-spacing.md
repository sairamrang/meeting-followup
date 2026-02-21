# Temenos UUX Design System - Layout & Spacing (Golden Form)

## Overview

The Golden Form is the foundation of the UUX layout system, illustrating how fundamental aspects like layout, typography, and color relate to each other. It provides guidelines for designing UUX-based solutions and helps developers understand how components relate to one another in terms of positioning and spacing.

**Key Principle:** Layout designs are based on a responsive layout grid system inspired by Material Design.

---

## Grid Units

All spacing in the UUX design system is defined in terms of **grid units (G)** where:

### **1G = 8 pixels**

This 8-pixel baseline grid provides a consistent spacing system throughout the design.

**Conversion Table:**

| Grid Units | Pixels |
|-----------|--------|
| 0.5G | 4px |
| 1G | 8px |
| 2G | 16px |
| 3G | 24px |
| 4G | 32px |
| 5G | 40px |
| 6G | 48px |

---

## Layout Density

Components and layouts are designed for two different density modes:

### Standard Density

**Use for:**
- Desktop applications
- Comfortable, spacious layouts
- Content-focused pages
- Users who prefer larger touch targets

**Characteristics:**
- Larger component sizes (Medium)
- More generous spacing
- 3G container padding (24px)
- Better for readability and accessibility

### Compact Density

**Use for:**
- Smaller displays (tablets, mobile)
- Dense data tables
- Complex forms with many fields
- Power users who prefer information density

**Characteristics:**
- Smaller component sizes (Small)
- Tighter spacing
- 2G container padding (16px)
- Fits more information in limited space

**Important Note:** Using compact density on desktop is possible but not recommended as it can lead to a poorer user experience.

---

## Responsive Layout Grid

The layout grid consists of three elements:

1. **Columns** - Areas where content is placed
2. **Gutters** - Spaces between columns
3. **Padding** - Space around container edges

### Columns

The starting point for desktop designs is a **12-column layout grid**. Content is placed in columns, and column width is flexible based on:
- Container width
- Number of columns
- Gutter width
- Padding

**Rule - Page Layout Columns:**
- Use **12 columns** for desktop designs
- Use **4, 6, or 8 columns** for smaller displays (mobile/tablet)

**Best Practice:** Components often span multiple columns but should start and end at column boundaries (not in gutters).

### Gutters

Gutters are the spaces between columns that separate content.

**Rule - Gutters:**
- Use **3G (24px)** gutters between columns
- This applies regardless of layout density or number of columns
- Gutters remain constant for consistency

While components often span across gutters, as a general rule they should not start or end within gutters.

### Container Padding

Padding creates space around a container's content, inside the container's borders.

**Rule - Container Padding:**

| Density | Padding |
|---------|---------|
| **Standard** | 3G (24px) all sides |
| **Compact** | 2G (16px) all sides |

By default, do not position components within container padding.

---

## Column Width Calculation

Column width within a container is calculated based on:
- Container width
- Number of columns
- Gutter width
- Container padding

### Formula

```
Column Width = (Container Width - (Container Padding + Total Gutter Width)) / Number of Columns

Where:
- Container Padding = Left Padding + Right Padding
- Total Gutter Width = Gutter Width × (Number of Columns - 1)
```

### Example

**12-column container, 1200px wide, Standard density:**

```
Container Padding = 24px + 24px = 48px
Total Gutter Width = 24px × (12 - 1) = 24px × 11 = 264px
Column Width = (1200px - (48px + 264px)) / 12
Column Width = (1200px - 312px) / 12
Column Width = 888px / 12 = 74px
```

---

## Component Density Sizing

Different component types use different sizes based on layout density:

### Input Components

**Examples:** Text fields, dropdowns, date pickers

| Density | Size | Height |
|---------|------|--------|
| Standard | Medium | 56px |
| Compact | Small | 40px |

### Group Components

**Examples:** Radio groups, checkbox groups

| Density | Size | Height per Item |
|---------|------|----------------|
| Standard | Medium | 40px |
| Compact | Small | 32px |

### Buttons

#### Outlined Buttons

| Density | Size | Height |
|---------|------|--------|
| Standard | X-Large | 48px |
| Compact | Large | 40px |

#### CTA (Call-to-Action) Buttons

| Density | Size | Height |
|---------|------|--------|
| Standard | X-Large | 48px |
| Compact | Large | 40px |

---

## Fieldsets

A **fieldset** is a non-visual layout component that groups related components within a container (like a card).

### Purpose

Fieldsets provide vertical separation between groups of form elements in a consistent fashion.

**Rule - Using Fieldsets:**
- Use fieldsets to group related components that are located adjacently
- Fieldsets occupy the full width of their parent container
- Fieldsets stack vertically
- Fieldsets have no padding (use same column layout as container)

### Fieldset Spacing

| Element | Bottom Margin | Notes |
|---------|--------------|-------|
| **Default fieldset** | 1G (8px) | Standard bottom margin |
| **Last fieldset with error** | 3G (24px) | When last component shows error |

### Nested Fieldsets

While fieldsets can be nested (grouping multiple fieldsets inside another fieldset), **use this technique with care** to avoid excessive vertical separation.

---

## Component Spacing (Padding & Margins)

Component spacing uses two elements following the CSS Box Model:

1. **Padding** - Space inside the component (part of the component)
2. **Margins** - Space outside the component (between components)

### Standard Density Spacing

| Component Type | Padding | Margin (Bottom) |
|---------------|---------|----------------|
| **Card** | Top/Left/Right: 3G (24px)<br>Bottom: 4G (32px)* | Bottom: 3G (24px) |
| **Input component** (e.g., text field) | Bottom: 2G (16px) | Bottom: 1G (8px) |
| **Input component with error** | Bottom: 2G×N† (16px×N) | Bottom: 1G (8px) |
| **Group component** (e.g., radio group) | Bottom: 2G (16px) | Bottom: 1G (8px) |
| **Fieldset** | None | Bottom: 1G (8px) |
| **Last fieldset with error** | None | Bottom: 3G (24px) |

\* Includes bottom padding and margin of last component
† N = number of error lines; first error line displayed in bottom padding

### Vertical Spacing Behavior

**Without Error:**
- Component bottom padding (2G) + bottom margin (1G) = **3G total vertical spacing**

**With Error:**
- First error line uses existing 2G bottom padding
- Additional error lines increase bottom padding by 2G each
- Bottom margin remains 1G
- **Total spacing = 1G** (reduced spacing when error shown)

### Visual Spacing Example

```
┌─────────────────────────────┐
│  Component Content          │
│                             │  ← 2G bottom padding
│  [Error message if any]    │
└─────────────────────────────┘
                               ← 1G bottom margin
┌─────────────────────────────┐
│  Next Component             │
```

---

## Responsive Layout Patterns

### Adapting to Different Screen Sizes

When adapting responsive designs for different screen sizes:

#### Option 1: Adjust Column Count
Use fewer page columns but adjust component widths to span more columns.

**Example:**
- Desktop (12 columns): Component spans 4 columns
- Mobile (4 columns): Component spans 2 columns (same relative size)

#### Option 2: Transform Layout Orientation
Transform horizontal layouts to vertical layouts for narrow screens.

**Example:**
- Desktop: 3 fields side-by-side (each spans 4 of 12 columns)
- Mobile: 3 fields stacked vertically (each spans 4 of 4 columns = full width)

**Recommended:** Combine both approaches - use fewer page columns and stack fields vertically for mobile.

### Breakpoints

While specific breakpoint values may vary by project, consider these general guidelines:

| Screen Size | Columns | Container Padding | Density |
|------------|---------|-------------------|---------|
| Desktop (≥1200px) | 12 | 3G | Standard |
| Tablet (768-1199px) | 8 | 3G or 2G | Standard or Compact |
| Mobile (< 768px) | 4 | 2G | Compact |

---

## Golden Form Examples

### Standard Golden Form

**Characteristics:**
- 12-column grid
- 3G (24px) gutters
- 3G (24px) container padding
- Medium input components (56px height)
- X-Large buttons (48px height)

**Use case:** Desktop applications with comfortable spacing

### Compact Golden Form

**Characteristics:**
- 12-column grid (can use fewer)
- 3G (24px) gutters (same as standard)
- 2G (16px) container padding
- Small input components (40px height)
- Large buttons (40px height)

**Use case:** Mobile devices or dense desktop UIs

---

## Layout Best Practices

### General Guidelines

1. **Use the grid** - Align components to column boundaries
2. **Maintain consistent gutters** - Always 3G between columns
3. **Respect container padding** - Don't place components in padding areas
4. **Group related fields** - Use fieldsets for logical grouping
5. **Maintain vertical rhythm** - Use consistent spacing (1G, 2G, 3G)
6. **Consider density** - Choose appropriate density for use case
7. **Test responsiveness** - Ensure layouts work at all screen sizes

### Spacing Hierarchy

Use consistent spacing increments:
- **1G (8px)** - Tight spacing (within components, between related items)
- **2G (16px)** - Medium spacing (between form elements, compact padding)
- **3G (24px)** - Generous spacing (between sections, standard padding, gutters)
- **4G (32px)** - Large spacing (between major sections)

### Form Layout

1. **Single column preferred** for forms (easier to complete)
2. **Group related fields** visually with fieldsets
3. **Align labels** above input fields (left-aligned)
4. **Stack fields vertically** with 3G spacing
5. **Place primary action** (CTA) at bottom right
6. **Place secondary actions** to left of primary action

### Card Layout

1. **Use 3G padding** (standard) or 2G (compact)
2. **Include card title** using H2 text style
3. **Separate sections** with fieldsets or visual dividers
4. **Maintain consistent margins** between cards (3G)

---

## Common Layout Patterns

### Form in Card

```
┌─────────────────────────────────────┐
│ 3G padding                         │
│  ┌─────────────────────────────┐  │
│  │ Card Title (H2)             │  │
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │ ← Fieldset 1
│  │ Label                       │  │
│  │ [Input Field ]              │  │
│  │ Label                       │  │
│  │ [Input Field ]              │  │
│  └─────────────────────────────┘  │
│                               1G   │
│  ┌─────────────────────────────┐  │ ← Fieldset 2
│  │ Label                       │  │
│  │ [Input Field ]              │  │
│  └─────────────────────────────┘  │
│                                    │
│  [ Cancel ]     [ Save ]          │ ← Buttons
│                                    │
│ 4G bottom padding                  │
└─────────────────────────────────────┘
```

### Multi-Column Layout

Use for side-by-side fields (e.g., City, State, Postal Code):

```
┌──────────────────────────────────────────────┐
│  Label 1        Label 2         Label 3      │
│  [Input 1]      [Input 2]       [Input 3]    │
│  ← 4 cols →     ← 4 cols →      ← 4 cols →   │
│              3G gutter                        │
└──────────────────────────────────────────────┘
```

---

## Implementation Tips

1. **Use CSS Grid or Flexbox** for responsive layouts
2. **Define spacing variables** based on grid units
3. **Create reusable fieldset components**
4. **Build responsive utilities** for column spanning
5. **Test at multiple viewport sizes**

### CSS Example

```css
:root {
  --grid-unit: 8px;
  --spacing-1g: 8px;
  --spacing-2g: 16px;
  --spacing-3g: 24px;
  --spacing-4g: 32px;
  --gutter: 24px;
  --container-padding-standard: 24px;
  --container-padding-compact: 16px;
}

.card {
  padding: var(--spacing-3g);
  margin-bottom: var(--spacing-3g);
}

.fieldset {
  margin-bottom: var(--spacing-1g);
}

.input-field {
  padding-bottom: var(--spacing-2g);
  margin-bottom: var(--spacing-1g);
}
```

---

## References

- [Material Design - Responsive Layout Grid](https://material.io/design/layout/responsive-layout-grid.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
- See also: [05-components.md](05-components.md) for component-specific guidelines
- See also: [07-design-tokens.md](07-design-tokens.md) for spacing tokens
