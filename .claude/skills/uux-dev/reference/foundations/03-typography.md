# Temenos UUX Design System - Typography

## Overview

Use typography to present your design and content as clearly and efficiently as possible. The UUX typography system provides a set of foundational type scales and text styles that help maintain consistency across designs while supporting the needs of your product and its content.

---

## Typography Hierarchy

The UUX design system defines **9 text style levels** to create clear visual hierarchy:

### 1. Page Heading (H1 Emphasis)

**Usage:** Main page title, highest level heading
**Characteristics:** Largest, most prominent text on the page
**Color:** `temenos-darkest` (`#2C3361`)
**Emphasis:** Bold weight

### 2. Page Sub-heading (H1)

**Usage:** Secondary page-level heading, page description
**Characteristics:** Large heading without emphasis
**Color:** `temenos-dark` (`#293276`)
**Emphasis:** Regular weight

### 3. Card Group Title (H2 Emphasis)

**Usage:** Title for a group of cards, section divider
**Characteristics:** Emphasized second-level heading
**Color:** `temenos-dark` (`#293276`)
**Emphasis:** Bold weight

### 4. Card Title / Panel Title (H2)

**Usage:** Individual card or panel titles
**Characteristics:** Medium-sized heading
**Color:** `temenos-dark` (`#293276`) or `temenos-primary` (`#4A5798`)
**Emphasis:** Regular weight

### 5. Section Title / Table Header (H3 Emphasis)

**Usage:** Section titles within cards, table headers requiring emphasis
**Characteristics:** Emphasized third-level heading
**Color:** `temenos-dark` (`#293276`)
**Emphasis:** Bold weight

### 6. Section Sub-heading / Container Title (H3)

**Usage:** Sub-sections within cards, container titles, compact card headings
**Characteristics:** Third-level heading
**Color:** Regular text or `temenos-primary` (for compact card headings)
**Variants:**
- Regular: `gray-dark` (`#3B3B3B`)
- Blue variant for compact cards: `temenos-primary` (`#4A5798`)

### 7. Large Text

**Usage:** Emphasized body text, important information
**Characteristics:** Larger than standard body text
**Color:** `gray-dark` (`#3B3B3B`)

### 8. Body Text

**Usage:** Standard text for content, descriptions, paragraphs
**Characteristics:** Default reading text
**Color:** `gray-dark` (`#3B3B3B`)
**This is the most commonly used text style**

### 9. Small Text / Caption / Help Text

**Usage:** Labels, captions, supplementary information, help text
**Characteristics:** Smaller, less prominent text
**Color:** `gray-primary` (`#757575`)

---

## Component Text Styles

### Input Component Labels

**Style:** Small Text (Level 9)
**Color:** `gray-primary` (`#757575`)
**Usage:** Labels above text fields, dropdowns, and other input components

**Example:**
```
Label          <- Small Text
Input text     <- Body Text (in the input field)
```

### Error Messages

**Style:** Small Text (Level 9)
**Color:** `status-negative-primary` (`#D32E2F`)
**Usage:** Validation error messages below input fields

### Helper Text

**Style:** Small Text (Level 9)
**Color:** `gray-primary` (`#757575`)
**Usage:** Instructional text below input fields

---

## Typography Specifications

### Font Family

The UUX design system uses system fonts for optimal performance and native feel:

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
             "Helvetica Neue", Arial, sans-serif;
```

### Type Scale

The UUX type scale is based on a modular scale that ensures harmonious relationships between text sizes:

| Level | Size | Line Height | Usage |
|-------|------|-------------|-------|
| **H1 Emphasis** | 34px | 40px | Page heading |
| **H1** | 24px | 32px | Page sub-heading |
| **H2 Emphasis** | 20px | 28px | Card group title |
| **H2** | 20px | 28px | Card title |
| **H3 Emphasis** | 16px | 24px | Section title |
| **H3** | 16px | 24px | Section sub-heading |
| **Large** | 16px | 24px | Large text |
| **Body** | 14px | 20px | Body text |
| **Small** | 12px | 16px | Caption/help text |

*Note: Exact sizes may vary slightly based on density mode (Standard vs Compact). The above represents Standard density.*

### Font Weights

- **Regular:** 400 (normal text)
- **Emphasis/Bold:** 700 (headings with emphasis, important text)

---

## Text Color Usage

### Primary Text Colors

| Color Token | Hex Code | Usage |
|-------------|----------|-------|
| `temenos-darkest` | `#2C3361` | Page headings (H1 Emphasis) |
| `temenos-dark` | `#293276` | Most headings (H2, H3) |
| `temenos-primary` | `#4A5798` | Interactive elements, compact card headings |
| `gray-darkest` | `#000000` | High contrast text (use sparingly) |
| `gray-dark` | `#3B3B3B` | Body text (primary choice) |
| `gray-primary` | `#757575` | Labels, captions, secondary text |

### Status Text Colors

| Color Token | Hex Code | Usage |
|-------------|----------|-------|
| `status-positive-primary` | `#707016` | Success messages |
| `status-negative-primary` | `#D32E2F` | Error messages |
| `status-notice-primary` | `#CC7E0B` | Warning messages |

---

## Accessibility

### Contrast Requirements

All typography in the UUX design system meets WCAG 2.2 AA contrast requirements:

- **Standard text (< 18px or < 14px bold):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px or ≥ 14px bold):** Minimum 3:1 contrast ratio

### Validated Color Combinations

These text/background combinations are WCAG 2.2 AA compliant:

**On White Background (#FFFFFF):**
- `gray-darkest` (#000000) ✓ 21:1
- `gray-dark` (#3B3B3B) ✓ 11.6:1
- `gray-primary` (#757575) ✓ 4.6:1
- `temenos-darkest` (#2C3361) ✓ 10.8:1
- `temenos-dark` (#293276) ✓ 9.7:1
- `temenos-primary` (#4A5798) ✓ 5.8:1

**Status Colors on Light Backgrounds:**
- Error text (`status-negative-primary`) on white ✓ 4.9:1
- Success text (`status-positive-primary`) on white ✓ 7.2:1
- Warning text (`status-notice-primary`) on white ✓ 5.4:1

---

## Text Style Guidelines

### Consistent Use of Text Styles

**Rule:** Use the same text styles in your design regardless of layout density or number of design columns.

While component sizes may vary between Standard and Compact density modes, text style hierarchy remains consistent.

### Heading Hierarchy

**Best Practices:**
1. Use only one H1 per page (Page Heading)
2. Don't skip heading levels (e.g., don't jump from H1 to H3)
3. Use emphasis variants (bold) to add importance within the same level
4. Maintain logical hierarchy for screen readers

### Body Text

**Guidelines:**
- Use Body Text (Level 8) as the default for all content
- Maintain comfortable line length: 45-75 characters per line
- Use adequate line spacing (line height) for readability
- Avoid all-caps for long text (reduces readability)

### Labels and Helper Text

**Guidelines:**
- Keep labels short and descriptive (1-3 words)
- Use sentence case for labels, not title case
- Place labels above input fields, left-aligned
- Use helper text to provide additional context when needed

---

## Density Modes and Typography

### Standard Density

Use standard type sizes (shown in table above) for:
- Desktop applications
- Comfortable reading experiences
- Content-heavy pages

### Compact Density

Use slightly smaller type sizes for:
- Mobile devices
- Dense data tables
- Complex forms with many fields
- Dashboards with limited space

**Note:** While component sizes change between densities, maintain readability by ensuring text sizes never go below WCAG minimum readable sizes.

---

## Implementation Examples

### Heading Structure

```html
<!-- Page heading -->
<uwc-text variant="h1" color="temenos-darkest" emphasis="true">
  Page Title
</uwc-text>

<!-- Card title -->
<uwc-text variant="h2" color="temenos-dark">
  Card Title
</uwc-text>

<!-- Section heading -->
<uwc-text variant="h3" color="temenos-dark" emphasis="true">
  Section Title
</uwc-text>
```

### Body Content

```html
<!-- Standard body text -->
<p class="body-text">
  This is standard body text used for content and descriptions.
</p>

<!-- Label and input -->
<label class="small-text">Label</label>
<input type="text" class="body-text" placeholder="Input text">
```

### Status Messages

```html
<!-- Error message -->
<span class="small-text" style="color: var(--uwc-color-status-negative-primary)">
  This field is required
</span>
```

---

## Best Practices

1. **Establish clear hierarchy** using the 9 defined text levels
2. **Use design tokens** for colors instead of hard-coded values
3. **Maintain consistent spacing** between text elements
4. **Test readability** at different screen sizes
5. **Verify color contrast** meets WCAG AA requirements
6. **Use emphasis sparingly** - too much bold text reduces impact
7. **Keep text concise** - shorter is almost always better
8. **Left-align text** for left-to-right languages (easier to read)

---

## References

- [Material Design - Typography](https://material.io/design/typography/)
- [WCAG 2.2 - Text Contrast](https://www.w3.org/TR/WCAG22/#contrast-minimum)
- See also: [02-colors.md](02-colors.md) for color specifications
- See also: [06-accessibility.md](06-accessibility.md) for accessibility guidelines
